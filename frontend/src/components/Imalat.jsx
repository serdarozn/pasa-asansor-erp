import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Settings, CheckCircle2, AlertTriangle } from 'lucide-react';

const API_URL = 'http://127.0.0.1:8000';

export default function Imalat() {
  const [urunler, setUrunler] = useState([]);
  const [seciliUrun, setSeciliUrun] = useState('');
  const [uretimMiktari, setUretimMiktari] = useState(1);
  const [recete, setRecete] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/urunler/`).then(res => {
      setUrunler(res.data);
      if(res.data.length > 0) setSeciliUrun(res.data[0].UrunID);
    });
  }, []);

  useEffect(() => {
    if(seciliUrun) {
      axios.get(`${API_URL}/receteler/${seciliUrun}`).then(res => {
        // Mock veri: Eğer reçete API'si boş dönüyorsa, arayüzde uyarı gösterelim.
        setRecete(res.data);
      }).catch(e => console.error(e));
    }
  }, [seciliUrun]);

  const handleUretim = async () => {
    if(!window.confirm(`${uretimMiktari} adet üretim yapılacak. Bu işlem reçetedeki hammaddeleri stoktan eksi olarak düşecektir. Onaylıyor musunuz?`)) return;
    try {
      const res = await axios.post(`${API_URL}/imalat/`, { UretilecekUrunID: seciliUrun, UretimMiktari: uretimMiktari });
      alert("Başarılı: " + res.data.mesaj);
    } catch (error) {
      alert("İMALAT HATASI:\n" + (error.response?.data?.detail || "Üretim yapılamadı. Stokta yeterli malzeme olmayabilir."));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
        <div className="p-4 bg-blue-50 rounded-full mb-6">
          <Settings size={48} className="text-blue-600 animate-[spin_4s_linear_infinite]" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">İmalat (Üretim) Modülü</h2>
        <p className="text-slate-500 mt-3 max-w-lg text-lg">Üretilecek ürünü seçin ve miktarı girin. Sistem, reçetedeki tüm alt malzemeleri stoktan otomatik kontrol edip düşecek ve ana ürünü stoğa ekleyecektir.</p>
        
        <div className="mt-10 flex flex-col sm:flex-row items-end space-y-4 sm:space-y-0 sm:space-x-4 w-full max-w-2xl bg-white p-6 rounded-2xl border-2 border-blue-100 shadow-xl shadow-blue-900/5">
          <div className="flex-1 text-left w-full">
            <label className="block text-sm font-semibold mb-2 text-slate-700">Üretilecek Ana Ürün</label>
            <select value={seciliUrun} onChange={e => setSeciliUrun(e.target.value)} className="w-full border-2 border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 bg-slate-50">
              {urunler.map(u => <option key={u.UrunID} value={u.UrunID}>{u.UrunKodu} - {u.UrunAdi}</option>)}
            </select>
          </div>
          <div className="w-full sm:w-32 text-left">
            <label className="block text-sm font-semibold mb-2 text-slate-700">Adet</label>
            <input type="number" min="1" value={uretimMiktari} onChange={e => setUretimMiktari(e.target.value)} className="w-full border-2 border-slate-200 rounded-xl p-3 text-center font-bold outline-none focus:border-blue-500 bg-slate-50" />
          </div>
          <button onClick={handleUretim} className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 flex items-center justify-center transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
            <CheckCircle2 size={20} className="mr-2"/> Üretimi Başlat
          </button>
        </div>

        {recete.length === 0 && (
          <div className="mt-8 flex items-center space-x-2 text-amber-600 bg-amber-50 px-4 py-3 rounded-lg border border-amber-200">
            <AlertTriangle size={20} />
            <span className="text-sm font-medium">Bu ürün için tanımlanmış bir Reçete (BOM) bulunmuyor. Üretim yapılamaz! (Reçeteleri veritabanına girmelisiniz)</span>
          </div>
        )}
      </div>
    </div>
  );
}
