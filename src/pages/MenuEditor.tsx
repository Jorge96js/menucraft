import { useApp, formatPrice } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Plus, GripVertical, Trash2, Edit3, 
  Palette, Eye, Save, Image, Check, X, ChevronDown,
  ChevronUp, Settings, Link
} from 'lucide-react';
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MenuSection, MenuItem } from '../types';

// Sortable Section Component
function SortableSection({ 
  section, 
  menuId, 
  onEditSection, 
  onDeleteSection, 
  onAddItem, 
  onEditItem, 
  onDeleteItem,
  onMoveItem,
}: {
  section: MenuSection;
  menuId: string;
  onEditSection: (section: MenuSection) => void;
  onDeleteSection: (sectionId: string) => void;
  onAddItem: (sectionId: string) => void;
  onEditItem: (sectionId: string, item: MenuItem) => void;
  onDeleteItem: (sectionId: string, itemId: string) => void;
  onMoveItem: (fromSectionId: string, toSectionId: string, itemId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={`mb-6 ${isDragging ? 'opacity-50' : ''}`}>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Section Header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
          <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600">
            <GripVertical className="w-4 h-4" />
          </button>
          <h3 className="font-semibold text-gray-900 flex-1">{section.title}</h3>
          <span className="text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">
            {section.items.length} items
          </span>
          <button 
            onClick={() => onEditSection(section)}
            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDeleteSection(section.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Items */}
        <div className="p-4 space-y-3">
          <SortableContext items={section.items.map(i => i.id)} strategy={verticalListSortingStrategy}>
            {section.items
              .sort((a, b) => a.position - b.position)
              .map(item => (
                <SortableItem
                  key={item.id}
                  item={item}
                  sectionId={section.id}
                  onEdit={onEditItem}
                  onDelete={onDeleteItem}
                />
              ))}
          </SortableContext>
          
          <button 
            onClick={() => onAddItem(section.id)}
            className="w-full py-2 border border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:text-primary-600 hover:border-primary-300 hover:bg-primary-50/50 transition-all flex items-center justify-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Agregar artículo
          </button>
        </div>
      </div>
    </div>
  );
}

// Sortable Item Component
function SortableItem({ 
  item, 
  sectionId, 
  onEdit, 
  onDelete 
}: {
  item: MenuItem;
  sectionId: string;
  onEdit: (sectionId: string, item: MenuItem) => void;
  onDelete: (sectionId: string, itemId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors ${isDragging ? 'opacity-50 shadow-lg' : ''}`}
    >
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-0.5 text-gray-400 hover:text-gray-600">
        <GripVertical className="w-4 h-4" />
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-gray-900 truncate">{item.name}</p>
          {!item.available && (
            <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">No disponible</span>
          )}
        </div>
        <p className="text-sm text-gray-500 truncate">{item.description}</p>
      </div>
      <span className="font-semibold text-gray-900 text-sm whitespace-nowrap">
        {formatPrice(item.price)}
      </span>
      <button 
        onClick={() => onEdit(sectionId, item)}
        className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
      >
        <Edit3 className="w-4 h-4" />
      </button>
      <button 
        onClick={() => onDelete(sectionId, item.id)}
        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function MenuEditor() {
  const { state, dispatch, editingMenu, currentPlan } = useApp();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showDesignPanel, setShowDesignPanel] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [editingItem, setEditingItem] = useState<{ sectionId: string; item: MenuItem | null }>({ sectionId: '', item: null });
  const [editingSection, setEditingSection] = useState<MenuSection | null>(null);
  const [itemName, setItemName] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemAvailable, setItemAvailable] = useState(true);
  const [sectionTitle, setSectionTitle] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (!editingMenu) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Menú no encontrado</p>
      </div>
    );
  }

  const menu = editingMenu;

  // Section handlers
  const handleAddSection = () => {
    setEditingSection(null);
    setSectionTitle('');
    setShowSectionModal(true);
  };

  const handleEditSection = (section: MenuSection) => {
    setEditingSection(section);
    setSectionTitle(section.title);
    setShowSectionModal(true);
  };

  const handleSaveSection = () => {
    if (!sectionTitle.trim()) return;

    if (editingSection) {
      dispatch({
        type: 'UPDATE_SECTION',
        menuId: menu.id,
        section: { ...editingSection, title: sectionTitle.trim() },
      });
    } else {
      const newSection: MenuSection = {
        id: uuidv4(),
        title: sectionTitle.trim(),
        position: menu.sections.length,
        items: [],
      };
      dispatch({ type: 'ADD_SECTION', menuId: menu.id, section: newSection });
    }
    setShowSectionModal(false);
  };

  const handleDeleteSection = (sectionId: string) => {
    if (confirm('¿Eliminar esta sección y todos sus artículos?')) {
      dispatch({ type: 'DELETE_SECTION', menuId: menu.id, sectionId });
    }
  };

  // Item handlers
  const handleAddItem = (sectionId: string) => {
    setEditingItem({ sectionId, item: null });
    setItemName('');
    setItemDesc('');
    setItemPrice('');
    setItemAvailable(true);
    setShowItemModal(true);
  };

  const handleEditItem = (sectionId: string, item: MenuItem) => {
    setEditingItem({ sectionId, item });
    setItemName(item.name);
    setItemDesc(item.description);
    setItemPrice((item.price / 100).toString());
    setItemAvailable(item.available);
    setShowItemModal(true);
  };

  const handleSaveItem = () => {
    if (!itemName.trim() || !itemPrice) return;

    const priceCents = Math.round(parseFloat(itemPrice) * 100);

    if (editingItem.item) {
      dispatch({
        type: 'UPDATE_ITEM',
        menuId: menu.id,
        sectionId: editingItem.sectionId,
        item: {
          ...editingItem.item,
          name: itemName.trim(),
          description: itemDesc.trim(),
          price: priceCents,
          available: itemAvailable,
        },
      });
    } else {
      const newItem: MenuItem = {
        id: uuidv4(),
        name: itemName.trim(),
        description: itemDesc.trim(),
        price: priceCents,
        imageUrl: null,
        available: itemAvailable,
        position: 999,
      };
      dispatch({ type: 'ADD_ITEM', menuId: menu.id, sectionId: editingItem.sectionId, item: newItem });
    }
    setShowItemModal(false);
  };

  const handleDeleteItem = (sectionId: string, itemId: string) => {
    dispatch({ type: 'DELETE_ITEM', menuId: menu.id, sectionId, itemId });
  };

  // Drag handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // Check if it's a section reorder
    const sectionIds = menu.sections.map(s => s.id);
    if (sectionIds.includes(active.id as string) && sectionIds.includes(over.id as string)) {
      const oldIndex = sectionIds.indexOf(active.id as string);
      const newIndex = sectionIds.indexOf(over.id as string);
      const newOrder = arrayMove(sectionIds, oldIndex, newIndex);
      dispatch({ type: 'REORDER_SECTIONS', menuId: menu.id, sectionIds: newOrder });
      return;
    }

    // Check if it's an item reorder within same section
    for (const section of menu.sections) {
      const itemIds = section.items.map(i => i.id);
      if (itemIds.includes(active.id as string) && itemIds.includes(over.id as string)) {
        const oldIndex = itemIds.indexOf(active.id as string);
        const newIndex = itemIds.indexOf(over.id as string);
        const newOrder = arrayMove(itemIds, oldIndex, newIndex);
        dispatch({ type: 'REORDER_ITEMS', menuId: menu.id, sectionId: section.id, itemIds: newOrder });
        return;
      }
    }

    // Check if moving item between sections
    for (const section of menu.sections) {
      if (section.items.some(i => i.id === active.id)) {
        for (const targetSection of menu.sections) {
          if (targetSection.items.some(i => i.id === over.id) || targetSection.id === over.id) {
            if (section.id !== targetSection.id) {
              dispatch({ type: 'MOVE_ITEM', menuId: menu.id, fromSectionId: section.id, toSectionId: targetSection.id, itemId: active.id as string });
              return;
            }
          }
        }
      }
    }
  };

  // Design panel handlers
  const handleColorChange = (field: 'colorPrimary' | 'colorBg' | 'colorText', value: string) => {
    dispatch({
      type: 'UPDATE_MENU',
      menu: { ...menu, [field]: field === 'colorText' && !value ? null : value, updatedAt: new Date().toISOString() },
    });
  };

  const handleNameChange = (name: string) => {
    dispatch({ type: 'UPDATE_MENU', menu: { ...menu, name, updatedAt: new Date().toISOString() } });
  };

  const handleToggleActive = () => {
    dispatch({ type: 'UPDATE_MENU', menu: { ...menu, isActive: !menu.isActive, updatedAt: new Date().toISOString() } });
  };

  const handleOrderMessageChange = (msg: string) => {
    dispatch({ type: 'UPDATE_MENU', menu: { ...menu, orderMessage: msg, updatedAt: new Date().toISOString() } });
  };

  const sortedSections = [...menu.sections].sort((a, b) => a.position - b.position);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Editor Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => dispatch({ type: 'SET_PAGE', page: 'dashboard' })}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={menu.name}
                onChange={e => handleNameChange(e.target.value)}
                className="text-lg font-semibold text-gray-900 bg-transparent border-none outline-none focus:ring-0 p-0 w-48 sm:w-auto"
              />
              <span className="hidden sm:inline text-xs text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded">
                /m/{menu.slug}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { dispatch({ type: 'SET_VIEWING_SLUG', slug: menu.slug }); dispatch({ type: 'SET_PAGE', page: 'public' }); }}
                className="btn-ghost text-sm flex items-center gap-1"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Vista previa</span>
              </button>
              <button
                onClick={() => setShowDesignPanel(!showDesignPanel)}
                className={`btn-ghost text-sm flex items-center gap-1 ${showDesignPanel ? 'bg-primary-50 text-primary-700' : ''}`}
              >
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">Diseño</span>
              </button>
              <button
                onClick={handleToggleActive}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  menu.isActive 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {menu.isActive ? '● Activo' : '○ Inactivo'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Main Editor */}
          <div className="flex-1">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={sortedSections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                {sortedSections.map(section => (
                  <SortableSection
                    key={section.id}
                    section={section}
                    menuId={menu.id}
                    onEditSection={handleEditSection}
                    onDeleteSection={handleDeleteSection}
                    onAddItem={handleAddItem}
                    onEditItem={handleEditItem}
                    onDeleteItem={handleDeleteItem}
                    onMoveItem={(from, to, itemId) => dispatch({ type: 'MOVE_ITEM', menuId: menu.id, fromSectionId: from, toSectionId: to, itemId })}
                  />
                ))}
              </SortableContext>

              <DragOverlay>
                {activeId && (
                  <div className="bg-white rounded-xl border border-primary-300 shadow-xl p-4 opacity-90">
                    <p className="font-medium text-gray-900">Moviendo...</p>
                  </div>
                )}
              </DragOverlay>
            </DndContext>

            {/* Add Section Button */}
            <button
              onClick={handleAddSection}
              className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:text-primary-600 hover:border-primary-300 hover:bg-primary-50/50 transition-all flex items-center justify-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Agregar sección
            </button>
          </div>

          {/* Design Panel (Sidebar) */}
          <AnimatePresence>
            {showDesignPanel && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-80 flex-shrink-0 hidden lg:block"
              >
                <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Personalización
                  </h3>

                  {/* Colors */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Color principal</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={menu.colorPrimary}
                          onChange={e => handleColorChange('colorPrimary', e.target.value)}
                          className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={menu.colorPrimary}
                          onChange={e => handleColorChange('colorPrimary', e.target.value)}
                          className="input-field font-mono text-sm"
                          maxLength={7}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Color de fondo</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={menu.colorBg}
                          onChange={e => handleColorChange('colorBg', e.target.value)}
                          className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={menu.colorBg}
                          onChange={e => handleColorChange('colorBg', e.target.value)}
                          className="input-field font-mono text-sm"
                          maxLength={7}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Color de texto</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={menu.colorText || '#1f2937'}
                          onChange={e => handleColorChange('colorText', e.target.value)}
                          className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={menu.colorText || ''}
                          onChange={e => handleColorChange('colorText', e.target.value)}
                          placeholder="Automático"
                          className="input-field font-mono text-sm"
                          maxLength={7}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Dejalo vacío para detección automática</p>
                    </div>

                    {/* Quick Colors */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Colores rápidos</label>
                      <div className="flex gap-2 flex-wrap">
                        {['#f97316', '#ef4444', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#1f2937'].map(color => (
                          <button
                            key={color}
                            onClick={() => handleColorChange('colorPrimary', color)}
                            className="w-8 h-8 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Order Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Mensaje de pedido</label>
                      <textarea
                        value={menu.orderMessage}
                        onChange={e => handleOrderMessageChange(e.target.value)}
                        className="input-field text-sm resize-none"
                        rows={3}
                        placeholder="Hola, me gustaría encargar: {items}. Total: {total}"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Usá {'{items}'} y {'{total}'} como variables
                      </p>
                    </div>

                    {/* Link */}
                    <div className="pt-3 border-t border-gray-100">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Link público</label>
                      <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                        <Link className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 font-mono truncate">
                          menucraft.com/m/{menu.slug}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Item Modal */}
      <AnimatePresence>
        {showItemModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowItemModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {editingItem.item ? 'Editar artículo' : 'Nuevo artículo'}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      value={itemName}
                      onChange={e => setItemName(e.target.value)}
                      className="input-field"
                      placeholder="Ej: Hamburguesa completa"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <textarea
                      value={itemDesc}
                      onChange={e => setItemDesc(e.target.value)}
                      className="input-field resize-none"
                      rows={2}
                      placeholder="Descripción del plato..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
                    <input
                      type="number"
                      value={itemPrice}
                      onChange={e => setItemPrice(e.target.value)}
                      className="input-field"
                      placeholder="3500"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="available"
                      checked={itemAvailable}
                      onChange={e => setItemAvailable(e.target.checked)}
                      className="w-4 h-4 text-primary-600 rounded"
                    />
                    <label htmlFor="available" className="text-sm text-gray-700">Disponible</label>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
                <button onClick={() => setShowItemModal(false)} className="btn-secondary">Cancelar</button>
                <button 
                  onClick={handleSaveItem}
                  disabled={!itemName.trim() || !itemPrice}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Guardar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Section Modal */}
      <AnimatePresence>
        {showSectionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowSectionModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {editingSection ? 'Editar sección' : 'Nueva sección'}
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                  <input
                    type="text"
                    value={sectionTitle}
                    onChange={e => setSectionTitle(e.target.value)}
                    className="input-field"
                    placeholder="Ej: Entradas, Principales..."
                    autoFocus
                    onKeyDown={e => e.key === 'Enter' && handleSaveSection()}
                  />
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
                <button onClick={() => setShowSectionModal(false)} className="btn-secondary">Cancelar</button>
                <button 
                  onClick={handleSaveSection}
                  disabled={!sectionTitle.trim()}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Guardar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
