# Artuno - Kripto Para Analiz Platformu

## 🚀 Proje Hakkında

Artuno, yapay zeka destekli kripto para analiz platformudur. Kullanıcılara gerçek zamanlı fiyat analizi, teknik göstergeler ve AI tabanlı tahminler sunar.

## ✨ Özellikler

- 🔐 Kullanıcı Kimlik Doğrulama
  - Google ile giriş
  - Email/Password ile kayıt ve giriş
  - Şifre sıfırlama
- 📊 Gerçek zamanlı kripto para grafikleri
- 🤖 AI destekli fiyat tahminleri
- 📈 Teknik göstergeler (MACD, RSI, SMA, EMA)
- 📱 Responsive tasarım
- 🌐 Anlık piyasa verileri
- 📊 Detaylı coin analizleri

## 🛠️ Teknolojiler

- **Frontend:** Next.js 15, React 19, TailwindCSS
- **Backend:** Next.js API Routes
- **Veritabanı:** Supabase
- **Kimlik Doğrulama:** Firebase Auth
- **AI/ML:** Hugging Face
- **API'ler:** CoinGecko
- **Grafikler:** Chart.js
- **Animasyonlar:** Framer Motion

## 🚀 Kurulum

1. Repoyu klonlayın:
```bash
git clone https://github.com/yourusername/artuno.git
cd artuno
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Ortam değişkenlerini ayarlayın:
- `.env.local` dosyası oluşturun
- Gerekli API anahtarlarını ekleyin:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - NEXT_PUBLIC_FIREBASE_* (tüm Firebase config)
  - NEXT_PUBLIC_COINGECKO_API_KEY
  - HUGGING_FACE_API_KEY

4. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

5. Tarayıcıda açın: `http://localhost:3000`

## 🌐 Deployment

1. Production build alın:
```bash
npm run build
```

2. Uygulamayı başlatın:
```bash
npm run start
```

### Vercel Deployment

1. Vercel CLI yükleyin:
```bash
npm i -g vercel
```

2. Deploy edin:
```bash
vercel
```

### Firebase Authentication Ayarları

1. Firebase Console'da Authentication > Settings bölümüne gidin
2. "Sign-in method" sekmesinde şu yöntemleri aktifleştirin:
   - Google Authentication
   - Email/Password Authentication
3. "Authorized domains" listesine şu domainleri ekleyin:
   - `localhost`
   - `artuno.vercel.app` (veya projenizin Vercel domain'i)
   - Varsa özel domain adresiniz
4. Email şablonlarını özelleştirin:
   - Email verification
   - Password reset
   - Email address change

## 🔑 Ortam Değişkenleri

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# CoinGecko
NEXT_PUBLIC_COINGECKO_API_KEY=your_coingecko_key
NEXT_PUBLIC_COINGECKO_API_URL=https://api.coingecko.com/api/v3

# Hugging Face
HUGGING_FACE_API_KEY=your_huggingface_key
HUGGING_FACE_API_URL=your_model_url
```

## 📝 Kullanım

1. Google hesabınızla giriş yapın
2. Dashboard'dan bir kripto para seçin
3. Detaylı analiz sayfasında:
   - Fiyat grafiğini inceleyin
   - Teknik göstergeleri kontrol edin
   - AI tahminlerini görüntüleyin
   - Piyasa analizlerini okuyun

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 📞 İletişim

Nefrius - [@nefrius](https://twitter.com/nefrius)

Proje Linki: [https://github.com/yourusername/artuno](https://github.com/yourusername/artuno)
