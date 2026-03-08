"use client";

import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SellPage() {
  return (
    <div style={{ background: "#050805", minHeight: "100vh", color: "#f0faf0" }}>
      <Navbar />
      <div style={{ paddingTop: 96, paddingBottom: 80, maxWidth: 560, margin: "0 auto", padding: "96px 20px 80px" }}>
        <Link href="/marketplace" style={{ display: "flex", alignItems: "center", gap: 6, color: "#86a886", fontSize: 13, marginBottom: 32, textDecoration: "none" }}>
          <ArrowLeft size={14} /> Back to Marketplace
        </Link>
        <h1 className="type-section mb-8" style={{ color: "#f0faf0" }}>Sell Your VGC</h1>
        <div style={{ padding: 24, borderRadius: 16, background: "#0d110d", border: "1px solid rgba(34,197,94,0.15)" }}>
          <div style={{ marginBottom: 16, padding: "12px 16px", borderRadius: 10, background: "#141a14" }}>
            <p style={{ fontSize: 12, color: "#86a886" }}>Available Balance</p>
            <p style={{ fontSize: 24, fontWeight: 700, color: "#7c3aed", fontFamily: "var(--font-bricolage)" }}>0.238 VGC <span style={{ fontSize: 13, color: "#86a886", fontWeight: 400 }}>≈ ₹190</span></p>
          </div>
          {[{ label: "Amount to list (VGC)", placeholder: "0.1" }, { label: "Price per VGC (₹)", placeholder: "800" }].map((f) => (
            <div key={f.label} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: "#86a886", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{f.label}</label>
              <input placeholder={f.placeholder} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, background: "#141a14", border: "1px solid rgba(34,197,94,0.2)", color: "#f0faf0", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            </div>
          ))}
          <button style={{ width: "100%", padding: 14, borderRadius: 10, background: "#22c55e", color: "#050805", fontSize: 14, fontWeight: 600, cursor: "pointer", border: "none" }}>
            List for Sale
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
