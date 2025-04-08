import ProductImage from './ProductImage';

export default function ProductCard({ product, onImageClick }) {
  return (
    <div 
      className="group relative cursor-pointer"
      onClick={() => onImageClick(product)}
    >
      <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-200">
        <ProductImage
          imageUrl={product.imageUrl}
          productName={product.name}
          className="h-full w-full"
        />
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
        <p className={`mt-1 text-sm ${product.price === 0 ? 'italic text-gray-600' : 'text-gray-900'}`}>
          {product.price === 0 ? 'Consultar precio' : `${product.price.toFixed(2)} €`}
        </p>
      </div>
    </div>
  );
} 