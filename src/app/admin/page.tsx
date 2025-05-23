'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

type Practice = {
  id: string
  title: string
  date: string
  location?: string
  level: string
  image_url?: string
  participants?: string[]
  capacity?: number
  fee?: number
}

export default function AdminPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [level, setLevel] = useState('エンジョイ')
  const [imageUrl, setImageUrl] = useState('')
  const [capacity, setCapacity] = useState<number | ''>('')
  const [fee, setFee] = useState<number | ''>('')

  const [message, setMessage] = useState('')
  const [practices, setPractices] = useState<Practice[]>([]) // ✅ 修正済み

  

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
        capacity: capacity ? Number(capacity) : null,
        fee: fee ? Number(fee) : null,
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
      setCapacity('')
      fetchPractices()
    }
  }

  const fetchPractices = async () => {
    const { data } = await supabase.from('practices').select('*').order('date', { ascending: true })
    if (data) setPractices(data)
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('practices').delete().eq('id', id)
    if (error) {
      setMessage(`削除エラー: ${error.message}`)
    } else {
      setMessage('削除しました')
      fetchPractices()
    }
  }

  useEffect(() => {
    fetchPractices()
  }, [])

  return (
    <div className="max-w-2xl mx-auto p-6 ">
      <h1 className="text-2xl font-bold mb-4">練習予定を投稿</h1>

      <input className="w-full border p-2 mb-2" type="text" placeholder="タイトル" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input className="w-full border p-2 mb-2" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <input className="w-full border p-2 mb-2" type="text" placeholder="場所" value={location} onChange={(e) => setLocation(e.target.value)} />
      <select className="w-full border p-2 mb-2" value={level} onChange={(e) => setLevel(e.target.value)}>
        <option value="エンジョイ">エンジョイ</option>
        <option value="ガチ">ガチ</option>
      </select>
      <input className="w-full border p-2 mb-2" type="text" placeholder="画像URL（任意）" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
      <input className="w-full border p-2 mb-2" type="number" placeholder="定員（任意）" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} />
      <input className="w-full border p-2 mb-2" type="number" placeholder="参加費（円）" value={fee} onChange={(e) => setFee(Number(e.target.value))}/>
      {message && <p className="text-red-500 mb-2">{message}</p>}
      <button onClick={handleSubmit} className="w-full bg-blue-600 text-white py-2 mt-2 rounded">投稿</button>

      {/* 投稿一覧 */}
      <h2 className="text-xl font-bold mt-10 mb-4">投稿一覧</h2>
      {practices.map((p) => (
        <div key={p.id} className="border p-4 mb-4 rounded shadow">
          {p.image_url && (
            <Image src={p.image_url} alt="体育館画像" width={600} height={300} className="mb-4 rounded" />
          )}
          <h2 className="text-lg font-semibold">{p.title}</h2>
          <p>{p.date}</p>
          <p>{p.location}</p>
          <p>定員: {p.capacity ?? '未設定'}</p>
          <p>参加費: {p.fee ? `${p.fee}円` : '未設定'}</p>

          <div className="flex gap-2 mt-2 ">
            <button
              onClick={() => router.push(`/admin/edit/${p.id}`)}
              className="bg-yellow-500 text-white px-3 py-1 rounded"
            >
              編集
            </button>
            <button
              onClick={() => handleDelete(p.id)}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              削除
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
