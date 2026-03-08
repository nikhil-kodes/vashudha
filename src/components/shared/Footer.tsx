"use client";

import Link from "next/link";
import { Leaf, Github, Twitter, Linkedin } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function Footer() {
  const { user } = useAuth();
  const isNgo = user?.role === "ngo";

  const platformLinks = [
    ...(!isNgo ? [{ href: "/donate", label: "Donate Food" }] : []),
    { href: "/dashboard", label: "Live Dashboard" },
    { href: "/ngo", label: "NGO Dispatch" },
    { href: "/predict", label: "AI Predictions" },
  ];

  return (
    <footer
      className="border-t"
      style={{ borderColor: "rgba(34,197,94,0.1)", background: "#050805" }}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)" }}>
                <Leaf size={16} style={{ color: "#22c55e" }} />
              </div>
              <span className="font-bold text-lg" style={{ fontFamily: "var(--font-bricolage)", color: "#f0faf0" }}>VASHUDHA</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "#86a886" }}>
              Real-time food rescue + blockchain-anchored impact records + a verified carbon marketplace. Every meal rescued. Every tonne verified.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" style={{ color: "#4a664a" }} className="hover:text-green-400 transition-colors">
                <Github size={18} />
              </a>
              <a href="#" style={{ color: "#4a664a" }} className="hover:text-green-400 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" style={{ color: "#4a664a" }} className="hover:text-green-400 transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#4a664a" }}>Platform</h4>
            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm transition-colors" style={{ color: "#86a886" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#f0faf0")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#86a886")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Carbon */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#4a664a" }}>Carbon</h4>
            <ul className="space-y-3">
              {[
                { href: "/marketplace/buy", label: "Buy VGC Credits" },
                { href: "/marketplace/sell", label: "Sell VGC Credits" },
                { href: "/about", label: "How It Works" },
                { href: "/admin", label: "Admin" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm transition-colors" style={{ color: "#86a886" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#f0faf0")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#86a886")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 border-t" style={{ borderColor: "rgba(34,197,94,0.08)" }}>
          <p className="text-xs" style={{ color: "#4a664a" }}>
            © 2026 VASHUDHA. Built for a hunger-free, carbon-verified planet.
          </p>
          <div className="flex items-center gap-1 text-xs" style={{ color: "#4a664a" }}>
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: "#22c55e", boxShadow: "0 0 6px rgba(34,197,94,0.6)" }}></span>
            <span>3 rescues happening right now</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
