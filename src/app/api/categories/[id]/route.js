import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const category = await prisma.category.findUnique({
      where: {
        id: params.id,
      },
      include: {
        products: true,
      },
    });

    if (!category) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    return NextResponse.json(
      { error: 'Error al obtener categoría' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await request.json();

    const category = await prisma.category.update({
      where: {
        id: params.id,
      },
      data: {
        name: data.name,
        emoji: data.emoji,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    return NextResponse.json(
      { error: 'Error al actualizar categoría' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await prisma.category.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: 'Categoría eliminada' });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    return NextResponse.json(
      { error: 'Error al eliminar categoría' },
      { status: 500 }
    );
  }
} 