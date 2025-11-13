import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { google } from 'googleapis';

// Helper to refresh access tokens using Google's OAuth2 client
async function refreshAccessToken(token: any) {
  try {
    console.log('Refreshing access token for user...');
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oAuth2Client.setCredentials({ refresh_token: token.refreshToken || token.refresh_token });

    // getAccessToken will attempt to refresh when refresh_token is present
    const newTokenResponse = await oAuth2Client.getAccessToken();
    const newAccessToken = newTokenResponse && (newTokenResponse as any).token ? (newTokenResponse as any).token : (newTokenResponse as any);

    if (!newAccessToken) {
      throw new Error('Could not refresh access token');
    }

    // Note: Google doesn't always return a new refresh token. Preserve the old one.
    return {
      ...token,
      accessToken: newAccessToken,
      accessTokenExpires: Date.now() + 60 * 60 * 1000, // 1 hour from now
      refreshToken: token.refreshToken || token.refresh_token,
      error: undefined,
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: [
            'openid',
            'email',
            'profile',
            'https://www.googleapis.com/auth/calendar.events',
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/userinfo.email',
          ].join(' '),
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // If the URL starts with /, it's a relative URL so it's safe to return
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs that use the same origin
      else if (new URL(url).origin === baseUrl) return url;
      // Otherwise, redirect to dashboard after successful login
      return `${baseUrl}/dashboard`;
    },
    // Persist tokens to the JWT so server-side APIs can use them
    async jwt({ token, account, user }: { token: any; account: any; user: any }) {
      // Initial sign-in
      if (account && user) {
        console.log('JWT callback - new sign in:', {
          hasAccessToken: !!account.access_token,
          hasRefreshToken: !!account.refresh_token,
          scope: account.scope
        });
        
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at ? account.expires_at * 1000 : Date.now() + 3600 * 1000,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires || 0)) {
        return token;
      }

      // Access token has expired — attempt to refresh it using the refresh token
      console.log('JWT: Token expired, attempting refresh');
      const refreshed = await refreshAccessToken(token as any);
      return refreshed;
    },
    async session({ session, token }: { session: any, token: any }) {
      if (session.user) {
        // Add the tokens to the session so they're available to the client
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        
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
            // Ensure this account is treated as Admin, but do NOT overwrite an existing sucursal
            // if the admin manually changed it via the Admin UI. Only set defaults when missing.
            userRole = 'Admin';
            if (userRow) {
              // Preserve sucursal from sheet if present; fallback to MONTERREY
              userSucursal = userRow[3] || 'MONTERREY';

              // If the role in sheet is not Admin, update only the role column (C) to Admin
              if (userRow[2] !== 'Admin') {
                try {
                  await sheets.spreadsheets.values.update({
                    spreadsheetId,
                    range: `${usersSheetName}!C${userRowIndex + 1}:C${userRowIndex + 1}`,
                    valueInputOption: 'RAW',
                    requestBody: { values: [[userRole]] }
                  });
                } catch (err) {
                  console.warn('Failed to update role for admin user:', err);
                }
              }
            } else {
              // No row exists: create one with default sucursal MONTERREY
              userSucursal = 'MONTERREY';
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
        // expose tokens in session on server-side only
        (session as any).accessToken = (token as any).accessToken;
        (session as any).refreshToken = (token as any).refreshToken;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }
