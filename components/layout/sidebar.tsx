"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  Calendar,
  DollarSign,
  FileText,
  Settings,
  BookOpen,
  Lock,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui.store";
import { useAuthStore } from "@/stores/auth.store";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "rrhh", "manager", "empleado"],
  },
  {
    href: "/empleados",
    label: "Empleados",
    icon: Users,
    roles: ["admin", "rrhh", "manager"],
  },
  {
    href: "/departamentos",
    label: "Departamentos",
    icon: Building2,
    roles: ["admin", "rrhh", "manager"],
  },
  {
    href: "/nomina",
    label: "Nómina",
    icon: DollarSign,
    roles: ["admin", "rrhh"],
    disabled: true,
  },
  {
    href: "/ausencias",
    label: "Ausencias",
    icon: Calendar,
    roles: ["admin", "rrhh", "manager", "empleado"],
    disabled: true,
  },
  {
    href: "/contabilidad",
    label: "Contabilidad",
    icon: BookOpen,
    roles: ["admin"],
  },
  {
    href: "/contabilidad/cierre",
    label: "Cierre de Ejercicio",
    icon: Lock,
    roles: ["admin"],
  },
  {
    href: "/reportes",
    label: "Reportes",
    icon: FileText,
    roles: ["admin", "rrhh"],
    disabled: true,
  },
  {
    href: "/admin",
    label: "Configuración",
    icon: Settings,
    roles: ["admin"],
    disabled: true,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const usuario = useAuthStore((s) => s.usuario);

  if (!sidebarOpen) return null;

  const rolUsuario = usuario?.perfil?.rol || "empleado";

  const visibleItems = navItems.filter((item) =>
    item.roles.includes(rolUsuario),
  );

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="h-16 flex items-center gap-2 border-b border-slate-200 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
          R
        </div>
        <div>
          <div className="text-sm font-bold text-slate-900">RRHH System</div>
          <div className="text-[10px] text-slate-500 -mt-0.5">
            v1.0
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            if (item.disabled) {
              return (
                <div
                  key={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 cursor-not-allowed"
                  title="Módulo en construcción"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  <span className="ml-auto text-[9px] uppercase bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                    Pronto
                  </span>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer usuario */}
      <div className="border-t border-slate-200 p-3">
        <div className="rounded-lg bg-slate-50 p-3">
          <div className="text-xs text-slate-500 mb-1">Sesión activa</div>
          <div className="text-sm font-medium text-slate-900 truncate">
            {usuario?.nombre_completo}
          </div>
          <div className="text-[11px] text-slate-500 capitalize">
            {usuario?.perfil?.rol_display || usuario?.perfil?.rol}
          </div>
        </div>
      </div>
    </aside>
  );
}