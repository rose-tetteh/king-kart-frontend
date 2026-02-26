'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getAllServices, deleteService, createService, updateService } from '@/lib/serviceStorage';
import { Service } from '@/types/service';
import { ServiceFormModal } from '@/components/admin/ServiceFormModal';

export default function AdminProductsPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = () => {
    setServices(getAllServices());
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      if (deleteService(id)) {
        loadServices();
      }
    }
  };

  const handleAdd = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: Omit<Service, 'id'>) => {
    if (editingService) {
      updateService(editingService.id, data);
    } else {
      createService(data);
    }
    loadServices();
    setIsModalOpen(false);
    setEditingService(null);
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || service.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['ALL', 'SUIT', 'AFRICAN_PRINT', 'NURSES_SCRUBS', 'EMBROIDERY', 'TSHIRT_CUSTOMIZATION'];

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-kk-navy)]">Products Management</h1>
          <p className="text-gray-600 mt-1">Manage your service catalog</p>
        </div>
        <button
          onClick={handleAdd}
          className="px-6 py-3 bg-[var(--color-kk-gold)] text-[var(--color-kk-navy)] font-semibold rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[var(--color-kk-navy)] mb-2">
              Search Products
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or description..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-kk-gold)]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[var(--color-kk-navy)] mb-2">
              Filter by Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-kk-gold)]"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-kk-navy)]">Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-kk-navy)]">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-kk-navy)]">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-kk-navy)]">Turnaround</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--color-kk-navy)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={service.imageUrls[0]}
                            alt={service.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--color-kk-navy)]">{service.name}</p>
                          <p className="text-sm text-gray-600 line-clamp-1">{service.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {service.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[var(--color-kk-gold)]">
                        GH₵{service.basePrice}
                      </p>
                      <p className="text-xs text-gray-500">{service.pricingType.replace('_', ' ')}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {service.turnaroundTime}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(service)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(service.id, service.name)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 text-sm text-gray-600">
        Showing {filteredServices.length} of {services.length} products
      </div>

      {/* Service Form Modal */}
      <ServiceFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingService(null);
        }}
        onSubmit={handleSubmit}
        service={editingService}
      />
    </div>
  );
}
