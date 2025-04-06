import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó ningún archivo' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Crear un nombre de archivo único
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, '');
    const filename = `${timestamp}-${originalName}`;

    // Asegurarse de que el directorio existe
    const publicDir = join(process.cwd(), 'public', 'uploads');
    await writeFile(join(publicDir, filename), buffer);

    // Devolver la URL relativa
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error('Error al subir archivo:', error);
    return NextResponse.json({ error: 'Error al subir archivo' }, { status: 500 });
  }
} 