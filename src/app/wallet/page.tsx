"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Wallet,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Copy,
  Shield,
  Coins,
  ArrowRight,
  Leaf,
  RefreshCw,
  LogIn,
  Globe,
  Unlink,
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";

const METAMASK_INSTALL_URL = "https://metamask.io/download/";

export default function WalletPage() {
  const { user, isAuthenticated, isLoading: authLoading, saveWalletAddress } = useAuth();
  const {
    address,
    shortAddress,
    chainId,
    connecting,
    isInstalled,
    isConnected,
    isCorrectNetwork,
    connect,
    switchNetwork,
  } = useWallet();

  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [manualAddress, setManualAddress] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Check if wallet is already saved to profile
  const savedWallet = user?.walletAddress;
  const hasWalletSaved = !!savedWallet;

  // When MetaMask connects, auto-populate manual field too
  useEffect(() => {
    if (address) {
      setManualAddress(address);
    }
  }, [address]);

  const handleSaveWallet = async () => {
    const walletToSave = address || manualAddress;
    if (!walletToSave || !isAuthenticated) return;

    // Basic Ethereum address validation
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletToSave)) {
      return;
    }

    setSaveLoading(true);
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 1000));
    saveWalletAddress(walletToSave);
    setSaved(true);
    setSaveLoading(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ─── Auth gate ───
  if (!authLoading && !isAuthenticated) {
    return (
      <div style={{ background: "#050805", minHeight: "100vh", color: "#f0faf0" }}>
        <Navbar />
        <div className="max-w-md mx-auto px-5 pt-32 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: "rgba(217,119,6,0.1)", border: "1px solid rgba(217,119,6,0.2)" }}
          >
            <LogIn size={28} style={{ color: "#d97706" }} />
          </div>
          <h2
            className="text-xl font-bold mb-3"
            style={{ fontFamily: "var(--font-bricolage)" }}
          >
            Sign in to manage your wallet
          </h2>
          <p className="text-sm mb-8" style={{ color: "#86a886" }}>
            You need an account to connect and save your wallet address.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/auth/login"
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium"
              style={{ border: "1px solid rgba(34,197,94,0.2)", color: "#86a886", textDecoration: "none" }}
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold"
              style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#050805", textDecoration: "none" }}
            >
              Register <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#050805", minHeight: "100vh", color: "#f0faf0" }}>
      <Navbar />

      <div className="max-w-2xl mx-auto px-5" style={{ paddingTop: 100, paddingBottom: 80 }}>
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(34,197,94,0.15))",
              border: "1px solid rgba(124,58,237,0.2)",
            }}
          >
            <Wallet size={28} style={{ color: "#7c3aed" }} />
          </motion.div>
          <h1
            className="text-2xl font-bold mb-2"
            style={{ fontFamily: "var(--font-bricolage)" }}
          >
            Wallet Management
          </h1>
          <p className="text-sm" style={{ color: "#86a886" }}>
            Connect your MetaMask wallet to receive VGC tokens and trade on the carbon marketplace
          </p>
        </div>

        {/* ═══ Saved wallet indicator ═══ */}
        {hasWalletSaved && !saved && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl px-5 py-4 mb-6 flex items-center justify-between"
            style={{
              background: "rgba(34,197,94,0.04)",
              border: "1px solid rgba(34,197,94,0.12)",
            }}
          >
            <div className="flex items-center gap-3">
              <CheckCircle size={18} style={{ color: "#22c55e" }} />
              <div>
                <p className="text-sm font-medium">Wallet Connected</p>
                <p className="text-xs font-mono" style={{ color: "#86a886" }}>
                  {savedWallet}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleCopy(savedWallet!)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.15)",
                color: "#86a886",
                cursor: "pointer",
              }}
            >
              {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </motion.div>
        )}

        {/* ═══ Success state ═══ */}
        <AnimatePresence>
          {saved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl p-8 text-center mb-6"
              style={{
                background: "#0a0f0a",
                border: "1px solid rgba(34,197,94,0.15)",
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <CheckCircle size={48} style={{ color: "#22c55e", margin: "0 auto 16px" }} />
              </motion.div>
              <h2
                className="text-xl font-bold mb-2"
                style={{ fontFamily: "var(--font-bricolage)", color: "#22c55e" }}
              >
                Wallet Saved Successfully!
              </h2>
              <p className="text-xs font-mono mb-1" style={{ color: "#86a886" }}>
                {address || manualAddress}
              </p>
              <p className="text-sm mb-6" style={{ color: "#4a664a" }}>
                Your wallet address is now linked to your VASHUDHA account.
                You'll receive VGC tokens and carbon credits here.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link
                  href="/marketplace"
                  className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold"
                  style={{
                    background: "linear-gradient(135deg, #22c55e, #16a34a)",
                    color: "#050805",
                    textDecoration: "none",
                  }}
                >
                  Go to Marketplace <ArrowRight size={16} />
                </Link>
                <button
                  onClick={() => setSaved(false)}
                  className="px-5 py-3 rounded-xl text-sm font-medium"
                  style={{
                    border: "1px solid rgba(34,197,94,0.15)",
                    color: "#86a886",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                >
                  Change Wallet
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ Main wallet setup (hidden after save) ═══ */}
        {!saved && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {/* ─── Step 1: MetaMask Status ─── */}
            <div
              className="rounded-xl p-5"
              style={{
                background: "#0a0f0a",
                border: "1px solid rgba(34,197,94,0.06)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: "rgba(124,58,237,0.15)", color: "#7c3aed" }}
                >
                  1
                </span>
                <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-bricolage)" }}>
                  MetaMask Wallet
                </h3>
              </div>

              {!isInstalled ? (
                /* MetaMask not installed */
                <div>
                  <div
                    className="rounded-lg px-4 py-3 flex items-start gap-3 mb-4"
                    style={{
                      background: "rgba(217,119,6,0.06)",
                      border: "1px solid rgba(217,119,6,0.12)",
                    }}
                  >
                    <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" style={{ color: "#d97706" }} />
                    <div>
                      <p className="text-xs font-medium mb-1" style={{ color: "#d97706" }}>
                        MetaMask not detected
                      </p>
                      <p className="text-xs" style={{ color: "#86a886" }}>
                        You need MetaMask to create a crypto wallet and receive VGC tokens.
                        Install it for your browser below.
                      </p>
                    </div>
                  </div>
                  <a
                    href={METAMASK_INSTALL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold"
                    style={{
                      background: "linear-gradient(135deg, #f59e0b, #d97706)",
                      color: "#050805",
                      textDecoration: "none",
                    }}
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                      alt="MetaMask"
                      width={20}
                      height={20}
                    />
                    Install MetaMask
                    <ExternalLink size={14} />
                  </a>
                  <p className="text-center text-[10px] mt-3" style={{ color: "#4a664a" }}>
                    After installing, refresh this page and click &ldquo;Connect Wallet&rdquo;
                  </p>
                </div>
              ) : isConnected ? (
                /* MetaMask connected */
                <div>
                  <div
                    className="rounded-lg px-4 py-3 flex items-center justify-between mb-3"
                    style={{
                      background: "rgba(34,197,94,0.04)",
                      border: "1px solid rgba(34,197,94,0.12)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: "rgba(34,197,94,0.12)" }}
                      >
                        <CheckCircle size={16} style={{ color: "#22c55e" }} />
                      </div>
                      <div>
                        <p className="text-xs font-medium" style={{ color: "#22c55e" }}>
                          Connected
                        </p>
                        <p className="text-xs font-mono" style={{ color: "#f0faf0" }}>
                          {shortAddress}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(address!)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium"
                      style={{
                        background: "rgba(34,197,94,0.06)",
                        border: "1px solid rgba(34,197,94,0.1)",
                        color: "#86a886",
                        cursor: "pointer",
                      }}
                    >
                      {copied ? <CheckCircle size={10} /> : <Copy size={10} />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>

                  {/* Full address display */}
                  <div
                    className="rounded-lg px-3 py-2.5 mb-3 overflow-hidden"
                    style={{
                      background: "#141a14",
                      border: "1px solid rgba(34,197,94,0.08)",
                    }}
                  >
                    <p
                      className="text-[10px] uppercase tracking-wider mb-1"
                      style={{ color: "#4a664a" }}
                    >
                      Full Address
                    </p>
                    <p
                      className="text-xs font-mono break-all"
                      style={{ color: "#f0faf0", wordBreak: "break-all" }}
                    >
                      {address}
                    </p>
                  </div>

                  {/* Network status */}
                  <div
                    className="rounded-lg px-3 py-2.5 flex items-center justify-between"
                    style={{
                      background: "#141a14",
                      border: "1px solid rgba(34,197,94,0.08)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Globe size={12} style={{ color: isCorrectNetwork ? "#22c55e" : "#d97706" }} />
                      <span className="text-xs" style={{ color: "#86a886" }}>
                        Network: {isCorrectNetwork ? "Polygon (Correct)" : `Chain ${chainId}`}
                      </span>
                    </div>
                    {!isCorrectNetwork && (
                      <button
                        onClick={switchNetwork}
                        className="text-[10px] font-medium px-2.5 py-1 rounded"
                        style={{
                          background: "rgba(217,119,6,0.1)",
                          color: "#d97706",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Switch to Polygon
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* MetaMask installed but not connected */
                <div>
                  <p className="text-xs mb-4" style={{ color: "#86a886" }}>
                    MetaMask is installed. Click below to connect your wallet and authorize VASHUDHA to read your address.
                  </p>
                  <button
                    onClick={connect}
                    disabled={connecting}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold"
                    style={{
                      background: connecting
                        ? "#141a14"
                        : "linear-gradient(135deg, #7c3aed, #6d28d9)",
                      color: connecting ? "#4a664a" : "#fff",
                      border: "none",
                      cursor: connecting ? "not-allowed" : "pointer",
                      boxShadow: connecting ? "none" : "0 0 20px rgba(124,58,237,0.2)",
                    }}
                  >
                    {connecting ? (
                      <>
                        <RefreshCw size={15} className="animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Wallet size={16} />
                        Connect MetaMask
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* ─── OR: Manual address entry ─── */}
            <div className="relative flex items-center gap-3 px-4">
              <div className="flex-1 h-px" style={{ background: "rgba(34,197,94,0.08)" }} />
              <button
                onClick={() => setShowManual(!showManual)}
                className="text-[10px] uppercase tracking-wider font-medium px-3 py-1.5 rounded-full"
                style={{
                  color: "#4a664a",
                  background: "#0a0f0a",
                  border: "1px solid rgba(34,197,94,0.08)",
                  cursor: "pointer",
                }}
              >
                {showManual ? "Hide manual entry" : "Or enter manually"}
              </button>
              <div className="flex-1 h-px" style={{ background: "rgba(34,197,94,0.08)" }} />
            </div>

            <AnimatePresence>
              {showManual && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl p-5 overflow-hidden"
                  style={{
                    background: "#0a0f0a",
                    border: "1px solid rgba(34,197,94,0.06)",
                  }}
                >
                  <p className="text-xs mb-3" style={{ color: "#86a886" }}>
                    If you already have a wallet address from another provider, paste it below:
                  </p>
                  <div
                    className="flex items-center rounded-xl overflow-hidden"
                    style={{
                      background: "#141a14",
                      border: "1px solid rgba(34,197,94,0.1)",
                    }}
                  >
                    <input
                      type="text"
                      value={manualAddress}
                      onChange={(e) => setManualAddress(e.target.value)}
                      placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f..."
                      className="flex-1 bg-transparent border-none outline-none text-xs font-mono px-3 py-3"
                      style={{ color: "#f0faf0" }}
                    />
                  </div>
                  {manualAddress && !/^0x[a-fA-F0-9]{40}$/.test(manualAddress) && (
                    <p className="text-[10px] mt-2" style={{ color: "#ef4444" }}>
                      Please enter a valid Ethereum address (0x + 40 hex chars)
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ─── Step 2: Save to profile ─── */}
            <div
              className="rounded-xl p-5"
              style={{
                background: "#0a0f0a",
                border: "1px solid rgba(34,197,94,0.06)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}
                >
                  2
                </span>
                <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-bricolage)" }}>
                  Save to Your Profile
                </h3>
              </div>

              <p className="text-xs mb-4" style={{ color: "#86a886" }}>
                Your wallet address will be saved with your account. You&apos;ll receive VGC tokens and carbon
                credits directly to this wallet.
              </p>

              {/* What gets linked */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { icon: Coins, label: "VGC Tokens", desc: "Carbon credits" },
                  { icon: Shield, label: "Certificates", desc: "On-chain proofs" },
                  { icon: Wallet, label: "Trading", desc: "Marketplace access" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="rounded-lg p-3 text-center"
                      style={{ background: "#141a14" }}
                    >
                      <Icon size={16} style={{ color: "#22c55e", margin: "0 auto 6px" }} />
                      <p className="text-[10px] font-semibold mb-0.5" style={{ color: "#f0faf0" }}>
                        {item.label}
                      </p>
                      <p className="text-[9px]" style={{ color: "#4a664a" }}>
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={handleSaveWallet}
                disabled={saveLoading || (!address && (!manualAddress || !/^0x[a-fA-F0-9]{40}$/.test(manualAddress)))}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background:
                    !address && (!manualAddress || !/^0x[a-fA-F0-9]{40}$/.test(manualAddress))
                      ? "#141a14"
                      : saveLoading
                      ? "#141a14"
                      : "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                  color:
                    !address && (!manualAddress || !/^0x[a-fA-F0-9]{40}$/.test(manualAddress))
                      ? "#4a664a"
                      : saveLoading
                      ? "#4a664a"
                      : "#050805",
                  cursor:
                    !address && (!manualAddress || !/^0x[a-fA-F0-9]{40}$/.test(manualAddress))
                      ? "not-allowed"
                      : "pointer",
                  border: "none",
                  boxShadow:
                    address || (manualAddress && /^0x[a-fA-F0-9]{40}$/.test(manualAddress))
                      ? "0 0 20px rgba(34,197,94,0.2)"
                      : "none",
                }}
              >
                {saveLoading ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Save Wallet to Profile
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>

            {/* ─── Security note ─── */}
            <div
              className="rounded-xl px-4 py-3 flex items-start gap-3"
              style={{
                background: "rgba(59,130,246,0.04)",
                border: "1px solid rgba(59,130,246,0.1)",
              }}
            >
              <Shield size={14} className="flex-shrink-0 mt-0.5" style={{ color: "#3b82f6" }} />
              <p className="text-[11px] leading-relaxed" style={{ color: "#86a886" }}>
                <strong style={{ color: "#3b82f6" }}>Security:</strong> VASHUDHA only stores your
                public wallet address. We never have access to your private keys, seed phrase, or
                wallet funds. All transactions require your MetaMask approval.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
