export const SATELLITE_OPTIONS = [
  "Jakarta Center",
  "Jakarta Utara",
  "Southers",
  "Ciledug",
  "Serpong",
] as const;

export type SatelliteOption = (typeof SATELLITE_OPTIONS)[number];

export const WORSHIP_TARGET_EVENT_NAME = "gkkd:worship-target";
export const WORSHIP_TARGET_STORAGE_KEY = "gkkd-worship-target";

export const WORSHIP_CATEGORY_OPTIONS = [
  "onsite",
  "online",
  "onsite dan online",
] as const;

export type WorshipCategory = (typeof WORSHIP_CATEGORY_OPTIONS)[number];

export interface WorshipScheduleItem {
  id: string;
  satellite: SatelliteOption;
  place: string;
  serviceName: string;
  category: WorshipCategory;
  serviceTime: string;
  contactPerson: string;
  createdAt?: string;
}

export const SATELLITE_LOCAL_IMAGES: Record<SatelliteOption, string> = {
  "Jakarta Center": "/img/pakuwontower.jpg",
  "Jakarta Utara": "/img/hartontower.jpg",
  Southers: "/img/joc.jpg",
  Ciledug: "/img/pnt9.jpg",
  Serpong: "/img/pnt8.jpg",
};

export const SATELLITE_PLACE_SUGGESTIONS: Record<SatelliteOption, string[]> = {
  "Jakarta Center": [
    "Gedung Pakuwon Tower (Shopee) Lt. 2 & Lt. 3, Kota Kasablanka Jakarta Selatan - DKI Jakarta",
  ],
  "Jakarta Utara": [
    "Gedung Harton Tower Lt. 2, Jl. Boulevard Artha Gading Kav. Komersial Blok D No. 3 Kelapa Gading, Jakarta Utara",
  ],
  Southers: [
    "Jl. KH. Wahid Hasyim Blok FG 14 no. 42-A, Bintaro Sektor 7 Pondok Aren, Tangerang Selatan, Banten",
  ],
  Ciledug: [
    "Sekolah Petra Alpha, Jl. Taman Alfa Indah A18 No. 11 RT.3 RW.7, Joglo, Kec. Kembangan Kota Jakarta Barat, DKI Jakarta 11640",
  ],
  Serpong: [
    "Ruko Karawaci Office Park (Ruko Pinangsia) Blok M no. 35 Lippo Karawaci Utara, Tangerang Selatan, Banten",
  ],
};

