import { create } from "zustand";
import { Usuario } from "@/types/api";
import { tokenStorage } from "@/lib/api";

interface AuthState {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUsuario: (usuario: Usuario) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  hasPermiso: (rol: string) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  usuario: null,
  isAuthenticated: false,
  isLoading: true,

  setUsuario: (usuario) =>
    set({
      usuario,
      isAuthenticated: true,
      isLoading: false,
    }),

  setLoading: (loading) => set({ isLoading: loading }),

  logout: () => {
    tokenStorage.clear();
    set({ usuario: null, isAuthenticated: false, isLoading: false });
  },

  hasPermiso: (rol: string) => {
    const u = get().usuario;
    if (!u) return false;
    const roleHierarchy: Record<string, number> = {
      admin: 4,
      rrhh: 3,
      manager: 2,
      empleado: 1,
    };
    return (roleHierarchy[u.perfil.rol] || 0) >= (roleHierarchy[rol] || 0);
  },
}));