"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/shared/Navbar";
import {
  ShieldCheck,
  Users,
  Package,
  Coins,
  TrendingUp,
  CheckCircle,
  XCircle,
  MapPin,
  Search,
  Settings,
  Eye,
  BarChart3,
  ChevronDown,
  Lock,
} from "lucide-react";

// Mock data
const MOCK_RESCUES = [
  { id: "HM-001", donor: "Hotel Pearl Palace", ngo: "Aashray Foundation", quantity: 40, meals: 160, status: "delivered", date: "2026-03-07 19:30", city: "Jaipur" },
  { id: "HM-002", donor: "Grand Caterers", ngo: "Seva Sadan", quantity: 25, meals: 100, status: "collected", date: "2026-03-07 18:45", city: "Jaipur" },
  { id: "HM-003", donor: "Wedding Hall Deluxe", ngo: "Annapurna Trust", quantity: 80, meals: 320, status: "dispatched", date: "2026-03-07 20:00", city: "Jaipur" },
  { id: "HM-004", donor: "Café Spice", ngo: "Food For All", quantity: 12, meals: 48, status: "delivered", date: "2026-03-07 14:20", city: "Jaipur" },
  { id: "HM-005", donor: "Spice Garden", ngo: "Aashray Foundation", quantity: 35, meals: 140, status: "delivered", date: "2026-03-06 21:10", city: "Jaipur" },
  { id: "HM-006", donor: "Royal Feast Caterers", ngo: "Seva Sadan", quantity: 55, meals: 220, status: "posted", date: "2026-03-07 20:30", city: "Jaipur" },
];

const MOCK_NGOS = [
  { id: "n1", name: "Aashray Foundation", status: "active", rescues: 47, city: "Jaipur", joined: "2025-06-15" },
  { id: "n2", name: "Seva Sadan", status: "active", rescues: 32, city: "Jaipur", joined: "2025-08-20" },
  { id: "n3", name: "Annapurna Trust", status: "active", rescues: 28, city: "Jaipur", joined: "2025-09-10" },
  { id: "n4", name: "Food For All", status: "active", rescues: 19, city: "Jaipur", joined: "2025-11-05" },
  { id: "n5", name: "Green Hope NGO", status: "pending", rescues: 0, city: "Jaipur", joined: "2026-03-05" },
];

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  posted: { color: "#d97706", bg: "rgba(217,119,6,0.12)", label: "Posted" },
  dispatched: { color: "#3b82f6", bg: "rgba(59,130,246,0.12)", label: "Dispatched" },
  collected: { color: "#7c3aed", bg: "rgba(124,58,237,0.12)", label: "Collected" },
  delivered: { color: "#22c55e", bg: "rgba(34,197,94,0.12)", label: "Delivered" },
};

