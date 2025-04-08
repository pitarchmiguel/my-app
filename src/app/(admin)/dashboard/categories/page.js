'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Categories from '@/app/components/Categories';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    fetchCategories();
  }, [session, status]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/categories');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cargar las categorías');
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Formato de datos inválido');
      }
      
      setCategories(data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoriesChange = async (newCategories) => {
    try {
      const response = await fetch('/api/categories/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categories: newCategories }),
      });

      if (!response.ok) {
        throw new Error('Error al reordenar categorías');
      }

      setCategories(newCategories);
    } catch (error) {
      console.error('Error al actualizar el orden:', error);
      // Recargar las categorías originales en caso de error
      fetchCategories();
    }
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      try {
        const response = await fetch(`/api/categories/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchCategories();
        }
      } catch (error) {
        console.error('Error al eliminar categoría:', error);
      }
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Verificando sesión...</div>
      </div>
    );
  }

  if (!session) {
    return null; // La redirección se maneja en el useEffect
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Cargando categorías...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-red-600 mb-4">Error al cargar las categorías</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchCategories}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Categorías</h2>
          <Link
            href="/dashboard/categories/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Nueva Categoría
          </Link>
        </div>

        <Categories 
          categories={categories} 
          onCategoriesChange={handleCategoriesChange}
        />
      </div>
    </div>
  );
} 