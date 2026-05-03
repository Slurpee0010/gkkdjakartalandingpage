export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; message: string };

export function isValidationError<T>(
  result: ValidationResult<T>,
): result is { ok: false; message: string } {
  return result.ok === false;
}

export const SECURITY_LIMITS = {
  adminPasswordMinLength: 12,
  adminEmailMaxLength: 320,
  shortTextMaxLength: 200,
  mediumTextMaxLength: 500,
  longTextMaxLength: 2000,
  timestampMaxLength: 100,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function valid<T>(value: T): ValidationResult<T> {
  return { ok: true, value };
}

function invalid<T = never>(message: string): ValidationResult<T> {
  return { ok: false, message };
}

export function sanitizePlainTextInput(value: string) {
  return value
    .normalize("NFKC")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function validateRequiredText(
  value: string,
  label: string,
  maxLength = SECURITY_LIMITS.shortTextMaxLength,
): ValidationResult<string> {
  const sanitized = sanitizePlainTextInput(value);

  if (!sanitized) {
    return invalid(`${label} wajib diisi.`);
  }

  if (sanitized.length > maxLength) {
    return invalid(`${label} maksimal ${maxLength} karakter.`);
  }

  return valid(sanitized);
}

export function validateEmailAddress(value: string, label = "Email"): ValidationResult<string> {
  const email = value.trim().toLowerCase();

  if (!email) {
    return invalid(`${label} wajib diisi.`);
  }

  if (email.length > SECURITY_LIMITS.adminEmailMaxLength || !EMAIL_PATTERN.test(email)) {
    return invalid(`${label} tidak valid.`);
  }

  return valid(email);
}

export function validateStrongPassword(value: string, label = "Password"): ValidationResult<string> {
  if (value.length < SECURITY_LIMITS.adminPasswordMinLength) {
    return invalid(`${label} minimal ${SECURITY_LIMITS.adminPasswordMinLength} karakter.`);
  }

  if (!/[a-z]/.test(value) || !/[A-Z]/.test(value) || !/\d/.test(value)) {
    return invalid(`${label} harus memuat huruf besar, huruf kecil, dan angka.`);
  }

  return valid(value);
}

export function validateIsoDate(value: string, label = "Tanggal"): ValidationResult<string> {
  const date = value.trim();
  const match = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return invalid(`${label} harus memakai format YYYY-MM-DD.`);
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  const isValid =
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day;

  if (!isValid) {
    return invalid(`${label} tidak valid.`);
  }

  return valid(date);
}

export function validateTime(value: string, label = "Jam"): ValidationResult<string> {
  const time = value.trim();
  const match = time.match(/^(\d{2}):(\d{2})$/);

  if (!match) {
    return invalid(`${label} harus memakai format HH:mm.`);
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours > 23 || minutes > 59) {
    return invalid(`${label} tidak valid.`);
  }

  return valid(time);
}

export function getSafeHttpUrl(value?: string | null) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function validateHttpUrl(
  value: string,
  label: string,
  maxLength = SECURITY_LIMITS.longTextMaxLength,
): ValidationResult<string> {
  const safeUrl = getSafeHttpUrl(value);

  if (!safeUrl) {
    return invalid(`${label} harus berupa URL http/https yang valid.`);
  }

  if (safeUrl.length > maxLength) {
    return invalid(`${label} maksimal ${maxLength} karakter.`);
  }

  return valid(safeUrl);
}

export function validateHttpsUrl(
  value: string,
  label: string,
  maxLength = SECURITY_LIMITS.longTextMaxLength,
): ValidationResult<string> {
  const validatedUrl = validateHttpUrl(value, label, maxLength);

  if (!validatedUrl.ok) {
    return validatedUrl;
  }

  if (!validatedUrl.value.startsWith("https://")) {
    return invalid(`${label} harus memakai HTTPS.`);
  }

  return validatedUrl;
}

export function validateOptionalTimestamp(value?: string) {
  if (value === undefined) {
    return valid(undefined);
  }

  const timestamp = value.trim();

  if (!timestamp || timestamp.length > SECURITY_LIMITS.timestampMaxLength) {
    return invalid("Timestamp tidak valid.");
  }

  return valid(timestamp);
}
