import { useState, useEffect } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function Categories({ categories, onCategoriesChange }) {
  const [localCategories, setLocalCategories] = useState([]);

  useEffect(() => {
    // Asegurarse de que categories es un array
    const validCategories = Array.isArray(categories) ? categories : [];
    setLocalCategories(validCategories);
  }, [categories]);

  const handleDelete = (index) => {
    const newCategories = localCategories.filter((_, i) => i !== index);
    setLocalCategories(newCategories);
    onCategoriesChange(newCategories);
  };

  if (!Array.isArray(localCategories) || localCategories.length === 0) {
    return (
      <div className="mt-4 p-4 text-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No hay categorías disponibles</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="space-y-2">
        {localCategories.map((category, index) => (
          <div
            key={category.id || `category-${index}`}
            className="flex items-center justify-between p-3 rounded-lg border bg-white border-gray-200"
          >
            <div className="flex items-center space-x-3 flex-1">
              <span className="text-2xl">{category.emoji}</span>
              <span className="flex-1">{category.name}</span>
            </div>
            <button
              onClick={() => handleDelete(index)}
              className="ml-2 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 