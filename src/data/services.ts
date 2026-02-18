import { Service } from '@/types/service';

export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Custom Tailored Suits',
    category: 'SUIT',
    description: 'Professional tailored suits crafted to perfection with premium fabrics and expert craftsmanship.',
    fullDescription:
      'Experience the luxury of a perfectly fitted suit, tailored to your exact measurements and style preferences. Our master tailors use only the finest fabrics and time-honored techniques to create suits that exude confidence and sophistication. Whether for business, weddings, or special occasions, each suit is a masterpiece of craftsmanship.',
    basePrice: 800,
    pricingType: 'STARTING_FROM',
    requiresMeasurements: true,
    imageUrls: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800',
      'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800',
    ],
    features: [
      'Premium Italian wool fabrics',
      'Custom measurements and fitting',
      'Choice of lapel, button, and pocket styles',
      'Monogram embroidery included',
      'Two fittings included',
      'Complimentary alterations within 30 days',
    ],
    turnaroundTime: '3-4 weeks',
  },
  {
    id: '2',
    name: 'African Print Garments',
    category: 'AFRICAN_PRINT',
    description: 'Beautiful African print dresses and garments that celebrate culture with modern style.',
    fullDescription:
      'Celebrate African heritage with our stunning collection of custom African print garments. From elegant dresses to sophisticated shirts and traditional attire, each piece showcases vibrant patterns and rich cultural symbolism. Our designs blend traditional aesthetics with contemporary fashion, creating unique pieces that make a statement.',
    basePrice: 250,
    pricingType: 'STARTING_FROM',
    requiresMeasurements: true,
    imageUrls: [
      '/African Print Garments.jpg',
      '/African Print Sub Image 1.jpg',
      '/African Print Sub image 2.jpg',
      '/African Print Sub image 3.jpg',
    ],
    features: [
      'Authentic African print fabrics',
      'Custom design or choose from our patterns',
      'Traditional and modern styles available',
      'Perfect fit guarantee',
      'Matching accessories available',
      'Care instructions included',
    ],
    turnaroundTime: '2-3 weeks',
  },
  {
    id: '3',
    name: "Nurses' Scrubs",
    category: 'NURSES_SCRUBS',
    description: 'Comfortable and professional medical scrubs designed for healthcare professionals.',
    fullDescription:
      'Designed specifically for healthcare professionals who demand comfort, durability, and style. Our medical scrubs are made from high-quality, breathable fabrics that withstand frequent washing while maintaining their color and shape. Available in various colors and styles, with practical pockets and comfortable fits for long shifts.',
    basePrice: 120,
    pricingType: 'STARTING_FROM',
    requiresMeasurements: true,
    imageUrls: [
      '/Nurses\' Scrubs.jpg',
      '/Nurses\' Scrubs sub image 1.jpg',
      '/Nurses\' Scrubs sub image 2.jpg',
    ],
    features: [
      'Medical-grade fabric (65% polyester, 35% cotton)',
      'Multiple pocket configurations',
      'Fade-resistant colors',
      'Comfortable elastic waistbands',
      'Available in 10+ colors',
      'Personalized name embroidery available',
    ],
    turnaroundTime: '1-2 weeks',
  },
  {
    id: '4',
    name: 'Custom Embroidery Services',
    category: 'EMBROIDERY',
    description: 'Custom embroidery for personalized branding, logos, and decorative designs.',
    fullDescription:
      'Add a personal touch to your garments, accessories, and promotional items with our professional embroidery services. From company logos to monograms, our precision embroidery machines and skilled operators ensure crisp, durable results that elevate your brand or personal style. Perfect for corporate wear, gifts, team uniforms, and more.',
    basePrice: 35,
    pricingType: 'STARTING_FROM',
    requiresMeasurements: false,
    imageUrls: [
      '/Custom embroidery sub image 2.jpg',
      '/Custom embroidery services.jpg',
      '/Custom embroidery sub image 1.jpg',
    ],
    features: [
      'Logo and text embroidery',
      'Multiple thread colors available',
      'Various font styles and sizes',
      'Placement customization',
      'Suitable for clothing, bags, caps, and more',
      'Bulk discounts available',
    ],
    turnaroundTime: '3-5 business days',
  },
  {
    id: '5',
    name: 'T-Shirt Customization',
    category: 'TSHIRT_CUSTOMIZATION',
    description: 'Personalized t-shirts with custom designs, prints, and branding.',
    fullDescription:
      'Create unique t-shirts that express your personality, promote your brand, or commemorate special events. We offer various printing techniques including screen printing, heat transfer, and DTG (Direct-to-Garment) to bring your designs to life. Choose from our quality blank t-shirts or bring your own. Perfect for events, businesses, gifts, or personal fashion statements.',
    basePrice: 45,
    pricingType: 'STARTING_FROM',
    requiresMeasurements: false,
    imageUrls: [
      '/T-Shirt Customisation.jpg',
      '/T-shirt customisation sub image 1.jpg',
      '/T-shirt customisation sub image 2.jpg',
    ],
    features: [
      'Full-color printing available',
      'Front, back, and sleeve printing',
      'Various t-shirt styles and colors',
      'Design assistance available',
      'High-quality, long-lasting prints',
      'Bulk order discounts',
    ],
    turnaroundTime: '5-7 business days',
  },
];

// Helper function to get service by ID
export const getServiceById = (id: string): Service | undefined => {
  return mockServices.find((service) => service.id === id);
};

// Helper function to filter services by category
export const getServicesByCategory = (category: string): Service[] => {
  if (category === 'ALL') return mockServices;
  return mockServices.filter((service) => service.category === category);
};
