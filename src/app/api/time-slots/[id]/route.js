import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const timeSlot = await prisma.timeSlot.findUnique({
      where: { id: parseInt(id) },
    });

    if (!timeSlot) {
      return NextResponse.json(
        { error: 'Franja horaria no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(timeSlot);
  } catch (error) {
    console.error('Error fetching time slot:', error);
    return NextResponse.json(
      { error: 'Error al obtener la franja horaria' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { startTime, endTime, message } = await request.json();

    const timeSlot = await prisma.timeSlot.update({
      where: { id: parseInt(id) },
      data: {
        startTime,
        endTime,
        message,
      },
    });

    return NextResponse.json(timeSlot);
  } catch (error) {
    console.error('Error updating time slot:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la franja horaria' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await prisma.timeSlot.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Franja horaria eliminada correctamente' });
  } catch (error) {
    console.error('Error deleting time slot:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la franja horaria' },
      { status: 500 }
    );
  }
} 