import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-md p-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-lg bg-[#008069] flex items-center justify-center text-white font-black text-lg shadow-sm">
            CRM
          </div>
          <div>
            <h1 className="text-base font-black text-slate-900">WhatsApp CRM</h1>
            <p className="text-xs text-emerald-800 font-semibold">Acceso Multi-Tenant Corporativo</p>
          </div>
        </div>
        <Outlet />
      </div>
      <div className="mt-6 text-center text-xs text-slate-500 font-medium">
        Sistema de Gestión WhatsApp Business API &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default AuthLayout;
