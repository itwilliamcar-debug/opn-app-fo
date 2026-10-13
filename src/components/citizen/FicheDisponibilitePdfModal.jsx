import React, { useRef } from 'react';
import { X, Printer, Download, ShieldCheck, QrCode, Pill, CheckCircle2, Building2, MapPin, Phone, AlertCircle } from 'lucide-react';
import { formatXAF } from '../../utils/formatters';
import OpnLogo from '../common/OpnLogo';
import { downloadElementAsPdf, previewPrintDocument } from '../../utils/pdfExport';

export default function FicheDisponibilitePdfModal({
  isOpen,
  onClose,
  medicine,
  selectedProvince = 'Toutes les Provinces',
  facilities = []
}) {
  const printRef = useRef(null);

  if (!isOpen || !medicine) return null;

  const handlePrint = () => {
    previewPrintDocument();
  };

  const handleDownloadPdf = () => {
    const filename = `Fiche-Disponibilite-${medicine.dci || medicine.id}.pdf`;
    downloadElementAsPdf(printRef, filename);
  };

  const dateGeneration = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const availableFacilities = facilities.filter(f => f.stocksLive && f.stocksLive[medicine.id]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-md shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-200 border border-slate-300">
        
        {/* Header Modale */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-sm">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">Fiche Officielle de Disponibilité & Tarification Homologuée</h3>
              <p className="text-[11px] text-slate-400">Office Pharmaceutique National — République Gabonaise</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              title="Aperçu avant impression"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#00A651] hover:bg-[#008742] text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
              title="Téléchargement direct du document PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors ml-2 cursor-pointer"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Zone de contenu A4 imprimable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 flex justify-center print:p-0 print:bg-white print:overflow-visible">
          <div 
            ref={printRef}
            id="fiche-disponibilite-print"
            className="bg-white text-slate-800 p-8 sm:p-10 rounded-sm shadow-md border border-slate-200 print:shadow-none print:border-none print:p-6 print:m-0 w-full max-w-[210mm] min-h-[297mm] relative flex flex-col justify-between text-xs"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            {/* Liseré Tricolore Gabon */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#00A651] via-[#FFDE16] to-[#2E68B4] mb-6 rounded-xs" />

            <div>
              {/* En-tête Institutionnel Gabonais */}
              <div className="flex items-start justify-between border-b-2 border-slate-800 pb-5 mb-6">
                <div className="flex items-start gap-4">
                  <OpnLogo className="h-10 w-auto" />
                  <div>
                    <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-slate-800">RÉPUBLIQUE GABONAISE</h4>
                    <p className="text-[10px] text-slate-500 font-medium italic">Union — Travail — Justice</p>
                    <div className="h-0.5 w-12 bg-[#009e60] my-1" />
                    <p className="text-[10px] font-bold text-slate-700 uppercase">MINISTÈRE DE LA SANTÉ</p>
                    <p className="text-[10px] font-extrabold text-[#009e60]">OFFICE PHARMACEUTIQUE NATIONAL (OPN)</p>
                    <p className="text-[9px] text-slate-500">Direction de la Régulation & Observatoire National des Médicaments</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-block border border-emerald-600 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wide mb-1">
                    CERTIFICAT OFFICIEL DE DISPONIBILITÉ
                  </div>
                  <p className="text-[10px] text-slate-500">Réf : <span className="font-mono font-bold text-slate-800">OPN-PUB-{medicine.id}-2026</span></p>
                  <p className="text-[9.5px] text-slate-500">Délivré le : <span className="font-semibold text-slate-700">{dateGeneration}</span></p>
                  <p className="text-[9px] text-slate-400">Périmètre : {selectedProvince}</p>
                </div>
              </div>

              {/* Titre Principal */}
              <div className="text-center bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 mb-6">
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                  ATTESTATION PUBLIQUE DE DISPONIBILITÉ & DE TARIFICATION HOMOLOGUÉE
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Conforme au Décret N° 00412/PR/MS portant homologation de la Mercuriale Nationale des Médicaments Essentiels
                </p>
              </div>

              {/* Fiche Technique du Médicament */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <h5 className="text-[11px] font-bold uppercase text-slate-500 tracking-wider mb-2">Identification Moléculaire</h5>
                  <div className="space-y-1.5 text-xs">
                    <p className="flex justify-between"><span className="text-slate-500 font-medium">DCI :</span> <span className="font-bold text-slate-900">{medicine.dci}</span></p>
                    <p className="flex justify-between"><span className="text-slate-500 font-medium">Spécialité / Marque :</span> <span className="font-semibold text-slate-800">{medicine.nomCommercial}</span></p>
                    <p className="flex justify-between"><span className="text-slate-500 font-medium">Classe Thérapeutique :</span> <span className="text-slate-700">{medicine.classe}</span></p>
                    <p className="flex justify-between"><span className="text-slate-500 font-medium">Forme Galénique :</span> <span className="text-slate-700">{medicine.forme}</span></p>
                    <p className="flex justify-between"><span className="text-slate-500 font-medium">Dosage / Présentation :</span> <span className="font-semibold text-slate-800">{medicine.dosage}</span></p>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <h5 className="text-[11px] font-bold uppercase text-emerald-800 tracking-wider mb-2">Tarification Officielle Homologuée</h5>
                  <div className="space-y-1.5 text-xs">
                    <p className="flex justify-between items-center">
                      <span className="text-emerald-900 font-medium">Prix Public Plafonné (PPP) :</span> 
                      <span className="text-base font-black text-emerald-700">{formatXAF(medicine.prixPlafondXAF)}</span>
                    </p>
                    <p className="text-[10px] text-emerald-700 italic border-b border-emerald-200 pb-1 mb-1">
                      Prix maximum légal exigible dans toutes les structures publiques et officines conventionnées.
                    </p>
                    <div className="space-y-1 text-[11px]">
                      <p className="flex justify-between text-slate-700">
                        <span>CNAMGS Fonds 1 (GE Public 90%) :</span>
                        <span className="font-bold text-slate-900">Reste à charge {formatXAF(medicine.cnamgs?.fonds1_ge?.resteACharge || 0)}</span>
                      </p>
                      <p className="flex justify-between text-slate-700">
                        <span>CNAMGS Fonds 2 (Privé 80%) :</span>
                        <span className="font-bold text-slate-900">Reste à charge {formatXAF(medicine.cnamgs?.fonds2_prive?.resteACharge || 0)}</span>
                      </p>
                      <p className="flex justify-between text-emerald-800 font-semibold">
                        <span>CNAMGS Fonds 3 (GEF 100%) :</span>
                        <span className="font-black text-emerald-700">0 FCFA (Gratuit)</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Indication Thérapeutique */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-6 text-xs text-blue-900 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Indication Thérapeutique Officielle : </span>
                  <span>{medicine.indication}</span>
                </div>
              </div>

              {/* Tableau des Structures Hospitalières avec Stocks Vérifiés */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center justify-between">
                  <span>Points de Délivrance & Disponibilité en Temps Réel ({availableFacilities.length} structures vérifiées)</span>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Synchronisation OPN Live
                  </span>
                </h4>

                <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[10px] uppercase">
                        <th className="py-2 px-3">Structure Hospitalière</th>
                        <th className="py-2 px-2">Province / Ville</th>
                        <th className="py-2 px-2">Horaires Pharmacie</th>
                        <th className="py-2 px-2 text-right">Stock Disponible</th>
                        <th className="py-2 px-3 text-center">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[11px]">
                      {availableFacilities.slice(0, 6).map((fac) => {
                        const stockInfo = fac.stocksLive[medicine.id];
                        return (
                          <tr key={fac.id} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-semibold text-slate-900">{fac.nom}</td>
                            <td className="py-2 px-2 text-slate-600">{fac.province} ({fac.ville})</td>
                            <td className="py-2 px-2 text-slate-500 text-[10px]">{fac.horaires.split('—')[0]}</td>
                            <td className="py-2 px-2 text-right font-mono font-bold text-slate-800">{stockInfo.quantite} u.</td>
                            <td className="py-2 px-3 text-center">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                Immédiat
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mentions Réglementaires & Recours Citoyen */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg mb-4 text-[10px] text-slate-600 space-y-1">
                <p className="font-bold text-slate-800 uppercase">Protection des Droits des Patients & Voie de Recours :</p>
                <p>
                  1. Toute facturation excédant le Prix Public Plafonné (PPP) mentionné ci-dessus constitue une infraction grave passible de sanctions administratives et pénales.
                </p>
                <p>
                  2. En cas de refus de délivrance ou d'exigence de paiement indu, signalez immédiatement l'incident sur le Guichet Citoyen OPN ou composez le Numéro Vert National Gratuit <strong>1410</strong>.
                </p>
              </div>
            </div>

            {/* Pied de Page & Authentification */}
            <div className="border-t-2 border-slate-800 pt-4 mt-4">
              <div className="grid grid-cols-3 items-end text-center">
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <QrCode className="w-12 h-12 text-slate-800" />
                    <div>
                      <p className="text-[8px] text-slate-500 font-mono">ANINF SECURE TAG</p>
                      <p className="text-[9px] font-bold text-slate-700">VERIF-PUB-{medicine.id}</p>
                      <p className="text-[8px] text-slate-400">www.opn.ga/verif</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-700 uppercase">Direction de la Régulation OPN</p>
                  <p className="text-[9px] text-slate-500 italic">Dr. Jeanne ENGONE</p>
                  <div className="h-6" />
                  <p className="text-[9px] font-semibold text-[#009e60]">Visa & Cachet Électronique</p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-700 uppercase">Le Directeur Général</p>
                  <p className="text-[9px] text-slate-500 italic">Office Pharmaceutique National</p>
                  <div className="h-6" />
                  <p className="text-[9px] font-semibold text-slate-800">Pr. Edgard NGOUNDOU</p>
                </div>
              </div>

              <div className="mt-3 text-center text-[8px] text-slate-400 border-t border-slate-200 pt-1">
                Office Pharmaceutique National — BP 527 Libreville, Gabon — Tél : 1410 (Gratuit) — Email : contact@opn.ga — Système National ERP OPN 2026
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
