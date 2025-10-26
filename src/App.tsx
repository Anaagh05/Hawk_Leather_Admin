import React from 'react';
import { useState } from 'react';
import { LoginForm } from './components/LoginForm';
import { AdminPanel } from './components/AdminPanel';
import { mockItems, mockOrders } from './data/mockData';
import { Item, Order } from './types';
import { Toaster } from './components/ui/sonner';

export default function App() {
  // Initialize state with localStorage value if it exists
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Check if we're in a browser environment before accessing localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('isLoggedIn');
      return saved === 'true';
    }
    return false;
  });
  
  const [items, setItems] = useState<Item[]>(mockItems);
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const handleLogin = () => {
    setIsLoggedIn(true);
    // Store login state in localStorage
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    // Remove login state from localStorage
    localStorage.removeItem('isLoggedIn');
    // Optional: Clear any other sensitive data from localStorage
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
