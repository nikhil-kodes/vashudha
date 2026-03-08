"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

/* ═══════════════════════════════════════════════════
   VASHUDHA Need Heatmap — Snapchat-style heatmap
   showing areas with high food insecurity / slum 
   density in Jaipur. NGOs use this to prioritize 
   delivery routes.
   ═══════════════════════════════════════════════════ */

// Extend Leaflet types for heatLayer
declare module "leaflet" {
  function heatLayer(
    latlngs: Array<[number, number, number?]>,
    options?: {
      radius?: number;
      blur?: number;
      maxZoom?: number;
      max?: number;
      minOpacity?: number;
      gradient?: Record<number, string>;
    }
  ): L.Layer;
}

/* ─── Mock heatmap data: slum clusters + poverty pockets in Jaipur ─── */
const NEED_HOTSPOTS: [number, number, number][] = [
  // [lat, lng, intensity 0-1]

  // Jagatpura slum cluster
  [26.8350, 75.8230, 0.95],
  [26.8360, 75.8250, 0.90],
  [26.8340, 75.8210, 0.88],
  [26.8370, 75.8240, 0.85],
  [26.8345, 75.8265, 0.80],

  // Sanganer industrial area
  [26.8270, 75.7910, 0.92],
  [26.8280, 75.7930, 0.88],
  [26.8260, 75.7890, 0.85],
  [26.8290, 75.7920, 0.82],
  [26.8265, 75.7945, 0.78],

  // Malviya Nagar slums
  [26.8540, 75.8050, 0.87],
  [26.8550, 75.8070, 0.83],
  [26.8530, 75.8030, 0.80],
  [26.8560, 75.8060, 0.75],

  // Mansarovar periphery
  [26.8680, 75.7580, 0.82],
  [26.8690, 75.7600, 0.78],
  [26.8670, 75.7560, 0.75],
  [26.8700, 75.7590, 0.72],

  // Galta Gate area
  [26.9250, 75.8550, 0.90],
  [26.9260, 75.8570, 0.86],
  [26.9240, 75.8530, 0.83],
  [26.9270, 75.8560, 0.80],
  [26.9245, 75.8585, 0.77],

  // Chandpole / Walled City dense areas
  [26.9190, 75.8180, 0.78],
  [26.9200, 75.8200, 0.75],
  [26.9180, 75.8160, 0.72],

  // Vidhyadhar Nagar outskirts
  [26.9470, 75.7950, 0.85],
  [26.9480, 75.7970, 0.81],
  [26.9460, 75.7930, 0.78],
  [26.9490, 75.7960, 0.75],

  // Jhotwara area
  [26.9350, 75.7480, 0.88],
  [26.9360, 75.7500, 0.84],
  [26.9340, 75.7460, 0.80],
  [26.9370, 75.7490, 0.77],
  [26.9345, 75.7515, 0.73],

  // Ambabari settlements
  [26.9420, 75.7650, 0.80],
  [26.9430, 75.7670, 0.76],
  [26.9410, 75.7630, 0.73],

  // Sitapura industrial slums
  [26.7960, 75.8400, 0.93],
  [26.7970, 75.8420, 0.89],
  [26.7950, 75.8380, 0.86],
  [26.7980, 75.8410, 0.83],
  [26.7965, 75.8440, 0.80],

  // Durgapura
  [26.8450, 75.8100, 0.75],
  [26.8460, 75.8120, 0.72],
  [26.8440, 75.8080, 0.70],

  // scattered lower-intensity areas
  [26.8800, 75.7700, 0.55],
  [26.9000, 75.7500, 0.50],
  [26.9100, 75.8300, 0.60],
  [26.9500, 75.8100, 0.45],
  [26.8600, 75.8300, 0.58],
  [26.8900, 75.8400, 0.52],
];

/* ─── Delivery location markers ─── */
const DELIVERY_POINTS = [
  { lat: 26.8350, lng: 75.8230, label: "Jagatpura Slum Colony", people: "~2,400 families", urgency: "critical" },
  { lat: 26.9250, lng: 75.8550, label: "Galta Gate Settlement", people: "~1,800 families", urgency: "high" },
  { lat: 26.7960, lng: 75.8400, label: "Sitapura Industrial Camp", people: "~3,100 families", urgency: "critical" },
  { lat: 26.9350, lng: 75.7480, label: "Jhotwara Basti", people: "~1,500 families", urgency: "high" },
  { lat: 26.9470, lng: 75.7950, label: "Vidhyadhar Nagar Colony", people: "~900 families", urgency: "medium" },
  { lat: 26.8680, lng: 75.7580, label: "Mansarovar B-Block Slum", people: "~1,200 families", urgency: "high" },
];

interface NeedHeatmapProps {
  height?: string;
  showDeliveryPoints?: boolean;
  onDeliverySelect?: (point: typeof DELIVERY_POINTS[number]) => void;
  selectedPointLabel?: string;
}

