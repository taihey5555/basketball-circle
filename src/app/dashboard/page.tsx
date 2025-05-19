'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data?.user) {
        router.push('/login') // 未ログインならリダイレクト
      } else {
        setUserEmail(data.user.email)
      }
    }

    getUser()
  }, [])

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">マイページ</h1>
      {userEmail ? (
        <>
          <p className="mb-4">ログイン中: {userEmail}</p>
          <a href="/logout" className="text-blue-600 underline">ログアウト</a>
        </>
      ) : (
        <p>読み込み中...</p>
      )}
    </div>
  )
}
