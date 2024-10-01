'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function ProductCard({ product }) {
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getImageSrc = () => {
    if (!imageError && product.images && product.images.length > 0) {
      return product.images[currentImageIndex];
    }
    return '/placeholder-image.jpg';
  };

  const nextImage = (e) => {
    e.preventDefault();
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = (e) => {
    e.preventDefault();
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
      );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative h-64 overflow-hidden">
          <Image 
            src={getImageSrc()}
            alt={product.title}
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'contain' }}
            className="transition-transform duration-300 hover:scale-110"
            onError={() => setImageError(true)}
          />
          {product.images && product.images.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
              <button onClick={prevImage} className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button onClick={nextImage} className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">{product.title}</h2>
          <p className="text-xl font-bold mb-2 text-green-600 dark:text-green-400">${(product.price || 0).toFixed(2)}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{product.category || 'uncategorized'}</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">Rating: {product.rating}/5</span>
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}