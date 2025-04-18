import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: 'dnv7jmjt1',
  api_key: '721518481576849',
  api_secret: '7E72Z_iWF5SWDqWvk68SdyGIi2Q'
});

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

    // Convertir el archivo a base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64File = `data:${file.type};base64,${buffer.toString('base64')}`;

    console.log('Iniciando subida a Cloudinary');
    const result = await cloudinary.uploader.upload(base64File, {
      folder: 'carta',
      resource_type: 'auto',
      transformation: [
        { quality: 'auto:good' }
      ]
    });
    console.log('Imagen subida exitosamente:', result.secure_url);

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error('Error al subir imagen:', error);
    return NextResponse.json(
      { error: 'Error al procesar la imagen' },
      { status: 500 }
    );
  }
} 