'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSignup = async () => {
    setError('')

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    const token = data.session?.access_token ?? 'your_token_logic_here'

    await fetch('/api/resend/verify-link', {
      method: 'POST',
      body: JSON.stringify({ email, token }),
      headers: { 'Content-Type': 'application/json' },
    })

    router.push('/verify-email')
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">サインアップ</h1>
      <input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-2 border"
      />
      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-2 border"
      />
      <button
        onClick={handleSignup}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        登録する
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}
