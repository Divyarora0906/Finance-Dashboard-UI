import React from "react";
import {
  LayoutDashboard,
  ReceiptText,
  Settings,
  LogOut,
  ChevronRight,
  Sun,
  Moon,
  UserCog,
  Eye,
  Zap,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const Sidebar = ({ isOpen, onClose }) => {
  const { role, setRole, isDark, setIsDark } = useApp();
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/",
      roles: ["admin", "viewer"],
    },
    {
      id: "transactions",
      label: "Transactions",
      icon: ReceiptText,
      path: "/transactions",
      roles: ["admin", "viewer"],
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          className={`
      fixed inset-0 z-[55] lg:hidden transition-opacity duration-300 backdrop-blur-sm
      ${isDark ? "bg-slate-900/60" : "bg-slate-400/20"}
    `}
          onClick={onClose}
        />
      )}

      <aside
        className={`
        fixed left-0 top-0 h-screen w-64 bg-white dark:bg-[#0b1326] border-r border-slate-200 dark:border-white/5 
        flex flex-col z-[60] font-sans antialiased transition-all duration-500 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="p-8 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#4d8eff] dark:bg-[#adc6ff] rounded-xl flex items-center justify-center shadow-lg dark:shadow-[0_0_20px_rgba(173,198,255,0.3)]">
              <Zap
                className="text-white dark:text-[#002e6a]"
                size={20}
                fill="currentColor"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
                Zorvyn
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#4d8eff] dark:text-[#adc6ff] font-black mt-1">
                Finance
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-2 text-slate-400 hover:text-rose-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1.5">
          <p className="px-4 text-[10px] uppercase tracking-widest text-slate-400 dark:text-white/30 font-black mb-4">
            Main Menu
          </p>

          {menuItems.map((item) => {
            if (!item.roles.includes(role)) return null;
            const Icon = item.icon;

            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `
                  w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden
                  ${
                    isActive
                      ? "bg-[#4d8eff]/10 dark:bg-[#adc6ff]/10 text-[#4d8eff] dark:text-[#adc6ff]"
                      : "text-slate-500 dark:text-white/50 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute left-0 top-0 w-1 h-full bg-[#4d8eff] dark:bg-[#adc6ff] shadow-[4px_0_15px_rgba(77,142,255,0.5)]" />
                    )}
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-sm font-bold tracking-tight">
                      {item.label}
                    </span>
                    {isActive ? (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#4d8eff] dark:bg-[#adc6ff] animate-pulse" />
                    ) : (
                      <ChevronRight
                        size={14}
                        className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="px-4 pb-6 space-y-3">
          <div className="p-1 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 flex gap-1">
            <button
              onClick={() => setRole(role === "admin" ? "viewer" : "admin")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all ${
                role === "admin"
                  ? "bg-[#4d8eff] dark:bg-[#adc6ff] text-white dark:text-[#002e6a]"
                  : "text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {role === "admin" ? <UserCog size={14} /> : <Eye size={14} />}
              {role}
            </button>

            <button
              onClick={() => setIsDark(!isDark)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all ${
                isDark
                  ? "text-white/40 hover:text-yellow-400"
                  : "bg-amber-100 text-amber-700 border border-amber-200"
              }`}
            >
              {isDark ? <Moon size={14} /> : <Sun size={14} />}
              {isDark ? "Dark" : "Light"}
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-white/5">
          <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4d8eff] to-[#adc6ff] flex items-center justify-center text-white dark:text-[#001a42] font-black text-sm shadow-md">
              {role === "admin" ? "AZ" : "GV"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-slate-900 dark:text-white truncate leading-tight">
                {role === "admin" ? "Admin" : "Guest Viewer"}
              </span>
              <span className="text-[10px] uppercase font-black text-[#4d8eff] dark:text-[#adc6ff] opacity-70">
                {role} Account
              </span>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="ml-auto p-1.5 rounded-lg text-slate-300 dark:text-white/20 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
