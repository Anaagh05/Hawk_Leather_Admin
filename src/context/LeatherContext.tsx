import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { LeatherItem } from '../types';
import { leatherService } from '../services/leatherService';
import { toast } from 'sonner';

interface LeatherContextType {
  items: LeatherItem[];
  loading: boolean;
  error: string | null;
  fetchLeather: () => Promise<void>;
  createLeather: (data: FormData) => Promise<void>;
  updateLeather: (id: string, data: FormData) => Promise<void>;
  deleteLeather: (id: string) => Promise<void>;
}

const LeatherContext = createContext<LeatherContextType | undefined>(undefined);

export const LeatherProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<LeatherItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeather();
  }, []);

  const fetchLeather = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await leatherService.getAllLeather();
      setItems(data);
    } catch (err: any) {
      const message = err.message || 'Failed to fetch leather products';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const createLeather = async (data: FormData) => {
    try {
      setLoading(true);
      setError(null);
      const created = await leatherService.createLeather(data);
      setItems(prev => [...prev, created]);
      toast.success('Leather product created successfully!');
    } catch (err: any) {
      const message = err.message || 'Failed to create leather product';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLeather = async (id: string, data: FormData) => {
    try {
      setLoading(true);
      setError(null);
      const updated = await leatherService.updateLeather(id, data);
      setItems(prev => prev.map(item => (item.id === id ? updated : item)));
      toast.success('Leather product updated successfully!');
    } catch (err: any) {
      const message = err.message || 'Failed to update leather product';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteLeather = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await leatherService.deleteLeather(id);
      setItems(prev => prev.filter(item => item.id !== id));
      toast.success('Leather product deleted successfully!');
    } catch (err: any) {
      const message = err.message || 'Failed to delete leather product';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <LeatherContext.Provider
      value={{
        items,
        loading,
        error,
        fetchLeather,
        createLeather,
        updateLeather,
        deleteLeather,
      }}
    >
      {children}
    </LeatherContext.Provider>
  );
};

export const useLeather = () => {
  const ctx = useContext(LeatherContext);
  if (!ctx) {
    throw new Error('useLeather must be used within a LeatherProvider');
  }
  return ctx;
};

