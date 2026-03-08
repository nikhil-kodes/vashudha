"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, Wind, Coins, Activity } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { useImpactStats } from "@/hooks/useImpactStats";
import CountUp from "react-countup";

const LiveMap = dynamic(() => import("@/components/map/LiveMap"), { ssr: false });

interface ActivityItem {
  id: string;
  food: string;
  from: string;
  ngo: string;
  meals: number;
  vgc: number;
  time: string;
  status: "dispatched" | "collected" | "delivered";
}

const MOCK: ActivityItem[] = [
  { id: "1", food: "32kg Dal Rice", from: "Hotel Pearl Palace", ngo: "Aashray Foundation", meals: 128, vgc: 0.08, time: "2m ago", status: "delivered" },
  { id: "2", food: "15kg Biryani", from: "Grand Caterers", ngo: "Robin Hood Army", meals: 60, vgc: 0.038, time: "8m ago", status: "collected" },
  { id: "3", food: "40kg Roti", from: "Wedding Hall Deluxe", ngo: "HelpAge India", meals: 160, vgc: 0.1, time: "14m ago", status: "dispatched" },
];

const SC: Record<string, string> = { dispatched: "#3b82f6", collected: "#d97706", delivered: "#22c55e" };

export default function DashboardPage() {
  const { stats } = useImpactStats();
  const [activity, setActivity] = useState<ActivityItem[]>(MOCK);

  useEffect(() => {
    const foods = ["20kg Rice", "12kg Naan", "30kg Khichdi", "10kg Curry"];
    const froms = ["Hotel Horizon", "Café Spice", "Event Palace"];
    const ngos = ["Aashray Foundation", "Robin Hood Army"];
    const interval = setInterval(() => {
      const item: ActivityItem = {
        id: Date.now().toString(),
        food: foods[Math.floor(Math.random() * foods.length)],
        from: froms[Math.floor(Math.random() * froms.length)],
        ngo: ngos[Math.floor(Math.random() * ngos.length)],
        meals: Math.floor(Math.random() * 100) + 20,
        vgc: parseFloat((Math.random() * 0.1 + 0.02).toFixed(3)),
        time: "just now",
        status: "dispatched",
      };
      setActivity((prev) => [item, ...prev.slice(0, 8)]);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ background: "#050805", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Navbar />
      <div style={{ flex: 1, display: "flex", marginTop: 64, overflow: "hidden" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <LiveMap />
        </div>
        <div style={{ width: 300, display: "flex", flexDirection: "column", background: "#0d110d", borderLeft: "1px solid rgba(34,197,94,0.12)", overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(34,197,94,0.1)", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[
              { Icon: Utensils, val: stats.mealsServed, label: "Meals", color: "#22c55e", dec: 0 },
              { Icon: Wind, val: stats.co2Prevented, label: "kg CO2", color: "#3b82f6", dec: 0 },
              { Icon: Coins, val: stats.vgcMinted, label: "VGC", color: "#7c3aed", dec: 1 },
            ].map(({ Icon, val, label, color, dec }, i) => (
              <div key={i} className="text-center">
                <Icon size={14} className="mx-auto mb-1" style={{ color }} />
                <div className="font-bold text-sm" style={{ color, fontFamily: "var(--font-bricolage)" }}>
                  <CountUp end={val} duration={1.5} separator="," decimals={dec} />
                </div>
                <div className="text-xs" style={{ color: "#4a664a" }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(34,197,94,0.08)", display: "flex", alignItems: "center", gap: 8 }}>
            <Activity size={14} style={{ color: "#22c55e" }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#86a886" }}>Live Activity</span>
            <span className="w-2 h-2 rounded-full ml-auto pulse-green" style={{ background: "#22c55e" }} />
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "8px 12px" }}>
            <AnimatePresence initial={false}>
              {activity.map((item) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ padding: 12, marginBottom: 8, borderRadius: 10, background: "#141a14", borderLeft: `4px solid ${SC[item.status]}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#f0faf0" }}>🍱 {item.food}</span>
                    <span style={{ fontSize: 10, color: "#4a664a" }}>{item.time}</span>
                  </div>
                  <p style={{ fontSize: 11, color: "#86a886", marginBottom: 6 }}>{item.from} → {item.ngo}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 500 }}>{item.meals} meals</span>
                    <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 999, background: `${SC[item.status]}20`, color: SC[item.status], textTransform: "uppercase", fontWeight: 600 }}>{item.status}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(34,197,94,0.1)" }}>
            {[["#22c55e", "Available"], ["#3b82f6", "Dispatched"], ["#d97706", "Collected"]].map(([c, l]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ color: c, fontSize: 14 }}>●</span>
                <span style={{ fontSize: 11, color: "#86a886" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
