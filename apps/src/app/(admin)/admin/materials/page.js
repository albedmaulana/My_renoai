'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import MaterialModal from '@/components/admin/MaterialModal';

export default function AdminMaterials() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('SEMUA');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetch('/api/admin/me')
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(d => setAdmin(d.admin))
      .catch(() => router.push('/admin/login'));

    fetchMaterials();
  }, [router]);

  const fetchMaterials = () => {
    setIsLoading(true);
    fetch('/api/admin/materials')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMaterials(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  const handleSave = async (formData) => {
    const url = editingMaterial
      ? `/api/admin/materials/${editingMaterial.id}`
      : '/api/admin/materials';
    const method = editingMaterial ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      fetchMaterials();
      setEditingMaterial(null);
    } else {
      const err = await res.json();
      alert(err.error || 'Gagal menyimpan');
      throw new Error(err.error);
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/admin/materials/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchMaterials();
      setDeleteConfirm(null);
    } else {
      alert('Gagal menghapus material');
    }
  };

  const categories = ['SEMUA', ...new Set(materials.map(m => m.category?.toUpperCase()))];

  const filteredMaterials = materials.filter(m => {
    const matchCategory = activeCategory === 'SEMUA' || m.category?.toUpperCase() === activeCategory;
    const matchSearch = m.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const getStockBadge = (status) => {
    switch (status) {
      case 'Tersedia': return 'bg-green-100 text-green-700';
      case 'Stok Terbatas': return 'bg-amber-100 text-amber-700';
      case 'Kosong': return 'bg-red-100 text-red-700';
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
              <h1 className="text-xl font-bold text-slate-800">Manajemen Material</h1>
              <p className="text-sm text-slate-500">Kelola katalog material konstruksi</p>
            </div>
            <button
              onClick={() => { setEditingMaterial(null); setIsModalOpen(true); }}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Tambah Material</span>
            </button>
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
                placeholder="Cari material..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Materials Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-3 text-left">Material</th>
                    <th className="px-6 py-3 text-left">Kategori</th>
                    <th className="px-6 py-3 text-left">Harga Satuan</th>
                    <th className="px-6 py-3 text-left">Satuan</th>
                    <th className="px-6 py-3 text-left">Status Stok</th>
                    <th className="px-6 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-sm text-slate-400">
                        <svg className="animate-spin h-6 w-6 text-blue-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Memuat data material...
                      </td>
                    </tr>
                  ) : filteredMaterials.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-sm text-slate-400">
                        {searchTerm || activeCategory !== 'SEMUA' ? 'Tidak ada material yang cocok' : 'Belum ada material. Klik "Tambah Material" untuk memulai.'}
                      </td>
                    </tr>
                  ) : (
                    filteredMaterials.map((material) => (
                      <tr key={material.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{material.name}</p>
                              <p className="text-xs text-slate-400 truncate max-w-[200px]">{material.specs}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded">
                            {material.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-mono font-semibold text-slate-700">
                          Rp {material.unitPrice?.toLocaleString('id-ID')}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{material.unit}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getStockBadge(material.stockStatus)}`}>
                            {material.stockStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => { setEditingMaterial(material); setIsModalOpen(true); }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(material)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                              title="Hapus"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-500">
              Menampilkan {filteredMaterials.length} dari {materials.length} material
            </div>
          </div>
        </div>
      </main>

      {/* Material Modal */}
      <MaterialModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingMaterial(null); }}
        onSave={handleSave}
        editData={editingMaterial}
      />

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Hapus Material?</h3>
                <p className="text-sm text-slate-500">{deleteConfirm.name}</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-6">Tindakan ini tidak dapat dibatalkan. Material akan dihapus secara permanen dari database.</p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
