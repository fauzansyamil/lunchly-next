"use client";
import { useDevice } from "@/lib/device";
import Icon from "./Icon";

/* Shows a "not connected" card above content that needs the device. */
export default function Gate({ children }: { children: React.ReactNode }) {
  const { s, openConnect } = useDevice();
  return (
    <>
      {!s.connected && (
        <div className="ap-card ap-gate">
          <div className="ap-sticker sm"><Icon name="bluetooth" size={22} /></div>
          <div>
            <h3>Lunchly isn’t connected</h3>
            <p>Connect over Bluetooth to control your lunch box.</p>
          </div>
          <button className="btn" onClick={openConnect}>Connect</button>
        </div>
      )}
      <div className={s.connected ? undefined : "ap-dim"} aria-disabled={!s.connected}>{children}</div>
    </>
  );
}
