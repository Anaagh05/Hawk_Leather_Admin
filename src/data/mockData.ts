import { Item, Order } from '../types';

export const mockItems: Item[] = [
  {
    id: '1',
    name: 'Classic Leather Tote',
    category: 'Bags',
    description: 'A timeless leather tote bag perfect for everyday use',
    features: ['100% Genuine Leather', 'Multiple Compartments', 'Adjustable Straps', 'Handcrafted'],
    price: 4500,
    discount: 10,
    gender: 'women',
    image: 'https://images.unsplash.com/photo-1650542218150-5e59a58d4312?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwYmFnJTIwYnJvd258ZW58MXx8fHwxNzYwMjU3NDU3fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: '2',
    name: 'Executive Briefcase',
    category: 'Bags',
    description: 'Professional briefcase for business executives',
    features: ['Premium Leather', 'Laptop Compartment', 'Water Resistant', 'Durable Hardware'],
    price: 6500,
    discount: 15,
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1650542218150-5e59a58d4312?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwYmFnJTIwYnJvd258ZW58MXx8fHwxNzYwMjU3NDU3fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: '3',
    name: 'Vintage Messenger Bag',
    category: 'Bags',
    description: 'Stylish messenger bag with vintage appeal',
    features: ['Distressed Leather', 'Cross-body Strap', 'Quick Access Pocket', 'Classic Design'],
    price: 3800,
    discount: 5,
    gender: 'all',
    image: 'https://images.unsplash.com/photo-1650542218150-5e59a58d4312?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwYmFnJTIwYnJvd258ZW58MXx8fHwxNzYwMjU3NDU3fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: '4',
    name: 'Luxury Wallet',
    category: 'Purses',
    description: 'Premium leather wallet with RFID protection',
    features: ['RFID Blocking', 'Multiple Card Slots', 'Slim Design', 'Soft Leather'],
    price: 1200,
    discount: 0,
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1689844495806-321b5adaf5d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwcHVyc2UlMjB3YWxsZXR8ZW58MXx8fHwxNzYwMzQ0NjYzfDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: '5',
    name: 'Ladies Clutch',
    category: 'Purses',
    description: 'Elegant clutch perfect for special occasions',
    features: ['Compact Design', 'Chain Strap', 'Premium Finish', 'Interior Pockets'],
    price: 2200,
    discount: 20,
    gender: 'women',
    image: 'https://images.unsplash.com/photo-1689844495806-321b5adaf5d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwcHVyc2UlMjB3YWxsZXR8ZW58MXx8fHwxNzYwMzQ0NjYzfDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: '6',
    name: 'Classic Belt',
    category: 'Belts',
    description: 'Versatile leather belt for formal and casual wear',
    features: ['Genuine Leather', 'Reversible', 'Adjustable', 'Metal Buckle'],
    price: 800,
    discount: 10,
    gender: 'all',
    image: 'https://images.unsplash.com/photo-1684510334550-0c4fa8aaffd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwYmVsdCUyMGFjY2Vzc29yaWVzfGVufDF8fHx8MTc2MDM0NDY2M3ww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: '7',
    name: 'Designer Belt',
    category: 'Belts',
    description: 'Premium designer belt with luxury finish',
    features: ['Italian Leather', 'Gold Buckle', 'Handcrafted', 'Gift Box'],
    price: 1500,
    discount: 0,
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1684510334550-0c4fa8aaffd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwYmVsdCUyMGFjY2Vzc29yaWVzfGVufDF8fHx8MTc2MDM0NDY2M3ww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: '8',
    name: 'Travel Backpack',
    category: 'Bags',
    description: 'Spacious leather backpack for travel enthusiasts',
    features: ['Large Capacity', 'Padded Straps', 'Laptop Sleeve', 'Water Resistant'],
    price: 5200,
    discount: 12,
    gender: 'all',
    image: 'https://images.unsplash.com/photo-1650542218150-5e59a58d4312?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwYmFnJTIwYnJvd258ZW58MXx8fHwxNzYwMjU3NDU3fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: '9',
    name: 'Mini Crossbody',
    category: 'Purses',
    description: 'Compact crossbody purse for daily essentials',
    features: ['Lightweight', 'Adjustable Strap', 'Zipper Closure', 'Multiple Colors'],
    price: 1800,
    discount: 8,
    gender: 'women',
    image: 'https://images.unsplash.com/photo-1689844495806-321b5adaf5d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwcHVyc2UlMjB3YWxsZXR8ZW58MXx8fHwxNzYwMzQ0NjYzfDA&ixlib=rb-4.1.0&q=80&w=1080'
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ORD001',
    itemName: 'Classic Leather Tote',
    customerName: 'Rahul Sharma',
    status: 'processing',
    date: '2025-10-13',
    total: 4500
  },
  {
    id: 'ORD002',
    itemName: 'Executive Briefcase',
    customerName: 'Priya Patel',
    status: 'processing',
    date: '2025-10-12',
    total: 6500
  },
  {
    id: 'ORD003',
    itemName: 'Luxury Wallet',
    customerName: 'Amit Singh',
    status: 'shipping',
    date: '2025-10-11',
    total: 1200
  },
  {
    id: 'ORD004',
    itemName: 'Designer Belt',
    customerName: 'Sneha Gupta',
    status: 'delivered',
    date: '2025-10-10',
    total: 1500
  },
  {
    id: 'ORD005',
    itemName: 'Ladies Clutch',
    customerName: 'Kavita Reddy',
    status: 'cancelled',
    date: '2025-10-13',
    total: 2200
  },
  {
    id: 'ORD006',
    itemName: 'Classic Belt',
    customerName: 'Vijay Kumar',
    status: 'processing',
    date: '2025-10-12',
    total: 800
  },
  {
    id: 'ORD007',
    itemName: 'Travel Backpack',
    customerName: 'Anjali Mehta',
    status: 'shipping',
    date: '2025-10-11',
    total: 5200
  },
  {
    id: 'ORD008',
    itemName: 'Vintage Messenger Bag',
    customerName: 'Rohan Joshi',
    status: 'delivered',
    date: '2025-10-09',
    total: 3800
  }
];