import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { collection, getDocs } from "firebase/firestore";
import { CalendarDays, Church, Clock3, MapPin, Phone, Radio } from "lucide-react";
import { db } from "../lib/firebase";
import {
  DEFAULT_WORSHIP_SCHEDULES,
  SATELLITE_LOCAL_IMAGES,
  SATELLITE_OPTIONS,
  formatWorshipTime,
  getCategoryLabel,
  getWorshipSatelliteSectionId,
  isSatelliteOption,
  sortWorshipSchedules,
  WORSHIP_TARGET_EVENT_NAME,
  WORSHIP_TARGET_STORAGE_KEY,
  type SatelliteOption,
  type WorshipScheduleItem,
} from "../lib/worshipSchedules";

const ALL_FILTER = "Semua Lokasi";

function getPhoneHref(value: string) {
  const phone = value.match(/(\+?\d[\d\s-]{7,}\d)/)?.[1];

  return phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : null;
}

function getSiteSubtitle(items: WorshipScheduleItem[]) {
  const hasOnsite = items.some((item) => item.category === "onsite" || item.category === "onsite dan online");
  const hasOnline = items.some((item) => item.category === "online" || item.category === "onsite dan online");

  if (hasOnsite && hasOnline) {
    return "Ibadah mingguan on-site dan online";
  }

  if (hasOnline) {
    return "Ibadah mingguan online";
  }

  return "Ibadah mingguan on-site";
}

function getSatelliteLabel(satellite: SatelliteOption) {
  switch (satellite) {
    case "Jakarta Center":
      return "Jakarta Center";
    case "Jakarta Utara":
      return "Victory House";
    case "Southers":
      return "Southers";
    case "Ciledug":
      return "Ciledug";
    case "Serpong":
      return "Worship Service";
    default:
      return satellite;
  }
}

