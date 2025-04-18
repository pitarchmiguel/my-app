import { useState, useEffect } from 'react';

export default function ImageUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Cargar el script de Cloudinary
    const script = document.createElement('script');
    script.src = 'https://upload-widget.cloudinary.com/global/all.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleUpload = () => {
    if (typeof window === 'undefined' || !window.cloudinary) return;

    console.log('Iniciando widget de Cloudinary...');

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dnv7jmjt1',
        uploadPreset: 'ml_default', // Usando el preset por defecto
        sources: ['local'],
        multiple: false,
        maxFileSize: 5000000, // 5MB
        showAdvancedOptions: false,
        cropping: false,
        showSkipCropButton: false,
        defaultSource: 'local',
        styles: {
          palette: {
            window: '#FFFFFF',
            windowBorder: '#90A0B3',
            tabIcon: '#0078FF',
            menuIcons: '#5A616A',
            textDark: '#000000',
            textLight: '#FFFFFF',
            link: '#0078FF',
            action: '#FF620C',
            inactiveTabIcon: '#0E2F5A',
            error: '#F44235',
            inProgress: '#0078FF',
            complete: '#20B832',
            sourceBg: '#E4EBF1'
          }
        }
      },
      (error, result) => {
        console.log('Callback del widget:', { error, result });

        if (error) {
          console.error('Error detallado del widget:', error);
          setError('Error al subir la imagen');
          setUploading(false);
          return;
        }

        if (result.event === 'success') {
          console.log('Subida exitosa:', result.info);
          onChange(result.info.secure_url);
          setUploading(false);
        } else if (result.event === 'close') {
          console.log('Widget cerrado');
          setUploading(false);
        } else {
          console.log('Otro evento del widget:', result.event);
        }
      }
    );

    setUploading(true);
    setError(null);
    widget.open();
  };

  return (
    <div className="mt-4">
      {value && (
        <div className="mb-4">
          <img 
            src={value} 
            alt="Preview" 
            className="max-w-full h-auto rounded-lg shadow-lg"
            style={{ maxHeight: '200px', objectFit: 'contain' }}
          />
        </div>
      )}
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {uploading ? 'Subiendo...' : 'Subir Imagen'}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
} 