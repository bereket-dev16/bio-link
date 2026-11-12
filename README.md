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

## cPanel ile yayın

1. cPanel **Domains → Create a New Domain** ekranında `bio.mncilac.com` ekleyin. **Share document root** seçimini kaldırıp alt alan adına ayrı bir dizin ayırın. **Domains → Document Root** üzerinden yolu doğrulayın. DNS kaydını hostinge yönlendirin ve sertifika hazır olduğunda **Force HTTPS Redirect** seçimini açın. [cPanel alan adı yönetimi](https://docs.cpanel.net/cpanel/domains/domains/)
2. cPanel **FTP Accounts** bölümünde yayına özel bir hesap oluşturun. **Directory** alanını doğruladığınız alt alan adı dizinine ayarlayın. Bu hesapla giriş yapıldığında FTP’deki `/` doğrudan `bio.mncilac.com` belge kökü olmalıdır. [cPanel FTP hesabı ayarları](https://docs.cpanel.net/cpanel/files/ftp-accounts/)
3. Bu dizindeki `.bio-link-target` dosyasının tek satırı `bio.mncilac.com` olmalıdır. Önceki kurulumdaki işaret dosyasını kullanabilirsiniz. İlk kurulumda dosyayı cPanel File Manager ile oluşturun. Noktayla başlayan dosyalar için **Show Hidden Files** seçeneğini açabilirsiniz.
4. GitHub **Settings → Secrets and variables → Actions** bölümünde aşağıdaki **repository** ayarlarını girin.

| Tür | Ad | Değer |
| --- | --- | --- |
| Variable | `FTP_HOST` | TLS sertifikasıyla eşleşen FTP sunucu adı. Yalnızca adı girin. |
| Variable | `FTP_USERNAME` | Yayın hesabının tam FTP kullanıcı adı |
| Variable | `FTP_PORT` | Explicit FTPS portu. Boş bırakılırsa `21` kullanılır. |
| Secret | `FTP_PASSWORD` | Yayın hesabının FTP parolası |

Her `main` push’unda GitHub Actions `npm ci`, TypeScript kontrolü ve MNC üretim derlemesini çalıştırır. Zorunlu yayın ayarı eksikse build tamamlanır ve Actions günlüğü eksik alanları listeler. Ayarları ekledikten sonra **Actions → MNC Bio Link → Run workflow** ile `main` üzerinde yayını başlatabilirsiniz.

Yayın adımı, explicit FTPS ile TLS kurulmasını zorunlu tutar. Sertifika zinciri ve sunucu adı doğrulanır. Giriş bilgileri, dizin listesi ve dosyalar şifreli aktarılır. Hosting, pasif FTP veri bağlantılarına izin vermelidir.

İlk yazmadan önce FTP kökündeki işaret dosyası okunur ve ana hosting dizini ya da WordPress belirtileri kontrol edilir. `dist/` içindeki dosyalar aynı göreli yollarla `/` altına yüklenir. Her dosya aktarım tamamlanınca geçici adından hedef adına taşınır. `index.html` en son yayımlanır. Mevcut sürümlerin varlıkları ve diğer sunucu dosyaları korunur. Kesilen aktarım, ilgili dizinde `.bio-link-*.part` geçici dosyası bırakabilir.
