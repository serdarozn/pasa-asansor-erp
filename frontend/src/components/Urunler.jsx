import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit } from 'lucide-react';

// Backend adresimiz
const API_URL = 'http://127.0.0.1:8000';

export default function Urunler() {
  const [urunler, setUrunler] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    UrunKodu: '',
    UrunAdi: '',
    Kategori: '',
    Birim: '',
    Fiyat: 0,
    RafKonumu: ''
  });

  // Sayfa açıldığında verileri çeken fonksiyon
  const fetchUrunler = async () => {
    try {
      const response = await axios.get(`${API_URL}/urunler/`);
      setUrunler(response.data);
    } catch (error) {
      console.error("Veriler çekilemedi", error);
    }
  };

  useEffect(() => {
    fetchUrunler();
  }, []);

  // Form elemanları değiştikçe state'i güncelleyen fonksiyon
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form gönderildiğinde (Kaydet'e basıldığında) çalışan fonksiyon
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/urunler/`, formData);
      setIsFormOpen(false); // Formu kapat
      setFormData({ UrunKodu: '', UrunAdi: '', Kategori: '', Birim: '', Fiyat: 0, RafKonumu: '' }); // Formu sıfırla
      fetchUrunler(); // Tabloyu yenile
    } catch (error) {
      alert("Ürün eklenirken hata oluştu. Kodu benzersiz olmalı.");
    }
  };

  // Silme butonuna basıldığında çalışan fonksiyon
  const handleDelete = async (id) => {
    if (window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      try {
        await axios.delete(`${API_URL}/urunler/${id}`);
        fetchUrunler(); // Tabloyu yenile
      } catch (error) {
        console.error("Silme hatası", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Üst Başlık ve Ekleme Butonu */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Ürün (Stok) Yönetimi</h2>
          <p className="text-slate-500 text-sm mt-1">Sistemdeki tüm ürünleri ve stok durumlarını buradan yönetebilirsiniz.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center space-x-2 transition-colors font-medium shadow-sm"
        >
          <Plus size={20} />
          <span>Yeni Ürün Ekle</span>
        </button>
      </div>

      {/* Ürün Ekleme Formu */}
      {isFormOpen && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-bold mb-4 border-b pb-2">Yeni Ürün Ekle</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ürün Kodu *</label>
              <input required name="UrunKodu" value={formData.UrunKodu} onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Örn: KBN-01" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ürün Adı *</label>
              <input required name="UrunAdi" value={formData.UrunAdi} onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Örn: Lüks Asansör Kabini" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
              <input name="Kategori" value={formData.Kategori} onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Örn: Mekanik" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Birim</label>
              <input name="Birim" value={formData.Birim} onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Örn: Adet, Metre" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Raf Konumu</label>
              <input name="RafKonumu" value={formData.RafKonumu} onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Örn: A-Blok Raf-3" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Birim Fiyatı (₺)</label>
              <input type="number" name="Fiyat" value={formData.Fiyat} onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
            </div>
            <div className="col-span-1 md:col-span-2 flex justify-end space-x-3 mt-4">
              <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">İptal</button>
              <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium shadow-sm transition-colors">Kaydet</button>
            </div>
          </form>
        </div>
      )}

      {/* Ürünler Tablosu */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium text-sm">
                <th className="p-4 pl-6">Kod</th>
                <th className="p-4">Ürün Adı</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Stok Durumu</th>
                <th className="p-4">Birim</th>
                <th className="p-4">Fiyat</th>
                <th className="p-4 text-center pr-6">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {urunler.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500">Sistemde henüz hiç ürün kaydı bulunmuyor.</td>
                </tr>
              ) : (
                urunler.map((urun) => (
                  <tr key={urun.UrunID} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6 font-semibold text-slate-900">{urun.UrunKodu}</td>
                    <td className="p-4 text-slate-700">{urun.UrunAdi}</td>
                    <td className="p-4 text-slate-500">{urun.Kategori || '-'}</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${urun.GuncelStok <= urun.KritikStok ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {urun.GuncelStok}
                        </span>
                        {urun.GuncelStok <= urun.KritikStok && <AlertCircle size={14} className="text-red-500" />}
                      </div>
                    </td>
                    <td className="p-4 text-slate-500">{urun.Birim || '-'}</td>
                    <td className="p-4 text-slate-700 font-medium">{urun.Fiyat} ₺</td>
                    <td className="p-4 pr-6 flex justify-center space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Düzenle">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(urun.UrunID)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Sil">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
