/*
  Warnings:

  - Added the required column `updatedAt` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- Primero añadimos las columnas con valores por defecto
ALTER TABLE "Category" ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Category" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Category" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Luego quitamos los valores por defecto de updatedAt
ALTER TABLE "Category" ALTER COLUMN "updatedAt" DROP DEFAULT;
