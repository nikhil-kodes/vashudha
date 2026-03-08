"use client";

import { useState, useCallback } from "react";

export interface GeoCoords {
  lat: number;
  lng: number;
}

export interface GeoLocationState {
  coords: GeoCoords | null;
  loading: boolean;
  error: string | null;
  /** Call this to (re-)request the device location */
  getLocation: () => Promise<GeoCoords | null>;
}

/**
 * useGeoLocation
 * Wraps the browser Geolocation API.
 * Call `getLocation()` to trigger a permission prompt and fetch coordinates.
 * The result is also stored in `coords` for convenience.
 *
 * Usage:
 *   const { coords, loading, error, getLocation } = useGeoLocation();
 */
export function useGeoLocation(): GeoLocationState {
  const [coords,  setCoords]  = useState<GeoCoords | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const getLocation = useCallback((): Promise<GeoCoords | null> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined" || !navigator.geolocation) {
        setError("Geolocation is not supported by your browser.");
        resolve(null);
        return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const result: GeoCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCoords(result);
          setLoading(false);
          resolve(result);
        },
        (err) => {
          let msg = "Could not fetch location.";
          if (err.code === err.PERMISSION_DENIED)
            msg = "Location permission denied. Please enable it in your browser settings.";
          else if (err.code === err.POSITION_UNAVAILABLE)
            msg = "Location information is unavailable.";
          else if (err.code === err.TIMEOUT)
            msg = "Location request timed out.";
          setError(msg);
          setLoading(false);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  }, []);

  return { coords, loading, error, getLocation };
}
