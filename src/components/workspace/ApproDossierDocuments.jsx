import React, { useCallback, useEffect, useState } from 'react';
import { Download, FileUp, Loader2, Archive } from 'lucide-react';
import {
  archiveApproDocument,
  downloadApproDocument,
  fetchApproDocuments,
  replaceApproDocumentVersion,
  uploadApproDocument,
} from '../../services/api';

const CATEGORIES = [
  'DEMANDE', 'DEVIS', 'PROFORMA', 'FICHE_TECHNIQUE', 'CERTIFICAT',
  'CORRESPONDANCE', 'JUSTIFICATIF', 'RAPPORT', 'QUALITE', 'DOUANE', 'AUTRE',
];

/**
 * GED dossier — upload / versions / téléchargement authentifié (pas de lien public).
 */
export default function ApproDossierDocuments({ demandeId, canManage = false, onFlash }) {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);
  const [titre, setTitre] = useState('');
  const [categorie, setCategorie] = useState('JUSTIFICATIF');
  const [file, setFile] = useState(null);
  const [replaceId, setReplaceId] = useState(null);
  const [replaceMotif, setReplaceMotif] = useState('');
  const [replaceFile, setReplaceFile] = useState(null);

  const load = useCallback(async () => {
    if (!demandeId) return;
    setLoading(true);
    try {
      const res = await fetchApproDocuments({ demande_id: demandeId });
      setDocs(res.documents || []);
    } catch (err) {
      if (!err?.backendUnavailable) onFlash?.(err.message || 'Erreur chargement documents');
    } finally {
      setLoading(false);
    }
  }, [demandeId, onFlash]);

  useEffect(() => {
    load();
  }, [load]);

  const run = async (key, fn) => {
    setBusy(key);
    try {
      await fn();
      onFlash?.('Document enregistré');
      await load();
    } catch (err) {
      if (!err?.backendUnavailable) onFlash?.(err.message || 'Échec document');
    } finally {
      setBusy(null);
    }
  };

  const onDownload = async (doc) => {
    try {
      const { blob, filename } = await downloadApproDocument(doc.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      if (!err?.backendUnavailable) onFlash?.(err.message || 'Téléchargement refusé');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-4 text-xs text-slate-500">
        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Documents…
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
        Pièces jointes (GED)
      </h4>

      {canManage && (
        <div className="rounded border border-slate-200 bg-slate-50 p-2.5 space-y-2">
          <input
            className="w-full rounded border border-slate-200 px-2 py-1 text-sm"
            placeholder="Titre du document"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            <select
              className="rounded border border-slate-200 px-2 py-1 text-xs"
              value={categorie}
              onChange={(e) => setCategorie(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              type="file"
              className="text-xs"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          <button
            type="button"
            disabled={busy === 'up'}
            onClick={() =>
              run('up', async () => {
                if (!file || !titre.trim()) throw new Error('Titre et fichier obligatoires.');
                await uploadApproDocument({
                  file,
                  titre: titre.trim(),
                  categorie,
                  demande_id: demandeId,
                });
                setTitre('');
                setFile(null);
              })
            }
            className="inline-flex items-center gap-1 rounded bg-[#2E68B4] px-2.5 py-1 text-[11px] font-semibold text-white disabled:opacity-60"
          >
            {busy === 'up' ? <Loader2 className="h-3 w-3 animate-spin" /> : <FileUp className="h-3 w-3" />}
            Déposer v1
          </button>
        </div>
      )}

      {docs.length === 0 ? (
        <p className="text-xs text-slate-500">Aucune pièce rattachée à ce dossier.</p>
      ) : (
        <ul className="space-y-2">
          {docs.map((d) => (
            <li key={d.id} className="rounded border border-slate-100 bg-white p-2 text-xs">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900">{d.titre}</p>
                  <p className="text-slate-500">
                    {d.code_document} · {d.categorie} · v{d.version_courante} · {d.statut}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() => onDownload(d)}
                    className="inline-flex items-center gap-0.5 rounded border border-slate-200 px-1.5 py-0.5 font-medium"
                  >
                    <Download className="h-3 w-3" /> Télécharger
                  </button>
                  {canManage && d.statut === 'ACTIF' && (
                    <>
                      <button
                        type="button"
                        onClick={() => setReplaceId(replaceId === d.id ? null : d.id)}
                        className="rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 font-medium text-amber-900"
                      >
                        Nouvelle version
                      </button>
                      <button
                        type="button"
                        disabled={busy === `arch-${d.id}`}
                        onClick={() =>
                          run(`arch-${d.id}`, () =>
                            archiveApproDocument(d.id, 'Archivage contrôlé depuis le dossier Appro')
                          )
                        }
                        className="inline-flex items-center gap-0.5 rounded border border-slate-200 px-1.5 py-0.5"
                      >
                        <Archive className="h-3 w-3" /> Archiver
                      </button>
                    </>
                  )}
                </div>
              </div>
              {replaceId === d.id && (
                <div className="mt-2 space-y-1.5 border-t border-slate-100 pt-2">
                  <textarea
                    rows={2}
                    className="w-full rounded border border-slate-200 px-2 py-1"
                    placeholder="Motif de la nouvelle version (obligatoire)"
                    value={replaceMotif}
                    onChange={(e) => setReplaceMotif(e.target.value)}
                  />
                  <input type="file" className="text-xs" onChange={(e) => setReplaceFile(e.target.files?.[0] || null)} />
                  <button
                    type="button"
                    disabled={busy === `rep-${d.id}`}
                    onClick={() =>
                      run(`rep-${d.id}`, async () => {
                        if (!replaceFile || replaceMotif.trim().length < 5) {
                          throw new Error('Fichier et motif (≥5 car.) obligatoires.');
                        }
                        await replaceApproDocumentVersion(d.id, replaceFile, replaceMotif.trim());
                        setReplaceId(null);
                        setReplaceMotif('');
                        setReplaceFile(null);
                      })
                    }
                    className="rounded bg-amber-700 px-2 py-1 text-[11px] font-semibold text-white"
                  >
                    Enregistrer version
                  </button>
                </div>
              )}
              {(d.versions || []).length > 1 && (
                <p className="mt-1 text-[10px] text-slate-400">
                  Historique : {(d.versions || []).map((v) => `v${v.numero_version}`).join(' · ')}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
