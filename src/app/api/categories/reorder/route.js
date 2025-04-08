import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { categories } = await request.json();

    // Actualizar el orden de todas las categorías en una sola transacción
    await prisma.$transaction(
      categories.map(({ id, order }) =>
        prisma.category.update({
          where: { id },
          data: { order },
        })
      )
    );

    return NextResponse.json({ message: 'Orden actualizado correctamente' });
  } catch (error) {
    console.error('Error al reordenar categorías:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el orden' },
      { status: 500 }
    );
  }
} 