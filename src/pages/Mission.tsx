import { motion } from "motion/react";
import { ArrowRight, Compass, Globe2, HeartHandshake, MapPinned } from "lucide-react";

const missionRegions = [
  {
    name: "Papua",
    focus: "Penguatan Jemaat & Pemuridan",
    summary:
      "Pelayanan misi di Papua diarahkan untuk memperkuat jemaat lokal, membangun pemuridan yang konsisten, dan menghadirkan dukungan rohani bagi komunitas yang dilayani.",
    highlight: "Fokus pada penguatan iman, keluarga, dan pertumbuhan jemaat lokal.",
  },
  {
    name: "Lampung",
    focus: "Pendampingan Komunitas",
    summary:
      "Di Lampung, pelayanan misi dijalankan dengan pendekatan yang hangat dan relasional, membuka ruang bagi pemulihan, pembinaan rohani, dan keterhubungan komunitas.",
    highlight: "Menekankan relasi yang sehat, doa bersama, dan pertumbuhan komunitas.",
  },
  {
    name: "Sumba",
    focus: "Pelayanan Lintas Generasi",
    summary:
      "Pelayanan di Sumba menolong jemaat dari berbagai usia untuk mengalami kasih Tuhan melalui pengajaran firman, penguatan iman, dan pendampingan yang berkelanjutan.",
    highlight: "Mendorong dampak rohani yang menjangkau anak, keluarga, dan generasi muda.",
  },
  {
    name: "Kamboja",
    focus: "Bangsa-Bangsa",
    summary:
      "Kamboja menjadi salah satu wujud panggilan misi lintas bangsa, menghadirkan semangat penginjilan, pemuridan, dan dukungan bagi pelayanan yang menjangkau komunitas baru.",
    highlight: "Menjadi bagian dari visi untuk menjangkau bangsa-bangsa dengan kasih Kristus.",
  },
  {
    name: "Bali",
    focus: "Kehadiran & Kesaksian",
    summary:
      "Di Bali, pelayanan misi berfokus pada kesaksian hidup, penguatan relasi, dan pembinaan rohani yang relevan dengan konteks masyarakat yang beragam.",
    highlight: "Membawa kehadiran gereja yang penuh kasih di tengah lingkungan yang dinamis.",
  },
  {
    name: "Kupang",
    focus: "Pembangunan Iman Komunitas",
    summary:
      "Pelayanan di Kupang diarahkan untuk menolong komunitas bertumbuh dalam firman Tuhan, membangun kekuatan rohani, dan memperluas dampak pelayanan secara berkelanjutan.",
    highlight: "Menguatkan komunitas agar terus bertumbuh dan menjadi berkat bagi sekitarnya.",
  },
];

const missionValues = [
  "Misi kami berpusat pada kasih Tuhan bagi jiwa-jiwa.",
  "Setiap daerah dilayani dengan pendekatan yang menghargai komunitas setempat.",
  "Pemuridan, doa, dan penguatan jemaat menjadi fondasi pelayanan misi kami.",
];

