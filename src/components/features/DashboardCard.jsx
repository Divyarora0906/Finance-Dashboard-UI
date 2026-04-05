export default function DashboardCard({ label = "Label", value = "0", icon: Icon, color }) {
  return (
    <div className="bg-white dark:bg-[#0b1326] border border-slate-200 dark:border-white/5 rounded-3xl p-8 flex items-center gap-6 hover:shadow-xl dark:hover:bg-white/[0.03] transition-all duration-300 group">
      <div className={`p-4 rounded-2xl ${color} transition-transform group-hover:scale-110`}>
        {Icon && <Icon className="text-2xl" />}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-white/30">
          {label}
        </p>
        <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
          {value}
        </p>
      </div>
    </div>
  );
}