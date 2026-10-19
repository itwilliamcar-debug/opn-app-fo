import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Download,
  FileSpreadsheet,
  Loader2,
  Printer,
  RefreshCw,
} from 'lucide-react';
import { fetchOrders } from '../../services/api';
import { formatXAF } from '../../utils/formatters';

function daysBetween(from, to) {
  const a = new Date(from);
  const b = new Date(to);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return null;
  return Math.max(0, Math.round((b.getTime() - a.getTime()) / 86_400_000));
}

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

export default function ApproReportsPanel({ activePersona, sanctumReady = false }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchOrders();
      const list = Array.isArray(res?.demandes) ? res.demandes : [];
      setOrders(list);
      if (!res?.demandes) {
        setError(res?.message || 'Impossible de charger les demandes Appro.');
      }
    } catch (err) {
      setOrders([]);
      setError(err?.backendUnavailable ? null : (err?.message || 'Impossible de charger les demandes.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, activePersona]);

  const byStatut = useMemo(() => {
    const map = {};
    orders.forEach((d) => {
      const key = d.statut || 'INCONNU';
      if (!map[key]) map[key] = { statut: key, count: 0, montant: 0 };
      map[key].count += 1;
      map[key].montant += Number(d.montant_total_xaf) || 0;
    });
    return Object.values(map).sort((a, b) => b.count - a.count);
  }, [orders]);

  const delays = useMemo(() => {
    return orders
      .map((d) => {
        const jours = daysBetween(d.created_at, d.updated_at || d.created_at);
        return {
          id: d.id,
          numero: d.numero_demande,
          statut: d.statut,
          jours,
          montant: Number(d.montant_total_xaf) || 0,
          demandeur: d.demandeur_nom,
        };
      })
      .sort((a, b) => (b.jours ?? 0) - (a.jours ?? 0));
  }, [orders]);

  const montants = useMemo(() => {
    const total = orders.reduce((s, d) => s + (Number(d.montant_total_xaf) || 0), 0);
    const avg = orders.length ? total / orders.length : 0;
    const max = orders.reduce((m, d) => Math.max(m, Number(d.montant_total_xaf) || 0), 0);
    return { total, avg, max, count: orders.length };
  }, [orders]);

  const handleExportCsv = () => {
    const header = [
      'Numero',
      'Statut',
      'Demandeur',
      'Antenne',
      'Montant_XAF',
      'Created_at',
      'Updated_at',
      'Delai_jours',
    ];
    const rows = [
      header,
      ...orders.map((d) => [
        d.numero_demande,
        d.statut,
        d.demandeur_nom,
        d.antenne?.nom || '',
        d.montant_total_xaf ?? 0,
        d.created_at || '',
        d.updated_at || '',
        daysBetween(d.created_at, d.updated_at || d.created_at) ?? '',
      ]),
    ];
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(`OPN_Rapports_Appro_National_${stamp}.csv`, rows);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300" id="appro-reports-print">
      {!sanctumReady && (
        <div className="p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-start gap-2 print:hidden">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          Session Sanctum inactive — les rapports Appro peuvent être incomplets jusqu&apos;à Accès Intranet.
        </div>
      )}

      <div className="bg-white p-5 rounded-md border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold text-[#00A651] uppercase tracking-wider">
            Rapports Appro &amp; Attestations
          </p>
          <h1 className="text-xl font-black text-[#2E68B4] mt-0.5">
            Synthèse Appro National
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Opérateur : <strong>{activePersona?.nom || 'Directrice Appro'}</strong>
            {activePersona?.entite ? ` · ${activePersona.entite}` : ''}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 print:hidden">
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
            disabled={!orders.length}
            className="px-3 py-2 rounded-md bg-[#00A651] hover:bg-[#008742] text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-2 rounded-md bg-[#2E68B4] hover:bg-[#245794] text-white text-xs font-bold flex items-center gap-1.5"
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

      <p className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 print:hidden">
        Les PDF GED nationale restent consultables via <strong>OPN Connect → GED</strong> (module
        Collaborative). Ce panneau fournit la synthèse opérationnelle Appro exportable.
      </p>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-20 text-xs text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          Chargement des demandes…
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-md border border-slate-200">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Dossiers</p>
              <p className="text-2xl font-black text-[#2E68B4] mt-1">{montants.count}</p>
            </div>
            <div className="bg-white p-4 rounded-md border border-slate-200">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Montant total</p>
              <p className="text-lg font-black text-[#00A651] mt-1">{formatXAF(montants.total)}</p>
            </div>
            <div className="bg-white p-4 rounded-md border border-slate-200">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Moyenne / Max</p>
              <p className="text-sm font-bold text-slate-800 mt-1">
                {formatXAF(montants.avg)}
                <span className="text-slate-400 mx-1">·</span>
                {formatXAF(montants.max)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#2E68B4]" />
              <h3 className="text-sm font-bold text-slate-900">Répartition par statut</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="text-left px-4 py-2 font-bold">Statut</th>
                    <th className="text-right px-4 py-2 font-bold">Nb</th>
                    <th className="text-right px-4 py-2 font-bold">Montant XAF</th>
                  </tr>
                </thead>
                <tbody>
                  {byStatut.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                        Aucune donnée.
                      </td>
                    </tr>
                  ) : (
                    byStatut.map((row) => (
                      <tr key={row.statut} className="border-t border-slate-100">
                        <td className="px-4 py-2 font-semibold text-slate-800">
                          {(row.statut || '').replace(/_/g, ' ')}
                        </td>
                        <td className="px-4 py-2 text-right font-bold">{row.count}</td>
                        <td className="px-4 py-2 text-right text-[#2E68B4] font-semibold">
                          {formatXAF(row.montant)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Délais (création → mise à jour)</h3>
            </div>
            <div className="overflow-x-auto max-h-80">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider sticky top-0">
                  <tr>
                    <th className="text-left px-4 py-2 font-bold">N°</th>
                    <th className="text-left px-4 py-2 font-bold">Demandeur</th>
                    <th className="text-left px-4 py-2 font-bold">Statut</th>
                    <th className="text-right px-4 py-2 font-bold">Jours</th>
                    <th className="text-right px-4 py-2 font-bold">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {delays.slice(0, 40).map((row) => (
                    <tr key={row.id} className="border-t border-slate-100">
                      <td className="px-4 py-2 font-mono font-semibold">{row.numero}</td>
                      <td className="px-4 py-2 text-slate-700">{row.demandeur}</td>
                      <td className="px-4 py-2">{(row.statut || '').replace(/_/g, ' ')}</td>
                      <td className="px-4 py-2 text-right font-bold">
                        {row.jours == null ? '—' : `${row.jours} j`}
                      </td>
                      <td className="px-4 py-2 text-right text-[#2E68B4] font-semibold">
                        {formatXAF(row.montant)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
