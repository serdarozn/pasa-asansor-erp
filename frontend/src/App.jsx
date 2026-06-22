import React, { useState } from 'react';
import { LayoutDashboard, Package, Users, ArrowLeftRight, Settings } from 'lucide-react';
import Urunler from './components/Urunler';
import Dashboard from './components/Dashboard';
import Cariler from './components/Cariler';
import StokHareketleri from './components/StokHareketleri';
import Imalat from './components/Imalat';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
      {/* --- SOL MENÜ (SIDEBAR) --- */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-2xl z-10 relative">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold tracking-widest text-white">PAŞA GRUP</h1>
          <p className="text-xs text-blue-400 mt-1 font-medium tracking-wide">ERP & STOK TAKİP</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('urunler')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'urunler' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <Package size={20} />
            <span className="font-medium">Ürün Kartları</span>
          </button>

          <button 
            onClick={() => setActiveTab('stokhareketleri')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'stokhareketleri' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <ArrowLeftRight size={20} />
            <span className="font-medium">Stok Giriş / Çıkış</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('cariler')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'cariler' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <Users size={20} />
            <span className="font-medium">Müşteri ve Tedarikçi</span>
          </button>

          <button 
            onClick={() => setActiveTab('imalat')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'imalat' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <Settings size={20} />
            <span className="font-medium">İmalat (BOM)</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-500">v1.1.0 - Paşa Asansör</p>
        </div>
      </aside>

      {/* --- ANA İÇERİK EKRANI --- */}
      <main className="flex-1 overflow-auto bg-slate-50/50">
        <div className="max-w-7xl mx-auto p-8 h-full">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'urunler' && <Urunler />}
          {activeTab === 'stokhareketleri' && <StokHareketleri />}
          {activeTab === 'cariler' && <Cariler />}
          {activeTab === 'imalat' && <Imalat />}
        </div>
      </main>
    </div>
  );
}

export default App;
