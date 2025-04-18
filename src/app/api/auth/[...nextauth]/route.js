import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Configuración de seguridad
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutos en milisegundos

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Se requieren email y contraseña');
        }

        // Verificar intentos de login
        const loginAttempt = await prisma.loginAttempt.findUnique({
          where: { email: credentials.email }
        });

        if (loginAttempt) {
          const now = new Date();
          const lastAttempt = new Date(loginAttempt.lastAttempt);
          const timeSinceLastAttempt = now - lastAttempt;

          if (loginAttempt.attempts >= MAX_LOGIN_ATTEMPTS && timeSinceLastAttempt < LOCKOUT_DURATION) {
            throw new Error('Cuenta temporalmente bloqueada');
          }
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!user) {
          // Registrar intento fallido
          await prisma.loginAttempt.upsert({
            where: { email: credentials.email },
            update: {
              attempts: { increment: 1 },
              lastAttempt: new Date()
            },
            create: {
              email: credentials.email,
              attempts: 1,
              lastAttempt: new Date()
            }
          });
          throw new Error('Credenciales inválidas');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          // Registrar intento fallido
          await prisma.loginAttempt.upsert({
            where: { email: credentials.email },
            update: {
              attempts: { increment: 1 },
              lastAttempt: new Date()
            },
            create: {
              email: credentials.email,
              attempts: 1,
              lastAttempt: new Date()
            }
          });
          throw new Error('Credenciales inválidas');
        }

        // Resetear intentos si el login es exitoso
        if (loginAttempt) {
          await prisma.loginAttempt.update({
            where: { email: credentials.email },
            data: {
              attempts: 0,
              lastAttempt: new Date()
            }
          });
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role.toString(),
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 