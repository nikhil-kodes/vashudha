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
  DonorUser,
  NGOUser,
  CorporateUser,
} from "@/types/auth";

/* ═══════════════════════════════════════════════
   Auth Context — manages registration, login,
   logout, and persists to localStorage.
   ═══════════════════════════════════════════════ */

interface AuthContextType extends AuthState {
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<VashudhaUser>) => void;
  saveWalletAddress: (address: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "vashudha_auth";
const TOKEN_KEY = "vashudha_token";

/* ─── Mock user generator from registration data ─── */
function createMockUser(data: RegisterData): VashudhaUser {
  const base = {
    id: `USR-${Date.now().toString(36).toUpperCase()}`,
    email: data.email,
    phone: data.phone,
    name: data.name,
    address: data.address,
    city: data.city,
    state: data.state,
    pincode: data.pincode,
    verified: false, // not verified until admin approves
    createdAt: new Date().toISOString(),
  };

  if (data.role === "donor") {
    return {
      ...base,
      role: "donor",
      donorType: data.donorType,
      businessName: data.businessName,
      gstNumber: data.gstNumber,
      fssaiLicense: data.fssaiLicense,
    } as DonorUser;
  }

  if (data.role === "ngo") {
    return {
      ...base,
      role: "ngo",
      ngoName: data.ngoName,
      darpanId: data.darpanId,
      registrationNumber: data.registrationNumber,
      panNumber: data.panNumber,
      operatingAreas: data.operatingAreas
        ? data.operatingAreas.split(",").map((s) => s.trim())
        : [],
    } as NGOUser;
  }

  // corporate
  return {
    ...base,
    role: "corporate",
    companyName: data.companyName,
    gstNumber: data.gstNumber,
    cin: data.cin,
    companyPan: data.companyPan,
    designation: data.designation,
    companyWebsite: data.companyWebsite,
  } as CorporateUser;
}

/* ─── Mock registered users for demo login ─── */
const MOCK_USERS: { email: string; password: string; user: VashudhaUser }[] = [
  {
    email: "pearl@hotel.com",
    password: "demo123",
    user: {
      id: "USR-D001",
      role: "donor",
      donorType: "restaurant",
      email: "pearl@hotel.com",
      phone: "+91-9876543210",
      name: "Priya Sharma",
      businessName: "Hotel Pearl Palace",
      address: "MI Road, Jaipur",
      city: "Jaipur",
      state: "Rajasthan",
      pincode: "302001",
      gstNumber: "08AABCU9603R1ZM",
      fssaiLicense: "12726001000123",
      verified: true,
      createdAt: "2026-01-15T10:30:00Z",
    },
  },
  {
    email: "aashray@ngo.org",
    password: "demo123",
    user: {
      id: "USR-N001",
      role: "ngo",
      ngoName: "Aashray Foundation",
      email: "aashray@ngo.org",
      phone: "+91-9876543211",
      name: "Rajesh Kumar",
      address: "Civil Lines, Jaipur",
      city: "Jaipur",
      state: "Rajasthan",
      pincode: "302006",
      darpanId: "RJ/2025/123456",
      registrationNumber: "SOC/RJ/2020/456",
      panNumber: "AAATA1234F",
      operatingAreas: ["Jaipur", "Jodhpur", "Udaipur"],
      verified: true,
      createdAt: "2026-01-10T08:00:00Z",
    },
  },
  {
    email: "esg@tata.com",
    password: "demo123",
    user: {
      id: "USR-C001",
      role: "corporate",
      companyName: "Tata Consultancy",
      email: "esg@tata.com",
      phone: "+91-9876543212",
      name: "Ananya Desai",
      designation: "ESG Head",
      address: "MG Road, Mumbai",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      gstNumber: "27AABCT1234F1ZP",
      cin: "L22210MH1995PLC084781",
      companyPan: "AABCT1234F",
      companyWebsite: "https://tcs.com",
      verified: true,
      createdAt: "2026-02-01T14:00:00Z",
    },
  },
];

/* ═══════════════ Provider ═══════════════ */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<VashudhaUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (stored && storedToken) {
        setUser(JSON.parse(stored));
        setToken(storedToken);
      }
    } catch {
      // ignore parse errors
    }
    setIsLoading(false);
  }, []);

  // Persist on change
  useEffect(() => {
    if (user && token) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem(TOKEN_KEY, token);
    }
  }, [user, token]);

  const login = useCallback(async (data: LoginData) => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise((r) => setTimeout(r, 1200));

    // Check mock users first
    const found = MOCK_USERS.find(
      (u) => u.email === data.email && u.password === data.password
    );

    if (found) {
      const mockToken = `vst_${Date.now().toString(36)}`;
      setUser(found.user);
      setToken(mockToken);
      setIsLoading(false);
      return;
    }

    // Check if user was registered in localStorage (from register flow)
    const registeredUsers = JSON.parse(
      localStorage.getItem("vashudha_registered_users") || "[]"
    );
    const registered = registeredUsers.find(
      (u: { email: string; password: string }) =>
        u.email === data.email && u.password === data.password
    );

    if (registered) {
      const mockToken = `vst_${Date.now().toString(36)}`;
      setUser(registered.user);
      setToken(mockToken);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    throw new Error("Invalid email or password");
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise((r) => setTimeout(r, 1500));

    const newUser = createMockUser(data);
    const mockToken = `vst_${Date.now().toString(36)}`;

    // Store in registered users list (localStorage mock of backend)
    const registeredUsers = JSON.parse(
      localStorage.getItem("vashudha_registered_users") || "[]"
    );
    registeredUsers.push({
      email: data.email,
      password: data.password,
      user: newUser,
    });
    localStorage.setItem(
      "vashudha_registered_users",
      JSON.stringify(registeredUsers)
    );

    setUser(newUser);
    setToken(mockToken);
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  const updateProfile = useCallback(
    (data: Partial<VashudhaUser>) => {
      if (user) {
        const updated = { ...user, ...data } as VashudhaUser;
        setUser(updated);
      }
    },
    [user]
  );

  const saveWalletAddress = useCallback(
    (walletAddr: string) => {
      if (!user) return;
      const updated = { ...user, walletAddress: walletAddr } as VashudhaUser;
      setUser(updated);

      // Also update in registered users localStorage
      try {
        const registeredUsers = JSON.parse(
          localStorage.getItem("vashudha_registered_users") || "[]"
        );
        const idx = registeredUsers.findIndex(
          (u: { email: string }) => u.email === user.email
        );
        if (idx >= 0) {
          registeredUsers[idx].user.walletAddress = walletAddr;
          localStorage.setItem(
            "vashudha_registered_users",
            JSON.stringify(registeredUsers)
          );
        }
      } catch {
        // ignore
      }
    },
    [user]
  );

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
