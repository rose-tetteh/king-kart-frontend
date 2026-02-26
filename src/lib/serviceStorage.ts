// Service storage utility for admin product management
import { Service } from '@/types/service';
import { mockServices } from '@/data/services';

const STORAGE_KEY = 'kingkart_services';

export const getAllServices = (): Service[] => {
  if (typeof window === 'undefined') return mockServices;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Initialize with mock data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockServices));
    return mockServices;
  }

  try {
    return JSON.parse(stored) as Service[];
  } catch {
    return mockServices;
  }
};

export const getServiceById = (id: string): Service | null => {
  const services = getAllServices();
  return services.find(service => service.id === id) || null;
};

export const createService = (service: Omit<Service, 'id'>): Service => {
  const services = getAllServices();
  const newService: Service = {
    ...service,
    id: Date.now().toString(),
  };

  services.push(newService);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
  return newService;
};

export const updateService = (id: string, updates: Partial<Service>): Service | null => {
  const services = getAllServices();
  const index = services.findIndex(service => service.id === id);

  if (index === -1) return null;

  services[index] = { ...services[index], ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
  return services[index];
};

export const deleteService = (id: string): boolean => {
  const services = getAllServices();
  const filtered = services.filter(service => service.id !== id);

  if (filtered.length === services.length) return false;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
};
