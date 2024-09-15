'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import LogoutButton from "@/components/LogoutButton"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login')
    } else if (status === "authenticated") {
      setShowWelcome(true)
      setTimeout(() => setShowWelcome(false), 3000)
    }
  }, [status, router])

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return (
    <div>
      {showWelcome && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">ようこそ！</strong>
          <span className="block sm:inline"> ログインに成功しました。</span>
        </div>
      )}
      <h1>ダッシュボード</h1>
      <p>ようこそ、{session?.user?.name}さん！</p>
      <LogoutButton />
      {/* ダッシュボードの内容 */}
    </div>
  )
}