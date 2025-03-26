import { supabase } from '@/lib/supabase';

export interface WalletData {
  balance: number;
  currency: string;
}

export interface PaymentMethod {
  id: string;
  type: string;
  details: any;
  is_default: boolean;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  order_id?: string;
  created_at: string;
}

// Cache management
const CACHE_DURATION = 30000; // 30 seconds
interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const cache = {
  walletData: null as CacheItem<WalletData | null> | null,
  paymentMethods: null as CacheItem<PaymentMethod[]> | null,
  transactions: null as CacheItem<Transaction[]> | null,
};

function isCacheValid<T>(cacheItem: CacheItem<T> | null): boolean {
  if (!cacheItem) return false;
  return Date.now() - cacheItem.timestamp < CACHE_DURATION;
}

// Fetch wallet data for the current user
export async function getWalletData(): Promise<WalletData | null> {
  // Return from cache if valid
  if (isCacheValid(cache.walletData)) {
    return cache.walletData!.data;
  }

  try {
    // First try to fetch from API
    const response = await fetch('/api/users/wallet', { 
      headers: { 'Cache-Control': 'no-store' } 
    });
    
    if (response.ok) {
      const data = await response.json();
      cache.walletData = { data: data.data, timestamp: Date.now() };
      return data.data;
    }
  } catch (error) {
    console.warn('API fetch failed, falling back to Supabase');
  }

  // Fallback to direct Supabase query
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const { data, error } = await supabase
    .from('wallet')
    .select('*')
    .eq('user_id', session.user.id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching wallet:', error);
    return null;
  }

  cache.walletData = { data, timestamp: Date.now() };
  return data;
}

// Fetch payment methods for the current user
export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  // Return from cache if valid
  if (isCacheValid(cache.paymentMethods)) {
    return cache.paymentMethods!.data;
  }

  try {
    // First try to fetch from API
    const response = await fetch('/api/users/payment-methods', { 
      headers: { 'Cache-Control': 'no-store' } 
    });
    
    if (response.ok) {
      const data = await response.json();
      cache.paymentMethods = { data: data.data, timestamp: Date.now() };
      return data.data;
    }
  } catch (error) {
    console.warn('API fetch failed, falling back to Supabase');
  }

  // Fallback to direct Supabase query
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return [];

  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('user_id', session.user.id);

  if (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }

  const result = data || [];
  cache.paymentMethods = { data: result, timestamp: Date.now() };
  return result;
}

// Fetch recent transactions for the current user
export async function getRecentTransactions(limit = 5): Promise<Transaction[]> {
  // Return from cache if valid
  if (isCacheValid(cache.transactions)) {
    return cache.transactions!.data;
  }

  try {
    // First try to fetch from API
    const response = await fetch(`/api/users/transactions?limit=${limit}`, { 
      headers: { 'Cache-Control': 'no-store' } 
    });
    
    if (response.ok) {
      const data = await response.json();
      cache.transactions = { data: data.data, timestamp: Date.now() };
      return data.data;
    }
  } catch (error) {
    console.warn('API fetch failed, falling back to Supabase');
  }

  // Fallback to direct Supabase query
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return [];

  const { data, error } = await supabase
    .from('wallet_transactions')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }

  const result = data || [];
  cache.transactions = { data: result, timestamp: Date.now() };
  return result;
}

// Function to clear cache when needed (e.g., after transactions)
export function invalidateWalletCache(): void {
  cache.walletData = null;
  cache.paymentMethods = null;
  cache.transactions = null;
}