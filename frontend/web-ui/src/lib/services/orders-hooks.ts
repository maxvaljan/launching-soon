// React Query hooks for Orders API
import { 
  useQuery, 
  useMutation, 
  useQueryClient, 
  UseQueryOptions,
  UseMutationOptions
} from '@tanstack/react-query';
import { ordersService, Order, OrderCreateRequest, OrderStatus } from './orders';
import { ApiResponse } from '../api';

// Query keys for React Query
export const orderKeys = {
  all: ['orders'] as const,
  userOrders: () => [...orderKeys.all, 'user'] as const,
  userOrdersList: (page: number, limit: number) => [...orderKeys.userOrders(), { page, limit }] as const,
  detail: (id: string) => [...orderKeys.all, 'detail', id] as const,
  status: (id: string) => [...orderKeys.all, 'status', id] as const,
  estimate: () => [...orderKeys.all, 'estimate'] as const,
  availableOrders: (lat: number, lng: number, radius: number) => 
    [...orderKeys.all, 'available', { lat, lng, radius }] as const,
};

// User Orders hooks
export function useUserOrders(
  page: number = 1, 
  limit: number = 10, 
  options?: UseQueryOptions<ApiResponse<{ orders: Order[]; total: number; }>, Error>
) {
  return useQuery<ApiResponse<{ orders: Order[]; total: number; }>, Error>({
    queryKey: orderKeys.userOrdersList(page, limit),
    queryFn: () => ordersService.getUserOrders(page, limit),
    ...options,
  });
}

// Order Detail hook
export function useOrderDetail(
  orderId: string,
  options?: UseQueryOptions<ApiResponse<Order>, Error>
) {
  return useQuery<ApiResponse<Order>, Error>({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => ordersService.getOrder(orderId),
    enabled: !!orderId,
    ...options,
  });
}

// Order Status hook
export function useOrderStatus(
  orderId: string,
  options?: UseQueryOptions<ApiResponse<{
    status: OrderStatus;
    driverLocation?: {
      latitude: number;
      longitude: number;
      updatedAt: string;
    };
    estimatedArrival?: string;
  }>, Error>
) {
  return useQuery<ApiResponse<{
    status: OrderStatus;
    driverLocation?: {
      latitude: number;
      longitude: number;
      updatedAt: string;
    };
    estimatedArrival?: string;
  }>, Error>({
    queryKey: orderKeys.status(orderId),
    queryFn: () => ordersService.getOrderStatus(orderId),
    enabled: !!orderId,
    // Polling for real-time updates
    refetchInterval: (query) => 
      (query.state.data?.data?.status === OrderStatus.IN_TRANSIT) ? 15000 : false,
    ...options,
  });
}

// Create Order hook
export function useCreateOrder(
  options?: UseMutationOptions<ApiResponse<Order>, Error, OrderCreateRequest>
) {
  const queryClient = useQueryClient();
  
  return useMutation<ApiResponse<Order>, Error, OrderCreateRequest>({
    mutationFn: (orderData) => ordersService.createOrder(orderData),
    onSuccess: (data) => {
      // Invalidate user orders list
      queryClient.invalidateQueries({ queryKey: orderKeys.userOrders() });
      
      // Add the new order to the cache
      if (data.success && data.data) {
        queryClient.setQueryData(orderKeys.detail(data.data.id), data);
      }
    },
    ...options,
  });
}

// Cancel Order hook
export function useCancelOrder(
  options?: UseMutationOptions<ApiResponse<Order>, Error, { orderId: string; reason: string }>
) {
  const queryClient = useQueryClient();
  
  return useMutation<ApiResponse<Order>, Error, { orderId: string; reason: string }>({
    mutationFn: ({ orderId, reason }) => ordersService.cancelOrder(orderId, reason),
    onSuccess: (data, variables) => {
      // Invalidate affected queries
      queryClient.invalidateQueries({ queryKey: orderKeys.userOrders() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.orderId) });
      queryClient.invalidateQueries({ queryKey: orderKeys.status(variables.orderId) });
    },
    ...options,
  });
}

// Get Order Estimate hook
export function useOrderEstimate(
  options?: UseMutationOptions<
    ApiResponse<{
      estimatedPrice: number;
      currency: string;
      distance: number;
      duration: number;
    }>, 
    Error, 
    Parameters<typeof ordersService.getOrderEstimate>
  >
) {
  return useMutation<
    ApiResponse<{
      estimatedPrice: number;
      currency: string;
      distance: number;
      duration: number;
    }>,
    Error,
    Parameters<typeof ordersService.getOrderEstimate>
  >({
    mutationFn: (params) => ordersService.getOrderEstimate(...params),
    ...options,
  });
}

// Driver Hooks

// Get Available Orders hook
export function useAvailableOrders(
  latitude: number,
  longitude: number,
  radius: number = 10,
  options?: UseQueryOptions<ApiResponse<Order[]>, Error>
) {
  return useQuery<ApiResponse<Order[]>, Error>({
    queryKey: orderKeys.availableOrders(latitude, longitude, radius),
    queryFn: () => ordersService.getAvailableOrders(latitude, longitude, radius),
    enabled: !!latitude && !!longitude,
    // Refresh available orders every 30 seconds
    refetchInterval: 30000,
    ...options,
  });
}

// Accept Order hook
export function useAcceptOrder(
  options?: UseMutationOptions<ApiResponse<Order>, Error, string>
) {
  const queryClient = useQueryClient();
  
  return useMutation<ApiResponse<Order>, Error, string>({
    mutationFn: (orderId) => ordersService.acceptOrder(orderId),
    onSuccess: (data, orderId) => {
      // Invalidate affected queries
      queryClient.invalidateQueries({ 
        queryKey: orderKeys.availableOrders(0, 0, 0),
        refetchType: 'all'
      });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
    },
    ...options,
  });
}

// Update Order Status hook
export function useUpdateOrderStatus(
  options?: UseMutationOptions<
    ApiResponse<Order>, 
    Error, 
    { 
      orderId: string; 
      status: OrderStatus; 
      location?: { latitude: number; longitude: number } 
    }
  >
) {
  const queryClient = useQueryClient();
  
  return useMutation<
    ApiResponse<Order>, 
    Error, 
    { 
      orderId: string; 
      status: OrderStatus; 
      location?: { latitude: number; longitude: number } 
    }
  >({
    mutationFn: ({ orderId, status, location }) => 
      ordersService.updateOrderStatus(orderId, status, location),
    onSuccess: (data, variables) => {
      // Invalidate affected queries
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.orderId) });
      queryClient.invalidateQueries({ queryKey: orderKeys.status(variables.orderId) });
    },
    ...options,
  });
}

// Report Issue hook
export function useReportIssue(
  options?: UseMutationOptions<
    ApiResponse<{ issueId: string }>,
    Error,
    {
      orderId: string;
      issueType: string;
      description: string;
      attachmentUrls?: string[];
    }
  >
) {
  return useMutation<
    ApiResponse<{ issueId: string }>,
    Error,
    {
      orderId: string;
      issueType: string;
      description: string;
      attachmentUrls?: string[];
    }
  >({
    mutationFn: ({ orderId, issueType, description, attachmentUrls }) =>
      ordersService.reportIssue(orderId, issueType, description, attachmentUrls),
    ...options,
  });
}