const TABS = [
  { label: "Rescues", icon: Package },
  { label: "NGOs", icon: Users },
  { label: "Treasury", icon: Coins },
  { label: "Settings", icon: Settings },
];

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [floorPrice, setFloorPrice] = useState("800");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Simple password auth for hackathon
  const handleLogin = () => {
    if (password === "vashudha2026" || password === "admin") {
      setAuthenticated(true);
    }
  };

  if (!authenticated) {
    return (
      <div style={{ background: "#050805", minHeight: "100vh", color: "#f0faf0" }}>
        <Navbar />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: 20,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              maxWidth: 400,
              width: "100%",
              padding: 32,
              borderRadius: 20,
              background: "#0d110d",
              border: "1px solid rgba(34,197,94,0.15)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.2)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <Lock size={24} style={{ color: "#22c55e" }} />
            </div>
            <h1
              style={{
                fontFamily: "var(--font-bricolage)",
                fontSize: 24,
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              Admin Panel
            </h1>
            <p style={{ fontSize: 13, color: "#86a886", marginBottom: 24 }}>
              Enter the admin password to continue
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="Password"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 10,
                background: "#141a14",
                border: "1px solid rgba(34,197,94,0.2)",
                color: "#f0faf0",
                fontSize: 14,
                outline: "none",
                marginBottom: 12,
                boxSizing: "border-box",
              }}
            />
            <button
              onClick={handleLogin}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 10,
                background: "#22c55e",
                color: "#050805",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                border: "none",
              }}
            >
              Sign In
            </button>
            <p style={{ fontSize: 11, color: "#4a664a", marginTop: 16 }}>
              Hint: &quot;admin&quot; for demo
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  const filteredRescues = MOCK_RESCUES.filter((r) => {
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const matchesSearch =
      !searchTerm ||
      r.donor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.ngo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalMeals = MOCK_RESCUES.filter((r) => r.status === "delivered").reduce((s, r) => s + r.meals, 0);
  const activeRescues = MOCK_RESCUES.filter((r) => r.status !== "delivered").length;

  return (
    <div style={{ background: "#050805", minHeight: "100vh", color: "#f0faf0" }}>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "96px 20px 80px" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <ShieldCheck size={18} style={{ color: "#22c55e" }} />
                <span className="type-label" style={{ color: "#22c55e" }}>Admin Panel</span>
              </div>
              <h1 className="type-section" style={{ color: "#f0faf0" }}>Platform Management</h1>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px rgba(34,197,94,0.5)" }} />
              <span style={{ fontSize: 12, color: "#86a886" }}>Live · {activeRescues} active</span>
            </div>
          </div>

          {/* Overview Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 32 }}>
            {[
              { label: "Total Rescues", value: MOCK_RESCUES.length.toString(), icon: Package, color: "#22c55e" },
              { label: "Meals Served", value: totalMeals.toLocaleString(), icon: BarChart3, color: "#3b82f6" },
              { label: "Active NGOs", value: MOCK_NGOS.filter((n) => n.status === "active").length.toString(), icon: Users, color: "#7c3aed" },
              { label: "VGC Floor Price", value: `₹${floorPrice}`, icon: TrendingUp, color: "#d97706" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  padding: "20px",
                  borderRadius: 14,
                  background: "#0d110d",
                  border: "1px solid rgba(34,197,94,0.12)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <stat.icon size={14} style={{ color: stat.color }} />
                  <span style={{ fontSize: 11, color: "#4a664a", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                    {stat.label}
                  </span>
                </div>
                <p style={{ fontFamily: "var(--font-bricolage)", fontSize: 28, fontWeight: 700, color: stat.color }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Tab Navigation */}
          <div style={{ display: "flex", gap: 4, background: "#0d110d", borderRadius: 12, padding: 4, marginBottom: 24 }}>
            {TABS.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(i)}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "10px 16px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  background: activeTab === i ? "#22c55e" : "transparent",
                  color: activeTab === i ? "#050805" : "#86a886",
                  border: "none",
                }}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 0 && (
              <motion.div
                key="rescues"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {/* Filters */}
                <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
                    <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#4a664a" }} />
                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search rescues..."
                      style={{
                        width: "100%",
                        padding: "10px 14px 10px 36px",
                        borderRadius: 10,
                        background: "#0d110d",
                        border: "1px solid rgba(34,197,94,0.15)",
                        color: "#f0faf0",
                        fontSize: 13,
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div style={{ position: "relative" }}>
                    <button
                      onClick={() => setShowFilterMenu(!showFilterMenu)}
                      style={{
                        padding: "10px 14px",
                        borderRadius: 10,
                        background: "#0d110d",
                        border: "1px solid rgba(34,197,94,0.15)",
                        color: "#86a886",
                        fontSize: 13,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      Status: {statusFilter === "all" ? "All" : STATUS_CONFIG[statusFilter]?.label}
                      <ChevronDown size={12} />
                    </button>
                    {showFilterMenu && (
                      <div
                        style={{
                          position: "absolute",
                          top: "calc(100% + 4px)",
                          right: 0,
                          background: "#141a14",
                          border: "1px solid rgba(34,197,94,0.15)",
                          borderRadius: 10,
                          padding: 4,
                          zIndex: 10,
                          minWidth: 140,
                        }}
                      >
                        {["all", "posted", "dispatched", "collected", "delivered"].map((s) => (
                          <button
                            key={s}
                            onClick={() => { setStatusFilter(s); setShowFilterMenu(false); }}
                            style={{
                              display: "block",
                              width: "100%",
                              padding: "8px 12px",
                              borderRadius: 6,
                              textAlign: "left",
                              background: statusFilter === s ? "rgba(34,197,94,0.08)" : "transparent",
                              color: statusFilter === s ? "#22c55e" : "#86a886",
                              border: "none",
                              fontSize: 12,
                              cursor: "pointer",
                            }}
                          >
                            {s === "all" ? "All Statuses" : STATUS_CONFIG[s]?.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Rescue Table */}
                <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid rgba(34,197,94,0.12)" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#0d110d" }}>
                        {["Rescue ID", "Donor", "NGO", "Qty", "Meals", "Status", "Date", ""].map((h) => (
                          <th key={h} style={{ padding: "12px 16px", fontSize: 11, color: "#4a664a", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, textAlign: "left", borderBottom: "1px solid rgba(34,197,94,0.08)" }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRescues.map((r) => {
                        const sc = STATUS_CONFIG[r.status] || STATUS_CONFIG.posted;
                        return (
                          <tr key={r.id} style={{ borderBottom: "1px solid rgba(34,197,94,0.06)" }}>
                            <td style={{ padding: "12px 16px", fontFamily: "var(--font-jetbrains-mono)", fontSize: 12, color: "#86a886" }}>{r.id}</td>
                            <td style={{ padding: "12px 16px", fontSize: 13, color: "#f0faf0", fontWeight: 500 }}>{r.donor}</td>
                            <td style={{ padding: "12px 16px", fontSize: 13, color: "#86a886" }}>{r.ngo}</td>
                            <td style={{ padding: "12px 16px", fontSize: 13, color: "#86a886" }}>{r.quantity}kg</td>
                            <td style={{ padding: "12px 16px", fontSize: 13, color: "#f0faf0", fontWeight: 600 }}>{r.meals}</td>
                            <td style={{ padding: "12px 16px" }}>
                              <span style={{ padding: "3px 10px", borderRadius: 999, background: sc.bg, color: sc.color, fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}>
                                {sc.label}
                              </span>
                            </td>
                            <td style={{ padding: "12px 16px", fontSize: 12, color: "#4a664a" }}>{r.date}</td>
                            <td style={{ padding: "12px 16px" }}>
                              <button style={{ padding: "4px 8px", borderRadius: 6, background: "rgba(34,197,94,0.08)", border: "none", color: "#22c55e", cursor: "pointer", fontSize: 11 }}>
                                <Eye size={12} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 1 && (
              <motion.div
                key="ngos"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {MOCK_NGOS.map((ngo) => (
                    <div
                      key={ngo.id}
                      style={{
                        padding: 20,
                        borderRadius: 14,
                        background: "#0d110d",
                        border: "1px solid rgba(34,197,94,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 12,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            background: ngo.status === "active" ? "rgba(34,197,94,0.1)" : "rgba(217,119,6,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Users size={18} style={{ color: ngo.status === "active" ? "#22c55e" : "#d97706" }} />
                        </div>
                        <div>
                          <p style={{ fontSize: 15, fontWeight: 600, color: "#f0faf0", marginBottom: 2 }}>{ngo.name}</p>
                          <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#86a886" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <MapPin size={10} /> {ngo.city}
                            </span>
                            <span>{ngo.rescues} rescues</span>
                            <span>Joined: {ngo.joined}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <span
                          style={{
                            padding: "4px 12px",
                            borderRadius: 999,
                            fontSize: 11,
                            fontWeight: 600,
                            textTransform: "uppercase",
                            background: ngo.status === "active" ? "rgba(34,197,94,0.12)" : "rgba(217,119,6,0.12)",
                            color: ngo.status === "active" ? "#22c55e" : "#d97706",
                          }}
                        >
                          {ngo.status === "active" ? "Active" : "Pending Approval"}
                        </span>
                        {ngo.status === "pending" && (
                          <div style={{ display: "flex", gap: 4 }}>
                            <button style={{ padding: "6px 12px", borderRadius: 8, background: "#22c55e", color: "#050805", fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", display: "flex", alignItems: "center", gap: 4 }}>
                              <CheckCircle size={12} /> Approve
                            </button>
                            <button style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(239,68,68,0.12)", color: "#ef4444", fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", display: "flex", alignItems: "center", gap: 4 }}>
                              <XCircle size={12} /> Reject
                            </button>
                          </div>
                        )}
                        {ngo.status === "active" && (
                          <button style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(239,68,68,0.08)", color: "#ef4444", fontSize: 12, cursor: "pointer", border: "1px solid rgba(239,68,68,0.2)" }}>
                            Deactivate
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 2 && (
              <motion.div
                key="treasury"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                  <div style={{ padding: 24, borderRadius: 16, background: "#0d110d", border: "1px solid rgba(34,197,94,0.15)" }}>
                    <p style={{ fontSize: 12, color: "#86a886", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                      Treasury VGC Balance
                    </p>
                    <p style={{ fontFamily: "var(--font-bricolage)", fontSize: 40, fontWeight: 700, color: "#7c3aed" }}>
                      247.6 <span style={{ fontSize: 16, color: "#86a886", fontWeight: 400 }}>VGC</span>
                    </p>
                    <p style={{ fontSize: 13, color: "#86a886", marginTop: 4 }}>≈ ₹1,98,080</p>
                  </div>
                  <div style={{ padding: 24, borderRadius: 16, background: "#0d110d", border: "1px solid rgba(34,197,94,0.15)" }}>
                    <p style={{ fontSize: 12, color: "#86a886", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                      Total VGC Sold
                    </p>
                    <p style={{ fontFamily: "var(--font-bricolage)", fontSize: 40, fontWeight: 700, color: "#22c55e" }}>
                      152.4 <span style={{ fontSize: 16, color: "#86a886", fontWeight: 400 }}>VGC</span>
                    </p>
                    <p style={{ fontSize: 13, color: "#86a886", marginTop: 4 }}>Revenue: ₹1,21,920</p>
                  </div>
                </div>

                {/* Floor Price Editor */}
                <div style={{ padding: 24, borderRadius: 16, background: "#0d110d", border: "1px solid rgba(34,197,94,0.15)", maxWidth: 400 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "#f0faf0", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                    <Coins size={16} style={{ color: "#d97706" }} /> VGC Floor Price
                  </h3>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <div style={{ position: "relative", flex: 1 }}>
                      <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#4a664a", fontSize: 14 }}>₹</span>
                      <input
                        type="number"
                        value={floorPrice}
                        onChange={(e) => setFloorPrice(e.target.value)}
                        style={{ width: "100%", padding: "10px 14px 10px 28px", borderRadius: 10, background: "#141a14", border: "1px solid rgba(34,197,94,0.2)", color: "#f0faf0", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                      />
                    </div>
                    <button style={{ padding: "10px 20px", borderRadius: 10, background: "#22c55e", color: "#050805", fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none", whiteSpace: "nowrap" }}>
                      Update Price
                    </button>
                  </div>
                  <p style={{ fontSize: 11, color: "#4a664a", marginTop: 8 }}>
                    Current: ₹800/VGC · Last updated 2h ago
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 3 && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {/* City Management */}
                <div style={{ padding: 24, borderRadius: 16, background: "#0d110d", border: "1px solid rgba(34,197,94,0.15)", marginBottom: 16, maxWidth: 600 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "#f0faf0", marginBottom: 16 }}>City Management</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { name: "Jaipur", lat: "26.9124", lng: "75.7873", status: "active" },
                    ].map((city) => (
                      <div key={city.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 10, background: "#141a14" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <MapPin size={14} style={{ color: "#22c55e" }} />
                          <span style={{ fontSize: 14, color: "#f0faf0", fontWeight: 500 }}>{city.name}</span>
                          <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: "#4a664a" }}>
                            {city.lat}, {city.lng}
                          </span>
                        </div>
                        <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 10, fontWeight: 600, background: "rgba(34,197,94,0.12)", color: "#22c55e", textTransform: "uppercase" }}>
                          {city.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button style={{ marginTop: 12, padding: "10px 16px", borderRadius: 10, border: "1px dashed rgba(34,197,94,0.2)", background: "transparent", color: "#86a886", fontSize: 13, cursor: "pointer", width: "100%" }}>
                    + Add New City
                  </button>
                </div>

                {/* Platform Config */}
                <div style={{ padding: 24, borderRadius: 16, background: "#0d110d", border: "1px solid rgba(34,197,94,0.15)", maxWidth: 600 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "#f0faf0", marginBottom: 16 }}>Platform Configuration</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      { label: "CO₂ per kg food (kg)", value: "2.5" },
                      { label: "Meals per kg food", value: "4" },
                      { label: "Revenue split (%)", value: "50" },
                    ].map((config) => (
                      <div key={config.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                        <label style={{ fontSize: 13, color: "#86a886", flex: 1 }}>{config.label}</label>
                        <input
                          defaultValue={config.value}
                          style={{ width: 100, padding: "8px 12px", borderRadius: 8, background: "#141a14", border: "1px solid rgba(34,197,94,0.15)", color: "#f0faf0", fontSize: 13, outline: "none", textAlign: "right" }}
                        />
                      </div>
                    ))}
                  </div>
                  <button style={{ marginTop: 16, padding: "10px 20px", borderRadius: 10, background: "#22c55e", color: "#050805", fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none" }}>
                    Save Configuration
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
