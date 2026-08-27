import React, { useState } from 'react';
import { AutoimmuneDisease, AIRTNetAnalysisResponse, PatientClinicalFeatures } from '../types';
import {
  Cpu,
  Dna,
  Sparkles,
  AlertCircle,
  Play,
  CheckCircle2,
  Atom,
  Layers,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { AUTOIMMUNE_DISEASES_CATALOG, predictQuantumKernelOvR, extract15FeatureVector } from '../data/quantumEngine';

export const PipelineExecutor: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'quantum_ml' | 'gemini_multiomic'>('quantum_ml');

  // Quantum Features State (6 Groups)
  const [age, setAge] = useState<number>(34);
  const [sex, setSex] = useState<'Female' | 'Male'>('Female');
  const [bmi, setBmi] = useState<number>(23.8);

  const [crp, setCrp] = useState<number>(6.2);
  const [esr, setEsr] = useState<number>(28);

  const [anaTitre, setAnaTitre] = useState<number>(160);
  const [rfTitre, setRfTitre] = useState<number>(45);
  const [antiCcp, setAntiCcp] = useState<number>(85);
  const [antiDsDna, setAntiDsDna] = useState<number>(12);
  const [antiTpo, setAntiTpo] = useState<number>(5);
  const [antiTg, setAntiTg] = useState<number>(0);
  const [antiTtg, setAntiTtg] = useState<number>(2);
  const [antiAchR, setAntiAchR] = useState<number>(0);

  const [tsh, setTsh] = useState<number>(2.1);
  const [freeT4, setFreeT4] = useState<number>(1.2);
  const [fastingGlucose, setFastingGlucose] = useState<number>(92);
  const [hbA1c, setHbA1c] = useState<number>(5.4);
  const [alt, setAlt] = useState<number>(22);
  const [ast, setAst] = useState<number>(20);
  const [c3, setC3] = useState<number>(1.1);
  const [c4, setC4] = useState<number>(0.24);

  const [jointPainScore, setJointPainScore] = useState<number>(6);
  const [fatigueScore, setFatigueScore] = useState<number>(7);
  const [skinLesionScore, setSkinLesionScore] = useState<number>(1);
  const [giSymptomScore, setGiSymptomScore] = useState<number>(0);
  const [muscleWeaknessScore, setMuscleWeaknessScore] = useState<number>(1);

  const [hlaB27, setHlaB27] = useState<boolean>(false);
  const [hlaDR4, setHlaDR4] = useState<boolean>(true);
  const [hlaDR3DQ2, setHlaDR3DQ2] = useState<boolean>(false);

  // Quantum ML Results
  const [quantumResult, setQuantumResult] = useState<any>(null);
  const [isQuantumRunning, setIsQuantumRunning] = useState<boolean>(false);

  // Gemini State
  const [diseaseType, setDiseaseType] = useState<AutoimmuneDisease>('Rheumatoid Arthritis');
  const [autoantibodiesText, setAutoantibodiesText] = useState<string>('antiCCP: 85, RF: 45');
  const [cdr3Text, setCdr3Text] = useState<string>('CASSQERGNEKLFF, CASSLAPGASYEQYF, CASSLDSNQPQHF');
  const [cytokinesText, setCytokinesText] = useState<string>('IL6: 18.2, TNFa: 14.5, IFNg: 12.0');
  const [microbiomeDysbiosis, setMicrobiomeDysbiosis] = useState<number>(0.72);
  const [recentViralEvent, setRecentViralEvent] = useState<boolean>(false);

  const [isGeminiRunning, setIsGeminiRunning] = useState<boolean>(false);
  const [geminiResult, setGeminiResult] = useState<AIRTNetAnalysisResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load Presets across 15 diseases
  const loadPresetDisease = (diseaseId: number) => {
    const disease = AUTOIMMUNE_DISEASES_CATALOG.find((d) => d.id === diseaseId);
    if (!disease) return;

    if (disease.name === 'Rheumatoid Arthritis') {
      setAge(42); setBmi(24.5); setCrp(8.5); setEsr(34);
      setAnaTitre(160); setRfTitre(68); setAntiCcp(95); setAntiDsDna(10);
      setAntiTpo(0); setAntiTg(0); setAntiTtg(0); setAntiAchR(0);
      setJointPainScore(8); setFatigueScore(7); setHlaDR4(true); setHlaB27(false);
    } else if (disease.name === 'Systemic Lupus Erythematosus') {
      setAge(26); setBmi(21.2); setCrp(14.0); setEsr(48);
      setAnaTitre(640); setRfTitre(15); setAntiCcp(5); setAntiDsDna(120);
      setC3(0.65); setC4(0.09); setJointPainScore(6); setFatigueScore(9); setSkinLesionScore(8);
      setHlaDR3DQ2(true);
    } else if (disease.name === 'Type 1 Diabetes') {
      setAge(11); setBmi(17.8); setCrp(2.1); setEsr(12);
      setFastingGlucose(138); setHbA1c(6.4); setAntiCcp(0); setAnaTitre(0);
      setFatigueScore(6); setHlaDR4(true); setHlaDR3DQ2(true);
    } else if (disease.name === 'Multiple Sclerosis') {
      setAge(29); setBmi(22.0); setCrp(3.5); setEsr(18);
      setFatigueScore(8); setMuscleWeaknessScore(7); setHlaDR4(false);
    } else if (disease.name === 'Myasthenia Gravis') {
      setAge(38); setBmi(23.0); setCrp(2.8); setEsr(15);
      setAntiAchR(18.5); setMuscleWeaknessScore(9); setFatigueScore(8);
    } else if (disease.name === 'Celiac Disease') {
      setAge(24); setBmi(19.5); setCrp(4.2); setEsr(20);
      setAntiTtg(88); setGiSymptomScore(8); setFatigueScore(6); setHlaDR3DQ2(true);
    }
  };

  const handleRunQuantumML = () => {
    setIsQuantumRunning(true);
    setErrorMsg(null);

    const clinical: PatientClinicalFeatures = {
      age,
      sex,
      bmi,
      crp,
      esr,
      ana: anaTitre,
      rf: rfTitre,
      antiCcp,
      antiDsDna,
      antiTpo,
      antiTg,
      antiTtg,
      antiAchR,
      tsh,
      freeT4,
      fastingGlucose,
      hba1c: hbA1c,
      alt,
      ast,
      complementC3: c3,
      complementC4: c4,
      jointPainScore,
      fatigueScore,
      skinLesionScore,
      giSymptomScore,
      muscleWeaknessScore,
      hlaB27,
      hlaDr4: hlaDR4,
      hlaDr3Dq2: hlaDR3DQ2,
    };

    setTimeout(() => {
      const predictions = predictQuantumKernelOvR(clinical);
      const angles = extract15FeatureVector(clinical);
      setQuantumResult({
        topPrediction: predictions[0],
        allPredictions: predictions,
        angles,
      });
      setIsQuantumRunning(false);
    }, 450);
  };

  const handleRunGemini = async () => {
    setIsGeminiRunning(true);
    setErrorMsg(null);
    setGeminiResult(null);

    const autoantibodyTitres: Record<string, number> = {};
    autoantibodiesText.split(',').forEach((pair) => {
      const [k, v] = pair.split(':');
      if (k && v) autoantibodyTitres[k.trim()] = parseFloat(v.trim()) || 0;
    });

    const cytokinePanel: Record<string, number> = {};
    cytokinesText.split(',').forEach((pair) => {
      const [k, v] = pair.split(':');
      if (k && v) cytokinePanel[k.trim()] = parseFloat(v.trim()) || 0;
    });

    const cdr3Sequences = cdr3Text.split(',').map((s) => s.trim()).filter(Boolean);

    try {
      const res = await fetch('/api/airt-net/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diseaseType,
          age,
          autoantibodyTitres,
          cdr3Sequences,
          cytokinePanel,
          microbiomeDysbiosis,
          recentViralEvent,
        }),
      });

      if (!res.ok) throw new Error(`Server returned status ${res.status}`);
      const data: AIRTNetAnalysisResponse = await res.json();
      setGeminiResult(data);
    } catch (err: any) {
      console.error('AIRT-Net pipeline error:', err);
      setErrorMsg(err.message || 'Failed to execute AIRT-Net Gemini analysis pipeline.');
    } finally {
      setIsGeminiRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Atom className="w-6 h-6 text-indigo-400 animate-pulse" />
              <h2 className="text-xl font-bold text-slate-100">
                Quantum ML & Multi-Omic AI Execution Testbench
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Multi-class Quantum Kernel SVM (15-Qubit ZZFeatureMap) combined with SaMD Gemini causal inference.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveMode('quantum_ml')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeMode === 'quantum_ml'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Atom className="w-3.5 h-3.5" />
              <span>Quantum Kernel SVM (15 Classes)</span>
            </button>
            <button
              onClick={() => setActiveMode('gemini_multiomic')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeMode === 'gemini_multiomic'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini Causal Engine</span>
            </button>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
          <span className="text-xs font-mono text-slate-500">Quick Test Profiles:</span>
          {AUTOIMMUNE_DISEASES_CATALOG.slice(0, 6).map((d) => (
            <button
              key={d.id}
              onClick={() => loadPresetDisease(d.id)}
              className="px-2.5 py-1 text-xs bg-slate-800/80 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-700 font-medium transition-colors"
            >
              {d.name.split('(')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Quantum ML Testbench */}
      {activeMode === 'quantum_ml' && (
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>15 Clinical Feature Vector Input [6 Feature Groups]</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              {/* Group 1: Demographics & Inflammation */}
              <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="font-bold text-indigo-300 block">1. Demographics & Inflammation</span>
                <div>
                  <label className="text-slate-400 block mb-1">Age: {age} years</label>
                  <input
                    type="range" min="5" max="85" value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">BMI: {bmi}</label>
                  <input
                    type="range" min="15" max="45" step="0.5" value={bmi}
                    onChange={(e) => setBmi(Number(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block">CRP (mg/L)</label>
                    <input
                      type="number" value={crp}
                      onChange={(e) => setCrp(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-slate-100 font-mono mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block">ESR (mm/hr)</label>
                    <input
                      type="number" value={esr}
                      onChange={(e) => setEsr(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-slate-100 font-mono mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Group 2: Autoantibody Panel */}
              <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="font-bold text-amber-300 block">2. Autoantibody Panel</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block text-[11px]">ANA (1:X)</label>
                    <input
                      type="number" value={anaTitre}
                      onChange={(e) => setAnaTitre(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-slate-100 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block text-[11px]">Anti-CCP (U/mL)</label>
                    <input
                      type="number" value={antiCcp}
                      onChange={(e) => setAntiCcp(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-slate-100 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block text-[11px]">RF (IU/mL)</label>
                    <input
                      type="number" value={rfTitre}
                      onChange={(e) => setRfTitre(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-slate-100 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block text-[11px]">Anti-dsDNA (IU/mL)</label>
                    <input
                      type="number" value={antiDsDna}
                      onChange={(e) => setAntiDsDna(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-slate-100 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block text-[11px]">Anti-tTG (U/mL)</label>
                    <input
                      type="number" value={antiTtg}
                      onChange={(e) => setAntiTtg(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-slate-100 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block text-[11px]">Anti-AChR (nmol/L)</label>
                    <input
                      type="number" value={antiAchR}
                      onChange={(e) => setAntiAchR(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-slate-100 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Group 3: Organ Labs & Symptoms & Genetics */}
              <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="font-bold text-emerald-300 block">3. Organ Labs & Symptoms & Genetics</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block text-[11px]">Fasting Glu / HbA1c</label>
                    <input
                      type="number" value={fastingGlucose}
                      onChange={(e) => setFastingGlucose(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-slate-100 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block text-[11px]">Joint Pain (0-10)</label>
                    <input
                      type="number" min="0" max="10" value={jointPainScore}
                      onChange={(e) => setJointPainScore(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-slate-100 font-mono"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="checkbox" checked={hlaDR4}
                      onChange={(e) => setHlaDR4(e.target.checked)}
                      className="rounded accent-indigo-500"
                    />
                    <span className="text-[11px] text-slate-300">HLA-DR4 (RA/T1D)</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="checkbox" checked={hlaB27}
                      onChange={(e) => setHlaB27(e.target.checked)}
                      className="rounded accent-indigo-500"
                    />
                    <span className="text-[11px] text-slate-300">HLA-B27 (AS)</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="checkbox" checked={hlaDR3DQ2}
                      onChange={(e) => setHlaDR3DQ2(e.target.checked)}
                      className="rounded accent-indigo-500"
                    />
                    <span className="text-[11px] text-slate-300">HLA-DR3/DQ2</span>
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={handleRunQuantumML}
              disabled={isQuantumRunning}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-500 via-purple-600 to-emerald-500 hover:opacity-95 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              <Atom className="w-5 h-5 animate-spin" />
              <span>
                {isQuantumRunning ? 'Evaluating 15-Qubit Statevector Hilbert Gram Matrix...' : 'Run Quantum Kernel SVM (One-vs-Rest)'}
              </span>
            </button>
          </div>

          {/* Quantum Result */}
          {quantumResult && (
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-bold text-slate-100">
                      Quantum SVM Prediction: {quantumResult.topPrediction.disease}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Multi-class OvR Winner with {(quantumResult.topPrediction.probability * 100).toFixed(1)}% confidence
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs px-3 py-1.5 rounded-xl bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono">
                    OvR Margin: {(quantumResult.topPrediction.ovrMargin * 100).toFixed(1)}%
                  </span>
                  <span className="text-xs px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                    SV Influence: {quantumResult.topPrediction.supportVectorInfluence.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* All 15 Differential Probabilities Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Full 15-Disease One-vs-Rest Probability Distribution
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {quantumResult.allPredictions.map((pred: any, idx: number) => (
                    <div
                      key={pred.disease}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                        idx === 0
                          ? 'bg-indigo-950/60 border-indigo-700/80 shadow-sm'
                          : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <div>
                        <span className={`font-semibold ${idx === 0 ? 'text-indigo-200' : 'text-slate-300'}`}>
                          {pred.disease}
                        </span>
                        <span className="block text-[10px] text-slate-500 font-mono">
                          Margin: {(pred.ovrMargin * 100).toFixed(0)}%
                        </span>
                      </div>
                      <span className={`font-mono font-bold ${idx === 0 ? 'text-emerald-400 text-sm' : 'text-slate-400'}`}>
                        {(pred.probability * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Gemini Multi-Omic Testbench */}
      {activeMode === 'gemini_multiomic' && (
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Multi-Omic Gemini 3.6 Flash Causal Reasoning</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Disease Suspected</label>
                <select
                  value={diseaseType}
                  onChange={(e) => setDiseaseType(e.target.value as AutoimmuneDisease)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none"
                >
                  <option value="Type 1 Diabetes">Type 1 Diabetes</option>
                  <option value="Rheumatoid Arthritis">Rheumatoid Arthritis</option>
                  <option value="Multiple Sclerosis">Multiple Sclerosis</option>
                  <option value="Systemic Lupus Erythematosus">Systemic Lupus Erythematosus</option>
                  <option value="Coeliac Disease">Coeliac Disease</option>
                  <option value="Hashimoto Thyroiditis">Hashimoto Thyroiditis</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Autoantibody Panel</label>
                <input
                  type="text" value={autoantibodiesText}
                  onChange={(e) => setAutoantibodiesText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-slate-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Cytokine Panel</label>
                <input
                  type="text" value={cytokinesText}
                  onChange={(e) => setCytokinesText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-slate-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 lg:col-span-2">
                <label className="font-bold text-slate-300">TCR/BCR CDR3 Sequences (Comma Separated)</label>
                <input
                  type="text" value={cdr3Text}
                  onChange={(e) => setCdr3Text(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-slate-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 flex items-center space-x-2 pt-6">
                <input
                  type="checkbox" id="viralCheck" checked={recentViralEvent}
                  onChange={(e) => setRecentViralEvent(e.target.checked)}
                  className="rounded text-indigo-600 w-4 h-4 accent-indigo-500"
                />
                <label htmlFor="viralCheck" className="font-bold text-slate-300 cursor-pointer">
                  Recent Viral Spike (Test Causal Filter)
                </label>
              </div>
            </div>

            <button
              onClick={handleRunGemini}
              disabled={isGeminiRunning}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGeminiRunning ? 'Gemini 3.6 Flash Analyzing Multi-Omic Repertoire...' : 'Execute Gemini Causal Inference'}</span>
            </button>
          </div>

          {geminiResult && (
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>AIRT-Net Multi-Omic Assessment Complete</span>
                </h3>
                <span className="font-mono text-slate-400">
                  Risk: {(geminiResult.riskScore * 100).toFixed(0)}% • Stage: {geminiResult.stageEstimate}
                </span>
              </div>
              <div className="p-4 bg-indigo-950/40 rounded-xl border border-indigo-800/80 text-slate-200">
                {geminiResult.summaryReasoning}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
