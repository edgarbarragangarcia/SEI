import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const spreadsheetId = '1sRAgbsDii4x9lUmhkhjqwkgj9jx8MiWndXbWSn3H9co';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        const userEmail = session.user.email;
        const userName = session.user.name;
        const usersSheetName = 'Users';
        let userRole: string;
        let userSucursal: string;

        try {
          const sheetInfo = await sheets.spreadsheets.get({ spreadsheetId });
          const sheetExists = sheetInfo.data.sheets?.some(s => s.properties?.title === usersSheetName);

          if (!sheetExists) {
            await sheets.spreadsheets.batchUpdate({
              spreadsheetId,
              requestBody: { requests: [{ addSheet: { properties: { title: usersSheetName } } }] }
            });
            await sheets.spreadsheets.values.update({
              spreadsheetId,
              range: `${usersSheetName}!A1:D1`,
              valueInputOption: 'RAW',
              requestBody: { values: [['Email', 'Name', 'Role', 'Sucursal']] }
            });
          }

          const usersResponse = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${usersSheetName}!A:D` });
          const users = usersResponse.data.values || [];
          const userRowIndex = users.findIndex(row => row[0] === userEmail);
          const userRow = userRowIndex !== -1 ? users[userRowIndex] : null;

          if (userEmail === 'eabarragang@ingenes.com') {
            userRole = 'Admin';
            userSucursal = 'MONTERREY';
            if (userRow) {
              if (userRow[2] !== 'Admin' || userRow[3] !== 'MONTERREY') {
                await sheets.spreadsheets.values.update({
                  spreadsheetId,
                  range: `${usersSheetName}!C${userRowIndex + 1}:D${userRowIndex + 1}`,
                  valueInputOption: 'RAW',
                  requestBody: { values: [[userRole, userSucursal]] }
                });
              }
            } else {
              await sheets.spreadsheets.values.append({
                spreadsheetId,
                range: usersSheetName,
                valueInputOption: 'RAW',
                requestBody: { values: [[userEmail, userName, userRole, userSucursal]] }
              });
            }
          } else {
            if (userRow) {
              userRole = userRow[2] || 'User';
              userSucursal = userRow[3] || 'Desconocida';
            } else {
              userRole = 'User';
              userSucursal = 'Desconocida';
              await sheets.spreadsheets.values.append({
                spreadsheetId,
                range: usersSheetName,
                valueInputOption: 'RAW',
                requestBody: { values: [[userEmail, userName, userRole, userSucursal]] }
              });
            }
          }
        } catch (error) {
          console.error("Error managing user sheet:", error);
          userRole = (userEmail === 'eabarragang@ingenes.com') ? 'Admin' : 'User';
          userSucursal = (userEmail === 'eabarragang@ingenes.com') ? 'Todas' : 'Desconocida';
        }
        
        (session.user as any).role = userRole;
        (session.user as any).sucursal = userSucursal;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }
