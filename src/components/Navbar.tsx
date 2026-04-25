import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import AppButton from "./ui/AppButton";
import { cn } from "../lib/cn";
import {
  ABOUT_NAV_ITEMS,
  BASIC_NAV_ITEMS,
  SECONDARY_NAV_ITEMS,
  SERVICE_NAV_ITEMS,
  isAboutPage,
  isServicePage,
  type NavigationItem,
  type NavigateToPage,
  type PageId,
} from "../lib/navigation";

type DropdownKey = "about" | "services";

interface NavbarProps {
  activePage: PageId;
  setActivePage: NavigateToPage;
}

interface DesktopDropdownProps {
  activePage: PageId;
  isOpen: boolean;
  items: NavigationItem[];
  label: string;
  onClose: () => void;
  onOpen: () => void;
  onToggle: () => void;
  setActivePage: NavigateToPage;
  align?: "left" | "right";
  active?: boolean;
  widthClassName?: string;
}

interface MobileAccordionProps {
  activePage: PageId;
  isOpen: boolean;
  items: NavigationItem[];
  label: string;
  onToggle: () => void;
  setActivePage: NavigateToPage;
  active?: boolean;
}

function DesktopNavButton({
  item,
  active,
  onClick,
}: {
  key?: string;
  item: NavigationItem;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <AppButton
      buttonMotion="nav"
      active={active}
      onClick={onClick}
      className={cn(
        "px-1 py-2 text-sm font-medium tracking-widest uppercase",
        active ? "text-church-gold" : "text-church-dark/70 hover:text-church-gold",
      )}
    >
      {item.name}
    </AppButton>
  );
}

function MobileNavButton({
  item,
  active,
  onClick,
}: {
  key?: string;
  item: NavigationItem;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <AppButton
      buttonMotion="lift"
      active={active}
      onClick={onClick}
      className={cn(
        "block w-full rounded-2xl px-3 py-4 text-left text-base font-medium uppercase tracking-widest",
        active ? "bg-church-gold/8 text-church-gold" : "text-church-dark/70 hover:bg-white/80 hover:text-church-dark",
      )}
    >
      {item.name}
    </AppButton>
  );
}

