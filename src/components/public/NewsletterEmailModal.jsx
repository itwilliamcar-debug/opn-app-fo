import React from 'react';
import { X, Mail, CheckCircle2, Printer, ShieldCheck, Calendar, Building2 } from 'lucide-react';

export default function NewsletterEmailModal({ isOpen, onClose, subscriberEmail, article, isFirstSubscription = true }) {
  if (!isOpen) return null;

  const defaultArticle = {
    id: "ACT-01",
    title: "Réception de 45 tonnes de solutés massifs au Hub Central d'Owendo",
    date: "06 Septembre 2026",
    tag: "Logistique & Approvisionnement",
    summary: "Arrivée au port d'Owendo d'un convoi maritime prioritaire composé de chlorure de sodium, glucose et solutés de réanimation destinés aux CHU et hôpitaux régionaux.",
    content: "La Direction Générale de l'OPN a supervisé la réception de 45 tonnes métriques de solutés massifs. Ce lot stratégique permet de sécuriser 90 jours d'autonomie pour les 9 provinces du Gabon. Le dispatching vers les antennes de l'intérieur du pays a débuté ce matin via le convoi ferroviaire Setrag et des camions sécurisés climatisés."
  };

  const currentArticle = article || defaultArticle;

  const now = new Date();
  const dateFormatted = now.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  const timeFormatted = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">

        {/* Chrome client mail — sobre */}
        <div className="px-5 py-3.5 bg-slate-800 text-white flex items-center justify-between shrink-0 border-b border-slate-700">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-md bg-slate-700 border border-slate-600 text-slate-200 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white truncate">
                Aperçu — Lettre d&apos;information OPN
              </h3>
              <p className="text-[11px] text-slate-400 truncate">
                {isFirstSubscription
                  ? 'Message de confirmation d\'abonnement'
                  : 'Diffusion d\'une actualité officielle'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-md text-xs font-medium flex items-center gap-1.5 border border-slate-600"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimer</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-700"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* En-têtes e-mail */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 text-[11px] text-slate-600 space-y-1.5 shrink-0">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p>
              <span className="text-slate-500">De</span>{' '}
              <span className="font-semibold text-slate-800">OPN Alertes</span>
              <span className="text-slate-500"> &lt;alertes@opn-gabon.com&gt;</span>
            </p>
            <p className="text-slate-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {dateFormatted} · {timeFormatted}
            </p>
          </div>
          <p>
            <span className="text-slate-500">À</span>{' '}
            <span className="font-semibold text-slate-800">{subscriberEmail || 'abonne@exemple.ga'}</span>
          </p>
          <p className="pt-0.5">
            <span className="text-slate-500">Objet</span>{' '}
            <span className="font-bold text-slate-900">
              OPN Infos — {currentArticle.title}
            </span>
          </p>
        </div>

        {/* Corps newsletter */}
        <div className="overflow-y-auto flex-1 bg-[#EEF1F5] p-4 sm:p-6">
          <article className="max-w-xl mx-auto bg-white border border-slate-200 shadow-sm overflow-hidden">

            <header className="bg-[#1E3A5F] text-white px-6 py-5">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1.5 min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-300">
                    Office Pharmaceutique National
                  </p>
                  <h1 className="text-lg font-bold tracking-tight text-white">
                    Lettre d&apos;information
                  </h1>
                  <p className="text-[11px] text-slate-300">
                    Centrale nationale d&apos;achat du médicament — République Gabonaise
                  </p>
                </div>
                <img
                  src="/logo-opn-white-footer.png"
                  alt="OPN"
                  className="h-10 w-auto object-contain opacity-95 shrink-0 hidden sm:block"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            </header>

            <div className="px-6 py-5 space-y-5 text-[13px] text-slate-700 leading-relaxed">

              {isFirstSubscription && (
                <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-md">
                  <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2E68B4]" />
                    Abonnement confirmé
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Votre adresse est désormais inscrite aux alertes et communiqués de l&apos;OPN.
                    Voici un extrait de la dernière publication officielle.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                    {currentArticle.tag}
                  </span>
                  <span>{currentArticle.date}</span>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-[#1E3A5F] leading-snug">
                  {currentArticle.title}
                </h2>

                <p className="text-sm text-slate-800 font-medium border-l-2 border-[#2E68B4] pl-3">
                  {currentArticle.summary}
                </p>

                <p className="text-justify text-slate-600">
                  {currentArticle.content}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-600">
                <div className="flex items-start gap-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800">Contact général</p>
                    <p>(+241) 074 35 79 29</p>
                    <p>contact@opn-gabon.com</p>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Direction commerciale</p>
                  <p>062 26 17 32 · 062 26 14 75</p>
                  <p>commercial@opn-gabon.com</p>
                </div>
              </div>
            </div>

            <footer className="bg-slate-100 px-6 py-4 text-center text-[10px] text-slate-500 space-y-1 border-t border-slate-200">
              <p>
                Message destiné à <strong className="text-slate-700">{subscriberEmail || 'abonne@exemple.ga'}</strong>.
                Vous pouvez vous désabonner via le lien fourni dans chaque envoi.
              </p>
              <p>© {new Date().getFullYear()} Office Pharmaceutique National (OPN) — Tous droits réservés.</p>
            </footer>
          </article>
        </div>

        <div className="px-5 py-3 bg-white border-t border-slate-200 flex items-center justify-between gap-3 text-xs shrink-0">
          <p className="text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            Aperçu d&apos;affichage — envoi réel selon configuration messagerie
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#2E68B4] hover:bg-[#245794] text-white rounded-md font-semibold text-xs transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
