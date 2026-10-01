import { createContext, useContext, useReducer, ReactNode } from 'react';
import { Menu, UserProfile, Plan, CartItem, Order, MenuItem, MenuSection } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Plans data
export const plans: Plan[] = [
  {
    code: 'free',
    name: 'Gratis',
    priceCents: 0,
    maxMenus: 2,
    maxItemsPerMenu: 30,
    storageQuotaMb: 50,
    features: {
      removeBranding: false,
      analytics: false,
      qr: false,
      duplicateMenu: false,
      extraThemes: false,
      prioritySupport: false,
      banner: false,
      itemImages: false,
    },
  },
  {
    code: 'basic',
    name: 'Básico',
    priceCents: 800000,
    maxMenus: 5,
    maxItemsPerMenu: 100,
    storageQuotaMb: 200,
    features: {
      removeBranding: true,
      analytics: false,
      qr: false,
      duplicateMenu: true,
      extraThemes: false,
      prioritySupport: false,
      banner: true,
      itemImages: true,
    },
  },
  {
    code: 'premium',
    name: 'Premium',
    priceCents: 2000000,
    maxMenus: null,
    maxItemsPerMenu: 300,
    storageQuotaMb: 1000,
    features: {
      removeBranding: true,
      analytics: true,
      qr: true,
      duplicateMenu: true,
      extraThemes: true,
      prioritySupport: true,
      banner: true,
      itemImages: true,
    },
  },
];

// Demo data
const demoSections: MenuSection[] = [
  {
    id: uuidv4(),
    title: 'Entradas',
    position: 0,
    items: [
      { id: uuidv4(), name: 'Empanadas de carne', description: 'Masa crocante, relleno jugoso de carne cortada a cuchillo', price: 150000, imageUrl: null, available: true, position: 0 },
      { id: uuidv4(), name: 'Provoleta', description: 'Queso provolone a la parrilla con orégano y aceite de oliva', price: 280000, imageUrl: null, available: true, position: 1 },
      { id: uuidv4(), name: 'Tabla de fiambres', description: 'Selección de jamón crudo, bondiola, salame y quesos', price: 450000, imageUrl: null, available: true, position: 2 },
    ],
  },
  {
    id: uuidv4(),
    title: 'Principales',
    position: 1,
    items: [
      { id: uuidv4(), name: 'Hamburguesa completa', description: 'Carne 200g, cheddar, lechuga, tomate, cebolla caramelizada', price: 350000, imageUrl: null, available: true, position: 0 },
      { id: uuidv4(), name: 'Milanesa napolitana', description: 'Con jamón, mozzarella y salsa de tomate, acompañada de papas', price: 420000, imageUrl: null, available: true, position: 1 },
      { id: uuidv4(), name: 'Ñoquis de papa & queso', description: 'Caseros con salsa cuatro quesos y albahaca fresca', price: 380000, imageUrl: null, available: true, position: 2 },
    ],
  },
  {
    id: uuidv4(),
    title: 'Bebidas',
    position: 2,
    items: [
      { id: uuidv4(), name: 'Coca Cola', description: '500ml', price: 120000, imageUrl: null, available: true, position: 0 },
      { id: uuidv4(), name: 'Agua mineral', description: '500ml con o sin gas', price: 80000, imageUrl: null, available: true, position: 1 },
      { id: uuidv4(), name: 'Cerveza artesanal', description: 'IPA 500ml - La Birrera', price: 250000, imageUrl: null, available: true, position: 2 },
    ],
  },
];

