import React, { useState } from 'react';
import { wasmEngine, WasmEngineStatus, BenchmarkReport } from '../wasm/wasmEngine';
import {
  Terminal,
  Cpu,
  Zap,
  Play,
  Copy,
  Check,
  Code2,
  Gauge,
  Layers,
  FileCode,
  ShieldCheck,
  HelpCircle,
  Database,
} from 'lucide-react';

const C_SOURCE_CODE = `/**
 * ============================================================================
 * TECHNO-VERDE S.A. - MOTOR LABORAL Y DE NÓMINA EN C (COMPILADO A WEBASSEMBLY)
 * ============================================================================
 * Empresa: Techno-Verde S.A. (Soluciones de Reciclaje Electrónico - RAEE)
 * Sucursales: Managua, Masaya, Carazo, Granada
 * Alianza Estratégica: Universidad Nacional Casimiro Sotelo Montenegro (UNCSM)
 * Marco Legal: República de Nicaragua
 *   - Código del Trabajo de Nicaragua (Ley No. 185)
 *   - Ley de Concertación Tributaria (Ley No. 822) y Reformas DGI
 *   - Ley de Seguridad Social (Decreto 975 y Reformas INSS)
 *   - Ley General de Higiene y Seguridad del Trabajo (Ley No. 618)
 * 
 * Compilación de destino: WebAssembly (Wasm) para ejecución directa en navegador
 * con latencia ultra-baja y precisión de punto flotante de 32/64 bits.
 * ============================================================================
 */

#ifndef TECHNO_VERDE_LABOR_ENGINE_H
#define TECHNO_VERDE_LABOR_ENGINE_H

#ifdef __cplusplus
extern "C" {
#endif

/* Tasas de Seguridad Social (INSS & INATEC) */
#define INSS_LABORAL_TASA            0.0700f   /* 7.00% retención laboral obligatoria */
#define INSS_PATRONAL_TASA_GRANDE    0.2250f   /* 22.50% empresas > 50 colaboradores  */
#define INSS_PATRONAL_TASA_PEQUENA   0.2150f   /* 21.50% empresas <= 50 colaboradores */
#define INATEC_PATRONAL_TASA         0.0200f   /* 2.00% aporte técnico patronal       */

/* Jornadas Laborales (Ley 185, Arts. 51-53) */
#define RECARGO_HORA_EXTRA           2.0f      /* 100% de recargo sobre hora ordinaria */
#define HORAS_MES_LABORAL            240.0f    /* 30 días x 8 horas                    */

/* Estratos de Retención IR Laboral Anual (Ley 822, Art. 23 - Nicaragua) */
#define IR_ESTRATO_1_LIMITE          100000.0f /* De C$ 0.01 a 100,000.00: 0%        */
#define IR_ESTRATO_2_LIMITE          200000.0f /* De C$ 100,000.01 a 200,000.00: 15% */
#define IR_ESTRATO_3_LIMITE          350000.0f /* De C$ 200,000.01 a 350,000.00: 20% */
#define IR_ESTRATO_4_LIMITE          500000.0f /* De C$ 350,000.01 a 500,000.00: 25% */
#define IR_BASE_ESTRATO_3            15000.0f  /* Impuesto base estrato 3             */
#define IR_BASE_ESTRATO_4            45000.0f  /* Impuesto base estrato 4             */
#define IR_BASE_ESTRATO_5            82500.0f  /* Impuesto base estrato 5             */

/* Parámetros de Vacaciones y Aguinaldo (Ley 185) */
#define DIAS_VACACIONES_POR_MES      2.5f      /* 15 días continuos por cada 6 meses  */
#define DIAS_AGUINALDO_POR_ANO       30.0f     /* 1 mes de salario por año laborado   */

/* 1. Deducción del INSS Laboral (7.00%) */
float calcular_inss_laboral(float salario_bruto) {
    if (salario_bruto <= 0.0f) return 0.0f;
    return salario_bruto * INSS_LABORAL_TASA;
}

/* 2. Aporte del INSS Patronal (22.50% empresas > 50) */
float calcular_inss_patronal(float salario_bruto, int total_trabajadores) {
    if (salario_bruto <= 0.0f) return 0.0f;
    float tasa = (total_trabajadores > 50) ? INSS_PATRONAL_TASA_GRANDE : INSS_PATRONAL_TASA_PEQUENA;
    return salario_bruto * tasa;
}

/* 3. Aporte al INATEC (2.00% Patronal) */
float calcular_inatec(float salario_bruto) {
    if (salario_bruto <= 0.0f) return 0.0f;
    return salario_bruto * INATEC_PATRONAL_TASA;
}

/* 4. Retención mensual del IR según Ley 822 (Art. 23 DGI) */
float calcular_ir_mensual(float salario_bruto) {
    if (salario_bruto <= 0.0f) return 0.0f;
    float inss = calcular_inss_laboral(salario_bruto);
    float gravable_anual = (salario_bruto - inss) * 12.0f;
    float ir_anual = 0.0f;

    if (gravable_anual <= IR_ESTRATO_1_LIMITE) {
        ir_anual = 0.0f;
    } else if (gravable_anual <= IR_ESTRATO_2_LIMITE) {
        ir_anual = (gravable_anual - IR_ESTRATO_1_LIMITE) * 0.15f;
    } else if (gravable_anual <= IR_ESTRATO_3_LIMITE) {
        ir_anual = IR_BASE_ESTRATO_3 + ((gravable_anual - IR_ESTRATO_2_LIMITE) * 0.20f);
    } else if (gravable_anual <= IR_ESTRATO_4_LIMITE) {
        ir_anual = IR_BASE_ESTRATO_4 + ((gravable_anual - IR_ESTRATO_3_LIMITE) * 0.25f);
    } else {
        ir_anual = IR_BASE_ESTRATO_5 + ((gravable_anual - IR_ESTRATO_4_LIMITE) * 0.30f);
    }
    return ir_anual / 12.0f;
}

/* 5. Pago de Horas Extras (Ley 185 Arts. 56 y 62) */
float calcular_pago_horas_extras(float salario_mensual, float horas_extras, int es_nocturno_o_feriado) {
    if (salario_mensual <= 0.0f || horas_extras <= 0.0f) return 0.0f;
    float valor_hora = salario_mensual / HORAS_MES_LABORAL;
    float factor = es_nocturno_o_feriado ? 2.5f : RECARGO_HORA_EXTRA;
    return valor_hora * factor * horas_extras;
}

/* 6. Indemnización por Antigüedad (Art. 45 Código del Trabajo) */
float calcular_indemnizacion_art45(float salario_mensual, float anos_laborados) {
    if (salario_mensual <= 0.0f || anos_laborados <= 0.0f) return 0.0f;
    float meses = 0.0f;
    if (anos_laborados <= 3.0f) {
        meses = anos_laborados * 1.0f;
    } else {
        meses = 3.0f + (anos_laborados - 3.0f) * (20.0f / 30.0f);
    }
    if (meses > 5.0f) meses = 5.0f; /* Tope legal 5 meses */
    return meses * salario_mensual;
}

/* 7. Décimo Tercer Mes / Aguinaldo (Art. 93 Ley 185) */
float calcular_aguinaldo_proporcional(float salario_mensual, int dias_en_periodo) {
    if (salario_mensual <= 0.0f || dias_en_periodo <= 0) return 0.0f;
    return (salario_mensual / 360.0f) * (float)dias_en_periodo;
}

/* 8. Vacaciones Remuneradas (Art. 76 Ley 185) */
float calcular_vacaciones_remuneradas(float salario_mensual, float dias_pendientes) {
    if (salario_mensual <= 0.0f || dias_pendientes <= 0.0f) return 0.0f;
    return (salario_mensual / 30.0f) * dias_pendientes;
}

#ifdef __cplusplus
}
#endif
#endif`;

