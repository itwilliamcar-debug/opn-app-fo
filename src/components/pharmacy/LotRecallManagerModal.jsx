import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  Search, 
  ShieldAlert, 
  Building2, 
  Package, 
  Lock, 
  CheckCircle2, 
  Printer, 
  Download, 
  Mail, 
  Calendar, 
  Phone, 
  FileText,
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { SICL_LOT_TRACEABILITY_SEED } from '../../data/siclSeedData';
import { downloadOfficialHtml } from '../../utils/downloadHelpers';

export default function LotRecallManagerModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [lotSearch, setLotSearch] = useState('LOT-AMX-2026-08');
  const [selectedLotData, setSelectedLotData] = useState(
    SICL_LOT_TRACEABILITY_SEED.find(l => l.numeroLot === 'LOT-AMX-2026-08') || SICL_LOT_TRACEABILITY_SEED[0]
  );
  const [stockBlocked, setStockBlocked] = useState(false);
  const [isNotifyingClients, setIsNotifyingClients] = useState(false);
  const [notificationSuccess, setNotificationSuccess] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const found = SICL_LOT_TRACEABILITY_SEED.find(
      l => l.numeroLot.toLowerCase().includes(lotSearch.toLowerCase()) ||
           l.designation.toLowerCase().includes(lotSearch.toLowerCase())
    );
    if (found) {
      setSelectedLotData(found);
      setStockBlocked(found.statutSanitaire === 'BLOQUE' || found.statutSanitaire === 'ALERTE_RAPPEL_QUALITE');
    }
  };

  const handleBlockResidualStock = () => {
    setStockBlocked(true);
  };

  const handleSendRecallNotices = () => {
    setIsNotifyingClients(true);
    setTimeout(() => {
      setIsNotifyingClients(false);
      setNotificationSuccess(true);
      setTimeout(() => setNotificationSuccess(false), 5000);
    }, 1500);
  };

  const handleGeneratePdfNotice = () => {
    if (!selectedLotData) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>NOTIFICATION OFFICIELLE DE RAPPEL DE LOT - OPN GABON</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 30px; color: #1e293b; font-size: 13px; line-height: 1.5; }
          .header { border-bottom: 2px solid #003366; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
          .flag { font-weight: bold; font-size: 11px; text-transform: uppercase; color: #00A651; }
          .title { font-size: 18px; font-weight: bold; color: #b91c1c; text-align: center; margin: 20px 0; text-transform: uppercase; border: 2px solid #b91c1c; padding: 10px; background: #fef2f2; }
          .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .meta-table td { padding: 8px; border: 1px solid #cbd5e1; }
          .meta-table .label { background-color: #f1f5f9; font-weight: bold; width: 30%; color: #003366; }
          .clients-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .clients-table th { background-color: #003366; color: white; padding: 8px; text-align: left; font-size: 11px; }
          .clients-table td { padding: 8px; border: 1px solid #cbd5e1; font-size: 12px; }
          .footer-signatures { margin-top: 40px; display: flex; justify-content: space-between; }
          .sig-box { width: 45%; border-top: 1px solid #94a3b8; padding-top: 8px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="flag">RÉPUBLIQUE GABONAISE — MINISTÈRE DE LA SANTÉ</div>
            <strong style="color: #003366; font-size: 15px;">OFFICE PHARMACEUTIQUE NATIONAL (OPN)</strong><br>
            Direction Pharmaceutique & Contrôle Qualité — Hub Owendo
          </div>
          <div style="text-align: right; font-size: 11px;">
            Réf : <strong>OPN/DMP/RAPPEL-${selectedLotData.numeroLot}</strong><br>
            Date d'émission : ${new Date().toLocaleDateString('fr-FR')}
          </div>
        </div>

        <div class="title">
          URGENT : AVIS DE RETRAIT ET DE RAPPEL DE LOT PHARMACEUTIQUE (AM-07)
        </div>

        <p>
          À l'attention des Directeurs d'Hôpitaux, Médecins-Chefs, Pharmaciens Responsables et Gestionnaires d'Officines partenaires de l'Office Pharmaceutique National.
        </p>

        <table class="meta-table">
          <tr>
            <td class="label">Spécialité Pharmaceutique</td>
            <td><strong>${selectedLotData.designation}</strong></td>
          </tr>
          <tr>
            <td class="label">DCI (Principe Actif)</td>
            <td>${selectedLotData.dci}</td>
          </tr>
          <tr>
            <td class="label">Numéro de Lot concerné</td>
            <td><strong style="color: #b91c1c; font-size: 14px;">${selectedLotData.numeroLot}</strong></td>
          </tr>
          <tr>
            <td class="label">Date de Péremption</td>
            <td>${selectedLotData.datePeremption}</td>
          </tr>
          <tr>
            <td class="label">Fabricant / Laboratoire</td>
            <td>${selectedLotData.laboratoire}</td>
          </tr>
          <tr>
            <td class="label">Motif du Rappel Sanitaire</td>
            <td><strong style="color: #b91c1c;">${selectedLotData.motifAlerte || 'Mesure de précaution qualité sanitaire'}</strong></td>
          </tr>
        </table>

        <h4 style="color: #003366; border-bottom: 1px solid #003366; padding-bottom: 4px;">
          1. Consignes Impératives aux Structures Destinataires :
        </h4>
        <ul>
          <li><strong>Cesser immédiatement toute dispensation</strong> et toute administration aux patients du lot susmentionné.</li>
          <li>Isoler et placer les unités restantes en <strong>zone de quarantaine sécurisée</strong> avec la mention « NE PAS DÉLIVRER - RAPPEL OPN ».</li>
          <li>Contacter l'antenne provinciale OPN de rattachement pour organiser le retour physique et l'édition de l'avoir commercial compensatoire.</li>
        </ul>

        <h4 style="color: #003366; border-bottom: 1px solid #003366; padding-bottom: 4px; margin-top: 25px;">
          2. État des Livraisons Traçables (Traçabilité Descendante SICL) :
        </h4>
        <table class="clients-table">
          <thead>
            <tr>
              <th>Structure Sanitaire</th>
              <th>Province</th>
              <th>N° Facture & BL</th>
              <th>Date Livraison</th>
              <th>Quantité Livrée</th>
            </tr>
          </thead>
          <tbody>
            ${selectedLotData.clientsLivres.map(c => `
              <tr>
                <td><strong>${c.nomClient}</strong></td>
                <td>${c.province}</td>
                <td>${c.numeroFacture} / ${c.numeroBL}</td>
                <td>${c.dateLivraison}</td>
                <td><strong>${c.quantiteLivree.toLocaleString()} unités</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer-signatures">
          <div class="sig-box">
            Pour le Pharmacien Chef National OPN<br>
            <strong>Dr. François MBA ALLOGO</strong><br>
            <em>Visa Qualité & Pharmacovigilance</em>
          </div>
          <div class="sig-box">
            Pour la Direction Générale de l'OPN<br>
            <strong>Dr. Jean-Bernard OBAME NDONG</strong><br>
            <em>Directeur Général</em>
          </div>
        </div>
      </body>
      </html>
    `;

    downloadOfficialHtml(htmlContent, `RAPPEL_OFFICIEL_${selectedLotData.numeroLot}.html`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900 via-red-800 to-[#003366] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <ShieldAlert className="w-6 h-6 text-red-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-red-500/30 border border-red-400/40 text-red-200 px-2 py-0.5 rounded">
                  Sécurité Sanitaire (EF-M6-19 &amp; AM-07)
                </span>
                <span className="text-xs text-slate-300 font-mono">Traçabilité Descendante Instantanée</span>
              </div>
              <h3 className="font-bold text-lg text-white">Rappel de Lot &amp; Traçabilité Descendante</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Entrez le numéro de lot (ex: LOT-AMX-2026-08) ou la DCI..."
                value={lotSearch}
                onChange={(e) => setLotSearch(e.target.value)}
                className="w-full text-xs font-mono font-bold pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 bg-slate-50"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#003366] hover:bg-[#002244] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Rechercher le Lot
            </button>
          </form>

          {selectedLotData ? (
            <div className="space-y-6">
              
              {/* Lot Card Summary */}
              <div className="bg-gradient-to-br from-slate-50 to-red-50/40 p-4 rounded-2xl border border-red-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-black font-mono text-red-700 bg-red-100 px-2.5 py-0.5 rounded-lg border border-red-300">
                        {selectedLotData.numeroLot}
                      </span>
                      <span className="text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {selectedLotData.laboratoire}
                      </span>
                      <span className="text-xs text-slate-500">
                        Péremption : <strong>{selectedLotData.datePeremption}</strong>
                      </span>
                    </div>
                    <h4 className="text-base font-black text-slate-900">{selectedLotData.designation}</h4>
                    <p className="text-xs text-slate-600">DCI : <strong className="text-slate-800">{selectedLotData.dci}</strong> • PMP Entrée : {selectedLotData.pmpEntreeXaf.toLocaleString()} XAF</p>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-2 shrink-0">
                    {stockBlocked ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-xl shadow-sm">
                        <Lock className="w-4 h-4" /> STOCK RÉSIDUEL BLOQUÉ
                      </span>
                    ) : (
                      <button
                        onClick={handleBlockResidualStock}
                        className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        Bloquer Tout le Stock Résiduel
                      </button>
                    )}
                  </div>
                </div>

                {selectedLotData.motifAlerte && (
                  <div className="mt-3 pt-3 border-t border-red-200/60 flex items-center gap-2 text-xs text-red-800 font-medium">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span><strong>Motif de l'alerte :</strong> {selectedLotData.motifAlerte}</span>
                  </div>
                )}
              </div>

              {/* Volume Distribution Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Stock Initial Reçu</p>
                  <p className="text-lg font-black text-slate-900">{selectedLotData.stockInitialTotal.toLocaleString()} unités</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-amber-200 bg-amber-50/30 shadow-sm">
                  <p className="text-[10px] uppercase font-bold text-amber-700">Déjà Livré aux Structures</p>
                  <p className="text-lg font-black text-amber-800">{selectedLotData.stockLivreTotal.toLocaleString()} unités ({selectedLotData.clientsLivres.length} clients)</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-red-200 bg-red-50/30 shadow-sm">
                  <p className="text-[10px] uppercase font-bold text-red-700">Stock Résiduel en Dépôts</p>
                  <p className="text-lg font-black text-red-800">{selectedLotData.stockResiduelTotal.toLocaleString()} unités</p>
                </div>
              </div>

              {/* Residual Depots Status */}
              <div>
                <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-[#003366]" /> Localisation du Stock Résiduel en Dépôts OPN
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {selectedLotData.depotsStockResiduel.map(depot => (
                    <div key={depot.depotId} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-800">{depot.antenneNom}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{depot.depotId}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-slate-900 block">{depot.quantite.toLocaleString()} u.</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${stockBlocked || depot.statut.includes('BLOQUE') ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {stockBlocked ? 'BLOQUÉ' : depot.statut}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivered Clients Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-red-700" /> Structures de Santé Livrées (Traçabilité Descendante)
                  </h5>
                  <span className="text-[11px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                    {selectedLotData.clientsLivres.length} Établissements à notifier
                  </span>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold">
                      <tr>
                        <th className="p-2.5">Structure Sanitaire</th>
                        <th className="p-2.5">Province</th>
                        <th className="p-2.5">Facture &amp; BL</th>
                        <th className="p-2.5">Date Livraison</th>
                        <th className="p-2.5">Quantité</th>
                        <th className="p-2.5">Contact Réception</th>
                        <th className="p-2.5">Statut Notification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedLotData.clientsLivres.map((client, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-slate-900">{client.nomClient}</td>
                          <td className="p-2.5 text-slate-600">{client.province}</td>
                          <td className="p-2.5 font-mono text-[11px] text-blue-700 font-bold">
                            {client.numeroFacture} / {client.numeroBL}
                          </td>
                          <td className="p-2.5 text-slate-600">{client.dateLivraison}</td>
                          <td className="p-2.5 font-black text-slate-900">{client.quantiteLivree.toLocaleString()}</td>
                          <td className="p-2.5 text-[11px] text-slate-600">
                            {client.responsableReception}<br/>
                            <span className="text-slate-400 font-mono">{client.telephone}</span>
                          </td>
                          <td className="p-2.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                              {client.statutRappel}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Bar */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGeneratePdfNotice}
                    className="px-4 py-2 bg-[#003366] hover:bg-[#002244] text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4 text-[#00A651]" />
                    Éditer Courrier Officiel de Rappel (PDF/HTML)
                  </button>

                  <button
                    onClick={handleSendRecallNotices}
                    disabled={isNotifyingClients}
                    className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Mail className="w-4 h-4" />
                    {isNotifyingClients ? 'Envoi des alertes...' : 'Diffuser Avis aux Hôpitaux (Email/SMS)'}
                  </button>
                </div>

                {notificationSuccess && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-lg">
                    <CheckCircle2 className="w-4 h-4" />
                    Notification diffusée aux 4 structures !
                  </span>
                )}
              </div>

            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Aucun lot trouvé.
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
