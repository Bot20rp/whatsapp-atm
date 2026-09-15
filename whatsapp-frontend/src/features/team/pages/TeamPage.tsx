import React, { useState, useEffect, useCallback } from 'react';
import { UserPlus, Smartphone, CheckCircle2 } from 'lucide-react';
import { useTenant } from '../../../shared/hooks/useTenant';
import { teamApi } from '../api/team.api';
import { MiembroEquipoMock } from '../types/team.types';
import { Spinner } from '../../../shared/components/feedback/Spinner';
import { Button } from '../../../shared/components/ui/button';
import { Badge } from '../../../shared/components/ui/badge';
import { Avatar } from '../../../shared/components/ui/avatar';
import { Card, CardContent, CardTitle, CardDescription } from '../../../shared/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../../shared/components/ui/table';

export const TeamPage: React.FC = () => {
  const { empresaActual, numerosDisponibles } = useTenant();
  const [equipo, setEquipo] = useState<MiembroEquipoMock[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarEquipo = useCallback(async () => {
    if (!empresaActual) return;
    try {
      setLoading(true);
      const res = await teamApi.getEquipo(empresaActual.id);
      setEquipo(res);
    } finally {
      setLoading(false);
    }
  }, [empresaActual?.id]);

  useEffect(() => {
    cargarEquipo();
  }, [cargarEquipo]);

  const getNombreNumero = (id: string) => {
    if (id === 'all') return 'Todas las líneas autorizadas';
    const n = numerosDisponibles.find((num) => num.id === id);
    return n ? n.alias : id;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <Card>
        <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold text-white">Equipo y Permisos por Línea</CardTitle>
            <CardDescription className="text-xs">
              Control de acceso a números WhatsApp de <strong className="text-emerald-400">{empresaActual?.nombre}</strong>
            </CardDescription>
          </div>

          <Button className="gap-2 font-bold shadow-lg shadow-emerald-500/20">
            <UserPlus className="w-4 h-4" />
            <span>Invitar Usuario</span>
          </Button>
        </CardContent>
      </Card>

      {/* Team Table */}
      {loading ? (
        <Spinner text="Cargando miembros del equipo..." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Rol Corporativo</TableHead>
              <TableHead>Líneas Asignadas</TableHead>
              <TableHead>Atendidos Hoy</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {equipo.map((m) => (
              <TableRow key={m.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar
                      fallback={m.nombre.substring(0, 2).toUpperCase()}
                      size="md"
                      className="bg-emerald-600/30 text-emerald-400 border-emerald-500/40 font-bold"
                    />
                    <div>
                      <div className="font-bold text-white text-xs">{m.nombre}</div>
                      <div className="text-[11px] text-slate-400">{m.email}</div>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge variant="outline" className="border-purple-500/30 text-purple-300 bg-purple-500/10 uppercase text-[10px]">
                    {m.rol}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {m.numerosPermitidos.map((numId, idx) => (
                      <Badge key={idx} variant="success" className="gap-1 text-[10px]">
                        <Smartphone className="w-3 h-3 text-emerald-400" />
                        {getNombreNumero(numId)}
                      </Badge>
                    ))}
                  </div>
                </TableCell>

                <TableCell className="font-bold text-white text-xs">
                  {m.conversacionesAtendidasHoy} chats
                </TableCell>

                <TableCell>
                  <Badge variant="success" className="gap-1 text-[10px]">
                    <CheckCircle2 className="w-3 h-3" /> Activo
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default TeamPage;
