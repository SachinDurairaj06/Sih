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
  HelpCircle,
  Clock,
  ChevronRight,
} from 'lucide-react';

interface PatientInspectorProps {
  patient: Patient;
  onSimulate: (patient: Patient) => void;
}

export const PatientInspector: React.FC<PatientInspectorProps> = ({ patient, onSimulate }) => {
  const [subTab, setSubTab] = useState<'trajectory' | 'umap' | 'causal' | 'shap' | 'pathway'>('trajectory');

  // Format longitudinal visits for Recharts
  const trajectoryData = patient.visits.map((v) => {
    // Extract autoantibodies as individual keys or combined
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

  return (
    <div className="space-y-6">
      {/* Patient Header Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold tracking-tight">{patient.name}</h2>
              <span className="text-xs font-mono px-2.5 py-1 bg-slate-800 rounded border border-slate-700 text-slate-300">
                {patient.id}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-rose-950/80 text-rose-300 border border-rose-800">
                {patient.currentTier}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <div>
                <span className="text-slate-400">Disease:</span>{' '}
                <span className="font-semibold text-white">{patient.diseaseType}</span>
              </div>
              <div>
                <span className="text-slate-400">Current Stage:</span>{' '}
                <span className="font-semibold text-amber-300">{patient.stage}</span>
              </div>
              <div>
                <span className="text-slate-400">Age/Gender:</span>{' '}
                <span className="font-semibold text-white">{patient.age} y/o {patient.gender}</span>
              </div>
              <div>
                <span className="text-slate-400">HLA Alleles:</span>{' '}
                <span className="font-mono text-indigo-300">{patient.hlaAlleles.join(', ')}</span>
              </div>
              <div>
                <span className="text-slate-400">PRS Rank:</span>{' '}
                <span className="font-semibold text-purple-300">{patient.polygenicRiskPercentile}th Percentile</span>
              </div>
            </div>
          </div>

          {/* Risk Score Gauge & Action */}
          <div className="flex items-center space-x-6 bg-slate-800/80 p-4 rounded-xl border border-slate-700/80">
            <div className="text-center">
              <div className="text-xs text-slate-400 font-medium">AIRT-Net Trajectory Risk</div>
              <div className="text-3xl font-black font-mono text-rose-400 mt-0.5">
                {(patient.currentRiskScore * 100).toFixed(0)}%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Continuous Multi-Omic Estimate</div>
            </div>

            <button
              onClick={() => onSimulate(patient)}
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs rounded-lg shadow-md transition-all flex items-center space-x-2"
            >
              <Pill className="w-4 h-4" />
              <span>Simulate Intervention</span>
            </button>
          </div>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="flex space-x-2 border-t border-slate-800 mt-6 pt-4 overflow-x-auto">
          <button
            onClick={() => setSubTab('trajectory')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
              subTab === 'trajectory'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <IconLineChart className="w-3.5 h-3.5" />
            <span>1. Temporal Trajectory (Graph-Attention)</span>
          </button>

          <button
            onClick={() => setSubTab('umap')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
              subTab === 'umap'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Dna className="w-3.5 h-3.5" />
            <span>2. Reference-Free Repertoire Clusters (UMAP)</span>
          </button>

          <button
            onClick={() => setSubTab('causal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
              subTab === 'causal'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>3. Causal vs Bystander Filter</span>
          </button>

          <button
            onClick={() => setSubTab('shap')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
              subTab === 'shap'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>4. SHAP Explainability</span>
          </button>

          <button
            onClick={() => setSubTab('pathway')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
              subTab === 'pathway'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>5. Minimal Intervention Protocol</span>
          </button>
        </div>
      </div>

      {/* Sub-tab 1: Longitudinal Trajectory Chart */}
      {subTab === 'trajectory' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Temporal Graph-Attention Risk Trajectory
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Multi-visit trajectory weighting rising autoantibody trends against functional C-peptide / organ markers.
              </p>
            </div>
            <span className="text-xs bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 px-2.5 py-1 rounded font-medium border border-indigo-200 dark:border-indigo-800">
              {patient.visits.length} Visit Graph Nodes
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trajectoryData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" domain={[0, 100]} tick={{ fontSize: 12 }} label={{ value: 'Risk & Titres (%)', angle: -90, position: 'insideLeft', fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} label={{ value: 'Functional Metric', angle: 90, position: 'insideRight', fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line yAxisId="left" type="monotone" dataKey="riskScorePercent" name="AIRT-Net Trajectory Risk (%)" stroke="#e11d48" strokeWidth={3} dot={{ r: 5 }} />
                <Line yAxisId="left" type="monotone" dataKey="autoantibodyTotal" name="Combined Autoantibody Titres" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                <Line yAxisId="right" type="monotone" dataKey="cPeptideOrMetric" name="C-Peptide / Functional Metric" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 4 }} />
                <Line yAxisId="left" type="monotone" dataKey="dysbiosisPercent" name="Gut Dysbiosis Index (%)" stroke="#f59e0b" strokeWidth={1.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
            <span className="font-semibold text-slate-900 dark:text-slate-100">Temporal Attention Insight:</span>{' '}
            Graph attention weights show that the sharp velocity increase between visit{' '}
            <span className="font-mono">{patient.visits[patient.visits.length - 2]?.visitDate}</span> and{' '}
            <span className="font-mono">{patient.visits[patient.visits.length - 1]?.visitDate}</span> was driven by the co-acceleration of autoantibody titres with a falling functional metric, pushing patient into Stage 2 pre-clinical status.
          </div>
        </div>
      )}

      {/* Sub-tab 2: Reference-Free Immune Repertoire UMAP */}
      {subTab === 'umap' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Reference-Free CDR3 Repertoire Clustering (UMAP Space)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                TCR/BCR sequences embedded with protein-language transformer (ESM-2 derivative), projected via UMAP & clustered with HDBSCAN. Red points represent uncatalogued autoreactive clusters.
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="inline-block w-3 h-3 rounded-full bg-rose-500"></span>
              <span className="text-slate-600 dark:text-slate-300">Uncatalogued Autoreactive</span>
              <span className="inline-block w-3 h-3 rounded-full bg-indigo-500 ml-2"></span>
              <span className="text-slate-600 dark:text-slate-300">Known Epitope</span>
              <span className="inline-block w-3 h-3 rounded-full bg-emerald-500 ml-2"></span>
              <span className="text-slate-600 dark:text-slate-300">Tolerogenic</span>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis type="number" dataKey="x" name="UMAP Dim 1" tick={{ fontSize: 11 }} />
                <YAxis type="number" dataKey="y" name="UMAP Dim 2" tick={{ fontSize: 11 }} />
                <ZAxis type="number" dataKey="enrichment" range={[60, 200]} name="Enrichment" />
                <Tooltip
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-lg border border-slate-700 text-xs space-y-1 shadow-xl">
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
                    let fillColor = '#10b981'; // Green = tolerogenic
                    if (entry.isAutoreactive) {
                      fillColor = entry.isReferenceCatalogued ? '#6366f1' : '#f43f5e'; // Red = novel reference-free!
                    }
                    return <Cell key={`cell-${index}`} fill={fillColor} />;
                  })}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* List of Detected Repertoire Clusters */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Detected Immune Repertoire CDR3 Clones</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {patient.immuneRepertoireClusters.map((cl) => (
                <div
                  key={cl.id}
                  className={`p-3 rounded-lg border text-xs flex items-start justify-between ${
                    cl.isAutoreactiveCluster && !cl.isReferenceCatalogued
                      ? 'bg-rose-50/50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{cl.clusterName}</span>
                      {!cl.isReferenceCatalogued && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 font-semibold">
                          Reference-Free Signal
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400">{cl.sequence}</p>
                    <p className="text-slate-500 text-[11px]">{cl.knownTargetEpitope}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-rose-600 dark:text-rose-400 text-sm">
                      {cl.enrichmentScoreVsControl}x
                    </span>
                    <span className="block text-[10px] text-slate-400">Enriched vs Controls</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 3: Causal vs Bystander Biomarker Filter */}
      {subTab === 'causal' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Causal-Inference Layer (Mendelian Randomization & Doubly-Robust Estimation)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              AIRT-Net separates true causal drivers from bystander inflammatory signals (e.g., transient viral cytokine spikes) to prevent false-positive therapeutic escalation.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {patient.biomarkerEvaluations.map((evalItem, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs ${
                  evalItem.isCausalDriver
                    ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800'
                    : 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2">
                    {evalItem.isCausalDriver ? (
                      <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    )}
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {evalItem.biomarkerName}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                      {evalItem.category}
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300">{evalItem.explanation}</p>
                </div>

                <div className="flex items-center space-x-6 text-right border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 pt-2 md:pt-0 md:pl-6">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Mendelian Rand P-Value</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {evalItem.mendelianRandomizationPValue.toFixed(5)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">Doubly-Robust Effect</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {evalItem.doublyRobustEffectSize.toFixed(2)}
                    </span>
                  </div>

                  <div>
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                        evalItem.isCausalDriver
                          ? 'bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-100'
                          : 'bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100'
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

      {/* Sub-tab 4: SHAP Explainability Breakdown */}
      {subTab === 'shap' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              SHAP Feature Attribution (Explainable Risk Decomposition)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Quantifying how each individual biomarker, repertoire cluster, and genetic factor contributed to the patient's continuous risk trajectory score of {(patient.currentRiskScore * 100).toFixed(0)}%.
            </p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shapData} layout="vertical" margin={{ top: 5, right: 30, left: 140, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis type="number" tick={{ fontSize: 11 }} domain={[-0.2, 0.4]} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={140} />
                <Tooltip />
                <Bar dataKey="value" name="SHAP Contribution">
                  {shapData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#f43f5e' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Feature Descriptions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {patient.shapAttributions.map((s, idx) => (
                <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{s.featureName}</span>
                    <span className={`font-mono font-bold ${s.shapValue > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {s.shapValue > 0 ? `+${s.shapValue.toFixed(2)}` : s.shapValue.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 5: Minimal Intervention Protocol */}
      {subTab === 'pathway' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Actionable Clinical Recommendation
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                Tiered Minimal-Intervention Plan: {patient.interventionPlan.tier}
              </h3>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
              {patient.diseaseType} Protocol
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Trigger Rationale</span>
                <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                  {patient.interventionPlan.triggerDescription}
                </p>
              </div>

              <div className="bg-indigo-50/80 dark:bg-indigo-950/40 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800 space-y-2">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Recommended Primary Action
                </span>
                <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">
                  {patient.interventionPlan.recommendedAction}
                </p>
              </div>

              {patient.interventionPlan.therapeutics && (
                <div className="bg-rose-50/80 dark:bg-rose-950/40 p-4 rounded-xl border border-rose-200 dark:border-rose-800 space-y-3">
                  <div className="flex items-center space-x-2 text-rose-800 dark:text-rose-300 font-bold text-sm">
                    <Pill className="w-4 h-4 text-rose-600" />
                    <span>Targeted Pre-Clinical Therapeutic Protocol</span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Therapy / Class:</span>{' '}
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {patient.interventionPlan.therapeutics.drugName} ({patient.interventionPlan.therapeutics.class})
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Regulatory Status:</span>{' '}
                      <span className="font-medium text-amber-700 dark:text-amber-300">
                        {patient.interventionPlan.therapeutics.approvalStatus}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Dosage Regimen:</span>{' '}
                      <span className="font-mono text-slate-800 dark:text-slate-200">
                        {patient.interventionPlan.therapeutics.dosageProtocol}
                      </span>
                    </div>

                    <div className="pt-1 flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
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
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <span className="font-bold text-slate-500 uppercase tracking-wider block">Monitoring Cadence</span>
                <p className="text-slate-800 dark:text-slate-200">{patient.interventionPlan.monitoringCadence}</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <span className="font-bold text-slate-500 uppercase tracking-wider block">Lifestyle & Microbiome Support</span>
                <p className="text-slate-800 dark:text-slate-200">{patient.interventionPlan.lifestyleMicrobiomeGuidance}</p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start space-x-3">
                <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
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
