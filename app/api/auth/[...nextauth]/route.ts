import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // ここで認証ロジックを実装します
        // 例: データベースでユーザーを検索し、パスワードを検証する
        const user = { id: "1", name: 'J Smith', email: 'jsmith@example.com' }
        if (user) {
          return user
        } else {
          return null
        }
      }
    })
  ],
  // 必要に応じて追加の設定を行います
})

export { handler as GET, handler as POST }