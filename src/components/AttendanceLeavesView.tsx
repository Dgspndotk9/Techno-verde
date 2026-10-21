import React, { useState } from 'react';
import { PermisoLaboral, RegistroAsistencia, Sucursal } from '../types';
import {
  Clock,
  CalendarCheck,
  CalendarDays,
  ShieldAlert,
  Plus,
  CheckCircle2,
  FileText,
  User,
  AlertTriangle,
} from 'lucide-react';

interface AttendanceLeavesViewProps {
  asistencias: RegistroAsistencia[];
  permisos: PermisoLaboral[];
  onAddPermiso: (permiso: PermisoLaboral) => void;
  selectedSucursal: Sucursal | 'Todas';
}

export const AttendanceLeavesView: React.FC<AttendanceLeavesViewProps> = ({
  asistencias,
  permisos,
  onAddPermiso,
  selectedSucursal,
}) => {
  const [activeTab, setActiveTab] = useState<'asistencia' | 'permisos'>('asistencia');
  const [isPermisoModalOpen, setIsPermisoModalOpen] = useState(false);

  // Permiso Form State
  const [permisoForm, setPermisoForm] = useState({
    nombreColaborador: '',
    sucursal: 'Managua' as Sucursal,
    tipo: 'Enfermedad Común (Subsidio INSS)' as PermisoLaboral['tipo'],
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    diasHabiles: 3,
    cubiertoPorInss: true,
    comentarioLegal: 'Subsidio médico avalado por clínica previsional del INSS.',
  });

  const filteredAsistencias = selectedSucursal === 'Todas'
    ? asistencias
    : asistencias.filter((a) => a.sucursal === selectedSucursal);

  const filteredPermisos = selectedSucursal === 'Todas'
    ? permisos
    : permisos.filter((p) => p.sucursal === selectedSucursal);

  const handleCreatePermiso = (e: React.FormEvent) => {
    e.preventDefault();
    if (!permisoForm.nombreColaborador) return;

    const newPermiso: PermisoLaboral = {
      id: `perm-${Date.now()}`,
      colaboradorId: `col-${Date.now().toString().slice(-4)}`,
      nombreColaborador: permisoForm.nombreColaborador,
      sucursal: permisoForm.sucursal,
      tipo: permisoForm.tipo,
      fechaInicio: permisoForm.fechaInicio,
      fechaFin: permisoForm.fechaFin,
      diasHabiles: Number(permisoForm.diasHabiles) || 1,
      estado: 'Aprobado',
      cubiertoPorInss: permisoForm.tipo.includes('INSS'),
      comentarioLegal: permisoForm.comentarioLegal,
    };

    onAddPermiso(newPermiso);
    setIsPermisoModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-700" />
            <span>Control de Asistencia & Licencias Laborales</span>
          </h2>
          <p className="text-xs text-slate-500">
            Marcaje de turnos, horas extraordinarias y subsidios del INSS según Código del Trabajo (Ley 185)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setActiveTab('asistencia')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'asistencia' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Registro de Turnos
            </button>
            <button
              onClick={() => setActiveTab('permisos')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'permisos' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Licencias & Subsidios INSS
            </button>
          </div>

          <button
            onClick={() => setIsPermisoModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tramitar Licencia</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Asistencia */}
      {activeTab === 'asistencia' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-slate-900">Marcajes del Día de Hoy</span>
              <span className="text-slate-400 ml-2 font-mono">21 de Octubre de 2026</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">
              Sincronizado con relojes biométricos de Managua, Masaya, Carazo y Granada
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Colaborador</th>
                  <th className="py-3 px-4">Sucursal</th>
                  <th className="py-3 px-4">Turno Asignado</th>
                  <th className="py-3 px-4 font-mono text-center">Hora Entrada</th>
                  <th className="py-3 px-4 font-mono text-center">Hora Salida</th>
                  <th className="py-3 px-4 text-center">Horas Extras</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAsistencias.map((ast) => (
                  <tr key={ast.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {ast.nombreCompleto}
                    </td>

                    <td className="py-3 px-4 text-slate-700">
                      {ast.sucursal}
                    </td>

                    <td className="py-3 px-4 text-slate-600 text-[11px]">
                      {ast.turno}
                    </td>

                    <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-700">
                      {ast.horaEntrada}
                    </td>

                    <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-700">
                      {ast.horaSalida}
                    </td>

                    <td className="py-3 px-4 text-center font-mono tabular-nums font-semibold">
                      {ast.horasExtrasTrabajadas > 0 ? (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          +{ast.horasExtrasTrabajadas}h (100%)
                        </span>
                      ) : (
                        <span className="text-slate-400">0h</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-800">
                        {ast.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Permisos & Subsidios INSS */}
      {activeTab === 'permisos' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 block">Licencias por Maternidad</span>
              <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">84 Días</span>
              <span className="text-[11px] text-slate-400 block mt-1">4 sem. pre-natal y 8 post-natal (INSS 60% / Patr. 40%)</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 block">Incapacidad Común INSS</span>
              <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">Subsidio 60%</span>
              <span className="text-[11px] text-slate-400 block mt-1">A partir del 4to día según Ley de Seguridad Social</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 block">Licencias Especiales Ley 185</span>
              <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">Art. 73</span>
              <span className="text-[11px] text-slate-400 block mt-1">Matrimonio (5d), Paternidad (3d), Duelo (3d)</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Colaborador</th>
                    <th className="py-3 px-4">Sucursal</th>
                    <th className="py-3 px-4">Tipo de Licencia</th>
                    <th className="py-3 px-4">Período</th>
                    <th className="py-3 px-4 text-center">Días</th>
                    <th className="py-3 px-4">Cobertura Legal</th>
                    <th className="py-3 px-4 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPermisos.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {p.nombreColaborador}
                      </td>

                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {p.sucursal}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-900 block">{p.tipo}</span>
                        <span className="text-[11px] text-slate-500 line-clamp-1">{p.comentarioLegal}</span>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-600">
                        {p.fechaInicio} al {p.fechaFin}
                      </td>

                      <td className="py-3 px-4 text-center font-mono tabular-nums font-semibold text-slate-800">
                        {p.diasHabiles} d
                      </td>

                      <td className="py-3 px-4">
                        {p.cubiertoPorInss ? (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px] font-medium">
                            Subsidio INSS
                          </span>
                        ) : (
                          <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium">
                            Goce Salario Empleador
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-800">
                          {p.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* New Permiso Modal */}
      {isPermisoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden my-6">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <span className="font-semibold text-sm">Tramitar Licencia / Permiso Laboral</span>
              <button
                onClick={() => setIsPermisoModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePermiso} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nombre del Colaborador *</label>
                <input
                  type="text"
                  required
                  value={permisoForm.nombreColaborador}
                  onChange={(e) => setPermisoForm({ ...permisoForm, nombreColaborador: e.target.value })}
                  placeholder="ej: Carlos Alberto Mendoza"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Sucursal *</label>
                  <select
                    value={permisoForm.sucursal}
                    onChange={(e) => setPermisoForm({ ...permisoForm, sucursal: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Managua">Managua</option>
                    <option value="Masaya">Masaya</option>
                    <option value="Carazo">Carazo</option>
                    <option value="Granada">Granada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Días Hábiles *</label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={permisoForm.diasHabiles}
                    onChange={(e) => setPermisoForm({ ...permisoForm, diasHabiles: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Tipo de Licencia Legal *</label>
                <select
                  value={permisoForm.tipo}
                  onChange={(e) => setPermisoForm({ ...permisoForm, tipo: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="Enfermedad Común (Subsidio INSS)">Enfermedad Común (Subsidio INSS)</option>
                  <option value="Maternidad (Pre y Post Natal)">Maternidad (84 días pre y post natal)</option>
                  <option value="Paternidad (Ley 185)">Paternidad (3 días remunerados Art. 73)</option>
                  <option value="Matrimonio">Matrimonio (5 días remunerados Art. 73)</option>
                  <option value="Duelo Familiar">Duelo Familiar (3 días remunerados Art. 73)</option>
                  <option value="Defensa de Tesis UNCSM">Defensa de Grado UNCSM (Convenio)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Fecha de Inicio *</label>
                  <input
                    type="date"
                    value={permisoForm.fechaInicio}
                    onChange={(e) => setPermisoForm({ ...permisoForm, fechaInicio: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Fecha de Conclusión *</label>
                  <input
                    type="date"
                    value={permisoForm.fechaFin}
                    onChange={(e) => setPermisoForm({ ...permisoForm, fechaFin: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Dictamen / Referencia Médica o Legal</label>
                <textarea
                  rows={2}
                  value={permisoForm.comentarioLegal}
                  onChange={(e) => setPermisoForm({ ...permisoForm, comentarioLegal: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsPermisoModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-500"
                >
                  Autorizar Licencia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
