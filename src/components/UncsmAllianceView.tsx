import React, { useState } from 'react';
import { PasanteUNCSM, Sucursal } from '../types';
import {
  GraduationCap,
  Award,
  BookOpen,
  FileCheck2,
  Users,
  Search,
  Plus,
  Building,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Download,
  Printer,
  Sparkles,
} from 'lucide-react';
import uncsmBannerImage from '../assets/images/uncsm_alliance_banner_1792623864776.jpg';
import { InternshipCertificateModal } from './InternshipCertificateModal';

interface UncsmAllianceViewProps {
  pasantes: PasanteUNCSM[];
  onAddPasante: (pasante: PasanteUNCSM) => void;
  selectedSucursal: Sucursal | 'Todas';
}

export const UncsmAllianceView: React.FC<UncsmAllianceViewProps> = ({
  pasantes,
  onAddPasante,
  selectedSucursal,
}) => {
  const [selectedPasanteCert, setSelectedPasanteCert] = useState<PasanteUNCSM | null>(null);
  const [carreraFilter, setCarreraFilter] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Intern Form State
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    carnetUncsm: '2022-',
    carrera: 'Ingeniería Ambiental' as PasanteUNCSM['carrera'],
    facultad: 'Facultad de Ciencias y Medio Ambiente' as PasanteUNCSM['facultad'],
    anioAcademico: '5to Año' as PasanteUNCSM['anioAcademico'],
    tutorUncsm: 'MSc. Guillermo Estrada López (UNCSM)',
    tutorTechnoVerde: 'Ing. Carlos Mendoza Rivas',
    sucursalAsignada: 'Managua' as Sucursal,
    horasRequeridas: 400,
    proyectoInvestigacionRaee: '',
    estipendioMensualCordobas: 7500,
  });

  const filteredPasantes = pasantes.filter((p) => {
    const matchSucursal = selectedSucursal === 'Todas' || p.sucursalAsignada === selectedSucursal;
    const matchCarrera = carreraFilter === 'Todas' || p.carrera === carreraFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      p.nombreCompleto.toLowerCase().includes(q) ||
      p.carnetUncsm.toLowerCase().includes(q) ||
      p.proyectoInvestigacionRaee.toLowerCase().includes(q);

    return matchSucursal && matchCarrera && matchSearch;
  });

  const handleRegisterIntern = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombreCompleto || !formData.carnetUncsm) return;

    const newPasante: PasanteUNCSM = {
      id: `pas-${Date.now()}`,
      colaboradorId: `col-pas-${Date.now().toString().slice(-4)}`,
      nombreCompleto: formData.nombreCompleto,
      carnetUncsm: formData.carnetUncsm,
      carrera: formData.carrera,
      facultad: formData.facultad,
      anioAcademico: formData.anioAcademico,
      tutorUncsm: formData.tutorUncsm,
      tutorTechnoVerde: formData.tutorTechnoVerde,
      sucursalAsignada: formData.sucursalAsignada,
      horasRequeridas: Number(formData.horasRequeridas) || 400,
      horasCompletadas: 40,
      proyectoInvestigacionRaee: formData.proyectoInvestigacionRaee || 'Aprovechamiento sostenible de metales pesados en RAEE',
      fechaInicio: '2026-03-01',
      fechaFin: '2026-08-30',
      estipendioMensualCordobas: Number(formData.estipendioMensualCordobas) || 7500,
      evaluacionDesempeno: 92,
      estadoConvenio: 'Activo',
    };

    onAddPasante(newPasante);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Alliance Banner */}
      <section className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 text-white shadow-lg">
        <div className="relative min-h-[300px] flex flex-col justify-end p-6 sm:p-8 z-10">
          <div className="absolute inset-0 -z-10">
            <img
              src={uncsmBannerImage}
              alt="Alianza Universidad Nacional Casimiro Sotelo Montenegro y Techno-Verde"
              className="w-full h-full object-cover object-center opacity-35"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/40" />
          </div>

          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold tracking-wider uppercase">
              <span>Convenio Marco de Cooperación Académica e Investigación</span>
              <span aria-hidden="true">·</span>
              <span>UNCSM No. 2024-08</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white text-balance">
              Universidad Nacional Casimiro Sotelo Montenegro & Techno-Verde
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
              Alianza estratégica nacional para el desarrollo de talento científico nicaragüense en reciclaje de residuos electrónicos (RAEE), metalurgia limpia, biorremediación y logística verde en el Pacífico de Nicaragua.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
              <span className="px-3 py-1.5 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-medium">
                24 Estudiantes en Prácticas Activas
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700 font-medium">
                4 Facultades Involucradas
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700 font-medium">
                Estipendio Integral de Transporte y Alimentación
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Alliance Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pasantes en Convenio</span>
            <GraduationCap className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-3">
            {filteredPasantes.length}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Asignados en Managua, Masaya, Carazo y Granada
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Horas Prácticas Acumuladas</span>
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-3">
            {filteredPasantes.reduce((a, b) => a + b.horasCompletadas, 0).toLocaleString()} <span className="text-xs font-sans font-normal text-slate-500">hrs</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Acreditadas ante el registro académico de la UNCSM
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Proyectos de Tesis Activos</span>
            <Award className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-3">
            8
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Investigaciones aplicadas de economía circular en RAEE
          </p>
        </div>
      </section>

      {/* Directory of Interns */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Directorio de Estudiantes Pasantes de la UNCSM
            </h2>
            <p className="text-xs text-slate-500">
              Control de horas curriculares, tutores asignados y emisión de certificados oficiales
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Incorporar Nuevo Pasante UNCSM</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por estudiante, carnet UNCSM o proyecto..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Carrera:</span>
            <select
              value={carreraFilter}
              onChange={(e) => setCarreraFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-white text-slate-700 focus:outline-none focus:border-emerald-500"
            >
              <option value="Todas">Todas las Carreras</option>
              <option value="Ingeniería Ambiental">Ingeniería Ambiental</option>
              <option value="Ingeniería Electrónica">Ingeniería Electrónica</option>
              <option value="Ingeniería Industrial">Ingeniería Industrial</option>
              <option value="Ingeniería en Computación">Ingeniería en Computación</option>
            </select>
          </div>
        </div>

        {/* Cards Grid of Interns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPasantes.map((pas) => {
            const pct = Math.min(100, Math.round((pas.horasCompletadas / pas.horasRequeridas) * 100));

            return (
              <div
                key={pas.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{pas.nombreCompleto}</h3>
                      <p className="text-xs font-mono text-emerald-800 font-medium">
                        Carnet UNCSM: {pas.carnetUncsm} · {pas.anioAcademico}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Planta {pas.sucursalAsignada}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-700 mt-2">
                    {pas.carrera} ({pas.facultad})
                  </p>

                  {/* Project description */}
                  <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                    <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                      Proyecto de Investigación RAEE:
                    </span>
                    <p className="text-slate-700 italic text-[11px] leading-relaxed">
                      "{pas.proyectoInvestigacionRaee}"
                    </p>
                  </div>

                  {/* Hours Progress */}
                  <div className="mt-3 space-y-1 text-xs">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Horas de Práctica Acreditadas:</span>
                      <span className="font-mono font-bold text-slate-800">
                        {pas.horasCompletadas} / {pas.horasRequeridas} hrs ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Tutors */}
                  <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                    <div>
                      <span className="block font-medium text-slate-700">Tutor UNCSM:</span>
                      <span className="line-clamp-1">{pas.tutorUncsm}</span>
                    </div>
                    <div>
                      <span className="block font-medium text-slate-700">Tutor Techno-Verde:</span>
                      <span className="line-clamp-1">{pas.tutorTechnoVerde}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                  <div className="font-mono text-[11px] text-slate-600">
                    Estipendio: <strong className="text-slate-900">C$ {pas.estipendioMensualCordobas.toLocaleString('es-NI')}</strong>
                  </div>

                  <button
                    onClick={() => setSelectedPasanteCert(pas)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg transition-colors"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Emitir Certificado UNCSM</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Certificate Modal */}
      {selectedPasanteCert && (
        <InternshipCertificateModal
          pasante={selectedPasanteCert}
          onClose={() => setSelectedPasanteCert(null)}
        />
      )}

      {/* New Intern Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-6">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
                <span className="font-semibold text-sm">Registrar Nuevo Pasante UNCSM</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterIntern} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Nombre Completo del Estudiante *</label>
                  <input
                    type="text"
                    required
                    value={formData.nombreCompleto}
                    onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
                    placeholder="ej: José Daniel Fonseca"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">No. Carnet UNCSM *</label>
                  <input
                    type="text"
                    required
                    value={formData.carnetUncsm}
                    onChange={(e) => setFormData({ ...formData, carnetUncsm: e.target.value })}
                    placeholder="2022-0941U"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Carrera *</label>
                  <select
                    value={formData.carrera}
                    onChange={(e) => setFormData({ ...formData, carrera: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="Ingeniería Ambiental">Ingeniería Ambiental</option>
                    <option value="Ingeniería Electrónica">Ingeniería Electrónica</option>
                    <option value="Ingeniería Industrial">Ingeniería Industrial</option>
                    <option value="Ingeniería en Computación">Ingeniería en Computación</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Nivel Académico</label>
                  <select
                    value={formData.anioAcademico}
                    onChange={(e) => setFormData({ ...formData, anioAcademico: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="4to Año">4to Año</option>
                    <option value="5to Año">5to Año</option>
                    <option value="Fase de Tesis">Fase de Tesis de Grado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Sucursal Asignada *</label>
                  <select
                    value={formData.sucursalAsignada}
                    onChange={(e) => setFormData({ ...formData, sucursalAsignada: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="Managua">Managua (Planta Acahualinca)</option>
                    <option value="Masaya">Masaya (Reacondicionamiento)</option>
                    <option value="Carazo">Carazo (Hidrometalurgia Jinotepe)</option>
                    <option value="Granada">Granada (Centro Logístico)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Horas Curriculares Requeridas</label>
                  <input
                    type="number"
                    value={formData.horasRequeridas}
                    onChange={(e) => setFormData({ ...formData, horasRequeridas: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Proyecto de Investigación RAEE / Tesis</label>
                <textarea
                  rows={2}
                  value={formData.proyectoInvestigacionRaee}
                  onChange={(e) => setFormData({ ...formData, proyectoInvestigacionRaee: e.target.value })}
                  placeholder="ej: Análisis de lixiviación ácida para la recuperación de oro de contactos PCB..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                />
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
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-500 transition-colors"
                >
                  Registrar en Alianza UNCSM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
