// Utilitaires d'exportation officielle du Catalogue Produits OPN Gabon (CSV & PDF)
import { formatXAF } from './formatters';

/**
 * Exporte la liste filtrée des produits au format CSV avec en-tête officiel OPN
 */
export function exportProductsToCSV(products, selectedFamily = 'TOUTES LES FAMILLES') {
  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const timeStr = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // En-tête officiel de l'Office Pharmaceutique National
  const headerLines = [
    `"RÉPUBLIQUE GABONAISE - MINISTÈRE DE LA SANTÉ"`,
    `"OFFICE PHARMACEUTIQUE NATIONAL (OPN) - CENTRALE NATIONALE D'ACHAT DU MÉDICAMENT"`,
    `"Société d'État au Capital de 3 500 000 000 FCFA - Siège social : Zone Industrielle d'Oloumi B.P. 295 Libreville / Gabon"`,
    `"Téléphone : +241 74 35 79 29 / 01 76 55 07 - Email : Commercial@opn-gabon.com - N° Statistique : 202101009992 L - RCCM : N°RG LBV 2021823001"`,
    `"CATALOGUE OFFICIEL DES PRODUITS DISPONIBLES (DCI)"`,
    `"Famille de produit filtrée : ${selectedFamily}"`,
    `"Date d'exportation : ${dateStr} à ${timeStr} - Total références : ${products.length}"`,
    `""`,
    `"Code Produit";"Désignation Officielle (DCI)";"Molécule (DCI)";"Famille Thérapeutique";"Forme Galénique";"Dosage";"Conditionnement";"Laboratoire Titulaire";"Statut Disponibilité";"Prix Homologué OPN (FCFA)";"Tarif Public Plafonné (FCFA)"`
  ];

  const dataRows = products.map(p => {
    const code = `"${(p.code || '').replace(/"/g, '""')}"`;
    const designation = `"${(p.designation || '').replace(/"/g, '""')}"`;
    const dci = `"${(p.dci || '').replace(/"/g, '""')}"`;
    const famille = `"${(p.famille || p.categorie || '').replace(/"/g, '""')}"`;
    const forme = `"${(p.forme || '').replace(/"/g, '""')}"`;
    const dosage = `"${(p.dosage || '').replace(/"/g, '""')}"`;
    const conditionnement = `"${(p.conditionnement || '').replace(/"/g, '""')}"`;
    const lab = `"${(p.laboratoire || '').replace(/"/g, '""')}"`;
    const statut = `"${(p.statut || 'DISPONIBLE').replace(/"/g, '""')}"`;
    const prix = `"${p.prixUnitaireXAF || 0}"`;
    const prixPublic = `"${p.prixPublicPlafonneXAF || 0}"`;

    return `${code};${designation};${dci};${famille};${forme};${dosage};${conditionnement};${lab};${statut};${prix};${prixPublic}`;
  });

  const csvContent = '\uFEFF' + headerLines.join('\r\n') + '\r\n' + dataRows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const cleanFamily = selectedFamily.replace(/[^a-zA-Z0-9]/g, '_');
  link.setAttribute('download', `OPN_Gabon_Catalogue_Produits_DCI_${cleanFamily}_${now.toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Génère et ouvre la version imprimable officielle PDF avec logo et en-tête complet de l'OPN
 */
export function openOfficialPrintableCatalog(products, selectedFamily = 'TOUTES LES FAMILLES', searchKeyword = '') {
  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  const timeStr = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const printWindow = window.open('', '_blank', 'width=1150,height=850');
  if (!printWindow) {
    const blob = new Blob(
      [
        `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"/><title>Catalogue OPN</title></head><body>`,
        `<h1>Catalogue officiel OPN</h1><p>Famille : ${selectedFamily}</p>`,
        `<p>${products.length} références — ${dateStr} ${timeStr}</p>`,
        `<table border="1" cellpadding="4"><thead><tr><th>Code</th><th>Désignation</th><th>DCI</th><th>Prix</th></tr></thead><tbody>`,
        ...products.map(
          (p) =>
            `<tr><td>${p.code || ''}</td><td>${p.designation || ''}</td><td>${p.dci || ''}</td><td>${
              p.gratuit || p.prixUnitaireXAF === 0 ? 'GRATUIT' : formatXAF(p.prixUnitaireXAF || 0)
            }</td></tr>`
        ),
        `</tbody></table></body></html>`,
      ].join(''),
      { type: 'text/html;charset=utf-8' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `catalogue-opn-${dateStr.replace(/\//g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    return;
  }

  const tableRowsHtml = products.map((p, idx) => `
    <tr class="${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}">
      <td class="font-mono text-center font-bold text-slate-800">${p.code || '-'}</td>
      <td class="font-semibold text-slate-900">${p.designation || '-'}</td>
      <td class="text-slate-700">${p.dci || '-'}</td>
      <td class="text-slate-700 font-medium">${p.famille || p.categorie || '-'}</td>
      <td class="text-slate-600">${p.forme || ''} ${p.dosage ? '– ' + p.dosage : ''}</td>
      <td class="text-slate-600">${p.conditionnement || '-'}</td>
      <td class="text-center">
        <span class="badge ${p.statut === 'STOCK_CRITIQUE' ? 'badge-critique' : p.statut === 'STOCK_FAIBLE' ? 'badge-faible' : 'badge-disponible'}">
          ${p.statut === 'STOCK_CRITIQUE' ? 'Stock Critique' : p.statut === 'STOCK_FAIBLE' ? 'Stock Faible' : 'Disponible'}
        </span>
      </td>
      <td class="text-right font-bold text-blue-800">
        ${p.gratuit || p.prixUnitaireXAF === 0 ? '<span style="color: #00A651; font-weight: bold;">GRATUIT (PNLT)</span>' : formatXAF(p.prixUnitaireXAF || 0)}
      </td>
    </tr>
  `).join('');

  const htmlDoc = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>OPN Gabon - Catalogue Officiel des Produits (DCI)</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 10mm 12mm 14mm 12mm;
    }
    body {
      font-family: Arial, Helvetica, sans-serif;
      margin: 0;
      padding: 12px;
      color: #1e293b;
      font-size: 11px;
      background: #ffffff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .flag-bar {
      display: flex;
      height: 4px;
      width: 100%;
      margin-bottom: 8px;
    }
    .flag-green { background-color: #009E60; width: 33.33%; }
    .flag-yellow { background-color: #FCD116; width: 33.33%; }
    .flag-blue { background-color: #3A75C4; width: 33.33%; }

    .header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10px;
    }
    .header-table td {
      vertical-align: top;
      padding: 0;
    }
    .logo-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .opn-logo-box {
      width: 44px;
      height: 44px;
      background: #00A651;
      border-radius: 8px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .opn-logo-yellow {
      position: absolute;
      width: 24px;
      height: 24px;
      background: #FFDE16;
      border-radius: 4px;
      right: -4px;
      bottom: -4px;
    }
    .opn-cross-v {
      position: absolute;
      width: 6px;
      height: 22px;
      background: #ffffff;
      border-radius: 2px;
      z-index: 2;
    }
    .opn-cross-h {
      position: absolute;
      width: 22px;
      height: 6px;
      background: #ffffff;
      border-radius: 2px;
      z-index: 2;
    }
    .opn-name {
      font-size: 13px;
      font-weight: 900;
      line-height: 1.1;
      color: #1e3a8a;
      text-transform: uppercase;
    }
    .republique-title {
      font-size: 11px;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .sante-subtitle {
      font-size: 10px;
      font-weight: 700;
      color: #00A651;
    }
    .contact-info {
      font-size: 9px;
      color: #475569;
      line-height: 1.35;
    }

    .main-banner {
      background: linear-gradient(90deg, #1e40af 0%, #2563eb 100%);
      color: #ffffff;
      text-align: center;
      padding: 8px 12px;
      border-radius: 4px;
      margin: 10px 0 12px 0;
    }
    .main-banner h1 {
      margin: 0;
      font-size: 16px;
      font-weight: 900;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .main-banner p {
      margin: 2px 0 0 0;
      font-size: 10px;
      opacity: 0.95;
    }

    .meta-bar {
      display: flex;
      justify-content: space-between;
      background: #f1f5f9;
      padding: 6px 10px;
      border-radius: 4px;
      margin-bottom: 10px;
      font-size: 10px;
      font-weight: 600;
      color: #334155;
      border-left: 3px solid #00A651;
    }

    table.data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9.5px;
      margin-bottom: 15px;
    }
    table.data-table th {
      background: #1e3a8a;
      color: #ffffff;
      padding: 6px 5px;
      font-weight: bold;
      text-transform: uppercase;
      font-size: 8.5px;
      letter-spacing: 0.3px;
      border: 1px solid #1e3a8a;
      text-align: left;
    }
    table.data-table td {
      padding: 4px 5px;
      border: 1px solid #cbd5e1;
      vertical-align: middle;
    }
    .bg-slate-50 { background-color: #f8fafc; }
    .bg-white { background-color: #ffffff; }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .font-mono { font-family: monospace; font-size: 9px; }

    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 9999px;
      font-size: 8px;
      font-weight: bold;
    }
    .badge-disponible { background: #dcfce7; color: #15803d; border: 1px solid #86efac; }
    .badge-faible { background: #fef9c3; color: #854d0e; border: 1px solid #fde047; }
    .badge-critique { background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5; }

    .footer-box {
      margin-top: 15px;
      border-top: 1px solid #94a3b8;
      padding-top: 8px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 8.5px;
      color: #475569;
    }
    .legal-footer {
      max-width: 68%;
      line-height: 1.35;
    }
    .seal-box {
      text-align: center;
      border: 1px dashed #2563eb;
      padding: 6px 12px;
      border-radius: 6px;
      background: #eff6ff;
      color: #1e40af;
      font-size: 8px;
      font-weight: bold;
    }
    .no-print-bar {
      background: #0f172a;
      color: #ffffff;
      padding: 10px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 6px;
      margin-bottom: 15px;
    }
    .btn-print {
      background: #00A651;
      color: white;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: bold;
      border: none;
      cursor: pointer;
      font-size: 12px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background 0.2s;
    }
    .btn-print:hover {
      background: #008f45;
    }
    .btn-pdf {
      background: #2E68B4;
      color: white;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: bold;
      border: none;
      cursor: pointer;
      font-size: 12px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background 0.2s;
    }
    .btn-pdf:hover {
      background: #215091;
    }
    @media print {
      .no-print-bar { display: none !important; }
      body { padding: 0 !important; }
      tr { page-break-inside: avoid; }
      thead { display: table-header-group; }
    }
  </style>
</head>
<body>

  <div class="no-print-bar">
    <div>
      <strong>OFFICE PHARMACEUTIQUE NATIONAL (OPN)</strong> — Document Officiel d'Exportation & Impression
      <div style="font-size: 11px; opacity: 0.8;">Pour enregistrer en fichier PDF, sélectionnez « Enregistrer au format PDF » dans la fenêtre d'impression.</div>
    </div>
    <div style="display: flex; gap: 8px; align-items: center;">
      <button class="btn-print" onclick="window.print()" title="Lancer l'impression directe">
        <svg style="width:14px;height:14px;vertical-align:-2px;margin-right:4px;display:inline-block;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><path d="M6 14h12v8H6z"></path></svg> Imprimer
      </button>
      <button class="btn-pdf" onclick="window.print()" title="Enregistrer la liste au format PDF">
        <svg style="width:14px;height:14px;vertical-align:-2px;margin-right:4px;display:inline-block;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Enregistrer PDF
      </button>
    </div>
  </div>

  <div class="flag-bar">
    <div class="flag-green"></div>
    <div class="flag-yellow"></div>
    <div class="flag-blue"></div>
  </div>

  <table class="header-table">
    <tr>
      <td style="width: 50%;">
        <div class="republique-title">RÉPUBLIQUE GABONAISE</div>
        <div class="sante-subtitle">MINISTÈRE DE LA SANTÉ</div>
        <div class="contact-info" style="margin-top: 4px;">
          <strong>Zone Industrielle d'Oloumi</strong> — B.P. : 295 Libreville / Gabon<br>
          Tél : (241) 074 35 79 29 / 01 76 55 07<br>
          E-mail : Commercial@opn-gabon.com — N° Statistique : 202101009992 L
        </div>
      </td>
      <td style="width: 50%; text-align: right;">
        <div class="logo-container" style="justify-content: flex-end;">
          <div class="opn-logo-box">
            <div class="opn-cross-v"></div>
            <div class="opn-cross-h"></div>
            <div class="opn-logo-yellow"></div>
          </div>
          <div style="text-align: left;">
            <div class="opn-name">Office<br>Pharmaceutique<br>National</div>
          </div>
        </div>
      </td>
    </tr>
  </table>

  <div class="main-banner">
    <h1>PRODUITS DISPONIBILITES — CATALOGUE OFFICIEL (DCI)</h1>
    <p>Tarifs encadrés et homologués par l'Office Pharmaceutique National • Centrale Nationale d'Achat du Médicament</p>
  </div>

  <div class="meta-bar">
    <div><strong>Famille sélectionnée :</strong> ${selectedFamily} ${searchKeyword ? `• Recherche : "${searchKeyword}"` : ''}</div>
    <div><strong>Total Références :</strong> ${products.length} molécules & dispositifs</div>
    <div><strong>Édité le :</strong> ${dateStr} à ${timeStr}</div>
  </div>

  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 75px; text-align: center;">Code</th>
        <th>Désignation Officielle (DCI)</th>
        <th>Molécule / Substance</th>
        <th>Famille Thérapeutique</th>
        <th>Forme & Dosage</th>
        <th>Conditionnement</th>
        <th style="width: 75px; text-align: center;">Disponibilité</th>
        <th style="width: 85px; text-align: right;">Prix OPN (FCFA)</th>
      </tr>
    </thead>
    <tbody>
      ${tableRowsHtml}
    </tbody>
  </table>

  <div class="footer-box">
    <div class="legal-footer">
      <strong>Office Pharmaceutique National (OPN)</strong> — Société d'État avec Conseil d'Administration et Direction Générale au Capital de 3 500 000 000 FCFA.<br>
      Siège social : Zone Industrielle d'Oloumi B.P. 295 - Libreville/Gabon • Téléphone : +241 74 35 79 29 • N° d'immatriculation 202101009992 L - RCCM N°RG LBV 2021823001.<br>
      Document certifié conforme aux autorisations de mise sur le marché (AMM) et aux listes nationales des médicaments essentiels (LNME).
    </div>
    <div class="seal-box">
      Direction des Approvisionnements<br>& de la Régulation Pharmaceutique<br>
      <span style="font-size: 7px; color: #009E60;">✓ VISA & CERTIFICATION OFFICIELLE</span>
    </div>
  </div>

</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlDoc);
  printWindow.document.close();
}
