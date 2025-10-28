"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

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

export function SheetSyncDashboard() {
  const [isFetching, setIsFetching] = useState(false);
  const [sheetData, setSheetData] = useState<Record<string, any>[] | null>(
    null
  );
  const [tableHeaders, setTableHeaders] = useState<string[]>([]);
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const user = session?.user;
  const [editedCells, setEditedCells] = useState<Record<string, any>>({});

  const handleFetchData = async () => {
    setIsFetching(true);
    setSheetData(null);
    setTableHeaders([]);

    try {
      const response = await fetch('/api/sheets');
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
      const data = await response.json();
      
      if (data && data.length > 0) {
        let headers = data[0];
        const rows = data.slice(1).map((row: any) => {
          const rowData: Record<string, any> = {};
          row.forEach((cell: any, index: number) => {
            if (index < headers.length) {
              rowData[headers[index]] = cell;
            } else {
              // Handle rows that are longer than the header row
              const newHeader = `Column ${index + 1}`;
              if (!headers.includes(newHeader)) {
                headers.push(newHeader);
              }
              rowData[newHeader] = cell;
            }
          });
          return rowData;
        });
        processAndSetData(rows);
      } else {
        toast({
          title: "No se encontraron datos",
          description: "La hoja de cálculo parece estar vacía.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error al obtener los datos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      handleFetchData();
    }
  }, [status]);
  
  const processAndSetData = (data: Record<string, any>[]) => {
    if (data.length > 0) {
      const allHeaders = Object.keys(data[0]);
      setTableHeaders(allHeaders);
      const filteredData = filterDataBySucursal(data, allHeaders);
      setSheetData(filteredData);
    } else {
      setSheetData([]);
      setTableHeaders([]);
    }
  };

  const filterDataBySucursal = (data: Record<string, any>[], headers: string[]) => {
    if (!user || !user.sucursal || user.role === 'Admin' || data.length === 0) {
      return data;
    }
  
    const sucursalHeader = headers.find(
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
  
  const handleInputChange = (value: string, rowIndex: number, header: string) => {
    if (!sheetData) return;
    const updatedData = [...sheetData];
    updatedData[rowIndex][header] = value;
    setSheetData(updatedData);

    const cellKey = `${rowIndex + 2}`; // +2 because sheet rows are 1-indexed and we have a header
    setEditedCells({
      ...editedCells,
      [cellKey]: {
        ...editedCells[cellKey],
        [header]: value,
      },
    });
  };

  const handleSaveChanges = async () => {
    if (Object.keys(editedCells).length === 0) {
      toast({
        title: "No hay cambios",
        description: "No has modificado ningún dato.",
      });
      return;
    }

    try {
      const response = await fetch('/api/sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates: editedCells }),
      });

      if (!response.ok) {
        throw new Error('Failed to save changes');
      }

      toast({
        title: "¡Éxito!",
        description: "Tus cambios se han guardado correctamente.",
      });
      setEditedCells({});
    } catch (error: any) {
      toast({
        title: "Error al guardar",
        description: error.message,
        variant: "destructive",
      });
    }
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
                <Button onClick={handleSaveChanges}>
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
