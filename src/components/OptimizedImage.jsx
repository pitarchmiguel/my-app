import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

// Configuración de la caché
const CACHE_CONFIG = {
  maxSize: 100, // Máximo número de imágenes en caché
  ttl: 5 * 60 * 1000, // 5 minutos en milisegundos
};

// Configuración de precarga
const PRELOAD_CONFIG = {
  adjacentImages: 2, // Número de imágenes adyacentes a precargar
  viewportMargin: 300, // Margen adicional para considerar imágenes "cercanas"
};

// Caché mejorada con TTL y tamaño máximo
const imageCache = new Map();

// Limpiar caché periódicamente
const cleanupCache = () => {
  const now = Date.now();
  for (const [key, value] of imageCache.entries()) {
    if (now - value.timestamp > CACHE_CONFIG.ttl) {
      imageCache.delete(key);
    }
  }
  
  // Si excede el tamaño máximo, eliminar las más antiguas
  if (imageCache.size > CACHE_CONFIG.maxSize) {
    const entries = Array.from(imageCache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    const toDelete = entries.slice(0, entries.length - CACHE_CONFIG.maxSize);
    toDelete.forEach(([key]) => imageCache.delete(key));
  }
};

// Ejecutar limpieza cada minuto
setInterval(cleanupCache, 60 * 1000);

// Función para obtener el mejor formato de imagen soportado
const getBestImageFormat = async () => {
  if (typeof window === 'undefined') return 'image/webp';
  
  const formats = [
    { format: 'image/avif', test: 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=' },
    { format: 'image/webp', test: 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==' }
  ];

  for (const { format, test } of formats) {
    try {
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = test;
      });
      return format;
    } catch (e) {
      continue;
    }
  }
  return 'image/jpeg';
};

export default function OptimizedImage({ 
  src, 
  alt, 
  className, 
  priority = false,
  quality = 75,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  retryCount = 3,
  adjacentImages = [] // Array de URLs de imágenes adyacentes
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [bestFormat, setBestFormat] = useState(null);
  const imgRef = useRef(null);

  // Precargar imágenes adyacentes
  const preloadAdjacentImages = () => {
    const imagesToPreload = adjacentImages.slice(0, PRELOAD_CONFIG.adjacentImages);
    imagesToPreload.forEach(url => {
      if (!imageCache.has(url)) {
        const img = new Image();
        img.src = url;
        imageCache.set(url, {
          timestamp: Date.now(),
          status: 'preloading'
        });
      }
    });
  };

  const loadImage = async (url, attempt = 0) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (!response.ok) throw new Error('Failed to load image');
      
      imageCache.set(url, {
        timestamp: Date.now(),
        status: 'loaded'
      });
      setIsLoading(false);
    } catch (error) {
      if (attempt < retryCount) {
        setTimeout(() => loadImage(url, attempt + 1), 1000 * Math.pow(2, attempt));
      } else {
        setError(true);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    // Detectar mejor formato soportado
    getBestImageFormat().then(format => setBestFormat(format));

    const cachedImage = imageCache.get(src);
    if (cachedImage && Date.now() - cachedImage.timestamp < CACHE_CONFIG.ttl) {
      setIsLoading(false);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadImage(src);
            preloadAdjacentImages();
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: `${PRELOAD_CONFIG.viewportMargin}px 0px`,
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src, retryCount, adjacentImages]);

  if (error) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-2 text-sm text-gray-500">No se pudo cargar la imagen</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={`object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        priority={priority}
        quality={quality}
        loading={priority ? "eager" : "lazy"}
        onError={() => {
          if (retryAttempts < retryCount) {
            setRetryAttempts(prev => prev + 1);
            loadImage(src, retryAttempts + 1);
          } else {
            setError(true);
          }
        }}
      />
    </div>
  );
} 