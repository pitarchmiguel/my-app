const { PrismaClient, Role } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Limpiar la base de datos
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Crear usuario administrador
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });
  console.log('Usuario administrador creado:', admin);

  // Crear categorías de ejemplo
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Entrantes',
        emoji: '🥗',
        order: 1,
        products: {
          create: [
            {
              name: 'Ensalada César',
              description: 'Lechuga romana, pollo, crutones, parmesano y salsa césar',
              price: 8.50,
              imageUrl: '/images/ensalada-cesar.jpg',
              inStock: true,
            },
          ],
        },
      },
    }),
    prisma.category.create({
      data: {
        name: 'Principales',
        emoji: '🍝',
        order: 2,
        products: {
          create: [
            {
              name: 'Pasta Carbonara',
              description: 'Pasta con salsa de huevo, panceta y queso parmesano',
              price: 12.50,
              imageUrl: '/images/pasta-carbonara.jpg',
              inStock: true,
            },
          ],
        },
      },
    }),
  ]);

  console.log('Categorías y productos creados:', categories);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 