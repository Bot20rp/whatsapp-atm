import React from 'react';
import { ThemeProvider } from './ThemeProvider';
import { TenantProvider } from './TenantProvider';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <TenantProvider>{children}</TenantProvider>
    </ThemeProvider>
  );
};

