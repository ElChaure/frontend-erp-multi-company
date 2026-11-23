"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empleado } from "@/types/api";
import { useCargos } from "@/hooks/use-cargos";
import { useDepartamentos } from "@/hooks/use-departamentos";
import { CargoSimple } from "@/types/api";


const schema = z.object({
  numero_empleado: z
    .string()
    .min(1, "Requerido")
    .regex(/^EMP-\d{4}$/, "Formato: EMP-0001"),
  nombre: z.string().min(1, "Requerido"),
  apellido_paterno: z.string().min(1, "Requerido"),
  apellido_materno: z.string().optional().or(z.literal("")),
  email: z.string().email("Email inválido"),
  telefono: z.string().optional().or(z.literal("")),
  fecha_ingreso: z.string().min(1, "Requerido"),
  salario_base: z.coerce.number().positive("Debe ser mayor a 0"),
  estatus: z.enum(["activo", "baja", "licencia", "vacaciones"]),
  cargo_id: z.coerce.number().nullable().optional(),
  departamento_id: z.coerce.number().nullable().optional(),
});

export type EmpleadoFormData = z.infer<typeof schema>;

interface Props {
  defaultValues?: Partial<Empleado>;
  onSubmit: (data: EmpleadoFormData) => void;
  loading?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
}

export function EmpleadoForm({
  defaultValues,
  onSubmit,
  loading,
  submitLabel = "Guardar",
  onCancel,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmpleadoFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      numero_empleado: defaultValues?.numero_empleado || "",
      nombre: defaultValues?.nombre || "",
      apellido_paterno: defaultValues?.apellido_paterno || "",
      apellido_materno: defaultValues?.apellido_materno || "",
      email: defaultValues?.email || "",
      telefono: defaultValues?.telefono || "",
      fecha_ingreso: defaultValues?.fecha_ingreso || "",
	  cargo_id: defaultValues?.cargo?.id || null,
	  departamento_id: defaultValues?.departamento?.id || null,
      salario_base: defaultValues?.salario_base
        ? Number(defaultValues.salario_base)
        : undefined,
      estatus:
        (defaultValues?.estatus as EmpleadoFormData["estatus"]) || "activo",
    },
  });

const { data: cargos, isLoading: loadingCargos } = useCargos(true);
const { data: departamentos, isLoading: loadingDeptos } = useDepartamentos(true);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Identificación</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Número de empleado *
            </label>
            <Input {...register("numero_empleado")} placeholder="EMP-0001" error={!!errors.numero_empleado} />
            {errors.numero_empleado && (
              <p className="mt-1 text-xs text-red-600">{errors.numero_empleado.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Nombre *
            </label>
            <Input {...register("nombre")} error={!!errors.nombre} />
            {errors.nombre && (
              <p className="mt-1 text-xs text-red-600">{errors.nombre.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Apellido paterno *
            </label>
            <Input {...register("apellido_paterno")} error={!!errors.apellido_paterno} />
            {errors.apellido_paterno && (
              <p className="mt-1 text-xs text-red-600">{errors.apellido_paterno.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Apellido materno
            </label>
            <Input {...register("apellido_materno")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contacto</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Email *
            </label>
            <Input
              type="email"
              {...register("email")}
              error={!!errors.email}
              placeholder="correo@empresa.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Teléfono
            </label>
            <Input {...register("telefono")} placeholder="+58 412 1234567" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Datos laborales</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Fecha de ingreso *
            </label>
            <Input
              type="date"
              {...register("fecha_ingreso")}
              error={!!errors.fecha_ingreso}
            />
            {errors.fecha_ingreso && (
              <p className="mt-1 text-xs text-red-600">{errors.fecha_ingreso.message}</p>
            )}
          </div>
		  
		  <div className="md:col-span-3">
  <label className="block text-sm font-medium text-slate-700 mb-1.5">
    Cargo
  </label>
  <Select {...register("cargo_id")} disabled={loadingCargos}>
    <option value="">Sin cargo asignado</option>
    {cargos?.results.map((c) => (
      <option key={c.id} value={c.id}>
        {c.nombre} ({c.codigo})
      </option>
    ))}
  </Select>
  <p className="mt-1 text-xs text-slate-500">
    Asigna el cargo que ocupa el empleado dentro de la organización.
  </p>
</div>
<div className="md:col-span-2">
  <label className="block text-sm font-medium text-slate-700 mb-1.5">
    Departamento
  </label>
  <Select
    {...register("departamento_id")}
    disabled={loadingDeptos}
    defaultValue={defaultValues?.departamento?.id || ""}
  >
    <option value="">Sin departamento asignado</option>
    {departamentos?.results.map((d) => (
      <option key={d.id} value={d.id}>
        {d.nombre} ({d.codigo})
      </option>
    ))}
  </Select>
  <p className="mt-1 text-xs text-slate-500">
    Departamento al que pertenece el empleado
  </p>
</div>		  
		  
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Salario base *
            </label>
            <Input
              type="number"
              step="0.01"
              {...register("salario_base")}
              error={!!errors.salario_base}
            />
            {errors.salario_base && (
              <p className="mt-1 text-xs text-red-600">{errors.salario_base.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Estatus
            </label>
            <Select {...register("estatus")}>
              <option value="activo">Activo</option>
              <option value="licencia">Licencia</option>
              <option value="vacaciones">Vacaciones</option>
              <option value="baja">Baja</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}