import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
        <div className="mb-4 md:mb-0">
          <p className="font-semibold text-slate-700">RenoAI Precision Engineering</p>
          <p>&copy; 2024 RenoAI Structural Systems. All rights reserved.</p>
          <p>Sesuai standar konstruksi nasional.</p>
        </div>
        
        <div className="flex space-x-6">
          <Link href="#" className="hover:text-primary transition-colors">Kebijakan Privasi</Link>
          <Link href="#" className="hover:text-primary transition-colors">Syarat & Ketentuan</Link>
          <Link href="#" className="hover:text-primary transition-colors">Dokumentasi API</Link>
          <Link href="#" className="hover:text-primary transition-colors">Hubungi Kami</Link>
        </div>
      </div>
    </footer>
  );
}
