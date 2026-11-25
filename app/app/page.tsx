"use client";
import Image from "next/image";
import Link from "next/link";
import { useDevice, fmtTime } from "@/lib/device";
import { PRODUCTS } from "@/lib/data";
import Icon from "@/components/app/Icon";

export default function AppHome() {
  const { s, openConnect, disconnect, setHeater, setColor } = useDevice();
  const prod = PRODUCTS.find((p) => p.id === s.color) ?? PRODUCTS[1];
  const first = s.profile.name.trim().split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greet = hour < 11 ? "Good morning" : hour < 16 ? "Good afternoon" : "Good evening";

  return (
    <>
      <h1 className="ap-h1">{greet}, {first} 👋</h1>

      <section className="ap-hero">
        <div className="ap-hero-top">
          <div><small>Smart Lunch Box</small><h2>Lunchly · 7A2F</h2></div>
          <span className={"ap-pill" + (s.connected ? " on" : "")}>{s.connected ? "Connected" : "Disconnected"}</span>
        </div>
        <Image className="ap-hero-img" src={prod.image} alt={prod.name} width={800} height={800} priority sizes="(max-width:520px) 90vw, 440px" />
        <div className="ap-stats">
          <div><small>Food temp</small><b>{s.connected ? `${Math.round(s.temp)}°C` : "--"}</b></div>
          <div><small>Battery</small><b>{Math.round(s.battery)}%</b></div>
        </div>
        {s.connected
          ? <button className="btn ap-sun" onClick={disconnect}>Disconnect</button>
          : <button className="btn ap-sun" onClick={openConnect}><Icon name="bluetooth" size={18} /> Connect device</button>}
      </section>

      <div className="ap-grid">
        <div className="ap-card ap-tile ap-wide">
          <div>
            <small>Heater</small>
            <b>{s.heater ? "Heating" : "Off"}</b>
            <span>Target {s.target}°C</span>
          </div>
          <button className={"ap-power" + (s.heater ? " on" : "")} onClick={() => setHeater(!s.heater)} aria-pressed={s.heater} aria-label="Toggle heater"><Icon name="power" size={26} /></button>
        </div>
        <Link href="/app/temperature" className="ap-card ap-tile"><Icon name="flame" /><small>Temperature</small><b>{s.target}°C</b><span>Set target</span></Link>
        <Link href="/app/timer" className="ap-card ap-tile"><Icon name="timer" /><small>Timer</small><b>{fmtTime(s.timerRunning || s.remaining > 0 ? s.remaining : s.timerMin * 60)}</b><span>{s.timerRunning ? "Running" : "Ready"}</span></Link>
        <Link href="/app/battery" className="ap-card ap-tile"><Icon name="battery" /><small>Charging</small><b>{Math.round(s.battery)}%</b><span>{s.charging ? "Charging" : "Not charging"}</span></Link>
        <Link href="/app/power-bank" className="ap-card ap-tile"><Icon name="bolt" /><small>Power bank</small><b>{s.bank ? "On" : "Off"}</b><span>{s.bank ? "Charging phone" : "USB-A out"}</span></Link>
      </div>

      <section className="ap-card">
        <h3>Your colour</h3>
        <div className="ap-colors" role="radiogroup" aria-label="Lunch box colour">
          {PRODUCTS.map((p) => (
            <button key={p.id} role="radio" aria-checked={s.color === p.id} className={s.color === p.id ? "on" : undefined} onClick={() => setColor(p.id)}>
              <i style={{ background: p.color }} />{p.label}
            </button>
          ))}
        </div>
      </section>

      <p className="ap-note">Demo app with a simulated device. No real Bluetooth connection is made.</p>
    </>
  );
}
