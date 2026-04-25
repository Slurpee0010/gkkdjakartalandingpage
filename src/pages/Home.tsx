import { useEffect, useState } from "react";
import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Church,
  Compass,
  HeartHandshake,
  MapPinned,
  PhoneCall,
  PlayCircle,
  Sparkles,
  Users,
} from "lucide-react";
import { db } from "../lib/firebase";
import AutoplayYoutubeEmbed from "../components/AutoplayYoutubeEmbed";
import {
  SATELLITE_LOCAL_IMAGES,
  WORSHIP_TARGET_EVENT_NAME,
  WORSHIP_TARGET_STORAGE_KEY,
  type SatelliteOption,
} from "../lib/worshipSchedules";
import { doc, onSnapshot } from "firebase/firestore";
import { getYoutubeEmbedUrl, getYoutubeWatchUrl } from "../lib/youtube";
import AppButton from "../components/ui/AppButton";
import type { NavigateToPage, PageId } from "../lib/navigation";

interface HomeProps {
  setActivePage: NavigateToPage;
}

interface HeroSlide {
  id: string;
  verse: string;
  reference: string;
  supportingText: string;
  backgroundSrc: string;
  annualLogoSrc: string;
}

interface IntentCard {
  id: PageId;
  title: string;
  description: string;
}

interface SatelliteCard {
  satellite: SatelliteOption;
  title: string;
  description: string;
}

interface QuickLink {
  id: PageId;
  title: string;
  description: string;
  icon: LucideIcon;
}

const heroSlides: HeroSlide[] = [
  {
    id: "hero-misi",
    verse: "PERGILAH, JADIKANLAH SEMUA BANGSA MURID-KU.",
    reference: "Matius 28:19",
    supportingText:
      "Biarlah setiap langkah gereja ini terus membawa kabar keselamatan, pemuridan, dan kebangunan rohani bagi jiwa-jiwa.",
    backgroundSrc: "/img/bghero.jpg",
    annualLogoSrc: "/img/tema26.png",
  },
  // {
  //   id: "hero-keselamatan",
  //   verse: "DIA MENGHENDAKI SUPAYA SEMUA ORANG DISELAMATKAN.",
  //   reference: "1 Timotius 2:4",
  //   supportingText:
  //     "Kerinduan kami tetap sama: menghadirkan gereja yang membuka jalan bagi lebih banyak orang untuk mengenal Kristus.",
  //   backgroundSrc: "/img/home-hero-slide-2.jpg",
  //   annualLogoSrc: "/img/logo-tahunan-gereja.png",
  // },
  // {
  //   id: "hero-kuasa",
  //   verse: "BUKAN DENGAN KEPERKASAAN, MELAINKAN DENGAN ROH-KU.",
  //   reference: "Zakharia 4:6",
  //   supportingText:
  //     "Semua pelayanan, komunitas, dan misi kami berdiri di atas pertolongan dan pekerjaan Roh Tuhan yang hidup.",
  //   backgroundSrc: "/img/home-hero-slide-3.jpg",
  //   annualLogoSrc: "/img/logo-tahunan-gereja.png",
  // },
];

const intentCards: IntentCard[] = [
  { id: "worship", title: "Saya ingin ikut ibadah", description: "Temukan jadwal, lokasi, dan contact person dengan cepat." },
  { id: "blesscomn", title: "Saya ingin cari komunitas", description: "Masuk ke BlessComn untuk bertumbuh dan terhubung lebih dalam." },
  { id: "mission", title: "Saya ingin lihat pelayanan misi", description: "Telusuri daerah dan bangsa yang sudah dijangkau GKKD Jakarta." },
  { id: "events", title: "Saya ingin tahu event terbaru", description: "Lihat momentum penting yang sedang berjalan atau akan datang." },
];

const satelliteCards: SatelliteCard[] = [
  { satellite: "Jakarta Center", title: "Jakarta Center", description: "Pakuwon Tower Lt. 2 & 3" },
  { satellite: "Jakarta Utara", title: "Jakarta Utara", description: "Victory House di Harton Tower" },
  { satellite: "Southers", title: "Southers", description: "Bintaro, Tangerang Selatan" },
  { satellite: "Ciledug", title: "Ciledug", description: "Sekolah Petra Alpha" },
  { satellite: "Serpong", title: "Serpong", description: "Karawaci Office Park" },
];

