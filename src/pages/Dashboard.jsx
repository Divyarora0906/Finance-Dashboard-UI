import React from "react";
import { useApp } from "../context/AppContext";
import BalanceTrend from "../components/features/BalanceTrend";
import SummaryCard from "../components/features/DashboardCard";
import SpendingPieChart from "../components/features/PieChart";
import { FaWallet, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { MoveRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function Dashboard() {
  const { transactions, insights, isDark } = useApp();
  const navigate = useNavigate();

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const cards = [
    {
      label: "Total Balance",
      value: formatCurrency(insights.totalBalance),
      icon: FaWallet,
      color: "text-[#adc6ff] bg-[#adc6ff]/10",
    },
    {
      label: "Total Income",
      value: formatCurrency(insights.totalIncome),
      icon: FaArrowUp,
      color: "text-emerald-500 bg-emerald-500/10",
    },
    {
      label: "Total Expenses",
      value: formatCurrency(insights.totalExpenses),
      icon: FaArrowDown,
      color: "text-rose-500 bg-rose-500/10",
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-10 mt-8 md:mt-10 transition-colors duration-500">
      
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card, i) => (
          <SummaryCard key={i} {...card} />
        ))}
      </div>

      <div className="bg-[#adc6ff]/10 border border-[#adc6ff]/20 p-4 rounded-2xl flex items-center justify-between">
         <p className="text-sm text-[#4d8eff] dark:text-[#adc6ff]">
           <span className="font-black uppercase tracking-widest text-[10px] mr-3 opacity-70">Top Insight:</span>
           Highest spending in <span className="font-bold text-slate-900 dark:text-white underline decoration-[#adc6ff]">{insights.highestSpendingCategory}</span>
         </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#0b1326] p-6 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
          <BalanceTrend transactions={transactions} isDark={isDark} />
        </div>
        <div className="bg-white dark:bg-[#0b1326] p-6 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
          <SpendingPieChart transactions={transactions} isDark={isDark} />
        </div>
      </div>

      <div className="bg-white dark:bg-[#0b1326] border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-xl mb-10">
        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
          <div>
            <h3 className="text-slate-900 dark:text-white font-bold text-lg">Recent Activity</h3>
            <p className="text-slate-500 dark:text-white/40 text-xs mt-1">Live updates</p>
          </div>
          <button 
            onClick={() => navigate('/transactions')}
            className="flex items-center gap-2 text-[#4d8eff] dark:text-[#adc6ff] text-sm font-bold hover:gap-3 transition-all"
          >
            View All <MoveRight size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 dark:text-white/30 text-[10px] uppercase tracking-[0.2em] border-b border-slate-100 dark:border-white/5">
                <th className="px-8 py-5 font-black">Category</th>
                <th className="px-8 py-5 font-black">Date</th>
                <th className="px-8 py-5 font-black text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        tx.type === "income" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      }`}>
                        {tx.type === "income" ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
                      </div>
                      <span className="text-slate-700 dark:text-white text-sm font-bold">{tx.category}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-slate-400 dark:text-white/40 text-xs font-medium">
                    {new Date(tx.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                  </td>
                  <td className={`px-8 py-4 text-sm font-black text-right ${
                    tx.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-white"
                  }`}>
                    {tx.type === "income" ? "+" : "-"} {formatCurrency(tx.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}