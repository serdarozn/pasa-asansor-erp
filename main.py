from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import engine, get_db
from app import models, schemas

# 1. ADIM: Tabloları Veritabanına Yazma
# Aşağıdaki kod, 'models.py' içerisinde tasarladığımız şablonları (Ürünler, Cariler vb.) alır
# ve gerçekte 'erp.db' adında bir veritabanı dosyası oluşturup tabloları içine kurar.
models.Base.metadata.create_all(bind=engine)

# 2. ADIM: FastAPI Uygulamasını Başlatma
# Uygulamamıza bir isim ve açıklama veriyoruz. Bu bilgiler otomatik oluşan dokümantasyonda görünecek.
app = FastAPI(
    title="Paşa Asansör ERP API",
    description="Stok, Cari ve Üretim (BOM) Takip Sistemi API'si",
    version="1.0.0"
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
