import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const heroConfig = await prisma.heroConfig.findFirst();
    return NextResponse.json(heroConfig || null);
  } catch (error) {
    console.error('Error al obtener la configuración del hero:', error);
    return NextResponse.json(
      { error: 'Error al obtener la configuración del hero' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { imageUrl, title, subtitle } = await request.json();

    if (!imageUrl || !title) {
      return NextResponse.json(
        { error: 'Se requieren imageUrl y title' },
        { status: 400 }
      );
    }

    const existingConfig = await prisma.heroConfig.findFirst();

    if (existingConfig) {
      const updatedConfig = await prisma.heroConfig.update({
        where: { id: existingConfig.id },
        data: { imageUrl, title, subtitle },
      });
      return NextResponse.json(updatedConfig);
    } else {
      const newConfig = await prisma.heroConfig.create({
        data: { imageUrl, title, subtitle },
      });
      return NextResponse.json(newConfig);
    }
  } catch (error) {
    console.error('Error al actualizar la configuración del hero:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la configuración del hero' },
      { status: 500 }
    );
  }
} 