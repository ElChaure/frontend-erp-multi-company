"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Paginated } from "@/lib/api";
import { Cargo } from "@/types/api";

export function useCargos(soloActivos = true) {
  return useQuery({
    queryKey: ["cargos", { soloActivos }],
    queryFn: async () => {
      const params = soloActivos ? "?activo=true" : "";
      const { data } = await api.get<Paginated<Cargo>>(`/cargos/${params}`);
      return data;
    },
  });
}