from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
import datetime
import enum
from .database import Base

class CariTipiEnum(str, enum.Enum):
    MUSTERI = "Müşteri"
    TEDARIKCI = "Tedarikçi"

class IslemTipiEnum(str, enum.Enum):
    GIRIS = "Giriş"
    CIKIS = "Çıkış"

class Urun(Base):
    __tablename__ = "urunler"

    UrunID = Column(Integer, primary_key=True, index=True)
    UrunKodu = Column(String, unique=True, index=True, nullable=False)
    UrunAdi = Column(String, index=True, nullable=False)
    Kategori = Column(String, index=True)  # Mekanik, Elektronik vb.
    Birim = Column(String)  # Adet, Kg, Metre vb.
    GuncelStok = Column(Float, default=0.0)
    KritikStok = Column(Float, default=0.0)
    RafKonumu = Column(String)
    Fiyat = Column(Float, default=0.0)

    # İlişkiler (Relationships)
    stok_hareketleri = relationship("StokHareketi", back_populates="urun")
    
    # BOM (Üretim Reçetesi) İlişkileri
    # Bir ürün, birden fazla reçetede üretilecek ana ürün olabilir.
    recete_uretilen = relationship("UretimRecetesi", foreign_keys="[UretimRecetesi.UretilecekUrunID]", back_populates="uretilen_urun")
    # Bir ürün, birden fazla reçetede alt malzeme (hammadde) olarak kullanılabilir.
    recete_malzeme = relationship("UretimRecetesi", foreign_keys="[UretimRecetesi.GerekliUrunID]", back_populates="gerekli_urun")


class Cari(Base):
    __tablename__ = "cariler"

    CariID = Column(Integer, primary_key=True, index=True)
    CariKodu = Column(String, unique=True, index=True, nullable=False)
    FirmaUnvani = Column(String, index=True, nullable=False)
    CariTipi = Column(Enum(CariTipiEnum), default=CariTipiEnum.MUSTERI)
    YetkiliKisi = Column(String)
    Telefon = Column(String)
    Adres = Column(String)

    # İlişkiler (Relationships)
    stok_hareketleri = relationship("StokHareketi", back_populates="cari")


class StokHareketi(Base):
    __tablename__ = "stok_hareketleri"

    HareketID = Column(Integer, primary_key=True, index=True)
    UrunID = Column(Integer, ForeignKey("urunler.UrunID"), nullable=False)
    # Üretim fireleri veya sayım farklarında CariID olmayabileceği için nullable=True bırakıyoruz.
    CariID = Column(Integer, ForeignKey("cariler.CariID"), nullable=True) 
    IslemTipi = Column(Enum(IslemTipiEnum), nullable=False)
    Miktar = Column(Float, nullable=False)
    IslemTarihi = Column(DateTime, default=datetime.datetime.utcnow)

    # İlişkiler (Relationships)
    urun = relationship("Urun", back_populates="stok_hareketleri")
    cari = relationship("Cari", back_populates="stok_hareketleri")


class UretimRecetesi(Base):
    __tablename__ = "uretim_receteleri"

    ReceteID = Column(Integer, primary_key=True, index=True)
    # Üretilecek ana kabin veya asansör aksamı
    UretilecekUrunID = Column(Integer, ForeignKey("urunler.UrunID"), nullable=False)
    # Bu üretim için harcanacak alt malzeme (hammadde)
    GerekliUrunID = Column(Integer, ForeignKey("urunler.UrunID"), nullable=False)
    # Ne kadar harcanacağı
    GerekliMiktar = Column(Float, nullable=False)

    # İlişkiler (Relationships)
    uretilen_urun = relationship("Urun", foreign_keys=[UretilecekUrunID], back_populates="recete_uretilen")
    gerekli_urun = relationship("Urun", foreign_keys=[GerekliUrunID], back_populates="recete_malzeme")
