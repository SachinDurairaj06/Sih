import React, { useState } from 'react';
import { Patient } from '../types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ScatterChart,
  Scatter,
  ZAxis,
  BarChart,
  Bar,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  LineChart as IconLineChart,
  Dna,
  ShieldAlert,
  Sparkles,
  BarChart3,
  Pill,
  CheckCircle2,
  AlertCircle,
  Clock,
  Atom,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { extract15FeatureVector } from '../data/quantumEngine';

interface PatientInspectorProps {
  patient: Patient;
  onSimulate: (patient: Patient) => void;
}

export const PatientInspector: React.FC<PatientInspectorProps> = ({ patient, onSimulate }) => {
  const [subTab, setSubTab] = useState<'quantum' | 'trajectory' | 'umap' | 'causal' | 'shap' | 'pathway'>('quantum');

  // Format longitudinal visits for Recharts
  const trajectoryData = patient.visits.map((v) => {
    const abKeys = Object.keys(v.autoantibodyTitres);
    const abSummary = abKeys.reduce((acc, key) => acc + v.autoantibodyTitres[key], 0);

    return {
      date: v.visitDate,
      riskScorePercent: Math.round(v.calculatedRiskScore * 100),
      autoantibodyTotal: abSummary,
      cPeptideOrMetric: v.cPeptideOrFunctionMetric,
      dysbiosisPercent: Math.round(v.microbiomeDysbiosisIndex * 100),
      wearableInProportion: v.wearableGlycemicOrActivityScore,
      ...v.autoantibodyTitres,
    };
  });

  // UMAP cluster scatter data
  const umapData = patient.immuneRepertoireClusters.map((c) => ({
    x: c.umapX,
    y: c.umapY,
    sequence: c.sequence,
    clusterName: c.clusterName,
    isAutoreactive: c.isAutoreactiveCluster,
    isReferenceCatalogued: c.isReferenceCatalogued,
    enrichment: c.enrichmentScoreVsControl,
    epitope: c.knownTargetEpitope || 'Uncatalogued Epitope',
  }));

  // SHAP data for BarChart
  const shapData = patient.shapAttributions.map((s) => ({
    name: s.featureName,
    value: s.shapValue,
    category: s.category,
    description: s.description,
  }));

  // Quantum Kernel OvR Differential Diagnoses
  const quantumProbData = patient.quantumPredictions.map((qp) => ({
    disease: qp.disease,
    Probability: Number((qp.probability * 100).toFixed(1)),
    Margin: Number((qp.ovrMargin * 100).toFixed(1)),
  }));

  // 15 Feature Radar in Angle Space
  const angles = extract15FeatureVector(patient.clinicalFeatures);
  const featureNames = [
    'Age',
    'BMI',
    'CRP',
    'ESR',
    'ANA/dsDNA',
    'Anti-CCP/RF',
    'Anti-TPO/TG',
    'Anti-tTG',
    'Anti-AChR',
    'TSH',
    'HbA1c',
    'ALT/AST',
    'Complement',
    'Symptoms',
    'HLA Genotype',
  ];

  const angleRadarData = featureNames.map((name, i) => ({
    feature: name,
    AngleVal: Number(((angles[i] / (2 * Math.PI)) * 100).toFixed(1)),
    RawTheta: Number(angles[i].toFixed(2)),
  }));

  return (
    <div className="space-y-6">
      {/* Patient Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold tracking-tight text-slate-100">{patient.name}</h2>
              <span className="text-xs font-mono px-2.5 py-1 bg-slate-800 rounded-lg border border-slate-700 text-slate-300">
                {patient.id}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-rose-950/90 text-rose-300 border border-rose-800 animate-pulse">
                {patient.currentTier}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-slate-800 text-indigo-300 border border-slate-700">
                {patient.category}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <div>
                <span className="text-slate-400">Target Suspected:</span>{' '}
                <span className="font-semibold text-white">{patient.diseaseType}</span>
              </div>
              <div>
                <span className="text-slate-400">Current Stage:</span>{' '}
                <span className="font-semibold text-amber-300">{patient.stage}</span>
              </div>
              <div>
                <span className="text-slate-400">Age / Gender:</span>{' '}
                <span className="font-semibold text-white">{patient.age}y {patient.gender}</span>
              </div>
              <div>
                <span className="text-slate-400">HLA Alleles:</span>{' '}
                <span className="font-mono text-indigo-300">{patient.hlaAlleles.join(', ')}</span>
              </div>
              <div>
                <span className="text-slate-400">Polygenic PRS:</span>{' '}
                <span className="font-semibold text-purple-300">{patient.polygenicRiskPercentile}th %ile</span>
              </div>
            </div>
          </div>

          {/* Risk Score Gauge & Action */}
          <div className="flex items-center space-x-6 bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
            <div className="text-center">
              <div className="text-xs text-slate-400 font-medium">Quantum Kernel OvR Risk</div>
              <div className="text-3xl font-black font-mono text-rose-400 mt-0.5">
                {(patient.currentRiskScore * 100).toFixed(0)}%
              </div>
              <div className="text-[10px] text-emerald-400 font-mono mt-0.5">15-Qubit ZZ Statevector</div>
            </div>

            <button
              onClick={() => onSimulate(patient)}
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2"
            >
              <Pill className="w-4 h-4" />
              <span>Simulate Intervention</span>
            </button>
          </div>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="flex space-x-2 border-t border-slate-800 mt-6 pt-4 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setSubTab('quantum')}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              subTab === 'quantum'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Atom className="w-3.5 h-3.5" />
            <span>1. Quantum Kernel OvR Differentials</span>
          </button>

          <button
            onClick={() => setSubTab('trajectory')}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              subTab === 'trajectory'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <IconLineChart className="w-3.5 h-3.5" />
            <span>2. Temporal Graph Trajectory</span>
          </button>

          <button
            onClick={() => setSubTab('umap')}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              subTab === 'umap'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Dna className="w-3.5 h-3.5" />
            <span>3. Reference-Free TCR Clones (UMAP)</span>
          </button>

          <button
            onClick={() => setSubTab('causal')}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              subTab === 'causal'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>4. Causal vs Bystander Filter</span>
          </button>

          <button
            onClick={() => setSubTab('shap')}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              subTab === 'shap'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>5. SHAP Attributions</span>
          </button>

          <button
            onClick={() => setSubTab('pathway')}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              subTab === 'pathway'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>6. Minimal Intervention Plan</span>
          </button>
        </div>
      </div>

      {/* Sub-tab 1: Quantum Kernel OvR Differentials & Angle Encoding Radar */}
      {subTab === 'quantum' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Differential Diagnoses Chart */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  Multi-Class Quantum Kernel OvR Probabilities
                </h3>
                <p className="text-xs text-slate-400">
                  Statevector fidelity projection into 15 autoimmune disease support vector classes.
                </p>
              </div>
              <span className="text-xs bg-indigo-950 text-indigo-300 px-2.5 py-1 rounded-lg border border-indigo-800 font-mono">
                15 Classes
              </span>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={quantumProbData} layout="vertical" margin={{ top: 5, right: 30, left: 130, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis type="number" stroke="#94a3b8" domain={[0, 100]} unit="%" fontSize={11} />
                  <YAxis type="category" dataKey="disease" stroke="#94a3b8" width={130} fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  />
                  <Bar dataKey="Probability" name="OvR Probability (%)" radius={[0, 4, 4, 0]}>
                    {quantumProbData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? '#6366f1' : entry.Probability > 10 ? '#a855f7' : '#334155'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800 text-xs text-slate-400">
              <span className="text-indigo-300 font-semibold">Primary Quantum Diagnosis:</span>{' '}
              <strong className="text-slate-100">{patient.quantumPredictions[0].disease}</strong> with{' '}
              <span className="text-emerald-400 font-mono font-bold">
                {(patient.quantumPredictions[0].probability * 100).toFixed(0)}%
              </span>{' '}
              probability and support vector influence score of{' '}
              <span className="font-mono text-slate-200">
                {patient.quantumPredictions[0].supportVectorInfluence.toFixed(2)}
              </span>.
            </div>
          </div>

          {/* 15-Feature Angle Encoding Radar */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  Angle-Encoded Feature Map Profile [0, 2π]
                </h3>
                <p className="text-xs text-slate-400">
                  15 normalized clinical biomarkers mapped onto qubit rotation angles θ_i = Rz(2x_i).
                </p>
              </div>
              <span className="text-xs bg-purple-950 text-purple-300 px-2.5 py-1 rounded-lg border border-purple-800 font-mono">
                15 Qubits
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={angleRadarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="feature" stroke="#94a3b8" fontSize={9} />
                  <PolarRadiusAxis stroke="#475569" angle={30} domain={[0, 100]} fontSize={8} />
                  <Radar name="Angle Rotation (%)" dataKey="AngleVal" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '11px' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800 text-xs text-slate-400">
              <span className="text-purple-300 font-semibold">Qubit Rotation Mapping:</span> Features with highest rotation phase shift drive the multi-body ZZ entanglement Hamiltonian, forming distinct topological clusters in Hilbert space.
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Longitudinal Trajectory Chart */}
      {subTab === 'trajectory' && (
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Temporal Graph-Attention Risk Trajectory
              </h3>
              <p className="text-xs text-slate-400">
                Multi-visit trajectory weighting rising autoantibody trends against functional end-organ reserves.
              </p>
            </div>
            <span className="text-xs bg-indigo-950 text-indigo-300 px-2.5 py-1 rounded-lg border border-indigo-800 font-medium">
              {patient.visits.length} Visit Graph Nodes
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trajectoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" domain={[0, 100]} stroke="#94a3b8" tick={{ fontSize: 12 }} label={{ value: 'Risk & Titres (%)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#94a3b8' }} />
                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" tick={{ fontSize: 12 }} label={{ value: 'Functional Metric', angle: 90, position: 'insideRight', fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                <Line yAxisId="left" type="monotone" dataKey="riskScorePercent" name="Quantum Trajectory Risk (%)" stroke="#f43f5e" strokeWidth={3} dot={{ r: 5 }} />
                <Line yAxisId="left" type="monotone" dataKey="autoantibodyTotal" name="Combined Autoantibody Titres" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                <Line yAxisId="right" type="monotone" dataKey="cPeptideOrMetric" name="Functional Metric" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 4 }} />
                <Line yAxisId="left" type="monotone" dataKey="dysbiosisPercent" name="Gut Dysbiosis Index (%)" stroke="#f59e0b" strokeWidth={1.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300">
            <span className="font-semibold text-slate-100">Temporal Attention Velocity Insight:</span>{' '}
            Graph attention weights indicate significant non-linear acceleration between visit{' '}
            <span className="font-mono text-indigo-300">{patient.visits[patient.visits.length - 2]?.visitDate}</span> and{' '}
            <span className="font-mono text-indigo-300">{patient.visits[patient.visits.length - 1]?.visitDate}</span>, marking transition from asymptomatic Stage 1 to Stage 2 pre-clinical status.
          </div>
        </div>
      )}

      {/* Sub-tab 3: Reference-Free Immune Repertoire UMAP */}
      {subTab === 'umap' && (
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Reference-Free CDR3 Repertoire Clustering (UMAP Space)
              </h3>
              <p className="text-xs text-slate-400">
                TCR sequences embedded with protein-language transformer (ESM-2 derivative), projected via UMAP & clustered with HDBSCAN.
              </p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="text-slate-300">Reference-Free Autoreactive</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-indigo-500" />
                <span className="text-slate-300">Known Epitope</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis type="number" dataKey="x" name="UMAP Dim 1" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis type="number" dataKey="y" name="UMAP Dim 2" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <ZAxis type="number" dataKey="enrichment" range={[60, 200]} name="Enrichment" />
                <Tooltip
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-950 text-white p-3 rounded-xl border border-slate-800 text-xs space-y-1 shadow-xl">
                          <p className="font-bold text-indigo-300">{data.clusterName}</p>
                          <p className="font-mono text-[11px] text-slate-300">CDR3: {data.sequence}</p>
                          <p className="text-slate-400">Target: {data.epitope}</p>
                          <p className="text-amber-400">Enrichment: {data.enrichment}x vs controls</p>
                          <p className="text-[10px] italic text-slate-400">
                            {data.isReferenceCatalogued ? 'Catalogued in IEDB' : 'Reference-Free Novel Cluster'}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter data={umapData}>
                  {umapData.map((entry, index) => {
                    let fillColor = '#10b981';
                    if (entry.isAutoreactive) {
                      fillColor = entry.isReferenceCatalogued ? '#6366f1' : '#f43f5e';
                    }
                    return <Cell key={`cell-${index}`} fill={fillColor} />;
                  })}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {patient.immuneRepertoireClusters.map((cl) => (
              <div
                key={cl.id}
                className="p-4 rounded-xl border bg-slate-950 border-slate-800 text-xs flex items-start justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-100">{cl.clusterName}</span>
                    {!cl.isReferenceCatalogued && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-950 text-rose-300 border border-rose-800 font-semibold">
                        Reference-Free Signal
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-[11px] text-indigo-400">{cl.sequence}</p>
                  <p className="text-slate-400 text-[11px]">{cl.knownTargetEpitope}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-rose-400 text-sm font-mono">{cl.enrichmentScoreVsControl}x</span>
                  <span className="block text-[10px] text-slate-500">Enriched vs Controls</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab 4: Causal vs Bystander Biomarker Filter */}
      {subTab === 'causal' && (
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-md space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Causal-Inference Layer (Mendelian Randomization & Doubly-Robust Estimation)
            </h3>
            <p className="text-xs text-slate-400">
              Separates true etiologic drivers from bystander inflammatory noise (e.g. post-viral spikes) to prevent false therapeutic escalation.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {patient.biomarkerEvaluations.map((evalItem, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs ${
                  evalItem.isCausalDriver
                    ? 'bg-rose-950/20 border-rose-800/80'
                    : 'bg-emerald-950/20 border-emerald-800/80'
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2">
                    {evalItem.isCausalDriver ? (
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                    <span className="font-bold text-sm text-slate-100">
                      {evalItem.biomarkerName}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-medium">
                      {evalItem.category}
                    </span>
                  </div>

                  <p className="text-slate-300">{evalItem.explanation}</p>
                </div>

                <div className="flex items-center space-x-6 text-right border-t md:border-t-0 md:border-l border-slate-800 pt-2 md:pt-0 md:pl-6">
                  <div>
                    <span className="text-[10px] text-slate-400 block">MR P-Value</span>
                    <span className="font-mono font-bold text-slate-200">
                      {evalItem.mendelianRandomizationPValue.toFixed(5)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">Doubly-Robust Effect</span>
                    <span className="font-mono font-bold text-slate-200">
                      {evalItem.doublyRobustEffectSize.toFixed(2)}
                    </span>
                  </div>

                  <div>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${
                        evalItem.isCausalDriver
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {evalItem.isCausalDriver ? 'Causal Driver' : 'Bystander Noise'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab 5: SHAP Attributions */}
      {subTab === 'shap' && (
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-md space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-100">
              SHAP Feature Attribution (Explainable Risk Decomposition)
            </h3>
            <p className="text-xs text-slate-400">
              Quantifies how each biomarker and genetic feature contributed to the {(patient.currentRiskScore * 100).toFixed(0)}% pre-clinical risk score.
            </p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shapData} layout="vertical" margin={{ top: 5, right: 30, left: 160, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 11 }} domain={[-0.2, 0.5]} />
                <YAxis type="category" dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} width={160} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} />
                <Bar dataKey="value" name="SHAP Contribution">
                  {shapData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#f43f5e' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {patient.shapAttributions.map((s, idx) => (
              <div key={idx} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100">{s.featureName}</span>
                  <span className={`font-mono font-bold ${s.shapValue > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {s.shapValue > 0 ? `+${s.shapValue.toFixed(2)}` : s.shapValue.toFixed(2)}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab 6: Minimal Intervention Plan */}
      {subTab === 'pathway' && (
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                Actionable Clinical Recommendation
              </span>
              <h3 className="text-xl font-bold text-slate-100 mt-1">
                Tiered Minimal-Intervention Plan: {patient.interventionPlan.tier}
              </h3>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-950 text-rose-300 border border-rose-800">
              {patient.diseaseType} Protocol
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trigger Rationale</span>
                <p className="text-xs text-slate-200 font-medium">
                  {patient.interventionPlan.triggerDescription}
                </p>
              </div>

              <div className="bg-indigo-950/40 p-4 rounded-xl border border-indigo-800/60 space-y-2">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  Recommended Primary Action
                </span>
                <p className="text-sm font-semibold text-indigo-200">
                  {patient.interventionPlan.recommendedAction}
                </p>
              </div>

              {patient.interventionPlan.therapeutics && (
                <div className="bg-rose-950/40 p-4 rounded-xl border border-rose-800/80 space-y-3">
                  <div className="flex items-center space-x-2 text-rose-300 font-bold text-sm">
                    <Pill className="w-4 h-4 text-rose-400" />
                    <span>Targeted Pre-Clinical Therapeutic Protocol</span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div>
                      <span className="text-slate-400">Therapy / Class:</span>{' '}
                      <span className="font-bold text-slate-100">
                        {patient.interventionPlan.therapeutics.drugName} ({patient.interventionPlan.therapeutics.class})
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400">Regulatory Status:</span>{' '}
                      <span className="font-medium text-amber-300">
                        {patient.interventionPlan.therapeutics.approvalStatus}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400">Dosage Regimen:</span>{' '}
                      <span className="font-mono text-slate-200">
                        {patient.interventionPlan.therapeutics.dosageProtocol}
                      </span>
                    </div>

                    <div className="pt-1 flex items-center space-x-1.5 text-emerald-400 font-bold">
                      <Clock className="w-4 h-4" />
                      <span>
                        Projected Delay to Clinical Stage 3: +{patient.interventionPlan.therapeutics.expectedDelayMonths} Months (~{(patient.interventionPlan.therapeutics.expectedDelayMonths / 12).toFixed(1)} Years)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider block">Monitoring Cadence</span>
                <p className="text-slate-200">{patient.interventionPlan.monitoringCadence}</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider block">Lifestyle & Microbiome Support</span>
                <p className="text-slate-200">{patient.interventionPlan.lifestyleMicrobiomeGuidance}</p>
              </div>

              <div className="bg-amber-950/40 p-4 rounded-xl border border-amber-800/60 text-xs text-amber-200 flex items-start space-x-3">
                <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-1">Clinician Discretion & SaMD Safety Notice</span>
                  <p>{patient.interventionPlan.clinicianDiscretionNotice}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
