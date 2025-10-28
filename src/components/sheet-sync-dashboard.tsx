"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getSheetData } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

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

const formSchema = z.object({
  sheetUrl: z.string().url({ message: "Please enter a valid Google Sheet URL." }),
});

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sheetUrl: "",
    },
  });

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
      setSheetData(result.data);
      if (result.data.length > 0) {
        setTableHeaders(Object.keys(result.data[0]));
      }
      toast({
        title: "Success!",
        description: "Your sheet data has been loaded.",
        className: "bg-accent text-accent-foreground border-green-300 dark:border-green-700",
      });
    }
    setIsFetching(false);
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 w-full">
      <div className="space-y-8">
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

        <Card className="shadow-lg min-h-[300px]">
          <CardHeader>
            <CardTitle>Sheet Data</CardTitle>
            <CardDescription>
              The data from your connected sheet is displayed below.
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
                  The sheet appears to be empty or data could not be parsed.
                </p>
              )
            ) : (
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-10">
                    <Table2 className="h-12 w-12 mb-4" />
                    <p className="font-semibold">Your data will appear here</p>
                    <p className="text-sm">Enter a sheet URL above to get started.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
