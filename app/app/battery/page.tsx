"use client";
import Link from "next/link";
import { useDevice } from "@/lib/device";
import Icon from "@/components/app/Icon";

export default function Battery() {
  const { s, setCharging } = useDevice();
  const pct = Math.round(s.battery);
  const filled = Math.round(pct / 10);
  const sessions = Math.floor(s.battery / 25);

  return (
    <>
      <p className="ap-eyebrow">Page 4</p>
      <h1 className="ap-h1">Battery &amp; charging</h1>
      <p className="ap-sub">Plug in a USB-C charger to recharge. No Bluetooth needed.</p>

      <section className="ap-hero">
        <div className="ap-batt">
          <div className="ap-cells" aria-hidden="true">
            {Array.from({ length: 10 }, (_, i) => <i key={i} className={10 - i <= filled ? "on" : undefined} />)}
          </div>
          <div>
            <small>Capacity</small>
            <b className="ap-big">{pct}<em>%</em></b>
            <span className="ap-pill on">{s.charging ? "Charging" : "Not charging"}</span>
            <p>{sessions >= 1 ? `Enough for about ${sessions} heating ${sessions === 1 ? "session" : "sessions"}.` : "Low. Charge before heating."}</p>
          </div>
        </div>
        <button className="btn ap-sun" onClick={() => setCharging(!s.charging)}>
          <Icon name="plug" size={18} /> {s.charging ? "Unplug charger" : "Plug in charger"}
        </button>
      </section>

      <section className="ap-card">
        <h3>Power use</h3>
        <ul className="ap-list">
          <li><span><Icon name="flame" size={18} /> Heater</span><b>{s.heater ? "On" : "Off"}</b></li>
          <li><span><Icon name="bolt" size={18} /> Power bank</span><b>{s.bank ? "On" : "Off"}</b></li>
          <li><span><Icon name="plug" size={18} /> Charging</span><b>{s.charging ? "Active" : "Idle"}</b></li>
        </ul>
      </section>

      <section className="ap-card ap-soft">
        <h3>Rechargeable</h3>
        <p>Lunchly charges like a phone with any USB-C charger. No special adapter.</p>
        <div className="ap-specs">
          <div><small>Port</small><b>USB-C PD</b></div>
          <div><small>Input</small><b>5V · 3A</b></div>
          <div><small>Full charge</small><b>≈ 2.5 h</b></div>
          <div><small>Protection</small><b>Overheat guard</b></div>
        </div>
      </section>

      <Link className="btn ghost ap-full" href="/app/power-bank">Use as a power bank →</Link>
    </>
  );
}
