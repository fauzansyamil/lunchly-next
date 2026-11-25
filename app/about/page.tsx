import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "About Us" };

export default function About() {
  return (
    <section className="view">
      <div className="two">
        <div>
          <h2>About Lunchly</h2>
          <p>Lunchly makes and sells innovative, technology-based lunch boxes. Our Smart Heated Lunch Box is a portable meal container with an electric heater, so you can enjoy warm food without a microwave.</p>
          <p>Each box has a stainless steel food container, a heat-resistant plastic casing, two compartments for separate dishes, an ON/OFF button and a USB-C connector for a compatible power source, such as a power bank.</p>
          <p>We designed Lunchly for students, workers and anyone who needs a practical lunch box at an affordable price. We sell directly through this store to customers in Indonesia and abroad.</p>
          <Link className="btn" href="/products">Browse products</Link>
        </div>
        <div className="sum">
          <h3>What we stand for</h3>
          <p>Warm meals without a microwave.</p>
          <p>A stainless steel food container and a heat-resistant casing.</p>
          <p style={{ margin: 0 }}>An affordable price, shown clearly before checkout.</p>
        </div>
      </div>
    </section>
  );
}
