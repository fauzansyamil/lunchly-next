export type ProductId = "brick" | "sage" | "lilac";

export const PRICE = 250000;
export const USD_RATE = 16000;

export const PRODUCTS: { id: ProductId; name: string; color: string; label: string; image: string }[] = [
  { id: "brick", name: "Lunchly Brick Red", color: "#A63D32", label: "Brick Red", image: "/media/asset-7.jpg" },
  { id: "sage", name: "Lunchly Sage Green", color: "#7F9272", label: "Sage Green", image: "/media/asset-6.jpg" },
  { id: "lilac", name: "Lunchly Lilac", color: "#9C86B8", label: "Lilac", image: "/media/asset-8.jpg" },
];

export const COUNTRIES: [string, number][] = [
  ["Indonesia", 20000], ["Singapore", 90000], ["Malaysia", 90000], ["Brunei", 100000],
  ["Thailand", 110000], ["Philippines", 110000], ["Australia", 150000], ["Japan", 150000],
  ["South Korea", 150000], ["United Arab Emirates", 170000], ["United Kingdom", 210000],
  ["Germany", 210000], ["Netherlands", 210000], ["United States", 230000], ["Canada", 230000],
  ["Other countries", 250000],
];

export const VOUCHERS = ["FREESHIP", "WELCOME10"] as const;
export type Voucher = (typeof VOUCHERS)[number];

export const PAY_NAMES = { transfer: "Bank transfer", qris: "QRIS", cod: "Cash on delivery (COD)" } as const;
export type PayMethod = keyof typeof PAY_NAMES;

export const REVIEWS = [
  { text: "I heat my rice and chicken at my desk every day now. No more queueing for the office microwave.", who: "Anisa R.", where: "Bandung, Indonesia" },
  { text: "The brick red colour looks great, and the two compartments keep my rice and side dish separate.", who: "Kevin T.", where: "Singapore" },
  { text: "Easy to use: connect to my power bank, press the button and lunch is warm in a little while.", who: "Sarah M.", where: "Melbourne, Australia" },
  { text: "Perfect for campus days. Light enough for my bag and the price is very reasonable.", who: "Dimas P.", where: "Yogyakarta, Indonesia" },
  { text: "Arrived well packed and works as described. The temperature display is handy.", who: "Hana K.", where: "Tokyo, Japan" },
  { text: "The stainless steel container is easy to wash. I bought a second one in Sage Green for my sister.", who: "Rizky A.", where: "Jakarta, Indonesia" },
];
