const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@example.com';
  const adminPassword = 'admin123';

  // Verificar si el usuario ya existe
  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (existingUser) {
    // Actualizar el usuario existente
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const updatedUser = await prisma.user.update({
      where: { email: adminEmail },
      data: {
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    console.log('Usuario administrador actualizado:', updatedUser);
  } else {
    // Crear nuevo usuario
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const newUser = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    console.log('Usuario administrador creado:', newUser);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 