export default function StatCard({ title, value, icon, color = 'blue', subtitle }) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50',
      iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
      text: 'text-blue-600',
      border: 'border-blue-100',
    },
    green: {
      bg: 'bg-emerald-50',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
    },
    purple: {
      bg: 'bg-purple-50',
      iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
      text: 'text-purple-600',
      border: 'border-purple-100',
    },
    amber: {
      bg: 'bg-amber-50',
      iconBg: 'bg-gradient-to-br from-amber-500 to-amber-600',
      text: 'text-amber-600',
      border: 'border-amber-100',
    },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <div className={`bg-white rounded-xl border ${c.border} p-5 hover:shadow-lg transition-all duration-300 group`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1.5">{subtitle}</p>
          )}
        </div>
        <div className={`w-11 h-11 ${c.iconBg} rounded-xl flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
