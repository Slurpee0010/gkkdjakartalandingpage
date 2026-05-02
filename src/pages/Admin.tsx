import { useEffect, useState, type FormEvent } from "react";
import type { FirebaseError } from "firebase/app";
import { auth, db } from "../lib/firebase";
import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { Loader2, LogIn, LogOut, Pencil, Plus, ShieldCheck, Trash2, X } from "lucide-react";
import WorshipScheduleAdmin from "../components/WorshipScheduleAdmin";
import AppButton from "../components/ui/AppButton";
import {
  ADMIN_USERS_COLLECTION,
  DEFAULT_SUPERADMIN_EMAIL,
  type AdminUserProfile,
  createEmailPasswordUser,
  fetchAdminProfile,
  getAdminProvisionErrorMessage,
  hasAdminAccess,
  isSuperadminProfile,
  normalizeAdminEmail,
  upsertAdminProfile,
} from "../lib/adminAuth";
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

interface AdminUserListItem extends AdminUserProfile {
  id: string;
}

type CollectionName = "events" | "services";

const EMPTY_EVENT_FORM = { title: "", date: "", time: "", location: "", registrationLink: "" };
const EMPTY_SERVICE_FORM = { title: "", description: "" };
const EMPTY_ONLINE_WORSHIP_FORM = { youtubeUrl: "" };
const EMPTY_LOGIN_FORM = { email: "", password: "" };
const EMPTY_ADMIN_USER_FORM = { email: "", password: "" };
const EVENT_LOCATION_OPTIONS = ["Pakuwon Tower Lantai 3", "Pakuwon Tower Lantai 2"] as const;
const OTHER_LOCATION_OPTION = "__other__";
const ONLINE_WORSHIP_VIDEO_DOC_ID = "onlineWorshipVideo";

function getAuthErrorMessage(error: unknown) {
  const firebaseError = error as FirebaseError;

  switch (firebaseError?.code) {
    case "auth/invalid-email":
      return "Format email tidak valid.";
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Email atau password salah.";
    case "auth/user-disabled":
      return "Akun ini sedang dinonaktifkan.";
    case "auth/operation-not-allowed":
      return "Email/password belum diaktifkan di Firebase Authentication.";
    case "auth/too-many-requests":
      return "Terlalu banyak percobaan login. Coba lagi beberapa saat lagi.";
    case "auth/network-request-failed":
      return "Koneksi ke Firebase gagal. Cek internet lalu coba lagi.";
    default:
      return "Login admin gagal. Periksa konfigurasi Firebase Authentication lalu coba lagi.";
  }
}

