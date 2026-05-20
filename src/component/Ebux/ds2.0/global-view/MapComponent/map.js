/* eslint-disable */
"use client";
import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer,GeoJSON } from "react-leaflet";
import L from "leaflet";
import CountryMarkers from "./CountryMarkers";
import "leaflet/dist/leaflet.css";
import "leaflet.fullscreen/Control.FullScreen.js";
import "leaflet.fullscreen/Control.FullScreen.css";
import "leaflet.fullscreen";
import MapZoomControls from "./MapZoomControls";
import countriesGeoJson from "./custom.geo.json";
// Simplified GeoJSON for demonstration



export default function Map({
  handle_active_client_project_change,
  kpiData={},
  currentCountries = [],
  activefromTable = null,
  is_dark_store = false,
  Country,
  mapCenter = [22.5937, 78.9629],
  maxBounds,
  initZoom = 3,
  filters,
  darkStoreLocationData,
  updateLocationSteps,
  locationSteps,
  metrics,
  loadingReport
}) {
  const highlighted =currentCountries.map((c) => c?.project?.country);
  //      [
  // // "India", 
  // "Brazil", "Mexico", "United Kingdom"];
const styleFeature = feature => {
  const name = feature.properties.name;
  return {
    fillColor: highlighted.includes(name) ? 
    "green"??"#ffffaa" 
    : "white"??"#ccc",
    // color: "#333",
    color: "#000000",
    weight: 0,
    fillOpacity: 0.4,
  };
};
  const [mode, setMode] = useState("region");
  const [mapReady, setMapReady] = useState(false);
  const [geoJsonKey, setGeoJsonKey] = useState(0);

  const mapRef = useRef(null);
  const modeRef = useRef("region");

  const changeMode = (newMode) => {
    setMode(newMode);
    modeRef.current = newMode;
  };

  // 🔄 Re-key map only when ready or center changes
  useEffect(() => {
    setGeoJsonKey((prev) => prev + 1);
  }, [mapReady, mapCenter]);

  // 📍 Normalize mapCenter into [lat, lng]
  const normalizeCenter = (center) => {
    if (!center) return [22.5937, 78.9629];
    if (Array.isArray(center) && center.length >= 2) {
      return [Number(center[0]), Number(center[1])];
    }
    if (typeof center === "object") {
      return [
        Number(center.lat ?? center.latitude ?? 22.5937),
        Number(center.lng ?? center.longitude ?? 78.9629)
      ];
    }
    return [22.5937, 78.9629];
  };

  // 🧭 Sync map center and zoom when props change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    const latlng = normalizeCenter(mapCenter);
    try {
      map.flyTo(latlng, initZoom, { animate: true, duration: 0.8 });
      console.log("📍 Map recentered & zoom updated:", latlng, initZoom);
    } catch (err) {
      console.warn("⚠️ flyTo error:", err);
    }
  }, [mapCenter, initZoom, mapReady, currentCountries,kpiData]);

  // 🧹 Cleanup map instance on unmount
  useEffect(() => {
    return () => {
      try {
        if (mapRef.current?._loaded) mapRef.current.stop();
        if (mapRef.current) {
          mapRef.current.off();
          mapRef.current.remove();
          mapRef.current = null;
        }
      } catch (err) {
        console.warn("Map cleanup error:", err);
      }
    };
  }, []);

  // ⏳ Show loading spinner
  if (loadingReport) {
    return (
      <div className="flex justify-center items-center h-[500px] w-full">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="relative z-0" style={{ height: "100%", width: "100%" }}>
      <MapContainer
        key={geoJsonKey}
        center={normalizeCenter(mapCenter)}
        zoom={initZoom}
        minZoom={1}
        maxZoom={22}
        zoomSnap={0}
        style={{ height: "100%", width: "100%", backgroundColor: "#fff" }}
        scrollWheelZoom={false}
        zoomControl={false}
        dragging={true}
        doubleClickZoom={false}
        touchZoom={false}
        keyboard={false}
        maxBounds={maxBounds ?? [[6, 68], [38, 98]]}
        maxBoundsViscosity={1.0}
        fullscreenControl={false}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
          mapInstance.on("load", () => {
            setMapReady(true);
            console.log("✅ Map is ready");
          });

          // ✅ Add fullscreen control
          if (L.Control.Fullscreen) {
            const fsControl = new L.Control.Fullscreen({ position: "topleft" });
            mapInstance.addControl(fsControl);
          } else {
            console.warn("⚠️ L.Control.Fullscreen not available");
          }
        }}
      >
        {currentCountries?.length > 0 && (
          <CountryMarkers handle_active_client_project_change={handle_active_client_project_change} kpiData={kpiData} currentCountries={currentCountries} />
        )}

        <MapZoomControls />
        <GeoJSON data={countriesGeoJson}
        style={styleFeature} 
        />

        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          subdomains={["a", "b", "c", "d"]}
          zIndex={22}
          maxZoom={22}
          minZoom={1}
        />
    
      </MapContainer>
    </div>
  );
}
