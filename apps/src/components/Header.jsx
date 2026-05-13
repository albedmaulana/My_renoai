import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold tracking-tight text-navy">
              Reno<span className="text-primary">AI</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-slate-600 hover:text-primary font-medium px-3 py-2 text-sm border-b-2 border-transparent hover:border-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/history" className="text-slate-600 hover:text-primary font-medium px-3 py-2 text-sm border-b-2 border-transparent hover:border-primary transition-colors">
              Riwayat
            </Link>
            <Link href="/catalog" className="text-slate-600 hover:text-primary font-medium px-3 py-2 text-sm border-b-2 border-transparent hover:border-primary transition-colors">
              Katalog Material
            </Link>
            <Link href="/bantuan" className="text-slate-600 hover:text-primary font-medium px-3 py-2 text-sm border-b-2 border-transparent hover:border-primary transition-colors">
              Bantuan
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="text-slate-500 hover:text-slate-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button className="text-slate-500 hover:text-slate-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <Link href="/estimator" className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm">
              MULAI HITUNG
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