const quickLinks: QuickLink[] = [
  { id: "about", title: "Tentang GKKD", description: "Kenali visi, misi, dan kepemimpinan gereja ini.", icon: Church },
  { id: "services", title: "Layanan", description: "Lihat berbagai pelayanan yang menemani pertumbuhan rohani.", icon: HeartHandshake },
  { id: "events", title: "Event", description: "Cek agenda terbaru yang bisa Anda ikuti bersama jemaat.", icon: Sparkles },
  { id: "contact", title: "Kontak", description: "Hubungi tim GKKD Jakarta untuk pertanyaan atau bantuan awal.", icon: PhoneCall },
];

const exploreLinks: Array<{ label: string; page: PageId; icon: LucideIcon }> = [
  { label: "Mulai dari Ibadah", page: "worship", icon: CalendarClock },
  { label: "Masuk ke BlessComn", page: "blesscomn", icon: Users },
  { label: "Lihat Pelayanan Misi", page: "mission", icon: Compass },
];

export default function Home({ setActivePage }: HomeProps) {
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [onlineWorshipUrl, setOnlineWorshipUrl] = useState("");

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveHeroIndex((current) => (current + 1) % heroSlides.length);
    }, 6500);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const settingsRef = doc(db, "settings", "onlineWorshipVideo");

    const unsubscribe = onSnapshot(settingsRef, (snapshot) => {
      const data = snapshot.data() as { youtubeUrl?: string } | undefined;
      setOnlineWorshipUrl(data?.youtubeUrl ?? "");
    });

    return () => unsubscribe();
  }, []);

  const goToSatellite = (satellite: SatelliteOption) => {
    window.sessionStorage.setItem(WORSHIP_TARGET_STORAGE_KEY, satellite);
    window.dispatchEvent(new CustomEvent(WORSHIP_TARGET_EVENT_NAME, { detail: satellite }));
    setActivePage("worship");
  };

  const onlineWorshipEmbedUrl = getYoutubeEmbedUrl(onlineWorshipUrl);
  const onlineWorshipWatchUrl =
    getYoutubeWatchUrl(onlineWorshipUrl) ??
    "https://www.youtube.com/channel/UCyNy-POkQW7wDl-jwL1B8Iw";

  return (
    <div className="pt-20 pb-24">
      <section className="px-4 pt-6 md:pt-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[3rem] border border-church-gold/10 bg-church-dark shadow-[0_30px_100px_rgba(26,26,26,0.18)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(197,160,89,0.22),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.08),_transparent_24%)]" />

            {heroSlides.map((slide, index) => {
              const isActive = index === activeHeroIndex;

              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-700 ${isActive ? "opacity-100" : "pointer-events-none opacity-0"}`}
                >
                  <img
                    src={slide.backgroundSrc}
                    alt={slide.reference}
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,13,13,0.86),rgba(13,13,13,0.28)_50%,rgba(13,13,13,0.88))]" />
                </div>
              );
            })}

            <div className="relative z-10 min-h-[34rem] px-6 py-8 text-white md:px-10 md:py-10 lg:px-12 lg:py-12">
              <motion.div
                key={`${heroSlides[activeHeroIndex].id}-logo`}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45 }}
                className="pointer-events-none absolute right-6 top-6 w-24 md:right-10 md:top-8 md:w-32 lg:right-12 lg:top-10 lg:w-52"
              >
                <img
                  src={heroSlides[activeHeroIndex].annualLogoSrc}
                  alt="Logo Tahunan Gereja"
                  className="w-full object-contain drop-shadow-[0_16px_36px_rgba(0,0,0,0.32)]"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              </motion.div>

              <div className="max-w-4xl pr-20 md:pr-36 lg:pr-64">
                <span className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-church-gold">
                  <Sparkles size={14} />
                  GKKD Jakarta
                </span>
                <motion.div
                  key={heroSlides[activeHeroIndex].id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                  className="mt-8"
                >
                  <p className="text-xs uppercase tracking-[0.28em] text-white/70">Ayat Tema</p>
                  <h1 className="serif mt-4 max-w-5xl text-5xl font-bold uppercase leading-[0.9] text-white md:text-7xl xl:text-[5.1rem]">
                    {heroSlides[activeHeroIndex].verse}
                  </h1>
                  <p className="mt-5 text-sm font-semibold uppercase tracking-[0.28em] text-church-gold">
                    {heroSlides[activeHeroIndex].reference}
                  </p>
                  <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
                    {heroSlides[activeHeroIndex].supportingText}
                  </p>
                </motion.div>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <AppButton
                    type="button"
                    onClick={() => setActivePage("worship")}
                    className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-church-dark transition-colors hover:bg-church-gold"
                  >
                    Temukan Jadwal Ibadah
                    <ArrowRight size={16} />
                  </AppButton>
                  <AppButton
                    type="button"
                    onClick={() => setActivePage("about")}
                    className="inline-flex items-center justify-center gap-3 rounded-full border border-white/15 bg-white/8 px-7 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/14"
                  >
                    Kenali GKKD Lebih Dekat
                  </AppButton>
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  {heroSlides.map((slide, index) => (
                    <AppButton
                      key={slide.id}
                      type="button"
                      buttonMotion="icon"
                      onClick={() => setActiveHeroIndex(index)}
                      className={`h-2.5 rounded-full transition-all ${index === activeHeroIndex ? "w-10 bg-church-gold" : "w-2.5 bg-white/35"}`}
                      aria-label={`Buka slide ${index + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <AppButton
                    type="button"
                    buttonMotion="icon"
                    onClick={() => setActiveHeroIndex((current) => (current - 1 + heroSlides.length) % heroSlides.length)}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white transition-colors hover:bg-white/14"
                    aria-label="Slide sebelumnya"
                  >
                    <ChevronLeft size={18} />
                  </AppButton>
                  <AppButton
                    type="button"
                    buttonMotion="icon"
                    onClick={() => setActiveHeroIndex((current) => (current + 1) % heroSlides.length)}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white transition-colors hover:bg-white/14"
                    aria-label="Slide berikutnya"
                  >
                    <ChevronRight size={18} />
                  </AppButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pt-8 md:pt-12">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.04fr_0.96fr]">
          <div className="relative overflow-hidden rounded-[3rem] border border-church-gold/10 bg-[radial-gradient(circle_at_top_left,_rgba(197,160,89,0.24),_transparent_32%),linear-gradient(135deg,_rgba(253,251,247,1),_rgba(244,238,227,0.98))] p-8 shadow-[0_25px_90px_rgba(26,26,26,0.06)] md:p-12">
            <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-church-gold/10 blur-3xl" />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-3 rounded-full border border-church-gold/20 bg-white/85 px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-church-gold">
                <Sparkles size={14} />
                Selamat Datang di GKKD Jakarta
              </span>
              <h2 className="serif mt-8 max-w-4xl text-5xl font-bold leading-[0.9] text-church-dark md:text-7xl">
                Gereja yang Mengundang Anda
                <span className="block text-church-gold">Untuk Datang, Bertumbuh, dan Terlibat Lebih Dalam.</span>
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-church-dark/65 md:text-xl">
                Temukan ibadah, komunitas, pelayanan misi, event, dan langkah berikutnya untuk mengenal GKKD Jakarta dengan lebih nyata.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <AppButton
                  type="button"
                  onClick={() => setActivePage("worship")}
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-church-dark px-8 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-church-cream transition-all hover:bg-church-gold hover:text-church-dark"
                >
                  Temukan Jadwal Ibadah
                  <ArrowRight size={18} />
                </AppButton>
                <AppButton
                  type="button"
                  onClick={() => setActivePage("mission")}
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-church-dark/12 bg-white/90 px-8 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-church-dark transition-colors hover:border-church-gold/40 hover:text-church-gold"
                >
                  Lihat Pelayanan Misi
                </AppButton>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <article className="relative overflow-hidden rounded-[2.5rem] bg-church-dark shadow-[0_24px_80px_rgba(26,26,26,0.16)]">
              <img src="/img/pakuwontower.jpg" alt="Jadwal Ibadah GKKD Jakarta" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(26,26,26,0.1),rgba(26,26,26,0.88))]" />
              <div className="relative z-10 flex min-h-[22rem] flex-col justify-end p-7 text-white">
                <p className="text-xs uppercase tracking-[0.3em] text-church-gold/90">Jadwal Ibadah</p>
                <h3 className="serif mt-4 text-4xl font-bold leading-[0.92] uppercase">Mulai dari Ibadah Minggu</h3>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/80">
                  Temukan lokasi ibadah, jam pelayanan, dan contact person untuk langkah pertama Anda di GKKD Jakarta.
                </p>
                <AppButton
                  type="button"
                  onClick={() => setActivePage("worship")}
                  className="mt-6 inline-flex w-fit items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-church-dark transition-colors hover:bg-church-gold"
                >
                  Buka Jadwal
                </AppButton>
              </div>
            </article>

            <article className="relative overflow-hidden rounded-[2.5rem] bg-[linear-gradient(135deg,rgba(122,93,34,1),rgba(35,31,24,0.98))] shadow-[0_24px_80px_rgba(26,26,26,0.16)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.12),_transparent_26%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.08),_transparent_24%)]" />
              <div className="relative z-10 flex min-h-[22rem] flex-col justify-between p-7 text-white">
                <img src="/img/blesscomn.png" alt="BlessComn" className="h-28 w-48 rounded-[1.5rem] bg-white/95 object-contain p-4 shadow-[0_16px_40px_rgba(0,0,0,0.18)]" />
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/75">Komunitas Sel</p>
                  <h3 className="serif mt-4 text-4xl font-bold leading-[0.92] uppercase">Masuk ke BlessComn</h3>
                  <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/80">
                    Kalau Anda ingin lebih dari sekadar hadir, BlessComn adalah tempat untuk terhubung, bertumbuh, dan saling menguatkan.
                  </p>
                  <AppButton
                    type="button"
                    onClick={() => setActivePage("blesscomn")}
                    className="mt-6 inline-flex w-fit items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-church-dark transition-colors hover:bg-church-gold"
                  >
                    Selengkapnya
                  </AppButton>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 md:py-16">
        <div className="mx-auto max-w-7xl rounded-[2.6rem] border border-church-gold/10 bg-white p-6 shadow-[0_18px_60px_rgba(26,26,26,0.04)] md:p-8">
          <div className="mb-6 max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-[0.28em] text-church-gold">Pilih Langkah Anda</span>
            <h2 className="serif mt-3 text-4xl font-bold text-church-dark md:text-5xl">
              Apa yang Ingin Anda Temukan di GKKD Hari Ini?
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {intentCards.map((card, index) => (
              <AppButton
                key={card.id}
                type="button"
                buttonMotion="card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setActivePage(card.id)}
                className="group rounded-[1.8rem] border border-church-gold/10 bg-church-cream p-5 text-left transition-transform hover:-translate-y-1"
              >
                <p className="text-xs uppercase tracking-[0.22em] text-church-gold">Langkah Cepat</p>
                <h3 className="serif mt-4 text-3xl font-bold leading-tight text-church-dark">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-church-dark/60">{card.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-church-dark transition-colors group-hover:text-church-gold">
                  Jelajahi
                  <ArrowRight size={16} />
                </span>
              </AppButton>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-6 md:py-8">
  <div className="mx-auto max-w-7xl rounded-[2.8rem] border border-church-gold/10 bg-white p-6 shadow-[0_18px_60px_rgba(26,26,26,0.05)] md:p-8">
    <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
      <div className="overflow-hidden rounded-[2.2rem] border border-church-gold/10 bg-church-dark">
        {onlineWorshipEmbedUrl ? (
          <div className="aspect-video w-full">
            <AutoplayYoutubeEmbed
              embedUrl={onlineWorshipEmbedUrl}
              title="Ibadah Online Minggu Ini"
              className="block h-full w-full"
            />
          </div>
        ) : (
          <div className="aspect-video w-full">
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_top,_rgba(197,160,89,0.2),_transparent_34%),linear-gradient(135deg,_rgba(26,26,26,1),_rgba(67,48,20,0.94))] px-8 text-center text-church-cream">
              <PlayCircle size={48} className="text-church-gold" />
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.28em] text-church-gold/90">
                  Ibadah Online
                </p>
                <h3 className="serif text-3xl font-bold uppercase">
                  Video Mingguan Akan Tampil di Sini
                </h3>
                <p className="max-w-md text-sm leading-relaxed text-church-cream/72">
                  Link YouTube akan otomatis muncul setelah admin memperbaruinya dari dashboard CMS.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-[2.4rem] bg-church-cream p-6 md:p-8">
        <span className="inline-flex items-center gap-3 rounded-full border border-church-gold/20 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-church-gold">
          <PlayCircle size={14} />
          Ibadah Online Minggu Ini
        </span>

        <h2 className="serif mt-5 text-4xl font-bold leading-tight text-church-dark md:text-5xl">
          Tetap Terhubung Walau Tidak Bisa Hadir On-site.
        </h2>

        <p className="mt-4 text-lg leading-relaxed text-church-dark/62">
          Untuk Anda yang sedang di perjalanan, berhalangan hadir, atau ingin membagikan ibadah kepada orang lain, video mingguan ini selalu mengikuti link terbaru yang diperbarui admin.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <a
            href={onlineWorshipWatchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 rounded-full bg-church-dark px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-church-cream transition-colors hover:bg-church-gold hover:text-church-dark"
          >
            {onlineWorshipEmbedUrl ? "Tonton di YouTube" : "Buka Kanal YouTube"}
            <ArrowRight size={16} />
          </a>

          <AppButton
            type="button"
            onClick={() => setActivePage("events")}
            className="inline-flex items-center justify-center gap-3 rounded-full border border-church-dark/12 bg-white px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-church-dark transition-colors hover:border-church-gold/40 hover:text-church-gold"
          >
            Lihat Semua Event
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</section>

      <section className="px-4 py-10 md:py-14">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[3rem] bg-[linear-gradient(135deg,rgba(141,104,40,1),rgba(31,27,24,0.98))] shadow-[0_24px_80px_rgba(26,26,26,0.14)]">
          <div className="grid gap-10 px-8 py-10 text-church-cream lg:grid-cols-[0.9fr_1.1fr] lg:px-12 lg:py-12">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.26em] text-church-gold">
                <MapPinned size={14} />
                Satelit GKKD Jakarta
              </span>
              <h2 className="serif mt-6 text-4xl font-bold leading-tight text-white md:text-5xl">
                Dari Jakarta Center sampai Serpong, Anda Hanya Tinggal Memilih Lokasi.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-church-cream/75">
                Setiap satelit di bawah bisa langsung membawa Anda ke kelompok jadwal ibadah yang sesuai.
              </p>
            </div>

            <div className="overflow-x-auto pb-2">
              <div className="flex gap-4">
                {satelliteCards.map((card, index) => (
                  <AppButton
                    key={card.satellite}
                    type="button"
                    buttonMotion="card"
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => goToSatellite(card.satellite)}
                    className="group relative min-h-[18rem] w-[14rem] shrink-0 overflow-hidden rounded-[2rem] border border-white/10"
                  >
                    <img
                      src={SATELLITE_LOCAL_IMAGES[card.satellite]}
                      alt={card.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(26,26,26,0.1),rgba(26,26,26,0.88))]" />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-left text-white">
                      <p className="text-xs uppercase tracking-[0.24em] text-church-gold/85">Satelit</p>
                      <h3 className="serif mt-3 text-3xl font-bold uppercase">{card.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/78">{card.description}</p>
                    </div>
                  </AppButton>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 md:py-14">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2.8rem] border border-church-gold/10 bg-white p-8 shadow-[0_20px_60px_rgba(26,26,26,0.05)] md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-church-gold">Tetap Terhubung</p>
            <h2 className="serif mt-4 text-4xl font-bold text-church-dark md:text-5xl">
              Jelajahi Menu Penting Tanpa Bingung Mulai dari Mana.
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              {quickLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <AppButton
                    key={item.id}
                    type="button"
                    buttonMotion="card"
                    onClick={() => setActivePage(item.id)}
                    className="flex items-start gap-4 rounded-[1.6rem] border border-church-gold/10 bg-church-cream p-5 text-left transition-colors hover:border-church-gold/35"
                  >
                    <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-church-dark">
                      <Icon size={22} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-church-dark">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-church-dark/60">{item.description}</p>
                    </div>
                  </AppButton>
                );
              })}
            </div>
          </div>

          <div className="overflow-hidden rounded-[2.8rem] bg-[linear-gradient(135deg,rgba(26,26,26,1),rgba(122,93,34,0.96))] p-8 text-church-cream shadow-[0_24px_80px_rgba(26,26,26,0.14)] md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-church-gold">Explore GKKD</p>
            <h2 className="serif mt-4 text-4xl font-bold leading-tight text-white md:text-5xl">
              Semua Langkah Awal Ada di Satu Tempat.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-church-cream/72">
              Kalau Anda siap menelusuri lebih jauh, pilih jalur yang paling sesuai: ibadah, komunitas, misi, event, atau kontak langsung dengan tim kami.
            </p>
            <div className="mt-8 grid gap-3">
              {exploreLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <AppButton
                    key={item.page}
                    type="button"
                    buttonMotion="lift"
                    onClick={() => setActivePage(item.page)}
                    className="flex items-center justify-between rounded-[1.6rem] border border-white/10 bg-white/8 px-5 py-4 text-left transition-colors hover:bg-white/12"
                  >
                    <span className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-white">
                      <Icon size={18} className="text-church-gold" />
                      {item.label}
                    </span>
                    <ArrowRight size={16} className="text-white/70" />
                  </AppButton>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
