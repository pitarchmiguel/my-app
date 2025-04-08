import { useState } from 'react';

export default function ImageUpload({ onImageUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);

      // Validar tamaño antes de intentar subir
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('El archivo no puede ser mayor a 10MB');
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al subir la imagen');
      }

      const data = await response.json();
      onImageUploaded(data.url);
    } catch (error) {
      console.error('Error al subir imagen:', error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-4">
      <input
        type="file"
        onChange={handleUpload}
        accept="image/*"
        disabled={uploading}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100"
      />
      {uploading && <p className="mt-2 text-sm text-gray-500">Subiendo imagen...</p>}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
} 