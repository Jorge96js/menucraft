/**
 * Cliente de base de datos simulado.
 * En producción, esto sería Supabase o Prisma.
 * Aquí usa localStorage como backend.
 */

import { StorageCollection } from '../storage/localStorage';
import { STORAGE_KEYS } from '../../shared/constants';
import type { Profile, Menu, Section, Item, AuthUser } from '../../shared/types';
import { generateId, slugify } from '../../shared/utils';

// Collections
const profiles = new StorageCollection<Profile>(STORAGE_KEYS.profiles);
const menus = new StorageCollection<Menu>(STORAGE_KEYS.menus);
const sections = new StorageCollection<Section>(STORAGE_KEYS.sections);
const items = new StorageCollection<Item>(STORAGE_KEYS.items);

// ============ AUTH ============

export const auth = {
  register(email: string, password: string, restaurantName: string): AuthUser {
    // En producción: crear usuario en Supabase Auth
    // Aquí: simular con localStorage
    const existingUsers = JSON.parse(localStorage.getItem('menucraft_users') || '[]');
    
    if (existingUsers.some((u: any) => u.email === email)) {
      throw new Error('Ya existe una cuenta con ese email');
    }

    const user: AuthUser & { password: string } = {
      id: generateId(),
      email,
      password, // En producción: hasheado
    };

    existingUsers.push(user);
    localStorage.setItem('menucraft_users', JSON.stringify(existingUsers));

    // Crear perfil
    const profile: Profile = {
      id: generateId(),
      userId: user.id,
      restaurantName,
      logoUrl: null,
      whatsapp: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    profiles.create(profile);

    return { id: user.id, email: user.email };
  },

  login(email: string, password: string): AuthUser {
    const existingUsers = JSON.parse(localStorage.getItem('menucraft_users') || '[]');
    const user = existingUsers.find((u: any) => u.email === email && u.password === password);

    if (!user) {
      throw new Error('Email o contraseña incorrectos');
    }

    return { id: user.id, email: user.email };
  },

  logout(): void {
    localStorage.removeItem('menucraft_auth');
  },

  getSession(): AuthUser | null {
    const session = localStorage.getItem('menucraft_auth');
    if (!session) return null;
    try {
      return JSON.parse(session);
    } catch {
      return null;
    }
  },

  setSession(user: AuthUser): void {
    localStorage.setItem('menucraft_auth', JSON.stringify(user));
  },
};

// ============ PROFILE ============

export const profileDb = {
  getByUserId(userId: string): Profile | null {
    const all = profiles.getAllBy(p => p.userId === userId);
    return all[0] || null;
  },

  update(userId: string, updates: Partial<Profile>): Profile | null {
    const profile = this.getByUserId(userId);
    if (!profile) return null;

    return profiles.update(profile.id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  },
};

// ============ MENUS ============

export const menusDb = {
  listByUserId(userId: string): Menu[] {
    return menus.getAllBy(m => m.userId === userId);
  },

  getById(menuId: string): Menu | null {
    return menus.getById(menuId);
  },

  getBySlug(slug: string): Menu | null {
    const all = menus.getAllBy(m => m.slug === slug);
    return all[0] || null;
  },

  create(userId: string, name: string): Menu {
    // Verificar que el slug sea único
    let slug = slugify(name);
    let counter = 1;
    while (this.getBySlug(slug)) {
      slug = `${slugify(name)}-${counter}`;
      counter++;
    }

    const menu: Menu = {
      id: generateId(),
      userId,
      name,
      slug,
      isActive: false,
      orderMessage: 'Hola, me gustaría encargar: {items}. Total: {total}',
      colorPrimary: '#f97316',
      colorBg: '#ffffff',
      colorText: null,
      bannerUrl: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return menus.create(menu);
  },

  update(menuId: string, updates: Partial<Menu>): Menu | null {
    return menus.update(menuId, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  },

  delete(menuId: string): boolean {
    // Eliminar secciones e items en cascada
    const menuSections = sections.getAllBy(s => s.menuId === menuId);
    menuSections.forEach(section => {
      items.deleteMany(i => i.sectionId === section.id);
    });
    sections.deleteMany(s => s.menuId === menuId);
    
    return menus.delete(menuId);
  },

  duplicate(menuId: string): Menu | null {
    const original = this.getById(menuId);
    if (!original) return null;

    // Crear nuevo menú
    const newMenu = this.create(original.userId, `${original.name} (copia)`);

    // Copiar secciones e items
    const originalSections = sections.getAllBy(s => s.menuId === menuId);
    originalSections.forEach(section => {
      const newSection: Section = {
        id: generateId(),
        menuId: newMenu.id,
        title: section.title,
        position: section.position,
        createdAt: new Date().toISOString(),
      };
      sections.create(newSection);

      // Copiar items
      const sectionItems = items.getAllBy(i => i.sectionId === section.id);
      sectionItems.forEach(item => {
        const newItem: Item = {
          ...item,
          id: generateId(),
          sectionId: newSection.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        items.create(newItem);
      });
    });

    // Copiar diseño
    menus.update(newMenu.id, {
      orderMessage: original.orderMessage,
      colorPrimary: original.colorPrimary,
      colorBg: original.colorBg,
      colorText: original.colorText,
      bannerUrl: original.bannerUrl,
    });

    return this.getById(newMenu.id);
  },
};

// ============ SECTIONS ============

export const sectionsDb = {
  listByMenuId(menuId: string): Section[] {
    return sections.getAllBy(s => s.menuId === menuId)
      .sort((a, b) => a.position - b.position);
  },

  getById(sectionId: string): Section | null {
    return sections.getById(sectionId);
  },

  create(menuId: string, title: string): Section {
    const existing = this.listByMenuId(menuId);
    const position = existing.length;

    const section: Section = {
      id: generateId(),
      menuId,
      title,
      position,
      createdAt: new Date().toISOString(),
    };

    return sections.create(section);
  },

  update(sectionId: string, updates: Partial<Section>): Section | null {
    return sections.update(sectionId, updates);
  },

  delete(sectionId: string): boolean {
    // Eliminar items en cascada
    items.deleteMany(i => i.sectionId === sectionId);
    return sections.delete(sectionId);
  },

  reorder(menuId: string, sectionIds: string[]): void {
    const allSections = sections.getAllBy(s => s.menuId === menuId);
    
    sectionIds.forEach((id, index) => {
      const section = allSections.find(s => s.id === id);
      if (section) {
        sections.update(id, { position: index });
      }
    });
  },
};

// ============ ITEMS ============

export const itemsDb = {
  listBySectionId(sectionId: string): Item[] {
    return items.getAllBy(i => i.sectionId === sectionId)
      .sort((a, b) => a.position - b.position);
  },

  getById(itemId: string): Item | null {
    return items.getById(itemId);
  },

  create(sectionId: string, data: Omit<Item, 'id' | 'sectionId' | 'position' | 'createdAt' | 'updatedAt'>): Item {
    const existing = this.listBySectionId(sectionId);
    const position = existing.length;

    const item: Item = {
      id: generateId(),
      sectionId,
      name: data.name,
      description: data.description,
      price: data.price,
      imageUrl: data.imageUrl || null,
      available: data.available ?? true,
      position,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return items.create(item);
  },

  update(itemId: string, updates: Partial<Item>): Item | null {
    return items.update(itemId, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  },

  delete(itemId: string): boolean {
    return items.delete(itemId);
  },

  reorder(sectionId: string, itemIds: string[]): void {
    const allItems = items.getAllBy(i => i.sectionId === sectionId);
    
    itemIds.forEach((id, index) => {
      const item = allItems.find(i => i.id === id);
      if (item) {
        items.update(id, { position: index });
      }
    });
  },

  move(itemId: string, toSectionId: string): Item | null {
    const item = this.getById(itemId);
    if (!item) return null;

    const targetItems = this.listBySectionId(toSectionId);
    const newPosition = targetItems.length;

    return items.update(itemId, {
      sectionId: toSectionId,
      position: newPosition,
      updatedAt: new Date().toISOString(),
    });
  },
};

// ============ FULL MENU QUERY ============

export function getMenuWithSections(menuId: string): import('../../shared/types').MenuWithSections | null {
  const menu = menusDb.getById(menuId);
  if (!menu) return null;

  const menuSections = sectionsDb.listByMenuId(menuId);
  const sectionsWithItems = menuSections.map(section => ({
    ...section,
    items: itemsDb.listBySectionId(section.id),
  }));

  return {
    ...menu,
    sections: sectionsWithItems,
  };
}

export function getPublicMenuBySlug(slug: string): import('../../shared/types').MenuWithSections | null {
  const menu = menusDb.getBySlug(slug);
  if (!menu || !menu.isActive) return null;

  const menuSections = sectionsDb.listByMenuId(menu.id);
  const sectionsWithItems = menuSections.map(section => ({
    ...section,
    items: itemsDb.listBySectionId(section.id).filter(i => i.available),
  })).filter(s => s.items.length > 0);

  return {
    ...menu,
    sections: sectionsWithItems,
  };
}
