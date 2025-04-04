'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CategoryForm({ params }) {
  const router = useRouter();
  const { id } = params;
  const isNew = id === 'new';

  const [formData, setFormData] = useState({
    name: '',
    emoji: '',
  });

  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    if (!isNew) {
      fetchCategory();
    }
  }, [isNew]);

  const fetchCategory = async () => {
    try {
      const response = await fetch(`/api/categories/${id}`);
      const data = await response.json();
      setFormData(data);
    } catch (error) {
      console.error('Error al cargar la categoría:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = isNew ? '/api/categories' : `/api/categories/${id}`;
      const method = isNew ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/dashboard/categories');
      }
    } catch (error) {
      console.error('Error al guardar la categoría:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
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
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {isNew ? 'Nueva Categoría' : 'Editar Categoría'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="emoji" className="block text-sm font-medium text-gray-700">
              Emoji
            </label>
            <input
              type="text"
              name="emoji"
              id="emoji"
              value={formData.emoji}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="🍕"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push('/dashboard/categories')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {isNew ? 'Crear' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 