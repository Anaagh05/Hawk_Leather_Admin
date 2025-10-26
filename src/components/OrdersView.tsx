import { useState } from 'react';
import { Order } from '../types';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';
import { motion } from 'motion/react';
import React from 'react';


interface OrdersViewProps {
  orders: Order[];
}

const ITEMS_PER_PAGE = 4;

export function OrdersView({ orders }: OrdersViewProps) {
  const [currentPages, setCurrentPages] = useState({
    processing: 1,
    shipping: 1,
    delivered: 1,
    cancelled: 1
  });

  const getStatusBadgeVariant = (status: Order['status']) => {
    switch (status) {
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipping':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
    }
  };

  const filterOrdersByStatus = (status: Order['status']) => {
    return orders.filter(order => order.status === status);
  };

  const paginateOrders = (orders: Order[], page: number) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return orders.slice(startIndex, endIndex);
  };

  const getTotalPages = (totalItems: number) => {
    return Math.ceil(totalItems / ITEMS_PER_PAGE);
  };

  const renderOrderList = (status: Order['status']) => {
    const filteredOrders = filterOrdersByStatus(status);
    const currentPage = currentPages[status];
    const paginatedOrders = paginateOrders(filteredOrders, currentPage);
    const totalPages = getTotalPages(filteredOrders.length);

    return (
      <div className="space-y-4">
        {paginatedOrders.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            No {status} orders
          </Card>
        ) : (
          <>
            <div className="grid gap-4">
              {paginatedOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="p-4 hover:shadow-lg transition-shadow">
                    <div className="flex flex-wrap gap-4 justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-amber-900">Order #{order.id}</p>
                        <p className="text-gray-600">{order.itemName}</p>
                        <p className="text-sm text-gray-500">Customer: {order.customerName}</p>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge className={getStatusBadgeVariant(order.status)}>
                          {order.status.toUpperCase()}
                        </Badge>
                        <p className="text-green-700">₹{order.total}</p>
                        <p className="text-sm text-gray-500">{order.date}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => {
                        if (currentPage > 1) {
                          setCurrentPages({ ...currentPages, [status]: currentPage - 1 });
                        }
                      }}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPages({ ...currentPages, [status]: page })}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => {
                        if (currentPage < totalPages) {
                          setCurrentPages({ ...currentPages, [status]: currentPage + 1 });
                        }
                      }}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="mb-6 text-amber-900">Order Management</h2>

      <Tabs defaultValue="processing" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value="processing" className="mt-6">
          {renderOrderList('processing')}
        </TabsContent>

        <TabsContent value="shipping" className="mt-6">
          {renderOrderList('shipping')}
        </TabsContent>

        <TabsContent value="delivered" className="mt-6">
          {renderOrderList('delivered')}
        </TabsContent>

        <TabsContent value="cancelled" className="mt-6">
          {renderOrderList('cancelled')}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}