// @ts-expect-error: VITE_API_BASE_URL is provided by Vite at build time
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface DescriptionData {
  upperDescription: string;
  lowerDescription: string;
}

export interface LocationData {
  location: string;
  phoneNumber: string;
  email: string;
}

interface ApiResponseMessage {
  message?: string;
}

export const adminMetaService = {
  getDescription: async (): Promise<DescriptionData> => {
    const response = await fetch(`${API_BASE_URL}/description/`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error((result as ApiResponseMessage).message || 'Failed to fetch description');
    }

    return {
      upperDescription: result.upperDescription || '',
      lowerDescription: result.lowerDescription || '',
    };
  },

  updateDescription: async (payload: Partial<DescriptionData>): Promise<DescriptionData> => {
    const response = await fetch(`${API_BASE_URL}/description/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error((result as ApiResponseMessage).message || 'Failed to update description');
    }

    return {
      upperDescription: result.upperDescription || '',
      lowerDescription: result.lowerDescription || '',
    };
  },

  getLocation: async (): Promise<LocationData> => {
    const response = await fetch(`${API_BASE_URL}/location/`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error((result as ApiResponseMessage).message || 'Failed to fetch location');
    }

    return {
      location: result.location || '',
      phoneNumber: result.phoneNumber || '',
      email: result.email || '',
    };
  },

  updateLocation: async (payload: Partial<LocationData>): Promise<LocationData> => {
    const response = await fetch(`${API_BASE_URL}/location/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error((result as ApiResponseMessage).message || 'Failed to update location');
    }

    return {
      location: result.location || '',
      phoneNumber: result.phoneNumber || '',
      email: result.email || '',
    };
  },
};
