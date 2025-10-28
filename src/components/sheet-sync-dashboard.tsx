"use client";

import { useState, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getSheetData } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Table2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  sheetUrl: z.string().url({ message: "Please enter a valid Google Sheet URL." }),
});

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
  const [isFetching, setIsFetching] = useState(false);
  const [sheetData, setSheetData] = useState<Record<string, any>[] | null>(null);
  const [tableHeaders, setTableHeaders] = useState<string[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sheetUrl: "",
    },
  });

  const filterDataBySucursal = (data: Record<string, any>[]) => {
    if (!user || !user.sucursal || user.role === 'Admin') {
      return data;
    }
    return data.filter(row => sucursalMapping[row.Supplier] === user.sucursal);
  }

  const processAndSetData = (data: Record<string, any>[]) => {
    const filteredData = filterDataBySucursal(data);
    setSheetData(filteredData);
    if (filteredData.length > 0) {
      setTableHeaders(Object.keys(filteredData[0]));
    } else {
       setTableHeaders(data.length > 0 ? Object.keys(data[0]) : []);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsFetching(true);
    setSheetData(null);
    setTableHeaders([]);

    const result = await getSheetData(values.sheetUrl);

    if (result.error) {
      toast({
        title: "Error fetching data",
        description: result.error,
        variant: "destructive",
      });
    } else if (result.data) {
      processAndSetData(result.data);
      toast({
        title: "Success!",
        description: "Your sheet data has been loaded.",
        className: "bg-accent text-accent-foreground border-green-300 dark:border-green-700",
      });
    }
    setIsFetching(false);
  }

  const handleCsvUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsFetching(true);
    setSheetData(null);
    setTableHeaders([]);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const rows = text.split('\n').filter(row => row.trim() !== '');
        if (rows.length === 0) {
          throw new Error("CSV file is empty.");
        }
        
        const headers = rows[0].split(',').map(h => h.trim());
        const data = rows.slice(1).map(row => {
          const values = row.split(',').map(v => v.trim());
          return headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
          }, {} as Record<string, any>);
        });

        processAndSetData(data);
        toast({
          title: "Success!",
          description: "Your CSV data has been loaded.",
          className: "bg-accent text-accent-foreground border-green-300 dark:border-green-700",
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during parsing.";
        toast({
          title: "Error parsing CSV",
          description: `Failed to parse CSV file. Please check the format. ${errorMessage}`,
          variant: "destructive",
        });
        setSheetData(null);
        setTableHeaders([]);
      } finally {
        setIsFetching(false);
      }
    };
    reader.onerror = () => {
        toast({
            title: "Error reading file",
            description: "Could not read the selected file.",
            variant: "destructive",
        });
        setIsFetching(false);
    }
    reader.readAsText(file);
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 w-full">
      <div className="space-y-8">
        <Tabs defaultValue="google-sheet" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="google-sheet">Google Sheet URL</TabsTrigger>
            <TabsTrigger value="csv-upload">Upload CSV</TabsTrigger>
          </TabsList>
          <TabsContent value="google-sheet">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Connect a Google Sheet</CardTitle>
                <CardDescription>
                  Paste the URL of your Google Sheet below to fetch and display its data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="sheetUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sheet URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://docs.google.com/spreadsheets/d/..." {...field} />
                          </FormControl>
                          <FormDescription>
                            Make sure your sheet is public or accessible to the service.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isFetching}>
                      {isFetching && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isFetching ? "Fetching Data..." : "Get Sheet Data"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="csv-upload">
            <Form {...form}>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Upload a CSV File</CardTitle>
                        <CardDescription>
                        Select a CSV file from your computer to load the data directly.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <FormItem>
                                <FormLabel>CSV File</FormLabel>
                                <FormControl>
                                    <Input id="csv-file" type="file" accept=".csv" onChange={handleCsvUpload} disabled={isFetching} />
                                </FormControl>
                                <FormDescription>
                                    The first row of the CSV should contain the headers.
                                </FormDescription>
                            </FormItem>
                        </div>
                    </CardContent>
                </Card>
            </Form>
          </TabsContent>
        </Tabs>

        <Card className="shadow-lg min-h-[300px]">
          <CardHeader>
            <CardTitle>Sheet Data</CardTitle>
            <CardDescription>
              {`Displaying data for ${user?.role === 'Admin' ? 'all branches' : user?.sucursal}.`}
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
                  No data available for your branch or the file is empty.
                </p>
              )
            ) : (
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-10">
                    <Table2 className="h-12 w-12 mb-4" />
                    <p className="font-semibold">Your data will appear here</p>
                    <p className="text-sm">Enter a sheet URL or upload a CSV to get started.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
