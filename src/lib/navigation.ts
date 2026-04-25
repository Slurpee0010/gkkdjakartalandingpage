export const PAGE_IDS = [
  "home",
  "about",
  "mission",
  "services",
  "blesscomn",
  "bible-study",
  "events",
  "worship",
  "contact",
  "admin",
] as const;

export type PageId = (typeof PAGE_IDS)[number];
export type NavigateToPage = (page: PageId) => void;

export type NavigationItem = {
  name: string;
  id: PageId;
};

export const BASIC_NAV_ITEMS: NavigationItem[] = [
  { name: "Home", id: "home" },
  { name: "Jadwal Ibadah", id: "worship" },
];

export const SECONDARY_NAV_ITEMS: NavigationItem[] = [
  { name: "Event", id: "events" },
  { name: "Kontak", id: "contact" },
  { name: "Admin", id: "admin" },
];

export const ABOUT_NAV_ITEMS: NavigationItem[] = [
  { name: "Tentang", id: "about" },
  { name: "Pelayanan Misi", id: "mission" },
];

export const SERVICE_NAV_ITEMS: NavigationItem[] = [
  { name: "Layanan", id: "services" },
  { name: "BlessComn", id: "blesscomn" },
  { name: "Pendalaman Alkitab", id: "bible-study" },
];

export function isAboutPage(page: PageId) {
  return page === "about" || page === "mission";
}

export function isServicePage(page: PageId) {
  return page === "services" || page === "blesscomn" || page === "bible-study";
}
