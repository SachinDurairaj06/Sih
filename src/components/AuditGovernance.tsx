import React, { useEffect, useState } from 'react';
import { PCCPAuditLog } from '../types';
import { ShieldCheck, FileCheck, Lock, Dna, Database, AlertCircle, RefreshCw } from 'lucide-react';

export const AuditGovernance: React.FC = () => {
  const [pccpData, setPccpData] = useState<{
    modelLockStatus: string;
    pccpApproved: boolean;
    dsmbProtocol: string;
    differentialPrivacyEpsilon: number;
    auditLogs: PCCPAuditLog[];
  } | null>(null);

  useEffect(() => {
    fetch('/api/audit/pccp')
      .then((res) => res.json())
      .then((data) => setPccpData(data))
      .catch((err) => console.error('Error fetching audit logs:', err));
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h2 className="text-xl font-bold tracking-tight">
                SaMD Regulatory Compliance & Change Control Audit Center
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Predetermined Change Control Plan (PCCP) enforcement under FDA CDRH, EU AI Act, and ICH E6(R3) GCP frameworks.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <div className="px-3 py-1.5 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-lg font-bold flex items-center space-x-1.5">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Model Lock: Version 1.4.0</span>
            </div>
          </div>
        </div>

        {/* Regulatory Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700/80 text-xs">
            <span className="text-slate-400 block">FDA SaMD Classification</span>
            <span className="text-sm font-bold text-white mt-0.5 block">Class II Clinical Decision Support</span>
            <span className="text-[10px] text-emerald-400 mt-1 block">Clinician-in-the-Loop Enforced</span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700/80 text-xs">
            <span className="text-slate-400 block">Differential Privacy Parameter</span>
            <span className="text-sm font-bold text-indigo-300 mt-0.5 block">ε = 0.5 (Epsilon Locked)</span>
            <span className="text-[10px] text-slate-400 mt-1 block">Zero Re-identification Risk</span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700/80 text-xs">
            <span className="text-slate-400 block">DSMB Oversight Protocol</span>
            <span className="text-sm font-bold text-purple-300 mt-0.5 block">
              {pccpData?.dsmbProtocol || 'DSMB-FDA-2026-041'}
            </span>
            <span className="text-[10px] text-purple-400 mt-1 block">Pre-registered Changes Only</span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700/80 text-xs">
            <span className="text-slate-400 block">EU AI Act Conformity</span>
            <span className="text-sm font-bold text-emerald-300 mt-0.5 block">High-Risk Annex III Annexed</span>
            <span className="text-[10px] text-emerald-400 mt-1 block">Full Human Oversight Ready</span>
          </div>
        </div>
      </div>

      {/* PCCP Audit Logs Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Predetermined Change Control Plan (PCCP) Deployment Logs
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Version-locked model retrain history across federated multi-ethnic health system cohorts.
            </p>
          </div>

          <button className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 font-medium flex items-center space-x-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Verify Checksum</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">PCCP Version</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Change Type</th>
                <th className="px-4 py-3">Bridging Cohort Acc.</th>
                <th className="px-4 py-3">DSMB Approval</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {pccpData?.auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-3.5 font-bold font-mono text-indigo-600 dark:text-indigo-400">
                    {log.version}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-900 dark:text-slate-100">
                    {log.changeType}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {(log.bridgingCohortValidationAccuracy * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 font-mono">
                    {log.dsmbApprovalId}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
