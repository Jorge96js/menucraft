/**
 * Simulación de storage de imágenes.
 * En producción, esto sería Supabase Storage o S3.
 * Aquí usamos localStorage con base64 para simular.
 * 
 * NOTA: En producción real, las imágenes NO se guardan en localStorage.
 * Se suben a un bucket y solo se guarda la URL.
 * Esta implementación es solo para el prototipo funcional.
 */

import { getStorage, setStorage } from './localStorage';
import { STORAGE_KEYS, MAX_IMAGE_WIDTH, MAX_BANNER_WIDTH } from '../../shared/constants';
import { generateId, validateMimeType, generateFilename } from '../../shared/utils';

// Estructura para almacenar imágenes
interface StoredImage {
  id: string;
  bucket: string;
  path: string;
  dataUrl: string; // base64 data URL
  mimeType: string;
  size: number;
  createdAt: string;
}

type ImageStore = Record<string, StoredImage>; // key = `${bucket}/${path}`

function getImageStore(): ImageStore {
  return getStorage<ImageStore>(STORAGE_KEYS.images) || {};
}

function setImageStore(store: ImageStore): void {
  setStorage(STORAGE_KEYS.images, store);
}

/**
 * Comprime y redimensiona una imagen en el cliente.
 * Retorna un DataURL con la imagen procesada.
 */
export async function compressImage(
  file: File,
  maxWidth: number = MAX_IMAGE_WIDTH,
  quality: number = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      
      // Calcular nuevas dimensiones
      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      
      // Crear canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('No se pudo crear el canvas'));
        return;
      }
      
      // Dibujar imagen redimensionada
      ctx.drawImage(img, 0, 0, width, height);
      
      // Exportar como WebP (o JPEG si no soporta WebP)
      const mimeType = 'image/webp';
      const dataUrl = canvas.toDataURL(mimeType, quality);
      
      // Si WebP no funciona (retorna PNG), usar JPEG
      if (dataUrl.startsWith('data:image/png')) {
        resolve(canvas.toDataURL('image/jpeg', quality));
      } else {
        resolve(dataUrl);
      }
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Error al cargar la imagen'));
    };
    
    img.src = url;
  });
}

/**
 * Sube una imagen al storage simulado.
 * Valida MIME type, comprime y retorna la URL pública.
 */
export async function uploadImage(
  bucket: 'item-images' | 'menu-banners' | 'logos',
  userId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  // 1. Validar MIME type real
  const isValidMime = await validateMimeType(file);
  if (!isValidMime) {
    throw new Error('Formato de imagen no válido. Usá JPG, PNG o WebP.');
  }
  
  // 2. Determinar maxWidth según bucket
  const maxWidth = bucket === 'menu-banners' ? MAX_BANNER_WIDTH : MAX_IMAGE_WIDTH;
  
  // 3. Simular progreso
  if (onProgress) {
    onProgress(10);
    await new Promise(r => setTimeout(r, 100));
    onProgress(40);
  }
  
  // 4. Comprimir imagen
  const dataUrl = await compressImage(file, maxWidth);
  
  if (onProgress) {
    onProgress(80);
  }
  
  // 5. Generar path único
  const filename = generateFilename(file);
  const path = bucket === 'logos' 
    ? `${userId}/logo`
    : `${userId}/${filename}`;
  
  // 6. Guardar en store
  const store = getImageStore();
  const key = `${bucket}/${path}`;
  const id = generateId();
  
  store[key] = {
    id,
    bucket,
    path,
    dataUrl,
    mimeType: file.type,
    size: file.size,
    createdAt: new Date().toISOString(),
  };
  
  setImageStore(store);
  
  if (onProgress) {
    onProgress(100);
  }
  
  // 7. Retornar URL "pública" (formato: storage://bucket/path)
  return `storage://${bucket}/${path}`;
}

/**
 * Obtiene la URL de una imagen desde el storage.
 * Convierte el formato storage:// a data URL.
 */
export function getImageUrl(storageUrl: string | null): string | null {
  if (!storageUrl) return null;
  
  if (!storageUrl.startsWith('storage://')) {
    // Si ya es una URL externa o data URL, retornar tal cual
    return storageUrl;
  }
  
  const store = getImageStore();
  const key = storageUrl.replace('storage://', '');
  const image = store[key];
  
  return image?.dataUrl || null;
}

/**
 * Elimina una imagen del storage.
 */
export function deleteImage(storageUrl: string): boolean {
  if (!storageUrl.startsWith('storage://')) return false;
  
  const store = getImageStore();
  const key = storageUrl.replace('storage://', '');
  
  if (!store[key]) return false;
  
  delete store[key];
  setImageStore(store);
  return true;
}

/**
 * Reemplaza una imagen: elimina la anterior y sube la nueva.
 * Retorna la nueva URL.
 */
export async function replaceImage(
  bucket: 'item-images' | 'menu-banners' | 'logos',
  userId: string,
  oldUrl: string | null,
  newFile: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  // Eliminar anterior si existe
  if (oldUrl) {
    deleteImage(oldUrl);
  }
  
  // Subir nueva
  return uploadImage(bucket, userId, newFile, onProgress);
}
