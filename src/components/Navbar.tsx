import React from 'react';
import { Dna, ShieldCheck, Activity, LineChart, Sliders, Cpu, FileCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: 'cohort' | 'inspector' | 'simulator' | 'pipeline' | 'audit';
  setActiveTab: (tab: 'cohort' | 'inspector' | 'simulator' | 'pipeline' | 'audit') => void;
  selectedDisease: string;
  setSelectedDisease: (disease: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedDisease,
  setSelectedDisease,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-50 shadow-md">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Dna className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                AIRT-Net
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/80 font-medium">
                Autoimmune Risk Trajectory
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Reference-Free Early Detection & Minimal-Intervention Platform
            </p>
          </div>
        </div>

        {/* SaMD Lock Status & Quick Filters */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">FDA PCCP SaMD Locked (v1.4.0)</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-800/80 rounded-lg p-1 border border-slate-700/60">
            <span className="text-slate-400 px-2 font-medium">Disease:</span>
            <select
              value={selectedDisease}
              onChange={(e) => setSelectedDisease(e.target.value)}
              className="bg-slate-900 text-slate-200 rounded px-2 py-1 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Autoimmune Cohorts</option>
              <option value="Type 1 Diabetes">Type 1 Diabetes (T1D)</option>
              <option value="Rheumatoid Arthritis">Rheumatoid Arthritis (RA)</option>
              <option value="Multiple Sclerosis">Multiple Sclerosis (MS)</option>
              <option value="Systemic Lupus Erythematosus">Systemic Lupus (SLE)</option>
              <option value="Coeliac Disease">Coeliac Disease</option>
              <option value="Hashimoto Thyroiditis">Hashimoto Thyroiditis</option>
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('cohort')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'cohort'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Cohort Matrix & Triage</span>
          </button>

          <button
            onClick={() => setActiveTab('inspector')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'inspector'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <LineChart className="w-4 h-4" />
            <span>Multi-Omic Patient Inspector</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'simulator'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Minimal Intervention Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'pipeline'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>Live AI Pipeline Executor</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'audit'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>SaMD & PCCP Audit</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