export default function NeedHeatmap({
  height = "100%",
  showDeliveryPoints = true,
  onDeliverySelect,
  selectedPointLabel,
}: NeedHeatmapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [26.888, 75.800],
      zoom: 12,
      zoomControl: true,
      attributionControl: false,
    });

    // Dark OSM tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Add heatmap layer (Snapchat-style warm gradient)
    const heat = L.heatLayer(NEED_HOTSPOTS, {
      radius: 35,
      blur: 25,
      maxZoom: 15,
      max: 1.0,
      minOpacity: 0.4,
      gradient: {
        0.0: "#050805",
        0.2: "#0a3d0a",
        0.4: "#d97706",
        0.6: "#f59e0b",
        0.8: "#ef4444",
        1.0: "#dc2626",
      },
    });
    heat.addTo(map);

    // Add delivery point markers
    if (showDeliveryPoints) {
      DELIVERY_POINTS.forEach((pt) => {
        const isSelected = selectedPointLabel === pt.label;
        const urgencyColors: Record<string, string> = {
          critical: "#ef4444",
          high: "#f59e0b",
          medium: "#22c55e",
        };
        const color = urgencyColors[pt.urgency] || "#22c55e";

        const icon = L.divIcon({
          html: `
            <div style="
              position: relative;
              width: 20px; height: 20px;
              border-radius: 50%;
              background: ${color};
              border: 3px solid ${isSelected ? "#fff" : "rgba(255,255,255,0.4)"};
              box-shadow: 0 0 16px ${color}90, 0 0 32px ${color}40;
              cursor: pointer;
            ">
              <div style="position:absolute;inset:0;border-radius:50%;animation:heatPulse 2s infinite;background:${color}40;"></div>
            </div>
          `,
          className: "",
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const marker = L.marker([pt.lat, pt.lng], { icon });

        const popupContent = `
          <div style="
            background: #141a14;
            border: 1px solid ${color}40;
            border-radius: 10px;
            padding: 12px;
            min-width: 180px;
            color: #f0faf0;
            font-family: sans-serif;
          ">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
              <div style="width:8px;height:8px;border-radius:50%;background:${color};box-shadow:0 0 6px ${color}60;"></div>
              <span style="font-size:9px;padding:2px 8px;border-radius:999px;background:${color}20;color:${color};text-transform:uppercase;font-weight:700;">${pt.urgency}</span>
            </div>
            <p style="font-weight:600;font-size:13px;margin:0 0 4px;">${pt.label}</p>
            <p style="font-size:11px;color:#86a886;margin:0 0 8px;">${pt.people}</p>
            <button onclick="window.__vashudhaSelectDelivery && window.__vashudhaSelectDelivery('${pt.label}')"
              style="
                width:100%;padding:6px;border-radius:6px;background:${color};color:#050805;
                font-size:11px;font-weight:600;border:none;cursor:pointer;
              ">
              Navigate Here →
            </button>
          </div>
        `;

        marker.bindPopup(popupContent, {
          className: "vashudha-popup",
          maxWidth: 220,
        });

        marker.on("click", () => {
          if (onDeliverySelect) {
            onDeliverySelect(pt);
          }
        });

        marker.addTo(map);
      });
    }

    // Expose callback for popup button clicks
    if (onDeliverySelect && typeof window !== "undefined") {
      (window as any).__vashudhaSelectDelivery = (label: string) => {
        const pt = DELIVERY_POINTS.find((p) => p.label === label);
        if (pt) onDeliverySelect(pt);
      };
    }

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
      if (typeof window !== "undefined") {
        delete (window as any).__vashudhaSelectDelivery;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ width: "100%", height, position: "relative" }}>
      <style>{`
        .leaflet-tile-pane { filter: brightness(0.5) saturate(0.3) hue-rotate(100deg); }
        .leaflet-container { background: #050805; }
        .leaflet-popup-content-wrapper, .leaflet-popup-tip { background: transparent !important; box-shadow: none !important; }
        .leaflet-popup-content { margin: 0 !important; }
        @keyframes heatPulse { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(2.5); opacity: 0; } }
      `}</style>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

      {/* Legend overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: 12,
          zIndex: 1000,
          background: "rgba(5,8,5,0.9)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(34,197,94,0.1)",
          borderRadius: 10,
          padding: "10px 14px",
        }}
      >
        <p style={{ fontSize: 9, color: "#4a664a", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6, fontWeight: 600 }}>
          Need Intensity
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 80, height: 8, borderRadius: 4, background: "linear-gradient(to right, #0a3d0a, #d97706, #f59e0b, #ef4444, #dc2626)" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
          <span style={{ fontSize: 8, color: "#4a664a" }}>Low</span>
          <span style={{ fontSize: 8, color: "#ef4444" }}>Critical</span>
        </div>
      </div>
    </div>
  );
}

export { DELIVERY_POINTS };
