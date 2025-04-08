import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Si no es una ruta pública, verificar autenticación
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const categories = await prisma.category.findMany({
      orderBy: {
        order: 'asc',
      },
      include: {
        products: {
          where: {
            inStock: true,
          },
        },
      },
    });

    if (!categories) {
      return NextResponse.json({ categories: [] });
    }

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error detallado al obtener categorías:', {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: 'Error al obtener categorías', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await request.json();

    const category = await prisma.category.create({
      data: {
        name: data.name,
        emoji: data.emoji,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error al crear categoría:', error);
    return NextResponse.json(
      { error: 'Error al crear categoría' },
      { status: 500 }
    );
  }
} 