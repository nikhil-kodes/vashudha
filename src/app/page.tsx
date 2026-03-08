"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Leaf,
  Shield,
  Zap,
  TrendingUp,
  Globe,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  BarChart3,
  HeartHandshake,
  Star,
  Check,
  Quote,
  Building2,
  Users,
  Utensils,
} from "lucide-react";
import CountUp from "react-countup";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

/* ─────────────── Data ─────────────── */

const FEATURES = [
  {
    icon: Zap,
    title: "Post in 60 Seconds",
    description:
      "Restaurant owners list surplus food faster than ordering a coffee. Address autocomplete, expiry selector, and live meal calculator.",
    stat: "47s",
    statLabel: "avg post time",
    gradient: "from-emerald-500/20 to-green-600/5",
    iconBg: "#22c55e",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    icon: Globe,
    title: "AI Matched, Auto-Dispatched",
    description:
      "Our AI matches your listing to the nearest NGO in real time with OSRM-optimized routes.",
    stat: "<3 min",
    statLabel: "dispatch time",
    gradient: "from-blue-500/20 to-blue-600/5",
    iconBg: "#3b82f6",
    span: "md:col-span-1",
  },
  {
    icon: ShieldCheck,
    title: "Blockchain Certified",
    description:
      "Every rescue generates an immutable Polygon blockchain record. Your impact is permanent.",
    stat: "100%",
    statLabel: "on-chain verified",
    gradient: "from-violet-500/20 to-violet-600/5",
    iconBg: "#7c3aed",
    span: "md:col-span-1",
  },
  {
    icon: TrendingUp,
    title: "Carbon Credits That Are Actually Real",
    description:
      "MRV data you can audit, not promises you can't. Each VGC = 1 tonne CO₂ prevented, blockchain verified.",
    stat: "₹800",
    statLabel: "per VGC token",
    gradient: "from-amber-500/20 to-amber-600/5",
    iconBg: "#d97706",
    span: "md:col-span-1",
  },
  {
    icon: HeartHandshake,
    title: "Split That Rewards Everyone",
    description:
      "Restaurants earn carbon credits. Companies offset emissions. NGOs get funded. Everyone wins.",
    stat: "50/50",
    statLabel: "revenue split",
    gradient: "from-emerald-500/20 to-teal-600/5",
    iconBg: "#14b8a6",
    span: "md:col-span-1",
  },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Owner, Hotel Pearl Palace",
    type: "Restaurant",
    typeIcon: Utensils,
    avatar: "PS",
    content:
      "Before VASHUDHA, we threw away 30kg of food every night. Now every gram goes to someone who needs it — and we earn VGC credits for it. The posting process takes less than a minute.",
    rating: 5,
    stat: "2,400+ meals rescued",
    accentColor: "#22c55e",
  },
  {
    name: "Rajesh Kumar",
    role: "Coordinator, Aashray Foundation",
    type: "NGO",
    typeIcon: Users,
    avatar: "RK",
    content:
      "The dispatch app changed everything for us. AI-optimized routes mean we reach donors faster, and the blockchain certificates help us build trust with our own donors.",
    rating: 5,
    stat: "180+ dispatches completed",
    accentColor: "#3b82f6",
  },
  {
    name: "Ananya Desai",
    role: "ESG Head, Tata Consultancy",
    type: "Corporate",
    typeIcon: Building2,
    avatar: "AD",
    content:
      "Finding blockchain-verified carbon credits was nearly impossible until VASHUDHA. The MRV data is audit-ready, and every credit traces back to an actual rescued meal. Our board loves it.",
    rating: 5,
    stat: "12 tonnes CO₂ offset",
    accentColor: "#7c3aed",
  },
  {
    name: "Mohammed Ali",
    role: "Owner, Grand Caterers",
    type: "Restaurant",
    typeIcon: Utensils,
    avatar: "MA",
    content:
      "We cater 200+ weddings a year. The AI prediction feature knows when we'll have surplus before we do. It auto-dispatches NGOs so we don't have to think about it.",
    rating: 5,
    stat: "5,100+ meals rescued",
    accentColor: "#22c55e",
  },
];

