import customtkinter as ctk
import requests

# Temel görünüm ayarları
ctk.set_appearance_mode("System")  # Bilgisayarınızın Dark/Light moduna göre uyum sağlar
ctk.set_default_color_theme("blue")  # Tema rengi

class PasaAsansorApp(ctk.CTk):
    def __init__(self):
        super().__init__()

        # Pencere Başlığı ve Boyutları
        self.title("Paşa Asansör ERP Sistemi")
        self.geometry("900x600")

        # --- SOL MENÜ (SIDEBAR) ---
        self.sidebar_frame = ctk.CTkFrame(self, width=200, corner_radius=0)
        self.sidebar_frame.pack(side="left", fill="y")
        
        # Şirket Logosu / Yazısı
        self.logo_label = ctk.CTkLabel(self.sidebar_frame, text="PAŞA GRUP", font=ctk.CTkFont(size=22, weight="bold"))
        self.logo_label.pack(pady=30)
        
        # Menü Butonları
        self.btn_dashboard = ctk.CTkButton(self.sidebar_frame, text="Dashboard", command=self.show_dashboard)
        self.btn_dashboard.pack(pady=10, padx=20)
        
        self.btn_urunler = ctk.CTkButton(self.sidebar_frame, text="Ürünler (Stok)", command=self.show_urunler)
        self.btn_urunler.pack(pady=10, padx=20)
        
        self.btn_cariler = ctk.CTkButton(self.sidebar_frame, text="Cariler", command=self.show_cariler)
        self.btn_cariler.pack(pady=10, padx=20)

        # --- ANA İÇERİK EKRANI (MAIN FRAME) ---
        self.main_frame = ctk.CTkFrame(self)
        self.main_frame.pack(side="right", fill="both", expand=True, padx=20, pady=20)

        # Uygulama açıldığında ilk Dashboard görünsün
        self.show_dashboard()

    def clear_main_frame(self):
        """Ana ekrandaki tüm öğeleri temizler ki yeni sayfaya geçebilelim."""
        for widget in self.main_frame.winfo_children():
            widget.destroy()

    def show_dashboard(self):
        self.clear_main_frame()
        label = ctk.CTkLabel(self.main_frame, text="Dashboard Ekranına Hoş Geldiniz", font=ctk.CTkFont(size=24, weight="bold"))
        label.pack(pady=50)

    def show_urunler(self):
        self.clear_main_frame()
        label = ctk.CTkLabel(self.main_frame, text="Ürün Yönetimi", font=ctk.CTkFont(size=24, weight="bold"))
        label.pack(pady=20)
        
        # FastAPI'den verileri çeken test butonu
        btn_getir = ctk.CTkButton(self.main_frame, text="Verileri Sunucudan Çek", command=self.get_urunler_api)
        btn_getir.pack(pady=10)

        # Sonuç mesajını göstereceğimiz etiket
        self.sonuc_label = ctk.CTkLabel(self.main_frame, text="Henüz veri çekilmedi.")
        self.sonuc_label.pack(pady=20)

    def show_cariler(self):
        self.clear_main_frame()
        label = ctk.CTkLabel(self.main_frame, text="Cari Yönetimi", font=ctk.CTkFont(size=24, weight="bold"))
        label.pack(pady=50)

    # --- API BAĞLANTISI ---
    def get_urunler_api(self):
        try:
            # Arka planda çalışan FastAPI sunucumuza İstek (GET) atıyoruz
            response = requests.get("http://127.0.0.1:8000/urunler/")
            if response.status_code == 200:
                urunler = response.json()
                self.sonuc_label.configure(text=f"Başarılı! API'den {len(urunler)} adet ürün verisi çekildi.", text_color="green")
            else:
                self.sonuc_label.configure(text="Sunucu bir hata döndürdü.", text_color="red")
        except Exception as e:
            # Eğer FastAPI çalışmıyorsa bu hatayı verir
            self.sonuc_label.configure(text="Bağlantı hatası! Arka planda sunucunun (main.py) çalıştığından emin olun.", text_color="red")

if __name__ == "__main__":
    app = PasaAsansorApp()
    app.mainloop()
