"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import {
  Leaf,
  ShieldCheck,
  ExternalLink,
  Share2,
  Download,
  Copy,
  CheckCircle,
  Linkedin,
  QrCode,
} from "lucide-react";

// Mock certificate data keyed by ID
const MOCK_CERTIFICATES: Record<
  string,
  {
    rescueId: string;
    mealsServed: number;
    co2Prevented: number;
    vgcMinted: number;
    donorName: string;
    ngoName: string;
    date: string;
    txHash: string;
    foodDescription: string;
    quantityKg: number;
    location: string;
  }
> = {
  "mkt-001": {
    rescueId: "HM-20260307-001",
    mealsServed: 2340,
    co2Prevented: 1.2,
    vgcMinted: 1.2,
    donorName: "Hotel Pearl Palace",
    ngoName: "Aashray Foundation",
    date: "March 7, 2026",
    txHash: "0x7f3a8b2c9d1e4f6a0b3c5d7e9f1a2b4c6d8e0f1a2b3c4d1",
    foodDescription: "Dal Rice & Mixed Vegetables",
    quantityKg: 585,
    location: "MI Road, Jaipur",
  },
  "mkt-002": {
    rescueId: "HM-20260306-042",
    mealsServed: 8400,
    co2Prevented: 4.2,
    vgcMinted: 4.2,
    donorName: "VASHUDHA Treasury",
    ngoName: "Multiple NGOs",
    date: "March 6, 2026",
    txHash: "0x9b2c4d6e8f0a1b3c5d7e9f1a2b4c6d8e0f1a2b3c4df1e8",
    foodDescription: "Aggregate — 210 rescues",
    quantityKg: 2100,
    location: "Jaipur (City-wide)",
  },
  "mkt-003": {
    rescueId: "HM-20260307-015",
    mealsServed: 620,
    co2Prevented: 0.31,
    vgcMinted: 0.31,
    donorName: "Grand Caterers",
    ngoName: "Seva Sadan",
    date: "March 7, 2026",
    txHash: "0x3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2ea7b9",
    foodDescription: "Paneer Biryani & Naan",
    quantityKg: 155,
    location: "Malviya Nagar, Jaipur",
  },
};

const DEFAULT_CERT = {
  rescueId: "HM-20260307-000",
  mealsServed: 160,
  co2Prevented: 0.4,
  vgcMinted: 0.4,
  donorName: "Sample Donor",
  ngoName: "Sample NGO",
  date: "March 7, 2026",
  txHash: "0xabcd1234567890abcdef1234567890abcdef12345678",
  foodDescription: "Mixed Food Items",
  quantityKg: 40,
  location: "Jaipur, Rajasthan",
};