const PRICING_PLANS = [
  {
    name: "Starter",
    description: "For individual restaurants getting started with food rescue",
    price: "Free",
    priceDetail: "forever",
    features: [
      "Post unlimited food listings",
      "Automatic NGO matching",
      "Basic impact dashboard",
      "Blockchain certificates",
      "Email support",
    ],
    cta: "Start Rescuing",
    href: "/donate",
    accent: "#22c55e",
    popular: false,
    glow: false,
  },
  {
    name: "Business",
    description: "For restaurant chains & caterers with regular surplus",
    price: "₹2,999",
    priceDetail: "/month",
    features: [
      "Everything in Starter",
      "AI surplus predictions",
      "Autonomous dispatch mode",
      "VGC token earning (2x rate)",
      "Priority NGO matching",
      "Analytics & reporting",
      "Dedicated account manager",
    ],
    cta: "Start Free Trial",
    href: "/donate",
    accent: "#22c55e",
    popular: true,
    glow: true,
  },
  {
    name: "Enterprise",
    description: "For corporates buying carbon credits at scale",
    price: "Custom",
    priceDetail: "contact us",
    features: [
      "Bulk VGC purchasing",
      "Custom MRV reporting",
      "API access",
      "White-label certificates",
      "ESG compliance reports",
      "On-chain audit trail",
      "24/7 priority support",
    ],
    cta: "Contact Sales",
    href: "/about",
    accent: "#7c3aed",
    popular: false,
    glow: false,
  },
];

const ACTIVITY = [
  {
    food: "32kg Dal Rice",
    from: "Hotel Pearl Palace",
    ngo: "Aashray Foundation",
    meals: 128,
    time: "2 min ago",
  },
  {
    food: "15kg Biryani",
    from: "Grand Caterers",
    ngo: "Robin Hood Army",
    meals: 60,
    time: "8 min ago",
  },
  {
    food: "40kg Roti",
    from: "Wedding Hall Deluxe",
    ngo: "HelpAge India",
    meals: 160,
    time: "14 min ago",
  },
  {
    food: "8kg Sweets",
    from: "Mithai Palace",
    ngo: "Aashray Foundation",
    meals: 32,
    time: "21 min ago",
  },
];

/* ─────────────── Components ─────────────── */

function ImpactCounter({
  end,
  label,
  suffix = "",
  prefix = "",
}: {
  end: number;
  label: string;
  suffix?: string;
  prefix?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="text-center">
      <div className="type-impact" style={{ color: "#22c55e" }}>
        {prefix}
        {inView ? <CountUp end={end} duration={2} separator="," /> : "0"}
        {suffix}
      </div>
      <p className="type-label mt-2" style={{ color: "#86a886" }}>
        {label}
      </p>
    </div>
  );
}

