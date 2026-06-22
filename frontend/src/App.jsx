import React, { useState } from 'react';
import { LayoutDashboard, Package, Users } from 'lucide-react';
import Urunler from './components/Urunler';
import Dashboard from './components/Dashboard';

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
            <span className="font-medium">Ürünler (Stok)</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('cariler')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'cariler' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <Users size={20} />
            <span className="font-medium">Cariler</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-500">v1.0.0 - Paşa Asansör</p>
        </div>
      </aside>

      {/* --- ANA İÇERİK EKRANI --- */}
      <main className="flex-1 overflow-auto bg-slate-50/50">
        <div className="max-w-7xl mx-auto p-8 h-full">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'urunler' && <Urunler />}
          {activeTab === 'cariler' && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Users size={64} className="text-slate-300 mb-4" />
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Cari Yönetimi</h2>
              <p className="text-slate-500 max-w-md">Müşteri ve tedarikçi kayıtlarını yöneteceğimiz bu ekran geliştirme aşamasındadır.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
