'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog } from '@headlessui/react';

// Componente Modal de Información
function InfoModal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6">
          <Dialog.Title className="text-xl font-bold mb-4">Información</Dialog.Title>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Dirección</h3>
              <p>Calle Principal 123, Ciudad</p>
            </div>
            <div>
              <h3 className="font-semibold">Teléfono</h3>
              <p>+34 123 456 789</p>
            </div>
            <div>
              <h3 className="font-semibold">Horarios</h3>
              <p>Lunes a Viernes: 9:00 - 22:00</p>
              <p>Sábados y Domingos: 10:00 - 23:00</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="mt-6 w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800"
          >
            Cerrar
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

// Componente Modal de Imagen
function ImageModal({ isOpen, onClose, imageUrl, productName }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative bg-white rounded-lg overflow-hidden max-w-3xl w-full">
          <div className="relative h-[60vh] w-full">
            <Image
              src={imageUrl}
              alt={productName}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
            />
          </div>
          <div className="absolute top-2 right-2">
            <button
              onClick={onClose}
              className="bg-white/10 backdrop-blur-sm text-white rounded-full p-2 hover:bg-white/20 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default function HomePage({ categories, products }) {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

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
        
        {/* Botón de información en esquina inferior derecha */}
        <div className="absolute bottom-4 right-4">
          <button
            onClick={() => setIsInfoModalOpen(true)}
          >
            <span className="text-3xl">ℹ️</span>
          </button>
        </div>
      </section>

      {/* Categorías y sus productos */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {categories.map((category) => {
            const categoryProducts = products.filter(product => product.category.id === category.id);
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
                {isSelected && categoryProducts.length > 0 && (
                  <div className="pl-4 space-y-4">
                    {categoryProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between space-x-4 bg-white p-4 rounded-lg shadow-sm"
                      >
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold">{product.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
                            <span className={`text-sm ${
                              product.inStock
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}>
                              {product.inStock ? 'Disponible' : 'Agotado'}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedImage(product)}
                          className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-md transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Mensaje cuando no hay productos */}
                {isSelected && categoryProducts.length === 0 && (
                  <div className="pl-4 py-4 text-gray-500 italic">
                    No hay productos disponibles en esta categoría
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
        />
      )}
    </main>
  );
} 