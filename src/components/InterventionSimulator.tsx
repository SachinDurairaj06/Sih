import React, { useState, useEffect } from 'react';
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
} from 'recharts';
import { Sliders, Clock, Sparkles, Pill, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface InterventionSimulatorProps {
  patients: Patient[];
  selectedPatient: Patient | null;
  onSelectPatient: (patient: Patient) => void;
}

export const InterventionSimulator: React.FC<InterventionSimulatorProps> = ({
  patients,
  selectedPatient,
  onSelectPatient,
}) => {
  const [patient, setPatient] = useState<Patient>(selectedPatient || patients[0]);
  const [interventionType, setInterventionType] = useState<string>('teplizumab_tzield');
  const [dosageIntensity, setDosageIntensity] = useState<string>('standard');
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (selectedPatient) {
      setPatient(selectedPatient);
    }
  }, [selectedPatient]);

  const runSimulation = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/airt-net/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: patient.id,
          interventionType,
          dosageIntensity,
        }),
      });
      const data = await res.json();
      setSimulationResult(data);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [patient, interventionType, dosageIntensity]);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-bold text-slate-100">
                Minimal-Intervention Trajectory Simulator
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Simulate disease-delay windows before Stage 3 clinical conversion across 15 autoimmune disease profiles.
            </p>
          </div>

          {/* Patient Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-slate-400">Subject:</span>
            <select
              value={patient.id}
              onChange={(e) => {
                const found = patients.find((p) => p.id === e.target.value);
                if (found) {
                  setPatient(found);
                  onSelectPatient(found);
                }
              }}
              className="text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 font-bold text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.diseaseType} - {p.stage})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Simulator Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              1. Select Targeted Intervention
            </label>
            <select
              value={interventionType}
              onChange={(e) => setInterventionType(e.target.value)}
              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl p-3 font-medium text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="teplizumab_tzield">Teplizumab (Tzield) Anti-CD3 Monoclonal Infusion</option>
              <option value="low_dose_dmard">Low-Dose Targeted DMARD / Biologic (Abatacept / Anti-IL17)</option>
              <option value="fcrn_blocker">Efgartigimod (Vyvgart) FcRn IgG Depletion</option>
              <option value="lifestyle_microbiome">Tolerogenic Prebiotic & SCFA Dietary Protocol</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              2. Dosage / Regimen Intensity
            </label>
            <div className="flex space-x-2 pt-1">
              {['standard', 'high'].map((intensity) => (
                <button
                  key={intensity}
                  onClick={() => setDosageIntensity(intensity)}
                  className={`flex-1 py-2.5 text-xs rounded-xl font-bold border transition-all ${
                    dosageIntensity === intensity
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {intensity === 'standard' ? 'Standard Protocol' : 'High-Intensity Protocol'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              3. Baseline Subject State
            </label>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-100">{patient.name}</span>
                <span className="block text-[11px] text-slate-400">{patient.diseaseType}</span>
              </div>
              <span className="font-mono font-bold text-rose-400 text-sm">
                {(patient.currentRiskScore * 100).toFixed(0)}% Baseline
              </span>
            </div>
          </div>
        </div>

        {/* Simulation Output Cards */}
        {simulationResult && (
          <div className="space-y-6 pt-4 border-t border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-medium">Projected 24-Month Risk</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-black font-mono text-emerald-400">
                    {(simulationResult.projectedRiskScore24Months * 100).toFixed(0)}%
                  </span>
                  <span className="text-xs text-slate-500 line-through">
                    {(simulationResult.baselineRiskScore * 100).toFixed(0)}%
                  </span>
                </div>
                <span className="text-[11px] text-emerald-500 font-semibold">
                  -
                  {Math.round(
                    (simulationResult.baselineRiskScore - simulationResult.projectedRiskScore24Months) * 100
                  )}
                  % Absolute Risk Reduction
                </span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-medium">Estimated Clinical Stage 3 Delay</span>
                <div className="text-2xl font-black font-mono text-indigo-400 flex items-center space-x-1.5">
                  <Clock className="w-5 h-5 text-indigo-400" />
                  <span>+{simulationResult.estimatedStage3DelayMonths} Months</span>
                </div>
                <span className="text-[11px] text-indigo-300 font-medium">
                  ~{(simulationResult.estimatedStage3DelayMonths / 12).toFixed(1)} Years Sparing Active Symptoms
                </span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-medium">Intervention Applied</span>
                <div className="text-sm font-bold text-slate-100 truncate mt-1">
                  {simulationResult.interventionApplied}
                </div>
                <span className="text-[11px] text-slate-400">Grounded in clinical trial endpoints</span>
              </div>
            </div>

            {/* Projected Trajectory Chart */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-100">
                  Projected Trajectory Curve: Natural Progression vs Minimal Intervention
                </h3>
                <div className="flex items-center space-x-4 text-xs font-medium">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-1 bg-rose-500 rounded" />
                    <span className="text-slate-400">Natural Trajectory</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-1 bg-emerald-400 rounded" />
                    <span className="text-slate-200">With Minimal Intervention</span>
                  </div>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={simulationResult.projectedTrajectory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="visitDate" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#94a3b8" domain={[0, 1.0]} tick={{ fontSize: 11 }} tickFormatter={(v) => `${Math.round(v * 100)}%`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                      formatter={(v: any) => [`${Math.round(Number(v) * 100)}%`]}
                    />
                    <Line type="monotone" dataKey="baselineRisk" name="Natural Progression Risk" stroke="#f43f5e" strokeWidth={2.5} strokeDasharray="4 4" dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="projectedRiskWithIntervention" name="With Targeted Minimal Intervention" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300">
                <span className="font-semibold text-slate-100">Clinical Rationale:</span> {simulationResult.clinicalRationale}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
