import { NextResponse } from 'next/server';
import { uploadImage } from '@/utils/cloudinary';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    console.log('Recibida solicitud de subida de imagen');
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      console.error('No se encontró archivo en la solicitud');
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    console.log('Archivo recibido:', {
      nombre: file.name,
      tipo: file.type,
      tamaño: file.size
    });

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      console.error('Tipo de archivo no válido:', file.type);
      return NextResponse.json(
        { error: 'Solo se permiten archivos de imagen' },
        { status: 400 }
      );
    }

    console.log('Iniciando proceso de subida a Cloudinary');
    const imageUrl = await uploadImage(file);
    console.log('Imagen subida exitosamente:', imageUrl);

    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error('Error detallado en el endpoint de subida:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    return NextResponse.json(
      { error: `Error al procesar la subida: ${error.message}` },
      { status: 500 }
    );
  }
} 