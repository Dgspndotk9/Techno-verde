import React, { useState } from 'react';
import { Colaborador, Departamento, EstadoColaborador, Sucursal, TipoContrato } from '../types';
import {
  Users,
  Search,
  Plus,
  Filter,
  UserCheck,
  Building,
  Shield,
  FileSpreadsheet,
  X,
  Check,
  Sparkles,
  Calculator,
  Mail,
  Phone,
  Calendar,
} from 'lucide-react';
import { wasmEngine } from '../wasm/wasmEngine';

interface EmployeesViewProps {
  colaboradores: Colaborador[];
  onAddColaborador: (colaborador: Colaborador) => void;
  onUpdateColaborador: (colaborador: Colaborador) => void;
  selectedSucursal: Sucursal | 'Todas';
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({
  colaboradores,
  onAddColaborador,
  onUpdateColaborador,
  selectedSucursal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipoContrato, setFilterTipoContrato] = useState<string>('Todos');
  const [filterDepto, setFilterDepto] = useState<string>('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColaborador, setSelectedColaborador] = useState<Colaborador | null>(null);

  // Form State for new employee
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    numeroInss: '',
    telefono: '+505 ',
    email: '',
    sucursal: (selectedSucursal === 'Todas' ? 'Managua' : selectedSucursal) as Sucursal,
    departamento: 'Operaciones RAEE' as Departamento,
    puesto: '',
    fechaIngreso: new Date().toISOString().split('T')[0],
    salarioBaseCordobas: 18000,
    tipoContrato: 'Indeterminado' as TipoContrato,
    nivelRiesgoRaee: 2 as 1 | 2 | 3,
    horasSemanales: 44,
  });

  // Real-time Wasm calculation for the modal form
  const wasmCalculoForm = wasmEngine.procesarNominaColaborador(
    Number(formData.salarioBaseCordobas) || 0,
    0,
    false,
    formData.nivelRiesgoRaee,
    0,
    0
  );

