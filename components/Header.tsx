"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";

const LINKS = [
  ["/", "Home"], ["/products", "Products"], ["/about", "About Us"], ["/shipping-returns", "Shipping & Returns"],
] as const;

export default function Header() {
  const path = usePathname();
  const { count, ready } = useCart();
  const [open, setOpen] = useState(false);
  const n = ready ? count : 0;
  useEffect(() => setOpen(false), [path]);
  return (
    <header><div className="wrap"><nav className={open ? "open" : undefined}>
      <Link className="logo" href="/">Lunchly</Link>
      {LINKS.map(([href, label]) => (
        <Link key={href} href={href} className={"l" + (path === href ? " on" : "")} aria-current={path === href ? "page" : undefined}>{label}</Link>
      ))}
      <Link href="/cart" className="l cartlink">Cart<span className="badge" aria-label={`${n} items`}>{n}</span></Link>
      <button className="menu" aria-expanded={open} aria-label="Toggle menu" onClick={() => setOpen((o) => !o)}>{open ? "Close" : "Menu"}</button>
    </nav></div></header>
  );
}
