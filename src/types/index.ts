export type Sucursal = 'Managua' | 'Masaya' | 'Carazo' | 'Granada';

export type Departamento =
  | 'Operaciones RAEE'
  | 'Laboratorio & Hidrometalurgia'
  | 'Logística Inversa'
  | 'Seguridad & Salud Ocupacional'
  | 'Recursos Humanos'
  | 'Administración y Finanzas';

export type TipoContrato = 'Indeterminado' | 'Determinado' | 'Pasante UNCSM';

export type EstadoColaborador = 'Activo' | 'Vacaciones' | 'Incapacidad INSS' | 'Inactivo';

export interface Colaborador {
  id: string;
  codigoEmpleado: string; // ej: "TV-MGA-042"
  nombre: string;
  apellido: string;
  cedula: string;         // Formato Cédula Nicaragua: "001-140592-0023K"
  numeroInss: string;     // Formato INSS: "8492031-4"
  telefono: string;       // ej: "+505 8890-1234"
  email: string;
  sucursal: Sucursal;
  departamento: Departamento;
  puesto: string;
  fechaIngreso: string;   // YYYY-MM-DD
  salarioBaseCordobas: number; // en Córdobas (C$)
  tipoContrato: TipoContrato;
  estado: EstadoColaborador;
  nivelRiesgoRaee: 1 | 2 | 3; // 1: Oficina/Admin, 2: Despiece Masaya/MGA, 3: Hidrometalurgia Carazo
  horasSemanales: number;
  diasVacacionesDisponibles: number;
  esPasanteUncsm?: boolean;
}

export interface PasanteUNCSM {
  id: string;
  colaboradorId: string;
  nombreCompleto: string;
  carnetUncsm: string;    // ej: "2022-0481U"
  carrera: 'Ingeniería Ambiental' | 'Ingeniería Electrónica' | 'Ingeniería Industrial' | 'Ingeniería en Computación';
  facultad: 'Facultad de Ciencias Tecnológicas' | 'Facultad de Ciencias y Medio Ambiente';
  anioAcademico: '4to Año' | '5to Año' | 'Fase de Tesis';
  tutorUncsm: string;
  tutorTechnoVerde: string;
  sucursalAsignada: Sucursal;
  horasRequeridas: number;
  horasCompletadas: number;
  proyectoInvestigacionRaee: string;
  fechaInicio: string;
  fechaFin: string;
  estipendioMensualCordobas: number;
  evaluacionDesempeno: number; // 0 a 100
  estadoConvenio: 'Activo' | 'Completado' | 'En Evaluación';
}

export interface SucursalInfo {
  id: Sucursal;
  nombre: string;
  ciudad: string;
  departamentoGeo: string;
  direccion: string;
  telefono: string;
  especialidadRaee: string;
  capacidadToneladasMes: number;
  totalColaboradores: number;
  totalPasantesUncsm: number;
  responsableSede: string;
}

export interface RegistroNomina {
  id: string;
  colaboradorId: string;
  nombreCompleto: string;
  cedula: string;
  numeroInss: string;
  puesto: string;
  sucursal: Sucursal;
  salarioBase: number;
  horasExtras: number;
  horasExtrasMonto: number;
  bonoRiesgoRaee: number;
  totalDevengado: number;
  inssLaboral: number;    // 7%
  irMensual: number;      // Ley 822
  otrasDeducciones: number;
  totalDeducciones: number;
  salarioNetoPagar: number;
  inssPatronal: number;   // 22.5%
  inatecPatronal: number; // 2%
  costoPatronalTotal: number;
  periodo: string;        // ej: "Octubre 2026 - Quincena 2"
  fechaCalculo: string;
}

export interface PermisoLaboral {
  id: string;
  colaboradorId: string;
  nombreColaborador: string;
  sucursal: Sucursal;
  tipo: 'Enfermedad Común (Subsidio INSS)' | 'Maternidad (Pre y Post Natal)' | 'Paternidad (Ley 185)' | 'Duelo Familiar' | 'Matrimonio' | 'Defensa de Tesis UNCSM';
  fechaInicio: string;
  fechaFin: string;
  diasHabiles: number;
  estado: 'Aprobado' | 'Pendiente' | 'Finalizado';
  cubiertoPorInss: boolean;
  comentarioLegal: string;
}

export interface RegistroAsistencia {
  id: string;
  colaboradorId: string;
  nombreCompleto: string;
  sucursal: Sucursal;
  fecha: string;
  horaEntrada: string;
  horaSalida: string;
  estado: 'Puntual' | 'Retardo' | 'Permiso' | 'Falta';
  horasExtrasTrabajadas: number;
  turno: 'Matutino (6:00 - 14:00)' | 'Vespertino (14:00 - 22:00)' | 'Diurno Oficina (8:00 - 17:00)';
}
