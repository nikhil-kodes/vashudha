"use client";

import { useRef } from "react";
import L from "leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

export default function NGORouteMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    const map = L.map(mapRef.current, { center: [26.9124, 75.7873], zoom: 14, zoomControl: false, attributionControl: false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    // Donor pin
    const donorIcon = L.divIcon({ html: `<div style="width:12px;height:12px;border-radius:50%;background:#22c55e;border:2px solid #fff;box-shadow:0 0 8px #22c55e60;"></div>`, className: "", iconSize: [12, 12], iconAnchor: [6, 6] });
    L.marker([26.9124, 75.7873], { icon: donorIcon }).bindPopup("Hotel Pearl Palace").addTo(map);

    // NGO pin
    const ngoIcon = L.divIcon({ html: `<div style="width:12px;height:12px;border-radius:50%;background:#3b82f6;border:2px solid #fff;box-shadow:0 0 8px #3b82f660;"></div>`, className: "", iconSize: [12, 12], iconAnchor: [6, 6] });
    L.marker([26.8980, 75.7650], { icon: ngoIcon }).bindPopup("Aashray Foundation").addTo(map);

    // Route line
    L.polyline([[26.8980, 75.7650], [26.905, 75.772], [26.9124, 75.7873]], { color: "#22c55e", weight: 3, dashArray: "8 6", opacity: 0.8 }).addTo(map);

    mapInstance.current = map;
    return () => { map.remove(); mapInstance.current = null; };
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <style>{`.leaflet-tile-pane{filter:brightness(0.6) saturate(0.4) hue-rotate(100deg)}.leaflet-container{background:#050805}`}</style>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
