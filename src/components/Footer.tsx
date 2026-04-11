import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import {
  SATELLITE_OPTIONS,
  WORSHIP_TARGET_EVENT_NAME,
  WORSHIP_TARGET_STORAGE_KEY,
  type SatelliteOption,
} from "../lib/worshipSchedules";

interface FooterProps {
  setActivePage: (page: string) => void;
}

export default function Footer({ setActivePage }: FooterProps) {
  const handleSatelliteClick = (satellite: SatelliteOption) => {
    window.sessionStorage.setItem(WORSHIP_TARGET_STORAGE_KEY, satellite);
    window.dispatchEvent(new CustomEvent(WORSHIP_TARGET_EVENT_NAME, { detail: satellite }));
    setActivePage("worship");
  };

  return (
    <footer className="bg-church-dark text-church-cream py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <img
              src="/img/logo.png"
              alt="Logo GKKD Jakarta"
              className="h-14 w-14 rounded-2xl object-contain bg-church-cream p-1"
            />
            <span className="serif text-2xl font-bold tracking-tight uppercase">GKKD Jakarta</span>
          </div>
          <p className="text-church-cream/60 leading-relaxed max-w-sm">
            Gereja yang bertumbuh menuju kedewasaan penuh dalam Kristus Yesus serta memenuhi panggilan Apostolik.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-church-gold transition-colors"><Facebook size={20} /></a>
            <a href="#" className="hover:text-church-gold transition-colors"><Instagram size={20} /></a>
            <a href="#" className="hover:text-church-gold transition-colors"><Youtube size={20} /></a>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="serif text-xl font-bold uppercase tracking-widest text-church-gold">Hubungi Kami</h3>
          <ul className="space-y-4 text-church-cream/70">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="mt-1 text-church-gold shrink-0" />
              <span>Jl. Menteng Atas Sel. Gg. 2, Menteng Dalam, Kec. Menteng, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12870</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-church-gold shrink-0" />
              <span>+62 822-3940-0400</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-church-gold shrink-0" />
              <span>official.gkkdjakarta@gmail.com</span>
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="serif text-xl font-bold uppercase tracking-widest text-church-gold">Gereja Satelit</h3>
          <p className="text-sm leading-relaxed text-church-cream/55">
            Pilih lokasi ibadah untuk langsung melihat pengelompokan jadwal di menu Jadwal Ibadah.
          </p>
          <ul className="space-y-3 text-church-cream/70">
            {SATELLITE_OPTIONS.map((satellite) => (
              <li key={satellite}>
                <button
                  type="button"
                  onClick={() => handleSatelliteClick(satellite)}
                  className="flex w-full items-center justify-between rounded-2xl border border-church-cream/10 bg-white/5 px-4 py-3 text-left transition-all hover:border-church-gold/50 hover:bg-white/10 hover:text-church-cream"
                >
                  <span>{satellite}</span>
                  <span className="text-xs uppercase tracking-[0.22em] text-church-gold">Lihat</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-church-cream/10 text-center text-church-cream/40 text-sm">
        <p>&copy; {new Date().getFullYear()} GKKD Jakarta, Sunsugos. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
