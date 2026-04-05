import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

/**
 * @param {Array} options 
 * @param {string} value 
 * @param {function} onChange 
 */
const CustomSelect = ({ options, value, onChange, placeholder = "Select..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative inline-block w-full sm:w-48" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-bold rounded-xl border transition-all duration-300 outline-none
          ${isOpen 
            ? "bg-white dark:bg-[#0b1326] border-[#4d8eff] dark:border-[#adc6ff] shadow-[0_0_15px_rgba(173,198,255,0.1)]" 
            : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
          }
          text-slate-700 dark:text-white/80`}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-300 text-slate-400 ${isOpen ? "rotate-180 text-[#4d8eff] dark:text-[#adc6ff]" : ""}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 p-1.5 bg-white dark:bg-[#0b1326] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl z-[100] animate-in fade-in zoom-in-95 duration-200">
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 mb-0.5 text-xs font-black rounded-lg transition-all
                    ${isSelected 
                      ? "bg-[#4d8eff]/10 text-[#4d8eff] dark:bg-[#adc6ff]/10 dark:text-[#adc6ff]" 
                      : "text-slate-500 dark:text-white/40 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                    }`}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && <Check size={14} strokeWidth={3} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;