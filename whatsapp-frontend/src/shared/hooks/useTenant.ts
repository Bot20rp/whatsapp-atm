import { useContext } from 'react';
import { TenantContext } from '../../app/providers/TenantProvider';
import { TenantContextType } from '../types/common.types';

export function useTenant(): TenantContextType {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant debe ser usado dentro de un TenantProvider');
  }
  return context;
}

