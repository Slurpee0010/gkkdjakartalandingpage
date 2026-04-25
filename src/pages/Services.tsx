import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, BookOpen, HeartHandshake, ShieldCheck, Globe } from "lucide-react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import AppButton from "../components/ui/AppButton";
import type { NavigateToPage } from "../lib/navigation";

interface Service {
  id: number | string;
  title: string;
  description: string;
}

export default function Services({ setActivePage }: { setActivePage: NavigateToPage }) {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      const querySnapshot = await getDocs(collection(db, "services"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Service[];
      setServices(data);
    };
    fetchServices();
  }, []);

  const icons = [BookOpen, ShieldCheck, Globe];

  return (
    <div className="pt-32 pb-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <span className="text-church-gold font-medium tracking-widest uppercase mb-4 block">Pelayanan</span>
          <h2 className="serif text-5xl md:text-7xl font-bold text-church-dark leading-tight mb-8 uppercase">
            Melayani <br /> Dengan <span className="text-church-gold">Kasih</span>
          </h2>
          <p className="max-w-2xl mx-auto text-church-dark/60 text-lg leading-relaxed">
            Kami menyediakan berbagai layanan untuk mendukung pertumbuhan rohani Anda dan keluarga, serta memberikan dampak bagi masyarakat sekitar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {services.map((service, index) => {
            const Icon = icons[index % icons.length];
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-12 rounded-3xl border border-church-gold/10 hover:border-church-gold/30 transition-all group"
              >
                <div className="w-16 h-16 bg-church-gold/10 rounded-full flex items-center justify-center text-church-gold mb-8 group-hover:bg-church-gold group-hover:text-church-cream transition-colors">
                  <Icon size={32} />
                </div>
                <h3 className="serif text-2xl font-bold text-church-dark uppercase tracking-tight mb-4">{service.title}</h3>
                <p className="text-church-dark/60 leading-relaxed">{service.description}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="mb-10 overflow-hidden rounded-[3rem] border border-church-gold/10 bg-[linear-gradient(135deg,rgba(255,255,255,1),rgba(248,244,235,0.96))] p-12 md:p-24 shadow-[0_20px_60px_rgba(26,26,26,0.06)]">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-church-gold/15 bg-church-gold/5 px-4 py-2 text-xs uppercase tracking-[0.28em] text-church-gold">
                <BookOpen size={14} />
                Pendalaman Alkitab
              </span>
              <h2 className="serif mb-8 text-4xl font-bold uppercase leading-tight text-church-dark md:text-6xl">
                Kelompok Kecil untuk <br /> <span className="text-church-gold">Belajar Firman</span> Bersama
              </h2>
              <p className="mb-10 text-lg leading-relaxed text-church-dark/65">
                Pendalaman Alkitab menolong jemaat bertumbuh lewat kelompok pemuridan kecil yang hangat, terarah,
                dan memakai buku-buku yang sudah tersedia agar pembelajaran firman Tuhan bisa dijalani bersama secara konsisten.
              </p>
              <AppButton
                type="button"
                onClick={() => setActivePage("bible-study")}
                className="mb-10 inline-flex items-center gap-3 rounded-full bg-church-dark px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-church-cream transition-transform hover:-translate-y-0.5"
              >
                Selengkapnya
                <ArrowRight size={16} />
              </AppButton>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  "Belajar Alkitab dalam suasana akrab, terbuka, dan mudah diikuti.",
                  "Materi bertahap yang menolong dari dasar iman sampai pertumbuhan lanjutan.",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[1.6rem] border border-church-gold/10 bg-white px-5 py-4 text-sm leading-relaxed text-church-dark/70"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {[
                { src: "/img/4mt.jpg", alt: "Buku 4MT" },
                { src: "/img/som.jpg", alt: "Buku SOM" },
                { src: "/img/sod1.jpg", alt: "Buku SOD 1" },
                { src: "/img/sod2.jpg", alt: "Buku SOD 2" },
              ].map((book, index) => (
                <motion.div
                  key={book.alt}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="overflow-hidden rounded-[2rem] border border-church-gold/10 bg-white p-3 shadow-[0_18px_60px_rgba(26,26,26,0.08)]"
                >
                  <div className="aspect-[4/5] overflow-hidden rounded-[1.4rem] bg-church-cream">
                    <img
                      src={book.src}
                      alt={book.alt}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-church-dark rounded-[3rem] p-12 md:p-24 text-church-cream relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(197,160,89,0.18),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.08),_transparent_30%)]" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-church-gold/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.28em] text-church-gold mb-6">
                <HeartHandshake size={14} />
                Komunitas Sel
              </span>
              <h2 className="serif text-4xl md:text-6xl font-bold uppercase leading-tight mb-8">
                Bergabung Dalam <br /> <span className="text-church-gold">Blesscomn</span>
              </h2>
              <p className="text-church-cream/70 text-lg leading-relaxed mb-12">
                Blesscomn adalah komunitas sel kami di mana Anda dapat bertumbuh dalam iman, membangun persahabatan yang bermakna, dan saling mendoakan.
              </p>
              <AppButton
                type="button"
                onClick={() => setActivePage("blesscomn")}
                className="mb-10 inline-flex items-center gap-3 rounded-full bg-church-gold px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-church-dark transition-transform hover:-translate-y-0.5"
              >
                Selengkapnya
                <ArrowRight size={16} />
              </AppButton>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <h4 className="serif text-xl font-bold text-church-gold uppercase">Visi</h4>
                  <p className="text-sm text-church-cream/60">Menjadi komunitas berkat, kasih, dan pertumbuhan yang terbuka untuk jiwa baru.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="serif text-xl font-bold text-church-gold uppercase">Misi</h4>
                  <p className="text-sm text-church-cream/60">Melatih untuk bertumbuh dan melahirkan pemimpin-pemimpin baru.</p>
                </div>
              </div>
            </div>
            <div className="grid gap-5">
              <div className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
                <img
                  src="/img/blesscomn.png"
                  alt="Logo BlessComn"
                  className="mx-auto h-48 w-full object-contain"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Kelompok kecil yang hangat dan terbuka untuk anggota baru.",
                  "Ruang aman untuk saling mendoakan, belajar firman, dan bertumbuh.",
                ].map((item) => (
                  <div key={item} className="rounded-[1.6rem] border border-white/10 bg-white/6 p-5 text-sm leading-relaxed text-church-cream/75">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
