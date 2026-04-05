import React from 'react';
import { Search, Bell, Menu, Plus, Zap, ChevronDown } from 'lucide-react';
import { useApp } from "../../context/AppContext";
import { useLocation } from 'react-router-dom';

const Navbar = ({ onAction, toggleSidebar }) => {
  const { role } = useApp();
  const location = useLocation();
  
  // Dynamic page name logic
  const getPageName = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    return path.substring(1).replace('-', ' ');
  };

  const activePage = getPageName();

  return (
    <header className="fixed top-0 right-0 w-full lg:w-[calc(100%-16rem)] h-20 z-50 flex items-center justify-between px-4 md:px-8 bg-white/80 dark:bg-[#0b1326]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 transition-all duration-500">
      
      {/* LEFT: Mobile Menu Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        {/* Hamburger - Only visible on Mobile/Tablet (<1024px) */}
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-slate-500 dark:text-white/40 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors"
          aria-label="Open Menu"
        >
          <Menu size={24} />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[#4d8eff] dark:text-[#adc6ff] opacity-60">
            <Zap size={10} fill="currentColor" className="hidden xs:block" />
            <span>Platform</span>
            <ChevronDown size={10} className="-rotate-90 opacity-40" />
            <span className="text-slate-900 dark:text-white opacity-100">{activePage}</span>
          </div>
          <h1 className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tighter mt-0.5 capitalize truncate max-w-[120px] md:max-w-none">
            {activePage}
          </h1>
        </div>
      </div>

      {/* CENTER: Omni-Search Bar (Hidden on Mobile) */}
      <div className="hidden sm:flex flex-1 max-w-md mx-4 lg:mx-12">
        <div className="relative group w-full">
          <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-white/20 group-focus-within:text-[#4d8eff] dark:group-focus-within:text-[#adc6ff] transition-colors" 
            size={18} 
          />
          <input 
            type="text" 
            placeholder="Search Intelligence..."
            className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-2.5 pl-12 pr-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4d8eff]/20 dark:focus:ring-[#adc6ff]/20 focus:border-[#4d8eff]/40 dark:focus:border-[#adc6ff]/40 transition-all"
          />
        </div>
      </div>

      {/* RIGHT: Action Buttons & Notifications */}
      <div className="flex items-center gap-2 md:gap-4">
        {role === 'admin' ? (
          <button 
            onClick={onAction} 
            className="flex items-center gap-2 px-3 md:px-5 py-2.5 bg-[#4d8eff] dark:bg-[#adc6ff] text-white dark:text-[#002e6a] rounded-xl font-black text-[10px] uppercase transition-all shadow-[0_10px_20px_rgba(77,142,255,0.2)] active:scale-95 hover:opacity-90"
          >
            <Plus size={16} strokeWidth={3} />
            <span className="hidden md:inline">New Entry</span>
          </button>
        ) : (
          <div className="hidden xs:flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 text-[9px] font-black uppercase text-slate-400 dark:text-white/30 tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/20 animate-pulse" />
            Read Only
          </div>
        )}
        
        {/* Status Actions */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* Mobile Search Toggle (Visible only <640px) */}
          <button className="sm:hidden p-2.5 text-slate-400 dark:text-white/40 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all">
            <Search size={20} />
          </button>

          <button className="relative p-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white transition-all group">
            <Bell size={20} className="group-hover:rotate-12 transition-transform" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#4d8eff] dark:bg-[#adc6ff] rounded-full border-2 border-white dark:border-[#0b1326] shadow-[0_0_10px_#4d8eff]" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;