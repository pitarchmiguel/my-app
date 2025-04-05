import HomePage from '@/components/HomePage';
import { PrismaClient } from '@prisma/client';

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

export default async function Page() {
  const categories = await getCategories();
  const products = await getProducts();

  return <HomePage categories={categories} products={products} />;
}
