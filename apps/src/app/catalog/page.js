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

  const categories = ['SEMUA', 'BETON', 'BESI', 'KAYU', 'KERAMIK', 'SEMEN', 'CAT', 'LISTRIK', 'SANITASI', 'BATU', 'ATAP'];

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

  const [showCompareModal, setShowCompareModal] = useState(false);

  const lowestPrice = compareList.length > 0 ? Math.min(...compareList.map(m => m.unitPrice)) : 0;

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
                  className={`px-4 py-2 text-sm font-semibold rounded-md border whitespace-nowrap ${activeCategory === cat ? 'bg-navy text-white border-navy' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 transition-colors'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-32 text-slate-500">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin mb-4"></div>
              <p className="font-medium">Sinkronisasi Katalog AI...</p>
            </div>
          ) : filteredMaterials.length === 0 ? (
            <div className="text-center py-20 text-slate-500 bg-white border border-slate-200 rounded-xl">
              Tidak ada material yang ditemukan.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredMaterials.map(material => {
                const isSelected = compareList.some(c => c.id === material.id);
                return (
                  <div key={material.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300 group flex flex-col">
                    <div className="h-44 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                      {/* Placeholder Background (Always there) */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200">
                        <svg className="w-12 h-12 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{material.category}</span>
                      </div>
                      
                      {/* Real Image (Covers placeholder when loaded) */}
                      {material.imageUrl && (
                        <img 
                          src={material.imageUrl} 
                          alt={material.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 z-10"
                        />
                      )}

                      <div className={`absolute top-3 right-3 px-2 py-1 text-[10px] font-bold rounded shadow-sm z-20 ${
                        material.stockStatus === 'Tersedia' ? 'bg-green-100 text-green-700' : 
                        material.stockStatus === 'Kosong' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {material.stockStatus?.toUpperCase() || 'TERSEDIA'}
                      </div>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-navy group-hover:text-primary transition-colors">{material.name}</h3>
                      <p className="text-[10px] text-slate-400 font-bold tracking-widest mb-4 uppercase">{material.category}</p>
                      
                      <div className="space-y-2 mb-6 flex-1 text-sm bg-slate-50 p-3 rounded-lg">
                        {material.specs && typeof material.specs === 'object' ? (
                          Object.entries(material.specs).map(([key, val], i) => (
                            <div key={i} className="flex justify-between border-b border-slate-200 pb-1 last:border-0">
                              <span className="text-slate-500 text-xs">{key}</span>
                              <span className="font-bold text-navy text-xs">{val}</span>
                            </div>
                          ))
                        ) : material.specs && typeof material.specs === 'string' ? (
                          material.specs.split(',').map((spec, i) => {
                            const [key, val] = spec.split(':');
                            return (
                              <div key={i} className="flex justify-between border-b border-slate-200 pb-1 last:border-0">
                                <span className="text-slate-500 text-xs">{key?.trim()}</span>
                                <span className="font-bold text-navy text-xs">{val?.trim()}</span>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-slate-500 text-xs italic">Spesifikasi teknis tersedia.</div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-xl font-bold text-navy">
                          Rp {material.unitPrice?.toLocaleString('id-ID')}
                        </div>
                        <div className="text-xs text-slate-500">/ {material.unit}</div>
                      </div>
 
                      <div className="flex space-x-2 mt-auto">
                        <button className="flex-1 bg-white border border-slate-200 text-slate-600 py-2 rounded-md font-bold text-xs hover:border-primary hover:text-primary transition-all" onClick={() => alert(`Spesifikasi Teknis: ${material.specs}`)}>
                          DETAIL
                        </button>
                        <button 
                          onClick={() => handleCompare(material)}
                          disabled={!isSelected && compareList.length >= 3}
                          className={`px-4 py-2 border rounded-md font-bold transition-all shadow-sm ${isSelected ? 'bg-red-500 border-red-500 text-white hover:bg-red-600' : 'bg-white border-slate-200 text-slate-400 hover:border-navy hover:text-navy disabled:opacity-50'}`}
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
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-lg sticky top-24">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
              <h3 className="font-bold text-navy text-lg">Compare AI</h3>
              <span className={`text-xs font-bold px-2 py-1 rounded-full border ${compareList.length === 3 ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                {compareList.length}/3
              </span>
            </div>
 
            <div className="space-y-3 mb-6">
              {compareList.length === 0 ? (
                <div className="text-sm text-slate-400 text-center py-10 border-2 border-dashed border-slate-100 rounded-xl">
                  <svg className="w-8 h-8 mx-auto mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                  Pilih material untuk dibandingkan
                </div>
              ) : (
                compareList.map(item => (
                  <div key={item.id} className="flex items-center justify-between bg-slate-50 border border-slate-200 p-3 rounded-lg group hover:border-primary transition-colors">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="w-8 h-8 bg-white border border-slate-200 rounded flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" /></svg>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-navy truncate" title={item.name}>{item.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">Rp {item.unitPrice?.toLocaleString('id-ID')}</div>
                      </div>
                    </div>
                    <button onClick={() => handleCompare(item)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))
              )}
            </div>
 
            <div className="space-y-3">
              <button 
                onClick={() => setShowCompareModal(true)}
                disabled={compareList.length < 2}
                className="w-full bg-primary text-white font-bold py-3 rounded-md hover:bg-blue-600 transition-all shadow-md shadow-blue-200 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
              >
                BANDINGKAN SEKARANG
              </button>
              {compareList.length > 0 && (
                <button 
                  onClick={() => setCompareList([])}
                  className="w-full text-slate-400 text-xs font-bold hover:text-red-500 transition-colors py-1"
                >
                  BERSIHKAN SEMUA
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

      {/* Comparison Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={() => setShowCompareModal(false)}></div>
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-navy">Analisis Perbandingan Teknis</h2>
                <p className="text-xs text-slate-500 mt-1">Komparasi spesifikasi dan efisiensi biaya secara real-time.</p>
              </div>
              <button onClick={() => setShowCompareModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="py-4 px-4 text-left bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-widest w-48">Fitur / Spek</th>
                    {compareList.map(item => (
                      <th key={item.id} className="py-4 px-6 text-center border-b border-slate-200 min-w-[200px]">
                        <div className="text-primary font-mono text-[10px] mb-1">{item.category?.toUpperCase()}</div>
                        <div className="text-navy font-bold text-sm leading-tight">{item.name}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 font-bold text-navy bg-slate-50/50">Harga Satuan</td>
                    {compareList.map(item => (
                      <td key={item.id} className={`py-4 px-6 text-center font-mono font-bold ${item.unitPrice === lowestPrice ? 'text-green-600 bg-green-50/30' : 'text-navy'}`}>
                        Rp {item.unitPrice?.toLocaleString('id-ID')}
                        {item.unitPrice === lowestPrice && (
                          <div className="text-[9px] font-bold text-green-500 mt-1">HARGA TERBAIK</div>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 font-bold text-navy bg-slate-50/50">Satuan Unit</td>
                    {compareList.map(item => (
                      <td key={item.id} className="py-4 px-6 text-center text-slate-600">{item.unit}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 font-bold text-navy bg-slate-50/50">Status Stok</td>
                    {compareList.map(item => (
                      <td key={item.id} className="py-4 px-6 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          item.stockStatus === 'Tersedia' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {item.stockStatus?.toUpperCase()}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 font-bold text-navy bg-slate-50/50 align-top">Detail Teknis</td>
                    {compareList.map(item => (
                      <td key={item.id} className="py-4 px-6 text-sm text-slate-600">
                        <div className="space-y-2">
                          {item.specs && typeof item.specs === 'object' ? (
                            Object.entries(item.specs).map(([key, val], i) => (
                              <div key={i} className="bg-slate-50 p-2 rounded text-[11px] leading-relaxed border border-slate-100">
                                <span className="text-slate-400">{key}:</span> <span className="font-bold">{val}</span>
                              </div>
                            ))
                          ) : item.specs && typeof item.specs === 'string' ? (
                            item.specs.split(',').map((s, i) => (
                              <div key={i} className="bg-slate-50 p-2 rounded text-[11px] leading-relaxed border border-slate-100">
                                {s.trim()}
                              </div>
                            ))
                          ) : null}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setShowCompareModal(false)}
                className="px-8 py-3 bg-navy text-white font-bold rounded-lg hover:bg-slate-800 transition-all shadow-lg"
              >
                TUTUP ANALISIS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
