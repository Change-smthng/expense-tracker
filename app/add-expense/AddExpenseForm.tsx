"use client"
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'

export default function AddExpenseForm() {
  const router = useRouter()
  const search = useSearchParams()
  const { userId } = useAuth()
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(search?.get('category') ?? '')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!userId) return alert('You must be signed in')
    const parsedAmount = Number(amount)
    if (!category.trim()) return setError('Please enter a category or group name.')
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) return setError('Amount must be a positive number.')
    if (!description.trim()) return setError('Please add a description.')
    if (!date) return setError('Please choose a date.')

    setSubmitting(true)
    setError('')

    try {
      const body = {
        idempotency_key: crypto.randomUUID(),
        amount: parsedAmount,
        category: category.trim(),
        description: description.trim(),
        date,
      }
      const res = await fetch(`/api/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: userId,
        },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Failed to create expense')
      router.push('/dashboard')
    } catch (err) {
      console.error(err)
      setError('Unable to save expense. Make sure backend is running/accessible')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-zinc-300">Category / Group</label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 w-full rounded-lg p-3 bg-white/5 border border-white/10"
          placeholder="Dinner, Travel, Rent..."
        />
      </div>
      <div>
        <label className="block text-sm text-zinc-300">Description</label>
        <input value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full rounded-lg p-3 bg-white/5 border border-white/10" placeholder="Dinner, taxi, etc." />
      </div>
      <div>
        <label className="block text-sm text-zinc-300">Amount</label>
        <input
          type="number"
          inputMode="decimal"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 w-full rounded-lg p-3 bg-white/5 border border-white/10"
          placeholder="e.g. 45.00"
        />
      </div>
      <div>
        <label className="block text-sm text-zinc-300">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 w-full rounded-lg p-3 bg-white/5 border border-white/10"
        />
      </div>
      {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}
      <div className="flex justify-end">
        <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-full bg-splitwise-green px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
          {submitting ? 'Saving...' : 'Save expense'}
        </button>
      </div>
    </form>
  )
}

