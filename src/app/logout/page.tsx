'use client'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function LogoutPage() {
  useEffect(() => {
    const logout = async () => {
      await supabase.auth.signOut()
      location.href = '/'  // 🔁 強制リロード付きのトップリダイレクト
    }

    logout()
  }, [])

  return (
    <p className="p-8 text-center">ログアウト中...</p>
  )
}
