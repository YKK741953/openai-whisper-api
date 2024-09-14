'use client'

import { useSession } from "next-auth/react"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login')
    }
  }, [status, router])

  return (
    <div>
      <h1>ホームページ</h1>
      <p>セッションステータス: {status}</p>
      {session ? (
        <div>
          <p>ログイン中のユーザー: {session.user?.name}</p>
          <p>ユーザーメール: {session.user?.email}</p>
        </div>
      ) : (
        <p>ログインしていません</p>
      )}
    </div>
  )
}
