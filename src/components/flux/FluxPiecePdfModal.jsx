import React, { useRef, useState } from 'react';
import { X, Printer, Download, FileText, Receipt, Loader2 } from 'lucide-react';
import OpnLogo from '../common/OpnLogo';
import { previewPrintDocument } from '../../utils/pdfExport';
import { downloadFluxDocumentPdf, triggerBlobDownload } from '../../services/api';

function formaterMontant(valeur) {
  const n = Number(valeur || 0);
  return `${n.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} XAF`;
}

function formaterDate(valeur) {
  if (!valeur) return '—';
  try {
    return new Date(valeur).toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return String(valeur);
  }
}

export default function FluxPiecePdfModal({ piece, isOpen, onClose }) {
  const printRef = useRef(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState('');
  if (!isOpen || !piece) return null;

  const estFacture = piece.type === 'FACTURE';
  const titre = estFacture ? 'Facture OPN' : 'Bon de commande OPN';
  const Icone = estFacture ? Receipt : FileText;

  const handlePrint = () => previewPrintDocument();
  const handleDownloadPdf = async () => {
    if (!piece.id || pdfLoading) return;
    setPdfError('');
    setPdfLoading(true);
    try {
      const { blob, filename } = await downloadFluxDocumentPdf(piece.id);
      triggerBlobDownload(blob, filename || `${piece.type}-${piece.numero || 'DOC'}.pdf`);
    } catch (err) {
      setPdfError(err?.message || 'Impossible de télécharger le PDF.');
    } finally {
      setPdfLoading(false);
    }
  };

  const lignes = piece.lignes || [];

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-md shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 bg-slate-900 text-white shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center">
              <Icone className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold">{titre}</p>
              <p className="text-[11px] text-slate-300 font-mono">{piece.numero}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={handlePrint} className="px-2.5 py-1.5 text-[11px] font-semibold rounded border border-slate-600 hover:bg-slate-800 flex items-center gap-1">
              <Printer className="w-3.5 h-3.5" /> Imprimer
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={pdfLoading || !piece.id}
              className="px-2.5 py-1.5 text-[11px] font-semibold rounded bg-white text-slate-900 hover:bg-slate-100 disabled:opacity-60 flex items-center gap-1"
            >
              {pdfLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              PDF
            </button>
            <button type="button" onClick={onClose} className="p-1.5 rounded hover:bg-slate-800" aria-label="Fermer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {pdfError && (
          <div className="px-5 py-2 bg-red-50 border-b border-red-100 text-[11px] text-red-700 print:hidden">
            {pdfError}
          </div>
        )}

        <div className="overflow-y-auto p-5 bg-slate-50">
          <div ref={printRef} className="relative bg-white border border-slate-200 rounded-md p-6 space-y-5 text-slate-800 overflow-hidden">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
              style={{ zIndex: 0 }}
            >
              <span
                className="text-[120px] font-black tracking-[0.2em] text-slate-400/20"
                style={{ transform: 'rotate(-32deg)' }}
              >
                OPN
              </span>
            </div>
            <div className="relative space-y-5" style={{ zIndex: 1 }}>
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <OpnLogo className="w-12 h-12" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">Office Pharmaceutique National</p>
                    <p className="text-[11px] text-slate-500">République Gabonaise · Chaîne d&apos;approvisionnement</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{titre}</p>
                  <p className="text-base font-bold font-mono text-slate-900">{piece.numero}</p>
                  <p className="text-[11px] text-slate-500">{formaterDate(piece.emitted_at)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="border border-slate-200 rounded p-3 bg-slate-50/80">
                  <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Demandeur</p>
                  <p className="font-semibold text-slate-900">{piece.demandeur_nom || '—'}</p>
                  <p className="text-slate-600">{piece.partenaire_nom || '—'}</p>
                </div>
                <div className="border border-slate-200 rounded p-3 bg-slate-50/80">
                  <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Antenne</p>
                  <p className="font-semibold text-slate-900">{piece.antenne_nom || piece.antenne?.nom || '—'}</p>
                  <p className="text-slate-600">Commande {piece.numero_commande || '—'}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="border border-slate-200 rounded p-2.5 bg-white/80">
                  <p className="text-[10px] uppercase text-slate-500">Pris en charge</p>
                  <p className="text-lg font-bold text-slate-900">{piece.quantite_prise_totale ?? 0}</p>
                </div>
                <div className="border border-slate-200 rounded p-2.5 bg-white/80">
                  <p className="text-[10px] uppercase text-slate-500">Reliquat</p>
                  <p className="text-lg font-bold text-slate-900">{piece.quantite_reliquat_totale ?? 0}</p>
                </div>
                <div className="border border-slate-200 rounded p-2.5 bg-white/80">
                  <p className="text-[10px] uppercase text-slate-500">Montant</p>
                  <p className="text-sm font-bold text-slate-900">{formaterMontant(piece.montant_ttc_xaf)}</p>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded bg-white/80">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-[10px] uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-2.5 py-2 font-bold">Désignation</th>
                      <th className="px-2.5 py-2 font-bold">Demandé</th>
                      <th className="px-2.5 py-2 font-bold">Pris</th>
                      <th className="px-2.5 py-2 font-bold">Reliquat</th>
                      <th className="px-2.5 py-2 font-bold">P.U.</th>
                      <th className="px-2.5 py-2 font-bold text-right">Montant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lignes.map((ligne) => (
                      <tr key={ligne.id} className="border-t border-slate-100">
                        <td className="px-2.5 py-2 font-semibold text-slate-800">{ligne.designation}</td>
                        <td className="px-2.5 py-2">{ligne.quantite_demandee}</td>
                        <td className="px-2.5 py-2 font-semibold">{ligne.quantite_prise}</td>
                        <td className="px-2.5 py-2">{ligne.quantite_reliquat}</td>
                        <td className="px-2.5 py-2 whitespace-nowrap">{formaterMontant(ligne.prix_unitaire_xaf)}</td>
                        <td className="px-2.5 py-2 text-right font-semibold whitespace-nowrap">{formaterMontant(ligne.montant_ligne_xaf)}</td>
                      </tr>
                    ))}
                    {lignes.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-2.5 py-4 text-center text-slate-500">Aucune ligne</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-slate-200 bg-slate-50">
                      <td colSpan={5} className="px-2.5 py-2 text-right font-bold text-slate-700">Total TTC</td>
                      <td className="px-2.5 py-2 text-right font-bold text-slate-900">{formaterMontant(piece.montant_ttc_xaf)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {piece.note && (
                <p className="text-[11px] text-slate-600 border border-slate-200 rounded p-3 bg-slate-50/80">
                  <span className="font-bold text-slate-800">Note : </span>{piece.note}
                </p>
              )}

              <div className="flex items-end justify-between gap-4 pt-4 border-t border-slate-200 text-[11px] text-slate-500">
                <p>Émis par {piece.emitted_by_nom || 'Siège OPN'} · {formaterDate(piece.emitted_at)}</p>
                <div className="text-center">
                  <p className="mb-8">Visa / Signature</p>
                  <p className="border-t border-slate-300 pt-1 w-40">Siège OPN</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
