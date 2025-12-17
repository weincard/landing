import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Reemplazar espacios con guiones
    .replace(/[^\w-]+/g, "") // Eliminar caracteres no alfanuméricos
    .replace(/--+/g, "-") // Reemplazar múltiples guiones con uno solo
    .replace(/^-+/, "") // Eliminar guiones al inicio
    .replace(/-+$/, ""); // Eliminar guiones al final
}

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Formats file size in human readable units
 * @param sizeInKB - Size in KB
 * @returns Formatted string with appropriate unit
 */
export function formatFileSize(sizeInKB: number): string {
  if (sizeInKB >= 1024) {
    const sizeInMB = sizeInKB / 1024;
    if (sizeInMB >= 1024) {
      const sizeInGB = sizeInMB / 1024;
      return `${sizeInGB.toFixed(1)}GB`;
    }
    return `${sizeInMB.toFixed(1)}MB`;
  }
  return `${Math.round(sizeInKB)}KB`;
}

/**
 * Validates image file size and dimensions
 * @param file - File to validate
 * @param maxSizeKB - Maximum size in KB (default: 500)
 * @param maxWidth - Maximum width in pixels (default: 1000)
 * @param maxHeight - Maximum height in pixels (default: 1000)
 * @returns Promise<ImageValidationResult>
 */
export function validateImageFile(
  file: File,
  maxSizeKB: number = 500,
  maxWidth: number = 1000,
  maxHeight: number = 1000
): Promise<ImageValidationResult> {
  return new Promise((resolve) => {
    // Check file type
    if (!file.type.startsWith("image/")) {
      resolve({ isValid: false, error: "El archivo debe ser una imagen" });
      return;
    }

    // Check file size
    const fileSizeKB = file.size / 1024;
    if (fileSizeKB > maxSizeKB) {
      resolve({
        isValid: false,
        error: `La imagen debe ser menor a ${formatFileSize(
          maxSizeKB
        )}. Tamaño actual: ${formatFileSize(fileSizeKB)}`,
      });
      return;
    }

    // Check dimensions
    const img = new Image();
    img.onload = () => {
      if (img.width > maxWidth || img.height > maxHeight) {
        resolve({
          isValid: false,
          error: `Las dimensiones de la imagen deben ser máximo ${maxWidth}x${maxHeight}px. Dimensiones actuales: ${img.width}x${img.height}px`,
        });
      } else {
        resolve({ isValid: true });
      }
    };

    img.onerror = () => {
      resolve({ isValid: false, error: "Error al procesar la imagen" });
    };

    img.src = URL.createObjectURL(file);
  });
}
