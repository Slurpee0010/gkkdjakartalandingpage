import { useEffect, useState, type FormEvent } from "react";
import type { FirebaseError } from "firebase/app";
import { auth, db } from "../lib/firebase";
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  getRedirectResult,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type User,
} from "firebase/auth";
import { collection, addDoc, getDoc, getDocs, deleteDoc, doc, query, orderBy, setDoc, updateDoc } from "firebase/firestore";
import { Pencil, Plus, Trash2, LogIn, LogOut, Loader2, X } from "lucide-react";
import WorshipScheduleAdmin from "../components/WorshipScheduleAdmin";
import { getYoutubeEmbedUrl, getYoutubeWatchUrl, isYoutubeVideoUrl } from "../lib/youtube";

interface EventItem {
  id: number | string;
  title: string;
  date: string;
  time: string;
  location: string;
  registrationLink?: string;
}

interface ServiceItem {
  id: number | string;
  title: string;
  description: string;
}

interface OnlineWorshipVideoSetting {
  youtubeUrl: string;
  updatedAt?: string;
}

type CollectionName = "events" | "services";

const EMPTY_EVENT_FORM = { title: "", date: "", time: "", location: "", registrationLink: "" };
const EMPTY_SERVICE_FORM = { title: "", description: "" };
const EMPTY_ONLINE_WORSHIP_FORM = { youtubeUrl: "" };
const EVENT_LOCATION_OPTIONS = ["Pakuwon Tower Lantai 3", "Pakuwon Tower Lantai 2"] as const;
const OTHER_LOCATION_OPTION = "__other__";
const ONLINE_WORSHIP_VIDEO_DOC_ID = "onlineWorshipVideo";

const ADMIN_EMAILS = new Set(["gkkdjak@gmail.com"]);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

function isAdminEmail(email?: string | null) {
  return !!email && ADMIN_EMAILS.has(email.trim().toLowerCase());
}

function getAuthErrorMessage(error: unknown) {
  const firebaseError = error as FirebaseError;

  switch (firebaseError?.code) {
    case "auth/popup-closed-by-user":
      return "Popup login ditutup sebelum proses selesai.";
    case "auth/popup-blocked":
      return "Popup login diblokir oleh browser.";
    case "auth/unauthorized-domain":
      return "Domain localhost belum diizinkan di Firebase Authentication.";
    case "auth/operation-not-allowed":
      return "Google Sign-In belum diaktifkan di Firebase Authentication.";
    case "auth/operation-not-supported-in-this-environment":
      return "Browser ini tidak mendukung popup login Google.";
    default:
      return "Login Google gagal. Periksa konfigurasi Firebase Authentication lalu coba lagi.";
  }
}

function getDataErrorMessage(error: unknown, fallbackMessage: string) {
  const firebaseError = error as FirebaseError;

  switch (firebaseError?.code) {
    case "permission-denied":
      return "Akses Firestore ditolak. Pastikan rules sudah terdeploy ke database yang benar dan akun login adalah admin terverifikasi.";
    case "not-found":
      return "Dokumen yang ingin diubah sudah tidak ditemukan di Firestore.";
    case "unauthenticated":
      return "Sesi login admin tidak valid. Silakan logout lalu login kembali.";
    default:
      if (firebaseError?.code) {
        return `${fallbackMessage} (${firebaseError.code})`;
      }

      return fallbackMessage;
  }
}

function isPresetLocation(location: string) {
  return EVENT_LOCATION_OPTIONS.some((option) => option === location);
}

function getLocationOption(location: string) {
  if (!location) {
    return "";
  }

  return isPresetLocation(location) ? location : OTHER_LOCATION_OPTION;
}

function formatEventDate(date: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(`${date}T00:00:00`));
  }

  return date;
}

