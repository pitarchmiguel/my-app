'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Dialog } from '@headlessui/react';

export default function Hero() {
  const [heroImage, setHeroImage] = useState('/images/hero_firestation.jpg');
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  useEffect(() => {
    const fetchHeroConfig = async () => {
      try {
        const response = await fetch('/api/hero');
        const data = await response.json();
        if (data?.imageUrl) {
          setHeroImage(data.imageUrl);
        }
      } catch (error) {
        console.error('Error al cargar la configuración del hero:', error);
      }
    };

    fetchHeroConfig();
  }, []);

  const handleInfoClick = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_restaurant_info', {
        'action': 'open_info_modal'
      });
    }
    setIsInfoModalOpen(true);
  };

  return (
    <>
      <div className="relative h-[30vh] bg-black">
        <Image
          src={heroImage}
          alt="Hero image"
          fill
          className="object-cover opacity-80"
          priority
        />
        {/* Logo en esquina superior izquierda */}
        <div className="absolute top-4 left-4 w-16 h-16">
          <Image
            src="/images/logo_firestation.svg"
            alt="Logo Fire Station"
            width={64}
            height={64}
            className="w-full h-full object-contain"
          />
        </div>
        {/* Botón de información */}
        <button
          onClick={handleInfoClick}
          className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20 transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={2} 
            stroke="currentColor" 
            className="w-6 h-6 text-white"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" 
            />
          </svg>
        </button>
      </div>

      {/* Modal de información */}
      <Dialog 
        open={isInfoModalOpen} 
        onClose={() => setIsInfoModalOpen(false)}
        className="relative z-50"
      >
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
                onClick={() => setIsInfoModalOpen(false)}
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
    </>
  );
} 