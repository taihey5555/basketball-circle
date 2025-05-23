// ✅ app/verify-email/page.tsx
export default function VerifyEmailPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sky-50 text-center p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">仮登録完了！</h1>
      <p className="text-gray-700 max-w-md">
        ご登録いただいたメールアドレス宛に確認メールを送信しました。
        <br />
        メール内のリンクをクリックして本登録を完了してください。
      </p>
    </div>
  )
}
