from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Geliştirme aşaması için SQLite kullanıyoruz.
# Üretime (Production) geçerken bu URL'i PostgreSQL ile değiştirebilirsiniz.
# Örnek: SQLALCHEMY_DATABASE_URL = "postgresql://kullanici:sifre@localhost/erp_db"
SQLALCHEMY_DATABASE_URL = "sqlite:///./erp.db"

# SQLite, aynı thread'de çalışmayı bekler, FastAPI ile asenkron kullanımlarda 
# sorun yaşamamak için "check_same_thread" false olarak ayarlanır.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Veritabanı oturumu oluşturucu (SessionLocal)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Tüm modellerin türetileceği temel (Base) sınıf
Base = declarative_base()

# FastAPI için Dependency Injection amacıyla kullanılacak veritabanı bağlantı fonksiyonu
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
