
'use server';

import Papa from 'papaparse';

export async function getSheetData(csvUrl: string) {
  try {
    const response = await fetch(csvUrl);
    if (!response.ok) {
      return { error: `Error fetching CSV: ${response.statusText}` };
    }

    const csvText = await response.text();
    
    return new Promise((resolve) => {
        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                resolve({ data: results.data });
            },
            error: (error: any) => {
                resolve({ error: `Error parsing CSV: ${error.message}` });
            }
        });
    });

  } catch (error: any) {
    console.error("Error fetching or parsing sheet data:", error);
    return { error: `An unexpected error occurred: ${error.message}` };
  }
}
