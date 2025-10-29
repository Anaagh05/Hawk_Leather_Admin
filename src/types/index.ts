export interface Item {
  id: string;
  name: string;
  category: 'Bags' | 'Purses' | 'Belts';
  description: string;
  features: string[];
  price: number;
  discount: number;
  gender: 'men' | 'women' | 'unisex';
  image: string;
}

// Enhanced Order interfaces with complete backend data
export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface OrderUser {
  id: string;
  name: string;
  email: string;
  phone: number;
}

export interface OrderProduct {
  id: string;
  categoryName: string;
  itemName: string;
  itemImageUrl: string;
}

export interface OrderItem {
  id: string;
  productId: OrderProduct;
  itemName: string;
  itemPrice: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: OrderUser;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  totalAmount: number;
  orderStatus: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentMethod: 'cod' | 'online' | 'card';
  createdAt: string;
  updatedAt: string;
}

export interface OrderSummary {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

export interface OrderPagination {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  ordersPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: OrderPagination;
  summary: OrderSummary;
  totalRevenue: number;
}