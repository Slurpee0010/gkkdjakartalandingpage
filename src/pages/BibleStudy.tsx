import { motion } from "motion/react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Users,
} from "lucide-react";

interface BibleStudyProps {
  setActivePage: (page: string) => void;
}

interface StudyBook {
  title: string;
  stage: string;
  description: string;
  imageSrc: string;
  purchaseUrl: string;
}

const discipleshipHighlights = [
  "Kelompok kecil yang hangat untuk belajar Alkitab, bertanya, dan bertumbuh bersama.",
  "Materi disusun bertahap supaya peserta baru maupun yang sudah bertumbuh tetap bisa mengikuti.",
  "Setiap pertemuan menolong peserta menghubungkan firman Tuhan dengan kehidupan sehari-hari.",
];

const studyBooks: StudyBook[] = [
  {
    title: "4MT",
    stage: "Dasar Pemuridan",
    description:
      "Materi awal untuk membangun fondasi iman, mengenal Kristus lebih dalam, dan mulai bertumbuh dengan arah yang jelas.",
    imageSrc: "/img/4mt.jpg",
    purchaseUrl: "https://shopee.co.id/search?keyword=4MT%20buku",
  },
  {
    title: "SOM",
    stage: "Pendalaman Karakter",
    description:
      "Bahan belajar yang menolong kelompok kecil menggali kebenaran firman Tuhan dengan diskusi yang praktis dan membangun.",
    imageSrc: "/img/som.jpg",
    purchaseUrl: "https://shopee.co.id/search?keyword=SOM%20buku",
  },
  {
    title: "SOD 1",
    stage: "Tahap Lanjutan",
    description:
      "Dipakai untuk membawa peserta melangkah lebih jauh dalam pemuridan, ketaatan, dan penerapan firman secara konsisten.",
    imageSrc: "/img/sod1.jpg",
    purchaseUrl: "https://shopee.co.id/search?keyword=SOD%201%20buku",
  },
  {
    title: "SOD 2",
    stage: "Pendewasaan Rohani",
    description:
      "Materi lanjutan yang membantu peserta bertumbuh dewasa, siap memuridkan, dan hidup sebagai murid Kristus yang aktif.",
    imageSrc: "/img/sod2.jpg",
    purchaseUrl: "https://shopee.co.id/search?keyword=SOD%202%20buku",
  },
];

const studyFlow = [
  {
    title: "Datang ke Kelompok Kecil",
    description: "Mulai dengan komunitas yang sederhana, terbuka, dan siap menyambut siapa pun yang mau belajar firman.",
  },
  {
    title: "Belajar dari Buku Panduan",
    description: "Setiap buku dipakai sebagai alat bantu supaya pembelajaran Alkitab berjalan terarah, runtut, dan mudah diikuti.",
  },
  {
    title: "Hidupkan Firman",
    description: "Tujuannya bukan hanya selesai membaca materi, tetapi mengalami perubahan hidup lewat penerapan firman Tuhan.",
  },
];

