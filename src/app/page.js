import HomePage from '@/components/HomePage';
import prisma from '@/lib/prisma';

async function getData() {
  try {
    console.log('Iniciando getData...');
    
    const [categories, products] = await Promise.all([
      prisma.category.findMany({
        include: {
          products: {
            where: {
              inStock: true,
            },
          },
        },
      }),
      prisma.product.findMany({
        where: {
          inStock: true,
        },
        include: {
          category: true,
        },
      }),
    ]);

    console.log('Datos obtenidos:', {
      categoriesCount: categories?.length || 0,
      productsCount: products?.length || 0
    });

    if (!categories || !products) {
      console.error('No se pudieron obtener los datos:', { categories, products });
      throw new Error('No se pudieron obtener los datos');
    }

    return {
      categories,
      products,
    };
  } catch (error) {
    console.error('Error detallado al obtener datos:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    
    return {
      categories: [],
      products: [],
      error: error.message
    };
  } finally {
    await prisma.$disconnect();
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  console.log('Renderizando Page...');
  const data = await getData();
  console.log('Datos obtenidos en Page:', {
    categoriesCount: data.categories?.length || 0,
    productsCount: data.products?.length || 0
  });
  return <HomePage {...data} />;
}
