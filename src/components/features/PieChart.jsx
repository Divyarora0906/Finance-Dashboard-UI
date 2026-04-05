import React, { useState, useEffect, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CATEGORY_COLORS = {
  Rent: "#f87171",
  Food: "#fbbf24",
  Transport: "#60a5fa",
  Shopping: "#a78bfa",
  Salary: "#34d399",
  Freelance: "#10b981",
  Tech: "#818cf8",
  Other: "#94a3b8",
};

export default function SpendingPieChart() {
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
    const handleStorageChange = () => fetchLocalData();

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("local-storage-update", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("local-storage-update", handleStorageChange);
    };
  }, []);

  const data = useMemo(() => {
    const categoryMap = {};
    
    localTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const cat = t.category || "Other";
        const amt = Number(t.amount) || 0;
        categoryMap[cat] = (categoryMap[cat] || 0) + amt;
      });

    return Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [localTransactions]);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="w-full bg-white dark:bg-[#0b1326] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm transition-all duration-500">
      <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-white/30 mb-6 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#4d8eff] animate-pulse" />
        Live Spending Breakdown
      </h2>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-100 dark:border-white/5 rounded-2xl">
          <p className="text-sm text-slate-400 dark:text-white/20 font-medium">No expenses found</p>
        </div>
      ) : (
        <>
          <div className="relative w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%" key={localTransactions.length}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={75}
                  paddingAngle={8}
                  stroke="none"
                  animationDuration={1000}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CATEGORY_COLORS[entry.name] || CATEGORY_COLORS["Other"]}
                      className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-[#020817] border border-slate-200 dark:border-white/10 p-3 rounded-xl shadow-2xl">
                          <p className="text-[10px] font-black uppercase text-slate-400 dark:text-white/40">{payload[0].name}</p>
                          <p className="text-sm font-black text-slate-900 dark:text-white">₹{payload[0].value.toLocaleString('en-IN')}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-white/20">Total</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                ₹{total.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            {data.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[item.name] || CATEGORY_COLORS["Other"] }} />
                  <span className="text-[11px] font-bold text-slate-600 dark:text-white/60">{item.name}</span>
                </div>
                <span className="text-[10px] font-black text-slate-900 dark:text-white">
                  {Math.round((item.value / total) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}