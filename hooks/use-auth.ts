"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { api, tokenStorage, getApiErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import { LoginResponse, Usuario } from "@/types/api";

// ═══════════════════════════════════════════════════════════
//  LOGIN
// ═══════════════════════════════════════════════════════════

export function useLogin() {
  const router = useRouter();
  const setUsuario = useAuthStore((s) => s.setUsuario);

  return useMutation({
    mutationFn: async (credentials: {
      username: string;
      password: string;
    }): Promise<LoginResponse> => {
      const { data } = await api.post<LoginResponse>(
        "/auth/login/",
        credentials,
      );
      return data;
    },
    onSuccess: (data) => {
      tokenStorage.set(data.access_token, data.refresh_token);
      setUsuario(data.usuario);
      toast.success(`Bienvenido, ${data.usuario.nombre_completo}`);
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

// ═══════════════════════════════════════════════════════════
//  LOGOUT
// ═══════════════════════════════════════════════════════════

export function useLogout() {
  const router = useRouter();
  const logoutStore = useAuthStore((s) => s.logout);

  return () => {
    logoutStore();
    toast.info("Sesión cerrada");
    router.push("/login");
  };
}

// ═══════════════════════════════════════════════════════════
//  CARGAR USUARIO ACTUAL
// ═══════════════════════════════════════════════════════════

export function useMe() {
  const setUsuario = useAuthStore((s) => s.setUsuario);
  const logoutStore = useAuthStore((s) => s.logout);
  const setLoading = useAuthStore((s) => s.setLoading);

  return async () => {
    const token = tokenStorage.getAccess();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get<Usuario>("/auth/me/");
      setUsuario(data);
    } catch {
      logoutStore();
    }
  };
}

// ═══════════════════════════════════════════════════════════
//  PERMISOS (helper)
// ═══════════════════════════════════════════════════════════

export function usePermisos() {
  const usuario = useAuthStore((s) => s.usuario);

  const esRol = (roles: string[]) => {
    if (!usuario) return false;
    return roles.includes(usuario.perfil.rol) || usuario.is_staff;
  };

  return {
    usuario,
    esAdmin: esRol(["admin"]),
    esRRHH: esRol(["admin", "rrhh"]),
    esManager: esRol(["admin", "rrhh", "manager"]),
  };
}