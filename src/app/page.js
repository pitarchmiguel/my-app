import { PrismaClient } from '@prisma/client';
import Image from 'next/image';

const prisma = new PrismaClient();

async function getCategories() {
  const categories = await prisma.category.findMany({
    include: {
      products: true,
    },
  });
  return categories;
}

async function getProducts() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
  });
  return products;
}

export default async function Home() {
  const categories = await getCategories();
  const products = await getProducts();

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Bienvenido a Nuestro Restaurante
            </h1>
            <p className="text-xl mb-8">
              Descubre nuestra deliciosa selección de platos preparados con los mejores ingredientes
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nuestras Categorías</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{category.emoji}</div>
                <h3 className="text-xl font-semibold">{category.name}</h3>
                <p className="text-gray-600 mt-2">
                  {category.products.length} productos
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nuestros Productos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold">{product.name}</h3>
                    <span className="text-2xl">{product.category.emoji}</span>
                  </div>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      product.inStock
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.inStock ? 'Disponible' : 'Agotado'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
