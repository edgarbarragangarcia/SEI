
'use server';

const mockData = [
    {
      "User ID": "USR-001",
      "Name": "Alex Johnson",
      "Email": "alex.j@example.com",
      "Subscription": "Premium",
      "Join Date": "2023-01-15",
      "Status": "Active"
    },
    {
      "User ID": "USR-002",
      "Name": "Maria Garcia",
      "Email": "maria.g@example.com",
      "Subscription": "Basic",
      "Join Date": "2023-02-20",
      "Status": "Active"
    },
    {
      "User ID": "USR-003",
      "Name": "Chen Wei",
      "Email": "chen.w@example.com",
      "Subscription": "Free",
      "Join Date": "2023-03-10",
      "Status": "Inactive"
    },
    {
      "User ID": "USR-004",
      "Name": "Fatima Al-Fassi",
      "Email": "fatima.a@example.com",
      "Subscription": "Premium",
      "Join Date": "2023-04-05",
      "Status": "Active"
    },
    {
      "User ID": "USR-005",
      "Name": "David Smith",
      "Email": "david.s@example.com",
      "Subscription": "Basic",
      "Join Date": "2023-05-21",
      "Status": "On Hold"
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
