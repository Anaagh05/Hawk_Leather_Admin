import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { LeatherCategory, LeatherItem } from '../types';
import { leatherService } from '../services/leatherService';
import { toast } from 'sonner';

interface LeatherContextType {
  items: LeatherItem[];
  loading: boolean;
  error: string | null;
  activeCategory: LeatherCategory;
  fetchLeather: (category?: LeatherCategory) => Promise<void>;
  createLeather: (data: FormData) => Promise<void>;
  updateLeather: (id: string, data: FormData) => Promise<void>;
  deleteLeather: (id: string) => Promise<void>;
}

const LeatherContext = createContext<LeatherContextType | undefined>(undefined);

export const LeatherProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<LeatherItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<LeatherCategory>('shoe_upper');

  useEffect(() => {
    fetchLeather('shoe_upper');
  }, []);

  const fetchLeather = async (category?: LeatherCategory) => {
    const selectedCategory = category ?? activeCategory;
    try {
      setLoading(true);
      setError(null);
      setActiveCategory(selectedCategory);
      setItems([]);
      const data = await leatherService.getAllLeather(selectedCategory);
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
      setItems(prev => {
        if (created.category && created.category !== activeCategory) return prev;
        return [...prev, created];
      });
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
      setItems(prev => {
        if (updated.category && updated.category !== activeCategory) {
          return prev.filter(item => item.id !== id);
        }
        return prev.map(item => (item.id === id ? updated : item));
      });
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
        activeCategory,
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

