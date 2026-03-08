"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, MapPin, Clock, CheckCircle, ShieldAlert, LogIn } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { calculateMeals, calculateCO2, calculateVGC } from "@/lib/calculations";
import { createListing } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

const schema = z.object({
  foodDescription: z.string().min(5, "Describe the food (min 5 chars)"),
  quantityKg: z.number({ error: "Enter a number" }).min(0.5).max(1000),
  expiryHours: z.enum(["1", "2", "4", "8"]),
  pickupAddress: z.string().min(10, "Enter full address"),
  contactPhone: z.string().min(10, "Enter valid phone number"),
});

type FormData = z.infer<typeof schema>;

interface SubmittedState {
  ngoName: string;
  eta: number;
  meals: number;
  vgc: number;
  listingId: string;
}

export default function DonatePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [quantity, setQuantity] = useState(10);
  const [submitted, setSubmitted] = useState<SubmittedState | null>(null);
  const [loading, setLoading] = useState(false);

  // Pre-fill from profile
  const defaultAddress = user && "address" in user ? `${user.address}, ${user.city}` : "";
  const defaultPhone = user?.phone || "";

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { expiryHours: "2", quantityKg: 10, pickupAddress: defaultAddress, contactPhone: defaultPhone },
  });

  const meals = calculateMeals(quantity);
  const co2 = calculateCO2(quantity);
  const vgc = calculateVGC(quantity);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await createListing(data);
    } catch {
      // Proceed with mock for demo
    }
    setTimeout(() => {
      setSubmitted({
        ngoName: "Aashray Foundation",
        eta: 18,
        meals: calculateMeals(data.quantityKg),
        vgc: calculateVGC(data.quantityKg),
        listingId: "HM-" + Date.now().toString().slice(-6),
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div style={{ background: "#050805", minHeight: "100vh", color: "#f0faf0" }}>
      <Navbar />
      <div style={{ paddingTop: 96, paddingBottom: 80 }}>
        <div style={{ maxWidth: 540, margin: "0 auto", padding: "0 20px" }}>
          {/* Auth Gate */}
          {!authLoading && !isAuthenticated ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ background: "rgba(217,119,6,0.1)", border: "1px solid rgba(217,119,6,0.2)" }}
              >
                <ShieldAlert size={28} style={{ color: "#d97706" }} />
              </div>
              <h2
                className="text-xl font-bold mb-3"
                style={{ fontFamily: "var(--font-bricolage)" }}
              >
                Authentication Required
              </h2>
              <p className="text-sm mb-8" style={{ color: "#86a886", maxWidth: 360, margin: "0 auto" }}>
                You need to register and verify your account before you can donate food.
                This helps us ensure food safety and traceability.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium"
                  style={{ border: "1px solid rgba(34,197,94,0.2)", color: "#86a886" }}
                >
                  <LogIn size={16} /> Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold"
                  style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#050805" }}
                >
                  Register Now <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          ) : (
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="text-center mb-10">
                  <p className="type-label mb-2" style={{ color: "#22c55e" }}>Donor Portal</p>
                  <h1 className="type-section" style={{ color: "#f0faf0" }}>Post Surplus Food</h1>
                  <p className="type-body mt-3" style={{ color: "#86a886" }}>Fill in the details below. An NGO will be dispatched automatically.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  {/* Food description */}
                  <div>
                    <label className="type-label block mb-2" style={{ color: "#86a886" }}>What are you donating?</label>
                    <input {...register("foodDescription")} placeholder="e.g. Biryani, Dal Rice, Mixed Sabzi..."
                      style={{ width: "100%", padding: "12px 16px", borderRadius: 12, background: "#0d110d", border: "1px solid rgba(34,197,94,0.2)", color: "#f0faf0", fontSize: 14, outline: "none" }} />
                    {errors.foodDescription && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.foodDescription.message}</p>}
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="type-label block mb-2" style={{ color: "#86a886" }}>How much? (kg)</label>
                    <input type="number" min={0.5} max={1000} step={0.5}
                      {...register("quantityKg", { valueAsNumber: true, onChange: (e) => setQuantity(Number(e.target.value)) })}
                      style={{ width: "100%", padding: "12px 16px", borderRadius: 12, background: "#0d110d", border: "1px solid rgba(34,197,94,0.2)", color: "#f0faf0", fontSize: 14, outline: "none" }} />
                    <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 10, background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)" }}>
                      <span style={{ color: "#86a886", fontSize: 13 }}>This will feed approximately </span>
                      <span style={{ color: "#22c55e", fontWeight: 700, fontSize: 20, fontFamily: "var(--font-bricolage)" }}>{meals}</span>
                      <span style={{ color: "#86a886", fontSize: 13 }}> people · </span>
                      <span style={{ color: "#22c55e", fontSize: 13, fontWeight: 500 }}>{co2} kg CO₂ saved</span>
                    </div>
                    {errors.quantityKg && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.quantityKg.message}</p>}
                  </div>

                  {/* Expiry */}
                  <div>
                    <label className="type-label block mb-3" style={{ color: "#86a886" }}>How long until it expires?</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
                      {(["1", "2", "4", "8"] as const).map((h) => (
                        <button key={h} type="button" onClick={() => setValue("expiryHours", h)}
                          {...register("expiryHours")}
                          style={{
                            padding: "10px 0", borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "all 0.15s",
                            background: watch("expiryHours") === h ? "#22c55e" : "#0d110d",
                            color: watch("expiryHours") === h ? "#050805" : "#86a886",
                            border: watch("expiryHours") === h ? "1px solid #22c55e" : "1px solid rgba(34,197,94,0.2)",
                          }}>
                          <Clock size={12} style={{ display: "inline", marginRight: 4 }} />
                          {h}h
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="type-label block mb-2" style={{ color: "#86a886" }}>Pickup Address</label>
                    <div style={{ position: "relative" }}>
                      <MapPin size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#4a664a" }} />
                      <input {...register("pickupAddress")} placeholder="Enter full address for pickup..."
                        style={{ width: "100%", padding: "12px 16px 12px 36px", borderRadius: 12, background: "#0d110d", border: "1px solid rgba(34,197,94,0.2)", color: "#f0faf0", fontSize: 14, outline: "none" }} />
                    </div>
                    {errors.pickupAddress && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.pickupAddress.message}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="type-label block mb-2" style={{ color: "#86a886" }}>Contact Number</label>
                    <input {...register("contactPhone")} placeholder="+91-XXXXX-XXXXX" type="tel"
                      style={{ width: "100%", padding: "12px 16px", borderRadius: 12, background: "#0d110d", border: "1px solid rgba(34,197,94,0.2)", color: "#f0faf0", fontSize: 14, outline: "none" }} />
                    {errors.contactPhone && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.contactPhone.message}</p>}
                  </div>

                  {/* VGC preview */}
                  <div style={{ padding: "12px 16px", borderRadius: 12, background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)" }}>
                    <p style={{ fontSize: 12, color: "#86a886", marginBottom: 4 }}>You will earn</p>
                    <p style={{ fontSize: 22, fontWeight: 700, color: "#7c3aed", fontFamily: "var(--font-bricolage)" }}>
                      {vgc.toFixed(4)} VGC <span style={{ fontSize: 12, color: "#86a886", fontWeight: 400 }}>≈ ₹{Math.round(vgc * 800)}</span>
                    </p>
                  </div>

                  <button type="submit" disabled={loading}
                    style={{ padding: "16px 24px", borderRadius: 12, background: "#22c55e", color: "#050805", fontSize: 16, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? 0.7 : 1 }}>
                    {loading ? "Dispatching NGO..." : (<>Rescue This Food <ArrowRight size={18} /></>)}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="tracking" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <div style={{ borderRadius: 20, padding: 32, background: "#0d110d", border: "1px solid rgba(34,197,94,0.25)", boxShadow: "0 0 40px rgba(34,197,94,0.1)" }}>
                  <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <CheckCircle size={48} style={{ color: "#22c55e", margin: "0 auto 12px" }} />
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f0faf0", fontFamily: "var(--font-bricolage)" }}>NGO Dispatched!</h2>
                    <p style={{ color: "#86a886", fontSize: 14, marginTop: 4 }}>{submitted.ngoName}</p>
                  </div>

                  {/* ETA bar */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ color: "#86a886", fontSize: 13 }}>ETA</span>
                      <span style={{ color: "#22c55e", fontWeight: 600, fontSize: 14 }}>{submitted.eta} minutes</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 2, background: "#141a14", overflow: "hidden" }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: "35%" }} transition={{ duration: 1.5, ease: "easeOut" }}
                        style={{ height: "100%", background: "linear-gradient(90deg, #22c55e, #86efac)", borderRadius: 2 }} />
                    </div>
                  </div>

                  {/* Status pipeline */}
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 24 }}>
                    {["Dispatched", "Collected", "Delivered"].map((step, i) => (
                      <div key={step} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ padding: "4px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600, textAlign: "center", background: i === 0 ? "#22c55e" : "#141a14", color: i === 0 ? "#050805" : "#4a664a" }}>{step}</div>
                        {i < 2 && <div style={{ width: "100%", height: 2, background: i === 0 ? "rgba(34,197,94,0.3)" : "#141a14" }} />}
                      </div>
                    ))}
                  </div>

                  {/* Impact numbers */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                    <div style={{ padding: "14px", borderRadius: 12, background: "#141a14", textAlign: "center" }}>
                      <p style={{ fontSize: 22, fontWeight: 700, color: "#22c55e", fontFamily: "var(--font-bricolage)" }}>{submitted.meals}</p>
                      <p style={{ fontSize: 11, color: "#86a886", marginTop: 2 }}>Meals will be served</p>
                    </div>
                    <div style={{ padding: "14px", borderRadius: 12, background: "#141a14", textAlign: "center" }}>
                      <p style={{ fontSize: 22, fontWeight: 700, color: "#7c3aed", fontFamily: "var(--font-bricolage)" }}>{submitted.vgc.toFixed(3)}</p>
                      <p style={{ fontSize: 11, color: "#86a886", marginTop: 2 }}>VGC will be minted</p>
                    </div>
                  </div>

                  <p style={{ fontSize: 11, color: "#4a664a", textAlign: "center" }}>Rescue ID: {submitted.listingId}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
