"use client"
import Link from 'next/link'
import { HomeIcon, ListIcon, PlusCircleIcon, UsersIcon } from 'lucide-react'

export default function MobileNav() {
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-3 py-2 flex items-center gap-3 md:hidden z-50">
      <Link href="/dashboard" className="p-2 rounded-full hover:bg-white/5">
        <HomeIcon className="w-5 h-5 text-zinc-200" />
      </Link>
      <Link href="/groups/new" className="p-2 rounded-full hover:bg-white/5">
        <UsersIcon className="w-5 h-5 text-zinc-200" />
      </Link>
      <Link href="/add-expense" className="p-2 rounded-full bg-splitwise-green text-white shadow-sm">
        <PlusCircleIcon className="w-5 h-5" />
      </Link>
      <Link href="/friends" className="p-2 rounded-full hover:bg-white/5">
        <ListIcon className="w-5 h-5 text-zinc-200" />
      </Link>
    </nav>
  )
}
