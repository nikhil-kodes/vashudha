"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Phone,
  CheckCircle,
  Package,
  Truck,
  MapPin,
  Navigation,
  Clock,
  ChevronRight,
  AlertTriangle,
  Flame,
  Users,
  ArrowRight,
  ExternalLink,
  Leaf,
  History,
  Map,
  LayoutGrid,
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { useAuth } from "@/hooks/useAuth";

const NGORouteMap = dynamic(() => import("@/components/map/NGORouteMap"), { ssr: false });
const NeedHeatmap = dynamic(() => import("@/components/map/NeedHeatmap"), { ssr: false });

/* ═══════════════ Mock Data ═══════════════ */

const ACTIVE_RESCUES = [
  {
    id: "HM-20260307-A",
    food: "Dal Rice",
    quantity: "40kg",
    donor: "Hotel Pearl Palace",
    address: "MI Road, Jaipur",
    phone: "+91-9876543210",
    eta: 18,
    meals: 160,
    vgc: 0.1,
    status: "dispatched" as const,
    urgency: "high" as const,
    expiresIn: "2h 15m",
  },
  {
    id: "HM-20260307-B",
    food: "Biryani & Raita",
    quantity: "25kg",
    donor: "Grand Caterers",
    address: "Vaishali Nagar, Jaipur",
    phone: "+91-9812345678",
    eta: 32,
    meals: 100,
    vgc: 0.063,
    status: "pending" as const,
    urgency: "critical" as const,
    expiresIn: "45m",
  },
  {
    id: "HM-20260307-C",
    food: "Mixed Sabzi & Roti",
    quantity: "15kg",
    donor: "Hostel Food Court",
    address: "University Campus, Jaipur",
    phone: "+91-9898765432",
    eta: 45,
    meals: 60,
    vgc: 0.038,
    status: "pending" as const,
    urgency: "medium" as const,
    expiresIn: "5h 30m",
  },
];

const PAST_RESCUES = [
  { id: "HM-20260306-A", food: "Paneer Curry 30kg", donor: "Hotel Horizon", meals: 120, vgc: 0.075, date: "Yesterday" },
  { id: "HM-20260305-A", food: "Rice & Dal 50kg", donor: "Wedding Hall Deluxe", meals: 200, vgc: 0.125, date: "2 days ago" },
  { id: "HM-20260304-A", food: "Chole Bhature 20kg", donor: "Shree Caterers", meals: 80, vgc: 0.05, date: "3 days ago" },
];

