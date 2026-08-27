export type AutoimmuneDisease =
  | 'Rheumatoid Arthritis'
  | 'Systemic Lupus Erythematosus'
  | 'Type 1 Diabetes'
  | 'Hashimoto Thyroiditis'
  | 'Graves Disease'
  | 'Multiple Sclerosis'
  | 'Psoriatic Disease'
  | 'Celiac Disease'
  | 'Inflammatory Bowel Disease'
  | 'Sjogren Syndrome'
  | 'Ankylosing Spondylitis'
  | 'Vitiligo'
  | 'Autoimmune Hepatitis'
  | 'Myasthenia Gravis'
  | 'Guillain-Barre Syndrome';

export type DiseaseCategory =
  | 'Joint/Systemic'
  | 'Systemic'
  | 'Endocrine'
  | 'Neurological'
  | 'Dermatological/Joint'
  | 'Gastrointestinal'
  | 'Exocrine/Systemic'
  | 'Joint/Spine'
  | 'Dermatological'
  | 'Hepatic'
  | 'Neuromuscular';

export interface DiseaseMetadata {
  id: number;
  name: AutoimmuneDisease;
  category: DiseaseCategory;
  primaryAgeGroup: string;
  keyAutoantibodies: string[];
  keyOrganLabs: string[];
  primaryGeneticMarker: string;
  description: string;
}

export type InterventionTier = 'Tier 0' | 'Tier 1' | 'Tier 2' | 'Tier 3';
export type DiseaseStage = 'Stage 0' | 'Stage 1' | 'Stage 2' | 'Stage 3';

export interface PatientClinicalFeatures {
  // Demographics
  age: number;
  sex: 'Female' | 'Male';
  bmi: number;

  // General inflammation
  crp: number; // mg/L (normal < 3.0)
  esr: number; // mm/hr (normal < 20)

  // Autoantibody panel (0-200+ IU/mL or titre scale)
  ana: number; // Antinuclear Antibodies
  rf: number; // Rheumatoid Factor
  antiCcp: number; // Cyclic Citrullinated Peptide
  antiDsDna: number; // double-stranded DNA
  antiTpo: number; // Thyroid Peroxidase
  antiTg: number; // Thyroglobulin
  antiTtg: number; // tissue Transglutaminase (Celiac)
  antiAchR: number; // Acetylcholine Receptor (Myasthenia)

  // Organ-specific labs
  tsh: number; // mIU/L (Thyroid)
  freeT4: number; // ng/dL
  fastingGlucose: number; // mg/dL
  hba1c: number; // % (Diabetes)
  alt: number; // U/L (Liver)
  ast: number; // U/L (Liver)
  complementC3: number; // mg/dL (Lupus)
  complementC4: number; // mg/dL (Lupus)

  // Symptom / Clinical indicators (0-10 score)
  jointPainScore: number; // 0-10
  fatigueScore: number; // 0-10
  skinLesionScore: number; // 0-10
  giSymptomScore: number; // 0-10
  muscleWeaknessScore: number; // 0-10

  // Genetic markers
  hlaB27: boolean;
  hlaDr4: boolean;
  hlaDr3Dq2: boolean;
}

export interface LongitudinalVisit {
  visitDate: string; // e.g. "2024-03", "2024-09"
  ageYears: number;
  autoantibodyTitres: Record<string, number>;
  cPeptideOrFunctionMetric: number; // e.g. C-peptide (pmol/L), joint stiffness, or neurofilament
  cytokines: Record<string, number>;
  microbiomeDysbiosisIndex: number; // 0.0 to 1.0
  wearableGlycemicOrActivityScore: number;
  calculatedRiskScore: number; // 0.00 to 1.00
}

export interface CDR3ClusterPoint {
  id: string;
  sequence: string;
  umapX: number;
  umapY: number;
  clusterId: number;
  clusterName: string;
  isAutoreactiveCluster: boolean;
  isReferenceCatalogued: boolean; // false = reference-free novel cluster
  enrichmentScoreVsControl: number;
  knownTargetEpitope?: string;
}

export interface BiomarkerCausalEvaluation {
  biomarkerName: string;
  category: 'Autoantibody' | 'Repertoire Cluster' | 'Cytokine' | 'Microbiome' | 'Genetic/EHR' | 'EHR / Lab' | string;
  mendelianRandomizationPValue: number;
  doublyRobustEffectSize: number;
  isCausalDriver: boolean;
  explanation: string;
}