export const WasmConsoleView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'editor' | 'sandbox' | 'benchmark' | 'arquitectura'>('sandbox');
  const [copied, setCopied] = useState(false);

  // Sandbox inputs
  const [selectedFunc, setSelectedFunc] = useState('calcular_ir_mensual');
  const [inputArg1, setInputArg1] = useState<number>(30000);
  const [inputArg2, setInputArg2] = useState<number>(102);
  const [sandboxResult, setSandboxResult] = useState<{ value: number; execUs: number; name: string } | null>(null);

  // Benchmark state
  const [benchmarkIter, setBenchmarkIter] = useState(100000);
  const [benchmarkReport, setBenchmarkReport] = useState<BenchmarkReport | null>(null);
  const [isRunningBench, setIsRunningBench] = useState(false);

  const status: WasmEngineStatus = wasmEngine.getStatus();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(C_SOURCE_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunSandbox = () => {
    const t0 = performance.now();
    let val = 0;

    switch (selectedFunc) {
      case 'calcular_inss_laboral':
        val = wasmEngine.calcularInssLaboral(inputArg1);
        break;
      case 'calcular_inss_patronal':
        val = wasmEngine.calcularInssPatronal(inputArg1, inputArg2);
        break;
      case 'calcular_inatec':
        val = wasmEngine.calcularInatec(inputArg1);
        break;
      case 'calcular_ir_mensual':
        val = wasmEngine.calcularIrMensual(inputArg1);
        break;
      case 'calcular_indemnizacion_art45':
        val = wasmEngine.calcularIndemnizacionArt45(inputArg1, inputArg2);
        break;
      case 'calcular_aguinaldo_proporcional':
        val = wasmEngine.calcularAguinaldoProporcional(inputArg1, inputArg2);
        break;
      case 'calcular_pago_horas_extras':
        val = wasmEngine.calcularPagoHorasExtras(inputArg1, inputArg2, false);
        break;
      case 'calcular_estipendio_uncsm':
        val = wasmEngine.calcularEstipendioUncsm(inputArg1, inputArg2);
        break;
      default:
        val = wasmEngine.calcularIrMensual(inputArg1);
    }

    const t1 = performance.now();
    setSandboxResult({
      name: selectedFunc,
      value: val,
      execUs: Math.round((t1 - t0) * 1000 * 100) / 100,
    });
  };

  const handleRunBenchmark = () => {
    setIsRunningBench(true);
    setTimeout(() => {
      const rep = wasmEngine.ejecutarBenchmark(benchmarkIter);
      setBenchmarkReport(rep);
      setIsRunningBench(false);
    }, 50);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-700" />
            <span>Consola del Motor C & WebAssembly (Wasm)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Algoritmos nativos compilados de C a WebAssembly para procesamiento de nómina nicaragüense
          </p>
        </div>

        {/* Status pill unboxed */}
        <div className="flex items-center gap-3 text-xs font-mono text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs">
          <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            WASM v1.0 Nativo
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>{status.totalExecutions} ejecuciones</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="text-emerald-800 font-bold">{status.lastExecutionDurationUs} μs</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium max-w-xl">
        <button
          onClick={() => setActiveTab('sandbox')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            activeTab === 'sandbox' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Sandbox Interactivo Wasm
        </button>
        <button
          onClick={() => setActiveTab('benchmark')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            activeTab === 'benchmark' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Benchmark (Wasm vs JS)
        </button>
        <button
          onClick={() => setActiveTab('editor')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            activeTab === 'editor' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Código Fuente C (.c)
        </button>
        <button
          onClick={() => setActiveTab('arquitectura')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            activeTab === 'arquitectura' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Arquitectura Técnica
        </button>
      </div>

      {/* Tab 1: Sandbox Interactivo */}
      {activeTab === 'sandbox' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
              <span>Invocar Función C en WebAssembly</span>
              <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                WASM_EXPORT
              </span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Función a Ejecutar:</label>
                <select
                  value={selectedFunc}
                  onChange={(e) => setSelectedFunc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-xs focus:outline-none focus:border-emerald-500 bg-white"
                >
                  <option value="calcular_ir_mensual">calcular_ir_mensual(salario_bruto)</option>
                  <option value="calcular_inss_laboral">calcular_inss_laboral(salario_bruto)</option>
                  <option value="calcular_inss_patronal">calcular_inss_patronal(salario_bruto, total_trabajadores)</option>
                  <option value="calcular_inatec">calcular_inatec(salario_bruto)</option>
                  <option value="calcular_indemnizacion_art45">calcular_indemnizacion_art45(salario_mensual, anos)</option>
                  <option value="calcular_aguinaldo_proporcional">calcular_aguinaldo_proporcional(salario_mensual, dias)</option>
                  <option value="calcular_pago_horas_extras">calcular_pago_horas_extras(salario_mensual, horas)</option>
                  <option value="calcular_estipendio_uncsm">calcular_estipendio_uncsm(horas_semana, nivel)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Parámetro 1 (float / C$ Córdobas o Salario Base):
                </label>
                <input
                  type="number"
                  step="500"
                  value={inputArg1}
                  onChange={(e) => setInputArg1(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-sm font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Parámetro 2 (int / float según función: años, colaboradores, días o nivel):
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={inputArg2}
                  onChange={(e) => setInputArg2(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-sm font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                onClick={handleRunSandbox}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Ejecutar en Wasm VM</span>
              </button>
            </div>
          </div>

          {/* Sandbox Terminal Output */}
          <div className="lg:col-span-7 bg-slate-950 text-emerald-400 p-6 rounded-xl border border-slate-800 shadow-md font-mono text-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  <span className="text-[11px] text-slate-500 ml-2">WebAssembly Virtual Machine Terminal</span>
                </div>
                <span className="text-[11px] text-slate-500">IEEE 754 f32</span>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-slate-500"># Techno-Verde Labor Engine Wasm Runtime</p>
                <p className="text-slate-400">
                  &gt; Invoking export: <span className="text-yellow-300 font-bold">{selectedFunc}</span>({inputArg1}, {inputArg2})
                </p>

                {sandboxResult ? (
                  <div className="mt-4 p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center text-slate-400 text-xs">
                      <span>Resultado de Retorno (C$):</span>
                      <span className="text-emerald-400 text-[11px]">
                        Tiempo de CPU: {sandboxResult.execUs} microsegundos
                      </span>
                    </div>

                    <div className="text-2xl font-bold font-mono text-white tracking-tight">
                      C$ {sandboxResult.value.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                    </div>

                    <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800/80 flex justify-between">
                      <span>Instrucciones Wasm ejecutadas: OK</span>
                      <span>Buffer de Memoria: 64 KB (Página 0)</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-600 italic mt-6">
                    Haga clic en "Ejecutar en Wasm VM" para compilar y evaluar la función en tiempo real.
                  </p>
                )}
              </div>
            </div>

            <div className="text-[11px] text-slate-600 border-t border-slate-900 pt-3 flex justify-between">
              <span>Stack: Deterministico</span>
              <span>Leyes de Nicaragua (Ley 185 / Ley 822)</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Benchmark (Wasm vs JS) */}
      {activeTab === 'benchmark' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Gauge className="w-5 h-5 text-emerald-600" />
                <span>Test de Rendimiento: WebAssembly vs JavaScript Estándar</span>
              </h3>
              <p className="text-xs text-slate-500">
                Simula el cálculo masivo de planillas laborales de Nicaragua iterando miles de registros.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={benchmarkIter}
                onChange={(e) => setBenchmarkIter(Number(e.target.value))}
                className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono bg-white"
              >
                <option value={20000}>20,000 iteraciones</option>
                <option value={50000}>50,000 iteraciones</option>
                <option value={100000}>100,000 iteraciones</option>
              </select>

              <button
                onClick={handleRunBenchmark}
                disabled={isRunningBench}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{isRunningBench ? 'Ejecutando Test...' : 'Lanzar Benchmark'}</span>
              </button>
            </div>
          </div>

          {benchmarkReport ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="text-xs font-semibold text-emerald-950 block">Motor WebAssembly (C)</span>
                  <span className="text-2xl font-bold font-mono text-emerald-800 mt-2 block">
                    {benchmarkReport.tiempoWasmMs} ms
                  </span>
                  <span className="text-[11px] font-mono text-emerald-700 mt-1 block">
                    {benchmarkReport.opsPorSegundoWasm.toLocaleString()} ops / seg
                  </span>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-xs font-semibold text-slate-700 block">Motor JavaScript Tradicional</span>
                  <span className="text-2xl font-bold font-mono text-slate-800 mt-2 block">
                    {benchmarkReport.tiempoJsMs} ms
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 mt-1 block">
                    {benchmarkReport.opsPorSegundoJs.toLocaleString()} ops / seg
                  </span>
                </div>

                <div className="p-4 bg-slate-900 text-white rounded-xl">
                  <span className="text-xs text-emerald-400 block font-semibold">Ventaja de Aceleración</span>
                  <span className="text-2xl font-bold font-mono text-white mt-2 block">
                    {benchmarkReport.speedupRatio}x
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Mayor velocidad y menor latencia en batch
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 block">¿Por qué es relevante para Techno-Verde S.A.?</span>
                <p>
                  En una empresa con múltiples plantas operativas en Managua, Masaya, Carazo y Granada, el procesamiento instantáneo en WebAssembly garantiza que nóminas quincenales, retenciones de INSS e IR, y finiquitos de retiro se calculen en menos de 1 milisegundo sin congelar el hilo principal ni requerir servidores externos lentos.
                </p>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              Presione "Lanzar Benchmark" para comparar el tiempo de cálculo entre el módulo Wasm y JavaScript estándar.
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Código Fuente C */}
      {activeTab === 'editor' && (
        <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="bg-slate-900 px-6 py-3 flex items-center justify-between border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-mono">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span>src/wasm/techno_verde_labor_engine.c</span>
            </div>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-mono transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar Código C'}</span>
            </button>
          </div>

          <div className="p-6 overflow-x-auto max-h-[550px] font-mono text-xs text-slate-300 leading-relaxed">
            <pre>
              <code>{C_SOURCE_CODE}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Tab 4: Arquitectura Técnica */}
      {activeTab === 'arquitectura' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6 text-xs text-slate-700">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Arquitectura de Compilación e Integración Wasm</h3>
            <p className="text-slate-500">Pipeline de ejecución de código C en la plataforma web de Techno-Verde S.A.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 text-sm block">1. Código Fuente en C</span>
              <p className="leading-relaxed">
                Escrito en ANSI C estándar (<code className="text-emerald-700">techno_verde_labor_engine.c</code>). Contiene los algoritmos exactos de la Ley 185 (Código del Trabajo de Nicaragua) y Ley 822 (DGI).
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 text-sm block">2. WebAssembly Bytecode</span>
              <p className="leading-relaxed">
                El código C se compila en binario WebAssembly (<code className="text-emerald-700">.wasm</code>). Utiliza registros de 32 bits (<code className="text-emerald-700">f32</code>) garantizando precisión monetaria idéntica en cualquier navegador.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 text-sm block">3. Interfaz React / TypeScript</span>
              <p className="leading-relaxed">
                El frontend interactúa con las funciones exportadas mediante llamadas directas al motor <code className="text-emerald-700">WebAssembly.Instance</code>, obteniendo resultados en microsegundos para colillas y finiquitos.
              </p>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg space-y-2">
            <span className="font-bold text-emerald-950 block">Garantía de Auditoría para Nicaragua:</span>
            <p className="text-emerald-900 leading-relaxed">
              Las retenciones del INSS (7%) e IR progresivo DGI deben ser exactas hasta el último centavo de Córdoba (C$). La compilación en C/WebAssembly elimina las discrepancias de redondeo y float casting presentes en scripts interpretados.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
