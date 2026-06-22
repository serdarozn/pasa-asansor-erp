from pydantic import BaseModel
from typing import Optional

# 1. Kullanıcıdan Gelecek Veri Şablonu (Ürün Ekleme)
# Sisteme yeni ürün eklenirken sadece bu bilgileri isteyeceğiz.
# (ID, GuncelStok gibi bilgiler otomatik oluşacağı için burada yok)
class UrunCreate(BaseModel):
    UrunKodu: str
    UrunAdi: str
    Kategori: Optional[str] = None # Örneğin: Mekanik, Elektronik
    Birim: Optional[str] = None    # Örneğin: Adet, Metre
    RafKonumu: Optional[str] = None
    Fiyat: Optional[float] = 0.0

# 2. Kullanıcıya Gönderilecek Veri Şablonu (Ürün Listeleme/Gösterme)
# Veritabanından ürünü çektiğimizde dışarıya hangi bilgileri vereceğimizi belirliyoruz.
class UrunResponse(BaseModel):
    UrunID: int
    UrunKodu: str
    UrunAdi: str
    Kategori: Optional[str] = None
    Birim: Optional[str] = None
    GuncelStok: float
    KritikStok: float
    RafKonumu: Optional[str] = None
    Fiyat: float

    # Bu ayar, Pydantic'in veritabanı modelimizi (SQLAlchemy) tanımasını sağlar.
    class Config:
        from_attributes = True

# 3. Ürün Güncelleme Şablonu
# Güncelleme işleminde sadece değişen bilgilerin gönderilebilmesi için her şeyi 'Optional' yapıyoruz.
class UrunUpdate(BaseModel):
    UrunAdi: Optional[str] = None
    Kategori: Optional[str] = None
    Birim: Optional[str] = None
    RafKonumu: Optional[str] = None
    Fiyat: Optional[float] = None
    KritikStok: Optional[float] = None

# --- CARİ ŞEMALARI ---
class CariCreate(BaseModel):
    CariKodu: str
    FirmaUnvani: str
    CariTipi: str = "Müşteri" # "Müşteri" veya "Tedarikçi"
    YetkiliKisi: Optional[str] = None
    Telefon: Optional[str] = None
    Adres: Optional[str] = None

class CariResponse(BaseModel):
    CariID: int
    CariKodu: str
    FirmaUnvani: str
    CariTipi: str
    YetkiliKisi: Optional[str] = None
    Telefon: Optional[str] = None
    Adres: Optional[str] = None

    class Config:
        from_attributes = True

# --- STOK HAREKETİ ŞEMALARI ---
from datetime import datetime

class StokHareketiCreate(BaseModel):
    UrunID: int
    CariID: Optional[int] = None
    IslemTipi: str # "Giriş" veya "Çıkış"
    Miktar: float

class StokHareketiResponse(BaseModel):
    HareketID: int
    UrunID: int
    CariID: Optional[int] = None
    IslemTipi: str
    Miktar: float
    IslemTarihi: datetime
    
    class Config:
        from_attributes = True

# --- ÜRETİM REÇETESİ (BOM) ŞEMALARI ---
class UretimRecetesiCreate(BaseModel):
    UretilecekUrunID: int
    GerekliUrunID: int
    GerekliMiktar: float

class UretimRecetesiResponse(BaseModel):
    ReceteID: int
    UretilecekUrunID: int
    GerekliUrunID: int
    GerekliMiktar: float

    class Config:
        from_attributes = True

# Üretim emri vermek için şema
class UretimYap(BaseModel):
    UretilecekUrunID: int
    UretimMiktari: float
