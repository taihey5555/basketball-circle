'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        const { data } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        if (data?.role) {
          setRole(data.role)
        }
      }
    }

    fetchUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-800">
          Basketball Circle
        </Link>
        <button
          className="sm:hidden text-gray-800"
          onClick={toggleMenu}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
        <nav className="hidden sm:flex gap-6 text-sm font-medium">
          {!userId && (
            <>
              <Link href="/signup" className="text-blue-600 hover:underline">サインアップ</Link>
              <Link href="/login" className="text-blue-600 hover:underline">ログイン</Link>
            </>
          )}
          {userId && (
            <>
              <Link href="/dashboard" className="text-blue-600 hover:underline">予約一覧</Link>
              {role === 'admin' && (
                <>
                  <Link href="/admin" className="text-blue-600 hover:underline">日程登録</Link>
                  <Link href="/admin/users" className="text-blue-600 hover:underline">権限管理</Link>
                </>
              )}
              <button onClick={handleLogout} className="text-red-500 hover:underline">ログアウト</button>
            </>
          )}
        </nav>
      </div>

      {/* モバイル用メニュー */}
      {menuOpen && (
        <div className="sm:hidden px-4 pb-4 space-y-2 text-sm">
          {!userId && (
            <>
              <Link href="/signup" className="block text-blue-600 hover:underline">サインアップ</Link>
              <Link href="/login" className="block text-blue-600 hover:underline">ログイン</Link>
            </>
          )}
          {userId && (
            <>
              <Link href="/dashboard" className="block text-blue-600 hover:underline">予約一覧</Link>
              {role === 'admin' && (
                <>
                  <Link href="/admin" className="block text-blue-600 hover:underline">日程登録</Link>
                  <Link href="/admin/users" className="block text-blue-600 hover:underline">権限管理</Link>
                </>
              )}
              <button onClick={handleLogout} className="block text-red-500 hover:underline">ログアウト</button>
            </>
          )}
        </div>
      )}
    </header>
  )
}
