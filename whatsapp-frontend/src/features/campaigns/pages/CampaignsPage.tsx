import React, { useState, useEffect, useCallback } from 'react';
import { Send, Plus } from 'lucide-react';
import { useTenant } from '../../../shared/hooks/useTenant';
import { campaignsApi } from '../api/campaigns.api';
import { CampañaMock } from '../types/campaigns.types';
import { Spinner } from '../../../shared/components/feedback/Spinner';
import { EmptyState } from '../../../shared/components/feedback/EmptyState';
import { formatDate } from '../../../shared/utils/formatters';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { Select } from '../../../shared/components/ui/select';
import { Badge } from '../../../shared/components/ui/badge';
import { Dialog } from '../../../shared/components/ui/dialog';
import { Card, CardContent } from '../../../shared/components/ui/card';

export const CampaignsPage: React.FC = () => {
  const { empresaActual, numeroActual } = useTenant();
  const [campañas, setCampañas] = useState<CampañaMock[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [nombre, setNombre] = useState('');
  const [plantillaMeta, setPlantillaMeta] = useState('promocion_general_v1');
  const [audiencia, setAudiencia] = useState(500);

  const cargarCampañas = useCallback(async () => {
    if (!empresaActual || !numeroActual) return;
    try {
      setLoading(true);
      const res = await campaignsApi.getCampañas(empresaActual.id, numeroActual.id);
      setCampañas(res);
    } finally {
      setLoading(false);
    }
  }, [empresaActual?.id, numeroActual?.id]);

  useEffect(() => {
    cargarCampañas();
  }, [cargarCampañas]);

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empresaActual || !numeroActual || !nombre) return;

    await campaignsApi.crearCampaña(empresaActual.id, numeroActual.id, {
      nombre,
      plantillaMeta,
      audienciaTotal: Number(audiencia),
    });

    setModalOpen(false);
    setNombre('');
    cargarCampañas();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Campañas Masivas WhatsApp</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Plantillas aprobadas por Meta para la línea: <strong className="text-emerald-400">{numeroActual?.alias}</strong>
          </p>
        </div>

        <Button
          onClick={() => setModalOpen(true)}
          className="gap-2 font-bold shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Campaña</span>
        </Button>
      </div>

      {/* Campaigns List */}
      {loading ? (
        <Spinner text="Cargando campañas..." />
      ) : campañas.length === 0 ? (
        <EmptyState
          icon={Send}
          title="Sin campañas registradas"
          description={`No existen campañas emitidas desde el número "${numeroActual?.alias}".`}
          action={{
            label: 'Crear Primera Campaña',
            onClick: () => setModalOpen(true),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {campañas.map((c) => {
            const pctEntrega = Math.round((c.entregados / (c.enviados || 1)) * 100);
            const pctLectura = Math.round((c.leidos / (c.entregados || 1)) * 100);

            return (
              <Card key={c.id}>
                <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-bold text-white">{c.nombre}</h3>
                      {c.estado === 'completada' && (
                        <Badge variant="success" className="uppercase text-[10px]">
                          Completada
                        </Badge>
                      )}
                      {c.estado === 'en_progreso' && (
                        <Badge variant="default" className="bg-blue-600/20 text-blue-400 border-blue-500/30 uppercase text-[10px]">
                          En Progreso
                        </Badge>
                      )}
                      {c.estado === 'programada' && (
                        <Badge variant="secondary" className="uppercase text-[10px]">
                          Programada
                        </Badge>
                      )}
                    </div>

                    <div className="text-xs text-slate-400 font-mono">
                      Plantilla Meta: <span className="text-emerald-400 font-bold">{c.plantillaMeta}</span> • Fecha: {formatDate(c.fechaInicio)}
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center gap-6 text-xs shrink-0 bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Audiencia</span>
                      <span className="font-extrabold text-white text-base">{c.audienciaTotal.toLocaleString()}</span>
                    </div>

                    <div className="text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Enviados</span>
                      <span className="font-extrabold text-white text-base">{c.enviados.toLocaleString()}</span>
                    </div>

                    <div className="text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Entrega</span>
                      <span className="font-extrabold text-emerald-400 text-base">{pctEntrega}%</span>
                    </div>

                    <div className="text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Lectura</span>
                      <span className="font-extrabold text-blue-400 text-base">{pctLectura}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Dialog Modal Crear Campaña */}
      <Dialog
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Crear Campaña Masiva"
        description="Selecciona una plantilla Meta homologada e ingresa la cantidad de destinatarios"
      >
        <form onSubmit={handleCrear} className="space-y-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Nombre de la Campaña *</label>
            <Input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Anuncio Actualización de Tarifas Q3"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Plantilla Meta Aprobada</label>
            <Select
              value={plantillaMeta}
              onChange={(e) => setPlantillaMeta(e.target.value)}
            >
              <option value="promocion_general_v1">promocion_general_v1 (MARKETING)</option>
              <option value="aviso_operativo_cliente">aviso_operativo_cliente (UTILITY)</option>
              <option value="recordatorio_cita_servicio">recordatorio_cita_servicio (UTILITY)</option>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Cantidad de Destinatarios (Audiencia)</label>
            <Input
              type="number"
              required
              min={1}
              max={numeroActual?.limiteDiario || 10000}
              value={audiencia}
              onChange={(e) => setAudiencia(Number(e.target.value))}
            />
            <span className="text-[10px] text-slate-400 block pt-0.5">
              Límite diario de la línea: {numeroActual?.limiteDiario.toLocaleString()} mensajes.
            </span>
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
              Programar Envío
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default CampaignsPage;
