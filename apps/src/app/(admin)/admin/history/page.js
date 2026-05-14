'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminHistory() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedProject, setExpandedProject] = useState(null);
  const [filterStatus, setFilterStatus] = useState('SEMUA');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/admin/me')
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(d => setAdmin(d.admin))
      .catch(() => router.push('/admin/login'));

    fetch('/api/admin/history')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProjects(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [router]);

  const statuses = ['SEMUA', ...new Set(projects.map(p => p.status))];

  const filteredProjects = projects.filter(p => {
    const matchStatus = filterStatus === 'SEMUA' || p.status === filterStatus;
    const matchSearch = p.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.roomType?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Selesai': return 'bg-green-100 text-green-700';
      case 'Draft': return 'bg-slate-100 text-slate-600';
      case 'Pending': return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <svg className="animate-spin h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar adminName={admin?.name} />

      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-800">Riwayat Penggunaan</h1>
              <p className="text-sm text-slate-500">Semua proyek dan RAB yang dibuat pengguna</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200">
                {filteredProjects.length} proyek
              </span>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="relative w-full sm:max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Cari kode proyek atau tipe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>
            <div className="flex space-x-2">
              {statuses.map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border whitespace-nowrap transition-all ${
                    filterStatus === status
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Projects List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm text-slate-500">Belum ada riwayat proyek</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                  {/* Project Header */}
                  <div
                    className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors"
                    onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-bold text-slate-800">{project.code}</p>
                          <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full ${getStatusBadge(project.status)}`}>
                            {project.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {project.roomType} · {project.area} m² · Budget: Rp {project.budgetLimit?.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs text-slate-400">Tanggal</p>
                        <p className="text-sm font-medium text-slate-600">
                          {new Date(project.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="text-xs text-slate-400">Jumlah RAB</p>
                        <p className="text-sm font-bold text-slate-700">{project.rabs?.length || 0}</p>
                      </div>
                      <svg
                        className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${expandedProject === project.id ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Expanded RAB Details */}
                  {expandedProject === project.id && project.rabs?.length > 0 && (
                    <div className="border-t border-slate-100 bg-slate-50/50">
                      {project.rabs.map((rab) => (
                        <div key={rab.id} className="px-6 py-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="text-sm font-bold text-slate-700">{rab.documentCode}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-slate-400">Grand Total: </span>
                              <span className="text-sm font-bold font-mono text-slate-800">Rp {rab.grandTotal?.toLocaleString('id-ID')}</span>
                            </div>
                          </div>

                          {/* RAB Items Table */}
                          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  <th className="px-4 py-2 text-left">Uraian Pekerjaan</th>
                                  <th className="px-4 py-2 text-right">Volume</th>
                                  <th className="px-4 py-2 text-left">Satuan</th>
                                  <th className="px-4 py-2 text-right">Harga Satuan</th>
                                  <th className="px-4 py-2 text-right">Total</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {rab.items?.map((item, idx) => (
                                  <tr key={idx} className={item.volume === 0 ? 'bg-slate-50' : ''}>
                                    <td className={`px-4 py-2 ${item.volume === 0 ? 'font-bold text-slate-700 text-xs uppercase' : 'text-slate-600'}`}>
                                      {item.description}
                                    </td>
                                    <td className="px-4 py-2 text-right font-mono text-slate-600">
                                      {item.volume > 0 ? item.volume?.toFixed(2) : ''}
                                    </td>
                                    <td className="px-4 py-2 text-slate-500">
                                      {item.unit !== '-' ? item.unit : ''}
                                    </td>
                                    <td className="px-4 py-2 text-right font-mono text-slate-600">
                                      {item.unitPrice > 0 ? `Rp ${item.unitPrice?.toLocaleString('id-ID')}` : ''}
                                    </td>
                                    <td className="px-4 py-2 text-right font-mono font-medium text-slate-700">
                                      {item.totalPrice > 0 ? `Rp ${item.totalPrice?.toLocaleString('id-ID')}` : ''}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot className="bg-slate-50 border-t border-slate-200">
                                <tr>
                                  <td colSpan="4" className="px-4 py-2 text-right text-xs font-bold text-slate-500 uppercase">Sub Total</td>
                                  <td className="px-4 py-2 text-right font-mono font-bold text-slate-700">Rp {rab.subTotal?.toLocaleString('id-ID')}</td>
                                </tr>
                                <tr>
                                  <td colSpan="4" className="px-4 py-2 text-right text-xs font-bold text-slate-500 uppercase">PPN ({rab.taxRate}%)</td>
                                  <td className="px-4 py-2 text-right font-mono text-slate-600">Rp {((rab.subTotal * rab.taxRate) / 100)?.toLocaleString('id-ID')}</td>
                                </tr>
                                <tr className="border-t border-slate-200">
                                  <td colSpan="4" className="px-4 py-2 text-right text-xs font-bold text-slate-800 uppercase">Grand Total</td>
                                  <td className="px-4 py-2 text-right font-mono font-bold text-blue-600 text-base">Rp {rab.grandTotal?.toLocaleString('id-ID')}</td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {expandedProject === project.id && (!project.rabs || project.rabs.length === 0) && (
                    <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-6 text-center text-sm text-slate-400">
                      Belum ada dokumen RAB untuk proyek ini
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
