import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcryptjs from "bcryptjs";
import { connectDB } from "@/lib/connectDB";
import User from "@/app/models/user";
import {
  createUserWithUniqueReferralCode,
  ensureUserReferralCode,
} from "@/lib/referral";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          await connectDB();
          let user = await User.findOne({ email: credentials.email }).lean();

          if (!user || !user.hashedPassword) return null;

          if (!user.referralCode) {
            await ensureUserReferralCode(user._id);
            user = await User.findById(user._id).lean();
          }

          const isPasswordValid = await bcryptjs.compare(
            credentials.password,
            user.hashedPassword
          );

          if (!isPasswordValid) return null;

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            coinBalance: user.coinBalance,
            isPremium: user.isPremium,
            isOnboarded: user.isOnboarded,
            pfp_url: user.pfp_url || null,
          };
        } catch (error) {
          console.error("Credentials auth error:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.coinBalance = user.coinBalance;
        token.isPremium = user.isPremium;
        token.isOnboarded = user.isOnboarded;
        token.pfp_url = user.pfp_url || null;
      } else if (token?.id) {
        try {
          await connectDB();
          const dbUser = await User.findById(token.id).lean();
          if (dbUser) {
            token.email = dbUser.email;
            token.name = dbUser.name;
            token.role = dbUser.role;
            token.coinBalance = dbUser.coinBalance;
            token.isPremium = dbUser.isPremium;
            token.isOnboarded = dbUser.isOnboarded;
            token.pfp_url = dbUser.pfp_url || null;
          }
        } catch (error) {
          console.error("JWT error:", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.role = token.role;
        session.user.coinBalance = token.coinBalance;
        session.user.isPremium = token.isPremium;
        session.user.isOnboarded = token.isOnboarded;
        session.user.pfp_url = token.pfp_url;
      }

      return session;
    },

    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          if (!profile?.email) return false;

          await connectDB();
          let existingUser = await User.findOne({ email: profile.email });

          if (!existingUser) {
            const hashedPassword = await bcryptjs.hash(
              Math.random().toString(36),
              10
            );

            existingUser = await createUserWithUniqueReferralCode({
              email: profile.email,
              name: profile.name || profile.email.split("@")[0],
              hashedPassword,
              coinBalance: 0,
              role: "user",
              pfp_url: profile.image || null,
              createdAt: new Date(),
            });

            user.id = existingUser._id.toString();
            user.coinBalance = existingUser.coinBalance;
            user.role = existingUser.role;
            user.isPremium = existingUser.isPremium;
            user.isOnboarded = existingUser.isOnboarded;
            user.pfp_url = existingUser.pfp_url || null;
          } else {
            if (!existingUser.referralCode) {
              await ensureUserReferralCode(existingUser._id);
              existingUser = await User.findById(existingUser._id);
            }

            user.id = existingUser._id.toString();
            user.coinBalance = existingUser.coinBalance;
            user.role = existingUser.role;
            user.isPremium = existingUser.isPremium;
            user.isOnboarded = existingUser.isOnboarded;
            user.pfp_url = existingUser.pfp_url || profile.image || null;
          }

          return true;
        } catch (error) {
          console.error("Google sign-in error:", error);
          return false;
        }
      }

      return true;
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
};
