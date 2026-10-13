import React, { useState, useMemo } from 'react';
import { 
  Landmark, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  Filter, 
  Search, 
  FileText, 
  Download, 
  Building2, 
  DollarSign, 
  Calendar, 
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  UserCheck,
  Activity
} from 'lucide-react';

import { SICL_PUBLIC_DEBT_SEED } from '../../data/siclSeedData';
import { GABON_PROVINCIAL_ANTENNAS } from '../../data/provincialAntennaData';

export const MANDATEMENT_STAGES = [
  { id: 'ENGAGEMENT', label: '1. Engagement Budgétaire', color: 'bg-slate-100 text-slate-800' },
  { id: 'LIQUIDATION', label: '2. Service Fait / Liquidation', color: 'bg-blue-100 text-blue-800' },
  { id: 'MANDATEMENT', label: '3. Mandatement Émis', color: 'bg-amber-100 text-amber-800' },
  { id: 'ORDONNANCEMENT_TRESOR', label: '4. Ordonnancement Trésor', color: 'bg-purple-100 text-purple-800' },
  { id: 'PAYE', label: '5. Payé & Apuré', color: 'bg-emerald-100 text-emerald-800' }
];

export const AGING_BRACKETS = [
  { id: 'ALL', label: 'Toutes les tranches' },
  { id: 'NON_ECHU', label: 'Non Échu (< 0j)' },
  { id: '1-30', label: '1 à 30 Jours' },
  { id: '31-60', label: '31 à 60 Jours' },
  { id: '61-90', label: '61 à 90 Jours' },
  { id: 'PLUS_90', label: '> 90 Jours (Critique)' }
];

