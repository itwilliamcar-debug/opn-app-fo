import React from 'react';
import { formatXAF } from '../../utils/formatters';
import { formatSeuilHint, getVisaCircuit } from '../../data/rbacMatrix';

function FlagBar() {
  return (
    <div className="daf-report-flag flex h-1.5 w-full overflow-hidden rounded-sm">
      <span className="flex-1 bg-[#009E60]" />
      <span className="flex-1 bg-[#FCD116]" />
      <span className="flex-1 bg-[#3A75C4]" />
    </div>
  );
}

function ReportHeader({ subtitle }) {
  return (
    <div className="mb-6">
      <FlagBar />
      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            République Gabonaise · Ministère de la Santé
          </p>
          <p className="text-sm font-black uppercase tracking-wide text-[#1e3a8a]">
            Office Pharmaceutique National (OPN)
          </p>
          <p className="text-[11px] font-semibold text-[#00A651]">
            Direction Administrative et Financière — Libreville
          </p>
        </div>
        <div className="text-right text-[10px] text-slate-500 leading-relaxed">
          <p>BP 50 Libreville · Gabon</p>
          <p>daf@opn.ga</p>
          <p>Confidentiel — usage métier OPN</p>
        </div>
      </div>
      {subtitle && (
        <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-teal-800 border-t border-slate-200 pt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function ReportFooter({ page, total, refNumero }) {
  return (
    <div className="daf-report-footer mt-auto pt-4 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-500">
      <span>{refNumero}</span>
      <span>OPN Gabon — Rapport financier DAF</span>
      <span>
        Page {page}/{total}
      </span>
    </div>
  );
}

/**
 * Document multi-pages A4 — Rapport financier DAF
 * (page de garde, synthèse, engagements, marchés, clôture)
 */
export default function DafFinancialReportDocument({
  operator,
  orders = [],
  suppliers = [],
  purchaseOrders = [],
  issuedAt = new Date(),
}) {
  const issuedLabel = issuedAt.toLocaleString('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short',
  });
  const stamp = issuedAt.toISOString().slice(0, 10);
  const refNumero = `OPN-DAF-RF-${stamp.replace(/-/g, '')}`;

  const enVisaDaf = orders.filter((d) => d.statut === 'EN_VISA_DAF');
  const enVisaDg = orders.filter((d) => d.statut === 'EN_VISA_DG');
  const approuvees = orders.filter((d) =>
    ['APPROUVEE_CIRCUIT', 'TRANSMISE_ACHATS', 'VALIDEE_NATIONALE'].includes(d.statut)
  );
  const rejetees = orders.filter((d) => d.statut === 'REJETEE_VISA');
  const circuit = orders.filter((d) =>
    ['EN_VISA_DAF', 'EN_VISA_DG', 'APPROUVEE_CIRCUIT', 'TRANSMISE_ACHATS', 'REJETEE_VISA', 'VALIDEE_NATIONALE'].includes(
      d.statut
    )
  );

  const engagementEncours = circuit
    .filter((d) => ['EN_VISA_DAF', 'EN_VISA_DG', 'APPROUVEE_CIRCUIT', 'TRANSMISE_ACHATS'].includes(d.statut))
    .reduce((s, d) => s + (Number(d.montant_total_xaf) || 0), 0);

  const montantApprouve = approuvees.reduce((s, d) => s + (Number(d.montant_total_xaf) || 0), 0);
  const montantRejete = rejetees.reduce((s, d) => s + (Number(d.montant_total_xaf) || 0), 0);
  const montantEnAttente = [...enVisaDaf, ...enVisaDg].reduce(
    (s, d) => s + (Number(d.montant_total_xaf) || 0),
    0
  );

  const trancheBas = orders.filter((d) => Number(d.montant_total_xaf) <= 5_000_000);
  const trancheMid = orders.filter((d) => {
    const m = Number(d.montant_total_xaf) || 0;
    return m > 5_000_000 && m <= 20_000_000;
  });
  const trancheHaut = orders.filter((d) => Number(d.montant_total_xaf) > 20_000_000);

  const byStatut = {};
  circuit.forEach((d) => {
    const key = d.statut || 'INCONNU';
    if (!byStatut[key]) byStatut[key] = { statut: key, count: 0, montant: 0 };
    byStatut[key].count += 1;
    byStatut[key].montant += Number(d.montant_total_xaf) || 0;
  });
  const statutRows = Object.values(byStatut).sort((a, b) => b.montant - a.montant);

  const engagementsTable = circuit
    .slice()
    .sort((a, b) => (Number(b.montant_total_xaf) || 0) - (Number(a.montant_total_xaf) || 0));

  const totalPages = 5;
  const operatorNom = operator?.nom || 'Mme Chantal NZENGUE OBIANG';
  const operatorEntite = operator?.entite || 'Direction Administrative et Financière - Libreville';
  const operatorRole = operator?.role || 'Directrice Administrative et Financière';

  return (
    <div id="daf-financial-report-print" className="daf-financial-report bg-white text-slate-900">
      {/* ——— PAGE 1 : GARDE ——— */}
      <section className="daf-report-page flex flex-col min-h-[257mm] px-10 py-8">
        <FlagBar />
        <div className="mt-10 text-center space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500">
            République Gabonaise
          </p>
          <p className="text-xs font-semibold text-[#00A651]">Ministère de la Santé</p>
          <h1 className="text-2xl font-black text-[#1e3a8a] tracking-tight mt-4">
            OFFICE PHARMACEUTIQUE NATIONAL
          </h1>
          <p className="text-sm font-bold text-teal-800">Direction Administrative et Financière</p>
        </div>

        <div className="my-12 mx-auto w-full max-w-xl rounded-md border-2 border-[#2E68B4] bg-slate-50 px-8 py-10 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2E68B4]">
            Rapport financier
          </p>
          <h2 className="mt-3 text-xl font-black text-slate-900 leading-snug">
            Synthèse des activités DAF
            <br />
            <span className="text-base font-bold text-teal-800">Espace métier OPN</span>
          </h2>
          <p className="mt-4 text-xs text-slate-600">
            Engagements budgétaires · Visas · Marchés &amp; fournisseurs · Suivi des circuits
          </p>
          <p className="mt-6 font-mono text-[11px] font-bold text-slate-800">{refNumero}</p>
          <p className="mt-1 text-[11px] text-slate-500">Émis le {issuedLabel}</p>
        </div>

        <div className="mt-auto space-y-4 text-xs">
          <div className="rounded border border-slate-200 bg-white p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Émetteur</p>
            <p className="mt-1 font-bold text-slate-900">{operatorNom}</p>
            <p className="text-slate-600">{operatorRole}</p>
            <p className="text-slate-500">{operatorEntite}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div className="rounded border border-slate-200 p-3">
              <p className="text-slate-500 font-semibold">Périmètre</p>
              <p className="font-bold text-slate-800 mt-0.5">National — toutes antennes OPN</p>
            </div>
            <div className="rounded border border-slate-200 p-3">
              <p className="text-slate-500 font-semibold">Classification</p>
              <p className="font-bold text-slate-800 mt-0.5">Usage interne métier</p>
            </div>
          </div>
          <ReportFooter page={1} total={totalPages} refNumero={refNumero} />
        </div>
      </section>

      {/* ——— PAGE 2 : SYNTHÈSE ——— */}
      <section className="daf-report-page flex flex-col min-h-[257mm] px-10 py-8">
        <ReportHeader subtitle="1. Synthèse budgétaire & indicateurs DAF" />

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="rounded border border-teal-200 bg-teal-50/60 p-3">
            <p className="text-[10px] font-bold uppercase text-teal-800">Engagements en circuit</p>
            <p className="text-lg font-black text-teal-900 mt-1">{formatXAF(engagementEncours)}</p>
            <p className="text-[10px] text-teal-700 mt-1">{circuit.length} dossier(s) dans le périmètre visa</p>
          </div>
          <div className="rounded border border-amber-200 bg-amber-50/60 p-3">
            <p className="text-[10px] font-bold uppercase text-amber-900">En attente de visa</p>
            <p className="text-lg font-black text-amber-950 mt-1">{formatXAF(montantEnAttente)}</p>
            <p className="text-[10px] text-amber-800 mt-1">
              DAF : {enVisaDaf.length} · DG : {enVisaDg.length}
            </p>
          </div>
          <div className="rounded border border-emerald-200 bg-emerald-50/60 p-3">
            <p className="text-[10px] font-bold uppercase text-emerald-800">Approuvés / transmis</p>
            <p className="text-lg font-black text-emerald-900 mt-1">{formatXAF(montantApprouve)}</p>
            <p className="text-[10px] text-emerald-700 mt-1">{approuvees.length} dossier(s)</p>
          </div>
          <div className="rounded border border-rose-200 bg-rose-50/60 p-3">
            <p className="text-[10px] font-bold uppercase text-rose-800">Rejets visa</p>
            <p className="text-lg font-black text-rose-900 mt-1">{formatXAF(montantRejete)}</p>
            <p className="text-[10px] text-rose-700 mt-1">{rejetees.length} dossier(s)</p>
          </div>
        </div>

        <h3 className="mt-6 text-xs font-black uppercase tracking-wider text-slate-700">
          Seuils de circuit (XAF)
        </h3>
        <table className="mt-2 w-full text-[11px] border-collapse">
          <thead>
            <tr className="bg-slate-100 text-left text-[10px] uppercase text-slate-500">
              <th className="border border-slate-200 px-2 py-1.5">Tranche</th>
              <th className="border border-slate-200 px-2 py-1.5 text-right">Nb dossiers</th>
              <th className="border border-slate-200 px-2 py-1.5 text-right">Montant</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 px-2 py-1.5">≤ 5 M — sans visa DIR/DAF/DG</td>
              <td className="border border-slate-200 px-2 py-1.5 text-right font-bold">{trancheBas.length}</td>
              <td className="border border-slate-200 px-2 py-1.5 text-right">
                {formatXAF(trancheBas.reduce((s, d) => s + (Number(d.montant_total_xaf) || 0), 0))}
              </td>
            </tr>
            <tr>
              <td className="border border-slate-200 px-2 py-1.5">5–20 M — circuit DIR → DAF</td>
              <td className="border border-slate-200 px-2 py-1.5 text-right font-bold">{trancheMid.length}</td>
              <td className="border border-slate-200 px-2 py-1.5 text-right">
                {formatXAF(trancheMid.reduce((s, d) => s + (Number(d.montant_total_xaf) || 0), 0))}
              </td>
            </tr>
            <tr>
              <td className="border border-slate-200 px-2 py-1.5">&gt; 20 M — circuit DIR → DAF → DG</td>
              <td className="border border-slate-200 px-2 py-1.5 text-right font-bold">{trancheHaut.length}</td>
              <td className="border border-slate-200 px-2 py-1.5 text-right">
                {formatXAF(trancheHaut.reduce((s, d) => s + (Number(d.montant_total_xaf) || 0), 0))}
              </td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-6 text-xs font-black uppercase tracking-wider text-slate-700">
          Répartition par statut
        </h3>
        <table className="mt-2 w-full text-[11px] border-collapse">
          <thead>
            <tr className="bg-slate-100 text-left text-[10px] uppercase text-slate-500">
              <th className="border border-slate-200 px-2 py-1.5">Statut</th>
              <th className="border border-slate-200 px-2 py-1.5 text-right">Nb</th>
              <th className="border border-slate-200 px-2 py-1.5 text-right">Montant XAF</th>
            </tr>
          </thead>
          <tbody>
            {statutRows.length === 0 ? (
              <tr>
                <td colSpan={3} className="border border-slate-200 px-2 py-3 text-center text-slate-500">
                  Aucune donnée circuit.
                </td>
              </tr>
            ) : (
              statutRows.map((row) => (
                <tr key={row.statut}>
                  <td className="border border-slate-200 px-2 py-1.5 font-semibold">
                    {(row.statut || '').replace(/_/g, ' ')}
                  </td>
                  <td className="border border-slate-200 px-2 py-1.5 text-right font-bold">{row.count}</td>
                  <td className="border border-slate-200 px-2 py-1.5 text-right text-[#2E68B4] font-semibold">
                    {formatXAF(row.montant)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="mt-auto">
          <ReportFooter page={2} total={totalPages} refNumero={refNumero} />
        </div>
      </section>

      {/* ——— PAGE 3 : ENGAGEMENTS ——— */}
      <section className="daf-report-page flex flex-col min-h-[257mm] px-10 py-8">
        <ReportHeader subtitle="2. Détail des engagements & visas" />
        <p className="text-[11px] text-slate-600 mb-3">
          Liste des dossiers du circuit financier DAF (tri montant décroissant). Circuit appliqué selon
          les seuils OPN.
        </p>
        <table className="w-full text-[10px] border-collapse">
          <thead>
            <tr className="bg-[#2E68B4] text-white text-left uppercase tracking-wide">
              <th className="border border-[#245794] px-1.5 py-1.5">N°</th>
              <th className="border border-[#245794] px-1.5 py-1.5">Demandeur</th>
              <th className="border border-[#245794] px-1.5 py-1.5">Statut</th>
              <th className="border border-[#245794] px-1.5 py-1.5">Circuit</th>
              <th className="border border-[#245794] px-1.5 py-1.5 text-right">Montant</th>
            </tr>
          </thead>
          <tbody>
            {engagementsTable.length === 0 ? (
              <tr>
                <td colSpan={5} className="border border-slate-200 px-2 py-4 text-center text-slate-500">
                  Aucun engagement dans le périmètre.
                </td>
              </tr>
            ) : (
              engagementsTable.slice(0, 28).map((d) => {
                const circuitInfo = getVisaCircuit(d.montant_total_xaf);
                return (
                  <tr key={d.id || d.numero_demande} className="odd:bg-slate-50">
                    <td className="border border-slate-200 px-1.5 py-1 font-mono font-semibold">
                      {d.numero_demande}
                    </td>
                    <td className="border border-slate-200 px-1.5 py-1">{d.demandeur_nom || '—'}</td>
                    <td className="border border-slate-200 px-1.5 py-1">
                      {(d.statut || '').replace(/_/g, ' ')}
                    </td>
                    <td className="border border-slate-200 px-1.5 py-1 text-slate-600">
                      {circuitInfo.steps.length ? circuitInfo.steps.join(' → ') : 'Sans visa'}
                    </td>
                    <td className="border border-slate-200 px-1.5 py-1 text-right font-bold text-[#2E68B4]">
                      {formatXAF(d.montant_total_xaf)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        {engagementsTable.length > 28 && (
          <p className="mt-2 text-[10px] text-slate-500 italic">
            + {engagementsTable.length - 28} dossier(s) complémentaires — consulter l&apos;export CSV
            pour la liste exhaustive.
          </p>
        )}
        <div className="mt-4 rounded border border-slate-200 bg-slate-50 p-3 text-[10px] text-slate-600">
          <p className="font-bold text-slate-800 mb-1">Rappel seuils</p>
          <p>{formatSeuilHint(5_000_000)}</p>
          <p>{formatSeuilHint(10_000_000)}</p>
          <p>{formatSeuilHint(25_000_000)}</p>
        </div>
        <div className="mt-auto">
          <ReportFooter page={3} total={totalPages} refNumero={refNumero} />
        </div>
      </section>

      {/* ——— PAGE 4 : MARCHÉS ——— */}
      <section className="daf-report-page flex flex-col min-h-[257mm] px-10 py-8">
        <ReportHeader subtitle="3. Marchés, fournisseurs & bons de commande" />

        <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
          Fournisseurs référencés ({suppliers.length})
        </h3>
        <table className="mt-2 w-full text-[10px] border-collapse">
          <thead>
            <tr className="bg-slate-100 text-left text-[10px] uppercase text-slate-500">
              <th className="border border-slate-200 px-2 py-1.5">Raison sociale</th>
              <th className="border border-slate-200 px-2 py-1.5">Pays / Ville</th>
              <th className="border border-slate-200 px-2 py-1.5">Contact</th>
              <th className="border border-slate-200 px-2 py-1.5">Statut</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan={4} className="border border-slate-200 px-2 py-3 text-center text-slate-500">
                  Aucun fournisseur chargé.
                </td>
              </tr>
            ) : (
              suppliers.slice(0, 15).map((f) => (
                <tr key={f.id || f.nom || f.raison_sociale}>
                  <td className="border border-slate-200 px-2 py-1 font-semibold">
                    {f.raison_sociale || f.nom || '—'}
                  </td>
                  <td className="border border-slate-200 px-2 py-1">
                    {[f.pays, f.ville].filter(Boolean).join(' · ') || '—'}
                  </td>
                  <td className="border border-slate-200 px-2 py-1">{f.email || f.telephone || '—'}</td>
                  <td className="border border-slate-200 px-2 py-1">{f.statut || f.status || 'Actif'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <h3 className="mt-6 text-xs font-black uppercase tracking-wider text-slate-700">
          Bons de commande ({purchaseOrders.length})
        </h3>
        <table className="mt-2 w-full text-[10px] border-collapse">
          <thead>
            <tr className="bg-slate-100 text-left text-[10px] uppercase text-slate-500">
              <th className="border border-slate-200 px-2 py-1.5">Réf. BC</th>
              <th className="border border-slate-200 px-2 py-1.5">Fournisseur</th>
              <th className="border border-slate-200 px-2 py-1.5">Statut</th>
              <th className="border border-slate-200 px-2 py-1.5 text-right">Montant</th>
            </tr>
          </thead>
          <tbody>
            {purchaseOrders.length === 0 ? (
              <tr>
                <td colSpan={4} className="border border-slate-200 px-2 py-3 text-center text-slate-500">
                  Aucun bon de commande.
                </td>
              </tr>
            ) : (
              purchaseOrders.slice(0, 18).map((bc) => (
                <tr key={bc.id || bc.numero || bc.reference}>
                  <td className="border border-slate-200 px-2 py-1 font-mono font-semibold">
                    {bc.numero || bc.reference || bc.numero_bc || `BC-${bc.id}`}
                  </td>
                  <td className="border border-slate-200 px-2 py-1">
                    {bc.fournisseur?.raison_sociale || bc.fournisseur_nom || bc.supplier_name || '—'}
                  </td>
                  <td className="border border-slate-200 px-2 py-1">
                    {(bc.statut || bc.status || '—').toString().replace(/_/g, ' ')}
                  </td>
                  <td className="border border-slate-200 px-2 py-1 text-right font-bold text-[#2E68B4]">
                    {formatXAF(bc.montant_total_xaf ?? bc.montant ?? bc.total_xaf ?? 0)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="mt-auto">
          <ReportFooter page={4} total={totalPages} refNumero={refNumero} />
        </div>
      </section>

      {/* ——— PAGE 5 : CLÔTURE ——— */}
      <section className="daf-report-page flex flex-col min-h-[257mm] px-10 py-8">
        <ReportHeader subtitle="4. Conclusions & attestation de clôture" />

        <div className="space-y-4 text-xs leading-relaxed text-slate-700">
          <p>
            Le présent rapport financier synthétise l&apos;activité de la Direction Administrative et
            Financière de l&apos;OPN au {issuedLabel}. Il couvre les engagements budgétaires soumis au
            circuit des visas (DIR / DAF / DG), la répartition par seuils, ainsi que le suivi des
            fournisseurs et bons de commande associés à l&apos;espace métier.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Engagements en circuit : <strong>{formatXAF(engagementEncours)}</strong>
            </li>
            <li>
              Visas DAF en attente : <strong>{enVisaDaf.length}</strong> dossier(s) (
              {formatXAF(enVisaDaf.reduce((s, d) => s + (Number(d.montant_total_xaf) || 0), 0))})
            </li>
            <li>
              Dossiers approuvés / transmis : <strong>{approuvees.length}</strong>
            </li>
            <li>
              Rejets : <strong>{rejetees.length}</strong>
            </li>
          </ul>
          <p>
            Ce document constitue une pièce de travail interne. Toute diffusion externe nécessite
            l&apos;accord de la Direction Générale OPN.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-8 text-xs">
          <div className="rounded border border-slate-200 p-4 min-h-[140px]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              La Directrice Administrative et Financière
            </p>
            <p className="mt-2 font-bold text-slate-900">{operatorNom}</p>
            <p className="text-slate-500 mt-8 border-t border-dashed border-slate-300 pt-2">
              Signature &amp; cachet
            </p>
          </div>
          <div className="rounded border border-slate-200 p-4 min-h-[140px]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Visa Direction Générale (si requis)
            </p>
            <p className="mt-2 text-slate-600">Dr. Jean-Bernard OBAME NDONG — DG OPN</p>
            <p className="text-slate-500 mt-8 border-t border-dashed border-slate-300 pt-2">
              Signature &amp; cachet
            </p>
          </div>
        </div>

        <div className="mt-8 rounded bg-slate-100 border border-slate-200 px-4 py-3 text-[10px] text-slate-600">
          <p className="font-bold text-slate-800">Fin du rapport — {refNumero}</p>
          <p className="mt-1">
            Généré depuis le poste métier DAF · OPN Digital Hub · {issuedLabel}
          </p>
        </div>

        <div className="mt-auto">
          <ReportFooter page={5} total={totalPages} refNumero={refNumero} />
        </div>
      </section>
    </div>
  );
}
