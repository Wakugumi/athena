import { Listing } from "@athena/types";

export function formatPrice(listing: Listing) {
  const value = typeof listing.price === "number" ? listing.price : Number(listing.price);
  const code = String(listing.currency ?? "");
  if (!Number.isFinite(value)) return "";
  return `${code} ${value.toFixed(2)}`.trim();
}

export function formatMeta(listing: Listing) {
  const items = [
    listing.items?.length ? `${listing.items.length} item${listing.items.length > 1 ? "s" : ""}` : null,
    listing.license ? String(listing.license) : null,
    listing.visibility ? String(listing.visibility) : null,
  ].filter(Boolean);
  return items.join(" • ");
}

export function formatDate(date: string) {
  const d = new Date(date);
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}
