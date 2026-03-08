"use client";

import useSWR from "swr";
import { getMarketplaceListings } from "@/lib/api";

export interface MarketplaceListing {
  id: string;
  sellerName: string;
  sellerType: "restaurant" | "treasury";
  vgcAmount: number;
  pricePerVGC: number;
  totalPrice: number;
  verified: boolean;
  txHash: string;
  rescueCount: number;
  co2Tonnes: number;
  listedAt: string;
}

const MOCK_LISTINGS: MarketplaceListing[] = [
  {
    id: "mkt-001",
    sellerName: "Hotel Pearl Palace",
    sellerType: "restaurant",
    vgcAmount: 25.4,
    pricePerVGC: 850,
    totalPrice: 21590,
    verified: true,
    txHash: "0x7f3a...c4d1",
    rescueCount: 47,
    co2Tonnes: 25.4,
    listedAt: "2026-03-07",
  },
  {
    id: "mkt-002",
    sellerName: "VASHUDHA Treasury",
    sellerType: "treasury",
    vgcAmount: 100,
    pricePerVGC: 800,
    totalPrice: 80000,
    verified: true,
    txHash: "0x9b2c...f1e8",
    rescueCount: 210,
    co2Tonnes: 100,
    listedAt: "2026-03-06",
  },
  {
    id: "mkt-003",
    sellerName: "Grand Caterers",
    sellerType: "restaurant",
    vgcAmount: 8.2,
    pricePerVGC: 820,
    totalPrice: 6724,
    verified: true,
    txHash: "0x3d4e...a7b9",
    rescueCount: 15,
    co2Tonnes: 8.2,
    listedAt: "2026-03-07",
  },
];

const fetcher = () => getMarketplaceListings().then((r) => r.data);

export function useMarketplace() {
  const { data, error, isLoading, mutate } = useSWR(
    "marketplace-listings",
    fetcher,
    {
      refreshInterval: 30000,
      fallbackData: MOCK_LISTINGS,
    }
  );

  return {
    listings: (data as MarketplaceListing[]) || MOCK_LISTINGS,
    isLoading,
    isError: !!error,
    mutate,
  };
}
