"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Leaf,
  Wallet,
  ArrowRight,
  MapPin,
  Heart,
  Store,
  Brain,
  Users,
  Info,
  LogOut,
  UserCircle,
} from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { href: "/dashboard", label: "Live Map", icon: MapPin },
  { href: "/donate", label: "Donate Food", icon: Heart },
  { href: "/marketplace", label: "Marketplace", icon: Store },
  { href: "/predict", label: "AI Predict", icon: Brain },
  { href: "/ngo", label: "NGO App", icon: Users },
  { href: "/about", label: "About", icon: Info },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const { shortAddress, connecting, isConnected, connect } = useWallet();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    handler(); // set initial state
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      {/* ─── Desktop & Mobile Nav Bar ─── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        {/* Outer container with padding for floating effect */}
        <div
          className={`transition-all duration-500 ease-out ${
            scrolled ? "pt-0" : "pt-3 px-3 md:px-5"
          }`}
        >
          <div
            className={`max-w-7xl mx-auto transition-all duration-500 ease-out ${
              scrolled
                ? "rounded-none"
                : "rounded-2xl"
            }`}
            style={{
              background: scrolled
                ? "rgba(5, 8, 5, 0.85)"
                : "rgba(13, 17, 13, 0.6)",
              backdropFilter: "blur(24px) saturate(1.4)",
              WebkitBackdropFilter: "blur(24px) saturate(1.4)",
              border: scrolled
                ? "none"
                : "1px solid rgba(34, 197, 94, 0.08)",
              borderBottom: scrolled
                ? "1px solid rgba(34, 197, 94, 0.1)"
                : undefined,
              boxShadow: scrolled
                ? "0 4px 30px rgba(0, 0, 0, 0.3)"
                : "0 8px 32px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div
              className="px-5 md:px-6 flex items-center justify-between"
              style={{ height: 64 }}
            >
              {/* ─── Logo ─── */}
              <Link href="/" className="flex items-center gap-2.5 group">
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="relative w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(22,163,74,0.15) 100%)",
                    border: "1px solid rgba(34,197,94,0.25)",
                    boxShadow: "0 0 20px rgba(34,197,94,0.1)",
                  }}
                >
                  {/* Subtle inner glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        "radial-gradient(circle at center, rgba(34,197,94,0.3) 0%, transparent 70%)",
                    }}
                  />
                  <Leaf
                    size={17}
                    style={{ color: "#22c55e" }}
                    className="relative z-10"
                  />
                </motion.div>
                <div className="flex flex-col">
                  <span
                    className="font-bold text-base tracking-tight leading-none"
                    style={{
                      fontFamily: "var(--font-bricolage)",
                      color: "#f0faf0",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    VASHUDHA
                  </span>
                  <span
                    className="text-[9px] font-medium tracking-widest uppercase leading-none mt-0.5 hidden sm:block"
                    style={{ color: "#4a664a" }}
                  >
                    Food Rescue Network
                  </span>
                </div>
              </Link>

              {/* ─── Desktop Navigation ─── */}
              <div className="hidden lg:flex items-center">
                <div
                  className="flex items-center gap-0.5 px-1.5 py-1 rounded-xl"
                  style={{
                    background: "rgba(34, 197, 94, 0.04)",
                    border: "1px solid rgba(34, 197, 94, 0.06)",
                  }}
                >
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    const isHovered = hoveredLink === link.href;

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="relative px-3.5 py-2 text-[13px] font-medium rounded-lg transition-colors duration-200"
                        style={{
                          fontFamily: "var(--font-dm-sans)",
                          color: isActive
                            ? "#22c55e"
                            : isHovered
                            ? "#f0faf0"
                            : "#86a886",
                        }}
                        onMouseEnter={() => setHoveredLink(link.href)}
                        onMouseLeave={() => setHoveredLink(null)}
                      >
                        {/* Active/hover background pill */}
                        {(isActive || isHovered) && (
                          <motion.div
                            layoutId="navPill"
                            className="absolute inset-0 rounded-lg"
                            style={{
                              background: isActive
                                ? "rgba(34,197,94,0.12)"
                                : "rgba(240,250,240,0.04)",
                              border: isActive
                                ? "1px solid rgba(34,197,94,0.15)"
                                : "1px solid transparent",
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 350,
                              damping: 30,
                            }}
                          />
                        )}
                        <span className="relative z-10">{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* ─── Desktop Actions ─── */}
              <div className="hidden lg:flex items-center gap-2.5">
                {isAuthenticated && user ? (
                  <>
                    {/* User profile pill */}
                    <div
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-medium"
                      style={{
                        background: "rgba(34,197,94,0.06)",
                        border: "1px solid rgba(34,197,94,0.12)",
                        color: "#86a886",
                      }}
                    >
                      <UserCircle size={15} style={{ color: "#22c55e" }} />
                      <span className="max-w-[120px] truncate" style={{ color: "#f0faf0" }}>
                        {user.name}
                      </span>
                      <span
                        className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase"
                        style={{
                          background:
                            user.role === "donor"
                              ? "rgba(34,197,94,0.15)"
                              : user.role === "ngo"
                              ? "rgba(59,130,246,0.15)"
                              : "rgba(124,58,237,0.15)",
                          color:
                            user.role === "donor"
                              ? "#22c55e"
                              : user.role === "ngo"
                              ? "#3b82f6"
                              : "#7c3aed",
                        }}
                      >
                        {user.role}
                      </span>
                    </div>

                    {/* Wallet link */}
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Link
                        href="/wallet"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-200"
                        style={{
                          border: "1px solid rgba(34,197,94,0.15)",
                          color: user?.walletAddress ? "#22c55e" : "#86a886",
                          background: user?.walletAddress ? "rgba(34,197,94,0.04)" : "transparent",
                          textDecoration: "none",
                        }}
                      >
                        <Wallet size={14} style={{ opacity: 0.7 }} />
                        <span>
                          {user?.walletAddress
                            ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`
                            : "Wallet"}
                        </span>
                        {user?.walletAddress && (
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: "#22c55e", boxShadow: "0 0 6px rgba(34,197,94,0.6)" }}
                          />
                        )}
                      </Link>
                    </motion.div>

                    {/* Logout button */}
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={logout}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium transition-all"
                      style={{
                        border: "1px solid rgba(239,68,68,0.15)",
                        color: "#ef4444",
                        background: "transparent",
                        cursor: "pointer",
                      }}
                    >
                      <LogOut size={13} />
                    </motion.button>
                  </>
                ) : (
                  <>
                    {/* Login */}
                    <Link
                      href="/auth/login"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-200"
                      style={{
                        border: "1px solid rgba(34,197,94,0.2)",
                        color: "#86a886",
                        background: "rgba(34,197,94,0.03)",
                      }}
                    >
                      Sign In
                    </Link>

                    {/* Register CTA */}
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Link
                        href="/auth/register"
                        className="group flex items-center gap-2 px-5 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200"
                        style={{
                          background:
                            "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                          color: "#050805",
                          fontFamily: "var(--font-dm-sans)",
                          boxShadow: "0 0 20px rgba(34,197,94,0.2)",
                        }}
                      >
                        Register
                        <ArrowRight
                          size={13}
                          className="transition-transform duration-200 group-hover:translate-x-0.5"
                        />
                      </Link>
                    </motion.div>
                  </>
                )}
              </div>

              {/* ─── Mobile Menu Toggle ─── */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="lg:hidden relative w-10 h-10 rounded-xl flex items-center justify-center"
                onClick={() => setMobileOpen(!mobileOpen)}
                style={{
                  background: mobileOpen
                    ? "rgba(34,197,94,0.1)"
                    : "rgba(34,197,94,0.05)",
                  border: "1px solid rgba(34,197,94,0.12)",
                  color: "#f0faf0",
                }}
              >
                <AnimatePresence mode="wait">
                  {mobileOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X size={18} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu size={18} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ─── Mobile Full-Screen Menu ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40"
            style={{
              background: "rgba(5, 8, 5, 0.98)",
              backdropFilter: "blur(30px)",
            }}
          >
            {/* Decorative background elements */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(ellipse 50% 40% at 80% 20%, rgba(34,197,94,0.06) 0%, transparent 60%), radial-gradient(ellipse 40% 50% at 10% 80%, rgba(59,130,246,0.04) 0%, transparent 60%)",
              }}
            />

            <div className="relative z-10 flex flex-col h-full pt-24 px-6 pb-8">
              {/* Nav links */}
              <div className="flex-1 space-y-1">
                {navLinks.map((link, i) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;

                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -30, filter: "blur(10px)" }}
                      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                      transition={{
                        delay: 0.05 + i * 0.06,
                        duration: 0.4,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={closeMobile}
                        className="flex items-center gap-4 py-4 px-4 rounded-xl transition-all duration-200"
                        style={{
                          background: isActive
                            ? "rgba(34,197,94,0.08)"
                            : "transparent",
                          borderLeft: isActive
                            ? "3px solid #22c55e"
                            : "3px solid transparent",
                        }}
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{
                            background: isActive
                              ? "rgba(34,197,94,0.15)"
                              : "rgba(34,197,94,0.06)",
                            border: `1px solid ${
                              isActive
                                ? "rgba(34,197,94,0.25)"
                                : "rgba(34,197,94,0.08)"
                            }`,
                          }}
                        >
                          <Icon
                            size={18}
                            style={{
                              color: isActive ? "#22c55e" : "#86a886",
                            }}
                          />
                        </div>
                        <span
                          className="text-lg font-semibold"
                          style={{
                            fontFamily: "var(--font-bricolage)",
                            color: isActive ? "#22c55e" : "#f0faf0",
                          }}
                        >
                          {link.label}
                        </span>

                        {isActive && (
                          <motion.div
                            layoutId="mobileActive"
                            className="ml-auto w-2 h-2 rounded-full"
                            style={{
                              background: "#22c55e",
                              boxShadow: "0 0 8px rgba(34,197,94,0.6)",
                            }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="h-px my-4 origin-left"
                style={{ background: "rgba(34,197,94,0.1)" }}
              />

              {/* Mobile actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.4 }}
                className="flex flex-col gap-3"
              >
                {isAuthenticated && user ? (
                  <>
                    {/* Profile card */}
                    <div
                      className="flex items-center gap-3 px-4 py-3 rounded-xl"
                      style={{
                        background: "rgba(34,197,94,0.05)",
                        border: "1px solid rgba(34,197,94,0.1)",
                      }}
                    >
                      <UserCircle size={20} style={{ color: "#22c55e" }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: "#f0faf0" }}>
                          {user.name}
                        </p>
                        <p className="text-[10px] uppercase" style={{ color: "#86a886" }}>
                          {user.role}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => { logout(); closeMobile(); }}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium"
                      style={{
                        border: "1px solid rgba(239,68,68,0.2)",
                        color: "#ef4444",
                        background: "transparent",
                        cursor: "pointer",
                      }}
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={closeMobile}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-base font-medium transition-all"
                      style={{
                        border: "1px solid rgba(34,197,94,0.25)",
                        color: "#86a886",
                        background: "rgba(34,197,94,0.04)",
                      }}
                    >
                      Sign In
                    </Link>

                    <Link
                      href="/auth/register"
                      onClick={closeMobile}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-base font-semibold transition-all"
                      style={{
                        background:
                          "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                        color: "#050805",
                        boxShadow: "0 0 25px rgba(34,197,94,0.2)",
                      }}
                    >
                      Register <ArrowRight size={16} />
                    </Link>
                  </>
                )}
              </motion.div>

              {/* Bottom branding */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="mt-6 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: "#22c55e",
                      boxShadow: "0 0 6px rgba(34,197,94,0.6)",
                    }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: "#4a664a" }}
                  >
                    3 rescues active
                  </span>
                </div>
                <span
                  className="text-xs"
                  style={{ color: "#4a664a" }}
                >
                  Polygon · Jaipur
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
