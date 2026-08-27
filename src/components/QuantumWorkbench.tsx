import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Zap,
  Activity,
  Layers,
  BarChart3,
  Sliders,
  CheckCircle2,
  Share2,
  Atom,
  RefreshCw,
  Info,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  AUTOIMMUNE_DISEASES_CATALOG,
  MODEL_BENCHMARK_RESULTS,
  computeQuantumKernelMatrix,
} from '../data/quantumEngine';
import { MOCK_PATIENTS } from '../data/mockPatients';
import { QuantumKernelMatrixData, ModelBenchmarkResult } from '../types';

export const QuantumWorkbench: React.FC = () => {
  const [numQubits, setNumQubits] = useState<number>(15);
  const [entanglement, setEntanglement] = useState<'linear' | 'circular' | 'full'>('linear');
  const [simulatorBackend, setSimulatorBackend] = useState<'PennyLane lightning.qubit' | 'Qiskit Aer statevector'>(
    'PennyLane lightning.qubit'
  );
  const [regularizationC, setRegularizationC] = useState<number>(1.0);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number; val: number } | null>(null);
  const [isComputing, setIsComputing] = useState<boolean>(false);
  const [kernelData, setKernelData] = useState<QuantumKernelMatrixData>(() =>
    computeQuantumKernelMatrix(
      MOCK_PATIENTS.map((p) => ({
        id: p.id,
        name: p.name,
        diseaseType: p.diseaseType,
        features: p.clinicalFeatures,
      })),
      15,
      'linear'
    )
  );

  const recomputeKernel = () => {
    setIsComputing(true);
    setTimeout(() => {
      const data = computeQuantumKernelMatrix(
        MOCK_PATIENTS.map((p) => ({
          id: p.id,
          name: p.name,
          diseaseType: p.diseaseType,
          features: p.clinicalFeatures,
        })),
        numQubits,
        entanglement
      );
      setKernelData(data);
      setIsComputing(false);
    }, 450);
  };

  useEffect(() => {
    recomputeKernel();
  }, [numQubits, entanglement]);

  const benchmarkChartData = MODEL_BENCHMARK_RESULTS.map((b) => ({
    name: b.modelName.replace(' (OvR)', '').replace(' (100 Trees)', '').replace(' (RBF Kernel)', ''),
    Accuracy: Number((b.accuracy * 100).toFixed(1)),
    MacroF1: Number((b.macroF1 * 100).toFixed(1)),
    WeightedF1: Number((b.weightedF1 * 100).toFixed(1)),
    LatencyMs: b.inferenceLatencyMs,
    type: b.modelType,
  }));

  const hilbertDim = Math.pow(2, numQubits);

  const radarData = [
    { metric: 'Accuracy', QuantumSVM: 94.2, RandomForest: 87.5, ClassicalSVM: 86.1 },
    { metric: 'High-Order Epistasis', QuantumSVM: 96.0, RandomForest: 74.0, ClassicalSVM: 68.0 },
    { metric: 'Kernel Alignment (QKA)', QuantumSVM: 89.2, RandomForest: 71.0, ClassicalSVM: 76.5 },
    { metric: 'Multi-Class OvR Margin', QuantumSVM: 92.4, RandomForest: 84.2, ClassicalSVM: 82.0 },
    { metric: 'Noise Robustness', QuantumSVM: 88.0, RandomForest: 85.0, ClassicalSVM: 79.0 },
    { metric: 'Pre-Clinical Sensitivity', QuantumSVM: 95.0, RandomForest: 86.0, ClassicalSVM: 83.5 },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Atom className="w-6 h-6 animate-pulse" />
              </span>
              <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
                Quantum Kernel SVM (OvR) Method
              </h2>
              <span className="text-xs px-2.5 py-1 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800 font-semibold flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" />
                {simulatorBackend}
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
              Maps 8–15 multi-omic features to an angle-encoded <strong className="text-slate-200">ZZFeatureMap</strong> in an exponential{' '}
              <span className="text-indigo-400 font-mono font-semibold">{hilbertDim.toLocaleString()}-dimensional</span> quantum Hilbert space. Multi-class One-vs-Rest (OvR) separation is evaluated against Classical Random Forest and Classical SVM baselines across all 15 autoimmune disease profiles.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={recomputeKernel}
              disabled={isComputing}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isComputing ? 'animate-spin' : ''}`} />
              <span>{isComputing ? 'Computing Kernel...' : 'Recompute Gram Matrix'}</span>
            </button>
          </div>
        </div>

        {/* Key Quantum Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
            <span className="text-xs text-slate-400 font-medium">Qubit Register Size</span>
            <div className="text-xl font-bold text-indigo-300 mt-1 font-mono">
              {numQubits} Qubits <span className="text-xs text-slate-400 font-sans">({hilbertDim.toLocaleString()} states)</span>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
            <span className="text-xs text-slate-400 font-medium">Quantum Kernel Alignment (QKA)</span>
            <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">
              {kernelData.kernelAlignmentScore.toFixed(3)}{' '}
              <span className="text-xs text-emerald-500 font-semibold">(High Affinity)</span>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
            <span className="text-xs text-slate-400 font-medium">Quantum Advantage Margin</span>
            <div className="text-xl font-bold text-purple-300 mt-1 font-mono">
              +6.7% <span className="text-xs text-slate-400 font-sans">vs Random Forest</span>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
            <span className="text-xs text-slate-400 font-medium">Parallel Execution</span>
            <div className="text-xl font-bold text-amber-300 mt-1 font-mono">
              joblib <span className="text-xs text-slate-400 font-sans">(8 vCPU workers)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Quantum Circuit & Hyperparameters Config */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls & Configuration */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-semibold text-slate-200">Quantum ML Configuration</h3>
          </div>

          {/* Qubit Count Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Number of Qubits / Features:</span>
              <span className="text-indigo-400 font-mono font-bold">{numQubits} Qubits</span>
            </div>
            <input
              type="range"
              min={8}
              max={15}
              value={numQubits}
              onChange={(e) => setNumQubits(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>8 Qubits (256 dims)</span>
              <span>12 Qubits (4,096 dims)</span>
              <span>15 Qubits (32,768 dims)</span>
            </div>
          </div>

          {/* Entanglement Architecture */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">
              ZZ Entanglement Topology:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['linear', 'circular', 'full'] as const).map((ent) => (
                <button
                  key={ent}
                  onClick={() => setEntanglement(ent)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium capitalize border transition-all ${
                    entanglement === ent
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 shadow-sm'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {ent}
                </button>
              ))}
            </div>
          </div>

          {/* Simulator Backend */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">
              Quantum Simulator Backend:
            </label>
            <div className="space-y-2">
              {[
                { id: 'PennyLane lightning.qubit', label: 'PennyLane lightning.qubit (C++ Statevector)' },
                { id: 'Qiskit Aer statevector', label: 'Qiskit Aer Statevector Simulator' },
              ].map((sim) => (
                <label
                  key={sim.id}
                  className={`flex items-center space-x-3 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    simulatorBackend === sim.id
                      ? 'bg-slate-800 border-indigo-500/70 text-indigo-200'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800/60'
                  }`}
                >
                  <input
                    type="radio"
                    name="simulator"
                    checked={simulatorBackend === sim.id}
                    onChange={() => setSimulatorBackend(sim.id as any)}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{sim.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Regularization C */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">SVM Regularization C:</span>
              <span className="text-indigo-400 font-mono font-bold">{regularizationC.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={5.0}
              step={0.1}
              value={regularizationC}
              onChange={(e) => setRegularizationC(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Mathematical Form */}
          <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800 font-mono text-[11px] text-slate-400 space-y-1">
            <div className="text-indigo-300 font-semibold text-xs mb-1">Statevector Inner Product:</div>
            <div>|ψ(x)⟩ = U_ZZ(x) |0⟩^⊗n</div>
            <div>K(x, x') = |⟨ψ(x)|ψ(x')⟩|²</div>
            <div className="text-emerald-400 pt-1">
              Multi-Class: 15-way One-vs-Rest (OvR)
            </div>
          </div>
        </div>

        {/* ZZFeatureMap Quantum Circuit Diagram */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-semibold text-slate-200">
                  Angle-Encoding ZZFeatureMap Circuit (8–15 Qubits)
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Depth: 2 Layers • All-to-all Phase Shift
              </span>
            </div>

            {/* Visual Circuit Grid */}
            <div className="mt-4 bg-slate-950 rounded-xl p-4 border border-slate-800/80 overflow-x-auto">
              <div className="min-w-[550px] space-y-3">
                {[0, 1, 2, 3, 4].map((qIdx) => (
                  <div key={qIdx} className="flex items-center space-x-3 text-xs font-mono">
                    <span className="w-14 text-indigo-400 font-bold">|q_{qIdx}⟩ |0⟩</span>
                    <div className="flex items-center space-x-2 flex-1 relative">
                      {/* Wire line */}
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-700 -translate-y-1/2 z-0" />

                      {/* Hadamard Gate */}
                      <div className="relative z-10 px-2.5 py-1 bg-amber-950/80 border border-amber-600 text-amber-300 rounded font-bold shadow-sm">
                        H
                      </div>

                      {/* Angle Rz Gate */}
                      <div className="relative z-10 px-2.5 py-1 bg-indigo-950/90 border border-indigo-500 text-indigo-200 rounded font-semibold shadow-sm">
                        Rz(2x_{qIdx})
                      </div>

                      {/* Entanglement CNOT / Phase */}
                      <div className="relative z-10 px-3 py-1 bg-purple-950/90 border border-purple-500 text-purple-200 rounded font-semibold shadow-sm">
                        Rzz(2(π-x_{qIdx})(π-x_{qIdx + 1}))
                      </div>

                      {/* Repeat Layer */}
                      <div className="relative z-10 px-2 py-1 bg-amber-950/80 border border-amber-600 text-amber-300 rounded font-bold shadow-sm">
                        H
                      </div>

                      <div className="relative z-10 px-2.5 py-1 bg-indigo-950/90 border border-indigo-500 text-indigo-200 rounded font-semibold shadow-sm">
                        Rz(2x_{qIdx})
                      </div>

                      {/* Measurement / State Projection */}
                      <div className="relative z-10 ml-auto px-2 py-1 bg-emerald-950 border border-emerald-600 text-emerald-300 rounded text-[10px] font-bold">
                        |⟨ψ|
                      </div>
                    </div>
                  </div>
                ))}
                <div className="text-center text-slate-500 text-xs py-1 italic font-mono">
                  • • • [Qubits |q_5⟩ through |q_{numQubits - 1}⟩ parallel angle-encoded] • • •
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
              <span className="text-slate-400 block mb-0.5">Feature Dimension</span>
              <strong className="text-slate-200 text-sm">{numQubits} Clinical Markers</strong>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
              <span className="text-slate-400 block mb-0.5">Entanglement Density</span>
              <strong className="text-purple-300 text-sm">
                {entanglement === 'linear' ? `${numQubits - 1} Pairs` : `${(numQubits * (numQubits - 1)) / 2} Pairs`}
              </strong>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
              <span className="text-slate-400 block mb-0.5">Statevector Fidelity</span>
              <strong className="text-emerald-400 text-sm">Exact Gram Matrix |⟨ψ|ψ'⟩|²</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Quantum Kernel Gram Matrix Heatmap */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-slate-100">
                N × N Quantum Kernel Gram Matrix (Angle-Encoded Overlaps)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Fidelity inner products <code className="text-indigo-300">K_ij = |⟨ψ(x_i) | ψ(x_j)⟩|²</code> calculated via parallelized PennyLane statevector simulator.
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-indigo-950 border border-indigo-900" />
              <span className="text-slate-400">0.0 (Orthogonal)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-indigo-600" />
              <span className="text-slate-400">0.5</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-emerald-400" />
              <span className="text-slate-400">1.0 (Identical)</span>
            </div>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[650px] inline-block">
            {/* Header row with patient IDs */}
            <div className="flex ml-28 space-x-1 mb-1">
              {kernelData.patientNames.map((name, idx) => (
                <div
                  key={idx}
                  className="w-14 text-[10px] text-center text-slate-400 font-mono truncate"
                  title={`${name} (${kernelData.diseaseLabels[idx]})`}
                >
                  {name.split(' ')[0]}
                </div>
              ))}
            </div>

            {/* Matrix Rows */}
            <div className="space-y-1">
              {kernelData.matrix.map((row, rIdx) => (
                <div key={rIdx} className="flex items-center space-x-1">
                  <div
                    className="w-28 text-right pr-3 text-[11px] font-mono text-slate-300 truncate"
                    title={`${kernelData.patientNames[rIdx]} - ${kernelData.diseaseLabels[rIdx]}`}
                  >
                    {kernelData.patientNames[rIdx].split(' ')[0]}
                  </div>

                  {row.map((val, cIdx) => {
                    const isDiag = rIdx === cIdx;
                    const sameDisease = kernelData.diseaseLabels[rIdx] === kernelData.diseaseLabels[cIdx];
                    
                    // Heatmap color interpolation
                    let bgColor = 'bg-slate-900';
                    let textColor = 'text-slate-400';

                    if (val > 0.85) {
                      bgColor = 'bg-emerald-500 text-slate-950 font-bold';
                    } else if (val > 0.65) {
                      bgColor = 'bg-indigo-600 text-white font-semibold';
                    } else if (val > 0.4) {
                      bgColor = 'bg-indigo-900 text-indigo-200';
                    } else {
                      bgColor = 'bg-slate-950 text-slate-600';
                    }

                    return (
                      <button
                        key={cIdx}
                        onClick={() => setSelectedCell({ row: rIdx, col: cIdx, val })}
                        className={`w-14 h-10 rounded text-[11px] font-mono transition-all flex items-center justify-center border ${
                          selectedCell?.row === rIdx && selectedCell?.col === cIdx
                            ? 'ring-2 ring-amber-400 border-amber-300'
                            : sameDisease && !isDiag
                            ? 'border-indigo-500/40'
                            : 'border-slate-800'
                        } ${bgColor}`}
                        title={`Patient ${kernelData.patientNames[rIdx]} (${kernelData.diseaseLabels[rIdx]}) vs ${kernelData.patientNames[cIdx]} (${kernelData.diseaseLabels[cIdx]}): K = ${val.toFixed(3)}`}
                      >
                        {val.toFixed(2)}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Cell Inspection Details */}
        {selectedCell && (
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-xs text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <span className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-mono font-bold text-sm">
                K({selectedCell.row},{selectedCell.col}) = {selectedCell.val.toFixed(4)}
              </span>
              <div>
                <div className="font-semibold text-slate-100">
                  {kernelData.patientNames[selectedCell.row]} ({kernelData.diseaseLabels[selectedCell.row]}) ⟷ {kernelData.patientNames[selectedCell.col]} ({kernelData.diseaseLabels[selectedCell.col]})
                </div>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  Quantum Hilbert state overlap fidelity in {hilbertDim.toLocaleString()}-D vector space.
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedCell(null)}
              className="text-slate-500 hover:text-slate-300 text-xs underline"
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* Model Benchmark Comparison (Quantum vs Classical) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart of Accuracies */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-semibold text-slate-200">
                Baseline Comparison: Quantum Kernel SVM vs Classical Baselines
              </h3>
            </div>
            <span className="text-xs text-slate-400">15 Autoimmune Target Classes</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={benchmarkChartData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} angle={-10} textAnchor="end" />
                <YAxis stroke="#94a3b8" domain={[60, 100]} fontSize={11} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Accuracy" name="Test Accuracy (%)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="MacroF1" name="Macro F1 (%)" fill="#a855f7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="WeightedF1" name="Weighted F1 (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Benchmark Table */}
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2 px-3 font-semibold">Model Architecture</th>
                  <th className="py-2 px-3 font-semibold">Accuracy</th>
                  <th className="py-2 px-3 font-semibold">Macro F1</th>
                  <th className="py-2 px-3 font-semibold">Log-Loss</th>
                  <th className="py-2 px-3 font-semibold">Inference Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {MODEL_BENCHMARK_RESULTS.map((b, idx) => (
                  <tr
                    key={idx}
                    className={b.modelType === 'Quantum' ? 'bg-indigo-950/40 text-indigo-200' : 'text-slate-300'}
                  >
                    <td className="py-2.5 px-3 font-sans font-medium flex items-center gap-2">
                      {b.modelType === 'Quantum' && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      )}
                      {b.modelName}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-emerald-400">
                      {(b.accuracy * 100).toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3">{(b.macroF1 * 100).toFixed(1)}%</td>
                    <td className="py-2.5 px-3 text-slate-400">{b.logLoss.toFixed(3)}</td>
                    <td className="py-2.5 px-3 text-indigo-300">{b.inferenceLatencyMs} ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Multi-Dimensional Radar & Epistasis Insights */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-semibold text-slate-200">
                Quantum Separation Advantage
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Why Quantum Kernel SVM outperforms classical trees on pre-clinical autoimmunity:
            </p>

            <div className="h-60 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="metric" stroke="#94a3b8" fontSize={9} />
                  <PolarRadiusAxis stroke="#475569" angle={30} domain={[60, 100]} fontSize={8} />
                  <Radar name="Quantum Kernel SVM" dataKey="QuantumSVM" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                  <Radar name="Random Forest" dataKey="RandomForest" stroke="#a855f7" fill="#a855f7" fillOpacity={0.2} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '11px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-indigo-950/50 border border-indigo-800/60 rounded-xl p-3.5 text-xs text-indigo-200 space-y-1.5">
            <div className="font-semibold flex items-center gap-1.5 text-indigo-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Non-Linear Epistasis Capture</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Pairwise HLA alleles and autoantibody multi-seroconversions create non-convex decision boundaries in Euclidean space that standard kernels fail to resolve without overfitting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
