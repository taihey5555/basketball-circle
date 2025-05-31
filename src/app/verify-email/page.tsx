'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation' // ← これが必要！

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('確認中...')

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      setStatus('無効なトークンです。')
      return
    }

    // 任意: tokenをSupabaseで確認してセッション生成など
    // router.push('/dashboard') などに飛ばしてもよい
    setStatus('メール確認が完了しました！')
  }, [searchParams]) // ← 依存に searchParams を入れるのも推奨されます

  return (
    <div className="p-8 text-center">
      <h1 className="text-xl">{status}</h1>
    </div>
  )
}
