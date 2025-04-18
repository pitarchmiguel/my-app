import ProductImage from './ProductImage';

export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 max-w-sm mx-auto">
      <div className="relative h-48">
        <ProductImage
          imageUrl={product.imageUrl}
          productName={product.name}
          className="w-full h-full"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-600 mt-2">{product.description}</p>
        <p className="text-blue-600 font-bold mt-4">${product.price}</p>
      </div>
    </div>
  );
} 