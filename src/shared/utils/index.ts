/**
 * Formatea un precio en centavos a formato legible en pesos argentinos.
 * Ejemplo: 350000 → "$3.500"
 */
export function formatPrice(cents: number): string {
  const pesos = cents / 100;
  return `$${pesos.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

/**
 * Genera un slug a partir de un texto.
 * - Convierte a minúsculas
 * - Normaliza Unicode (quita acentos)
 * - Reemplaza espacios y caracteres especiales por guiones
 * - Elimina guiones consecutivos y al inicio/final
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quitar acentos
    .replace(/[^a-z0-9]+/g, '-')    // reemplazar no-alfanuméricos por guiones
    .replace(/^-+|-+$/g, '')         // quitar guiones al inicio/final
    .replace(/-+/g, '-')             // colapsar guiones consecutivos
    .slice(0, 50);
}

/**
 * Genera un ID único (simula UUID v4).
 * En producción, esto lo haría el servidor.
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Sanitiza texto para mostrar: escapa HTML.
 * React ya lo hace por defecto, pero esta función es útil
 * para cuando necesitamos sanitizar antes de guardar.
 */
export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Sanitiza texto para guardar:
 * - Normaliza Unicode NFC
 * - Quita caracteres de control (excepto \n)
 * - Quita etiquetas HTML
 * - Colapsa espacios múltiples internos en uno solo
 * - NO trim en los extremos (eso se hace solo al final, en submit)
 */
export function sanitizeText(text: string): string {
  // Normalizar Unicode
  let result = text.normalize('NFC');
  
  // Quitar caracteres de control (conservando \n y \t)
  result = result.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  // Quitar etiquetas HTML
  result = result.replace(/<[^>]*>/g, '');
  
  return result;
}

/**
 * Trim de extremos + colapso de espacios internos.
 * Se aplica SOLO al guardar (submit/onBlur), NUNCA en onChange.
 */
export function trimForSave(text: string): string {
  return text
    .trim()                          // quitar espacios en extremos
    .replace(/\s+/g, ' ');          // colapsar espacios múltiples internos
}

/**
 * Calcula la luminancia relativa de un color hex.
 * Fórmula WCAG 2.0
 */
export function getRelativeLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const sR = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const sG = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const sB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  return 0.2126 * sR + 0.7152 * sG + 0.0722 * sB;
}

/**
 * Calcula el ratio de contraste entre dos colores (WCAG 2.0).
 * Retorna un número >= 1.
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getRelativeLuminance(hex1);
  const l2 = getRelativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Determina si un color es "claro" (luminancia > 0.5).
 */
export function isLightColor(hex: string): boolean {
  return getRelativeLuminance(hex) > 0.5;
}

/**
 * Calcula el color de texto automático según el fondo.
 * Retorna negro o blanco según contraste.
 */
export function getAutoTextColor(bgHex: string): string {
  return isLightColor(bgHex) ? '#1f2937' : '#ffffff';
}

/**
 * Verifica si el contraste entre texto y fondo cumple WCAG AA (4.5:1).
 */
export function meetsWcagAA(textHex: string, bgHex: string): boolean {
  return getContrastRatio(textHex, bgHex) >= 4.5;
}

/**
 * Valida el MIME type real de un archivo leyendo los magic bytes.
 */
export function validateMimeType(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const arr = new Uint8Array(e.target?.result as ArrayBuffer).subarray(0, 4);
      let header = '';
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16);
      }
      
      // Magic bytes para formatos soportados
      const validHeaders = [
        'ffd8ff',     // JPEG
        '89504e47',   // PNG
        '52494646',   // WebP (RIFF)
      ];
      
      const isValid = validHeaders.some(h => header.startsWith(h));
      resolve(isValid);
    };
    reader.readAsArrayBuffer(file.slice(0, 4));
  });
}

/**
 * Genera un nombre de archivo seguro (UUID + extensión).
 * No usa el nombre original del archivo.
 */
export function generateFilename(file: File): string {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const safeExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg';
  return `${generateId()}.${safeExt}`;
}

/**
 * Construye el mensaje de WhatsApp reemplazando variables.
 * @param template - Plantilla con {items} y {total}
 * @param items - Array de {name, quantity}
 * @param total - Total en centavos
 */
export function buildWhatsAppMessage(
  template: string,
  items: Array<{ name: string; quantity: number }>,
  totalCents: number
): string {
  const itemsStr = items
    .map(i => `x${i.quantity} ${i.name}`)
    .join(' y ');
  
  const totalStr = formatPrice(totalCents);
  
  return template
    .replace('{items}', itemsStr)
    .replace('{total}', totalStr);
}

/**
 * Construye la URL de WhatsApp.
 */
export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Delay helper para debounce/async.
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Formatea una fecha a string legible en español.
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
