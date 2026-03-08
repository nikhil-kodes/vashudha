"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import Link from "next/link";
import {
  Leaf,
  ArrowRight,
  UtensilsCrossed,
  Brain,
  ShieldCheck,
  Coins,
  Truck,
  BarChart3,
  Globe,
  Sprout,
  Heart,
  TrendingUp,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  }),
};

const STEPS = [
  {
    icon: UtensilsCrossed,
    title: "Post Surplus Food",
    description: "Restaurants, caterers, and wedding halls post surplus food in under 60 seconds with quantity, expiry, and pickup location.",
    color: "#22c55e",
  },
  {
    icon: Brain,
    title: "AI Matching",
    description: "Our AI engine instantly matches the listing with the nearest available NGO based on route optimization and capacity.",
    color: "#3b82f6",
  },
  {
    icon: Truck,
    title: "NGO Dispatch & Collection",
    description: "The NGO receives a dispatch notification, navigates to the pickup point, collects the food, and delivers it to those in need.",
    color: "#7c3aed",
  },
  {
    icon: ShieldCheck,
    title: "Blockchain Verification",
    description: "Every rescue generates an immutable MRV (Monitoring, Reporting & Verification) record on Polygon blockchain.",
    color: "#3b82f6",
  },
  {
    icon: Coins,
    title: "VGC Token Minting",
    description: "Verified impact is converted to VGC (VASHUDHA Green Credits) — pre-verified carbon tokens backed by real meal rescues.",
    color: "#d97706",
  },
  {
    icon: BarChart3,
    title: "Carbon Marketplace",
    description: "Companies purchase VGC for ESG compliance. Revenue is split 50/50 between donors and VASHUDHA treasury.",
    color: "#22c55e",
  },
];

const STATS = [
  { label: "Food Wasted in India", value: "40%", sub: "between farm and fork" },
  { label: "Indians Sleep Hungry", value: "200M", sub: "every single night" },
  { label: "Carbon Credit Crisis", value: "$50B", sub: "unauditable data industry" },
];

const TEAM = [
  { name: "Our Mission", icon: Heart, description: "Eliminate food waste while creating verified carbon credits that companies can trust." },
  { name: "Our Technology", icon: Globe, description: "AI prediction, blockchain verification, and real-time logistics — seamlessly integrated." },
  { name: "Our Impact", icon: Sprout, description: "Every meal rescued generates verified environmental impact, traded on our carbon marketplace." },
];

