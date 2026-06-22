from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from app.database import engine, get_db
from app import models, schemas

# 1. ADIM: Tabloları Veritabanına Yazma
# Aşağıdaki kod, 'models.py' içerisinde tasarladığımız şablonları (Ürünler, Cariler vb.) alır
# ve gerçekte 'erp.db' adında bir veritabanı dosyası oluşturup tabloları içine kurar.
models.Base.metadata.create_all(bind=engine)

# 2. ADIM: FastAPI Uygulamasını Başlatma
app = FastAPI(
    title="Paşa Asansör ERP API",
    description="Stok, Cari ve Üretim (BOM) Takip Sistemi API'si",
    version="1.0.0"
)

# CORS Ayarları: React arayüzünün bu sunucuya erişebilmesine izin verir
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Güvenlik için ileride sadece React adresine kısıtlanabilir
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. ADIM: İlk Fonksiyon (Endpoint - Uç Nokta)
# İnternet tarayıcısından ana adrese ("/") girildiğinde bu fonksiyon çalışır.
@app.get("/")
def ana_sayfa():
    # Bu fonksiyon dışarıya basit bir karşılama mesajı gönderiyor.
    return {
        "mesaj": "Paşa Asansör ERP Sistemine Hoş Geldiniz!",
        "durum": "Sistem Başarıyla Çalışıyor"
    }

# 4. ADIM: Yeni Ürün Ekleme (POST İşlemi)
# Bu fonksiyon, dışarıdan gelen ürün bilgilerini alır ve veritabanına kaydeder.
@app.post("/urunler/", response_model=schemas.UrunResponse)
def urun_ekle(urun: schemas.UrunCreate, db: Session = Depends(get_db)):
    # Aynı ürün koduyla başka bir ürün var mı diye kontrol edelim
    db_urun = db.query(models.Urun).filter(models.Urun.UrunKodu == urun.UrunKodu).first()
    if db_urun:
        raise HTTPException(status_code=400, detail="Bu ürün kodu zaten kayıtlı!")
    
    # Yeni ürünü veritabanı modelimize çeviriyoruz
    yeni_urun = models.Urun(**urun.model_dump())
    
    db.add(yeni_urun)    # Ürünü veritabanı oturumuna ekle
    db.commit()          # Değişiklikleri kaydet
    db.refresh(yeni_urun) # Veritabanından oluşan yeni ID'siyle birlikte güncel halini al
    
    return yeni_urun

