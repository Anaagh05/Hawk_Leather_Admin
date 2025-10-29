import { useState } from "react";
import { Order } from "../types";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { motion } from "motion/react";
import React from "react";
import { useOrders } from "../context/OrderContext";
import {
  Loader2,
  Package,
  User,
  MapPin,
  CreditCard,
  Calendar,
  IndianRupee,
  ShoppingCart,
  TrendingUp,
  Clock,
  XCircle,
} from "lucide-react";
import { Button } from "./ui/button";

const ITEMS_PER_PAGE = 4;

export function OrdersView() {
  const { orders, loading, summary, totalRevenue } = useOrders();
  const [currentPages, setCurrentPages] = useState({
    processing: 1,
    shipped: 1,
    delivered: 1,
    cancelled: 1,
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
    }
  };

  const filterOrdersByStatus = (status) => {
    return orders.filter((order) => order.orderStatus === status);
  };

  const paginateOrders = (orders, page) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return orders.slice(startIndex, endIndex);
  };

  const getTotalPages = (totalItems) => {
    return Math.ceil(totalItems / ITEMS_PER_PAGE);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const renderOrderList = (status) => {
    const filteredOrders = filterOrdersByStatus(status);
    const currentPage = currentPages[status];
    const paginatedOrders = paginateOrders(filteredOrders, currentPage);
    const totalPages = getTotalPages(filteredOrders.length);

    if (loading && orders.length === 0) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-amber-700" />
        </div>
      );
    }

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
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex flex-wrap gap-4 justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-amber-700" />
                            <p className="text-amber-900 font-semibold">
                              Order #{order.id.slice(-8).toUpperCase()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-3 h-3" />
                            <span>{order.userId.name}</span>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <Badge
                            className={getStatusBadgeVariant(order.orderStatus)}
                          >
                            {order.orderStatus.toUpperCase()}
                          </Badge>
                          <p className="text-green-700 font-semibold flex items-center justify-end gap-1">
                            <IndianRupee className="w-4 h-4" />
                            {order.totalAmount}
                          </p>
                        </div>
                      </div>

                      {/* Order Items Preview - FIXED IMAGE SIZE */}
                      <div className="space-y-1">
                        <p className="text-sm text-gray-700 font-medium">
                          Items ({order.items.length}):
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {order.items.slice(0, 2).map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded text-xs"
                            >
                              <img
                                src={item.productId.itemImageUrl}
                                alt={item.itemName}
                                className="w-8 h-8 object-cover rounded flex-shrink-0"
                              />
                              <span className="truncate max-w-[150px]">
                                {item.itemName} x{item.quantity}
                              </span>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <span className="text-xs text-gray-500 px-2 py-1">
                              +{order.items.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex flex-wrap gap-4 justify-between items-center pt-2 border-t">
                        <div className="flex gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(order.createdAt)}</span>
                          </div>
                          <Badge
                            className={getPaymentStatusBadge(
                              order.paymentStatus
                            )}
                            variant="outline"
                          >
                            {order.paymentMethod.toUpperCase()} -{" "}
                            {order.paymentStatus}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(order)}
                          className="text-amber-700 hover:text-amber-800"
                        >
                          View Details
                        </Button>
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
                          setCurrentPages({
                            ...currentPages,
                            [status]: currentPage - 1,
                          });
                        }
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() =>
                            setCurrentPages({ ...currentPages, [status]: page })
                          }
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => {
                        if (currentPage < totalPages) {
                          setCurrentPages({
                            ...currentPages,
                            [status]: currentPage + 1,
                          });
                        }
                      }}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
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
      <div className="mb-6">
        <h2 className="text-amber-900 mb-4">Order Management</h2>

        {/* IMPROVED SUMMARY CARDS - Compact Dashboard Design */}
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {/* Total Orders */}
            <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Total Orders</p>
                  <p className="text-3xl font-bold text-amber-900">
                    {summary.total}
                  </p>
                </div>
                <div className="bg-amber-200 p-3 rounded-full">
                  <ShoppingCart className="w-6 h-6 text-amber-700" />
                </div>
              </div>
            </Card>

            {/* Processing */}
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Processing</p>
                  <p className="text-3xl font-bold text-blue-700">
                    {summary.processing}
                  </p>
                </div>
                <div className="bg-blue-200 p-3 rounded-full">
                  <Clock className="w-6 h-6 text-blue-700" />
                </div>
              </div>
            </Card>

            {/* Shipped */}
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Shipped</p>
                  <p className="text-3xl font-bold text-purple-700">
                    {summary.shipped}
                  </p>
                </div>
                <div className="bg-purple-200 p-3 rounded-full">
                  <Package className="w-6 h-6 text-purple-700" />
                </div>
              </div>
            </Card>

            {/* Delivered */}
            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Delivered</p>
                  <p className="text-3xl font-bold text-green-700">
                    {summary.delivered}
                  </p>
                </div>
                <div className="bg-green-200 p-3 rounded-full">
                  <Package className="w-6 h-6 text-green-700" />
                </div>
              </div>
            </Card>

            {/* Cancelled */}
            <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Cancelled</p>
                  <p className="text-3xl font-bold text-red-700">
                    {summary.cancelled}
                  </p>
                </div>
                <div className="bg-red-200 p-3 rounded-full">
                  <XCircle className="w-6 h-6 text-red-700" />
                </div>
              </div>
            </Card>

            {/* Total Revenue */}
            <Card className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Revenue</p>
                  <p className="text-2xl font-bold text-emerald-700 flex items-center gap-0.5">
                    <IndianRupee className="w-5 h-5" />
                    {totalRevenue.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="bg-emerald-200 p-3 rounded-full">
                  <TrendingUp className="w-6 h-6 text-emerald-700" />
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      <Tabs defaultValue="processing" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value="processing" className="mt-6">
          {renderOrderList("processing")}
        </TabsContent>

        <TabsContent value="shipped" className="mt-6">
          {renderOrderList("shipped")}
        </TabsContent>

        <TabsContent value="delivered" className="mt-6">
          {renderOrderList("delivered")}
        </TabsContent>

        <TabsContent value="cancelled" className="mt-6">
          {renderOrderList("cancelled")}
        </TabsContent>
      </Tabs>

      {/* Order Details Dialog - FIXED IMAGE SIZES */}
      {selectedOrder && (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>
                Complete information about order #
                {selectedOrder.id.slice(-8).toUpperCase()}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Order Status */}
              <div className="flex justify-between items-center pb-4 border-b">
                <div>
                  <p className="text-sm text-gray-500">Order Status</p>
                  <Badge
                    className={`${getStatusBadgeVariant(
                      selectedOrder.orderStatus
                    )} mt-1`}
                  >
                    {selectedOrder.orderStatus.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-2xl font-bold text-green-700 flex items-center gap-1">
                    <IndianRupee className="w-5 h-5" />
                    {selectedOrder.totalAmount}
                  </p>
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Customer Information
                </h3>
                <Card className="p-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Name</p>
                      <p className="font-medium">{selectedOrder.userId.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium">
                        {selectedOrder.userId.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Phone</p>
                      <p className="font-medium">
                        {selectedOrder.userId.phone}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Shipping Address
                </h3>
                <Card className="p-4 bg-gray-50">
                  <p className="text-sm">
                    {selectedOrder.shippingAddress.street}
                    <br />
                    {selectedOrder.shippingAddress.city},{" "}
                    {selectedOrder.shippingAddress.state}
                    <br />
                    PIN: {selectedOrder.shippingAddress.pincode}
                    <br />
                    Phone: {selectedOrder.shippingAddress.phone}
                  </p>
                </Card>
              </div>

              {/* Order Items - FIXED IMAGE SIZES */}
              <div>
                <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Order Items
                </h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <Card key={idx} className="p-3">
                      <div className="flex gap-3">
                        <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded text-xs">
                          <img
                            src={item.productId.itemImageUrl}
                            alt={item.itemName}
                            className="w-8 h-8 object-cover rounded flex-shrink-0"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {item.itemName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.productId.categoryName}
                          </p>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-sm">Quantity: {item.quantity}</p>
                            <p className="font-semibold text-green-700">
                              ₹{item.itemPrice}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Payment Details */}
              <div>
                <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Payment Details
                </h3>
                <Card className="p-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Payment Method</p>
                      <p className="font-medium uppercase">
                        {selectedOrder.paymentMethod}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Payment Status</p>
                      <Badge
                        className={getPaymentStatusBadge(
                          selectedOrder.paymentStatus
                        )}
                      >
                        {selectedOrder.paymentStatus.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Order Timeline */}
              <div>
                <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Order Timeline
                </h3>
                <Card className="p-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Order Placed</p>
                      <p className="font-medium">
                        {formatDate(selectedOrder.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Last Updated</p>
                      <p className="font-medium">
                        {formatDate(selectedOrder.updatedAt)}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
}
