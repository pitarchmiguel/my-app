import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const timeSlots = await prisma.timeSlot.findMany({
      orderBy: {
        startTime: 'asc',
      },
    });
    return NextResponse.json(timeSlots);
  } catch (error) {
    console.error('Error fetching time slots:', error);
    return NextResponse.json(
      { error: 'Error al obtener las franjas horarias' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { startTime, endTime, message } = await request.json();

    const timeSlot = await prisma.timeSlot.create({
      data: {
        startTime,
        endTime,
        message,
      },
    });

    return NextResponse.json(timeSlot);
  } catch (error) {
    console.error('Error creating time slot:', error);
    return NextResponse.json(
      { error: 'Error al crear la franja horaria' },
      { status: 500 }
    );
  }
} 