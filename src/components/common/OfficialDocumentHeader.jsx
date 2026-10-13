import React from 'react';
import OpnLogo from './OpnLogo';

export default function OfficialDocumentHeader({
  title = "DOCUMENT OFFICIEL",
  subtitle = "Direction des Approvisionnements & de la Logistique",
  reference = "OPN-DOC-2026-001",
  date = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
  showFlag = true,
  rightExtra = null
}) {
  return (
    <div className="w-full mb-6 select-none">
      {/* 1. Tricolor Ribbon */}
      {showFlag && (
        <div className="h-2 w-full flex rounded-t overflow-hidden mb-4 shadow-xs">
          <div className="bg-[#009E60] flex-1" />
          <div className="bg-[#FCD116] flex-1" />
          <div className="bg-[#3A75C4] flex-1" />
        </div>
      )}

      {/* 2. Institutional Header Grid */}
      <div className="flex flex-row items-center justify-between border-b-2 border-slate-900 pb-4 gap-4">
        
        {/* Left: Gabonese Republic */}
        <div className="text-left w-52 shrink-0">
          <p className="font-black text-[11px] uppercase tracking-wider text-slate-900 leading-tight">
            RÉPUBLIQUE GABONAISE
          </p>
          <p className="text-[9px] font-bold text-slate-600 italic">
            Union — Travail — Justice
          </p>
          <div className="w-12 h-0.5 bg-[#009E60] my-1" />
          <p className="text-[8.5px] font-bold text-slate-700 uppercase leading-snug">
            MINISTÈRE DE LA SANTÉ ET DES AFFAIRES SOCIALES
          </p>
        </div>

        {/* Center: Official Logo & OPN Designation */}
        <div className="flex flex-col items-center text-center flex-1 px-2">
          <div className="flex items-center justify-center gap-2.5 mb-1.5">
            <OpnLogo className="h-10 w-auto" variant="full" />
          </div>
          <p className="text-[9.5px] font-extrabold text-slate-800 uppercase tracking-wide">
            {subtitle}
          </p>
          <p className="text-[8px] text-slate-500 font-medium">
            Centrale Nationale d'Achat des Médicaments et Dispositifs Médicaux
          </p>
        </div>

        {/* Right: Reference & Date */}
        <div className="text-right w-48 shrink-0 text-[9px] text-slate-600">
          <p className="font-bold text-slate-900 uppercase">Réf. Document :</p>
          <p className="font-mono text-[#009E60] font-black text-[10px]">{reference}</p>
          <p className="text-slate-500 mt-0.5">{date}</p>
          {rightExtra ? (
            <div className="mt-1">{rightExtra}</div>
          ) : (
            <p className="font-mono text-[7.5px] text-slate-400 mt-1 uppercase">SOUVERAINETÉ-GABON</p>
          )}
        </div>

      </div>
    </div>
  );
}
