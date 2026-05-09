export function extractPhoneNumber(value: string) {
  return value.match(/(\+?\d[\d\s().-]{6,}\d)/)?.[1] ?? null;
}

export function normalizeWhatsAppNumber(value: string) {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return null;
  }

  if (digits.startsWith("0")) {
    return `62${digits.slice(1)}`;
  }

  if (digits.startsWith("8")) {
    return `62${digits}`;
  }

  return digits;
}

export function createWhatsAppHref(phoneNumber: string, message?: string) {
  const normalizedPhoneNumber = normalizeWhatsAppNumber(phoneNumber);

  if (!normalizedPhoneNumber) {
    return null;
  }

  const trimmedMessage = message?.trim();
  const text = trimmedMessage ? `?text=${encodeURIComponent(trimmedMessage)}` : "";

  return `https://wa.me/${normalizedPhoneNumber}${text}`;
}
