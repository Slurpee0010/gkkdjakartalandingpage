import { useEffect, useState, type FormEvent } from "react";
import type { FirebaseError } from "firebase/app";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { Loader2, MapPinned, Pencil, Plus, Trash2, X } from "lucide-react";
import { db } from "../lib/firebase";
import {
  DEFAULT_WORSHIP_SCHEDULES,
  SATELLITE_LOCAL_IMAGES,
  SATELLITE_OPTIONS,
  SATELLITE_PLACE_SUGGESTIONS,
  WORSHIP_CATEGORY_OPTIONS,
  formatWorshipTime,
  getCategoryLabel,
  sortWorshipSchedules,
  type SatelliteOption,
  type WorshipCategory,
  type WorshipScheduleItem,
} from "../lib/worshipSchedules";
import AppButton from "./ui/AppButton";

type WorshipFormState = {
  satellite: SatelliteOption | "";
  place: string;
  serviceName: string;
  category: WorshipCategory | "";
  serviceTime: string;
  contactPerson: string;
};

const EMPTY_FORM: WorshipFormState = {
  satellite: "",
  place: "",
  serviceName: "",
  category: "",
  serviceTime: "",
  contactPerson: "",
};

function getDataErrorMessage(error: unknown, fallbackMessage: string) {
  const firebaseError = error as FirebaseError;

  switch (firebaseError?.code) {
    case "permission-denied":
      return "Akses Firestore ditolak. Pastikan rules Firestore untuk jadwal ibadah sudah terdeploy dan akun Anda adalah admin.";
    default:
      if (firebaseError?.code) {
        return `${fallbackMessage} (${firebaseError.code})`;
      }

      return fallbackMessage;
  }
}

function extractTimeValue(time: string) {
  const match = time.match(/^(\d{2}:\d{2})/);
  return match ? match[1] : "";
}

