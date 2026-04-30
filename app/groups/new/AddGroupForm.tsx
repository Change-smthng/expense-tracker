"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'

export default function AddGroupForm() {
  const router = useRouter()
  const { userId } = useAuth()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!userId) return alert('You must be signed in')
    setCreating(true)

    try {
      const res = await fetch(`/api/groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: userId
        },
        body: JSON.stringify({ name, description, icon: '📦', member_ids: [] }),
      })
      if (!res.ok) throw new Error('Failed to create')
      const data = await res.json()
      router.push(`/groups/${data.id}`)
    } catch (err) {
      console.error(err)
      alert('Unable to create group. Check backend is accessible.')
    } finally {
      setCreating(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-zinc-300">Group name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg p-3 bg-white/5 border border-white/10" placeholder="Bali Trip" />
      </div>
      <div>
        <label className="block text-sm text-zinc-300">Description</label>
        <input value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full rounded-lg p-3 bg-white/5 border border-white/10" placeholder="Short description (optional)" />
      </div>
      <div className="flex justify-end">
        <button type="submit" disabled={creating} className="inline-flex items-center gap-2 rounded-full bg-splitwise-green px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
          {creating ? 'Creating...' : 'Create group'}
        </button>
      </div>
    </form>
  )
}
