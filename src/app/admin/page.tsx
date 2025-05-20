'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [level, setLevel] = useState('エンジョイ')
  const [imageUrl, setImageUrl] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    if (!title || !date) {
      setMessage('タイトルと日付は必須です')
      return
    }

    const { error } = await supabase.from('practices').insert([
      {
        title,
        date,
        location,
        level,
        image_url: imageUrl,
        participants: [],
      },
    ])

    if (error) {
      setMessage(`エラー: ${error.message}`)
    } else {
      setMessage('投稿完了！')
      setTitle('')
      setDate('')
      setLocation('')
      setLevel('エンジョイ')
      setImageUrl('')
      router.refresh()
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">練習予定を投稿</h1>

      <input
        className="w-full border p-2 mb-2"
        type="text"
        placeholder="タイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="w-full border p-2 mb-2"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <input
        className="w-full border p-2 mb-2"
        type="text"
        placeholder="場所"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <select
        className="w-full border p-2 mb-2"
        value={level}
        onChange={(e) => setLevel(e.target.value)}
      >
        <option value="エンジョイ">エンジョイ</option>
        <option value="ガチ">ガチ</option>
      </select>

      <input
        className="w-full border p-2 mb-2"
        type="text"
        placeholder="画像URL（任意）"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />

      {message && <p className="text-sm text-red-500">{message}</p>}

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2 mt-2 rounded"
      >
        投稿
      </button>
    </div>
  )
}
