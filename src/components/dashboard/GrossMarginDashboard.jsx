import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Percent, 
  Package, 
  Pill, 
  Layers, 
  Building2, 
  Download, 
  Printer, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Sparkles,
  PieChart,
  BarChart3,
  FileCheck2
} from 'lucide-react';

import { GABON_PROVINCIAL_ANTENNAS } from '../../data/provincialAntennaData';
import { downloadOfficialHtml } from '../../utils/downloadHelpers';

export const TRIPARTITE_CATEGORIES = [
  { id: 'MEDICAMENT', label: '1. Médicaments Essentiels', caXaf: 145800000, coutPmpXaf: 98500000, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { id: 'CONSOMMABLE', label: '2. Consommables Médicaux', caXaf: 42100000, coutPmpXaf: 29800000, color: 'text-blue-700 bg-blue-50 border-blue-200' },
  { id: 'DISPOSITIF', label: '3. Dispositifs Médicaux (DM)', caXaf: 28400000, coutPmpXaf: 19200000, color: 'text-purple-700 bg-purple-50 border-purple-200' }
];

export const TOP_MARGIN_PRODUCTS = [
  { code: 'MED-001', designation: 'Amoxicilline 500mg (B/100)', caXaf: 38400000, pmpXaf: 25800000, margeXaf: 12600000, tauxMargePct: 32.8, categorie: 'Médicaments' },
  { code: 'MED-009', designation: 'Artéméther + Luméfantrine 80/480mg', caXaf: 29100000, pmpXaf: 20400000, margeXaf: 8700000, tauxMargePct: 29.8, categorie: 'Médicaments' },
  { code: 'DM-014', designation: 'Seringues 5ml Stériles (B/100)', caXaf: 18500000, pmpXaf: 12200000, margeXaf: 6300000, tauxMargePct: 34.0, categorie: 'Dispositifs Médicaux' },
  { code: 'CS-004', designation: 'Gants d\'Examen Nitrile Non Poudrés', caXaf: 22400000, pmpXaf: 15900000, margeXaf: 6500000, tauxMargePct: 29.0, categorie: 'Consommables' }
];

export default function GrossMarginDashboard() {
  const [selectedAntenna, setSelectedAntenna] = useState('ALL');
  const [selectedPeriod, setSelectedPeriod] = useState('2026-T3'); // Trimestre 3 2026

  // Aggregate Calculations (AM-01)
  const stats = useMemo(() => {
    const totalCa = TRIPARTITE_CATEGORIES.reduce((acc, c) => acc + c.caXaf, 0);
    const totalPmp = TRIPARTITE_CATEGORIES.reduce((acc, c) => acc + c.coutPmpXaf, 0);
    const totalMarge = totalCa - totalPmp;
    const tauxMargeMoyen = totalCa > 0 ? ((totalMarge / totalCa) * 100).toFixed(1) : 0;

    return {
      totalCa,
      totalPmp,
      totalMarge,
      tauxMargeMoyen
    };
  }, []);

  const handleGeneratePauletteReport = () => {
    const antennaName = selectedAntenna === 'ALL' ? 'Consolidation Nationale (9 Antennes)' : `Antenne ${selectedAntenna}`;
    const dateStr = new Date().toLocaleDateString('fr-FR');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>RAPPORT QUOTIDIEN D'ACTIVITÉ OPN — ${selectedAntenna}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 30px; color: #1e293b; font-size: 13px; line-height: 1.5; }
          .header { border-bottom: 2px solid #003366; padding-bottom: 10px; margin-bottom: 20px; display: flex; justify-content: space-between; }
          .title { font-size: 17px; font-weight: bold; text-align: center; margin: 20px 0; color: #003366; text-transform: uppercase; background: #f1f5f9; padding: 10px; border: 1px solid #cbd5e1; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th, td { border: 1px solid #cbd5e1; padding: 8px; font-size: 12px; }
          th { background: #003366; color: white; }
          .highlight { background: #ecfdf5; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <strong>OFFICE PHARMACEUTIQUE NATIONAL (OPN)</strong> — République Gabonaise<br>
            Direction Commerciale & Marketing — <em>Rapport Quotidien d'Activité d'Antenne (Type Paulette)</em>
          </div>
          <div style="text-align: right;">
            Périmètre : <strong>${antennaName}</strong><br>
            Date d'émission : ${dateStr}
          </div>
        </div>

        <div class="title">SYNTHÈSE COMMERCIALE, LOGISTIQUE ET MARGE BRUTE (EF-M9-06)</div>

        <h3>1. Ventilation Tripartite Réglementaire du Chiffre d'Affaires</h3>
        <table>
          <tr>
            <th>Catégorie de Produits</th>
            <th>CA Facturé (XAF)</th>
            <th>Coût Sorties au PMP (XAF)</th>
            <th>Marge Brute Réelle (XAF)</th>
            <th>Taux de Marge (%)</th>
          </tr>
          ${TRIPARTITE_CATEGORIES.map(c => `
            <tr>
              <td><strong>${c.label}</strong></td>
              <td>${c.caXaf.toLocaleString()} XAF</td>
              <td>${c.coutPmpXaf.toLocaleString()} XAF</td>
              <td class="highlight">${(c.caXaf - c.coutPmpXaf).toLocaleString()} XAF</td>
              <td><strong>${(((c.caXaf - c.coutPmpXaf) / c.caXaf) * 100).toFixed(1)}%</strong></td>
            </tr>
          `).join('')}
          <tr style="background: #e2e8f0; font-weight: bold;">
            <td>TOTAL CONSOLIDÉ</td>
            <td>${stats.totalCa.toLocaleString()} XAF</td>
            <td>${stats.totalPmp.toLocaleString()} XAF</td>
            <td style="color: #00A651;">${stats.totalMarge.toLocaleString()} XAF</td>
            <td>${stats.tauxMargeMoyen}%</td>
          </tr>
        </table>

        <h3>2. Top Produits Contributeurs à la Rentabilité</h3>
        <table>
          <tr><th>Produit</th><th>Catégorie</th><th>CA Facturé</th><th>PMP</th><th>Marge Réalisée</th><th>Taux</th></tr>
          ${TOP_MARGIN_PRODUCTS.map(p => `
            <tr>
              <td><strong>${p.designation}</strong> (${p.code})</td>
              <td>${p.categorie}</td>
              <td>${p.caXaf.toLocaleString()} XAF</td>
              <td>${p.pmpXaf.toLocaleString()} XAF</td>
              <td class="highlight">${p.margeXaf.toLocaleString()} XAF</td>
              <td>${p.tauxMargePct}%</td>
            </tr>
          `).join('')}
        </table>

        <div style="margin-top: 40px; border-top: 1px solid #cbd5e1; padding-top: 10px; font-size: 11px; color: #64748b; text-align: center;">
          Document officiel généré automatiquement par le SICL OPN 2026 — Diffusion : Direction Générale, Direction Financière, Responsables d'Antennes.
        </div>
      </body>
      </html>
    `;

    downloadOfficialHtml(htmlContent, `RAPPORT_QUOTIDIEN_${selectedAntenna}_${new Date().toISOString().split('T')[0]}.html`);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#003366] via-[#004b93] to-[#00A651] rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-white/30">
                Module M9 &amp; AM-01 SICL
              </span>
              <span className="text-emerald-300 text-xs font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Rentabilité &amp; Ventilation Tripartite
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Pilotage de la Marge Brute &amp; Reporting Quotidien
            </h1>
            <p className="text-xs text-blue-100 max-w-2xl mt-1">
              Passage d'un pilotage des volumes à un pilotage de la rentabilité réelle (<code className="bg-black/20 px-1 py-0.5 rounded">Marge = CA HT - Coût PMP Sorties</code>) et ventilation tripartite obligatoire Médicaments / Consommables / DM.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleGeneratePauletteReport}
              className="px-4 py-2.5 bg-white text-[#003366] hover:bg-slate-50 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-[#00A651]" />
              Générer Rapport Quotidien (Type Paulette)
            </button>
          </div>
        </div>

        {/* Aggregate KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/15">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
            <p className="text-[10px] font-medium text-blue-100 uppercase">Chiffre d'Affaires HT</p>
            <p className="text-xl font-black text-white mt-0.5">{stats.totalCa.toLocaleString()} XAF</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
            <p className="text-[10px] font-medium text-blue-100 uppercase">Coût des Sorties au PMP</p>
            <p className="text-xl font-black text-slate-300 mt-0.5">{stats.totalPmp.toLocaleString()} XAF</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
            <p className="text-[10px] font-medium text-emerald-200 uppercase">Marge Brute Réelle (AM-01)</p>
            <p className="text-xl font-black text-emerald-300 mt-0.5">+{stats.totalMarge.toLocaleString()} XAF</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
            <p className="text-[10px] font-medium text-blue-100 uppercase">Taux de Marge Moyen</p>
            <p className="text-xl font-black text-white mt-0.5">{stats.tauxMargeMoyen}%</p>
          </div>
        </div>
      </div>

      {/* Tripartite Breakdown (EF-M3-03 & EF-M9-08) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TRIPARTITE_CATEGORIES.map(cat => {
          const marge = cat.caXaf - cat.coutPmpXaf;
          const pct = ((marge / cat.caXaf) * 100).toFixed(1);

          return (
            <div key={cat.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${cat.color}`}>
                  {cat.label}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {pct}% Marge
                </span>
              </div>

              <div>
                <p className="text-xs text-slate-500">Chiffre d'Affaires Réalisé :</p>
                <p className="text-xl font-black text-slate-900">{cat.caXaf.toLocaleString()} XAF</p>
              </div>

              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Coût PMP :</span>
                  <span className="font-semibold text-slate-700">{cat.coutPmpXaf.toLocaleString()} XAF</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Marge Brute :</span>
                  <span className="font-black text-emerald-700">+{marge.toLocaleString()} XAF</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Top Products Margin Contribution Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Package className="w-4 h-4 text-[#003366]" />
            Rentabilité par Produit (Prix de Vente vs PMP Réel)
          </h3>
          <span className="text-xs text-slate-500">Données recalculées en continu</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3">Code / Désignation</th>
                <th className="p-3">Catégorie Tripartite</th>
                <th className="p-3 text-right">CA Facturé</th>
                <th className="p-3 text-right">Coût Sorties PMP</th>
                <th className="p-3 text-right">Marge Brute (XAF)</th>
                <th className="p-3 text-center">Taux Marge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {TOP_MARGIN_PRODUCTS.map(prod => (
                <tr key={prod.code} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3">
                    <p className="font-bold text-slate-900">{prod.designation}</p>
                    <span className="text-[10px] font-mono text-blue-700 font-bold bg-blue-50 px-1.5 py-0.2 rounded">
                      {prod.code}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600">{prod.categorie}</td>
                  <td className="p-3 text-right font-semibold text-slate-800">{prod.caXaf.toLocaleString()} XAF</td>
                  <td className="p-3 text-right text-slate-600">{prod.pmpXaf.toLocaleString()} XAF</td>
                  <td className="p-3 text-right font-black text-emerald-700">+{prod.margeXaf.toLocaleString()} XAF</td>
                  <td className="p-3 text-center">
                    <span className="font-bold px-2 py-0.5 rounded text-xs bg-emerald-100 text-emerald-800">
                      {prod.tauxMargePct}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
