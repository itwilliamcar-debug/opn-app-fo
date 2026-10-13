import React, { useState } from 'react';
import { GABON_PROVINCES } from '../../data/gabonProvinces';
import gabonMapPaths from '../../data/gabonMapPaths.json';
import gabonMapCoords from '../../data/gabonMapCoordinates.json';
import { PROVINCES_STRATEGIC_DATA } from '../../data/strategicDashboardData';

export default function GabonOfficialInteractiveMap({
  selectedProvinceId = 'G1',
  onSelectProvince,
  showTransitLines = true,
  activeLayer = 'stocks', // 'stocks' | 'pistes' | 'froid' | 'crise'
  provincesData = PROVINCES_STRATEGIC_DATA,
  className = "w-full h-full max-h-[460px]"
}) {
  const [hoveredProvinceId, setHoveredProvinceId] = useState(null);

  const hubCoords = gabonMapCoords['G1']?.center || { x: 110, y: 175 };

  // Helper pour trouver les métadonnées de la province
  const getProvinceMeta = (provKey) => {
    return provincesData.find(p => p.id === provKey) || GABON_PROVINCES.find(p => p.id === provKey);
  };

  // Déterminer la couleur de remplissage selon la couche active
  const getLayerFill = (provKey, isSelected, isHovered) => {
    if (isSelected) return "url(#grad-selected)";
    if (isHovered) return "url(#grad-hover)";

    const prov = getProvinceMeta(provKey);

    if (activeLayer === 'pistes') {
      if (prov?.pistesStatus?.etat === 'COUPEE_DEVIATION') return "url(#grad-rose)";
      if (prov?.pistesStatus?.etat === 'RALENTI') return "url(#grad-amber)";
      return "url(#grad-emerald)";
    }

    if (activeLayer === 'froid') {
      if (prov?.froidIoT?.statut === 'CRITIQUE') return "url(#grad-rose)";
      if (prov?.froidIoT?.statut === 'VIGILANCE') return "url(#grad-amber)";
      return "url(#grad-cyan)";
    }

    if (activeLayer === 'crise') {
      if (prov?.criseSanitaire?.alerteNiveau === 'ROUGE') return "url(#grad-rose)";
      if (prov?.criseSanitaire?.alerteNiveau === 'JAUNE') return "url(#grad-amber)";
      return "url(#grad-emerald)";
    }

    // Défaut : stocks
    if (prov?.couvertureJours != null) {
      if (prov.couvertureJours < 45 || prov?.statutStock === 'CRITIQUE') return "url(#grad-rose)";
      if (prov.couvertureJours < 60 || prov?.statutStock === 'VIGILANCE') return "url(#grad-amber)";
      return "url(#grad-default)";
    }

    return "url(#grad-default)";
  };

  return (
    <div className="relative w-full flex flex-col items-center select-none">
      
      {/* SVG Canvas de la Carte Vectorielle Administrative du Gabon */}
      <svg
        id="map-gabon-opn"
        viewBox="0 0 520 520"
        className={`${className} filter drop-shadow-md`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Carte administrative officielle du Gabon par provinces"
      >
        <defs>
          {/* Dégradé Sélectionné (Jaune d'Or / Vert OPN) */}
          <linearGradient id="grad-selected" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00A651" />
            <stop offset="100%" stopColor="#007A3D" />
          </linearGradient>

          {/* Dégradé Hover (Bleu vif) */}
          <linearGradient id="grad-hover" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          {/* Fond carte */}
          <linearGradient id="grad-default" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2E68B4" />
            <stop offset="100%" stopColor="#1E4F8E" />
          </linearGradient>

          {/* Dégradé Émeraude (Normal / Fluide) */}
          <linearGradient id="grad-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          {/* Dégradé Ambre (Vigilance / Ralenti) */}
          <linearGradient id="grad-amber" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* Dégradé Rose/Rouge (Critique / Coupée) */}
          <linearGradient id="grad-rose" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F43F5E" />
            <stop offset="100%" stopColor="#BE123C" />
          </linearGradient>

          {/* Dégradé Cyan (Froid IoT Optimal) */}
          <linearGradient id="grad-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#0E7490" />
          </linearGradient>

          {/* Filtre Glow pour la province sélectionnée */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Tracés des 9 Provinces du Gabon (Rendu vectoriel officiel OPN) */}
        <g id="provinces-layer" className="transition-all duration-300">
          {Object.entries(gabonMapPaths).map(([provKey, pathData]) => {
            const isSelected = selectedProvinceId === provKey;
            const isHovered = hoveredProvinceId === provKey;
            const provData = getProvinceMeta(provKey);

            const fillColor = getLayerFill(provKey, isSelected, isHovered);
            let strokeColor = "#FFFFFF";
            let strokeWidth = "1";

            if (isSelected) {
              strokeColor = "#FFDE16";
              strokeWidth = "2.8";
            } else if (isHovered) {
              strokeColor = "#FFFFFF";
              strokeWidth = "2";
            }

            return (
              <path
                key={provKey}
                id={provKey.toLowerCase()}
                d={pathData}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="cursor-pointer transition-all duration-200"
                style={{
                  filter: isSelected ? 'url(#glow)' : 'none',
                  transformOrigin: 'center center'
                }}
                onMouseEnter={() => setHoveredProvinceId(provKey)}
                onMouseLeave={() => setHoveredProvinceId(null)}
                onClick={() => onSelectProvince && onSelectProvince(provKey)}
              >
                <title>{provData ? `${provData.nom} (${provData.chefLieu})` : provKey}</title>
              </path>
            );
          })}
        </g>

        {/* 2. Lignes Logistiques d'Acheminement depuis le Hub Central d'Owendo (G1) */}
        {showTransitLines && (
          <g id="logistics-routes" className="pointer-events-none">
            {Object.entries(gabonMapCoords).map(([key, meta]) => {
              if (key === 'G1') return null;
              const isSelected = selectedProvinceId === key;
              const prov = getProvinceMeta(key);

              let lineColor = isSelected ? "#FFDE16" : "#FFFFFF";
              if (activeLayer === 'pistes' && prov?.pistesStatus?.etat === 'COUPEE_DEVIATION') {
                lineColor = "#F43F5E";
              }

              return (
                <line
                  key={`line-${key}`}
                  x1={hubCoords.x}
                  y1={hubCoords.y}
                  x2={meta.center.x}
                  y2={meta.center.y}
                  stroke={lineColor}
                  strokeWidth={isSelected ? "2.5" : "1.2"}
                  strokeDasharray={isSelected ? "none" : (activeLayer === 'pistes' ? "3 3" : "4 4")}
                  opacity={isSelected ? "1.0" : "0.55"}
                  className={isSelected ? "animate-pulse" : ""}
                />
              );
            })}
          </g>
        )}

        {/* 3. Balises & Noeuds d'Antennes des 9 Chefs-Lieux Provinciaux */}
        <g id="antennes-markers">
          {Object.entries(gabonMapCoords).map(([key, meta]) => {
            const isSelected = selectedProvinceId === key;
            const isHovered = hoveredProvinceId === key;
            const cx = meta.center.x;
            const cy = meta.center.y;
            const prov = getProvinceMeta(key);

            // Badge contextuel selon la couche active
            let layerBadgeText = meta.chefLieu;
            if (activeLayer === 'froid' && prov?.froidIoT?.temperature) {
              layerBadgeText = `${meta.chefLieu} (${prov.froidIoT.temperature})`;
            } else if (activeLayer === 'stocks' && prov?.couvertureJours != null) {
              layerBadgeText = `${meta.chefLieu} • ${prov.couvertureJours}j`;
            } else if (activeLayer === 'crise' && prov?.criseSanitaire?.alerteNiveau) {
              layerBadgeText = `${meta.chefLieu} [${prov.criseSanitaire.alerteNiveau}]`;
            }

            return (
              <g
                key={`marker-${key}`}
                className="cursor-pointer group"
                onClick={() => onSelectProvince && onSelectProvince(key)}
                onMouseEnter={() => setHoveredProvinceId(key)}
                onMouseLeave={() => setHoveredProvinceId(null)}
              >
                {/* Radar d'animation pulsé pour l'antenne sélectionnée ou le Hub */}
                {(isSelected || meta.hub) && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? "19" : "13"}
                    fill={isSelected ? "#FFDE16" : "#00A651"}
                    opacity="0.4"
                    className="animate-ping"
                  />
                )}

                {/* Point d'ancrage provincial */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 8 : (isHovered ? 7 : 5.5)}
                  fill={isSelected ? "#FFDE16" : (meta.hub ? "#00A651" : "#FFFFFF")}
                  stroke={isSelected ? "#0F2B52" : "#1E4F8E"}
                  strokeWidth="2.2"
                  className="transition-all duration-200"
                />

                {/* Étiquette du Chef-Lieu avec cartouche pour lisibilité maximale */}
                <g transform={`translate(${cx + 9}, ${cy + 4})`}>
                  <rect
                    x="-2"
                    y="-11"
                    width={layerBadgeText.length * 6.4 + 9}
                    height="14"
                    rx="3"
                    fill={isSelected ? "#0A1E3B" : "rgba(255,255,255,0.95)"}
                    stroke={isSelected ? "#FFDE16" : "#94A3B8"}
                    strokeWidth="0.9"
                    className="drop-shadow-xs"
                  />
                  <text
                    x="2"
                    y="-1"
                    fill={isSelected ? "#FFDE16" : "#0F172A"}
                    fontSize="9"
                    fontWeight={isSelected ? "800" : "700"}
                    fontFamily="'Plus Jakarta Sans', sans-serif"
                    className="select-none pointer-events-none"
                  >
                    {layerBadgeText}
                  </text>
                </g>
              </g>
            );
          })}
        </g>
      </svg>

      {/* 4. Légende & Badge Couche Active */}
      <div className="w-full mt-3 pt-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00A651] animate-pulse" />
          <span className="font-bold text-slate-800 text-[11px]">
            Hub National : <strong className="text-[#2E68B4]">Owendo (Libreville)</strong>
          </span>
        </div>

        {activeLayer === 'stocks' && (
          <div className="flex items-center gap-3 text-[10.5px] text-slate-600">
            <span className="flex items-center gap-1 font-medium"><span className="w-2.5 h-2.5 rounded-sm bg-[#2E68B4]" /> &gt; 60 Jours</span>
            <span className="flex items-center gap-1 font-medium"><span className="w-2.5 h-2.5 rounded-sm bg-[#F59E0B]" /> 45–60 Jours</span>
            <span className="flex items-center gap-1 font-medium"><span className="w-2.5 h-2.5 rounded-sm bg-[#F43F5E]" /> &lt; 45 Jours</span>
          </div>
        )}

        {activeLayer === 'pistes' && (
          <div className="flex items-center gap-3 text-[10.5px] text-slate-600">
            <span className="flex items-center gap-1 font-medium"><span className="w-2.5 h-2.5 rounded-sm bg-[#10B981]" /> Praticable</span>
            <span className="flex items-center gap-1 font-medium"><span className="w-2.5 h-2.5 rounded-sm bg-[#F59E0B]" /> Ralenti (Pluie)</span>
            <span className="flex items-center gap-1 font-medium"><span className="w-2.5 h-2.5 rounded-sm bg-[#F43F5E]" /> Déviation / Bourbier</span>
          </div>
        )}

        {activeLayer === 'froid' && (
          <div className="flex items-center gap-3 text-[10.5px] text-slate-600">
            <span className="flex items-center gap-1 font-medium"><span className="w-2.5 h-2.5 rounded-sm bg-[#06B6D4]" /> +2°C à +8°C Conforme</span>
            <span className="flex items-center gap-1 font-medium"><span className="w-2.5 h-2.5 rounded-sm bg-[#F59E0B]" /> Vigilance</span>
            <span className="flex items-center gap-1 font-medium"><span className="w-2.5 h-2.5 rounded-sm bg-[#F43F5E]" /> Dérive Critique</span>
          </div>
        )}

        {activeLayer === 'crise' && (
          <div className="flex items-center gap-3 text-[10.5px] text-slate-600">
            <span className="flex items-center gap-1 font-medium"><span className="w-2.5 h-2.5 rounded-sm bg-[#10B981]" /> Veille Verte</span>
            <span className="flex items-center gap-1 font-medium"><span className="w-2.5 h-2.5 rounded-sm bg-[#F59E0B]" /> Surveillance Jaune</span>
            <span className="flex items-center gap-1 font-medium"><span className="w-2.5 h-2.5 rounded-sm bg-[#F43F5E]" /> Alerte Rouge</span>
          </div>
        )}
      </div>

    </div>
  );
}
