"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowRight, MapPin, Clock, CheckCircle, ShieldAlert,
  LogIn, Navigation, Loader2, RefreshCw, AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { calculateMeals, calculateCO2, calculateVGC } from "@/lib/calculations";
import { createListing, trackListing } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useGeoLocation } from "@/hooks/useGeoLocation";

const schema = z.object({
  foodDescription: z.string().min(5, "Describe the food (min 5 chars)"),
  quantityKg: z.number({ message: "Enter a number" }).min(0.5).max(1000),
  expiryHours: z.enum(["1", "2", "4", "8"]),
  pickupAddress: z.string().min(10, "Enter full address"),
  contactPhone: z.string().min(10, "Enter valid phone number"),
});

type FormData = z.infer<typeof schema>;

interface TrackingState {
  ngoName: string;
  ngoPhone: string;
  eta: number | null;
  meals: number;
  vgc: number;
  co2: number;
  listingId: string;
  rescueStatus: string;
  donorHgc: number;
}

const PIPELINE = ["Dispatched", "En Route", "Collected", "Delivered"] as const;

const STATUS_STEP: Record<string, number> = {
  available:   0,
  claimed:     1,
  in_progress: 2,
  rescued:     3,
  delivered:   3,
};

export default function DonatePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { coords, loading: geoLoading, error: geoError, getLocation } = useGeoLocation();

  const [quantity, setQuantity] = useState(10);
  const [tracking, setTracking] = useState<TrackingState | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const profileAddress = user
    ? (["address", "city"] as const)
        .map((k) => (user as Record<string, unknown>)[k] as string)
        .filter(Boolean)
        .join(", ")
    : "";

  const { register, handleSubmit, formState: { errors }, setValue, watch } =
    useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: {
        expiryHours: "2",
        quantityKg: 10,
        pickupAddress: profileAddress,
        contactPhone: user?.phone || "",
      },
    });

  useEffect(() => {
    if (user) {
      if (profileAddress) setValue("pickupAddress", profileAddress);
      if (user.phone)     setValue("contactPhone",  user.phone);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Request GPS on page load
  useEffect(() => {
    getLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const meals = calculateMeals(quantity);
  const co2   = calculateCO2(quantity);
  const vgc   = calculateVGC(quantity);

  const handleUseMyLocation = async () => {
    await getLocation();
  };

  const onSubmit = async (data: FormData) => {
    setSubmitLoading(true);
    setSubmitError(null);

    const donorId = user?.id;
    if (!donorId) {
      setSubmitError("Could not identify your account. Please log in again.");
      setSubmitLoading(false);
      return;
    }

    const lat =
      coords?.lat ??
      (user as Record<string, unknown>)?.latitude as number | undefined;
    const lng =
      coords?.lng ??
      (user as Record<string, unknown>)?.longitude as number | undefined;

    if (lat == null || lng == null) {
      setSubmitError(
        "We need your location to dispatch an NGO. Please allow location access and try again."
      );
      setSubmitLoading(false);
      await getLocation();
      return;
    }

    try {
      const res = await createListing({
        food_description:    data.foodDescription,
        quantity_kg:         data.quantityKg,
        expiry_window_hours: parseInt(data.expiryHours, 10),
        pickup_address:      data.pickupAddress,
        pickup_lat:          lat,
        pickup_lng:          lng,
        donor_id:            donorId,
        contact_phone:       data.contactPhone,
      });

      const payload = res.data as {
        listing: { id: string; status: string };
        dispatch: {
          ngo?: { name?: string; phone?: string };
          ngo_name?: string;
          eta_minutes?: number;
          matched?: boolean;
        };
        preview_impact: {
          meals_served: number;
          co2_prevented_kg: number;
          donor_hgc: number;
        };
      };

      const ngoName  = payload.dispatch?.ngo?.name  ?? payload.dispatch?.ngo_name  ?? "An NGO partner";
      const ngoPhone = payload.dispatch?.ngo?.phone ?? "";
      const eta      = payload.dispatch?.eta_minutes ?? null;
      const impact   = payload.preview_impact;

      setTracking({
        ngoName,
        ngoPhone,
        eta,
        meals:        impact?.meals_served     ?? calculateMeals(data.quantityKg),
        vgc:          calculateVGC(data.quantityKg),
        co2:          impact?.co2_prevented_kg ?? calculateCO2(data.quantityKg),
        listingId:    payload.listing.id,
        rescueStatus: payload.listing.status ?? "available",
        donorHgc:     impact?.donor_hgc        ?? vgc,
      });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } }; message?: string };
      setSubmitError(
        axiosErr?.response?.data?.error ??
        axiosErr?.message ??
        "Failed to post listing. Please try again."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  /* Live tracking poll */
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!tracking?.listingId) return;

    pollRef.current = setInterval(async () => {
      try {
        const res = await trackListing(tracking.listingId);
        const data = res.data as {
          listing?: { status?: string };
          rescue?:  { status?: string; eta_minutes?: number };
          ngo?:     { name?: string };
        };
        const newStatus = data.rescue?.status ?? data.listing?.status ?? tracking.rescueStatus;
        const newEta    = data.rescue?.eta_minutes ?? tracking.eta;

        setTracking((prev) =>
          prev ? { ...prev, rescueStatus: newStatus, eta: newEta } : prev
        );

        if (["rescued", "delivered"].includes(newStatus)) {
          clearInterval(pollRef.current!);
        }
      } catch {
        // silently ignore poll errors
      }
    }, 10_000);

    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracking?.listingId]);

  const activeStep = tracking ? (STATUS_STEP[tracking.rescueStatus] ?? 0) : 0;

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
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-bricolage)" }}>
                Authentication Required
              </h2>
              <p className="text-sm mb-8" style={{ color: "#86a886", maxWidth: 360, margin: "0 auto 2rem" }}>
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

          ) : authLoading ? (
            <div className="flex justify-center py-24">
              <Loader2 size={32} className="animate-spin" style={{ color: "#22c55e" }} />
            </div>

          ) : (
            <AnimatePresence mode="wait">

              {/* ═══════════ FORM ═══════════ */}
              {!tracking ? (
                <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <div className="text-center mb-10">
                    <p className="type-label mb-2" style={{ color: "#22c55e" }}>Donor Portal</p>
                    <h1 className="type-section" style={{ color: "#f0faf0" }}>Post Surplus Food</h1>
                    <p className="type-body mt-3" style={{ color: "#86a886" }}>
                      Fill in the details below. An NGO will be dispatched automatically.
                    </p>
                  </div>

                  {/* GPS status bar */}
                  <div
                    className="rounded-xl px-4 py-2.5 mb-6 flex items-center justify-between gap-2 text-xs"
                    style={{
                      background: coords ? "rgba(34,197,94,0.06)" : "rgba(34,197,94,0.03)",
                      border: `1px solid ${coords ? "rgba(34,197,94,0.2)" : "rgba(34,197,94,0.1)"}`,
                    }}
                  >
                    <span className="flex items-center gap-1.5" style={{ color: coords ? "#22c55e" : "#86a886" }}>
                      {geoLoading ? (
                        <><Loader2 size={12} className="animate-spin" /> Detecting location…</>
                      ) : coords ? (
                        <><Navigation size={12} /> Location detected — NGO will be dispatched to your coordinates</>
                      ) : geoError ? (
                        <><AlertCircle size={12} style={{ color: "#ef4444" }} /><span style={{ color: "#ef4444" }}>{geoError}</span></>
                      ) : (
                        <><MapPin size={12} /> Location not yet captured</>
                      )}
                    </span>
                    {!geoLoading && !coords && (
                      <button
                        type="button" onClick={handleUseMyLocation}
                        style={{ color: "#22c55e", background: "none", border: "none", cursor: "pointer", fontSize: "inherit" }}
                      >
                        Allow
                      </button>
                    )}
                  </div>

                  {/* Submit error */}
                  {submitError && (
                    <div
                      className="rounded-xl px-4 py-3 mb-4 text-sm flex items-center gap-2"
                      style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}
                    >
                      <AlertCircle size={15} /> {submitError}
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                    {/* Food description */}
                    <div>
                      <label className="type-label block mb-2" style={{ color: "#86a886" }}>What are you donating?</label>
                      <input
                        {...register("foodDescription")}
                        placeholder="e.g. Biryani, Dal Rice, Mixed Sabzi…"
                        style={{ width: "100%", padding: "12px 16px", borderRadius: 12, background: "#0d110d", border: "1px solid rgba(34,197,94,0.2)", color: "#f0faf0", fontSize: 14, outline: "none" }}
                      />
                      {errors.foodDescription && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.foodDescription.message}</p>}
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="type-label block mb-2" style={{ color: "#86a886" }}>How much? (kg)</label>
                      <input
                        type="number" min={0.5} max={1000} step={0.5}
                        {...register("quantityKg", { valueAsNumber: true, onChange: (e) => setQuantity(Number(e.target.value)) })}
                        style={{ width: "100%", padding: "12px 16px", borderRadius: 12, background: "#0d110d", border: "1px solid rgba(34,197,94,0.2)", color: "#f0faf0", fontSize: 14, outline: "none" }}
                      />
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
                            style={{
                              padding: "10px 0", borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "all 0.15s",
                              background: watch("expiryHours") === h ? "#22c55e" : "#0d110d",
                              color:      watch("expiryHours") === h ? "#050805" : "#86a886",
                              border:     watch("expiryHours") === h ? "1px solid #22c55e" : "1px solid rgba(34,197,94,0.2)",
                            }}>
                            <Clock size={12} style={{ display: "inline", marginRight: 4 }} />{h}h
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Pickup address */}
                    <div>
                      <label className="type-label block mb-2" style={{ color: "#86a886" }}>Pickup Address</label>
                      <div style={{ position: "relative" }}>
                        <MapPin size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#4a664a" }} />
                        <input
                          {...register("pickupAddress")}
                          placeholder="Enter full address for pickup…"
                          style={{ width: "100%", padding: "12px 16px 12px 36px", borderRadius: 12, background: "#0d110d", border: "1px solid rgba(34,197,94,0.2)", color: "#f0faf0", fontSize: 14, outline: "none" }}
                        />
                      </div>
                      {!coords && (
                        <button type="button" onClick={handleUseMyLocation}
                          className="flex items-center gap-1 mt-2 text-xs"
                          style={{ color: "#22c55e", background: "none", border: "none", cursor: "pointer" }}>
                          <Navigation size={11} /> Use my current location
                        </button>
                      )}
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

                    <button type="submit" disabled={submitLoading}
                      style={{ padding: "16px 24px", borderRadius: 12, background: "#22c55e", color: "#050805", fontSize: 16, fontWeight: 600, cursor: submitLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: submitLoading ? 0.7 : 1 }}>
                      {submitLoading
                        ? <><Loader2 size={18} className="animate-spin" /> Dispatching NGO…</>
                        : <>Rescue This Food <ArrowRight size={18} /></>}
                    </button>
                  </form>
                </motion.div>

              ) : (

                /* ═══════════ TRACKING CARD ═══════════ */
                <motion.div key="tracking" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <div style={{ borderRadius: 20, padding: 32, background: "#0d110d", border: "1px solid rgba(34,197,94,0.25)", boxShadow: "0 0 40px rgba(34,197,94,0.1)" }}>

                    <div style={{ textAlign: "center", marginBottom: 24 }}>
                      <CheckCircle size={48} style={{ color: "#22c55e", margin: "0 auto 12px" }} />
                      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f0faf0", fontFamily: "var(--font-bricolage)" }}>NGO Dispatched!</h2>
                      <p style={{ color: "#22c55e", fontSize: 15, fontWeight: 600, marginTop: 4 }}>{tracking.ngoName}</p>
                      {tracking.ngoPhone && (
                        <p style={{ color: "#86a886", fontSize: 12, marginTop: 2 }}>📞 {tracking.ngoPhone}</p>
                      )}
                    </div>

                    {tracking.eta !== null && (
                      <div style={{ marginBottom: 20 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <span style={{ color: "#86a886", fontSize: 13 }}>Estimated Arrival</span>
                          <span style={{ color: "#22c55e", fontWeight: 600, fontSize: 14 }}>~{tracking.eta} min</span>
                        </div>
                        <div style={{ height: 4, borderRadius: 2, background: "#141a14", overflow: "hidden" }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(95, Math.max(10, 100 - (tracking.eta / 60) * 100))}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            style={{ height: "100%", background: "linear-gradient(90deg, #22c55e, #86efac)", borderRadius: 2 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Pipeline */}
                    <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
                      {PIPELINE.map((step, i) => (
                        <div key={step} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <div style={{
                            padding: "4px 6px", borderRadius: 6, fontSize: 10, fontWeight: 600, textAlign: "center", width: "100%",
                            background: i <= activeStep ? "#22c55e" : "#141a14",
                            color:      i <= activeStep ? "#050805" : "#4a664a",
                          }}>{step}</div>
                          {i < PIPELINE.length - 1 && (
                            <div style={{ width: "100%", height: 2, background: i < activeStep ? "rgba(34,197,94,0.5)" : "#141a14" }} />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-center gap-1 mb-4" style={{ color: "#4a664a", fontSize: 11 }}>
                      <RefreshCw size={10} className="animate-spin" style={{ animationDuration: "3s" }} />
                      Status updates automatically every 10 s
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                      <div style={{ padding: 14, borderRadius: 12, background: "#141a14", textAlign: "center" }}>
                        <p style={{ fontSize: 22, fontWeight: 700, color: "#22c55e", fontFamily: "var(--font-bricolage)" }}>{tracking.meals}</p>
                        <p style={{ fontSize: 11, color: "#86a886", marginTop: 2 }}>Meals will be served</p>
                      </div>
                      <div style={{ padding: 14, borderRadius: 12, background: "#141a14", textAlign: "center" }}>
                        <p style={{ fontSize: 22, fontWeight: 700, color: "#7c3aed", fontFamily: "var(--font-bricolage)" }}>{tracking.vgc.toFixed(3)}</p>
                        <p style={{ fontSize: 11, color: "#86a886", marginTop: 2 }}>VGC tokens earned</p>
                      </div>
                      <div style={{ padding: 14, borderRadius: 12, background: "#141a14", textAlign: "center", gridColumn: "span 2" }}>
                        <p style={{ fontSize: 18, fontWeight: 700, color: "#3b82f6", fontFamily: "var(--font-bricolage)" }}>
                          {typeof tracking.co2 === "number" ? tracking.co2.toFixed(2) : tracking.co2} kg CO₂
                        </p>
                        <p style={{ fontSize: 11, color: "#86a886", marginTop: 2 }}>Carbon emissions prevented</p>
                      </div>
                    </div>

                    <p style={{ fontSize: 11, color: "#4a664a", textAlign: "center" }}>
                      Rescue ID: {tracking.listingId.slice(0, 8).toUpperCase()}
                    </p>

                    <button
                      onClick={() => setTracking(null)}
                      className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium"
                      style={{ border: "1px solid rgba(34,197,94,0.2)", color: "#86a886", background: "transparent", cursor: "pointer" }}>
                      Post Another Listing
                    </button>
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
