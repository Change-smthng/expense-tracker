import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { ArrowRight, FolderKanban, Plus } from 'lucide-react'

const groups = [
  { id: 1, name: 'Bali Trip', icon: '✈️', members: 6, balance: '+$120.00', color: 'from-cyan-500/20 to-splitwise-green/10' },
  { id: 2, name: 'Housemates', icon: '🍕', members: 4, balance: '-$22.50', color: 'from-orange-500/20 to-splitwise-red/10' },
  { id: 3, name: 'Weekend Crew', icon: '🎬', members: 5, balance: '+$34.20', color: 'from-blue-500/20 to-blue-500/10' },
]

export default async function GroupsPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/')
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 md:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
            <FolderKanban className="h-3.5 w-3.5 text-splitwise-green" />
            Groups
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">Your shared spaces</h1>
          <p className="mt-2 max-w-2xl text-zinc-400">Jump into a group, review balances, and add expenses in seconds.</p>
        </div>
        <Link href="/groups/new" className="inline-flex items-center justify-center gap-2 rounded-full bg-splitwise-green px-5 py-3 font-semibold text-white shadow-[0_18px_60px_rgba(91,197,167,0.22)] transition-transform hover:-translate-y-0.5 hover:bg-[#4ab092]">
          <Plus className="h-4 w-4" />
          New group
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => (
          <Link key={group.id} href={`/groups/${group.id}`} className="group glass rounded-[1.5rem] p-5 transition-all hover:-translate-y-1 hover:border-white/20">
            <div className={`rounded-[1.25rem] bg-gradient-to-br ${group.color} p-5` }>
              <div className="flex items-center justify-between">
                <div className="text-3xl">{group.icon}</div>
                <span className="rounded-full bg-black/25 px-3 py-1 text-xs font-medium text-white/90">{group.members} members</span>
              </div>
              <div className="mt-10 flex items-end justify-between">
                <div>
                  <div className="text-lg font-semibold text-white">{group.name}</div>
                  <div className="text-sm text-white/70">Tap to open details</div>
                </div>
                <div className={`text-lg font-bold ${group.balance.startsWith('-') ? 'text-splitwise-red' : 'text-splitwise-green'}`}>
                  {group.balance}
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-zinc-400 group-hover:text-zinc-200">
              <span>View group</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}