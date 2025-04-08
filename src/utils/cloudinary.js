import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file) {
  try {
    console.log('Iniciando subida a Cloudinary');
    console.log('Configuración de Cloudinary:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'Configurado' : 'No configurado',
      api_key: process.env.CLOUDINARY_API_KEY ? 'Configurado' : 'No configurado',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'Configurado' : 'No configurado'
    });

    // Convertir el archivo a base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const base64File = `data:${file.type};base64,${base64}`;

    console.log('Archivo convertido a base64');
    console.log('Tipo de archivo:', file.type);
    console.log('Tamaño del buffer:', buffer.length);

    // Subir con optimización automática
    console.log('Intentando subir a Cloudinary con optimización...');
    const result = await cloudinary.uploader.upload(base64File, {
      folder: 'firestation',
      quality: 'auto', // Calidad automática
      fetch_format: 'auto', // Formato automático
      flags: 'lossy', // Compresión con pérdida para reducir tamaño
      transformation: [
        { width: 2000, height: 2000, crop: 'limit' } // Limitar dimensiones máximas
      ]
    });

    console.log('Subida exitosa a Cloudinary:', result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error('Error detallado al subir imagen a Cloudinary:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      details: error.details || 'No hay detalles adicionales'
    });
    throw new Error(`Error al subir la imagen: ${error.message}`);
  }
} 