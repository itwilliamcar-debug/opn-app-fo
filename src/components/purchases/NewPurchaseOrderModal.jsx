import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Globe, 
  Coins, 
  Landmark, 
  Calendar, 
  Pill, 
  Building2 
} from 'lucide-react';
import { CURRENCY_RATES_TO_XAF } from '../../data/purchasesData';

export default function NewPurchaseOrderModal({
  isOpen,
  onClose,
  suppliers,
  onSaveOrder,
}) {
  if (!isOpen) return null;

  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || '');
  const [incoterm, setIncoterm] = useState('CIF Port d\'Owendo (Gabon)');
  const [devise, setDevise] = useState(suppliers[0]?.devisePref || 'EUR');
  const [conditionsPaiement, setConditionsPaiement] = useState('Lettre de Crédit Irrévocable et Confirmée (LC à 60 jours)');
  const [dateLivraisonPrevue, setDateLivraisonPrevue] = useState(
    new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');

  // Sample DCI catalog options
  const sampleProducts = [
    { codeDci: '012901002', designation: 'NaCl 0.9% poche 500ml', forme: 'Poche', puEur: 1.25, puUsd: 1.35, puXaf: 820 },
    { codeDci: '012901001', designation: 'Glucose 5% poche 500ml', forme: 'Poche', puEur: 1.30, puUsd: 1.40, puXaf: 852 },
    { codeDci: '010501003', designation: 'Artéméther + Luméfantrine 20/120mg (CTA Palu) bte de 24', forme: 'Comprimé', puEur: 2.30, puUsd: 2.50, puXaf: 1513 },
    { codeDci: '010101001', designation: 'Paracétamol 500mg comprimé bte de 1000', forme: 'Comprimé', puEur: 10.0, puUsd: 11.0, puXaf: 6560 },
    { codeDci: '010401001', designation: 'Amoxicilline + Acide Clavulanique 1g/100mg injectable', forme: 'Flacon injectable', puEur: 3.30, puUsd: 3.60, puXaf: 2180 },
    { codeDci: '010801002', designation: 'Sérum Antirabique Purifié 1000 UI injectable 5ml', forme: 'Flacon injectable', puEur: 37.0, puUsd: 40.0, puXaf: 24220 },
  ];

  const [orderLines, setOrderLines] = useState([
    {
      codeDci: sampleProducts[0].codeDci,
      quantiteCommandee: 10000,
      prixUnitaireDevise: sampleProducts[0].puEur,
    },
  ]);

  const selectedSupplier = suppliers.find((s) => s.id === selectedSupplierId) || suppliers[0];
  const rate = CURRENCY_RATES_TO_XAF[devise] || 655.957;

  const handleAddLine = () => {
    const next = sampleProducts.find((p) => !orderLines.some((l) => l.codeDci === p.codeDci)) || sampleProducts[0];
    const pu = devise === 'EUR' ? next.puEur : devise === 'USD' ? next.puUsd : next.puXaf;
    setOrderLines([
      ...orderLines,
      { codeDci: next.codeDci, quantiteCommandee: 5000, prixUnitaireDevise: pu },
    ]);
  };

  const handleRemoveLine = (idx) => {
    if (orderLines.length > 1) {
      setOrderLines(orderLines.filter((_, i) => i !== idx));
    }
  };

  const handleLineChange = (idx, field, val) => {
    const updated = [...orderLines];
    if (field === 'codeDci') {
      const prod = sampleProducts.find((p) => p.codeDci === val);
      const pu = devise === 'EUR' ? prod?.puEur : devise === 'USD' ? prod?.puUsd : prod?.puXaf;
      updated[idx].codeDci = val;
      updated[idx].prixUnitaireDevise = pu || 1.0;
    } else {
      updated[idx][field] = val;
    }
    setOrderLines(updated);
  };

  // Calculations
  const calculatedLines = orderLines.map((line) => {
    const prod = sampleProducts.find((p) => p.codeDci === line.codeDci) || {};
    const qty = Number(line.quantiteCommandee) || 0;
    const puDevise = Number(line.prixUnitaireDevise) || 0;
    const totalDevise = qty * puDevise;
    const puXaf = Math.round(puDevise * rate);
    const totalXaf = Math.round(totalDevise * rate);
    return {
      codeDci: line.codeDci,
      designation: prod.designation || 'Produit Pharmaceutique DCI',
      forme: prod.forme || 'Unité',
      dosage: 'Standard',
      quantiteCommandee: qty,
      prixUnitaireDevise: puDevise,
      totalLigneDevise: totalDevise,
      prixUnitaireXaf: puXaf,
      totalLigneXaf: totalXaf,
    };
  });

  const totalDevise = calculatedLines.reduce((acc, l) => acc + l.totalLigneDevise, 0);
  const totalXaf = calculatedLines.reduce((acc, l) => acc + l.totalLigneXaf, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newBc = {
      id: `bc-int-${Date.now().toString().slice(-4)}`,
      numeroCommande: `BC-INT-2026-${Math.floor(100 + Math.random() * 900)}`,
      fournisseurId: selectedSupplier?.id || 'fourn-01',
      fournisseurNom: selectedSupplier?.nom || 'Laboratoire International',
      fournisseurPays: selectedSupplier?.pays || 'International',
      fournisseurCode: selectedSupplier?.codeFournisseur || 'LAB-EXT',
      dateCommande: new Date().toISOString().split('T')[0],
      dateLivraisonPrevue,
      incoterm,
      devise,
      tauxChange: rate,
      montantDevise: totalDevise,
      montantTotalXaf: totalXaf,
      conditionsPaiement,
      statut: 'EN_VISA_DIR',
      acheteurNom: 'Mme Sandrine AVOMO (Chef Département Achats)',
      visaDir: {
        signataire: 'En attente Visa DIR',
        date: null,
        statut: 'EN_ATTENTE',
        commentaire: '',
      },
      visaDaf: {
        signataire: 'En attente Visa DAF',
        date: null,
        statut: 'EN_ATTENTE',
        commentaire: '',
      },
      visaDg: {
        signataire: 'En attente Signature DG',
        date: null,
        statut: 'EN_ATTENTE',
        commentaire: '',
      },
      shipping: {
        mode: incoterm.includes('Aéroport') ? 'Aérien' : 'Maritime',
        compagnie: 'Compagnie Maritime / Aérienne Internationale',
        navire: 'Navire en cours de programmation',
        portDepart: `${selectedSupplier?.pays || 'International'} Port`,
        portArrivee: 'Port d\'Owendo (Libreville - Gabon)',
        connaissementBL: 'EN_ATTENTE_BL',
        dateDepart: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        etaOwendo: dateLivraisonPrevue,
        temperatureSuivi: '15°C–25°C',
        statutDouane: 'EN_ATTENTE_EXPEDITION',
        nombreConteneurs: 'Fret conteneurisé',
      },
      lignes: calculatedLines,
      qrPayload: `OPN-BC-INT:NEW|FOURN:${selectedSupplier?.nom}|XAF:${totalXaf}|STATUS:SUBMITTED`,
    };

    onSaveOrder(newBc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col border border-slate-200 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white rounded-t-xl flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#00A651]/20 border border-[#00A651] flex items-center justify-center text-[#00A651]">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black tracking-widest text-[#00A651] uppercase">Nouveau Marché / Bon de Commande</span>
              <h3 className="text-base font-black text-white">Bon de Commande International (BC)</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5 text-xs text-slate-700">
          
          {/* Supplier & Commercial Conditions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Laboratoire Pharmaceutique / Fournisseur Fabricant
              </label>
              <select
                value={selectedSupplierId}
                onChange={(e) => {
                  setSelectedSupplierId(e.target.value);
                  const supp = suppliers.find((s) => s.id === e.target.value);
                  if (supp && supp.devisePref) setDevise(supp.devisePref);
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A651]"
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nom} ({s.pays}) — {s.type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Devise de Transaction</label>
              <select
                value={devise}
                onChange={(e) => setDevise(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A651]"
              >
                <option value="EUR">EUR (€) — Taux : 655.957 XAF</option>
                <option value="USD">USD ($) — Taux : 605.50 XAF</option>
                <option value="XAF">XAF (FCFA)</option>
              </select>
            </div>
          </div>

          {/* Incoterm & Payment Terms */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Incoterm ICC</label>
              <select
                value={incoterm}
                onChange={(e) => setIncoterm(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A651]"
              >
                <option value="CIF Port d'Owendo (Gabon)">CIF Port d'Owendo (Fret maritime)</option>
                <option value="CIP Aéroport International Léon Mba (Libreville)">CIP Aéroport Léon Mba (Fret aérien)</option>
                <option value="FOB Port de chargement">FOB Port d'embarquement</option>
                <option value="DDP Magasin Central Owendo">DDP Magasin Central Owendo</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Modalité de Règlement</label>
              <select
                value={conditionsPaiement}
                onChange={(e) => setConditionsPaiement(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A651]"
              >
                <option value="Lettre de Crédit Irrévocable et Confirmée (LC à 60 jours)">Lettre de Crédit Irrévocable (LC 60j)</option>
                <option value="Lettre de Crédit à vue (LC Sight)">Lettre de Crédit à vue (LC Sight)</option>
                <option value="Virement Bancaire Swift SWIFT/CAD">Virement Swift contre documents</option>
                <option value="Règlement à 30 jours fin de mois">Virement à 30 jours fin de mois</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Date Livraison Estimée (ETA)</label>
              <input
                type="date"
                value={dateLivraisonPrevue}
                onChange={(e) => setDateLivraisonPrevue(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A651]"
                required
              />
            </div>
          </div>

          {/* Line Items Selection */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-emerald-600" />
                <span>Articles & Produits Pharmaceutiques Commandés</span>
              </h4>
              <button
                type="button"
                onClick={handleAddLine}
                className="px-3 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1 border border-emerald-200"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter un produit</span>
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {orderLines.map((line, idx) => {
                const prod = sampleProducts.find((p) => p.codeDci === line.codeDci) || {};
                return (
                  <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center gap-3">
                    <div className="flex-1">
                      <select
                        value={line.codeDci}
                        onChange={(e) => handleLineChange(idx, 'codeDci', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A651]"
                      >
                        {sampleProducts.map((p) => (
                          <option key={p.codeDci} value={p.codeDci}>
                            {p.codeDci} — {p.designation} ({p.forme})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-28">
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Quantité</label>
                      <input
                        type="number"
                        min="1"
                        value={line.quantiteCommandee}
                        onChange={(e) => handleLineChange(idx, 'quantiteCommandee', parseInt(e.target.value) || 1)}
                        className="w-full px-2 py-1 rounded-lg border border-slate-300 font-bold text-center text-xs focus:outline-none focus:ring-2 focus:ring-[#00A651]"
                      />
                    </div>

                    <div className="w-28">
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">P.U. ({devise})</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={line.prixUnitaireDevise}
                        onChange={(e) => handleLineChange(idx, 'prixUnitaireDevise', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 rounded-lg border border-slate-300 font-bold text-center text-xs focus:outline-none focus:ring-2 focus:ring-[#00A651]"
                      />
                    </div>

                    <div className="w-32 text-right">
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Total XAF</label>
                      <span className="font-mono font-bold text-[#00A651] text-xs">
                        {Math.round((Number(line.quantiteCommandee) || 0) * (Number(line.prixUnitaireDevise) || 0) * rate).toLocaleString('fr-FR')} XAF
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveLine(idx)}
                      disabled={orderLines.length === 1}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded disabled:opacity-30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Total Recap Card */}
            <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Total Devises & Contrevaleur XAF</span>
                <div className="text-xl font-black text-[#00A651] font-mono">
                  {totalXaf.toLocaleString('fr-FR')} XAF
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-emerald-300 font-mono">
                  {totalDevise.toLocaleString('fr-FR')} {devise}
                </span>
                <p className="text-[10px] text-slate-400">Taux appliqué : 1 {devise} = {rate} XAF</p>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Notes / Instructions d'approvisionnement</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Ex: Marché annuel groupé DCI, certificats d'analyse requis avant embarquement..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#00A651]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              Annuler
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#00A651] hover:bg-[#008f45] text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Créer & Transmettre pour Visas (DIR ➔ DAF ➔ DG)</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
