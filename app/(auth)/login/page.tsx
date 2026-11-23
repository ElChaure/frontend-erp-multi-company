"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Building2 } from "lucide-react";

import { useLogin } from "@/hooks/use-auth";
import { tokenStorage } from "@/lib/api";

const loginSchema = z.object({
  username: z.string().min(1, "Usuario requerido"),
  password: z.string().min(1, "Contraseña requerida"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  // Limpiar tokens viejos al entrar al login
  useEffect(() => {
    tokenStorage.clear();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => login.mutate(data);

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-full bg-blue-600 text-white items-center justify-center mb-4">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">RRHH System</h1>
          <p className="text-sm text-slate-500 mt-1">
            Ingresa con tus credenciales
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Usuario
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              autoFocus
              {...register("username")}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="admin"
            />
            {errors.username && (
              <p className="text-xs text-red-600 mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                {...register("password")}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-700"
              >
                {showPassword ? "Ocultar" : "Ver"}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={login.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2"
          >
            {login.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {login.isPending ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-xs text-center text-slate-500">
            ¿Problemas para acceder? Contacta a RRHH.
          </p>
        </div>
      </div>

      <p className="text-center text-xs text-slate-500 mt-6">
        © {new Date().getFullYear()} RRHH System
      </p>
    </div>
  );
}