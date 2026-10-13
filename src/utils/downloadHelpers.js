/**
 * Téléchargements locaux (PDF texte / CSV / HTML) — sans dépendance serveur.
 */

export function downloadTextFile(filename, content, mime = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function downloadCsv(filename, rows) {
  const escape = (v) => {
    const s = v == null ? '' : String(v);
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const csv = rows.map((row) => row.map(escape).join(';')).join('\r\n');
  downloadTextFile(filename, `\uFEFF${csv}`, 'text/csv;charset=utf-8');
}

export function buildOfficialDocumentHtml({ title, subtitle, bodyLines = [], footer }) {
  const lines = bodyLines
    .map((l) => `<p style="margin:0 0 8px;font-size:12px;line-height:1.45">${l}</p>`)
    .join('');
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8"/>
<title>${title}</title>
<style>
  body{font-family:Georgia,'Times New Roman',serif;color:#0f172a;margin:32px;max-width:720px}
  h1{font-size:18px;margin:0 0 4px}
  .sub{font-size:12px;color:#475569;margin-bottom:20px}
  .meta{font-size:11px;color:#64748b;border-top:1px solid #cbd5e1;margin-top:28px;padding-top:10px}
  .brand{font-size:11px;font-weight:700;color:#2E68B4;letter-spacing:.04em;text-transform:uppercase;margin-bottom:16px}
</style>
</head>
<body>
  <div class="brand">Office Pharmaceutique National — République Gabonaise</div>
  <h1>${title}</h1>
  ${subtitle ? `<div class="sub">${subtitle}</div>` : ''}
  ${lines}
  <div class="meta">${footer || `Document généré le ${new Date().toLocaleString('fr-FR')} — OPN Hub Owendo`}</div>
</body>
</html>`;
}

export function downloadOfficialHtml(filename, opts) {
  downloadTextFile(filename.endsWith('.html') ? filename : `${filename}.html`, buildOfficialDocumentHtml(opts), 'text/html;charset=utf-8');
}

export function openPrintableHtml(opts) {
  const html = buildOfficialDocumentHtml(opts);
  const w = window.open('', '_blank', 'noopener,noreferrer,width=900,height=700');
  if (!w) {
    downloadOfficialHtml('document-opn.html', opts);
    return;
  }
  w.document.open();
  w.document.write(html);
  w.document.close();
}
