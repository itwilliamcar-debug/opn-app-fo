import React, { useState } from 'react';
import {
  X,
  Receipt,
  Plus,
  Trash2,
  CheckCircle2,
  Building,
  CreditCard,
  Pill,
  Calculator
} from 'lucide-react';
import { formatXAF } from '../../utils/formatters';

const DEFAULT_ARTICLES = [
  { code: '010301001', dci: 'Artéméther + Luméfantrine 20/120mg CP (Coartem)', conditionnement: 'Boîte 24', quantite: 5000, prixUnitaireXaf: 950 },
  { code: '010401004', dci: 'Amoxicilline + Acide Clavulanique 1g CP', conditionnement: 'Boîte 14', quantite: 3000, prixUnitaireXaf: 1850 },
];

export default function NewInvoiceModal({ isOpen, onClose, onSaveInvoice, activePersona }) {
  const [formData, setFormData] = useState({
    clientNom: 'Centre Hospitalier Universitaire de Libreville (CHUL)',
    clientType: 'HOPITAL_PUBLIC',
    clientCode: 'CLI-CHUL-001',
    clientAdresse: 'Boulevard Triomphal, Libreville',
    clientNif: 'NIF-882910-A',
    provinceId: 'G1',
    numeroBonLivraison: `BL-OPN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    numeroConvention: 'CONV-CNAMGS-CHU-001',
    tauxPriseEnChargeCnamgs: '90%',
    dateEmission: new Date().toISOString().slice(0, 10),
    dateEcheance: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10),
    observations: 'Facturation de dotation hospitalière avec tiers-payant CNAMGS.',
  });

  const [articles, setArticles] = useState(DEFAULT_ARTICLES);

  if (!isOpen) return null;

  const handleAddArticle = () => {
    setArticles([
      ...articles,
      { code: '010701002', dci: 'Paracétamol 1g Comprimé', conditionnement: 'Boîte 100', quantite: 1000, prixUnitaireXaf: 2000 }
    ]);
  };

  const handleRemoveArticle = (index) => {
    if (articles.length > 1) {
      setArticles(articles.filter((_, i) => i !== index));
    }
  };

  const handleArticleChange = (index, field, value) => {
    const updated = [...articles];
    updated[index][field] = field === 'quantite' || field === 'prixUnitaireXaf' ? Number(value) : value;
    setArticles(updated);
  };

  const totalBrutHtXaf = articles.reduce((acc, item) => acc + (item.quantite * item.prixUnitaireXaf), 0);
  const ratePct = parseInt(formData.tauxPriseEnChargeCnamgs, 10) / 100;
  const partCnamgsXaf = Math.round(totalBrutHtXaf * ratePct);
  const partClientXaf = totalBrutHtXaf - partCnamgsXaf;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedArticles = articles.map(a => ({
      ...a,
      totalLigneXaf: a.quantite * a.prixUnitaireXaf
    }));

    const newInvoice = {
      ...formData,
      id: `FAC-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      numeroFacture: `OPN-FAC-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      montantBrutHtXaf: totalBrutHtXaf,
      remiseConventionnelleXaf: 0,
      tvaExoneree: true,
      montantNetXaf: totalBrutHtXaf,
      partCnamgsXaf,
      partClientXaf,
      montantEncaisseXaf: 0,
      soldeRestantXaf: totalBrutHtXaf,
      statut: 'EN_ATTENTE_CNAMGS',
      modeReglement: 'Virement Trésor / Tiers-Payant CNAMGS',
      compteBancaireOpn: 'BGFI Bank Gabon • Compte Trésorerie OPN N° 40001-02001-0192847291-33',
      articles: formattedArticles,
    };

    onSaveInvoice(newInvoice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Émission d'une Nouvelle Facture Normalisée OPN</h3>
              <p className="text-xs text-slate-400">Facturation Établissement Sanitaire & Tiers-Payant CNAMGS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto text-xs">
          
          {/* Client & Convention */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wide">
              <Building className="w-4 h-4 text-emerald-600" />
              Client & Modalités de Tiers-Payant
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Structure / Client</label>
                <input
                  type="text"
                  required
                  value={formData.clientNom}
                  onChange={(e) => setFormData({ ...formData, clientNom: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Type d'Établissement</label>
                <select
                  value={formData.clientType}
                  onChange={(e) => setFormData({ ...formData, clientType: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  <option value="HOPITAL_PUBLIC">Hôpital Public Universitaire (CHU)</option>
                  <option value="CHR_PROVINCIAL">Centre Hospitalier Régional (CHR)</option>
                  <option value="DISPENSAIRE_PUBLIC">Dispensaire Public / Centre Médical (Gratuité)</option>
                  <option value="OFFICINE_PRIVEE">Pharmacie Privée Agréée</option>
                  <option value="CLINIQUE_PRIVEE">Clinique Médico-Chirurgicale</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">N° Bon de Livraison (BL)</label>
                <input
                  type="text"
                  required
                  value={formData.numeroBonLivraison}
                  onChange={(e) => setFormData({ ...formData, numeroBonLivraison: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Taux Prise en Charge CNAMGS</label>
                <select
                  value={formData.tauxPriseEnChargeCnamgs}
                  onChange={(e) => setFormData({ ...formData, tauxPriseEnChargeCnamgs: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-bold text-emerald-900"
                >
                  <option value="100%">100% (Fonds 1 GEF - Gratuité Complète)</option>
                  <option value="90%">90% (Fonds 2 Fonctionnaires & Hôpitaux Publics)</option>
                  <option value="80%">80% (Fonds 3 Secteur Privé / Officines)</option>
                  <option value="0%">0% (Sans Tiers-Payant / Paiement Direct)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date d'Émission</label>
                <input
                  type="date"
                  required
                  value={formData.dateEmission}
                  onChange={(e) => setFormData({ ...formData, dateEmission: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date d'Échéance</label>
                <input
                  type="date"
                  required
                  value={formData.dateEcheance}
                  onChange={(e) => setFormData({ ...formData, dateEcheance: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-bold text-rose-700"
                />
              </div>
            </div>
          </div>

          {/* Articles Table */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wide">
                <Pill className="w-4 h-4 text-emerald-600" />
                Lignes de Médicaments & Tarifs Plafonnés
              </h4>
              <button
                type="button"
                onClick={handleAddArticle}
                className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter un produit</span>
              </button>
            </div>

            <div className="space-y-2">
              {articles.map((art, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-lg">
                  <input
                    type="text"
                    required
                    placeholder="Désignation DCI"
                    value={art.dci}
                    onChange={(e) => handleArticleChange(idx, 'dci', e.target.value)}
                    className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-semibold"
                  />
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="Qté"
                    value={art.quantite}
                    onChange={(e) => handleArticleChange(idx, 'quantite', e.target.value)}
                    className="w-24 px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-bold text-right"
                  />
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="Prix Unit."
                    value={art.prixUnitaireXaf}
                    onChange={(e) => handleArticleChange(idx, 'prixUnitaireXaf', e.target.value)}
                    className="w-28 px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-mono text-right"
                  />
                  <span className="font-mono font-bold text-slate-900 text-right w-28">
                    {formatXAF(art.quantite * art.prixUnitaireXaf)}
                  </span>
                  {articles.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveArticle(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Financial Calculation Summary */}
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
            <h4 className="font-bold text-emerald-950 flex items-center gap-2 text-xs uppercase tracking-wide">
              <Calculator className="w-4 h-4 text-emerald-700" />
              Récapitulatif & Ventilation Financière
            </h4>

            <div className="grid grid-cols-3 gap-4 pt-1">
              <div className="bg-white p-2.5 rounded-lg border border-emerald-200 text-center">
                <span className="text-[10px] text-slate-500 font-semibold uppercase block">Montant Total Net</span>
                <span className="font-mono font-black text-sm text-slate-900">{formatXAF(totalBrutHtXaf)}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-emerald-200 text-center">
                <span className="text-[10px] text-emerald-700 font-semibold uppercase block">Part CNAMGS ({formData.tauxPriseEnChargeCnamgs})</span>
                <span className="font-mono font-black text-sm text-emerald-700">{formatXAF(partCnamgsXaf)}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-emerald-200 text-center">
                <span className="text-[10px] text-slate-500 font-semibold uppercase block">Part Client (Ticket Modérateur)</span>
                <span className="font-mono font-black text-sm text-slate-800">{formatXAF(partClientXaf)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold flex items-center gap-2 shadow-md hover:shadow-emerald-500/20 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Émettre & Enregistrer la Facture Normalisée</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
