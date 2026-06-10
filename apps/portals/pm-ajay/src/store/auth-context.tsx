"use client";

/* PM-AJAY Auth Context
   Lightweight session store — simulates MoSJE SSO / employee-ID auth for the
   prototype/MIS phase. In production, swap signIn() for an API call to NIC auth. */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export interface Account {
  name: string;
  designation: string;
  employeeId: string;
  scope: "national" | "state" | "district";
  scopeLabel: string;
  avatar: string; // initials
}

interface AuthState {
  account: Account | null;
  signIn: (employeeId: string, password: string) => { ok: boolean; reason?: string };
  signOut: () => void;
}

const DEMO_ACCOUNTS: Record<string, { password: string; account: Account }> = {
  "JS001": {
    password: "Password@123",
    account: { name: "Sachin Malhotra", designation: "Joint Secretary · MoSJE", employeeId: "JS001", scope: "national", scopeLabel: "All India", avatar: "SM" },
  },
  "DS002": {
    password: "Password@123",
    account: { name: "Priya Sharma", designation: "Deputy Secretary · MoSJE", employeeId: "DS002", scope: "national", scopeLabel: "All India", avatar: "PS" },
  },
  "SO003": {
    password: "Password@123",
    account: { name: "Arjun Verma", designation: "Section Officer · MH", employeeId: "SO003", scope: "state", scopeLabel: "Maharashtra", avatar: "AV" },
  },
  "SO004": {
    password: "Password@123",
    account: { name: "Meena Rajan", designation: "Section Officer · TN", employeeId: "SO004", scope: "state", scopeLabel: "Tamil Nadu", avatar: "MR" },
  },
  "DO005": {
    password: "Password@123",
    account: { name: "Rajesh Patel", designation: "District Officer · Gujarat", employeeId: "DO005", scope: "district", scopeLabel: "Ahmedabad, Gujarat", avatar: "RP" },
  },
};

const SESSION_KEY = "pmajay.session.v1";

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Account;
        if (parsed?.employeeId && DEMO_ACCOUNTS[parsed.employeeId]) {
          setAccount(parsed);
        }
      }
    } catch {
      /* ignore malformed session */
    }
  }, []);

  const signIn = useCallback((employeeId: string, password: string) => {
    const record = DEMO_ACCOUNTS[employeeId.trim().toUpperCase()];
    if (!record) return { ok: false, reason: "Employee ID not found. Use one of the demo accounts below." };
    if (record.password !== password) return { ok: false, reason: "Incorrect password. Use Password@123 for all demo accounts." };
    setAccount(record.account);
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(record.account));
      // Set session cookie so middleware can gate protected routes
      document.cookie = `pmajay_session=1; path=/portals/pm-ajay; SameSite=Lax`;
    } catch { /* ignore */ }
    return { ok: true };
  }, []);

  const signOut = useCallback(() => {
    setAccount(null);
    try {
      localStorage.removeItem(SESSION_KEY);
      // Expire the session cookie
      document.cookie = `pmajay_session=; path=/portals/pm-ajay; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    } catch { /* ignore */ }
  }, []);

  return <AuthContext.Provider value={{ account, signIn, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
