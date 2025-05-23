'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type Practice = {
  id: string
  title: string
  date: string
  location?: string
  level: string
  image_url?: string
  participants: string[]
  capacity?: number
  fee?: number
}


export default function HomePage() {
  const [practices, setPractices] = useState<Practice[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [userMap, setUserMap] = useState<Record<string, string>>({})
  const router = useRouter()

  // 認証済みユーザー取得（ログインしていなくてもOK）
  useEffect(() => {
    const getUser = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      setUserId(sessionData.session?.user.id || null)
    }
    getUser()
  }, [])

  // 投稿データとユーザーマップ取得
  useEffect(() => {
    const fetchData = async () => {
      const { data: practicesData } = await supabase.from('practices').select('*').order('date', { ascending: true })
      const { data: userProfiles } = await supabase.from('user_profiles').select('id, name')

      if (practicesData) setPractices(practicesData)
      if (userProfiles) {
        const map: Record<string, string> = {}
        userProfiles.forEach((u) => {
          map[u.id] = u.name
        })
        setUserMap(map)
      }
    }
    fetchData()
  }, [])

  const handleJoin = async (practiceId: string) => {
    if (!userId) return router.push('/login')
    await supabase.rpc('add_participant', { p_practice_id: practiceId, p_user_id: userId })
    location.reload()
  }

  const handleCancel = async (practiceId: string) => {
    if (!userId) return
    await supabase.rpc('remove_participant', { p_practice_id: practiceId, p_user_id: userId })
    location.reload()
  }

  // const handleLogout = async () => {
  //   await supabase.auth.signOut()
  //   router.push('/')
  //   router.refresh()
  // }

  return (
    <div className="bg-sky-50 min-h-screen">
      {/* ヘッダー */}
      

      {/* 本文 */}
      <main className="py-8 px-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">開催予定一覧</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {practices.map((p) => {
            const participants: string[] = p.participants || [] // ←ここ！
            const alreadyJoined = participants.includes(userId || '')
            const capacity = p.capacity || 0
            const isFull = capacity > 0 && participants.length >= capacity
            const remaining = capacity ? capacity - participants.length : null

            return (
              <div key={p.id} className="bg-white p-4 rounded-xl shadow">
                {p.image_url && (
                  <Image src={p.image_url} alt="施設画像" width={600} height={300} className="rounded mb-4" />
                )}
                <h2 className="text-lg font-bold text-gray-800">{p.title}</h2>
                <p className="text-sm text-gray-600">📅 {p.date}</p>
                <p className="text-sm text-gray-600">📍 {p.location}</p>
                <p className="text-sm text-gray-600">🏷️ {p.level}</p>
                {p.fee && <p className="text-sm text-gray-600">💰 参加費: {p.fee}円</p>}
                <p className="text-sm font-semibold mt-1 text-gray-700">
                  🙋‍♂️ {participants.length} / {capacity || '∞'}名
                </p>
                {remaining !== null && remaining <= 3 && !alreadyJoined && (
                  <p className="text-red-500 text-sm font-bold">⚠️ 満員間近！</p>
                )}

                {userId && (
                  <div className="mt-3">
                    {alreadyJoined ? (
                      <button
                        onClick={() => handleCancel(p.id)}
                        className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
                      >
                        キャンセルする
                      </button>
                    ) : (
                      !isFull && (
                        <button
                          onClick={() => handleJoin(p.id)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
                        >
                          参加する
                        </button>
                      )
                    )}
                  </div>
                )}

                {participants.length > 0 && (
                  <div className="mt-4 text-sm text-gray-700">
                    <p className="font-semibold">🙋‍♀️ 参加者:</p>
                    <ul className="list-disc list-inside">
                      {participants.map((uid) => (
                        <li key={uid}>{userMap[uid] || uid}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
