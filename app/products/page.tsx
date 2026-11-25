import type { Metadata } from "next";
import Image from "next/image";
import AddToCart from "@/components/AddToCart";
import { PRICE, PRODUCTS } from "@/lib/data";
import { idr, usd } from "@/lib/format";

export const metadata: Metadata = { title: "Products" };

const SPECS: [string, string][] = [
  ["Heating", "Built-in electric heater"],
  ["Power", "USB-C connector for a compatible power source, such as a power bank"],
  ["Food container", "Stainless steel"],
  ["Casing", "Heat-resistant plastic"],
  ["Compartments", "Two"],
  ["Controls", "Digital temperature display, − / + buttons and a power button"],
  ["Default temperature", "60°C"],
  ["Colours", "Sage Green, Brick Red, Lilac"],
  ["Price", "Rp250,000 per unit"],
];

export default function Products() {
  return (
    <section className="view">
      <h2>Products</h2>
      <p>The Lunchly Smart Heated Lunch Box is a portable meal container with an electric heater. Pack your food in the two stainless steel compartments, connect it to a power bank through USB-C, and enjoy a warm meal at your desk, in class or on the go. One lunch box, three colours. Every unit is Rp250,000.</p>

      <div className="grid">
        {PRODUCTS.map((p) => (
          <div className={`card c-${p.id}`} key={p.id}>
            <Image src={p.image} alt={p.name} width={800} height={800} sizes="(max-width:700px) 100vw, 360px" style={{ width: "100%", height: "auto" }} />
            <div className="b">
              <h3>{p.name}</h3>
              <div className="sw"><i style={{ background: p.color }} />{p.label}</div>
              <div className="price">{idr(PRICE)}<small>{usd(PRICE)}</small></div>
              <AddToCart id={p.id} />
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: 56 }}>Benefits</h2>
      <div className="g4">
        <div><h3>Warm food, no microwave</h3><p>Heat your meal wherever you have a power bank.</p></div>
        <div><h3>Two compartments</h3><p>Keep rice and side dishes separate.</p></div>
        <div><h3>Stainless steel container</h3><p>A sturdy, easy-to-clean food container.</p></div>
        <div><h3>Heat-resistant casing</h3><p>A plastic casing built to handle the heat.</p></div>
        <div><h3>Simple to use</h3><p>Power button plus − / + temperature control.</p></div>
        <div><h3>Affordable</h3><p>Rp250,000 for a practical everyday lunch box.</p></div>
      </div>

      <h2 style={{ marginTop: 56 }}>How to use</h2>
      <ol className="steps">
        <li>Fill the two compartments with your food and close the lid.</li>
        <li>Connect the USB-C connector to a compatible power source, such as a power bank.</li>
        <li>Press the power button.</li>
        <li>Use − and + to set the temperature on the display (60°C by default).</li>
        <li>Wait for your meal to warm up, then press the power button to switch off before eating.</li>
      </ol>
      <p style={{ marginTop: 18, color: "var(--mute)" }}>Safety: don’t use the box empty, keep it away from water, and follow the safety instructions that come with the product.</p>

      <h2 style={{ marginTop: 56 }}>Inside Lunchly</h2>
      <div className="gal">
        <Image src="/media/asset-4.jpg" alt="Lunchly with a meal inside the compartments" width={800} height={800} sizes="(max-width:560px) 100vw, 540px" style={{ width: "100%", height: "auto" }} />
        <Image src="/media/asset-5.jpg" alt="Stainless steel two-compartment interior" width={800} height={800} sizes="(max-width:560px) 100vw, 540px" style={{ width: "100%", height: "auto" }} />
      </div>

      <h2 style={{ marginTop: 56 }}>Specifications</h2>
      <div className="specs"><dl>
        {SPECS.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
      </dl></div>
    </section>
  );
}
