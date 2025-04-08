'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

// Iconos de Heroicons (asegúrate de que tienes @heroicons/react instalado)
import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function DraggableCategories({ categories, onReorder, onEdit, onDelete }) {
  const [items, setItems] = useState(categories);
  const [editingCategory, setEditingCategory] = useState(null);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        onReorder(newItems.map((item, index) => ({
          id: item.id,
          order: index
        })));
        
        return newItems;
      });
    }
  };

  const handleEdit = (category) => {
    if (isProcessing) return;
    setError(null);
    setEditingCategory({
      ...category,
      newName: category.name,
      newEmoji: category.emoji
    });
  };

  const handleSaveEdit = async () => {
    if (!editingCategory || isProcessing) return;
    setError(null);
    setIsProcessing(true);

    try {
      await onEdit(editingCategory.id, {
        name: editingCategory.newName,
        emoji: editingCategory.newEmoji
      });

      setItems(items.map(item => 
        item.id === editingCategory.id 
          ? { ...item, name: editingCategory.newName, emoji: editingCategory.newEmoji }
          : item
      ));
      
      setEditingCategory(null);
    } catch (error) {
      setError(error.message || 'Error al editar la categoría');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if (isProcessing) return;
    
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta categoría? Esta acción no se puede deshacer.')) {
      return;
    }

    setError(null);
    setIsProcessing(true);
    
    try {
      await onDelete(id);
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      setError(error.message || 'Error al eliminar la categoría');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {items.map((category) => (
              <SortableItem key={category.id} id={category.id}>
                {editingCategory?.id === category.id ? (
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="text"
                        value={editingCategory.newEmoji}
                        onChange={(e) => setEditingCategory({
                          ...editingCategory,
                          newEmoji: e.target.value
                        })}
                        className="w-16 p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Emoji"
                      />
                      <input
                        type="text"
                        value={editingCategory.newName}
                        onChange={(e) => setEditingCategory({
                          ...editingCategory,
                          newName: e.target.value
                        })}
                        className="flex-1 p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Nombre de la categoría"
                        disabled={isProcessing}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        disabled={isProcessing}
                        className="p-2 text-white bg-green-500 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                      >
                        <CheckIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingCategory(null);
                          setError(null);
                        }}
                        disabled={isProcessing}
                        className="p-2 text-white bg-gray-500 rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full cursor-move">
                        {category.emoji}
                      </div>
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        disabled={isProcessing}
                        className="p-2 text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                        title="Editar categoría"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        disabled={isProcessing}
                        className="p-2 text-white bg-red-500 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                        title="Eliminar categoría"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
} 