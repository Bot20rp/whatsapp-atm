import React, { useState, useEffect, useCallback } from 'react';
import { Send, Plus } from 'lucide-react';
import { useTenant } from '../../../shared/hooks/useTenant';
import { campaignsApi } from '../api/campaigns.api';
import { CampañaMock } from '../types/campaigns.types';
import { Spinner } from '../../../shared/components/feedback/Spinner';
import { EmptyState } from '../../../shared/components/feedback/EmptyState';
import { formatDate } from '../../../shared/utils/formatters';

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
          <h2 className="text-xl font-black text-slate-900">Campañas Masivas WhatsApp</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Plantillas aprobadas por Meta para la línea: <strong className="text-[#008069]">{numeroActual?.alias}</strong>
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="btn btn-sm bg-[#008069] hover:bg-[#006654] text-white text-xs border-none font-bold px-4 flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nueva Campaña</span>
        </button>
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
              <div
                key={c.id}
                className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-sm font-black text-slate-900">{c.nombre}</h3>
                    {c.estado === 'completada' && (
                      <span className="text-[10px] bg-emerald-600 text-white px-2.5 py-0.5 rounded font-black uppercase shadow-xs">
                        Completada
                      </span>
                    )}
                    {c.estado === 'en_progreso' && (
                      <span className="text-[10px] bg-blue-600 text-white px-2.5 py-0.5 rounded font-black uppercase shadow-xs">
                        En Progreso
                      </span>
                    )}
                    {c.estado === 'programada' && (
                      <span className="text-[10px] bg-slate-700 text-white px-2.5 py-0.5 rounded font-black uppercase shadow-xs">
                        Programada
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-600 font-mono">
                    Plantilla Meta: <span className="text-[#008069] font-bold">{c.plantillaMeta}</span> • Fecha: {formatDate(c.fechaInicio)}
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-6 text-xs shrink-0 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Audiencia</span>
                    <span className="font-black text-slate-900 text-sm">{c.audienciaTotal.toLocaleString()}</span>
                  </div>

                  <div className="text-center">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Enviados</span>
                    <span className="font-black text-slate-900 text-sm">{c.enviados.toLocaleString()}</span>
                  </div>

                  <div className="text-center">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Entrega</span>
                    <span className="font-black text-emerald-700 text-sm">{pctEntrega}%</span>
                  </div>

                  <div className="text-center">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Lectura</span>
                    <span className="font-black text-blue-700 text-sm">{pctLectura}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Crear Campaña */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-black text-slate-900 mb-4 pb-2 border-b border-slate-200">
              Crear Campaña Masiva
            </h3>

            <form onSubmit={handleCrear} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Nombre de la Campaña *</label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-md focus:outline-none focus:border-[#008069] focus:ring-1 focus:ring-[#008069]"
                  placeholder="Ej. Anuncio Actualización de Tarifas Q3"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Plantilla Meta Aprobada</label>
                <select
                  value={plantillaMeta}
                  onChange={(e) => setPlantillaMeta(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-md focus:outline-none focus:border-[#008069] font-medium"
                >
                  <option value="promocion_general_v1">promocion_general_v1 (MARKETING)</option>
                  <option value="aviso_operativo_cliente">aviso_operativo_cliente (UTILITY)</option>
                  <option value="recordatorio_cita_servicio">recordatorio_cita_servicio (UTILITY)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Cantidad de Destinatarios (Audiencia)</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={numeroActual?.limiteDiario || 10000}
                  value={audiencia}
                  onChange={(e) => setAudiencia(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-md focus:outline-none focus:border-[#008069] font-bold"
                />
                <span className="text-[10px] text-slate-500 block mt-1 font-medium">
                  Límite diario de la línea: {numeroActual?.limiteDiario.toLocaleString()} mensajes.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3.5 border-t border-slate-200">
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
                  Programar Envío
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignsPage;
