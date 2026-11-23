"use client";

import Link from "next/link";
import { Users, UserCheck, UserX, Building2, Plus } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  useEmpleadoEstadisticas,
  useEmpleados,
} from "@/hooks/use-empleados";
import { useAuthStore } from "@/stores/auth.store";

export default function DashboardPage() {
  const usuario = useAuthStore((s) => s.usuario);
  const { data: stats, isLoading: loadingStats } = useEmpleadoEstadisticas();
  const { data: recientes, isLoading: loadingRecientes } = useEmpleados({
    ordering: "-fecha_ingreso",
    page: 1,
  });

  return (
    <div>
      <PageHeader
        title={`Bienvenido, ${usuario?.nombre_completo?.split(" ")[0] || ""}`}
        description="Resumen general del sistema de recursos humanos"
        actions={
          <Button asChild>
            <Link href="/empleados/nuevo">
              <Plus className="h-4 w-4" />
              Nuevo empleado
            </Link>
          </Button>
        }
      />

      {/* KPIs */}
      {loadingStats ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KpiCard
            title="Total empleados"
            value={stats?.total ?? 0}
            icon={Users}
            variant="primary"
            hint="Registrados en el sistema"
          />
          <KpiCard
            title="Activos"
            value={stats?.activos ?? 0}
            icon={UserCheck}
            variant="success"
            hint="En nómina actualmente"
          />
          <KpiCard
            title="Bajas"
            value={stats?.bajas ?? 0}
            icon={UserX}
            variant="danger"
            hint="Histórico"
          />
          <KpiCard
            title="Licencias"
            value={stats?.licencias ?? 0}
            icon={Building2}
            variant="warning"
            hint="Temporalmente inactivos"
          />
        </div>
      )}

      {/* Empleados recientes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Empleados recientes</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/empleados">Ver todos</Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {loadingRecientes ? (
            <Spinner />
          ) : recientes && recientes.results.length > 0 ? (
            <table className="w-full">
              <thead className="border-b border-slate-100 bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                    Empleado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500 hidden md:table-cell">
                    Fecha ingreso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                    Estatus
                  </th>
                </tr>
              </thead>
              <tbody>
                {recientes.results.slice(0, 5).map((emp) => (
                  <tr
                    key={emp.id}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-6 py-3">
                      <Link
                        href={`/empleados/${emp.id}`}
                        className="text-sm font-medium text-slate-900 hover:text-blue-600"
                      >
                        {emp.nombre_completo}
                      </Link>
                      <div className="text-xs text-slate-500">
                        {emp.numero_empleado} · {emp.email}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-600 hidden md:table-cell">
                      {new Date(emp.fecha_ingreso).toLocaleDateString("es-MX")}
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 capitalize">
                        {emp.estatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center text-sm text-slate-500">
              No hay empleados registrados
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}