export default function WorshipScheduleAdmin() {
  const [schedules, setSchedules] = useState<WorshipScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<WorshipFormState>(EMPTY_FORM);
  const [dataError, setDataError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchSchedules = async () => {
    try {
      setDataError(null);
      const snapshot = await getDocs(collection(db, "worshipSchedules"));
      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as WorshipScheduleItem[];

      setSchedules(sortWorshipSchedules(data));
    } catch (error) {
      setDataError(getDataErrorMessage(error, "Data jadwal ibadah tidak berhasil dimuat."));
    }
  };

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const snapshot = await getDocs(collection(db, "worshipSchedules"));

        if (!isMounted) {
          return;
        }

        const data = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as WorshipScheduleItem[];

        setSchedules(sortWorshipSchedules(data));
      } catch (error) {
        if (isMounted) {
          setDataError(getDataErrorMessage(error, "Data jadwal ibadah tidak berhasil dimuat."));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  const placeSuggestions =
    form.satellite === ""
      ? []
      : Array.from(
          new Set([
            ...SATELLITE_PLACE_SUGGESTIONS[form.satellite],
            ...schedules.filter((item) => item.satellite === form.satellite).map((item) => item.place),
          ]),
        );

  const resetForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setSaving(true);
    setDataError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        satellite: form.satellite,
        place: form.place,
        serviceName: form.serviceName,
        category: form.category,
        serviceTime: form.serviceTime,
        contactPerson: form.contactPerson,
        createdAt: new Date().toISOString(),
      };

      if (editingId) {
        await updateDoc(doc(db, "worshipSchedules", editingId), payload);
        setSuccessMessage("Jadwal ibadah berhasil diperbarui.");
      } else {
        await addDoc(collection(db, "worshipSchedules"), payload);
        setSuccessMessage("Jadwal ibadah berhasil ditambahkan.");
      }

      resetForm();
      await fetchSchedules();
    } catch (error) {
      setDataError(getDataErrorMessage(error, "Jadwal ibadah gagal disimpan."));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: WorshipScheduleItem) => {
    setDataError(null);
    setSuccessMessage(null);
    setEditingId(item.id);
    setForm({
      satellite: item.satellite,
      place: item.place,
      serviceName: item.serviceName,
      category: item.category,
      serviceTime: extractTimeValue(item.serviceTime),
      contactPerson: item.contactPerson,
    });
  };

  const handleDelete = async (item: WorshipScheduleItem) => {
    if (!window.confirm("Hapus jadwal ibadah ini?")) {
      return;
    }

    setDeletingId(item.id);
    setDataError(null);
    setSuccessMessage(null);

    try {
      await deleteDoc(doc(db, "worshipSchedules", item.id));

      if (editingId === item.id) {
        resetForm();
      }

      setSuccessMessage("Jadwal ibadah berhasil dihapus.");
      await fetchSchedules();
    } catch (error) {
      setDataError(getDataErrorMessage(error, "Jadwal ibadah gagal dihapus."));
    } finally {
      setDeletingId(null);
    }
  };

  const seedDefaults = async () => {
    if (!window.confirm("Muat data awal jadwal ibadah ke Firebase?")) {
      return;
    }

    setSeeding(true);
    setDataError(null);
    setSuccessMessage(null);

    try {
      const batch = writeBatch(db);

      DEFAULT_WORSHIP_SCHEDULES.forEach((item) => {
        const nextRef = doc(collection(db, "worshipSchedules"));
        batch.set(nextRef, {
          satellite: item.satellite,
          place: item.place,
          serviceName: item.serviceName,
          category: item.category,
          serviceTime: item.serviceTime,
          contactPerson: item.contactPerson,
          createdAt: new Date().toISOString(),
        });
      });

      await batch.commit();
      setSuccessMessage("Data awal jadwal ibadah berhasil dimuat ke Firebase.");
      await fetchSchedules();
    } catch (error) {
      setDataError(getDataErrorMessage(error, "Data awal jadwal ibadah gagal dimuat ke Firebase."));
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.4fr] gap-10">
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-church-gold/10 bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h3 className="serif text-2xl font-bold uppercase">{editingId ? "Edit Jadwal Ibadah" : "Tambah Jadwal Ibadah"}</h3>
              <p className="mt-2 text-sm text-church-dark/55">
                Kelola daftar ibadah mingguan yang tampil di menu Jadwal Ibadah.
              </p>
            </div>
            {editingId && (
              <AppButton
                type="button"
                onClick={resetForm}
                className="text-sm uppercase tracking-widest text-church-dark/50 hover:text-church-dark flex items-center gap-2"
              >
                <X size={16} /> Batal
              </AppButton>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <select
              className="w-full border-b border-church-gold/20 py-3 bg-transparent focus:outline-none focus:border-church-gold"
              value={form.satellite}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  satellite: event.target.value as SatelliteOption | "",
                  place:
                    current.satellite !== event.target.value &&
                    current.satellite !== "" &&
                    placeSuggestions.includes(current.place)
                      ? ""
                      : current.place,
                }))
              }
              required
            >
              <option value="" disabled>
                Gereja Satelit
              </option>
              {SATELLITE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <div>
              <input
                list="worship-place-options"
                placeholder="Tempat Ibadah"
                className="w-full border-b border-church-gold/20 py-3 focus:outline-none focus:border-church-gold"
                value={form.place}
                onChange={(event) => setForm((current) => ({ ...current, place: event.target.value }))}
                required
              />
              <datalist id="worship-place-options">
                {placeSuggestions.map((option) => (
                  <option key={option} value={option} />
                ))}
              </datalist>
              <p className="mt-2 text-xs text-church-dark/45">
                Place picker menampilkan saran lokasi berdasarkan gereja satelit yang dipilih.
              </p>
            </div>

            {form.satellite && (
              <div className="rounded-[1.7rem] border border-church-gold/10 bg-church-cream/60 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-church-dark/65 mb-2">
                  Gambar Tempat Ibadah
                </p>
                <p className="text-sm text-church-gold font-medium">
                  Path aktif: {SATELLITE_LOCAL_IMAGES[form.satellite]}
                </p>
              </div>
            )}

            <input
              placeholder="Nama Ibadah"
              className="w-full border-b border-church-gold/20 py-3 focus:outline-none focus:border-church-gold"
              value={form.serviceName}
              onChange={(event) => setForm((current) => ({ ...current, serviceName: event.target.value }))}
              required
            />

            <select
              className="w-full border-b border-church-gold/20 py-3 bg-transparent focus:outline-none focus:border-church-gold"
              value={form.category}
              onChange={(event) => setForm((current) => ({ ...current, category: event.target.value as WorshipCategory | "" }))}
              required
            >
              <option value="" disabled>
                Kategori Ibadah
              </option>
              {WORSHIP_CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {getCategoryLabel(option)}
                </option>
              ))}
            </select>

            <input
              type="time"
              className="w-full border-b border-church-gold/20 py-3 focus:outline-none focus:border-church-gold"
              value={form.serviceTime}
              onChange={(event) => setForm((current) => ({ ...current, serviceTime: event.target.value }))}
              required
            />

            <input
              placeholder="Contact Person Ibadah"
              className="w-full border-b border-church-gold/20 py-3 focus:outline-none focus:border-church-gold"
              value={form.contactPerson}
              onChange={(event) => setForm((current) => ({ ...current, contactPerson: event.target.value }))}
              required
            />

            <AppButton
              type="submit"
              disabled={saving}
              className="w-full bg-church-gold text-church-cream py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
              {saving ? "Menyimpan..." : editingId ? "Update Jadwal Ibadah" : "Simpan Jadwal Ibadah"}
            </AppButton>
          </form>
        </div>

        {schedules.length === 0 && (
          <div className="rounded-[2rem] border border-church-gold/10 bg-[linear-gradient(135deg,rgba(26,26,26,0.96),rgba(52,39,22,0.92))] p-8 text-church-cream">
            <h4 className="serif text-2xl font-bold uppercase mb-3">Muat Data Awal</h4>
            <AppButton
              type="button"
              disabled={seeding}
              onClick={seedDefaults}
              className="rounded-full border border-church-gold/30 bg-white/10 px-5 py-3 text-sm uppercase tracking-widest text-church-cream hover:bg-church-gold hover:text-church-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {seeding ? "Memuat Data Awal..." : "Muat Data Awal ke Firebase"}
            </AppButton>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {dataError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {dataError}
          </div>
        )}

        {successMessage && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        )}

        {loading ? (
          <div className="rounded-[2rem] border border-church-gold/10 bg-white p-8 text-center text-church-dark/55">
            Memuat daftar jadwal ibadah...
          </div>
        ) : schedules.length === 0 ? (
          <div className="rounded-[2rem] border border-church-gold/10 bg-white p-8 text-center">
            <MapPinned size={28} className="mx-auto mb-4 text-church-gold" />
            <h4 className="serif text-2xl font-bold uppercase mb-3">Belum Ada Jadwal di Firebase</h4>
            <p className="text-church-dark/55 max-w-lg mx-auto">
              Tambahkan jadwal secara manual dari form di sebelah kiri, atau gunakan tombol muat data awal jika ingin langsung mengisi daftar dasar.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {schedules.map((item) => (
              <div
                key={item.id}
                className="rounded-[2rem] border border-church-gold/10 bg-white p-5 md:p-6 shadow-sm"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-church-gold mb-2">{item.satellite}</p>
                    <h4 className="serif text-3xl font-bold text-church-dark">{item.serviceName}</h4>
                    <div className="flex flex-wrap gap-3 mt-3 text-sm text-church-dark/60">
                      <span>{formatWorshipTime(item.serviceTime)}</span>
                      <span>{getCategoryLabel(item.category)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <AppButton
                      type="button"
                      buttonMotion="icon"
                      onClick={() => handleEdit(item)}
                      className="text-church-dark/60 hover:bg-church-gold/10 hover:text-church-gold p-2 rounded-lg transition-colors"
                    >
                      <Pencil size={18} />
                    </AppButton>
                    <AppButton
                      type="button"
                      buttonMotion="icon"
                      disabled={deletingId === item.id}
                      onClick={() => handleDelete(item)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {deletingId === item.id ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
                    </AppButton>
                  </div>
                </div>

                <p className="mt-4 text-sm text-church-dark/65 leading-relaxed">{item.place}</p>
                <p className="mt-3 text-sm font-medium text-church-dark">{item.contactPerson}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.22em] text-church-dark/40">
                  Gambar publik: {SATELLITE_LOCAL_IMAGES[item.satellite]}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
