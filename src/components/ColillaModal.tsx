import React from 'react';
import { Colaborador, RegistroNomina } from '../types';
import { Printer, X, ShieldCheck, Download, Building2 } from 'lucide-react';

interface ColillaModalProps {
  nomina: RegistroNomina | null;
  colaborador?: Colaborador;
  onClose: () => void;
}

export const ColillaModal: React.FC<ColillaModalProps> = ({ nomina, colaborador, onClose }) => {
  if (!nomina) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8">
        {/* Modal Toolbar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm">Comprobante Oficial de Pago · Nicaragua</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors"
            >
              <Printer className="w-4 h-4" />
              Imprimir / PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Colilla Body */}
        <div className="p-8 text-slate-800 print:p-0" id="colilla-imprimible">
          {/* Header */}
          <div className="border-b-2 border-emerald-700 pb-4 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                  <span className="text-emerald-700">TECHNO-VERDE S.A.</span>
                </h1>
                <p className="text-xs text-slate-600">Soluciones Circulares y Reciclaje de Residuos Electrónicos (RAEE)</p>
                <p className="text-xs text-slate-500">RUC: J0310000389218 · Registro Patronal INSS: 084-2910-K</p>
                <p className="text-xs text-slate-500">En Alianza Académica con la Universidad Nacional Casimiro Sotelo Montenegro</p>
              </div>
              <div className="text-right">
                <span className="inline-block px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded">
                  COLILLA DE PAGO
                </span>
                <p className="text-xs font-mono font-semibold text-slate-700 mt-1">Ref: {nomina.id}</p>
                <p className="text-xs text-slate-500">Período: {nomina.periodo}</p>
              </div>
            </div>
          </div>

          {/* Employee Data Grid */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs mb-6">
            <div>
              <p className="text-slate-500">Colaborador / Funcionario:</p>
              <p className="font-bold text-slate-900 text-sm">{nomina.nombreCompleto}</p>
            </div>
            <div>
              <p className="text-slate-500">Cédula de Identidad (Nicaragua):</p>
              <p className="font-mono font-semibold text-slate-800">{nomina.cedula}</p>
            </div>
            <div>
              <p className="text-slate-500">Cargo / Posición:</p>
              <p className="font-medium text-slate-800">{nomina.puesto}</p>
            </div>
            <div>
              <p className="text-slate-500">Número de Afiliación INSS:</p>
              <p className="font-mono font-semibold text-slate-800">{nomina.numeroInss}</p>
            </div>
            <div>
              <p className="text-slate-500">Sucursal Asignada:</p>
              <p className="font-medium text-slate-800">Planta {nomina.sucursal}, Nicaragua</p>
            </div>
            <div>
              <p className="text-slate-500">Fecha de Emisión:</p>
              <p className="text-slate-700">{nomina.fechaCalculo}</p>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Ingresos / Devengados */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-emerald-50/70 border-b border-emerald-100 px-4 py-2 font-semibold text-xs text-emerald-900">
                1. INGRESOS DEVENGADOS (C$)
              </div>
              <div className="p-3 text-xs space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Salario Ordinario Base:</span>
                  <span className="font-mono tabular-nums font-medium text-slate-800">
                    C$ {nomina.salarioBase.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Horas Extras ({nomina.horasExtras} hrs - Art. 56):</span>
                  <span className="font-mono tabular-nums font-medium text-slate-800">
                    C$ {nomina.horasExtrasMonto.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Bono Riesgo RAEE (Ley 618):</span>
                  <span className="font-mono tabular-nums font-medium text-slate-800">
                    C$ {nomina.bonoRiesgoRaee.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between pt-2 font-bold text-slate-900 border-t border-slate-300">
                  <span>TOTAL DEVENGADO:</span>
                  <span className="font-mono tabular-nums text-emerald-700">
                    C$ {nomina.totalDevengado.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Deducciones de Ley */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-red-50/70 border-b border-red-100 px-4 py-2 font-semibold text-xs text-red-900">
                2. DEDUCCIONES DE LEY (C$)
              </div>
              <div className="p-3 text-xs space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">INSS Laboral (7.00%):</span>
                  <span className="font-mono tabular-nums font-medium text-slate-800">
                    - C$ {nomina.inssLaboral.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Retención IR (Ley 822 DGI):</span>
                  <span className="font-mono tabular-nums font-medium text-slate-800">
                    - C$ {nomina.irMensual.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Otras Deducciones / Préstamos:</span>
                  <span className="font-mono tabular-nums font-medium text-slate-800">
                    - C$ {nomina.otrasDeducciones.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between pt-2 font-bold text-slate-900 border-t border-slate-300">
                  <span>TOTAL DEDUCCIONES:</span>
                  <span className="font-mono tabular-nums text-red-700">
                    - C$ {nomina.totalDeducciones.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Salary Highlight */}
          <div className="bg-emerald-800 text-white p-4 rounded-lg flex items-center justify-between mb-6 shadow-xs">
            <div>
              <p className="text-xs uppercase tracking-wider text-emerald-200">Neto a Recibir por el Trabajador</p>
              <p className="text-xs text-emerald-300">Moneda de Curso Legal: Córdobas (NIO)</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold font-mono tabular-nums tracking-tight">
                C$ {nomina.salarioNetoPagar.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Employer Contributions Note (Information Only) */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs mb-6 text-slate-600">
            <p className="font-semibold text-slate-700 mb-1">Cargas Patronales Empresariales (Pagadas por Techno-Verde S.A.):</p>
            <div className="grid grid-cols-3 gap-2 font-mono">
              <div>INSS Patronal (22.50%): C$ {nomina.inssPatronal.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</div>
              <div>INATEC Patronal (2.00%): C$ {nomina.inatecPatronal.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</div>
              <div>Costo Empresa: C$ {nomina.costoPatronalTotal.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>

          {/* Legal Signatures */}
          <div className="pt-8 border-t border-dashed border-slate-300 grid grid-cols-2 gap-12 text-center text-xs">
            <div>
              <div className="h-14 border-b border-slate-400 mb-2 flex items-end justify-center">
                <span className="text-[10px] text-slate-400 font-mono">SELLO / FIRMA DIGITAL C/WASM</span>
              </div>
              <p className="font-semibold text-slate-800">Techno-Verde S.A.</p>
              <p className="text-slate-500">Depto. de Recursos Humanos & Nómina</p>
            </div>
            <div>
              <div className="h-14 border-b border-slate-400 mb-2"></div>
              <p className="font-semibold text-slate-800">{nomina.nombreCompleto}</p>
              <p className="text-slate-500">Firma del Colaborador (Recibí Conforme)</p>
            </div>
          </div>

          {/* Legal Footnote */}
          <div className="mt-6 text-[10px] text-slate-400 text-center space-y-0.5">
            <p>Calculado bajo las Leyes Laborales y Tributarias de la República de Nicaragua.</p>
            <p>Código del Trabajo (Ley 185) · Ley de Concertación Tributaria (Ley 822) · Reformas a la Ley de Seguridad Social (INSS).</p>
          </div>
        </div>
      </div>
    </div>
  );
};
