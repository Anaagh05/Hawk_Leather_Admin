import { useState } from 'react';
import React from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Order } from '../types';
import { toast } from 'sonner';
import { motion } from 'motion/react';

interface ChangeStatusFormProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, newStatus: Order['status']) => void;
}

export function ChangeStatusForm({ orders, onUpdateStatus }: ChangeStatusFormProps) {
  const [orderId, setOrderId] = useState('');
  const [newStatus, setNewStatus] = useState<Order['status']>('processing');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const order = orders.find(o => o.id === orderId.toUpperCase());
    
    if (!order) {
      toast.error('Order not found. Please check the Order ID.');
      return;
    }

    onUpdateStatus(orderId.toUpperCase(), newStatus);
    toast.success(`Order ${orderId.toUpperCase()} status updated to ${newStatus}!`);
    
    setOrderId('');
    setNewStatus('processing');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 max-w-md">
        <h2 className="mb-6 text-amber-900">Change Order Status</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orderId">Order ID</Label>
            <Input
              id="orderId"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter Order ID (e.g., ORD001)"
              required
            />
            <p className="text-sm text-gray-500">Available orders: {orders.map(o => o.id).join(', ')}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">New Status</Label>
            <Select
              value={newStatus}
              onValueChange={(value: Order['status']) => setNewStatus(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipping">Shipping</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full bg-amber-700 hover:bg-amber-800">
            Update Status
          </Button>
        </form>
      </Card>
    </motion.div>
  );
}