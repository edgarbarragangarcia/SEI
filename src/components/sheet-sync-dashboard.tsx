"use client";

import { useState } from "react";
import Papa from "papaparse";
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
import { Input } from "@/components/ui/input";
import { Table2, RefreshCw, Save } from "lucide-react";

const TableSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
  </div>
);

// The user already published the sheet, so we can use the public CSV URL.
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRAgbsDii4x9lUmhkhjqwkgj9jx8MiWndXbWSn3H9co/pub?gid=1247634128&single=true&output=csv";

export function SheetSyncDashboard() {
  const [isFetching, setIsFetching] = useState(false);
  const [sheetData, setSheetData] = useState<Record<string, any>[] | null>(
    null
  );
  const [tableHeaders, setTableHeaders] = useState<string[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleFetchData = async () => {
    setIsFetching(true);
    setSheetData(null);
    setTableHeaders([]);

    try {
      const response = await fetch(SHEET_URL);
      if (!response.ok) {
        throw new Error(`Error fetching CSV: ${response.statusText}`);
      }
      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          processAndSetData(results.data as Record<string, any>[]);
          toast({
            title: "¡Éxito!",
            description: "Los datos de tu hoja se han cargado.",
            className:
              "bg-accent text-accent-foreground border-green-300 dark:border-green-700",
          });
          setIsFetching(false);
        },
        error: (error: any) => {
          throw new Error(`Error parsing CSV: ${error.message}`);
        }
      });
    } catch (error: any) {
      toast({
        title: "Error al obtener los datos",
        description: error.message,
        variant: "destructive",
      });
      setIsFetching(false);
    }
  };

  const filterDataBySucursal = (data: Record<string, any>[]) => {
    if (!user || !user.sucursal || user.role === 'Admin' || data.length === 0) {
      return data;
    }
  
    const sucursalHeader = Object.keys(data[0] || {}).find(
      (header) => header.trim().toLowerCase() === 'sucursal'
    );
  
    if (!sucursalHeader) {
      toast({
        title: "Advertencia de filtro",
        description: "No se encontró la columna 'Sucursal' en los datos. Mostrando todos los resultados.",
        variant: "default",
      });
      return data;
    }
  
    const userSucursal = user.sucursal.trim().toLowerCase();
    
    return data.filter(row => {
      const rowSucursal = row[sucursalHeader];
      return rowSucursal && typeof rowSucursal === 'string' && rowSucursal.trim().toLowerCase() === userSucursal;
    });
  };

  const processAndSetData = (data: Record<string, any>[]) => {
    const filteredData = filterDataBySucursal(data);
    const columnsToShow = tableHeaders.length > 0 ? tableHeaders : Object.keys(filteredData[0] || {}).slice(0, 12);
    setSheetData(filteredData);
    if (filteredData.length > 0) {
      setTableHeaders(columnsToShow);
    } else if (data.length > 0) {
      setTableHeaders(Object.keys(data[0]).slice(0, 12));
    }
  };
  
  const handleInputChange = (value: string, rowIndex: number, header: string) => {
    if (!sheetData) return;
    const updatedData = [...sheetData];
    updatedData[rowIndex][header] = value;
    setSheetData(updatedData);
  };

  const handleSaveChanges = () => {
    // This functionality is disabled because publishing to web is read-only
    toast({
      title: "Función no disponible",
      description: "La edición no está disponible cuando se carga desde una URL pública.",
      variant: "destructive",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 w-full">
      <div className="space-y-8">
        <Card className="shadow-lg min-h-[400px]">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                <CardTitle>Datos de Inventario</CardTitle>
                <CardDescription>
                    {`Mostrando datos para ${
                    user?.role === "Admin" ? "todas las sucursales" : user?.sucursal
                    }. Carga rápida desde CSV.`}
                </CardDescription>
                </div>
                <div className="flex gap-2">
                <Button onClick={handleFetchData} disabled={isFetching}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
                    Consultar Datos
                </Button>
                <Button onClick={handleSaveChanges} disabled={true}>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios
                </Button>
                </div>
            </div>
          </CardHeader>
          <CardContent>
            {isFetching ? (
              <TableSkeleton />
            ) : sheetData ? (
              sheetData.length > 0 ? (
                <div className="relative w-full overflow-auto rounded-md border" style={{maxHeight: "60vh"}}>
                  <Table>
                    <TableHeader className="sticky top-0 bg-card">
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
                            <TableCell key={`${rowIndex}-${header}`} className="p-1">
                              <Input
                                type="text"
                                value={row[header] || ""}
                                onChange={(e) => handleInputChange(e.target.value, rowIndex, header)}
                                className="w-full h-8 border-transparent hover:border-input focus:border-ring"
                                readOnly // Cells are read-only with this method
                              />
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
