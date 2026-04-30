import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { ArrowLeft, Banknote, CheckCircle2, Plus } from 'lucide-react'
import UserAvatar from '../../components/UserAvatar'

const groupDetails = {
  1: {
    name: 'Bali Trip',
    icon: '✈️',
    description: 'A sunny trip with friends, flights, food, and hotels all in one place.',
  },
  2: {
    name: 'Housemates',
    icon: '🍕',
    description: 'Split rent, groceries, utilities, and the occasional late-night takeout.',
  },
}

const recentExpenses = [
  { title: 'Villa booking', detail: 'Paid by Jordan', amount: '$240.00', status: '+$80.00' },
  { title: 'Dinner reservation', detail: 'Paid by Alice', amount: '$96.00', status: '-$24.00' },
  { title: 'Scooter rental', detail: 'Paid by you', amount: '$65.00', status: '+$32.50' },
]

const groupMembers = [
  { name: 'Jordan Lee' },
  { name: 'Alice S.' },
  { name: 'Mike J.' },
  { name: 'Tom B.' },
]

const smartSummary = {
  1: { name: 'Jordan Lee', amount: '$80.00', note: 'Best next payment to clear the highest debt.' },
  2: { name: 'Alice S.', amount: '$24.00', note: 'Settle this one first to zero out the biggest balance.' },
}

type PageProps = {
  params: Promise<{ groupId: string }>
}

export default async function GroupDetailPage({ params }: PageProps) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/')
  }

  const { groupId } = await params
  const id = Number(groupId)
  const group = groupDetails[id as keyof typeof groupDetails] ?? {
    name: `Group ${groupId}`,
    icon: '📦',
    description: 'A shared group with balances, expenses, and settlements.',
  }
  const summary = smartSummary[id as keyof typeof smartSummary] ?? {
    name: 'Mike J.',
    amount: '$27.50',
    note: 'Smart settle picks the person you owe most first.',
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 md:px-8">
      <Link href="/groups" className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Back to groups
      </Link>

      <div className="glass rounded-[2rem] p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="text-5xl">{group.icon}</div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">{group.name}</h1>
            <p className="mt-2 max-w-2xl text-zinc-400">{group.description}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:w-[24rem]">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="text-sm text-zinc-400">Total balance</div>
              <div className="mt-2 text-2xl font-bold text-splitwise-green">+$120.00</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="text-sm text-zinc-400">Members</div>
              <div className="mt-2 text-2xl font-bold text-white">6 people</div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {groupMembers.map((member) => (
            <div key={member.name} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
              <UserAvatar name={member.name} size={28} className="h-7 w-7" />
              <span className="text-sm text-zinc-300">{member.name}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[1.5rem] border border-splitwise-green/20 bg-splitwise-green/10 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <UserAvatar name={summary.name} size={48} className="h-12 w-12" />
              <div>
                <div className="text-sm uppercase tracking-[0.2em] text-splitwise-green">Smart settle</div>
                <div className="text-lg font-semibold text-white">Pay {summary.name} {summary.amount}</div>
                <p className="text-sm text-zinc-300">{summary.note}</p>
              </div>
            </div>
            <Link href={`/settle?groupId=${groupId}`} className="inline-flex items-center justify-center rounded-full bg-splitwise-green px-5 py-3 font-semibold text-white transition-colors hover:bg-[#4ab092]">
              Settle now
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Link href={`/add-expense?groupId=${groupId}`} className="inline-flex items-center justify-center gap-2 rounded-full bg-splitwise-green px-5 py-3 font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-[#4ab092]">
            <Plus className="h-4 w-4" />
            Add expense
          </Link>
          <Link href={`/settle?groupId=${groupId}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-white/10">
            <Banknote className="h-4 w-4 text-blue-300" />
            Settle up
          </Link>
          <Link href={`/groups/${groupId}#balances`} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-white/10">
            <CheckCircle2 className="h-4 w-4 text-splitwise-green" />
            Review balances
          </Link>
        </div>

        <div className="mt-8 space-y-3">
          <h2 className="text-lg font-semibold text-white">Recent expenses</h2>
          {recentExpenses.map((expense) => (
            <div key={expense.title} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-medium text-white">{expense.title}</div>
                <div className="text-sm text-zinc-400">{expense.detail}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-zinc-300">{expense.amount}</div>
                <div className="rounded-full bg-splitwise-green/15 px-3 py-1 text-sm font-semibold text-splitwise-green">{expense.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}