import { memo } from 'react';
import ProductImage from './ProductImage';

const ProductRow = memo(({ product, handleProductClick, style }) => {
  return (
    <div
      className="flex items-center justify-between space-x-4 bg-gray-50 p-4 hover:bg-gray-100 transition-colors"
    >
      <div className="flex-grow">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className={`text-lg font-bold ${product.price === 0 ? 'italic text-gray-600' : ''}`}>
            {product.price === 0 ? 'Consultar precio' : `${product.price.toFixed(2)} €`}
          </span>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleProductClick(product);
        }}
        className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-md transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        <ProductImage
          imageUrl={product.imageUrl}
          productName={product.name}
          className="h-full w-full"
        />
      </button>
    </div>
  );
});

ProductRow.displayName = 'ProductRow';

export default function VirtualizedProductList({ products, handleProductClick }) {
  return (
    <div>
      {products.map((product, index) => (
        <ProductRow
          key={product.id || index}
          product={product}
          handleProductClick={handleProductClick}
        />
      ))}
    </div>
  );
} 