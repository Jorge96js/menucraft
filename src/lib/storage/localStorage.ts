/**
 * Wrapper tipado para localStorage.
 * Simula las operaciones de base de datos que haría Supabase/Prisma.
 */

import { STORAGE_KEYS } from '../../shared/constants';

type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

/**
 * Lee un valor del localStorage con parseo JSON.
 */
export function getStorage<T>(key: StorageKey): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    console.error(`Error reading localStorage key: ${key}`);
    return null;
  }
}

/**
 * Escribe un valor en localStorage con serialización JSON.
 */
export function setStorage<T>(key: StorageKey, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing localStorage key: ${key}`, e);
    // Podría ser quota exceeded
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      throw new Error('Almacenamiento lleno. Intentá liberar espacio.');
    }
  }
}

/**
 * Elimina una clave del localStorage.
 */
export function removeStorage(key: StorageKey): void {
  localStorage.removeItem(key);
}

/**
 * Limpia todo el storage de MenuCraft.
 */
export function clearMenuCraftStorage(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}

/**
 * Helper para trabajar con arrays en storage (CRUD simulado).
 */
export class StorageCollection<T extends { id: string }> {
  constructor(private key: StorageKey) {}

  getAll(): T[] {
    return getStorage<T[]>(this.key) || [];
  }

  getById(id: string): T | null {
    const items = this.getAll();
    return items.find(item => item.id === id) || null;
  }

  getAllBy(predicate: (item: T) => boolean): T[] {
    return this.getAll().filter(predicate);
  }

  create(item: T): T {
    const items = this.getAll();
    items.push(item);
    setStorage(this.key, items);
    return item;
  }

  update(id: string, updates: Partial<T>): T | null {
    const items = this.getAll();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    items[index] = { ...items[index], ...updates };
    setStorage(this.key, items);
    return items[index];
  }

  delete(id: string): boolean {
    const items = this.getAll();
    const filtered = items.filter(item => item.id !== id);
    if (filtered.length === items.length) return false;
    
    setStorage(this.key, filtered);
    return true;
  }

  deleteMany(predicate: (item: T) => boolean): number {
    const items = this.getAll();
    const filtered = items.filter(item => !predicate(item));
    const deleted = items.length - filtered.length;
    
    setStorage(this.key, filtered);
    return deleted;
  }

  replaceAll(items: T[]): void {
    setStorage(this.key, items);
  }
}
