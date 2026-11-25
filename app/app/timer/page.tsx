"use client";
import { useDevice, fmtTime } from "@/lib/device";
import Gate from "@/components/app/Gate";
import Icon from "@/components/app/Icon";

const DURATIONS = [5, 10, 15, 20, 30];

export default function Timer() {
  const { s, setTimerMin, startTimer, pauseTimer, stopTimer } = useDevice();
  const R = 92, C = 2 * Math.PI * R;
  const total = s.timerMin * 60;
  const active = s.timerRunning || s.remaining > 0;
  const shown = active ? s.remaining : total;
  const frac = active ? s.remaining / total : 1;

  return (
    <>
      <p className="ap-eyebrow">Page 3</p>
      <h1 className="ap-h1">Heating timer</h1>
      <p className="ap-sub">Lunchly heats automatically while the timer runs.</p>

      <Gate>
        <section className="ap-card ap-center">
          <div className="ap-dial">
            <svg viewBox="0 0 220 220" role="img" aria-label={`Time left ${fmtTime(shown)}`}>
              <circle cx="110" cy="110" r={R} className="trk" />
              <circle cx="110" cy="110" r={R} className="val" strokeDasharray={`${C * Math.max(0, Math.min(1, frac))} ${C}`} transform="rotate(-90 110 110)" />
            </svg>
            <div className="ap-dial-in">
              <small>{s.timerRunning ? "Heating" : active ? "Paused" : "Duration"}</small>
              <b>{fmtTime(shown)}</b>
              <span>Target {s.target}°C</span>
            </div>
          </div>

          <div className="ap-row-btns">
            {s.timerRunning
              ? <button className="btn" onClick={pauseTimer}>Pause</button>
              : <button className="btn" onClick={startTimer}>{active ? "Resume" : "Start"}</button>}
            <button className="btn ghost" onClick={stopTimer} disabled={!active}>Stop</button>
          </div>
        </section>

        <section className="ap-card">
          <h3>Duration</h3>
          <div className="ap-minutes">
            <button onClick={() => setTimerMin(s.timerMin - 1)} disabled={s.timerRunning || s.timerMin <= 1} aria-label="One minute less"><Icon name="minus" /></button>
            <div><b>{s.timerMin}</b><small>min</small></div>
            <button onClick={() => setTimerMin(s.timerMin + 1)} disabled={s.timerRunning || s.timerMin >= 60} aria-label="One minute more"><Icon name="plus" /></button>
          </div>
          <div className="ap-chips">
            {DURATIONS.map((m) => (
              <button key={m} className={s.timerMin === m ? "on" : undefined} disabled={s.timerRunning} onClick={() => setTimerMin(m)}>{m}<small>min</small></button>
            ))}
          </div>
        </section>
      </Gate>
    </>
  );
}
