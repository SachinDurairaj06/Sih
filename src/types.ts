export type AutoimmuneDisease = 
  | 'Type 1 Diabetes'
  | 'Rheumatoid Arthritis'
  | 'Multiple Sclerosis'
  | 'Systemic Lupus Erythematosus'
  | 'Coeliac Disease'
  | 'Hashimoto Thyroiditis';

export type InterventionTier = 'Tier 0' | 'Tier 1' | 'Tier 2' | 'Tier 3';

export type DiseaseStage = 'Stage 0' | 'Stage 1' | 'Stage 2' | 'Stage 3';

export interface LongitudinalVisit {
  visitDate: string; // e.g. "2024-03", "2024-09"
  ageYears: number;
  autoantibodyTitres: Record<string, number>; // e.g. { GAD65: 45, IA2: 120, ZnT8: 15 }
  cPeptideOrFunctionMetric: number; // e.g. C-peptide (pmol/L) or Joint Erosion Index or Neurofilament Light
  cytokines: Record<string, number>; // e.g. { IFNg: 12.4, IL6: 8.1, CXCL10: 45.2 }
  microbiomeDysbiosisIndex: number; // 0.0 to 1.0 (1.0 = severe dysbiosis)
  wearableGlycemicOrActivityScore: number; // e.g., 88% in-range or joint stiffness index
  calculatedRiskScore: number; // 0.00 to 1.00
}

export interface CDR3ClusterPoint {
  id: string;
  sequence: string; // e.g. "CASSLGRAGEQFF"
  umapX: number;
  umapY: number;
  clusterId: number;
  clusterName: string;
  isAutoreactiveCluster: boolean;
  isReferenceCatalogued: boolean; // false = reference-free novel cluster
  enrichmentScoreVsControl: number; // e.g. 4.2x
  knownTargetEpitope?: string; // e.g. "GAD65 (247-266)" or "Uncatalogued Neo-Epitope #104"
}

export interface BiomarkerCausalEvaluation {
  biomarkerName: string;
  category: 'Autoantibody' | 'Repertoire Cluster' | 'Cytokine' | 'Microbiome' | 'Genetic/EHR' | 'EHR / Lab' | string;
  mendelianRandomizationPValue: number;
  doublyRobustEffectSize: number;
  isCausalDriver: boolean; // true = causal, false = bystander (e.g. transient viral spike)
  explanation: string;
}

export interface ShapAttribution {
  featureName: string;
  shapValue: number; // positive = pushes risk higher, negative = lowers risk
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

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Female' | 'Male';
  diseaseType: AutoimmuneDisease;
  hlaAlleles: string[]; // e.g. ["HLA-DR3-DQ2", "HLA-DR4-DQ8"]
  polygenicRiskPercentile: number; // e.g. 94th percentile
  stage: DiseaseStage;
  currentTier: InterventionTier;
  currentRiskScore: number; // 0.00 to 1.00
  seroconversionStatus: 'Negative' | 'Single Autoantibody Positive' | 'Multiple Autoantibody Positive';
  lastVisitDate: string;
  visits: LongitudinalVisit[];
  immuneRepertoireClusters: CDR3ClusterPoint[];
  biomarkerEvaluations: BiomarkerCausalEvaluation[];
  shapAttributions: ShapAttribution[];
  interventionPlan: MinimalInterventionPlan;
  interventionSimulated?: {
    interventionName: string;
    projectedRiskScoreIn24Months: number;
    delayToStage3Months: number;
  };
}

export interface AIRTNetAnalysisRequest {
  patientId?: string;
  diseaseType: AutoimmuneDisease;
  age: number;
  autoantibodyTitres: Record<string, number>;
  cdr3Sequences: string[];
  cytokinePanel: Record<string, number>;
  microbiomeDysbiosis: number;
  recentViralEvent: boolean;
}

export interface AIRTNetAnalysisResponse {
  patientId?: string;
  diseaseType: AutoimmuneDisease;
  riskScore: number;
  stageEstimate: DiseaseStage;
  recommendedTier: InterventionTier;
  referenceFreeClustersFound: number;
  causalBiomarkersCount: number;
  bystanderBiomarkersCount: number;
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
