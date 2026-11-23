"use client";

import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
import { EmpleadoForm, EmpleadoFormData } from "@/components/empleados/empleado-form";
import { useCrearEmpleado } from "@/hooks/use-empleados";

export default function NuevoEmpleadoPage() {
  const router = useRouter();
  const crear = useCrearEmpleado();

  const handleSubmit = async (data: EmpleadoFormData) => {
    await crear.mutateAsync(data);
    router.push("/empleados");
  };

  return (
    <div>
      <PageHeader
        title="Nuevo empleado"
        description="Registra un nuevo empleado en el sistema"
      />
      <EmpleadoForm
        onSubmit={handleSubmit}
        loading={crear.isPending}
        submitLabel="Crear empleado"
        onCancel={() => router.push("/empleados")}
      />
    </div>
  );
}