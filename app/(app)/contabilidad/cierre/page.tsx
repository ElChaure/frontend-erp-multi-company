"use client";

import { useState } from "react";
import { Lock, AlertTriangle, FileText, CheckCircle2, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useEjerciciosFiscales, usePrevisualizarCierre, useEjecutarCierre } from "@/hooks/use-cierre-ejercicio";

function formatBs(valor: number) {
  return new Intl.NumberFormat("es-VE", {
    style: "currency",
    currency: "VES",
    minimumFractionDigits: 2,
  }).format(valor);
}

export default function CierreEjercicioPage() {
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState<number | undefined>(undefined);

  const { data: ejerciciosData, isLoading: loadingEjercicios } = useEjerciciosFiscales();
  const { data: preview, isLoading: loadingPreview } = usePrevisualizarCierre(ejercicioSeleccionado);
  const { mutate: ejecutarCierre, isPending: ejecutando } = useEjecutarCierre();

  const ejerciciosAbiertos = ejerciciosData?.results.filter(e => !e.cerrado) || [];

  const handleCerrar = () => {
    if (ejercicioSeleccionado) {
      if (confirm("¿Está seguro de cerrar este ejercicio fiscal? Esta acción generará los asientos contables correspondientes y no podrá deshacerse fácilmente.")) {
        ejecutarCierre(ejercicioSeleccionado);
      }
    }
  };

  return (
    <div>
      <PageHeader
        title="Cierre de Ejercicio Fiscal"
        description="Consolide los resultados del año fiscal y genere los asientos de cierre y apertura."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ─── Panel Izquierdo: Selección ─────────────────── */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Seleccionar Ejercicio</CardTitle>
            </CardHeader>
            <CardContent>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Ejercicio Fiscal a Cerrar
              </label>
              <Select
                value={ejercicioSeleccionado || ""}
                onChange={(e) => setEjercicioSeleccionado(Number(e.target.value))}
                disabled={loadingEjercicios}
              >
                <option value="">Seleccione un año...</option>
                {ejerciciosAbiertos.map((ej) => (
                  <option key={ej.id} value={ej.id}>
                    {ej.anio} ({ej.fecha_inicio} al {ej.fecha_fin})
                  </option>
                ))}
              </Select>
              {ejerciciosAbiertos.length === 0 && !loadingEjercicios && (
                <p className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  No hay ejercicios fiscales abiertos para cerrar.
                </p>
              )}
            </CardContent>
          </Card>

          {preview && (
            <Card className="bg-slate-50 border-slate-200">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Ingresos Totales:</span>
                  <span className="font-mono font-medium text-emerald-600">{formatBs(preview.total_ingresos)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Costos Totales:</span>
                  <span className="font-mono font-medium text-red-600">{formatBs(preview.total_costos)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Gastos Totales:</span>
                  <span className="font-mono font-medium text-red-600">{formatBs(preview.total_gastos)}</span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                  <span className="font-bold text-slate-800">Resultado del Ejercicio:</span>
                  <span className={`font-mono font-bold text-lg ${preview.resultado >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {formatBs(preview.resultado)}
                  </span>
                </div>
                <div className="text-xs text-slate-500 pt-2">
                  {preview.resultado >= 0 ? "Utilidad del Ejercicio" : "Pérdida del Ejercicio"}
                </div>
              </CardContent>
            </Card>
          )}

          <Button
            className="w-full"
            size="lg"
            disabled={!ejercicioSeleccionado || loadingPreview || ejecutando}
            onClick={handleCerrar}
            loading={ejecutando}
          >
            <Lock className="h-4 w-4 mr-2" />
            Ejecutar Cierre
          </Button>
        </div>

        {/* ─── Panel Derecho: Asiento Propuesto ────────────── */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-500" />
                Asiento de Cierre Propuesto
              </CardTitle>
              {loadingPreview && <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />}
            </CardHeader>
            <CardContent>
              {!ejercicioSeleccionado ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <FileText className="h-12 w-12 mb-2 opacity-50" />
                  <p>Seleccione un ejercicio para ver el asiento contable.</p>
                </div>
              ) : loadingPreview ? (
                <div className="py-12"><Spinner /></div>
              ) : preview ? (
                <div className="space-y-4">
                  <p className="text-sm text-slate-600 italic">
                    {preview.asiento_cierre_propuesto.concepto}
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b border-slate-200 bg-slate-50">
                        <tr>
                          <th className="px-3 py-2 text-left font-semibold text-slate-600">Código</th>
                          <th className="px-3 py-2 text-left font-semibold text-slate-600">Cuenta</th>
                          <th className="px-3 py-2 text-right font-semibold text-slate-600">Debe</th>
                          <th className="px-3 py-2 text-right font-semibold text-slate-600">Haber</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {preview.asiento_cierre_propuesto.lineas.map((linea, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="px-3 py-2 font-mono text-xs text-slate-500">{linea.cuenta.codigo}</td>
                            <td className="px-3 py-2 text-slate-800">{linea.cuenta.nombre}</td>
                            <td className="px-3 py-2 text-right font-mono text-slate-700">{linea.debito > 0 ? formatBs(linea.debito) : "—"}</td>
                            <td className="px-3 py-2 text-right font-mono text-slate-700">{linea.credito > 0 ? formatBs(linea.credito) : "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 p-3 rounded-lg">
                    <CheckCircle2 className="h-4 w-4" />
                    El asiento se encuentra cuadrado y listo para ser contabilizado.
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-red-500">
                  No se pudo cargar la previsualización del asiento.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}