export const DEFAULT_WORSHIP_SCHEDULES: WorshipScheduleItem[] = [
  {
    id: "default-jakarta-center-umum-1",
    satellite: "Jakarta Center",
    place: SATELLITE_PLACE_SUGGESTIONS["Jakarta Center"][0],
    serviceName: "Ibadah Umum 1",
    category: "onsite dan online",
    serviceTime: "09:00 - 10:30 WIB",
    contactPerson: "Nancy Ricka (0813-7930-8391)",
  },
  {
    id: "default-jakarta-center-sekolah-minggu",
    satellite: "Jakarta Center",
    place: SATELLITE_PLACE_SUGGESTIONS["Jakarta Center"][0],
    serviceName: "Ibadah Anak / Sekolah Minggu",
    category: "onsite dan online",
    serviceTime: "09:00 - 10:30 WIB",
    contactPerson: "Margaret (0823-7420-0465)",
  },
  {
    id: "default-jakarta-center-umum-2",
    satellite: "Jakarta Center",
    place: SATELLITE_PLACE_SUGGESTIONS["Jakarta Center"][0],
    serviceName: "Ibadah Umum 2",
    category: "onsite dan online",
    serviceTime: "11:00 - 12:30 WIB",
    contactPerson: "Ivana Siregar (0878-8217-4343)",
  },
  {
    id: "default-jakarta-center-youth",
    satellite: "Jakarta Center",
    place: SATELLITE_PLACE_SUGGESTIONS["Jakarta Center"][0],
    serviceName: "Ibadah Youth",
    category: "onsite dan online",
    serviceTime: "13:00 - 14:30 WIB",
    contactPerson: "Michael Yosafat (0852-8026-3109)",
  },
  {
    id: "default-jakarta-utara-umum",
    satellite: "Jakarta Utara",
    place: SATELLITE_PLACE_SUGGESTIONS["Jakarta Utara"][0],
    serviceName: "Ibadah Umum",
    category: "onsite dan online",
    serviceTime: "10:00 WIB",
    contactPerson: "Stevian Suryo (0813-9034-4723)",
  },
  {
    id: "default-jakarta-utara-sekolah-minggu",
    satellite: "Jakarta Utara",
    place: SATELLITE_PLACE_SUGGESTIONS["Jakarta Utara"][0],
    serviceName: "Ibadah Anak / Sekolah Minggu",
    category: "onsite dan online",
    serviceTime: "10:00 WIB",
    contactPerson: "Stevian Suryo (0813-9034-4723)",
  },
  {
    id: "default-jakarta-utara-youth",
    satellite: "Jakarta Utara",
    place: SATELLITE_PLACE_SUGGESTIONS["Jakarta Utara"][0],
    serviceName: "Ibadah Youth",
    category: "onsite dan online",
    serviceTime: "15:00 WIB",
    contactPerson: "Sari Prihanti (0896-7396-8827)",
  },
  {
    id: "default-ciledug-umum-1",
    satellite: "Ciledug",
    place: SATELLITE_PLACE_SUGGESTIONS.Ciledug[0],
    serviceName: "Ibadah Umum 1",
    category: "onsite",
    serviceTime: "10:00 WIB",
    contactPerson: "Ibu Dini (0813-1545-1987)",
  },
  {
    id: "default-ciledug-youth",
    satellite: "Ciledug",
    place: SATELLITE_PLACE_SUGGESTIONS.Ciledug[0],
    serviceName: "Ibadah Gabungan Youth",
    category: "onsite",
    serviceTime: "13:00 WIB",
    contactPerson: "Ibu Dini (0813-1545-1987)",
  },
  {
    id: "default-southers-umum-1",
    satellite: "Southers",
    place: SATELLITE_PLACE_SUGGESTIONS.Southers[0],
    serviceName: "Ibadah Umum 1",
    category: "onsite dan online",
    serviceTime: "09:30 WIB",
    contactPerson: "Kristesia (0812-1845-0005)",
  },
  {
    id: "default-southers-sekolah-minggu",
    satellite: "Southers",
    place: SATELLITE_PLACE_SUGGESTIONS.Southers[0],
    serviceName: "Ibadah Anak / Sekolah Minggu",
    category: "onsite dan online",
    serviceTime: "10:00 WIB",
    contactPerson: "Mitha (0812-1098-6900)",
  },
  {
    id: "default-southers-umum-2",
    satellite: "Southers",
    place: SATELLITE_PLACE_SUGGESTIONS.Southers[0],
    serviceName: "Ibadah Umum 2",
    category: "onsite dan online",
    serviceTime: "12:00 WIB",
    contactPerson: "Kristesia (0812-1845-0005)",
  },
  {
    id: "default-southers-youth",
    satellite: "Southers",
    place: SATELLITE_PLACE_SUGGESTIONS.Southers[0],
    serviceName: "Ibadah Youth",
    category: "onsite dan online",
    serviceTime: "15:30 WIB",
    contactPerson: "Kristesia (0812-1845-0005)",
  },
  {
    id: "default-serpong-umum-1",
    satellite: "Serpong",
    place: SATELLITE_PLACE_SUGGESTIONS.Serpong[0],
    serviceName: "Ibadah Umum 1",
    category: "onsite dan online",
    serviceTime: "10:00 WIB",
    contactPerson: "Ibu Conny (0811-131-920)",
  },
  {
    id: "default-serpong-sekolah-minggu",
    satellite: "Serpong",
    place: SATELLITE_PLACE_SUGGESTIONS.Serpong[0],
    serviceName: "Ibadah Anak / Sekolah Minggu",
    category: "onsite dan online",
    serviceTime: "10:00 WIB",
    contactPerson: "Ibu Conny (0811-131-920)",
  },
];

export function sortWorshipSchedules(items: WorshipScheduleItem[]) {
  return [...items].sort((left, right) => {
    const satelliteComparison =
      SATELLITE_OPTIONS.indexOf(left.satellite) - SATELLITE_OPTIONS.indexOf(right.satellite);

    if (satelliteComparison !== 0) {
      return satelliteComparison;
    }

    const leftTime = normalizeTime(left.serviceTime);
    const rightTime = normalizeTime(right.serviceTime);

    if (leftTime !== rightTime) {
      return leftTime.localeCompare(rightTime);
    }

    return left.serviceName.localeCompare(right.serviceName);
  });
}

export function formatWorshipTime(time: string) {
  if (/^\d{2}:\d{2}$/.test(time)) {
    return `${time} WIB`;
  }

  return time;
}

export function getCategoryLabel(category: WorshipCategory) {
  switch (category) {
    case "onsite":
      return "On-site";
    case "online":
      return "Online";
    case "onsite dan online":
      return "On-site & Online";
    default:
      return category;
  }
}

export function getWorshipSatelliteSectionId(satellite: SatelliteOption) {
  return `worship-${satellite.toLowerCase().replace(/\s+/g, "-")}`;
}

export function isSatelliteOption(value: string): value is SatelliteOption {
  return SATELLITE_OPTIONS.includes(value as SatelliteOption);
}

function normalizeTime(time: string) {
  const match = time.match(/^(\d{2}:\d{2})/);
  return match ? match[1] : "99:99";
}
