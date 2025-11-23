"use client"
import { Header } from "@/components/header"
import { TransactionHistoryPage } from "@/components/transaction-history"

export default function TransactionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
       <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Lịch sử giao dịch</h1>
        <TransactionHistoryPage />
      </div>
    </div>
  )
}