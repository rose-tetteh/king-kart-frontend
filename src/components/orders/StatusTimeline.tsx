import React from 'react';
import Link from 'next/link';
import { OrderStatus } from '@/types/cart';

const STATUS_ORDER: OrderStatus[] = [
  'RECEIVED',
  'IN_PROGRESS',
  'READY_FOR_DELIVERY',
  'COMPLETED',
];

const STEP_LABELS: Record<string, string> = {
  RECEIVED: 'Received',
  IN_PROGRESS: 'In Progress',
  READY_FOR_DELIVERY: 'Ready for Delivery',
  COMPLETED: 'Completed',
};

interface StatusTimelineProps {
  currentStatus: OrderStatus;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ currentStatus }) => {
  if (currentStatus === 'CANCELLED') {
    return (
      <div className="border border-red-200 bg-red-50 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="font-semibold text-red-800">This order has been cancelled.</p>
        </div>
        <p className="text-red-700 text-sm ml-11">
          Please contact us if you have questions.
        </p>
        <div className="mt-4 ml-11">
          <Link
            href="/services"
            className="text-sm text-[var(--color-kk-gold)] hover:underline"
          >
            Browse Services →
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = STATUS_ORDER.indexOf(currentStatus);

  return (
    <>
      {/* Desktop: horizontal */}
      <div className="hidden md:flex items-center">
        {STATUS_ORDER.map((step, index) => {
          const isDone = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isLast = index === STATUS_ORDER.length - 1;

          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                {/* Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isDone
                      ? 'bg-green-500 border-green-500 text-white'
                      : isCurrent
                      ? 'bg-[var(--color-kk-gold)] border-[var(--color-kk-gold)] text-[var(--color-kk-navy)]'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {isDone ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isCurrent ? (
                    <div className="w-3 h-3 rounded-full bg-[var(--color-kk-navy)] animate-pulse" />
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-gray-300" />
                  )}
                </div>
                {/* Label */}
                <p
                  className={`mt-2 text-xs text-center max-w-[80px] ${
                    isCurrent
                      ? 'font-bold text-[var(--color-kk-navy)]'
                      : isDone
                      ? 'font-medium text-gray-700'
                      : 'text-gray-400'
                  }`}
                >
                  {STEP_LABELS[step]}
                </p>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={`flex-1 h-0.5 mx-2 mb-6 ${
                    isDone ? 'bg-green-500' : 'bg-gray-200 border-dashed border-t'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile: vertical */}
      <div className="flex flex-col md:hidden">
        {STATUS_ORDER.map((step, index) => {
          const isDone = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isLast = index === STATUS_ORDER.length - 1;

          return (
            <div key={step} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${
                    isDone
                      ? 'bg-green-500 border-green-500 text-white'
                      : isCurrent
                      ? 'bg-[var(--color-kk-gold)] border-[var(--color-kk-gold)] text-[var(--color-kk-navy)]'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  {isDone ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isCurrent ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-kk-navy)] animate-pulse" />
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                  )}
                </div>
                {!isLast && (
                  <div className={`w-0.5 h-8 mt-1 ${isDone ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </div>
              <p
                className={`pt-1 text-sm ${
                  isCurrent
                    ? 'font-bold text-[var(--color-kk-navy)]'
                    : isDone
                    ? 'font-medium text-gray-700'
                    : 'text-gray-400'
                }`}
              >
                {STEP_LABELS[step]}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
};
