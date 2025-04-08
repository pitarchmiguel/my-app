import { useState } from 'react';

const compressImage = async (file, maxSizeMB = 1) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calcular nuevas dimensiones manteniendo el aspect ratio
        const maxDimension = 1920; // Máximo 1920px en cualquier dimensión
        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Comprimir con calidad progresiva hasta alcanzar el tamaño deseado
        let quality = 0.7;
        let dataUrl;
        
        do {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
          quality -= 0.1;
        } while (dataUrl.length > maxSizeMB * 1024 * 1024 && quality > 0.1);
        
        // Convertir base64 a Blob
        fetch(dataUrl)
          .then(res => res.blob())
          .then(blob => {
            // Crear un nuevo File con el mismo nombre pero comprimido
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: new Date().getTime()
            });
            resolve(compressedFile);
          })
          .catch(reject);
      };
      
      img.onerror = reject;
    };
    
    reader.onerror = reject;
  });
};

export default function ImageUpload({ onImageUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState('');

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);
      setProgress('Comprimiendo imagen...');

      // Comprimir imagen antes de subir
      const compressedFile = await compressImage(file, 2); // Máximo 2MB
      
      setProgress('Subiendo imagen...');
      const formData = new FormData();
      formData.append('file', compressedFile);

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
      setProgress('');
    } catch (error) {
      console.error('Error al subir imagen:', error);
      setError(error.message);
      setProgress('');
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
      {progress && <p className="mt-2 text-sm text-gray-500">{progress}</p>}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
} 