# 5. ADIM: Tüm Ürünleri Listeleme (GET İşlemi)
# Bu fonksiyon, veritabanındaki kayıtlı tüm ürünleri liste halinde geri döndürür.
@app.get("/urunler/", response_model=List[schemas.UrunResponse])
def urunleri_getir(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # skip ve limit: Sayfalama (pagination) yapmak içindir. (Örn: İlk 100 ürünü getir)
    urunler = db.query(models.Urun).offset(skip).limit(limit).all()
    return urunler

# 6. ADIM: Ürün Güncelleme (PUT İşlemi)
# Bu fonksiyon, var olan bir ürünün bilgilerini (Fiyat, Raf Konumu vb.) değiştirmek içindir.
@app.put("/urunler/{urun_id}", response_model=schemas.UrunResponse)
def urun_guncelle(urun_id: int, urun_guncel: schemas.UrunUpdate, db: Session = Depends(get_db)):
    # 1. Önce veritabanında bu ID'ye sahip bir ürün var mı diye kontrol ediyoruz.
    db_urun = db.query(models.Urun).filter(models.Urun.UrunID == urun_id).first()
    if not db_urun:
        raise HTTPException(status_code=404, detail="Güncellenmek istenen ürün bulunamadı!")
    
    # 2. Gelen verideki sadece dolu olan alanları alıyoruz (exclude_unset=True)
    guncel_veriler = urun_guncel.model_dump(exclude_unset=True) 
    
    # 3. Mevcut ürünün bilgilerini yeni bilgilerle değiştiriyoruz
    for key, value in guncel_veriler.items():
        setattr(db_urun, key, value)
        
    db.commit()          # Değişiklikleri kaydet
    db.refresh(db_urun)  # Son halini veritabanından geri çek
    return db_urun

# 7. ADIM: Ürün Silme (DELETE İşlemi)
# Bu fonksiyon, veritabanından bir ürünü tamamen siler.
@app.delete("/urunler/{urun_id}")
def urun_sil(urun_id: int, db: Session = Depends(get_db)):
    db_urun = db.query(models.Urun).filter(models.Urun.UrunID == urun_id).first()
    if not db_urun:
        raise HTTPException(status_code=404, detail="Silinmek istenen ürün bulunamadı!")
        
    db.delete(db_urun)   # Ürünü sil
    db.commit()          # Silme işlemini kaydet
    return {"mesaj": f"ID'si {urun_id} olan ürün başarıyla silindi."}

# --- CARİ (MÜŞTERİ/TEDARİKÇİ) İŞLEMLERİ ---

@app.post("/cariler/", response_model=schemas.CariResponse)
def cari_ekle(cari: schemas.CariCreate, db: Session = Depends(get_db)):
    db_cari = db.query(models.Cari).filter(models.Cari.CariKodu == cari.CariKodu).first()
    if db_cari:
        raise HTTPException(status_code=400, detail="Bu cari kodu zaten kayıtlı!")
    yeni_cari = models.Cari(**cari.model_dump())
    db.add(yeni_cari)
    db.commit()
    db.refresh(yeni_cari)
    return yeni_cari

@app.get("/cariler/", response_model=List[schemas.CariResponse])
def carileri_getir(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Cari).offset(skip).limit(limit).all()

@app.delete("/cariler/{cari_id}")
def cari_sil(cari_id: int, db: Session = Depends(get_db)):
    db_cari = db.query(models.Cari).filter(models.Cari.CariID == cari_id).first()
    if not db_cari:
        raise HTTPException(status_code=404, detail="Cari bulunamadı!")
    db.delete(db_cari)
    db.commit()
    return {"mesaj": "Cari başarıyla silindi."}

# --- STOK HAREKETLERİ İŞLEMLERİ ---

@app.post("/stok_hareketleri/", response_model=schemas.StokHareketiResponse)
def stok_hareketi_ekle(hareket: schemas.StokHareketiCreate, db: Session = Depends(get_db)):
    # 1. İşlem yapılacak ürünü bul
    db_urun = db.query(models.Urun).filter(models.Urun.UrunID == hareket.UrunID).first()
    if not db_urun:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı!")

    # 2. Stok miktarını otomatik güncelle
    if hareket.IslemTipi == "Giriş":
        db_urun.GuncelStok += hareket.Miktar
    elif hareket.IslemTipi == "Çıkış":
        if db_urun.GuncelStok < hareket.Miktar:
            # Eksi stoğa izin vermiyoruz (Tavsiye edilen yol)
            raise HTTPException(status_code=400, detail=f"Yetersiz stok! Mevcut stok: {db_urun.GuncelStok}")
        db_urun.GuncelStok -= hareket.Miktar
    else:
        raise HTTPException(status_code=400, detail="Geçersiz işlem tipi. Sadece 'Giriş' veya 'Çıkış' olabilir.")

    # 3. Hareket kaydını veritabanına işle
    yeni_hareket = models.StokHareketi(**hareket.model_dump())
    db.add(yeni_hareket)
    db.commit()
    db.refresh(yeni_hareket)
    return yeni_hareket

@app.get("/stok_hareketleri/", response_model=List[schemas.StokHareketiResponse])
def stok_hareketlerini_getir(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.StokHareketi).order_by(models.StokHareketi.IslemTarihi.desc()).offset(skip).limit(limit).all()

# --- İMALAT VE ÜRETİM REÇETESİ (BOM) İŞLEMLERİ ---

@app.post("/receteler/", response_model=schemas.UretimRecetesiResponse)
def recete_ekle(recete: schemas.UretimRecetesiCreate, db: Session = Depends(get_db)):
    yeni_recete = models.UretimRecetesi(**recete.model_dump())
    db.add(yeni_recete)
    db.commit()
    db.refresh(yeni_recete)
    return yeni_recete

@app.get("/receteler/{urun_id}", response_model=List[schemas.UretimRecetesiResponse])
def recete_getir(urun_id: int, db: Session = Depends(get_db)):
    # Belirli bir kabin/motor için tanımlanmış reçeteyi (alt malzemeleri) getirir
    return db.query(models.UretimRecetesi).filter(models.UretimRecetesi.UretilecekUrunID == urun_id).all()

@app.post("/imalat/")
def imalat_yap(uretim: schemas.UretimYap, db: Session = Depends(get_db)):
    # 1. Üretilecek hedef ürünü bul
    hedef_urun = db.query(models.Urun).filter(models.Urun.UrunID == uretim.UretilecekUrunID).first()
    if not hedef_urun:
        raise HTTPException(status_code=404, detail="Üretilecek ürün bulunamadı!")
        
    # 2. Bu ürünün reçetesini (kullanılacak malzemeler listesini) getir
    recete_kalemleri = db.query(models.UretimRecetesi).filter(models.UretimRecetesi.UretilecekUrunID == uretim.UretilecekUrunID).all()
    if not recete_kalemleri:
        raise HTTPException(status_code=400, detail="Bu ürün için bir üretim reçetesi tanımlanmamış!")

    # 3. Stok Kontrolü (Hammadde yeterli mi?)
    for kalem in recete_kalemleri:
        gereken_toplam = kalem.GerekliMiktar * uretim.UretimMiktari
        malzeme_urun = db.query(models.Urun).filter(models.Urun.UrunID == kalem.GerekliUrunID).first()
        if malzeme_urun.GuncelStok < gereken_toplam:
            raise HTTPException(
                status_code=400, 
                detail=f"İmalat İptal Edildi: {malzeme_urun.UrunAdi} stoğu yetersiz! Gereken: {gereken_toplam}, Mevcut: {malzeme_urun.GuncelStok}"
            )

    # 4. Üretime Başla: Malzemeleri stoktan düş ve hareket logu at
    for kalem in recete_kalemleri:
        gereken_toplam = kalem.GerekliMiktar * uretim.UretimMiktari
        malzeme_urun = db.query(models.Urun).filter(models.Urun.UrunID == kalem.GerekliUrunID).first()
        
        malzeme_urun.GuncelStok -= gereken_toplam # Stoktan düş
        
        # Log (Çıkış Hareketi) oluştur
        cikis_hareketi = models.StokHareketi(
            UrunID=kalem.GerekliUrunID,
            IslemTipi="Çıkış",
            Miktar=gereken_toplam
        )
        db.add(cikis_hareketi)

    # 5. Üretilen Ana Ürünün stoğunu artır ve logla
    hedef_urun.GuncelStok += uretim.UretimMiktari
    giris_hareketi = models.StokHareketi(
        UrunID=uretim.UretilecekUrunID,
        IslemTipi="Giriş",
        Miktar=uretim.UretimMiktari
    )
    db.add(giris_hareketi)

    # İşlemi topluca onayla
    db.commit()
    return {"mesaj": f"{uretim.UretimMiktari} adet {hedef_urun.UrunAdi} başarıyla üretildi. Alt malzemeler stoktan düşüldü."}
