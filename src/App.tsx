import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Mission from "./pages/Mission";
import Services from "./pages/Services";
import BlessComn from "./pages/BlessComn";
import Events from "./pages/Events";
import WorshipSchedules from "./pages/WorshipSchedules";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [activePage, setActivePage] = useState("home");

  const renderPage = () => {
    switch (activePage) {
      case "home":
        return <Home setActivePage={setActivePage} />;
      case "about":
        return <About />;
      case "mission":
        return <Mission setActivePage={setActivePage} />;
      case "services":
        return <Services setActivePage={setActivePage} />;
      case "blesscomn":
        return <BlessComn setActivePage={setActivePage} />;
      case "events":
        return <Events />;
      case "worship":
        return <WorshipSchedules />;
      case "contact":
        return <Contact />;
      case "admin":
        return <Admin />;
      default:
        return <Home setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer setActivePage={setActivePage} />
    </div>
  );
}
