"use client"
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { ArrowRight, Loader2, Sparkles } from 'lucide-react'
import UserAvatar from '../components/UserAvatar'

type GroupSummary = {
  id: number
  name: string
}

type BalanceEntry = {
  user_id: number
  user_name: string
  user_avatar?: string | null
  amount: number
}

type SettlementSuggestion = {
  groupId: number
  groupName: string
  userId: number
  userName: string
  amount: number
  avatar?: string | null
}

export default function SettleForm() {
  const router = useRouter()
  const search = useSearchParams()
  const groupIdFromQuery = search?.get('groupId') ?? ''
  const { userId } = useAuth()

  const [groups, setGroups] = useState<GroupSummary[]>([])
  const [suggestions, setSuggestions] = useState<SettlementSuggestion[]>([])
  const [selectedGroupId, setSelectedGroupId] = useState(groupIdFromQuery)
  const [selectedSuggestion, setSelectedSuggestion] = useState<SettlementSuggestion | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadSmartSuggestions() {
      if (!userId) return
      try {
        const groupsRes = await fetch(`http://localhost:8000/api/groups?clerk_id=${userId}`)
        if (!groupsRes.ok) throw new Error('Failed to load groups')
        const groupsData: GroupSummary[] = await groupsRes.json()

        if (cancelled) return
        setGroups(groupsData)

        const sourceGroups = groupIdFromQuery
          ? groupsData.filter((group) => String(group.id) === groupIdFromQuery)
          : groupsData

        const groupBalances = await Promise.all(
          sourceGroups.map(async (group) => {
            const balancesRes = await fetch(`http://localhost:8000/api/balances/group/${group.id}?clerk_id=${userId}`)
            if (!balancesRes.ok) return [] as BalanceEntry[]
            const balancesData: BalanceEntry[] = await balancesRes.json()
            return balancesData.map((entry) => ({ ...entry, amount: Number(entry.amount) }))
          })
        )

        const nextSuggestions: SettlementSuggestion[] = []
        groupBalances.forEach((balances, index) => {
          const group = sourceGroups[index]
          balances
            .filter((entry) => entry.amount < 0)
            .forEach((entry) => {
              nextSuggestions.push({
                groupId: group.id,
                groupName: group.name,
                userId: entry.user_id,
                userName: entry.user_name,
                amount: Math.abs(Number(entry.amount)),
                avatar: entry.user_avatar,
              })
            })
        })

        nextSuggestions.sort((a, b) => b.amount - a.amount)
        if (cancelled) return

        setSuggestions(nextSuggestions)

        const initial = nextSuggestions[0] ?? null
        setSelectedSuggestion(initial)
        setSelectedGroupId((prev) => prev || String(initial?.groupId ?? groupIdFromQuery ?? ''))
        setCustomAmount(initial ? initial.amount.toFixed(2) : '')
      } catch (err) {
        console.error(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadSmartSuggestions()

    return () => {
      cancelled = true
    }
  }, [groupIdFromQuery, userId])

  const selectedGroup = useMemo(() => groups.find((group) => String(group.id) === selectedGroupId) ?? null, [groups, selectedGroupId])

  function chooseBestForGroup(groupId: string) {
    const groupMatches = suggestions
      .filter((item) => String(item.groupId) === groupId)
      .sort((a, b) => b.amount - a.amount)
    const match = groupMatches[0] ?? null
    setSelectedSuggestion(match)
    setCustomAmount(match ? match.amount.toFixed(2) : '')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!userId) return alert('You must be signed in')
    if (!selectedGroupId || !selectedSuggestion) return alert('Pick a settlement suggestion first')
    setSubmitting(true)

    try {
      const body = {
        group_id: Number(selectedGroupId),
        paid_to: selectedSuggestion.userId,
        amount: Number(customAmount),
      }
      const res = await fetch(`http://localhost:8000/api/settlements?clerk_id=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Failed to record settlement')
      await res.json()
      router.push(`/groups/${selectedGroupId}`)
    } catch (err) {
      console.error(err)
      alert('Unable to record settlement. Check backend at http://localhost:8000')
    } finally {
      setSubmitting(false)
    }
  }

  function chooseSuggestion(suggestion: SettlementSuggestion) {
    setSelectedSuggestion(suggestion)
    setSelectedGroupId(String(suggestion.groupId))
    setCustomAmount(suggestion.amount.toFixed(2))
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center gap-2 text-sm font-medium text-splitwise-green">
          <Sparkles className="h-4 w-4" />
          Smart suggestions
        </div>
        <p className="mt-2 text-sm text-zinc-400">
          We automatically pick the person you owe most in each group, similar to a smart pay flow.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">Suggested settlements</h2>
          {loading ? <Loader2 className="h-4 w-4 animate-spin text-zinc-400" /> : null}
        </div>

        {!loading && suggestions.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/30 p-5 text-zinc-400">
            No outstanding debts found. Everything looks settled.
          </div>
        ) : null}

        <div className="grid gap-3">
          {suggestions.map((suggestion) => {
            const active = selectedSuggestion?.groupId === suggestion.groupId && selectedSuggestion?.userId === suggestion.userId
            return (
              <button
                key={`${suggestion.groupId}-${suggestion.userId}`}
                type="button"
                onClick={() => chooseSuggestion(suggestion)}
                className={`rounded-2xl border p-4 text-left transition-all ${active ? 'border-splitwise-green bg-splitwise-green/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <UserAvatar name={suggestion.userName} avatarUrl={suggestion.avatar} size={44} className="h-11 w-11 shrink-0" />
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-white">Pay {suggestion.userName}</div>
                      <div className="truncate text-sm text-zinc-400">{suggestion.groupName}</div>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-lg font-bold text-splitwise-red">${suggestion.amount.toFixed(2)}</div>
                    <div className="text-xs text-zinc-400">You owe this amount</div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm text-zinc-300">Group</label>
            <select
              value={selectedGroupId}
              onChange={(e) => {
                const nextGroupId = e.target.value
                setSelectedGroupId(nextGroupId)
                chooseBestForGroup(nextGroupId)
              }}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 p-3"
            >
              <option value="">Select a group</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-zinc-300">Paying</label>
            <div className="mt-1 flex items-center gap-3 rounded-lg border border-white/10 bg-black/30 p-3">
              <UserAvatar name={selectedSuggestion?.userName ?? 'Person'} avatarUrl={selectedSuggestion?.avatar} size={36} className="h-9 w-9 shrink-0" />
              <div className="min-w-0">
                <div className="truncate font-medium text-white">{selectedSuggestion?.userName ?? 'Choose a suggestion'}</div>
                <div className="truncate text-sm text-zinc-400">Automatic payee selection</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm text-zinc-300">Amount</label>
          <input
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 p-3"
            placeholder="e.g. 20.00"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-zinc-400">
            {selectedGroup ? (
              <span>
                Ready to settle in <span className="text-white">{selectedGroup.name}</span>
              </span>
            ) : (
              'Pick a suggestion to continue'
            )}
          </div>
          <button
            type="submit"
            disabled={submitting || !selectedSuggestion}
            className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {submitting ? 'Recording...' : 'Record settlement'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  )
}

