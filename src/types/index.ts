export interface Item {
  id: string;
  name: string;
  category: 'Bags' | 'Purses' | 'Belts';
  description: string;
  features: string[];
  price: number;
  discount: number;
  gender: 'men' | 'women' | 'all';
  image: string;
}

export interface Order {
  id: string;
  itemName: string;
  customerName: string;
  status: 'processing' | 'shipping' | 'delivered' | 'cancelled';
  date: string;
  total: number;
}