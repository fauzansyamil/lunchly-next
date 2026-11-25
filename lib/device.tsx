"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, ReactNode } from "react";
import type { ProductId } from "./data";

/* Simulated Lunchly device. No real Bluetooth: everything below is a demo model. */

export type Profile = { name: string; email: string; phone: string };
export type Notif = { ready: boolean; low: boolean; charged: boolean; tips: boolean };
export type Dev = {
  connected: boolean; connecting: boolean; sheet: boolean;
  heater: boolean; target: number; temp: number;
  battery: number; charging: boolean;
  timerMin: number; remaining: number; timerRunning: boolean;
  bank: boolean; phone: number;
  color: ProductId; profile: Profile; notif: Notif; lowWarned: boolean;
};

export const AMBIENT = 28;
export const MIN_T = 40;
export const MAX_T = 75;
export const RESERVE = 10;

const DEFAULT: Dev = {
  connected: false, connecting: false, sheet: false,
  heater: false, target: 60, temp: AMBIENT,
  battery: 78, charging: false,
  timerMin: 10, remaining: 0, timerRunning: false,
  bank: false, phone: 34,
  color: "sage", lowWarned: false,
  profile: { name: "Alex Rahman", email: "alex@example.com", phone: "+62 812 3456 7890" },
  notif: { ready: true, low: true, charged: true, tips: false },
};
const KEY = "lunchly-app-v1";
const PERSIST: (keyof Dev)[] = ["battery", "phone", "target", "timerMin", "color", "profile", "notif"];
const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));

function load(): Dev {
  const d = { ...DEFAULT };
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "{}");
    for (const k of PERSIST) {
      if (raw[k] !== undefined && typeof raw[k] === typeof DEFAULT[k]) (d as Record<string, unknown>)[k] = raw[k];
    }
    d.battery = clamp(Number(d.battery) || 0, 0, 100);
    d.phone = clamp(Number(d.phone) || 0, 0, 100);
    d.target = clamp(Math.round(d.target), MIN_T, MAX_T);
    d.timerMin = clamp(Math.round(d.timerMin), 1, 60);
    if (!["brick", "sage", "lilac"].includes(d.color)) d.color = "sage";
  } catch {}
  return d;
}

function tick(s: Dev, say: string[]): Dev {
  const n = { ...s };
  // timer
  if (n.timerRunning) {
    n.heater = true;
    n.remaining = Math.max(0, n.remaining - 1);
    if (n.remaining === 0) {
      n.timerRunning = false; n.heater = false;
      if (n.notif.ready) say.push("Your meal is ready. Enjoy!");
    }
  }
  // temperature
  if (n.heater) n.temp += clamp(n.target - n.temp, -0.4, 0.4);
  else n.temp += clamp(AMBIENT - n.temp, -0.08, 0.08);
  // battery
  if (n.heater) n.battery -= 0.04;
  if (n.charging) {
    n.battery += 0.15;
    if (n.battery >= 100) { n.battery = 100; n.charging = false; if (n.notif.charged) say.push("Fully charged."); }
  }
  if (n.bank) {
    if (n.battery <= RESERVE) { n.bank = false; say.push("Power bank stopped. Lunchly keeps 10% for heating."); }
    else { n.battery -= 0.06; n.phone = Math.min(100, n.phone + 0.12); if (n.phone >= 100) { n.bank = false; say.push("Your phone is fully charged."); } }
  }
  n.battery = clamp(n.battery, 0, 100);
  if (n.battery <= 3 && n.heater) { n.heater = false; n.timerRunning = false; say.push("Battery empty. Heater switched off."); }
  if (n.battery < 15 && !n.lowWarned) { n.lowWarned = true; if (n.notif.low) say.push("Battery low. Plug in a charger."); }
  if (n.battery > 20) n.lowWarned = false;
  return n;
}

type Ctx = {
  s: Dev; toast: string;
  openConnect: () => void; closeConnect: () => void; connect: () => void; disconnect: () => void;
  setHeater: (on: boolean) => boolean; setTarget: (t: number) => void;
  setTimerMin: (m: number) => void; startTimer: () => void; pauseTimer: () => void; stopTimer: () => void;
  setCharging: (on: boolean) => void; setBank: (on: boolean) => void;
  setColor: (c: ProductId) => void; setProfile: (p: Profile) => void; setNotif: (k: keyof Notif, v: boolean) => void;
  notify: (m: string) => void; reset: () => void;
};
const DevCtx = createContext<Ctx | null>(null);