function DesktopDropdown({
  activePage,
  active = false,
  align = "left",
  isOpen,
  items,
  label,
  onClose,
  onOpen,
  onToggle,
  setActivePage,
  widthClassName = "w-64",
}: DesktopDropdownProps) {
  const alignmentClassName = align === "right" ? "right-0" : "left-0";

  return (
    <div
      className="relative"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
      <AppButton
        type="button"
        buttonMotion="nav"
        active={active}
        onClick={onToggle}
        className={cn(
          "inline-flex items-center gap-2 px-1 py-2 text-sm font-medium tracking-widest uppercase",
          active ? "text-church-gold" : "text-church-dark/70 hover:text-church-gold",
        )}
        aria-expanded={isOpen}
      >
        {label}
        <ChevronDown size={16} className={cn("transition-transform", isOpen && "rotate-180")} />
      </AppButton>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className={cn(
              "absolute top-full mt-4 rounded-2xl border border-church-gold/15 bg-white p-2 shadow-[0_18px_50px_rgba(26,26,26,0.12)]",
              alignmentClassName,
              widthClassName,
            )}
          >
            {items.map((item) => (
              <AppButton
                key={item.id}
                type="button"
                buttonMotion="lift"
                onClick={() => {
                  setActivePage(item.id);
                  onClose();
                }}
                className={cn(
                  "block w-full rounded-xl px-4 py-3 text-left text-sm font-medium uppercase tracking-[0.18em]",
                  activePage === item.id
                    ? "bg-church-gold/10 text-church-gold"
                    : "text-church-dark/70 hover:bg-church-cream hover:text-church-dark",
                )}
              >
                {item.name}
              </AppButton>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileAccordion({
  activePage,
  active = false,
  isOpen,
  items,
  label,
  onToggle,
  setActivePage,
}: MobileAccordionProps) {
  return (
    <div className="rounded-2xl border border-church-gold/10 bg-white/60">
      <AppButton
        type="button"
        buttonMotion="lift"
        onClick={onToggle}
        className={cn(
          "flex w-full items-center justify-between rounded-2xl px-3 py-4 text-left text-base font-medium uppercase tracking-widest",
          active ? "text-church-gold" : "text-church-dark/70 hover:text-church-dark",
        )}
        aria-expanded={isOpen}
      >
        <span>{label}</span>
        <ChevronDown size={18} className={cn("transition-transform", isOpen && "rotate-180")} />
      </AppButton>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-church-gold/10"
          >
            {items.map((item) => (
              <AppButton
                key={item.id}
                type="button"
                buttonMotion="lift"
                onClick={() => setActivePage(item.id)}
                className={cn(
                  "block w-full px-5 py-3 text-left text-sm font-medium uppercase tracking-[0.18em]",
                  activePage === item.id
                    ? "bg-church-gold/10 text-church-gold"
                    : "text-church-dark/70 hover:bg-church-cream",
                )}
              >
                {item.name}
              </AppButton>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar({ activePage, setActivePage }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey | null>(null);

  const isAboutActive = isAboutPage(activePage);
  const isServicesActive = isServicePage(activePage);

  const closeMenus = () => {
    setOpenDropdown(null);
    setIsOpen(false);
  };

  useEffect(() => {
    closeMenus();
  }, [activePage]);

  const navigateTo = (page: PageId) => {
    setActivePage(page);
    closeMenus();
  };

  const toggleDropdown = (key: DropdownKey) => {
    setOpenDropdown((current) => (current === key ? null : key));
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-church-cream/80 backdrop-blur-md border-b border-church-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <AppButton
            type="button"
            buttonMotion="lift"
            onClick={() => navigateTo("home")}
            className="flex items-center gap-3 rounded-full px-2 py-2 text-left"
          >
            <img
              src="/img/logo.png"
              alt="Logo GKKD Jakarta"
              className="h-12 w-12 object-contain"
            />
            <span className="serif text-2xl font-bold tracking-tight text-church-dark uppercase">GKKD Jakarta</span>
          </AppButton>

          <div className="hidden md:flex items-center space-x-8">
            {BASIC_NAV_ITEMS.slice(0, 1).map((item) => (
              <DesktopNavButton
                key={item.id}
                item={item}
                active={activePage === item.id}
                onClick={() => navigateTo(item.id)}
              />
            ))}

            <DesktopDropdown
              activePage={activePage}
              active={isAboutActive}
              isOpen={openDropdown === "about"}
              items={ABOUT_NAV_ITEMS}
              label="Tentang"
              onOpen={() => setOpenDropdown("about")}
              onClose={() => setOpenDropdown(null)}
              onToggle={() => toggleDropdown("about")}
              setActivePage={navigateTo}
            />

            {BASIC_NAV_ITEMS.slice(1).map((item) => (
              <DesktopNavButton
                key={item.id}
                item={item}
                active={activePage === item.id}
                onClick={() => navigateTo(item.id)}
              />
            ))}

            <DesktopDropdown
              activePage={activePage}
              active={isServicesActive}
              align="right"
              isOpen={openDropdown === "services"}
              items={SERVICE_NAV_ITEMS}
              label="Layanan"
              onOpen={() => setOpenDropdown("services")}
              onClose={() => setOpenDropdown(null)}
              onToggle={() => toggleDropdown("services")}
              setActivePage={navigateTo}
              widthClassName="w-72"
            />

            {SECONDARY_NAV_ITEMS.map((item) => (
              <DesktopNavButton
                key={item.id}
                item={item}
                active={activePage === item.id}
                onClick={() => navigateTo(item.id)}
              />
            ))}
          </div>

          <div className="md:hidden flex items-center">
            <AppButton
              type="button"
              buttonMotion="icon"
              onClick={() => {
                if (isOpen) {
                  setOpenDropdown(null);
                }

                setIsOpen((current) => !current);
              }}
              className="rounded-full p-2 text-church-dark hover:text-church-gold"
              aria-expanded={isOpen}
              aria-label={isOpen ? "Tutup menu" : "Buka menu"}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </AppButton>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-church-cream border-b border-church-gold/20"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {BASIC_NAV_ITEMS.slice(0, 1).map((item) => (
                <MobileNavButton
                  key={item.id}
                  item={item}
                  active={activePage === item.id}
                  onClick={() => navigateTo(item.id)}
                />
              ))}

              <MobileAccordion
                activePage={activePage}
                active={isAboutActive}
                isOpen={openDropdown === "about"}
                items={ABOUT_NAV_ITEMS}
                label="Tentang"
                onToggle={() => toggleDropdown("about")}
                setActivePage={navigateTo}
              />

              {BASIC_NAV_ITEMS.slice(1).map((item) => (
                <MobileNavButton
                  key={item.id}
                  item={item}
                  active={activePage === item.id}
                  onClick={() => navigateTo(item.id)}
                />
              ))}

              <MobileAccordion
                activePage={activePage}
                active={isServicesActive}
                isOpen={openDropdown === "services"}
                items={SERVICE_NAV_ITEMS}
                label="Layanan"
                onToggle={() => toggleDropdown("services")}
                setActivePage={navigateTo}
              />

              {SECONDARY_NAV_ITEMS.map((item) => (
                <MobileNavButton
                  key={item.id}
                  item={item}
                  active={activePage === item.id}
                  onClick={() => navigateTo(item.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
