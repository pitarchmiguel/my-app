import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function Categories({ categories, onCategoriesChange }) {
  const [localCategories, setLocalCategories] = useState(categories || []);

  useEffect(() => {
    setLocalCategories(categories || []);
  }, [categories]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(localCategories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLocalCategories(items);
    onCategoriesChange(items);
  };

  const handleDelete = (index) => {
    const newCategories = localCategories.filter((_, i) => i !== index);
    setLocalCategories(newCategories);
    onCategoriesChange(newCategories);
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Categorías</h3>
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
                  key={category.id || index}
                  draggableId={category.id?.toString() || index.toString()}
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
                      <span className="flex-1">{category.name}</span>
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