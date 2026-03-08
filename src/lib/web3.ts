"use client";

import { ethers } from "ethers";

export const POLYGON_CHAIN_ID = "0x89"; // Polygon Mainnet
export const AMOY_CHAIN_ID = "0x13882"; // Polygon Amoy Testnet

export const TARGET_CHAIN_ID =
  process.env.NEXT_PUBLIC_CHAIN_ID === "137"
    ? POLYGON_CHAIN_ID
    : AMOY_CHAIN_ID;

export async function connectWallet(): Promise<string | null> {
  if (typeof window === "undefined" || !window.ethereum) {
    return null;
  }
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    return await signer.getAddress();
  } catch {
    return null;
  }
}

export async function getWalletAddress(): Promise<string | null> {
  if (typeof window === "undefined" || !window.ethereum) return null;
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.listAccounts();
    if (accounts.length === 0) return null;
    return accounts[0].address;
  } catch {
    return null;
  }
}

export async function getCurrentChainId(): Promise<string | null> {
  if (typeof window === "undefined" || !window.ethereum) return null;
  try {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    return chainId as string;
  } catch {
    return null;
  }
}

export async function switchToPolygon(): Promise<boolean> {
  if (typeof window === "undefined" || !window.ethereum) return false;
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: TARGET_CHAIN_ID }],
    });
    return true;
  } catch {
    return false;
  }
}

export function shortenAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function isMetaMaskInstalled(): boolean {
  return typeof window !== "undefined" && !!window.ethereum;
}
