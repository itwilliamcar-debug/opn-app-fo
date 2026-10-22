import React from 'react';

const MOTS = Array.from({ length: 18 }, (_, index) => index);

const STYLE_MOT = 'font-size:34px;font-weight:800;letter-spacing:0.28em;color:rgba(14,42,79,0.16);line-height:1;';

/** Calque « OPN » répété en diagonale, assez clair pour laisser lire le document. */
export function creerNoeudFiligrane() {
  const couche = document.createElement('div');
  couche.setAttribute('data-filigrane-opn', '');
  couche.setAttribute('aria-hidden', 'true');
  couche.style.cssText = 'position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:5;';
  const grille = document.createElement('div');
  grille.style.cssText = 'position:absolute;left:-14%;top:-18%;width:128%;height:136%;display:grid;grid-template-columns:repeat(3,1fr);row-gap:56px;align-items:center;justify-items:center;transform:rotate(-32deg);';
  MOTS.forEach(() => {
    const mot = document.createElement('span');
    mot.textContent = 'OPN';
    mot.style.cssText = STYLE_MOT;
    grille.appendChild(mot);
  });
  couche.appendChild(grille);
  return couche;
}

/** Pose le filigrane dans un document s’il n’y est pas déjà. Retourne une fonction de retrait. */
export function assurerFiligrane(element) {
  if (!element || element.querySelector('[data-filigrane-opn]')) return () => {};
  const positionCalculee = window.getComputedStyle(element).position;
  const positionPrecedente = element.style.position;
  if (positionCalculee === 'static') element.style.position = 'relative';
  const noeud = creerNoeudFiligrane();
  element.insertBefore(noeud, element.firstChild);
  return () => {
    noeud.remove();
    element.style.position = positionPrecedente;
  };
}

export default function FiligraneOpn() {
  return (
    <div data-filigrane-opn="" aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden select-none" style={{ zIndex: 5 }}>
      <div
        className="absolute grid grid-cols-3 place-items-center"
        style={{
          left: '-14%',
          top: '-18%',
          width: '128%',
          height: '136%',
          rowGap: '56px',
          transform: 'rotate(-32deg)',
        }}
      >
        {MOTS.map((index) => (
          <span key={index} className="text-[34px] font-extrabold tracking-[0.28em] leading-none text-[#0E2A4F]/[0.16]">
            OPN
          </span>
        ))}
      </div>
    </div>
  );
}
