'use client';
import { useState, useEffect } from 'react';

export default function MaterialModal({ isOpen, onClose, onSave, editData }) {
  const [form, setForm] = useState({
    name: '',
    category: '',
    specs: '',
    unitPrice: '',
    unit: '',
    stockStatus: 'Tersedia',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name || '',
        category: editData.category || '',
        specs: editData.specs || '',
        unitPrice: editData.unitPrice?.toString() || '',
        unit: editData.unit || '',
        stockStatus: editData.stockStatus || 'Tersedia',
      });
    } else {
      setForm({
        name: '',
        category: '',
        specs: '',
        unitPrice: '',
        unit: '',
        stockStatus: 'Tersedia',
      });
    }
  }, [editData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const categories = ['Beton', 'Besi', 'Kayu', 'Keramik', 'Semen', 'Cat', 'Atap', 'Pipa', 'Listrik', 'Lainnya'];
  const units = ['m3', 'Batang', 'Dus', 'Sak', 'Lembar', 'Kg', 'Liter', 'Buah', 'Roll', 'm2', 'Meter'];
  const stockOptions = ['Tersedia', 'Stok Terbatas', 'Kosong'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto animate-[fadeInUp_0.3s_ease-out]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">
            {editData ? 'Edit Material' : 'Tambah Material Baru'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Nama Material <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Contoh: Beton K-350"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Category + Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
              >
                <option value="">Pilih kategori</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Satuan <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
              >
                <option value="">Pilih satuan</option>
                {units.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Harga Satuan (Rp) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                value={form.unitPrice}
                onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
                placeholder="0"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Status Stok
              </label>
              <select
                value={form.stockStatus}
                onChange={(e) => setForm({ ...form, stockStatus: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
              >
                {stockOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Specs */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Spesifikasi
            </label>
            <textarea
              rows={3}
              value={form.specs}
              onChange={(e) => setForm({ ...form, specs: e.target.value })}
              placeholder="Contoh: Strength: 350 kg/cm2, Origin: Ready Mix Local"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
            />
            <p className="text-xs text-slate-400 mt-1">Format: Key: Value, Key: Value</p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm disabled:opacity-60 transition-all"
            >
              {isSubmitting ? 'Menyimpan...' : editData ? 'Update Material' : 'Simpan Material'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
