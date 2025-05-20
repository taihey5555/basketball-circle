'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

export default function DashboardPage() {
  const [practices, setPractices] = useState<any[]>([])
  const [userId, setUserId] = useState<string | null>(null)

  // ユーザー取得
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        setUserId(data.user.id)
      }
    }
    fetchUser()
  }, [])

  // 投稿取得
  useEffect(() => {
    const fetchPractices = async () => {
      const { data } = await supabase.from('practices').select('*').order('date', { ascending: true })
      if (data) setPractices(data)
    }
    fetchPractices()
  }, [])

  // 参加処理
  const handleJoin = async (practiceId: string) => {
    if (!userId) return
    const { error } = await supabase.rpc('add_participant', {
      p_practice_id: practiceId,
      p_user_id: userId,
    })
    if (!error) {
      location.reload()
    }
  }

  // キャンセル処理
  const handleCancel = async (practiceId: string) => {
    if (!userId) return
    const { error } = await supabase.rpc('remove_participant', {
      p_practice_id: practiceId,
      p_user_id: userId,
    })
    if (!error) {
      location.reload()
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">練習予定</h1>

      {practices.map((p) => {
        const participants = p.participants || []
        const alreadyJoined = participants.includes(userId)
        const capacity = p.capacity || null
        const isFull = capacity !== null && participants.length >= capacity
        const remaining = capacity !== null ? capacity - participants.length : null

        return (
          <div key={p.id} className="border p-4 mb-6 rounded shadow">
            {p.image_url && (
              <Image
                src={p.image_url}
                alt="体育館画像"
                width={600}
                height={300}
                className="mb-4 rounded"
              />
            )}
            <h2 className="text-xl font-semibold">{p.title}</h2>
            <p>📅 {p.date}</p>
            <p>📍 {p.location}</p>
            <p>🏷️ {p.level}</p>
            <p>🙋‍♂️ 参加者数: {participants.length}{capacity !== null ? ` / ${capacity}` : ''}</p>

            {capacity !== null && isFull && !alreadyJoined && (
              <p className="text-red-600 font-semibold mt-1">満員です</p>
            )}

            <div className="mt-3">
              {alreadyJoined ? (
                <button
                  className="bg-red-500 text-white px-4 py-1 rounded"
                  onClick={() => handleCancel(p.id)}
                >
                  キャンセルする
                </button>
              ) : (
                !isFull && (
                  <button
                    className="bg-green-600 text-white px-4 py-1 rounded"
                    onClick={() => handleJoin(p.id)}
                  >
                    参加する
                  </button>
                )
              )}
            </div>

            {participants.length > 0 && (
              <div className="mt-3 text-sm text-gray-600">
                <p>🙋‍♀️ 参加者（ID一覧）:</p>
                <ul className="list-disc list-inside">
                  {participants.map((uid: string) => (
                    <li key={uid}>{uid}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
