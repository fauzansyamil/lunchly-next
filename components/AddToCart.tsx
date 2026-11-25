"use client";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import type { ProductId } from "@/lib/data";

export default function AddToCart({ id }: { id: ProductId }) {
  const { add } = useCart();
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 1200);
    return () => clearTimeout(t);
  }, [done]);
  return <button className="btn" onClick={() => { add(id); setDone(true); }}>{done ? "Added ✓" : "Add to cart"}</button>;
}