function formatEventTime(time: string) {
  if (/^\d{2}:\d{2}$/.test(time)) {
    return `${time} WIB`;
  }

  return time;
}

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [videoSaving, setVideoSaving] = useState(false);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [onlineWorshipVideo, setOnlineWorshipVideo] = useState<OnlineWorshipVideoSetting>(EMPTY_ONLINE_WORSHIP_FORM);
  const [activeTab, setActiveTab] = useState<"events" | "services" | "worship">("events");
  const [authError, setAuthError] = useState<string | null>(null);
  const [dataError, setDataError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [eventLocationOption, setEventLocationOption] = useState<string>("");

  const [eventForm, setEventForm] = useState(EMPTY_EVENT_FORM);
  const [serviceForm, setServiceForm] = useState(EMPTY_SERVICE_FORM);

  const hasAdminAccess = isAdminEmail(user?.email);

  const resetEventForm = () => {
    setEditingEventId(null);
    setEventForm(EMPTY_EVENT_FORM);
    setEventLocationOption("");
  };

  const resetServiceForm = () => {
    setEditingServiceId(null);
    setServiceForm(EMPTY_SERVICE_FORM);
  };

  const fetchData = async () => {
    try {
      setDataError(null);

      const [eventsSnap, servicesSnap] = await Promise.all([
        getDocs(query(collection(db, "events"), orderBy("date", "desc"))),
        getDocs(collection(db, "services")),
      ]);
      const onlineWorshipSnap = await getDoc(doc(db, "settings", ONLINE_WORSHIP_VIDEO_DOC_ID));

      setEvents(eventsSnap.docs.map((item) => ({ id: item.id, ...item.data() })) as EventItem[]);
      setServices(servicesSnap.docs.map((item) => ({ id: item.id, ...item.data() })) as ServiceItem[]);
      setOnlineWorshipVideo({
        youtubeUrl: (onlineWorshipSnap.data() as OnlineWorshipVideoSetting | undefined)?.youtubeUrl ?? "",
      });
    } catch {
      setDataError("Data admin tidak berhasil dimuat. Pastikan Firestore dan rules Firebase mengizinkan akun admin.");
    }
  };

  useEffect(() => {
    let isMounted = true;

    void setPersistence(auth, browserLocalPersistence).catch(() => {
      if (isMounted) {
        setAuthError("Sesi login tidak bisa disimpan di browser ini. Login tetap bisa dicoba.");
      }
    });

    void getRedirectResult(auth)
      .then((result) => {
        if (!isMounted || !result?.user) {
          return;
        }

        if (!isAdminEmail(result.user.email)) {
          setAuthError(`Login berhasil sebagai ${result.user.email ?? "akun Google ini"}, tetapi akun tersebut belum diberi akses admin.`);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setAuthError(getAuthErrorMessage(error));
        }
      });

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      if (!isMounted) {
        return;
      }

      setUser(nextUser);
      setLoading(false);
      setLoginLoading(false);

      if (!nextUser) {
        setDataError(null);
        return;
      }

      if (!isAdminEmail(nextUser.email)) {
        setDataError(null);
        setAuthError(`Login berhasil sebagai ${nextUser.email ?? "akun Google ini"}, tetapi akun tersebut belum diberi akses admin.`);
        return;
      }

      setAuthError(null);
      void fetchData();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const login = async () => {
    setAuthError(null);
    setLoginLoading(true);

    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      const firebaseError = error as FirebaseError;
      const shouldUseRedirect =
        firebaseError?.code === "auth/popup-blocked" ||
        firebaseError?.code === "auth/cancelled-popup-request" ||
        firebaseError?.code === "auth/operation-not-supported-in-this-environment";

      if (shouldUseRedirect) {
        try {
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (redirectError) {
          setAuthError(getAuthErrorMessage(redirectError));
        }
      } else {
        setAuthError(getAuthErrorMessage(error));
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const logout = async () => {
    setAuthError(null);
    setDataError(null);
    setSuccessMessage(null);
    await signOut(auth);
  };

  const handleSubmitEvent = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setDataError(null);
    setSuccessMessage(null);

    try {
      if (editingEventId) {
        await updateDoc(doc(db, "events", editingEventId), { ...eventForm });
        setSuccessMessage("Event berhasil diperbarui.");
      } else {
        await addDoc(collection(db, "events"), { ...eventForm, createdAt: new Date().toISOString() });
        setSuccessMessage("Event berhasil ditambahkan.");
      }

      resetEventForm();
      await fetchData();
    } catch (error) {
      setDataError(getDataErrorMessage(error, "Event gagal disimpan. Pastikan rules Firestore terbaru sudah terpasang dan akun admin memiliki akses."));
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitService = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setDataError(null);
    setSuccessMessage(null);

    try {
      if (editingServiceId) {
        await updateDoc(doc(db, "services", editingServiceId), { ...serviceForm });
        setSuccessMessage("Layanan berhasil diperbarui.");
      } else {
        await addDoc(collection(db, "services"), serviceForm);
        setSuccessMessage("Layanan berhasil ditambahkan.");
      }

      resetServiceForm();
      await fetchData();
    } catch (error) {
      setDataError(getDataErrorMessage(error, "Layanan gagal disimpan. Pastikan rules Firestore terbaru sudah terpasang dan akun admin memiliki akses."));
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitOnlineWorshipVideo = async (e: FormEvent) => {
    e.preventDefault();
    setVideoSaving(true);
    setDataError(null);
    setSuccessMessage(null);

    const trimmedUrl = onlineWorshipVideo.youtubeUrl.trim();

    if (!isYoutubeVideoUrl(trimmedUrl)) {
      setDataError("Gunakan link video YouTube yang valid agar video bisa diputar langsung di halaman Event.");
      setVideoSaving(false);
      return;
    }

    try {
      await setDoc(
        doc(db, "settings", ONLINE_WORSHIP_VIDEO_DOC_ID),
        { youtubeUrl: trimmedUrl, updatedAt: new Date().toISOString() },
        { merge: true },
      );

      setOnlineWorshipVideo({ youtubeUrl: trimmedUrl });
      setSuccessMessage("Link video ibadah online berhasil diperbarui.");
    } catch (error) {
      setDataError(
        getDataErrorMessage(
          error,
          "Link video ibadah online gagal disimpan. Pastikan rules Firestore terbaru sudah terpasang.",
        ),
      );
    } finally {
      setVideoSaving(false);
    }
  };

  const handleEditEvent = (event: EventItem) => {
    setDataError(null);
    setSuccessMessage(null);
    setEditingEventId(String(event.id));
    setEventLocationOption(getLocationOption(event.location));
    setEventForm({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      registrationLink: event.registrationLink ?? "",
    });
  };

  const handleEventLocationChange = (nextValue: string) => {
    setEventLocationOption(nextValue);

    if (nextValue === OTHER_LOCATION_OPTION) {
      setEventForm((current) => ({
        ...current,
        location: isPresetLocation(current.location) ? "" : current.location,
      }));
      return;
    }

    setEventForm((current) => ({
      ...current,
      location: nextValue,
    }));
  };

  const handleEditService = (service: ServiceItem) => {
    setDataError(null);
    setSuccessMessage(null);
    setEditingServiceId(String(service.id));
    setServiceForm({
      title: service.title,
      description: service.description,
    });
  };

  const handleDelete = async (coll: CollectionName, id: string) => {
    const itemLabel = coll === "events" ? "event" : "layanan";

    if (!window.confirm(`Hapus ${itemLabel} ini?`)) {
      return;
    }

    setDeletingKey(`${coll}:${id}`);
    setDataError(null);
    setSuccessMessage(null);

    try {
      await deleteDoc(doc(db, coll, id));

      if (coll === "events" && editingEventId === id) {
        resetEventForm();
      }

      if (coll === "services" && editingServiceId === id) {
        resetServiceForm();
      }

      setSuccessMessage(`${coll === "events" ? "Event" : "Layanan"} berhasil dihapus.`);
      await fetchData();
    } catch (error) {
      setDataError(getDataErrorMessage(error, `Gagal menghapus ${itemLabel}. Jika tombol delete tetap ditolak, deploy ulang rules Firestore terbaru.`));
    } finally {
      setDeletingKey(null);
    }
  };

  const onlineWorshipPreviewUrl = getYoutubeEmbedUrl(onlineWorshipVideo.youtubeUrl);
  const onlineWorshipWatchUrl = getYoutubeWatchUrl(onlineWorshipVideo.youtubeUrl);

  if (loading) {
    return (
      <div className="pt-32 flex justify-center">
        <Loader2 className="animate-spin text-church-gold" size={48} />
      </div>
    );
  }

  if (!user || !hasAdminAccess) {
    return (
      <div className="pt-32 pb-24 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-[2rem] border border-church-gold/10 p-8 md:p-12 text-center shadow-sm">
          <h2 className="serif text-4xl font-bold mb-6 uppercase">Admin Dashboard</h2>
          <p className="mb-4 text-church-dark/70">
            {!user
              ? "Silakan login dengan akun Google admin untuk mengelola konten gereja."
              : "Akun Google Anda sudah masuk, tetapi belum memiliki izin admin untuk dashboard ini."}
          </p>

          {user?.email && (
            <p className="mb-6 text-sm uppercase tracking-widest text-church-dark/50">
              Masuk sebagai {user.email}
            </p>
          )}

          {authError && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {authError}
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={login}
              disabled={loginLoading}
              className="bg-church-dark text-church-cream px-8 py-4 rounded-full font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-church-gold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loginLoading ? <Loader2 className="animate-spin" size={20} /> : <LogIn size={20} />}
              {loginLoading ? "Memproses Login..." : "Login with Google"}
            </button>

            {user && (
              <button
                onClick={logout}
                className="border border-church-dark/15 text-church-dark px-8 py-4 rounded-full font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:border-red-200 hover:text-red-500 transition-colors"
              >
                <LogOut size={20} /> Logout
              </button>
            )}
          </div>

          <p className="mt-6 text-sm text-church-dark/50">
            Jika popup diblokir browser, login akan dialihkan ke halaman Google secara otomatis.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="serif text-4xl font-bold uppercase">CMS Dashboard</h2>
          <p className="text-sm uppercase tracking-widest text-church-dark/50 mt-2">{user.email}</p>
        </div>
        <button onClick={logout} className="text-church-dark/60 hover:text-red-500 flex items-center gap-2 uppercase text-sm font-bold tracking-widest">
          <LogOut size={18} /> Logout
        </button>
      </div>

      {dataError && (
        <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {dataError}
        </div>
      )}

      {successMessage && (
        <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      )}

      <div className="flex gap-8 mb-12 border-b border-church-gold/20">
        <button
          onClick={() => setActiveTab("events")}
          className={`pb-4 uppercase text-sm font-bold tracking-widest transition-colors ${activeTab === "events" ? "text-church-gold border-b-2 border-church-gold" : "text-church-dark/40"}`}
        >
          Events & Jadwal
        </button>
        <button
          onClick={() => setActiveTab("services")}
          className={`pb-4 uppercase text-sm font-bold tracking-widest transition-colors ${activeTab === "services" ? "text-church-gold border-b-2 border-church-gold" : "text-church-dark/40"}`}
        >
          Layanan
        </button>
        <button
          onClick={() => setActiveTab("worship")}
          className={`pb-4 uppercase text-sm font-bold tracking-widest transition-colors ${activeTab === "worship" ? "text-church-gold border-b-2 border-church-gold" : "text-church-dark/40"}`}
        >
          Jadwal Ibadah
        </button>
      </div>

      {activeTab === "events" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-6">
            <form onSubmit={handleSubmitEvent} className="bg-white p-8 rounded-3xl border border-church-gold/10 space-y-6">
              <div className="flex items-start justify-between gap-4">
                <h3 className="serif text-xl font-bold uppercase mb-4">{editingEventId ? "Edit Event" : "Tambah Event"}</h3>
                {editingEventId && (
                  <button
                    type="button"
                    onClick={resetEventForm}
                    className="text-sm uppercase tracking-widest text-church-dark/50 hover:text-church-dark flex items-center gap-2"
                  >
                    <X size={16} /> Batal
                  </button>
                )}
              </div>
              <input
                placeholder="Judul Event"
                className="w-full border-b border-church-gold/20 py-2 focus:outline-none focus:border-church-gold"
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                required
              />
              <input
                type="date"
                className="w-full border-b border-church-gold/20 py-2 focus:outline-none focus:border-church-gold"
                value={eventForm.date}
                onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                required
              />
              <input
                type="time"
                className="w-full border-b border-church-gold/20 py-2 focus:outline-none focus:border-church-gold"
                value={eventForm.time}
                onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                required
              />
              <select
                className="w-full border-b border-church-gold/20 py-2 bg-transparent focus:outline-none focus:border-church-gold"
                value={eventLocationOption}
                onChange={(e) => handleEventLocationChange(e.target.value)}
                required
              >
                <option value="" disabled>
                  Pilih lokasi
                </option>
                {EVENT_LOCATION_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
                <option value={OTHER_LOCATION_OPTION}>Lainnya</option>
              </select>
              {eventLocationOption === OTHER_LOCATION_OPTION && (
                <input
                  placeholder="Tulis lokasi lainnya"
                  className="w-full border-b border-church-gold/20 py-2 focus:outline-none focus:border-church-gold"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  required
                />
              )}
              <input
                type="url"
                placeholder="Upload Link Pendaftaran"
                className="w-full border-b border-church-gold/20 py-2 focus:outline-none focus:border-church-gold"
                value={eventForm.registrationLink}
                onChange={(e) => setEventForm({ ...eventForm, registrationLink: e.target.value })}
                required
              />
              <button
                disabled={saving}
                className="w-full bg-church-gold text-church-cream py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                {saving ? "Menyimpan..." : editingEventId ? "Update Event" : "Simpan Event"}
              </button>
            </form>

            <form onSubmit={handleSubmitOnlineWorshipVideo} className="bg-white p-8 rounded-3xl border border-church-gold/10 space-y-6">
              <div>
                <h3 className="serif text-xl font-bold uppercase mb-2">Video Ibadah Online</h3>
                <p className="text-sm leading-relaxed text-church-dark/60">
                  Tempel link video YouTube ibadah mingguan di sini. Halaman Event akan otomatis memakai link terbaru ini.
                </p>
              </div>

              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full border-b border-church-gold/20 py-2 focus:outline-none focus:border-church-gold"
                value={onlineWorshipVideo.youtubeUrl}
                onChange={(e) => setOnlineWorshipVideo({ youtubeUrl: e.target.value })}
                required
              />

              {onlineWorshipWatchUrl && (
                <div className="rounded-2xl bg-church-cream p-4 border border-church-gold/10">
                  <p className="text-xs uppercase tracking-[0.22em] text-church-dark/40 mb-3">Preview Link Aktif</p>
                  <a
                    href={onlineWorshipWatchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-church-gold hover:text-church-dark break-all"
                  >
                    {onlineWorshipWatchUrl}
                  </a>
                  <p className="mt-3 text-sm text-church-dark/55">
                    {onlineWorshipPreviewUrl
                      ? "Video ini siap diputar langsung di menu Event."
                      : "Gunakan link video YouTube yang valid agar iframe video bisa tampil di halaman Event."}
                  </p>
                </div>
              )}

              <button
                disabled={videoSaving}
                className="w-full bg-church-dark text-church-cream py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:bg-church-gold transition-colors"
              >
                {videoSaving ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                {videoSaving ? "Menyimpan..." : "Simpan Link Video"}
              </button>
            </form>
          </div>
          <div className="lg:col-span-2 space-y-4">
            {events.map((event) => (
              <div key={event.id} className="bg-white p-6 rounded-2xl border border-church-gold/10 flex justify-between items-center">
                <div>
                  <h4 className="font-bold uppercase tracking-tight">{event.title}</h4>
                  <p className="text-sm text-church-dark/60">{formatEventDate(event.date)} - {formatEventTime(event.time)}</p>
                  <a
                    href={event.registrationLink || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-2 inline-block text-sm font-medium ${event.registrationLink ? "text-church-gold hover:text-church-dark" : "pointer-events-none text-church-dark/40"}`}
                  >
                    {event.registrationLink ? "Buka link pendaftaran" : "Link pendaftaran belum diisi"}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleEditEvent(event)}
                    className="text-church-dark/60 hover:bg-church-gold/10 hover:text-church-gold p-2 rounded-lg transition-colors"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    type="button"
                    disabled={deletingKey === `events:${String(event.id)}`}
                    onClick={() => handleDelete("events", String(event.id))}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {deletingKey === `events:${String(event.id)}` ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === "services" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <form onSubmit={handleSubmitService} className="bg-white p-8 rounded-3xl border border-church-gold/10 space-y-6">
              <div className="flex items-start justify-between gap-4">
                <h3 className="serif text-xl font-bold uppercase mb-4">{editingServiceId ? "Edit Layanan" : "Tambah Layanan"}</h3>
                {editingServiceId && (
                  <button
                    type="button"
                    onClick={resetServiceForm}
                    className="text-sm uppercase tracking-widest text-church-dark/50 hover:text-church-dark flex items-center gap-2"
                  >
                    <X size={16} /> Batal
                  </button>
                )}
              </div>
              <input
                placeholder="Nama Layanan"
                className="w-full border-b border-church-gold/20 py-2 focus:outline-none focus:border-church-gold"
                value={serviceForm.title}
                onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Deskripsi"
                className="w-full border-b border-church-gold/20 py-2 focus:outline-none focus:border-church-gold resize-none"
                rows={3}
                value={serviceForm.description}
                onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                required
              />
              <button
                disabled={saving}
                className="w-full bg-church-gold text-church-cream py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                {saving ? "Menyimpan..." : editingServiceId ? "Update Layanan" : "Simpan Layanan"}
              </button>
            </form>
          </div>
          <div className="lg:col-span-2 space-y-4">
            {services.map((service) => (
              <div key={service.id} className="bg-white p-6 rounded-2xl border border-church-gold/10 flex justify-between items-center">
                <div>
                  <h4 className="font-bold uppercase tracking-tight">{service.title}</h4>
                  <p className="text-sm text-church-dark/60 line-clamp-1">{service.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleEditService(service)}
                    className="text-church-dark/60 hover:bg-church-gold/10 hover:text-church-gold p-2 rounded-lg transition-colors"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    type="button"
                    disabled={deletingKey === `services:${String(service.id)}`}
                    onClick={() => handleDelete("services", String(service.id))}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {deletingKey === `services:${String(service.id)}` ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <WorshipScheduleAdmin />
      )}
    </div>
  );
}
