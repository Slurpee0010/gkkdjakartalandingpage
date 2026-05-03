import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const SUPERADMIN_EMAIL = process.env.SUPERADMIN_EMAIL ?? "gkkdjak+superadmin@gmail.com";
const SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD;
const MIN_SUPERADMIN_PASSWORD_LENGTH = 12;

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

async function readFirebaseConfig() {
  const configPath = path.join(projectRoot, "firebase-applet-config.json");
  const configRaw = await fs.readFile(configPath, "utf8");
  return JSON.parse(configRaw);
}

async function callIdentityToolkit(config, action, payload) {
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:${action}?key=${config.apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorCode = data?.error?.message ?? "UNKNOWN";
    const error = new Error(errorCode);
    error.code = errorCode;
    throw error;
  }

  return data;
}

async function ensureSuperadminAuthUser(config, email, password) {
  try {
    return await callIdentityToolkit(config, "signUp", {
      email,
      password,
      returnSecureToken: true,
    });
  } catch (error) {
    if (error.code === "EMAIL_EXISTS") {
      return callIdentityToolkit(config, "signInWithPassword", {
        email,
        password,
        returnSecureToken: true,
      });
    }

    throw error;
  }
}

async function upsertSuperadminProfile(config, idToken, uid, email) {
  const response = await fetch(
    `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/${config.firestoreDatabaseId}/documents/adminUsers/${encodeURIComponent(uid)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        fields: {
          email: { stringValue: email },
          role: { stringValue: "superadmin" },
          createdAt: { stringValue: new Date().toISOString() },
        },
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    const message = data?.error?.message ?? "FAILED_TO_WRITE_FIRESTORE_PROFILE";
    const error = new Error(message);
    error.code = message;
    throw error;
  }

  return data;
}

async function main() {
  if (!SUPERADMIN_PASSWORD) {
    throw new Error("SUPERADMIN_PASSWORD wajib diisi lewat environment variable.");
  }

  if (
    SUPERADMIN_PASSWORD.length < MIN_SUPERADMIN_PASSWORD_LENGTH ||
    !/[a-z]/.test(SUPERADMIN_PASSWORD) ||
    !/[A-Z]/.test(SUPERADMIN_PASSWORD) ||
    !/\d/.test(SUPERADMIN_PASSWORD)
  ) {
    throw new Error(
      "SUPERADMIN_PASSWORD minimal 12 karakter dan harus memuat huruf besar, huruf kecil, dan angka.",
    );
  }

  const firebaseConfig = await readFirebaseConfig();
  const email = normalizeEmail(SUPERADMIN_EMAIL);

  const authUser = await ensureSuperadminAuthUser(firebaseConfig, email, SUPERADMIN_PASSWORD);
  await upsertSuperadminProfile(firebaseConfig, authUser.idToken, authUser.localId, email);

  console.log(`Superadmin siap dipakai: ${email}`);
  console.log("Password superadmin dibaca dari environment dan tidak ditampilkan di console.");
  console.log("Silakan login dari menu admin lalu ganti password secara manual jika diperlukan.");
}

main().catch((error) => {
  console.error("Provision superadmin gagal:", error.code ?? error.message ?? error);
  process.exitCode = 1;
});
