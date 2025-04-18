'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ImageUpload from '@/components/ImageUpload';
import toast from 'react-hot-toast';

export default function HeroConfig() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [heroConfig, setHeroConfig] = useState({
    imageUrl: '',
    title: '',
    subtitle: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

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
        toast.error('Error al cargar la configuración');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroConfig();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    // Validar campos requeridos
    if (!heroConfig.imageUrl || !heroConfig.title) {
      setError('La imagen y el título son obligatorios');
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch('/api/hero', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(heroConfig),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al guardar la configuración');
      }

      setHeroConfig(data);
      toast.success('Configuración guardada con éxito');
    } catch (error) {
      console.error('Error al guardar la configuración:', error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Configuración del Hero</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen del Hero <span className="text-red-500">*</span>
            </label>
            <ImageUpload
              value={heroConfig.imageUrl}
              onChange={(url) => {
                console.log('Nueva URL de imagen:', url);
                setHeroConfig({ ...heroConfig, imageUrl: url });
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={heroConfig.title}
              onChange={(e) =>
                setHeroConfig({ ...heroConfig, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtítulo (opcional)
            </label>
            <input
              type="text"
              value={heroConfig.subtitle || ''}
              onChange={(e) =>
                setHeroConfig({ ...heroConfig, subtitle: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSaving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 