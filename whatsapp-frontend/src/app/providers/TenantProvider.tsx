import React, { createContext, useState, useEffect, useCallback } from 'react';
import { EmpresaMock } from '../../mocks/data/empresas.mock';
import { NumeroMock } from '../../mocks/data/numeros.mock';
import { mockApi } from '../../mocks/mock-api';
import { mockRealtimeService } from '../../mocks/mock-realtime';
import { storage } from '../../infrastructure/storage/local-storage';
import { TenantContextType } from '../../shared/types/common.types';

export const TenantContext = createContext<TenantContextType | null>(null);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [empresaActual, setEmpresaActual] = useState<EmpresaMock | null>(null);
  const [numeroActual, setNumeroActual] = useState<NumeroMock | null>(null);
  const [empresasDisponibles, setEmpresasDisponibles] = useState<EmpresaMock[]>([]);
  const [numerosDisponibles, setNumerosDisponibles] = useState<NumeroMock[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [simulacionEnVivo, setSimulacionEnVivo] = useState<boolean>(() => storage.getRealtimeActive());

  // Carga inicial de empresas y números
  const inicializar = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);

      const emps = await mockApi.getEmpresas();
      setEmpresasDisponibles(emps);

      if (!emps.length) {
        setCargando(false);
        return;
      }

      // Determinar empresa inicial
      const savedEmpId = storage.getEmpresaId();
      const empSeleccionada = emps.find((e) => e.id === savedEmpId) || emps[0];
      setEmpresaActual(empSeleccionada);
      storage.setEmpresaId(empSeleccionada.id);

      // Cargar números de la empresa seleccionada
      const nums = await mockApi.getNumeros(empSeleccionada.id);
      setNumerosDisponibles(nums);

      // Determinar número inicial
      const savedNumId = storage.getNumeroId();
      const numSeleccionado = nums.find((n) => n.id === savedNumId) || nums[0] || null;
      setNumeroActual(numSeleccionado);
      if (numSeleccionado) {
        storage.setNumeroId(numSeleccionado.id);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar contexto multi-tenant');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    inicializar();
  }, [inicializar]);

  // Manejar el servicio de simulación en vivo
  useEffect(() => {
    if (simulacionEnVivo && empresaActual && numeroActual) {
      mockRealtimeService.start(empresaActual.id, numeroActual.id);
    } else {
      mockRealtimeService.stop();
    }

    return () => {
      mockRealtimeService.stop();
    };
  }, [simulacionEnVivo, empresaActual?.id, numeroActual?.id]);

  const cambiarEmpresa = async (empresaId: string) => {
    try {
      setCargando(true);
      const nuevaEmp = empresasDisponibles.find((e) => e.id === empresaId);
      if (!nuevaEmp) return;

      setEmpresaActual(nuevaEmp);
      storage.setEmpresaId(nuevaEmp.id);

      const nums = await mockApi.getNumeros(nuevaEmp.id);
      setNumerosDisponibles(nums);

      const primerNum = nums.find((n) => n.esPrincipal) || nums[0] || null;
      setNumeroActual(primerNum);
      if (primerNum) {
        storage.setNumeroId(primerNum.id);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cambiar de empresa');
    } finally {
      setCargando(false);
    }
  };

  const cambiarNumero = (numeroId: string) => {
    const num = numerosDisponibles.find((n) => n.id === numeroId);
    if (num) {
      setNumeroActual(num);
      storage.setNumeroId(num.id);
    }
  };

  const actualizarEstadoNumeroLocal = async (
    numeroId: string,
    estado: 'conectado' | 'desconectado' | 'pendiente_verificacion'
  ) => {
    const updated = await mockApi.actualizarEstadoNumero(numeroId, estado);
    setNumerosDisponibles((prev) =>
      prev.map((n) => (n.id === numeroId ? updated : n))
    );
    if (numeroActual?.id === numeroId) {
      setNumeroActual(updated);
    }
  };

  const toggleSimulacionEnVivo = () => {
    setSimulacionEnVivo((prev) => {
      const next = !prev;
      storage.setRealtimeActive(next);
      return next;
    });
  };

  return (
    <TenantContext.Provider
      value={{
        empresaActual,
        numeroActual,
        empresasDisponibles,
        numerosDisponibles,
        cargando,
        error,
        cambiarEmpresa,
        cambiarNumero,
        actualizarEstadoNumeroLocal,
        simulacionEnVivo,
        toggleSimulacionEnVivo,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

