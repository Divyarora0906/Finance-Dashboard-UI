export default function DashboardCard({ label = "Label", value = "0", icon: Icon, color }) {
  return (
    <div className="bg-white dark:bg-[#0b1326] border border-slate-200 dark:border-white/5 rounded-3xl p-5 md:p-8 flex items-center gap-4 md:gap-6 hover:shadow-xl dark:hover:bg-white/[0.03] transition-all duration-300 group w-full overflow-hidden">
      
      <div className={`p-3 md:p-4 rounded-2xl flex-shrink-0 ${color} transition-transform group-hover:scale-110`}>
        {Icon && <Icon className="text-xl md:text-2xl" />}
      </div>

      <div className="min-w-0"> {/* min-w-0 prevents text from pushing card width */}
        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-slate-400 dark:text-white/30 truncate">
          {label}
        </p>
        <p className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter md:tracking-tight mt-0.5 md:mt-1 truncate">
          {value}
        </p>
      </div>
    </div>
  );
}