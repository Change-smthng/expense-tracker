"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback, useState, useEffect, useMemo } from "react";
import { ArrowDownIcon, ArrowUpIcon, Loader2, SaveIcon, PlusCircleIcon, TagIcon } from "lucide-react";

// Types
type Expense = {
    id: number;
    idempotency_key: string;
    amount: number;
    category: string;
    description: string;
    date: string;
    created_at: string;
};

const CATEGORIES = ["Food & Dining", "Transportation", "Utilities", "Entertainment", "Shopping", "Other"];

const CATEGORY_COLORS: Record<string, string> = {
    "Food & Dining": "from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-400",
    "Transportation": "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400",
    "Utilities": "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 text-yellow-400",
    "Entertainment": "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400",
    "Shopping": "from-pink-500/20 to-pink-600/10 border-pink-500/30 text-pink-400",
    "Other": "from-zinc-500/20 to-zinc-600/10 border-zinc-500/30 text-zinc-400",
};

export default function Dashboard() {
    const { userId } = useAuth();

    // State
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    // Filter/Sort State
    const [filterCategory, setFilterCategory] = useState("");
    const [sortOrder, setSortOrder] = useState<"date_desc" | "date_asc">("date_desc");

    // Fetch Expenses
    const fetchExpenses = useCallback(async () => {
        if (!userId) return;
        try {
            const queryParams = new URLSearchParams();
            if (filterCategory) queryParams.set("category", filterCategory);
            queryParams.set("sort", sortOrder);

            const res = await fetch(`/api/expenses?${queryParams}`, {
                headers: {
                    "Authorization": userId
                }
            });

            if (!res.ok) throw new Error("Failed to fetch expenses");
            const data = await res.json();
            setExpenses(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [userId, filterCategory, sortOrder]);

    useEffect(() => {
        setLoading(true);
        fetchExpenses();
    }, [fetchExpenses]);

    // Handle Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            setSubmitError("Please enter a valid positive amount");
            return;
        }

        setSubmitting(true);
        setSubmitError("");

        // Generate UUID for Idempotency
        const idempotencyKey = crypto.randomUUID();

        try {
            const res = await fetch("/api/expenses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": userId || "",
                    "Idempotency-Key": idempotencyKey
                },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    category,
                    description,
                    date,
                    idempotency_key: idempotencyKey
                })
            });

            if (!res.ok) {
                throw new Error("Failed to save expense");
            }

            // Clear form
            setAmount("");
            setDescription("");

            // Refresh list
            fetchExpenses();

        } catch (err: any) {
            setSubmitError(err.message || "An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    // Helper: Total calculation
    const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Helper: Per-category totals
    const categoryTotals = useMemo(() => {
        const totals: Record<string, number> = {};
        expenses.forEach(exp => {
            totals[exp.category] = (totals[exp.category] || 0) + exp.amount;
        });
        return Object.entries(totals).sort((a, b) => b[1] - a[1]);
    }, [expenses]);

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Personal Expenses</h1>
            </div>

            {/* CATEGORY TOTALS */}
            {!loading && expenses.length > 0 && (
                <div className="space-y-3">
                    <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                        <TagIcon className="w-4 h-4" /> Spending by Category
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        {categoryTotals.map(([cat, total]) => (
                            <div
                                key={cat}
                                className={`rounded-xl border bg-gradient-to-b p-3 transition-transform hover:-translate-y-0.5 ${CATEGORY_COLORS[cat] || CATEGORY_COLORS["Other"]}`}
                            >
                                <div className="text-xs font-medium opacity-80 truncate">{cat}</div>
                                <div className="text-lg font-bold mt-1">${total.toFixed(2)}</div>
                                <div className="text-[10px] opacity-60 mt-0.5">
                                    {((total / totalAmount) * 100).toFixed(0)}% of total
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* ADD EXPENSE FORM */}
                <div className="lg:col-span-1 border border-glass-border glass p-6 rounded-2xl h-fit">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <PlusCircleIcon className="w-5 h-5 text-splitwise-green" /> Add Expense
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {submitError && (
                            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500 text-sm text-red-200">
                                {submitError}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1">Amount ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-black/40 border border-glass-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-splitwise-green text-lg font-medium"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-[#151515] border border-glass-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-splitwise-green appearance-none"
                            >
                                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1">Description</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Dinner at Mario's"
                                className="w-full bg-black/40 border border-glass-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-splitwise-green"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-black/40 border border-glass-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-splitwise-green [color-scheme:dark]"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-splitwise-green hover:bg-[#4ab092] text-white px-4 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-splitwise-green/20 flex justify-center items-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <SaveIcon className="w-5 h-5" />}
                            {submitting ? "Saving..." : "Save Expense"}
                        </button>
                    </form>
                </div>

                {/* EXPENSE LIST & CONTROLS */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass p-4 rounded-xl">
                        <div className="flex gap-4 items-center w-full sm:w-auto">
                            <div className="flex-1">
                                <label className="block text-xs text-zinc-400 mb-1">Filter Type</label>
                                <select
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    className="w-full sm:w-40 bg-[#151515] border border-glass-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-splitwise-green"
                                >
                                    <option value="">All Categories</option>
                                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Sort Date</label>
                                <button
                                    onClick={() => setSortOrder(prev => prev === "date_desc" ? "date_asc" : "date_desc")}
                                    className="flex items-center gap-1 bg-[#151515] border border-glass-border rounded-lg px-3 py-1.5 text-sm hover:bg-white/5"
                                >
                                    {sortOrder === "date_desc" ? <ArrowDownIcon className="w-4 h-4 text-splitwise-green" /> : <ArrowUpIcon className="w-4 h-4 text-splitwise-green" />}
                                    {sortOrder === "date_desc" ? "Newest First" : "Oldest First"}
                                </button>
                            </div>
                        </div>

                        <div className="hidden sm:block h-10 w-px bg-glass-border mx-2"></div>

                        <div className="bg-black/50 p-3 rounded-lg border border-glass-border flex-shrink-0 w-full sm:w-auto text-right">
                            <div className="text-xs text-zinc-400">Total Visible</div>
                            <div className="text-xl font-bold text-splitwise-green">${totalAmount.toFixed(2)}</div>
                        </div>
                    </div>

                    <div className="glass rounded-xl overflow-hidden shadow-lg border border-glass-border min-h-[400px]">
                        {loading ? (
                            <div className="flex justify-center items-center h-[400px]">
                                <Loader2 className="w-8 h-8 animate-spin text-splitwise-green" />
                            </div>
                        ) : expenses.length === 0 ? (
                            <div className="flex flex-col justify-center items-center h-[400px] text-zinc-500">
                                <p>No expenses found.</p>
                                <p className="text-sm">Try relaxing your filters or adding a new expense.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left bg-black/10">
                                <thead className="bg-[#151515] border-b border-glass-border">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-glass-border">
                                    {expenses.map((expense) => (
                                        <tr key={expense.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                                                {new Date(expense.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {expense.description}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                                                <span className="bg-white/10 px-2 py-1 rounded-full text-xs">
                                                    {expense.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-splitwise-green">
                                                ${expense.amount.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}
