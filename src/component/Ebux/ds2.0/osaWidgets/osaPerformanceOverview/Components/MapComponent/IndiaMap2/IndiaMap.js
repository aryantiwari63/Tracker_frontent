"use client";
import React, { useState, useRef } from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import L from "leaflet";
import indiaData from "./india-geojson";
import { styleFeature } from "./mapHelpers";
import {
  handleRegionClick,
  handleStateClick,
  handleCityClick,
} from "./Handlers";
import CityMarkers from "./CityMarkers";
import StateLabels from "./StateLabels";
import { stateRegionMap } from "./Constant";
// import { HeatmapLayer } from "./HeatmapLayer";
import RegionMarkers from "./RegionMarkers";
import "leaflet/dist/leaflet.css";
import "leaflet.fullscreen/Control.FullScreen.js";
import "leaflet.fullscreen/Control.FullScreen.css";
// import MapZoomControls from "./MapZoomControls";

import "leaflet.fullscreen";

export default function IndiaMap() {
  const indiaCenter = [22.5937, 78.9629];
  const [mode, setMode] = useState("region");
  console.log('mode', mode)
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [labelMarkers, setLabelMarkers] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  // const [heatmapPoints, setHeatmapPoints] = useState([]);

  const mapRef = useRef(null);
  const modeRef = useRef("region");
  const regionRef = useRef(null);
  const stateRef = useRef(null);

  const changeMode = (newMode) => {
    setMode(newMode);
    modeRef.current = newMode;
  };

  const changeRegion = (newRegion) => {
    regionRef.current = newRegion;
  };

  const changeState = (newState) => {
    stateRef.current = newState;
  };

  const onCityClick = (stateName) => {
    handleCityClick(stateName);
    console.log("City clicked:", stateName);
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: () => {
        const clickedStateName = feature.properties.st_nm;
        const region = stateRegionMap[clickedStateName];

        if (regionRef.current !== region) {
          handleRegionClick(
            region,
            setSelectedCities,
            setSelectedStates,
            setLabelMarkers,
            setSelectedRegion,
            changeMode,
            changeRegion,
            layer._map
          );
          return;
        }

        if (modeRef.current === "region") {
          handleRegionClick(
            region,
            setSelectedCities,
            setSelectedStates,
            setLabelMarkers,
            setSelectedRegion,
            changeMode,
            changeRegion,
            layer._map
          );
        } else {
          if (stateRef.current !== clickedStateName) {
            handleStateClick(
              clickedStateName,
              setSelectedCities,
              setLabelMarkers,
              changeMode,
              changeState,
              layer._map
            );
            return;
          }

          if (modeRef.current === "state") {
            handleStateClick(
              clickedStateName,
              setSelectedCities,
              setLabelMarkers,
              changeMode,
              changeState,
              layer._map
            );
          }

          if (modeRef.current === "city") {
            onCityClick(clickedStateName, layer);
          }
        }
      },
    });
  };

  const handleRegionMarkerClick = (region) => {
    handleRegionClick(
      region,
      setSelectedCities,
      setSelectedStates,
      setLabelMarkers,
      setSelectedRegion,
      changeMode,
      changeRegion
    );
  };

  return (
    <div className="relative z-0 mt-0" style={{ height: "78vh", width: "100%" }}>
      <MapContainer
        center={indiaCenter}
        zoom={4.6}
        minZoom={4}
        maxZoom={8}
        zoomSnap={0}
        style={{ height: "100%", width: "100%", backgroundColor: "#fff" }}
        scrollWheelZoom={false}
        zoomControl={false} // Disable default zoom control
        dragging={true}
        doubleClickZoom={false}
        touchZoom={false}
        keyboard={false}
        maxBounds={[[6, 68], [38, 98]]}
        maxBoundsViscosity={1.0}
        fullscreenControl={false} // <-- Add this line

        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;

          // ✅ Add fullscreen control
          if (L.Control.Fullscreen) {
            const fsControl = new L.Control.Fullscreen({
              position: "topleft"
            });
            mapInstance.addControl(fsControl);

            mapInstance.on("enterFullscreen", () => {
              console.log("Entered fullscreen");
            });

            mapInstance.on("exitFullscreen", () => {
              console.log("Exited fullscreen");
            });
          } else {
            console.warn("L.Control.Fullscreen not available");
          }
        }}

      >
        <GeoJSON
          data={indiaData}
          style={(feature) =>
            styleFeature(
              feature,
              modeRef,
              selectedRegion,
              selectedStates,
              selectedCities
            )
          }
          onEachFeature={onEachFeature}
        />
        {labelMarkers.length > 0 && <StateLabels states={labelMarkers} />}
        {selectedCities.length > 0 && <CityMarkers cities={selectedCities} />}
        {/* {heatmapPoints.length > 0 && <HeatmapLayer points={heatmapPoints} />} */}
        {!selectedRegion && <RegionMarkers onClick={handleRegionMarkerClick} />}
        {/* <MapZoomControls /> */}
      </MapContainer>
    </div>
  );
}
