-- Crear el tipo enum si no existe
DO $$ BEGIN
    CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Crear una columna temporal con el nuevo tipo
ALTER TABLE "User" ADD COLUMN role_new "Role";

-- Actualizar la nueva columna con los valores convertidos
UPDATE "User" SET role_new = 'ADMIN'::"Role" WHERE role = 'admin';
UPDATE "User" SET role_new = 'USER'::"Role" WHERE role = 'user';

-- Eliminar la columna original
ALTER TABLE "User" DROP COLUMN role;

-- Renombrar la nueva columna
ALTER TABLE "User" RENAME COLUMN role_new TO role;

-- Establecer el valor por defecto y not null
ALTER TABLE "User" ALTER COLUMN role SET DEFAULT 'USER'::"Role";
ALTER TABLE "User" ALTER COLUMN role SET NOT NULL; 