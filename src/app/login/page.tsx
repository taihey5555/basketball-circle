'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setError('')
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (loginError) {
      setError(loginError.message)
      return
    }

    const { data: { user }, error: getUserError } = await supabase.auth.getUser()
    if (getUserError || !user) {
      setError('ユーザー情報取得エラー')
      return
    }

    // user_profiles に存在するかチェック
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!existingProfile) {
      // 存在しない場合はプロフィール登録
      await supabase.from('user_profiles').insert([
        {
          id: user.id,
          name: email.split('@')[0], // 仮名（メールのローカル部分を使う）
          role: 'user',
        },
      ])
    }

    router.push('/')
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">ログイン</h1>
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
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white py-2 mt-4 rounded"
      >
        ログイン
      </button>
    </div>
  )
}
