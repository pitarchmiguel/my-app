"use client";

import Image from 'next/image';

const Hero = () => {
  return (
    <div className="relative h-[30vh] w-full">
      <Image
        src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/58/c4/7c/el-equipo-de-9-patrias.jpg"
        alt="Restaurante"
        fill
        className="object-cover brightness-75"
        priority
      />
      <div className="absolute inset-0 flex flex-col text-white">
        <h1 className="text-2xl font-bold p-2 uppercase">Fire Station Cafeteria</h1>
      </div>
    </div>
  );
};

export default Hero; 