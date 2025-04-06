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

    // Subir la imagen a Cloudinary
    const imageUrl = await uploadImage(file);

    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error('Error en la subida de imagen:', error);
    return NextResponse.json(
      { error: 'Error al procesar la imagen' },
      { status: 500 }
    );
  }
} 