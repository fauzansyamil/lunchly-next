"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { PRICE, PRODUCTS } from "@/lib/data";
import { idr } from "@/lib/format";

export default function CartPage() {
  const { cart, count, ready, change, remove } = useCart();
  const items = PRODUCTS.filter((p) => (cart[p.id] || 0) > 0);
  const sub = count * PRICE;

  return (
    <section className="view">
      <h2>Shopping Cart</h2>
      {!ready ? null : !items.length ? (
        <div className="empty">
          <p style={{ margin: "0 auto 18px" }}>Your cart is empty. Pick a colour to get started.</p>
          <Link className="btn" href="/products">Shop products</Link>
        </div>
      ) : (
        <div className="two">
          <div>
            {items.map((p) => {
              const q = cart[p.id] || 0;
              return (
                <div className="row" key={p.id}>
                  <Image src={p.image} alt="" width={84} height={84} />
                  <div>
                    <h3 style={{ margin: 0 }}>{p.name}</h3>
                    <div className="sw">{idr(PRICE)} each</div>
                    <button className="link" onClick={() => remove(p.id)}>Remove</button>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="qty">
                      <button onClick={() => change(p.id, -1)} aria-label={`Decrease quantity of ${p.label}`}>−</button>
                      <span>{q}</span>
                      <button onClick={() => change(p.id, 1)} aria-label={`Increase quantity of ${p.label}`}>+</button>
                    </div>
                    <div style={{ marginTop: 6, fontWeight: 600 }}>{idr(q * PRICE)}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <aside className="sum">
            <h3>Order summary</h3>
            <div className="l"><span>Items ({count})</span><span>{idr(sub)}</span></div>
            <div className="l" style={{ color: "var(--mute)" }}><span>Shipping</span><span>Calculated at checkout</span></div>
            <div className="l t"><span>Subtotal</span><span>{idr(sub)}</span></div>
            <Link className="btn" style={{ width: "100%", textAlign: "center", marginTop: 16 }} href="/checkout">Go to checkout</Link>
          </aside>
        </div>
      )}
    </section>
  );
}