/* Animated floating orbs for hero background */
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large green orb */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 600,
          height: 600,
          background:
            "radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          filter: "blur(60px)",
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.6, 0.9, 0.6],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Amber orb */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 400,
          height: 400,
          background:
            "radial-gradient(circle, rgba(217,119,6,0.1) 0%, transparent 70%)",
          bottom: "20%",
          left: "10%",
          filter: "blur(50px)",
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Blue orb */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 350,
          height: 350,
          background:
            "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)",
          top: "30%",
          right: "5%",
          filter: "blur(50px)",
        }}
        animate={{
          x: [0, -25, 0],
          y: [0, 25, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );
}

/* Hero particle dots */
function ParticleField() {
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 5,
        duration: Math.random() * 4 + 3,
        opacity: Math.random() * 0.4 + 0.1,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: "#22c55e",
          }}
          animate={{
            opacity: [0, p.opacity, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* Star rating component */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={14}
          fill={i < rating ? "#f59e0b" : "transparent"}
          stroke={i < rating ? "#f59e0b" : "#4a664a"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

/* ─────────────── Main Page ─────────────── */

export default function LandingPage() {
  const [liveCount, setLiveCount] = useState(3);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount((c) => (c === 3 ? 4 : c === 4 ? 2 : 3));
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{ background: "#050805", color: "#f0faf0", minHeight: "100vh" }}
    >
      <Navbar />

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ paddingTop: 64 }}
      >
        {/* Background layers */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: [
              "radial-gradient(ellipse 80% 50% at 50% 45%, rgba(34,197,94,0.22) 0%, rgba(22,163,74,0.18) 30%, transparent 70%)",
              "radial-gradient(ellipse 60% 40% at 20% 80%, rgba(217,119,6,0.12) 0%, transparent 60%)",
              "radial-gradient(ellipse 50% 35% at 80% 25%, rgba(59,130,246,0.1) 0%, transparent 55%)",
            ].join(","),
          }}
        />

        <FloatingOrbs />
        <ParticleField />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,197,94,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Architectural silhouette */}
        <div
          className="absolute bottom-0 left-0 right-0 flex items-end justify-center pointer-events-none"
          style={{ height: 220, opacity: 0.1 }}
        >
          {[...Array(13)].map((_, i) => {
            const heights = [
              40, 70, 55, 100, 130, 90, 170, 200, 160, 95, 120, 65, 45,
            ];
            const widths = [
              35, 45, 40, 55, 60, 50, 70, 80, 65, 50, 58, 42, 38,
            ];
            return (
              <div
                key={i}
                style={{
                  width: widths[i],
                  height: heights[i],
                  background:
                    "linear-gradient(to top, rgba(34,197,94,0.35), rgba(34,197,94,0.05))",
                  marginRight: 4,
                  borderRadius: "6px 6px 0 0",
                }}
              />
            );
          })}
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center px-5 max-w-5xl mx-auto">
          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-10 text-sm"
            style={{
              background: "rgba(34,197,94,0.08)",
              border: "1px solid rgba(34,197,94,0.2)",
              color: "#86a886",
              backdropFilter: "blur(8px)",
            }}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span
                className="absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{
                  background: "#22c55e",
                  animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite",
                }}
              />
              <span
                className="relative inline-flex rounded-full h-2.5 w-2.5"
                style={{ background: "#22c55e" }}
              />
            </span>
            <span style={{ fontFamily: "var(--font-dm-sans)" }}>
              {liveCount} rescues happening right now
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="type-hero mb-8"
            style={{
              color: "#f0faf0",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              lineHeight: 1.05,
            }}
          >
            Every night, tonnes of food
            <br />
            <span className="gradient-text">disappear into the void.</span>
            <br />
            <span style={{ color: "#f0faf0" }}>We built the bridge.</span>
          </motion.h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="type-body max-w-2xl mx-auto mb-12"
            style={{ color: "#86a886", fontSize: "1.05rem", lineHeight: 1.7 }}
          >
            VASHUDHA connects surplus food donors with NGOs, generates
            blockchain-verified impact records, and issues carbon credits that
            actually mean something.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link
              href="/donate"
              className="group flex items-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:shadow-lg"
              style={{
                background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                color: "#050805",
                boxShadow: "0 0 30px rgba(34,197,94,0.25)",
              }}
            >
              Start Rescuing Food
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/marketplace/buy"
              className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium transition-all duration-300 hover:border-green-400"
              style={{
                border: "1px solid rgba(34,197,94,0.3)",
                color: "#f0faf0",
                background: "rgba(34,197,94,0.04)",
                backdropFilter: "blur(4px)",
              }}
            >
              Buy Carbon Credits
            </Link>
            <Link
              href="/ngo"
              className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium transition-all duration-300"
              style={{
                border: "1px solid rgba(34,197,94,0.12)",
                color: "#86a886",
              }}
            >
              I&apos;m an NGO
            </Link>
          </motion.div>

          {/* Trust markers */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-16 flex items-center justify-center gap-8 flex-wrap"
          >
            {[
              "Polygon Blockchain",
              "AI-Powered",
              "MRV Verified",
              "Open Source",
            ].map((label) => (
              <div
                key={label}
                className="flex items-center gap-2 text-xs"
                style={{ color: "#4a664a" }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#22c55e", opacity: 0.5 }}
                />
                {label}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div
            className="w-6 h-10 rounded-full flex items-start justify-center pt-2"
            style={{ border: "1px solid rgba(34,197,94,0.2)" }}
          >
            <motion.div
              className="w-1 h-2.5 rounded-full"
              style={{ background: "#22c55e" }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ LIVE IMPACT STATS ═══════════════════ */}
      <section
        className="py-20 relative"
        style={{ borderTop: "1px solid rgba(34,197,94,0.08)", borderBottom: "1px solid rgba(34,197,94,0.08)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 100% at 50% 50%, rgba(34,197,94,0.04) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-5xl mx-auto px-5 grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
          <ImpactCounter end={2847} label="Meals Saved" />
          <ImpactCounter end={1247} label="kg CO₂ Prevented" suffix=" kg" />
          <ImpactCounter end={94000} label="In VGC Credits (₹)" prefix="₹" />
        </div>
      </section>

      {/* ═══════════════════ LIVE ACTIVITY TICKER ═══════════════════ */}
      <section className="py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5">
          <p
            className="type-label mb-8 text-center"
            style={{ color: "#4a664a" }}
          >
            Live Rescue Activity
          </p>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide">
            {ACTIVITY.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex-none snap-start rounded-xl p-5 min-w-72 card-hover"
                style={{
                  background: "#0d110d",
                  border: "1px solid rgba(34,197,94,0.12)",
                  borderLeft: "4px solid #22c55e",
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#f0faf0" }}
                  >
                    🍱 {item.food}
                  </span>
                  <span className="text-xs" style={{ color: "#4a664a" }}>
                    {item.time}
                  </span>
                </div>
                <p
                  className="text-xs mb-3"
                  style={{ color: "#86a886" }}
                >
                  {item.from} → {item.ngo}
                </p>
                <p
                  className="text-xs font-medium"
                  style={{ color: "#22c55e" }}
                >
                  {item.meals} meals rescued
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ FEATURES — BENTO GRID ═══════════════════ */}
      <section className="py-28 max-w-7xl mx-auto px-5">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-medium"
            style={{
              background: "rgba(34,197,94,0.08)",
              border: "1px solid rgba(34,197,94,0.15)",
              color: "#22c55e",
            }}
          >
            <Sparkles size={12} />
            THE SYSTEM
          </motion.div>
          <h2
            className="type-section"
            style={{ color: "#f0faf0", fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
          >
            Five things that{" "}
            <span className="gradient-text">change everything</span>
          </h2>
          <p
            className="type-body mt-4 max-w-xl mx-auto"
            style={{ color: "#86a886" }}
          >
            From posting surplus food to earning verified carbon credits — the
            entire pipeline in one platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-auto">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className={`group relative rounded-2xl p-7 overflow-hidden card-hover ${feature.span}`}
                style={{
                  background: "#0d110d",
                  border: "1px solid rgba(34,197,94,0.1)",
                }}
              >
                {/* Gradient background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Content */}
                <div className="relative z-10">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: `${feature.iconBg}15`,
                      border: `1px solid ${feature.iconBg}25`,
                    }}
                  >
                    <Icon size={20} style={{ color: feature.iconBg }} />
                  </div>

                  <h3
                    className="text-lg font-semibold mb-3"
                    style={{
                      fontFamily: "var(--font-bricolage)",
                      color: "#f0faf0",
                    }}
                  >
                    {feature.title}
                  </h3>

                  <p
                    className="text-sm leading-relaxed mb-6"
                    style={{ color: "#86a886" }}
                  >
                    {feature.description}
                  </p>

                  {/* Stat */}
                  <div
                    className="pt-4 flex items-end gap-3"
                    style={{ borderTop: "1px solid rgba(34,197,94,0.08)" }}
                  >
                    <span
                      className="text-3xl font-bold tracking-tight"
                      style={{
                        fontFamily: "var(--font-bricolage)",
                        color: feature.iconBg,
                      }}
                    >
                      {feature.stat}
                    </span>
                    <span
                      className="text-xs pb-1"
                      style={{ color: "#4a664a" }}
                    >
                      {feature.statLabel}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════ PERSONA CTAs ═══════════════════ */}
      <section className="py-24 max-w-7xl mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              emoji: "🍱",
              title: "For Restaurants & Caterers",
              desc: "Post surplus food in under 60 seconds. See your impact in real ₹ and meals served.",
              cta: "Post Food Now",
              href: "/donate",
              accent: "#22c55e",
            },
            {
              emoji: "🤝",
              title: "For NGO Volunteers",
              desc: "Mobile-first dispatch app with optimized routes and one-tap status updates.",
              cta: "Open NGO App",
              href: "/ngo",
              accent: "#3b82f6",
            },
            {
              emoji: "📊",
              title: "For Corporate ESG",
              desc: "Blockchain-certified carbon credits with on-chain proof for your sustainability reports.",
              cta: "Browse Credits",
              href: "/marketplace/buy",
              accent: "#7c3aed",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-hover rounded-2xl p-8 flex flex-col group"
              style={{
                background: "#0d110d",
                border: "1px solid rgba(34,197,94,0.12)",
              }}
            >
              <div className="text-4xl mb-4">{card.emoji}</div>
              <h3
                className="text-lg font-semibold mb-3"
                style={{
                  fontFamily: "var(--font-bricolage)",
                  color: "#f0faf0",
                }}
              >
                {card.title}
              </h3>
              <p
                className="text-sm leading-relaxed mb-6 flex-1"
                style={{ color: "#86a886" }}
              >
                {card.desc}
              </p>
              <Link
                href={card.href}
                className="flex items-center gap-2 text-sm font-medium transition-all group-hover:gap-3"
                style={{ color: card.accent }}
              >
                {card.cta}{" "}
                <ChevronRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
      <section
        className="py-28 relative overflow-hidden"
        style={{
          background: "#0a0f0a",
          borderTop: "1px solid rgba(34,197,94,0.06)",
          borderBottom: "1px solid rgba(34,197,94,0.06)",
        }}
      >
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 50% 60% at 50% 40%, rgba(34,197,94,0.05) 0%, transparent 70%)",
          }}
        />

        <div className="max-w-7xl mx-auto px-5 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-medium"
              style={{
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.15)",
                color: "#22c55e",
              }}
            >
              <Quote size={12} />
              VOICES OF IMPACT
            </motion.div>
            <h2
              className="type-section"
              style={{
                color: "#f0faf0",
                fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
              }}
            >
              Trusted by those who{" "}
              <span className="gradient-text">rescue food every day</span>
            </h2>
            <p
              className="type-body mt-4 max-w-lg mx-auto"
              style={{ color: "#86a886" }}
            >
              From street-level restaurant owners to Fortune 500 ESG teams.
            </p>
          </motion.div>

          {/* Testimonial cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((testimonial, i) => {
              const TypeIcon = testimonial.typeIcon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="group rounded-2xl p-7 relative overflow-hidden card-hover"
                  style={{
                    background: "#0d110d",
                    border: "1px solid rgba(34,197,94,0.1)",
                  }}
                >
                  {/* Hover gradient */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(ellipse 80% 60% at 0% 0%, ${testimonial.accentColor}08 0%, transparent 60%)`,
                    }}
                  />

                  <div className="relative z-10">
                    {/* Top row: type badge + rating */}
                    <div className="flex items-center justify-between mb-5">
                      <div
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                        style={{
                          background: `${testimonial.accentColor}10`,
                          border: `1px solid ${testimonial.accentColor}20`,
                          color: testimonial.accentColor,
                        }}
                      >
                        <TypeIcon size={12} />
                        {testimonial.type}
                      </div>
                      <StarRating rating={testimonial.rating} />
                    </div>

                    {/* Quote */}
                    <p
                      className="text-sm leading-relaxed mb-6"
                      style={{ color: "#c8d8c8", lineHeight: 1.7 }}
                    >
                      &ldquo;{testimonial.content}&rdquo;
                    </p>

                    {/* Impact stat */}
                    <div
                      className="px-4 py-2.5 rounded-lg mb-6 inline-flex items-center gap-2"
                      style={{
                        background: `${testimonial.accentColor}08`,
                        border: `1px solid ${testimonial.accentColor}15`,
                      }}
                    >
                      <Sparkles
                        size={12}
                        style={{ color: testimonial.accentColor }}
                      />
                      <span
                        className="text-xs font-medium"
                        style={{ color: testimonial.accentColor }}
                      >
                        {testimonial.stat}
                      </span>
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{
                          background: `${testimonial.accentColor}15`,
                          border: `1px solid ${testimonial.accentColor}25`,
                          color: testimonial.accentColor,
                        }}
                      >
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div
                          className="text-sm font-medium"
                          style={{ color: "#f0faf0" }}
                        >
                          {testimonial.name}
                        </div>
                        <div
                          className="text-xs"
                          style={{ color: "#4a664a" }}
                        >
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Social proof bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-16"
          >
            {[
              { value: "200+", label: "Restaurants" },
              { value: "45+", label: "NGO Partners" },
              { value: "15+", label: "Corporate Buyers" },
              { value: "4.9/5", label: "Avg Rating" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div
                  className="text-2xl font-bold mb-1"
                  style={{
                    fontFamily: "var(--font-bricolage)",
                    color: "#22c55e",
                  }}
                >
                  {stat.value}
                </div>
                <div className="text-xs" style={{ color: "#4a664a" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ PRICING ═══════════════════ */}
      <section className="py-28 max-w-7xl mx-auto px-5">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-medium"
            style={{
              background: "rgba(34,197,94,0.08)",
              border: "1px solid rgba(34,197,94,0.15)",
              color: "#22c55e",
            }}
          >
            <BarChart3 size={12} />
            PRICING
          </motion.div>
          <h2
            className="type-section"
            style={{
              color: "#f0faf0",
              fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
            }}
          >
            Simple pricing,{" "}
            <span className="gradient-text">massive impact</span>
          </h2>
          <p
            className="type-body mt-4 max-w-lg mx-auto"
            style={{ color: "#86a886" }}
          >
            Start rescuing food for free. Upgrade when you&apos;re ready to
            unlock AI predictions and earn more credits.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PRICING_PLANS.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={`relative rounded-2xl p-8 flex flex-col group ${
                plan.popular ? "md:-mt-4 md:mb-4" : ""
              }`}
              style={{
                background: plan.popular ? "#0f160f" : "#0d110d",
                border: `1px solid ${
                  plan.popular
                    ? "rgba(34,197,94,0.3)"
                    : "rgba(34,197,94,0.1)"
                }`,
                boxShadow: plan.glow
                  ? "0 0 60px rgba(34,197,94,0.12), 0 0 120px rgba(34,197,94,0.05)"
                  : "none",
              }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background:
                      "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                    color: "#050805",
                  }}
                >
                  Most Popular
                </div>
              )}

              {/* Plan header */}
              <div className="mb-8">
                <h3
                  className="text-xl font-bold mb-2"
                  style={{
                    fontFamily: "var(--font-bricolage)",
                    color: "#f0faf0",
                  }}
                >
                  {plan.name}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#86a886" }}
                >
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span
                    className="text-4xl font-bold tracking-tight"
                    style={{
                      fontFamily: "var(--font-bricolage)",
                      color: "#f0faf0",
                    }}
                  >
                    {plan.price}
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: "#4a664a" }}
                  >
                    {plan.priceDetail}
                  </span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3.5 mb-10 flex-1">
                {plan.features.map((feature, fi) => (
                  <li
                    key={fi}
                    className="flex items-start gap-3 text-sm"
                    style={{ color: "#c8d8c8" }}
                  >
                    <Check
                      size={16}
                      className="mt-0.5 flex-shrink-0"
                      style={{ color: plan.accent }}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.href}
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-center transition-all duration-300 block"
                style={{
                  background: plan.popular
                    ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
                    : "transparent",
                  color: plan.popular ? "#050805" : plan.accent,
                  border: plan.popular
                    ? "none"
                    : `1px solid ${plan.accent}40`,
                }}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12 text-xs"
          style={{ color: "#4a664a" }}
        >
          All plans include blockchain certificates and impact tracking. No
          hidden fees. Cancel anytime.
        </motion.p>
      </section>

      {/* ═══════════════════ VGC EXPLAINER ═══════════════════ */}
      <section
        className="py-28"
        style={{
          background: "#0d110d",
          borderTop: "1px solid rgba(34,197,94,0.08)",
          borderBottom: "1px solid rgba(34,197,94,0.08)",
        }}
      >
        <div className="max-w-4xl mx-auto px-5 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8"
              style={{
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.2)",
              }}
            >
              <Leaf size={28} style={{ color: "#22c55e" }} />
            </div>
            <h2
              className="type-section mb-6"
              style={{ color: "#f0faf0" }}
            >
              What is a VGC Token?
            </h2>
            <p
              className="type-body max-w-2xl mx-auto mb-10"
              style={{ color: "#86a886" }}
            >
              Vashudha Green Credit (VGC) is a Pre-Verified Impact Token. 1 VGC
              = 1 tonne of CO₂ prevented through food rescue — minted on Polygon
              blockchain only after MRV verification. Companies buy VGC for
              their ESG reports. Restaurants earn VGC for every rescue.
            </p>
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-12">
              {[
                { label: "Current Floor Price", value: "₹800 / VGC" },
                { label: "Total VGC Minted", value: "4.8 VGC" },
                { label: "CO₂ Prevented", value: "4.8 tonnes" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-4 rounded-xl"
                  style={{
                    background: "rgba(34,197,94,0.04)",
                    border: "1px solid rgba(34,197,94,0.08)",
                  }}
                >
                  <div
                    className="text-xl font-bold mb-1"
                    style={{
                      fontFamily: "var(--font-bricolage)",
                      color: "#22c55e",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "#4a664a" }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold transition-all hover:shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                color: "#050805",
                boxShadow: "0 0 30px rgba(34,197,94,0.2)",
              }}
            >
              Enter Carbon Marketplace <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ FINAL CTA ═══════════════════ */}
      <section className="py-32 max-w-4xl mx-auto px-5 text-center relative overflow-hidden">
        {/* Background effect */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(34,197,94,0.08) 0%, transparent 70%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10"
        >
          <h2
            className="type-hero mb-6"
            style={{ color: "#f0faf0" }}
          >
            200 million Indians sleep hungry.
            <br />
            <span className="gradient-text">
              Not because there&apos;s not enough food.
            </span>
          </h2>
          <p
            className="type-body max-w-xl mx-auto mb-12"
            style={{ color: "#86a886" }}
          >
            Join VASHUDHA. Post food, dispatch rescues, verify impact, and trade
            carbon credits — all in one platform built on the blockchain.
          </p>
          <Link
            href="/donate"
            className="group inline-flex items-center gap-2 px-10 py-4 rounded-full text-base font-semibold transition-all duration-300 hover:shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              color: "#050805",
              boxShadow: "0 0 40px rgba(34,197,94,0.25)",
            }}
          >
            Start Rescuing Food Today{" "}
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
