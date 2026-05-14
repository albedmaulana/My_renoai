'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function RABDetail() {
  const params = useParams();
  const [rab, setRab] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetch(`/api/rab/${params.id}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) setRab(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch RAB:", err);
          setIsLoading(false);
        });
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <svg className="animate-spin h-10 w-10 text-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-slate-500">Mempersiapkan Dokumen RAB...</p>
      </div>
    );
  }

  if (!rab) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-navy mb-2">Dokumen Tidak Ditemukan</h2>
        <p className="text-slate-500 mb-6">RAB yang Anda cari tidak ada di dalam database.</p>
        <Link href="/history" className="text-primary hover:underline font-semibold">Kembali ke Riwayat</Link>
      </div>
    );
  }

  const project = rab.project;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 print:hidden">
        <div className="mb-4 sm:mb-0">
          <div className="text-sm text-slate-500 mb-1">
            <Link href="/history" className="hover:text-primary">Riwayat Proyek</Link> &gt; Preview RAB #{rab.documentCode}
          </div>
          <h1 className="text-2xl font-bold text-navy">Dokumen RAB Resmi</h1>
          <p className="text-slate-600 text-sm">Review detail anggaran biaya sebelum melakukan ekspor final.</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => window.print()} className="flex items-center space-x-2 bg-navy hover:bg-slate-800 text-white px-4 py-2 rounded-md font-semibold text-sm transition-colors shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            <span>DOWNLOAD PDF</span>
          </button>
        </div>
      </div>

      {/* Document Layout */}
      <div className="bg-white border border-slate-300 shadow-lg p-8 md:p-12 font-sans text-slate-800 rounded-sm relative overflow-hidden print:shadow-none print:border-none print:p-0">
        
        {/* Document Header */}
        <div className="flex justify-between items-start border-b-2 border-navy pb-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 border-2 border-navy flex items-center justify-center">
              <svg className="w-8 h-8 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-navy">RENOAI PRECISION</h2>
              <p className="text-xs tracking-widest font-bold text-slate-500 mt-1">STRUCTURAL ENGINEERING & COST ANALYSIS</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-slate-500 tracking-wider">KODE DOKUMEN</div>
            <div className="font-mono font-bold text-navy text-lg">{rab.documentCode}</div>
            <div className="text-xs text-slate-500 mt-1 uppercase">DITERBITKAN: {new Date(rab.createdAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}</div>
          </div>
        </div>

        {/* Project Info */}
        <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
          <div>
            <h3 className="font-bold text-navy mb-3 uppercase tracking-wider text-xs border-b border-slate-200 pb-1 inline-block">INFORMASI PROYEK</h3>
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="py-1 text-slate-500 w-32">Kode Proyek</td>
                  <td className="py-1 font-semibold font-mono">: {project.code}</td>
                </tr>
                <tr>
                  <td className="py-1 text-slate-500">Tipe Ruangan</td>
                  <td className="py-1 font-semibold">: {project.roomType}</td>
                </tr>
                <tr>
                  <td className="py-1 text-slate-500">Luas Area</td>
                  <td className="py-1 font-semibold">: {project.area} m&sup2;</td>
                </tr>
                <tr>
                  <td className="py-1 text-slate-500">Batas Anggaran</td>
                  <td className="py-1 font-semibold">: Rp {project.budgetLimit.toLocaleString('id-ID')}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <h3 className="font-bold text-navy mb-3 uppercase tracking-wider text-xs border-b border-slate-200 pb-1 inline-block">PEMILIK PROYEK</h3>
            <div className="font-semibold text-base mb-1">{project.user?.name || 'Pengguna RenoAI'}</div>
            <div className="text-slate-500">{project.user?.email || 'Klien Sistem Terdaftar'}</div>
            <div className="text-slate-500 mt-2 font-mono text-xs">ID: {project.id.split('-')[0]}</div>
            {project.status === 'Dioptimasi' && (
              <div className="mt-3 bg-amber-50 border border-amber-200 text-amber-700 text-xs px-3 py-2 rounded-md">
                ⚡ RAB ini telah dioptimasi agar sesuai dengan batas anggaran Anda.
              </div>
            )}
          </div>
        </div>

        {/* RAB Table */}
        <div className="mb-6">
          <h3 className="font-bold text-navy mb-3 uppercase tracking-wider text-sm">RINCIAN ANGGARAN BIAYA (RAB)</h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 border-t border-b border-slate-300">
                <th className="py-2 px-3 text-left font-bold text-slate-600 w-12 border-r border-slate-300">NO</th>
                <th className="py-2 px-3 text-left font-bold text-slate-600 border-r border-slate-300">DESKRIPSI PEKERJAAN</th>
                <th className="py-2 px-3 text-center font-bold text-slate-600 w-16 border-r border-slate-300">VOL</th>
                <th className="py-2 px-3 text-center font-bold text-slate-600 w-16 border-r border-slate-300">SAT</th>
                <th className="py-2 px-3 text-right font-bold text-slate-600 w-32 border-r border-slate-300">HARGA SATUAN</th>
                <th className="py-2 px-3 text-right font-bold text-slate-600 w-36">TOTAL HARGA</th>
              </tr>
            </thead>
            <tbody>
              {rab.items.map((item, idx) => {
                const isHeader = item.volume === 0;
                return (
                  <tr key={item.id} className={`border-b border-slate-200 ${isHeader ? 'bg-slate-50' : ''}`}>
                    <td className={`py-2 px-3 text-left border-r border-slate-300 font-mono ${isHeader ? 'font-bold' : 'text-slate-500'}`}>
                      {isHeader ? Math.floor(idx/2 + 1) : `.`}
                    </td>
                    <td className={`py-2 px-3 text-left border-r border-slate-300 ${isHeader ? 'font-bold uppercase text-navy' : 'pl-6'}`}>
                      {item.description}
                    </td>
                    <td className="py-2 px-3 text-center border-r border-slate-300 font-mono">{isHeader ? '' : item.volume}</td>
                    <td className="py-2 px-3 text-center border-r border-slate-300 font-mono">{isHeader ? '' : item.unit}</td>
                    <td className="py-2 px-3 text-right border-r border-slate-300 font-mono">
                      {isHeader ? '' : `Rp ${item.unitPrice.toLocaleString('id-ID')}`}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-semibold text-navy">
                      {isHeader ? '' : `Rp ${item.totalPrice.toLocaleString('id-ID')}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals & Notes */}
        <div className="flex justify-between items-end mb-12">
          <div className="w-1/2">
            <div className="text-xs font-bold text-slate-500 uppercase mb-2">Catatan:</div>
            <ol className="list-decimal list-inside text-xs text-slate-600 space-y-1">
              <li>Harga sudah termasuk PPN ({rab.taxRate}%)</li>
              <li>Estimasi berlaku selama 14 hari kerja sejak diterbitkan</li>
              <li>Harga material fluktuatif mengikuti pasar nasional</li>
            </ol>
          </div>
          
          <div className="w-1/2 max-w-sm">
            <div className="flex justify-between py-2 border-b border-slate-200 text-sm">
              <span className="font-semibold text-slate-600">Subtotal</span>
              <span className="font-mono font-bold">Rp {rab.subTotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-200 text-sm">
              <span className="font-semibold text-slate-600">Pajak (PPN {rab.taxRate}%)</span>
              <span className="font-mono font-bold">Rp {((rab.subTotal * rab.taxRate)/100).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-200 text-sm">
              <span className="font-semibold text-slate-600">Jasa Pelaksana (10%)</span>
              <span className="font-mono font-bold">Rp {((rab.subTotal * 10)/100).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between py-3 border-b-2 border-navy text-lg mt-2">
              <span className="font-bold text-navy uppercase tracking-wider">TOTAL AKHIR</span>
              <span className="font-mono font-bold text-navy">Rp {rab.grandTotal.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        {/* Status watermark */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[150px] font-bold text-slate-100 opacity-50 rotate-[-45deg] pointer-events-none select-none">
          {project.status === 'Dioptimasi' ? 'OPTIMIZED' : 'DRAFT'}
        </div>

        {/* Signatures */}
        <div className="flex justify-between text-center pt-8 px-12 relative z-10">
          <div>
            <div className="text-sm mb-16">Disiapkan Oleh,</div>
            <div className="font-bold border-b border-slate-300 pb-1 px-4 inline-block">RenoAI Precision Engine</div>
            <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">AUTOMATED CALCULATION SYSTEM</div>
          </div>
          
          <div className="flex flex-col items-center justify-end">
            <div className="w-16 h-16 border-2 border-slate-300 rounded-full flex items-center justify-center text-xs font-bold text-slate-400 rotate-[-15deg] opacity-60 mb-2 bg-white">
              VERIFIED
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest bg-white px-2">DIGITAL VERIFIED DOCUMENT</div>
          </div>

          <div>
            <div className="text-sm mb-16">Menyetujui,</div>
            <div className="font-bold border-b border-slate-300 pb-1 px-4 text-transparent inline-block select-none bg-slate-100 w-32 h-6 mb-1">
              -
            </div>
            <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">PEMILIK PROYEK / OWNER</div>
          </div>
        </div>

      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-6 mt-8 print:hidden">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-5 flex space-x-4">
          <div className="bg-white p-2 rounded-full border border-blue-200 h-fit">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <h4 className="font-bold text-navy mb-1">Akurasi Material</h4>
            <p className="text-sm text-slate-600">Data material disinkronisasi dengan database konstruksi nasional terbaru.</p>
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 flex space-x-4">
          <div className="bg-white p-2 rounded-full border border-slate-200 h-fit">
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <div>
            <h4 className="font-bold text-navy mb-1">Keamanan Dokumen</h4>
            <p className="text-sm text-slate-600">Dokumen ini dilengkapi dengan checksum digital untuk mencegah perubahan data tidak sah.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
