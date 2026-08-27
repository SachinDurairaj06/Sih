import React, { useState } from 'react';
import { Patient, InterventionTier, DiseaseStage, DiseaseCategory } from '../types';
import {
  Users,
  Dna,
  Filter,
  ArrowUpRight,
  Search,
  ShieldAlert,
  Atom,
  ChevronRight,
  BookOpen,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';
import { AUTOIMMUNE_DISEASES_CATALOG } from '../data/quantumEngine';

interface CohortMatrixProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onSimulatePatient: (patient: Patient) => void;
  selectedDisease: string;
  setSelectedDisease: (disease: string) => void;
}

export const CohortMatrix: React.FC<CohortMatrixProps> = ({
  patients,
  onSelectPatient,
  onSimulatePatient,
  selectedDisease,
  setSelectedDisease,
}) => {
  const [tierFilter, setTierFilter] = useState<string>('All');
  const [stageFilter, setStageFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCatalogModal, setShowCatalogModal] = useState<boolean>(false);

  const categories: DiseaseCategory[] = [
    'Joint/Systemic',
    'Systemic',
    'Endocrine',
    'Neurological',
    'Dermatological/Joint',
    'Gastrointestinal',
    'Exocrine/Systemic',
    'Joint/Spine',
    'Dermatological',
    'Hepatic',
    'Neuromuscular',
  ];

  // Filter cohort
  const filteredPatients = patients.filter((p) => {
    if (selectedDisease !== 'All' && p.diseaseType !== selectedDisease) return false;
    if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
    if (tierFilter !== 'All' && p.currentTier !== tierFilter) return false;
    if (stageFilter !== 'All' && p.stage !== stageFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchId = p.id.toLowerCase().includes(q);
      const matchDisease = p.diseaseType.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchDisease && !matchCategory) return false;
    }
    return true;
  });

  const getTierBadgeClass = (tier: InterventionTier) => {
    switch (tier) {
      case 'Tier 0':
        return 'bg-slate-800 text-slate-300 border-slate-700';
      case 'Tier 1':
        return 'bg-amber-950/80 text-amber-300 border-amber-800';
      case 'Tier 2':
        return 'bg-rose-950/90 text-rose-300 border-rose-800 font-semibold animate-pulse';
      case 'Tier 3':
        return 'bg-purple-950/90 text-purple-300 border-purple-800 font-bold';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  const getStageBadgeClass = (stage: DiseaseStage) => {
    switch (stage) {
      case 'Stage 0':
        return 'text-slate-400 bg-slate-800 border border-slate-700';
      case 'Stage 1':
        return 'text-amber-300 bg-amber-950/60 border border-amber-800';
      case 'Stage 2':
        return 'text-rose-300 bg-rose-950/80 border border-rose-800 font-semibold';
      case 'Stage 3':
        return 'text-red-300 bg-red-950 border border-red-800 font-bold';
      default:
        return 'text-slate-400 bg-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-md flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">15 Autoimmune Target Classes</p>
            <h3 className="text-2xl font-bold text-slate-100 mt-1 font-mono">15 Diseases</h3>
            <p className="text-xs text-indigo-400 mt-1 flex items-center gap-1">
              <span>Multi-Class OvR Quantum Model</span>
            </p>
          </div>
          <div className="p-3.5 bg-indigo-950/60 rounded-2xl text-indigo-400 border border-indigo-800/60">
            <Atom className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-md flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Pre-Clinical Tier 2 Candidates</p>
            <h3 className="text-2xl font-bold text-rose-400 mt-1 font-mono">
              {patients.filter((p) => p.currentTier === 'Tier 2').length} Patients
            </h3>
            <p className="text-xs text-rose-300 mt-1">Stage 2 minimal-intervention window</p>
          </div>
          <div className="p-3.5 bg-rose-950/60 rounded-2xl text-rose-400 border border-rose-800/60">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-md flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Quantum Kernel Alignment (QKA)</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1 font-mono">0.892 QKA</h3>
            <p className="text-xs text-emerald-300 mt-1">+6.7% vs Classical Random Forest</p>
          </div>
          <div className="p-3.5 bg-emerald-950/60 rounded-2xl text-emerald-400 border border-emerald-800/60">
            <Zap className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-md flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Reference-Free TCR Clusters</p>
            <h3 className="text-2xl font-bold text-purple-400 mt-1 font-mono">
              {patients.reduce((acc, p) => acc + p.immuneRepertoireClusters.length, 0)} Clonal Families
            </h3>
            <p className="text-xs text-purple-300 mt-1">Uncatalogued autoreactive expansion</p>
          </div>
          <div className="p-3.5 bg-purple-950/60 rounded-2xl text-purple-400 border border-purple-800/60">
            <Dna className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 15-Disease Catalog Quick Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-semibold text-slate-200">
              15 Autoimmune Disease Categories Catalog
            </h3>
          </div>
          <button
            onClick={() => setShowCatalogModal(!showCatalogModal)}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
          >
            <span>{showCatalogModal ? 'Collapse Reference Guide' : 'Expand 15-Disease Lab Guide'}</span>
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showCatalogModal ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {/* Quick Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategoryFilter('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              categoryFilter === 'All'
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            All Categories (15)
          </button>
          {Array.from(new Set(AUTOIMMUNE_DISEASES_CATALOG.map((d) => d.category))).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                categoryFilter === cat
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                  : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Expanded 15-Disease Reference Guide Table */}
        {showCatalogModal && (
          <div className="mt-4 pt-4 border-t border-slate-800/80 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Disease</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Primary Age Group</th>
                  <th className="py-2.5 px-3">Autoantibody Panel</th>
                  <th className="py-2.5 px-3">Organ-Specific Labs</th>
                  <th className="py-2.5 px-3">Genetic Marker</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {AUTOIMMUNE_DISEASES_CATALOG.map((d) => (
                  <tr
                    key={d.id}
                    onClick={() => setSelectedDisease(d.name)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors text-slate-300"
                  >
                    <td className="py-2 px-3 font-mono text-slate-500">{d.id}</td>
                    <td className="py-2 px-3 font-semibold text-indigo-300">{d.name}</td>
                    <td className="py-2 px-3 text-slate-400">{d.category}</td>
                    <td className="py-2 px-3 text-slate-400">{d.primaryAgeGroup}</td>
                    <td className="py-2 px-3 text-amber-300/90 font-mono text-[11px]">
                      {d.keyAutoantibodies.join(', ')}
                    </td>
                    <td className="py-2 px-3 text-emerald-300/90 font-mono text-[11px]">
                      {d.keyOrganLabs.join(', ')}
                    </td>
                    <td className="py-2 px-3 text-purple-300 font-mono text-[11px]">
                      {d.primaryGeneticMarker}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Cohort Search & Triage Controls */}
      <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Patient Name, ID, Disease, or Category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">Tier:</span>
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="All">All Tiers</option>
                <option value="Tier 0">Tier 0 (Baseline)</option>
                <option value="Tier 1">Tier 1 (Subclinical)</option>
                <option value="Tier 2">Tier 2 (High Risk / Drug Eligible)</option>
                <option value="Tier 3">Tier 3 (Clinical Transition)</option>
              </select>
            </div>

            <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
              <span className="text-slate-400">Stage:</span>
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="All">All Stages</option>
                <option value="Stage 0">Stage 0 (Genetic / Pre-Immune)</option>
                <option value="Stage 1">Stage 1 (Asymptomatic Seroconversion)</option>
                <option value="Stage 2">Stage 2 (Subclinical End-Organ Loss)</option>
                <option value="Stage 3">Stage 3 (Overt Symptoms)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Patients Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-3 px-3 font-semibold">Patient & ID</th>
                <th className="py-3 px-3 font-semibold">Target Disease</th>
                <th className="py-3 px-3 font-semibold">Category</th>
                <th className="py-3 px-3 font-semibold">Stage</th>
                <th className="py-3 px-3 font-semibold">Intervention Tier</th>
                <th className="py-3 px-3 font-semibold">Quantum Risk Score</th>
                <th className="py-3 px-3 font-semibold">Key Biomarkers & HLA</th>
                <th className="py-3 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                      {patient.name}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {patient.id} • {patient.age}y {patient.gender}
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="font-medium text-slate-200">{patient.diseaseType}</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-medium border border-slate-700/80">
                      {patient.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-medium ${getStageBadgeClass(patient.stage)}`}>
                      {patient.stage}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-1 rounded-lg border text-[11px] ${getTierBadgeClass(patient.currentTier)}`}>
                      {patient.currentTier}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 font-mono font-bold">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            patient.currentRiskScore > 0.8
                              ? 'bg-rose-500'
                              : patient.currentRiskScore > 0.5
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${patient.currentRiskScore * 100}%` }}
                        />
                      </div>
                      <span className={patient.currentRiskScore > 0.8 ? 'text-rose-400' : 'text-slate-300'}>
                        {(patient.currentRiskScore * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-[11px] text-slate-400">
                    <div className="font-mono text-indigo-300">{patient.hlaAlleles[0] || 'HLA Tested'}</div>
                    <div className="text-slate-500">
                      CRP: {patient.clinicalFeatures.crp} mg/L • ESR: {patient.clinicalFeatures.esr}
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onSelectPatient(patient)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 text-xs font-medium transition-all"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => onSimulatePatient(patient)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-medium transition-all"
                      >
                        Simulate
                      </button>
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
};
