"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDevice } from "@/lib/device";
import Icon from "./Icon";

const TABS = [
  ["/app", "Home", "home"],
  ["/app/temperature", "Heat", "flame"],
  ["/app/timer", "Timer", "timer"],
  ["/app/battery", "Battery", "battery"],
  ["/app/power-bank", "Power", "bolt"],
] as const;

export default function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { s, toast, openConnect, closeConnect, connect } = useDevice();

  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return (
    <div className="ap">
      <header className="ap-top">
        <Link href="/app" className="ap-logo">Lunchly</Link>
        <button className={"ap-pill" + (s.connected ? " on" : "")} onClick={() => (s.connected ? undefined : openConnect())} aria-label={s.connected ? "Connected" : "Connect device"}>
          <Icon name="bluetooth" size={14} />{s.connected ? "Connected" : "Disconnected"}
        </button>
        <Link href="/app/profile" className="ap-avatar" aria-label="Profile and settings">{s.profile.name.trim().slice(0, 1).toUpperCase() || "L"}</Link>
      </header>

      <main className="ap-main">{children}</main>

      <nav className="ap-nav" aria-label="App">
        {TABS.map(([href, label, icon]) => (
          <Link key={href} href={href} className={path === href ? "on" : undefined} aria-current={path === href ? "page" : undefined}>
            <Icon name={icon} /><span>{label}</span>
          </Link>
        ))}
      </nav>

      {toast && <div className="ap-toast" role="status">{toast}</div>}

      {s.sheet && (
        <div className="ap-sheet-bg" onClick={closeConnect}>
          <div className="ap-sheet" role="dialog" aria-modal="true" aria-label="Connect your Lunchly" onClick={(e) => e.stopPropagation()}>
            <div className="ap-sticker"><Icon name="bluetooth" size={30} /></div>
            <h2>{s.connecting ? "Searching…" : "Connect your Lunchly"}</h2>
            <p>{s.connecting ? "Looking for Lunchly · 7A2F nearby." : "Turn on your Lunchly and keep it close to your phone."}</p>
            {s.connecting
              ? <div className="ap-spin" aria-label="Searching" />
              : <button className="btn" onClick={connect}>Search for device</button>}
            <button className="link" onClick={closeConnect}>Cancel</button>
            <small>Demo: a simulated device is used. No real Bluetooth connection is made.</small>
          </div>
        </div>
      )}
    </div>
  );
}
