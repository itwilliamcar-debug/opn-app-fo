import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Trash2, 
  AlertTriangle, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  Plus, 
  FileText, 
  Download, 
  Calendar, 
  Building2, 
  Package, 
  Flame, 
  ShieldCheck,
  Search,
  Filter,
  Eye,
  Camera
} from 'lucide-react';

import { 
  SICL_INVENTORY_CAMPAIGNS_SEED, 
  SICL_AVARIES_AND_DESTRUCTIONS_SEED 
} from '../../data/siclSeedData';
import { GABON_PROVINCIAL_ANTENNAS } from '../../data/provincialAntennaData';
import { generateOpnDocNumber } from '../../utils/codificationHelper';
import { downloadOfficialHtml } from '../../utils/downloadHelpers';

export default function InventoryAndWasteManager() {
  const [activeTab, setActiveTab] = useState('inventaires'); // 'inventaires' | 'avaries'
  const [inventaires, setInventaires] = useState(SICL_INVENTORY_CAMPAIGNS_SEED);
  const [avaries, setAvaries] = useState(SICL_AVARIES_AND_DESTRUCTIONS_SEED);
  const [selectedAntenna, setSelectedAntenna] = useState('G9');

  // New Avarie Form Modal
  const [isAvarieModalOpen, setIsAvarieModalOpen] = useState(false);
  const [newAvarieData, setNewAvarieData] = useState({
    codeProduit: 'MED-001',
    designation: 'Amoxicilline 500mg Gélules (B/100)',
    lot: 'LOT-AMX-2026-08',
    quantite: 50,
    cause: 'PERIME',
    pmpXaf: 2150,
    declarant: 'M. Patrick MBA (Magasinier)'
  });

  const handleToggleFreezeStock = (invId) => {
    setInventaires(prev => prev.map(inv => {
      if (inv.id === invId) {
        return { ...inv, mouvementsGeles: !inv.mouvementsGeles };
      }
      return inv;
    }));
  };

  const handleCreateAvarie = (e) => {
    e.preventDefault();
    const newAv = {
      id: `AVR-${Date.now()}`,
      codePV: generateOpnDocNumber('PV_DESTRUCTION', { antenneCode: selectedAntenna }),
      antenneId: selectedAntenna,
      antenneNom: `Antenne Régionale (${selectedAntenna})`,
      codeProduit: newAvarieData.codeProduit,
      designation: newAvarieData.designation,
      lot: newAvarieData.lot,
      datePeremption: '2026-10-31',
      quantiteAvariee: Number(newAvarieData.quantite),
      pmpXaf: Number(newAvarieData.pmpXaf),
      valeurPerdueXaf: Number(newAvarieData.quantite) * Number(newAvarieData.pmpXaf),
      causeAvarie: newAvarieData.cause,
      statutTraitement: 'DECLARE_BLOQUE',
      declarantNom: newAvarieData.declarant,
      dateDeclaration: new Date().toISOString().split('T')[0],
      responsableValidationNom: 'Chef d\'Antenne Régionale',
      dateValidation: null,
      pharmacienResponsableNom: 'Dr. François MBA ALLOGO',
      visaPharmacien: false
    };

    setAvaries([newAv, ...avaries]);
    setIsAvarieModalOpen(false);
  };

  const handleSignPvDestruction = (avarieId) => {
    setAvaries(prev => prev.map(av => {
      if (av.id === avarieId) {
        return {
          ...av,
          statutTraitement: 'DETRUIT_PV_SIGNE',
          visaPharmacien: true,
          dateValidation: new Date().toISOString().split('T')[0]
        };
      }
      return av;
    }));
  };

  const handleDownloadPvDestruction = (avarie) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>PROCÈS-VERBAL DE DESTRUCTION - OPN</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 30px; color: #1e293b; font-size: 13px; }
          .header { border-bottom: 2px solid #003366; padding-bottom: 10px; margin-bottom: 20px; }
          .title { font-size: 16px; font-weight: bold; text-align: center; margin: 20px 0; color: #b91c1c; text-transform: uppercase; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th, td { border: 1px solid #cbd5e1; padding: 8px; font-size: 12px; }
          th { background: #003366; color: white; }
          .sig-row { margin-top: 40px; display: flex; justify-content: space-between; }
          .sig-box { width: 45%; text-align: center; border-top: 1px solid #94a3b8; padding-top: 5px; }
        </style>
      </head>
      <body>
        <div class="header">
          <strong>OFFICE PHARMACEUTIQUE NATIONAL (OPN)</strong> — République Gabonaise<br>
          Direction Pharmaceutique & Contrôle Qualité — Antenne ${avarie.antenneNom}
        </div>
        <div class="title">PROCÈS-VERBAL DE DESTRUCTION PHARMACEUTIQUE OFFICIEL (${avarie.codePV})</div>
        <p>L'an deux mille vingt-six, a été procédé à la destruction réglementaire des produits périmés ou non conformes ci-après :</p>
        <table>
          <tr><th>Désignation</th><th>Lot</th><th>Quantité</th><th>PMP (XAF)</th><th>Valeur Perdue</th><th>Cause</th></tr>
          <tr>
            <td><strong>${avarie.designation}</strong></td>
            <td>${avarie.lot}</td>
            <td><strong>${avarie.quantiteAvariee}</strong></td>
            <td>${avarie.pmpXaf.toLocaleString()} XAF</td>
            <td><strong>${avarie.valeurPerdueXaf.toLocaleString()} XAF</strong></td>
            <td>${avarie.causeAvarie}</td>
          </tr>
        </table>
        <p><strong>Méthode de destruction :</strong> Incinération certifiée conforme aux directives de l'OMS.</p>
        <div class="sig-row">
          <div class="sig-box">Le Responsable d'Antenne OPN<br><strong>${avarie.responsableValidationNom}</strong></div>
          <div class="sig-box">Le Pharmacien Chef Responsable (Visa Légal)<br><strong>${avarie.pharmacienResponsableNom}</strong></div>
        </div>
      </body>
      </html>
    `;
    downloadOfficialHtml(htmlContent, `${avarie.codePV}.html`);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#003366] via-slate-800 to-[#00A651] rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-white/30">
                Module M7 SICL
              </span>
              <span className="text-emerald-300 text-xs font-semibold flex items-center gap-1">
                <ClipboardCheck className="w-3.5 h-3.5" /> Inventaires, Avaries &amp; Destructions
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Campagnes d'Inventaires &amp; Gestion des Avaries
            </h1>
            <p className="text-xs text-blue-100 max-w-2xl mt-1">
              Gel des mouvements de stock pendant le comptage, calcul des écarts valorisés au PMP et procès-verbaux de destruction signés par le Pharmacien Responsable.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('inventaires')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'inventaires' ? 'bg-white text-[#003366] shadow-md' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Inventaires &amp; Gel Stock
            </button>
            <button
              onClick={() => setActiveTab('avaries')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'avaries' ? 'bg-white text-[#003366] shadow-md' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Avaries &amp; PV Destruction
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Views */}
      {activeTab === 'inventaires' ? (
        
        /* Inventaires View */
        <div className="space-y-4">
          {inventaires.map(inv => (
            <div key={inv.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              
              {/* Campaign Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-[#003366] bg-blue-50 px-2 py-0.5 rounded">
                      {inv.codePV}
                    </span>
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {inv.typeInventaire}
                    </span>
                    <span className="text-xs text-slate-500">{inv.antenneNom}</span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900">Campagne de Comptage Physique Régionale</h3>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleFreezeStock(inv.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      inv.mouvementsGeles 
                        ? 'bg-rose-100 text-rose-800 border border-rose-300' 
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    {inv.mouvementsGeles ? (
                      <>
                        <Lock className="w-3.5 h-3.5 text-rose-700" />
                        MOUVEMENTS DE STOCK GELÉS (RG-M7-07)
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3.5 h-3.5 text-emerald-700" />
                        Mouvements Libres
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Valeur Théorique</p>
                  <p className="text-sm font-black text-slate-900">{inv.valeurTheoriqueTotalXaf.toLocaleString()} XAF</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Valeur Comptée</p>
                  <p className="text-sm font-black text-slate-900">{inv.valeurCompteeTotalXaf.toLocaleString()} XAF</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Écart Net en Valeur</p>
                  <p className="text-sm font-black text-red-600">{inv.ecartValeurNetXaf.toLocaleString()} XAF</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Taux Écart Global (Cible &lt; 2%)</p>
                  <p className="text-sm font-black text-emerald-600">{inv.tauxEcartValeur}% (Conforme OB-02)</p>
                </div>
              </div>

              {/* Sample Lines Table */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Lignes Pointées &amp; Justification des Écarts
                </h4>
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold">
                      <tr>
                        <th className="p-2.5">Produit</th>
                        <th className="p-2.5">N° Lot</th>
                        <th className="p-2.5 text-center">Théorique</th>
                        <th className="p-2.5 text-center">Compté</th>
                        <th className="p-2.5 text-center">Écart</th>
                        <th className="p-2.5 text-right">Écart Valeur</th>
                        <th className="p-2.5">Justification (RG-M7-01)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {inv.lignesEchantillon.map((l, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-slate-900">{l.designation}</td>
                          <td className="p-2.5 font-mono text-[11px] text-slate-600">{l.lot}</td>
                          <td className="p-2.5 text-center text-slate-700 font-semibold">{l.theorique}</td>
                          <td className="p-2.5 text-center font-bold text-slate-900">{l.compte}</td>
                          <td className="p-2.5 text-center">
                            <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                              l.ecart < 0 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {l.ecart > 0 ? `+${l.ecart}` : l.ecart}
                            </span>
                          </td>
                          <td className="p-2.5 text-right font-black text-slate-900">
                            {l.ecartValeurXaf.toLocaleString()} XAF
                          </td>
                          <td className="p-2.5 text-slate-600 text-[11px]">
                            {l.justification}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          ))}
        </div>

      ) : (

        /* Avaries View */
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setIsAvarieModalOpen(true)}
              className="px-4 py-2 bg-[#003366] hover:bg-[#002244] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-[#00A651]" />
              Déclarer une Avarie / Périmé (EF-M7-10)
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {avaries.map(av => (
              <div key={av.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        {av.codePV}
                      </span>
                      <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        Cause : {av.causeAvarie}
                      </span>
                      <span className="text-xs text-slate-500">{av.antenneNom}</span>
                    </div>
                    <h4 className="font-bold text-base text-slate-900">{av.designation}</h4>
                    <p className="text-xs text-slate-600">
                      Lot : <strong className="font-mono text-slate-800">{av.lot}</strong> • Quantité : <strong>{av.quantiteAvariee} unités</strong> • Perte PMP : <strong className="text-red-700">{av.valeurPerdueXaf.toLocaleString()} XAF</strong>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {av.statutTraitement !== 'DETRUIT_PV_SIGNE' ? (
                      <button
                        onClick={() => handleSignPvDestruction(av.id)}
                        className="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Visa Destruction Pharmacien (EF-M7-14)
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        Détruit &amp; PV Signé Pharmacien
                      </span>
                    )}

                    <button
                      onClick={() => handleDownloadPvDestruction(av)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Télécharger PV
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2 text-slate-600">
                  <span>Déclaré par : <strong>{av.declarantNom}</strong> le {av.dateDeclaration}</span>
                  <span>Validation Pharmacien Chef : <strong>{av.pharmacienResponsableNom}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Avarie Modal */}
      {isAvarieModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <h3 className="font-bold text-base text-slate-900 mb-4 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-600" />
              Déclaration d'Avarie au PMP (EF-M7-10)
            </h3>

            <form onSubmit={handleCreateAvarie} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Désignation Produit *</label>
                <input
                  type="text"
                  required
                  value={newAvarieData.designation}
                  onChange={(e) => setNewAvarieData({ ...newAvarieData, designation: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">N° de Lot *</label>
                  <input
                    type="text"
                    required
                    value={newAvarieData.lot}
                    onChange={(e) => setNewAvarieData({ ...newAvarieData, lot: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cause Avarie *</label>
                  <select
                    value={newAvarieData.cause}
                    onChange={(e) => setNewAvarieData({ ...newAvarieData, cause: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="PERIME">Périmé</option>
                    <option value="CASSE">Cassé</option>
                    <option value="DEFAUT_QUALITE">Défaut Qualité</option>
                    <option value="RUPTURE_FROID">Rupture Chaîne du Froid</option>
                    <option value="VOL_PERTE">Vol / Perte</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quantité Avariée *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newAvarieData.quantite}
                    onChange={(e) => setNewAvarieData({ ...newAvarieData, quantite: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Prix Moyen Pondéré (PMP)</label>
                  <input
                    type="number"
                    value={newAvarieData.pmpXaf}
                    onChange={(e) => setNewAvarieData({ ...newAvarieData, pmpXaf: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-red-50 rounded-xl text-red-800 font-medium">
                Valeur de perte totale enregistrée : <strong>{(newAvarieData.quantite * newAvarieData.pmpXaf).toLocaleString()} XAF</strong>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAvarieModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg shadow-md"
                >
                  Enregistrer &amp; Mettre en Quarantaine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
