"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api, getApiErrorMessage, Paginated } from "@/lib/api";
import {
  Empleado,
  EmpleadoList,
  EmpleadoEstadisticas,
} from "@/types/api";

// ═══════════════════════════════════════════════════════════
//  LISTAR
// ═══════════════════════════════════════════════════════════

interface ListarParams {
  page?: number;
  search?: string;
  estatus?: string;
  ordering?: string;
}

export function useEmpleados(params: ListarParams = {}) {
  const query = new URLSearchParams();

  if (params.page) query.set("page", String(params.page));
  if (params.search) query.set("search", params.search);
  if (params.estatus) query.set("estatus", params.estatus);
  if (params.ordering) query.set("ordering", params.ordering);

  const qs = query.toString();

  return useQuery({
    queryKey: ["empleados", params],
    queryFn: async () => {
      const { data } = await api.get<Paginated<EmpleadoList>>(
        `/empleados/${qs ? `?${qs}` : ""}`,
      );
      return data;
    },
  });
}

// ═══════════════════════════════════════════════════════════
//  DETALLE
// ═══════════════════════════════════════════════════════════

export function useEmpleado(id: number | undefined) {
  return useQuery({
    queryKey: ["empleado", id],
    queryFn: async () => {
      const { data } = await api.get<Empleado>(`/empleados/${id}/`);
      return data;
    },
    enabled: !!id,
  });
}

// ═══════════════════════════════════════════════════════════
//  ESTADÍSTICAS
// ═══════════════════════════════════════════════════════════

export function useEmpleadoEstadisticas() {
  return useQuery({
    queryKey: ["empleados", "estadisticas"],
    queryFn: async () => {
      const { data } = await api.get<EmpleadoEstadisticas>(
        "/empleados/estadisticas/",
      );
      return data;
    },
  });
}

// ═══════════════════════════════════════════════════════════
//  CREAR
// ═══════════════════════════════════════════════════════════

export function useCrearEmpleado() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<Empleado>) => {
      const { data } = await api.post<Empleado>("/empleados/", payload);
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["empleados"] });
      toast.success(`Empleado ${data.nombre_completo} creado.`);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

// ═══════════════════════════════════════════════════════════
//  ACTUALIZAR
// ═══════════════════════════════════════════════════════════

export function useActualizarEmpleado() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<Empleado>;
    }) => {
      const { data } = await api.patch<Empleado>(`/empleados/${id}/`, payload);
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["empleados"] });
      qc.invalidateQueries({ queryKey: ["empleado", data.id] });
      toast.success("Empleado actualizado.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

// ═══════════════════════════════════════════════════════════
//  ELIMINAR
// ═══════════════════════════════════════════════════════════

export function useEliminarEmpleado() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/empleados/${id}/`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["empleados"] });
      toast.success("Empleado eliminado.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

// ═══════════════════════════════════════════════════════════
//  DAR DE BAJA
// ═══════════════════════════════════════════════════════════

export function useDarBajaEmpleado() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.post<Empleado>(`/empleados/${id}/baja/`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["empleados"] });
      toast.success("Empleado dado de baja.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}