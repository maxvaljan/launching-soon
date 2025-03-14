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

// Fetch wallet data for the current user
export async function getWalletData(): Promise<WalletData | null> {
  try {
    // First try to fetch from API
    const response = await fetch('/api/users/wallet');
    
    if (response.ok) {
      const data = await response.json();
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

  return data;
}

// Fetch payment methods for the current user
export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  try {
    // First try to fetch from API
    const response = await fetch('/api/users/payment-methods');
    
    if (response.ok) {
      const data = await response.json();
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

  return data || [];
}

// Fetch recent transactions for the current user
export async function getRecentTransactions(limit = 5): Promise<Transaction[]> {
  try {
    // First try to fetch from API
    const response = await fetch(`/api/users/transactions?limit=${limit}`);
    
    if (response.ok) {
      const data = await response.json();
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

  return data || [];
}