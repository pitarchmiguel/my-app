'use client';

import { useState, useEffect } from 'react';
import DraggableCategories from './DraggableCategories';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', emoji: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      if (!Array.isArray(data)) {
        throw new Error('Formato de datos inválido');
      }
      
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
      setCategories(prev => [...prev, createdCategory]);
      setNewCategory({ name: '', emoji: '' });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    }
  };

  const handleEdit = async (id, data) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar la categoría');
      }

      const updatedCategory = await response.json();
      setCategories(prev => prev.map(cat => 
        cat.id === id ? { ...cat, ...data } : cat
      ));
      return updatedCategory;
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar la categoría');
      }

      setCategories(prev => prev.filter(cat => cat.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
      throw error;
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
    <div className="p-2">
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Categorías</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Crear Categoría
          </button>
        </div>

        <div className="px-6 pb-6">
          {categories.length === 0 ? (
            <p className="text-gray-500">No hay categorías creadas</p>
          ) : (
            <DraggableCategories 
              categories={categories}
              onReorder={handleReorder}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {/* Modal para crear categoría */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Nueva Categoría</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

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
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 