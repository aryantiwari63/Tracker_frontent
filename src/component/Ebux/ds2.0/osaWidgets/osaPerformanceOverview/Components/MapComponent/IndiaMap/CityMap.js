/* eslint-disable */
"use client";
import React, { useState, useRef, useEffect
  // , useEffect 
} from "react";
import { 
  MapContainer, 
  GeoJSON, 
  useMap,
  TileLayer, 
  // Popup 
} from "react-leaflet";
import L from "leaflet";
import indiaData from "./india-geojson";
import jaipurData from "./CityMapGeoJson/jaipur-geojson";
import { styleFeature } from "./mapHelpers";
import {
  handleRegionClick,
  handleStateClick,
  handleCityClick,
} from "./Handlers";
import { viewConfigMap } from "./Constant";
// import { HeatmapLayer } from "./HeatmapLayer";
import "leaflet/dist/leaflet.css";
import "leaflet.fullscreen/Control.FullScreen.js";
import "leaflet.fullscreen/Control.FullScreen.css";
import MapZoomControls from "./MapZoomControls";

import "leaflet.fullscreen";
import MapEffect from "./MapEffect";
import delhiGeoJSON from "./CityMapGeoJson/delhi-geojson";
import upGeoJSON from "./CityMapGeoJson/up-geojson";
import lucknowGeoJSON from "./CityMapGeoJson/lucknow-geojson";
import mumbaiGeoJSON from "./CityMapGeoJson/mumbai-geojson";
import puneGeoJSON from "./CityMapGeoJson/pune-geojson";
import kolkataGeoJSON from "./CityMapGeoJson/kolkata-geojson";
import bangaloreGeoJSON from "./CityMapGeoJson/bangalore-geojson";
import chennaiGeoJSON from "./CityMapGeoJson/chennai-geojson";
import hrNCRGeoJSON from "./CityMapGeoJson/hr-ncr-geojson";
import StoreMarkers from "./StoreMarkers";
import upNCRGeoJSON from "./CityMapGeoJson/up-ncr-geojson";
import noidaGeoJSON from "./CityMapGeoJson/noida-geojson";
import hyderabadGeoJSON from "./CityMapGeoJson/hyderabad-geojson";


const cityGeoJSONMap = {
  Jaipur: jaipurData,
  Delhi:delhiGeoJSON,
  Lucknow:lucknowGeoJSON,
  Mumbai:mumbaiGeoJSON,
  Pune:puneGeoJSON,
  Kolkata:kolkataGeoJSON,
  Bangalore:bangaloreGeoJSON,
  Chennai:chennaiGeoJSON,
  "HR-NCR": hrNCRGeoJSON,
  "UP-NCR": upNCRGeoJSON,
  "Noida": noidaGeoJSON,
  "Hyderabad":hyderabadGeoJSON,
  up:upGeoJSON
  // Mumbai: mumbaiData,
  // ... other cities
};
const FlyToLocation=({ center, zoom })=>{
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}
export default function CityMap({activeCenter,setActiveCenter,activeStore,setActiveStore,darkStoreLocationData, locationSteps}) {
  // const indiaCenter = [22.5937, 78.9629];
  // const [heatmapPoints, setHeatmapPoints] = useState([]);
  const [mapReady, setMapReady] = useState(false);

  const mapRef = useRef(null);
  const modeRef = useRef("city-map");
  const stateRef = useRef(null);

 

  

  const [locationStep, setLocationStep] = useState("Country");
  const [locationStepValue, setLocationStepValue] = useState("india");
  useEffect(() => {
    const allStep = Object.keys(locationSteps).filter(
      (step) => locationSteps[step] !== null
    );
    const currentStep = allStep[allStep.length - 1];
    setLocationStep(currentStep);
    setLocationStepValue(locationSteps[currentStep]);
  },[locationSteps])
  const [geoJsonKey, setGeoJsonKey] = useState(0);
  const getActiveData = () => {
    if (locationStep === "City" || locationStep === "Store") return cityGeoJSONMap?.[locationStepValue]??indiaData;
    return null;
  };

  const getView = () => {
    if (locationStep === "City" || locationStep === "Store") return viewConfigMap?.[locationStepValue]??viewConfigMap["india"];
    return { center: [22.9734, 78.6569], zoom: 5 };
  };

  const activeData = getActiveData();
  const { center, zoom,maxBounds } = getView();

  useEffect(() => {
    setGeoJsonKey((prev) => prev + 1);
    
  }, [activeCenter,mapReady,locationStep, locationStepValue]);
  useEffect(() => {
    if (mapRef.current) {
      const mapInstance = mapRef.current;

      const onZoomEnd = () => {
        // Handle zoom logic here, if needed
      };

      mapInstance.on("zoomend", onZoomEnd);

      return () => {
        mapInstance.off("zoomend", onZoomEnd);
      };
    }
  }, [mapReady]);
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.off();     
        mapRef.current.remove();     
        mapRef.current = null;
      }
    };
  }, []);
  useEffect(() => {
    if (mapRef.current && !mapReady) {
      setMapReady(true);
    }
  }, [mapRef.current]);
  return (
    <div className="relative z-0 " style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={activeCenter??center}
        zoom={zoom}
        minZoom={1}
        maxZoom={25}
        zoomSnap={0}
        style={{ height: "100%", width: "100%", backgroundColor: "#fff" }}
        scrollWheelZoom={false}
        zoomControl={false} // Disable default zoom control
        dragging={true}
        doubleClickZoom={false}
        touchZoom={false}
        keyboard={false}
        maxBounds={maxBounds}
        maxBoundsViscosity={1.0}
        fullscreenControl={true} // <-- Add this line

        whenCreated={(mapInstance) => {

          mapRef.current = mapInstance;
          
          setMapReady(true);

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
<TileLayer
// url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
  
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
        subdomains={['a', 'b', 'c', 'd']}
      />
      <FlyToLocation center={center} zoom={zoom} />
        {activeData && (
        <GeoJSON
          key={geoJsonKey}
          data={activeData}
          style={(feature) =>
            styleFeature(
              feature,
              modeRef,
              null,
              null,
              null
            )
          }
        />)}
        {(locationStep === "City") && <StoreMarkers key={geoJsonKey} setActiveCenter={setActiveCenter} activeStore={activeStore} setActiveStore={setActiveStore} darkStoreLocationData={darkStoreLocationData} />}

        <MapZoomControls />
        <MapEffect
          mapTtype={"city-map"}
          locationStep={locationStep}
          locationStepValue={locationStepValue}
          changeMode={()=>{}}
          changeRegion={()=>{}}
          changeState={()=>{}}
          setSelectedRegion={()=>{}}
          setSelectedStates={()=>{}}
          setSelectedCities={()=>{}}
          setLabelMarkers={()=>{}}
          handleRegionClick={()=>{}}
          handleStateClick={()=>{}}
          handleCityClick={handleCityClick}
          stateRef={stateRef}
        />
      </MapContainer>
    </div>
  );
}

