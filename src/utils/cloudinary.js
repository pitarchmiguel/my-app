import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file) {
  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'firestation',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      // Convertir el buffer a un stream y enviarlo a Cloudinary
      const buffer = Buffer.from(file.buffer);
      const Readable = require('stream').Readable;
      const stream = new Readable();
      stream.push(buffer);
      stream.push(null);
      stream.pipe(uploadStream);
    });

    return result.secure_url;
  } catch (error) {
    console.error('Error al subir imagen a Cloudinary:', error);
    throw new Error('Error al subir la imagen');
  }
} 