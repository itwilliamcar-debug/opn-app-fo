import React, { useEffect, useState } from 'react';

/**
 * Anneau de chargement des tableaux.
 * Il tourne et le pourcentage avance tant que les données de l'API ne sont pas arrivées.
 */
export default function SpinnerPourcentage({ libelle = 'Chargement des données…' }) {
  const [pourcentage, setPourcentage] = useState(8);

  /* Le pourcentage monte vite au début, puis ralentit. Il s'arrête à 92 tant que l'appel n'est pas fini. */
  useEffect(() => {
    const minuteur = window.setInterval(() => {
      setPourcentage((actuel) => {
        if (actuel >= 92) return actuel;
        const pas = actuel < 45 ? 7 : actuel < 75 ? 3 : 1;
        return Math.min(92, actuel + pas);
      });
    }, 160);
    return () => window.clearInterval(minuteur);
  }, []);

  const tour = pourcentage * 3.6;

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6" role="status" aria-live="polite">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-slate-200 animate-spin" style={{ borderTopColor: '#2E68B4', animationDuration: '0.75s' }} />
        <div
          className="absolute inset-1 rounded-full"
          style={{
            background: `conic-gradient(#2E68B4 ${tour}deg, #e2e8f0 0deg)`,
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), #000 0)',
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), #000 0)',
          }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-[#0E2A4F]">
          {pourcentage}%
        </span>
      </div>
      <p className="text-xs text-slate-500">{libelle}</p>
    </div>
  );
}

/**
 * Ligne de tableau qui occupe toutes les colonnes pendant le chargement.
 */
export function LigneChargementTableau({ colonnes, libelle }) {
  return (
    <tr>
      <td colSpan={colonnes} className="py-4">
        <SpinnerPourcentage libelle={libelle} />
      </td>
    </tr>
  );
}
