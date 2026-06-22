import React from 'react';
import { TrendingUp, Package, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Sistem Özeti</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-xl">
            <Package size={28} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Toplam Kayıtlı Ürün</p>
            <p className="text-3xl font-bold text-slate-800">Sistemde</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-4 bg-red-100 text-red-600 rounded-xl">
            <AlertCircle size={28} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Kritik Stok Uyarısı</p>
            <p className="text-3xl font-bold text-slate-800">Aktif</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-4 bg-green-100 text-green-600 rounded-xl">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Sistem Durumu</p>
            <p className="text-3xl font-bold text-slate-800">Çevrimiçi</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mt-8 text-center">
        <h3 className="text-xl font-bold text-slate-700 mb-2">Paşa Asansör ERP'ye Hoş Geldiniz!</h3>
        <p className="text-slate-500">Sol menüden Ürünler (Stok) sekmesine tıklayarak kayıtlı ürünleri inceleyebilir, yeni stok kartları oluşturabilirsiniz.</p>
      </div>
    </div>
  );
}
