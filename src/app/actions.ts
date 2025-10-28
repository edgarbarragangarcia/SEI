
'use server';

const mockData = [
    {
      "ProductID": "P001",
      "ProductName": "Laptop",
      "Category": "Electronics",
      "Price": 1200,
      "Stock": 50,
      "Supplier": "Supplier A"
    },
    {
      "ProductID": "P002",
      "ProductName": "Smartphone",
      "Category": "Electronics",
      "Price": 800,
      "Stock": 150,
      "Supplier": "Supplier B"
    },
    {
      "ProductID": "P003",
      "ProductName": "Office Chair",
      "Category": "Furniture",
      "Price": 150,
      "Stock": 300,
      "Supplier": "Supplier C"
    },
    {
      "ProductID": "P004",
      "ProductName": "Desk Lamp",
      "Category": "Furniture",
      "Price": 45,
      "Stock": 500,
      "Supplier": "Supplier D"
    },
    {
      "ProductID": "P005",
      "ProductName": "Notebook",
      "Category": "Stationery",
      "Price": 5,
      "Stock": 1000,
      "Supplier": "Supplier E"
    }
  ];

export async function getSheetData(sheetUrl: string) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (!sheetUrl.includes('docs.google.com/spreadsheets')) {
      return { error: 'Invalid Google Sheet URL. Please provide a valid URL.' };
    }
    
    return { data: mockData };

  } catch (error) {
    console.error("Error fetching sheet data:", error);
    return { error: 'An unexpected error occurred while fetching data.' };
  }
}
