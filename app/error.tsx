"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center px-6">
      <div className="rounded-full bg-red-50 p-4 mb-4">
        <AlertTriangle className="h-8 w-8 text-red-600" />
      </div>
      <h2 className="text-lg font-semibold text-slate-900">
        Algo salió mal
      </h2>
      <p className="mt-1 text-sm text-slate-500 max-w-md text-center">
        {error.message || "Ocurrió un error inesperado."}
      </p>
      <Button onClick={reset} className="mt-6">
        Reintentar
      </Button>
    </div>
  );
}