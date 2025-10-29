import React from 'react';
import { useState } from 'react';
import { LoginForm } from './components/LoginForm';
import { AdminPanel } from './components/AdminPanel';
import { ProductProvider } from './context/ProductContext';
import { OrderProvider } from './context/OrderContext';
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

  const handleLogin = () => {
    setIsLoggedIn(true);
    // Store login state in localStorage
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    // Remove login state from localStorage
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <>
      {!isLoggedIn ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <ProductProvider>
          <OrderProvider>
            <AdminPanel onLogout={handleLogout} />
          </OrderProvider>
        </ProductProvider>
      )}
      <Toaster />
    </>
  );
}