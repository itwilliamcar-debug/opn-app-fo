const FALLBACK_FLUX = [
  { code: 'G2', titre: 'Wagon Setrag N°884', trajet: 'Owendo ➔ Franceville (36h)', statut: 'En Transit', tone: 'transit' },
  { code: 'G8', titre: 'Convoi Maritime N°12', trajet: 'Port-Gentil (12h)', statut: 'À Quai', tone: 'quai' },
  { code: 'G4', titre: 'Chaîne du Froid 2°C–8°C', trajet: 'Mouila & Ndendé', statut: 'Contrôle OK', tone: 'ok' },
];

const TONE = {
  transit: { box: 'bg-[#00A651]', badge: 'text-[#00FF87] bg-emerald-950/40 border-emerald-500/30' },
  quai: { box: 'bg-[#2E68B4]', badge: 'text-cyan-300 bg-cyan-950/40 border-cyan-500/30' },
  ok: { box: 'bg-[#DC143C]', badge: 'text-[#FFDE16] bg-amber-950/40 border-amber-500/30' },
  alerte: { box: 'bg-rose-700', badge: 'text-rose-200 bg-rose-950/40 border-rose-500/30' },
};

export default function SuiviLogistiqueDirect({ className = '', flux = null }) {
  const items = flux === null ? FALLBACK_FLUX : flux;
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
        {items.length === 0 ? (
          <div className="p-3 bg-black/25 rounded-md border border-white/10 text-[11px] text-blue-200">
            Aucun convoi actif pour le moment.
          </div>
        ) : items.map((item) => {
          const tone = TONE[item.tone] || TONE.transit;
          return (
            <div key={`${item.code}-${item.titre}`} className="flex items-center justify-between gap-3 p-2.5 bg-black/25 rounded-md border border-white/10">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-7 h-7 rounded ${tone.box} text-white flex items-center justify-center font-bold text-xs shrink-0`}>{item.code}</div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{item.titre}</p>
                  <p className="text-[10px] text-blue-200 truncate">{item.trajet}</p>
                </div>
              </div>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border shrink-0 ${tone.badge}`}>{item.statut}</span>
            </div>
          );
        })}
      </div>

      <div className="pt-2 border-t border-white/15 flex flex-wrap items-center justify-between gap-2 text-[11px] text-blue-200">
        <span>Régulation : <strong className="text-white">ANINF / CNPDCP</strong></span>
        <span>Devise : <strong className="text-white font-bold">Franc CFA (FCFA XAF)</strong></span>
      </div>
    </div>
  );
}
