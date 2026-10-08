# LifeQuest

LifeQuest, günlük görevleri düzenlemeye ve kişisel ilerlemeyi takip etmeye yardımcı olan React tabanlı bir web uygulamasıdır. Görevler tamamlandıkça önceliklerine göre XP kazanılır; XP, seviye ilerlemesinde kullanılır.

## Özellikler

- Görev ekleme, düzenleme, silme ve tamamlandı olarak işaretleme
- Görevleri arama; kategori ve duruma göre filtreleme
- Önceliğe göre XP kazanma ve her 100 XP'de seviye ilerlemesi
- Günlük tamamlanan görev sayısı, toplam XP ve başarı oranı
- Değiştirilebilir günlük görev hedefi ve ardışık gün serisi
- İlk görev, günlük hedef, 7 günlük seri ve 100 XP rozetleri
- Son haftaların gün gün görev ve XP grafiği
- Görev, hedef ve ilerleme verilerini tarayıcıda saklama
- Mobil ve masaüstü ekranlarına uyumlu soft pembe tasarım

## Kullanılan teknolojiler

- React ve JavaScript
- Vite
- HTML ve Pure CSS
- Browser LocalStorage

## Projeyi çalıştırma

Bilgisayarda Node.js kurulu olmalıdır. Terminalde proje klasörüne geç:

```bash
cd lifequest
npm install
npm run dev
```

Terminalde gösterilen yerel adresi tarayıcıda aç.

## Kontroller

Kod kalitesi kontrolü ve yayın derlemesi için:

```bash
npm run lint
npm run build
```

Vite'ın yayın dosyaları `dist` klasörüne oluşturulur.

## Ekran görüntüsü

![LifeQuest dashboard](./screenshots/dashboard.png)

## Veri saklama ve kapsam

Görevler ve ilerleme bilgileri kullanıcının mevcut tarayıcısındaki LocalStorage alanında tutulur. Bu sürümde kullanıcı hesabı, cihazlar arası eşitleme veya arkadaşlarla çevrimiçi etkileşim bulunmaz.

## Netlify'da yayınlama

Netlify build ayarları:

- Build command: `npm run build`
- Publish directory: `dist`
- Base directory: boş
