"use client";

import { useState, useEffect, useCallback } from "react";
import {
  connectWallet as connectWalletFn,
  getWalletAddress,
  getCurrentChainId,
  switchToPolygon,
  TARGET_CHAIN_ID,
  isMetaMaskInstalled,
  shortenAddress,
} from "@/lib/web3";

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  const isCorrectNetwork = chainId === TARGET_CHAIN_ID;

  useEffect(() => {
    setIsInstalled(isMetaMaskInstalled());
    // Auto-detect if already connected
    getWalletAddress().then(setAddress);
    getCurrentChainId().then(setChainId);

    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        setAddress(accounts[0] || null);
      };
      const handleChainChanged = (id: string) => {
        setChainId(id);
      };
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
      return () => {
        window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum?.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, []);

  const connect = useCallback(async () => {
    setConnecting(true);
    try {
      const addr = await connectWalletFn();
      setAddress(addr);
      const id = await getCurrentChainId();
      setChainId(id);
    } finally {
      setConnecting(false);
    }
  }, []);

  const switchNetwork = useCallback(async () => {
    await switchToPolygon();
    const id = await getCurrentChainId();
    setChainId(id);
  }, []);

  return {
    address,
    shortAddress: address ? shortenAddress(address) : null,
    chainId,
    connecting,
    isInstalled,
    isConnected: !!address,
    isCorrectNetwork,
    connect,
    switchNetwork,
  };
}
