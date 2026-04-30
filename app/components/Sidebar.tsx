import Link from "next/link";
import { HomeIcon, ListIcon, PlusCircleIcon, SettingsIcon } from "lucide-react";

export default function Sidebar() {
    return (
        <div className="w-64 glass border-r h-full hidden md:flex flex-col p-4 relative z-0">
            <div className="space-y-2 mt-4">
                <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-zinc-300 hover:text-white font-medium">
                    <HomeIcon className="w-5 h-5 text-splitwise-green" />
                    Dashboard
                </Link>
                <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-zinc-300 hover:text-white font-medium">
                    <ListIcon className="w-5 h-5 text-splitwise-green" />
                    All Expenses
                </Link>
            </div>

            <div className="mt-8">
                <div className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Actions</div>
                <div className="space-y-1">
                        <Link href="/add-expense" className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-splitwise-green/10 text-splitwise-green hover:bg-splitwise-green/20 transition-colors text-sm font-medium">
                            <PlusCircleIcon className="w-4 h-4" />
                            Add Expense
                        </Link>
                </div>
            </div>

            <div className="mt-auto space-y-1">
                <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-zinc-500 hover:text-white text-sm">
                    <SettingsIcon className="w-4 h-4" />
                    Settings
                </Link>
            </div>
        </div>
    );
}
