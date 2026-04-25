import { Suspense, lazy, startTransition, useLayoutEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import { motion, AnimatePresence } from "motion/react";
import type { NavigateToPage, PageId } from "./lib/navigation";

const About = lazy(() => import("./pages/About"));
const Mission = lazy(() => import("./pages/Mission"));
const Services = lazy(() => import("./pages/Services"));
const BlessComn = lazy(() => import("./pages/BlessComn"));
const BibleStudy = lazy(() => import("./pages/BibleStudy"));
const Events = lazy(() => import("./pages/Events"));
const WorshipSchedules = lazy(() => import("./pages/WorshipSchedules"));
const Contact = lazy(() => import("./pages/Contact"));
const Admin = lazy(() => import("./pages/Admin"));

function PageFallback() {
  return (
    <div className="mx-auto flex min-h-[50vh] w-full max-w-7xl items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-[2rem] border border-church-gold/15 bg-white/80 p-8 text-center shadow-[0_20px_60px_rgba(26,26,26,0.08)] backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-church-gold">Memuat Halaman</p>
        <div className="mx-auto mt-5 h-2 w-32 overflow-hidden rounded-full bg-church-gold/10">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-church-gold/70" />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-church-dark/65">
          Konten sedang dipersiapkan agar halaman awal tetap ringan saat dibuka.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState<PageId>("home");

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [activePage]);

  const navigateToPage: NavigateToPage = (page) => {
    startTransition(() => {
      setActivePage(page);
    });
  };

  const renderPage = () => {
    switch (activePage) {
      case "home":
        return <Home setActivePage={navigateToPage} />;
      case "about":
        return <About />;
      case "mission":
        return <Mission setActivePage={navigateToPage} />;
      case "services":
        return <Services setActivePage={navigateToPage} />;
      case "blesscomn":
        return <BlessComn setActivePage={navigateToPage} />;
      case "bible-study":
        return <BibleStudy setActivePage={navigateToPage} />;
      case "events":
        return <Events />;
      case "worship":
        return <WorshipSchedules />;
      case "contact":
        return <Contact />;
      case "admin":
        return <Admin />;
      default:
        return <Home setActivePage={navigateToPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activePage={activePage} setActivePage={navigateToPage} />
      
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Suspense fallback={<PageFallback />}>
              {renderPage()}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer setActivePage={navigateToPage} />
    </div>
  );
}
