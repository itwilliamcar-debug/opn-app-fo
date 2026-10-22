import html2pdf from 'html2pdf.js';
import { assurerFiligrane, creerNoeudFiligrane } from '../components/common/FiligraneOpn';

/**
 * Utilitaire centralisé d'exportation et d'impression des documents OPN Gabon
 */

/**
 * Télécharge directement un élément DOM sous format PDF réel
 * @param {HTMLElement|string} elementOrId - Référence React (ref.current) ou ID DOM
 * @param {string} filename - Nom du fichier de sortie (ex: 'Bordereau-Transfert-G1-G6.pdf')
 */
export async function downloadElementAsPdf(elementOrId, filename = 'document-officiel-opn.pdf', customOptions = {}) {
  try {
    const element = typeof elementOrId === 'string' 
      ? document.getElementById(elementOrId) 
      : (elementOrId?.current || elementOrId);

    if (!element) {
      console.warn('Élément introuvable pour la génération PDF, repli sur l\'impression...');
      previewPrintDocument();
      return;
    }

    const cleanFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;

    const opt = {
      margin: customOptions.margin ?? [6, 6, 6, 6],
      filename: cleanFilename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: customOptions.scale ?? 2, 
        useCORS: true, 
        logging: false,
        letterRendering: true,
        ...(customOptions.html2canvas || {})
      },
      jsPDF: { 
        unit: 'mm', 
        format: customOptions.format ?? 'a4', 
        orientation: customOptions.orientation ?? 'portrait',
        ...(customOptions.jsPDF || {})
      }
    };

    const retirerFiligrane = assurerFiligrane(element);

    // Génération et téléchargement direct du PDF
    try {
      await html2pdf().set(opt).from(element).save();
    } finally {
      retirerFiligrane();
    }
  } catch (error) {
    console.error('Erreur lors du téléchargement direct du PDF :', error);
    previewPrintDocument();
  }
}

/**
 * Déclenche l'aperçu avant impression du navigateur, avec le filigrane OPN.
 */
export function previewPrintDocument() {
  const dejaPresent = Boolean(document.querySelector('[data-filigrane-opn]'));
  let couche = null;
  let style = null;
  if (!dejaPresent) {
    couche = creerNoeudFiligrane();
    couche.id = 'opn-filigrane-impression';
    couche.style.position = 'fixed';
    couche.style.zIndex = '9999';
    style = document.createElement('style');
    style.textContent = '@media screen { #opn-filigrane-impression { display: none !important; } }';
    document.head.appendChild(style);
    document.body.appendChild(couche);
  }
  const retirer = () => {
    couche?.remove();
    style?.remove();
    window.removeEventListener('afterprint', retirer);
  };
  window.addEventListener('afterprint', retirer);
  window.print();
}
