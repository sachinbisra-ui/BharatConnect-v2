import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  Award,
  Search,
  Filter,
  ChevronRight,
  X,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  FileCheck2,
  AlertTriangle,
  Lock,
  Globe,
  Info,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { TrustSealMotif } from './TrustSealMotif';
import { MOCK_INSTITUTIONS } from '../data/mockData';
import { Institution } from '../types';

export const InstitutionsScreen: React.FC = () => {
  const [institutions, setInstitutions] = useState<Institution[]>(MOCK_INSTITUTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInst, setSelectedInst] = useState<Institution | null>(null);

  const filteredInstitutions = institutions.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-20 sm:pb-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-[#0A1F44] text-white rounded-2xl p-5 border border-slate-700/60 shadow-md">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 bg-blue-500/20 rounded-lg border border-blue-400/30">
            <Building2 size={16} className="text-blue-300" />
          </div>
          <h2 className="text-lg font-display font-bold text-white">
            Institution Trust Registry (Demo)
          </h2>
        </div>
        <p className="text-xs text-slate-300">
          Verify institutions before sharing consents. Trust works both ways in BharatConnect.
        </p>

        {/* Prototype notice */}
        <div className="mt-3 p-2.5 bg-white/10 rounded-xl text-[11px] text-slate-200 flex items-center gap-2">
          <Info size={13} className="text-amber-300 shrink-0" />
          <span>All institutions and compliance certificates shown are fictional demo mocks.</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search registered banks, telecom, fintechs..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#0A1F44]"
          />
        </div>
      </div>

      {/* Directory Cards */}
      <div className="space-y-2.5">
        {filteredInstitutions.map((inst) => (
          <div
            key={inst.id}
            onClick={() => setSelectedInst(inst)}
            className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer hover:border-[#0A1F44] hover:shadow-sm ${
              inst.isSuspicious
                ? 'border-red-300 bg-red-50/20'
                : 'border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl shrink-0">
                  {inst.logo}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-xs text-slate-900">{inst.name}</h3>
                    <StatusBadge status={inst.status} size="sm" />
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">{inst.category}</p>
                  <p className="text-xs text-slate-600 mt-1 leading-snug line-clamp-2">
                    {inst.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0">
                <div className="flex items-baseline gap-1">
                  <span
                    className={`font-display font-black text-sm ${
                      inst.isSuspicious ? 'text-red-600' : 'text-[#0A1F44]'
                    }`}
                  >
                    {inst.trustScore}
                  </span>
                  <span className="text-[10px] text-slate-400">/ 1000</span>
                </div>
                <ChevronRight size={16} className="text-slate-400 mt-2" />
              </div>
            </div>

            {inst.warningNote && (
              <div className="mt-3 p-2 bg-red-100/80 border border-red-300 rounded-lg text-red-900 text-[11px] font-semibold flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-red-700 shrink-0" />
                <span>{inst.warningNote}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Detail for Selected Institution */}
      {selectedInst && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-[#0A1F44] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-xl">
                  {selectedInst.logo}
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-white">{selectedInst.name}</h3>
                  <span className="text-xs text-amber-300 font-medium">{selectedInst.category}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedInst(null)}
                className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
              {/* Status and Score Row */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Trust Level</span>
                  <StatusBadge status={selectedInst.status} size="md" className="mt-1" />
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Demo Institutional Score</span>
                  <span className="text-xl font-display font-black text-[#0A1F44]">
                    {selectedInst.trustScore} <span className="text-xs font-normal text-slate-400">/ 1000</span>
                  </span>
                </div>
              </div>

              {selectedInst.warningNote && (
                <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-red-900 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle size={15} className="text-red-700" />
                    <span>CONSORTIUM BLACKLIST WARNING</span>
                  </div>
                  <p className="text-[11px] text-red-800">{selectedInst.warningNote}</p>
                </div>
              )}

              {/* Description */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
                  Institutional Scope
                </h4>
                <p className="text-slate-600 leading-relaxed">{selectedInst.description}</p>
              </div>

              {/* Signals Breakdown */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-700" />
                  "Why is this institution verified?" Signal Breakdown
                </h4>

                <div className="space-y-2">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800 block text-[10px] uppercase">
                      1. Regulatory License Attestation:
                    </span>
                    <span className="text-slate-600 text-[11px] font-mono">
                      {selectedInst.signalsBreakdown.regulatory}
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800 block text-[10px] uppercase">
                      2. Domain & TLS Cryptographic Binding:
                    </span>
                    <span className="text-slate-600 text-[11px] font-mono">
                      {selectedInst.signalsBreakdown.domainBinding}
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800 block text-[10px] uppercase">
                      3. Independent Security Audit Record:
                    </span>
                    <span className="text-slate-600 text-[11px] font-mono">
                      {selectedInst.signalsBreakdown.securityAudit}
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800 block text-[10px] uppercase">
                      4. Operational Integrity:
                    </span>
                    <span className="text-slate-600 text-[11px]">
                      {selectedInst.signalsBreakdown.operationalIntegrity}
                    </span>
                  </div>
                </div>
              </div>

              {/* Demo Contact Information */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <h4 className="font-bold text-slate-900 text-[11px] uppercase tracking-wider mb-1">
                  Demo Contact & Compliance Office
                </h4>
                <p className="text-[11px] text-slate-600 flex items-center gap-1.5">
                  <Mail size={12} className="text-slate-400" /> {selectedInst.demoContact.email}
                </p>
                <p className="text-[11px] text-slate-600 flex items-center gap-1.5">
                  <Phone size={12} className="text-slate-400" /> {selectedInst.demoContact.phone}
                </p>
                <p className="text-[11px] text-slate-600 flex items-center gap-1.5">
                  <FileCheck2 size={12} className="text-slate-400" /> License: {selectedInst.demoContact.license}
                </p>
                <p className="text-[11px] text-slate-600 flex items-center gap-1.5">
                  <MapPin size={12} className="text-slate-400" /> {selectedInst.demoContact.address}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedInst(null)}
                className="px-5 py-2 bg-[#0A1F44] hover:bg-[#0d2a5c] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Close Registry Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
