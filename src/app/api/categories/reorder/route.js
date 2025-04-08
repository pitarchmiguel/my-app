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

    // Actualizar cada categoría con su nuevo orden
    const updates = categories.map((category, index) => 
      prisma.category.update({
        where: { id: category.id },
        data: { order: index }
      })
    );

    await prisma.$transaction(updates);

    // Obtener las categorías actualizadas
    const updatedCategories = await prisma.category.findMany({
      orderBy: {
        order: 'asc'
      }
    });

    return NextResponse.json(updatedCategories);
  } catch (error) {
    console.error('Error al reordenar categorías:', error);
    return NextResponse.json(
      { error: 'Error al reordenar categorías' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 