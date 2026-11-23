"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useEliminarEmpleado, useEmpleado } from "@/hooks/use-empleados";

export default function EliminarEmpleadoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const eliminar = useEliminarEmpleado();
  const { data: emp, isLoading } = useEmpleado(Number(id));

  if (isLoading) return <Spinner />;
  if (!emp) return <div>Empleado no encontrado</div>;

  const handleEliminar = async () => {
    await eliminar.mutateAsync(emp.id);
    router.push("/empleados");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="h-4 w-4" /> Volver
      </Button>

      <Card className="border-2 border-red-200">
        <div className="bg-red-600 text-white px-6 py-4 rounded-t-xl flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <h1 className="text-lg font-semibold">Confirmar eliminación</h1>
        </div>
        <CardContent className="p-6 space-y-6">
          <p className="text-slate-700">
            Estás a punto de eliminar permanentemente al siguiente empleado.
            <strong className="text-red-700"> Esta acción no se puede deshacer.</strong>
          </p>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white font-bold">
              {emp.nombre_completo
                .split(" ")
                .slice(0, 2)
                .map((p) => p[0])
                .join("")
                .toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-slate-900">{emp.nombre_completo}</div>
              <div className="text-xs text-slate-500">
                {emp.numero_empleado} · {emp.email}
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900">
            <strong>Recomendación:</strong> si solo quieres dar de baja al empleado,
            considera cambiar su estatus a "Baja" en lugar de eliminarlo.
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleEliminar}
              loading={eliminar.isPending}
            >
              Sí, eliminar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}