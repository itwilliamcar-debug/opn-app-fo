import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Download, FileText, Receipt, RefreshCw } from 'lucide-react';
import { apiRequest, downloadFluxDocumentPdf, triggerBlobDownload } from '../../services/api';
import FluxPiecePdfModal from './FluxPiecePdfModal';

const TAILLES_PAGE = [5, 10, 20, 50];
const LIBELLES_MOIS = [
  '', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

function formaterMontant(valeur) {
  return `${Number(valeur || 0).toLocaleString('fr-FR')} XAF`;
}

function formaterDate(valeur) {
  if (!valeur) return '—';
  try {
    return new Date(valeur).toLocaleDateString('fr-FR');
  } catch {
    return String(valeur);
  }
}

function BadgeType({ type }) {
  const estFac = type === 'FACTURE';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
      estFac ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-100 text-slate-700 border-slate-300'
    }`}>
      {estFac ? <Receipt className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
      {estFac ? 'Facture' : 'Bon de commande'}
    </span>
  );
}

function LignePiece({ piece, onOpen }) {
  const [dlLoading, setDlLoading] = useState(false);

  const handleDownload = async (e) => {
    e.stopPropagation();
    if (!piece.id || dlLoading) return;
    setDlLoading(true);
    try {
      const { blob, filename } = await downloadFluxDocumentPdf(piece.id);
      triggerBlobDownload(blob, filename || `${piece.numero || 'DOC'}.pdf`);
    } catch (err) {
      window.alert(err?.message || 'Téléchargement PDF impossible.');
    } finally {
      setDlLoading(false);
    }
  };

  return (
    <div className="w-full px-3 py-2.5 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors flex flex-wrap items-center gap-2 bg-white">
      <button
        type="button"
        onClick={async () => {
          try {
            if (piece.lignes?.length) {
              onOpen(piece);
              return;
            }
            const res = await apiRequest(`/flux/documents/${piece.id}`);
            onOpen(res.piece || piece);
          } catch {
            onOpen(piece);
          }
        }}
        className="flex flex-wrap items-center gap-2 flex-1 min-w-0 text-left"
      >
        <BadgeType type={piece.type} />
        <span className="font-mono text-xs font-bold text-slate-900">{piece.numero}</span>
        <span className="text-[11px] text-slate-500">cmd {piece.numero_commande}</span>
        <span className="text-[11px] text-slate-600">pris {piece.quantite_prise_totale} · reliquat {piece.quantite_reliquat_totale}</span>
        <span className="text-[11px] font-semibold text-slate-800 ml-auto">{formaterMontant(piece.montant_ttc_xaf)}</span>
        <span className="text-[10px] text-slate-400">{formaterDate(piece.emitted_at)}</span>
      </button>
      <button
        type="button"
        title="Télécharger le PDF"
        onClick={handleDownload}
        disabled={dlLoading}
        className="shrink-0 p-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-50"
      >
        <Download className={`w-3.5 h-3.5 ${dlLoading ? 'animate-pulse' : ''}`} />
      </button>
    </div>
  );
}

/** Même hiérarchie pour siège, chef et demandeur. */
function construireHierarchiePieces(liste) {
  const parAnnee = new Map();
  (liste || []).forEach((piece) => {
    const annee = Number(piece.annee) || (piece.emitted_at ? new Date(piece.emitted_at).getFullYear() : new Date().getFullYear());
    const mois = Number(piece.mois) || (piece.emitted_at ? new Date(piece.emitted_at).getMonth() + 1 : 1);
    if (!parAnnee.has(annee)) parAnnee.set(annee, new Map());
    const parMois = parAnnee.get(annee);
    if (!parMois.has(mois)) parMois.set(mois, new Map());
    const parAntenne = parMois.get(mois);
    const antenneId = String(piece.antenne_id || 0);
    if (!parAntenne.has(antenneId)) {
      parAntenne.set(antenneId, {
        antenne_id: piece.antenne_id,
        antenne_nom: piece.antenne_nom || piece.antenne?.nom || 'Antenne',
        demandeurs: new Map(),
      });
    }
    const antenne = parAntenne.get(antenneId);
    const cleDem = String(piece.demandeur_user_id || piece.demandeur_nom || 'n/a');
    if (!antenne.demandeurs.has(cleDem)) {
      antenne.demandeurs.set(cleDem, {
        demandeur_user_id: piece.demandeur_user_id,
        demandeur_nom: piece.demandeur_nom || 'Demandeur',
        partenaire_nom: piece.partenaire_nom || '',
        pieces: [],
      });
    }
    antenne.demandeurs.get(cleDem).pieces.push(piece);
  });

  return [...parAnnee.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([annee, parMois]) => {
      const mois = [...parMois.entries()]
        .sort((a, b) => b[0] - a[0])
        .map(([moisNum, parAntenne]) => {
          const antennes = [...parAntenne.values()].map((ant) => {
            const demandeurs = [...ant.demandeurs.values()].map((d) => ({
              ...d,
              nb_pieces: d.pieces.length,
            }));
            return {
              ...ant,
              nb_pieces: demandeurs.reduce((n, d) => n + d.nb_pieces, 0),
              demandeurs,
            };
          });
          return {
            mois: moisNum,
            libelle: LIBELLES_MOIS[moisNum] || String(moisNum),
            nb_pieces: antennes.reduce((n, a) => n + a.nb_pieces, 0),
            antennes,
          };
        });
      return {
        annee,
        nb_pieces: mois.reduce((n, m) => n + m.nb_pieces, 0),
        mois,
      };
    });
}

/**
 * @param {'TOUS'|'BON_COMMANDE'|'FACTURE'} typeForce
 * @param {boolean} embed
 */
export default function FluxDocumentsPanel({ stage, typeForce = 'TOUS', embed = false }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pieces, setPieces] = useState([]);
  const [compteurs, setCompteurs] = useState({ total: 0, bons_commande: 0, factures: 0 });
  const [pieceOuverte, setPieceOuverte] = useState(null);
  const [anneesRepliees, setAnneesRepliees] = useState(() => new Set());
  const [taillePage, setTaillePage] = useState(20);
  const [pageCourante, setPageCourante] = useState(1);

  const filtreType = typeForce;

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = filtreType !== 'TOUS' ? `?type=${filtreType}` : '';
      const data = await apiRequest(`/flux/documents${params}`);
      if (data?.backendUnavailable || data?.skipped) {
        setPieces([]);
        setCompteurs({ total: 0, bons_commande: 0, factures: 0 });
        return;
      }
      setPieces(data.pieces || []);
      setCompteurs(data.compteurs || { total: 0, bons_commande: 0, factures: 0 });
    } catch (err) {
      if (err?.skipped || err?.backendUnavailable) return;
      setPieces([]);
      setCompteurs({ total: 0, bons_commande: 0, factures: 0 });
      setError(err?.message || 'Impossible de charger les documents.');
    } finally {
      setLoading(false);
    }
  }, [filtreType]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPageCourante(1); }, [filtreType, taillePage]);

  const piecesFiltrees = useMemo(
    () => pieces.filter((p) => filtreType === 'TOUS' || p.type === filtreType),
    [pieces, filtreType],
  );

  const nombrePages = Math.max(1, Math.ceil(piecesFiltrees.length / taillePage));
  const pageAffichee = Math.min(pageCourante, nombrePages);
  const piecesPage = piecesFiltrees.slice((pageAffichee - 1) * taillePage, pageAffichee * taillePage);
  const hierarchiePage = useMemo(() => construireHierarchiePieces(piecesPage), [piecesPage]);

  function basculerAnnee(annee) {
    setAnneesRepliees((prev) => {
      const next = new Set(prev);
      if (next.has(annee)) next.delete(annee);
      else next.add(annee);
      return next;
    });
  }

  const contenu = (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className={`${embed ? 'px-3' : 'px-4'} py-2.5 border-b border-slate-100 flex flex-wrap items-center gap-3 text-[11px] text-slate-600`}>
        <span><strong className="text-slate-900">{compteurs.total}</strong> documents</span>
        {filtreType === 'TOUS' && (
          <>
            <span><strong className="text-slate-900">{compteurs.bons_commande}</strong> bons de commande</span>
            <span><strong className="text-slate-900">{compteurs.factures}</strong> factures</span>
          </>
        )}
        <button
          type="button"
          onClick={load}
          className="ml-auto px-2 py-1 text-[11px] font-semibold rounded border border-slate-200 text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Actualiser
        </button>
      </div>

      {error && (
        <p className="mx-4 my-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded px-3 py-2">{error}</p>
      )}

      <div className="flex-1 min-h-0 overflow-auto p-3 space-y-3">
        {loading && <p className="text-xs text-slate-500">Chargement…</p>}

        {!loading && piecesFiltrees.length === 0 && (
          <p className="text-xs text-slate-500 text-center py-8">Aucun document pour le moment.</p>
        )}

        {!loading && hierarchiePage.map((blocAnnee) => {
          const ouverte = !anneesRepliees.has(blocAnnee.annee);
          return (
            <div key={blocAnnee.annee} className="border border-slate-200 rounded-md overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => basculerAnnee(blocAnnee.annee)}
                className="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-[#0E2A4F] text-white text-left"
              >
                <span className="inline-flex items-center gap-2">
                  {ouverte ? <ChevronDown className="w-4 h-4 opacity-80" /> : <ChevronRight className="w-4 h-4 opacity-80" />}
                  <span className="text-sm font-black tracking-wide">{blocAnnee.annee}</span>
                </span>
                <span className="text-[11px] font-semibold">{blocAnnee.nb_pieces} document{blocAnnee.nb_pieces > 1 ? 's' : ''}</span>
              </button>
              {ouverte && (
                <div className="ml-4 border-l-2 border-slate-300 pl-3 py-3 space-y-4 bg-slate-50/30">
                  {(blocAnnee.mois || []).map((blocMois) => (
                    <div key={`${blocAnnee.annee}-${blocMois.mois}`} className="space-y-2">
                      <p className="text-xs font-bold text-slate-800">
                        {blocMois.libelle} {blocAnnee.annee}
                        <span className="ml-2 font-semibold text-slate-500">— {blocMois.nb_pieces} doc.</span>
                      </p>
                      <div className="ml-4 border-l-2 border-slate-200 pl-3 space-y-3">
                        {(blocMois.antennes || []).map((ant) => (
                          <div key={`${blocAnnee.annee}-${blocMois.mois}-${ant.antenne_id}`} className="space-y-2">
                            <p className="text-[11px] font-bold text-slate-900">
                              {ant.antenne_nom}
                              <span className="ml-2 font-normal text-slate-500">{ant.nb_pieces}</span>
                            </p>
                            <div className="ml-4 border-l-2 border-blue-200 pl-3 space-y-3">
                              {(ant.demandeurs || []).map((dem) => (
                                <div key={`${ant.antenne_id}-${dem.demandeur_user_id || dem.demandeur_nom}`} className="space-y-1.5">
                                  <p className="text-[11px] font-semibold text-slate-700">
                                    {dem.demandeur_nom}
                                    {dem.partenaire_nom ? ` · ${dem.partenaire_nom}` : ''}
                                  </p>
                                  <div className="space-y-1.5">
                                    {(dem.pieces || []).map((piece) => (
                                      <LignePiece key={piece.id} piece={piece} onOpen={setPieceOuverte} />
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!loading && piecesFiltrees.length > 0 && (
        <div className="shrink-0 px-4 py-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 bg-white">
          <label className="flex items-center gap-2">
            Afficher
            <select value={taillePage} onChange={(e) => setTaillePage(Number(e.target.value))} className="border border-slate-200 rounded px-2 py-1">
              {TAILLES_PAGE.map((taille) => <option key={taille} value={taille}>{taille}</option>)}
            </select>
            <span className="text-slate-400">sur {piecesFiltrees.length}</span>
          </label>
          <div className="flex items-center gap-2">
            <button type="button" disabled={pageAffichee <= 1} onClick={() => setPageCourante(pageAffichee - 1)} className="px-2 py-1 rounded border border-slate-200 disabled:opacity-40">Précédent</button>
            <span>Page {pageAffichee} / {nombrePages}</span>
            <button type="button" disabled={pageAffichee >= nombrePages} onClick={() => setPageCourante(pageAffichee + 1)} className="px-2 py-1 rounded border border-slate-200 disabled:opacity-40">Suivant</button>
          </div>
        </div>
      )}

      <FluxPiecePdfModal
        isOpen={!!pieceOuverte}
        piece={pieceOuverte}
        onClose={() => setPieceOuverte(null)}
      />
    </div>
  );

  if (embed) return contenu;

  return (
    <section className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden flex flex-col min-h-[320px]">
      <div className="px-4 py-3 border-b border-slate-100">
        <h2 className="text-sm font-bold text-slate-900">
          {filtreType === 'FACTURE' ? 'Factures' : filtreType === 'BON_COMMANDE' ? 'Bons de commande' : 'Documents'}
        </h2>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Classement année → mois → antenne → demandeur (seul l’année se plie). Stage : {stage}.
        </p>
      </div>
      {contenu}
    </section>
  );
}
