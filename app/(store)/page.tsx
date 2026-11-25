import Image from "next/image";
import Link from "next/link";
import AddToCart from "@/components/AddToCart";
import { PRICE, PRODUCTS, REVIEWS } from "@/lib/data";
import { idr, usd } from "@/lib/format";
import "./home.css";

const MARQUEE = ["No microwave needed", "USB-C powered", "Two compartments", "Stainless steel", "60°C by default", "Ships worldwide"];
const BLOCK_CLASS = { brick: "pa-b1", sage: "pa-b2", lilac: "pa-b3" } as const;

export default function Home() {
  const loop = [...MARQUEE, ...MARQUEE];
  return (
    <div className="pa">
      <section className="pa-hero">
        <div>
          <span className="pa-pill">Smart Heated Lunch Box</span>
          <h1>Warm lunch, <em>anywhere.</em></h1>
          <p>Plug Lunchly into a power bank through USB-C and your meal heats up. No microwave, no queue, no cold rice.</p>
          <div className="pa-cta">
            <Link className="btn" href="/products">Shop Lunchly</Link>
            <span className="price">{idr(PRICE)}<small>{usd(PRICE)}</small></span>
          </div>
        </div>
        <div className="pa-stage">
          <Image src="/media/asset-1.jpg" alt="Lunchly Smart Heated Lunch Box in Brick Red" width={1024} height={1024} priority sizes="(max-width:860px) 100vw, 520px" />
          <div className="pa-sticker pa-s1">60°C<br />default</div>
          <div className="pa-sticker pa-s2">USB-C powered</div>
          <div className="pa-sticker pa-s3">2 compartments</div>
        </div>
      </section>

      <div className="pa-marq" aria-hidden="true">
        <div className="pa-track">{loop.map((t, i) => <span key={i}>{t}</span>)}</div>
      </div>

      <section className="pa-sec">
        <div className="pa-head">
          <h2 style={{ margin: 0 }}>Pick your colour</h2>
          <p>One lunch box, three moods. {idr(PRICE)} each.</p>
        </div>
        <div className="pa-blocks">
          {PRODUCTS.map((p) => (
            <article key={p.id} className={`pa-block ${BLOCK_CLASS[p.id]}`}>
              <Image src={p.image} alt={p.name} width={800} height={800} sizes="(max-width:860px) 100vw, 360px" />
              <h3>{p.label}</h3>
              <div className="pa-row"><span>{idr(PRICE)}</span><AddToCart id={p.id} /></div>
            </article>
          ))}
        </div>
      </section>

      <section className="pa-sec">
        <h2>Made for your day</h2>
        <div className="pa-feats">
          <div className="pa-feat"><b>1</b><h3>Pack it</h3><p>Fill the two stainless steel compartments and close the lid.</p></div>
          <div className="pa-feat"><b>2</b><h3>Plug it</h3><p>Connect USB-C to a power bank and press the power button.</p></div>
          <div className="pa-feat"><b>3</b><h3>Enjoy it</h3><p>Set the heat with − and +, then eat your meal warm.</p></div>
        </div>
      </section>

      <section className="pa-sec">
        <div className="pa-vid">
          <div className="reel">
            <video controls playsInline preload="none" poster="/media/asset-2.jpg"><source src="/media/asset-3.mp4" type="video/mp4" /></video>
          </div>
          <div>
            <h2>See Lunchly in action</h2>
            <p>From the two stainless steel compartments to the digital temperature display, watch how your meal warms up.</p>
          </div>
        </div>
      </section>

      <section className="pa-sec">
        <h2>What customers say</h2>
        <p style={{ color: "var(--mute)" }}>Sample reviews written for this demo store.</p>
        <div className="pa-rev">
          {REVIEWS.map((r) => (
            <div className="pa-card" key={r.who}>
              <div className="stars" aria-label="5 out of 5 stars">★★★★★</div>
              <p>“{r.text}”</p>
              <p className="who">{r.who}, <span style={{ fontWeight: 500 }}>{r.where}</span></p>
            </div>
          ))}
        </div>
      </section>

      <section className="pa-end">
        <h2>Heat your meal. Enjoy your day.</h2>
        <p>7-day money back, 100% authentic, ships worldwide.</p>
        <Link className="btn" href="/products">Get your Lunchly</Link>
      </section>

    </div>
  );
}
