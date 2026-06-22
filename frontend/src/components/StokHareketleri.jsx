import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowDownLeft, ArrowUpRight, History } from 'lucide-react';

const API_URL = 'http://127.0.0.1:8000';

export default function StokHareketleri() {
  const [hareketler, setHareketler] = useState([]);
  const [urunler, setUrunler] = useState([]);
  const [formData, setFormData] = useState({ UrunID: '', IslemTipi: 'Giriş', Miktar: '' });

  const fetchData = async () => {
    try {
      const hRes = await axios.get(`${API_URL}/stok_hareketleri/`);
      setHareketler(hRes.data);
      const uRes = await axios.get(`${API_URL}/urunler/`);
      setUrunler(uRes.data);
      if(uRes.data.length > 0 && !formData.UrunID) setFormData(f => ({ ...f, UrunID: uRes.data[0].UrunID }));
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleMiktar = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/stok_hareketleri/`, formData);
      setFormData({ ...formData, Miktar: '' });
      fetchData();
      alert("Stok başarıyla güncellendi.");
    } catch (error) {
      alert("Hata: " + (error.response?.data?.detail || "İşlem başarısız. Eksi stoğa düşülüyor olabilir."));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800">Hızlı Stok Giriş / Çıkış</h2>
        <p className="text-sm text-slate-500 mb-4 mt-1">İrsaliye ve faturalarınıza istinaden buradan manuel stok güncellemesi yapabilirsiniz. Güncelleme anında ana stoğa yansır.</p>
        <form onSubmit={handleMiktar} className="flex flex-col md:flex-row items-end space-y-4 md:space-y-0 md:space-x-4 bg-slate-50 p-5 rounded-xl border border-slate-100">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium mb-1">Ürün Seçin</label>
            <select required value={formData.UrunID} onChange={e => setFormData({...formData, UrunID: e.target.value})} className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500">
              {urunler.map(u => <option key={u.UrunID} value={u.UrunID}>{u.UrunKodu} - {u.UrunAdi} (Mevcut: {u.GuncelStok})</option>)}
            </select>
          </div>
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium mb-1">İşlem Yönü</label>
            <select value={formData.IslemTipi} onChange={e => setFormData({...formData, IslemTipi: e.target.value})} className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500">
              <option value="Giriş">Depoya Giriş (+)</option>
              <option value="Çıkış">Depodan Çıkış (-)</option>
            </select>
          </div>
          <div className="w-full md:w-32">
            <label className="block text-sm font-medium mb-1">Miktar</label>
            <input required type="number" min="0.1" step="0.1" value={formData.Miktar} onChange={e => setFormData({...formData, Miktar: e.target.value})} className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-center font-bold" />
          </div>
          <button type="submit" className="w-full md:w-auto px-6 py-2.5 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-900 transition-colors shadow-sm">İşlemi Kaydet</button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b bg-slate-50 flex items-center space-x-2 text-slate-700 font-semibold">
          <History size={18} />
          <span>Son Stok Hareketleri Geçmişi</span>
        </div>
        <table className="w-full text-left">
          <thead className="border-b text-slate-600 text-sm">
            <tr><th className="p-4 pl-6">İşlem Tarihi</th><th className="p-4">Ürün ID</th><th className="p-4">İşlem Tipi</th><th className="p-4 text-right pr-6">Hareket Miktarı</th></tr>
          </thead>
          <tbody>
            {hareketler.length === 0 ? <tr><td colSpan="4" className="p-8 text-center text-slate-500">Henüz hiç stok hareketi kaydedilmemiş.</td></tr> : null}
            {hareketler.map((h) => (
              <tr key={h.HareketID} className="border-b hover:bg-slate-50">
                <td className="p-4 pl-6 text-slate-500">{new Date(h.IslemTarihi).toLocaleString()}</td>
                <td className="p-4 font-medium">#{h.UrunID} numaralı ürün</td>
                <td className="p-4">
                  {h.IslemTipi === 'Giriş' ? <span className="inline-flex items-center text-green-700 bg-green-100 px-2 py-1 rounded-md font-bold text-xs"><ArrowDownLeft size={14} className="mr-1"/> STOK GİRİŞİ</span> : <span className="inline-flex items-center text-red-700 bg-red-100 px-2 py-1 rounded-md font-bold text-xs"><ArrowUpRight size={14} className="mr-1"/> STOK ÇIKIŞI</span>}
                </td>
                <td className="p-4 text-right pr-6 font-bold text-lg">{h.Miktar}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
