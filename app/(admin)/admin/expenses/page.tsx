import prisma from "@/lib/prisma"
import { ExpenseClient } from "./ExpenseClient"
import PageHeader from "@/components/admin/PageHeader"

export default async function ExpensesPage() {
  const expenses = await prisma.expense.findMany({ orderBy: { date: "desc" } })

  const formatted = expenses.map((e) => ({
    id: e.id,
    category: e.category,
    amount: Number(e.amount),
    date: e.date.toISOString(),
    note: e.note,
  }))

  return (
    <div className="flex-1 space-y-4">
      <PageHeader title="Expenses" />
      <ExpenseClient data={formatted} />
    </div>
  )
}
