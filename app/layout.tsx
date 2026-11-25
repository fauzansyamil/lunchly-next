import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["500", "700", "800"], variable: "--font-display", display: "swap" });
const body = Instrument_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Lunchly Official Store", template: "%s | Lunchly" },
  description: "Lunchly Smart Heated Lunch Box with a built-in electric heater. Plug into a power bank via USB-C and enjoy a warm meal, no microwave needed.",
  openGraph: { title: "Lunchly Official Store", description: "Heat your meal. Enjoy your day.", images: ["/media/asset-1.jpg"] },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#A63D32" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" translate="no" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
