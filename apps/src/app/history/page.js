'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function History() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/history')
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) setProjects(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch history:", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">Riwayat Proyek</h1>
          <p className="text-slate-600">Pantau dan kelola semua estimasi anggaran biaya (RAB) Anda.</p>
        </div>
        <Link href="/estimator" className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-md font-semibold text-sm flex items-center space-x-2 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          <span>Proyek Baru</span>
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Kode Proyek
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Nama Proyek
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Estimasi Biaya
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-sm text-slate-500">
                    Memuat riwayat proyek dari database...
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-sm text-slate-500">
                    Belum ada riwayat proyek. Silakan buat proyek baru melalui Estimator.
                  </td>
                </tr>
              ) : projects.map((project) => (
                <tr key={project.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono font-medium text-navy">{project.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-900">{project.name}</div>
                    <div className="text-xs text-slate-500">{project.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-500">{project.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono font-bold text-navy">Rp {project.budget?.toLocaleString('id-ID')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      project.status === 'Selesai' ? 'bg-green-100 text-green-800' : 
                      project.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      {project.rabId ? (
                        <Link href={`/rab/${project.rabId}`} className="text-primary hover:text-blue-700">Lihat RAB</Link>
                      ) : (
                        <span className="text-slate-400">Tidak ada RAB</span>
                      )}
                      <button onClick={() => alert("Menu opsi (Edit/Hapus) sedang dalam pengembangan.")} className="text-slate-400 hover:text-slate-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
