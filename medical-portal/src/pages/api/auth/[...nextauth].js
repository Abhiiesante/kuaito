import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import AzureADProvider from 'next-auth/providers/azure-ad';
import mongoose from 'mongoose';
import User from '../../../models/User'; // Update based on your structure

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Connect to MongoDB
      if (!mongoose.connection.readyState) {
        await mongoose.connect("mongodb+srv://Abhiram:Christmastree03@cluster0.8pxdr.mongodb.net/medical-portal?retryWrites=true&w=majority");
      }

      // Check if user exists
      const existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        const role =
          account.provider === 'google' && user.email.endsWith('@medicaldomain.com')
            ? 'doctor'
            : 'patient';

        // Create new user with role and tokens
        await User.create({
          name: user.name,
          email: user.email,
          role,
          provider: account.provider,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
        });
      }

      return true; // Allow sign-in
    },
    async session({ session }) {
      // Add user role to the session
      const userData = await User.findOne({ email: session.user.email });
      if (userData) {
        session.user.role = userData.role;
        session.user.email = userData.email;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to quiz page after registration
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/quiz/patient-details`;
      }
      return baseUrl;
    },
  },
});
