import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  QrCode, 
  ThermometerSnowflake, 
  Truck, 
  Package, 
  AlertTriangle, 
  FileCheck,
  Calendar,
  UserCheck
} from 'lucide-react';

export default function PvReceptionConvoiModal({
  isOpen,
  onClose,
  convoi,
  onConfirmReception,
  antenna,
}) {
  if (!isOpen || !convoi) return null;

  const [scellesIntacts, setScellesIntacts] = useState(true);
  const [temperatureRelevee, setTemperatureRelevee] = useState(convoi.temperatureSonde || '3.8°C');
  const [colisVerifies, setColisVerifies] = useState(convoi.nombreColis || 0);
  const [sansAvaries, setSansAvaries] = useState(true);
  const [observations, setObservations] = useState('');
  const [signataireNom, setSignataireNom] = useState(antenna?.responsable || 'Dr. Paul MBA');
  const [submitting, setSubmitting] = useState(false);

  const tempNum = parseFloat(temperatureRelevee.replace('°C', '').trim()) || 4.0;
  const isTempOk = tempNum >= 2.0 && tempNum <= 8.0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      onConfirmReception({
        convoiId: convoi.id,
        convoiCode: convoi.convoiCode,
        blNationalCode: convoi.blNationalCode,
        scellesIntacts,
        temperatureRelevee,
        temperatureConforme: isTempOk,
        colisVerifies: Number(colisVerifies),
        sansAvaries,
        observations,
        signataireNom,
        dateReception: new Date().toISOString(),
        statut: (scellesIntacts && isTempOk && sansAvaries) ? 'RECEPTIONNE_CONFORME' : 'RECEPTIONNE_AVEC_RESERVES',
      });
      setSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#00A651]/20 border border-[#00A651] flex items-center justify-center text-[#00A651]">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black tracking-widest text-[#00A651] uppercase">Procès-Verbal de Réception</span>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                Réception Convoi : <span className="text-[#00A651]">{convoi.convoiCode}</span>
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs text-slate-700">
          
          {/* Convoi Information Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Origine</span>
              <p className="font-bold text-slate-900">{convoi.origine}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Bordereau BL National</span>
              <p className="font-mono font-bold text-emerald-700">{convoi.blNationalCode}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Mode de transport</span>
              <p className="font-semibold text-slate-800">{convoi.modeTransport}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Chef de Convoi</span>
              <p className="font-semibold text-slate-800">{convoi.chefConvoi}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Colis annoncés</span>
              <p className="font-black text-slate-900">{convoi.nombreColis} colis ({convoi.tonnageKg} kg)</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Valeur Fret</span>
              <p className="font-mono font-bold text-slate-900">{convoi.valeurMarchandiseXaf ? convoi.valeurMarchandiseXaf.toLocaleString('fr-FR') : '—'} XAF</p>
            </div>
          </div>

          {/* Verification Checklist */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Contrôles de Conformité à l'Arrivée</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={scellesIntacts}
                  onChange={(e) => setScellesIntacts(e.target.checked)}
                  className="w-4 h-4 rounded text-[#00A651] focus:ring-[#00A651]"
                />
                <div>
                  <span className="font-bold text-slate-900">Scellés de sécurité intacts</span>
                  <p className="text-[10px] text-slate-500">Aucune effraction constatée sur les portes</p>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={sansAvaries}
                  onChange={(e) => setSansAvaries(e.target.checked)}
                  className="w-4 h-4 rounded text-[#00A651] focus:ring-[#00A651]"
                />
                <div>
                  <span className="font-bold text-slate-900">Cartons et emballages intacts</span>
                  <p className="text-[10px] text-slate-500">Aucun écrasement ni fuite liquide</p>
                </div>
              </label>
            </div>

            {/* Temperature Reading */}
            <div className="p-3.5 rounded-lg border border-slate-200 bg-cyan-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ThermometerSnowflake className="w-5 h-5 text-cyan-700" />
                <div>
                  <span className="font-bold text-slate-900">Contrôle Sonde Thermique (2°C – 8°C)</span>
                  <p className="text-[10px] text-slate-600">Relevé de la sonde IoT ou du thermomètre témoin</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={temperatureRelevee}
                  onChange={(e) => setTemperatureRelevee(e.target.value)}
                  className="w-24 px-3 py-1.5 rounded-lg border border-slate-300 font-mono font-bold text-center text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="3.8°C"
                  required
                />
                <span className={`px-2 py-1 rounded text-[10px] font-bold ${isTempOk ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                  {isTempOk ? 'Conforme' : 'Non conforme'}
                </span>
              </div>
            </div>

            {/* Package count input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Nombre effectif de colis déchargés</label>
                <input
                  type="number"
                  value={colisVerifies}
                  onChange={(e) => setColisVerifies(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A651]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Pharmacien / Responsable Réceptionnaire</label>
                <input
                  type="text"
                  value={signataireNom}
                  onChange={(e) => setSignataireNom(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A651]"
                  required
                />
              </div>
            </div>

            {/* Observations */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Observations / Réserves éventuelles</label>
              <textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                rows={2}
                placeholder="Ex: Réception effectuée sans réserve, transfert immédiat en chambre froide CF-G2..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#00A651]"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-lg bg-[#00A651] hover:bg-[#008f45] text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Validation en cours...' : 'Signer le PV & Intégrer au Stock'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
