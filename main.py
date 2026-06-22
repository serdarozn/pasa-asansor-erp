from fastapi import FastAPI
from app.database import engine
from app import models

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
