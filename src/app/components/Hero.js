"use client";

import Image from 'next/image';
import { useState } from 'react';

const Hero = () => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="relative h-[40vh] w-full">
      <Image
        src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/58/c4/7c/el-equipo-de-9-patrias.jpg"
        alt="Restaurante"
        fill
        className="object-cover brightness-75"
        priority
      />
      <div className="absolute inset-0 flex flex-col text-white">
        <h1 className="text-2xl font-bold p-2 uppercase">Fire Station Cafeteria</h1>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full text-white border border-white hover:bg-white/30 transition-all"
        >
          Información
        </button>
      </div>
      
      {showInfo && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-8">
          <div className="bg-white p-6 rounded-lg max-w-2xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Sobre Nosotros</h2>
            <p className="text-gray-600 mb-4">
              Bienvenidos a nuestro restaurante, donde la tradición se encuentra con la innovación.
              Ofrecemos una experiencia culinaria única con los mejores ingredientes locales.
            </p>
            <button
              onClick={() => setShowInfo(false)}
              className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero; 