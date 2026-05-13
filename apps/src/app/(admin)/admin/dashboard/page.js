'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import StatCard from '@/components/admin/StatCard';

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check auth
    fetch('/api/admin/me')
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(d => setAdmin(d.admin))
      .catch(() => router.push('/admin/login'));

    // Fetch dashboard data
    fetch('/api/admin/dashboard')
      .then(res => {
        if (!res.ok) throw new Error('Failed');
        return res.json();
      })
      .then(d => {
        setData(d);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [router]);

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="flex items-center space-x-3 text-slate-500">
          <svg className="animate-spin h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Memuat...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar adminName={admin?.name} />

      <main className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
              <p className="text-sm text-slate-500">Selamat datang kembali, {admin?.name || 'Admin'}!</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-xs text-slate-400 font-mono">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Total Material"
                  value={data?.stats?.totalMaterials || 0}
                  color="blue"
                  subtitle="Item dalam katalog"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  }
                />
                <StatCard
                  title="Total Proyek"
                  value={data?.stats?.totalProjects || 0}
                  color="green"
                  subtitle="Proyek terdaftar"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  }
                />
                <StatCard
                  title="Total RAB"
                  value={data?.stats?.totalRabs || 0}
                  color="purple"
                  subtitle="Dokumen RAB dibuat"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  }
                />
                <StatCard
                  title="Total Revenue"
                  value={`Rp ${(data?.stats?.totalRevenue || 0).toLocaleString('id-ID')}`}
                  color="amber"
                  subtitle="Estimasi total"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Recent Projects */}
                <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800">Proyek Terbaru</h3>
                    <button
                      onClick={() => router.push('/admin/history')}
                      className="text-sm text-blue-500 hover:text-blue-600 font-medium"
                    >
                      Lihat Semua →
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          <th className="px-6 py-3 text-left">Kode</th>
                          <th className="px-6 py-3 text-left">Tipe</th>
                          <th className="px-6 py-3 text-left">Luas</th>
                          <th className="px-6 py-3 text-left">Budget</th>
                          <th className="px-6 py-3 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {data?.recentProjects?.length > 0 ? (
                          data.recentProjects.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-3 text-sm font-mono font-medium text-slate-700">{p.code}</td>
                              <td className="px-6 py-3 text-sm text-slate-600">{p.roomType}</td>
                              <td className="px-6 py-3 text-sm text-slate-600">{p.area} m²</td>
                              <td className="px-6 py-3 text-sm font-mono text-slate-700">Rp {p.budgetLimit?.toLocaleString('id-ID')}</td>
                              <td className="px-6 py-3">
                                <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                                  p.status === 'Selesai' ? 'bg-green-100 text-green-700' :
                                  p.status === 'Draft' ? 'bg-slate-100 text-slate-600' :
                                  'bg-amber-100 text-amber-700'
                                }`}>
                                  {p.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-6 py-8 text-center text-sm text-slate-400">
                              Belum ada proyek
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Category Breakdown */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                  <div className="px-6 py-4 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800">Material per Kategori</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    {data?.materialsByCategory?.length > 0 ? (
                      data.materialsByCategory.map((cat) => {
                        const total = data.stats.totalMaterials || 1;
                        const percentage = Math.round((cat._count.id / total) * 100);
                        const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-pink-500', 'bg-cyan-500'];
                        const colorIndex = data.materialsByCategory.indexOf(cat) % colors.length;
                        return (
                          <div key={cat.category}>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-sm font-medium text-slate-700">{cat.category}</span>
                              <span className="text-xs font-mono text-slate-500">{cat._count.id} item ({percentage}%)</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2">
                              <div
                                className={`${colors[colorIndex]} h-2 rounded-full transition-all duration-700`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-slate-400 text-center py-8">Belum ada data</p>
                    )}

                    {/* Status Breakdown */}
                    {data?.projectsByStatus?.length > 0 && (
                      <div className="pt-4 mt-4 border-t border-slate-100">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Status Proyek</h4>
                        <div className="space-y-2">
                          {data.projectsByStatus.map((s) => (
                            <div key={s.status} className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  s.status === 'Selesai' ? 'bg-green-500' :
                                  s.status === 'Draft' ? 'bg-slate-400' :
                                  'bg-amber-500'
                                }`}></div>
                                <span className="text-sm text-slate-600">{s.status}</span>
                              </div>
                              <span className="text-sm font-bold text-slate-700">{s._count.id}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
