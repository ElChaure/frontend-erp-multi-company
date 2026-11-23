import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6">
      <div className="text-center max-w-md">
        <div className="mb-6 text-8xl font-bold text-blue-600">404</div>
        <h1 className="mb-2 text-2xl font-bold text-slate-900">
          Página no encontrada
        </h1>
        <p className="mb-8 text-slate-600">
          La ruta que buscas no existe o fue movida.
        </p>
        <Button asChild>
          <Link href="/dashboard">Ir al dashboard</Link>
        </Button>
      </div>
    </div>
  );
}