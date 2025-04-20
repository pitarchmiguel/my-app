'use client';

import { useState, useEffect, memo } from 'react';
import Image from 'next/image';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import ProductImage from './ProductImage';
import Hero from './Hero';
import ProductSkeleton from './ProductSkeleton';
import VirtualizedProductList from './VirtualizedProductList';

// Componente Modal de Información
const InfoModal = memo(({ isOpen, onClose }) => {
  const handleContactClick = (type) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'contact_click', {
        'contact_type': type
      });
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full rounded-lg bg-white overflow-hidden">
          {/* Mapa */}
          <div className="relative h-72 w-full bg-gray-100">
            <Image
              src="/images/map_fire.png"
              alt="Ubicación Fire Station"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Contenido */}
          <div className="p-8">
            {/* Título */}
            <div className="mb-8">
              <h2 className="text-4xl font-black tracking-wider mb-1">FIRESTATION</h2>
              <p className="text-xl italic font-medium">Nerea Centelles</p>
            </div>

            {/* Información de contacto */}
            <div className="space-y-6">
              <div 
                className="flex items-start space-x-4 cursor-pointer" 
                onClick={() => handleContactClick('address')}
              >
                <div className="w-6 h-6 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg">C/ Amelia Ferrer Armengot 12</p>
                  <p className="text-lg">12004 Castellón de la Plana</p>
                </div>
              </div>

              <div 
                className="flex items-center space-x-4 cursor-pointer"
                onClick={() => handleContactClick('phone')}
              >
                <div className="w-6 h-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <p className="text-lg">690 040 694</p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-6 h-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg">Lu - Vi: 7:00 - 17:00</p>
                  <p className="text-lg">Sab: 8:00 - 13:00</p>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
});

// Componente Modal de Imagen
const ImageModal = memo(({ isOpen, onClose, imageUrl, productName, product }) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm" 
            aria-hidden="true" 
            onClick={onClose}
          />
        </Transition.Child>
        
        <div className="fixed inset-x-0 bottom-0 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="translate-y-full"
              enterTo="translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="translate-y-0"
              leaveTo="translate-y-full"
            >
              <Dialog.Panel className="w-full h-[75vh] transform overflow-hidden bg-white shadow-xl rounded-t-2xl">
                <div className="relative aspect-[16/9] w-full">
                  <ProductImage
                    imageUrl={imageUrl}
                    productName={productName}
                    className="h-full w-full"
                  />
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-black/10 backdrop-blur-sm rounded-full p-2 hover:bg-black/20 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">{productName}</h2>
                      <p className={`text-xl font-bold text-gray-900 ${product.price === 0 ? 'italic' : ''}`}>
                        {product.price === 0 ? 'Consultar precio' : `${product.price.toFixed(2)} €`}
                      </p>
                    </div>
                    
                    <p className="text-gray-600 text-base leading-relaxed">{product.description}</p>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
});

// Componente de Categoría
const CategorySection = memo(({ 
  category, 
  isExpanded, 
  onToggle, 
  products, 
  onProductClick 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      <button
        onClick={() => onToggle(category.id)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <h2 className="text-xl font-bold">{category.name}</h2>
        <span className="text-2xl">{category.emoji}</span>
      </button>

      <Transition
        show={isExpanded}
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <div className="px-0 pb-4">
          {products.length > 0 ? (
            <VirtualizedProductList
              products={products}
              handleProductClick={onProductClick}
            />
          ) : (
            <div className="text-center py-4 text-gray-500">
              No hay productos disponibles en esta categoría
            </div>
          )}
        </div>
      </Transition>
    </div>
  );
});

CategorySection.displayName = 'CategorySection';

export default function HomePage({ categories, products, error }) {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  // Asegurarse de que products es un array
  const safeProducts = Array.isArray(products) ? products : [];

  // Logs de depuración detallados
  useEffect(() => {
    console.log('Categorías recibidas:', categories);
    console.log('Detalles de cada categoría:', 
      categories?.map(cat => ({
        id: cat.id,
        name: cat.name,
        emoji: cat.emoji,
        productsCount: cat.products?.length || 0
      }))
    );
    console.log('Productos recibidos:', safeProducts);
  }, [categories, safeProducts]);

  // Simular carga inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Tracking de vista de página
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'Carta Firestation',
        page_location: window.location.href,
        page_path: window.location.pathname
      });
    }
  }, []);

  useEffect(() => {
    if (error) {
      console.error('Error en los datos:', error);
    }
  }, [error]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Error al cargar los datos</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!isLoading && (!categories || categories.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">No hay categorías disponibles</h2>
          <p className="text-gray-600">Por favor, inténtalo de nuevo más tarde.</p>
        </div>
      </div>
    );
  }

  const handleProductClick = (product) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_item', {
        currency: 'EUR',
        value: product.price,
        items: [{
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          item_category: product.category?.name
        }]
      });
    }
    setSelectedImage(product);
  };

  const handleInfoClick = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_restaurant_info', {
        'action': 'open_info_modal'
      });
    }
    setIsInfoModalOpen(true);
  };

  // Agrupar productos por categoría
  const productsByCategory = categories.reduce((acc, category) => {
    const categoryProducts = safeProducts.filter(
      product => product.category && product.category.id === category.id
    );
    
    acc[category.id] = {
      ...category,
      products: categoryProducts
    };
    return acc;
  }, {});

  // Ordenar categorías por el campo 'order'
  const sortedCategories = Object.values(productsByCategory).sort((a, b) => a.order - b.order);

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      
      <div className="container mx-auto px-4 py-8">
        {/* Categorías y Productos */}
        <div className="space-y-6">
          {isLoading ? (
            // Skeleton para categorías
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            // Categorías y productos
            sortedCategories.map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                isExpanded={expandedCategories.has(category.id)}
                onToggle={toggleCategory}
                products={category.products}
                onProductClick={handleProductClick}
              />
            ))
          )}
        </div>
      </div>

      {/* Modal de información */}
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />

      {/* Modal de imagen */}
      {selectedImage && (
        <ImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage.imageUrl}
          productName={selectedImage.name}
          product={selectedImage}
        />
      )}
    </div>
  );
} 