export default function CertificatePage() {
  const params = useParams();
  const id = params.id as string;
  const cert = MOCK_CERTIFICATES[id] || DEFAULT_CERT;
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const shortTx = `${cert.txHash.slice(0, 6)}...${cert.txHash.slice(-4)}`;

  const handleCopyTx = () => {
    navigator.clipboard.writeText(cert.txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareLinkedIn = () => {
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/certificate/${id}`;
    const text = `🌿 Verified Impact: ${cert.mealsServed} meals served, ${cert.co2Prevented}t CO₂ prevented via @VASHUDHA. Blockchain-verified. #ESG #CarbonCredits #FoodRescue`;
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  if (!mounted) return null;

  return (
    <div style={{ background: "#050805", minHeight: "100vh", color: "#f0faf0" }}>
      <Navbar />

      {/* Full page radial gradient background */}
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 20px 80px",
          backgroundImage: [
            "radial-gradient(60% 50% at 50% 50%, rgba(34,197,94,0.12) 0%, rgba(5,8,5,0) 70%)",
            "radial-gradient(40% 40% at 80% 20%, rgba(59,130,246,0.06) 0%, rgba(5,8,5,0) 60%)",
          ].join(","),
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
          style={{
            maxWidth: 480,
            width: "100%",
            borderRadius: 24,
            border: "1px solid rgba(34,197,94,0.35)",
            background: "rgba(13,17,13,0.9)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 0 60px rgba(34,197,94,0.15), 0 0 120px rgba(34,197,94,0.05)",
            overflow: "hidden",
          }}
        >
          {/* Certificate Header */}
          <div
            style={{
              padding: "32px 32px 24px",
              textAlign: "center",
              borderBottom: "1px solid rgba(34,197,94,0.12)",
              backgroundImage:
                "radial-gradient(circle at 50% 0%, rgba(34,197,94,0.08) 0%, transparent 60%)",
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "rgba(34,197,94,0.1)",
                border: "2px solid rgba(34,197,94,0.3)",
                marginBottom: 16,
              }}
            >
              <Leaf size={28} style={{ color: "#22c55e" }} />
            </motion.div>
            <p
              style={{
                fontFamily: "var(--font-bricolage)",
                fontSize: 20,
                fontWeight: 700,
                color: "#f0faf0",
                marginBottom: 4,
              }}
            >
              VASHUDHA
            </p>
            <p
              style={{
                fontSize: 11,
                color: "#86a886",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 600,
              }}
            >
              Verified Impact Certificate
            </p>
          </div>

          {/* Rescue ID Badge */}
          <div style={{ padding: "20px 32px 0", textAlign: "center" }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                display: "inline-block",
                padding: "8px 20px",
                borderRadius: 8,
                border: "1.5px solid rgba(34,197,94,0.3)",
                background: "rgba(34,197,94,0.05)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-jetbrains-mono)",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#22c55e",
                  letterSpacing: "0.02em",
                }}
              >
                RESCUE #{cert.rescueId}
              </span>
            </motion.div>
          </div>

          {/* Impact Numbers */}
          <div style={{ padding: "24px 32px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 12,
                marginBottom: 24,
              }}
            >
              {[
                { icon: "🍱", value: cert.mealsServed.toLocaleString(), label: "Meals Served" },
                { icon: "🌿", value: `${cert.co2Prevented}t`, label: "CO₂ Prevented" },
                { icon: "🪙", value: `${cert.vgcMinted}`, label: "VGC Minted" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  style={{
                    textAlign: "center",
                    padding: "16px 8px",
                    borderRadius: 12,
                    background: "#141a14",
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{stat.icon}</div>
                  <p
                    style={{
                      fontFamily: "var(--font-bricolage)",
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#f0faf0",
                      marginBottom: 2,
                    }}
                  >
                    {stat.value}
                  </p>
                  <p style={{ fontSize: 10, color: "#86a886", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Details */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                padding: "16px",
                borderRadius: 12,
                background: "#141a14",
                marginBottom: 20,
              }}
            >
              {[
                { label: "Donor", value: cert.donorName },
                { label: "NGO", value: cert.ngoName },
                { label: "Food", value: `${cert.foodDescription} — ${cert.quantityKg}kg` },
                { label: "Location", value: cert.location },
                { label: "Date", value: cert.date },
              ].map((row) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#4a664a", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {row.label}
                  </span>
                  <span style={{ fontSize: 13, color: "#f0faf0", fontWeight: 500, textAlign: "right", maxWidth: "65%" }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Transaction Hash */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderRadius: 10,
                background: "rgba(59,130,246,0.06)",
                border: "1px solid rgba(59,130,246,0.15)",
                marginBottom: 20,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ShieldCheck size={14} style={{ color: "#3b82f6" }} />
                <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 12, color: "#3b82f6" }}>
                  TX: {shortTx}
                </span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={handleCopyTx}
                  title="Copy transaction hash"
                  style={{
                    padding: "4px 8px",
                    borderRadius: 6,
                    background: "rgba(59,130,246,0.1)",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    color: "#3b82f6",
                    fontSize: 11,
                  }}
                >
                  {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <a
                  href={`https://amoy.polygonscan.com/tx/${cert.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "4px 8px",
                    borderRadius: 6,
                    background: "rgba(59,130,246,0.1)",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    color: "#3b82f6",
                    fontSize: 11,
                    textDecoration: "none",
                  }}
                >
                  <ExternalLink size={12} /> Polygon
                </a>
              </div>
            </div>

            {/* QR Code placeholder */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div
                style={{
                  display: "inline-flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  padding: "16px 24px",
                  borderRadius: 12,
                  background: "#f0faf0",
                }}
              >
                <div
                  style={{
                    width: 100,
                    height: 100,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#fff",
                    borderRadius: 4,
                    position: "relative",
                  }}
                >
                  {/* Simple QR code representation */}
                  <QrCode size={80} style={{ color: "#050805" }} />
                </div>
              </div>
              <p style={{ fontSize: 11, color: "#4a664a", marginTop: 8 }}>
                Scan to verify on-chain
              </p>
            </div>

            {/* Share Buttons */}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={handleShareLinkedIn}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "12px",
                  borderRadius: 10,
                  background: "#0077B5",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  border: "none",
                  transition: "opacity 0.2s",
                }}
              >
                <Linkedin size={16} /> Share on LinkedIn
              </button>
              <button
                onClick={() => {
                  const url = `${window.location.origin}/certificate/${id}`;
                  navigator.clipboard.writeText(url);
                }}
                style={{
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: "1px solid rgba(34,197,94,0.2)",
                  background: "transparent",
                  color: "#86a886",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                }}
              >
                <Share2 size={14} />
              </button>
              <button
                style={{
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: "1px solid rgba(34,197,94,0.2)",
                  background: "transparent",
                  color: "#86a886",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                }}
              >
                <Download size={14} />
              </button>
            </div>
          </div>

          {/* Footer stamp */}
          <div
            style={{
              padding: "16px 32px",
              borderTop: "1px solid rgba(34,197,94,0.08)",
              textAlign: "center",
              background: "rgba(34,197,94,0.02)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#22c55e",
                  boxShadow: "0 0 8px rgba(34,197,94,0.6)",
                }}
              />
              <span style={{ fontSize: 11, color: "#4a664a" }}>
                Verified on Polygon · Immutable record
              </span>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