export function DeviceProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<Dev>(DEFAULT);
  const [toast, setToast] = useState("");
  const ref = useRef<Dev>(DEFAULT);
  const toastT = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const connT = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const set = useCallback((fn: (d: Dev) => Dev) => { const n = fn(ref.current); ref.current = n; setS(n); }, []);
  const notify = useCallback((m: string) => {
    setToast(m); clearTimeout(toastT.current);
    toastT.current = setTimeout(() => setToast(""), 3200);
  }, []);

  useEffect(() => { const d = load(); ref.current = d; setS(d); }, []);
  useEffect(() => {
    const id = setInterval(() => {
      const say: string[] = [];
      const n = tick(ref.current, say);
      ref.current = n; setS(n);
      if (say.length) notify(say[0]);
    }, 1000);
    return () => { clearInterval(id); clearTimeout(connT.current); clearTimeout(toastT.current); };
  }, [notify]);
  useEffect(() => {
    try {
      const o: Record<string, unknown> = {};
      PERSIST.forEach((k) => (o[k] = s[k]));
      localStorage.setItem(KEY, JSON.stringify(o));
    } catch {}
  }, [s]);

  const value = useMemo<Ctx>(() => ({
    s, toast, notify,
    openConnect: () => set((d) => ({ ...d, sheet: true })),
    closeConnect: () => { clearTimeout(connT.current); set((d) => ({ ...d, sheet: false, connecting: false })); },
    connect: () => {
      set((d) => ({ ...d, connecting: true }));
      clearTimeout(connT.current);
      connT.current = setTimeout(() => {
        set((d) => ({ ...d, connecting: false, connected: true, sheet: false }));
        notify("Connected to Lunchly · 7A2F (demo device)");
      }, 1800);
    },
    disconnect: () => { set((d) => ({ ...d, connected: false, heater: false, timerRunning: false })); notify("Disconnected"); },
    setHeater: (on) => {
      if (!ref.current.connected) { set((d) => ({ ...d, sheet: true })); return false; }
      if (on && ref.current.battery <= 3) { notify("Battery is empty. Plug in a charger first."); return false; }
      set((d) => ({ ...d, heater: on, timerRunning: on ? d.timerRunning : false })); return true;
    },
    setTarget: (t) => set((d) => ({ ...d, target: clamp(Math.round(t), MIN_T, MAX_T) })),
    setTimerMin: (m) => set((d) => ({ ...d, timerMin: clamp(Math.round(m), 1, 60), remaining: d.timerRunning ? d.remaining : 0 })),
    startTimer: () => {
      if (!ref.current.connected) { set((d) => ({ ...d, sheet: true })); return; }
      set((d) => ({ ...d, timerRunning: true, heater: true, remaining: d.remaining > 0 ? d.remaining : d.timerMin * 60 }));
    },
    pauseTimer: () => set((d) => ({ ...d, timerRunning: false })),
    stopTimer: () => set((d) => ({ ...d, timerRunning: false, remaining: 0, heater: false })),
    setCharging: (on) => {
      if (on && ref.current.battery >= 100) { notify("Already fully charged."); return; }
      set((d) => ({ ...d, charging: on }));
    },
    setBank: (on) => {
      if (on && ref.current.battery <= RESERVE) { notify("Lunchly needs more than 10% battery to charge a phone."); return; }
      set((d) => ({ ...d, bank: on, phone: on && d.phone >= 100 ? 20 : d.phone }));
    },
    setColor: (c) => set((d) => ({ ...d, color: c })),
    setProfile: (p) => set((d) => ({ ...d, profile: p })),
    setNotif: (k, v) => set((d) => ({ ...d, notif: { ...d.notif, [k]: v } })),
    reset: () => { try { localStorage.removeItem(KEY); } catch {} const d = { ...DEFAULT }; ref.current = d; setS(d); notify("Demo reset"); },
  }), [s, toast, notify, set]);

  return <DevCtx.Provider value={value}>{children}</DevCtx.Provider>;
}

export function useDevice() {
  const c = useContext(DevCtx);
  if (!c) throw new Error("useDevice must be used inside DeviceProvider");
  return c;
}

export const fmtTime = (sec: number) => `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
