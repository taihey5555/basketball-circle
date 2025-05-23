'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Practice = {
  id: string
  title: string
  date: string
  location: string
  level: string
  image_url?: string
  capacity?: number
  fee?: number   // ← これを追加！
}

export default function AdminPracticePage() {
  const router = useRouter()
  const [practices, setPractices] = useState<Practice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const checkAdminAndFetch = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || profile.role !== 'admin') {
        router.push('/login')
        return
      }

      const { data, error } = await supabase.from('practices').select('*').order('date')
      if (error) setMessage(error.message)
      if (data) setPractices(data)

      setIsLoading(false)
    }

    checkAdminAndFetch()
  }, [router])

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('practices').delete().eq('id', id)
    if (error) {
      setMessage(`削除エラー: ${error.message}`)
    } else {
      setPractices((prev) => prev.filter((p) => p.id !== id))
      setMessage('削除しました')
    }
  }

  if (isLoading) return <p className="p-6">読み込み中...</p>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">投稿管理（削除）</h1>
      {message && <p className="text-green-600 mb-4">{message}</p>}

      {practices.map((p) => (
        <div key={p.id} className="border p-4 mb-4 rounded">
          <h2 className="text-xl font-semibold">{p.title}</h2>
          <p>📅 {p.date}</p>
          <p>📍 {p.location}</p>
          <p>🏷 {p.level}</p>
          <p>💰 参加費: {p.fee ? `${p.fee}円` : '未設定'}</p>
          <button
             onClick={() => router.push(`/admin/edit/${p.id}`)}
             className="ml-2 bg-yellow-500 text-white px-3 py-1 rounded"
            >
            編集
        </button>

          <button
            onClick={() => handleDelete(p.id)}
            className="mt-2 bg-red-600 text-white px-4 py-1 rounded"
          >
            削除
          </button>
        </div>
      ))}
    </div>
  )
}
