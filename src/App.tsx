import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { EmployeesView } from './components/EmployeesView';
import { PayrollView } from './components/PayrollView';
import { LegalCalculatorView } from './components/LegalCalculatorView';
import { UncsmAllianceView } from './components/UncsmAllianceView';
import { AttendanceLeavesView } from './components/AttendanceLeavesView';
import { WasmConsoleView } from './components/WasmConsoleView';
import {
  COLABORADORES_INICIALES,
  PASANTES_UNCSM_DETALLE,
  SUCURSALES_TECHNO_VERDE,
  PERMISOS_INICIALES,
  ASISTENCIAS_RECIENTES,
} from './data/initialData';
import { Colaborador, PasanteUNCSM, PermisoLaboral, RegistroAsistencia, Sucursal } from './types';
import { wasmEngine } from './wasm/wasmEngine';
import { Leaf, GraduationCap, Scale, Cpu } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedSucursal, setSelectedSucursal] = useState<Sucursal | 'Todas'>('Todas');
  const [colaboradores, setColaboradores] = useState<Colaborador[]>(COLABORADORES_INICIALES);
  const [pasantes, setPasantes] = useState<PasanteUNCSM[]>(PASANTES_UNCSM_DETALLE);
  const [permisos, setPermisos] = useState<PermisoLaboral[]>(PERMISOS_INICIALES);
  const [asistencias, setAsistencias] = useState<RegistroAsistencia[]>(ASISTENCIAS_RECIENTES);
  const [wasmStatus, setWasmStatus] = useState(wasmEngine.getStatus());

  useEffect(() => {
    // Refresh Wasm status
    setWasmStatus(wasmEngine.getStatus());
  }, [activeTab]);

  const handleAddColaborador = (nuevo: Colaborador) => {
    setColaboradores((prev) => [nuevo, ...prev]);
    setWasmStatus(wasmEngine.getStatus());
  };

  const handleUpdateColaborador = (actualizado: Colaborador) => {
    setColaboradores((prev) =>
      prev.map((c) => (c.id === actualizado.id ? actualizado : c))
    );
    setWasmStatus(wasmEngine.getStatus());
  };

  const handleAddPasante = (nuevo: PasanteUNCSM) => {
    setPasantes((prev) => [nuevo, ...prev]);
  };

  const handleAddPermiso = (nuevo: PermisoLaboral) => {
    setPermisos((prev) => [nuevo, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Header with Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedSucursal={selectedSucursal}
        setSelectedSucursal={setSelectedSucursal}
        wasmActive={wasmStatus.isLoaded}
        totalExecutions={wasmStatus.totalExecutions}
        lastExecutionUs={wasmStatus.lastExecutionDurationUs}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            colaboradores={colaboradores}
            pasantes={pasantes}
            sucursales={SUCURSALES_TECHNO_VERDE}
            selectedSucursal={selectedSucursal}
            onNavigateTab={setActiveTab}
            onSelectSucursal={(suc) => setSelectedSucursal(suc)}
            wasmStatus={wasmStatus}
          />
        )}

        {activeTab === 'colaboradores' && (
          <EmployeesView
            colaboradores={colaboradores}
            onAddColaborador={handleAddColaborador}
            onUpdateColaborador={handleUpdateColaborador}
            selectedSucursal={selectedSucursal}
          />
        )}

        {activeTab === 'nomina' && (
          <PayrollView
            colaboradores={colaboradores}
            selectedSucursal={selectedSucursal}
          />
        )}

        {activeTab === 'calculadora' && (
          <LegalCalculatorView />
        )}

        {activeTab === 'uncsm' && (
          <UncsmAllianceView
            pasantes={pasantes}
            onAddPasante={handleAddPasante}
            selectedSucursal={selectedSucursal}
          />
        )}

        {activeTab === 'asistencia' && (
          <AttendanceLeavesView
            asistencias={asistencias}
            permisos={permisos}
            onAddPermiso={handleAddPermiso}
            selectedSucursal={selectedSucursal}
          />
        )}

        {activeTab === 'wasm-studio' && (
          <WasmConsoleView />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-800">Techno-Verde S.A.</span>
            <span aria-hidden="true">·</span>
            <span>Plantas en Managua, Masaya, Carazo y Granada</span>
            <span aria-hidden="true">·</span>
            <span>Convenio UNCSM No. 2024-08</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Código del Trabajo (Ley 185)</span>
            <span aria-hidden="true">·</span>
            <span>Ley 822 (DGI)</span>
            <span aria-hidden="true">·</span>
            <span>Motor ANSI C / WebAssembly</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
