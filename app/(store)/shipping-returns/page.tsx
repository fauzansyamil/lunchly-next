import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shipping & Returns" };

export default function Policy() {
  return (
    <section className="view">
      <h2>Shipping &amp; Returns</h2>
      <div className="pol">
        <h3>Shipping</h3>
        <p>Orders ship from Indonesia. We use JNE and J&amp;T Express within Indonesia and DHL Express for international orders. The shipping cost is shown at checkout once you pick your country.</p>
        <table>
          <thead><tr><th>Destination</th><th>Estimated delivery</th></tr></thead>
          <tbody>
            <tr><td>Indonesia</td><td>2–5 working days</td></tr>
            <tr><td>Singapore, Malaysia, Brunei, Thailand, Philippines</td><td>5–8 working days</td></tr>
            <tr><td>Australia, Japan, South Korea, UAE</td><td>7–12 working days</td></tr>
            <tr><td>UK, Europe, USA, Canada and other countries</td><td>10–14 working days</td></tr>
          </tbody>
        </table>
      </div>
      <div className="pol"><h3>Vouchers</h3><p><b>FREESHIP</b>: shipping discount of up to Rp30,000. <b>WELCOME10</b>: 10% off your items. Enter a code at checkout. One code per order.</p></div>
      <div className="pol"><h3>Payment methods</h3><p>Bank transfer (all countries), QRIS and cash on delivery (COD) for orders within Indonesia.</p></div>
      <div className="pol"><h3>Guarantees</h3><p>100% authentic Lunchly product. 7-day money-back guarantee: if the product doesn’t work as described, request a refund within 7 days of delivery.</p></div>
      <div className="pol"><h3>Return policy</h3><p>If your Lunchly arrives defective or damaged, we exchange it for a new unit. Contact us within 7 days of delivery with your order number and a photo or unboxing video of the problem. We cover the shipping for defective items.</p></div>
    </section>
  );
}
