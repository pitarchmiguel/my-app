import HomePage from '@/components/HomePage';
import ClientWrapper from '@/components/ClientWrapper';
import prisma from '@/lib/prisma';

// Tiempo de caché en segundos (5 minutos)
const CACHE_TIME = 300;

// Objeto para almacenar la caché
let cache = {
  data: null,
  timestamp: null
};

async function getData() {
  try {
    console.log('Iniciando getData...');
    
    // Verificar si hay datos en caché y si no han expirado
    const now = Date.now();
    if (cache.data && cache.timestamp && (now - cache.timestamp) / 1000 < CACHE_TIME) {
      console.log('Usando datos de caché');
      return cache.data;
    }

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

    console.log('Datos obtenidos:', {
      categoriesCount: categories?.length || 0,
      productsCount: products?.length || 0
    });

    if (!categories || !products) {
      throw new Error('No se pudieron obtener los datos');
    }

    // Almacenar en caché
    const data = {
      categories,
      products,
    };
    cache = {
      data,
      timestamp: now
    };

    return data;
  } catch (error) {
    console.error('Error al obtener datos:', error);
    return {
      categories: [],
      products: [],
      error: 'No se pudieron cargar los datos. Por favor, inténtalo de nuevo más tarde.'
    };
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  try {
    const data = await getData();
    return (
      <>
        <ClientWrapper />
        <HomePage {...data} />
      </>
    );
  } catch (error) {
    console.error('Error en Page:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Error al cargar la página</h2>
          <p className="text-gray-600">Por favor, inténtalo de nuevo más tarde.</p>
        </div>
      </div>
    );
  }
}
