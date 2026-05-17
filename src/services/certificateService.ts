import { Certificate } from '../types';

// @ts-expect-error: VITE_API_BASE_URL is provided by Vite at build time
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const transformCertificate = (backend: Record<string, unknown>): Certificate => ({
  id: (backend.id ?? backend._id) as string,
  certificateName: backend.certificateName as string,
  certificateDescription: backend.certificateDescription as string,
  certificateImageUrl: backend.certificateImageUrl as string,
  createdAt: backend.createdAt as string | undefined,
  updatedAt: backend.updatedAt as string | undefined,
});

export const certificateService = {
  getShownOnLandingPage: async (): Promise<boolean> => {
    const response = await fetch(`${API_BASE_URL}/certificates/shown`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch landing page visibility');
    }

    return Boolean(result.data?.shownOnLandingPage);
  },

  getAllCertificates: async (): Promise<Certificate[]> => {
    const response = await fetch(`${API_BASE_URL}/certificates`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch certificates');
    }

    return (result.data ?? []).map(transformCertificate);
  },

  createCertificate: async (formData: FormData): Promise<Certificate> => {
    const response = await fetch(`${API_BASE_URL}/certificates`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to create certificate');
    }

    return transformCertificate(result.data);
  },

  updateCertificate: async (id: string, formData: FormData): Promise<Certificate> => {
    const response = await fetch(`${API_BASE_URL}/certificates/${id}`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to update certificate');
    }

    return transformCertificate(result.data);
  },

  deleteCertificate: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/certificates/${id}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to delete certificate');
    }
  },

  updateShownOnLandingPage: async (value: boolean): Promise<boolean> => {
    const response = await fetch(`${API_BASE_URL}/certificates/shown/${value}`, {
      method: 'PUT',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to update landing page visibility');
    }

    return Boolean(result.data?.shownOnLandingPage);
  },
};
