import { CartProvider } from "@/lib/cart";
import Header from "@/components/Header";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
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
  );
}
