import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import AppButton from "../components/ui/AppButton";

export default function Contact() {
  return (
    <div className="pt-32 pb-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div>
            <span className="text-church-gold font-medium tracking-widest uppercase mb-4 block">Hubungi Kami</span>
            <h2 className="serif text-5xl md:text-7xl font-bold text-church-dark leading-tight mb-8 uppercase">
              Mari <br /> <span className="text-church-gold">Terhubung</span>
            </h2>
            <p className="text-church-dark/60 text-lg leading-relaxed mb-12 max-w-md">
              Apakah Anda memiliki pertanyaan, butuh pelayanan doa, atau ingin tahu lebih lanjut tentang komunitas kami? Kami siap melayani Anda.
            </p>

            <div className="space-y-12">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-church-gold/10 rounded-full flex items-center justify-center text-church-gold shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="serif text-xl font-bold text-church-dark uppercase tracking-tight mb-2">Lokasi</h4>
                  <p className="text-church-dark/60 leading-relaxed">
                    Jl. Menteng Atas Sel. Gg. 2, Menteng Dalam, Kec. Menteng, <br /> Kota Jakarta Selatan, DKI Jakarta 12870
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-church-gold/10 rounded-full flex items-center justify-center text-church-gold shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="serif text-xl font-bold text-church-dark uppercase tracking-tight mb-2">Telepon</h4>
                  <p className="text-church-dark/60 leading-relaxed">+62 813-7930-8391</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-church-gold/10 rounded-full flex items-center justify-center text-church-gold shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="serif text-xl font-bold text-church-dark uppercase tracking-tight mb-2">Email</h4>
                  <p className="text-church-dark/60 leading-relaxed">info@gkkdjakarta.org</p>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 md:p-16 rounded-[3rem] border border-church-gold/10 shadow-xl"
          >
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-church-dark/40">Nama Lengkap</label>
                  <input
                    type="text"
                    className="w-full bg-church-cream/50 border-b border-church-gold/20 py-4 px-0 focus:outline-none focus:border-church-gold transition-colors"
                    placeholder="John Doe"
                    maxLength={120}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-church-dark/40">Alamat Email</label>
                  <input
                    type="email"
                    className="w-full bg-church-cream/50 border-b border-church-gold/20 py-4 px-0 focus:outline-none focus:border-church-gold transition-colors"
                    placeholder="john@example.com"
                    maxLength={320}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-church-dark/40">Subjek</label>
                <input
                  type="text"
                  className="w-full bg-church-cream/50 border-b border-church-gold/20 py-4 px-0 focus:outline-none focus:border-church-gold transition-colors"
                  placeholder="Pelayanan Doa / Pertanyaan Umum"
                  maxLength={160}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-church-dark/40">Pesan Anda</label>
                <textarea
                  rows={4}
                  className="w-full bg-church-cream/50 border-b border-church-gold/20 py-4 px-0 focus:outline-none focus:border-church-gold transition-colors resize-none"
                  placeholder="Tuliskan pesan Anda di sini..."
                  maxLength={1500}
                  required
                />
              </div>
              <AppButton
                type="submit"
                className="w-full bg-church-dark text-church-cream py-6 rounded-2xl font-bold tracking-[0.2em] uppercase hover:bg-church-gold transition-all flex items-center justify-center gap-3 group"
              >
                Kirim Pesan <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </AppButton>
            </form>
          </motion.div>
        </div>

        <div className="mt-32 rounded-[3rem] overflow-hidden h-[500px] border border-church-gold/10">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3966.317477528696!2d106.8433297!3d-6.2218021!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3c89e5bb3f7%3A0xf94eba3a38ef8f3b!2sPAKUWON%20TOWER%20JAKARTA!5e0!3m2!1sen!2sid!4v1775785748640!5m2!1sen!2sid"
            className="w-full h-full border-0 grayscale opacity-80 hover:grayscale-0 transition-all duration-700"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