export default function PublicSectorDebtManager() {
  const [debts, setDebts] = useState(SICL_PUBLIC_DEBT_SEED);
  const [selectedAntenna, setSelectedAntenna] = useState('ALL');
  const [selectedBracket, setSelectedBracket] = useState('ALL');
  const [selectedStage, setSelectedStage] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDebtDetail, setSelectedDebtDetail] = useState(null);
  const [isRelanceModalOpen, setIsRelanceModalOpen] = useState(false);

  const filteredDebts = useMemo(() => {
    return debts.filter(d => {
      const matchAntenna = selectedAntenna === 'ALL' || d.antenneId === selectedAntenna;
      const matchBracket = selectedBracket === 'ALL' || d.trancheAnciennete === selectedBracket;
      const matchStage = selectedStage === 'ALL' || d.etapeMandatement === selectedStage;
      const matchSearch = searchQuery === '' || 
        d.structureNom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.numeroFacture.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.clientCode.toLowerCase().includes(searchQuery.toLowerCase());
      return matchAntenna && matchBracket && matchStage && matchSearch;
    });
  }, [debts, selectedAntenna, selectedBracket, selectedStage, searchQuery]);

  // Aggregate stats
  const totals = useMemo(() => {
    const totalFacture = debts.reduce((acc, d) => acc + d.montantFactureXaf, 0);
    const totalRegle = debts.reduce((acc, d) => acc + d.montantRegleXaf, 0);
    const totalRestant = debts.reduce((acc, d) => acc + d.resteARecouvrerXaf, 0);
    const plus90Total = debts.filter(d => d.trancheAnciennete === 'PLUS_90').reduce((acc, d) => acc + d.resteARecouvrerXaf, 0);
    
    return {
      totalFacture,
      totalRegle,
      totalRestant,
      plus90Total
    };
  }, [debts]);

  const handleAdvanceStage = (debtId, nextStage) => {
    setDebts(prev => prev.map(d => {
      if (d.id === debtId) {
        return {
          ...d,
          etapeMandatement: nextStage,
          ...(nextStage === 'PAYE' ? { montantRegleXaf: d.montantFactureXaf, resteARecouvrerXaf: 0 } : {})
        };
      }
      return d;
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#003366] to-[#00A651] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-white/30">
                Module M5 &amp; AM-13 SICL
              </span>
              <span className="text-emerald-300 text-xs font-semibold flex items-center gap-1">
                <Landmark className="w-3.5 h-3.5" /> Circuit Créance Publique &amp; Balance Âgée
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Recouvrement Public &amp; Suivi des Mandatements
            </h1>
            <p className="text-xs text-blue-100 max-w-2xl mt-1">
              Pilotage des créances sur les hôpitaux publics (CHUL, CHR, Centres de Santé) : étapes d'engagement, liquidation, mandatement et ordonnancement Trésor.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-right border border-white/15">
              <span className="text-[10px] text-blue-100 uppercase block font-medium">Encours Public Total</span>
              <span className="text-xl font-black text-amber-300">
                {totals.totalRestant.toLocaleString()} XAF
              </span>
            </div>
          </div>
        </div>

        {/* Balance Âgée Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/15">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
            <p className="text-[10px] font-medium text-blue-100 uppercase">Non Échu</p>
            <p className="text-lg font-black text-emerald-300 mt-0.5">
              {debts.filter(d => d.trancheAnciennete === 'NON_ECHU').reduce((acc, d) => acc + d.resteARecouvrerXaf, 0).toLocaleString()} XAF
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
            <p className="text-[10px] font-medium text-blue-100 uppercase">1 - 60 Jours</p>
            <p className="text-lg font-black text-white mt-0.5">
              {debts.filter(d => d.trancheAnciennete === '1-30' || d.trancheAnciennete === '31-60').reduce((acc, d) => acc + d.resteARecouvrerXaf, 0).toLocaleString()} XAF
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
            <p className="text-[10px] font-medium text-blue-100 uppercase">61 - 90 Jours</p>
            <p className="text-lg font-black text-amber-300 mt-0.5">
              {debts.filter(d => d.trancheAnciennete === '61-90').reduce((acc, d) => acc + d.resteARecouvrerXaf, 0).toLocaleString()} XAF
            </p>
          </div>
          <div className="bg-rose-500/20 backdrop-blur-md rounded-xl p-3 border border-rose-300/30">
            <p className="text-[10px] font-medium text-rose-200 uppercase flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-rose-300" /> &gt; 90 Jours (Risque)
            </p>
            <p className="text-lg font-black text-rose-300 mt-0.5">
              {totals.plus90Total.toLocaleString()} XAF
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher structure, facture..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]/20"
            />
          </div>

          <select
            value={selectedAntenna}
            onChange={(e) => setSelectedAntenna(e.target.value)}
            className="text-xs font-semibold px-3 py-2 border border-slate-200 rounded-lg bg-white"
          >
            <option value="ALL">Toutes les Antennes</option>
            {GABON_PROVINCIAL_ANTENNAS.map(a => (
              <option key={a.provinceCode} value={a.provinceCode}>{a.provinceCode} — {a.province}</option>
            ))}
          </select>

          <select
            value={selectedBracket}
            onChange={(e) => setSelectedBracket(e.target.value)}
            className="text-xs font-semibold px-3 py-2 border border-slate-200 rounded-lg bg-white"
          >
            {AGING_BRACKETS.map(b => (
              <option key={b.id} value={b.id}>{b.label}</option>
            ))}
          </select>

          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="text-xs font-semibold px-3 py-2 border border-slate-200 rounded-lg bg-white"
          >
            <option value="ALL">Toutes les étapes mandatement</option>
            {MANDATEMENT_STAGES.map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Debts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3">Facture / Antenne</th>
                <th className="p-3">Hôpital / Structure</th>
                <th className="p-3 text-right">Montant Facturé</th>
                <th className="p-3 text-right">Reste à Recouvrer</th>
                <th className="p-3">Retard / Tranche</th>
                <th className="p-3">Circuit Mandatement (AM-13)</th>
                <th className="p-3">Service Instructeur</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDebts.map(debt => (
                <tr key={debt.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3">
                    <span className="font-mono font-bold text-[#003366] bg-blue-50 px-2 py-0.5 rounded">
                      {debt.numeroFacture}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-0.5">{debt.dateFacture}</p>
                  </td>

                  <td className="p-3 font-semibold text-slate-900">
                    <p className="font-bold text-slate-900">{debt.structureNom}</p>
                    <span className="text-[10px] font-mono text-slate-500">Client {debt.clientCode} ({debt.province})</span>
                  </td>

                  <td className="p-3 text-right font-semibold text-slate-700">
                    {debt.montantFactureXaf.toLocaleString()} XAF
                  </td>

                  <td className="p-3 text-right">
                    <span className="font-black text-sm text-red-700">
                      {debt.resteARecouvrerXaf.toLocaleString()} XAF
                    </span>
                  </td>

                  <td className="p-3">
                    {debt.joursRetard > 0 ? (
                      <div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          debt.trancheAnciennete === 'PLUS_90' ? 'bg-red-100 text-red-800' :
                          debt.trancheAnciennete === '61-90' ? 'bg-amber-100 text-amber-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          +{debt.joursRetard} jours
                        </span>
                        <p className="text-[10px] text-slate-500 mt-0.5">Tranche : {debt.trancheAnciennete}</p>
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        Non échu
                      </span>
                    )}
                  </td>

                  <td className="p-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      debt.etapeMandatement === 'PAYE' ? 'bg-emerald-100 text-emerald-800' :
                      debt.etapeMandatement === 'ORDONNANCEMENT_TRESOR' ? 'bg-purple-100 text-purple-800' :
                      debt.etapeMandatement === 'MANDATEMENT' ? 'bg-amber-100 text-amber-800' :
                      debt.etapeMandatement === 'LIQUIDATION' ? 'bg-blue-100 text-blue-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {debt.etapeMandatement}
                    </span>
                    {debt.numeroBordereauMandat && (
                      <p className="text-[10px] font-mono text-slate-600 mt-1">
                        Bordereau : <strong>{debt.numeroBordereauMandat}</strong>
                      </p>
                    )}
                  </td>

                  <td className="p-3 text-slate-600">
                    <p className="font-medium text-slate-800">{debt.serviceInstructeur}</p>
                    <p className="text-[10px] text-slate-500">{debt.contactService}</p>
                  </td>

                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {debt.etapeMandatement !== 'PAYE' && (
                        <button
                          onClick={() => {
                            const nextMap = {
                              'ENGAGEMENT': 'LIQUIDATION',
                              'LIQUIDATION': 'MANDATEMENT',
                              'MANDATEMENT': 'ORDONNANCEMENT_TRESOR',
                              'ORDONNANCEMENT_TRESOR': 'PAYE'
                            };
                            handleAdvanceStage(debt.id, nextMap[debt.etapeMandatement] || 'PAYE');
                          }}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded shadow-sm transition-all"
                          title="Avancer à l'étape suivante du circuit public"
                        >
                          Avancer Étape
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
