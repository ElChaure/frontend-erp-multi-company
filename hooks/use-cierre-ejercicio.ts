"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, getApiErrorMessage, Paginated } from "@/lib/api";

// ═══════════════════════════════════════════════════════════
//  TIPOS
// ═══════════════════════════════════════════════════════════

export interface EjercicioFiscal {
  id: number;
  anio: number;
  fecha_inicio: string;
  fecha_fin: string;
  cerrado: boolean;
  fecha_cierre?: string;
  cerrado_por?: { id: number; username: string };
}

export interface PrevisualizacionCierre {
  ejercicio_id: number;
  anio: number;
  resultado: number; // Utilidad (positivo) o Pérdida (negativo)
  total_ingresos: number;
  total_gastos: number;
  total_costos: number;
  asiento_cierre_propuesto: {
    concepto: string;
    lineas: Array<{
      cuenta: { codigo: string; nombre: string };
      debito: number;
      credito: number;
    }>;
  };
}

export interface CierreRealizado {
  ejercicio_id: number;
  mensaje: string;
  asiento_cierre_id: number;
  asiento_apertura_id?: number;
}

// ═══════════════════════════════════════════════════════════
//  LISTAR EJERCICIOS FISCALES
// ═══════════════════════════════════════════════════════════

export function useEjerciciosFiscales() {
  return useQuery({
    queryKey: ["ejercicios-fiscales"],
    queryFn: async () => {
      const { data } = await api.get<Paginated<EjercicioFiscal>>("/contabilidad/ejercicios-fiscales/");
      return data;
    },
  });
}

// ═══════════════════════════════════════════════════════════
//  PREVISUALIZAR CIERRE
// ═══════════════════════════════════════════════════════════

export function usePrevisualizarCierre(ejercicioId?: number) {
  return useQuery({
    queryKey: ["previsualizar-cierre", ejercicioId],
    queryFn: async () => {
      const { data } = await api.get<PrevisualizacionCierre>(`/contabilidad/ejercicios-fiscales/${ejercicioId}/previsualizar-cierre/`);
      return data;
    },
    enabled: !!ejercicioId,
  });
}

// ═══════════════════════════════════════════════════════════
//  EJECUTAR CIERRE
// ═══════════════════════════════════════════════════════════

export function useEjecutarCierre() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (ejercicioId: number) => {
      const { data } = await api.post<CierreRealizado>(`/contabilidad/ejercicios-fiscales/${ejercicioId}/cerrar/`);
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["ejercicios-fiscales"] });
      qc.invalidateQueries({ queryKey: ["previsualizar-cierre"] });
      toast.success(data.mensaje || "Ejercicio fiscal cerrado exitosamente.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}