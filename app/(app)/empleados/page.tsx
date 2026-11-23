"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, X, Eye, Pencil, Trash2, Users } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { useEmpleados } from "@/hooks/use-empleados";
import { useAuthStore } from "@/stores/auth.store";

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

function formatBs(valor: string | number) {
  const num = typeof valor === "string" ? parseFloat(valor) : valor;
  if (isNaN(num)) return "—";
  return new Intl.NumberFormat("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

function formatFecha(fecha: string) {
  if (!fecha) return "—";
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

// ═══════════════════════════════════════════════════════════
//  COMPONENTE
// ═══════════════════════════════════════════════════════════

export default function EmpleadosPage() {
  // ─── Filtros ──────────────────────────────────────────
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [estatus, setEstatus] = useState("");

  // ─── Permisos ─────────────────────────────────────────
  const usuario = useAuthStore((s) => s.usuario);
  const esRRHH =
    usuario?.perfil?.rol === "admin" || usuario?.perfil?.rol === "rrhh";
  const esAdmin = usuario?.perfil?.rol === "admin";

  // ─── Datos ────────────────────────────────────────────
  const { data, isLoading, isFetching } = useEmpleados({
    page,
    search: search || undefined,
    estatus: estatus || undefined,
  });

  // ─── Handlers ─────────────────────────────────────────
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setEstatus("");
    setPage(1);
  };

  const hasFilters = Boolean(search || estatus);
  const totalPages = data ? Math.ceil(data.count / 20) : 1;
  const showingFrom = data && data.results.length > 0 ? (page - 1) * 20 + 1 : 0;
  const showingTo = data ? Math.min(page * 20, data.count) : 0;

  return (
    <div>
      {/* ═══════════════════════════════════════════════════
          ENCABEZADO
          ═══════════════════════════════════════════════════ */}
      <PageHeader
        title="Empleados"
        description={`${data?.count ?? 0} empleado${
          data?.count === 1 ? "" : "s"
        } registrado${data?.count === 1 ? "" : "s"}`}
        actions={
          esRRHH && (
            <Button asChild>
              <Link href="/empleados/nuevo">
                <Plus className="h-4 w-4" />
                Nuevo empleado
              </Link>
            </Button>
          )
        }
      />

      {/* ═══════════════════════════════════════════════════
          FILTROS
          ═══════════════════════════════════════════════════ */}
      <Card className="mb-4">
        <form
          onSubmit={handleSearch}
          className="p-4 flex flex-col md:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Buscar por nombre, número, email o cargo..."
              className="pl-9"
            />
          </div>

          <Select
            value={estatus}
            onChange={(e) => {
              setEstatus(e.target.value);
              setPage(1);
            }}
            className="md:w-52"
          >
            <option value="">Todos los estatus</option>
            <option value="activo">Activo</option>
            <option value="baja">Baja</option>
            <option value="licencia">Licencia</option>
            <option value="vacaciones">Vacaciones</option>
          </Select>

          <Button type="submit">Buscar</Button>

          {hasFilters && (
            <Button type="button" variant="ghost" onClick={clearFilters}>
              <X className="h-4 w-4" />
              Limpiar
            </Button>
          )}
        </form>
      </Card>

      {/* ═══════════════════════════════════════════════════
          TABLA
          ═══════════════════════════════════════════════════ */}
      <Card>
        {isLoading ? (
          <Spinner />
        ) : !data || data.results.length === 0 ? (
          <EmptyState
            icon={Users}
            title={
              hasFilters
                ? "No se encontraron resultados"
                : "No hay empleados registrados"
            }
            description={
              hasFilters
                ? "Prueba con otros filtros o limpia la búsqueda."
                : "Comienza agregando tu primer empleado al sistema."
            }
            action={
              hasFilters ? (
                <Button variant="outline" onClick={clearFilters}>
                  <X className="h-4 w-4" />
                  Limpiar filtros
                </Button>
              ) : esRRHH ? (
                <Button asChild>
                  <Link href="/empleados/nuevo">
                    <Plus className="h-4 w-4" />
                    Nuevo empleado
                  </Link>
                </Button>
              ) : undefined
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-100 bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Número
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Empleado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 hidden lg:table-cell">
                      Cargo
                    </th>
					<th className="...hidden xl:table-cell">
					  Departamento
					</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 hidden md:table-cell">
                      Ingreso
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 hidden md:table-cell">
                      Salario
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Estatus
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-50">
                  {data.results.map((emp) => (
                    <tr
                      key={emp.id}
                      className="group transition hover:bg-slate-50"
                    >
                      {/* Número */}
                      <td className="px-6 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center rounded bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-700">
                          {emp.numero_empleado}
                        </span>
                      </td>

                      {/* Empleado */}
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-xs font-bold text-white">
                            {iniciales(emp.nombre_completo)}
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/empleados/${emp.id}`}
                              className="block truncate text-sm font-medium text-slate-900 hover:text-blue-600"
                            >
                              {emp.nombre_completo}
                            </Link>
                            <div className="truncate text-xs text-slate-500">
                              {emp.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Cargo */}
                      <td className="px-6 py-3 hidden lg:table-cell">
                        {emp.cargo ? (
                          <div>
                            <div className="text-sm font-medium text-slate-800">
                              {emp.cargo.nombre}
                            </div>
                            <div className="text-xs text-slate-500">
                              {emp.cargo.codigo}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs italic text-slate-400">
                            Sin asignar
                          </span>
                        )}
                      </td>

					  <td className="px-6 py-3 hidden xl:table-cell">
						  {emp.departamento ? (
							<span className="text-sm text-slate-700">
							  {emp.departamento.nombre}
							</span>
						  ) : (
							<span className="text-xs italic text-slate-400">Sin asignar</span>
						  )}
					  </td>

                      {/* Ingreso */}
                      <td className="px-6 py-3 text-sm text-slate-600 hidden md:table-cell whitespace-nowrap">
                        {formatFecha(emp.fecha_ingreso)}
                      </td>

                      {/* Salario */}
                      <td className="px-6 py-3 text-right hidden md:table-cell whitespace-nowrap">
                        <span className="font-mono text-sm text-slate-700">
                          Bs. {formatBs(emp.salario_base)}
                        </span>
                      </td>

                      {/* Estatus */}
                      <td className="px-6 py-3 text-center">
                        <Badge variant={estatusVariant(emp.estatus)}>
                          {estatusLabel(emp.estatus)}
                        </Badge>
                      </td>

                      {/* Acciones */}
                      <td className="px-6 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            title="Ver detalle"
                          >
                            <Link href={`/empleados/${emp.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>

                          {esRRHH && (
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              title="Editar"
                            >
                              <Link href={`/empleados/${emp.id}/editar`}>
                                <Pencil className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}

                          {esAdmin && (
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              title="Eliminar"
                            >
                              <Link href={`/empleados/${emp.id}/eliminar`}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Link>
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ═══════════════════════════════════════════════════
                PAGINACIÓN
                ═══════════════════════════════════════════════════ */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 px-6 py-4">
              <div className="text-xs text-slate-500">
                Mostrando <strong>{showingFrom}</strong>-
                <strong>{showingTo}</strong> de <strong>{data.count}</strong>{" "}
                registro{data.count === 1 ? "" : "s"}
                {isFetching && (
                  <span className="ml-2 text-blue-600">· Actualizando…</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!data.previous}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  ← Anterior
                </Button>

                <span className="px-3 text-xs text-slate-600">
                  Página <strong>{page}</strong> de{" "}
                  <strong>{totalPages || 1}</strong>
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={!data.next}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Siguiente →
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}