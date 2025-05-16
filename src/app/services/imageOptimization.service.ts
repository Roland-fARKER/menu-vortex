import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageOptimizationService {
  constructor() {}

  /**
   * Convierte y optimiza la imagen a formato WebP sin recortar.
   * @param file Archivo de imagen original.
   * @param quality Calidad de compresión entre 0 y 1 (por defecto 0.8).
   * @returns Promise<File> optimizado en WebP.
   */
  optimizeImageToWebp(file: File, quality = 0.8): Promise<File> {
    return new Promise<File>((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No se pudo obtener contexto 2D del canvas'));
          return;
        }

        ctx.drawImage(img, 0, 0, img.width, img.height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Error al convertir la imagen a WebP'));
              return;
            }
            const webpFile = new File(
              [blob],
              file.name.replace(/\.\w+$/, '.webp'),
              {
                type: 'image/webp',
                lastModified: Date.now(),
              }
            );
            resolve(webpFile);
          },
          'image/webp',
          quality
        );
      };

      img.onerror = (err) => {
        reject(err);
      };

      img.src = url;
    });
  }
}
