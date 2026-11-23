"use client";

import { use } from "react";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
import { EmpleadoForm, EmpleadoFormData } from "@/components/empleados/empleado-form";
import { useActualizarEmpleado, useEmpleado } from "@/hooks/use-empleados";
import { Spinner } from "@/components/ui/spinner";

export default function EditarEmpleadoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const actualizar = useActualizarEmpleado();
  const { data: emp, isLoading } = useEmpleado(Number(id));

  if (isLoading) return <Spinner />;
  if (!emp) return <div>Empleado no encontrado</div>;

  const handleSubmit = async (data: EmpleadoFormData) => {
    await actualizar.mutateAsync({ id: emp.id, payload: data });
    router.push(`/empleados/${emp.id}`);
  };

  return (
    <div>
      <PageHeader
        title="Editar empleado"
        description={`Actualizando datos de ${emp.nombre_completo}`}
      />
      <EmpleadoForm
        defaultValues={emp}
        onSubmit={handleSubmit}
        loading={actualizar.isPending}
        submitLabel="Guardar cambios"
        onCancel={() => router.push(`/empleados/${emp.id}`)}
      />
    </div>
  );
}