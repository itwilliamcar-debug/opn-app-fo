import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  X,
  Pill,
  ShieldCheck,
  UserCheck,
  Thermometer,
  Truck,
  Receipt,
  Building2,
  Zap,
  ArrowRight,
  CornerDownLeft,
  Command,
  Layers
} from 'lucide-react';
import {
  SPOTLIGHT_CATEGORIES,
  SPOTLIGHT_GLOBAL_ENTITIES
} from '../../data/spotlightSearchIndex';

export default function OpnSpotlightModal({
  isOpen,
  onClose,
  onNavigateModule,
  activePersona
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Focus input automatically when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setSelectedIndex(0);
    } else {
      setSearchQuery('');
      setSelectedCategory('all');
    }
  }, [isOpen]);

  // Filter entities
  const filteredEntities = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return SPOTLIGHT_GLOBAL_ENTITIES.filter((item) => {
      // Category match
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      if (!matchCat) return false;

      // Query match
      if (!q) return true;
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSubtitle = item.subtitle.toLowerCase().includes(q);
      const matchBadge = item.badge?.toLowerCase().includes(q);
      const matchTarget = item.targetModule?.toLowerCase().includes(q);
      const matchMeta = item.meta ? Object.values(item.meta).some(v => String(v).toLowerCase().includes(q)) : false;

      return matchTitle || matchSubtitle || matchBadge || matchTarget || matchMeta;
    });
  }, [searchQuery, selectedCategory]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredEntities.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredEntities.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredEntities[selectedIndex]) {
          handleSelectEntity(filteredEntities[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredEntities, selectedIndex, onClose]);

  const handleSelectEntity = (entity) => {
    if (onNavigateModule && entity.targetModule) {
      onNavigateModule(entity.targetModule);
    }
    onClose();
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'drugs': return <Pill className="w-4 h-4 text-emerald-600" />;
      case 'lots': return <ShieldCheck className="w-4 h-4 text-teal-600" />;
      case 'hr': return <UserCheck className="w-4 h-4 text-blue-600" />;
      case 'gmao': return <Thermometer className="w-4 h-4 text-cyan-600" />;
      case 'logistics': return <Truck className="w-4 h-4 text-amber-600" />;
      case 'docs': return <Receipt className="w-4 h-4 text-indigo-600" />;
      case 'provinces': return <Building2 className="w-4 h-4 text-[#2E68B4]" />;
      case 'actions': return <Zap className="w-4 h-4 text-amber-500" />;
      default: return <Layers className="w-4 h-4 text-slate-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[82vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Liseré Gabon */}
        <div className="h-1 w-full bg-gradient-to-r from-[#00A651] via-[#FFDE16] to-[#2E68B4]" />

        {/* Barre de Recherche Spotlight */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex items-center gap-3 shrink-0">
          <div className="p-2 bg-white rounded-xl border border-slate-200 text-[#2E68B4] shadow-2xs">
            <Search className="w-5 h-5" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Rechercher un médicament DCI, un N° de lot LNCM, un agent RH, un tag froid, un convoi, une antenne..."
            className="flex-1 bg-transparent border-none outline-none text-sm sm:text-base font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium"
          />

          <div className="flex items-center gap-2">
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded-md text-[10px] font-mono font-bold text-slate-500 shadow-2xs">
              <Command className="w-3 h-3" /> K
            </kbd>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filtres de Catégories */}
        <div className="px-4 py-2.5 bg-white border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
          {SPOTLIGHT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.id);
                setSelectedIndex(0);
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Liste des Résultats */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 max-h-[460px]">
          {filteredEntities.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Search className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-700">Aucun résultat trouvé pour « {searchQuery} »</p>
              <p className="text-xs text-slate-400 mt-1">Essayez avec un mot-clé comme : Artéméther, Mouila, LOT-ART, 800 kVA, CMM...</p>
            </div>
          ) : (
            filteredEntities.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectEntity(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-blue-50/80 border-[#2E68B4] shadow-xs'
                      : 'bg-white border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-slate-100 border border-slate-200 shrink-0 mt-0.5">
                      {getCategoryIcon(item.category)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                          {item.title}
                        </h4>
                        {item.badge && (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                            {item.badge}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {item.subtitle}
                      </p>

                      {/* Métadonnées contextuelles */}
                      {item.meta && (
                        <div className="flex items-center gap-3 text-[10.5px] text-slate-600 mt-1.5 font-medium">
                          {Object.entries(item.meta).map(([k, v]) => (
                            <span key={k} className="flex items-center gap-1">
                              <span className="text-slate-400">•</span>
                              <span>{String(v)}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden sm:inline-block text-[11px] font-bold text-slate-400">
                      Module : <strong className="text-slate-700">{item.targetModule}</strong>
                    </span>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                      isSelected ? 'bg-[#2E68B4] text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Barre de Pied de Page & Instructions Clavier */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500 shrink-0">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono font-bold text-[9.5px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono font-bold text-[9.5px]">↓</kbd>
              <span>Naviguer</span>
            </span>

            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono font-bold text-[9.5px]">Entrée</kbd>
              <span>Ouvrir</span>
            </span>

            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono font-bold text-[9.5px]">Échap</kbd>
              <span>Fermer</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-semibold text-slate-600">
            <Search className="w-3.5 h-3.5 text-amber-500" />
            <span>{filteredEntities.length} résultat{filteredEntities.length > 1 ? 's' : ''} indexé{filteredEntities.length > 1 ? 's' : ''}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
