import React, { useState, useEffect } from 'react';
import { Patient } from './types';
import { MOCK_PATIENTS } from './data/mockPatients';
import { Navbar } from './components/Navbar';
import { CohortMatrix } from './components/CohortMatrix';
import { PatientInspector } from './components/PatientInspector';
import { InterventionSimulator } from './components/InterventionSimulator';
import { PipelineExecutor } from './components/PipelineExecutor';
import { AuditGovernance } from './components/AuditGovernance';
import { Dna, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'cohort' | 'inspector' | 'simulator' | 'pipeline' | 'audit'>('cohort');
  const [selectedDisease, setSelectedDisease] = useState<string>('All');
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState<Patient>(MOCK_PATIENTS[0]);

  // Fetch initial patient cohort from Express backend
  useEffect(() => {
    fetch('/api/patients')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.patients && data.patients.length > 0) {
          setPatients(data.patients);
        }
      })
      .catch((err) => console.log('Using pre-loaded mock cohort data:', err));
  }, []);

  const handleSelectPatient = (p: Patient) => {
    setSelectedPatient(p);
    setActiveTab('inspector');
  };

  const handleSimulatePatient = (p: Patient) => {
    setSelectedPatient(p);
    setActiveTab('simulator');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
      {/* Top Navbar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedDisease={selectedDisease}
        setSelectedDisease={setSelectedDisease}
      />

      {/* Main Container Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'cohort' && (
          <CohortMatrix
            patients={patients}
            onSelectPatient={handleSelectPatient}
            onSimulatePatient={handleSimulatePatient}
            selectedDisease={selectedDisease}
          />
        )}

        {activeTab === 'inspector' && (
          <PatientInspector
            patient={selectedPatient}
            onSimulate={handleSimulatePatient}
          />
        )}

        {activeTab === 'simulator' && (
          <InterventionSimulator
            patients={patients}
            selectedPatient={selectedPatient}
            onSelectPatient={setSelectedPatient}
          />
        )}

        {activeTab === 'pipeline' && <PipelineExecutor />}

        {activeTab === 'audit' && <AuditGovernance />}
      </main>

      {/* Footer Banner */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="p-1 bg-indigo-600 rounded text-white">
              <Dna className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-200">AIRT-Net Autoimmune Platform</span>
            <span>— Reference-Free Early Detection & Minimal-Intervention Framework</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <span className="flex items-center space-x-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>FDA PCCP SaMD Version Locked</span>
            </span>
            <span>•</span>
            <span>Teplizumab (Tzield) Stage 2 T1D Approval Precedent</span>
            <span>•</span>
            <span>Mendelian Randomization Causal Safeguard</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
