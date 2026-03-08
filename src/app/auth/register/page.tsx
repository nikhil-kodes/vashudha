"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Leaf,
  ArrowRight,
  ArrowLeft,
  Building2,
  Users,
  UtensilsCrossed,
  Hotel,
  Home,
  User,
  Truck,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Lock,
  FileText,
  Globe,
  Briefcase,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useGeoLocation } from "@/hooks/useGeoLocation";
import type { UserRole, DonorType } from "@/types/auth";

/* ─── Role & donor type options ─── */

const ROLES = [
  {
    role: "donor" as UserRole,
    title: "Food Donor",
    description: "Restaurants, caterers, hostels, PGs, or individuals",
    icon: UtensilsCrossed,
    accent: "#22c55e",
  },
  {
    role: "ngo" as UserRole,
    title: "NGO / Volunteer",
    description: "Register your NGO to receive and distribute food",
    icon: Users,
    accent: "#3b82f6",
  },
  {
    role: "corporate" as UserRole,
    title: "Corporate / ESG",
    description: "Buy verified carbon credits for your sustainability reports",
    icon: Building2,
    accent: "#7c3aed",
  },
];

const DONOR_TYPES = [
  { type: "restaurant" as DonorType, label: "Restaurant", icon: UtensilsCrossed },
  { type: "caterer" as DonorType, label: "Caterer", icon: Truck },
  { type: "hostel" as DonorType, label: "Hostel", icon: Hotel },
  { type: "pg" as DonorType, label: "PG", icon: Home },
  { type: "individual" as DonorType, label: "Individual", icon: User },
];

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Chandigarh", "Puducherry",
];

/* ─── Shared input component ─── */

function FormInput({
  label,
  icon: Icon,
  error,
  required,
  ...props
}: {
  label: string;
  icon?: any;
  error?: string;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label
        className="text-[11px] uppercase tracking-wider font-medium block mb-1.5"
        style={{ color: "#86a886" }}
      >
        {label}
        {required && <span style={{ color: "#ef4444" }}> *</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "#4a664a" }}
          />
        )}
        <input
          className="w-full rounded-xl text-sm outline-none transition-all focus:ring-1"
          style={{
            padding: Icon ? "11px 14px 11px 36px" : "11px 14px",
            background: "#0d110d",
            border: error
              ? "1px solid rgba(239,68,68,0.4)"
              : "1px solid rgba(34,197,94,0.12)",
            color: "#f0faf0",
            fontFamily: "var(--font-dm-sans)",
          }}
          {...props}
        />
      </div>
      {error && (
        <p className="text-[11px] mt-1" style={{ color: "#ef4444" }}>
          {error}
        </p>
      )}
    </div>
  );
}

function FormSelect({
  label,
  options,
  required,
  error,
  ...props
}: {
  label: string;
  options: { value: string; label: string }[];
  required?: boolean;
  error?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      <label
        className="text-[11px] uppercase tracking-wider font-medium block mb-1.5"
        style={{ color: "#86a886" }}
      >
        {label}
        {required && <span style={{ color: "#ef4444" }}> *</span>}
      </label>
      <select
        className="w-full rounded-xl text-sm outline-none"
        style={{
          padding: "11px 14px",
          background: "#0d110d",
          border: "1px solid rgba(34,197,94,0.12)",
          color: "#f0faf0",
          fontFamily: "var(--font-dm-sans)",
        }}
        {...props}
      >
        <option value="">Select...</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-[11px] mt-1" style={{ color: "#ef4444" }}>
          {error}
        </p>
      )}
    </div>
  );
}