export default function Mission({ setActivePage }: { setActivePage: (page: string) => void }) {
  return (
    <div className="pt-28 pb-24 px-4">
      <div className="max-w-7xl mx-auto space-y-10">
        <section className="relative overflow-hidden rounded-[3rem] border border-church-gold/15 bg-[radial-gradient(circle_at_top_left,_rgba(197,160,89,0.22),_transparent_34%),linear-gradient(135deg,_rgba(26,26,26,0.98),_rgba(54,39,18,0.95))] px-6 py-14 text-church-cream md:px-12 md:py-16">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.05)_45%,transparent_100%)]" />
          <div className="relative z-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="max-w-3xl">
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-church-gold/20 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.28em] text-church-gold">
                <Compass size={14} />
                Pelayanan Misi
              </span>
              <h1 className="serif mb-6 text-5xl font-bold uppercase leading-[0.92] md:text-7xl">
                Menjangkau Daerah dan Bangsa
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-church-cream/80 md:text-xl">
                Misi yang kami lakukan sudah menjangkau banyak daerah di Indonesia dan bangsa-bangsa lain seperti Papua, Lampung, Sumba, Kamboja, Bali dan Kupang.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => setActivePage("contact")}
                  className="inline-flex items-center gap-3 rounded-full bg-church-gold px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-church-dark transition-transform hover:-translate-y-0.5"
                >
                  Hubungi Tim Misi
                  <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setActivePage("about")}
                  className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-church-cream/85 transition-colors hover:bg-white/10"
                >
                  Kembali ke Tentang
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-[2rem] border border-white/10 bg-white/8 p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-church-gold/85">Daerah Misi</p>
                <p className="serif mt-3 text-4xl font-bold text-white">{missionRegions.length}</p>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-white/8 p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-church-gold/85">Arah Pelayanan</p>
                <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/80">Indonesia & Bangsa-Bangsa</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2.5rem] border border-church-gold/10 bg-white p-8 shadow-[0_20px_60px_rgba(26,26,26,0.06)] md:p-10">
            <div className="mb-6 flex items-center gap-3 text-church-gold">
              <HeartHandshake size={18} />
              <span className="text-sm font-semibold uppercase tracking-[0.26em]">Fokus Pelayanan</span>
            </div>
            <h2 className="serif mb-6 text-4xl font-bold text-church-dark md:text-5xl">
              Hati Kami untuk Jiwa-Jiwa dan Komunitas
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-church-dark/65">
              Setiap perjalanan misi dilakukan dengan semangat penginjilan, pemuridan, dan penguatan jemaat. Kami percaya bahwa kasih Kristus perlu hadir secara nyata melalui relasi, doa, dan pelayanan yang membangun.
            </p>
            <div className="space-y-4">
              {missionValues.map((value) => (
                <div key={value} className="rounded-[1.6rem] bg-church-cream/70 px-5 py-4 text-church-dark/70">
                  {value}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-church-gold/10 bg-[linear-gradient(135deg,rgba(255,255,255,1),rgba(248,244,235,0.98))] p-8 shadow-[0_20px_60px_rgba(26,26,26,0.06)] md:p-10">
            <div className="mb-6 flex items-center gap-3 text-church-gold">
              <Globe2 size={18} />
              <span className="text-sm font-semibold uppercase tracking-[0.26em]">Jejak Misi</span>
            </div>
            <h2 className="serif mb-4 text-4xl font-bold text-church-dark md:text-5xl">
              Wilayah yang Sudah Dijangkau
            </h2>
            <p className="text-lg leading-relaxed text-church-dark/60">
              Berikut beberapa daerah misi yang telah menjadi bagian dari perjalanan pelayanan kami.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {missionRegions.map((region, index) => (
            <motion.article
              key={region.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="rounded-[2.2rem] border border-church-gold/10 bg-white p-6 shadow-[0_16px_50px_rgba(26,26,26,0.05)]"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-church-gold/90">Daerah Misi</p>
                  <h3 className="serif mt-3 text-3xl font-bold uppercase text-church-dark">{region.name}</h3>
                </div>
                <div className="rounded-2xl bg-church-gold/10 p-3 text-church-gold">
                  <MapPinned size={20} />
                </div>
              </div>

              <div className="mb-4 inline-flex rounded-full border border-church-gold/10 bg-church-cream px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-church-dark/70">
                {region.focus}
              </div>
              <p className="mb-5 leading-relaxed text-church-dark/65">
                {region.summary}
              </p>
              <div className="rounded-[1.5rem] bg-church-dark px-4 py-4 text-sm leading-relaxed text-church-cream/80">
                {region.highlight}
              </div>
            </motion.article>
          ))}
        </section>
      </div>
    </div>
  );
}
