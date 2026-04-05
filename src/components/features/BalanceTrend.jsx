import React, { useState, useEffect, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function BalanceTrend({ isDark }) {
  const [localTransactions, setLocalTransactions] = useState([]);

  const fetchLocalData = () => {
    const saved = localStorage.getItem("zorvyn_transactions");
    if (saved) {
      try {
        setLocalTransactions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse transactions", e);
      }
    }
  };

  useEffect(() => {
    fetchLocalData();
    const handleUpdate = () => fetchLocalData();

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("local-storage-update", handleUpdate);

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("local-storage-update", handleUpdate);
    };
  }, []);

  const data = useMemo(() => {
    const monthly = {};

    localTransactions.forEach((t) => {
      const dateStr = t.date || new Date().toISOString();
      const month = dateStr.slice(0, 7); 

      if (!monthly[month]) {
        monthly[month] = { income: 0, expense: 0 };
      }

      const amt = Number(t.amount) || 0;
      if (t.type === "income") {
        monthly[month].income += amt;
      } else {
        monthly[month].expense += amt;
      }
    });

    return Object.entries(monthly)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, val]) => ({
        month: new Date(month + "-01").toLocaleDateString("en-IN", {
          month: "short",
        }),
        Income: Math.round(val.income),
        Expenses: Math.round(val.expense),
      }));
  }, [localTransactions]);

  return (
    <div className="w-full bg-white dark:bg-[#0b1326] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm transition-all duration-500">
      <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-white/30 mb-6 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
        Balance Trend
      </h2>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-100 dark:border-white/5 rounded-2xl">
          <p className="text-sm text-slate-400 dark:text-white/20 font-medium">No trend data available</p>
        </div>
      ) : (
        <div className="w-full h-[280px] mt-20">
          <ResponsiveContainer width="100%" height="100%" key={localTransactions.length}>
            <AreaChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: -10 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                vertical={false}
                strokeDasharray="3 3" 
                stroke={isDark ? "rgba(255,255,255,0.05)" : "#e2e8f0"} 
              />
              
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: isDark ? "#9ca3af" : "#64748b", fontSize: 10, fontWeight: 'bold' }} 
              />
              
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: isDark ? "#9ca3af" : "#64748b", fontSize: 10, fontWeight: 'bold' }} 
              />
              
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-[#020817] border border-slate-200 dark:border-white/10 p-4 rounded-2xl shadow-2xl">
                        <p className="text-[10px] font-black uppercase text-slate-400 dark:text-white/30 mb-2">{label}</p>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-[#10b981] flex justify-between gap-4">
                            Income: <span>₹{payload[0].value.toLocaleString('en-IN')}</span>
                          </p>
                          <p className="text-xs font-bold text-[#f43f5e] flex justify-between gap-4">
                            Expense: <span>₹{payload[1].value.toLocaleString('en-IN')}</span>
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              
              <Area 
                type="monotone" 
                dataKey="Income" 
                stroke="#10b981" 
                fillOpacity={1} 
                fill="url(#colorIncome)" 
                strokeWidth={3} 
              />
              <Area 
                type="monotone" 
                dataKey="Expenses" 
                stroke="#f43f5e" 
                fillOpacity={1} 
                fill="url(#colorExpense)" 
                strokeWidth={3} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}