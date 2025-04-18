import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: 'dnv7jmjt1',
  api_key: '721518481576849',
  api_secret: '7E72Z_iWF5SWDqWvk68SdyGIi2Q',
  secure: true
});

export async function uploadToCloudinary(file) {
  try {
    // Convertir el archivo a base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64File = buffer.toString('base64');
    const base64Url = `data:${file.type};base64,${base64File}`;

    // Subir a Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        base64Url,
        {
          folder: 'carta',
          resource_type: 'auto',
          transformation: [
            { quality: 'auto:good' }
          ]
        },
        (error, result) => {
          if (error) {
            console.error('Error de Cloudinary:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });

    console.log('Respuesta de Cloudinary:', uploadResponse);
    return uploadResponse.secure_url;

  } catch (error) {
    console.error('Error al subir a Cloudinary:', error);
    throw new Error(`Error al subir a Cloudinary: ${error.message}`);
  }
} 