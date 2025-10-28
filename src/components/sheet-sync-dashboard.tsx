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
import { Button } from "@/components/ui/button";
import { Table2, RefreshCw } from "lucide-react";

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
  const [isFetching, setIsFetching] = useState(false);
  const [sheetData, setSheetData] = useState<Record<string, any>[] | null>(
    null
  );
  const [tableHeaders, setTableHeaders] = useState<string[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFetchData = async () => {
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
  };

  const filterDataBySucursal = (data: Record<string, any>[]) => {
    if (!user || !user.sucursal || user.role === 'Admin') {
      return data;
    }
  
    // Find the header for 'sucursal' case-insensitively
    const sucursalHeader = Object.keys(data[0] || {}).find(
      (header) => header.toLowerCase() === 'sucursal'
    );
  
    if (!sucursalHeader) {
      // If no 'sucursal' column is found, return no data for non-admins
      // or you could return all data if that's preferred.
      // Returning empty array to make it clear filtering is failing.
      return [];
    }
  
    const userSucursal = user.sucursal.toLowerCase();
    
    return data.filter(row => {
      const rowSucursal = row[sucursalHeader];
      return rowSucursal && typeof rowSucursal === 'string' && rowSucursal.toLowerCase() === userSucursal;
    });
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
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1.5">
              <CardTitle>Datos de Inventario</CardTitle>
              <CardDescription>
                {`Mostrando datos para ${
                  user?.role === "Admin" ? "todas las sucursales" : user?.sucursal
                }.`}
              </CardDescription>
            </div>
            <Button onClick={handleFetchData} disabled={isFetching}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              Consultar Datos
            </Button>
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
                  Presiona "Consultar Datos" para empezar.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
