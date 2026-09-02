import React, { useState, useEffect, useCallback } from 'react';
import { Search, UserPlus } from 'lucide-react';
import { useTenant } from '../../../shared/hooks/useTenant';
import { contactsApi } from '../api/contacts.api';
import { ContactoMock } from '../types/contacts.types';
import { Spinner } from '../../../shared/components/feedback/Spinner';
import { formatDate } from '../../../shared/utils/formatters';

export const ContactsPage: React.FC = () => {
  const { empresaActual } = useTenant();
  const [contactos, setContactos] = useState<ContactoMock[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [organizacion, setOrganizacion] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [notas, setNotas] = useState('');

  const cargarContactos = useCallback(async () => {
    if (!empresaActual) return;
    try {
      setLoading(true);
      const res = await contactsApi.getContactos(empresaActual.id);
      setContactos(res);
    } finally {
      setLoading(false);
    }
  }, [empresaActual?.id]);

  useEffect(() => {
    cargarContactos();
  }, [cargarContactos]);

  const handleCrearContacto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empresaActual || !nombre || !telefono) return;

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    await contactsApi.crearContacto(empresaActual.id, {
      nombre,
      telefono,
      email,
      organizacion,
      tags: tags.length ? tags : ['General'],
      notas,
      estado: 'activo',
      origen: 'whatsapp',
    });

    setModalOpen(false);
    setNombre('');
    setTelefono('');
    setEmail('');
    setOrganizacion('');
    setTagsStr('');
    setNotas('');
    cargarContactos();
  };

  const filtered = contactos.filter((c) => {
    const q = busqueda.toLowerCase();
    return (
      c.nombre.toLowerCase().includes(q) ||
      c.telefono.includes(q) ||
      c.organizacion.toLowerCase().includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Directorio de Contactos</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Clientes registrados para el tenant: <strong className="text-[#008069]">{empresaActual?.nombre}</strong>
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="btn btn-sm bg-[#008069] hover:bg-[#006654] text-white text-xs border-none font-bold px-4 flex items-center gap-1.5 shadow-sm"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Nuevo Contacto</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-3 border border-slate-200 rounded-lg flex items-center gap-3 shadow-xs">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por nombre, teléfono, empresa o etiqueta..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full text-xs text-slate-900 bg-transparent focus:outline-none font-medium"
        />
      </div>

      {/* Contacts Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        {loading ? (
          <Spinner text="Cargando contactos..." />
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No se encontraron contactos para los filtros aplicados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                  <th className="p-3.5">Contacto</th>
                  <th className="p-3.5">Organización</th>
                  <th className="p-3.5">Teléfono</th>
                  <th className="p-3.5">Etiquetas</th>
                  <th className="p-3.5">Origen</th>
                  <th className="p-3.5">Alta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((cnt) => (
                  <tr key={cnt.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#008069] text-white flex items-center justify-center font-black shadow-xs">
                          {cnt.nombre.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{cnt.nombre}</div>
                          <div className="text-[11px] text-slate-500 font-medium">{cnt.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-700 font-semibold">{cnt.organizacion}</td>
                    <td className="p-3.5 font-mono text-slate-800 font-bold">{cnt.telefono}</td>
                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1">
                        {cnt.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded font-bold"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300 font-bold">
                        {cnt.origen}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-600 text-[11px] font-mono font-medium">
                      {formatDate(cnt.fechaCreacion)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Crear Contacto */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-black text-slate-900 mb-4 pb-2 border-b border-slate-200">
              Registrar Nuevo Contacto
            </h3>

            <form onSubmit={handleCrearContacto} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-md focus:outline-none focus:border-[#008069] focus:ring-1 focus:ring-[#008069]"
                  placeholder="Ej. Valeria Gómez"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Teléfono WhatsApp (con código país) *</label>
                <input
                  type="text"
                  required
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-md focus:outline-none focus:border-[#008069] focus:ring-1 focus:ring-[#008069]"
                  placeholder="+54 9 11 1234-5678"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-md focus:outline-none focus:border-[#008069] focus:ring-1 focus:ring-[#008069]"
                  placeholder="cliente@empresa.com"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Organización / Razón Social</label>
                <input
                  type="text"
                  value={organizacion}
                  onChange={(e) => setOrganizacion(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-md focus:outline-none focus:border-[#008069] focus:ring-1 focus:ring-[#008069]"
                  placeholder="Ej. Corporación Sur S.A."
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Etiquetas (separadas por coma)</label>
                <input
                  type="text"
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-md focus:outline-none focus:border-[#008069] focus:ring-1 focus:ring-[#008069]"
                  placeholder="VIP, Cotización, Nivel 1"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Notas Internas</label>
                <textarea
                  rows={2}
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-md focus:outline-none focus:border-[#008069] focus:ring-1 focus:ring-[#008069]"
                  placeholder="Observaciones de atención comercial..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-sm bg-slate-100 hover:bg-slate-200 text-slate-700 border-none text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-sm bg-[#008069] hover:bg-[#006654] text-white border-none text-xs font-bold px-4 shadow-sm"
                >
                  Guardar Contacto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsPage;
