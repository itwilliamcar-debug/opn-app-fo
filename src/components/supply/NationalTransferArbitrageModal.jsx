import React, { useState } from 'react';
import { 
  X, 
  ArrowRightLeft, 
  AlertTriangle, 
  CheckCircle2, 
  Package, 
  Building2, 
  DollarSign, 
  TrendingDown, 
  Sparkles,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

import { SICL_INTER_ANTENNA_ARBITRAGE_SEED } from '../../data/siclSeedData';
import { generateOpnDocNumber } from '../../utils/codificationHelper';
import { askConfirm, pushToast } from '../../services/toastBus';

export default function NationalTransferArbitrageModal({ isOpen, onClose, onConfirmTransfer }) {
  if (!isOpen) return null;

  const [arbitrageList, setArbitrageList] = useState(SICL_INTER_ANTENNA_ARBITRAGE_SEED);
  const [confirmedIds, setConfirmedIds] = useState([]);

  const handleExecuteTransfer = async (item) => {
    const ok = await askConfirm({
      message: `Transférer ${item.quantiteSuggeree} unités de ${item.antenneSourceNom} vers ${item.antenneDestNom} ?`,
      confirmLabel: 'Transférer',
    });
    if (!ok) return;
    const transferCode = generateOpnDocNumber('TRANSFERT', {
      sourceAntenne: item.antenneSourceId,
      destAntenne: item.antenneDestId,
      sequence: Math.floor(Math.random() * 500) + 1
    });

    setConfirmedIds([...confirmedIds, item.id]);

    if (onConfirmTransfer) {
      onConfirmTransfer({
        code: transferCode,
        ...item
      });
    }

    pushToast(`Transfert ${transferCode} initié : ${item.quantiteSuggeree} unités de ${item.antenneSourceNom} vers ${item.antenneDestNom}.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#003366] via-indigo-900 to-[#00A651] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <ArrowRightLeft className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                  Module M8 &amp; AM-08 SICL
                </span>
                <span className="text-xs font-semibold text-emerald-300">Péréquation &amp; Optimisation BFR</span>
              </div>
              <h3 className="font-bold text-lg text-white">Moteur d'Arbitrage des Transferts Inter-Antennes</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          <div className="bg-blue-50/80 p-4 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-blue-950">Gain financier direct (AM-08) : Éviter les commandes fournisseurs &amp; Écouler les péremptions proches</p>
              <p className="mt-1 text-blue-800">
                L'algorithme analyse en continu les niveaux de stock des 9 antennes régionales et détecte les opportunités de transferts internes lorsqu'une antenne est en surstock (&gt; 4 mois) et une autre en rupture (&lt; 1 mois).
              </p>
            </div>
          </div>

          {/* Arbitrage Cards */}
          <div className="space-y-4">
            {arbitrageList.map((item) => {
              const isConfirmed = confirmedIds.includes(item.id);

              return (
                <div key={item.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                  
                  {/* Top Bar */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                          item.priorite === 'CRITIQUE' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          PRIORITÉ {item.priorite}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-700">{item.codeProduit}</span>
                        <span className="text-xs text-slate-500">Lot : <strong className="font-mono text-slate-800">{item.lotConcerne}</strong> (Péremption : {item.peremptionLot})</span>
                      </div>
                      <h4 className="font-bold text-base text-slate-900">{item.designation}</h4>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Économie Fournisseur Générée</span>
                      <span className="text-lg font-black text-emerald-700">+{item.economieAchatXaf.toLocaleString()} XAF</span>
                    </div>
                  </div>

                  {/* Transfer Comparison Visual Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center">
                    
                    {/* Source Antenna */}
                    <div className="md:col-span-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Antenne Source (Surstock)</span>
                      <p className="font-bold text-xs text-slate-900 mt-0.5">{item.antenneSourceNom}</p>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Stock dispo : <strong className="text-slate-900">{item.stockSource.toLocaleString()} u.</strong></span>
                        <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {item.couvertureSourceMois} mois de stock
                        </span>
                      </div>
                    </div>

                    {/* Arrow / Suggested Quantity */}
                    <div className="md:col-span-1 text-center py-2">
                      <div className="inline-flex flex-col items-center">
                        <span className="text-[10px] font-black text-[#003366] bg-blue-100 px-2 py-0.5 rounded-full mb-1">
                          {item.quantiteSuggeree.toLocaleString()} u.
                        </span>
                        <ArrowRight className="w-5 h-5 text-slate-400" />
                      </div>
                    </div>

                    {/* Dest Antenna */}
                    <div className="md:col-span-3 bg-red-50/60 p-3.5 rounded-xl border border-red-200">
                      <span className="text-[10px] font-bold text-red-600 uppercase block">Antenne Destination (Rupture)</span>
                      <p className="font-bold text-xs text-slate-900 mt-0.5">{item.antenneDestNom}</p>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Stock actuel : <strong className="text-red-700">{item.stockDest.toLocaleString()} u.</strong></span>
                        <span className="font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded border border-red-300">
                          {item.couvertureDestMois} mois (Rupture)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Motif & Action */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
                    <p className="text-xs text-slate-600 italic">
                      💡 {item.motif}
                    </p>

                    <div>
                      {isConfirmed ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          Transfert Inter-Antennes Initié !
                        </span>
                      ) : (
                        <button
                          onClick={() => handleExecuteTransfer(item)}
                          className="px-4 py-2 bg-gradient-to-r from-[#003366] to-[#00A651] hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                        >
                          <ArrowRightLeft className="w-4 h-4 text-emerald-300" />
                          Valider le Transfert Inter-Antennes
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
}
