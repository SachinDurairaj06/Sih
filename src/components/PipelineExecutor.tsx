import React, { useState } from 'react';
import { AutoimmuneDisease, AIRTNetAnalysisResponse } from '../types';
import { Cpu, Dna, Sparkles, AlertCircle, Play, CheckCircle2, FileText, Activity } from 'lucide-react';

export const PipelineExecutor: React.FC = () => {
  const [diseaseType, setDiseaseType] = useState<AutoimmuneDisease>('Type 1 Diabetes');
  const [age, setAge] = useState<number>(9);
  const [autoantibodiesText, setAutoantibodiesText] = useState<string>('GAD65: 145, IA2: 130, ZnT8: 94');
  const [cdr3Text, setCdr3Text] = useState<string>('CASSLGTGGYNEQFF, CASSLTSGTYEQYF, CASSPDQETQYF, CASSLDSNQPQHF');
  const [cytokinesText, setCytokinesText] = useState<string>('IFNg: 21.0, IL6: 9.4, CXCL10: 58.0');
  const [microbiomeDysbiosis, setMicrobiomeDysbiosis] = useState<number>(0.68);
  const [recentViralEvent, setRecentViralEvent] = useState<boolean>(true);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AIRTNetAnalysisResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load Preset Profiles
  const loadPreset = (preset: 't1d' | 'ra' | 'ms') => {
    if (preset === 't1d') {
      setDiseaseType('Type 1 Diabetes');
      setAge(9);
      setAutoantibodiesText('GAD65: 145, IA2: 130, ZnT8: 94');
      setCdr3Text('CASSLGTGGYNEQFF, CASSLTSGTYEQYF, CASSLDSNQPQHF');
      setCytokinesText('IFNg: 21.0, IL6: 9.4, CXCL10: 58.0');
      setMicrobiomeDysbiosis(0.68);
      setRecentViralEvent(true);
    } else if (preset === 'ra') {
      setDiseaseType('Rheumatoid Arthritis');
      setAge(42);
      setAutoantibodiesText('antiCCP: 82, RF: 24');
      setCdr3Text('CASSQERGNEKLFF, CASSLAPGASYEQYF');
      setCytokinesText('IFNg: 10.2, IL6: 8.1, TNFa: 14.5');
      setMicrobiomeDysbiosis(0.72);
      setRecentViralEvent(false);
    } else if (preset === 'ms') {
      setDiseaseType('Multiple Sclerosis');
      setAge(28);
      setAutoantibodiesText('antiMBP: 110, antiMOG: 42');
      setCdr3Text('CASSLAGGTDTQYF, CASSLAGGGAYEQYF');
      setCytokinesText('IL17A: 28.1, IFNg: 31.0, TNFa: 24.5');
      setMicrobiomeDysbiosis(0.78);
      setRecentViralEvent(true);
    }
  };

  const handleRunPipeline = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setAnalysisResult(null);

    // Parse text inputs into json objects
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

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data: AIRTNetAnalysisResponse = await res.json();
      setAnalysisResult(data);
    } catch (err: any) {
      console.error('AIRT-Net pipeline error:', err);
      setErrorMsg(err.message || 'Failed to execute AIRT-Net Gemini analysis pipeline.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Live AIRT-Net AI Multi-Omic Pipeline Executor
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Test reference-free repertoire clustering, temporal graph attention, and causal inference on custom multi-omic samples via Gemini 3.6 Flash.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-400">Load Presets:</span>
            <button
              onClick={() => loadPreset('t1d')}
              className="px-2.5 py-1 text-xs bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 rounded border border-indigo-200 dark:border-indigo-800 font-medium"
            >
              Stage 2 T1D
            </button>
            <button
              onClick={() => loadPreset('ra')}
              className="px-2.5 py-1 text-xs bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 rounded border border-indigo-200 dark:border-indigo-800 font-medium"
            >
              Pre-RA
            </button>
            <button
              onClick={() => loadPreset('ms')}
              className="px-2.5 py-1 text-xs bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 rounded border border-indigo-200 dark:border-indigo-800 font-medium"
            >
              Pre-MS
            </button>
          </div>
        </div>

        {/* Input Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Disease Domain</label>
            <select
              value={diseaseType}
              onChange={(e) => setDiseaseType(e.target.value as AutoimmuneDisease)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-medium text-slate-900 dark:text-slate-100 focus:outline-none"
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
            <label className="font-bold text-slate-700 dark:text-slate-300">Patient Age (Years)</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-medium text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Autoantibody Panel (Name: Value)</label>
            <input
              type="text"
              value={autoantibodiesText}
              onChange={(e) => setAutoantibodiesText(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-mono text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5 lg:col-span-2">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              TCR/BCR CDR3 Sequences (Comma Separated)
            </label>
            <input
              type="text"
              value={cdr3Text}
              onChange={(e) => setCdr3Text(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-mono text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Cytokine Levels (Name: Value)</label>
            <input
              type="text"
              value={cytokinesText}
              onChange={(e) => setCytokinesText(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-mono text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Gut Dysbiosis Index (0.0 to 1.0): {microbiomeDysbiosis}
            </label>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={microbiomeDysbiosis}
              onChange={(e) => setMicrobiomeDysbiosis(parseFloat(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div className="space-y-1.5 flex items-center space-x-2 pt-6">
            <input
              type="checkbox"
              id="viralCheck"
              checked={recentViralEvent}
              onChange={(e) => setRecentViralEvent(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
            />
            <label htmlFor="viralCheck" className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
              Recent Viral Infection Event (Test Causal Filter)
            </label>
          </div>
        </div>

        {/* Execute Button */}
        <div className="pt-2">
          <button
            onClick={handleRunPipeline}
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isLoading ? 'AIRT-Net Gemini Engine Processing Multi-Omics...' : 'Execute AIRT-Net AI Pipeline'}</span>
          </button>
        </div>
      </div>

      {/* Error Message if any */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-800 dark:text-rose-200 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Analysis Results Display */}
      {analysisResult && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  AIRT-Net Multi-Omic Assessment Complete
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Model Lock Version {analysisResult.regulatoryAuditTrail.modelLockVersion} • PCCP Compliant
              </p>
            </div>

            <div className="flex items-center space-x-4 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 block font-medium">Stage Estimate</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">
                  {analysisResult.stageEstimate}
                </span>
              </div>

              <div className="h-8 w-px bg-slate-300 dark:bg-slate-700" />

              <div className="text-center">
                <span className="text-[10px] text-slate-400 block font-medium">Assigned Tier</span>
                <span className="font-bold text-rose-600 dark:text-rose-400 text-sm">
                  {analysisResult.recommendedTier}
                </span>
              </div>

              <div className="h-8 w-px bg-slate-300 dark:bg-slate-700" />

              <div className="text-center">
                <span className="text-[10px] text-slate-400 block font-medium">Risk Score</span>
                <span className="font-mono font-black text-rose-500 text-lg">
                  {(analysisResult.riskScore * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          {/* AI Summary Reasoning */}
          <div className="p-4 bg-indigo-50/80 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800 space-y-2 text-xs">
            <span className="font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider block">
              Gemini Reasoning Summary
            </span>
            <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
              {analysisResult.summaryReasoning}
            </p>
          </div>

          {/* Causal Filtering Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-100">
                <span>Causal Drivers Identified ({analysisResult.causalBiomarkersCount})</span>
                <span className="text-rose-600 font-mono">Step C Passed</span>
              </div>

              <div className="space-y-2">
                {analysisResult.biomarkerEvaluations
                  .filter((b) => b.isCausalDriver)
                  .map((b, idx) => (
                    <div key={idx} className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">{b.biomarkerName}</span>
                      <span className="text-[10px] text-slate-500">{b.explanation}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-100">
                <span>Bystander Signals Filtered ({analysisResult.bystanderBiomarkersCount})</span>
                <span className="text-emerald-600 font-mono">Discounted</span>
              </div>

              <div className="space-y-2">
                {analysisResult.biomarkerEvaluations
                  .filter((b) => !b.isCausalDriver)
                  .map((b, idx) => (
                    <div key={idx} className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">{b.biomarkerName}</span>
                      <span className="text-[10px] text-slate-500">{b.explanation}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Minimal Intervention Recommendation */}
          <div className="p-5 bg-rose-50/80 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-800 space-y-3">
            <span className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider block">
              Recommended Minimal-Intervention Protocol
            </span>

            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {analysisResult.minimalInterventionPlan.recommendedAction}
            </p>

            {analysisResult.minimalInterventionPlan.therapeutics && (
              <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-rose-200 dark:border-rose-900 text-xs space-y-1">
                <p className="font-bold text-rose-700 dark:text-rose-300">
                  {analysisResult.minimalInterventionPlan.therapeutics.drugName} (
                  {analysisResult.minimalInterventionPlan.therapeutics.class})
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  {analysisResult.minimalInterventionPlan.therapeutics.dosageProtocol}
                </p>
                <p className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px] pt-1">
                  Expected Stage 3 Onset Delay: +{analysisResult.minimalInterventionPlan.therapeutics.expectedDelayMonths} Months
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
