export default function SuiviLogistiqueDirect({ className = '' }) {
  return (
    <div className={`bg-[#0F2B52] text-white rounded-lg border border-[#163E75] p-5 space-y-4 shadow-xl ${className}`}>
      <div className="flex items-center justify-between border-b border-white/15 pb-3 gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative flex items-center justify-center w-3 h-3 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF87] opacity-75" />
            <span className="animate-twinkle absolute inline-flex h-3 w-3 rounded-full bg-[#00FF87]/40 shadow-[0_0_12px_#00FF87]" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF87] shadow-[0_0_8px_#00FF87]" />
          </div>
          <span className="text-xs font-black text-white uppercase tracking-wider">
            Suivi Logistique en Direct
          </span>
        </div>
        <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/20 text-[#00FF87] border border-emerald-400/30 flex items-center gap-1.5 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF87] animate-pulse" />
          Hub Owendo Opérationnel
        </span>
      </div>

      <div className="space-y-2 text-xs text-blue-100">
        <div className="flex items-center justify-between gap-3 p-2.5 bg-black/25 rounded-md border border-white/10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded bg-[#00A651] text-white flex items-center justify-center font-bold text-xs shrink-0">G2</div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white">Wagon Setrag N°884</p>
              <p className="text-[10px] text-blue-200">Owendo ➔ Franceville (36h)</p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold text-[#00FF87] bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30 shrink-0">En Transit</span>
        </div>

        <div className="flex items-center justify-between gap-3 p-2.5 bg-black/25 rounded-md border border-white/10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded bg-[#2E68B4] text-white flex items-center justify-center font-bold text-xs shrink-0">G8</div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white">Convoi Maritime N°12</p>
              <p className="text-[10px] text-blue-200">Port-Gentil (12h)</p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30 shrink-0">À Quai</span>
        </div>

        <div className="flex items-center justify-between gap-3 p-2.5 bg-black/25 rounded-md border border-white/10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded bg-[#DC143C] text-white flex items-center justify-center font-bold text-xs shrink-0">G4</div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white">Chaîne du Froid 2°C–8°C</p>
              <p className="text-[10px] text-blue-200">Mouila & Ndendé</p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold text-[#FFDE16] bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30 shrink-0">Contrôle OK</span>
        </div>
      </div>

      <div className="pt-2 border-t border-white/15 flex flex-wrap items-center justify-between gap-2 text-[11px] text-blue-200">
        <span>Régulation : <strong className="text-white">ANINF / CNPDCP</strong></span>
        <span>Devise : <strong className="text-white font-bold">Franc CFA (FCFA XAF)</strong></span>
      </div>
    </div>
  );
}
