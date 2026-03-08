"use client";

import { useState, useEffect } from "react";
import { trackListing } from "@/lib/api";

export interface RescueStatus {
  id: string;
  status: "pending" | "dispatched" | "collected" | "delivered";
  ngoName: string;
  eta: number; // minutes
  donorName: string;
  foodDescription: string;
  quantityKg: number;
  meals: number;
  vgcAmount: number;
  txHash?: string;
}

const MOCK_STATUS: RescueStatus = {
  id: "HM-20260307",
  status: "dispatched",
  ngoName: "Aashray Foundation",
  eta: 18,
  donorName: "Hotel Pearl Palace",
  foodDescription: "Dal Rice",
  quantityKg: 40,
  meals: 160,
  vgcAmount: 0.1,
};

export function useRescueTracking(listingId: string | null) {
  const [status, setStatus] = useState<RescueStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!listingId) return;

    setIsLoading(true);
    // Initial fetch
    trackListing(listingId)
      .then((r) => setStatus(r.data))
      .catch(() => setStatus(MOCK_STATUS))
      .finally(() => setIsLoading(false));

    // Poll every 5 seconds
    const interval = setInterval(() => {
      trackListing(listingId)
        .then((r) => setStatus(r.data))
        .catch(() => {});
    }, 5000);

    return () => clearInterval(interval);
  }, [listingId]);

  return { status, isLoading };
}
