import React, { useState, useEffect, useCallback } from 'react';
import { Search, UserPlus } from 'lucide-react';
import { useTenant } from '../../../shared/hooks/useTenant';
import { contactsApi } from '../api/contacts.api';
import { ContactoMock } from '../types/contacts.types';
import { Spinner } from '../../../shared/components/feedback/Spinner';
import { formatDate } from '../../../shared/utils/formatters';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { Badge } from '../../../shared/components/ui/badge';
import { Avatar } from '../../../shared/components/ui/avatar';
import { Dialog } from '../../../shared/components/ui/dialog';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../../shared/components/ui/table';

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
          <h2 className="text-2xl font-bold text-white tracking-tight">Directorio de Contactos</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Clientes registrados para el tenant: <strong className="text-emerald-400">{empresaActual?.nombre}</strong>
          </p>
        </div>

        <Button
          onClick={() => setModalOpen(true)}
          className="gap-2 font-bold shadow-lg shadow-emerald-500/20"
        >
          <UserPlus className="w-4 h-4" />
          <span>Nuevo Contacto</span>
        </Button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <Input
          type="text"
          placeholder="Buscar por nombre, teléfono, empresa o etiqueta..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="pl-9 bg-slate-900 border-slate-800 text-xs"
        />
      </div>

      {/* Contacts Table */}
      {loading ? (
        <Spinner text="Cargando contactos..." />
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-500 rounded-xl border border-slate-800 bg-slate-900">
          No se encontraron contactos para los filtros aplicados.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contacto</TableHead>
              <TableHead>Organización</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Etiquetas</TableHead>
              <TableHead>Origen</TableHead>
              <TableHead>Alta</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((cnt) => (
              <TableRow key={cnt.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar
                      fallback={cnt.nombre.substring(0, 2).toUpperCase()}
                      size="sm"
                      className="bg-emerald-600/30 text-emerald-400 border-emerald-500/40 font-bold"
                    />
                    <div>
                      <div className="font-bold text-white text-xs">{cnt.nombre}</div>
                      <div className="text-[11px] text-slate-400">{cnt.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-slate-300 text-xs">{cnt.organizacion}</TableCell>
                <TableCell className="font-mono text-xs text-white font-bold">{cnt.telefono}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {cnt.tags.map((t, idx) => (
                      <Badge key={idx} variant="success" className="text-[10px]">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px] uppercase font-mono">
                    {cnt.origen}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-400 text-[11px] font-mono">
                  {formatDate(cnt.fechaCreacion)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Dialog Modal Crear Contacto */}
      <Dialog
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Registrar Nuevo Contacto"
        description="Ingresa los datos para agregar un contacto a la agenda corporativa"
      >
        <form onSubmit={handleCrearContacto} className="space-y-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Nombre Completo *</label>
            <Input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Valeria Gómez"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Teléfono WhatsApp (con código país) *</label>
            <Input
              type="text"
              required
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="+54 9 11 1234-5678"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Correo Electrónico</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="cliente@empresa.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Organización / Razón Social</label>
            <Input
              type="text"
              value={organizacion}
              onChange={(e) => setOrganizacion(e.target.value)}
              placeholder="Ej. Corporación Sur S.A."
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Etiquetas (separadas por coma)</label>
            <Input
              type="text"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              placeholder="VIP, Cotización, Nivel 1"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Notas Internas</label>
            <textarea
              rows={2}
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              className="w-full text-xs p-3 rounded-lg border border-slate-800 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Observaciones de atención comercial..."
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              className="font-bold"
            >
              Guardar Contacto
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default ContactsPage;
