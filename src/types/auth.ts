/* ═══════════════════════════════════════════════════
   VASHUDHA Auth Types
   User roles: donor (restaurants/PGs/hostels/caterers/individuals),
               ngo (NGO volunteers/organizations),
               corporate (ESG buyers / companies)
   ═══════════════════════════════════════════════════ */

export type UserRole = "donor" | "ngo" | "corporate";

export type DonorType =
  | "restaurant"
  | "caterer"
  | "hostel"
  | "pg"
  | "individual";

export interface UserBase {
  id: string;
  role: UserRole;
  email: string;
  phone: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  verified: boolean;
  createdAt: string;
  walletAddress?: string;        // MetaMask wallet address (saved from /wallet page)
  latitude?: number;             // GPS latitude captured at registration
  longitude?: number;            // GPS longitude captured at registration
}

/** Donor = restaurants, caterers, hostels, PGs, individuals */
export interface DonorUser extends UserBase {
  role: "donor";
  donorType: DonorType;
  businessName: string;        // e.g. "Hotel Pearl Palace"
  gstNumber?: string;          // optional for individuals
  fssaiLicense?: string;       // FSSAI license for food businesses
}

/** NGO = registered non-profit organizations */
export interface NGOUser extends UserBase {
  role: "ngo";
  ngoName: string;             // official NGO name
  darpanId?: string;           // NGO Darpan unique ID (from govt)
  registrationNumber?: string; // Society/Trust registration number
  panNumber?: string;          // PAN of the NGO
  operatingAreas: string[];    // list of areas served
}

/** Corporate = companies buying carbon credits for ESG */
export interface CorporateUser extends UserBase {
  role: "corporate";
  companyName: string;
  gstNumber: string;            // mandatory for corporates
  cin?: string;                 // Corporate Identification Number
  companyPan?: string;
  designation: string;          // e.g. "ESG Head"
  companyWebsite?: string;
}

export type VashudhaUser = DonorUser | NGOUser | CorporateUser;

/* ─── Registration form data types ─── */

export interface DonorRegisterData {
  role: "donor";
  donorType: DonorType;
  name: string;
  email: string;
  phone: string;
  password: string;
  businessName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstNumber?: string;
  fssaiLicense?: string;
  latitude?: number;
  longitude?: number;
}

export interface NGORegisterData {
  role: "ngo";
  ngoName: string;
  name: string;               // contact person name
  email: string;
  phone: string;
  password: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  darpanId?: string;
  registrationNumber?: string;
  panNumber?: string;
  operatingAreas: string;     // comma-separated
  latitude?: number;
  longitude?: number;
}

export interface CorporateRegisterData {
  role: "corporate";
  companyName: string;
  name: string;                // contact person name
  designation: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstNumber: string;
  cin?: string;
  companyPan?: string;
  companyWebsite?: string;
  latitude?: number;
  longitude?: number;
}

export type RegisterData =
  | DonorRegisterData
  | NGORegisterData
  | CorporateRegisterData;

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthState {
  user: VashudhaUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
