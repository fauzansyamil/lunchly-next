"use client";
import { useDevice, MIN_T, MAX_T } from "@/lib/device";
import Gate from "@/components/app/Gate";
import Icon from "@/components/app/Icon";

const PRESETS = [["Gentle", 50], ["Standard", 60], ["Hot", 70]] as const;

export default function Temperature() {
  const { s, setTarget, setHeater } = useDevice();
  const R = 92, C = 2 * Math.PI * R;
  const frac = Math.min(1, Math.max(0, (s.temp - 20) / (MAX_T - 20)));
  const tFrac = (s.target - 20) / (MAX_T - 20);
  const status = !s.heater ? "Heater off" : s.temp >= s.target - 0.5 ? "At target" : "Warming up";

  return (
    <>
      <p className="ap-eyebrow">Page 2</p>
      <h1 className="ap-h1">Temperature</h1>
      <p className="ap-sub">Safe range {MIN_T}°C to {MAX_T}°C</p>

      <Gate>
        <section className="ap-card ap-center">
          <div className="ap-dial">
            <svg viewBox="0 0 220 220" role="img" aria-label={`Food temperature ${Math.round(s.temp)} degrees, target ${s.target}`}>
              <circle cx="110" cy="110" r={R} className="trk" />
              <circle cx="110" cy="110" r={R} className="val" strokeDasharray={`${C * frac} ${C}`} transform="rotate(-90 110 110)" />
              <circle cx="110" cy="110" r={R} className="tgt" strokeDasharray={`3 ${C}`} strokeDashoffset={-C * tFrac + 1.5} transform="rotate(-90 110 110)" />
            </svg>
            <div className="ap-dial-in">
              <small>Food now</small>
              <b>{Math.round(s.temp)}°</b>
              <span>Target {s.target}°C</span>
            </div>
          </div>
          <p className="ap-status">{status}</p>

          <div className="ap-stepper">
            <button onClick={() => setTarget(s.target - 1)} aria-label="Lower target temperature" disabled={s.target <= MIN_T}><Icon name="minus" size={26} /></button>
            <button className={"ap-power big" + (s.heater ? " on" : "")} onClick={() => setHeater(!s.heater)} aria-pressed={s.heater} aria-label="Toggle heater"><Icon name="power" size={34} /></button>
            <button onClick={() => setTarget(s.target + 1)} aria-label="Raise target temperature" disabled={s.target >= MAX_T}><Icon name="plus" size={26} /></button>
          </div>
        </section>

        <section className="ap-card">
          <h3>Presets</h3>
          <div className="ap-chips">
            {PRESETS.map(([n, t]) => (
              <button key={n} className={s.target === t ? "on" : undefined} onClick={() => setTarget(t)}>{n}<small>{t}°C</small></button>
            ))}
          </div>
          <input className="ap-range" type="range" min={MIN_T} max={MAX_T} value={s.target} onChange={(e) => setTarget(Number(e.target.value))} aria-label="Target temperature" />
          <div className="ap-range-l"><span>{MIN_T}°C</span><span>{MAX_T}°C</span></div>
        </section>
      </Gate>
    </>
  );
}
