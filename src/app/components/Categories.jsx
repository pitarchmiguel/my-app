import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function Categories({ categories, onCategoriesChange }) {
  const [localCategories, setLocalCategories] = useState([]);

  useEffect(() => {
    // Asegurarse de que categories es un array y añadir orden si no existe
    const validCategories = Array.isArray(categories) 
      ? categories.map((cat, index) => ({
          ...cat,
          order: cat.order || index // Usar el índice como orden si no existe
        }))
      : [];
    
    // Ordenar por el campo order o por el índice
    const sortedCategories = [...validCategories].sort((a, b) => 
      (a.order || 0) - (b.order || 0)
    );
    
    setLocalCategories(sortedCategories);
  }, [categories]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(localCategories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Actualizar el orden de todos los elementos
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    setLocalCategories(updatedItems);
    onCategoriesChange(updatedItems);
  };

  const handleDelete = (index) => {
    const newCategories = localCategories.filter((_, i) => i !== index);
    // Reordenar después de eliminar
    const reorderedCategories = newCategories.map((cat, idx) => ({
      ...cat,
      order: idx
    }));
    setLocalCategories(reorderedCategories);
    onCategoriesChange(reorderedCategories);
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
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="categories">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {localCategories.map((category, index) => (
                <Draggable
                  key={category.id || `category-${index}`}
                  draggableId={category.id?.toString() || `category-${index}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        snapshot.isDragging
                          ? 'bg-violet-50 border-violet-200'
                          : 'bg-white border-gray-200'
                      }`}
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
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
} 