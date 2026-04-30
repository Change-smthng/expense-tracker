import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { UserRound, Users2 } from 'lucide-react'
import UserAvatar from '../components/UserAvatar'

const friends = [
  { initials: 'AS', name: 'Alice S.', balance: '-$22.50' },
  { initials: 'MJ', name: 'Mike J.', balance: '+$40.00' },
  { initials: 'TB', name: 'Tom B.', balance: '+$27.50' },
]

export default async function FriendsPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/')
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 md:px-8">
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
          <UserRound className="h-3.5 w-3.5 text-splitwise-green" />
          Friends
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">Your friend balances</h1>
        <p className="mt-2 max-w-2xl text-zinc-400">A quick view of who owes you and who you owe back.</p>
      </div>

      <div className="glass rounded-[2rem] p-6">
        <div className="mb-5 flex items-center gap-2 text-sm text-zinc-400">
          <Users2 className="h-4 w-4 text-splitwise-green" />
          3 friends tracked
        </div>
        <div className="space-y-3">
          {friends.map((friend) => (
            <div key={friend.name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <UserAvatar name={friend.name} size={44} className="h-11 w-11 rounded-2xl" />
                <div className="font-medium text-white">{friend.name}</div>
              </div>
              <div className={`font-semibold ${friend.balance.startsWith('-') ? 'text-splitwise-red' : 'text-splitwise-green'}`}>
                {friend.balance}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}