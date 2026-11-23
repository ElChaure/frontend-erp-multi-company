"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Briefcase,
  Clock,
  Hash,
  User as UserIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useEmpleado } from "@/hooks/use-empleados";
import { useAuthStore } from "@/stores/auth.store";
import { Building2 } from "lucide-react";

// ═══════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════

function estatusVariant(estatus: string) {
  switch (estatus) {
    case "activo":
      return "success" as const;
    case "baja":
      return "danger" as const;
    case "licencia":
      return "warning" as const;
    case "vacaciones":
      return "info" as const;
    default:
      return "neutral" as const;
  }
}

function estatusLabel(estatus: string) {
  const labels: Record<string, string> = {
    activo: "Activo",
    baja: "Baja",
    licencia: "Licencia",
    vacaciones: "Vacaciones",
  };
  return labels[estatus] || estatus;
}

function iniciales(nombreCompleto: string) {
  return nombreCompleto
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function formatBs(valor: string | number | null | undefined) {
  if (valor === null || valor === undefined || valor === "") return "—";
  const num = typeof valor === "string" ? parseFloat(valor) : valor;
  if (isNaN(num)) return "—";
  return new Intl.NumberFormat("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

function formatFecha(fecha: string | null | undefined) {
  if (!fecha) return "—";
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
}

function formatFechaHora(fecha: string | null | undefined) {
  if (!fecha) return "—";
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function calcularAntiguedad(fechaingreso: string) {
  const ingreso = new Date(fechaingreso);
  const ahora = new Date();
  const diffMs = ahora.getTime() - ingreso.getTime();
  const dias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const anios = Math.floor(dias / 365);
  const meses = Math.floor((dias % 365) / 30);

  if (anios > 0 && meses > 0) {
    return `${anios} año${anios !== 1 ? "s" : ""}, ${meses} mes${meses !== 1 ? "es" : ""}`;
  }
  if (anios > 0) return `${anios} año${anios !== 1 ? "s" : ""}`;
  if (meses > 0) return `${meses} mes${meses !== 1 ? "es" : ""}`;
  return `${dias} día${dias !== 1 ? "s" : ""}`;
}

// ═══════════════════════════════════════════════════════════
//  COMPONENTE
// ═══════════════════════════════════════════════════════════

export default function EmpleadoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"general" | "laboral" | "auditoria">(
    "general",
  );

  // ─── Permisos ─────────────────────────────────────────
  const usuario = useAuthStore((s) => s.usuario);
  const esRRHH =
    usuario?.perfil?.rol === "admin" || usuario?.perfil?.rol === "rrhh";
  const esAdmin = usuario?.perfil?.rol === "admin";

  // ─── Datos ────────────────────────────────────────────
  const { data: emp, isLoading, error } = useEmpleado(Number(id));

  // ─── Loading ──────────────────────────────────────────
  if (isLoading) return <Spinner />;

  // ─── No encontrado ────────────────────────────────────
  if (error || !emp) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-full bg-slate-100 p-4 mb-4">
          <UserIcon className="h-8 w-8 text-slate-400" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900">
          Empleado no encontrado
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          El empleado que buscas no existe o fue eliminado.
        </p>
        <Button
          variant="outline"
          onClick={() => router.push("/empleados")}
          className="mt-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al listado
        </Button>
      </div>
    );
  }

  // ─── Derivados ────────────────────────────────────────
  const estatus_ = estatusVariant(emp.estatus);
  const inicialesEmp = iniciales(emp.nombre_completo);

  return (
    <div>
      {/* ═══════════════════════════════════════════════════
          BOTÓN VOLVER
          ═══════════════════════════════════════════════════ */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/empleados")}
        className="mb-4 -ml-3"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al listado
      </Button>

      {/* ═══════════════════════════════════════════════════
          ENCABEZADO
          ═══════════════════════════════════════════════════ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
        {/* Avatar + nombre */}
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-xl sm:text-2xl font-bold text-white shadow-lg">
            {inicialesEmp}
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {emp.nombre_completo}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              {/* Número de empleado */}
              <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-700">
                <Hash className="h-3 w-3" />
                {emp.numero_empleado}
              </span>

              {/* Estatus */}
              <Badge variant={estatus_}>{estatusLabel(emp.estatus)}</Badge>

              {/* Cargo */}
              {emp.cargo && (
                <Badge variant="info">
                  <Briefcase className="h-3 w-3 mr-1" />
                  {emp.cargo.nombre}
                </Badge>
              )}
			  			  
			  {/* Departamento */}
			  {emp.departamento && (
				  <Badge variant="neutral">
					<Building2 className="h-3 w-3 mr-1" />
					{emp.departamento.nombre}
				  </Badge>
				)}
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-wrap gap-2">
          {esRRHH && (
            <Button asChild>
              <Link href={`/empleados/${emp.id}/editar`}>
                <Pencil className="h-4 w-4" />
                Editar
              </Link>
            </Button>
          )}

          {esAdmin && (
            <Button variant="danger" asChild>
              <Link href={`/empleados/${emp.id}/eliminar`}>
                <Trash2 className="h-4 w-4" />
                Eliminar
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          TABS
          ═══════════════════════════════════════════════════ */}
      <div className="border-b border-slate-200 mb-6">
        <nav className="flex gap-6 -mb-px">
          <button
            onClick={() => setActiveTab("general")}
            className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition ${
              activeTab === "general"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <UserIcon className="h-4 w-4" />
            Datos generales
          </button>

          <button
            onClick={() => setActiveTab("laboral")}
            className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition ${
              activeTab === "laboral"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <Briefcase className="h-4 w-4" />
            Datos laborales
          </button>

          <button
            onClick={() => setActiveTab("auditoria")}
            className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition ${
              activeTab === "auditoria"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <Clock className="h-4 w-4" />
            Auditoría
          </button>
        </nav>
      </div>

      {/* ═══════════════════════════════════════════════════
          TAB: DATOS GENERALES
          ═══════════════════════════════════════════════════ */}
      {activeTab === "general" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card: Información personal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-blue-600" />
                Información personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1">
                    Nombre(s)
                  </div>
                  <div className="text-sm text-slate-900">{emp.nombre}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1">
                    Apellido paterno
                  </div>
                  <div className="text-sm text-slate-900">
                    {emp.apellido_paterno}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs font-medium text-slate-500 mb-1">
                    Apellido materno
                  </div>
                  <div className="text-sm text-slate-900">
                    {emp.apellido_materno || "—"}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <div className="text-xs font-medium text-slate-500 mb-1">
                  Nombre completo
                </div>
                <div className="text-sm font-semibold text-slate-900">
                  {emp.nombre_completo}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card: Contacto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                Información de contacto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-slate-100 p-2">
                  <Mail className="h-4 w-4 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-slate-500 mb-0.5">
                    Correo electrónico
                  </div>
                  <a
                    href={`mailto:${emp.email}`}
                    className="text-sm text-blue-600 hover:underline break-all"
                  >
                    {emp.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-slate-100 p-2">
                  <Phone className="h-4 w-4 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-slate-500 mb-0.5">
                    Teléfono
                  </div>
                  {emp.telefono ? (
                    <a
                      href={`tel:${emp.telefono}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {emp.telefono}
                    </a>
                  ) : (
                    <div className="text-sm text-slate-400 italic">
                      No registrado
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          TAB: DATOS LABORALES
          ═══════════════════════════════════════════════════ */}
      {activeTab === "laboral" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card: Cargo y contrato */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-blue-600" />
                Cargo y contrato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-xs font-medium text-slate-500 mb-1">
                  Cargo
                </div>
                {emp.cargo ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">
                      {emp.cargo.nombre}
                    </span>
                    <span className="inline-flex items-center rounded bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-700">
                      {emp.cargo.codigo}
                    </span>
                  </div>
                ) : (
                  <div className="text-sm text-slate-400 italic">
                    Sin cargo asignado
                  </div>
                )}
              </div>
			  <div>
				  <div className="text-xs font-medium text-slate-500 mb-1">
					Departamento
				  </div>
				  {emp.departamento ? (
					<div className="text-sm text-slate-900">
					  {emp.departamento.nombre} ({emp.departamento.codigo})
					</div>
				  ) : (
					<div className="text-sm text-slate-400 italic">Sin asignar</div>
				  )}
			  </div>


              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1">
                    Número de empleado
                  </div>
                  <div className="text-sm font-mono text-slate-900">
                    {emp.numero_empleado}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1">
                    Estatus
                  </div>
                  <Badge variant={estatus_}>
                    {estatusLabel(emp.estatus)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card: Fechas y antigüedad */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                Fechas y antigüedad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-slate-100 p-2">
                  <Calendar className="h-4 w-4 text-slate-600" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-slate-500 mb-0.5">
                    Fecha de ingreso
                  </div>
                  <div className="text-sm text-slate-900">
                    {formatFecha(emp.fecha_ingreso)}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                <div className="rounded-lg bg-emerald-100 p-2">
                  <Clock className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-slate-500 mb-0.5">
                    Antigüedad
                  </div>
                  <div className="text-sm font-semibold text-emerald-700">
                    {calcularAntiguedad(emp.fecha_ingreso)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card: Compensación */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-600" />
                Compensación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1">
                    Salario base mensual
                  </div>
                  <div className="text-lg font-bold text-emerald-700 font-mono">
                    Bs. {formatBs(emp.salario_base)}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1">
                    Salario diario
                  </div>
                  <div className="text-lg font-semibold text-slate-700 font-mono">
                    Bs. {formatBs(Number(emp.salario_base) / 30)}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1">
                    Salario quincenal
                  </div>
                  <div className="text-lg font-semibold text-slate-700 font-mono">
                    Bs. {formatBs(Number(emp.salario_base) / 2)}
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-blue-50 border border-blue-100 p-3 text-xs text-blue-800">
                <strong>Nota:</strong> los cálculos de nómina se aplican según el
                periodo configurado (quincenal por defecto).
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          TAB: AUDITORÍA
          ═══════════════════════════════════════════════════ */}
      {activeTab === "auditoria" && (
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                Historial del registro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div className="flex items-start justify-between gap-4 py-3 border-b border-slate-100">
                  <dt className="text-sm text-slate-500">ID interno</dt>
                  <dd className="text-sm font-mono text-slate-900">
                    #{emp.id}
                  </dd>
                </div>

                <div className="flex items-start justify-between gap-4 py-3 border-b border-slate-100">
                  <dt className="text-sm text-slate-500">Creado</dt>
                  <dd className="text-sm text-slate-900">
                    {formatFechaHora(emp.created_at)}
                  </dd>
                </div>

                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="text-sm text-slate-500">
                    Última modificación
                  </dt>
                  <dd className="text-sm text-slate-900">
                    {formatFechaHora(emp.updated_at)}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}