import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import React from 'react';

interface LoginFormProps {
  onLogin: () => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation - in production, this would be a real authentication
    if (email === 'admin@hawkexports.com' && password === 'admin123') {
      toast.success('Login successful!');
      onLogin();
    } else {
      toast.error('Invalid credentials. Use admin@hawkexports.com / admin123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-amber-900 mb-2">Hawk Exports</h1>
            <p className="text-gray-600">Admin Panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@hawkexports.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-amber-700 hover:bg-amber-800">
              Login
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Demo credentials:</p>
            <p>Email: admin@hawkexports.com</p>
            <p>Password: admin123</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
