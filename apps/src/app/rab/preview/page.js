'use client';
import Link from 'next/link';

export default function RABPreview() {
  const rabItems = [
    { no: '1', desc: 'PEKERJAAN PERSIAPAN & PEMBERSIHAN', vol: '', unit: '', price: '', total: 12500000 },
    { no: '1.1', desc: 'Pembersihan Lahan & Perataan', vol: 145, unit: 'M2', price: 55000, total: 7975000 },
    { no: '1.2', desc: 'Pemasangan Bowplank & Profil', vol: 65, unit: 'M1', price: 69615, total: 4525000 },
    { no: '2', desc: 'PEKERJAAN TANAH & PONDASI', vol: '', unit: '', price: '', total: 84200000 },
    { no: '2.1', desc: 'Galian Tanah Pondasi Footplat', vol: 24.5, unit: 'M3', price: 115000, total: 2817500 },
    { no: '2.2', desc: 'Beton K-300 Ready Mix (Pondasi)', vol: 18, unit: 'M3', price: 1150000, total: 20700000 },
    { no: '2.3', desc: 'Pembesian Ulir D13/D16 Standard SNI', vol: 4500, unit: 'KG', price: 13500, total: 60682500 },
    { no: '3', desc: 'PEKERJAAN DINDING & KUSEN', vol: '', unit: '', price: '', total: 42150000 },
    { no: '3.1', desc: 'Pasangan Bata Ringan 10cm (AAC)', vol: 320, unit: 'M2', price: 112500, total: 36000000 },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="mb-4 sm:mb-0">
          <div className="text-sm text-slate-500 mb-1">Riwayat Proyek &gt; Preview RAB #RA-2024-0812</div>
          <h1 className="text-2xl font-bold text-navy">Preview Dokumen RAB</h1>
          <p className="text-slate-600 text-sm">Review detail anggaran biaya sebelum melakukan ekspor final.</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-md font-semibold text-sm hover:bg-slate-50 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            <span>DOWNLOAD PDF</span>
          </button>
          <button className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-semibold text-sm transition-colors shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            <span>BAGIKAN KE WHATSAPP</span>
          </button>
        </div>
      </div>

      {/* Document Layout */}
      <div className="bg-white border border-slate-300 shadow-lg p-8 md:p-12 font-sans text-slate-800 rounded-sm">
        
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
            <div className="font-mono font-bold text-navy text-lg">RAB/STR/2024/VIII/0812</div>
            <div className="text-xs text-slate-500 mt-1 uppercase">DITERBITKAN: 24 OKT 2024</div>
          </div>
        </div>

        {/* Project Info */}
        <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
          <div>
            <h3 className="font-bold text-navy mb-3 uppercase tracking-wider text-xs border-b border-slate-200 pb-1 inline-block">INFORMASI PROYEK</h3>
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="py-1 text-slate-500 w-32">Nama Proyek</td>
                  <td className="py-1 font-semibold">: Renovasi Hunian Modern - Tahap 1</td>
                </tr>
                <tr>
                  <td className="py-1 text-slate-500">Lokasi</td>
                  <td className="py-1 font-semibold">: Cluster Emerald B-12, Tangerang Selatan</td>
                </tr>
                <tr>
                  <td className="py-1 text-slate-500">Luas Bangunan</td>
                  <td className="py-1 font-semibold">: 145 m&sup2;</td>
                </tr>
                <tr>
                  <td className="py-1 text-slate-500">Tipe Pekerjaan</td>
                  <td className="py-1 font-semibold">: Struktural & Finishing</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <h3 className="font-bold text-navy mb-3 uppercase tracking-wider text-xs border-b border-slate-200 pb-1 inline-block">PEMILIK PROYEK</h3>
            <div className="font-semibold text-base mb-1">Bp. Satria Wijaya</div>
            <div className="text-slate-500">swijaya.const@email.com</div>
            <div className="text-slate-500">+62 812-3456-7890</div>
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
              {rabItems.map((item, idx) => {
                const isHeader = !item.vol;
                return (
                  <tr key={idx} className={`border-b border-slate-200 ${isHeader ? 'bg-slate-50' : ''}`}>
                    <td className={`py-2 px-3 text-left border-r border-slate-300 font-mono ${isHeader ? 'font-bold' : 'text-slate-500'}`}>
                      {item.no}
                    </td>
                    <td className={`py-2 px-3 text-left border-r border-slate-300 ${isHeader ? 'font-bold uppercase text-navy' : 'pl-6'}`}>
                      {item.desc}
                    </td>
                    <td className="py-2 px-3 text-center border-r border-slate-300 font-mono">{item.vol}</td>
                    <td className="py-2 px-3 text-center border-r border-slate-300 font-mono">{item.unit}</td>
                    <td className="py-2 px-3 text-right border-r border-slate-300 font-mono">
                      {item.price ? `Rp ${item.price.toLocaleString('id-ID')}` : ''}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-semibold text-navy">
                      Rp {item.total.toLocaleString('id-ID')}
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
              <li>Harga sudah termasuk pajak (PPN 11%)</li>
              <li>Estimasi berlaku selama 14 hari kerja sejak diterbitkan</li>
              <li>Harga material fluktuatif mengikuti pasar nasional</li>
            </ol>
          </div>
          
          <div className="w-1/2 max-w-sm">
            <div className="flex justify-between py-2 border-b border-slate-200 text-sm">
              <span className="font-semibold text-slate-600">Subtotal</span>
              <span className="font-mono font-bold">Rp 138.850.000</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-200 text-sm">
              <span className="font-semibold text-slate-600">Jasa Pelaksana (10%)</span>
              <span className="font-mono font-bold">Rp 13.885.000</span>
            </div>
            <div className="flex justify-between py-3 border-b-2 border-navy text-lg mt-2">
              <span className="font-bold text-navy uppercase tracking-wider">TOTAL AKHIR</span>
              <span className="font-mono font-bold text-navy">Rp 152.735.000</span>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="flex justify-between text-center pt-8 px-12">
          <div>
            <div className="text-sm mb-16">Disiapkan Oleh,</div>
            <div className="font-bold border-b border-slate-300 pb-1 px-4 inline-block">RenoAI Precision Engine</div>
            <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">AUTOMATED CALCULATION SYSTEM</div>
          </div>
          
          <div className="flex flex-col items-center justify-end">
            <div className="w-16 h-16 border-2 border-slate-300 rounded-full flex items-center justify-center text-xs font-bold text-slate-400 rotate-[-15deg] opacity-60 mb-2">
              VERIFIED
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest">DIGITAL VERIFIED DOCUMENT</div>
          </div>

          <div>
            <div className="text-sm mb-16">Menyetujui,</div>
            <div className="font-bold border-b border-slate-300 pb-1 px-4 inline-block">Bp. Satria Wijaya</div>
            <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">PEMILIK PROYEK / OWNER</div>
          </div>
        </div>

      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-5 flex space-x-4">
          <div className="bg-white p-2 rounded-full border border-blue-200 h-fit">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <h4 className="font-bold text-navy mb-1">Akurasi Material</h4>
            <p className="text-sm text-slate-600">Data material disinkronisasi dengan database konstruksi nasional terbaru (Oktober 2024).</p>
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
