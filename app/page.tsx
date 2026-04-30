import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, CircleDollarSign, ShieldCheck, Sparkles, Users2 } from 'lucide-react'

export default async function Home() {
  const { userId } = await auth();

  // Redirect signed in users to dashboard
  if (userId) {
    redirect('/dashboard')
  }

  return (
    <div className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden px-6 py-14 md:px-10 md:py-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(91,197,167,0.22),transparent_28%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_bottom,rgba(255,101,47,0.12),transparent_32%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-splitwise-green/20 bg-white/5 px-4 py-2 text-sm text-splitwise-green shadow-[0_0_40px_rgba(91,197,167,0.08)]">
            <Sparkles className="h-4 w-4" />
            Next.js + FastAPI, rebuilt for fast sharing
          </div>

          <div className="space-y-5">
            <h1 className="max-w-2xl text-5xl font-black tracking-tight text-white md:text-7xl">
              Split every bill
              <span className="block text-gradient">beautifully.</span>
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-zinc-300 md:text-xl">
              SplitEase helps housemates, travelers, and close friends track who paid, who owes, and what needs settling — without the spreadsheet headache.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-splitwise-green px-6 py-3 font-semibold text-white shadow-[0_18px_60px_rgba(91,197,167,0.28)] transition-transform hover:-translate-y-0.5 hover:bg-[#4ab092]"
            >
              Open dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-zinc-200">
              <CheckCircle2 className="h-4 w-4 text-splitwise-green" />
              Fast setup with Clerk auth
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="glass rounded-2xl p-5">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-splitwise-green/15 text-splitwise-green">
                <CircleDollarSign className="h-5 w-5" />
              </div>
              <div className="text-sm text-zinc-400">Balances</div>
              <div className="mt-1 text-2xl font-bold text-white">Live</div>
            </div>
            <div className="glass rounded-2xl p-5">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300">
                <Users2 className="h-5 w-5" />
              </div>
              <div className="text-sm text-zinc-400">Groups</div>
              <div className="mt-1 text-2xl font-bold text-white">Trips + homes</div>
            </div>
            <div className="glass rounded-2xl p-5">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/15 text-splitwise-red">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="text-sm text-zinc-400">Settlements</div>
              <div className="mt-1 text-2xl font-bold text-white">One tap</div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-splitwise-green/20 via-blue-500/10 to-transparent blur-3xl" />
          <div className="glass rounded-[2rem] border-white/10 p-5 shadow-2xl shadow-black/30 md:p-7">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-sm text-zinc-400">Today&apos;s snapshot</p>
                <h2 className="text-xl font-semibold text-white">Your shared spending</h2>
              </div>
              <span className="rounded-full bg-splitwise-green/15 px-3 py-1 text-xs font-medium text-splitwise-green">
                +$45.00 net
              </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="flex items-center justify-between text-sm text-zinc-400">
                  <span>Owed to you</span>
                  <span className="font-semibold text-splitwise-green">$67.50</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/5">
                  <div className="h-2 w-[72%] rounded-full bg-gradient-to-r from-splitwise-green to-blue-400" />
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="flex items-center justify-between text-sm text-zinc-400">
                  <span>You owe</span>
                  <span className="font-semibold text-splitwise-red">$22.50</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/5">
                  <div className="h-2 w-[28%] rounded-full bg-gradient-to-r from-orange-500 to-splitwise-red" />
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-transform hover:-translate-y-0.5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-medium text-white">Dinner at Mario&apos;s</div>
                    <div className="text-sm text-zinc-400">You paid $120.00 · 4 people</div>
                  </div>
                  <div className="rounded-full bg-splitwise-green/15 px-3 py-1 text-sm font-semibold text-splitwise-green">
                    +$60.00
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-transform hover:-translate-y-0.5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-medium text-white">Airport Uber</div>
                    <div className="text-sm text-zinc-400">Alice paid $45.00 · split evenly</div>
                  </div>
                  <div className="rounded-full bg-splitwise-red/15 px-3 py-1 text-sm font-semibold text-splitwise-red">
                    -$22.50
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-transform hover:-translate-y-0.5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-medium text-white">House groceries</div>
                    <div className="text-sm text-zinc-400">Mike paid $89.40 · pending settle-up</div>
                  </div>
                  <div className="rounded-full bg-blue-500/15 px-3 py-1 text-sm font-semibold text-blue-300">
                    Updated now
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
