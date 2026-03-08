"use client";

import useSWR from "swr";
import { getGlobalImpact } from "@/lib/api";

const fetcher = () => getGlobalImpact().then((r) => r.data);

// Fallback mock data for when API is unavailable
const MOCK_STATS = {
  mealsServed: 2847,
  co2Prevented: 1247.5,
  vgcMinted: 4.8,
  activeRescues: 3,
  totalDonors: 124,
  totalNGOs: 18,
};

export function useImpactStats() {
  const { data, error, isLoading } = useSWR("global-impact", fetcher, {
    refreshInterval: 10000,
    revalidateOnFocus: false,
    fallbackData: MOCK_STATS,
  });

  return {
    stats: data || MOCK_STATS,
    isLoading,
    isError: !!error,
  };
}
