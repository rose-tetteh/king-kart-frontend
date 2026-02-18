import React from 'react';
import Image from 'next/image';

interface CardProps {
  title: string;
  description: string;
  image: string;
  href?: string;
  className?: string;
  imagePosition?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  image,
  href,
  className = '',
  imagePosition = 'center',
}) => {
  const cardContent = (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col ${className}`}>
      <div className="relative w-full h-48 overflow-hidden rounded-t-lg flex-shrink-0 bg-gray-100">
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain transition-transform duration-300 hover:scale-105"
          style={{ objectPosition: imagePosition }}
        />
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-[var(--color-kk-navy)] mb-2">{title}</h3>
        <p className="text-gray-600 flex-grow">{description}</p>
      </div>
    </div>
  );

  if (href) {
    return <a href={href} className="block h-full">{cardContent}</a>;
  }

  return cardContent;
};
