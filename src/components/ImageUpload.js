'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ImageUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Iniciando subida de imagen...');
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Error al subir la imagen');
      }

      console.log('Subida exitosa:', data);
      onChange(data.url);
    } catch (error) {
      console.error('Error detallado al subir la imagen:', error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {value && (
        <div className="relative w-full h-64">
          <Image
            src={value}
            alt="Hero image"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      )}

      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="hero-image"
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${
            uploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Haz clic para subir</span> o arrastra
              y suelta
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG o GIF (MAX. 800x400px)
            </p>
          </div>
          <input
            id="hero-image"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-500">
          {error}
        </p>
      )}
      {uploading && (
        <p className="mt-2 text-sm text-indigo-600">
          Subiendo imagen...
        </p>
      )}
    </div>
  );
} 