/* ═══════════════ Register Page ═══════════════ */

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isLoading } = useAuth();
  const { coords: geoCoords, loading: geoLoading, error: geoError, getLocation } = useGeoLocation();

  // Wizard steps: 0 = role select, 1 = details form
  const [step, setStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [donorType, setDonorType] = useState<DonorType>("restaurant");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Form data (shared across roles)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    // donor
    businessName: "",
    gstNumber: "",
    fssaiLicense: "",
    // ngo
    ngoName: "",
    darpanId: "",
    registrationNumber: "",
    panNumber: "",
    operatingAreas: "",
    // corporate
    companyName: "",
    cin: "",
    companyPan: "",
    designation: "",
    companyWebsite: "",
  });

  const updateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // clear field error when user types
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email.trim() || !formData.email.includes("@"))
      errs.email = "Valid email is required";
    if (!formData.phone.trim() || formData.phone.length < 10)
      errs.phone = "Valid phone number is required";
    if (formData.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    if (!formData.address.trim()) errs.address = "Address is required";
    if (!formData.city.trim()) errs.city = "City is required";
    if (!formData.state) errs.state = "State is required";
    if (!formData.pincode.trim() || formData.pincode.length !== 6)
      errs.pincode = "Valid 6-digit pincode required";

    if (selectedRole === "donor") {
      if (donorType !== "individual" && !formData.businessName.trim())
        errs.businessName = "Business name is required";
    }

    if (selectedRole === "ngo") {
      if (!formData.ngoName.trim()) errs.ngoName = "NGO name is required";
    }

    if (selectedRole === "corporate") {
      if (!formData.companyName.trim())
        errs.companyName = "Company name is required";
      if (!formData.gstNumber.trim())
        errs.gstNumber = "GST number is required for corporates";
      if (!formData.designation.trim())
        errs.designation = "Designation is required";
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !selectedRole) return;

    setError("");
    try {
      if (selectedRole === "donor") {
        await registerUser({
          role: "donor",
          donorType,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          businessName:
            donorType === "individual" ? formData.name : formData.businessName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          gstNumber: formData.gstNumber || undefined,
          fssaiLicense: formData.fssaiLicense || undefined,
          latitude:  geoCoords?.lat,
          longitude: geoCoords?.lng,
        });
      } else if (selectedRole === "ngo") {
        await registerUser({
          role: "ngo",
          ngoName: formData.ngoName,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          darpanId: formData.darpanId || undefined,
          registrationNumber: formData.registrationNumber || undefined,
          panNumber: formData.panNumber || undefined,
          operatingAreas: formData.operatingAreas,
          latitude:  geoCoords?.lat,
          longitude: geoCoords?.lng,
        });
      } else {
        await registerUser({
          role: "corporate",
          companyName: formData.companyName,
          name: formData.name,
          designation: formData.designation,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          gstNumber: formData.gstNumber,
          cin: formData.cin || undefined,
          companyPan: formData.companyPan || undefined,
          companyWebsite: formData.companyWebsite || undefined,
          latitude:  geoCoords?.lat,
          longitude: geoCoords?.lng,
        });
      }

      // Redirect based on role
      if (selectedRole === "donor") router.push("/donate");
      else if (selectedRole === "ngo") router.push("/ngo");
      else router.push("/marketplace");
    } catch (e: any) {
      setError(e.message || "Registration failed. Please try again.");
    }
  };

  const roleAccent =
    selectedRole === "donor"
      ? "#22c55e"
      : selectedRole === "ngo"
      ? "#3b82f6"
      : "#7c3aed";

  return (
    <div
      style={{ background: "#050805", minHeight: "100vh", color: "#f0faf0" }}
    >
      {/* Background effects */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(34,197,94,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-lg mx-auto px-5 py-12">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2.5 mb-10"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(34,197,94,0.12)",
              border: "1px solid rgba(34,197,94,0.2)",
            }}
          >
            <Leaf size={20} style={{ color: "#22c55e" }} />
          </div>
          <span
            className="text-xl font-bold"
            style={{
              fontFamily: "var(--font-bricolage)",
              letterSpacing: "-0.03em",
            }}
          >
            VASHUDHA
          </span>
        </Link>

        <AnimatePresence mode="wait">
          {/* ═══ Step 0: Choose Role ═══ */}
          {step === 0 && (
            <motion.div
              key="role-select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-10">
                <h1
                  className="text-2xl font-bold mb-2"
                  style={{ fontFamily: "var(--font-bricolage)" }}
                >
                  Join VASHUDHA
                </h1>
                <p className="text-sm" style={{ color: "#86a886" }}>
                  Choose how you want to contribute to the food rescue network
                </p>
              </div>

              <div className="space-y-3">
                {ROLES.map((r) => {
                  const Icon = r.icon;
                  const isSelected = selectedRole === r.role;

                  return (
                    <motion.button
                      key={r.role}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        setSelectedRole(r.role);
                        // Pre-emptively request device location as soon as role is picked
                        getLocation();
                      }}
                      className="w-full flex items-center gap-4 p-5 rounded-2xl text-left transition-all"
                      style={{
                        background: isSelected
                          ? `${r.accent}08`
                          : "#0d110d",
                        border: isSelected
                          ? `2px solid ${r.accent}40`
                          : "2px solid rgba(34,197,94,0.08)",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `${r.accent}15`,
                          border: `1px solid ${r.accent}25`,
                        }}
                      >
                        <Icon size={22} style={{ color: r.accent }} />
                      </div>
                      <div className="flex-1">
                        <h3
                          className="text-base font-semibold mb-0.5"
                          style={{
                            fontFamily: "var(--font-bricolage)",
                            color: isSelected ? r.accent : "#f0faf0",
                          }}
                        >
                          {r.title}
                        </h3>
                        <p className="text-xs" style={{ color: "#86a886" }}>
                          {r.description}
                        </p>
                      </div>
                      {/* Radio indicator */}
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          border: isSelected
                            ? `2px solid ${r.accent}`
                            : "2px solid rgba(34,197,94,0.2)",
                        }}
                      >
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ background: r.accent }}
                          />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Donor type sub-selection */}
              {selectedRole === "donor" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4"
                >
                  <p
                    className="text-[11px] uppercase tracking-wider font-medium mb-3"
                    style={{ color: "#86a886" }}
                  >
                    What type of donor?
                  </p>
                  <div className="grid grid-cols-5 gap-2">
                    {DONOR_TYPES.map((dt) => {
                      const DIcon = dt.icon;
                      const isActive = donorType === dt.type;
                      return (
                        <button
                          key={dt.type}
                          onClick={() => setDonorType(dt.type)}
                          className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl text-center transition-all"
                          style={{
                            background: isActive
                              ? "rgba(34,197,94,0.1)"
                              : "#0d110d",
                            border: isActive
                              ? "1px solid rgba(34,197,94,0.3)"
                              : "1px solid rgba(34,197,94,0.08)",
                            cursor: "pointer",
                          }}
                        >
                          <DIcon
                            size={16}
                            style={{
                              color: isActive ? "#22c55e" : "#4a664a",
                            }}
                          />
                          <span
                            className="text-[10px] font-medium"
                            style={{
                              color: isActive ? "#22c55e" : "#86a886",
                            }}
                          >
                            {dt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              <button
                onClick={() => selectedRole && setStep(1)}
                disabled={!selectedRole}
                className="w-full mt-8 py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                style={{
                  background: selectedRole
                    ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
                    : "#141a14",
                  color: selectedRole ? "#050805" : "#4a664a",
                  cursor: selectedRole ? "pointer" : "not-allowed",
                  border: "none",
                }}
              >
                Continue <ArrowRight size={16} />
              </button>

              <p className="text-center text-sm mt-6" style={{ color: "#4a664a" }}>
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium"
                  style={{ color: "#22c55e" }}
                >
                  Sign in
                </Link>
              </p>
            </motion.div>
          )}

          {/* ═══ Step 1: Registration Form ═══ */}
          {step === 1 && selectedRole && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Back button */}
              <button
                onClick={() => setStep(0)}
                className="flex items-center gap-1.5 text-xs font-medium mb-6"
                style={{
                  color: "#86a886",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <ArrowLeft size={14} /> Change role
              </button>

              <div className="mb-8">
                <h1
                  className="text-2xl font-bold mb-2"
                  style={{ fontFamily: "var(--font-bricolage)" }}
                >
                  {selectedRole === "donor"
                    ? `Register as ${donorType === "individual" ? "Individual" : "Food Donor"}`
                    : selectedRole === "ngo"
                    ? "Register Your NGO"
                    : "Register Your Company"}
                </h1>
                <p className="text-sm" style={{ color: "#86a886" }}>
                  Fill in the details below. Fields marked * are required.
                </p>
              </div>

              {error && (
                <div
                  className="rounded-xl px-4 py-3 mb-6 text-sm"
                  style={{
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    color: "#ef4444",
                  }}
                >
                  {error}
                </div>
              )}

              {/* ─── Location status banner ─── */}
              <div
                className="rounded-xl px-4 py-3 mb-4 text-xs flex items-center gap-2"
                style={{
                  background: geoCoords
                    ? "rgba(34,197,94,0.06)"
                    : geoError
                    ? "rgba(239,68,68,0.06)"
                    : "rgba(34,197,94,0.04)",
                  border: `1px solid ${geoCoords ? "rgba(34,197,94,0.2)" : geoError ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.1)"}`,
                  color: geoCoords ? "#22c55e" : geoError ? "#ef4444" : "#86a886",
                }}
              >
                <MapPin size={13} />
                {geoLoading
                  ? "Detecting your location…"
                  : geoCoords
                  ? `Location captured (${geoCoords.lat.toFixed(4)}, ${geoCoords.lng.toFixed(4)})`
                  : geoError
                  ? `${geoError} — location will not be saved.`
                  : (
                    <span>
                      Location not captured.{" "}
                      <button
                        type="button"
                        onClick={getLocation}
                        style={{ textDecoration: "underline", background: "none", border: "none", cursor: "pointer", color: "inherit", fontSize: "inherit" }}
                      >
                        Allow access
                      </button>
                    </span>
                  )}
              </div>

              <div className="space-y-4">
                {/* ─── Role-specific fields first ─── */}

                {selectedRole === "donor" && donorType !== "individual" && (
                  <FormInput
                    label="Business Name"
                    icon={Building2}
                    required
                    placeholder="e.g. Hotel Pearl Palace"
                    value={formData.businessName}
                    onChange={(e) => updateField("businessName", e.target.value)}
                    error={fieldErrors.businessName}
                  />
                )}

                {selectedRole === "ngo" && (
                  <FormInput
                    label="NGO Name"
                    icon={Users}
                    required
                    placeholder="e.g. Aashray Foundation"
                    value={formData.ngoName}
                    onChange={(e) => updateField("ngoName", e.target.value)}
                    error={fieldErrors.ngoName}
                  />
                )}

                {selectedRole === "corporate" && (
                  <>
                    <FormInput
                      label="Company Name"
                      icon={Building2}
                      required
                      placeholder="e.g. Tata Consultancy"
                      value={formData.companyName}
                      onChange={(e) =>
                        updateField("companyName", e.target.value)
                      }
                      error={fieldErrors.companyName}
                    />
                    <FormInput
                      label="Your Designation"
                      icon={Briefcase}
                      required
                      placeholder="e.g. ESG Head"
                      value={formData.designation}
                      onChange={(e) =>
                        updateField("designation", e.target.value)
                      }
                      error={fieldErrors.designation}
                    />
                  </>
                )}

                {/* ─── Common fields ─── */}
                <div
                  className="pt-3 pb-1"
                  style={{ borderTop: "1px solid rgba(34,197,94,0.06)" }}
                >
                  <p
                    className="text-[10px] uppercase tracking-wider font-medium mb-3"
                    style={{ color: "#4a664a" }}
                  >
                    Personal Details
                  </p>
                </div>

                <FormInput
                  label={selectedRole === "donor" && donorType === "individual" ? "Full Name" : "Contact Person Name"}
                  icon={User}
                  required
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  error={fieldErrors.name}
                />

                <div className="grid grid-cols-2 gap-3">
                  <FormInput
                    label="Email"
                    icon={Mail}
                    required
                    type="email"
                    placeholder="you@email.com"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    error={fieldErrors.email}
                  />
                  <FormInput
                    label="Phone"
                    icon={Phone}
                    required
                    type="tel"
                    placeholder="+91-XXXXX-XXXXX"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    error={fieldErrors.phone}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <FormInput
                    label="Password"
                    icon={Lock}
                    required
                    type="password"
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    error={fieldErrors.password}
                  />
                  <FormInput
                    label="Confirm Password"
                    icon={Lock}
                    required
                    type="password"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      updateField("confirmPassword", e.target.value)
                    }
                    error={fieldErrors.confirmPassword}
                  />
                </div>

                {/* ─── Address ─── */}
                <div
                  className="pt-3 pb-1"
                  style={{ borderTop: "1px solid rgba(34,197,94,0.06)" }}
                >
                  <p
                    className="text-[10px] uppercase tracking-wider font-medium mb-3"
                    style={{ color: "#4a664a" }}
                  >
                    Address
                  </p>
                </div>

                <FormInput
                  label="Full Address"
                  icon={MapPin}
                  required
                  placeholder="Street address, area"
                  value={formData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  error={fieldErrors.address}
                />

                <div className="grid grid-cols-3 gap-3">
                  <FormInput
                    label="City"
                    required
                    placeholder="Jaipur"
                    value={formData.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    error={fieldErrors.city}
                  />
                  <FormSelect
                    label="State"
                    required
                    value={formData.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    options={INDIAN_STATES.map((s) => ({ value: s, label: s }))}
                    error={fieldErrors.state}
                  />
                  <FormInput
                    label="Pincode"
                    required
                    placeholder="302001"
                    value={formData.pincode}
                    onChange={(e) => updateField("pincode", e.target.value)}
                    error={fieldErrors.pincode}
                  />
                </div>

                {/* ─── Verification documents ─── */}
                <div
                  className="pt-3 pb-1"
                  style={{ borderTop: "1px solid rgba(34,197,94,0.06)" }}
                >
                  <p
                    className="text-[10px] uppercase tracking-wider font-medium mb-1"
                    style={{ color: "#4a664a" }}
                  >
                    Verification Documents
                  </p>
                  <p className="text-[10px] mb-3" style={{ color: "#4a664a" }}>
                    {selectedRole === "corporate"
                      ? "GST is mandatory for corporate accounts"
                      : "Optional but helps with faster verification"}
                  </p>
                </div>

                {/* GST — shown for all */}
                <FormInput
                  label="GST Number"
                  icon={FileText}
                  required={selectedRole === "corporate"}
                  placeholder="e.g. 08AABCU9603R1ZM"
                  value={formData.gstNumber}
                  onChange={(e) => updateField("gstNumber", e.target.value)}
                  error={fieldErrors.gstNumber}
                />

                {/* Donor-specific */}
                {selectedRole === "donor" && (
                  <FormInput
                    label="FSSAI License (if available)"
                    icon={ShieldCheck}
                    placeholder="14-digit FSSAI number"
                    value={formData.fssaiLicense}
                    onChange={(e) =>
                      updateField("fssaiLicense", e.target.value)
                    }
                  />
                )}

                {/* NGO-specific */}
                {selectedRole === "ngo" && (
                  <>
                    <FormInput
                      label="NGO Darpan ID"
                      icon={ShieldCheck}
                      placeholder="e.g. RJ/2025/123456"
                      value={formData.darpanId}
                      onChange={(e) => updateField("darpanId", e.target.value)}
                    />
                    <FormInput
                      label="Registration Number (Society/Trust)"
                      icon={FileText}
                      placeholder="e.g. SOC/RJ/2020/456"
                      value={formData.registrationNumber}
                      onChange={(e) =>
                        updateField("registrationNumber", e.target.value)
                      }
                    />
                    <FormInput
                      label="PAN Number"
                      icon={FileText}
                      placeholder="e.g. AAATA1234F"
                      value={formData.panNumber}
                      onChange={(e) => updateField("panNumber", e.target.value)}
                    />
                    <FormInput
                      label="Operating Areas (comma separated)"
                      icon={MapPin}
                      placeholder="Jaipur, Jodhpur, Udaipur"
                      value={formData.operatingAreas}
                      onChange={(e) =>
                        updateField("operatingAreas", e.target.value)
                      }
                    />
                  </>
                )}

                {/* Corporate-specific */}
                {selectedRole === "corporate" && (
                  <>
                    <FormInput
                      label="CIN (Corporate Identification Number)"
                      icon={FileText}
                      placeholder="L22210MH1995PLC084781"
                      value={formData.cin}
                      onChange={(e) => updateField("cin", e.target.value)}
                    />
                    <FormInput
                      label="Company PAN"
                      icon={FileText}
                      placeholder="AABCT1234F"
                      value={formData.companyPan}
                      onChange={(e) =>
                        updateField("companyPan", e.target.value)
                      }
                    />
                    <FormInput
                      label="Company Website"
                      icon={Globe}
                      placeholder="https://your-company.com"
                      value={formData.companyWebsite}
                      onChange={(e) =>
                        updateField("companyWebsite", e.target.value)
                      }
                    />
                  </>
                )}

                {/* Verification notice */}
                <div
                  className="rounded-xl px-4 py-3 flex items-start gap-3"
                  style={{
                    background: `${roleAccent}06`,
                    border: `1px solid ${roleAccent}15`,
                  }}
                >
                  <ShieldCheck
                    size={16}
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: roleAccent }}
                  />
                  <p className="text-xs leading-relaxed" style={{ color: "#86a886" }}>
                    Your account will be created immediately, but full
                    verification may take 24-48 hours. You can start using the
                    platform right after registration.
                  </p>
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: isLoading
                      ? "#141a14"
                      : `linear-gradient(135deg, ${roleAccent} 0%, ${roleAccent}cc 100%)`,
                    color: isLoading ? "#4a664a" : "#050805",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    border: "none",
                    boxShadow: isLoading
                      ? "none"
                      : `0 0 20px ${roleAccent}30`,
                  }}
                >
                  {isLoading ? (
                    "Creating account..."
                  ) : (
                    <>
                      Create Account <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <p
                  className="text-center text-sm mt-2"
                  style={{ color: "#4a664a" }}
                >
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="font-medium"
                    style={{ color: "#22c55e" }}
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
