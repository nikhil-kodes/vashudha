"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Brain, TrendingUp, Clock, MapPin, Zap } from "lucide-react";

const PREDICTIONS = [
  { id: "p1", name: "Hotel Pearl Palace", type: "Restaurant", location: "MI Road, Jaipur", time: "Tomorrow at 8:00 PM", quantity: 35, confidence: 87, basis: "6 Friday patterns", accent: "#22c55e" },
  { id: "p2", name: "Grand Caterers", type: "Caterer", location: "Malviya Nagar, Jaipur", time: "Tomorrow at 9:30 PM", quantity: 25, confidence: 74, basis: "3 weekend events", accent: "#3b82f6" },
  { id: "p3", name: "Wedding Hall Deluxe", type: "Wedding Hall", location: "Vaishali Nagar, Jaipur", time: "Day after at 10:00 PM", quantity: 80, confidence: 91, basis: "Event booking confirmed", accent: "#d97706" },
  { id: "p4", name: "Café Spice", type: "Restaurant", location: "C-Scheme, Jaipur", time: "Tomorrow at 3:00 PM", quantity: 12, confidence: 62, basis: "4 lunch patterns", accent: "#7c3aed" },
];

const ACCURACY = [82, 79, 85, 88, 90, 87, 84, 89, 91, 88, 93, 91];

export default function PredictPage() {
  const [autoMode, setAutoMode] = useState(false);
  const [booked, setBooked] = useState<Set<string>>(new Set());

  const handleBook = (id: string) => {
    setBooked((prev) => new Set([...prev, id]));
  };

  return (
    <div style={{ background: "#050805", minHeight: "100vh", color: "#f0faf0" }}>
      <Navbar />
      <div style={{ paddingTop: 96, paddingBottom: 80, maxWidth: 900, margin: "0 auto", padding: "96px 20px 80px" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40 }}>
            <div>
              <p className="type-label mb-2" style={{ color: "#22c55e" }}>AI Engine</p>
              <h1 className="type-section" style={{ color: "#f0faf0" }}>Surplus Predictions</h1>
              <p style={{ color: "#86a886", fontSize: 14, marginTop: 6 }}>Next 24h predicted donors based on historical patterns</p>
            </div>
            {/* Autonomous mode toggle */}
            <div style={{ padding: "16px 20px", borderRadius: 14, background: "#0d110d", border: "1px solid rgba(34,197,94,0.15)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#f0faf0", marginBottom: 2 }}>Autonomous Mode</p>
                  <p style={{ fontSize: 11, color: "#86a886" }}>Auto pre-books if confidence &gt; 80%</p>
                </div>
                <div
                  onClick={() => setAutoMode(!autoMode)}
                  style={{
                    width: 44, height: 24, borderRadius: 12, cursor: "pointer", position: "relative", transition: "all 0.2s",
                    background: autoMode ? "#22c55e" : "#141a14", border: `1px solid ${autoMode ? "#22c55e" : "rgba(34,197,94,0.2)"}`,
                  }}
                >
                  <div style={{
                    position: "absolute", top: 2, left: autoMode ? "calc(100% - 22px)" : 2, width: 18, height: 18, borderRadius: 9,
                    background: "#fff", transition: "all 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                  }} />
                </div>
              </div>
              {autoMode && (
                <p style={{ fontSize: 11, color: "#22c55e", marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
                  <Zap size={10} /> Active — monitoring 4 predictions
                </p>
              )}
            </div>
          </div>

          {/* Prediction cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 16, marginBottom: 40 }}>
            {PREDICTIONS.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                style={{ padding: 20, borderRadius: 16, background: "#0d110d", border: "1px solid rgba(34,197,94,0.12)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Brain size={16} style={{ color: p.accent }} />
                    <span style={{ fontSize: 11, color: "#4a664a", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>AI Prediction</span>
                  </div>
                  {/* Confidence dial */}
                  <div style={{ position: "relative", width: 52, height: 52 }}>
                    <svg width="52" height="52" viewBox="0 0 52 52">
                      <circle cx="26" cy="26" r="20" fill="none" stroke="#141a14" strokeWidth="5" />
                      <circle cx="26" cy="26" r="20" fill="none" stroke={p.accent} strokeWidth="5"
                        strokeDasharray={`${2 * Math.PI * 20 * p.confidence / 100} ${2 * Math.PI * 20 * (1 - p.confidence / 100)}`}
                        strokeDashoffset={2 * Math.PI * 20 * 0.25} strokeLinecap="round" />
                    </svg>
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: p.accent }}>{p.confidence}%</span>
                    </div>
                  </div>
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 600, color: "#f0faf0", marginBottom: 4, fontFamily: "var(--font-bricolage)" }}>{p.name}</h3>
                <p style={{ fontSize: 12, color: "#86a886", marginBottom: 12 }}>{p.type}</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Clock size={12} style={{ color: "#4a664a" }} />
                    <span style={{ fontSize: 12, color: "#86a886" }}>{p.time}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <MapPin size={12} style={{ color: "#4a664a" }} />
                    <span style={{ fontSize: 12, color: "#86a886" }}>{p.location}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <TrendingUp size={12} style={{ color: "#4a664a" }} />
                    <span style={{ fontSize: 12, color: "#86a886" }}>~{p.quantity}kg surplus · Based on {p.basis}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleBook(p.id)}
                  disabled={booked.has(p.id) || (autoMode && p.confidence >= 80)}
                  style={{
                    width: "100%", padding: "10px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: booked.has(p.id) ? "default" : "pointer", border: "none",
                    background: booked.has(p.id) ? "rgba(34,197,94,0.15)" : p.accent,
                    color: booked.has(p.id) ? "#22c55e" : "#050805",
                  }}>
                  {booked.has(p.id) || (autoMode && p.confidence >= 80) ? "✓ NGO Pre-Booked" : "Pre-Book NGO"}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Accuracy history */}
          <div style={{ padding: 24, borderRadius: 16, background: "#0d110d", border: "1px solid rgba(34,197,94,0.12)" }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: "#f0faf0", marginBottom: 16 }}>Prediction Accuracy (Last 12 months)</h2>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
              {ACCURACY.map((v, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ width: "100%", background: `linear-gradient(to top, #22c55e, rgba(34,197,94,0.3))`, borderRadius: "3px 3px 0 0", height: `${(v - 60) / (100 - 60) * 64}px`, minHeight: 4 }} />
                  <span style={{ fontSize: 9, color: "#4a664a" }}>{v}%</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, color: "#4a664a" }}>Apr 2025</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#22c55e" }}>Avg: {Math.round(ACCURACY.reduce((a, b) => a + b) / ACCURACY.length)}% accuracy</span>
              <span style={{ fontSize: 11, color: "#4a664a" }}>Mar 2026</span>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
