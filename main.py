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
