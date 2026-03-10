import { LeatherCategory, LeatherItem } from '../types';

// @ts-expect-error: VITE_API_BASE_URL is provided by Vite at build time
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Transform backend response to frontend LeatherItem type
const transformBackendLeather = (backendLeather: any): LeatherItem => {
  return {
    id: backendLeather.id || backendLeather._id,
    title: backendLeather.title,
    image: backendLeather.image,
    description: backendLeather.description,
    features: backendLeather.features ?? [],
    category:
      (backendLeather.category ??
        backendLeather.leatherCategory ??
        backendLeather.leather_category) as LeatherCategory | undefined,
  };
};

export const leatherService = {
  // Get all leather products
  getAllLeather: async (category?: LeatherCategory): Promise<LeatherItem[]> => {
    const url = new URL(`${API_BASE_URL}/leather/all`);
    if (category) url.searchParams.set('category', category);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch leather products');
    }

    return (result.data ?? []).map(transformBackendLeather);
  },

  // Create new leather product
  createLeather: async (formData: FormData): Promise<LeatherItem> => {
    const response = await fetch(`${API_BASE_URL}/leather`, {
      method: 'POST',
      body: formData,
      // Let the browser set Content-Type with boundary
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to create leather product');
    }

    return transformBackendLeather(result.data);
  },

  // Update leather product (partial updates supported)
  updateLeather: async (id: string, formData: FormData): Promise<LeatherItem> => {
    const response = await fetch(`${API_BASE_URL}/leather/${id}`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to update leather product');
    }

    return transformBackendLeather(result.data);
  },

  // Delete leather product
  deleteLeather: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/leather/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to delete leather product');
    }
  },

  // Get all unique leather categories
  getUniqueCategories: async (): Promise<string[]> => {
    const response = await fetch(`${API_BASE_URL}/leather/unique`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch leather categories');
    }

    return Array.isArray(result.data) ? result.data : [];
  },
};

