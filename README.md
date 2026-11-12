# Kurumsal Bio Link

MNC İlaç’ın mobil bağlantı sayfası. Vite, React, TypeScript, Tailwind CSS ve Lucide ile derlenir. Sunucuda yalnızca statik dosyalar çalışır. Logo, yazı tipleri ve görseller siteyle birlikte sunulur.

## Yerel çalıştırma

Node.js 24 LTS önerilir. Asgari sürüm 22.12’dir.

```sh
npm ci
npm run dev
```

Terminalde gösterilen yerel adresi açın. Varsayılan marka `mnc` olarak gelir.

## İçeriği güncelleme

- `brands/mnc/brand.json` profil adı, açıklama, renk paleti, logo, kapak, favicon, tipografi, konum ve SEO alanlarını içerir. MNC profilinde `logo` resmi amblemi gösterir. Bu alanı `null` yaparsanız profil adı tek başına görünür.
- `brands/mnc/assets/` logoyu, 600 ve 960 piksel genişliğindeki kapakları, paylaşım kartını ve yazı tiplerini içerir. JSON içindeki `/logo.webp` bu klasörün köküne karşılık gelir. `seo.url` sayfanın kanonik HTTPS adresidir.
- `brands/mnc/links.json` içindeki bir kaydı kopyalayıp benzersiz bir `id` verin. `title`, `url` ve `icon` alanlarını değiştirin. `description` isteğe bağlıdır. Linkler `order` değerine göre küçükten büyüğe sıralanır.
- `type` alanı `link` olduğunda bağlantı kartlarda, `social` olduğunda profil açıklamasının altında görünür. Profilde sosyal bağlantılar ve e-posta ikonla gösterilir. Başlık ve isteğe bağlı açıklama, ikonun erişilebilir adını ve araç ipucunu oluşturur. `featured: true` ana bağlantı kartını vurgular.
- `active: false` kaydı yayından kaldırır. Adresi beklenen bir kayıt için `url: ""` ve `active: false` kullanın. Web bağlantıları için tam HTTPS adresi, e-posta için `mailto:info@mncilac.com` biçiminde tek alıcı yazın. MNC profilinde Instagram ve LinkedIn etkindir.

Tanımlı ikonlar `globe`, `pill`, `book-open`, `message-circle`, `map-pin`, `mail`, `phone`, `link`, `instagram`, `linkedin` ve `youtube`. Başka bir ikon adı genel bağlantı simgesiyle gösterilir.

## Yeni marka ve üretim derlemesi

`brands/mnc/` klasörünü yeni marka adıyla kopyalayın. İki JSON dosyasını ve görselleri değiştirin. Marka klasör adına küçük harf veya rakamla başlayın. İsterseniz ad içinde tire ve alt çizgi kullanabilirsiniz. Yazı tiplerini değiştirirken açılışta gerekli fontların yollarını `preloadFonts` listesinde güncelleyin. Marka seçmek için terminalde `VITE_BRAND` tanımlayın veya proje kökünde `.env.local` dosyasına `VITE_BRAND=klasor-adi` yazın.

```sh
VITE_BRAND=mnc npm run build
npm run preview
```

Build, TypeScript ve marka ayarlarını kontrol eder. `dist/` yalnızca seçilen markayı ve yayındaki bağlantıları içerir. Üretim dosyaları alt alan adının kökünde sunulur. Sosyal paylaşım kartındaki yazıları değiştirdiğinizde `seo.image` alanındaki görseli de güncelleyin.

## Vercel ile otomatik yayın

Vercel, GitHub’daki `bereket-dev16/bio-link` deposunun `main` dalına bağlıdır. Bu dala gönderilen her commit, Vercel’in Git entegrasyonu üzerinden üretim dağıtımını başlatır. Başarılı derlemenin ardından site canlı adreste güncellenir. [Canlı site](https://bio.mncilac.com) · [GitHub deposu](https://github.com/bereket-dev16/bio-link)

Derleme komutu `npm run build`, yayınlanan dizin `dist/` ve varsayılan marka `mnc`’dir. Yayın durumunu ve derleme günlüklerini Vercel projesinin **Deployments** bölümünde ilgili commit üzerinden takip edebilirsiniz.
