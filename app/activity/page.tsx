import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Activity, ArrowRightLeft, Receipt, Sparkles } from 'lucide-react'

const events = [
  {
    title: 'Dinner at Mario\'s',
    detail: 'You paid $120.00 · 4 people',
    amount: '+$60.00',
    tone: 'text-splitwise-green bg-splitwise-green/15',
  },
  {
    title: 'Airport Uber',
    detail: 'Alice paid $45.00 · split evenly',
    amount: '-$22.50',
    tone: 'text-splitwise-red bg-splitwise-red/15',
  },
  {
    title: 'Group settle-up',
    detail: 'Tom sent you $27.50',
    amount: 'Settled',
    tone: 'text-blue-300 bg-blue-500/15',
  },
]

export default async function ActivityPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/')
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 md:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
            <Activity className="h-3.5 w-3.5 text-splitwise-green" />
            Recent activity
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">What changed lately</h1>
          <p className="mt-2 max-w-2xl text-zinc-400">A clean timeline of expenses, payments, and settlements across your groups.</p>
        </div>
        <div className="glass rounded-2xl px-5 py-4 text-sm text-zinc-300">
          <div className="flex items-center gap-2 text-splitwise-green">
            <Sparkles className="h-4 w-4" />
            Live feed ready
          </div>
          <div className="mt-1 text-zinc-400">Hook this screen to your backend events later.</div>
        </div>
      </div>

      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.title} className="glass rounded-2xl p-5 transition-transform hover:-translate-y-0.5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-splitwise-green">
                  <Receipt className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-white">{event.title}</div>
                  <div className="mt-1 text-sm text-zinc-400">{event.detail}</div>
                </div>
              </div>
              <div className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${event.tone}`}>
                <ArrowRightLeft className="h-4 w-4" />
                {event.amount}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}