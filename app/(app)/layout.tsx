"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { tokenStorage, api } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import { Usuario } from "@/types/api";
import { Spinner } from "@/components/ui/spinner";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const usuario = useAuthStore((s) => s.usuario);
  const setUsuario = useAuthStore((s) => s.setUsuario);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    const token = tokenStorage.getAccess();

    if (!token) {
      router.replace("/login");
      return;
    }

    if (usuario) {
      setChecking(false);
      return;
    }

    // Cargar el usuario actual
    api
      .get<Usuario>("/auth/me/")
      .then((res) => {
        setUsuario(res.data);
        setChecking(false);
      })
      .catch(() => {
        logout();
        router.replace("/login");
      });
  }, [router, usuario, setUsuario, logout]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}