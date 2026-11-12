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

- `brands/mnc/brand.json` marka adı, açıklama, renk paleti, kapak başlığı, logo, favicon, tipografi, konum ve SEO alanlarını içerir. `logo` değerini `null` yaparsanız marka adı metin olarak görünür.
- `brands/mnc/assets/` logoyu, 600 ve 960 piksel genişliğindeki kapakları, paylaşım kartını ve yazı tiplerini içerir. JSON içindeki `/logo.webp` bu klasörün köküne karşılık gelir. `seo.url` sayfanın kanonik HTTPS adresidir.
- `brands/mnc/links.json` içindeki bir kaydı kopyalayıp benzersiz bir `id` verin. `title`, `url` ve `icon` alanlarını değiştirin. `description` isteğe bağlıdır. Linkler `order` değerine göre küçükten büyüğe sıralanır.
- `type` alanı `link` olduğunda bağlantı kartlarda, `social` olduğunda kapakta görünür. Sosyal bağlantıda kısa açıklama, varsa kullanıcı adını göstermek için kullanılır. `featured: true` ana bağlantı kartını vurgular.
- `active: false` kaydı yayından kaldırır. Adresi beklenen bir kayıt için `url: ""` ve `active: false` kullanın. Aktif bağlantılar tam HTTPS adresi gerektirir. İlk sürümde resmî sitede adresi doğrulanan Instagram profili etkindir. [MNC İlaç](https://mncilac.com/iletisim/)

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
2. Doğruladığınız dizinde `.bio-link-target` adlı düz metin dosyası oluşturun. Dosyanın tek satırına `bio.mncilac.com` yazın. File Manager’da nokta ile başlayan dosyaları görmek için **Show Hidden Files** seçeneğini açabilirsiniz.
3. Hosting hesabında SSH kabuk erişimini ve `rsync` komutunu etkinleştirin. Yayına özel SSH anahtarının açık kısmını cPanel **SSH Access** bölümünde yetkilendirin.
4. GitHub **Settings → Secrets and variables → Actions** bölümünde aşağıdaki **repository** ayarlarını girin.

| Tür | Ad | Değer |
| --- | --- | --- |
| Variable | `SSH_HOST` | Hosting sağlayıcısının verdiği SSH sunucu adı veya IPv4 adresi |
| Variable | `SSH_PORT` | SSH portu. Varsayılan `22` |
| Variable | `SSH_USER` | SSH erişimi olan cPanel kullanıcısı |
| Variable | `DEPLOY_DIR` | Alt alan adının mutlak fiziksel dizini, örneğin `/home/hesap/bio.mncilac.com` |
| Secret | `SSH_PRIVATE_KEY` | Yayın anahtarının parolasız özel kısmı, başlık ve son satır dahil |
| Secret | `SSH_KNOWN_HOSTS` | Sunucu parmak izi hosting sağlayıcısıyla doğrulanmış OpenSSH `known_hosts` satırı. Özel portlarda sunucu alanı `[sunucu]:port` biçimindedir |

Her `main` push’unda GitHub Actions `npm ci`, TypeScript kontrolü ve MNC üretim derlemesini çalıştırır. Zorunlu yayın ayarı eksikse build tamamlanır ve Actions günlüğü eksik alanları listeler. Ayarları ekledikten sonra **Actions → MNC Bio Link → Run workflow** ile `main` üzerinde yayını başlatabilirsiniz.

SSH aktarımı her oturumda fiziksel hedefi ve işaret dosyasını doğrular. Ana web kökü, sembolik dizinler ve WordPress kurulumları doğrulamadan geçemez. Önce statik varlıklar, en son `index.html` aktarılır. Önceki build dosyaları ve hostinge ait dosyalar korunur.
