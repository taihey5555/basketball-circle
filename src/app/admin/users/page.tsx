'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type UserProfile = {
  id: string
  name: string
  role: string
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from('user_profiles').select('*')
      if (data) setUsers(data)
    }
    fetchUsers()
  }, [])

  const promoteToAdmin = async (id: string) => {
    const { error } = await supabase.from('user_profiles').update({ role: 'admin' }).eq('id', id)
    if (error) {
      setMessage(`昇格失敗: ${error.message}`)
    } else {
      setMessage('昇格しました！')
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? { ...user, role: 'admin' } : user))
      )
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 ">
      <h1 className="text-2xl font-bold mb-4">ユーザー管理</h1>
      {message && <p className="text-green-600">{message}</p>}

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">名前</th>
            <th className="p-2 border">役割</th>
            <th className="p-2 border">登録日</th>
            <th className="p-2 border">操作</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="p-2 border">{u.name}</td>
              <td className="p-2 border">{u.role}</td>
              <td className="p-2 border">{new Date(u.created_at).toLocaleDateString()}</td>
              <td className="p-2 border">
                {u.role !== 'admin' && (
                  <button
                    onClick={() => promoteToAdmin(u.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    昇格
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
