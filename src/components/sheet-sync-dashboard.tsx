"use client";

import { useState, useEffect } from "react";
import { getSheetData } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Table2 } from "lucide-react";

const sucursalMapping: { [key: string]: string } = {
  "Supplier A": "AGUASCALIENTES",
  "Supplier B": "TOLUCA",
  "Supplier C": "CIUDAD DE MEXICO",
  "Supplier D": "GUADALAJARA",
  "Supplier E": "HERMOSILLO",
  "Supplier F": "MONTERREY",
  "Supplier G": "TIJUANA",
};

const TableSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
  </div>
);

export function SheetSyncDashboard() {
  const [isFetching, setIsFetching] = useState(true);
  const [sheetData, setSheetData] = useState<Record<string, any>[] | null>(
    null
  );
  const [tableHeaders, setTableHeaders] = useState<string[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchInitialData() {
      const sheetUrl = "https://docs.google.com/spreadsheets/d/1sRAgbsDii4x9lUmhkhjqwkgj9jx8MiWndXbWSn3H9co/edit?gid=0#gid=0";
      
      setIsFetching(true);
      setSheetData(null);
      setTableHeaders([]);

      const result = await getSheetData(sheetUrl);

      if (result.error) {
        toast({
          title: "Error al obtener los datos",
          description: result.error,
          variant: "destructive",
        });
      } else if (result.data) {
        processAndSetData(result.data);
        toast({
          title: "¡Éxito!",
          description: "Los datos de tu hoja se han cargado.",
          className:
            "bg-accent text-accent-foreground border-green-300 dark:border-green-700",
        });
      }
      setIsFetching(false);
    }

    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterDataBySucursal = (data: Record<string, any>[]) => {
    if (!user || !user.sucursal || user.role === 'Admin') {
      return data;
    }
    const filteredData = data.filter(row => {
      // Assuming there is a column that can be mapped to a sucursal
      // This part is highly dependent on the actual data structure
      // We'll use the sucursalMapping as an example
      const sucursalKey = Object.keys(sucursalMapping).find(key => sucursalMapping[key] === user.sucursal);
      if (sucursalKey && row.Supplier === sucursalKey) {
        return true;
      }
      // Fallback for direct sucursal name match
      if (row.Sucursal === user.sucursal || row.sucursal === user.sucursal) {
        return true;
      }
      return false;
    });

    return filteredData;
  };

  const processAndSetData = (data: Record<string, any>[]) => {
    const filteredData = filterDataBySucursal(data);
    setSheetData(filteredData);
    if (filteredData.length > 0) {
      setTableHeaders(Object.keys(filteredData[0]));
    } else if (data.length > 0) {
      // If filtering results in empty data, still show headers from original data
      setTableHeaders(Object.keys(data[0]));
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 w-full">
      <div className="space-y-8">
        <Card className="shadow-lg min-h-[400px]">
          <CardHeader>
            <CardTitle>Datos de Inventario</CardTitle>
            <CardDescription>
              {`Mostrando datos para ${
                user?.role === "Admin" ? "todas las sucursales" : user?.sucursal
              }.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isFetching ? (
              <TableSkeleton />
            ) : sheetData ? (
              sheetData.length > 0 ? (
                <div className="relative w-full overflow-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {tableHeaders.map((header) => (
                          <TableHead key={header}>{header}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sheetData.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {tableHeaders.map((header) => (
                            <TableCell key={`${rowIndex}-${header}`}>
                              {row[header]}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-10">
                  No hay datos disponibles para tu sucursal o el archivo está
                  vacío.
                </p>
              )
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-10">
                <Table2 className="h-12 w-12 mb-4" />
                <p className="font-semibold">
                  Los datos de tu hoja de cálculo aparecerán aquí.
                </p>
                <p className="text-sm">
                  Cargando datos automáticamente...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
