import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Search,
  ArrowUpDown,
  Plus,
  Download,
  Trash2,
  MoreVertical,
  Edit3,
  FileJson,
  Table,
  ChevronDown,
  Check,
} from "lucide-react";
import TransactionModal from "../components/ui/AddTransactionModal";
import { useApp } from "../context/AppContext";
import { exportTransactions } from "../utils/exportUtils";

const CATEGORIES = [
  "Salary",
  "Freelance",
  "Food",
  "Rent",
  "Shopping",
  "Transport",
  "Utilities",
  "Subscriptions",
];

const TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
];

const CustomSelect = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((opt) => opt.value === value) || options[0];

  return (
    <div className="relative w-full sm:w-44" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-600 dark:text-white/80 hover:border-[#4d8eff] dark:hover:border-[#adc6ff]/40 transition-all"
      >
        <span className="flex items-center gap-2">
          {value !== "all" && (
            <span
              className={`w-2 h-2 rounded-full ${value === "income" ? "bg-emerald-500" : "bg-rose-500"}`}
            />
          )}
          {selected.label}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-[#0b1326] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-1.5">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-black rounded-lg transition-all ${
                  value === opt.value
                    ? "bg-[#4d8eff]/10 text-[#4d8eff] dark:bg-[#adc6ff]/10 dark:text-[#adc6ff]"
                    : "text-slate-500 dark:text-white/40 hover:bg-slate-50 dark:hover:bg-white/5"
                }`}
              >
                {opt.label}
                {value === opt.value && <Check size={14} strokeWidth={3} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function Transactions({
  externalModalOpen,
  setExternalModalOpen,
}) {
  const { role } = useApp();
  const isAdmin = role === "admin";

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("zorvyn_transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    sortBy: "date",
  });

  useEffect(() => {
    localStorage.setItem("zorvyn_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    if (externalModalOpen) {
      setEditingTransaction(null);
      setIsModalOpen(true);
      setExternalModalOpen(false);
    }
  }, [externalModalOpen, setExternalModalOpen]);

  const filteredData = useMemo(() => {
    return transactions
      .filter((t) => filters.type === "all" || t.type === filters.type)
      .filter((t) => {
        const categoryMatch = t.category
          ?.toLowerCase()
          .includes(filters.search.toLowerCase());
        const descriptionMatch = t.description
          ?.toLowerCase()
          .includes(filters.search.toLowerCase());
        return categoryMatch || descriptionMatch;
      })
      .sort((a, b) => {
        if (filters.sortBy === "amount") return b.amount - a.amount;
        return new Date(b.date) - new Date(a.date);
      });
  }, [transactions, filters]);

  const handleSave = (txData) => {
    setTransactions((prev) => {
      let updatedTransactions;
      if (editingTransaction) {
        updatedTransactions = prev.map((t) =>
          t.id === txData.id ? txData : t,
        );
      } else {
        const newEntry = { ...txData, id: Date.now() };
        updatedTransactions = [newEntry, ...prev];
      }

      localStorage.setItem(
        "zorvyn_transactions",
        JSON.stringify(updatedTransactions),
      );
      return updatedTransactions;
    });

    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Permanently delete this record?")) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      setOpenMenuId(null);
    }
  };

  return (
    <div className="p-4 md:p-8 mt-15 max-w-6xl mx-auto space-y-6 antialiased">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            Transactions
            {!isAdmin && (
              <span className="text-[9px] bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/30 px-2 py-1 rounded-lg border border-slate-200 dark:border-white/10 uppercase tracking-widest font-black">
                ReadOnly
              </span>
            )}
          </h1>
          <p className="text-slate-500 dark:text-white/40 text-sm font-medium">
            Manage and audit your cash flow
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <button
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-600 dark:text-white/60 text-xs font-bold hover:bg-slate-50 dark:hover:bg-white/10 transition shadow-sm"
            >
              <Download size={14} /> Export
            </button>
            {showExportOptions && (
              <>
                <div
                  className="fixed inset-0 z-50"
                  onClick={() => setShowExportOptions(false)}
                />
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#161f33] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-[60] overflow-hidden animate-in fade-in zoom-in duration-150">
                  <button
                    onClick={() => {
                      exportTransactions(filteredData, "json");
                      setShowExportOptions(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 dark:text-white/70 hover:bg-slate-50 dark:hover:bg-white/5"
                  >
                    <FileJson size={14} className="text-blue-500" /> JSON Data
                  </button>
                  <button
                    onClick={() => {
                      exportTransactions(filteredData, "csv");
                      setShowExportOptions(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 dark:text-white/70 hover:bg-slate-50 dark:hover:bg-white/5 border-t dark:border-white/5"
                  >
                    <Table size={14} className="text-emerald-500" /> Excel CSV
                  </button>
                </div>
              </>
            )}
          </div>

          {isAdmin && (
            <button
              onClick={() => {
                setEditingTransaction(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#4d8eff] dark:bg-[#adc6ff] text-white dark:text-[#002e6a] rounded-xl text-xs font-black shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
            >
              <Plus size={16} strokeWidth={3} /> Add Entry
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-[#0b1326] border border-slate-200 dark:border-white/5 p-4 rounded-2xl flex flex-wrap items-center gap-3 shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/20"
            size={16}
          />
          <input
            placeholder="Search category..."
            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4d8eff]/10 transition-all"
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        <CustomSelect
          options={TYPE_OPTIONS}
          value={filters.type}
          onChange={(val) => setFilters({ ...filters, type: val })}
        />

        <button
          onClick={() =>
            setFilters({
              ...filters,
              sortBy: filters.sortBy === "date" ? "amount" : "date",
            })
          }
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-500 dark:text-white/60 text-sm font-bold hover:text-slate-900 dark:hover:text-white transition"
        >
          <ArrowUpDown size={14} />{" "}
          {filters.sortBy === "date" ? "Sort: Date" : "Sort: Amount"}
        </button>
      </div>
      <div className="grid gap-3">
        {filteredData.length === 0 ? (
          <div className="text-center py-24 bg-slate-50 dark:bg-white/5 rounded-3xl border border-dashed dark:border-white/10">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
              No results found
            </p>
          </div>
        ) : (
          filteredData.map((t) => (
            <div
              key={t.id}
              className="group bg-white dark:bg-[#0b1326] border border-slate-200 dark:border-white/5 p-4 rounded-2xl flex items-center justify-between hover:border-[#4d8eff] dark:hover:border-[#adc6ff]/30 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm shadow-inner ${t.type === "income" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}`}
                >
                  {t.category.charAt(0)}
                </div>
                <div>
                  <p className="text-slate-900 dark:text-white font-bold text-sm tracking-tight">
                    {t.category}
                  </p>
                  <p className="text-slate-400 dark:text-white/30 text-[10px] uppercase font-black tracking-widest">
                    {new Date(t.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span
                  className={`font-black text-sm tracking-tighter ${t.type === "income" ? "text-emerald-500" : "text-slate-900 dark:text-white"}`}
                >
                  {t.type === "income" ? "+" : "-"} ₹{t.amount.toLocaleString()}
                </span>

                {isAdmin && (
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenMenuId(openMenuId === t.id ? null : t.id)
                      }
                      className="p-2 text-slate-300 dark:text-white/20 hover:text-slate-900 dark:hover:text-white transition"
                    >
                      <MoreVertical size={18} />
                    </button>
                    {openMenuId === t.id && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setOpenMenuId(null)}
                        />
                        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-[#161f33] border dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                          <button
                            onClick={() => {
                              setEditingTransaction(t);
                              setIsModalOpen(true);
                              setOpenMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-white/70 hover:bg-slate-50 dark:hover:bg-white/5"
                          >
                            <Edit3 size={14} className="text-blue-500" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 border-t dark:border-white/5"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSave}
        categories={CATEGORIES}
        editData={editingTransaction}
      />
    </div>
  );
}
