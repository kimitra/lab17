import NextAuth from "next-auth";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import prisma from "@/app/lib/prisma";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
  Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      try {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.email,
        };
      } catch (error) {
        console.error("Authorization error:", error);
        return null;
      }
    },
  }),

  {
  id: "github",
  name: "GitHub",
  type: "oauth",
  authorization: {
    url: "https://github.com/login/oauth/authorize",
    params: { scope: "read:user user:email" },
  },
  token: "https://github.com/login/oauth/access_token",
  userinfo: "https://api.github.com/user",
  clientId: process.env.AUTH_GITHUB_ID,
  clientSecret: process.env.AUTH_GITHUB_SECRET,
  profile(profile) {
    return {
      id: String(profile.id),
      name: profile.name ?? profile.login,
      email: profile.email,
      image: profile.avatar_url,
    };
  },
},

  Google({}),
],

  session: {
    strategy: "jwt",
  },

  secret: process.env.AUTH_SECRET,
  trustHost: true,

  pages: {
    signIn: "/auth/signin",
  },

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;

      const isProtectedRoute =
        path.startsWith("/add-profile") ||
        (path.startsWith("/profile/") && path.endsWith("/edit"));

      if (isProtectedRoute && !isLoggedIn) {
        return false;
      }

      return true;
    },

    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "github") {
  if (!user?.email) {
    console.error(`${account.provider} user has no email`);
    return false;
  }

        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email,
              password: null,
            },
          });
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || token.id;
        token.email = user.email || token.email;
        token.name = user.name || token.name;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
  },
});