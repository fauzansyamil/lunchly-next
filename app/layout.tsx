import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import Header from "@/components/Header";

const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["500", "700", "800"], variable: "--font-display", display: "swap" });
const body = Instrument_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Lunchly Official Store", template: "%s | Lunchly" },
  description: "Lunchly Smart Heated Lunch Box with a built-in electric heater. Plug into a power bank via USB-C and enjoy a warm meal, no microwave needed.",
  openGraph: { title: "Lunchly Official Store", description: "Heat your meal. Enjoy your day.", images: ["/media/asset-1.jpg"] },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" translate="no" className={`${display.variable} ${body.variable}`}>
      <body>
        <CartProvider>
          <a className="skip" href="#main">Skip to content</a>
          <div className="bar">Free shipping voucher: use code FREESHIP at checkout · Shipping worldwide</div>
          <Header />
          <main id="main" className="wrap">{children}</main>
          <footer><div className="wrap">
            <p><b>Lunchly Official Store</b></p>
            <p>[Company address to be added], Indonesia</p>
            <p>© 2026 Lunchly Official Store. Demo store: orders are simulated.</p>
          </div></footer>
        </CartProvider>
      </body>
    </html>
  );
}
