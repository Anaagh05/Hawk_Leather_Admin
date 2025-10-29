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
import { useOrders } from '../context/OrderContext';
import { Loader2, Package, User, MapPin, Calendar } from 'lucide-react';

export function ChangeStatusForm() {
  const { orders, updateOrderStatus, loading } = useOrders();
  const [orderId, setOrderId] = useState('');
  const [newStatus, setNewStatus] = useState<Order['orderStatus']>('processing');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleOrderIdChange = (value: string) => {
    setOrderId(value);
    
    // Find and display order details
    const order = orders.find(o => o.id.toLowerCase().includes(value.toLowerCase()));
    setSelectedOrder(order || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOrder) {
      toast.error('Order not found. Please check the Order ID.');
      return;
    }

    if (selectedOrder.orderStatus === newStatus) {
      toast.error(`Order is already in ${newStatus} status.`);
      return;
    }

    try {
      await updateOrderStatus(selectedOrder.id, newStatus);
      setOrderId('');
      setNewStatus('processing');
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 max-w-2xl">
        <h2 className="mb-6 text-amber-900">Change Order Status</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orderId">Order ID</Label>
            <Input
              id="orderId"
              value={orderId}
              onChange={(e) => handleOrderIdChange(e.target.value)}
              placeholder="Enter Order ID or search..."
              required
            />
            {orders.length > 0 && (
              <p className="text-sm text-gray-500">
                Total {orders.length} orders available. Try searching with partial ID.
              </p>
            )}
          </div>

          {/* Order Preview */}
          {selectedOrder && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-4 bg-amber-50 border-amber-200">
                <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Order Preview
                </h3>
                
                <div className="space-y-3 text-sm">
                  {/* Order ID and Status */}
                  <div className="flex justify-between items-center pb-2 border-b border-amber-200">
                    <div>
                      <p className="text-gray-500">Order ID</p>
                      <p className="font-mono font-semibold">#{selectedOrder.id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500">Current Status</p>
                      <p className="font-semibold capitalize">{selectedOrder.orderStatus}</p>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 mt-0.5 text-gray-500" />
                    <div>
                      <p className="font-medium">{selectedOrder.userId.name}</p>
                      <p className="text-gray-600">{selectedOrder.userId.email}</p>
                      <p className="text-gray-600">{selectedOrder.userId.phone}</p>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-gray-500" />
                    <div>
                      <p className="text-gray-600">
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}
                      </p>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-amber-200">
                    <div>
                      <p className="text-gray-500">Items</p>
                      <p className="font-medium">{selectedOrder.items.length} products</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total Amount</p>
                      <p className="font-medium text-green-700">₹{selectedOrder.totalAmount}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Payment Method</p>
                      <p className="font-medium uppercase">{selectedOrder.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Payment Status</p>
                      <p className="font-medium capitalize">{selectedOrder.paymentStatus}</p>
                    </div>
                  </div>

                  {/* Order Date */}
                  <div className="flex items-center gap-2 pt-2 border-t border-amber-200">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-gray-500">Order Placed</p>
                      <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          <div className="space-y-2">
            <Label htmlFor="status">New Status</Label>
            <Select
              value={newStatus}
              onValueChange={(value: Order['orderStatus']) => setNewStatus(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-amber-700 hover:bg-amber-800"
            disabled={loading || !selectedOrder}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Status'
            )}
          </Button>
        </form>
      </Card>
    </motion.div>
  );
}