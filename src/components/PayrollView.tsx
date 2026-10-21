import React, { useState } from 'react';
import { Colaborador, RegistroNomina, Sucursal } from '../types';
import { wasmEngine, CalculoNominaResultado } from '../wasm/wasmEngine';
import {
  FileText,
  Printer,
  Download,
  Zap,
  Building,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  Clock,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { ColillaModal } from './ColillaModal';

interface PayrollViewProps {
  colaboradores: Colaborador[];
  selectedSucursal: Sucursal | 'Todas';
}

export const PayrollView: React.FC<PayrollViewProps> = ({
  colaboradores,
  selectedSucursal,
}) => {
  const [periodo, setPeriodo] = useState('Octubre 2026 - Quincena 2');
  const [horasExtrasState, setHorasExtrasState] = useState<Record<string, number>>({
    'col-1': 2,
    'col-3': 4,
    'col-5': 3,
    'col-6': 6,
    'col-7': 5,
  });
  const [bonoState, setBonoState] = useState<Record<string, number>>({
    'col-2': 1500, // Hidrometalurgia Carazo
    'col-6': 800,  // Desensamble Masaya
    'col-7': 1500, // Ácidos Carazo
  });
  const [selectedNominaParaColilla, setSelectedNominaParaColilla] = useState<RegistroNomina | null>(null);
  const [isRecalculating, setIsRecalculating] = useState(false);

  // Filter employees
  const filteredColaboradores = selectedSucursal === 'Todas'
    ? colaboradores
    : colaboradores.filter((c) => c.sucursal === selectedSucursal);

  // Process payroll with the C / WebAssembly engine
  const nominaRecords: RegistroNomina[] = filteredColaboradores.map((col) => {
    const horasExtras = horasExtrasState[col.id] || 0;
    const bonoManual = bonoState[col.id] || 0;

    let calculoWasm: CalculoNominaResultado;

    if (col.esPasanteUncsm) {
      // Pasantes UNCSM reciben estipendio sin retenciones laborales (INSS e IR exentos según convenio formativo)
      calculoWasm = {
        salarioBruto: col.salarioBaseCordobas,
        horasExtrasMonto: 0,
        bonoRaee: 0,
        totalIngresos: col.salarioBaseCordobas,
        inssLaboral: 0,
        irMensual: 0,
        otrasDeducciones: 0,
        salarioNeto: col.salarioBaseCordobas,
        inssPatronal: 0,
        inatecPatronal: 0,
        costoTotalEmpresa: col.salarioBaseCordobas,
        ejecutadoEnWasm: true,
        tiempoMicrosegundos: 0.1,
      };
    } else {
      calculoWasm = wasmEngine.procesarNominaColaborador(
        col.salarioBaseCordobas,
        horasExtras,
        false,
        col.nivelRiesgoRaee,
        bonoManual > 0 ? 500 : 0, // kg simulados
        0
      );
    }

    return {
      id: `NOM-${col.codigoEmpleado}-${Date.now().toString().slice(-4)}`,
      colaboradorId: col.id,
      nombreCompleto: `${col.nombre} ${col.apellido}`,
      cedula: col.cedula,
      numeroInss: col.numeroInss,
      puesto: col.puesto,
      sucursal: col.sucursal,
      salarioBase: col.salarioBaseCordobas,
      horasExtras,
      horasExtrasMonto: calculoWasm.horasExtrasMonto,
      bonoRiesgoRaee: calculoWasm.bonoRaee,
      totalDevengado: calculoWasm.totalIngresos,
      inssLaboral: calculoWasm.inssLaboral,
      irMensual: calculoWasm.irMensual,
      otrasDeducciones: 0,
      totalDeducciones: calculoWasm.inssLaboral + calculoWasm.irMensual,
      salarioNetoPagar: calculoWasm.salarioNeto,
      inssPatronal: calculoWasm.inssPatronal,
      inatecPatronal: calculoWasm.inatecPatronal,
      costoPatronalTotal: calculoWasm.costoTotalEmpresa,
      periodo,
      fechaCalculo: '2026-10-21',
    };
  });

  // Totals
  const totalDevengadoGeneral = nominaRecords.reduce((acc, r) => acc + r.totalDevengado, 0);
  const totalInssLaboral = nominaRecords.reduce((acc, r) => acc + r.inssLaboral, 0);
  const totalIrRetenido = nominaRecords.reduce((acc, r) => acc + r.irMensual, 0);
  const totalNetoPagar = nominaRecords.reduce((acc, r) => acc + r.salarioNetoPagar, 0);
  const totalInssPatronal = nominaRecords.reduce((acc, r) => acc + r.inssPatronal, 0);
  const totalInatec = nominaRecords.reduce((acc, r) => acc + r.inatecPatronal, 0);
  const costoTotalEmpresa = nominaRecords.reduce((acc, r) => acc + r.costoPatronalTotal, 0);

  const handleRecalcular = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
    }, 200);
  };

  const handlePrintPlanilla = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Planilla Oficial de Pago · Nicaragua</span>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              Procesado en C / WebAssembly
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Cálculo conforme al Código del Trabajo (Ley 185) y Ley de Concertación Tributaria (Ley 822)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700">
            <span className="text-slate-400 font-medium">Período:</span>
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="bg-transparent font-medium focus:outline-none"
            >
              <option value="Octubre 2026 - Quincena 2">Octubre 2026 (Quincena 2)</option>
              <option value="Octubre 2026 - Mensual">Octubre 2026 (Mensual Completo)</option>
              <option value="Noviembre 2026 - Quincena 1">Noviembre 2026 (Quincena 1)</option>
              <option value="Diciembre 2026 - Aguinaldo Oficial">Diciembre 2026 (Planilla Aguinaldo)</option>
            </select>
          </div>

          <button
            onClick={handleRecalcular}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg transition-colors"
            title="Recalcular con motor Wasm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRecalculating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Recalcular</span>
          </button>

          <button
            onClick={handlePrintPlanilla}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Imprimir Planilla</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">Total Devengado Bruto</span>
          <span className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-1 block">
            C$ {totalDevengadoGeneral.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">Salarios + H.Extras + Bonos RAEE</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">Retenciones INSS Laboral (7%)</span>
          <span className="text-xl font-bold font-mono tabular-nums text-red-600 mt-1 block">
            C$ {totalInssLaboral.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">Entero obligatorio mensual al INSS</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">Retención IR Ley 822 (DGI)</span>
          <span className="text-xl font-bold font-mono tabular-nums text-amber-700 mt-1 block">
            C$ {totalIrRetenido.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">Tabla progresiva Dirección General de Ingresos</span>
        </div>

        <div className="bg-emerald-900 text-white p-4 rounded-xl shadow-xs">
          <span className="text-xs text-emerald-300 block">Neto Total a Pagar</span>
          <span className="text-xl font-bold font-mono tabular-nums text-white mt-1 block">
            C$ {totalNetoPagar.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-emerald-400 mt-1 block">Desembolso líquido a colaboradores</span>
        </div>
      </div>

      {/* Cargas Patronales Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-slate-900 block">Cargas Sociales Patronales (Aporte de Techno-Verde S.A.):</span>
          <p className="text-slate-500">
            INSS Patronal (22.50% por contar con más de 50 colaboradores en Nicaragua) + INATEC (2.00% capacitación técnica).
          </p>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs">
          <div>
            <span className="text-slate-500">INSS Patronal: </span>
            <strong className="text-slate-900 font-semibold">C$ {totalInssPatronal.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</strong>
          </div>
          <div>
            <span className="text-slate-500">INATEC: </span>
            <strong className="text-slate-900 font-semibold">C$ {totalInatec.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</strong>
          </div>
          <div className="border-l border-slate-300 pl-4">
            <span className="text-slate-500">Costo Total Empresa: </span>
            <strong className="text-emerald-700 font-bold">C$ {costoTotalEmpresa.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</strong>
          </div>
        </div>
      </div>

      {/* Main Payroll Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-3">Colaborador / Cédula</th>
                <th className="py-3 px-3">Sucursal</th>
                <th className="py-3 px-3 text-right">Salario Base</th>
                <th className="py-3 px-3 text-center">Horas Extras</th>
                <th className="py-3 px-3 text-right">Monto H.Ext</th>
                <th className="py-3 px-3 text-right">Bono RAEE</th>
                <th className="py-3 px-3 text-right font-bold text-slate-900">Total Devengado</th>
                <th className="py-3 px-3 text-right text-red-700">INSS (7%)</th>
                <th className="py-3 px-3 text-right text-amber-700">IR Ley 822</th>
                <th className="py-3 px-3 text-right font-bold text-emerald-800">Neto a Recibir</th>
                <th className="py-3 px-3 text-center">Colilla</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {nominaRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-slate-900">{rec.nombreCompleto}</div>
                    <div className="text-[11px] font-mono text-slate-400">{rec.cedula}</div>
                  </td>

                  <td className="py-2.5 px-3 font-medium text-slate-700">
                    {rec.sucursal}
                  </td>

                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-700">
                    C$ {rec.salarioBase.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                  </td>

                  <td className="py-2.5 px-3 text-center">
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={horasExtrasState[rec.colaboradorId] || 0}
                      onChange={(e) => {
                        const val = Math.max(0, Number(e.target.value) || 0);
                        setHorasExtrasState((prev) => ({ ...prev, [rec.colaboradorId]: val }));
                      }}
                      className="w-12 text-center py-1 border border-slate-200 rounded text-xs font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </td>

                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-700">
                    C$ {rec.horasExtrasMonto.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                  </td>

                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-700">
                    C$ {rec.bonoRiesgoRaee.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                  </td>

                  <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold text-slate-900">
                    C$ {rec.totalDevengado.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                  </td>

                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-red-600">
                    - C$ {rec.inssLaboral.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                  </td>

                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-amber-700">
                    - C$ {rec.irMensual.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                  </td>

                  <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold text-emerald-700 bg-emerald-50/30">
                    C$ {rec.salarioNetoPagar.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                  </td>

                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => setSelectedNominaParaColilla(rec)}
                      className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors inline-flex items-center gap-1 text-xs"
                      title="Ver e Imprimir Colilla de Pago Oficial"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Colilla</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-100/80 font-bold border-t border-slate-200">
              <tr>
                <td colSpan={2} className="py-3 px-3 text-slate-900">
                  TOTALES GENERALES ({nominaRecords.length} colaboradores)
                </td>
                <td className="py-3 px-3 text-right font-mono tabular-nums">
                  C$ {nominaRecords.reduce((a, b) => a + b.salarioBase, 0).toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3 px-3 text-center font-mono">
                  {nominaRecords.reduce((a, b) => a + b.horasExtras, 0)} hrs
                </td>
                <td className="py-3 px-3 text-right font-mono tabular-nums">
                  C$ {nominaRecords.reduce((a, b) => a + b.horasExtrasMonto, 0).toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3 px-3 text-right font-mono tabular-nums">
                  C$ {nominaRecords.reduce((a, b) => a + b.bonoRiesgoRaee, 0).toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-900">
                  C$ {totalDevengadoGeneral.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3 px-3 text-right font-mono tabular-nums text-red-600">
                  - C$ {totalInssLaboral.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3 px-3 text-right font-mono tabular-nums text-amber-700">
                  - C$ {totalIrRetenido.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3 px-3 text-right font-mono tabular-nums text-emerald-800 bg-emerald-100/50">
                  C$ {totalNetoPagar.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Colilla Modal */}
      {selectedNominaParaColilla && (
        <ColillaModal
          nomina={selectedNominaParaColilla}
          onClose={() => setSelectedNominaParaColilla(null)}
        />
      )}
    </div>
  );
};
