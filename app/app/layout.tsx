import type { Metadata } from "next";
import { DeviceProvider } from "@/lib/device";
import AppShell from "@/components/app/AppShell";
import "./app.css";

export const metadata: Metadata = {
  title: { default: "Lunchly App", template: "%s | Lunchly App" },
  description: "Lunchly companion app demo: control temperature, timer, battery and power bank of your Smart Heated Lunch Box.",
  appleWebApp: { capable: true, title: "Lunchly", statusBarStyle: "black-translucent" },
  robots: { index: false },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <DeviceProvider>
      <AppShell>{children}</AppShell>
    </DeviceProvider>
  );
}
