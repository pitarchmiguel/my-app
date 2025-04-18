'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Hero() {
  const [heroConfig, setHeroConfig] = useState({
    imageUrl: '/images/hero.jpg',
    title: 'Bienvenido a The Fire Station',
    subtitle: 'Disfruta de nuestra deliciosa comida en un ambiente único',
  });

  useEffect(() => {
    const fetchHeroConfig = async () => {
      try {
        const response = await fetch('/api/hero');
        const data = await response.json();
        if (data) {
          setHeroConfig(data);
        }
      } catch (error) {
        console.error('Error al cargar la configuración del hero:', error);
      }
    };

    fetchHeroConfig();
  }, []);

  return (
    <div className="relative h-[60vh] w-full">
      <Image
        src={heroConfig.imageUrl}
        alt="Hero image"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {heroConfig.title}
          </h1>
          {heroConfig.subtitle && (
            <p className="text-xl md:text-2xl">{heroConfig.subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
} 