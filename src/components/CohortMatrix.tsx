import React, { useState } from 'react';
import { Patient, InterventionTier, DiseaseStage } from '../types';
import { Users, AlertTriangle, Dna, Filter, ArrowUpRight, Search, ShieldAlert, Sparkles } from 'lucide-react';

interface CohortMatrixProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onSimulatePatient: (patient: Patient) => void;
  selectedDisease: string;
}

export const CohortMatrix: React.FC<CohortMatrixProps> = ({
  patients,
  onSelectPatient,
  onSimulatePatient,
  selectedDisease,
}) => {
  const [tierFilter, setTierFilter] = useState<string>('All');
  const [stageFilter, setStageFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter cohort
  const filteredPatients = patients.filter((p) => {
    if (selectedDisease !== 'All' && p.diseaseType !== selectedDisease) return false;
    if (tierFilter !== 'All' && p.currentTier !== tierFilter) return false;
    if (stageFilter !== 'All' && p.stage !== stageFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchId = p.id.toLowerCase().includes(q);
      const matchDisease = p.diseaseType.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchDisease) return false;
    }
    return true;
  });

  // Calculate cohort metrics
  const totalMonitored = patients.length;
  const tier2Count = patients.filter((p) => p.currentTier === 'Tier 2').length;
  const totalClustersFound = patients.reduce(
    (acc, p) => acc + p.immuneRepertoireClusters.filter((c) => !c.isReferenceCatalogued).length,
    0
  );
  const totalCausalDrivers = patients.reduce(
    (acc, p) => acc + p.biomarkerEvaluations.filter((b) => b.isCausalDriver).length,
    0
  );

  const getTierBadgeClass = (tier: InterventionTier) => {
    switch (tier) {
      case 'Tier 0':
        return 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
      case 'Tier 1':
        return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800';
      case 'Tier 2':
        return 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800 font-semibold animate-pulse';
      case 'Tier 3':
        return 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-800 font-bold';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStageBadgeClass = (stage: DiseaseStage) => {
    switch (stage) {
      case 'Stage 0':
        return 'text-slate-600 bg-slate-100';
      case 'Stage 1':
        return 'text-amber-700 bg-amber-50 border border-amber-200';
      case 'Stage 2':
        return 'text-rose-700 bg-rose-50 border border-rose-200 font-semibold';
      case 'Stage 3':
        return 'text-red-800 bg-red-100 border border-red-300 font-bold';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Monitored Cohort</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{totalMonitored} Patients</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Multi-omic longitudinal tracking</p>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Tier 2 Pre-Clinical High Risk</p>
            <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">{tier2Count} Candidates</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Teplizumab / DMT eligible (Stage 2)</p>
          </div>
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 rounded-xl text-rose-600 dark:text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Reference-Free TCR Clusters</p>
            <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{totalClustersFound} Novel Clusters</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Uncatalogued autoreactive signal</p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-950/60 rounded-xl text-purple-600 dark:text-purple-400">
            <Dna className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Causal Drivers Separated</p>
            <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{totalCausalDrivers} Drivers</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Bystander viral spikes filtered out</p>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient name, ID or disease..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Tier:</span>
          </div>

          {(['All', 'Tier 0', 'Tier 1', 'Tier 2', 'Tier 3'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTierFilter(t)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                tierFilter === t
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {t}
            </button>
          ))}

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 focus:outline-none"
          >
            <option value="All">All Stages</option>
            <option value="Stage 0">Stage 0 (Asymptomatic Normal)</option>
            <option value="Stage 1">Stage 1 (Seroconverted Normoglycaemic)</option>
            <option value="Stage 2">Stage 2 (Dysglycaemic / Subclinical)</option>
            <option value="Stage 3">Stage 3 (Clinical Onset)</option>
          </select>
        </div>
      </div>

      {/* Main Patient Cohort Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Patient Profile</th>
                <th className="px-4 py-3">Disease & Stage</th>
                <th className="px-4 py-3">Seroconversion Status</th>
                <th className="px-4 py-3">Reference-Free CDR3 Clusters</th>
                <th className="px-4 py-3">AIRT-Net Risk Trajectory</th>
                <th className="px-4 py-3">Assigned Tier</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    No patients match the current filters.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => {
                  const novelClusters = patient.immuneRepertoireClusters.filter((c) => !c.isReferenceCatalogued);

                  return (
                    <tr
                      key={patient.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{patient.name}</div>
                        <div className="text-slate-400 text-[11px] flex items-center space-x-2">
                          <span>{patient.id}</span>
                          <span>•</span>
                          <span>{patient.age} y/o {patient.gender}</span>
                          <span>•</span>
                          <span className="text-indigo-400 font-mono text-[10px]">
                            {patient.hlaAlleles.join(', ')}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="font-medium text-slate-800 dark:text-slate-200">{patient.diseaseType}</div>
                        <div className="mt-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${getStageBadgeClass(patient.stage)}`}>
                            {patient.stage}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${
                            patient.seroconversionStatus === 'Multiple Autoantibody Positive'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                              : patient.seroconversionStatus === 'Single Autoantibody Positive'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {patient.seroconversionStatus}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-purple-600 dark:text-purple-400 text-sm">
                            {novelClusters.length}
                          </span>
                          <span className="text-slate-400 text-[11px]">unmapped clusters</span>
                        </div>
                        {novelClusters.length > 0 && (
                          <p className="text-[10px] text-purple-500 font-mono mt-0.5 truncate max-w-[160px]">
                            {novelClusters[0].knownTargetEpitope || novelClusters[0].sequence}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                patient.currentRiskScore > 0.7
                                  ? 'bg-rose-500'
                                  : patient.currentRiskScore > 0.4
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.round(patient.currentRiskScore * 100)}%` }}
                            />
                          </div>
                          <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                            {(patient.currentRiskScore * 100).toFixed(0)}%
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[11px] border ${getTierBadgeClass(
                            patient.currentTier
                          )}`}
                        >
                          {patient.currentTier}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-right space-x-2">
                        <button
                          onClick={() => onSelectPatient(patient)}
                          className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-md font-medium text-[11px] transition-colors inline-flex items-center space-x-1"
                        >
                          <span>Inspect</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => onSimulatePatient(patient)}
                          className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-md font-medium text-[11px] transition-colors"
                        >
                          Simulate
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
