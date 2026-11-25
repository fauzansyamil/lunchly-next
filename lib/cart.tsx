"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { PRODUCTS, ProductId, PayMethod } from "./data";

type Cart = Partial<Record<ProductId, number>>;
export type Order = {
  no: string; name: string; email: string; addr: string; city: string; st: string; zip: string;
  country: string; sub: number; ship: number; disc: number; vc: string; total: number; pay: PayMethod;
  items: { n: string; q: number }[];
};

type Ctx = {
  cart: Cart; count: number; ready: boolean;
  add: (id: ProductId) => void; change: (id: ProductId, d: number) => void; remove: (id: ProductId) => void; clear: () => void;
  order: Order | null; setOrder: (o: Order | null) => void;
};
const CartCtx = createContext<Ctx | null>(null);
const KEY = "lunchly-cart";
const valid = new Set<string>(PRODUCTS.map((p) => p.id));

// Only keep known product ids with positive integer quantities (localStorage can't be trusted)
function sanitize(raw: unknown): Cart {
  const out: Cart = {};
  if (raw && typeof raw === "object") {
    for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
      if (valid.has(k) && typeof v === "number" && Number.isInteger(v) && v > 0) out[k as ProductId] = Math.min(v, 99);
    }
  }
  return out;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({});
  const [order, setOrder] = useState<Order | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { setCart(sanitize(JSON.parse(localStorage.getItem(KEY) || "{}"))); } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch {}
  }, [cart, ready]);

  const add = useCallback((id: ProductId) => setCart((c) => ({ ...c, [id]: Math.min((c[id] || 0) + 1, 99) })), []);
  const change = useCallback((id: ProductId, d: number) => setCart((c) => {
    const q = Math.max(0, Math.min(99, (c[id] || 0) + d));
    const n = { ...c }; if (q) n[id] = q; else delete n[id]; return n;
  }), []);
  const remove = useCallback((id: ProductId) => setCart((c) => { const n = { ...c }; delete n[id]; return n; }), []);
  const clear = useCallback(() => setCart({}), []);
  const count = useMemo(() => Object.values(cart).reduce((a, b) => a + (b || 0), 0), [cart]);

  const value = useMemo(() => ({ cart, count, ready, add, change, remove, clear, order, setOrder }), [cart, count, ready, add, change, remove, clear, order]);
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
