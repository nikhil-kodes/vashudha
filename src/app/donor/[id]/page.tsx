"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import CountUp from "react-countup";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

const RESCUES = [
  { id: "HM-20260307", food: "Dal Rice 40kg", date: "Mar 7, 2026", meals: 160, vgc: 0.1, status: "delivered", tx: "0x7f3a...c4d1" },
  { id: "HM-20260305", food: "Biryani 25kg", date: "Mar 5, 2026", meals: 100, vgc: 0.063, status: "delivered", tx: "0x9b2c...f1e8" },
  { id: "HM-20260302", food: "Roti 30kg", date: "Mar 2, 2026", meals: 120, vgc: 0.075, status: "delivered", tx: "0x3d4e...a7b9" },
];

export default function DonorDashboard({ params }: { params: { id: string } }) {
  const totalMeals = RESCUES.reduce((s, r) => s + r.meals, 0);
  const totalVGC = RESCUES.reduce((s, r) => s + r.vgc, 0);

  return (
    <div style={{ background: "#050805", minHeight: "100vh", color: "#f0faf0" }}>
      <Navbar />
      <div style={{ paddingTop: 96, paddingBottom: 80, maxWidth: 900, margin: "0 auto", padding: "96px 20px 80px" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8">
            <p className="type-label mb-1" style={{ color: "#22c55e" }}>Donor Dashboard</p>
            <h1 className="type-section" style={{ color: "#f0faf0" }}>Your Impact</h1>
            <p style={{ color: "#86a886", fontSize: 14, marginTop: 4 }}>Donor ID: {params.id}</p>
          </div>

          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
            {[
              { icon: "🍱", label: "Total Meals Served", value: totalMeals, color: "#22c55e" },
              { icon: "🌿", label: "CO₂ Prevented (kg)", value: Math.round(totalMeals / 4 * 2.5), color: "#3b82f6" },
              { icon: "🪙", label: "VGC Balance", value: totalVGC.toFixed(3), color: "#7c3aed", raw: true },
              { icon: "💰", label: "VGC Value (₹)", value: Math.round(totalVGC * 800), color: "#d97706" },
            ].map((stat) => (
              <div key={stat.label} style={{ padding: 20, borderRadius: 16, background: "#0d110d", border: "1px solid rgba(34,197,94,0.12)", textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: stat.color, fontFamily: "var(--font-bricolage)" }}>
                  {stat.raw ? stat.value : <CountUp end={Number(stat.value)} duration={1.5} separator="," />}
                </div>
                <div style={{ fontSize: 12, color: "#86a886", marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Rescue history */}
          <div style={{ borderRadius: 16, background: "#0d110d", border: "1px solid rgba(34,197,94,0.12)", overflow: "hidden", marginBottom: 24 }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(34,197,94,0.1)" }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: "#f0faf0" }}>Rescue History</h2>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#141a14" }}>
                    {["Rescue ID", "Food", "Date", "Meals", "VGC Earned", "Status", "Proof"].map((h) => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, color: "#4a664a", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RESCUES.map((r) => (
                    <tr key={r.id} style={{ borderTop: "1px solid rgba(34,197,94,0.06)" }}>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: "#86a886", fontFamily: "var(--font-jetbrains-mono)" }}>{r.id}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "#f0faf0" }}>{r.food}</td>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: "#86a886" }}>{r.date}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "#22c55e", fontWeight: 600 }}>{r.meals}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "#7c3aed", fontWeight: 600 }}>{r.vgc}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 999, background: "rgba(34,197,94,0.12)", color: "#22c55e", fontWeight: 600, textTransform: "uppercase" }}>{r.status}</span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <Link href={`/certificate/${r.id}`} style={{ fontSize: 11, color: "#3b82f6", display: "flex", alignItems: "center", gap: 4 }}>
                          {r.tx} <ExternalLink size={10} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <Link href="/donate" style={{ flex: 1, padding: "14px", borderRadius: 12, background: "#22c55e", color: "#050805", fontSize: 14, fontWeight: 600, textAlign: "center", display: "block" }}>
              Post More Food
            </Link>
            <Link href="/marketplace/sell" style={{ flex: 1, padding: "14px", borderRadius: 12, border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e", fontSize: 14, fontWeight: 600, textAlign: "center", display: "block" }}>
              Sell My VGC
            </Link>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
