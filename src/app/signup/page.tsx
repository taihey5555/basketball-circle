'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSignup = async () => {
    setError('')
    const result = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      })
      if (result.error) {
        setError(result.error.message)
      } else {
        router.push('/dashboard')
      }
      
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">サインアップ</h1>
      <input
        className="w-full mb-2 p-2 border"
        type="text"
        placeholder="名前"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="w-full mb-2 p-2 border"
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full mb-2 p-2 border"
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={handleSignup}
        className="w-full bg-blue-600 text-white py-2 mt-4 rounded"
      >
        登録する
      </button>
    </div>
  )
}
