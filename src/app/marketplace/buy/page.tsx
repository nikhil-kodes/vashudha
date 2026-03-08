"use client";

import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import Link from "next/link";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useMarketplace } from "@/hooks/useMarketplace";
import { useWallet } from "@/hooks/useWallet";

export default function BuyPage() {
  const { listings } = useMarketplace();
  const { isConnected, connect } = useWallet();

  return (
    <div style={{ background: "#050805", minHeight: "100vh", color: "#f0faf0" }}>
      <Navbar />
      <div style={{ paddingTop: 96, paddingBottom: 80, maxWidth: 800, margin: "0 auto", padding: "96px 20px 80px" }}>
        <Link href="/marketplace" style={{ display: "flex", alignItems: "center", gap: 6, color: "#86a886", fontSize: 13, marginBottom: 32, textDecoration: "none" }}>
          <ArrowLeft size={14} /> Back to Marketplace
        </Link>
        <h1 className="type-section mb-8" style={{ color: "#f0faf0" }}>Buy Carbon Credits</h1>
        {listings.map((l) => (
          <div key={l.id} style={{ padding: 20, borderRadius: 16, background: "#0d110d", border: "1px solid rgba(34,197,94,0.15)", marginBottom: 12, borderLeft: "3px solid #22c55e" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: "#f0faf0", marginBottom: 4 }}>{l.sellerName}</p>
                <p style={{ fontSize: 13, color: "#86a886" }}>{l.vgcAmount} VGC · {l.co2Tonnes}t CO₂</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 20, fontWeight: 700, color: "#22c55e", fontFamily: "var(--font-bricolage)" }}>₹{l.pricePerVGC}/VGC</p>
                <button onClick={() => !isConnected && connect()}
                  style={{ marginTop: 8, padding: "8px 16px", borderRadius: 8, background: "#22c55e", color: "#050805", fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none" }}>
                  <ShoppingCart size={12} style={{ display: "inline", marginRight: 4 }} />
                  {isConnected ? "Buy Now" : "Connect Wallet"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
