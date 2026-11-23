"use client";

import { useQuery } from "@tanstack/react-query";
import { api, Paginated } from "@/lib/api";
import { Departamento } from "@/types/api";

export function useDepartamentos(soloActivos = true) {
  return useQuery({
    queryKey: ["departamentos", { soloActivos }],
    queryFn: async () => {
      const params = soloActivos ? "?activo=true" : "";
      const { data } = await api.get<Paginated<Departamento>>(`/departamentos/${params}`);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}