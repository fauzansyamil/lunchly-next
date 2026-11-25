import { USD_RATE, COUNTRIES, Voucher } from "./data";

export const idr = (n: number) => "Rp" + n.toLocaleString("en-US");
// Round half up so the price is the same everywhere (250,000 / 16,000 = 15.625 -> 15.63)
export const usd = (n: number) => "≈ $" + (Math.round((n / USD_RATE) * 100) / 100).toFixed(2);
export const shippingFor = (country: string) => COUNTRIES.find((c) => c[0] === country)?.[1] ?? 0;
export const eta = (s: number) => (s <= 20000 ? "2–5" : s <= 110000 ? "5–8" : s <= 170000 ? "7–12" : "10–14");

export function totals(subtotal: number, country: string, voucher: Voucher | "") {
  const ship = shippingFor(country);
  const disc = voucher === "WELCOME10" ? Math.round(subtotal * 0.1) : 0;
  const shipDisc = voucher === "FREESHIP" ? Math.min(ship, 30000) : 0;
  return { ship, disc, shipDisc, total: subtotal - disc + ship - shipDisc };
}