  const filteredColaboradores = colaboradores.filter((col) => {
    const matchSucursal = selectedSucursal === 'Todas' || col.sucursal === selectedSucursal;
    const matchContrato = filterTipoContrato === 'Todos' || col.tipoContrato === filterTipoContrato;
    const matchDepto = filterDepto === 'Todos' || col.departamento === filterDepto;
    const q = searchTerm.toLowerCase();
    const matchSearch =
      col.nombre.toLowerCase().includes(q) ||
      col.apellido.toLowerCase().includes(q) ||
      col.cedula.toLowerCase().includes(q) ||
      col.puesto.toLowerCase().includes(q) ||
      col.codigoEmpleado.toLowerCase().includes(q);

    return matchSucursal && matchContrato && matchDepto && matchSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.apellido || !formData.cedula) return;

    const prefix = formData.sucursal === 'Managua' ? 'MGA' : formData.sucursal === 'Masaya' ? 'MSY' : formData.sucursal === 'Carazo' ? 'CRZ' : 'GRN';
    const newId = `col-${Date.now()}`;
    const nuevoColaborador: Colaborador = {
      id: newId,
      codigoEmpleado: `TV-${prefix}-${Math.floor(100 + Math.random() * 900)}`,
      nombre: formData.nombre,
      apellido: formData.apellido,
      cedula: formData.cedula,
      numeroInss: formData.numeroInss || `${Math.floor(1000000 + Math.random() * 9000000)}-${Math.floor(Math.random() * 9)}`,
      telefono: formData.telefono,
      email: formData.email || `${formData.nombre.toLowerCase()}.${formData.apellido.toLowerCase()}@technoverde.com.ni`,
      sucursal: formData.sucursal,
      departamento: formData.departamento,
      puesto: formData.puesto || 'Técnico de Reciclaje RAEE',
      fechaIngreso: formData.fechaIngreso,
      salarioBaseCordobas: Number(formData.salarioBaseCordobas) || 15000,
      tipoContrato: formData.tipoContrato,
      estado: 'Activo',
      nivelRiesgoRaee: formData.nivelRiesgoRaee,
      horasSemanales: Number(formData.horasSemanales) || 44,
      diasVacacionesDisponibles: 2.5,
      esPasanteUncsm: formData.tipoContrato === 'Pasante UNCSM',
    };

    onAddColaborador(nuevoColaborador);
    setIsModalOpen(false);
    // Reset form
    setFormData({
      nombre: '',
      apellido: '',
      cedula: '',
      numeroInss: '',
      telefono: '+505 ',
      email: '',
      sucursal: 'Managua',
      departamento: 'Operaciones RAEE',
      puesto: '',
      fechaIngreso: new Date().toISOString().split('T')[0],
      salarioBaseCordobas: 18000,
      tipoContrato: 'Indeterminado',
      nivelRiesgoRaee: 2,
      horasSemanales: 44,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top action & filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Expediente Digital de Colaboradores</span>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {filteredColaboradores.length} registrados
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Personal en Managua, Masaya, Carazo, Granada y pasantes en convenio UNCSM
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Colaborador</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, cédula (001-...), cargo o código..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50/50"
          />
        </div>

        {/* Filter by Contrato */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Contrato:</span>
          <select
            value={filterTipoContrato}
            onChange={(e) => setFilterTipoContrato(e.target.value)}
            className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-white text-slate-700 focus:outline-none focus:border-emerald-500"
          >
            <option value="Todos">Todos</option>
            <option value="Indeterminado">Indeterminado (Ley 185)</option>
            <option value="Determinado">Determinado</option>
            <option value="Pasante UNCSM">Pasante UNCSM</option>
          </select>
        </div>

        {/* Filter by Departamento */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Área:</span>
          <select
            value={filterDepto}
            onChange={(e) => setFilterDepto(e.target.value)}
            className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-white text-slate-700 focus:outline-none focus:border-emerald-500"
          >
            <option value="Todos">Todas las áreas</option>
            <option value="Operaciones RAEE">Operaciones RAEE</option>
            <option value="Laboratorio & Hidrometalurgia">Laboratorio (Carazo)</option>
            <option value="Logística Inversa">Logística Inversa</option>
            <option value="Seguridad & Salud Ocupacional">Seguridad Ley 618</option>
            <option value="Recursos Humanos">Recursos Humanos</option>
          </select>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Código / Nombre</th>
                <th className="py-3 px-4">Cédula Nicaragua / INSS</th>
                <th className="py-3 px-4">Sucursal</th>
                <th className="py-3 px-4">Puesto & Departamento</th>
                <th className="py-3 px-4">Contrato</th>
                <th className="py-3 px-4 text-right">Salario Base (C$)</th>
                <th className="py-3 px-4 text-right">INSS Laboral (7%)</th>
                <th className="py-3 px-4 text-right">IR Ley 822</th>
                <th className="py-3 px-4 text-right">Salario Neto</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredColaboradores.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    No se encontraron colaboradores con los criterios seleccionados.
                  </td>
                </tr>
              ) : (
                filteredColaboradores.map((col) => {
                  const calculoWasm = wasmEngine.procesarNominaColaborador(
                    col.salarioBaseCordobas,
                    0,
                    false,
                    col.nivelRiesgoRaee,
                    0,
                    0
                  );

                  return (
                    <tr key={col.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">
                          {col.nombre} {col.apellido}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">{col.codigoEmpleado}</div>
                      </td>

                      <td className="py-3 px-4 font-mono">
                        <div className="text-slate-800 font-medium">{col.cedula}</div>
                        <div className="text-[11px] text-slate-400">INSS: {col.numeroInss}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-800">{col.sucursal}</span>
                        <div className="text-[11px] text-slate-400">
                          Riesgo RAEE: Nivel {col.nivelRiesgoRaee}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{col.puesto}</div>
                        <div className="text-[11px] text-slate-500">{col.departamento}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                            col.tipoContrato === 'Pasante UNCSM'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {col.tipoContrato}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-slate-900">
                        C$ {col.salarioBaseCordobas.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-600">
                        {col.esPasanteUncsm ? (
                          <span className="text-slate-400 italic">Exento</span>
                        ) : (
                          `C$ ${calculoWasm.inssLaboral.toLocaleString('es-NI', { minimumFractionDigits: 2 })}`
                        )}
                      </td>

                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-600">
                        {col.esPasanteUncsm ? (
                          <span className="text-slate-400 italic">Exento</span>
                        ) : (
                          `C$ ${calculoWasm.irMensual.toLocaleString('es-NI', { minimumFractionDigits: 2 })}`
                        )}
                      </td>

                      <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-emerald-700">
                        C$ {calculoWasm.salarioNeto.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setSelectedColaborador(col)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                        >
                          Expediente
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail / Expediente Modal */}
      {selectedColaborador && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-400" />
                <span className="font-semibold text-sm">Expediente Laboral · Techno-Verde S.A.</span>
              </div>
              <button
                onClick={() => setSelectedColaborador(null)}
                className="p-1 text-slate-400 hover:text-white rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  {selectedColaborador.nombre} {selectedColaborador.apellido}
                </h3>
                <p className="text-slate-500 font-mono">{selectedColaborador.codigoEmpleado} · {selectedColaborador.puesto}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Cédula Nicaragua:</span>
                  <span className="font-mono font-semibold text-slate-800">{selectedColaborador.cedula}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">No. INSS:</span>
                  <span className="font-mono font-semibold text-slate-800">{selectedColaborador.numeroInss}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Sucursal:</span>
                  <span className="font-semibold text-slate-800">{selectedColaborador.sucursal}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Departamento:</span>
                  <span className="font-semibold text-slate-800">{selectedColaborador.departamento}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Fecha de Ingreso:</span>
                  <span className="text-slate-800">{selectedColaborador.fechaIngreso}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Vacaciones Acumuladas:</span>
                  <span className="font-mono font-semibold text-emerald-700">{selectedColaborador.diasVacacionesDisponibles} días</span>
                </div>
              </div>

              {/* Legal computations */}
              <div className="border border-slate-200 rounded-lg p-3 space-y-2">
                <span className="font-bold text-slate-800 block text-xs">Desglose Monetario (C / WebAssembly):</span>
                {(() => {
                  const res = wasmEngine.procesarNominaColaborador(selectedColaborador.salarioBaseCordobas);
                  return (
                    <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                      <div>Salario Ordinario: C$ {selectedColaborador.salarioBaseCordobas.toLocaleString('es-NI')}</div>
                      <div>INSS Laboral (7%): C$ {res.inssLaboral.toLocaleString('es-NI')}</div>
                      <div>IR Ley 822: C$ {res.irMensual.toLocaleString('es-NI')}</div>
                      <div className="font-bold text-emerald-700">Neto: C$ {res.salarioNeto.toLocaleString('es-NI')}</div>
                      <div>INSS Patronal (22.5%): C$ {res.inssPatronal.toLocaleString('es-NI')}</div>
                      <div>INATEC (2%): C$ {res.inatecPatronal.toLocaleString('es-NI')}</div>
                    </div>
                  );
                })()}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedColaborador(null)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
                >
                  Cerrar Expediente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <span className="font-semibold text-sm">Registrar Nuevo Colaborador / Pasante</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Nombres *</label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="ej: Marvin Antonio"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Apellidos *</label>
                  <input
                    type="text"
                    required
                    value={formData.apellido}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                    placeholder="ej: Gomez Fonseca"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Cédula de Identidad Nicaragua *</label>
                  <input
                    type="text"
                    required
                    value={formData.cedula}
                    onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                    placeholder="001-140592-0023K"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Número de Afiliación INSS</label>
                  <input
                    type="text"
                    value={formData.numeroInss}
                    onChange={(e) => setFormData({ ...formData, numeroInss: e.target.value })}
                    placeholder="7489201-2"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Sucursal *</label>
                  <select
                    value={formData.sucursal}
                    onChange={(e) => setFormData({ ...formData, sucursal: e.target.value as Sucursal })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="Managua">Managua (Planta Acahualinca)</option>
                    <option value="Masaya">Masaya (Reacondicionamiento)</option>
                    <option value="Carazo">Carazo (Hidrometalurgia Jinotepe)</option>
                    <option value="Granada">Granada (Centro Logístico)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Departamento / Área *</label>
                  <select
                    value={formData.departamento}
                    onChange={(e) => setFormData({ ...formData, departamento: e.target.value as Departamento })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="Operaciones RAEE">Operaciones RAEE</option>
                    <option value="Laboratorio & Hidrometalurgia">Laboratorio & Hidrometalurgia</option>
                    <option value="Logística Inversa">Logística Inversa</option>
                    <option value="Seguridad & Salud Ocupacional">Seguridad & Salud Ocupacional (Ley 618)</option>
                    <option value="Recursos Humanos">Recursos Humanos</option>
                    <option value="Administración y Finanzas">Administración y Finanzas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Cargo / Puesto *</label>
                  <input
                    type="text"
                    required
                    value={formData.puesto}
                    onChange={(e) => setFormData({ ...formData, puesto: e.target.value })}
                    placeholder="ej: Técnico de Separación PCB"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Tipo de Contrato *</label>
                  <select
                    value={formData.tipoContrato}
                    onChange={(e) => setFormData({ ...formData, tipoContrato: e.target.value as TipoContrato })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="Indeterminado">Indeterminado (Ley 185)</option>
                    <option value="Determinado">Determinado por Proyecto RAEE</option>
                    <option value="Pasante UNCSM">Pasante Convenio UNCSM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Salario Base Mensual (C$ Córdobas) *</label>
                  <input
                    type="number"
                    min="6000"
                    step="500"
                    required
                    value={formData.salarioBaseCordobas}
                    onChange={(e) => setFormData({ ...formData, salarioBaseCordobas: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 font-mono text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Nivel de Riesgo RAEE (Ley 618)</label>
                  <select
                    value={formData.nivelRiesgoRaee}
                    onChange={(e) => setFormData({ ...formData, nivelRiesgoRaee: Number(e.target.value) as 1 | 2 | 3 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value={1}>Nivel 1: Administrativo / Logístico estándar</option>
                    <option value={2}>Nivel 2: Despiece mecánico RAEE (Masaya/MGA)</option>
                    <option value={3}>Nivel 3: Químicos & Hidrometalurgia (Carazo)</option>
                  </select>
                </div>
              </div>

              {/* Real-Time Wasm Feedback Box */}
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-3 space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center gap-1.5 font-sans font-bold text-emerald-900 text-xs">
                  <Calculator className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Proyección Inmediata Motor C / WebAssembly (Leyes Nicaragua)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-slate-700">
                  <div>INSS Lab (7%): <strong className="text-slate-900">C$ {wasmCalculoForm.inssLaboral.toLocaleString('es-NI')}</strong></div>
                  <div>IR Ley 822: <strong className="text-slate-900">C$ {wasmCalculoForm.irMensual.toLocaleString('es-NI')}</strong></div>
                  <div>Salario Neto: <strong className="text-emerald-700 font-bold">C$ {wasmCalculoForm.salarioNeto.toLocaleString('es-NI')}</strong></div>
                  <div>Costo Empresa: <strong className="text-slate-900">C$ {wasmCalculoForm.costoTotalEmpresa.toLocaleString('es-NI')}</strong></div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-500 transition-colors shadow-xs"
                >
                  Guardar en Expediente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
