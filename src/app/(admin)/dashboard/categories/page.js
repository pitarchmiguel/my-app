'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Categories from '@/app/components/Categories';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Cargando...</div>
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