export default function AboutPage() {
  return (
    <div style={{ background: "#050805", minHeight: "100vh", color: "#f0faf0" }}>
      <Navbar />

      {/* Hero */}
      <section
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "120px 20px 80px",
          backgroundImage: [
            "radial-gradient(60% 50% at 50% 60%, rgba(34,197,94,0.1) 0%, transparent 70%)",
            "radial-gradient(40% 40% at 85% 20%, rgba(59,130,246,0.06) 0%, transparent 60%)",
          ].join(","),
          position: "relative",
        }}
      >
        <div className="grid-overlay" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ maxWidth: 680, position: "relative", zIndex: 1 }}
        >
          <motion.div variants={fadeUp} custom={0}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 16px",
                borderRadius: 999,
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.2)",
                marginBottom: 24,
              }}
            >
              <Leaf size={14} style={{ color: "#22c55e" }} />
              <span style={{ fontSize: 12, color: "#22c55e", fontWeight: 600 }}>About VASHUDHA</span>
            </div>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="type-hero"
            style={{ color: "#f0faf0", marginBottom: 20 }}
          >
            Food rescue meets{" "}
            <span className="gradient-text">blockchain truth</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            style={{ fontSize: 16, color: "#86a886", lineHeight: 1.7, marginBottom: 32 }}
          >
            VASHUDHA is a real-time food rescue platform that connects surplus food donors with NGOs,
            generates blockchain-anchored impact records, and issues Pre-Verified Impact Tokens
            that companies can purchase for ESG compliance.
          </motion.p>

          <motion.div variants={fadeUp} custom={3} style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/donate"
              style={{
                padding: "14px 28px",
                borderRadius: 12,
                background: "#22c55e",
                color: "#050805",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Start Rescuing <ArrowRight size={16} />
            </Link>
            <Link
              href="/marketplace"
              style={{
                padding: "14px 28px",
                borderRadius: 12,
                border: "1px solid rgba(34,197,94,0.3)",
                color: "#86a886",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Buy Carbon Credits
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* The Problem */}
      <section style={{ padding: "80px 20px", maxWidth: 1100, margin: "0 auto" }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <motion.p variants={fadeUp} custom={0} className="type-label" style={{ color: "#ef4444", marginBottom: 8 }}>
            The Problem
          </motion.p>
          <motion.h2 variants={fadeUp} custom={1} className="type-section" style={{ color: "#f0faf0" }}>
            The numbers that keep us awake
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              custom={i}
              style={{
                padding: "32px 24px",
                borderRadius: 16,
                background: "#0d110d",
                border: "1px solid rgba(239,68,68,0.12)",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-bricolage)",
                  fontSize: 48,
                  fontWeight: 700,
                  color: "#ef4444",
                  marginBottom: 8,
                }}
              >
                {stat.value}
              </p>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#f0faf0", marginBottom: 4 }}>
                {stat.label}
              </p>
              <p style={{ fontSize: 13, color: "#86a886" }}>{stat.sub}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works */}
      <section
        style={{
          padding: "80px 20px",
          maxWidth: 900,
          margin: "0 auto",
          borderTop: "1px solid rgba(34,197,94,0.08)",
        }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <motion.p variants={fadeUp} custom={0} className="type-label" style={{ color: "#22c55e", marginBottom: 8 }}>
            How It Works
          </motion.p>
          <motion.h2 variants={fadeUp} custom={1} className="type-section" style={{ color: "#f0faf0" }}>
            From surplus to sustainability in 6 steps
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ display: "flex", flexDirection: "column", gap: 0 }}
        >
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              variants={fadeUp}
              custom={i}
              style={{
                display: "flex",
                gap: 24,
                padding: "28px 0",
                borderBottom: i < STEPS.length - 1 ? "1px solid rgba(34,197,94,0.06)" : "none",
                alignItems: "flex-start",
              }}
            >
              {/* Step number & connector */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, minWidth: 56 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `${step.color}15`,
                    border: `1.5px solid ${step.color}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <step.icon size={20} style={{ color: step.color }} />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains-mono)",
                      fontSize: 11,
                      color: step.color,
                      fontWeight: 600,
                    }}
                  >
                    0{i + 1}
                  </span>
                  <h3
                    style={{
                      fontFamily: "var(--font-bricolage)",
                      fontSize: 18,
                      fontWeight: 600,
                      color: "#f0faf0",
                    }}
                  >
                    {step.title}
                  </h3>
                </div>
                <p style={{ fontSize: 14, color: "#86a886", lineHeight: 1.6 }}>{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Values */}
      <section
        style={{
          padding: "80px 20px",
          maxWidth: 1100,
          margin: "0 auto",
          borderTop: "1px solid rgba(34,197,94,0.08)",
        }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}
        >
          {TEAM.map((item, i) => (
            <motion.div
              key={item.name}
              variants={fadeUp}
              custom={i}
              style={{
                padding: "32px 24px",
                borderRadius: 16,
                background: "#0d110d",
                border: "1px solid rgba(34,197,94,0.12)",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "rgba(34,197,94,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <item.icon size={22} style={{ color: "#22c55e" }} />
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-bricolage)",
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#f0faf0",
                  marginBottom: 8,
                }}
              >
                {item.name}
              </h3>
              <p style={{ fontSize: 14, color: "#86a886", lineHeight: 1.6 }}>{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Technology Stack */}
      <section
        style={{
          padding: "80px 20px",
          borderTop: "1px solid rgba(34,197,94,0.08)",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 48 }}
          >
            <motion.p variants={fadeUp} custom={0} className="type-label" style={{ color: "#3b82f6", marginBottom: 8 }}>
              Technology
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="type-section" style={{ color: "#f0faf0" }}>
              Built with precision
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            {[
              { label: "Frontend", tech: "Next.js 15 + TypeScript", icon: Globe },
              { label: "Blockchain", tech: "Polygon (Amoy Testnet)", icon: ShieldCheck },
              { label: "AI Engine", tech: "Pattern-based prediction", icon: Brain },
              { label: "Maps", tech: "Leaflet + OpenStreetMap", icon: TrendingUp },
              { label: "Styling", tech: "Tailwind CSS + shadcn/ui", icon: Sprout },
              { label: "Smart Contracts", tech: "Solidity + ethers.js", icon: Coins },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                variants={fadeUp}
                custom={i}
                style={{
                  padding: "20px",
                  borderRadius: 12,
                  background: "#0d110d",
                  border: "1px solid rgba(34,197,94,0.08)",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <item.icon size={18} style={{ color: "#22c55e", flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 11, color: "#4a664a", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 2 }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: 14, color: "#f0faf0", fontWeight: 500 }}>{item.tech}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "80px 20px",
          textAlign: "center",
          backgroundImage: "radial-gradient(50% 50% at 50% 50%, rgba(34,197,94,0.08) 0%, transparent 70%)",
          borderTop: "1px solid rgba(34,197,94,0.08)",
        }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ maxWidth: 560, margin: "0 auto" }}
        >
          <motion.h2
            variants={fadeUp}
            custom={0}
            className="type-section"
            style={{ color: "#f0faf0", marginBottom: 12 }}
          >
            Ready to make an impact?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={1}
            style={{ fontSize: 15, color: "#86a886", marginBottom: 32 }}
          >
            Join 200+ restaurants already rescuing food and earning verified carbon credits.
          </motion.p>
          <motion.div
            variants={fadeUp}
            custom={2}
            style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link
              href="/donate"
              style={{
                padding: "14px 28px",
                borderRadius: 12,
                background: "#22c55e",
                color: "#050805",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Start Donating <ArrowRight size={16} />
            </Link>
            <Link
              href="/dashboard"
              style={{
                padding: "14px 28px",
                borderRadius: 12,
                border: "1px solid rgba(34,197,94,0.3)",
                color: "#86a886",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              View Live Map
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
