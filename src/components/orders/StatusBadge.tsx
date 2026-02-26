import React from 'react';
import { OrderStatus, ORDER_STATUS_LABELS } from '@/types/cart';

const STATUS_CLASSES: Record<OrderStatus, string> = {
  RECEIVED: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  READY_FOR_DELIVERY: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-gray-100 text-gray-600',
  CANCELLED: 'bg-red-100 text-red-700',
};

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const label = ORDER_STATUS_LABELS[status] ?? status;
  const classes = STATUS_CLASSES[status] ?? 'bg-gray-100 text-gray-600';

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${classes} ${className}`}>
      {label}
    </span>
  );
};
