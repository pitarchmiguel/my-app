import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

// Tamaño máximo permitido: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Nueva configuración para Next.js 14
export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request) {
  try {
    console.log('Iniciando proceso de subida de imagen');
    
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      console.error('No se encontró archivo en la solicitud');
      return NextResponse.json(
        { error: 'No se ha proporcionado ningún archivo' },
        { status: 400 }
      );
    }

    console.log('Archivo recibido:', {
      nombre: file.name,
      tipo: file.type,
      tamaño: file.size
    });

    // Validar tamaño del archivo
    if (file.size > MAX_FILE_SIZE) {
      console.error('Archivo demasiado grande:', file.size);
      return NextResponse.json(
        { error: 'El archivo no puede ser mayor a 10MB' },
        { status: 413 }
      );
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      console.error('Tipo de archivo no válido:', file.type);
      return NextResponse.json(
        { error: 'Solo se permiten archivos de imagen' },
        { status: 400 }
      );
    }

    console.log('Iniciando subida a Cloudinary');
    const imageUrl = await uploadToCloudinary(file);
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