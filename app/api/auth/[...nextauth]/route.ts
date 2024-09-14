import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import User from '@/app/models/User'
import dbConnect from '@/lib/dbConnect'
import { Session } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();
        if (!credentials?.username || !credentials?.password) {
          throw new Error('ユーザー名とパスワードを入力してください');
        }
        const user = await User.findOne({ username: credentials.username });
        if (!user) {
          throw new Error('ユーザーが見つかりません');
        }
        const isMatch = await user.matchPassword(credentials.password);
        if (!isMatch) {
          throw new Error('パスワードが一致しません');
        }
        return { id: user._id, name: user.username, email: user.email };
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
})

export { handler as GET, handler as POST }