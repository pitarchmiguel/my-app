import HomePage from '@/components/HomePage';
import prisma from '@/lib/prisma';

async function getData() {
  try {
    const [categories, products] = await Promise.all([
      prisma.category.findMany({
        include: {
          products: true,
        },
      }),
      prisma.product.findMany({
        include: {
          category: true,
        },
      }),
    ]);

    return {
      categories,
      products,
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      categories: [],
      products: [],
    };
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  const data = await getData();
  return <HomePage {...data} />;
}
