import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const SUPERADMIN_EMAIL = "gkkdjak+superadmin@gmail.com";
const SUPERADMIN_PASSWORD = "123123";

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
  const firebaseConfig = await readFirebaseConfig();
  const email = normalizeEmail(SUPERADMIN_EMAIL);

  const authUser = await ensureSuperadminAuthUser(firebaseConfig, email, SUPERADMIN_PASSWORD);
  await upsertSuperadminProfile(firebaseConfig, authUser.idToken, authUser.localId, email);

  console.log(`Superadmin siap dipakai: ${email}`);
  console.log("Password sementara: 123123");
  console.log("Silakan login dari menu admin lalu ganti password secara manual.");
}

main().catch((error) => {
  console.error("Provision superadmin gagal:", error.code ?? error.message ?? error);
  process.exitCode = 1;
});
