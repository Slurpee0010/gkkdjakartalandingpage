import { doc, getDoc, setDoc } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";
import { db } from "./firebase";

export const ADMIN_USERS_COLLECTION = "adminUsers";
export const DEFAULT_SUPERADMIN_EMAIL = "gkkdjak+superadmin@gmail.com";

export type AdminRole = "admin" | "superadmin";

export interface AdminUserProfile {
  email: string;
  role: AdminRole;
  createdAt: string;
  createdBy?: string;
}

interface FirebaseIdentityResponse {
  localId: string;
  email: string;
  idToken: string;
  refreshToken: string;
  expiresIn: string;
}

interface FirebaseIdentityErrorResponse {
  error?: {
    message?: string;
  };
}

export class AdminAuthRestError extends Error {
  code: string;

  constructor(code: string, message?: string) {
    super(message ?? code);
    this.name = "AdminAuthRestError";
    this.code = code;
  }
}

export function normalizeAdminEmail(email: string) {
  return email.trim().toLowerCase();
}

function getIdentityToolkitUrl(action: "signUp" | "signInWithPassword") {
  return `https://identitytoolkit.googleapis.com/v1/accounts:${action}?key=${firebaseConfig.apiKey}`;
}

async function callIdentityToolkit(
  action: "signUp" | "signInWithPassword",
  payload: Record<string, unknown>,
) {
  const response = await fetch(getIdentityToolkitUrl(action), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as FirebaseIdentityResponse | FirebaseIdentityErrorResponse;

  if (!response.ok) {
    const errorCode = (data as FirebaseIdentityErrorResponse).error?.message ?? "UNKNOWN";
    throw new AdminAuthRestError(errorCode);
  }

  return data as FirebaseIdentityResponse;
}

export async function signInEmailPasswordUser(email: string, password: string) {
  return callIdentityToolkit("signInWithPassword", {
    email: normalizeAdminEmail(email),
    password,
    returnSecureToken: true,
  });
}

export async function createEmailPasswordUser(email: string, password: string) {
  const normalizedEmail = normalizeAdminEmail(email);

  try {
    return await callIdentityToolkit("signUp", {
      email: normalizedEmail,
      password,
      returnSecureToken: true,
    });
  } catch (error) {
    if (error instanceof AdminAuthRestError && error.code === "EMAIL_EXISTS") {
      return signInEmailPasswordUser(normalizedEmail, password);
    }

    throw error;
  }
}

export async function fetchAdminProfile(uid: string) {
  const snapshot = await getDoc(doc(db, ADMIN_USERS_COLLECTION, uid));
  return snapshot.exists() ? (snapshot.data() as AdminUserProfile) : null;
}

export async function upsertAdminProfile(uid: string, profile: AdminUserProfile) {
  await setDoc(doc(db, ADMIN_USERS_COLLECTION, uid), profile, { merge: true });
}

export function hasAdminAccess(profile?: AdminUserProfile | null) {
  return profile?.role === "admin" || profile?.role === "superadmin";
}

export function isSuperadminProfile(profile?: AdminUserProfile | null) {
  return profile?.role === "superadmin";
}

export function getAdminProvisionErrorMessage(error: unknown) {
  if (error instanceof AdminAuthRestError) {
    switch (error.code) {
      case "EMAIL_EXISTS":
        return "Email ini sudah terdaftar dengan password yang berbeda. Gunakan password akun yang benar atau reset password akun tersebut dulu.";
      case "INVALID_LOGIN_CREDENTIALS":
      case "INVALID_PASSWORD":
        return "Email ini sudah ada, tetapi password yang dimasukkan tidak cocok dengan akun yang sudah terdaftar.";
      case "OPERATION_NOT_ALLOWED":
        return "Email/password belum diaktifkan di Firebase Authentication.";
      case "WEAK_PASSWORD":
        return "Password terlalu lemah. Gunakan minimal 6 karakter.";
      case "TOO_MANY_ATTEMPTS_TRY_LATER":
        return "Terlalu banyak percobaan. Coba lagi beberapa saat lagi.";
      default:
        return `Pembuatan akun admin gagal (${error.code}).`;
    }
  }

  const firebaseError = error as { code?: string };
  if (firebaseError?.code === "permission-denied") {
    return "Pembuatan akun berhasil di Authentication, tetapi role admin gagal disimpan karena akses Firestore ditolak.";
  }

  return "Pembuatan akun admin gagal. Periksa konfigurasi Authentication dan Firestore.";
}
