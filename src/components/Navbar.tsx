import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Navbar({ activePage, setActivePage }: { activePage: string, setActivePage: (page: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const basicNavItems = [
    { name: "Home", id: "home" },
    { name: "Jadwal Ibadah", id: "worship" },
  ];
  const secondaryNavItems = [
    { name: "Event", id: "events" },
    { name: "Kontak", id: "contact" },
    { name: "Admin", id: "admin" },
  ];
  const aboutItems = [
    { name: "Tentang", id: "about" },
    { name: "Pelayanan Misi", id: "mission" },
  ];
  const serviceItems = [
    { name: "Layanan", id: "services" },
    { name: "BlessComn", id: "blesscomn" },
  ];
  const isAboutActive = activePage === "about" || activePage === "mission";
  const isServicesActive = activePage === "services" || activePage === "blesscomn";

  const navigateTo = (page: string) => {
    setActivePage(page);
    setIsAboutOpen(false);
    setIsServicesOpen(false);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-church-cream/80 backdrop-blur-md border-b border-church-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo("home")}>
            <img
              src="/img/logo.png"
              alt="Logo GKKD Jakarta"
              className="h-12 w-12 object-contain"
            />
            <span className="serif text-2xl font-bold tracking-tight text-church-dark uppercase">GKKD Jakarta</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {basicNavItems.slice(0, 1).map((item) => (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`text-sm font-medium tracking-widest uppercase transition-colors hover:text-church-gold ${
                  activePage === item.id ? "text-church-gold border-b border-church-gold" : "text-church-dark/70"
                }`}
              >
                {item.name}
              </button>
            ))}

            <div
              className="relative"
              onMouseEnter={() => {
                setIsAboutOpen(true);
                setIsServicesOpen(false);
              }}
              onMouseLeave={() => setIsAboutOpen(false)}
            >
              <button
                type="button"
                onClick={() => {
                  setIsAboutOpen((current) => !current);
                  setIsServicesOpen(false);
                }}
                className={`inline-flex items-center gap-2 text-sm font-medium tracking-widest uppercase transition-colors hover:text-church-gold ${
                  isAboutActive ? "text-church-gold border-b border-church-gold" : "text-church-dark/70"
                }`}
              >
                Tentang
                <ChevronDown size={16} className={`transition-transform ${isAboutOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isAboutOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute left-0 top-full mt-4 w-64 rounded-2xl border border-church-gold/15 bg-white p-2 shadow-[0_18px_50px_rgba(26,26,26,0.12)]"
                  >
                    {aboutItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => navigateTo(item.id)}
                        className={`block w-full rounded-xl px-4 py-3 text-left text-sm font-medium uppercase tracking-[0.18em] transition-colors ${
                          activePage === item.id
                            ? "bg-church-gold/10 text-church-gold"
                            : "text-church-dark/70 hover:bg-church-cream hover:text-church-dark"
                        }`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {basicNavItems.slice(1).map((item) => (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`text-sm font-medium tracking-widest uppercase transition-colors hover:text-church-gold ${
                  activePage === item.id ? "text-church-gold border-b border-church-gold" : "text-church-dark/70"
                }`}
              >
                {item.name}
              </button>
            ))}

            <div
              className="relative"
              onMouseEnter={() => {
                setIsServicesOpen(true);
                setIsAboutOpen(false);
              }}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button
                type="button"
                onClick={() => {
                  setIsServicesOpen((current) => !current);
                  setIsAboutOpen(false);
                }}
                className={`inline-flex items-center gap-2 text-sm font-medium tracking-widest uppercase transition-colors hover:text-church-gold ${
                  isServicesActive ? "text-church-gold border-b border-church-gold" : "text-church-dark/70"
                }`}
              >
                Layanan
                <ChevronDown size={16} className={`transition-transform ${isServicesOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 top-full mt-4 w-56 rounded-2xl border border-church-gold/15 bg-white p-2 shadow-[0_18px_50px_rgba(26,26,26,0.12)]"
                  >
                    {serviceItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => navigateTo(item.id)}
                        className={`block w-full rounded-xl px-4 py-3 text-left text-sm font-medium uppercase tracking-[0.18em] transition-colors ${
                          activePage === item.id
                            ? "bg-church-gold/10 text-church-gold"
                            : "text-church-dark/70 hover:bg-church-cream hover:text-church-dark"
                        }`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {secondaryNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`text-sm font-medium tracking-widest uppercase transition-colors hover:text-church-gold ${
                  activePage === item.id ? "text-church-gold border-b border-church-gold" : "text-church-dark/70"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => {
                if (isOpen) {
                  setIsAboutOpen(false);
                  setIsServicesOpen(false);
                }
                setIsOpen(!isOpen);
              }}
              className="text-church-dark hover:text-church-gold transition-colors"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-church-cream border-b border-church-gold/20"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {basicNavItems.slice(0, 1).map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    navigateTo(item.id);
                  }}
                  className={`block w-full text-left px-3 py-4 text-base font-medium uppercase tracking-widest ${
                    activePage === item.id ? "text-church-gold bg-church-gold/5" : "text-church-dark/70"
                  }`}
                >
                  {item.name}
                </button>
              ))}

              <div className="rounded-2xl border border-church-gold/10 bg-white/60">
                <button
                  type="button"
                  onClick={() => {
                    setIsAboutOpen((current) => !current);
                    setIsServicesOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-3 py-4 text-left text-base font-medium uppercase tracking-widest ${
                    isAboutActive ? "text-church-gold" : "text-church-dark/70"
                  }`}
                >
                  <span>Tentang</span>
                  <ChevronDown size={18} className={`transition-transform ${isAboutOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isAboutOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-church-gold/10"
                    >
                      {aboutItems.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => navigateTo(item.id)}
                          className={`block w-full px-5 py-3 text-left text-sm font-medium uppercase tracking-[0.18em] ${
                            activePage === item.id
                              ? "bg-church-gold/10 text-church-gold"
                              : "text-church-dark/70 hover:bg-church-cream"
                          }`}
                        >
                          {item.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {basicNavItems.slice(1).map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    navigateTo(item.id);
                  }}
                  className={`block w-full text-left px-3 py-4 text-base font-medium uppercase tracking-widest ${
                    activePage === item.id ? "text-church-gold bg-church-gold/5" : "text-church-dark/70"
                  }`}
                >
                  {item.name}
                </button>
              ))}

              <div className="rounded-2xl border border-church-gold/10 bg-white/60">
                <button
                  type="button"
                  onClick={() => {
                    setIsServicesOpen((current) => !current);
                    setIsAboutOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-3 py-4 text-left text-base font-medium uppercase tracking-widest ${
                    isServicesActive ? "text-church-gold" : "text-church-dark/70"
                  }`}
                >
                  <span>Layanan</span>
                  <ChevronDown size={18} className={`transition-transform ${isServicesOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isServicesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-church-gold/10"
                    >
                      {serviceItems.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => navigateTo(item.id)}
                          className={`block w-full px-5 py-3 text-left text-sm font-medium uppercase tracking-[0.18em] ${
                            activePage === item.id
                              ? "bg-church-gold/10 text-church-gold"
                              : "text-church-dark/70 hover:bg-church-cream"
                          }`}
                        >
                          {item.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {secondaryNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    navigateTo(item.id);
                  }}
                  className={`block w-full text-left px-3 py-4 text-base font-medium uppercase tracking-widest ${
                    activePage === item.id ? "text-church-gold bg-church-gold/5" : "text-church-dark/70"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
