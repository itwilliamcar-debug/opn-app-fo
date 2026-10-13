import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck, 
  ShieldCheck, 
  QrCode, 
  Send,
  Pill,
  Clock,
  History,
  Info
} from 'lucide-react';
import { formatXAF } from '../../utils/formatters';
import { validatePartialSupplyOrder } from '../../services/api';

export default function PartialValidationModal({
  isOpen,
  onClose,
  demande,
  activePersona,
  onValidationSuccess
}) {
  if (!isOpen || !demande) return null;

  // Lignes avec quantités modifiables
  const [lignesState, setLignesState] = useState(
    (demande.lignes || []).map(l => ({
      ligne_id: l.id,
      produit_id: l.produit_id,
      designation: l.produit ? l.produit.designation : 'Médicament DCI',
      dci: l.produit ? l.produit.dci : '',
      forme: l.produit ? l.produit.forme : '',
      prix_unitaire_xaf: l.prix_unitaire_xaf || 1850,
      quantite_demandee: l.quantite_demandee,
      quantite_disponible: l.quantite_disponible ?? l.quantite_demandee,
      quantite_validee: l.quantite_validee ?? l.quantite_demandee,
      motif: l.motif_reliquat || 'Disponibilité actuelle limitée en stock central',
      commentaire: l.commentaire_ligne || '',
    }))
  );

  const [motifGeneral, setMotifGeneral] = useState('Arbitrage provincial de dotation selon stock disponible.');
  const [submitting, setSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleQuantityChange = (ligneId, value) => {
    const val = Math.max(0, parseInt(value) || 0);
    setLignesState(prev => prev.map(l => {
      if (l.ligne_id === ligneId) {
        return {
          ...l,
          quantite_validee: val,
        };
      }
      return l;
    }));
  };

  const handleMotifChange = (ligneId, text) => {
    setLignesState(prev => prev.map(l => {
      if (l.ligne_id === ligneId) {
        return { ...l, motif: text };
      }
      return l;
    }));
  };

  const totalDemandee = lignesState.reduce((acc, l) => acc + l.quantite_demandee, 0);
  const totalValidee = lignesState.reduce((acc, l) => acc + l.quantite_validee, 0);
  const totalReliquat = Math.max(0, totalDemandee - totalValidee);
  const totalMontantValide = lignesState.reduce((acc, l) => acc + (l.quantite_validee * l.prix_unitaire_xaf), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    const payload = {
      signataire_nom: activePersona?.nom || 'Chef d\'Antenne',
      signataire_role: activePersona?.role || 'Chef d\'Antenne Provinciale',
      motif_general: motifGeneral,
      lignes: lignesState.map(l => ({
        ligne_id: l.ligne_id,
        quantite_validee: l.quantite_validee,
        motif: l.motif,
        commentaire: l.commentaire,
      })),
    };

    try {
      const res = await validatePartialSupplyOrder(demande.id, payload);
      setSubmitting(false);

      if (res && res.success) {
        setSuccessResult(res);
        if (onValidationSuccess) {
          onValidationSuccess(res.demande || demande);
        }
      } else {
        setErrorMessage(res?.message || 'Validation refusee par l\'API. Aucune signature locale n\'est emise.');
      }
    } catch (err) {
      setSubmitting(false);
      setErrorMessage(err?.message || 'Erreur API — signature electronique non enregistree.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-lg p-6 shadow-2xl space-y-5 relative max-h-[92vh] overflow-y-auto">
        
        {/* En-tête */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-[#2E68B4] text-white flex items-center justify-center font-bold text-sm shadow-sm">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Validation Métier & Signature Électronique
                </h3>
                <span className="font-mono text-xs font-bold text-[#2E68B4] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {demande.numero_demande}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Validation Partielle (ex: 80/100), calcul automatique des reliquats et scellement numérique certifié.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {successResult ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#00A651] flex items-center justify-center mx-auto border-2 border-emerald-200 shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">
                Validation Métier Scellée avec Succès
              </h4>
              <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                La demande <strong className="text-slate-900">{demande.numero_demande}</strong> a été enregistrée avec le statut <strong className="text-[#00A651]">{totalReliquat > 0 ? 'PARTIELLEMENT VALIDÉE' : 'VALIDÉE'}</strong>.
              </p>
            </div>

            {/* Certificat de signature & QR Code */}
            <div className="bg-slate-50 p-4 rounded-md border border-slate-200 text-xs text-left max-w-lg mx-auto space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 font-bold text-[#2E68B4]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#00A651]" />
                  Certificat de Signature Électronique OPN
                </span>
                <span className="font-mono text-[11px]">{successResult.signature?.qr_token}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div>
                  <span className="text-slate-500 block">Signataire :</span>
                  <strong className="text-slate-900">{successResult.signature?.signataire_nom}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Qualité :</span>
                  <strong className="text-slate-900">{successResult.signature?.signataire_role}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Quantité Validée :</span>
                  <strong className="text-[#00A651] font-bold">{totalValidee} / {totalDemandee} unités</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Reliquat Programmé :</span>
                  <strong className="text-amber-700 font-bold">{totalReliquat} unités</strong>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200 text-[10px] font-mono text-slate-500 truncate">
                Jeton Hash : {successResult.signature?.jeton_signature}
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#2E68B4] hover:bg-[#215091] text-white text-xs font-bold rounded-md shadow-sm transition-all"
            >
              Fermer la fenêtre
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Résumé du dossier */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-md border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 text-[11px] block">Demandeur :</span>
                <span className="font-bold text-slate-900 block truncate">{demande.demandeur_nom}</span>
                <span className="text-[10px] text-slate-500">{demande.structure?.nom || demande.antenne?.nom}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Antenne / Zone :</span>
                <span className="font-bold text-[#2E68B4] block">
                  {demande.antenne?.code_antenne} – {demande.antenne?.nom}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Montant Validé Estimé :</span>
                <span className="font-black text-slate-900 text-sm block">{formatXAF(totalMontantValide)}</span>
              </div>
            </div>

            {/* Table des lignes avec validation unitaire (Articles 16 & 17) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-bold text-slate-800 text-xs">
                  Contrôle des Lignes & Quantités Autorisées
                </label>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-slate-600 font-semibold">Total :</span>
                  <span className="font-bold text-slate-900">{totalDemandee} demandées</span>
                  <span>•</span>
                  <span className="font-bold text-[#00A651]">{totalValidee} validées</span>
                  {totalReliquat > 0 && (
                    <>
                      <span>•</span>
                      <span className="font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        {totalReliquat} reliquat
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="border border-slate-200 rounded-md overflow-hidden space-y-2 p-2 bg-slate-50/50">
                {lignesState.map((ligne, idx) => {
                  const reliquatLigne = Math.max(0, ligne.quantite_demandee - ligne.quantite_validee);
                  const isPartial = reliquatLigne > 0;

                  return (
                    <div 
                      key={ligne.ligne_id || idx}
                      className={`p-3 rounded border transition-all ${
                        isPartial 
                          ? 'bg-amber-50/60 border-amber-200' 
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{ligne.designation}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">
                              {ligne.dci}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-3">
                            <span>Demandé : <strong className="text-slate-800">{ligne.quantite_demandee}</strong></span>
                            <span>Dispo estimé : <strong className="text-blue-700">{ligne.quantite_disponible}</strong></span>
                            <span>Tarif unitaire : <strong>{formatXAF(ligne.prix_unitaire_xaf)}</strong></span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Quantité Validée</label>
                            <input
                              type="number"
                              min="0"
                              max={ligne.quantite_demandee}
                              value={ligne.quantite_validee}
                              onChange={(e) => handleQuantityChange(ligne.ligne_id, e.target.value)}
                              className="w-24 px-2.5 py-1.5 border border-slate-300 rounded font-bold text-slate-900 text-center bg-white focus:border-[#2E68B4] focus:outline-none"
                            />
                          </div>

                          <div className="w-20 text-center">
                            <span className="block text-[10px] font-bold text-slate-500 mb-0.5">Reliquat</span>
                            <span className={`inline-block px-2 py-1 rounded font-bold text-xs ${
                              reliquatLigne > 0 ? 'bg-amber-200 text-amber-900' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {reliquatLigne}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Motif si validation partielle (Article 16) */}
                      {isPartial && (
                        <div className="mt-2.5 pt-2 border-t border-amber-200/60 flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                          <span className="text-[11px] font-bold text-amber-800 shrink-0">
                            Motif du reliquat ({reliquatLigne} unités) :
                          </span>
                          <input
                            type="text"
                            required
                            placeholder="Ex: Stock disponible partiel, réassort prochain convoi"
                            value={ligne.motif}
                            onChange={(e) => handleMotifChange(ligne.ligne_id, e.target.value)}
                            className="flex-1 px-2.5 py-1 border border-amber-300 rounded text-xs text-slate-800 bg-white focus:outline-none"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Motif général et Signataire */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Motif Général de la Décision</label>
                <input
                  type="text"
                  value={motifGeneral}
                  onChange={(e) => setMotifGeneral(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs text-slate-900 bg-white focus:outline-none focus:border-[#2E68B4]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Signataire Officiel</label>
                <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-xs font-semibold text-slate-700">
                  {activePersona?.nom} ({activePersona?.role})
                </div>
              </div>
            </div>

            {/* Note de sécurité */}
            <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-md text-[11px] text-slate-700 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2E68B4] shrink-0" />
              <span>
                Conforme aux Articles 16, 17 & 18 : Toute modification génère une ligne d'audit non-destructive, un enregistrement d'audit et une signature électronique.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-[#00A651] hover:bg-[#008742] text-white text-xs font-bold rounded-md shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <FileCheck className="w-4 h-4" />
                <span>{submitting ? 'Scellement en cours...' : 'Signer & Approuver la Dotation'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
