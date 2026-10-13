import React, { useState } from 'react';

export default function OpnLogo({ className = "h-12", variant = "full", textClassName = "", theme = "default" }) {
  const isWhite = theme === "white";
  const [imgError, setImgError] = useState(false);

  if (variant === "symbol") {
    return (
      <svg 
        viewBox="0 0 88 88" 
        className={className} 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Carré Vert Haut-Gauche */}
        <rect x="4" y="4" width="52" height="52" rx="14" fill="#00A651" />
        {/* Carré Jaune Bas-Droit */}
        <rect x="24" y="24" width="52" height="52" rx="14" fill="#FFDE16" />
        {/* Croix Blanche de Pharmacie */}
        <rect x="23" y="13" width="14" height="34" rx="5" fill="#FFFFFF" />
        <rect x="13" y="23" width="34" height="14" rx="5" fill="#FFFFFF" />
      </svg>
    );
  }

  // Pour le thème 'white' (sur fond bleu/sombre), rendu vectoriel transparent avec texte blanc
  if (isWhite) {
    return (
      <div className={`flex items-center gap-3 select-none ${className}`}>
        {/* Symbole Officiel OPN */}
        <svg 
          viewBox="0 0 88 88" 
          className="h-full w-auto shrink-0 drop-shadow-sm" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="4" y="4" width="52" height="52" rx="14" fill="#00A651" />
          <rect x="24" y="24" width="52" height="52" rx="14" fill="#FFDE16" />
          <rect x="23" y="13" width="14" height="34" rx="5" fill="#FFFFFF" />
          <rect x="13" y="23" width="34" height="14" rx="5" fill="#FFFFFF" />
        </svg>

        {/* Typographie Officielle Blanche */}
        <div className={`flex flex-col justify-center leading-none text-white ${textClassName}`}>
          <span className="font-extrabold text-[15px] tracking-tight font-sans">
            Office
          </span>
          <span className="font-extrabold text-[15px] tracking-tight font-sans mt-[2px]">
            Pharmaceutique
          </span>
          <span className="font-extrabold text-[15px] tracking-tight font-sans mt-[2px]">
            National
          </span>
        </div>
      </div>
    );
  }

  // Si l'image PNG officielle est disponible pour le thème clair/standard
  if (!imgError) {
    return (
      <div className={`flex items-center select-none ${className}`}>
        <img 
          src="/logo-opn.png" 
          alt="Office Pharmaceutique National (OPN)" 
          className="h-full w-auto object-contain max-h-full"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // Fallback SVG vectoriel pixel-perfect
  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      {/* Symbole Officiel OPN */}
      <svg 
        viewBox="0 0 88 88" 
        className="h-full w-auto shrink-0 drop-shadow-sm" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="4" y="4" width="52" height="52" rx="14" fill="#00A651" />
        <rect x="24" y="24" width="52" height="52" rx="14" fill="#FFDE16" />
        <rect x="23" y="13" width="14" height="34" rx="5" fill="#FFFFFF" />
        <rect x="13" y="23" width="34" height="14" rx="5" fill="#FFFFFF" />
      </svg>

      {/* Typographie Officielle OPN */}
      <div className={`flex flex-col justify-center leading-tight ${textClassName}`}>
        <span className={`${isWhite ? 'text-white' : 'text-[#0B58A8]'} font-extrabold text-[18px] tracking-tight font-sans`}>
          Office
        </span>
        <span className={`${isWhite ? 'text-white' : 'text-[#0B58A8]'} font-extrabold text-[18px] tracking-tight font-sans -mt-0.5`}>
          Pharmaceutique
        </span>
        <span className={`${isWhite ? 'text-white' : 'text-[#0B58A8]'} font-extrabold text-[18px] tracking-tight font-sans -mt-0.5`}>
          National
        </span>
      </div>
    </div>
  );
}
