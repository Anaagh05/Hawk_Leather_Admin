export interface Item {
  id: string;
  name: string;
  category: 'Bags' | 'Purses' | 'Belts';
  description: string;
  features: string[];
  price: number;
  image: string;
}

export interface Order {
  id: string;
  itemName: string;
  customerName: string;
  status: 'pending' | 'processing' | 'shipping' | 'delivered';
  date: string;
  total: number;
}
