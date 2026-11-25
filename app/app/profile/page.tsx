"use client";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useDevice, Notif } from "@/lib/device";

const NOTIFS: [keyof Notif, string, string][] = [
  ["ready", "Meal ready", "When the timer finishes"],
  ["low", "Low battery", "When battery drops below 15%"],
  ["charged", "Charging complete", "When Lunchly is fully charged"],
  ["tips", "Tips & recipes", "Ideas once a week"],
];
const GUIDE: [string, string][] = [
  ["Connecting Lunchly", "Turn on Lunchly, open the app, tap Connect device and wait for it to be found."],
  ["Heating your meal", "Fill both compartments, close the lid, press the power button and set your temperature."],
  ["Using the timer", "Pick a duration and press Start. Lunchly heats automatically and stops when the timer ends."],
  ["Charging", "Plug any USB-C charger into Lunchly. It charges like a phone, no special adapter needed."],
  ["Care", "Don’t use it empty, keep it away from water and wipe the stainless steel after use."],
];

type Install = Event & { prompt: () => Promise<void> };

export default function Profile() {
  const { s, setProfile, setNotif, notify, reset } = useDevice();
  const [f, setF] = useState(s.profile);
  const [errs, setErrs] = useState<Partial<Record<keyof typeof s.profile, string>>>({});
  const [inst, setInst] = useState<Install | null>(null);
  const [standalone, setStandalone] = useState(false);
  useEffect(() => setF(s.profile), [s.profile]);
  useEffect(() => {
    const h = (e: Event) => { e.preventDefault(); setInst(e as Install); };
    window.addEventListener("beforeinstallprompt", h);
    setStandalone(window.matchMedia("(display-mode: standalone)").matches);
    return () => window.removeEventListener("beforeinstallprompt", h);
  }, []);

  function save(e: FormEvent) {
    e.preventDefault();
    const er: typeof errs = {};
    if (!f.name.trim()) er.name = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) er.email = "Enter a valid email.";
    setErrs(er);
    if (Object.keys(er).length) return;
    setProfile({ name: f.name.trim(), email: f.email.trim(), phone: f.phone.trim() });
    notify("Profile saved");
  }

  return (
    <>
      <p className="ap-eyebrow">Page 6</p>
      <h1 className="ap-h1">Profile &amp; settings</h1>

      <form className="ap-card" onSubmit={save} noValidate>
        <div className="ap-me"><span className="ap-avatar lg">{f.name.trim().slice(0, 1).toUpperCase() || "L"}</span><div><b>{s.profile.name}</b><small>{s.profile.email}</small></div></div>
        <label htmlFor="pn">Name</label>
        <input id="pn" value={f.name} aria-invalid={!!errs.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoComplete="name" />
        <div className="err">{errs.name}</div>
        <label htmlFor="pe">Email</label>
        <input id="pe" type="email" value={f.email} aria-invalid={!!errs.email} onChange={(e) => setF({ ...f, email: e.target.value })} autoComplete="email" />
        <div className="err">{errs.email}</div>
        <label htmlFor="pp">Phone</label>
        <input id="pp" type="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} autoComplete="tel" />
        <button className="btn ap-full" type="submit" style={{ marginTop: 14 }}>Save profile</button>
      </form>

      <section className="ap-card">
        <h3>Notifications</h3>
        <ul className="ap-list">
          {NOTIFS.map(([k, t, d]) => (
            <li key={k}>
              <span><b>{t}</b><small>{d}</small></span>
              <button role="switch" aria-checked={s.notif[k]} aria-label={t} className={"ap-sw" + (s.notif[k] ? " on" : "")} onClick={() => setNotif(k, !s.notif[k])} />
            </li>
          ))}
        </ul>
        <small className="ap-hint">In this demo, alerts appear inside the app.</small>
      </section>

      <section className="ap-card">
        <h3>User guide</h3>
        <div className="ap-acc">
          {GUIDE.map(([t, d], i) => (
            <details key={t}><summary><i>{i + 1}</i>{t}</summary><p>{d}</p></details>
          ))}
        </div>
      </section>

      <section className="ap-card">
        <h3>About Lunchly</h3>
        <div className="reel" style={{ borderRadius: 18 }}>
          <video controls playsInline preload="none" poster="/media/asset-2.jpg"><source src="/media/asset-3.mp4" type="video/mp4" /></video>
        </div>
        <p style={{ marginTop: 12 }}>A smarter way to enjoy your meal. Lunchly is a Smart Heated Lunch Box with two stainless steel compartments and a rechargeable battery that doubles as a power bank.</p>
      </section>

      <section className="ap-card ap-soft">
        <h3>Install this app</h3>
        {standalone ? <p>You’re using the installed app.</p> : inst ? (
          <button className="btn ap-full" onClick={async () => { await inst.prompt(); setInst(null); }}>Add to home screen</button>
        ) : (
          <ul className="ap-help">
            <li><b>iPhone:</b> open in Safari, tap Share, then <b>Add to Home Screen</b>.</li>
            <li><b>Android:</b> in Chrome tap ⋮, then <b>Install app</b>.</li>
            <li><b>Desktop:</b> click the install icon in the address bar.</li>
          </ul>
        )}
      </section>

      <Link className="btn ghost ap-full" href="/">← Back to the store</Link>
      <button className="link ap-reset" onClick={reset}>Reset demo data</button>
      <p className="ap-note">Demo app with a simulated device. Nothing is sent to a server.</p>
    </>
  );
}
