'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Estimator() {
  const router = useRouter();
  const [area, setArea] = useState(25);
  const [budget, setBudget] = useState(12500000);
  const [roomType, setRoomType] = useState('Living Room');
  const [preference, setPreference] = useState('quality');
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ area, budgetLimit: budget, roomType, preference })
      });
      const data = await res.json();
      
      if (data.success && data.rabId) {
        if (data.isOptimized) {
          // Beri tahu user bahwa RAB telah dioptimasi
          alert(
            `⚡ Budget Anda Rp ${budget.toLocaleString('id-ID')} lebih rendah dari estimasi standar.\n\n` +
            `RAB telah dioptimasi agar sesuai budget.\n` +
            `Total Akhir: Rp ${data.grandTotal.toLocaleString('id-ID')}\n\n` +
            `Klik OK untuk melihat detail RAB.`
          );
        }
        router.push(`/rab/${data.rabId}`);
      } else {
        alert("Gagal melakukan kalkulasi: " + (data.error || "Unknown error"));
        setIsCalculating(false);
      }
    } catch (error) {
      console.error('Calculation error:', error);
      alert("Terjadi kesalahan sistem saat menghubungi Engine Kalkulasi.");
      setIsCalculating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-navy mb-4">Estimator Proyek</h2>
            <p className="text-slate-600 text-sm mb-6">
              Gunakan RenoAI untuk mendapatkan perhitungan material dan biaya renovasi yang presisi sesuai standar konstruksi nasional (SNI).
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm text-slate-700">
                <div className="p-2 bg-slate-100 rounded border border-slate-200">
                  <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                </div>
                <span className="font-medium">Algoritma Akurasi 98%</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-slate-700">
                <div className="p-2 bg-slate-100 rounded border border-slate-200">
                  <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </div>
                <span className="font-medium">Update Harga Material Mingguan</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="font-bold text-navy uppercase text-sm mb-2">PRO TIP</h3>
            <p className="text-slate-600 text-sm">
              Luas area yang tepat membantu kami menghitung jumlah keramik dan cat lebih akurat.
            </p>
          </div>
        </div>

        {/* Main Form Area */}
        <div className="w-full md:w-2/3">
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-4 mb-6">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <h2 className="text-xl font-bold text-navy">Parameter Proyek</h2>
            </div>

            {/* Room Type Selector */}
            <div className="mb-8">
              <label className="block text-xs font-bold text-slate-500 tracking-wider uppercase mb-3">Pilih Tipe Ruangan</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Living Room', 'Kitchen', 'Bathroom', 'Bedroom'].map(type => (
                  <button 
                    key={type}
                    onClick={() => setRoomType(type)}
                    className={`py-4 px-2 rounded-lg border-2 flex flex-col items-center justify-center space-y-2 transition-all ${roomType === type ? 'border-primary bg-blue-50 text-primary' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
                  >
                    <div className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm border border-slate-100">
                      {type === 'Living Room' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
                      {type === 'Kitchen' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>}
                      {type === 'Bathroom' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
                      {type === 'Bedroom' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
                    </div>
                    <span className="text-sm font-medium">{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Area Input */}
            <div className="mb-8">
              <label className="block text-xs font-bold text-slate-500 tracking-wider uppercase mb-3">Luas Area Pengerjaan</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative flex-1 w-full max-w-xs">
                  <input 
                    type="number" 
                    value={area}
                    onChange={(e) => setArea(Number(e.target.value))}
                    className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg font-mono text-navy"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500 font-mono">
                    m&sup2;
                  </div>
                </div>
                <div className="bg-blue-50 text-blue-700 text-xs p-3 rounded-md border border-blue-100 flex-1 w-full flex items-start space-x-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>Standar ruangan minimal adalah 4m&sup2; untuk fungsionalitas optimal.</span>
                </div>
              </div>
            </div>

            {/* Budget Slider */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-3">
                <label className="block text-xs font-bold text-slate-500 tracking-wider uppercase">Estimasi Anggaran</label>
                <div className="bg-slate-100 px-3 py-1 rounded border border-slate-200 font-mono text-navy font-bold">
                  Rp {budget.toLocaleString('id-ID')}
                </div>
              </div>
              <input 
                type="range" 
                min="1000000" 
                max="50000000" 
                step="500000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between mt-2 text-xs text-slate-400 font-mono">
                <span>RP 1M</span>
                <span>RP 50M</span>
              </div>
            </div>

            {/* Preference */}
            <div className="mb-8">
              <label className="block text-xs font-bold text-slate-500 tracking-wider uppercase mb-3">Preferensi Material</label>
              <div className="flex rounded-md shadow-sm" role="group">
                <button 
                  type="button" 
                  onClick={() => setPreference('quality')}
                  className={`flex-1 py-3 px-4 text-sm font-medium border rounded-l-md flex items-center justify-center space-x-2 ${preference === 'quality' ? 'bg-navy text-white border-navy' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                  <span>Fokus Kualitas</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => setPreference('economy')}
                  className={`flex-1 py-3 px-4 text-sm font-medium border-t border-b border-r rounded-r-md flex items-center justify-center space-x-2 ${preference === 'economy' ? 'bg-navy text-white border-navy' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>Fokus Hemat</span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4 border-t border-slate-100">
              <button 
                onClick={handleCalculate}
                disabled={isCalculating}
                className="w-full sm:flex-1 bg-primary hover:bg-blue-600 text-white py-3 rounded-md font-bold flex justify-center items-center space-x-2 transition-colors disabled:opacity-70"
              >
                {isCalculating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>MEMPROSES AI...</span>
                  </>
                ) : (
                  <>
                    <span>PROSES PERHITUNGAN</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  </>
                )}
              </button>
              <button 
                onClick={() => { setArea(25); setBudget(12500000); setRoomType('Living Room'); }}
                className="w-full sm:w-auto px-6 py-3 border border-slate-300 rounded-md font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                RESET
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
