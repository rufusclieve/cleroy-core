/**
 * Standardized Contact Utilities for Cleroy Engineering
 */

export const CONTACT_EMAIL = "cleroyhq@gmail.com";
export const CONTACT_PHONE_TEL = "tel:+917305958026";
export const DEFAULT_WHATSAPP_MESSAGE = "Hello Cleroy Team, I would like to discuss my project.";

/**
 * Opens Gmail Compose in a new browser tab.
 * Prevents default mailto client / Outlook popups.
 */
export function openGmailCompose(
  subject: string = "Project Inquiry",
  body?: string
): void {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: CONTACT_EMAIL,
    su: subject,
  });
  if (body) {
    params.set("body", body);
  }
  const url = `https://mail.google.com/mail/?${params.toString()}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

/**
 * Opens official WhatsApp chat in a new browser tab.
 */
export function openWhatsApp(
  customText: string = DEFAULT_WHATSAPP_MESSAGE
): void {
  const url = `https://wa.me/917305958026?text=${encodeURIComponent(customText)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

/**
 * Triggers native phone dialer call action.
 */
export function makePhoneCall(): void {
  window.location.href = CONTACT_PHONE_TEL;
}
