import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Smartphone,
  Bot,
  Send,
  BarChart3,
  ShieldCheck,
  CreditCard,
  Building2,
  PhoneCall,
  Radio,
  LogOut,
  ChevronDown,
  Check,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useTenant } from '../../shared/hooks/useTenant';

export const DashboardLayout: React.FC = () => {
  const {
    empresaActual,
    numeroActual,
    empresasDisponibles,
    numerosDisponibles,
    cambiarEmpresa,
    cambiarNumero,
    simulacionEnVivo,
    toggleSimulacionEnVivo,
  } = useTenant();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [tenantMenuOpen, setTenantMenuOpen] = useState(false);
  const [numeroMenuOpen, setNumeroMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/inbox', label: 'Bandeja de Entrada', icon: MessageSquare },
    { to: '/contacts', label: 'Contactos', icon: Users },
    { to: '/whatsapp', label: 'Líneas WhatsApp', icon: Smartphone },
    { to: '/automations', label: 'Automatizaciones', icon: Bot },
    { to: '/campaigns', label: 'Campañas', icon: Send },
    { to: '/analytics', label: 'Analítica', icon: BarChart3 },
    { to: '/team', label: 'Equipo', icon: ShieldCheck },
    { to: '/billing', label: 'Facturación & Plan', icon: CreditCard },
  ];

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('crm_auth_user');
    navigate('/auth/login');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC]">
      {/* Collapsible Sidebar */}
      <aside
        className={`bg-white border-r border-[#E2E8F0] flex flex-col shrink-0 transition-all duration-300 ease-in-out z-30 ${
          sidebarCollapsed ? 'w-18' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div
          className={`h-16 flex items-center border-b border-[#E2E8F0] transition-all px-4 ${
            sidebarCollapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-[#008069] flex items-center justify-center text-white font-black text-sm tracking-wider shadow-sm shrink-0">
              CRM
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-bold text-sm text-slate-900 tracking-tight truncate">WhatsApp CRM</span>
                <span className="text-[11px] text-emerald-700 font-semibold truncate">Enterprise Hub</span>
              </div>
            )}
          </div>

          {/* Toggle button inside sidebar header (desktop/expanded) */}
          {!sidebarCollapsed && (
            <button
              type="button"
              onClick={() => setSidebarCollapsed(true)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
              title="Colapsar barra lateral"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* If collapsed, show a quick expand button under the logo */}
        {sidebarCollapsed && (
          <div className="p-2 flex justify-center border-b border-slate-100 bg-slate-50/50">
            <button
              type="button"
              onClick={() => setSidebarCollapsed(false)}
              className="p-1.5 text-slate-500 hover:text-[#008069] hover:bg-emerald-50 rounded-md transition-colors"
              title="Expandir barra lateral"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {!sidebarCollapsed ? (
            <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Gestión Operativa
            </div>
          ) : (
            <div className="w-full h-px bg-slate-200 my-2" />
          )}

          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                title={sidebarCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center rounded-md transition-all ${
                    sidebarCollapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2 text-xs'
                  } font-semibold ${
                    isActive
                      ? 'bg-[#008069] text-white shadow-sm'
                      : 'text-slate-700 hover:bg-emerald-50 hover:text-[#008069]'
                  }`
                }
              >
                <Icon className={`${sidebarCollapsed ? 'w-5 h-5' : 'w-4 h-4'} shrink-0`} />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}

          {!sidebarCollapsed ? (
            <div className="pt-4 px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Marketing & Reglas
            </div>
          ) : (
            <div className="w-full h-px bg-slate-200 my-2" />
          )}

          {navItems.slice(4, 7).map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                title={sidebarCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center rounded-md transition-all ${
                    sidebarCollapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2 text-xs'
                  } font-semibold ${
                    isActive
                      ? 'bg-[#008069] text-white shadow-sm'
                      : 'text-slate-700 hover:bg-emerald-50 hover:text-[#008069]'
                  }`
                }
              >
                <Icon className={`${sidebarCollapsed ? 'w-5 h-5' : 'w-4 h-4'} shrink-0`} />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}

          {!sidebarCollapsed ? (
            <div className="pt-4 px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Administración
            </div>
          ) : (
            <div className="w-full h-px bg-slate-200 my-2" />
          )}

          {navItems.slice(7).map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                title={sidebarCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center rounded-md transition-all ${
                    sidebarCollapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2 text-xs'
                  } font-semibold ${
                    isActive
                      ? 'bg-[#008069] text-white shadow-sm'
                      : 'text-slate-700 hover:bg-emerald-50 hover:text-[#008069]'
                  }`
                }
              >
                <Icon className={`${sidebarCollapsed ? 'w-5 h-5' : 'w-4 h-4'} shrink-0`} />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer User info */}
        <div className="p-3 border-t border-[#E2E8F0] bg-slate-50">
          <div
            className={`flex items-center ${
              sidebarCollapsed ? 'flex-col gap-2 justify-center' : 'justify-between'
            }`}
          >
            <div
              className={`flex items-center gap-2.5 overflow-hidden ${
                sidebarCollapsed ? 'justify-center' : ''
              }`}
            >
              <div
                className="w-8 h-8 rounded-full bg-[#008069] flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-xs"
                title="Carlos Morales (Agente)"
              >
                AG
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col truncate">
                  <span className="text-xs font-bold text-slate-800 truncate">Agente de Soporte</span>
                  <span className="text-[10px] text-slate-500 font-mono">admin@waba.io</span>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header with Multi-Tenant Selectors */}
        <header className="h-16 bg-white border-b border-[#E2E8F0] px-4 sm:px-6 flex items-center justify-between shrink-0 z-20 shadow-xs">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Sidebar Toggle in Header */}
            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-md hover:bg-slate-100 text-slate-600 hover:text-[#008069] transition-colors"
              title={sidebarCollapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="w-5 h-5" />
              ) : (
                <PanelLeftClose className="w-5 h-5" />
              )}
            </button>

            {/* 1. Selector de Empresa (Tenant) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setTenantMenuOpen(!tenantMenuOpen);
                  setNumeroMenuOpen(false);
                }}
                className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 hover:bg-emerald-50/70 border border-[#CBD5E1] hover:border-[#008069] rounded-md text-xs font-medium text-slate-800 transition-colors shadow-xs"
              >
                <Building2 className="w-4 h-4 text-[#008069]" />
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-emerald-800 uppercase font-bold leading-none">
                    Empresa
                  </span>
                  <span className="font-bold text-slate-900 truncate max-w-[130px] sm:max-w-[200px]">
                    {empresaActual?.nombre || 'Seleccione empresa'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </button>

              {tenantMenuOpen && (
                <div className="absolute left-0 mt-1 w-68 bg-white border border-[#CBD5E1] rounded-lg shadow-lg py-1 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-100">
                    Cambiar de Empresa (Tenant)
                  </div>
                  {empresasDisponibles.map((emp) => (
                    <button
                      key={emp.id}
                      type="button"
                      onClick={() => {
                        cambiarEmpresa(emp.id);
                        setTenantMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-emerald-50 text-slate-800 transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{emp.nombre}</span>
                        <span className="text-[10px] text-slate-500 font-medium uppercase">
                          Plan: {emp.plan} | {emp.identificadorFiscal}
                        </span>
                      </div>
                      {empresaActual?.id === emp.id && (
                        <Check className="w-4 h-4 text-[#008069] shrink-0 font-bold" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-slate-300 font-light">/</span>

            {/* 2. Selector de Número WhatsApp */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNumeroMenuOpen(!numeroMenuOpen);
                  setTenantMenuOpen(false);
                }}
                className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 hover:bg-emerald-50/70 border border-[#CBD5E1] hover:border-[#008069] rounded-md text-xs font-medium text-slate-800 transition-colors shadow-xs"
              >
                <PhoneCall className="w-4 h-4 text-[#008069]" />
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-emerald-800 uppercase font-bold leading-none">
                    Línea WhatsApp
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        numeroActual?.estado === 'conectado'
                          ? 'bg-emerald-500'
                          : numeroActual?.estado === 'pendiente_verificacion'
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                    />
                    <span className="font-bold text-slate-900 truncate max-w-[130px] sm:max-w-[200px]">
                      {numeroActual?.alias || 'Seleccione línea'}
                    </span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </button>

              {numeroMenuOpen && (
                <div className="absolute left-0 mt-1 w-76 bg-white border border-[#CBD5E1] rounded-lg shadow-lg py-1 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-100">
                    Líneas WhatsApp de la Empresa
                  </div>
                  {numerosDisponibles.map((num) => (
                    <button
                      key={num.id}
                      type="button"
                      onClick={() => {
                        cambiarNumero(num.id);
                        setNumeroMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-emerald-50 text-slate-800 transition-colors"
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                          <span
                            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                              num.estado === 'conectado'
                                ? 'bg-emerald-500'
                                : num.estado === 'pendiente_verificacion'
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                          />
                          <span>{num.alias}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono pl-4">
                          {num.numero} ({num.estado})
                        </span>
                      </div>
                      {numeroActual?.id === num.id && (
                        <Check className="w-4 h-4 text-[#008069] shrink-0 font-bold" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Header: Realtime status toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleSimulacionEnVivo}
              title="Activar/Desactivar simulación de mensajes entrantes"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold border transition-all ${
                simulacionEnVivo
                  ? 'bg-emerald-600 border-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 border-slate-300 text-slate-600'
              }`}
            >
              <Radio
                className={`w-3.5 h-3.5 ${simulacionEnVivo ? 'text-white animate-pulse' : 'text-slate-400'}`}
              />
              <span className="hidden sm:inline">
                Simulador en Vivo: <strong>{simulacionEnVivo ? 'ON' : 'OFF'}</strong>
              </span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F8FAFC]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;