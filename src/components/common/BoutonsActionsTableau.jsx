import React from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';

/**
 * Bouton d'action d'un tableau : l'icône seule est visible, le libellé reste dans l'infobulle.
 */
function BoutonIcone({ titre, onClick, variante, children }) {
  const couleurs = {
    voir: 'text-slate-600 hover:bg-slate-100',
    modifier: 'text-[#2E68B4] hover:bg-blue-50',
    supprimer: 'text-rose-700 hover:bg-rose-50',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      title={titre}
      aria-label={titre}
      className={`inline-flex items-center justify-center p-1.5 rounded border border-slate-200 bg-white ${couleurs[variante]}`}
    >
      {children}
    </button>
  );
}

/** Ouvre le détail d'une ligne. */
export function BoutonVoir({ titre = 'Voir le détail', onClick }) {
  return (
    <BoutonIcone titre={titre} onClick={onClick} variante="voir">
      <Eye className="w-4 h-4" />
    </BoutonIcone>
  );
}

/** Ouvre la modification d'une ligne. Le crayon est l'icône de modification. */
export function BoutonModifier({ titre = 'Modifier', onClick }) {
  return (
    <BoutonIcone titre={titre} onClick={onClick} variante="modifier">
      <Pencil className="w-4 h-4" />
    </BoutonIcone>
  );
}

/** Supprime une ligne. */
export function BoutonSupprimer({ titre = 'Supprimer', onClick }) {
  return (
    <BoutonIcone titre={titre} onClick={onClick} variante="supprimer">
      <Trash2 className="w-4 h-4" />
    </BoutonIcone>
  );
}
