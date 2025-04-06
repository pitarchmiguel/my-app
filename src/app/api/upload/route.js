import { NextResponse } from 'next/server';
import { uploadImage } from '@/utils/cloudinary';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No se ha proporcionado ningún archivo' },
        { status: 400 }
      );
    }

    // Verificar que el archivo es una imagen
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'El archivo debe ser una imagen' },
        { status: 400 }
      );
    }

    console.log('Tipo de archivo:', file.type);
    console.log('Tamaño del archivo:', file.size);

    // Subir la imagen a Cloudinary
    const imageUrl = await uploadImage(file);

    if (!imageUrl) {
      throw new Error('No se recibió URL de la imagen');
    }

    console.log('URL de la imagen subida:', imageUrl);
    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error('Error detallado en la subida de imagen:', error);
    return NextResponse.json(
      { 
        error: 'Error al procesar la imagen',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 