import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Calendar as CalendarIcon, MapPin, Clock, PlayCircle } from "lucide-react";
import { db } from "../lib/firebase";
import { collection, doc, onSnapshot, query, orderBy } from "firebase/firestore";
import { getYoutubeEmbedUrl, getYoutubeWatchUrl } from "../lib/youtube";
import AutoplayYoutubeEmbed from "../components/AutoplayYoutubeEmbed";
import AppButton from "../components/ui/AppButton";

interface Event {
  id: number | string;
  title: string;
  date: string;
  time: string;
  location: string;
  registrationLink?: string;
}

function formatEventDate(date: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(`${date}T00:00:00`));
  }

  return date;
}

function formatEventTime(time: string) {
  if (/^\d{2}:\d{2}$/.test(time)) {
    return `${time} WIB`;
  }

  return time;
}

function getSafeRegistrationLink(link?: string) {
  if (!link) {
    return null;
  }

  try {
    const url = new URL(link);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [onlineWorshipUrl, setOnlineWorshipUrl] = useState("");

  useEffect(() => {
    const eventsQuery = query(collection(db, "events"), orderBy("date", "desc"));
    const settingsRef = doc(db, "settings", "onlineWorshipVideo");

    const unsubscribeEvents = onSnapshot(eventsQuery, (querySnapshot) => {
      const data = querySnapshot.docs.map((item) => ({ id: item.id, ...item.data() })) as Event[];
      setEvents(data);
    });

    const unsubscribeOnlineWorship = onSnapshot(settingsRef, (snapshot) => {
      const data = snapshot.data() as { youtubeUrl?: string } | undefined;
      setOnlineWorshipUrl(data?.youtubeUrl ?? "");
    });

    return () => {
      unsubscribeEvents();
      unsubscribeOnlineWorship();
    };
  }, []);

  const onlineWorshipEmbedUrl = getYoutubeEmbedUrl(onlineWorshipUrl);
  const onlineWorshipWatchUrl =
    getYoutubeWatchUrl(onlineWorshipUrl) ??
    "https://www.youtube.com/channel/UCyNy-POkQW7wDl-jwL1B8Iw";

  return (
    <div className="pt-32 pb-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="text-church-gold font-medium tracking-widest uppercase mb-4 block">Agenda Gereja</span>
            <h2 className="serif text-5xl md:text-7xl font-bold text-church-dark leading-tight uppercase">
              Jadwal & <br /> <span className="text-church-gold">Kegiatan</span>
            </h2>
          </div>
          <p className="text-church-dark/60 text-lg max-w-sm">
            Jangan lewatkan kesempatan untuk beribadah dan berkumpul bersama dalam hadirat Tuhan.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-32">
          {events.map((event, index) => {
            const registrationLink = getSafeRegistrationLink(event.registrationLink);

            return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 md:p-12 rounded-[2rem] border border-church-gold/10 flex flex-col md:flex-row items-center gap-12 group hover:shadow-xl transition-all"
            >
              <div className="bg-church-gold/5 p-8 rounded-2xl text-center min-w-[160px] group-hover:bg-church-gold group-hover:text-church-cream transition-colors">
                <CalendarIcon size={32} className="mx-auto mb-4" />
                <span className="block font-bold uppercase tracking-widest text-sm">{formatEventDate(event.date)}</span>
              </div>
              
              <div className="flex-grow space-y-4 text-center md:text-left">
                <h3 className="serif text-3xl font-bold text-church-dark uppercase tracking-tight">{event.title}</h3>
                <div className="flex flex-wrap justify-center md:justify-start gap-6 text-church-dark/60">
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-church-gold" />
                    <span>{formatEventTime(event.time)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-church-gold" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <p className="text-sm text-church-dark/50">
                  {registrationLink ? "Klik detail event untuk membuka link pendaftaran." : "Link pendaftaran akan ditambahkan segera."}
                </p>
              </div>

              {registrationLink ? (
                <a
                  href={registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-church-dark text-church-cream px-8 py-4 rounded-full font-medium tracking-widest uppercase hover:bg-church-gold transition-colors whitespace-nowrap"
                >
                  Detail Event
                </a>
              ) : (
                <AppButton
                  type="button"
                  disabled
                  className="bg-church-dark/30 text-church-cream px-8 py-4 rounded-full font-medium tracking-widest uppercase whitespace-nowrap cursor-not-allowed"
                >
                  Detail Event
                </AppButton>
              )}
            </motion.div>
            );
          })}
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="relative overflow-hidden rounded-[3rem] border border-church-gold/10 bg-church-dark aspect-video lg:aspect-auto min-h-[24rem]">
            {onlineWorshipEmbedUrl ? (
              <AutoplayYoutubeEmbed
                embedUrl={onlineWorshipEmbedUrl}
                title="Ibadah Online GKKD Jakarta"
              />
            ) : (
              <div className="flex h-full min-h-[24rem] flex-col items-center justify-center gap-5 bg-[radial-gradient(circle_at_top,_rgba(197,160,89,0.2),_transparent_34%),linear-gradient(135deg,_rgba(26,26,26,1),_rgba(67,48,20,0.94))] px-8 text-center text-church-cream">
                <PlayCircle size={56} className="text-church-gold" />
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.28em] text-church-gold/90">Ibadah Online</p>
                  <h4 className="serif text-3xl font-bold uppercase">Video Mingguan Belum Diatur</h4>
                  <p className="max-w-md text-sm leading-relaxed text-church-cream/70">
                    Admin bisa memperbarui link YouTube ibadah mingguan dari CMS agar video tampil otomatis di sini.
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="bg-church-cream p-12 md:p-20 rounded-[3rem] border border-church-gold/10">
            <h3 className="serif text-3xl font-bold text-church-dark uppercase mb-8">Ibadah Online</h3>
            <p className="text-church-dark/70 text-lg leading-relaxed mb-12">
              Bagi Anda yang berhalangan hadir secara on-site, kami menyediakan layanan ibadah online melalui kanal YouTube resmi GKKD Jakarta. Link video mingguan ini dikelola dari dashboard admin sehingga akan ikut berubah otomatis saat admin memperbaruinya.
            </p>
            <a
              href={onlineWorshipWatchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border-b-2 border-church-gold text-church-dark font-bold tracking-widest uppercase pb-2 hover:text-church-gold transition-colors"
            >
              {onlineWorshipEmbedUrl ? "Tonton di YouTube" : "Kunjungi YouTube Kami"}
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
