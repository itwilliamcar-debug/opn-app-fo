import html2pdf from 'html2pdf.js';

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
      window.print();
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

    // Génération et téléchargement direct du PDF
    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error('Erreur lors du téléchargement direct du PDF :', error);
    // Repli de secours
    window.print();
  }
}

/**
 * Déclenche l'aperçu avant impression du navigateur
 */
export function previewPrintDocument() {
  window.print();
}
