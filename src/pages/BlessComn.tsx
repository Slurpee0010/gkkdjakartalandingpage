import { motion } from "motion/react";
import { ArrowRight, HeartHandshake, Sparkles, Users, CheckCircle2 } from "lucide-react";
import AppButton from "../components/ui/AppButton";
import type { NavigateToPage } from "../lib/navigation";

const blessingPoints = [
  "Komunitas yang menolong Anda mengenal Tuhan lebih dalam lewat firman dan doa bersama.",
  "Persahabatan rohani yang sehat untuk saling menguatkan dalam musim kehidupan apa pun.",
  "Ruang pertumbuhan untuk belajar melayani, memimpin, dan menjadi berkat bagi orang lain.",
];

const communityMoments = [
  {
    title: "Bertumbuh Bersama",
    description: "Setiap pertemuan dirancang untuk membantu anggota bertumbuh secara praktis, bukan hanya hadir lalu pulang.",
  },
  {
    title: "Saling Mendoakan",
    description: "BlessComn memberi ruang untuk berbagi pokok doa dan saling menopang dengan kasih Kristus.",
  },
  {
    title: "Menjadi Berkat",
    description: "Komunitas ini mendorong setiap anggota untuk hadir, melayani, dan membawa dampak yang nyata.",
  },
];

const journeySteps = [
  "Datang dan kenal komunitasnya dalam suasana yang hangat, sederhana, dan terbuka.",
  "Mulai terlibat dalam diskusi firman, doa, dan relasi yang sehat bersama sesama anggota.",
  "Bertumbuh menjadi pribadi yang siap melayani dan memberkati lingkungan sekitar.",
];

export default function BlessComn({ setActivePage }: { setActivePage: NavigateToPage }) {
  return (
    <div className="pt-28 pb-24 px-4">
      <div className="max-w-7xl mx-auto space-y-10">
        <section className="relative overflow-hidden rounded-[3rem] border border-church-gold/15 bg-[radial-gradient(circle_at_top_left,_rgba(197,160,89,0.26),_transparent_36%),linear-gradient(135deg,_rgba(44,27,58,0.98),_rgba(102,62,118,0.96))] px-6 py-14 md:px-12 md:py-16 text-white">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.07)_48%,transparent_100%)]" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.2fr_0.9fr] gap-10 items-center">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-church-gold mb-6">
                <HeartHandshake size={14} />
                Komunitas Sel GKKD Jakarta
              </span>
              <h1 className="serif text-5xl md:text-7xl font-bold leading-[0.92] uppercase mb-6">
                BlessComn
              </h1>
              <p className="text-lg md:text-xl leading-relaxed text-white/80 max-w-2xl mb-8">
                BlessComn adalah komunitas sel yang menolong setiap orang untuk bertumbuh dalam iman, membangun relasi yang sehat, dan mengalami perjalanan rohani yang nyata bersama keluarga Allah.
              </p>
              <div className="flex flex-wrap gap-4">
                <AppButton
                  type="button"
                  onClick={() => setActivePage("contact")}
                  className="inline-flex items-center gap-3 rounded-full bg-church-gold px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-church-dark transition-transform hover:-translate-y-0.5"
                >
                  Gabung BlessComn
                  <ArrowRight size={16} />
                </AppButton>
                <AppButton
                  type="button"
                  onClick={() => setActivePage("services")}
                  className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/85 transition-colors hover:bg-white/10"
                >
                  Kembali ke Layanan
                </AppButton>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-[2.4rem] bg-white p-6 shadow-[0_22px_70px_rgba(0,0,0,0.18)]"
            >
              <img
                src="/img/blesscomn.png"
                alt="Logo BlessComn"
                className="w-full object-contain"
              />
            </motion.div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8">
          <div className="rounded-[2.5rem] bg-white border border-church-gold/10 p-8 md:p-10 shadow-[0_20px_60px_rgba(26,26,26,0.06)]">
            <div className="flex items-center gap-3 text-church-gold mb-6">
              <Sparkles size={18} />
              <span className="text-sm font-semibold uppercase tracking-[0.26em]">Tentang BlessComn</span>
            </div>
            <h2 className="serif text-4xl md:text-5xl font-bold text-church-dark leading-tight mb-6">
              Tempat Bertumbuh, Dipulihkan, dan Menjadi Berkat
            </h2>
            <p className="text-church-dark/65 text-lg leading-relaxed mb-8">
              Di BlessComn, komunitas bukan sekadar tempat berkumpul. Ini adalah ruang untuk belajar firman Tuhan, saling mendoakan, berbagi perjalanan hidup, dan dibentuk menjadi murid Kristus yang dewasa serta siap melayani.
            </p>
            <div className="space-y-4">
              {blessingPoints.map((point) => (
                <div key={point} className="flex items-start gap-4 rounded-[1.6rem] bg-church-cream/70 px-5 py-4">
                  <CheckCircle2 size={20} className="mt-1 shrink-0 text-church-gold" />
                  <p className="text-church-dark/70 leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-church-dark text-church-cream p-8 md:p-10 shadow-[0_20px_60px_rgba(26,26,26,0.1)]">
            <div className="flex items-center gap-3 text-church-gold mb-6">
              <Users size={18} />
              <span className="text-sm font-semibold uppercase tracking-[0.26em]">Nilai Utama</span>
            </div>
            <div className="space-y-4">
              {communityMoments.map((item) => (
                <div key={item.title} className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
                  <h3 className="serif text-2xl font-bold uppercase text-white mb-3">{item.title}</h3>
                  <p className="text-white/70 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[2.5rem] border border-church-gold/10 bg-[linear-gradient(135deg,rgba(255,255,255,1),rgba(248,244,235,0.96))] p-8 md:p-10 shadow-[0_20px_60px_rgba(26,26,26,0.06)]">
          <div className="max-w-3xl mb-8">
            <span className="text-sm font-semibold uppercase tracking-[0.26em] text-church-gold">Perjalanan Bersama</span>
            <h2 className="serif text-4xl md:text-5xl font-bold text-church-dark mt-4 mb-4">
              Apa yang Akan Anda Temukan di BlessComn
            </h2>
            <p className="text-church-dark/60 text-lg leading-relaxed">
              Komunitas ini dirancang untuk membantu Anda bergerak dari sekadar hadir menjadi benar-benar bertumbuh dan terhubung.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {journeySteps.map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-[2rem] border border-church-gold/10 bg-white p-6"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-church-gold/10 text-lg font-bold text-church-gold">
                  {index + 1}
                </div>
                <p className="text-church-dark/70 leading-relaxed">{step}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
