import OptimizedImage from './OptimizedImage';

export default function ProductImage({ imageUrl, productName, className = '' }) {
  return (
    <OptimizedImage
      src={imageUrl}
      alt={productName}
      className={className}
      priority={false}
      quality={80}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
} 