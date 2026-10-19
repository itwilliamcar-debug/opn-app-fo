import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Camera, 
  Compass, 
  CheckCircle2, 
  AlertCircle,
  Upload
} from 'lucide-react';
import { generateOpnDocNumber } from '../../utils/codificationHelper';
import { GABON_PROVINCIAL_ANTENNAS } from '../../data/provincialAntennaData';

export const STRUCTURE_TYPES = [
  'Clinique Privée',
  'Pharmacie d\'Officine',
  'Cabinet Médical Privé',
  'Centre Médical Privé',
  'Centre de Santé Public',
  'Hôpital Public Régional',
  'Dispensaire / Case de Santé',
  'ONG / Fondation Sanitaire',
  'Centre de Dialyse Privé',
  'Infirmerie d\'Entreprise'
];

export default function NewProspectModal({
  isOpen,
  onClose,
  onSaveProspect,
  currentAntennaCode = 'G1',
  antennes = GABON_PROVINCIAL_ANTENNAS,
  structureTypes = STRUCTURE_TYPES,
  structuresRef = [],
}) {
  if (!isOpen) return null;

  const listeAntennes = antennes?.length ? antennes : GABON_PROVINCIAL_ANTENNAS;
  const listeTypes = structureTypes?.length ? structureTypes : STRUCTURE_TYPES;

  const [formData, setFormData] = useState({
    nomStructure: '',
    typeStructure: listeTypes[0] || 'Clinique Privée',
    provinceCode: currentAntennaCode,
    localite: 'Libreville',
    regionSanitaire: 'Région Sanitaire Ouest',
    adresse: '',
    contactNom: '',
    telephone: '+241 ',
    email: '',
    commentaire: '',
    gpsLat: '0.3901',
    gpsLng: '9.4544',
    photoPreview: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop&auto=format&q=80',
    structureId: null,
  });

  const [isCapturingGps, setIsCapturingGps] = useState(false);
  const [gpsSuccess, setGpsSuccess] = useState(false);

  const handleCaptureGps = () => {
    setIsCapturingGps(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            gpsLat: position.coords.latitude.toFixed(4),
            gpsLng: position.coords.longitude.toFixed(4)
          }));
          setIsCapturingGps(false);
          setGpsSuccess(true);
          setTimeout(() => setGpsSuccess(false), 4000);
        },
        (error) => {
          console.warn('GPS error fallback:', error);
          setIsCapturingGps(false);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setIsCapturingGps(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoPreview: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nomStructure.trim()) return;

    const antenna = listeAntennes.find(a => (a.provinceCode || a.code) === formData.provinceCode) || listeAntennes[0];
    const newCode = generateOpnDocNumber('PROSPECT', {
      antenneCode: formData.provinceCode,
      sequence: Math.floor(Math.random() * 800) + 10
    });

    const newProspect = {
      id: newCode,
      code: newCode,
      antenneId: formData.provinceCode,
      antenneNom: antenna.nom || antenna.province,
      nomStructure: formData.nomStructure,
      typeStructure: formData.typeStructure,
      province: antenna.province || antenna.nom,
      provinceCode: formData.provinceCode,
      localite: formData.localite,
      regionSanitaire: formData.regionSanitaire,
      contactNom: formData.contactNom,
      telephone: formData.telephone,
      email: formData.email,
      adresse: formData.adresse,
      gps: { lat: parseFloat(formData.gpsLat) || 0, lng: parseFloat(formData.gpsLng) || 0 },
      photoUrl: formData.photoPreview,
      statut: 'IDENTIFIE',
      dateCreation: new Date().toISOString().split('T')[0],
      dateDerniereVisite: new Date().toISOString().split('T')[0],
      joursDepuisVisite: 0,
      isDormant: false,
      commercialAssignee: "Commercial Terrain OPN",
      commentaire: formData.commentaire,
      historiqueVisites: [
        {
          id: `VIS-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          commercial: "Commercial Terrain OPN",
          resultat: "INTERESSE",
          commentaire: "Fiche prospect créée sur le terrain. Première prise de contact.",
          prochaineAction: "Planifier une présentation formelle de la mercuriale SIMPEX."
        }
      ],
      devisAssocies: [],
      clientConvertiId: null,
      structureId: formData.structureId || null,
    };

    onSaveProspect(newProspect);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-white border-b border-slate-200 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">
              <Building2 className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Nouveau Prospect Terrain (M2)</h3>
              <p className="text-xs text-slate-500">Codification automatique PROS_&lt;Antenne&gt;_&lt;NNN&gt; &amp; Géolocalisation</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors border border-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Identité de la structure */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1">
              <Building2 className="w-3.5 h-3.5 text-[#003366]" /> Identité &amp; Typologie
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Raison Sociale / Nom Structure *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Polyclinique des Anges"
                  value={formData.nomStructure}
                  onChange={(e) => setFormData({ ...formData, nomStructure: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Type de Structure *
                </label>
                <select
                  value={formData.typeStructure}
                  onChange={(e) => setFormData({ ...formData, typeStructure: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366]"
                >
                  {listeTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {structuresRef?.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Préremplir depuis le référentiel structures
                </label>
                <select
                  defaultValue=""
                  onChange={(e) => {
                    const s = structuresRef.find((row) => String(row.id) === e.target.value);
                    if (!s) return;
                    setFormData((prev) => ({
                      ...prev,
                      nomStructure: s.nom || prev.nomStructure,
                      typeStructure: s.type || prev.typeStructure,
                      localite: s.ville || prev.localite,
                      structureId: s.id,
                    }));
                  }}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366]"
                >
                  <option value="">Choisir une structure du référentiel…</option>
                  {structuresRef.map((s) => (
                    <option key={s.id} value={s.id}>{s.nom}{s.ville ? ` — ${s.ville}` : ''}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Localisation & Antenne de rattachement */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1">
              <MapPin className="w-3.5 h-3.5 text-[#003366]" /> Localisation &amp; Antenne Régionale
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Antenne Régionale *
                </label>
                <select
                  value={formData.provinceCode}
                  onChange={(e) => {
                    const ant = listeAntennes.find(a => (a.provinceCode || a.code) === e.target.value);
                    setFormData({ 
                      ...formData, 
                      provinceCode: e.target.value,
                      localite: ant?.chefLieu || ant?.ville || ant?.chef_lieu || 'Libreville'
                    });
                  }}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366]"
                >
                  {listeAntennes.map(ant => (
                    <option key={ant.provinceCode || ant.code} value={ant.provinceCode || ant.code}>
                      {(ant.provinceCode || ant.code)} — {(ant.province || ant.nom)} ({ant.chefLieu || ant.ville || ant.chef_lieu || '—'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Localité / Ville
                </label>
                <input
                  type="text"
                  value={formData.localite}
                  onChange={(e) => setFormData({ ...formData, localite: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Adresse / Quartier
                </label>
                <input
                  type="text"
                  placeholder="ex: Quartier Batterie 4"
                  value={formData.adresse}
                  onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366]"
                />
              </div>
            </div>

            {/* GPS Capture */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#00A651]" />
                <span className="text-xs text-slate-600 font-medium">
                  Coordonnées GPS : <strong className="text-slate-900">{formData.gpsLat}, {formData.gpsLng}</strong>
                </span>
                {gpsSuccess && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md font-semibold border border-slate-200">
                    <CheckCircle2 className="w-3 h-3" /> Position capturée !
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleCaptureGps}
                disabled={isCapturingGps}
                className="text-xs font-bold text-[#003366] bg-white border border-[#003366]/30 hover:bg-[#003366] hover:text-white px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Compass className={`w-3.5 h-3.5 ${isCapturingGps ? 'animate-spin' : ''}`} />
                {isCapturingGps ? 'Localisation en cours...' : 'Capturer Position GPS'}
              </button>
            </div>
          </div>

          {/* Contact & Téléphone */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1">
              <Phone className="w-3.5 h-3.5 text-[#003366]" /> Interlocuteur &amp; Contact
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nom du Responsable / Contact *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Dr. Marie ONDO"
                  value={formData.contactNom}
                  onChange={(e) => setFormData({ ...formData, contactNom: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Téléphone (Mobile / WhatsApp) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="+241 077 ..."
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="contact@structure.ga"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366]"
                />
              </div>
            </div>
          </div>

          {/* Photo de la structure */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1">
              <Camera className="w-3.5 h-3.5 text-[#003366]" /> Photographie de la Façade (EF-M2-07)
            </h4>

            <div className="flex items-center gap-4">
              <img 
                src={formData.photoPreview} 
                alt="Structure Preview" 
                className="w-24 h-18 object-cover rounded-xl border-2 border-slate-200 shadow-sm"
              />
              <div className="flex-1">
                <label className="cursor-pointer inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-lg border border-slate-300 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-slate-600" />
                  Prendre ou Sélectionner une Photo
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handlePhotoUpload}
                  />
                </label>
                <p className="text-[11px] text-slate-500 mt-1">Stockage sécurisé OPN Drive Cloud (accès restreint).</p>
              </div>
            </div>
          </div>

          {/* Commentaire de prospection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Besoins Spécifiques &amp; Observations
            </label>
            <textarea
              rows={2}
              placeholder="Spécificités médicales, volumes de commandes prévisionnels, conditions de paiement souhaitées..."
              value={formData.commentaire}
              onChange={(e) => setFormData({ ...formData, commentaire: e.target.value })}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366]"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Enregistrer le Prospect
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
