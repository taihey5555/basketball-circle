import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex flex-col items-center gap-4 p-8">
      <h1 className="text-3xl font-bold mb-4">Basketball Circle</h1>
      <Link href="/signup" className="text-blue-600 underline">サインアップ</Link>
      <Link href="/login" className="text-blue-600 underline">ログイン</Link>
    </main>
  )
}