export default function WorshipSchedules() {
  const [schedules, setSchedules] = useState<WorshipScheduleItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<typeof ALL_FILTER | SatelliteOption>(ALL_FILTER);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [pendingSatellite, setPendingSatellite] = useState<SatelliteOption | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadSchedules = async () => {
      try {
        const snapshot = await getDocs(collection(db, "worshipSchedules"));

        if (!isMounted) {
          return;
        }

        if (snapshot.empty) {
          setSchedules(sortWorshipSchedules(DEFAULT_WORSHIP_SCHEDULES));
          setUsingFallback(true);
        } else {
          const data = snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          })) as WorshipScheduleItem[];

          setSchedules(sortWorshipSchedules(data));
          setUsingFallback(false);
        }
      } catch {
        if (!isMounted) {
          return;
        }

        setSchedules(sortWorshipSchedules(DEFAULT_WORSHIP_SCHEDULES));
        setUsingFallback(true);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadSchedules();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const syncPendingSatellite = (value: string | null) => {
      if (value && isSatelliteOption(value)) {
        setPendingSatellite(value);
      }
    };

    syncPendingSatellite(window.sessionStorage.getItem(WORSHIP_TARGET_STORAGE_KEY));

    const handleTargetEvent = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      syncPendingSatellite(customEvent.detail ?? null);
    };

    window.addEventListener(WORSHIP_TARGET_EVENT_NAME, handleTargetEvent);

    return () => {
      window.removeEventListener(WORSHIP_TARGET_EVENT_NAME, handleTargetEvent);
    };
  }, []);

  const visibleSchedules =
    activeFilter === ALL_FILTER ? schedules : schedules.filter((item) => item.satellite === activeFilter);

  const groupedSchedules = SATELLITE_OPTIONS.map((satellite) => ({
    satellite,
    items: visibleSchedules.filter((item) => item.satellite === satellite),
  })).filter((group) => group.items.length > 0);

  useEffect(() => {
    if (!pendingSatellite || loading) {
      return;
    }

    if (activeFilter !== pendingSatellite) {
      setActiveFilter(pendingSatellite);
      return;
    }

    const targetId = getWorshipSatelliteSectionId(pendingSatellite);

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    window.sessionStorage.removeItem(WORSHIP_TARGET_STORAGE_KEY);
    setPendingSatellite(null);

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [activeFilter, loading, pendingSatellite]);

  return (
    <div className="pt-24 pb-24 px-4">
      <div className="max-w-7xl mx-auto">
        <section className="relative overflow-hidden rounded-[3rem] border border-church-gold/15 bg-[radial-gradient(circle_at_top_left,_rgba(197,160,89,0.24),_transparent_38%),linear-gradient(135deg,_rgba(26,26,26,0.96),_rgba(50,38,20,0.94))] px-6 py-14 md:px-12 md:py-18 text-church-cream mb-12">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.04)_45%,transparent_100%)]" />
          <div className="relative z-10 max-w-4xl">
            <span className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-church-gold/90 mb-6">
              <CalendarDays size={16} />
              Jadwal Ibadah
            </span>
            <h1 className="serif text-5xl md:text-7xl font-bold leading-[0.9] mb-6">
              Jadwal Ibadah <br /> GKKD Jakarta
            </h1>
            <p className="text-lg md:text-xl text-church-cream/80 max-w-2xl leading-relaxed">
              Temukan ibadah mingguan GKKD Jakarta di berbagai satelit, lengkap dengan jam pelayanan, lokasi, dan contact person yang bisa langsung dihubungi.
            </p>
            {usingFallback && (
              <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-church-gold/20 bg-white/8 px-4 py-2 text-sm text-church-cream/80">
                <Radio size={16} className="text-church-gold" />
                Menampilkan jadwal awal. Setelah CMS aktif dan data Firebase terisi, halaman ini akan mengikuti data terbaru.
              </div>
            )}
          </div>
        </section>

        <section className="mb-12">
          <div className="flex flex-wrap gap-3">
            {[ALL_FILTER, ...SATELLITE_OPTIONS].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-5 py-3 text-sm uppercase tracking-widest transition-all ${
                  activeFilter === filter
                    ? "bg-church-dark text-church-cream shadow-lg"
                    : "bg-white text-church-dark/70 border border-church-gold/10 hover:border-church-gold/40 hover:text-church-dark"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        {loading ? (
          <div className="rounded-[2rem] border border-church-gold/10 bg-white p-10 text-center text-church-dark/60">
            Memuat jadwal ibadah...
          </div>
        ) : groupedSchedules.length === 0 ? (
          <div className="rounded-[2rem] border border-church-gold/10 bg-white p-10 text-center">
            <Church size={28} className="mx-auto mb-4 text-church-gold" />
            <h3 className="serif text-3xl font-bold uppercase mb-3">Belum Ada Jadwal</h3>
            <p className="text-church-dark/60 max-w-xl mx-auto">
              Filter yang Anda pilih belum memiliki data jadwal ibadah. Tambahkan dulu dari CMS admin agar bisa tampil di sini.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedSchedules.map((group, index) => {
              const heroImage = SATELLITE_LOCAL_IMAGES[group.satellite];
              const uniquePlaces = Array.from(new Set(group.items.map((item) => item.place))).filter(Boolean);

              return (
                <motion.article
                  key={group.satellite}
                  id={getWorshipSatelliteSectionId(group.satellite)}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="overflow-hidden rounded-[2.5rem] border border-church-gold/10 bg-white shadow-[0_24px_80px_rgba(26,26,26,0.08)]"
                >
                  <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1.5fr]">
                    <div className="relative min-h-[280px]">
                      {heroImage ? (
                        <img
                          src={heroImage}
                          alt={group.satellite}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(197,160,89,0.32),_transparent_38%),linear-gradient(135deg,_rgba(26,26,26,1),_rgba(60,45,22,0.94))] p-8 flex flex-col justify-between text-church-cream">
                          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                            <Church size={28} className="text-church-gold" />
                          </div>
                          <div>
                            <p className="text-sm uppercase tracking-[0.28em] text-church-gold/90 mb-3">Gereja Satelit</p>
                            <h2 className="serif text-4xl font-bold leading-tight">{getSatelliteLabel(group.satellite)}</h2>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-8 md:p-10">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
                        <div className="space-y-4">
                          <div className="inline-flex items-center gap-2 rounded-full bg-church-gold/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-church-gold">
                            <Radio size={14} />
                            {getSiteSubtitle(group.items)}
                          </div>
                          <div>
                            <h2 className="serif text-4xl md:text-5xl font-bold uppercase tracking-tight text-church-dark">
                              {getSatelliteLabel(group.satellite)}
                            </h2>
                            <p className="mt-3 text-church-dark/60 max-w-2xl leading-relaxed">
                              {uniquePlaces.join(" | ")}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 min-w-[220px]">
                          <div className="rounded-2xl bg-church-cream p-4 border border-church-gold/10">
                            <p className="text-xs uppercase tracking-[0.22em] text-church-dark/40 mb-2">Jumlah Ibadah</p>
                            <p className="serif text-3xl font-bold text-church-dark">{group.items.length}</p>
                          </div>
                          <div className="rounded-2xl bg-church-cream p-4 border border-church-gold/10">
                            <p className="text-xs uppercase tracking-[0.22em] text-church-dark/40 mb-2">Format</p>
                            <p className="text-sm font-semibold text-church-dark">
                              {Array.from(new Set(group.items.map((item) => getCategoryLabel(item.category)))).join(", ")}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {group.items.map((item) => {
                          const contactHref = getPhoneHref(item.contactPerson);

                          return (
                            <div
                              key={item.id}
                              className="rounded-[1.8rem] border border-church-gold/10 bg-church-cream/50 px-5 py-5 md:px-6 md:py-6"
                            >
                              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div className="space-y-3">
                                  <div className="flex flex-wrap items-center gap-3">
                                    <h3 className="serif text-2xl md:text-3xl font-bold text-church-dark">{item.serviceName}</h3>
                                    <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-church-dark/60 border border-church-gold/10">
                                      {getCategoryLabel(item.category)}
                                    </span>
                                  </div>

                                  <div className="flex flex-wrap gap-4 text-sm text-church-dark/65">
                                    <span className="inline-flex items-center gap-2">
                                      <Clock3 size={16} className="text-church-gold" />
                                      {formatWorshipTime(item.serviceTime)}
                                    </span>
                                    <span className="inline-flex items-center gap-2">
                                      <MapPin size={16} className="text-church-gold" />
                                      {item.place}
                                    </span>
                                  </div>
                                </div>

                                <div className="lg:text-right">
                                  <p className="text-xs uppercase tracking-[0.22em] text-church-dark/40 mb-2">Contact Person</p>
                                  {contactHref ? (
                                    <a
                                      href={contactHref}
                                      className="inline-flex items-center gap-2 rounded-full bg-church-dark px-4 py-3 text-sm font-semibold text-church-cream hover:bg-church-gold transition-colors"
                                    >
                                      <Phone size={16} />
                                      {item.contactPerson}
                                    </a>
                                  ) : (
                                    <p className="text-sm font-semibold text-church-dark">{item.contactPerson}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
