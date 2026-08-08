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
import { Sliders, Clock, Sparkles, Pill, AlertCircle, ArrowRight } from 'lucide-react';

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
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Minimal-Intervention Trajectory Simulator
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Model disease-delay impacts before Stage 3 clinical onset. Grounded in FDA-approved Teplizumab (Tzield) Stage 2 T1D trial precedents.
            </p>
          </div>

          {/* Patient Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-slate-500">Subject:</span>
            <select
              value={patient.id}
              onChange={(e) => {
                const found = patients.find((p) => p.id === e.target.value);
                if (found) {
                  setPatient(found);
                  onSelectPatient(found);
                }
              }}
              className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 font-bold text-slate-900 dark:text-slate-100 focus:outline-none"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              1. Select Intervention
            </label>
            <select
              value={interventionType}
              onChange={(e) => setInterventionType(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="teplizumab_tzield">Teplizumab (Tzield) Anti-CD3 Monoclonal Infusion</option>
              <option value="low_dose_dmard">Low-Dose Targeted DMARD Regimen</option>
              <option value="lifestyle_microbiome">Tolerogenic Prebiotic & SCFA Dietary Protocol</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              2. Dosage / Regimen Intensity
            </label>
            <div className="flex space-x-2 pt-1">
              {['standard', 'high'].map((intensity) => (
                <button
                  key={intensity}
                  onClick={() => setDosageIntensity(intensity)}
                  className={`flex-1 py-2 text-xs rounded-lg font-bold border transition-all ${
                    dosageIntensity === intensity
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {intensity === 'standard' ? 'Standard Protocol' : 'High Intensity Protocol'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              3. Execution Status
            </label>
            <button
              onClick={runSimulation}
              disabled={isLoading}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs rounded-lg shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? 'Computing Trajectory...' : 'Re-Run Trajectory Model'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Simulation Results Display */}
      {simulationResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Trajectory Projection Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Projected 24-Month Trajectory Comparison
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Baseline (No Intervention) vs Post-{simulationResult.interventionApplied}
                </p>
              </div>

              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <Clock className="w-4 h-4" />
                <span>+ {simulationResult.estimatedStage3DelayMonths} Months Delayed Stage 3 Onset</span>
              </div>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={simulationResult.projectedTrajectory}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="visitDate" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 1]} tick={{ fontSize: 12 }} label={{ value: 'Risk Score (0 to 1)', angle: -90, position: 'insideLeft', fontSize: 10 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="baselineRisk" name="Baseline Natural Progression" stroke="#f43f5e" strokeWidth={3} dot={{ r: 5 }} />
                  <Line type="monotone" dataKey="projectedRiskWithIntervention" name="Projected Post-Intervention" stroke="#10b981" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Outcome Summary Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm border-b border-slate-200 dark:border-slate-800 pb-3">
                <Pill className="w-4 h-4" />
                <span>Simulation Outcome Summary</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <span className="text-slate-500">Baseline Risk Score:</span>
                  <span className="font-bold text-rose-600 font-mono text-sm">
                    {(simulationResult.baselineRiskScore * 100).toFixed(0)}%
                  </span>
                </div>

                <div className="flex justify-between items-center p-2.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <span className="text-emerald-800 dark:text-emerald-300 font-medium">Projected 24m Risk:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-base">
                    {(simulationResult.projectedRiskScore24Months * 100).toFixed(0)}%
                  </span>
                </div>

                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg border border-indigo-200 dark:border-indigo-800 space-y-1">
                  <span className="font-bold text-indigo-900 dark:text-indigo-200 block">Clinical Rationale:</span>
                  <p className="text-slate-700 dark:text-slate-300 text-[11px]">
                    {simulationResult.clinicalRationale}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Trialnet & FDA Tzield precedent: Preserving functional beta-cell AUC or target tissue architecture at Stage 2 yields multi-year symptom-free survival.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