const demoMenu: Menu = {
  id: uuidv4(),
  name: 'Carta Principal',
  slug: 'carta-principal',
  isActive: true,
  orderMessage: 'Hola, me gustaría encargar: {items}. Total: {total}',
  colorPrimary: '#f97316',
  colorBg: '#ffffff',
  colorText: null,
  bannerUrl: null,
  sections: demoSections,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const demoUser: UserProfile = {
  id: uuidv4(),
  email: 'demo@menucraft.com',
  restaurantName: 'La Cocina de Demo',
  logoUrl: null,
  whatsappNumber: '5491123456789',
  plan: 'basic',
};

// State
interface AppState {
  user: UserProfile;
  menus: Menu[];
  cart: CartItem[];
  orders: Order[];
  isAuthenticated: boolean;
  currentPage: 'landing' | 'dashboard' | 'editor' | 'public' | 'pricing' | 'admin';
  editingMenuId: string | null;
  viewingSlug: string | null;
}

const initialState: AppState = {
  user: demoUser,
  menus: [demoMenu],
  cart: [],
  orders: [],
  isAuthenticated: true, // Demo: always authenticated
  currentPage: 'landing',
  editingMenuId: null,
  viewingSlug: null,
};

// Actions
type Action =
  | { type: 'SET_PAGE'; page: AppState['currentPage'] }
  | { type: 'SET_EDITING_MENU'; menuId: string | null }
  | { type: 'SET_VIEWING_SLUG'; slug: string | null }
  | { type: 'ADD_MENU'; menu: Menu }
  | { type: 'UPDATE_MENU'; menu: Menu }
  | { type: 'DELETE_MENU'; menuId: string }
  | { type: 'ADD_SECTION'; menuId: string; section: MenuSection }
  | { type: 'UPDATE_SECTION'; menuId: string; section: MenuSection }
  | { type: 'DELETE_SECTION'; menuId: string; sectionId: string }
  | { type: 'REORDER_SECTIONS'; menuId: string; sectionIds: string[] }
  | { type: 'ADD_ITEM'; menuId: string; sectionId: string; item: MenuItem }
  | { type: 'UPDATE_ITEM'; menuId: string; sectionId: string; item: MenuItem }
  | { type: 'DELETE_ITEM'; menuId: string; sectionId: string; itemId: string }
  | { type: 'REORDER_ITEMS'; menuId: string; sectionId: string; itemIds: string[] }
  | { type: 'MOVE_ITEM'; menuId: string; fromSectionId: string; toSectionId: string; itemId: string }
  | { type: 'ADD_TO_CART'; item: MenuItem }
  | { type: 'REMOVE_FROM_CART'; itemId: string }
  | { type: 'UPDATE_CART_QUANTITY'; itemId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_ORDER'; order: Order }
  | { type: 'UPDATE_USER'; user: Partial<UserProfile> };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, currentPage: action.page };
    case 'SET_EDITING_MENU':
      return { ...state, editingMenuId: action.menuId };
    case 'SET_VIEWING_SLUG':
      return { ...state, viewingSlug: action.slug };
    case 'ADD_MENU':
      return { ...state, menus: [...state.menus, action.menu] };
    case 'UPDATE_MENU':
      return {
        ...state,
        menus: state.menus.map(m => m.id === action.menu.id ? action.menu : m),
      };
    case 'DELETE_MENU':
      return { ...state, menus: state.menus.filter(m => m.id !== action.menuId) };
    case 'ADD_SECTION':
      return {
        ...state,
        menus: state.menus.map(m =>
          m.id === action.menuId
            ? { ...m, sections: [...m.sections, action.section] }
            : m
        ),
      };
    case 'UPDATE_SECTION':
      return {
        ...state,
        menus: state.menus.map(m =>
          m.id === action.menuId
            ? { ...m, sections: m.sections.map(s => s.id === action.section.id ? action.section : s) }
            : m
        ),
      };
    case 'DELETE_SECTION':
      return {
        ...state,
        menus: state.menus.map(m =>
          m.id === action.menuId
            ? { ...m, sections: m.sections.filter(s => s.id !== action.sectionId) }
            : m
        ),
      };
    case 'REORDER_SECTIONS':
      return {
        ...state,
        menus: state.menus.map(m => {
          if (m.id !== action.menuId) return m;
          const sectionMap = new Map(m.sections.map(s => [s.id, s]));
          return {
            ...m,
            sections: action.sectionIds.map((id, i) => ({
              ...sectionMap.get(id)!,
              position: i,
            })),
          };
        }),
      };
    case 'ADD_ITEM':
      return {
        ...state,
        menus: state.menus.map(m =>
          m.id === action.menuId
            ? {
                ...m,
                sections: m.sections.map(s =>
                  s.id === action.sectionId
                    ? { ...s, items: [...s.items, action.item] }
                    : s
                ),
              }
            : m
        ),
      };
    case 'UPDATE_ITEM':
      return {
        ...state,
        menus: state.menus.map(m =>
          m.id === action.menuId
            ? {
                ...m,
                sections: m.sections.map(s =>
                  s.id === action.sectionId
                    ? { ...s, items: s.items.map(i => i.id === action.item.id ? action.item : i) }
                    : s
                ),
              }
            : m
        ),
      };
    case 'DELETE_ITEM':
      return {
        ...state,
        menus: state.menus.map(m =>
          m.id === action.menuId
            ? {
                ...m,
                sections: m.sections.map(s =>
                  s.id === action.sectionId
                    ? { ...s, items: s.items.filter(i => i.id !== action.itemId) }
                    : s
                ),
              }
            : m
        ),
      };
    case 'REORDER_ITEMS':
      return {
        ...state,
        menus: state.menus.map(m => {
          if (m.id !== action.menuId) return m;
          return {
            ...m,
            sections: m.sections.map(s => {
              if (s.id !== action.sectionId) return s;
              const itemMap = new Map(s.items.map(i => [i.id, i]));
              return {
                ...s,
                items: action.itemIds.map((id, i) => ({
                  ...itemMap.get(id)!,
                  position: i,
                })),
              };
            }),
          };
        }),
      };
    case 'MOVE_ITEM':
      return {
        ...state,
        menus: state.menus.map(m => {
          if (m.id !== action.menuId) return m;
          const fromSection = m.sections.find(s => s.id === action.fromSectionId);
          const item = fromSection?.items.find(i => i.id === action.itemId);
          if (!item) return m;
          return {
            ...m,
            sections: m.sections.map(s => {
              if (s.id === action.fromSectionId) {
                return { ...s, items: s.items.filter(i => i.id !== action.itemId) };
              }
              if (s.id === action.toSectionId) {
                return { ...s, items: [...s.items, { ...item, position: s.items.length }] };
              }
              return s;
            }),
          };
        }),
      };
    case 'ADD_TO_CART': {
      const existing = state.cart.find(c => c.item.id === action.item.id);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map(c =>
            c.item.id === action.item.id ? { ...c, quantity: c.quantity + 1 } : c
          ),
        };
      }
      return { ...state, cart: [...state.cart, { item: action.item, quantity: 1 }] };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(c => c.item.id !== action.itemId) };
    case 'UPDATE_CART_QUANTITY':
      if (action.quantity <= 0) {
        return { ...state, cart: state.cart.filter(c => c.item.id !== action.itemId) };
      }
      return {
        ...state,
        cart: state.cart.map(c =>
          c.item.id === action.itemId ? { ...c, quantity: action.quantity } : c
        ),
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'ADD_ORDER':
      return { ...state, orders: [...state.orders, action.order], cart: [] };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.user } };
    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  currentPlan: Plan;
  editingMenu: Menu | null;
  viewingMenu: Menu | null;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  const currentPlan = plans.find(p => p.code === state.user.plan) || plans[0];
  const editingMenu = state.editingMenuId
    ? state.menus.find(m => m.id === state.editingMenuId) || null
    : null;
  const viewingMenu = state.viewingSlug
    ? state.menus.find(m => m.slug === state.viewingSlug) || null
    : null;

  return (
    <AppContext.Provider value={{ state, dispatch, currentPlan, editingMenu, viewingMenu }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toLocaleString('es-AR', { minimumFractionDigits: 0 })}`;
}
