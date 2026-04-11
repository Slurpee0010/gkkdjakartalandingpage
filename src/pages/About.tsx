import { motion } from "motion/react";

export default function About() {
  const leaders = [
    { name: "Pdt. Eduar Johan Moniyong", role: "Penatua Senior", image: "/img/pnt1.jpg" },
    { name: "Pdt. Mulianta Bangun", role: "Penatua Jakarta Center", image: "/img/pnt4.jpg" },
    { name: "Pdt. Yopy Halomoan Sinaga", role: "Penatua Jakarta Center", image: "/img/pnt6.jpg" },
    { name: "Pdt. Tony Harley Silalahi", role: "Penatua Jakarta Center", image: "/img/pnt2.jpg" },
    { name: "Pdt. Andi Wijaya", role: "Penatua Jakarta Center", image: "/img/pnt5.jpg" },
    { name: "Pdt. Iwan Santoso Narto", role: "Penatua Jakarta Center", image: "/img/pnt7.jpg" },
    { name: "Pdt. Rudi Manahan Simanjuntak", role: "Penatua Jakarta Center", image: "/img/pnt3.jpg" },
    { name: "Pdt. Simson Panjaitan", role: "Penatua Jakarta Center", image: "/img/pnt8.jpg" },
    { name: "Pdt. Kristyadi Winarto", role: "Penatua Jakarta Center", image: "/img/pnt9.jpg" },
    { name: "Pdt. Robby Tarigan", role: "Penatua Jakarta Center", image: "/img/pnt10.jpg" },
    { name: "Pdt. Otto Daniel Panggabean", role: "Penatua Jakarta Center", image: "/img/pnt11.jpg" },
  ];

  return (
    <div className="pt-32 pb-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-church-gold font-medium tracking-widest uppercase mb-4 block">Tentang Kami</span>
            <h2 className="serif text-4xl md:text-6xl font-bold text-church-dark leading-tight mb-8 uppercase">
              Gereja Dengan <br /> Hati Untuk Jiwa
            </h2>
            <div className="space-y-6 text-church-dark/70 leading-relaxed text-lg">
              <p>
                Kami adalah gereja yang berfokus pada penginjilan dan menyelamatkan jiwa-jiwa yang terhilang. Semua yang kami kerjakan berpusat pada misi tersebut karena kami tahu Tuhan mengasihi jiwa-jiwa tersebut.
              </p>
              <p>
                Misi yang kami lakukan sudah menjangkau banyak daerah di Indonesia dan bangsa-bangsa lain seperti Papua, Lampung, Sumba, Kamboja, Bali dan Kupang.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&q=80&w=1000"
              alt="Church Community"
              className="rounded-3xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-8 -left-8 bg-church-gold text-church-cream p-8 rounded-2xl hidden md:block">
              <p className="serif text-4xl font-bold">30+</p>
              <p className="text-xs uppercase tracking-widest font-medium opacity-80">Tahun Melayani</p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
          <div className="bg-white p-12 rounded-3xl border border-church-gold/10">
            <h3 className="serif text-3xl font-bold text-church-gold uppercase mb-6">Visi</h3>
            <p className="text-church-dark/70 text-lg leading-relaxed">
              Gereja yang bertumbuh menuju kedewasaan penuh dalam Kristus Yesus serta memenuhi panggilan Apostolik.
            </p>
          </div>
          <div className="bg-church-dark p-12 rounded-3xl text-church-cream">
            <h3 className="serif text-3xl font-bold text-church-gold uppercase mb-6">Misi</h3>
            <ul className="space-y-4 text-church-cream/70">
              <li className="flex gap-3">
                <span className="text-church-gold font-bold">01</span>
                <span>Mengasihi Tuhan di atas segalanya.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-church-gold font-bold">02</span>
                <span>Menghargai pribadi lebih daripada program.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-church-gold font-bold">03</span>
                <span>Mengusahakan yang terbaik dalam pelayanan.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-church-gold font-bold">04</span>
                <span>Menjunjung tinggi kesetiaan dan persatuan.</span>
              </li>
            </ul>
          </div>
        </div>

        <section>
          <div className="text-center mb-16">
            <span className="text-church-gold font-medium tracking-widest uppercase mb-4 block">Kepemimpinan</span>
            <h2 className="serif text-4xl font-bold text-church-dark uppercase">Hamba Tuhan Kami</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leaders.map((leader, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-2xl mb-6 aspect-[4/5]">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h4 className="serif text-xl font-bold text-church-dark uppercase tracking-tight">{leader.name}</h4>
                <p className="text-church-gold text-sm uppercase tracking-widest font-medium mt-1">{leader.role}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
