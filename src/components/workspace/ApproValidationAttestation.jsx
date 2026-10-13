import React, { useState } from 'react';
import OpnLogo from '../common/OpnLogo';
import { formatXAF } from '../../utils/formatters';

/**
 * Modèle officiel d'attestation de validation nationale Appro — OPN Gabon.
 * Optimisé écran + impression A4.
 */
export default function ApproValidationAttestation({
  demande,
  validateur,
  issuedAt = new Date(),
  variant = 'full', // 'full' | 'compact'
}) {
  const [logoFailed, setLogoFailed] = useState(false);

  if (!demande) return null;

  const numero = demande.numero_demande || demande.numero || '—';
  const statut = String(demande.statut || '—').replace(/_/g, ' ');
  const montant = formatXAF(demande.montant_total_xaf ?? demande.montant);
  const validateurNom = validateur?.nom || validateur?.name || '—';
  const validateurRole =
    validateur?.role || 'Directrice des Approvisionnements Nationaux';
  const antenne =
    demande.antenne?.nom ||
    demande.antenne_nom ||
    demande.structure?.ville ||
    null;

  const dateLabel = (() => {
    try {
      const d = issuedAt instanceof Date ? issuedAt : new Date(issuedAt);
      return d.toLocaleString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return String(issuedAt);
    }
  })();

  const refDoc = `ATT-APPRO-${String(numero).replace(/[^A-Z0-9-]/gi, '')}-${(
    issuedAt instanceof Date ? issuedAt : new Date(issuedAt)
  )
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, '')}`;

  return (
    <article
      className={`appro-attestation bg-white text-slate-900 ${
        variant === 'compact' ? 'p-4' : 'p-0'
      }`}
      style={{ fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif' }}
    >
      {/* Liseré drapeau Gabon */}
      <div className="h-2 w-full flex">
        <div className="flex-1 bg-[#00A651]" />
        <div className="flex-1 bg-[#FFDE16]" />
        <div className="flex-1 bg-[#3A75C4]" />
      </div>

      <div className={`${variant === 'compact' ? 'px-4 py-4' : 'px-8 py-6'} space-y-5`}>
        {/* En-tête institutionnel */}
        <header className="flex items-start justify-between gap-4 border-b-2 border-[#2E68B4] pb-4">
          <div className="flex items-start gap-3 min-w-0">
            {!logoFailed ? (
              <img
                src="/logo-opn-official.png"
                alt="Logo Office Pharmaceutique National"
                className="h-16 w-auto object-contain shrink-0"
                onError={(e) => {
                  if (e.currentTarget.src.includes('official')) {
                    e.currentTarget.src = '/logo-opn.png';
                  } else {
                    setLogoFailed(true);
                  }
                }}
              />
            ) : (
              <OpnLogo className="h-16" variant="full" />
            )}
            <div className="min-w-0 pt-0.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#00A651]">
                République Gabonaise
              </p>
              <p className="text-[11px] font-semibold text-[#2E68B4] mt-0.5">
                Ministère de la Santé
              </p>
              <p className="text-sm font-black text-slate-900 mt-1.5 leading-tight">
                Office Pharmaceutique National
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Centrale Nationale d&apos;Achat du Médicament · Hub Owendo
              </p>
            </div>
          </div>

          <div className="text-right shrink-0 hidden sm:block">
            <div className="inline-flex flex-col items-end rounded border border-slate-200 bg-slate-50 px-3 py-2">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Réf. document
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-700 mt-0.5">
                {refDoc}
              </span>
            </div>
          </div>
        </header>

        {/* Titre */}
        <div className="text-center space-y-2 py-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00A651]/10 border border-[#00A651]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00A651]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#008742]">
              Document officiel · Validation nationale
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#2E68B4]">
            Attestation de validation nationale Appro
          </h1>
          <p className="text-[11px] text-slate-500 max-w-md mx-auto">
            Certifie la décision du Poste Approvisionnement National relative à la demande
            ci-dessous.
          </p>
        </div>

        {/* Corps — champs */}
        <section className="rounded-md border border-slate-200 overflow-hidden">
          <div className="bg-[#2E68B4] px-4 py-2">
            <p className="text-[11px] font-bold text-white uppercase tracking-wider">
              Mentions de l&apos;attestation
            </p>
          </div>
          <dl className="divide-y divide-slate-100">
            <Row label="N° demande" value={numero} mono emphasize />
            <Row
              label="Statut"
              value={
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wide">
                  {statut}
                </span>
              }
            />
            {antenne && <Row label="Antenne / zone" value={antenne} />}
            <Row label="Validateur" value={validateurNom} emphasize />
            <Row label="Rôle" value={validateurRole} />
            <Row label="Date" value={dateLabel} />
            <Row label="Montant" value={montant} emphasize accent />
          </dl>
        </section>

        {/* Signature */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div className="rounded-md border border-dashed border-slate-300 bg-slate-50/80 p-4 min-h-[110px]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
              Cachet OPN — Appro National
            </p>
            <div className="flex items-center justify-center h-16">
              <div className="w-20 h-20 rounded-full border-2 border-[#00A651]/40 flex items-center justify-center relative">
                <div className="absolute inset-1 rounded-full border border-[#FFDE16]/60" />
                <OpnLogo className="h-10" variant="symbol" />
              </div>
            </div>
          </div>
          <div className="rounded-md border border-slate-200 p-4 min-h-[110px]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Signature du validateur
            </p>
            <p className="text-sm font-bold text-slate-900">{validateurNom}</p>
            <p className="text-[11px] text-slate-600 mt-0.5">{validateurRole}</p>
            <div className="mt-6 border-b border-slate-300 w-full" />
            <p className="text-[10px] text-slate-400 mt-1">Signature électronique / manuscrite</p>
          </div>
        </section>

        {/* Pied de page */}
        <footer className="pt-4 border-t border-slate-200 space-y-2">
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Document généré depuis le <strong>Poste Appro National — Hub Owendo</strong>.
            Conservez une copie pour le dossier antenne.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-2 text-[9px] text-slate-400">
            <span>OPN Gabon · BP 3838 Libreville · Hub Central Owendo</span>
            <span className="font-mono">{refDoc}</span>
          </div>
        </footer>
      </div>

      {/* Bandeau bas drapeau */}
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-[#00A651]" />
        <div className="flex-1 bg-[#FFDE16]" />
        <div className="flex-1 bg-[#3A75C4]" />
      </div>
    </article>
  );
}

function Row({ label, value, mono = false, emphasize = false, accent = false }) {
  return (
    <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-3 px-4 py-2.5 items-start">
      <dt className="text-[11px] font-bold text-slate-500 uppercase tracking-wide pt-0.5">
        {label}
      </dt>
      <dd
        className={`text-sm ${mono ? 'font-mono' : ''} ${
          emphasize ? 'font-bold text-slate-900' : 'text-slate-800'
        } ${accent ? 'text-[#2E68B4] font-black text-base' : ''}`}
      >
        {value}
      </dd>
    </div>
  );
}
