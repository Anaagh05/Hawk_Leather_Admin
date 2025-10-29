import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order, OrdersResponse, OrderSummary } from '../types';
import { orderService } from '../services/orderService';
import { toast } from 'sonner';

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
  summary: OrderSummary | null;
  totalRevenue: number;
  fetchOrders: (status?: Order['orderStatus']) => Promise<void>;
  updateOrderStatus: (orderId: string, newStatus: Order['orderStatus']) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<OrderSummary | null>(null);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);

  // Fetch all orders on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async (status?: Order['orderStatus']) => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getAllOrders(status);
      setOrders(response.orders);
      setSummary(response.summary);
      setTotalRevenue(response.totalRevenue);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch orders';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['orderStatus']) => {
    try {
      setLoading(true);
      setError(null);
      const updatedOrder = await orderService.updateOrderStatus(orderId, newStatus);
      
      // Update the order in the list
      setOrders(prevOrders => 
        prevOrders.map(order => order.id === orderId ? updatedOrder : order)
      );
      
      // Refetch to update summary and revenue
      await fetchOrders();
      
      toast.success(`Order status updated to ${newStatus}!`);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update order status';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <OrderContext.Provider 
      value={{ 
        orders, 
        loading, 
        error, 
        summary,
        totalRevenue,
        fetchOrders, 
        updateOrderStatus 
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};