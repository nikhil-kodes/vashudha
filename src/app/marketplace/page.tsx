"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { useMarketplace } from "@/hooks/useMarketplace";
import { useWallet } from "@/hooks/useWallet";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  ExternalLink,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  ShieldCheck,
  Activity,
  BarChart3,
  Clock,
  Layers,
  Zap,
  ArrowRight,
  Leaf,
  ChevronDown,
  CandlestickChart,
} from "lucide-react";
import Link from "next/link";

/* ═══════════════ Mock Data ═══════════════ */

// VGC price history (30 days)
const PRICE_HISTORY = [
  { date: "Feb 06", price: 720, volume: 12.4 },
  { date: "Feb 08", price: 735, volume: 18.2 },
  { date: "Feb 10", price: 710, volume: 8.6 },
  { date: "Feb 12", price: 745, volume: 22.1 },
  { date: "Feb 14", price: 760, volume: 15.8 },
  { date: "Feb 16", price: 740, volume: 11.3 },
  { date: "Feb 18", price: 755, volume: 19.7 },
  { date: "Feb 20", price: 780, volume: 28.4 },
  { date: "Feb 22", price: 770, volume: 21.2 },
  { date: "Feb 24", price: 790, volume: 32.1 },
  { date: "Feb 26", price: 810, volume: 35.6 },
  { date: "Feb 28", price: 795, volume: 25.3 },
  { date: "Mar 01", price: 805, volume: 29.8 },
  { date: "Mar 02", price: 820, volume: 38.2 },
  { date: "Mar 03", price: 815, volume: 27.5 },
  { date: "Mar 04", price: 830, volume: 42.1 },
  { date: "Mar 05", price: 825, volume: 33.7 },
  { date: "Mar 06", price: 840, volume: 45.3 },
  { date: "Mar 07", price: 850, volume: 48.6 },
];

// Order book data (bids = buyers, asks = sellers)
const ORDER_BOOK_ASKS = [
  { price: 900, amount: 5.2, total: 4680 },
  { price: 890, amount: 8.7, total: 7743 },
  { price: 880, amount: 12.1, total: 10648 },
  { price: 870, amount: 15.4, total: 13398 },
  { price: 860, amount: 22.3, total: 19178 },
  { price: 855, amount: 18.8, total: 16074 },
  { price: 852, amount: 25.4, total: 21640.8 },
];

const ORDER_BOOK_BIDS = [
  { price: 850, amount: 30.2, total: 25670 },
  { price: 845, amount: 22.6, total: 19097 },
  { price: 840, amount: 18.9, total: 15876 },
  { price: 835, amount: 14.3, total: 11940.5 },
  { price: 830, amount: 10.8, total: 8964 },
  { price: 820, amount: 8.4, total: 6888 },
  { price: 810, amount: 5.1, total: 4131 },
];

// Recent trades
const RECENT_TRADES = [
  { price: 850, amount: 2.4, time: "23:24:18", side: "buy" as const },
  { price: 850, amount: 1.8, time: "23:23:45", side: "sell" as const },
  { price: 852, amount: 5.2, time: "23:22:30", side: "buy" as const },
  { price: 848, amount: 3.1, time: "23:21:15", side: "sell" as const },
  { price: 850, amount: 8.0, time: "23:20:42", side: "buy" as const },
  { price: 845, amount: 4.5, time: "23:19:58", side: "buy" as const },
  { price: 842, amount: 2.2, time: "23:18:30", side: "sell" as const },
  { price: 845, amount: 6.8, time: "23:17:12", side: "buy" as const },
  { price: 840, amount: 3.4, time: "23:16:05", side: "sell" as const },
  { price: 842, amount: 1.9, time: "23:15:22", side: "buy" as const },
  { price: 838, amount: 7.2, time: "23:14:08", side: "sell" as const },
  { price: 840, amount: 4.1, time: "23:13:30", side: "buy" as const },
];

