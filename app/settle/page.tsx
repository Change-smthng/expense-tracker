import SettleForm from './SettleForm'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function Page() {
  const { userId } = await auth()
  if (!userId) redirect('/')

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Smart settle up</h1>
        <p className="mt-2 max-w-2xl text-zinc-400">
          Pick a suggestion and the app will automatically choose who you owe and how much, instead of asking for IDs.
        </p>
      </div>
      <div className="glass rounded-2xl p-6 md:p-8">
        <SettleForm />
      </div>
    </div>
  )
}
