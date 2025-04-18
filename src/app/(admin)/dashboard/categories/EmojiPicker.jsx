import { useState } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

export default function EmojiPicker({ onEmojiSelect, buttonClassName }) {
  const [showPicker, setShowPicker] = useState(false);

  const handleEmojiSelect = (emoji) => {
    onEmojiSelect(emoji.native);
    setShowPicker(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className={buttonClassName}
      >
        😊
      </button>
      
      {showPicker && (
        <div className="absolute z-50 mt-2">
          <div 
            className="fixed inset-0" 
            onClick={() => setShowPicker(false)}
          />
          <Picker
            data={data}
            onEmojiSelect={handleEmojiSelect}
            theme="light"
            locale="es"
          />
        </div>
      )}
    </div>
  );
} 