import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { categories } = await request.json();

    // Actualizar el orden de cada categoría
    await Promise.all(
      categories.map(async (category, index) => {
        await prisma.category.update({
          where: { id: category.id },
          data: { order: index },
        });
      })
    );

    return NextResponse.json({ message: 'Orden actualizado correctamente' });
  } catch (error) {
    console.error('Error al reordenar categorías:', error);
    return NextResponse.json(
      { error: 'Error al reordenar categorías' },
      { status: 500 }
    );
  }
} 