export interface ShapAttribution {
  featureName: string;
  shapValue: number;
  category: string;
  description: string;
}

export interface MinimalInterventionPlan {
  tier: InterventionTier;
  triggerDescription: string;
  recommendedAction: string;
  therapeutics?: {
    drugName: string;
    class: string;
    approvalStatus: string;
    dosageProtocol: string;
    expectedDelayMonths: number;
  };
  monitoringCadence: string;
  lifestyleMicrobiomeGuidance: string;
  clinicianDiscretionNotice: string;
}

export interface QuantumKernelPrediction {
  disease: AutoimmuneDisease;
  probability: number;
  ovrMargin: number;
  supportVectorInfluence: number;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Female' | 'Male';
  diseaseType: AutoimmuneDisease;
  category: DiseaseCategory;
  clinicalFeatures: PatientClinicalFeatures;
  hlaAlleles: string[];
  polygenicRiskPercentile: number;
  stage: DiseaseStage;
  currentTier: InterventionTier;
  currentRiskScore: number;
  seroconversionStatus: 'Negative' | 'Single Autoantibody Positive' | 'Multiple Autoantibody Positive';
  lastVisitDate: string;
  visits: LongitudinalVisit[];
  immuneRepertoireClusters: CDR3ClusterPoint[];
  biomarkerEvaluations: BiomarkerCausalEvaluation[];
  shapAttributions: ShapAttribution[];
  quantumPredictions: QuantumKernelPrediction[];
  interventionPlan: MinimalInterventionPlan;
}

export interface QuantumKernelConfig {
  featureMap: 'ZZFeatureMap' | 'CustomAngleEncoding' | 'PauliFeatureMap';
  numQubits: number; // 8 to 15 qubits
  entanglement: 'linear' | 'circular' | 'full';
  simulatorBackend: 'PennyLane lightning.qubit' | 'Qiskit Aer statevector';
  regularizationC: number;
  multiclassStrategy: 'One-vs-Rest (OvR)' | 'One-vs-One (OvO)';
  cpuWorkers: number;
}

export interface ModelBenchmarkResult {
  modelName: string;
  modelType: 'Quantum' | 'Classical';
  accuracy: number;
  macroF1: number;
  weightedF1: number;
  logLoss: number;
  kernelComputationTimeMs: number;
  trainingTimeMs: number;
  inferenceLatencyMs: number;
  quantumKernelAlignment?: number;
  description: string;
}

export interface QuantumKernelMatrixData {
  patientIds: string[];
  patientNames: string[];
  diseaseLabels: AutoimmuneDisease[];
  matrix: number[][]; // N x N values between 0.0 and 1.0
  kernelAlignmentScore: number; // QKA with target ideal kernel
  hilbertSpaceDimension: number; // 2^numQubits
  numQubits: number;
}

export interface AIRTNetAnalysisRequest {
  patientId?: string;
  diseaseType: AutoimmuneDisease;
  clinicalFeatures: Partial<PatientClinicalFeatures>;
  cdr3Sequences?: string[];
  recentViralEvent?: boolean;
}

export interface AIRTNetAnalysisResponse {
  patientId?: string;
  diseaseType: AutoimmuneDisease;
  quantumRiskScore: number;
  stageEstimate: DiseaseStage;
  recommendedTier: InterventionTier;
  topDifferentialDiagnoses: { disease: AutoimmuneDisease; probability: number }[];
  quantumFeatureMapDetails: {
    encodedQubits: number;
    hilbertSpaceDim: number;
    entanglementType: string;
    kernelAlignmentQKA: number;
    quantumAdvantageMargin: number;
  };
  summaryReasoning: string;
  shapAttributions: ShapAttribution[];
  biomarkerEvaluations: BiomarkerCausalEvaluation[];
  minimalInterventionPlan: MinimalInterventionPlan;
  regulatoryAuditTrail: {
    modelLockVersion: string;
    pccpCompliant: boolean;
    differentialPrivacyEpsilon: number;
    causalFilteringPassed: boolean;
  };
}

export interface PCCPAuditLog {
  id: string;
  timestamp: string;
  version: string;
  changeType: string;
  dsmbApprovalId: string;
  bridgingCohortValidationAccuracy: number;
  status: 'Deployed - Version Locked' | 'Under DSMB Review' | 'Pre-registered PCCP';
  details: string;
}
