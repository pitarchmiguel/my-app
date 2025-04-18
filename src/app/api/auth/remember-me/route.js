import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sign } from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email } = await request.json();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Generar token de recuerdo
    const rememberToken = sign(
      { email },
      process.env.NEXTAUTH_SECRET,
      { expiresIn: '30d' }
    );

    // Guardar token en la base de datos
    await prisma.user.update({
      where: { email },
      data: {
        rememberToken
      }
    });

    // Configurar cookie segura
    const response = NextResponse.json({ success: true });
    response.cookies.set('remember_token', rememberToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 // 30 días
    });

    return response;
  } catch (error) {
    console.error('Error en remember-me:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
} 