const STEPS = [
  { key: "dispatched", label: "On the way", icon: Truck },
  { key: "collected", label: "Collected", icon: Package },
  { key: "delivering", label: "Delivering", icon: Navigation },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

type TabKey = "rescues" | "heatmap" | "history";

/* ═══════════════ Main Page ═══════════════ */

export default function NGOPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("rescues");
  const [selectedRescue, setSelectedRescue] = useState<string | null>(ACTIVE_RESCUES[0]?.id || null);
  const [stepIndices, setStepIndices] = useState<Record<string, number>>({});
  const [completedRescues, setCompletedRescues] = useState<Set<string>>(new Set());
  const [selectedDeliveryPoint, setSelectedDeliveryPoint] = useState<any>(null);

  const { user } = useAuth();

  const getStepIndex = (rescueId: string) => stepIndices[rescueId] || 0;

  const handleNext = useCallback((rescueId: string) => {
    const current = stepIndices[rescueId] || 0;
    if (current >= STEPS.length - 1) {
      setCompletedRescues((prev) => new Set(prev).add(rescueId));
    } else {
      setStepIndices((prev) => ({ ...prev, [rescueId]: current + 1 }));
    }
  }, [stepIndices]);

  const activeRescue = ACTIVE_RESCUES.find((r) => r.id === selectedRescue);

  const urgencyConfig = {
    critical: { color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.15)", label: "CRITICAL" },
    high: { color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.15)", label: "URGENT" },
    medium: { color: "#22c55e", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.15)", label: "STANDARD" },
  };

  const TABS: { key: TabKey; label: string; icon: any }[] = [
    { key: "rescues", label: "Active Rescues", icon: LayoutGrid },
    { key: "heatmap", label: "Need Heatmap", icon: Map },
    { key: "history", label: "History", icon: History },
  ];

  return (
    <div style={{ background: "#050805", minHeight: "100vh", color: "#f0faf0" }}>
      <Navbar />

      {/* ═══ Header ═══ */}
      <div
        className="border-b"
        style={{ paddingTop: 80, borderColor: "rgba(34,197,94,0.08)" }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "#4a664a" }}>
                NGO Volunteer Dashboard
              </p>
              <h1
                className="text-xl font-bold"
                style={{ fontFamily: "var(--font-bricolage)" }}
              >
                {user ? `Welcome, ${user.name}` : "Food Rescue Operations"}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
                style={{
                  background: "rgba(34,197,94,0.06)",
                  border: "1px solid rgba(34,197,94,0.12)",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: "#22c55e", boxShadow: "0 0 6px rgba(34,197,94,0.6)" }}
                />
                <span style={{ color: "#86a886" }}>
                  {ACTIVE_RESCUES.length} active
                </span>
              </div>
            </div>
          </div>

          {/* Tab navigation */}
          <div className="flex gap-1 mt-4 -mb-px">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium transition-all rounded-t-lg"
                  style={{
                    color: isActive ? "#f0faf0" : "#4a664a",
                    background: isActive ? "#0a0f0a" : "transparent",
                    borderBottom: isActive ? "2px solid #22c55e" : "2px solid transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <Icon size={14} />
                  {tab.label}
                  {tab.key === "rescues" && (
                    <span
                      className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                      style={{
                        background: "rgba(34,197,94,0.15)",
                        color: "#22c55e",
                      }}
                    >
                      {ACTIVE_RESCUES.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══ Tab Content ═══ */}
      <div className="max-w-6xl mx-auto px-4 py-5">
        <AnimatePresence mode="wait">
          {/* ─── Tab: Active Rescues ─── */}
          {activeTab === "rescues" && (
            <motion.div
              key="rescues"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid gap-4"
              style={{ gridTemplateColumns: "340px 1fr" }}
            >
              {/* Left: Rescue list */}
              <div className="space-y-2">
                {ACTIVE_RESCUES.map((rescue) => {
                  const isSelected = selectedRescue === rescue.id;
                  const isCompleted = completedRescues.has(rescue.id);
                  const urg = urgencyConfig[rescue.urgency];
                  const stepIdx = getStepIndex(rescue.id);

                  return (
                    <motion.button
                      key={rescue.id}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedRescue(rescue.id)}
                      className="w-full text-left p-4 rounded-xl transition-all"
                      style={{
                        background: isSelected ? "#0a0f0a" : "#0d110d",
                        border: isSelected
                          ? `1px solid ${urg.color}40`
                          : "1px solid rgba(34,197,94,0.06)",
                        cursor: "pointer",
                        opacity: isCompleted ? 0.5 : 1,
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase"
                            style={{ background: urg.bg, color: urg.color, border: `1px solid ${urg.border}` }}
                          >
                            {isCompleted ? "✓ DONE" : urg.label}
                          </span>
                          <span className="text-[10px] font-mono" style={{ color: "#4a664a" }}>
                            {rescue.id}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px]" style={{ color: "#4a664a" }}>
                          <Clock size={10} />
                          {rescue.expiresIn}
                        </div>
                      </div>

                      <p className="text-sm font-semibold mb-0.5" style={{ fontFamily: "var(--font-bricolage)" }}>
                        {rescue.food} — {rescue.quantity}
                      </p>
                      <p className="text-xs mb-2" style={{ color: "#86a886" }}>
                        {rescue.donor}
                      </p>

                      {/* Mini step indicator */}
                      <div className="flex gap-1">
                        {STEPS.map((_, i) => (
                          <div
                            key={i}
                            className="flex-1 h-1 rounded-full"
                            style={{
                              background: i <= stepIdx || isCompleted
                                ? urg.color
                                : "#141a14",
                            }}
                          />
                        ))}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Right: Selected rescue details + map */}
              {activeRescue && !completedRescues.has(activeRescue.id) && (
                <div className="space-y-4">
                  {/* Map */}
                  <div
                    className="rounded-xl overflow-hidden"
                    style={{
                      height: 280,
                      background: "#0a0f0a",
                      border: "1px solid rgba(34,197,94,0.06)",
                    }}
                  >
                    <NGORouteMap />
                  </div>

                  {/* Details card */}
                  <div
                    className="rounded-xl p-5"
                    style={{
                      background: "#0a0f0a",
                      border: "1px solid rgba(34,197,94,0.06)",
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3
                          className="text-lg font-bold"
                          style={{ fontFamily: "var(--font-bricolage)" }}
                        >
                          🍱 {activeRescue.food} — {activeRescue.quantity}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin size={13} style={{ color: "#22c55e" }} />
                          <span className="text-xs" style={{ color: "#86a886" }}>
                            {activeRescue.donor} · {activeRescue.address}
                          </span>
                        </div>
                      </div>
                      <a
                        href={`tel:${activeRescue.phone}`}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium"
                        style={{
                          background: "rgba(59,130,246,0.08)",
                          border: "1px solid rgba(59,130,246,0.2)",
                          color: "#3b82f6",
                          textDecoration: "none",
                        }}
                      >
                        <Phone size={13} />
                        Call Donor
                      </a>
                    </div>

                    {/* Navigate button */}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activeRescue.address + ", Jaipur")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold mb-4"
                      style={{
                        background: "rgba(59,130,246,0.1)",
                        border: "1px solid rgba(59,130,246,0.2)",
                        color: "#3b82f6",
                        textDecoration: "none",
                      }}
                    >
                      <Navigation size={15} />
                      Open in Google Maps
                      <ExternalLink size={12} />
                    </a>

                    {/* ETA + Impact */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div
                        className="rounded-lg p-3 text-center"
                        style={{ background: "#141a14" }}
                      >
                        <p className="text-lg font-bold" style={{ fontFamily: "var(--font-bricolage)", color: "#f0faf0" }}>
                          {activeRescue.eta}
                        </p>
                        <p className="text-[10px]" style={{ color: "#4a664a" }}>min ETA</p>
                      </div>
                      <div
                        className="rounded-lg p-3 text-center"
                        style={{ background: "#141a14" }}
                      >
                        <p className="text-lg font-bold" style={{ fontFamily: "var(--font-bricolage)", color: "#22c55e" }}>
                          {activeRescue.meals}
                        </p>
                        <p className="text-[10px]" style={{ color: "#4a664a" }}>meals</p>
                      </div>
                      <div
                        className="rounded-lg p-3 text-center"
                        style={{ background: "#141a14" }}
                      >
                        <p className="text-lg font-bold" style={{ fontFamily: "var(--font-bricolage)", color: "#7c3aed" }}>
                          {activeRescue.vgc}
                        </p>
                        <p className="text-[10px]" style={{ color: "#4a664a" }}>VGC</p>
                      </div>
                    </div>

                    {/* Status stepper */}
                    <div className="flex gap-1 mb-4">
                      {STEPS.map((step, i) => {
                        const StepIcon = step.icon;
                        const stepIdx = getStepIndex(activeRescue.id);
                        const isDone = i < stepIdx;
                        const isCurrent = i === stepIdx;
                        const urg = urgencyConfig[activeRescue.urgency];

                        return (
                          <div
                            key={step.key}
                            className="flex-1 flex flex-col items-center gap-1 py-2.5 px-1 rounded-lg"
                            style={{
                              background: isCurrent ? urg.color : isDone ? `${urg.color}20` : "#141a14",
                              border: `1px solid ${isCurrent ? urg.color : isDone ? `${urg.color}40` : "rgba(34,197,94,0.06)"}`,
                            }}
                          >
                            <StepIcon
                              size={14}
                              style={{
                                color: isCurrent ? "#050805" : isDone ? urg.color : "#4a664a",
                              }}
                            />
                            <span
                              className="text-[9px] font-semibold uppercase tracking-wide"
                              style={{
                                color: isCurrent ? "#050805" : isDone ? urg.color : "#4a664a",
                              }}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Action button */}
                    <button
                      onClick={() => handleNext(activeRescue.id)}
                      className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                      style={{
                        background: `linear-gradient(135deg, ${urgencyConfig[activeRescue.urgency].color}, ${urgencyConfig[activeRescue.urgency].color}cc)`,
                        color: "#050805",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: `0 0 20px ${urgencyConfig[activeRescue.urgency].color}30`,
                      }}
                    >
                      {(() => {
                        const idx = getStepIndex(activeRescue.id);
                        const StIcon = STEPS[idx].icon;
                        return (
                          <>
                            <StIcon size={18} />
                            {idx === 0
                              ? "I'm On My Way"
                              : idx === 1
                              ? "I've Collected The Food"
                              : idx === 2
                              ? "I'm Delivering Now"
                              : "Mark as Delivered ✓"}
                          </>
                        );
                      })()}
                    </button>
                  </div>
                </div>
              )}

              {/* Completed state */}
              {activeRescue && completedRescues.has(activeRescue.id) && (
                <div
                  className="rounded-xl p-8 flex flex-col items-center text-center"
                  style={{ background: "#0a0f0a", border: "1px solid rgba(34,197,94,0.15)" }}
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <CheckCircle size={48} style={{ color: "#22c55e", marginBottom: 16 }} />
                    <h2
                      className="text-2xl font-bold mb-2"
                      style={{ fontFamily: "var(--font-bricolage)", color: "#22c55e" }}
                    >
                      {activeRescue.meals} meals served!
                    </h2>
                    <p className="text-sm mb-1" style={{ color: "#86a886" }}>
                      {activeRescue.vgc} VGC minted and credited
                    </p>
                    <p className="text-xs mb-6" style={{ color: "#4a664a" }}>
                      Rescue #{activeRescue.id}
                    </p>
                    <Link
                      href={`/certificate/${activeRescue.id}`}
                      className="px-6 py-3 rounded-xl text-sm font-semibold"
                      style={{
                        background: "#22c55e",
                        color: "#050805",
                        textDecoration: "none",
                      }}
                    >
                      View Certificate
                    </Link>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}

          {/* ─── Tab: Need Heatmap ─── */}
          {activeTab === "heatmap" && (
            <motion.div
              key="heatmap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-4">
                <h2
                  className="text-lg font-bold mb-1"
                  style={{ fontFamily: "var(--font-bricolage)" }}
                >
                  🔥 Need Heatmap — Jaipur
                </h2>
                <p className="text-xs" style={{ color: "#86a886" }}>
                  Shows areas with high food insecurity. Red zones indicate slum clusters and settlements where food delivery is most needed.
                </p>
              </div>

              <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 320px" }}>
                {/* Heatmap */}
                <div
                  className="rounded-xl overflow-hidden"
                  style={{
                    height: 500,
                    border: "1px solid rgba(34,197,94,0.06)",
                  }}
                >
                  <NeedHeatmap
                    height="100%"
                    showDeliveryPoints
                    selectedPointLabel={selectedDeliveryPoint?.label}
                    onDeliverySelect={setSelectedDeliveryPoint}
                  />
                </div>

                {/* Delivery points sidebar */}
                <div className="space-y-2">
                  <p
                    className="text-[10px] uppercase tracking-wider font-medium mb-2"
                    style={{ color: "#4a664a" }}
                  >
                    Priority Delivery Zones
                  </p>

                  {/* Delivery point cards pulled from heatmap */}
                  {[
                    { label: "Sitapura Industrial Camp", people: "~3,100 families", urgency: "critical", lat: 26.796, lng: 75.84 },
                    { label: "Jagatpura Slum Colony", people: "~2,400 families", urgency: "critical", lat: 26.835, lng: 75.823 },
                    { label: "Galta Gate Settlement", people: "~1,800 families", urgency: "high", lat: 26.925, lng: 75.855 },
                    { label: "Jhotwara Basti", people: "~1,500 families", urgency: "high", lat: 26.935, lng: 75.748 },
                    { label: "Mansarovar B-Block Slum", people: "~1,200 families", urgency: "high", lat: 26.868, lng: 75.758 },
                    { label: "Vidhyadhar Nagar Colony", people: "~900 families", urgency: "medium", lat: 26.947, lng: 75.795 },
                  ].map((zone) => {
                    const isSelected = selectedDeliveryPoint?.label === zone.label;
                    const urg = urgencyConfig[zone.urgency as keyof typeof urgencyConfig];

                    return (
                      <button
                        key={zone.label}
                        onClick={() => setSelectedDeliveryPoint(zone)}
                        className="w-full text-left p-3 rounded-xl transition-all"
                        style={{
                          background: isSelected ? `${urg.color}08` : "#0a0f0a",
                          border: isSelected
                            ? `1px solid ${urg.color}30`
                            : "1px solid rgba(34,197,94,0.06)",
                          cursor: "pointer",
                        }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase"
                            style={{ background: urg.bg, color: urg.color }}
                          >
                            {urg.label}
                          </span>
                          <span className="text-[10px]" style={{ color: "#4a664a" }}>
                            {zone.people}
                          </span>
                        </div>
                        <p className="text-xs font-medium" style={{ color: "#f0faf0" }}>
                          {zone.label}
                        </p>

                        {isSelected && (
                          <motion.a
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            href={`https://www.google.com/maps/dir/?api=1&destination=${zone.lat},${zone.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 w-full py-2 mt-2 rounded-lg text-[11px] font-semibold"
                            style={{
                              background: urg.color,
                              color: "#050805",
                              textDecoration: "none",
                            }}
                          >
                            <Navigation size={11} />
                            Navigate to this zone
                          </motion.a>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Info cards */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div
                  className="rounded-xl p-4"
                  style={{ background: "#0a0f0a", border: "1px solid rgba(34,197,94,0.06)" }}
                >
                  <Flame size={16} style={{ color: "#ef4444", marginBottom: 8 }} />
                  <h4 className="text-xs font-semibold mb-1" style={{ fontFamily: "var(--font-bricolage)" }}>
                    Critical Zones
                  </h4>
                  <p className="text-[11px]" style={{ color: "#86a886" }}>
                    Red areas have the highest concentration of underserved communities, prioritize deliveries here.
                  </p>
                </div>
                <div
                  className="rounded-xl p-4"
                  style={{ background: "#0a0f0a", border: "1px solid rgba(34,197,94,0.06)" }}
                >
                  <Users size={16} style={{ color: "#f59e0b", marginBottom: 8 }} />
                  <h4 className="text-xs font-semibold mb-1" style={{ fontFamily: "var(--font-bricolage)" }}>
                    Population Data
                  </h4>
                  <p className="text-[11px]" style={{ color: "#86a886" }}>
                    Heatmap intensity is based on census data, slum surveys, and NGO field reports.
                  </p>
                </div>
                <div
                  className="rounded-xl p-4"
                  style={{ background: "#0a0f0a", border: "1px solid rgba(34,197,94,0.06)" }}
                >
                  <Navigation size={16} style={{ color: "#3b82f6", marginBottom: 8 }} />
                  <h4 className="text-xs font-semibold mb-1" style={{ fontFamily: "var(--font-bricolage)" }}>
                    Smart Routing
                  </h4>
                  <p className="text-[11px]" style={{ color: "#86a886" }}>
                    Click any delivery point to open navigation and reach the families in need.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── Tab: History ─── */}
          {activeTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-4">
                <h2
                  className="text-lg font-bold mb-1"
                  style={{ fontFamily: "var(--font-bricolage)" }}
                >
                  Rescue History
                </h2>
                <p className="text-xs" style={{ color: "#86a886" }}>
                  Your past food rescue missions and impact summary.
                </p>
              </div>

              {/* Impact summary */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                {[
                  { label: "Total Rescues", value: "47", color: "#f0faf0" },
                  { label: "Meals Served", value: "18,800", color: "#22c55e" },
                  { label: "CO₂ Prevented", value: "11.75t", color: "#3b82f6" },
                  { label: "VGC Earned", value: "11.75", color: "#7c3aed" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl p-4 text-center"
                    style={{ background: "#0a0f0a", border: "1px solid rgba(34,197,94,0.06)" }}
                  >
                    <p
                      className="text-xl font-bold mb-1"
                      style={{ fontFamily: "var(--font-bricolage)", color: stat.color }}
                    >
                      {stat.value}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: "#4a664a" }}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* History list */}
              <div className="space-y-2">
                {PAST_RESCUES.map((rescue) => (
                  <div
                    key={rescue.id}
                    className="flex items-center justify-between p-4 rounded-xl"
                    style={{ background: "#0a0f0a", border: "1px solid rgba(34,197,94,0.06)" }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.12)" }}
                      >
                        <CheckCircle size={18} style={{ color: "#22c55e" }} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{rescue.food}</p>
                        <p className="text-xs" style={{ color: "#86a886" }}>
                          {rescue.donor} · {rescue.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <p className="text-sm font-bold" style={{ color: "#22c55e", fontFamily: "var(--font-bricolage)" }}>
                          {rescue.meals}
                        </p>
                        <p className="text-[10px]" style={{ color: "#4a664a" }}>meals</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: "#7c3aed", fontFamily: "var(--font-bricolage)" }}>
                          {rescue.vgc}
                        </p>
                        <p className="text-[10px]" style={{ color: "#4a664a" }}>VGC</p>
                      </div>
                      <Link
                        href={`/certificate/${rescue.id}`}
                        className="px-3 py-1.5 rounded-lg text-[10px] font-medium"
                        style={{
                          background: "rgba(34,197,94,0.06)",
                          border: "1px solid rgba(34,197,94,0.1)",
                          color: "#86a886",
                          textDecoration: "none",
                        }}
                      >
                        Cert
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
