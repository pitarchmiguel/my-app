'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

// Componente Modal de Información
function InfoModal({ isOpen, onClose }) {
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
              <div className="flex items-start space-x-4">
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

              <div className="flex items-center space-x-4">
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
}

// Componente Modal de Imagen
function ImageModal({ isOpen, onClose, imageUrl, productName, product }) {
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
              <Dialog.Panel className="w-full transform overflow-hidden bg-white shadow-xl rounded-t-2xl">
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={imageUrl}
                    alt={productName}
                    fill
                    className="object-cover"
                    sizes="100vw"
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
                      <p className="text-xl font-bold text-gray-900">{product.price.toFixed(2)} €</p>
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
}

export default function HomePage({ categories, products, error }) {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (error) {
      console.error('Error en los datos:', error);
    }
  }, [error]);

  // Verificación más detallada de los datos
  useEffect(() => {
    console.log('Categorías recibidas:', categories);
    console.log('Productos recibidos:', products);
  }, [categories, products]);

  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">
            {error ? 'Error al cargar las categorías' : 'Cargando categorías...'}
          </h2>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>
    );
  }

  // Asegurarse de que products es un array
  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <main className="min-h-screen">
      {/* Hero Section con imagen de fondo */}
      <section className="relative h-[30vh] bg-black">
        <Image
          src="/images/hero_firestation.jpg"
          alt="Interior del restaurante"
          fill
          className="object-cover opacity-80"
          priority
        />
        {/* Logo en esquina superior derecha */}
        <div className="absolute top-4 right-4 w-16 h-16">
          <Image
            src="/images/logo_firestation.svg"
            alt="Logo Fire Station"
            fill
            className="object-contain"
            priority
          />
        </div>
      </section>

      {/* Título FIRESTATION */}
      <section className="max-w-4xl mx-auto px-8 pt-8">
        <h1 className="text-2xl font-black text-gray-900">
          FIRESTATION
        </h1>
      </section>

      {/* Sección de información */}
      <section className="max-w-4xl mx-auto px-4 py-2">
        <button
          onClick={() => setIsInfoModalOpen(true)}
          className="w-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 text-gray-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-lg font-bold text-gray-900">Información</span>
                <span className="text-gray-600 text-sm">Dirección, Teléfono, Horarios</span>
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </div>
        </button>
      </section>

      {/* Categorías y sus productos */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {categories.map((category) => {
            const categoryProducts = safeProducts.filter(
              product => product.category && product.category.id === category.id
            );
            const isSelected = selectedCategory === category.id;

            return (
              <div key={category.id} className="space-y-4">
                <button
                  onClick={() => setSelectedCategory(
                    selectedCategory === category.id ? null : category.id
                  )}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg uppercase font-bold">{category.name}</span>
                    <span className="text-2xl">{category.emoji}</span>
                  </div>
                </button>

                {/* Productos de la categoría */}
                {isSelected && (
                  <div className="space-y-4">
                    {categoryProducts.length > 0 ? (
                      categoryProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between space-x-4 bg-white p-4 rounded-lg shadow-sm"
                        >
                          <div className="flex-grow">
                            <h3 className="text-lg font-semibold">{product.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold">{product.price.toFixed(2)}€</span>
                            </div>
                          </div>
                          {product.imageUrl && (
                            <button
                              onClick={() => setSelectedImage(product)}
                              className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-md transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                              <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="pl-4 py-4 text-gray-500 italic">
                        No hay productos disponibles en esta categoría
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Modal de Información */}
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />

      {/* Modal de Imagen */}
      {selectedImage && (
        <ImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage.imageUrl}
          productName={selectedImage.name}
          product={selectedImage}
        />
      )}
    </main>
  );
} 