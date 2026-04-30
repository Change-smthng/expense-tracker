import AddGroupForm from './AddGroupForm'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function Page() {
  const { userId } = await auth()
  if (!userId) redirect('/')

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-bold text-white mb-4">Create new group</h1>
      <div className="glass rounded-2xl p-6">
        {/* client form */}
        <AddGroupForm />
      </div>
    </div>
  )
}
