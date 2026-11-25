"use client";
import { useDevice, RESERVE } from "@/lib/device";
import Icon from "@/components/app/Icon";

export default function PowerBank() {
  const { s, setBank } = useDevice();
  const avail = Math.max(0, Math.round(s.battery) - RESERVE);
  const phones = (avail * 0.012).toFixed(1);

  return (
    <>
      <p className="ap-eyebrow">Page 5</p>
      <h1 className="ap-h1">Power bank</h1>
      <p className="ap-sub">Plug your phone into the USB-A port. No Bluetooth needed.</p>

      <section className="ap-hero">
        <div className="ap-bank">
          <div className="ap-card ap-mini"><small>Lunchly</small><b>{Math.round(s.battery)}%</b><Icon name="battery" /></div>
          <div className={"ap-flow" + (s.bank ? " on" : "")} aria-hidden="true"><i /><i /><i /></div>
          <div className="ap-card ap-mini"><small>Phone</small><b>{Math.round(s.phone)}%</b><Icon name="phone" /></div>
        </div>
        <button className={"ap-plug" + (s.bank ? " on" : "")} onClick={() => setBank(!s.bank)} aria-pressed={s.bank}>
          <Icon name="plug" size={44} />
          <span>{s.bank ? "CHARGING PHONE" : "PLUG IN CABLE"}</span>
        </button>
        <p className="ap-tap">{s.bank ? "Tap to unplug the cable" : "Tap to simulate plugging in your phone"}</p>
      </section>

      <section className="ap-card">
        <h3>Available for your phone</h3>
        <b className="ap-big dark">{avail}<em>%</em></b>
        <p>≈ {phones}× phone charges. {RESERVE}% is kept in reserve for heating.</p>
      </section>

      <section className="ap-card ap-soft">
        <h3>How to use</h3>
        <ol className="ap-steps">
          <li>Plug your phone cable into the USB-A port on Lunchly.</li>
          <li>Charging starts automatically, no Bluetooth needed.</li>
          <li>Unplug when your phone is full.</li>
        </ol>
        <div className="ap-specs one"><div><small>USB-A output</small><b>5V · 2A (10 W)</b></div></div>
      </section>
    </>
  );
}