export default function BibleStudy({ setActivePage }: BibleStudyProps) {
  return (
    <div className="pt-28 pb-24 px-4">
      <div className="max-w-7xl mx-auto space-y-10">
        <section className="relative overflow-hidden rounded-[3rem] border border-church-gold/15 bg-[radial-gradient(circle_at_top_left,_rgba(197,160,89,0.22),_transparent_34%),linear-gradient(135deg,_rgba(26,26,26,0.98),_rgba(70,47,16,0.95))] px-6 py-14 text-church-cream md:px-12 md:py-16">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.05)_45%,transparent_100%)]" />
          <div className="relative z-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="max-w-3xl">
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-church-gold/20 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.28em] text-church-gold">
                <BookOpen size={14} />
                Pendalaman Alkitab
              </span>
              <h1 className="serif mb-6 text-5xl font-bold uppercase leading-[0.92] md:text-7xl">
                Kelompok Pemuridan Kecil yang Bertumbuh Bersama Firman
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-church-cream/80 md:text-xl">
                Pendalaman Alkitab di GKKD Jakarta dirancang sebagai kelompok kecil pemuridan untuk belajar Alkitab bersama
                menggunakan buku-buku yang sudah tersedia, sehingga setiap peserta dapat bertumbuh dengan arah yang jelas,
                terhubung dalam komunitas, dan makin mengenal Kristus.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => setActivePage("contact")}
                  className="inline-flex items-center gap-3 rounded-full bg-church-gold px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-church-dark transition-transform hover:-translate-y-0.5"
                >
                  Gabung Kelompok
                  <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setActivePage("services")}
                  className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-church-cream/85 transition-colors hover:bg-white/10"
                >
                  Kembali ke Layanan
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {studyBooks.map((book, index) => (
                <motion.div
                  key={book.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-3 shadow-[0_18px_50px_rgba(0,0,0,0.16)] backdrop-blur-sm"
                >
                  <div className="aspect-[4/5] overflow-hidden rounded-[1.4rem] bg-white/90">
                    <img
                      src={book.imageSrc}
                      alt={`Buku ${book.title}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-[0.96fr_1.04fr]">
          <div className="rounded-[2.5rem] border border-church-gold/10 bg-white p-8 shadow-[0_20px_60px_rgba(26,26,26,0.06)] md:p-10">
            <div className="mb-6 flex items-center gap-3 text-church-gold">
              <Sparkles size={18} />
              <span className="text-sm font-semibold uppercase tracking-[0.26em]">Tentang Program</span>
            </div>
            <h2 className="serif mb-6 text-4xl font-bold text-church-dark md:text-5xl">
              Belajar Alkitab dengan Ritme yang Hangat dan Terarah
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-church-dark/65">
              Kami percaya pertumbuhan rohani terbaik sering terjadi saat firman Tuhan dipelajari bersama dalam kelompok kecil.
              Karena itu, Pendalaman Alkitab ini dibangun supaya jemaat bisa belajar, bertanya, berdiskusi, dan saling menguatkan
              dengan materi yang terstruktur dan mudah diikuti.
            </p>
            <div className="space-y-4">
              {discipleshipHighlights.map((item) => (
                <div key={item} className="flex items-start gap-4 rounded-[1.6rem] bg-church-cream/70 px-5 py-4">
                  <CheckCircle2 size={20} className="mt-1 shrink-0 text-church-gold" />
                  <p className="text-church-dark/70 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-church-gold/10 bg-church-dark p-8 text-church-cream shadow-[0_20px_60px_rgba(26,26,26,0.08)] md:p-10">
            <div className="mb-6 flex items-center gap-3 text-church-gold">
              <Users size={18} />
              <span className="text-sm font-semibold uppercase tracking-[0.26em]">Alur Pertumbuhan</span>
            </div>
            <div className="space-y-4">
              {studyFlow.map((step, index) => (
                <div key={step.title} className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-church-gold/15 text-sm font-bold text-church-gold">
                    {index + 1}
                  </div>
                  <h3 className="serif mb-3 text-2xl font-bold uppercase text-white">{step.title}</h3>
                  <p className="leading-relaxed text-white/70">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[2.5rem] border border-church-gold/10 bg-[linear-gradient(135deg,rgba(255,255,255,1),rgba(248,244,235,0.96))] p-8 shadow-[0_20px_60px_rgba(26,26,26,0.06)] md:p-10">
          <div className="mb-8 max-w-3xl">
            <span className="text-sm font-semibold uppercase tracking-[0.26em] text-church-gold">Buku Pendalaman</span>
            <h2 className="serif mt-4 mb-4 text-4xl font-bold text-church-dark md:text-5xl">
              Pilih Materi Belajar yang Tersedia
            </h2>
            <p className="text-lg leading-relaxed text-church-dark/60">
              Setiap buku di bawah ini dipakai dalam proses pemuridan dan juga bisa dibeli. Klik salah satu buku untuk langsung
              diarahkan ke Shopee.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {studyBooks.map((book, index) => (
              <motion.a
                key={book.title}
                href={book.purchaseUrl}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-church-gold/10 bg-white shadow-[0_16px_50px_rgba(26,26,26,0.05)] transition-all hover:-translate-y-1 hover:border-church-gold/30"
              >
                <div className="aspect-[4/5] overflow-hidden bg-church-cream">
                  <img
                    src={book.imageSrc}
                    alt={`Buku ${book.title}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-church-gold/90">{book.stage}</span>
                  <h3 className="serif mt-3 text-3xl font-bold uppercase text-church-dark">{book.title}</h3>
                  <p className="mt-4 flex-1 leading-relaxed text-church-dark/65">{book.description}</p>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-church-dark">
                    Buka di Shopee
                    <ExternalLink size={16} className="text-church-gold" />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
