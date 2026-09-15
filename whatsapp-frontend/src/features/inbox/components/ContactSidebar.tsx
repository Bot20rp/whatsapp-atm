import React, { useState } from 'react';
import { Phone, Mail, Building, Tag, FileText, X } from 'lucide-react';
import { ContactoMock } from '../types/inbox.types';
import { Button } from '../../../shared/components/ui/button';
import { Badge } from '../../../shared/components/ui/badge';
import { Avatar } from '../../../shared/components/ui/avatar';

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
    <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 h-full overflow-y-auto shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Detalles del Contacto
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-7 w-7 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4 space-y-5">
        {/* Profile Card */}
        <div className="flex flex-col items-center text-center pb-4 border-b border-slate-800">
          <Avatar
            fallback={contacto.nombre.substring(0, 2).toUpperCase()}
            size="lg"
            className="w-16 h-16 bg-emerald-600/30 text-emerald-400 border-emerald-500/40 text-xl font-bold mb-3 shadow-lg"
          />
          <h4 className="text-sm font-bold text-white">{contacto.nombre}</h4>
          <span className="text-xs text-slate-400 font-medium">{contacto.organizacion}</span>
          <Badge variant="outline" className="mt-2 text-[10px] uppercase font-mono">
            ORIGEN: {contacto.origen}
          </Badge>
        </div>

        {/* Contact Info Items */}
        <div className="space-y-3 text-xs">
          <div className="flex items-center gap-2.5 text-slate-300">
            <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-mono font-bold">{contacto.telefono}</span>
          </div>

          <div className="flex items-center gap-2.5 text-slate-300">
            <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate font-medium">{contacto.email}</span>
          </div>

          <div className="flex items-center gap-2.5 text-slate-300">
            <Building className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{contacto.organizacion}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2 pt-3 border-t border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
            <Tag className="w-3.5 h-3.5 text-emerald-400" />
            <span>Etiquetas</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {contacto.tags.map((t, idx) => (
              <Badge key={idx} variant="success" className="text-[10px]">
                {t}
              </Badge>
            ))}
          </div>
        </div>

        {/* Internal Notes */}
        <div className="space-y-2 pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <div className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Notas Internas</span>
            </div>
            {guardado && <Badge variant="success" className="text-[10px]">¡Guardado!</Badge>}
          </div>
          <textarea
            rows={4}
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            className="w-full text-xs p-3 border border-slate-800 rounded-xl bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Escriba notas sobre este cliente..."
          />
          <Button
            type="button"
            size="sm"
            onClick={handleSaveNota}
            className="w-full font-bold text-xs"
          >
            Guardar Nota
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactSidebar;
