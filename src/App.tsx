import React from "react"
import { useState } from 'react';
import { LoginForm } from './components/LoginForm';
import { AdminPanel } from './components/AdminPanel';
import { mockItems, mockOrders } from './data/mockData';
import { Item, Order } from './types';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [items, setItems] = useState<Item[]>(mockItems);
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <>
      {!isLoggedIn ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <AdminPanel
          items={items}
          orders={orders}
          onLogout={handleLogout}
          onUpdateItems={setItems}
          onUpdateOrders={setOrders}
        />
      )}
      <Toaster />
    </>
  );
}
