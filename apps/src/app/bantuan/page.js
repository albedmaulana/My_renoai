'use client';
import { useState } from 'react';
import Link from 'next/link';

const faqs = [
  {
    q: 'Bagaimana cara menghitung RAB dengan RenoAI?',
    a: 'Buka halaman Estimator, pilih tipe ruangan, masukkan luas area dan budget, lalu klik "Proses Perhitungan". Sistem akan otomatis menghitung kebutuhan material dan biaya berdasarkan standar SNI.'
  },
  {
    q: 'Apa itu standar SNI dalam perhitungan material?',
    a: 'SNI (Standar Nasional Indonesia) adalah acuan resmi yang mengatur spesifikasi dan mutu material konstruksi. RenoAI menggunakan koefisien SNI untuk memastikan perhitungan material akurat dan sesuai regulasi.'
  },
  {
    q: 'Seberapa akurat hasil kalkulasi RenoAI?',
    a: 'Tingkat akurasi RenoAI mencapai 99.8% untuk perhitungan struktural berdasarkan standar nasional. Harga material diperbarui secara berkala mengikuti harga pasar terkini di Indonesia.'
  },
  {
    q: 'Apakah saya bisa mengunduh hasil RAB?',
    a: 'Ya, setelah kalkulasi selesai, Anda dapat melihat detail RAB lengkap dan mengunduhnya dalam format PDF yang siap diserahkan ke kontraktor atau pihak bank.'
  },
  {
    q: 'Apa perbedaan mode "Fokus Kualitas" dan "Fokus Hemat"?',
    a: 'Mode Fokus Kualitas memilih material dengan grade terbaik meskipun harga lebih tinggi. Mode Fokus Hemat mengoptimalkan pemilihan material agar sesuai budget tanpa mengorbankan standar keamanan struktural.'
  },
  {
    q: 'Bagaimana cara melihat riwayat proyek saya?',
    a: 'Klik menu "Riwayat" di navigasi atas. Semua proyek yang pernah Anda buat beserta dokumen RAB-nya tersimpan dan dapat diakses kapan saja.'
  },
  {
    q: 'Apakah data proyek saya aman?',
    a: 'Ya, semua data disimpan dengan enkripsi di server kami. Hanya Anda yang dapat mengakses proyek dan RAB milik Anda.'
  },
  {
    q: 'Material apa saja yang tersedia di katalog?',
    a: 'Katalog kami mencakup berbagai kategori material: Beton, Besi, Kayu, Keramik, Semen, Cat, Atap, Pipa, dan Listrik. Setiap material dilengkapi spesifikasi teknis dan harga terkini.'
  },
];

const steps = [
  {
    num: '01',
    title: 'Pilih Tipe Ruangan',
    desc: 'Tentukan jenis ruangan yang akan direnovasi: Living Room, Kitchen, Bathroom, atau Bedroom.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Input Luas & Budget',
    desc: 'Masukkan luas area (m²) dan estimasi anggaran renovasi Anda menggunakan slider.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Pilih Preferensi',
    desc: 'Tentukan apakah Anda ingin fokus pada kualitas material terbaik atau efisiensi budget.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Proses & Lihat RAB',
    desc: 'Klik tombol proses dan dapatkan Rencana Anggaran Biaya lengkap dalam hitungan detik.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

export default function Bantuan() {
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-navy text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(59,130,246,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(6,182,212,0.2) 0%, transparent 50%)' }}></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-500/20 rounded-2xl mb-5 border border-blue-500/30">
            <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Pusat Bantuan</h1>
          <p className="text-slate-400 max-w-xl mx-auto">Temukan jawaban, panduan penggunaan, dan hubungi tim kami untuk bantuan lebih lanjut.</p>
        </div>
      </section>

      {/* Step-by-Step Guide */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-sm text-primary font-bold tracking-widest uppercase mb-2">PANDUAN PENGGUNAAN</h2>
            <h3 className="text-2xl font-bold text-navy">Cara Menggunakan RenoAI</h3>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="relative bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg hover:border-primary/30 transition-all duration-300 group">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-slate-200 group-hover:bg-primary/40 transition-colors z-10"></div>
                )}
                <div className="text-4xl font-black text-slate-100 absolute top-3 right-4 group-hover:text-primary/10 transition-colors">{step.num}</div>
                <div className="w-11 h-11 bg-blue-50 text-primary rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {step.icon}
                </div>
                <h4 className="text-base font-bold text-navy mb-2">{step.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/estimator" className="inline-flex items-center space-x-2 bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-sm">
              <span>Mulai Hitung RAB Sekarang</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-sm text-primary font-bold tracking-widest uppercase mb-2">FAQ</h2>
            <h3 className="text-2xl font-bold text-navy">Pertanyaan yang Sering Diajukan</h3>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className={`border rounded-xl overflow-hidden transition-all duration-300 ${openFaq === i ? 'border-primary/40 shadow-sm bg-blue-50/30' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className={`text-sm font-semibold pr-4 ${openFaq === i ? 'text-primary' : 'text-navy'}`}>{faq.q}</span>
                  <svg className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-primary' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-5 pb-4">
                    <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Info */}
            <div>
              <h2 className="text-sm text-primary font-bold tracking-widest uppercase mb-2">HUBUNGI KAMI</h2>
              <h3 className="text-2xl font-bold text-navy mb-4">Butuh Bantuan Lebih?</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">Tim engineer dan customer support kami siap membantu Anda. Kirim pesan melalui form atau hubungi kami langsung.</p>
              <div className="space-y-5">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-50 text-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-navy">Email</p>
                    <p className="text-sm text-slate-500">support@renoai.co.id</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-navy">WhatsApp</p>
                    <p className="text-sm text-slate-500">+62 812-3456-7890</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-navy">Jam Operasional</p>
                    <p className="text-sm text-slate-500">Senin - Jumat, 08:00 - 17:00 WIB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h4 className="text-lg font-bold text-navy mb-1">Pesan Terkirim!</h4>
                  <p className="text-sm text-slate-500">Tim kami akan menghubungi Anda dalam 1x24 jam.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nama Anda" className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="email@contoh.com" className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Pesan</label>
                    <textarea rows={4} required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Tuliskan pertanyaan atau kendala Anda..." className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none" />
                  </div>
                  <button type="submit" className="w-full bg-primary hover:bg-blue-600 text-white py-3 rounded-lg font-bold text-sm transition-colors shadow-sm">Kirim Pesan</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
