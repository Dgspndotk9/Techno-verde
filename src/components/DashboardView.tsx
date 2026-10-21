import React from 'react';
import { Colaborador, PasanteUNCSM, Sucursal, SucursalInfo } from '../types';
import {
  Users,
  GraduationCap,
  Recycle,
  Coins,
  MapPin,
  ShieldCheck,
  Scale,
  Zap,
  ArrowRight,
  ChevronRight,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import heroImage from '../assets/images/techno_verde_hero_1792623852391.jpg';

interface DashboardViewProps {
  colaboradores: Colaborador[];
  pasantes: PasanteUNCSM[];
  sucursales: SucursalInfo[];
  selectedSucursal: Sucursal | 'Todas';
  onNavigateTab: (tab: string) => void;
  onSelectSucursal: (sucursal: Sucursal) => void;
  wasmStatus: any;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  colaboradores,
  pasantes,
  sucursales,
  selectedSucursal,
  onNavigateTab,
  onSelectSucursal,
  wasmStatus,
}) => {
  // Filtered counts
  const filteredColaboradores = selectedSucursal === 'Todas'
    ? colaboradores
    : colaboradores.filter((c) => c.sucursal === selectedSucursal);

  const filteredPasantes = selectedSucursal === 'Todas'
    ? pasantes
    : pasantes.filter((p) => p.sucursalAsignada === selectedSucursal);

  const totalSalarioBase = filteredColaboradores.reduce((acc, c) => acc + c.salarioBaseCordobas, 0);

  return (
    <div className="space-y-8">
      {/* Hero Banner Section */}
      <section className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 text-white shadow-lg">
        <div className="relative min-h-[340px] flex flex-col justify-end p-6 sm:p-8 md:p-10 z-10">
          {/* Background image with measured contrast scrim */}
          <div className="absolute inset-0 -z-10">
            <img
              src={heroImage}
              alt="Planta de Reciclaje RAEE Techno-Verde Nicaragua"
              className="w-full h-full object-cover object-center opacity-30"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/40" />
          </div>

          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold tracking-wider uppercase">
              <span>Gestión de Talento & Cumplimiento Laboral</span>
              <span aria-hidden="true">·</span>
              <span>República de Nicaragua</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white text-balance">
              Techno-Verde S.A.
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Líderes en reciclaje y aprovechamiento de Residuos de Aparatos Eléctricos y Electrónicos (RAEE) en Managua, Masaya, Carazo y Granada. Operando bajo estricto apego al Código del Trabajo (Ley 185), Ley 822 y en alianza estratégica con la Universidad Nacional Casimiro Sotelo Montenegro (UNCSM).
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigateTab('nomina')}
                className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-2 shadow-xs"
              >
                <span>Procesar Planilla en C / Wasm</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigateTab('calculadora')}
                className="px-4 py-2 text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-600/80 rounded-lg transition-colors flex items-center gap-2"
              >
                <Scale className="w-4 h-4 text-emerald-400" />
                <span>Simulador Legal Nicaragua (Art. 45)</span>
              </button>

              <button
                onClick={() => onNavigateTab('uncsm')}
                className="px-4 py-2 text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-600/80 rounded-lg transition-colors flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span>Convenio UNCSM</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Column Metric Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Colaboradores Totales</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {filteredColaboradores.length}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {selectedSucursal === 'Todas' ? '102 colaboradores en 4 sedes' : `En sucursal ${selectedSucursal}`}
            </p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pasantes UNCSM</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {filteredPasantes.length}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Prácticas en Ambiental, Electrónica e Industrial
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Masa RAEE Procesada</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Recycle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {selectedSucursal === 'Todas' ? '73.5' : sucursales.find(s => s.id === selectedSucursal)?.capacidadToneladasMes ?? '15.0'} <span className="text-sm font-sans font-normal text-slate-500">Ton / mes</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Placas PCB, metales y plásticos técnicos
            </p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Planilla Base Mensual</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              C$ {totalSalarioBase.toLocaleString('es-NI')}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Moneda: Córdobas nicaragüenses (NIO)
            </p>
          </div>
        </div>
      </section>

      {/* 4 Sucursales Overview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Sucursales y Plantas Operativas en Nicaragua</h2>
            <p className="text-xs text-slate-500">Infraestructura de reciclaje, logística y laboratorios especializados</p>
          </div>
          {selectedSucursal !== 'Todas' && (
            <button
              onClick={() => onSelectSucursal('Managua')}
              className="text-xs text-emerald-700 font-semibold hover:underline"
            >
              Ver todas las sedes
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sucursales.map((suc) => {
            const isSelected = selectedSucursal === suc.id;
            return (
              <div
                key={suc.id}
                onClick={() => onSelectSucursal(suc.id)}
                className={`p-5 rounded-xl border transition-all cursor-pointer bg-white ${
                  isSelected
                    ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-bold text-slate-900 text-sm">{suc.ciudad}</h3>
                  </div>
                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {suc.totalColaboradores} pers.
                  </span>
                </div>

                <p className="text-xs font-medium text-emerald-800 line-clamp-1 mb-1">
                  {suc.nombre}
                </p>

                <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                  {suc.especialidadRaee}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Capacidad: <strong className="font-mono text-slate-700">{suc.capacidadToneladasMes} T/m</strong></span>
                  <span className="text-emerald-700 font-semibold">{suc.totalPasantesUncsm} pasantes UNCSM</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Nicaragua Labor Law & C/Wasm Engine Highlights */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Nicaragua Labor Laws */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Scale className="w-5 h-5 text-emerald-700" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Cumplimiento Legal y Laboral de Nicaragua</h3>
              <p className="text-xs text-slate-500">Parámetros auditados y codificados en el motor C / WebAssembly</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 block">Seguridad Social (INSS & INATEC)</span>
              <p className="text-slate-600 leading-relaxed">
                Retención laboral obligatoria del <strong className="text-slate-900">7.00%</strong> sobre salario total devengado. Aporte patronal del <strong className="text-slate-900">22.50%</strong> para empresas de más de 50 colaboradores + <strong className="text-slate-900">2.00%</strong> para formación técnica en INATEC.
              </p>
              <div className="text-[11px] font-mono text-emerald-800">Costo total patronal: 24.50%</div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 block">Impuesto sobre la Renta (Ley 822 DGI)</span>
              <p className="text-slate-600 leading-relaxed">
                Cálculo progresivo sobre el salario neto anual proyectado: exención hasta C$ 100,000 anuales; tramos del 15%, 20%, 25% y 30% según el Art. 23 de la Ley de Concertación Tributaria.
              </p>
              <div className="text-[11px] font-mono text-emerald-800">Deducción de INSS previa a base gravable</div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 block">Código del Trabajo (Ley 185)</span>
              <p className="text-slate-600 leading-relaxed">
                Vacaciones remuneradas: <strong className="text-slate-900">2.5 días por mes</strong> (15 continuos cada 6 meses). Décimo Tercer Mes (Aguinaldo, Art. 93) inembargable y exento de retenciones.
              </p>
              <div className="text-[11px] font-mono text-emerald-800">Horas extras con recargo legal del 100% (Art. 56)</div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 block">Indemnización por Antigüedad (Art. 45)</span>
              <p className="text-slate-600 leading-relaxed">
                1 mes de salario por cada uno de los 3 primeros años; 20 días por año a partir del 4to año. Tope máximo de 5 meses de salario ordinario.
              </p>
              <div className="text-[11px] font-mono text-emerald-800">Fracciones de año calculadas proporcionalmente</div>
            </div>
          </div>
        </div>

        {/* Card 2: WebAssembly Engine Status */}
        <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm">Motor C / WebAssembly</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                WASM NATIVO
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Los algoritmos financieros y cálculos de planilla están escritos en código C puro (<code className="text-emerald-300">techno_verde_labor_engine.c</code>) y compilados a binario WebAssembly para garantizar máxima velocidad y total certeza matemática.
            </p>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Versión Wasm:</span>
                <span className="text-emerald-400">{wasmStatus.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ejecuciones:</span>
                <span className="tabular-nums font-semibold">{wasmStatus.totalExecutions} llamadas</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Última latencia:</span>
                <span className="text-emerald-400 tabular-nums">{wasmStatus.lastExecutionDurationUs} μs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Páginas de memoria:</span>
                <span>{wasmStatus.memoryPages} (64 KB)</span>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => onNavigateTab('wasm-studio')}
              className="w-full py-2 px-3 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>Ver Código C & Sandbox Wasm</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
