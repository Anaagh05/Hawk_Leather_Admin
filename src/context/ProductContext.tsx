import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Item } from '../types';
import { productService } from '../services/productService';
import { toast } from 'sonner';

interface ProductContextType {
  items: Item[];
  loading: boolean;
  error: string | null;
  fetchProducts: (category?: 'Bags' | 'Purses' | 'Belts') => Promise<void>;
  createProduct: (productData: FormData) => Promise<void>;
  updateProduct: (productId: string, productData: FormData) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (category?: 'Bags' | 'Purses' | 'Belts') => {
    try {
      setLoading(true);
      setError(null);
      const products = await productService.getAllProducts(category);
      setItems(products);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch products';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: FormData) => {
    try {
      setLoading(true);
      setError(null);
      const newProduct = await productService.createProduct(productData);
      setItems(prevItems => [...prevItems, newProduct]);
      toast.success('Product created successfully!');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create product';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId: string, productData: FormData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedProduct = await productService.updateProduct(productId, productData);
      setItems(prevItems => 
        prevItems.map(item => item.id === productId ? updatedProduct : item)
      );
      toast.success('Product updated successfully!');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update product';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      setLoading(true);
      setError(null);
      await productService.deleteProduct(productId);
      setItems(prevItems => prevItems.filter(item => item.id !== productId));
      toast.success('Product deleted successfully!');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete product';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider 
      value={{ 
        items, 
        loading, 
        error, 
        fetchProducts, 
        createProduct, 
        updateProduct, 
        deleteProduct 
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};