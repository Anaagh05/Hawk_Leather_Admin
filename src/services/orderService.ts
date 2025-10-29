import { Order, OrdersResponse } from '../types';

// @ts-expect-error: VITE_API_BASE_URL is provided by Vite at build time
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Transform backend order response to frontend Order type
const transformBackendOrder = (backendOrder: any): Order | null => {
  if (!backendOrder || !backendOrder._id) return null;
  
  return {
    id: backendOrder._id,
    userId: {
      id: backendOrder.userId?._id || '',
      name: backendOrder.userId?.userName || 'Unknown',
      email: backendOrder.userId?.userEmail || '',
      phone: backendOrder.userId?.phoneNumber || 0
    },
    items: (backendOrder.items || []).map((item: any) => ({
      id: item?._id || '',
      productId: {
        id: item?.productId?._id || '',
        categoryName: item?.productId?.categoryName || '',
        itemName: item?.productId?.itemName || '',
        itemImageUrl: item?.productId?.itemImageUrl || ''
      },
      itemName: item?.itemName || '',
      itemPrice: item?.itemPrice || 0,
      quantity: item?.quantity || 0
    })),
    shippingAddress: {
      street: backendOrder.shippingAddress?.street || '',
      city: backendOrder.shippingAddress?.city || '',
      state: backendOrder.shippingAddress?.state || '',
      pincode: backendOrder.shippingAddress?.pincode || '',
      phone: backendOrder.shippingAddress?.phone || ''
    },
    totalAmount: backendOrder.totalAmount || 0,
    orderStatus: backendOrder.orderStatus as Order['orderStatus'] || 'processing',
    paymentStatus: backendOrder.paymentStatus || 'pending',
    paymentMethod: backendOrder.paymentMethod || 'cod',
    createdAt: backendOrder.createdAt || new Date().toISOString(),
    updatedAt: backendOrder.updatedAt || new Date().toISOString()
  };
};

export const orderService = {
  // Get all orders with optional status filter
  getAllOrders: async (status?: Order['orderStatus']): Promise<OrdersResponse> => {
    try {
      const url = status 
        ? `${API_BASE_URL}/orders/all?status=${status}`
        : `${API_BASE_URL}/orders/all`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch orders');
      }

      return {
        orders: (result.data.orders || []).map(transformBackendOrder).filter((order): order is Order => order !== null),
        pagination: result.data.pagination,
        summary: result.data.summary,
        totalRevenue: result.data.totalRevenue
      };
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId: string, newStatus: Order['orderStatus']): Promise<Order> => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to update order status');
      }

      const transformedOrder = transformBackendOrder(result.data);
      if (!transformedOrder) {
        throw new Error('Order data is missing or invalid');
      }
      return transformedOrder;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
};