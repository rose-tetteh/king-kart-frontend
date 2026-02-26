'use client';

import React, { useState, useEffect } from 'react';
import { getAllOrders } from '@/lib/adminOrderStorage';

interface Customer {
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  orders: Array<{
    orderNumber: string;
    total: number;
    status: string;
    date: string;
  }>;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = () => {
    const orders = getAllOrders();

    // Group orders by customer
    const customerMap = new Map<string, Customer>();

    orders.forEach(order => {
      const key = order.customerEmail;
      if (!customerMap.has(key)) {
        customerMap.set(key, {
          name: order.customerName,
          email: order.customerEmail,
          phone: order.customerPhone,
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: order.createdAt,
          orders: [],
        });
      }

      const customer = customerMap.get(key)!;
      customer.totalOrders++;
      if (order.status !== 'cancelled') {
        customer.totalSpent += order.total;
      }
      customer.orders.push({
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
        date: order.createdAt,
      });

      // Update last order date
      if (new Date(order.createdAt) > new Date(customer.lastOrderDate)) {
        customer.lastOrderDate = order.createdAt;
      }
    });

    const customerList = Array.from(customerMap.values()).sort(
      (a, b) => b.totalSpent - a.totalSpent
    );

    setCustomers(customerList);
  };

  const filteredCustomers = customers.filter(customer => {
    const search = searchTerm.toLowerCase();
    return (
      (customer.name?.toLowerCase() || '').includes(search) ||
      (customer.email?.toLowerCase() || '').includes(search) ||
      (customer.phone || '').includes(searchTerm)
    );
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      ready: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-kk-navy)]">Customer Management</h1>
        <p className="text-gray-600 mt-1">View and manage customer information</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <label className="block text-sm font-semibold text-[var(--color-kk-navy)] mb-2">
          Search Customers
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, email, or phone..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-kk-gold)]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-kk-navy)]">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-kk-navy)]">Contact</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-[var(--color-kk-navy)]">Orders</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--color-kk-navy)]">Total Spent</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-[var(--color-kk-navy)]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        No customers found
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((customer, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-[var(--color-kk-navy)]">{customer.name}</p>
                            <p className="text-xs text-gray-500">
                              Last order: {new Date(customer.lastOrderDate).toLocaleDateString()}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <p className="text-gray-700">{customer.email}</p>
                            <p className="text-gray-500">{customer.phone}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-semibold text-sm">
                            {customer.totalOrders}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="font-bold text-[var(--color-kk-gold)]">
                            GH₵{customer.totalSpent.toFixed(2)}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => setSelectedCustomer(customer)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredCustomers.length} of {customers.length} customers
          </div>
        </div>

        {/* Customer Details Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-8">
            {selectedCustomer ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-[var(--color-kk-navy)]">Customer Details</h3>
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-semibold text-[var(--color-kk-navy)]">{selectedCustomer.name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-700">{selectedCustomer.email}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-700">{selectedCustomer.phone}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-[var(--color-kk-navy)]">{selectedCustomer.totalOrders}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Spent</p>
                      <p className="text-2xl font-bold text-[var(--color-kk-gold)]">
                        GH₵{selectedCustomer.totalSpent.toFixed(0)}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold text-[var(--color-kk-navy)] mb-3">Order History</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {selectedCustomer.orders.map((order, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-semibold text-[var(--color-kk-navy)]">
                              {order.orderNumber}
                            </p>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                              {order.status.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <p className="text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                            <p className="font-bold text-[var(--color-kk-gold)]">GH₵{order.total.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p>Select a customer to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
