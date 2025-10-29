import { Item } from '../types';

// @ts-expect-error: VITE_API_BASE_URL is provided by Vite at build time
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Transform backend response to frontend Item type
const transformBackendProduct = (backendProduct: any): Item => {
  return {
    id: backendProduct._id,
    name: backendProduct.itemName,
    category: backendProduct.categoryName as 'Bags' | 'Purses' | 'Belts',
    description: backendProduct.itemDescription,
    features: backendProduct.itemFeatures,
    price: backendProduct.itemPrice,
    discount: backendProduct.discount,
    gender: backendProduct.gender.toLowerCase() as 'men' | 'women' | 'unisex',
    image: backendProduct.itemImageUrl
  };
};

// Transform frontend Item to backend format for create/update
const transformToBackendFormat = (formData: FormData): FormData => {
  // FormData is already in the correct format, just return it
  return formData;
};

export const productService = {
  // Get all products with optional category filter
  getAllProducts: async (category?: 'Bags' | 'Purses' | 'Belts'): Promise<Item[]> => {
    try {
      const url = category 
        ? `${API_BASE_URL}/products/all?category=${category}`
        : `${API_BASE_URL}/products/all`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch products');
      }

      return result.data.map(transformBackendProduct);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Create new product
  createProduct: async (productData: FormData): Promise<Item> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/`, {
        method: 'POST',
        body: productData,
        // Don't set Content-Type header - browser will set it with boundary
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to create product');
      }

      return transformBackendProduct(result.data);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update product
  updateProduct: async (productId: string, productData: FormData): Promise<Item> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'PUT',
        body: productData,
        // Don't set Content-Type header - browser will set it with boundary
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to update product');
      }

      return transformBackendProduct(result.data);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (productId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
};