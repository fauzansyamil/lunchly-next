"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { PAY_NAMES, PRICE } from "@/lib/data";
import { idr } from "@/lib/format";

export default function Confirmation() {
  const router = useRouter();
  const { order: o } = useCart();
  useEffect(() => { if (!o) router.replace("/"); }, [o, router]);
  if (!o) return <section className="view" />;

  const payNote =
    o.pay === "cod" ? `Please prepare ${idr(o.total)} in cash when the courier arrives.`
    : o.pay === "qris" ? `We’ll email you a QRIS code to pay ${idr(o.total)}.`
    : `We’ll email you the bank details to transfer ${idr(o.total)}.`;

  return (
    <section className="view">
      <div className="two">
        <div>
          <div className="ok" aria-hidden="true">✓</div>
          <h2>Thank you, {o.name.split(" ")[0]}!</h2>
          <p>Your order <b>{o.no}</b> has been placed. We’ll send a confirmation to {o.email}.</p>
          <p><b>Ships to</b><br />{o.name}<br />{o.addr}<br />{o.city}{o.st ? ", " + o.st : ""} {o.zip}<br />{o.country}</p>
          <p><b>Payment:</b> {PAY_NAMES[o.pay]}. {payNote}</p>
          <p style={{ color: "var(--mute)" }}>This is a simulated order. No payment was taken.</p>
          <Link className="btn" href="/">Back to home</Link>
        </div>
        <aside className="sum">
          <h3>Order summary</h3>
          {o.items.map((i) => <div className="l" key={i.n}><span>{i.q} × {i.n}</span><span>{idr(i.q * PRICE)}</span></div>)}
          <div className="l"><span>Subtotal</span><span>{idr(o.sub)}</span></div>
          <div className="l"><span>Shipping</span><span>{idr(o.ship)}</span></div>
          {o.disc > 0 && <div className="l"><span>Voucher {o.vc}</span><span>−{idr(o.disc)}</span></div>}
          <div className="l t"><span>Total</span><span>{idr(o.total)}</span></div>
        </aside>
      </div>
    </section>
  );
}
