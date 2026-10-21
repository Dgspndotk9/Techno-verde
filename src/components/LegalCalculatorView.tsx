import React, { useState } from 'react';
import { wasmEngine, FiniquitoCalculado } from '../wasm/wasmEngine';
import {
  Scale,
  Calculator,
  Calendar,
  AlertCircle,
  FileCheck2,
  DollarSign,
  Clock,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export const LegalCalculatorView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'art45' | 'aguinaldo' | 'ir822' | 'horasExtras'>('art45');

  // SubTab 1: Art 45 Finiquito State
  const [salarioMensualArt45, setSalarioMensualArt45] = useState(25000);
  const [anosLaborados, setAnosLaborados] = useState(3.5);
  const [diasAguinaldo, setDiasAguinaldo] = useState(210);
  const [diasVacaciones, setDiasVacaciones] = useState(12.5);

  // SubTab 2: Aguinaldo State
  const [salarioAguinaldo, setSalarioAguinaldo] = useState(20000);
  const [diasAguinaldoCalc, setDiasAguinaldoCalc] = useState(360);

  // SubTab 3: IR Ley 822 State
  const [salarioBrutoIr, setSalarioBrutoIr] = useState(35000);

  // SubTab 4: Horas Extras State
  const [salarioHorasExtras, setSalarioHorasExtras] = useState(18000);
  const [numHorasExtras, setNumHorasExtras] = useState(12);
  const [esFeriado, setEsFeriado] = useState(false);

  // Computations with C / Wasm
  const finiquitoResult: FiniquitoCalculado = wasmEngine.calcularLiquidacionCompleta(
    salarioMensualArt45,
    anosLaborados,
    diasAguinaldo,
    diasVacaciones
  );

  const aguinaldoResult = wasmEngine.calcularAguinaldoProporcional(salarioAguinaldo, diasAguinaldoCalc);

  // IR 822 Breakdown
  const inssLaboralIr = wasmEngine.calcularInssLaboral(salarioBrutoIr);
  const gravableMensualIr = salarioBrutoIr - inssLaboralIr;
  const gravableAnualIr = gravableMensualIr * 12;
  const irMensualCalculado = wasmEngine.calcularIrMensual(salarioBrutoIr);
  const irAnualCalculado = irMensualCalculado * 12;

  // Horas Extras computation
  const pagoHorasExtrasResult = wasmEngine.calcularPagoHorasExtras(
    salarioHorasExtras,
    numHorasExtras,
    esFeriado
  );
  const valorHoraOrdinaria = salarioHorasExtras / 240;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-700" />
            <span>Simulador de Leyes Laborales de Nicaragua (C / Wasm)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Cálculos auditados conforme al Código del Trabajo (Ley 185) y Ley de Concertación Tributaria (Ley 822)
          </p>
        </div>

        {/* SubTab switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveSubTab('art45')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeSubTab === 'art45' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Liquidación Art. 45
          </button>
          <button
            onClick={() => setActiveSubTab('aguinaldo')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeSubTab === 'aguinaldo' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Aguinaldo Art. 93
          </button>
          <button
            onClick={() => setActiveSubTab('ir822')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeSubTab === 'ir822' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            IR Progresivo Ley 822
          </button>
          <button
            onClick={() => setActiveSubTab('horasExtras')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeSubTab === 'horasExtras' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Horas Extras
          </button>
        </div>
      </div>

      {/* SubTab 1: Liquidación e Indemnización Art. 45 */}
      {activeSubTab === 'art45' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
              <span>Parámetros de Liquidación Laboral</span>
              <span className="text-[11px] font-mono font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                Art. 45 Ley 185
              </span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Último Salario Ordinario Mensual (C$ Córdobas)
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={salarioMensualArt45}
                  onChange={(e) => setSalarioMensualArt45(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-sm font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Antigüedad Laboral Efectiva (Años y fracciones)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="40"
                    step="0.1"
                    value={anosLaborados}
                    onChange={(e) => setAnosLaborados(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-sm font-semibold focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-slate-500 text-xs shrink-0">años</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Ej: 3.5 = 3 años y 6 meses.
                </p>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Días Acumulados de Vacaciones Pendientes (Art. 76)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="60"
                    step="0.5"
                    value={diasVacaciones}
                    onChange={(e) => setDiasVacaciones(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-sm font-semibold focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-slate-500 text-xs shrink-0">días</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">2.5 días acumulados por mes laborado.</p>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Días Trabajados en el Período de Aguinaldo (Art. 93)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="360"
                    value={diasAguinaldo}
                    onChange={(e) => setDiasAguinaldo(Math.max(0, Math.min(360, Number(e.target.value) || 0)))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-sm font-semibold focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-slate-500 text-xs shrink-0">días / 360</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Días transcurridos desde el 1 de diciembre.</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
              <p><strong>Tope legal Art. 45:</strong> 5 meses máximos de salario.</p>
              <p><strong>Exención:</strong> El décimo tercer mes está totalmente exento de retenciones (Art. 93).</p>
            </div>
          </div>

          {/* Results breakdown */}
          <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="font-bold text-slate-900 text-sm">Desglose Legal del Finiquito</span>
                <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                  Calculado en {finiquitoResult.tiempoMicrosegundos} μs por Wasm
                </span>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                {/* 1. Indemnización por antigüedad */}
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 block">1. Indemnización por Antigüedad (Art. 45)</span>
                    <span className="text-[11px] text-slate-500">
                      {anosLaborados <= 3
                        ? `${anosLaborados} meses de salario (1 mes/año primeros 3 años)`
                        : `3 meses + ${((anosLaborados - 3) * (20/30)).toFixed(2)} meses (20 días/año sig., tope 5m)`}
                    </span>
                  </div>
                  <span className="text-base font-bold font-mono tabular-nums text-slate-900">
                    C$ {finiquitoResult.indemnizacionArt45.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* 2. Aguinaldo proporcional */}
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 block">2. Décimo Tercer Mes Proporcional (Art. 93)</span>
                    <span className="text-[11px] text-slate-500">
                      {diasAguinaldo} días computables de 360 días del ciclo
                    </span>
                  </div>
                  <span className="text-base font-bold font-mono tabular-nums text-slate-900">
                    C$ {finiquitoResult.aguinaldoProporcional.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* 3. Vacaciones pendientes */}
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 block">3. Vacaciones Remuneradas Pendientes (Art. 76)</span>
                    <span className="text-[11px] text-slate-500">
                      {diasVacaciones} días pendientes x C$ {(salarioMensualArt45 / 30).toFixed(2)} / día
                    </span>
                  </div>
                  <span className="text-base font-bold font-mono tabular-nums text-slate-900">
                    C$ {finiquitoResult.vacacionesMonto.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Total Highlight */}
            <div className="p-5 bg-emerald-900 text-white rounded-xl flex items-center justify-between shadow-xs">
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold block">
                  Total de Finiquito a Pagar al Trabajador
                </span>
                <span className="text-xs text-emerald-200">
                  Cheque / Transferencia en Córdobas (NIO)
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white">
                  C$ {finiquitoResult.totalLiquidacion.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 2: Aguinaldo Art. 93 */}
      {activeSubTab === 'aguinaldo' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs max-w-2xl space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Décimo Tercer Mes / Aguinaldo (Art. 93-99 Ley 185)</h3>
            <p className="text-xs text-slate-500">
              Derecho irrenunciable e inembargable que debe pagarse en los primeros 10 días de diciembre en Nicaragua.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Salario Ordinario Mensual (C$)</label>
              <input
                type="number"
                value={salarioAguinaldo}
                onChange={(e) => setSalarioAguinaldo(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-sm font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Días Laborados en el Período (1 dic - 30 nov)</label>
              <input
                type="number"
                min="1"
                max="360"
                value={diasAguinaldoCalc}
                onChange={(e) => setDiasAguinaldoCalc(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-sm font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-950 block">Monto Neto de Aguinaldo</span>
              <span className="text-[11px] text-emerald-800">Totalmente inafecto de deducciones de INSS e IR (Art. 97)</span>
            </div>
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-900">
              C$ {aguinaldoResult.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      )}

      {/* SubTab 3: IR Progresivo Ley 822 */}
      {activeSubTab === 'ir822' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Tabla Progresiva del IR Laboral (Ley 822 - Nicaragua)</h3>
                <p className="text-xs text-slate-500">
                  Cálculo anualizado con base imponible después de retener el 7% de INSS Laboral
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 font-medium">Salario Bruto a Evaluar:</span>
                <input
                  type="number"
                  step="1000"
                  value={salarioBrutoIr}
                  onChange={(e) => setSalarioBrutoIr(Number(e.target.value) || 0)}
                  className="w-36 px-3 py-1.5 border border-slate-200 rounded-lg font-mono text-sm font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Calculations cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[11px]">1. Salario Bruto Mensual:</span>
                <span className="font-bold text-slate-900 text-sm">C$ {salarioBrutoIr.toLocaleString('es-NI')}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[11px]">2. Menos INSS Lab (7%):</span>
                <span className="font-bold text-red-600 text-sm">- C$ {inssLaboralIr.toLocaleString('es-NI')}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[11px]">3. Proyección Anual Gravable:</span>
                <span className="font-bold text-slate-900 text-sm">C$ {gravableAnualIr.toLocaleString('es-NI')}</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <span className="text-emerald-800 block text-[11px]">4. Retención IR Mensual:</span>
                <span className="font-bold text-emerald-900 text-sm">C$ {irMensualCalculado.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Visual Brackets Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Estrato Anual (C$)</th>
                    <th className="py-2.5 px-3 text-right">Impuesto Base</th>
                    <th className="py-2.5 px-3 text-right">Porcentaje Exceso</th>
                    <th className="py-2.5 px-3 text-right">Sobre Exceso de</th>
                    <th className="py-2.5 px-3 text-center">Estado del Salario Ingresado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  <tr className={gravableAnualIr <= 100000 ? 'bg-emerald-50/70 font-semibold text-emerald-950' : ''}>
                    <td className="py-2.5 px-3 font-sans">C$ 0.01 a C$ 100,000.00</td>
                    <td className="py-2.5 px-3 text-right">C$ 0.00</td>
                    <td className="py-2.5 px-3 text-right">0%</td>
                    <td className="py-2.5 px-3 text-right">C$ 0.00</td>
                    <td className="py-2.5 px-3 text-center font-sans">
                      {gravableAnualIr <= 100000 ? 'Exento (Tramo Activo)' : 'Completado'}
                    </td>
                  </tr>
                  <tr className={gravableAnualIr > 100000 && gravableAnualIr <= 200000 ? 'bg-emerald-50/70 font-semibold text-emerald-950' : ''}>
                    <td className="py-2.5 px-3 font-sans">C$ 100,000.01 a C$ 200,000.00</td>
                    <td className="py-2.5 px-3 text-right">C$ 0.00</td>
                    <td className="py-2.5 px-3 text-right">15%</td>
                    <td className="py-2.5 px-3 text-right">C$ 100,000.00</td>
                    <td className="py-2.5 px-3 text-center font-sans">
                      {gravableAnualIr > 100000 && gravableAnualIr <= 200000 ? 'Tramo Activo' : '-'}
                    </td>
                  </tr>
                  <tr className={gravableAnualIr > 200000 && gravableAnualIr <= 350000 ? 'bg-emerald-50/70 font-semibold text-emerald-950' : ''}>
                    <td className="py-2.5 px-3 font-sans">C$ 200,000.01 a C$ 350,000.00</td>
                    <td className="py-2.5 px-3 text-right">C$ 15,000.00</td>
                    <td className="py-2.5 px-3 text-right">20%</td>
                    <td className="py-2.5 px-3 text-right">C$ 200,000.00</td>
                    <td className="py-2.5 px-3 text-center font-sans">
                      {gravableAnualIr > 200000 && gravableAnualIr <= 350000 ? 'Tramo Activo' : '-'}
                    </td>
                  </tr>
                  <tr className={gravableAnualIr > 350000 && gravableAnualIr <= 500000 ? 'bg-emerald-50/70 font-semibold text-emerald-950' : ''}>
                    <td className="py-2.5 px-3 font-sans">C$ 350,000.01 a C$ 500,000.00</td>
                    <td className="py-2.5 px-3 text-right">C$ 45,000.00</td>
                    <td className="py-2.5 px-3 text-right">25%</td>
                    <td className="py-2.5 px-3 text-right">C$ 350,000.00</td>
                    <td className="py-2.5 px-3 text-center font-sans">
                      {gravableAnualIr > 350000 && gravableAnualIr <= 500000 ? 'Tramo Activo' : '-'}
                    </td>
                  </tr>
                  <tr className={gravableAnualIr > 500000 ? 'bg-emerald-50/70 font-semibold text-emerald-950' : ''}>
                    <td className="py-2.5 px-3 font-sans">Más de C$ 500,000.01</td>
                    <td className="py-2.5 px-3 text-right">C$ 82,500.00</td>
                    <td className="py-2.5 px-3 text-right">30%</td>
                    <td className="py-2.5 px-3 text-right">C$ 500,000.00</td>
                    <td className="py-2.5 px-3 text-center font-sans">
                      {gravableAnualIr > 500000 ? 'Tramo Activo' : '-'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 4: Horas Extras */}
      {activeSubTab === 'horasExtras' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs max-w-2xl space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Calculadora de Horas Extras (Código del Trabajo Ley 185)</h3>
            <p className="text-xs text-slate-500">
              Art. 56 y 62: Las horas extraordinarias se pagan con el 100% de recargo sobre la hora ordinaria (factor 2.0x).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Salario Ordinario Mensual (C$)</label>
              <input
                type="number"
                value={salarioHorasExtras}
                onChange={(e) => setSalarioHorasExtras(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-sm font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Horas Extras Laboradas</label>
              <input
                type="number"
                min="0"
                value={numHorasExtras}
                onChange={(e) => setNumHorasExtras(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-sm font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 text-xs">
            <input
              type="checkbox"
              id="esFeriado"
              checked={esFeriado}
              onChange={(e) => setEsFeriado(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="esFeriado" className="text-slate-700 font-medium">
              Laborado en Día Feriado Nacional Oficial o Turno Especial Nocturno (Factor 2.5x)
            </label>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500">Valor Hora Ordinaria (Salario / 240):</span>
              <span className="text-slate-900 font-bold">C$ {valorHoraOrdinaria.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Valor Hora Extra ({esFeriado ? '2.5x' : '2.0x'}):</span>
              <span className="text-slate-900 font-bold">C$ {(valorHoraOrdinaria * (esFeriado ? 2.5 : 2.0)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 text-sm">
              <span className="text-slate-900 font-bold font-sans">Total a Pagar por Horas Extras:</span>
              <span className="text-emerald-700 font-bold">C$ {pagoHorasExtrasResult.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
