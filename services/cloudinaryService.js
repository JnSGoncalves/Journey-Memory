import cloudinary from './cloudinaryConfig.js';

function extractPublicId(url) {
  const parts = url.split('/');
  const filename = parts.pop();
  const folderPath = parts.slice(parts.indexOf('upload') + 1).join('/memoryJourney/');
  const publicId = `${folderPath}/${filename.split('.')[0]}`;
  return publicId;
}

export async function deleteImageFromUrl(imageUrl) {
  try {
    const publicId = extractPublicId(imageUrl);
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Resultado da exclusão:', result);
    return result;
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
    throw error;
  }
}

export async function deleteAllImagesFromPost(imageUrls) {
  for (const url of imageUrls) {
    await deleteImageFromUrl(url);
  }
}
