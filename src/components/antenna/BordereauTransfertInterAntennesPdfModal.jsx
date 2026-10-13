import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Building2, 
  Truck, 
  ShieldCheck, 
  ArrowRightLeft, 
  Thermometer, 
  Calendar, 
  CheckCircle2, 
  FileText,
  AlertTriangle,
  Boxes
} from 'lucide-react';
import { formatXAF, formatNumber } from '../../utils/formatters';
import OpnLogo from '../common/OpnLogo';
import { downloadElementAsPdf, previewPrintDocument } from '../../utils/pdfExport';

export default function BordereauTransfertInterAntennesPdfModal({
  isOpen,
  onClose,
  transferData,
  transfer
}) {
  const documentRef = useRef(null);
  if (!isOpen) return null;

  const data = transferData || transfer;

  const handlePrint = () => {
    previewPrintDocument();
  };

  const handleSavePdf = () => {
    const filename = `Bordereau-Transfert-${data?.id || 'inter-antennes'}.pdf`;
    downloadElementAsPdf(documentRef, filename);
  };

  const todayStr = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const numTransfert = data?.id || `TRF-INTER-2026-${new Date().getFullYear()}-089`;
  const antenneSource = data?.source || 'Antenne G1 - Estuaire (Hub Central Owendo)';
  const antenneDest = data?.destination || 'Antenne G6 - Ogooué-Ivindo (Chef-Lieu Makokou)';
  const pharmacienSource = data?.pharmacienSource || 'Dr. Guy-Roger MBA (Pharmacien Régional G1)';
  const pharmacienDest = data?.pharmacienDest || 'Dr. Clarisse OBAME (Pharmacienne Régionale G6)';
  const motif = data?.motif || 'Péréquation d\'urgence suite à flambée palustre saisonnière (Évitement de rupture de stock)';
  const vecteur = data?.vecteur || 'Convoi Frigorifique Tout-Terrain 4x4 (GA-8821-OPN)';
  const tempConvoi = data?.temperature || '+2°C à +8°C (Glacières autonomes 72h)';

  const lignes = data?.lignes || [
    { code: '010301001', dci: 'Artéméther + Luméfantrine 20/120mg CP (Coartem)', lot: 'CTM-2026-08', peremption: '2028-09-30', qte: 4500, valXaf: 4275000 },
    { code: '010301015', dci: 'Artésunate Injectable 60mg PDR + Solv', lot: 'ART-2026-12', peremption: '2028-06-30', qte: 2000, valXaf: 2400000 },
    { code: '010401004', dci: 'Amoxicilline + Acide Clavulanique 1g/125mg CP', lot: 'AMC-2026-44', peremption: '2027-11-30', qte: 1800, valXaf: 3330000 },
    { code: '010701002', dci: 'Paracétamol 1g Comprimé (Doliprane)', lot: 'PAR-2026-90', peremption: '2029-01-31', qte: 3000, valXaf: 7449000 },
    { code: '012901002', dci: 'Sérum Physiologique NaCl 0.9% poche 500ml', lot: 'SER-2026-03', peremption: '2028-05-31', qte: 1200, valXaf: 984000 }
  ];

  const totalValeur = lignes.reduce((acc, l) => acc + l.valXaf, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-xl shadow-2xl border border-slate-300 my-auto overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Barre d'actions supérieure (non imprimable) */}
        <div className="print:hidden flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-emerald-600 text-white rounded">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide">
                Bordereau Officiel de Transfert Inter-Antennes & Cession Régionale (A4)
              </h2>
              <p className="text-[11px] text-slate-400">
                Réf : {numTransfert} — Direction des Approvisionnements & Coordination Provinciale
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimer
            </button>
            <button
              onClick={handleSavePdf}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#00A651] hover:bg-[#008742] text-white rounded-md text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Enregistrer PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors cursor-pointer ml-2"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Corps du Document A4 (Imprimable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 print:bg-white print:p-0 print:overflow-visible flex justify-center">
          <div ref={documentRef} className="max-w-[210mm] w-full mx-auto bg-white p-8 sm:p-10 rounded-sm shadow-md border border-slate-200 print:shadow-none print:border-none print:p-6 print:m-0 text-slate-900 text-xs">
            
            {/* Liseré tricolore Gabon */}
            <div className="h-2 w-full bg-gradient-to-r from-[#00A651] via-[#FFDE16] to-[#2E68B4] mb-5 rounded-xs" />

            {/* En-tête Institutionnel Gabon */}
            <div className="flex justify-between items-start border-b border-slate-300 pb-5 mb-5">
              <div className="space-y-1 max-w-[35%]">
                <p className="font-extrabold text-[11px] tracking-wider text-slate-800 uppercase">
                  RÉPUBLIQUE GABONAISE
                </p>
                <p className="text-[10px] text-slate-600 font-semibold italic">
                  Union — Travail — Justice
                </p>
                <div className="pt-2">
                  <p className="text-[10px] font-bold text-slate-700">MINISTÈRE DE LA SANTÉ</p>
                  <p className="text-[10px] font-black text-emerald-800">OFFICE PHARMACEUTIQUE NATIONAL</p>
                  <p className="text-[9px] text-slate-600">Direction des Approvisionnements & Coordination Provinciale</p>
                </div>
              </div>

              {/* Logo OPN Central */}
              <div className="flex flex-col items-center justify-center text-center px-2">
                <OpnLogo className="h-11 w-auto mb-1" />
                <span className="text-[9px] font-black text-slate-800 uppercase">Centrale Nationale d'Achat</span>
              </div>

              {/* Sceau & Visa */}
              <div className="text-right space-y-1 max-w-[35%]">
                <div className="inline-block p-2 bg-emerald-50 border border-emerald-300 rounded text-center">
                  <span className="text-[9px] font-bold text-emerald-900 block uppercase">
                    PROTOCOLE DE PÉRÉQUATION SANITAIRE
                  </span>
                  <span className="text-xs font-black text-slate-900 block font-mono">
                    TRANSFERT D'URGENCE INTER-HUBS
                  </span>
                  <span className="text-[9.5px] text-emerald-800 font-semibold block mt-0.5">
                    Solidarité Territoriale Inter-Provinces
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 pt-1">
                  Émis à Libreville, le <strong>{todayStr}</strong>
                </p>
              </div>
            </div>

            {/* Titre du document */}
            <div className="text-center my-4 py-2.5 bg-emerald-50/80 border-y border-emerald-300">
              <h1 className="text-sm font-black text-emerald-950 uppercase tracking-wide">
                BORDEREAU DE TRANSFERT INTER-ANTENNES & CESSION FRIGORIFIQUE
              </h1>
              <p className="text-[10px] text-emerald-800 font-medium mt-0.5 font-mono">
                Réf : {numTransfert} • Autorisation DAA / DG-OPN
              </p>
            </div>

            {/* Grille des Antennes & Conditions de Transport */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              {/* Antenne Cédante (Source) */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <h3 className="text-[11px] font-bold text-slate-800 uppercase mb-2 border-b border-slate-200 pb-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-600" />
                  Antenne Émettrice (Cédante)
                </h3>
                <table className="w-full text-[10.5px]">
                  <tbody>
                    <tr>
                      <td className="text-slate-500 py-0.5 w-1/3">Hub Source :</td>
                      <td className="font-bold text-slate-900">{antenneSource}</td>
                    </tr>
                    <tr>
                      <td className="text-slate-500 py-0.5">Pharmacien Cédant :</td>
                      <td className="font-semibold text-slate-800">{pharmacienSource}</td>
                    </tr>
                    <tr>
                      <td className="text-slate-500 py-0.5">Motif Péréquation :</td>
                      <td className="text-emerald-800 font-medium">{motif}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Antenne Réceptrice (Destination) */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <h3 className="text-[11px] font-bold text-slate-800 uppercase mb-2 border-b border-slate-200 pb-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                  Antenne Réceptrice (Bénéficiaire)
                </h3>
                <table className="w-full text-[10.5px]">
                  <tbody>
                    <tr>
                      <td className="text-slate-500 py-0.5 w-1/3">Hub Destinataire :</td>
                      <td className="font-bold text-emerald-900">{antenneDest}</td>
                    </tr>
                    <tr>
                      <td className="text-slate-500 py-0.5">Pharmacien Dest. :</td>
                      <td className="font-semibold text-slate-800">{pharmacienDest}</td>
                    </tr>
                    <tr>
                      <td className="text-slate-500 py-0.5">Acheminement :</td>
                      <td className="font-semibold text-slate-800">{vecteur}</td>
                    </tr>
                    <tr>
                      <td className="text-slate-500 py-0.5">Chaîne Froid :</td>
                      <td className="font-mono text-emerald-700 font-bold">{tempConvoi}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tableau des Médicaments & Lots Transférés */}
            <div className="mb-5">
              <h3 className="text-[11px] font-bold text-slate-800 uppercase mb-2 flex items-center justify-between">
                <span>Désignation des Médicaments Essentiels & Quantités Cédées</span>
                <span className="text-[10px] font-normal text-slate-500">Traçabilité par Numéro de Lot & Péremption</span>
              </h3>

              <table className="w-full text-left border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 text-[10px]">
                    <th className="py-1.5 px-2 border-r border-slate-300">Code DCI</th>
                    <th className="py-1.5 px-2 border-r border-slate-300">Désignation Commune Internationale (DCI)</th>
                    <th className="py-1.5 px-2 border-r border-slate-300 text-center">N° de Lot</th>
                    <th className="py-1.5 px-2 border-r border-slate-300 text-center">Péremption</th>
                    <th className="py-1.5 px-2 border-r border-slate-300 text-right">Quantité Cédée</th>
                    <th className="py-1.5 px-2 text-right">Valeur Stock (FCFA)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[10px]">
                  {lignes.map((l, idx) => (
                    <tr key={idx} className={idx % 2 === 1 ? 'bg-slate-50/60' : ''}>
                      <td className="py-1.5 px-2 font-mono font-bold text-slate-700 border-r border-slate-300">{l.code}</td>
                      <td className="py-1.5 px-2 font-semibold text-slate-900 border-r border-slate-300">{l.dci}</td>
                      <td className="py-1.5 px-2 text-center font-mono font-bold text-slate-800 border-r border-slate-300">{l.lot}</td>
                      <td className="py-1.5 px-2 text-center text-slate-600 border-r border-slate-300">{l.peremption}</td>
                      <td className="py-1.5 px-2 text-right font-bold text-slate-900 border-r border-slate-300">
                        {l.qte.toLocaleString('fr-FR')}
                      </td>
                      <td className="py-1.5 px-2 text-right font-mono font-bold text-slate-900">
                        {l.valXaf.toLocaleString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-emerald-50 font-bold border-t-2 border-slate-400 text-[10.5px]">
                    <td colSpan="5" className="py-2 px-2 text-right text-emerald-950 uppercase border-r border-slate-300">
                      Valeur Comptable Totale Transférée (FCFA) :
                    </td>
                    <td className="py-2 px-2 text-right font-mono font-black text-emerald-900">
                      {totalValeur.toLocaleString('fr-FR')} FCFA
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Note d'imputation comptable et péréquation */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded mb-5 text-[10px] space-y-1">
              <h4 className="font-bold text-slate-900 uppercase">Imputation Comptable & Traçabilité DAF</h4>
              <p className="text-slate-600">
                La présente cession fait l'objet d'un transfert d'écriture comptable interne entre comptes analytiques provinciaux sans facturation commerciale, sous l'autorité de la Direction Administrative et Financière de l'OPN.
              </p>
            </div>

            {/* Signatures & Visas Tripartites */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-300 text-center">
              <div className="space-y-12">
                <div>
                  <p className="text-[10px] font-bold text-slate-800 uppercase">Le Pharmacien Cédant (Source)</p>
                  <p className="text-[9px] text-slate-500">{antenneSource}</p>
                </div>
                <div className="text-[9.5px] font-mono text-slate-900 font-bold border-t border-dotted border-slate-400 pt-1 inline-block">
                  Décharge & Sortie de Stock<br />
                  <span className="text-[8px] text-slate-500 font-normal">Sceau Antenne Source</span>
                </div>
              </div>

              <div className="space-y-12">
                <div>
                  <p className="text-[10px] font-bold text-slate-800 uppercase">Le Pharmacien Destinataire</p>
                  <p className="text-[9px] text-slate-500">{antenneDest}</p>
                </div>
                <div className="text-[9.5px] font-mono text-emerald-800 font-bold border-t border-dotted border-slate-400 pt-1 inline-block">
                  Prise en Charge Conforme<br />
                  <span className="text-[8px] text-slate-500 font-normal">Entrée en chambre froide</span>
                </div>
              </div>

              <div className="space-y-12">
                <div>
                  <p className="text-[10px] font-bold text-slate-800 uppercase">Le Directeur des Approvisionnements</p>
                  <p className="text-[9px] text-slate-500">Direction Générale OPN</p>
                </div>
                <div className="text-[9.5px] font-mono text-blue-900 font-bold border-t border-dotted border-slate-400 pt-1 inline-block">
                  Visa Péréquation Accordé<br />
                  <span className="text-[8px] text-slate-500 font-normal">Pour le Directeur Général</span>
                </div>
              </div>
            </div>

            {/* Bas de page officiel */}
            <div className="mt-8 pt-3 border-t border-slate-200 text-center text-[8.5px] text-slate-500">
              Office Pharmaceutique National (OPN) — Système Central ERP Gabon 2026 • Réseau des 9 Antennes Provinciales • Péréquation Inter-Régionale
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
