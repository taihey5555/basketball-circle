'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Practice = {
  id: string
  title: string
  date: string
  location: string
}

export default function DashboardPage() {
  const [practices, setPractices] = useState<Practice[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetch = async () => {
      const { data: session } = await supabase.auth.getUser()
      const userId = session.user?.id

      if (!userId) {
        router.push('/login')
        return
      }

      const { data } = await supabase
        .from('practices')
        .select('*')
        .contains('participants', [userId])
        .order('date', { ascending: true })

      if (data) setPractices(data)
    }

    fetch()
  }, [router])

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">あなたの予約一覧</h1>
      {practices.length === 0 ? (
        <p>現在予約している予定はありません。</p>
      ) : (
        <ul className="space-y-4">
          {practices.map((p) => (
            <li key={p.id} className="border p-4 rounded bg-white">
              <p className="font-semibold">{p.title}</p>
              <p>📅 {p.date}</p>
              <p>📍 {p.location}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
