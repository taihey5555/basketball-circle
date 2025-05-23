'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function EditPracticePage() {
  const { id } = useParams()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [level, setLevel] = useState('エンジョイ')
  const [imageUrl, setImageUrl] = useState('')
  const [capacity, setCapacity] = useState<number | ''>('')
  const [fee, setFee] = useState<number | ''>('')

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // 投稿データ読み込み
  useEffect(() => {
    const fetchPractice = async () => {
      const { data, error } = await supabase.from('practices').select('*').eq('id', id).single()
      if (error) {
        setError(`データ取得エラー: ${error.message}`)
        return
      }

      if (data) {
        setTitle(data.title)
        setDate(data.date)
        setLocation(data.location || '')
        setLevel(data.level || 'エンジョイ')
        setImageUrl(data.image_url || '')
        setCapacity(data.capacity ?? '')
        setFee(data.fee ?? '')
      }
    }

    fetchPractice()
  }, [id])

  // 更新処理
  const handleUpdate = async () => {
    setError('')
    setMessage('')

    if (!title || !date) {
      setError('タイトルと日付は必須です')
      return
    }

    const { error } = await supabase
      .from('practices')
      .update({
        title,
        date,
        location,
        level,
        image_url: imageUrl,
        capacity: capacity !== '' ? Number(capacity) : null,
        fee: fee !== '' ? Number(fee) : null,
      })
      .eq('id', id)

    if (error) {
      setError(`更新エラー: ${error.message}`)
    } else {
      setMessage('✅ 更新完了しました！')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 ">
      <h1 className="text-2xl font-bold mb-4">投稿を編集</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {message && <p className="text-green-600 mb-2">{message}</p>}

      <input
        className="w-full border p-2 mb-2"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="タイトル"
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
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="場所"
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
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="画像URL"
      />
      <input
        className="w-full border p-2 mb-2"
        type="number"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value === '' ? '' : Number(e.target.value))}
        placeholder="定員（任意）"
      />
      <input
        className="w-full border p-2 mb-2"
        type="number"
        value={fee}
        onChange={(e) => setFee(e.target.value === '' ? '' : Number(e.target.value))}
        placeholder="参加費（円）"
      />

      <div className="flex gap-2 mt-4">
        <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          更新する
        </button>
        <button
          onClick={() => router.back()}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          戻る
        </button>
      </div>
    </div>
  )
}
