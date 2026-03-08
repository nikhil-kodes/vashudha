"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapPin {
  id: string;
  lat: number;
  lng: number;
  type: "available" | "dispatched" | "ngo" | "predicted";
  label: string;
  food?: string;
  meals?: number;
}

const JAIPUR_CENTER: [number, number] = [26.9124, 75.7873];

const MOCK_PINS: MapPin[] = [
  { id: "1", lat: 26.9124, lng: 75.7873, type: "available", label: "Hotel Pearl Palace", food: "Dal Rice 40kg", meals: 160 },
  { id: "2", lat: 26.9245, lng: 75.8098, type: "dispatched", label: "Grand Caterers", food: "Biryani 15kg", meals: 60 },
  { id: "3", lat: 26.8980, lng: 75.7650, type: "ngo", label: "Aashray Foundation" },
  { id: "4", lat: 26.9320, lng: 75.7720, type: "ngo", label: "Robin Hood Army" },
  { id: "5", lat: 26.9050, lng: 75.8200, type: "available", label: "Wedding Hall Deluxe", food: "Mixed Veg 30kg", meals: 120 },
  { id: "6", lat: 26.8850, lng: 75.7900, type: "predicted", label: "Hotel Horizon (Predicted)" },
  { id: "7", lat: 26.9400, lng: 75.8050, type: "ngo", label: "HelpAge India" },
];

function createIcon(type: string): L.DivIcon {
  const colors: Record<string, string> = {
    available: "#22c55e",
    dispatched: "#3b82f6",
    ngo: "#60a5fa",
    predicted: "transparent",
  };
  const bg = colors[type] || "#22c55e";
  const isPredicted = type === "predicted";

  return L.divIcon({
    html: `
      <div style="
        position: relative;
        width: 16px; height: 16px;
        border-radius: 50%;
        background: ${isPredicted ? "transparent" : bg};
        border: ${isPredicted ? `2px dashed ${colors.available}` : `2px solid rgba(255,255,255,0.3)`};
        box-shadow: ${isPredicted ? "none" : `0 0 12px ${bg}60`};
      ">
        ${type === "available" ? `<div style="position:absolute;inset:0;border-radius:50%;animation:ripple 2s infinite;background:${bg}30;"></div>` : ""}
      </div>
    `,
    className: "",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

export default function LiveMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: JAIPUR_CENTER,
      zoom: 13,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Add pins
    MOCK_PINS.forEach((pin) => {
      const icon = createIcon(pin.type);
      const marker = L.marker([pin.lat, pin.lng], { icon });
      const popupContent = `
        <div style="background:#141a14;border:1px solid rgba(34,197,94,0.2);border-radius:8px;padding:10px;min-width:160px;color:#f0faf0;font-family:sans-serif;">
          <p style="font-weight:600;font-size:13px;margin:0 0 4px">${pin.label}</p>
          ${pin.food ? `<p style="font-size:11px;color:#86a886;margin:0 0 2px">🍱 ${pin.food}</p>` : ""}
          ${pin.meals ? `<p style="font-size:11px;color:#22c55e;margin:0">~${pin.meals} meals</p>` : ""}
          <span style="font-size:9px;padding:2px 6px;border-radius:999px;background:rgba(34,197,94,0.12);color:#22c55e;text-transform:uppercase;font-weight:600;">${pin.type}</span>
        </div>
      `;
      marker.bindPopup(popupContent, { className: "vashudha-popup", maxWidth: 200 });
      marker.addTo(map);
    });

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <style>{`
        .leaflet-tile-pane { filter: brightness(0.6) saturate(0.4) hue-rotate(100deg); }
        .leaflet-container { background: #050805; }
        .leaflet-popup-content-wrapper, .leaflet-popup-tip { background: transparent !important; box-shadow: none !important; }
        .leaflet-popup-content { margin: 0 !important; }
        @keyframes ripple { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(3); opacity: 0; } }
      `}</style>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
