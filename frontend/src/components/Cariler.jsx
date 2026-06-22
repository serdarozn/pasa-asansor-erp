import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Building2 } from 'lucide-react';

const API_URL = 'http://127.0.0.1:8000';

export default function Cariler() {
  const [cariler, setCariler] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    CariKodu: '', FirmaUnvani: '', CariTipi: 'Müşteri', YetkiliKisi: '', Telefon: '', Adres: ''
  });

  const fetchCariler = async () => {
    try {
      const response = await axios.get(`${API_URL}/cariler/`);
      setCariler(response.data);
    } catch (error) { console.error("Hata", error); }
  };

  useEffect(() => { fetchCariler(); }, []);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/cariler/`, formData);
      setIsFormOpen(false);
      setFormData({ CariKodu: '', FirmaUnvani: '', CariTipi: 'Müşteri', YetkiliKisi: '', Telefon: '', Adres: '' });
      fetchCariler();
    } catch (error) { alert("Hata: " + (error.response?.data?.detail || "Kayıt yapılamadı")); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Cariyi silmek istediğinize emin misiniz?')) {
      try { await axios.delete(`${API_URL}/cariler/${id}`); fetchCariler(); }
      catch (error) { console.error(error); }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Cari (Müşteri/Tedarikçi) Yönetimi</h2>
          <p className="text-slate-500 text-sm mt-1">Firmanızın çalıştığı tüm müşteri ve tedarikçileri buradan yönetin.</p>
        </div>
        <button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center space-x-2 transition-colors font-medium shadow-sm">
          <Plus size={20} /><span>Yeni Cari Ekle</span>
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 animate-in fade-in slide-in-from-top-4">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div><label className="block text-sm font-medium mb-1">Cari Kodu *</label><input required name="CariKodu" value={formData.CariKodu} onChange={handleInputChange} className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div><label className="block text-sm font-medium mb-1">Firma Ünvanı *</label><input required name="FirmaUnvani" value={formData.FirmaUnvani} onChange={handleInputChange} className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div>
              <label className="block text-sm font-medium mb-1">Cari Tipi</label>
              <select name="CariTipi" value={formData.CariTipi} onChange={handleInputChange} className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Müşteri">Müşteri</option>
                <option value="Tedarikçi">Tedarikçi</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium mb-1">Yetkili Kişi</label><input name="YetkiliKisi" value={formData.YetkiliKisi} onChange={handleInputChange} className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div><label className="block text-sm font-medium mb-1">Telefon</label><input name="Telefon" value={formData.Telefon} onChange={handleInputChange} className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div><label className="block text-sm font-medium mb-1">Adres</label><input name="Adres" value={formData.Adres} onChange={handleInputChange} className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div className="col-span-1 md:col-span-2 flex justify-end space-x-3 mt-4">
              <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 bg-slate-100 rounded-xl font-medium hover:bg-slate-200 transition-colors">İptal</button>
              <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">Kaydet</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b text-slate-600 text-sm">
            <tr><th className="p-4 pl-6">Kodu</th><th className="p-4">Firma Ünvanı</th><th className="p-4">Tip</th><th className="p-4">Yetkili</th><th className="p-4">Telefon</th><th className="p-4 text-center pr-6">İşlem</th></tr>
          </thead>
          <tbody>
            {cariler.length === 0 ? <tr><td colSpan="6" className="p-8 text-center text-slate-500">Henüz hiç cari eklenmemiş.</td></tr> : null}
            {cariler.map((c) => (
              <tr key={c.CariID} className="border-b hover:bg-slate-50">
                <td className="p-4 pl-6 font-semibold">{c.CariKodu}</td><td className="p-4">{c.FirmaUnvani}</td>
                <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-bold ${c.CariTipi === 'Müşteri' ? 'bg-indigo-100 text-indigo-700' : 'bg-orange-100 text-orange-700'}`}>{c.CariTipi}</span></td>
                <td className="p-4">{c.YetkiliKisi || '-'}</td><td className="p-4">{c.Telefon || '-'}</td>
                <td className="p-4 pr-6 flex justify-center"><button onClick={() => handleDelete(c.CariID)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
