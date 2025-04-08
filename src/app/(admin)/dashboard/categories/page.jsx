'use client';

import { useState, useEffect } from 'react';
import DraggableCategories from './DraggableCategories';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', emoji: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Error al cargar las categorías');
      }
      const data = await response.json();
      setCategories(data.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newCategory,
          order: categories.length,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear la categoría');
      }

      const createdCategory = await response.json();
      setCategories([...categories, createdCategory]);
      setNewCategory({ name: '', emoji: '' });
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    }
  };

  const handleReorder = async (newOrder) => {
    try {
      const response = await fetch('/api/categories/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categories: newOrder }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el orden');
      }

      // Actualizar las categorías localmente
      setCategories(prev => {
        const updated = [...prev];
        newOrder.forEach(({ id, order }) => {
          const category = updated.find(c => c.id === id);
          if (category) {
            category.order = order;
          }
        });
        return updated.sort((a, b) => a.order - b.order);
      });
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    }
  };

  if (loading) {
    return <div className="p-6">Cargando categorías...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestionar Categorías</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="mb-6">
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="emoji" className="block text-sm font-medium text-gray-700">
              Emoji
            </label>
            <input
              type="text"
              id="emoji"
              value={newCategory.emoji}
              onChange={(e) => setNewCategory({ ...newCategory, emoji: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Crear Categoría
          </button>
        </form>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Categorías Existentes</h2>
        {categories.length === 0 ? (
          <p className="text-gray-500">No hay categorías creadas</p>
        ) : (
          <DraggableCategories 
            categories={categories}
            onReorder={handleReorder}
          />
        )}
      </div>
    </div>
  );
} 