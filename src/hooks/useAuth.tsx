"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import type {
  VashudhaUser,
  AuthState,
  RegisterData,
  LoginData,
} from "@/types/auth";
import {
  registerUser,
  loginUser,
  updateProfile as apiUpdateProfile,
} from "@/lib/api";

/* ═══════════════════════════════════════════════
   Auth Context — registration, login, logout.
   Persists JWT token + user to localStorage.
   Backed by real /api/auth/* endpoints.
   ═══════════════════════════════════════════════ */

interface AuthContextType extends AuthState {
  login: (data: LoginData) => Promise<VashudhaUser>;
  register: (data: RegisterData) => Promise<VashudhaUser>;
  logout: () => void;
  updateProfile: (data: Partial<VashudhaUser>) => Promise<void>;
  saveWalletAddress: (address: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "vashudha_auth";
const TOKEN_KEY   = "vashudha_token";

/* ═══════════════ Provider ═══════════════ */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,      setUser]      = useState<VashudhaUser | null>(null);
  const [token,     setToken]     = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Hydrate from localStorage on mount ──────────────────────────────────
  useEffect(() => {
    try {
      const storedUser  = localStorage.getItem(STORAGE_KEY);
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch {
      // ignore parse errors
    }
    setIsLoading(false);
  }, []);

  // ── Persist changes ──────────────────────────────────────────────────────
  useEffect(() => {
    if (user && token) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem(TOKEN_KEY, token);
    }
  }, [user, token]);

  // ── Map snake_case DB row → camelCase VashudhaUser ─────────────────────
  const _normalizeUser = (raw: Record<string, unknown>): VashudhaUser => {
    const base = {
      id:            raw.id            as string,
      role:          raw.role          as "donor" | "ngo" | "corporate",
      email:         raw.email         as string,
      phone:         raw.phone         as string,
      name:          raw.name          as string,
      address:       raw.address       as string,
      city:          raw.city          as string,
      state:         raw.state         as string,
      pincode:       raw.pincode       as string,
      verified:      (raw.verified     as boolean) ?? false,
      createdAt:     raw.created_at    as string,
      walletAddress: (raw.wallet_address as string | undefined) ?? undefined,
      latitude:      (raw.latitude  as number | undefined) ?? undefined,
      longitude:     (raw.longitude as number | undefined) ?? undefined,
    };
    if (raw.role === "donor") {
      return {
        ...base,
        role:         "donor",
        donorType:    raw.donor_type    as "restaurant" | "caterer" | "hostel" | "pg" | "individual",
        businessName: (raw.business_name as string) ?? (raw.name as string),
        gstNumber:    (raw.gst_number    as string | undefined) ?? undefined,
        fssaiLicense: (raw.fssai_license as string | undefined) ?? undefined,
      };
    }
    if (raw.role === "ngo") {
      const areas = raw.operating_areas;
      return {
        ...base,
        role:               "ngo",
        ngoName:            (raw.ngo_name            as string) ?? (raw.name as string),
        darpanId:           (raw.darpan_id           as string | undefined) ?? undefined,
        registrationNumber: (raw.registration_number as string | undefined) ?? undefined,
        panNumber:          (raw.pan_number          as string | undefined) ?? undefined,
        operatingAreas:     Array.isArray(areas)
                              ? (areas as string[])
                              : typeof areas === "string"
                              ? (areas as string).split(",").map((s) => s.trim()).filter(Boolean)
                              : [],
      };
    }
    // corporate
    return {
      ...base,
      role:           "corporate",
      companyName:    (raw.company_name    as string) ?? (raw.name as string),
      gstNumber:      (raw.gst_number      as string) ?? "",
      cin:            (raw.cin             as string | undefined) ?? undefined,
      companyPan:     (raw.company_pan     as string | undefined) ?? undefined,
      designation:    (raw.designation     as string) ?? "",
      companyWebsite: (raw.company_website as string | undefined) ?? undefined,
    };
  };

  // ── login ────────────────────────────────────────────────────────────────
  const login = useCallback(async (data: LoginData): Promise<VashudhaUser> => {
    setIsLoading(true);
    try {
      const res = await loginUser(data);
      const { token: jwt, user: raw } = res.data as { token: string; user: Record<string, unknown> };
      const normalized = _normalizeUser(raw);
      setToken(jwt);
      setUser(normalized);
      return normalized;
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } }; message?: string };
      throw new Error(axiosErr?.response?.data?.error ?? axiosErr?.message ?? "Login failed");
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── register ─────────────────────────────────────────────────────────────
  const register = useCallback(async (data: RegisterData): Promise<VashudhaUser> => {
    setIsLoading(true);
    try {
      const res = await registerUser(data as unknown as Record<string, unknown>);
      const { token: jwt, user: raw } = res.data as { token: string; user: Record<string, unknown> };
      const normalized = _normalizeUser(raw);
      setToken(jwt);
      setUser(normalized);
      return normalized;
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } }; message?: string };
      throw new Error(axiosErr?.response?.data?.error ?? axiosErr?.message ?? "Registration failed");
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── logout ───────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  // ── updateProfile ─────────────────────────────────────────────────────────
  const updateProfile = useCallback(async (data: Partial<VashudhaUser>) => {
    try {
      const res = await apiUpdateProfile(data as unknown as Record<string, unknown>);
      const { user: raw } = res.data as { user: Record<string, unknown> };
      setUser(_normalizeUser(raw));
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } }; message?: string };
      throw new Error(axiosErr?.response?.data?.error ?? axiosErr?.message ?? "Profile update failed");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── saveWalletAddress ─────────────────────────────────────────────────────
  const saveWalletAddress = useCallback(async (walletAddr: string) => {
    try {
      await apiUpdateProfile({ walletAddress: walletAddr });
      setUser((prev) =>
        prev ? ({ ...prev, walletAddress: walletAddr } as VashudhaUser) : prev
      );
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } }; message?: string };
      throw new Error(axiosErr?.response?.data?.error ?? axiosErr?.message ?? "Failed to save wallet");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        saveWalletAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ═══════════════ Hook ═══════════════ */

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
