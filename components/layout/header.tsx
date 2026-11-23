"use client";

import { Menu, LogOut, User as UserIcon, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import { useUIStore } from "@/stores/ui.store";
import { useAuthStore } from "@/stores/auth.store";
import { useLogout } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function Header() {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const usuario = useAuthStore((s) => s.usuario);
  const logout = useLogout();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const iniciales = usuario?.nombre_completo
    ? usuario.nombre_completo
        .split(" ")
        .slice(0, 2)
        .map((p) => p[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <header className="h-16 sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden md:block">
          <div className="text-sm font-semibold text-slate-900">
            Panel de administración
          </div>
          <div className="text-xs text-slate-500">
            Gestión de recursos humanos
          </div>
        </div>
      </div>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-3 rounded-lg p-1.5 pr-3 transition hover:bg-slate-100"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
            {iniciales}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium text-slate-900 leading-tight">
              {usuario?.nombre_completo}
            </div>
            <div className="text-xs text-slate-500 leading-tight">
              {usuario?.perfil?.rol_display || usuario?.perfil?.rol}
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <div className="text-sm font-medium text-slate-900">
                {usuario?.nombre_completo}
              </div>
              <div className="text-xs text-slate-500 truncate">
                {usuario?.email}
              </div>
            </div>
            <button
              onClick={logout}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}