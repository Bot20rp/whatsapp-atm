import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
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
  ChevronUp,
  Check,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Menu,
  User,
  Settings,
} from 'lucide-react';
import { useTenant } from '../../shared/hooks/useTenant';
import { Button } from '../../shared/components/ui/button';
import { Avatar } from '../../shared/components/ui/avatar';
import { Badge } from '../../shared/components/ui/badge';
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from '../../shared/components/ui/dropdown-menu';

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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Accordion open states
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    canales: true,
    automations: true,
    admin: true,
  });

  const navigate = useNavigate();
  const location = useLocation();

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('crm_auth_user');
    navigate('/auth/login');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 transition-all duration-300 ease-in-out lg:static ${
          mobileSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        <div className="relative flex flex-col h-full max-h-full">
          {/* Header */}
          <header className="p-4 border-b border-slate-800 flex justify-between items-center gap-x-2 shrink-0 h-16">
            <NavLink to="/" className="flex items-center gap-3 overflow-hidden group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-black text-xs tracking-wider shadow-lg shadow-emerald-500/20 shrink-0 group-hover:scale-105 transition-transform">
                CRM
              </div>
              {(!sidebarCollapsed || mobileSidebarOpen) && (
                <div className="flex flex-col truncate">
                  <span className="font-bold text-sm text-white tracking-tight truncate">WhatsApp CRM</span>
                  <span className="text-[10px] text-emerald-400 font-semibold truncate uppercase tracking-widest">Enterprise</span>
                </div>
              )}
            </NavLink>

            {/* Mobile Close Button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileSidebarOpen(false)}
                className="h-8 w-8 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>

            {/* Desktop Minify Toggle Button */}
            <div className="hidden lg:block">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="h-8 w-8 text-slate-400 hover:text-white"
                title={sidebarCollapsed ? 'Expandir navegación' : 'Minimizar navegación'}
              >
                {sidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
                <span className="sr-only">Navigation Toggle</span>
              </Button>
            </div>
          </header>

          {/* Account Dropdown Section */}
          <div className="p-2 border-b border-slate-800 bg-slate-950/60 shrink-0">
            <DropdownMenu
              align="left"
              className="w-56"
              trigger={
                <button
                  type="button"
                  className="w-full inline-flex shrink-0 items-center gap-x-2.5 p-2 text-start text-xs rounded-xl hover:bg-slate-800 transition-colors text-slate-200"
                >
                  <Avatar
                    fallback="MH"
                    size="sm"
                    className="bg-emerald-600/30 text-emerald-400 border-emerald-500/40"
                  />
                  {(!sidebarCollapsed || mobileSidebarOpen) && (
                    <div className="flex flex-col truncate flex-1">
                      <span className="font-bold text-white text-xs truncate">Carlos Morales</span>
                      <span className="text-[10px] text-slate-400 font-mono truncate">admin@waba.io</span>
                    </div>
                  )}
                  {(!sidebarCollapsed || mobileSidebarOpen) && (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 ms-auto shrink-0" />
                  )}
                </button>
              }
            >
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-800">
                Mi Cuenta & Sesión
              </div>
              <DropdownMenuItem onClick={() => navigate('/team')}>
                <User className="w-4 h-4 me-2 text-emerald-400" /> Mi Cuenta
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/whatsapp')}>
                <Settings className="w-4 h-4 me-2 text-emerald-400" /> Configuración WABA
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/billing')}>
                <CreditCard className="w-4 h-4 me-2 text-emerald-400" /> Facturación & Plan
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-rose-400 hover:text-rose-300">
                <LogOut className="w-4 h-4 me-2" /> Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenu>
          </div>

          {/* Body Navigation */}
          <nav className="flex-1 overflow-y-auto p-2 space-y-1">
            <ul className="space-y-1">
              {/* Direct Link: Dashboard */}
              <li>
                <NavLink
                  to="/dashboard"
                  onClick={() => setMobileSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-x-3.5 py-2 px-3 text-xs font-semibold rounded-xl transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 border border-emerald-500/30'
                        : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                    } ${sidebarCollapsed && !mobileSidebarOpen ? 'justify-center px-2' : ''}`
                  }
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  {(!sidebarCollapsed || mobileSidebarOpen) && <span>Dashboard</span>}
                </NavLink>
              </li>

              {/* Direct Link: Inbox */}
              <li>
                <NavLink
                  to="/inbox"
                  onClick={() => setMobileSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-x-3.5 py-2 px-3 text-xs font-semibold rounded-xl transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 border border-emerald-500/30'
                        : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                    } ${sidebarCollapsed && !mobileSidebarOpen ? 'justify-center px-2' : ''}`
                  }
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  {(!sidebarCollapsed || mobileSidebarOpen) && (
                    <div className="flex items-center justify-between flex-1">
                      <span>Bandeja de Entrada</span>
                      <Badge variant="success" className="text-[9px] px-1.5 py-0">En vivo</Badge>
                    </div>
                  )}
                </NavLink>
              </li>

              {/* Accordion 1: Canales y Contactos */}
              <li className="pt-2">
                {(!sidebarCollapsed || mobileSidebarOpen) ? (
                  <button
                    type="button"
                    onClick={() => toggleSection('canales')}
                    className="w-full text-start flex items-center gap-x-3.5 py-2 px-3 text-xs font-bold text-slate-400 rounded-xl hover:bg-slate-800/60 transition-colors"
                  >
                    <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Gestión & Canales</span>
                    {openSections.canales ? (
                      <ChevronUp className="w-4 h-4 ms-auto text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ms-auto text-slate-400" />
                    )}
                  </button>
                ) : (
                  <div className="w-full h-px bg-slate-800 my-2" />
                )}

                {(openSections.canales || sidebarCollapsed) && (
                  <ul className={`pt-1 space-y-1 ${!sidebarCollapsed || mobileSidebarOpen ? 'ps-6' : ''}`}>
                    <li>
                      <NavLink
                        to="/contacts"
                        onClick={() => setMobileSidebarOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-x-3 py-2 px-3 text-xs font-medium rounded-xl transition-all ${
                            isActive
                              ? 'bg-emerald-600/20 text-emerald-400 font-semibold'
                              : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                          } ${sidebarCollapsed && !mobileSidebarOpen ? 'justify-center px-2' : ''}`
                        }
                      >
                        <Users className="w-4 h-4 shrink-0" />
                        {(!sidebarCollapsed || mobileSidebarOpen) && <span>Contactos</span>}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/whatsapp"
                        onClick={() => setMobileSidebarOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-x-3 py-2 px-3 text-xs font-medium rounded-xl transition-all ${
                            isActive
                              ? 'bg-emerald-600/20 text-emerald-400 font-semibold'
                              : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                          } ${sidebarCollapsed && !mobileSidebarOpen ? 'justify-center px-2' : ''}`
                        }
                      >
                        <Smartphone className="w-4 h-4 shrink-0" />
                        {(!sidebarCollapsed || mobileSidebarOpen) && <span>Líneas WABA</span>}
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>

              {/* Accordion 2: Automatización & Marketing */}
              <li className="pt-2">
                {(!sidebarCollapsed || mobileSidebarOpen) ? (
                  <button
                    type="button"
                    onClick={() => toggleSection('automations')}
                    className="w-full text-start flex items-center gap-x-3.5 py-2 px-3 text-xs font-bold text-slate-400 rounded-xl hover:bg-slate-800/60 transition-colors"
                  >
                    <Bot className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Automatización & Envíos</span>
                    {openSections.automations ? (
                      <ChevronUp className="w-4 h-4 ms-auto text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ms-auto text-slate-400" />
                    )}
                  </button>
                ) : (
                  <div className="w-full h-px bg-slate-800 my-2" />
                )}

                {(openSections.automations || sidebarCollapsed) && (
                  <ul className={`pt-1 space-y-1 ${!sidebarCollapsed || mobileSidebarOpen ? 'ps-6' : ''}`}>
                    <li>
                      <NavLink
                        to="/automations"
                        onClick={() => setMobileSidebarOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-x-3 py-2 px-3 text-xs font-medium rounded-xl transition-all ${
                            isActive
                              ? 'bg-purple-600/20 text-purple-300 font-semibold'
                              : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                          } ${sidebarCollapsed && !mobileSidebarOpen ? 'justify-center px-2' : ''}`
                        }
                      >
                        <Bot className="w-4 h-4 shrink-0" />
                        {(!sidebarCollapsed || mobileSidebarOpen) && <span>Automatizaciones</span>}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/campaigns"
                        onClick={() => setMobileSidebarOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-x-3 py-2 px-3 text-xs font-medium rounded-xl transition-all ${
                            isActive
                              ? 'bg-emerald-600/20 text-emerald-400 font-semibold'
                              : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                          } ${sidebarCollapsed && !mobileSidebarOpen ? 'justify-center px-2' : ''}`
                        }
                      >
                        <Send className="w-4 h-4 shrink-0" />
                        {(!sidebarCollapsed || mobileSidebarOpen) && <span>Campañas Masivas</span>}
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>

              {/* Accordion 3: Reportes & Administración */}
              <li className="pt-2">
                {(!sidebarCollapsed || mobileSidebarOpen) ? (
                  <button
                    type="button"
                    onClick={() => toggleSection('admin')}
                    className="w-full text-start flex items-center gap-x-3.5 py-2 px-3 text-xs font-bold text-slate-400 rounded-xl hover:bg-slate-800/60 transition-colors"
                  >
                    <BarChart3 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Reportes & Administración</span>
                    {openSections.admin ? (
                      <ChevronUp className="w-4 h-4 ms-auto text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ms-auto text-slate-400" />
                    )}
                  </button>
                ) : (
                  <div className="w-full h-px bg-slate-800 my-2" />
                )}

                {(openSections.admin || sidebarCollapsed) && (
                  <ul className={`pt-1 space-y-1 ${!sidebarCollapsed || mobileSidebarOpen ? 'ps-6' : ''}`}>
                    <li>
                      <NavLink
                        to="/analytics"
                        onClick={() => setMobileSidebarOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-x-3 py-2 px-3 text-xs font-medium rounded-xl transition-all ${
                            isActive
                              ? 'bg-blue-600/20 text-blue-300 font-semibold'
                              : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                          } ${sidebarCollapsed && !mobileSidebarOpen ? 'justify-center px-2' : ''}`
                        }
                      >
                        <BarChart3 className="w-4 h-4 shrink-0" />
                        {(!sidebarCollapsed || mobileSidebarOpen) && <span>Analítica & SLAs</span>}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/team"
                        onClick={() => setMobileSidebarOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-x-3 py-2 px-3 text-xs font-medium rounded-xl transition-all ${
                            isActive
                              ? 'bg-emerald-600/20 text-emerald-400 font-semibold'
                              : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                          } ${sidebarCollapsed && !mobileSidebarOpen ? 'justify-center px-2' : ''}`
                        }
                      >
                        <ShieldCheck className="w-4 h-4 shrink-0" />
                        {(!sidebarCollapsed || mobileSidebarOpen) && <span>Equipo & Permisos</span>}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/billing"
                        onClick={() => setMobileSidebarOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-x-3 py-2 px-3 text-xs font-medium rounded-xl transition-all ${
                            isActive
                              ? 'bg-emerald-600/20 text-emerald-400 font-semibold'
                              : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                          } ${sidebarCollapsed && !mobileSidebarOpen ? 'justify-center px-2' : ''}`
                        }
                      >
                        <CreditCard className="w-4 h-4 shrink-0" />
                        {(!sidebarCollapsed || mobileSidebarOpen) && <span>Facturación & Plan</span>}
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header with Multi-Tenant Selectors */}
        <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile Sidebar Trigger Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Desktop Sidebar Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex text-slate-400 hover:text-white"
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="w-5 h-5" />
              ) : (
                <PanelLeftClose className="w-5 h-5" />
              )}
            </Button>

            {/* 1. Selector de Empresa (Tenant Dropdown Menu) */}
            <DropdownMenu
              align="left"
              trigger={
                <Button variant="outline" size="sm" className="gap-2 border-slate-700 bg-slate-950">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] text-emerald-400 uppercase font-bold leading-none">Empresa</span>
                    <span className="font-bold text-white text-xs truncate max-w-[110px] sm:max-w-[180px]">
                      {empresaActual?.nombre || 'Seleccione empresa'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
                </Button>
              }
            >
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-800">
                Cambiar Empresa (Tenant)
              </div>
              {empresasDisponibles.map((emp) => (
                <DropdownMenuItem
                  key={emp.id}
                  active={empresaActual?.id === emp.id}
                  onClick={() => cambiarEmpresa(emp.id)}
                  className="justify-between"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-white">{emp.nombre}</span>
                    <span className="text-[10px] text-slate-400 uppercase">Plan: {emp.plan}</span>
                  </div>
                  {empresaActual?.id === emp.id && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenu>

            <span className="text-slate-700 hidden sm:inline">/</span>

            {/* 2. Selector de Número WhatsApp (Dropdown Menu) */}
            <DropdownMenu
              align="left"
              trigger={
                <Button variant="outline" size="sm" className="gap-2 border-slate-700 bg-slate-950">
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] text-emerald-400 uppercase font-bold leading-none">Línea WABA</span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          numeroActual?.estado === 'conectado'
                            ? 'bg-emerald-400'
                            : numeroActual?.estado === 'pendiente_verificacion'
                            ? 'bg-amber-400'
                            : 'bg-rose-400'
                        }`}
                      />
                      <span className="font-bold text-white text-xs truncate max-w-[110px] sm:max-w-[180px]">
                        {numeroActual?.alias || 'Seleccione línea'}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
                </Button>
              }
            >
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-800">
                Líneas WhatsApp de la Empresa
              </div>
              {numerosDisponibles.map((num) => (
                <DropdownMenuItem
                  key={num.id}
                  active={numeroActual?.id === num.id}
                  onClick={() => cambiarNumero(num.id)}
                  className="justify-between"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-white">{num.alias}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{num.numero}</span>
                  </div>
                  {numeroActual?.id === num.id && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenu>
          </div>

          {/* Right Header: Realtime status toggle */}
          <div className="flex items-center gap-3">
            <Button
              variant={simulacionEnVivo ? 'default' : 'outline'}
              size="sm"
              onClick={toggleSimulacionEnVivo}
              className="gap-2 font-bold text-xs"
            >
              <Radio className={`w-3.5 h-3.5 ${simulacionEnVivo ? 'animate-pulse text-white' : 'text-slate-500'}`} />
              <span className="hidden sm:inline">
                Simulador: <strong>{simulacionEnVivo ? 'ON' : 'OFF'}</strong>
              </span>
            </Button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;