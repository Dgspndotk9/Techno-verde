import React from 'react';
import { PasanteUNCSM } from '../types';
import { Printer, X, Award, GraduationCap, Building2 } from 'lucide-react';

interface InternshipCertificateModalProps {
  pasante: PasanteUNCSM | null;
  onClose: () => void;
}

export const InternshipCertificateModal: React.FC<InternshipCertificateModalProps> = ({ pasante, onClose }) => {
  if (!pasante) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden my-8">
        {/* Modal Toolbar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm">Certificado de Acreditación de Prácticas Profesionales UNCSM</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors"
            >
              <Printer className="w-4 h-4" />
              Imprimir Certificado
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Body (Formal Academic Document) */}
        <div className="p-10 text-slate-800 bg-white border-8 border-double border-emerald-900/20 m-4 rounded-lg relative print:m-0 print:border-none" id="certificado-uncsm">
          {/* Watermark / Seal background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none">
            <Award className="w-96 h-96 text-emerald-950" />
          </div>

          {/* Academic Crest & Header */}
          <div className="text-center pb-6 border-b border-emerald-800/20 relative z-10">
            <p className="text-xs tracking-widest text-emerald-800 font-bold uppercase mb-1">
              República de Nicaragua · Consejo Nacional de Universidades (CNU)
            </p>
            <h1 className="text-xl md:text-2xl font-serif font-bold text-slate-900 tracking-wide">
              UNIVERSIDAD NACIONAL CASIMIRO SOTELO MONTENEGRO
            </h1>
            <p className="text-sm font-semibold text-emerald-700">Y TECHNO-VERDE S.A. (SOLUCIONES CIRCULARES RAEE)</p>
            <p className="text-xs text-slate-500 italic mt-1">Convenio Marco de Colaboración Académica, Científica y Tecnológica No. UNCSM-TV-2024-08</p>
          </div>

          {/* Certificate Awarding Text */}
          <div className="my-8 text-center space-y-4 relative z-10">
            <p className="text-sm text-slate-600 uppercase tracking-widest">
              HACEN CONSTAR QUE EL ESTUDIANTE:
            </p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-emerald-900">
              {pasante.nombreCompleto}
            </h2>
            <p className="text-xs text-slate-600 font-mono">
              Carnet Estudiantil UNCSM: <span className="font-semibold">{pasante.carnetUncsm}</span> · {pasante.facultad}
            </p>
            <p className="text-sm font-semibold text-slate-800">
              Carrera: {pasante.carrera} ({pasante.anioAcademico})
            </p>

            <div className="max-w-xl mx-auto text-xs text-slate-700 leading-relaxed text-justify pt-2">
              Ha culminado satisfactoriamente su programa de <span className="font-semibold">Prácticas Profesionales y Pasantía Técnica</span> en las instalaciones de la empresa <span className="font-semibold">Techno-Verde S.A.</span>, sucursal <span className="font-semibold">{pasante.sucursalAsignada}</span>, acumulando un total certificado de <span className="font-semibold font-mono">{pasante.horasCompletadas} horas prácticas</span> (de {pasante.horasRequeridas} horas requeridas por el currículo de la UNCSM).
            </div>

            {/* Research Project Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 max-w-xl mx-auto text-left text-xs">
              <span className="font-semibold text-slate-800 block mb-0.5">Proyecto de Investigación Aplicada:</span>
              <p className="text-slate-600 italic">"{pasante.proyectoInvestigacionRaee}"</p>
              <div className="mt-2 flex justify-between text-[11px] text-slate-500 border-t border-slate-200 pt-1">
                <span>Período: {pasante.fechaInicio} al {pasante.fechaFin}</span>
                <span className="font-semibold text-emerald-700">Calificación Obtenida: {pasante.evaluacionDesempeno}/100</span>
              </div>
            </div>
          </div>

          {/* Academic Signatures */}
          <div className="pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs relative z-10">
            <div>
              <div className="h-16 border-b border-slate-400 mb-2 flex items-end justify-center">
                <span className="text-[10px] text-slate-400 italic">Firma y Sello Académico</span>
              </div>
              <p className="font-semibold text-slate-900">{pasante.tutorUncsm}</p>
              <p className="text-slate-500">Tutor Académico · UNCSM Managua</p>
            </div>
            <div>
              <div className="h-16 border-b border-slate-400 mb-2 flex items-end justify-center">
                <span className="text-[10px] text-slate-400 italic">Firma y Sello Empresarial</span>
              </div>
              <p className="font-semibold text-slate-900">{pasante.tutorTechnoVerde}</p>
              <p className="text-slate-500">Tutor de Planta · Techno-Verde S.A.</p>
            </div>
          </div>

          {/* Seal / Legal validation note */}
          <div className="mt-8 text-center text-[10px] text-slate-400 relative z-10">
            <p>Acreditado conforme a la Ley de Autonomía de las Instituciones de Educación Superior (Ley 89) y Código del Trabajo de Nicaragua (Ley 185).</p>
            <p className="font-mono mt-0.5">Código de Verificación Digital: UNCSM-TV-RAEE-{pasante.carnetUncsm.replace('-', '')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