function getDataErrorMessage(error: unknown, fallbackMessage: string) {
  const firebaseError = error as FirebaseError;

  switch (firebaseError?.code) {
    case "permission-denied":
      return "Akses Firestore ditolak. Pastikan rules sudah terdeploy ke database yang benar dan akun login memiliki role admin atau superadmin.";
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
  const [adminProfile, setAdminProfile] = useState<AdminUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [videoSaving, setVideoSaving] = useState(false);
  const [adminSaving, setAdminSaving] = useState(false);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUserListItem[]>([]);
  const [onlineWorshipVideo, setOnlineWorshipVideo] = useState<OnlineWorshipVideoSetting>(EMPTY_ONLINE_WORSHIP_FORM);
  const [activeTab, setActiveTab] = useState<"events" | "services" | "worship" | "users">("events");
  const [authError, setAuthError] = useState<string | null>(null);
  const [dataError, setDataError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [eventLocationOption, setEventLocationOption] = useState<string>("");
  const [loginForm, setLoginForm] = useState(EMPTY_LOGIN_FORM);
  const [adminUserForm, setAdminUserForm] = useState(EMPTY_ADMIN_USER_FORM);
  const [eventForm, setEventForm] = useState(EMPTY_EVENT_FORM);
  const [serviceForm, setServiceForm] = useState(EMPTY_SERVICE_FORM);

  const canAccessAdmin = hasAdminAccess(adminProfile);
  const isSuperadmin = isSuperadminProfile(adminProfile);

  const resetEventForm = () => {
    setEditingEventId(null);
    setEventForm(EMPTY_EVENT_FORM);
    setEventLocationOption("");
  };

  const resetServiceForm = () => {
    setEditingServiceId(null);
    setServiceForm(EMPTY_SERVICE_FORM);
  };

  const resetAdminUserForm = () => {
    setAdminUserForm(EMPTY_ADMIN_USER_FORM);
  };

  const fetchData = async (nextAdminProfile: AdminUserProfile | null = adminProfile) => {
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

      if (isSuperadminProfile(nextAdminProfile)) {
        const adminUsersSnap = await getDocs(query(collection(db, ADMIN_USERS_COLLECTION), orderBy("createdAt", "desc")));
        const items = adminUsersSnap.docs.map((item) => ({ id: item.id, ...item.data() })) as AdminUserListItem[];

        setAdminUsers(
          [...items].sort((left, right) => {
            if (left.role !== right.role) {
              return left.role === "superadmin" ? -1 : 1;
            }

            return right.createdAt.localeCompare(left.createdAt);
          }),
        );
      } else {
        setAdminUsers([]);
      }
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

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      if (!isMounted) {
        return;
      }

      void (async () => {
        setUser(nextUser);
        setLoginLoading(false);

        if (!nextUser) {
          setAdminProfile(null);
          setAdminUsers([]);
          setDataError(null);
          setLoading(false);
          return;
        }

        try {
          const normalizedUserEmail = normalizeAdminEmail(nextUser.email ?? "");
          let profile = await fetchAdminProfile(nextUser.uid);

          if (!profile && normalizedUserEmail === DEFAULT_SUPERADMIN_EMAIL) {
            const bootstrapProfile: AdminUserProfile = {
              email: normalizedUserEmail,
              role: "superadmin",
              createdAt: new Date().toISOString(),
            };

            await upsertAdminProfile(nextUser.uid, bootstrapProfile);
            profile = bootstrapProfile;
            setSuccessMessage("Superadmin awal berhasil diaktifkan.");
          }

          if (!isMounted) {
            return;
          }

          setAdminProfile(profile);

          if (!hasAdminAccess(profile)) {
            setDataError(null);
            setAuthError(`Login berhasil sebagai ${nextUser.email ?? "akun ini"}, tetapi role admin belum terdaftar di Firestore.`);
            setLoading(false);
            return;
          }

          setAuthError(null);
          await fetchData(profile);
        } catch {
          if (isMounted) {
            setDataError("Profil admin tidak berhasil dimuat. Pastikan rules Firestore terbaru sudah terpasang.");
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      })();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (activeTab === "users" && !isSuperadmin) {
      setActiveTab("events");
    }
  }, [activeTab, isSuperadmin]);

  const login = async (event: FormEvent) => {
    event.preventDefault();
    setAuthError(null);
    setSuccessMessage(null);
    setLoginLoading(true);

    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, normalizeAdminEmail(loginForm.email), loginForm.password);
    } catch (error) {
      setAuthError(getAuthErrorMessage(error));
      setLoginLoading(false);
    } finally {
      setLoginForm((current) => ({ ...current, password: "" }));
    }
  };

  const logout = async () => {
    setAuthError(null);
    setDataError(null);
    setSuccessMessage(null);
    setAdminProfile(null);
    setAdminUsers([]);
    setLoginForm(EMPTY_LOGIN_FORM);
    await signOut(auth);
  };

  const handleSubmitEvent = async (event: FormEvent) => {
    event.preventDefault();
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

  const handleSubmitService = async (event: FormEvent) => {
    event.preventDefault();
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

  const handleSubmitOnlineWorshipVideo = async (event: FormEvent) => {
    event.preventDefault();
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

  const handleSubmitAdminUser = async (event: FormEvent) => {
    event.preventDefault();

    if (!user || !isSuperadmin) {
      setDataError("Hanya superadmin yang bisa membuat akun admin baru.");
      return;
    }

    const email = normalizeAdminEmail(adminUserForm.email);
    const password = adminUserForm.password;

    if (!email) {
      setDataError("Email admin wajib diisi.");
      return;
    }

    if (password.trim().length < 6) {
      setDataError("Password admin minimal 6 karakter.");
      return;
    }

    if (adminUsers.some((item) => item.email === email && item.role === "superadmin")) {
      setDataError("Email tersebut sudah dipakai sebagai superadmin dan tidak bisa ditimpa menjadi admin.");
      return;
    }

    setAdminSaving(true);
    setDataError(null);
    setSuccessMessage(null);

    try {
      const createdUser = await createEmailPasswordUser(email, password);

      await upsertAdminProfile(createdUser.localId, {
        email,
        role: "admin",
        createdAt: new Date().toISOString(),
        createdBy: user.uid,
      });

      resetAdminUserForm();
      setSuccessMessage(`Akun admin ${email} berhasil dibuat atau disinkronkan.`);
      await fetchData(adminProfile);
    } catch (error) {
      setDataError(getAdminProvisionErrorMessage(error));
    } finally {
      setAdminSaving(false);
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

  const handleDelete = async (collectionName: CollectionName, id: string) => {
    const itemLabel = collectionName === "events" ? "event" : "layanan";

    if (!window.confirm(`Hapus ${itemLabel} ini?`)) {
      return;
    }

    setDeletingKey(`${collectionName}:${id}`);
    setDataError(null);
    setSuccessMessage(null);

    try {
      await deleteDoc(doc(db, collectionName, id));

      if (collectionName === "events" && editingEventId === id) {
        resetEventForm();
      }

      if (collectionName === "services" && editingServiceId === id) {
        resetServiceForm();
      }

      setSuccessMessage(`${collectionName === "events" ? "Event" : "Layanan"} berhasil dihapus.`);
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

  if (!user || !canAccessAdmin) {
    return (
      <div className="pt-32 pb-24 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-[2rem] border border-church-gold/10 p-8 md:p-12 text-center shadow-sm">
          <h2 className="serif text-4xl font-bold mb-6 uppercase">Admin Dashboard</h2>
          <p className="mb-4 text-church-dark/70">
            {!user
              ? "Silakan login dengan email dan password admin untuk mengelola konten gereja."
              : "Akun Anda sudah masuk, tetapi belum memiliki role admin untuk dashboard ini."}
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

          {!user && (
            <form onSubmit={login} className="max-w-md mx-auto space-y-5 text-left">
              <div>
                <label htmlFor="admin-email" className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-church-dark/50">
                  Email Admin
                </label>
                <input
                  id="admin-email"
                  type="email"
                  placeholder="admin@gkkdjakarta.org"
                  className="w-full rounded-2xl border border-church-gold/15 px-5 py-4 focus:outline-none focus:border-church-gold"
                  value={loginForm.email}
                  onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
                  autoComplete="username"
                  required
                />
              </div>

              <div>
                <label htmlFor="admin-password" className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-church-dark/50">
                  Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  placeholder="Masukkan password admin"
                  className="w-full rounded-2xl border border-church-gold/15 px-5 py-4 focus:outline-none focus:border-church-gold"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                  autoComplete="current-password"
                  required
                />
              </div>

              <AppButton
                type="submit"
                disabled={loginLoading}
                className="w-full bg-church-dark text-church-cream px-8 py-4 rounded-full font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-church-gold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loginLoading ? <Loader2 className="animate-spin" size={20} /> : <LogIn size={20} />}
                {loginLoading ? "Memproses Login..." : "Login Admin"}
              </AppButton>
            </form>
          )}

          {user && (
            <div className="flex justify-center">
              <AppButton
                type="button"
                onClick={logout}
                className="border border-church-dark/15 text-church-dark px-8 py-4 rounded-full font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:border-red-200 hover:text-red-500 transition-colors"
              >
                <LogOut size={20} /> Logout
              </AppButton>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="serif text-4xl font-bold uppercase">CMS Dashboard</h2>
          <p className="text-sm uppercase tracking-widest text-church-dark/50 mt-2">
            {user.email} | {isSuperadmin ? "Superadmin" : "Admin"}
          </p>
        </div>
        <AppButton type="button" onClick={logout} className="text-church-dark/60 hover:text-red-500 flex items-center gap-2 uppercase text-sm font-bold tracking-widest">
          <LogOut size={18} /> Logout
        </AppButton>
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
        <AppButton
          type="button"
          buttonMotion="nav"
          active={activeTab === "events"}
          onClick={() => setActiveTab("events")}
          className={`pb-4 uppercase text-sm font-bold tracking-widest transition-colors ${activeTab === "events" ? "text-church-gold border-b-2 border-church-gold" : "text-church-dark/40"}`}
        >
          Events & Jadwal
        </AppButton>
        <AppButton
          type="button"
          buttonMotion="nav"
          active={activeTab === "services"}
          onClick={() => setActiveTab("services")}
          className={`pb-4 uppercase text-sm font-bold tracking-widest transition-colors ${activeTab === "services" ? "text-church-gold border-b-2 border-church-gold" : "text-church-dark/40"}`}
        >
          Layanan
        </AppButton>
        <AppButton
          type="button"
          buttonMotion="nav"
          active={activeTab === "worship"}
          onClick={() => setActiveTab("worship")}
          className={`pb-4 uppercase text-sm font-bold tracking-widest transition-colors ${activeTab === "worship" ? "text-church-gold border-b-2 border-church-gold" : "text-church-dark/40"}`}
        >
          Jadwal Ibadah
        </AppButton>
        {isSuperadmin && (
          <AppButton
            type="button"
            buttonMotion="nav"
            active={activeTab === "users"}
            onClick={() => setActiveTab("users")}
            className={`pb-4 uppercase text-sm font-bold tracking-widest transition-colors ${activeTab === "users" ? "text-church-gold border-b-2 border-church-gold" : "text-church-dark/40"}`}
          >
            User Admin
          </AppButton>
        )}
      </div>

      {activeTab === "events" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-6">
            <form onSubmit={handleSubmitEvent} className="bg-white p-8 rounded-3xl border border-church-gold/10 space-y-6">
              <div className="flex items-start justify-between gap-4">
                <h3 className="serif text-xl font-bold uppercase mb-4">{editingEventId ? "Edit Event" : "Tambah Event"}</h3>
                {editingEventId && (
                  <AppButton
                    type="button"
                    onClick={resetEventForm}
                    className="text-sm uppercase tracking-widest text-church-dark/50 hover:text-church-dark flex items-center gap-2"
                  >
                    <X size={16} /> Batal
                  </AppButton>
                )}
              </div>
              <input
                placeholder="Judul Event"
                className="w-full border-b border-church-gold/20 py-2 focus:outline-none focus:border-church-gold"
                value={eventForm.title}
                onChange={(event) => setEventForm({ ...eventForm, title: event.target.value })}
                required
              />
              <input
                type="date"
                className="w-full border-b border-church-gold/20 py-2 focus:outline-none focus:border-church-gold"
                value={eventForm.date}
                onChange={(event) => setEventForm({ ...eventForm, date: event.target.value })}
                required
              />
              <input
                type="time"
                className="w-full border-b border-church-gold/20 py-2 focus:outline-none focus:border-church-gold"
                value={eventForm.time}
                onChange={(event) => setEventForm({ ...eventForm, time: event.target.value })}
                required
              />
              <select
                className="w-full border-b border-church-gold/20 py-2 bg-transparent focus:outline-none focus:border-church-gold"
                value={eventLocationOption}
                onChange={(event) => handleEventLocationChange(event.target.value)}
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
                  onChange={(event) => setEventForm({ ...eventForm, location: event.target.value })}
                  required
                />
              )}
              <input
                type="url"
                placeholder="Upload Link Pendaftaran"
                className="w-full border-b border-church-gold/20 py-2 focus:outline-none focus:border-church-gold"
                value={eventForm.registrationLink}
                onChange={(event) => setEventForm({ ...eventForm, registrationLink: event.target.value })}
                required
              />
              <AppButton
                type="submit"
                disabled={saving}
                className="w-full bg-church-gold text-church-cream py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                {saving ? "Menyimpan..." : editingEventId ? "Update Event" : "Simpan Event"}
              </AppButton>
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
                onChange={(event) => setOnlineWorshipVideo({ youtubeUrl: event.target.value })}
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

              <AppButton
                type="submit"
                disabled={videoSaving}
                className="w-full bg-church-dark text-church-cream py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:bg-church-gold transition-colors"
              >
                {videoSaving ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                {videoSaving ? "Menyimpan..." : "Simpan Link Video"}
              </AppButton>
            </form>
          </div>
          <div className="lg:col-span-2 space-y-4">
            {events.map((event) => (
              <div key={event.id} className="bg-white p-6 rounded-2xl border border-church-gold/10 flex justify-between items-center">
                <div>
                  <h4 className="font-bold uppercase tracking-tight">{event.title}</h4>
                  <p className="text-sm text-church-dark/60">
                    {formatEventDate(event.date)} - {formatEventTime(event.time)}
                  </p>
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
                  <AppButton
                    type="button"
                    buttonMotion="icon"
                    onClick={() => handleEditEvent(event)}
                    className="text-church-dark/60 hover:bg-church-gold/10 hover:text-church-gold p-2 rounded-lg transition-colors"
                  >
                    <Pencil size={18} />
                  </AppButton>
                  <AppButton
                    type="button"
                    buttonMotion="icon"
                    disabled={deletingKey === `events:${String(event.id)}`}
                    onClick={() => handleDelete("events", String(event.id))}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {deletingKey === `events:${String(event.id)}` ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
                  </AppButton>
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
                  <AppButton
                    type="button"
                    onClick={resetServiceForm}
                    className="text-sm uppercase tracking-widest text-church-dark/50 hover:text-church-dark flex items-center gap-2"
                  >
                    <X size={16} /> Batal
                  </AppButton>
                )}
              </div>
              <input
                placeholder="Nama Layanan"
                className="w-full border-b border-church-gold/20 py-2 focus:outline-none focus:border-church-gold"
                value={serviceForm.title}
                onChange={(event) => setServiceForm({ ...serviceForm, title: event.target.value })}
                required
              />
              <textarea
                placeholder="Deskripsi"
                className="w-full border-b border-church-gold/20 py-2 focus:outline-none focus:border-church-gold resize-none"
                rows={3}
                value={serviceForm.description}
                onChange={(event) => setServiceForm({ ...serviceForm, description: event.target.value })}
                required
              />
              <AppButton
                type="submit"
                disabled={saving}
                className="w-full bg-church-gold text-church-cream py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                {saving ? "Menyimpan..." : editingServiceId ? "Update Layanan" : "Simpan Layanan"}
              </AppButton>
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
                  <AppButton
                    type="button"
                    buttonMotion="icon"
                    onClick={() => handleEditService(service)}
                    className="text-church-dark/60 hover:bg-church-gold/10 hover:text-church-gold p-2 rounded-lg transition-colors"
                  >
                    <Pencil size={18} />
                  </AppButton>
                  <AppButton
                    type="button"
                    buttonMotion="icon"
                    disabled={deletingKey === `services:${String(service.id)}`}
                    onClick={() => handleDelete("services", String(service.id))}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {deletingKey === `services:${String(service.id)}` ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
                  </AppButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === "worship" ? (
        <WorshipScheduleAdmin />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] gap-12">
          <div>
            <form onSubmit={handleSubmitAdminUser} className="bg-white p-8 rounded-3xl border border-church-gold/10 space-y-6">
              <div>
                <h3 className="serif text-xl font-bold uppercase mb-2">Tambah Admin</h3>
                <p className="text-sm leading-relaxed text-church-dark/60">
                  Superadmin bisa membuat akun baru berbasis email dan password, lalu langsung memberi role admin.
                </p>
              </div>

              <input
                type="email"
                placeholder="email-admin@domain.com"
                className="w-full border-b border-church-gold/20 py-2 focus:outline-none focus:border-church-gold"
                value={adminUserForm.email}
                onChange={(event) => setAdminUserForm((current) => ({ ...current, email: event.target.value }))}
                required
              />
              <input
                type="password"
                placeholder="Password sementara admin"
                className="w-full border-b border-church-gold/20 py-2 focus:outline-none focus:border-church-gold"
                value={adminUserForm.password}
                onChange={(event) => setAdminUserForm((current) => ({ ...current, password: event.target.value }))}
                minLength={6}
                required
              />

              <p className="text-xs leading-relaxed text-church-dark/50">
                Gunakan password sementara minimal 6 karakter. Jika email sudah ada di Firebase Authentication, isi password akun yang benar untuk sinkronisasi role admin.
              </p>

              <AppButton
                type="submit"
                disabled={adminSaving}
                className="w-full bg-church-dark text-church-cream py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:bg-church-gold transition-colors"
              >
                {adminSaving ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
                {adminSaving ? "Menyimpan..." : "Buat Admin"}
              </AppButton>
            </form>
          </div>

          <div className="space-y-4">
            {adminUsers.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-church-gold/10 text-center text-church-dark/55">
                Belum ada user admin yang tersimpan.
              </div>
            ) : (
              adminUsers.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-2xl border border-church-gold/10 flex justify-between items-center gap-4">
                  <div>
                    <p className="font-bold uppercase tracking-tight">{item.email}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.22em] text-church-gold">
                      {item.role === "superadmin" ? "Superadmin" : "Admin"}
                    </p>
                    {item.createdAt && (
                      <p className="mt-3 text-sm text-church-dark/50">
                        Dibuat {new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.createdAt))}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
