import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Plus, 
  Trash2, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  DollarSign, 
  Package, 
  Building2, 
  Sparkles,
  ArrowRight,
  Printer
} from 'lucide-react';
import { generateOpnDocNumber, numberToFrenchWords } from '../../utils/codificationHelper';
import { PHARMACEUTICAL_CATALOG } from '../../data/pharmaceuticalData';
import { GABON_PROVINCIAL_ANTENNAS, REGIONAL_HEALTH_STRUCTURES } from '../../data/provincialAntennaData';

export default function QuoteWithMissedSalesModal({ isOpen, onClose, onSaveQuote, onRecordMissedSale, currentAntennaCode = 'G1' }) {
  if (!isOpen) return null;

  const [antennaCode, setAntennaCode] = useState(currentAntennaCode);
  const [selectedStructureId, setSelectedStructureId] = useState(REGIONAL_HEALTH_STRUCTURES[0]?.id || '');
  const [validityDays, setValidityDays] = useState(30);
  const [remiseGlobalePct, setRemiseGlobalePct] = useState(0);

  // Lines
  const [lines, setLines] = useState([
    {
      id: 1,
      produitId: 'MED-001',
      code: 'MED-001',
      designation: 'Amoxicilline 500mg Gélules (B/100)',
      dci: 'Amoxicilline',
      prixUnitaire: 3200,
      stockDisponible: 0, // Rupture intentionnelle pour tester la vente manquée
      quantiteDemandee: 150,
      remiseLignePct: 0
    },
    {
      id: 2,
      produitId: 'MED-003',
      code: 'MED-003',
      designation: 'Paracétamol 500mg Comprimés (B/100)',
      dci: 'Paracétamol',
      prixUnitaire: 850,
      stockDisponible: 2400,
      quantiteDemandee: 200,
      remiseLignePct: 0
    }
  ]);

  const selectedStructure = REGIONAL_HEALTH_STRUCTURES.find(s => s.id === selectedStructureId) || REGIONAL_HEALTH_STRUCTURES[0];
  const selectedAntenna = GABON_PROVINCIAL_ANTENNAS.find(a => a.provinceCode === antennaCode) || GABON_PROVINCIAL_ANTENNAS[0];

  const devisNumber = generateOpnDocNumber('DEVIS', {
    antenneCode: antennaCode,
    sequence: 14
  });

  // Calculations
  const totalBrut = lines.reduce((acc, l) => acc + (l.prixUnitaire * l.quantiteDemandee), 0);
  const montantRemise = totalBrut * (remiseGlobalePct / 100);
  const totalNetXaf = Math.round(totalBrut - montantRemise);
  const totalLettres = numberToFrenchWords(totalNetXaf);

  // Add Line
  const handleAddLine = () => {
    const defaultProd = PHARMACEUTICAL_CATALOG[0];
    setLines([
      ...lines,
      {
        id: Date.now(),
        produitId: defaultProd?.code || 'MED-001',
        code: defaultProd?.code || 'MED-001',
        designation: defaultProd?.designation || 'Produit',
        dci: defaultProd?.dci || 'DCI',
        prixUnitaire: defaultProd?.prixUnitaire || 2500,
        stockDisponible: defaultProd?.stock || 500,
        quantiteDemandee: 50,
        remiseLignePct: 0
      }
    ]);
  };

  const handleProductChange = (lineId, prodCode) => {
    const prod = PHARMACEUTICAL_CATALOG.find(p => p.code === prodCode);
    if (!prod) return;
    setLines(lines.map(l => {
      if (l.id === lineId) {
        return {
          ...l,
          produitId: prod.code,
          code: prod.code,
          designation: prod.designation,
          dci: prod.dci,
          prixUnitaire: prod.prixUnitaire || 2500,
          stockDisponible: prod.stock || 0
        };
      }
      return l;
    }));
  };

  const handleRemoveLine = (lineId) => {
    setLines(lines.filter(l => l.id !== lineId));
  };

  const handleRecordMissedSaleForLine = (line) => {
    const missingQty = Math.max(0, line.quantiteDemandee - line.stockDisponible);
    const missedSale = {
      id: `VM-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      antenneId: antennaCode,
      antenneNom: selectedAntenna.nom,
      clientNom: selectedStructure?.nom || 'Client Devis',
      codeProduit: line.code,
      designation: line.designation,
      dci: line.dci,
      quantiteDemandee: line.quantiteDemandee,
      quantiteDisponible: line.stockDisponible,
      quantiteManquee: missingQty,
      prixUnitaireXaf: line.prixUnitaire,
      valeurPerdueXaf: missingQty * line.prixUnitaire,
      causeRupture: `Rupture de stock dans l'antenne ${selectedAntenna.province}`,
      motif: "Devis client non servi intégralement",
      statut: "NON_RECUPEREE"
    };

    if (onRecordMissedSale) {
      onRecordMissedSale(missedSale);
    }
    alert(`Vente manquée enregistrée pour ${missingQty} boîte(s) de ${line.designation} (${(missingQty * line.prixUnitaire).toLocaleString()} XAF de manque à gagner tracé).`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newQuote = {
      id: devisNumber,
      numero: devisNumber,
      antenneCode,
      clientNom: selectedStructure?.nom || 'Client Devis',
      clientProvince: selectedStructure?.provinceCode || 'G1',
      date: new Date().toISOString().split('T')[0],
      validiteJours: validityDays,
      lignes: lines,
      totalNetXaf,
      totalLettres,
      statut: 'VALIDÉ'
    };

    if (onSaveQuote) onSaveQuote(newQuote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#003366] via-[#004080] to-[#00A651] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <FileText className="w-5 h-5 text-[#00A651]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                  Module M4 (Cycle de Vente)
                </span>
                <span className="text-xs font-mono font-bold text-emerald-300">{devisNumber}</span>
              </div>
              <h3 className="font-bold text-lg text-white">Établissement de Devis &amp; Ventes Manquées</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Antenne Émettrice *
              </label>
              <select
                value={antennaCode}
                onChange={(e) => setAntennaCode(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#003366]/20"
              >
                {GABON_PROVINCIAL_ANTENNAS.map(ant => (
                  <option key={ant.provinceCode} value={ant.provinceCode}>
                    {ant.provinceCode} — {ant.province}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Client / Structure Destinataire *
              </label>
              <select
                value={selectedStructureId}
                onChange={(e) => setSelectedStructureId(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#003366]/20"
              >
                {REGIONAL_HEALTH_STRUCTURES.map(st => (
                  <option key={st.id} value={st.id}>
                    {st.nom} ({st.provinceCode}) - {st.type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Durée de Validité
              </label>
              <select
                value={validityDays}
                onChange={(e) => setValidityDays(Number(e.target.value))}
                className="w-full text-xs font-semibold px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#003366]/20"
              >
                <option value={15}>15 Jours</option>
                <option value={30}>30 Jours (Standard)</option>
                <option value={60}>60 Jours</option>
                <option value={90}>90 Jours</option>
              </select>
            </div>
          </div>

          {/* Lines Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-[#003366]" /> Lignes d'Articles (Nombre Illimité EF-M4-02)
              </h4>
              <button
                type="button"
                onClick={handleAddLine}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-[#003366] text-xs font-bold rounded-lg border border-slate-300 flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#00A651]" /> Ajouter Ligne
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-2.5">Produit / DCI</th>
                    <th className="p-2.5 text-center">Stock Dispo Antenne</th>
                    <th className="p-2.5 text-right">Prix Unitaire</th>
                    <th className="p-2.5 text-center">Quantité</th>
                    <th className="p-2.5 text-right">Total HT</th>
                    <th className="p-2.5 text-center">Action / Rupture</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lines.map((line) => {
                    const isRupture = line.quantiteDemandee > line.stockDisponible;
                    const lineTotal = line.prixUnitaire * line.quantiteDemandee;

                    return (
                      <tr key={line.id} className={isRupture ? 'bg-amber-50/50' : ''}>
                        <td className="p-2.5">
                          <select
                            value={line.code}
                            onChange={(e) => handleProductChange(line.id, e.target.value)}
                            className="w-full text-xs font-bold px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#003366]"
                          >
                            {PHARMACEUTICAL_CATALOG.slice(0, 15).map(prod => (
                              <option key={prod.code} value={prod.code}>
                                {prod.code} — {prod.designation} ({prod.dci})
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="p-2.5 text-center">
                          {line.stockDisponible > 0 ? (
                            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {line.stockDisponible} u.
                            </span>
                          ) : (
                            <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 flex items-center justify-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> 0 (Rupture)
                            </span>
                          )}
                        </td>

                        <td className="p-2.5 text-right font-semibold text-slate-800">
                          {line.prixUnitaire.toLocaleString()} XAF
                        </td>

                        <td className="p-2.5 text-center">
                          <input
                            type="number"
                            min="1"
                            value={line.quantiteDemandee}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 1;
                              setLines(lines.map(l => l.id === line.id ? { ...l, quantiteDemandee: val } : l));
                            }}
                            className="w-20 text-center font-bold text-xs p-1 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#003366]"
                          />
                        </td>

                        <td className="p-2.5 text-right font-black text-slate-900">
                          {lineTotal.toLocaleString()} XAF
                        </td>

                        <td className="p-2.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {isRupture && (
                              <button
                                type="button"
                                onClick={() => handleRecordMissedSaleForLine(line)}
                                className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold rounded shadow-sm flex items-center gap-1 transition-all"
                                title="Enregistrer comme Vente Manquée dans la base (AM-02)"
                              >
                                <AlertTriangle className="w-3 h-3" /> Vente Manquée
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleRemoveLine(line.id)}
                              className="text-slate-400 hover:text-rose-600 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals & All Words Translation */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-slate-600">Total Brut : <strong>{totalBrut.toLocaleString()} XAF</strong></span>
                <div className="flex items-center gap-1">
                  <span className="text-slate-500">Remise Globale :</span>
                  <input
                    type="number"
                    min="0"
                    max="15"
                    value={remiseGlobalePct}
                    onChange={(e) => setRemiseGlobalePct(Number(e.target.value))}
                    className="w-14 text-center font-bold text-xs p-1 border border-slate-300 rounded bg-white"
                  />
                  <span>%</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500">Net Commercial à Payer :</span>
                <p className="text-xl font-black text-[#003366]">{totalNetXaf.toLocaleString()} XAF</p>
              </div>
            </div>

            {/* Montant en toutes lettres (EF-M4-22) */}
            <div className="pt-2 border-t border-slate-200/80 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-400 font-semibold uppercase text-[10px] block mb-0.5">
                Montant total en toutes lettres (Conforme EF-M4-22) :
              </span>
              <p className="font-bold italic text-slate-900">{totalLettres}</p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#003366] to-[#004b93] hover:opacity-95 rounded-lg shadow-md transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-[#00A651]" />
              Valider &amp; Émettre le Devis
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
