import React, { useState } from 'react';
import { Cpu, Terminal, Sparkles, Building, CheckCircle2, Share2, Copy, Check, X, ExternalLink, Globe } from 'lucide-react';
import { Sucursal } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedSucursal: Sucursal | 'Todas';
  setSelectedSucursal: (sucursal: Sucursal | 'Todas') => void;
  wasmActive: boolean;
  totalExecutions: number;
  lastExecutionUs: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedSucursal,
  setSelectedSucursal,
  wasmActive,
  totalExecutions,
  lastExecutionUs,
}) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' && window.location.href.startsWith('http')
    ? window.location.origin
    : 'https://ais-pre-okw4sbzmw6byp46xmptipc-890071555543.us-east1.run.app';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };
  const navItems = [
    { id: 'dashboard', label: 'Tablero' },
    { id: 'colaboradores', label: 'Colaboradores' },
    { id: 'nomina', label: 'Planilla' },
    { id: 'calculadora', label: 'Leyes Laborales' },
    { id: 'uncsm', label: 'Alianza UNCSM' },
    { id: 'asistencia', label: 'Asistencia' },
    { id: 'wasm-studio', label: 'Motor C / Wasm' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar Contract: 3 zones, 1 row */}
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-700 transition-colors">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-slate-900 block whitespace-nowrap">
                  Techno-Verde RRHH
                </span>
                <span className="text-[11px] text-slate-500 font-medium block whitespace-nowrap">
                  Nicaragua · UNCSM
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Single-line, unboxed, quiet) */}
          <nav className="hidden md:flex items-center gap-6 overflow-x-auto py-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`text-sm font-medium whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
                    isActive
                      ? 'text-emerald-700 border-emerald-600 font-semibold'
                      : 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Share */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('wasm-studio')}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 hover:border-emerald-400 transition-colors whitespace-nowrap shrink-0"
              title="Ver motor ANSI C compilado a WebAssembly en ejecución"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-600" />
              <span className="tabular-nums">WASM: {lastExecutionUs > 0 ? `${lastExecutionUs}μs` : 'Activo'}</span>
            </button>

            <button
              onClick={() => setIsShareOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs"
              title="Compartir enlace de la aplicación"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Compartir</span>
            </button>
          </div>
        </div>

        {/* Sub-toolbar: Branch context selector */}
        <div className="flex items-center justify-between py-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-slate-500 shrink-0 font-medium">Sucursal:</span>
            {(['Todas', 'Managua', 'Masaya', 'Carazo', 'Granada'] as const).map((suc) => (
              <button
                key={suc}
                onClick={() => setSelectedSucursal(suc)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  selectedSucursal === suc
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {suc}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-3 text-slate-500 text-[11px]">
            <span>Leyes vigentes: Ley 185 · Ley 822 · INSS</span>
            <span aria-hidden="true">·</span>
            <span>Convenio UNCSM Activo</span>
          </div>
        </div>
      </div>

      {/* Share Modal Dialog */}
      {isShareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-sm">Compartir Techno-Verde RRHH</span>
              </div>
              <button
                onClick={() => setIsShareOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Utilice esta URL directa para compartir el sistema de gestión de recursos humanos de <strong>Techno-Verde S.A.</strong> (Reciclaje RAEE, Alianza UNCSM y motor C/WebAssembly).
              </p>

              <div className="space-y-1.5">
                <label className="block text-slate-700 font-semibold text-[11px] uppercase tracking-wider">
                  Enlace Público Compartible
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs text-slate-800 select-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-3 py-2 rounded-lg font-medium flex items-center gap-1.5 shrink-0 transition-colors ${
                      copied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {copied && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[11px] flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>¡Enlace copiado al portapapeles con éxito!</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Managua · Masaya · Carazo · Granada</span>
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 font-medium hover:underline flex items-center gap-1"
                >
                  <span>Abrir en nueva pestaña</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
