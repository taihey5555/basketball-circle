import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { email, token } = await req.json()

  const verifyUrl = `${process.env.APP_URL}/verify-email?token=${token}`

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: email,
      subject: 'メールアドレスの確認',
      html: `<p>以下のリンクをクリックしてメールアドレスを確認してください:</p>
             <a href="${verifyUrl}">${verifyUrl}</a>`
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
