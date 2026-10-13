import React from 'react';
import { Search, PlayCircle, Globe, Users, ShieldAlert } from 'lucide-react';

const SERVICES = [
  {
    id: 'recherche',
    titre: 'Recherche',
    texte: 'Retrouver un dossier, un produit, une antenne ou un agent dans tout le système.',
    action: 'Ouvrir la recherche',
    icon: Search,
  },
  {
    id: 'visite',
    titre: 'Visite guidée',
    texte: 'Parcourir les écrans du logiciel avec un scénario de démonstration.',
    action: 'Lancer la visite',
    icon: PlayCircle,
  },
  {
    id: 'portail',
    titre: 'Portail public',
    texte: 'Consulter le site public de l’OPN : produits, antennes, actualités et marchés.',
    action: 'Ouvrir le portail',
    icon: Globe,
  },
  {
    id: 'collegues',
    titre: 'Collègues en ligne',
    texte: 'Voir les agents connectés dans votre périmètre.',
    action: 'Voir les collègues',
    icon: Users,
  },
  {
    id: 'urgences',
    titre: 'Urgences',
    texte: 'Accéder au centre opérationnel des urgences sanitaires.',
    action: 'Ouvrir les urgences',
    icon: ShieldAlert,
    tone: 'alert',
  },
];

export default function CentreServices({
  onOpenSpotlight,
  onOpenDemoTour,
  onOpenPortal,
  onOpenColleagues,
  onOpenEmergency,
  emergencyCount = 0,
}) {
  const handlers = {
    recherche: onOpenSpotlight,
    visite: onOpenDemoTour,
    portail: onOpenPortal,
    collegues: onOpenColleagues,
    urgences: onOpenEmergency,
  };

  return (
    <div className="space-y-5 max-w-5xl">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#2E68B4]">Outils transverses</p>
        <h1 className="text-xl font-black text-slate-900">Centre de services</h1>
        <p className="text-sm text-slate-600 mt-1">
          Recherche, visite guidée, portail public, collègues en ligne et urgences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {SERVICES.map((service) => {
          const Icon = service.icon;
          const alert = service.tone === 'alert';
          return (
            <article key={service.id} className="bg-white border border-slate-200 rounded-md p-4 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <span className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${alert ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-[#2E68B4]'}`}>
                  <Icon className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    {service.titre}
                    {service.id === 'urgences' && emergencyCount > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-600 text-white">{emergencyCount}</span>
                    )}
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">{service.texte}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handlers[service.id]}
                className={`self-start px-3 py-1.5 text-xs font-bold rounded ${alert ? 'bg-rose-600 text-white' : 'bg-[#0E2A4F] text-white'}`}
              >
                {service.action}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
