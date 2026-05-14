import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Home() {
  const cookieStore = await cookies();
  const userToken = cookieStore.get('user_token')?.value;

  if (!userToken) {
    redirect('/login');
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-navy text-white pt-20 pb-24 overflow-hidden relative">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center space-x-2 bg-blue-900/50 rounded-full px-3 py-1 mb-6 text-sm text-blue-200 border border-blue-800">
              <span className="flex h-2 w-2 rounded-full bg-blue-400"></span>
              <span>PRECISION ENGINEERING AI V4.2</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Renovasi Rumah Sesuai Isi Dompet Anda.
            </h1>
            <p className="text-lg text-slate-300 mb-8 max-w-lg leading-relaxed">
              Masukkan luas ruangan dan budget Anda, biarkan AI kami merakit daftar material terbaik dalam hitungan detik sesuai standar nasional.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/estimator" className="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-md font-semibold flex items-center justify-center space-x-2 transition-colors">
                <span>Mulai Hitung RAB Sekarang</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
              <button className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-md font-semibold flex items-center justify-center space-x-2 transition-colors border border-slate-700">
                <span>Lihat Demo</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </button>
            </div>
            
            <div className="mt-10 flex items-center space-x-6 text-sm text-slate-400">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span>SNI Verified</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                <span>Real-time Material Pricing</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-slate-800 rounded-xl p-4 shadow-2xl border border-slate-700 transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="aspect-[4/3] bg-slate-900 rounded-lg relative overflow-hidden flex flex-col">
                <div className="h-8 border-b border-slate-800 flex items-center px-4 space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 p-6 relative">
                  <div className="absolute top-4 right-4 bg-navy px-3 py-1 rounded text-xs font-mono border border-slate-700 text-blue-400">
                    ESTIMASI BIAYA
                    <div className="text-xl text-white font-bold mt-1">Rp 45.200.000</div>
                  </div>
                  {/* Wireframe lines simulation */}
                  <svg className="w-full h-full text-slate-700 opacity-50" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M10,90 L10,30 L50,10 L90,30 L90,90 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                    <path d="M10,90 L50,70 L90,90" fill="none" stroke="currentColor" strokeWidth="1" />
                    <path d="M50,70 L50,10" fill="none" stroke="currentColor" strokeWidth="1" />
                    <path d="M10,50 L50,40 L90,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <path d="M10,70 L50,55 L90,70" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  </svg>
                  
                  <div className="absolute bottom-6 right-6 bg-slate-800 p-3 rounded shadow-lg border border-slate-700 flex items-center space-x-3">
                    <div className="bg-primary/20 p-2 rounded text-primary">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">AI Optimized</div>
                      <div className="text-sm text-green-400 font-medium">Efisiensi Material +24%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm text-primary font-bold tracking-widest uppercase mb-2">ALGORITMA PRESISI</h2>
            <h3 className="text-3xl font-bold text-navy">Mengapa Memilih RenoAI?</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-blue-50 text-primary rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              </div>
              <h4 className="text-xl font-bold text-navy mb-3">Kalkulasi Struktur Otomatis</h4>
              <p className="text-slate-600 leading-relaxed mb-6">
                Bukan sekadar perkiraan, AI kami menghitung kebutuhan semen, pasir, dan besi hingga gram terkecil berdasarkan standar nasional.
              </p>
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <div>
                  <div className="text-2xl font-bold text-navy">99.8%</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Akurasi Perhitungan</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-navy">15s</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Waktu Analisis</div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h4 className="text-lg font-bold text-navy mb-2">Optimasi Budget</h4>
                <p className="text-slate-600 text-sm">Sesuaikan daftar belanja dengan limit saldo Anda tanpa mengorbankan kualitas struktural.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h4 className="text-lg font-bold text-navy mb-2">Ekspor Laporan PDF</h4>
                <p className="text-slate-600 text-sm mb-3">Dapatkan dokumen RAB profesional yang siap diserahkan ke kontraktor atau bank.</p>
                <Link href="#" className="text-primary text-sm font-semibold hover:underline">UNDUH CONTOH RAB &rarr;</Link>
              </div>
            </div>

            <div className="bg-navy p-8 rounded-xl shadow-sm border border-slate-800 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-white">
                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h16v16H4V4zm2 4v10h12V8H6zm2 2h8v2H8v-2zm0 4h8v2H8v-2z" /></svg>
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-slate-800 text-white rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                </div>
                <h4 className="text-xl font-bold mb-3">Database Material Lengkap</h4>
                <p className="text-slate-400 leading-relaxed mb-6">
                  Akses ribuan katalog material terkini lengkap dengan update harga harian di pasar Indonesia.
                </p>
                <Link href="/catalog" className="inline-block bg-white text-navy px-4 py-2 rounded font-semibold text-sm hover:bg-slate-100 transition-colors">
                  JELAJAHI KATALOG
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
