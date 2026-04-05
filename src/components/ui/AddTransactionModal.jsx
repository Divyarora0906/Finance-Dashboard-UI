import React, { useState, useEffect, useRef } from "react";
import { X, ChevronDown, Check } from "lucide-react";

const CustomSelect = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-white/5 border rounded-xl text-sm font-bold transition-all duration-300
          ${isOpen 
            ? "border-[#4d8eff] dark:border-[#adc6ff] ring-4 ring-[#4d8eff]/10" 
            : "border-slate-200 dark:border-white/10"
          } text-slate-900 dark:text-white/90`}
      >
        <span>{value}</span>
        <ChevronDown size={16} className={`transition-transform duration-300 text-slate-400 ${isOpen ? "rotate-180 text-[#4d8eff]" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-[#161f33] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl z-[110]  animate-in fade-in zoom-in-95 duration-200">
          <div className="p-1.5 max-h-48 overflow-y-auto custom-scrollbar">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setIsOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-black rounded-lg transition-all ${
                  value === opt 
                    ? "bg-[#4d8eff]/10 text-[#4d8eff] dark:bg-[#adc6ff]/10 dark:text-[#adc6ff]" 
                    : "text-slate-500 dark:text-white/40 hover:bg-slate-50 dark:hover:bg-white/5"
                }`}
              >
                {opt}
                {value === opt && <Check size={14} strokeWidth={3} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function TransactionModal({ isOpen, onClose, onSave, categories, editData = null }) {
  const [formData, setFormData] = useState({
    amount: "",
    category: categories[0],
    type: "expense",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        ...editData,
        date: new Date(editData.date).toISOString().split("T")[0]
      });
    } else {
      setFormData({
        amount: "",
        category: categories[0],
        type: "expense",
        date: new Date().toISOString().split("T")[0],
      });
    }
  }, [editData, isOpen, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || formData.amount <= 0) return;
    
    onSave({
      ...formData,
      id: editData ? editData.id : Date.now(),
      amount: parseFloat(formData.amount),
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#0b1326] border border-slate-200 dark:border-white/10 w-full max-w-md rounded-[2rem] shadow-2xl  relative transition-all">
        
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full transition-all active:scale-90"
        >
          <X size={18}/>
        </button>

        <div className="p-8">
          <header className="mb-8">
            <h3 className="text-slate-900 dark:text-white font-black text-2xl tracking-tighter">
              {editData ? "Update Record" : "New Transaction"}
            </h3>
            <p className="text-slate-500 dark:text-white/30 text-xs font-bold uppercase tracking-widest mt-1">
              {editData ? "Modify existing entry" : "Add to your ledger"}
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* TYPE TOGGLE */}
            <div className="space-y-3">
              <label className="block text-[10px] uppercase text-slate-400 dark:text-white/20 font-black tracking-[0.2em] ml-1">Flow Direction</label>
              <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5">
                {['income', 'expense'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: t })}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                      formData.type === t 
                        ? "bg-white dark:bg-[#adc6ff] text-[#4d8eff] dark:text-[#002e6a] shadow-xl shadow-blue-500/10" 
                        : "text-slate-400 dark:text-white/20 hover:text-slate-600 dark:hover:text-white/40"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="block text-[10px] uppercase text-slate-400 dark:text-white/20 font-black tracking-[0.2em] ml-1">Amount (₹)</label>
                <input
                  required
                  type="number"
                  placeholder="0.00"
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-[#4d8eff]/10 dark:focus:border-[#adc6ff] outline-none transition-all placeholder:opacity-20"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] uppercase text-slate-400 dark:text-white/20 font-black tracking-[0.2em] ml-1">Date</label>
                <input
                  type="date"
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-[#4d8eff]/10 dark:focus:border-[#adc6ff] outline-none transition-all dark:[color-scheme:dark]"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] uppercase text-slate-400 dark:text-white/20 font-black tracking-[0.2em] ml-1">Category</label>
              <CustomSelect 
                options={categories} 
                value={formData.category} 
                onChange={(val) => setFormData({ ...formData, category: val })} 
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#4d8eff] dark:bg-[#adc6ff] text-white dark:text-[#002e6a] font-black py-4 rounded-2xl mt-4 hover:brightness-110 hover:shadow-2xl hover:shadow-blue-500/20 transition-all active:scale-[0.98] uppercase text-[11px] tracking-[0.2em]"
            >
              {editData ? "Update Entry" : "Confirm Transaction"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}