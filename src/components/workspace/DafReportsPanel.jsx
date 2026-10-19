import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Download,
  FileSpreadsheet,
  Loader2,
  Printer,
  RefreshCw,
  Scale,
  X,
} from 'lucide-react';
import {
  fetchOrders,
  fetchPurchaseOrders,
  fetchSuppliers,
} from '../../services/api';
import { formatXAF } from '../../utils/formatters';
import { getVisaCircuit } from '../../data/rbacMatrix';
import DafFinancialReportDocument from './DafFinancialReportDocument';

const FILE_STATUSES = [
  'EN_VISA_DAF',
  'EN_VISA_DG',
  'APPROUVEE_CIRCUIT',
  'TRANSMISE_ACHATS',
  'REJETEE_VISA',
  'VALIDEE_NATIONALE',
];

function downloadCsv(filename, rows) {
  const bom = '\uFEFF';
  const csv = rows.map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(';')).join('\n');
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Rapports DAF — synthèse écran + aperçu impression du Rapport financier multi-pages.
 */
export default function DafReportsPanel({ activePersona, sanctumReady = false }) {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [issuedAt, setIssuedAt] = useState(() => new Date());

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ordRes, supRes, poRes] = await Promise.all([
        fetchOrders(),
        fetchSuppliers().catch(() => ({ fournisseurs: [] })),
        fetchPurchaseOrders().catch(() => ({ commandes: [] })),
      ]);
      setOrders(Array.isArray(ordRes?.demandes) ? ordRes.demandes : []);
      setSuppliers(
        Array.isArray(supRes?.fournisseurs) ? supRes.fournisseurs : (Array.isArray(supRes) ? supRes : [])
      );
      setPurchaseOrders(
        Array.isArray(poRes?.commandes)
          ? poRes.commandes
          : (Array.isArray(poRes?.orders) ? poRes.orders : (Array.isArray(poRes) ? poRes : []))
      );
      if (!ordRes?.demandes) {
        setError(ordRes?.message || 'Impossible de charger les engagements DAF.');
      }
    } catch (err) {
      setOrders([]);
      setError(err?.backendUnavailable ? null : (err?.message || 'Impossible de charger les engagements.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, activePersona]);

  const circuit = useMemo(
    () => orders.filter((d) => FILE_STATUSES.includes(d.statut)),
    [orders]
  );

  const kpis = useMemo(() => {
    const enVisaDaf = circuit.filter((d) => d.statut === 'EN_VISA_DAF');
    const engagement = circuit
      .filter((d) => ['EN_VISA_DAF', 'EN_VISA_DG', 'APPROUVEE_CIRCUIT', 'TRANSMISE_ACHATS'].includes(d.statut))
      .reduce((s, d) => s + (Number(d.montant_total_xaf) || 0), 0);
    const approuvees = circuit.filter((d) =>
      ['APPROUVEE_CIRCUIT', 'TRANSMISE_ACHATS', 'VALIDEE_NATIONALE'].includes(d.statut)
    ).length;
    const rejetees = circuit.filter((d) => d.statut === 'REJETEE_VISA').length;
    return {
      enVisaDaf: enVisaDaf.length,
      engagement,
      approuvees,
      rejetees,
      count: circuit.length,
    };
  }, [circuit]);

  const handleExportCsv = () => {
    const header = [
      'Numero',
      'Statut',
      'Demandeur',
      'Antenne',
      'Montant_XAF',
      'Circuit',
      'Created_at',
    ];
    const rows = [
      header,
      ...circuit.map((d) => [
        d.numero_demande,
        d.statut,
        d.demandeur_nom,
        d.antenne?.nom || '',
        d.montant_total_xaf ?? 0,
        getVisaCircuit(d.montant_total_xaf).steps.join('>') || 'SANS_VISA',
        d.created_at || '',
      ]),
    ];
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(`OPN_Rapport_Financier_DAF_${stamp}.csv`, rows);
  };

  const openPrintPreview = () => {
    setIssuedAt(new Date());
    setPreviewOpen(true);
  };

  const handlePrintFromPreview = () => {
    // Laisse le modal peindre puis déclenche l'aperçu navigateur (toutes les pages)
    requestAnimationFrame(() => {
      setTimeout(() => window.print(), 150);
    });
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {!sanctumReady && (
        <div className="p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-start gap-2 print:hidden">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          Session Sanctum inactive — le rapport financier peut être incomplet jusqu&apos;à Accès Intranet.
        </div>
      )}

      <div className="bg-white p-5 rounded-md border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <p className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
            Rapports Appro &amp; Attestations
          </p>
          <h1 className="text-xl font-black text-[#2E68B4] mt-0.5">
            Synthèse Appro National
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Opérateur : <strong>{activePersona?.nom || 'Mme Chantal NZENGUE OBIANG'}</strong>
            {activePersona?.entite ? ` · ${activePersona.entite}` : ' · Direction Administrative et Financière - Libreville'}
          </p>
          <p className="text-[11px] text-teal-800 font-semibold mt-1 flex items-center gap-1">
            <Scale className="w-3.5 h-3.5" />
            Impression = Rapport financier DAF (garde · synthèse · engagements · marchés · clôture)
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="px-3 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={!circuit.length}
            className="px-3 py-2 rounded-md bg-[#00A651] hover:bg-[#008742] text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            type="button"
            onClick={openPrintPreview}
            disabled={loading}
            className="px-3 py-2 rounded-md bg-[#2E68B4] hover:bg-[#245794] text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimer
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold print:hidden">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-20 text-xs text-slate-500 print:hidden">
          <Loader2 className="w-5 h-5 animate-spin" />
          Chargement des données financières…
        </div>
      ) : (
        <div className="print:hidden space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-md border border-slate-200">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Dossiers circuit</p>
              <p className="text-2xl font-black text-[#2E68B4] mt-1">{kpis.count}</p>
            </div>
            <div className="bg-white p-4 rounded-md border border-slate-200">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Engagements</p>
              <p className="text-sm font-black text-teal-800 mt-1">{formatXAF(kpis.engagement)}</p>
            </div>
            <div className="bg-white p-4 rounded-md border border-slate-200">
              <p className="text-[10px] font-bold text-slate-500 uppercase">En visa DAF</p>
              <p className="text-2xl font-black text-amber-700 mt-1">{kpis.enVisaDaf}</p>
            </div>
            <div className="bg-white p-4 rounded-md border border-slate-200">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Approuvés / Rejets</p>
              <p className="text-sm font-bold text-slate-800 mt-1">
                {kpis.approuvees}
                <span className="text-slate-400 mx-1">·</span>
                <span className="text-rose-700">{kpis.rejetees}</span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-teal-700" />
              <h3 className="text-sm font-bold text-slate-900">Aperçu engagements (écran)</h3>
            </div>
            <div className="overflow-x-auto max-h-72">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider sticky top-0">
                  <tr>
                    <th className="text-left px-4 py-2 font-bold">N°</th>
                    <th className="text-left px-4 py-2 font-bold">Demandeur</th>
                    <th className="text-left px-4 py-2 font-bold">Statut</th>
                    <th className="text-right px-4 py-2 font-bold">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {circuit.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                        Aucune donnée circuit.
                      </td>
                    </tr>
                  ) : (
                    circuit.slice(0, 25).map((d) => (
                      <tr key={d.id} className="border-t border-slate-100">
                        <td className="px-4 py-2 font-mono font-semibold">{d.numero_demande}</td>
                        <td className="px-4 py-2 text-slate-700">{d.demandeur_nom}</td>
                        <td className="px-4 py-2">{(d.statut || '').replace(/_/g, ' ')}</td>
                        <td className="px-4 py-2 text-right text-[#2E68B4] font-semibold">
                          {formatXAF(d.montant_total_xaf)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Aperçu avant impression — Rapport financier multi-pages */}
      {previewOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6 bg-slate-900/55 print:bg-white print:p-0 print:static print:inset-auto">
          <div className="w-full max-w-4xl max-h-[94vh] overflow-y-auto bg-slate-200 rounded-md shadow-2xl print:shadow-none print:max-w-none print:max-h-none print:overflow-visible print:bg-white print:rounded-none">
            <div className="sticky top-0 z-10 flex items-center justify-between gap-2 px-4 py-3 bg-white border-b border-slate-200 print:hidden">
              <div>
                <p className="text-sm font-bold text-[#2E68B4]">Aperçu — Rapport financier DAF</p>
                <p className="text-[11px] text-slate-500">
                  5 pages · garde · synthèse · engagements · marchés · clôture
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintFromPreview}
                  className="px-3 py-1.5 rounded-md bg-[#2E68B4] hover:bg-[#245794] text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Imprimer / PDF
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewOpen(false)}
                  className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500"
                  aria-label="Fermer l'aperçu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-3 sm:p-5 print:p-0">
              <DafFinancialReportDocument
                operator={activePersona}
                orders={orders}
                suppliers={suppliers}
                purchaseOrders={purchaseOrders}
                issuedAt={issuedAt}
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm 10mm 14mm 10mm;
          }
          body * {
            visibility: hidden !important;
          }
          #daf-financial-report-print,
          #daf-financial-report-print * {
            visibility: visible !important;
          }
          #daf-financial-report-print {
            position: absolute !important;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
          }
          .daf-report-page {
            break-after: page;
            page-break-after: always;
            min-height: auto !important;
            padding: 0 !important;
          }
          .daf-report-page:last-child {
            break-after: auto;
            page-break-after: auto;
          }
        }
      `}</style>
    </div>
  );
}
