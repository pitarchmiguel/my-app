const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  // Obtener todas las categorías con sus productos
  const categories = await prisma.category.findMany({
    include: {
      products: true,
    },
  });

  // Guardar los datos en un archivo
  fs.writeFileSync('backup.json', JSON.stringify(categories, null, 2));
  console.log('Backup completado');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 