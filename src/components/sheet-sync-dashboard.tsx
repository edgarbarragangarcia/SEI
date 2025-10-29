import SheetData from './sheet-data';

export function SheetSyncDashboard() {
  return (
    <div className="w-full max-w-6xl p-4 md:p-8">
      <h2 className="text-2xl font-bold">Inventory Data</h2>
      <p className="text-muted-foreground mb-4">
        Displaying data from your connected Google Sheet.
      </p>
      <SheetData displayAs="table" />
    </div>
  );
}
