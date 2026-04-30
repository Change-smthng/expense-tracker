import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function SettingsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/')

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">Preferences</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Settings</h1>
        <p className="mt-2 text-sm text-zinc-400">Basic account settings and app options.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="glass rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Account</h2>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
            Signed in as a Clerk user. Use the avatar in the header to manage your profile and sign out.
          </div>
          <Link href="/dashboard" className="inline-flex items-center justify-center rounded-full bg-splitwise-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#4ab092]">
            Back to dashboard
          </Link>
        </section>

        <section className="glass rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">App behavior</h2>
          <div className="space-y-3 text-sm text-zinc-300">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">Expense amounts are validated as positive numbers before saving.</div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">The Add Expense flow now posts directly to the backend API.</div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">This page exists so the Settings button always opens something useful.</div>
          </div>
        </section>
      </div>
    </div>
  )
}
