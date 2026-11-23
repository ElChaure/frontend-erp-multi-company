// ─── Respuestas genéricas de DRF ──────────────────────────

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ─── Auth ──────────────────────────────────────────────────

export interface Perfil {
  id: number;
  rol: "admin" | "rrhh" | "manager" | "empleado";
  rol_display: string;
  telefono: string;
  cargo: string;
}

export interface Usuario {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  nombre_completo: string;
  is_active: boolean;
  is_staff: boolean;
  perfil: Perfil;
  last_login: string | null;
  date_joined: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  usuario: Usuario;
}

export interface Cargo {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  salario_min: string | null;
  salario_max: string | null;
  activo: boolean;
  empleados_count: number;
}

export interface CargoSimple {
  id: number;
  codigo: string;
  nombre: string;
}

export interface DepartamentoSimple {
  id: number;
  codigo: string;
  nombre: string;
}


// ─── Empleados ─────────────────────────────────────────────

export interface Empleado {
  id: number;
  numero_empleado: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  nombre_completo: string;
  email: string;
  telefono: string;
  fecha_ingreso: string;
  salario_base: string;
  estatus: "activo" | "baja" | "licencia" | "vacaciones";
  created_at: string;
  updated_at: string;
  cargo: CargoSimple | null;
  cargo_id?: number | null;
  departamento: DepartamentoSimple | null;      // ← NUEVO
  departamento_id?: number | null;               // ← NUEVO
}

export interface EmpleadoList {
  id: number;
  numero_empleado: string;
  nombre_completo: string;
  email: string;
  telefono: string;
  fecha_ingreso: string;
  salario_base: string;
  estatus: string;
  cargo: CargoSimple | null;
}

export interface EmpleadoEstadisticas {
  total: number;
  activos: number;
  bajas: number;
  licencias: number;
}

// ─── Departamentos ─────────────────────────────────────────

export interface Departamento {
  id: number;
  codigo: string;
  nombre: string;
  presupuesto_anual: string;
  activo: boolean;
  empleados_count: number;
}

// ─── Errores de la API ─────────────────────────────────────

export interface ApiError {
  detail?: string;
  [key: string]: unknown;
}

export interface EmpleadoEstadisticas {
  total: number;
  activos: number;
  bajas: number;
  licencias: number;
}