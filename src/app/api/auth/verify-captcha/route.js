import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configuración de seguridad
const MAX_LOGIN_ATTEMPTS = 5; // Aumentado a 5 intentos
const CAPTCHA_THRESHOLD = 3; // CAPTCHA se activa después de 3 intentos
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutos en milisegundos

export async function POST(request) {
  try {
    const { email, captchaToken } = await request.json();

    // Verificar si el usuario está bloqueado
    const loginAttempt = await prisma.loginAttempt.findUnique({
      where: { email }
    });

    if (loginAttempt) {
      const now = new Date();
      const lastAttempt = new Date(loginAttempt.lastAttempt);
      const timeSinceLastAttempt = now - lastAttempt;

      // Solo bloquear si supera MAX_LOGIN_ATTEMPTS
      if (loginAttempt.attempts >= MAX_LOGIN_ATTEMPTS && timeSinceLastAttempt < LOCKOUT_DURATION) {
        const remainingTime = Math.ceil((LOCKOUT_DURATION - timeSinceLastAttempt) / 1000 / 60);
        return NextResponse.json(
          { error: `Demasiados intentos. Por favor, espera ${remainingTime} minutos.` },
          { status: 429 }
        );
      }

      // Requerir CAPTCHA si supera CAPTCHA_THRESHOLD
      if (loginAttempt.attempts >= CAPTCHA_THRESHOLD && !captchaToken) {
        return NextResponse.json(
          { error: 'Se requiere verificación CAPTCHA' },
          { status: 403 }
        );
      }
    }

    // Si hay un token de CAPTCHA, verificar
    if (captchaToken) {
      const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`,
      });

      const captchaData = await response.json();

      if (!captchaData.success) {
        return NextResponse.json(
          { error: 'Error en la verificación del CAPTCHA' },
          { status: 400 }
        );
      }

      // Si el CAPTCHA es válido, resetear los intentos
      if (loginAttempt) {
        await prisma.loginAttempt.update({
          where: { email },
          data: {
            attempts: 0,
            lastAttempt: new Date()
          }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en la verificación del CAPTCHA:', error);
    return NextResponse.json(
      { error: 'Error en la verificación' },
      { status: 500 }
    );
  }
} 