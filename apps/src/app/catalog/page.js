'use client';
import { useState, useEffect } from 'react';

export default function Catalog() {
  const [materials, setMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('SEMUA');
  const [compareList, setCompareList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/materials')
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) {
          setMaterials(data);
        } else {
          setMaterials([]);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch materials', err);
        setIsLoading(false);
      });
  }, []);

  const categories = ['SEMUA', 'BETON', 'BESI', 'KAYU', 'KERAMIK', 'SEMEN'];

  const filteredMaterials = materials.filter(m => {
    const matchCategory = activeCategory === 'SEMUA' || m.category?.toUpperCase() === activeCategory;
    const matchSearch = m.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleCompare = (material) => {
    if (compareList.find(c => c.id === material.id)) {
      setCompareList(compareList.filter(c => c.id !== material.id));
    } else if (compareList.length < 3) {
      setCompareList([...compareList, material]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy mb-2">Katalog Material</h1>
        <p className="text-slate-600 max-w-2xl">Browse and select high-quality construction materials with precise technical specifications for your projects.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 gap-4">
            <div className="relative w-full sm:max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input 
                type="text" 
                placeholder="Cari material..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
              />
            </div>

            <div className="flex space-x-2 overflow-x-auto pb-2 w-full sm:w-auto">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-sm font-semibold rounded-md border whitespace-nowrap ${activeCategory === cat ? 'bg-slate-100 text-navy border-slate-300' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20 text-slate-500">
              <svg className="animate-spin h-8 w-8 text-primary mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memuat data material asli dari database...
            </div>
          ) : filteredMaterials.length === 0 ? (
            <div className="text-center py-20 text-slate-500 bg-white border border-slate-200 rounded-xl">
              Tidak ada material yang ditemukan. Jika database kosong, jalankan `node prisma/seed.js`
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredMaterials.map(material => {
                const isSelected = compareList.some(c => c.id === material.id);
                return (
                  <div key={material.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                    <div className="h-40 bg-slate-100 relative">
                      <div className="absolute top-3 right-3 bg-white px-2 py-1 text-xs font-semibold rounded border border-slate-200 text-slate-700 shadow-sm">
                        {material.stockStatus || 'Tersedia'}
                      </div>
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-navy">{material.name}</h3>
                      <p className="text-xs text-slate-400 font-mono tracking-wider mb-4 uppercase">{material.category}</p>
                      
                      <div className="space-y-2 mb-6 flex-1 text-sm">
                        {material.specs && typeof material.specs === 'object' ? Object.entries(material.specs).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-slate-500">{key.replace(/_/g, ' ')}</span>
                            <span className="font-medium text-navy text-right">{value}</span>
                          </div>
                        )) : (
                          <div className="text-slate-500 text-xs">{JSON.stringify(material.specs)}</div>
                        )}
                      </div>
                      
                      <div className="flex items-end justify-between mb-4">
                        <div className="text-xl font-bold text-navy">
                          Rp {material.unitPrice?.toLocaleString('id-ID')} <span className="text-sm font-normal text-slate-500">/ {material.unit}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2 mt-auto">
                        <button className="flex-1 bg-white border border-slate-300 text-slate-700 py-2 rounded-md font-semibold text-sm hover:bg-slate-50 transition-colors" onClick={() => alert(`Detail untuk ${material.name}`)}>
                          DETAIL
                        </button>
                        <button 
                          onClick={() => handleCompare(material)}
                          disabled={!isSelected && compareList.length >= 3}
                          className={`px-4 py-2 border rounded-md font-bold transition-colors ${isSelected ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50'}`}
                        >
                          {isSelected ? '−' : '+'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm sticky top-24">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-navy text-lg">Compare</h3>
              <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded-full border border-slate-200">
                {compareList.length}/3
              </span>
            </div>

            <div className="space-y-3 mb-6">
              {compareList.length === 0 ? (
                <div className="text-sm text-slate-400 text-center py-6 border-2 border-dashed border-slate-200 rounded-lg">
                  Pilih hingga 3 material untuk dibandingkan
                </div>
              ) : (
                compareList.map(item => (
                  <div key={item.id} className="flex items-center justify-between bg-slate-50 border border-slate-200 p-3 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white border border-slate-200 rounded flex items-center justify-center">
                        <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" /></svg>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-navy truncate w-24" title={item.name}>{item.name}</div>
                        <div className="text-xs text-slate-500 font-mono">Rp {item.unitPrice?.toLocaleString('id-ID')}</div>
                      </div>
                    </div>
                    <button onClick={() => handleCompare(item)} className="text-slate-400 hover:text-red-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))
              )}
              
              {compareList.length > 0 && compareList.length < 3 && (
                <div className="text-sm text-slate-400 text-center py-3 border-2 border-dashed border-slate-200 rounded-lg">
                  Tambah material ke-{compareList.length + 1}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => alert("Perbandingan Presisi Struktural akan ditampilkan di sini.")}
                disabled={compareList.length < 2}
                className="w-full bg-navy text-white font-semibold py-3 rounded-md hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                BANDINGKAN SEKARANG
              </button>
              {compareList.length > 0 && (
                <button 
                  onClick={() => setCompareList([])}
                  className="w-full text-slate-500 text-sm hover:text-slate-700"
                >
                  Bersihkan Semua
                </button>
              )}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
            <div className="flex items-start space-x-3 mb-4">
              <svg className="w-6 h-6 text-slate-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div>
                <h4 className="font-bold text-navy">Butuh Bantuan?</h4>
                <p className="text-sm text-slate-600 mt-1">Tim engineer kami siap membantu Anda memilih spesifikasi material yang tepat untuk proyek Anda.</p>
              </div>
            </div>
            <button onClick={() => alert("Membuka chat dengan tim engineer...")} className="w-full bg-white border border-slate-300 text-slate-700 font-semibold py-2 rounded-md hover:bg-slate-50 transition-colors text-sm">
              HUBUNGI ENGINEER
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
