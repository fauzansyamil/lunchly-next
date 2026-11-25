"use client";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { COUNTRIES, PAY_NAMES, PRICE, PRODUCTS, VOUCHERS, PayMethod, Voucher } from "@/lib/data";
import { eta, idr, totals, usd } from "@/lib/format";
import { USD_RATE } from "@/lib/data";

const REQUIRED = {
  fn: "Enter your full name.",
  em: "Enter a valid email address.",
  ph: "Enter your phone number.",
  ad: "Enter your street address.",
  ci: "Enter your city.",
  zp: "Enter your postal code.",
} as const;
type Key = keyof typeof REQUIRED;

export default function Checkout() {
  const router = useRouter();
  const { cart, count, ready, clear, setOrder } = useCart();
  const placed = useRef(false);

  const [country, setCountry] = useState("Indonesia");
  const [pay, setPay] = useState<PayMethod>("transfer");
  const [code, setCode] = useState("");
  const [voucher, setVoucher] = useState<Voucher | "">("");
  const [vmsg, setVmsg] = useState("");
  const [vok, setVok] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});
  const [formErr, setFormErr] = useState("");

  const isID = country === "Indonesia";
  useEffect(() => { if (ready && !count && !placed.current) router.replace("/cart"); }, [ready, count, router]);
  useEffect(() => { if (!isID && pay !== "transfer") setPay("transfer"); }, [isID, pay]);

  const items = PRODUCTS.filter((p) => (cart[p.id] || 0) > 0);
  const sub = count * PRICE;
  const t = totals(sub, country, voucher);

  function applyVoucher() {
    const k = code.trim().toUpperCase();
    const hit = VOUCHERS.find((v) => v === k);
    if (hit) { setVoucher(hit); setVok(true); setVmsg("Voucher applied."); }
    else { setVoucher(""); setVok(false); setVmsg(k ? "This voucher code isn’t valid." : "Enter a voucher code."); }
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = (n: string) => String(f.get(n) || "").trim();
    const errs: Partial<Record<Key, string>> = {};
    (Object.keys(REQUIRED) as Key[]).forEach((k) => {
      const val = v(k);
      if (!val || (k === "em" && !/^\S+@\S+\.\S+$/.test(val))) errs[k] = REQUIRED[k];
    });
    setErrors(errs);
    if (Object.keys(errs).length) {
      setFormErr("Please fix the highlighted fields, then press Place order again.");
      const first = Object.keys(errs)[0];
      document.getElementById(first)?.focus();
      return;
    }
    setFormErr("");
    placed.current = true;
    setOrder({
      no: "LNC-" + Math.floor(100000 + Math.random() * 900000),
      name: v("fn"), email: v("em"), addr: v("ad"), city: v("ci"), st: v("st"), zip: v("zp"),
      country, sub, ship: t.ship, disc: t.disc + t.shipDisc, vc: voucher, total: t.total, pay,
      items: items.map((p) => ({ n: p.name, q: cart[p.id] || 0 })),
    });
    clear();
    router.push("/confirmation");
  }

  if (!ready || !count) return <section className="view"><h2>Checkout</h2></section>;

  const field = (id: Key, label: string, extra: React.InputHTMLAttributes<HTMLInputElement> = {}, full = false) => (
    <div className={full ? "full" : undefined}>
      <label htmlFor={id}>{label}</label>
      <input id={id} name={id} aria-invalid={!!errors[id]} aria-describedby={`${id}-err`} {...extra} />
      <div className="err" id={`${id}-err`}>{errors[id]}</div>
    </div>
  );

  return (
    <section className="view">
      <h2>Checkout</h2>
      <div className="two">
        <form onSubmit={submit} noValidate>
          <div className="f">
            {field("fn", "Full name", { autoComplete: "name" })}
            {field("em", "Email", { type: "email", autoComplete: "email" })}
            {field("ph", "Phone number", { type: "tel", autoComplete: "tel" })}
            <div>
              <label htmlFor="co">Destination country</label>
              <select id="co" value={country} onChange={(e) => setCountry(e.target.value)}>
                {COUNTRIES.map((c) => <option key={c[0]}>{c[0]}</option>)}
              </select>
              <div className="err" />
            </div>
            {field("ad", "Street address", { autoComplete: "street-address" }, true)}
            {field("ci", "City", { autoComplete: "address-level2" })}
            <div>
              <label htmlFor="st">State / province</label>
              <input id="st" name="st" autoComplete="address-level1" />
            </div>
            {field("zp", "Postal code", { autoComplete: "postal-code" })}
            <div className="full">
              <label htmlFor="nt">Order notes (optional)</label>
              <textarea id="nt" name="nt" rows={2} />
            </div>
          </div>

          <div className="f" style={{ marginTop: 16 }}>
            <div className="full">
              <label htmlFor="vc">Voucher code</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input id="vc" value={code} placeholder="FREESHIP or WELCOME10"
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyVoucher(); } }} />
                <button type="button" className="btn ghost" onClick={applyVoucher}>Apply</button>
              </div>
              <div className="err" role="status" style={vok ? { color: "var(--mute)" } : undefined}>{vmsg}</div>
            </div>
            <div className="full">
              <label id="pay-l">Payment method</label>
              <div className="pay" role="radiogroup" aria-labelledby="pay-l">
                {(Object.keys(PAY_NAMES) as PayMethod[]).map((m) => {
                  const disabled = m !== "transfer" && !isID;
                  const text = m === "transfer" ? "Bank transfer" : m === "qris" ? "QRIS (Indonesia only)" : "Cash on delivery, COD (Indonesia only)";
                  return (
                    <label key={m}>
                      <input type="radio" name="pay" value={m} checked={pay === m} disabled={disabled} onChange={() => setPay(m)} />{text}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <p style={{ marginTop: 18, color: "var(--mute)" }}>This is a simulation. No payment is taken.</p>
          <div className="err" role="alert" style={{ marginBottom: 10, fontWeight: 600 }}>{formErr}</div>
          <button className="btn" type="submit">Place order</button>
        </form>

        <aside className="sum">
          <h3>Your order</h3>
          {items.map((p) => <div className="l" key={p.id}><span>{cart[p.id]} × {p.label}</span><span>{idr((cart[p.id] || 0) * PRICE)}</span></div>)}
          <div className="l"><span>Subtotal</span><span>{idr(sub)}</span></div>
          {t.disc > 0 && <div className="l"><span>Voucher {voucher}</span><span>−{idr(t.disc)}</span></div>}
          <div className="l"><span>Shipping to {country}</span><span>{idr(t.ship)}</span></div>
          {t.shipDisc > 0 && <div className="l"><span>Voucher {voucher}</span><span>−{idr(t.shipDisc)}</span></div>}
          <div className="l t"><span>Total</span><span>{idr(t.total)}</span></div>
          <div style={{ color: "var(--mute)", textAlign: "right", fontSize: ".85rem" }}>{usd(t.total)} at {idr(USD_RATE)} per $1</div>
          <p style={{ fontSize: ".85rem", color: "var(--mute)", margin: "12px 0 0" }}>Estimated delivery: {eta(t.ship)} working days. Shipping is a simulated estimate for this demo.</p>
        </aside>
      </div>
    </section>
  );
}