// Volume data for bar chart
const VOLUME_DATA = PRICE_HISTORY.map((d, i) => ({
  date: d.date,
  volume: d.volume,
  color:
    i > 0 && d.price >= PRICE_HISTORY[i - 1].price ? "#22c55e" : "#ef4444",
}));

// Time range options for chart
const TIME_RANGES = ["1H", "4H", "1D", "1W", "1M", "ALL"];

/* ═══════════════ Utility Components ═══════════════ */

function MarketStatCard({
  label,
  value,
  change,
  positive,
}: {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-wider" style={{ color: "#4a664a" }}>
        {label}
      </span>
      <div className="flex items-center gap-1.5">
        <span
          className="text-sm font-bold"
          style={{ fontFamily: "var(--font-bricolage)", color: "#f0faf0" }}
        >
          {value}
        </span>
        {change && (
          <span
            className="flex items-center text-[11px] font-medium"
            style={{ color: positive ? "#22c55e" : "#ef4444" }}
          >
            {positive ? (
              <ArrowUpRight size={11} />
            ) : (
              <ArrowDownRight size={11} />
            )}
            {change}
          </span>
        )}
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-lg px-3 py-2 text-xs"
        style={{
          background: "#141a14",
          border: "1px solid rgba(34,197,94,0.2)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        }}
      >
        <p style={{ color: "#86a886", marginBottom: 4 }}>{label}</p>
        <p style={{ color: "#22c55e", fontWeight: 600, fontFamily: "var(--font-bricolage)" }}>
          ₹{payload[0].value}
        </p>
      </div>
    );
  }
  return null;
}

/* ═══════════════ Main Page ═══════════════ */

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState<"spot" | "sell" | "portfolio">("spot");
  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [timeRange, setTimeRange] = useState("1M");
  const [buySellMode, setBuySellMode] = useState<"buy" | "sell">("buy");

  // Price is auto-set by the backend/blockchain — NOT user-editable
  const CURRENT_PRICE = 850;

  const { listings } = useMarketplace();
  const { isConnected, connect, shortAddress } = useWallet();

  const totalVGCAvailable = useMemo(
    () => listings.reduce((sum, l) => sum + l.vgcAmount, 0),
    [listings]
  );

  const buyTotal = useMemo(() => {
    return (parseFloat(buyAmount) || 0) * CURRENT_PRICE;
  }, [buyAmount]);

  const sellTotal = useMemo(() => {
    return (parseFloat(sellAmount) || 0) * CURRENT_PRICE;
  }, [sellAmount]);

  const maxAskAmount = Math.max(...ORDER_BOOK_ASKS.map((a) => a.amount));
  const maxBidAmount = Math.max(...ORDER_BOOK_BIDS.map((b) => b.amount));

  return (
    <div style={{ background: "#050805", minHeight: "100vh", color: "#f0faf0" }}>
      <Navbar />

      {/* ═══ Market Header Stats Bar ═══ */}
      <div
        className="border-b"
        style={{
          paddingTop: 80,
          background: "#050805",
          borderColor: "rgba(34,197,94,0.08)",
        }}
      >
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="flex items-center gap-3 py-3 overflow-x-auto scrollbar-hide">
            {/* Token pair & current price */}
            <div className="flex items-center gap-3 pr-5 border-r" style={{ borderColor: "rgba(34,197,94,0.1)" }}>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: "rgba(34,197,94,0.12)",
                    border: "1px solid rgba(34,197,94,0.2)",
                  }}
                >
                  <Leaf size={16} style={{ color: "#22c55e" }} />
                </div>
                <div>
                  <span
                    className="text-base font-bold"
                    style={{ fontFamily: "var(--font-bricolage)", color: "#f0faf0" }}
                  >
                    VGC
                  </span>
                  <span className="text-xs ml-1" style={{ color: "#4a664a" }}>
                    / INR
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span
                  className="text-xl font-bold"
                  style={{ fontFamily: "var(--font-bricolage)", color: "#22c55e" }}
                >
                  ₹850.00
                </span>
                <span className="flex items-center gap-1 text-xs" style={{ color: "#22c55e" }}>
                  <ArrowUpRight size={11} />
                  +18.06% (30d)
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 px-2">
              <MarketStatCard label="24h High" value="₹855" />
              <MarketStatCard label="24h Low" value="₹838" />
              <MarketStatCard
                label="24h Volume"
                value="48.6 VGC"
                change="+12.3%"
                positive
              />
              <MarketStatCard
                label="24h Trades"
                value="142"
                change="+8.5%"
                positive
              />
              <MarketStatCard label="Market Cap" value="₹4.08L" />
              <MarketStatCard label="Total Supply" value="4.8 VGC" />
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Main Trading Grid ═══ */}
      <div className="max-w-[1600px] mx-auto px-4 py-4">
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: "1fr 280px 340px",
            gridTemplateRows: "auto auto",
          }}
        >
          {/* ─── LEFT: Price Chart ─── */}
          <div
            className="rounded-xl overflow-hidden row-span-1"
            style={{
              background: "#0a0f0a",
              border: "1px solid rgba(34,197,94,0.06)",
            }}
          >
            {/* Chart header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: "rgba(34,197,94,0.06)" }}
            >
              <div className="flex items-center gap-2">
                <CandlestickChart size={14} style={{ color: "#22c55e" }} />
                <span className="text-xs font-medium" style={{ color: "#86a886" }}>
                  Price Chart
                </span>
              </div>
              <div className="flex items-center gap-0.5">
                {TIME_RANGES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeRange(t)}
                    className="px-2.5 py-1 rounded text-[11px] font-medium transition-all"
                    style={{
                      background:
                        timeRange === t ? "rgba(34,197,94,0.12)" : "transparent",
                      color: timeRange === t ? "#22c55e" : "#4a664a",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Area chart */}
            <div className="px-2 pt-2" style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={PRICE_HISTORY}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={0.25} />
                      <stop offset="50%" stopColor="#22c55e" stopOpacity={0.08} />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: "#4a664a" }}
                    axisLine={{ stroke: "rgba(34,197,94,0.06)" }}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    domain={["dataMin - 20", "dataMax + 20"]}
                    tick={{ fontSize: 10, fill: "#4a664a" }}
                    axisLine={false}
                    tickLine={false}
                    width={45}
                    tickFormatter={(v) => `₹${v}`}
                  />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#22c55e"
                    strokeWidth={2}
                    fill="url(#priceGradient)"
                    dot={false}
                    activeDot={{
                      r: 4,
                      fill: "#22c55e",
                      stroke: "#050805",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Volume bars */}
            <div className="px-2 pb-2" style={{ height: 80 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={VOLUME_DATA}
                  margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
                >
                  <XAxis dataKey="date" hide />
                  <YAxis hide />
                  <Bar dataKey="volume" radius={[2, 2, 0, 0]}>
                    {VOLUME_DATA.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.color}
                        fillOpacity={0.5}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ─── MIDDLE: Order Book ─── */}
          <div
            className="rounded-xl overflow-hidden row-span-2"
            style={{
              background: "#0a0f0a",
              border: "1px solid rgba(34,197,94,0.06)",
            }}
          >
            {/* Order book header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: "rgba(34,197,94,0.06)" }}
            >
              <div className="flex items-center gap-2">
                <Layers size={14} style={{ color: "#22c55e" }} />
                <span className="text-xs font-medium" style={{ color: "#86a886" }}>
                  Order Book
                </span>
              </div>
            </div>

            {/* Column headers */}
            <div
              className="grid grid-cols-3 px-4 py-2 text-[10px] uppercase tracking-wider"
              style={{ color: "#4a664a" }}
            >
              <span>Price (₹)</span>
              <span className="text-right">Amount (VGC)</span>
              <span className="text-right">Total (₹)</span>
            </div>

            {/* Asks (sell orders) - bottom to top */}
            <div className="px-2">
              {ORDER_BOOK_ASKS.slice()
                .reverse()
                .map((ask, i) => (
                  <div
                    key={`ask-${i}`}
                    className="relative grid grid-cols-3 px-2 py-[5px] text-[11px] font-mono hover:bg-white/[0.02] cursor-pointer transition-colors"
                  >
                    {/* Background bar */}
                    <div
                      className="absolute right-0 top-0 bottom-0"
                      style={{
                        width: `${(ask.amount / maxAskAmount) * 100}%`,
                        background: "rgba(239,68,68,0.08)",
                      }}
                    />
                    <span className="relative" style={{ color: "#ef4444" }}>
                      {ask.price.toFixed(2)}
                    </span>
                    <span className="relative text-right" style={{ color: "#c8d8c8" }}>
                      {ask.amount.toFixed(1)}
                    </span>
                    <span className="relative text-right" style={{ color: "#4a664a" }}>
                      {ask.total.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                ))}
            </div>

            {/* Current price spread */}
            <div
              className="mx-2 my-1 px-3 py-2.5 rounded-lg flex items-center justify-between"
              style={{
                background: "rgba(34,197,94,0.06)",
                border: "1px solid rgba(34,197,94,0.1)",
              }}
            >
              <span
                className="text-base font-bold"
                style={{ fontFamily: "var(--font-bricolage)", color: "#22c55e" }}
              >
                ₹850.00
              </span>
              <div className="flex items-center gap-1">
                <TrendingUp size={12} style={{ color: "#22c55e" }} />
                <span className="text-[11px] font-medium" style={{ color: "#22c55e" }}>
                  +1.18%
                </span>
              </div>
            </div>

            {/* Bids (buy orders) */}
            <div className="px-2">
              {ORDER_BOOK_BIDS.map((bid, i) => (
                <div
                  key={`bid-${i}`}
                  className="relative grid grid-cols-3 px-2 py-[5px] text-[11px] font-mono hover:bg-white/[0.02] cursor-pointer transition-colors"
                >
                  {/* Background bar */}
                  <div
                    className="absolute right-0 top-0 bottom-0"
                    style={{
                      width: `${(bid.amount / maxBidAmount) * 100}%`,
                      background: "rgba(34,197,94,0.07)",
                    }}
                  />
                  <span className="relative" style={{ color: "#22c55e" }}>
                    {bid.price.toFixed(2)}
                  </span>
                  <span className="relative text-right" style={{ color: "#c8d8c8" }}>
                    {bid.amount.toFixed(1)}
                  </span>
                  <span className="relative text-right" style={{ color: "#4a664a" }}>
                    {bid.total.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ─── RIGHT: Trade Panel ─── */}
          <div
            className="rounded-xl overflow-hidden row-span-2"
            style={{
              background: "#0a0f0a",
              border: "1px solid rgba(34,197,94,0.06)",
            }}
          >
            {/* Buy/Sell toggle */}
            <div
              className="flex p-1 mx-3 mt-3 rounded-lg"
              style={{ background: "#141a14" }}
            >
              <button
                onClick={() => setBuySellMode("buy")}
                className="flex-1 py-2.5 rounded-md text-xs font-semibold transition-all"
                style={{
                  background: buySellMode === "buy" ? "#22c55e" : "transparent",
                  color: buySellMode === "buy" ? "#050805" : "#86a886",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Buy VGC
              </button>
              <button
                onClick={() => setBuySellMode("sell")}
                className="flex-1 py-2.5 rounded-md text-xs font-semibold transition-all"
                style={{
                  background: buySellMode === "sell" ? "#ef4444" : "transparent",
                  color: buySellMode === "sell" ? "#fff" : "#86a886",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Sell VGC
              </button>
            </div>

            {/* Live market price — auto-set, NOT editable */}
            <div className="px-4 mt-4 mb-3">
              <div
                className="rounded-lg px-3 py-3"
                style={{
                  background: "rgba(34,197,94,0.04)",
                  border: "1px solid rgba(34,197,94,0.1)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="text-[10px] uppercase tracking-wider mb-1"
                      style={{ color: "#4a664a" }}
                    >
                      Live Market Price
                    </p>
                    <p
                      className="text-lg font-bold"
                      style={{ fontFamily: "var(--font-bricolage)", color: "#22c55e" }}
                    >
                      ₹{CURRENT_PRICE.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-md" style={{ background: "rgba(34,197,94,0.08)" }}>
                    <Zap size={10} style={{ color: "#22c55e" }} />
                    <span className="text-[10px] font-medium" style={{ color: "#22c55e" }}>Auto-set</span>
                  </div>
                </div>
                <p className="text-[10px] mt-1.5" style={{ color: "#4a664a" }}>
                  Price is determined by blockchain smart contract
                </p>
              </div>
            </div>

            <div className="px-4 space-y-3">
              {/* Wallet status */}
              {!isConnected && (
                <div
                  className="rounded-lg px-3 py-2.5 flex items-center gap-2 text-xs"
                  style={{
                    background: "rgba(217,119,6,0.08)",
                    border: "1px solid rgba(217,119,6,0.15)",
                    color: "#d97706",
                  }}
                >
                  <Wallet size={13} />
                  Connect wallet to trade
                </div>
              )}

              {/* Amount input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    className="text-[10px] uppercase tracking-wider"
                    style={{ color: "#4a664a" }}
                  >
                    Amount (VGC)
                  </label>
                  {isConnected && buySellMode === "sell" && (
                    <span className="text-[10px]" style={{ color: "#4a664a" }}>
                      Avail: 0.238 VGC
                    </span>
                  )}
                </div>
                <div
                  className="flex items-center rounded-lg px-3 py-2.5"
                  style={{
                    background: "#141a14",
                    border: "1px solid rgba(34,197,94,0.1)",
                  }}
                >
                  <input
                    type="number"
                    value={buySellMode === "buy" ? buyAmount : sellAmount}
                    onChange={(e) =>
                      buySellMode === "buy"
                        ? setBuyAmount(e.target.value)
                        : setSellAmount(e.target.value)
                    }
                    placeholder="0.00"
                    className="flex-1 bg-transparent border-none outline-none text-sm"
                    style={{
                      color: "#f0faf0",
                      fontFamily: "var(--font-jetbrains-mono)",
                    }}
                  />
                  <span className="text-xs" style={{ color: "#4a664a" }}>
                    VGC
                  </span>
                </div>
              </div>

              {/* Quick percentage buttons */}
              <div className="grid grid-cols-4 gap-1.5">
                {["25%", "50%", "75%", "100%"].map((pct) => (
                  <button
                    key={pct}
                    className="py-1.5 rounded text-[10px] font-medium transition-all"
                    style={{
                      background: "rgba(34,197,94,0.06)",
                      border: "1px solid rgba(34,197,94,0.08)",
                      color: "#86a886",
                      cursor: "pointer",
                    }}
                  >
                    {pct}
                  </button>
                ))}
              </div>

              {/* Total */}
              <div>
                <label
                  className="text-[10px] uppercase tracking-wider block mb-1.5"
                  style={{ color: "#4a664a" }}
                >
                  Total
                </label>
                <div
                  className="flex items-center justify-between rounded-lg px-3 py-2.5"
                  style={{
                    background: "#141a14",
                    border: "1px solid rgba(34,197,94,0.1)",
                  }}
                >
                  <span
                    className="text-sm font-bold"
                    style={{
                      fontFamily: "var(--font-bricolage)",
                      color: "#f0faf0",
                    }}
                  >
                    ₹
                    {(buySellMode === "buy" ? buyTotal : sellTotal).toLocaleString(
                      "en-IN",
                      { maximumFractionDigits: 2 }
                    )}
                  </span>
                  <span className="text-xs" style={{ color: "#4a664a" }}>
                    INR
                  </span>
                </div>
              </div>

              {/* Impact preview */}
              {(parseFloat(buyAmount) > 0 || parseFloat(sellAmount) > 0) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="rounded-lg px-3 py-2.5"
                  style={{
                    background: "rgba(34,197,94,0.04)",
                    border: "1px solid rgba(34,197,94,0.08)",
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Leaf size={11} style={{ color: "#22c55e" }} />
                    <span className="text-[10px] uppercase tracking-wider" style={{ color: "#22c55e" }}>
                      Impact Preview
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: "#86a886" }}>
                    {buySellMode === "buy"
                      ? `Offsets ${buyAmount || 0} tonnes CO₂ — equivalent to ${Math.round(
                          (parseFloat(buyAmount) || 0) * 2400
                        )} meals rescued`
                      : `Selling ${sellAmount || 0} VGC carbon credits`}
                  </p>
                </motion.div>
              )}

              {/* Action button */}
              <button
                onClick={() => !isConnected && connect()}
                className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background:
                    buySellMode === "buy"
                      ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
                      : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                  color: buySellMode === "buy" ? "#050805" : "#fff",
                  border: "none",
                  cursor: "pointer",
                  boxShadow:
                    buySellMode === "buy"
                      ? "0 0 20px rgba(34,197,94,0.2)"
                      : "0 0 20px rgba(239,68,68,0.2)",
                }}
              >
                {isConnected
                  ? buySellMode === "buy"
                    ? "Buy VGC"
                    : "Sell VGC"
                  : "Connect Wallet"}
              </button>

              {/* Fee info */}
              <div className="flex items-center justify-between text-[10px] pt-1" style={{ color: "#4a664a" }}>
                <span>Fee: 0.1%</span>
                <span>Network: Polygon</span>
              </div>
            </div>
          </div>

          {/* ─── BOTTOM LEFT: Recent Trades + Listings ─── */}
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: "#0a0f0a",
              border: "1px solid rgba(34,197,94,0.06)",
            }}
          >
            {/* Tab selector */}
            <div
              className="flex border-b"
              style={{ borderColor: "rgba(34,197,94,0.06)" }}
            >
              {[
                { key: "trades", label: "Recent Trades", icon: Activity },
                { key: "listings", label: "Verified Listings", icon: ShieldCheck },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() =>
                    setActiveTab(t.key === "trades" ? "spot" : "sell")
                  }
                  className="flex items-center gap-1.5 px-4 py-3 text-xs font-medium transition-all"
                  style={{
                    color:
                      (t.key === "trades" && activeTab === "spot") ||
                      (t.key === "listings" && activeTab === "sell")
                        ? "#f0faf0"
                        : "#4a664a",
                    borderBottom:
                      (t.key === "trades" && activeTab === "spot") ||
                      (t.key === "listings" && activeTab === "sell")
                        ? "2px solid #22c55e"
                        : "2px solid transparent",
                    background: "none",
                    border: "none",
                    borderBottomWidth: 2,
                    borderBottomStyle: "solid",
                    borderBottomColor:
                      (t.key === "trades" && activeTab === "spot") ||
                      (t.key === "listings" && activeTab === "sell")
                        ? "#22c55e"
                        : "transparent",
                    cursor: "pointer",
                  }}
                >
                  <t.icon size={12} />
                  {t.label}
                </button>
              ))}
            </div>

            {activeTab === "spot" ? (
              <>
                {/* Recent trades header */}
                <div
                  className="grid grid-cols-3 px-4 py-2 text-[10px] uppercase tracking-wider"
                  style={{ color: "#4a664a" }}
                >
                  <span>Price (₹)</span>
                  <span className="text-right">Amount (VGC)</span>
                  <span className="text-right">Time</span>
                </div>
                {/* Trades list */}
                <div className="max-h-64 overflow-y-auto">
                  {RECENT_TRADES.map((trade, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="grid grid-cols-3 px-4 py-[5px] text-[11px] font-mono hover:bg-white/[0.02] transition-colors"
                    >
                      <span
                        style={{
                          color: trade.side === "buy" ? "#22c55e" : "#ef4444",
                        }}
                      >
                        {trade.price.toFixed(2)}
                      </span>
                      <span className="text-right" style={{ color: "#c8d8c8" }}>
                        {trade.amount.toFixed(1)}
                      </span>
                      <span className="text-right" style={{ color: "#4a664a" }}>
                        {trade.time}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Listings header */}
                <div
                  className="grid px-4 py-2 text-[10px] uppercase tracking-wider"
                  style={{
                    color: "#4a664a",
                    gridTemplateColumns: "2fr 1fr 1fr 1fr",
                  }}
                >
                  <span>Seller</span>
                  <span className="text-right">VGC</span>
                  <span className="text-right">Price</span>
                  <span className="text-right">Action</span>
                </div>
                {/* Listings */}
                <div className="max-h-64 overflow-y-auto">
                  {listings.map((listing, i) => (
                    <motion.div
                      key={listing.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="grid px-4 py-2.5 text-xs hover:bg-white/[0.02] transition-colors items-center"
                      style={{
                        gridTemplateColumns: "2fr 1fr 1fr 1fr",
                        borderBottom: "1px solid rgba(34,197,94,0.04)",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                          style={{
                            background: "rgba(34,197,94,0.15)",
                            color: "#22c55e",
                          }}
                        >
                          ✓
                        </span>
                        <div>
                          <span style={{ color: "#f0faf0", fontWeight: 500 }}>
                            {listing.sellerName}
                          </span>
                          <span
                            className="block text-[10px] font-mono"
                            style={{ color: "#4a664a" }}
                          >
                            {listing.txHash}
                          </span>
                        </div>
                      </div>
                      <span
                        className="text-right font-mono"
                        style={{ color: "#c8d8c8" }}
                      >
                        {listing.vgcAmount}
                      </span>
                      <span
                        className="text-right font-bold"
                        style={{
                          color: "#22c55e",
                          fontFamily: "var(--font-bricolage)",
                        }}
                      >
                        ₹{listing.pricePerVGC}
                      </span>
                      <div className="text-right">
                        <button
                          onClick={() => !isConnected && connect()}
                          className="px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all"
                          style={{
                            background: "#22c55e",
                            color: "#050805",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          Buy
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ═══ Market Info Cards ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
          {[
            {
              icon: ShieldCheck,
              label: "Blockchain Verified",
              value: "Every VGC is minted on Polygon after MRV verification",
              accent: "#22c55e",
            },
            {
              icon: Activity,
              label: "1 VGC = 1 Tonne CO₂",
              value: "Each token represents 1 tonne of CO₂ prevented via food rescue",
              accent: "#3b82f6",
            },
            {
              icon: TrendingUp,
              label: "Growing Marketplace",
              value: `${totalVGCAvailable.toFixed(1)} VGC available from ${listings.length} verified sellers`,
              accent: "#d97706",
            },
            {
              icon: Zap,
              label: "Instant Settlement",
              value: "Smart contract execution on Polygon — trades settle in seconds",
              accent: "#7c3aed",
            },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="rounded-xl p-4 group card-hover"
                style={{
                  background: "#0a0f0a",
                  border: "1px solid rgba(34,197,94,0.06)",
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                  style={{
                    background: `${card.accent}12`,
                    border: `1px solid ${card.accent}20`,
                  }}
                >
                  <Icon size={15} style={{ color: card.accent }} />
                </div>
                <h4
                  className="text-xs font-semibold mb-1"
                  style={{
                    fontFamily: "var(--font-bricolage)",
                    color: "#f0faf0",
                  }}
                >
                  {card.label}
                </h4>
                <p className="text-[11px] leading-relaxed" style={{ color: "#86a886" }}>
                  {card.value}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
}
