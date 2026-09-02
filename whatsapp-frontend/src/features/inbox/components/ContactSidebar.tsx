import React, { useState } from 'react';
import { Phone, Mail, Building, Tag, FileText, X } from 'lucide-react';
import { ContactoMock } from '../types/inbox.types';

interface ContactSidebarProps {
  contacto: ContactoMock | null;
  onClose: () => void;
}

export const ContactSidebar: React.FC<ContactSidebarProps> = ({ contacto, onClose }) => {
  const [nota, setNota] = useState(contacto?.notas || '');
  const [guardado, setGuardado] = useState(false);

  if (!contacto) return null;

  const handleSaveNota = () => {
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  };

  return (
    <div className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 h-full overflow-y-auto shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
          Detalles del Contacto
        </span>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-5">
        {/* Profile Card */}
        <div className="flex flex-col items-center text-center pb-4 border-b border-slate-100">
          <div className="w-14 h-14 rounded-full bg-[#008069] text-white flex items-center justify-center font-black text-lg mb-2 shadow-sm">
            {contacto.nombre.substring(0, 2).toUpperCase()}
          </div>
          <h4 className="text-sm font-bold text-slate-900">{contacto.nombre}</h4>
          <span className="text-xs text-slate-600 font-medium">{contacto.organizacion}</span>
          <span className="mt-2 inline-block text-[10px] bg-slate-100 text-slate-800 border border-slate-300 px-2 py-0.5 rounded font-mono font-bold">
            ORIGEN: {contacto.origen.toUpperCase()}
          </span>
        </div>

        {/* Contact Info Items */}
        <div className="space-y-3 text-xs">
          <div className="flex items-center gap-2.5 text-slate-800">
            <Phone className="w-4 h-4 text-[#008069] shrink-0" />
            <span className="font-mono font-bold">{contacto.telefono}</span>
          </div>

          <div className="flex items-center gap-2.5 text-slate-800">
            <Mail className="w-4 h-4 text-[#008069] shrink-0" />
            <span className="truncate font-medium">{contacto.email}</span>
          </div>

          <div className="flex items-center gap-2.5 text-slate-800">
            <Building className="w-4 h-4 text-[#008069] shrink-0" />
            <span className="font-medium">{contacto.organizacion}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Tag className="w-3.5 h-3.5 text-[#008069]" />
            <span>Etiquetas</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {contacto.tags.map((t, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded font-bold"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Internal Notes */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <div className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#008069]" />
              <span>Notas Internas</span>
            </div>
            {guardado && <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">¡Guardado!</span>}
          </div>
          <textarea
            rows={4}
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            className="w-full text-xs p-2.5 border border-slate-300 rounded-md bg-slate-50 focus:outline-none focus:border-[#008069] text-slate-900 font-medium"
            placeholder="Escriba notas sobre este cliente..."
          />
          <button
            type="button"
            onClick={handleSaveNota}
            className="btn btn-xs bg-[#008069] hover:bg-[#006654] text-white border-none font-bold px-3.5 shadow-xs"
          >
            Guardar Nota
          </button>
        </div>
      </div>
    </div>
  );
};
