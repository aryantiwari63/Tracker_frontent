/* eslint-disable */
"use client";
import React, {
  useState, useRef, useEffect
  // , useEffect 
} from "react";
import { MapContainer, GeoJSON, TileLayer } from "react-leaflet";
import L from "leaflet";
import indiaData from "./india-geojson";
import { styleFeature } from "./mapHelpers";
import {
  handleRegionClick,
  handleStateClick,
  handleCityClick,
  handlePincodeClick
} from "./Handlers";
import CityMarkers from "./CityMarkers";
import StateLabels from "./StateLabels";
// import { stateRegionMap } from "./Constant";
// import { HeatmapLayer } from "./HeatmapLayer";
import RegionMarkers from "./RegionMarkers";
import "leaflet/dist/leaflet.css";
import "leaflet.fullscreen/Control.FullScreen.js";
import "leaflet.fullscreen/Control.FullScreen.css";
// import MapZoomControls from "./MapZoomControls";

import "leaflet.fullscreen";
import MapEffect from "./MapEffect";
import PincodeMarkers from "./PincodeMarkers";
import DarkStoreMarkers from "./DarkStoreMarkers";
import MapZoomControls from "../IndiaMap/MapZoomControls";

export default function IndiaMap({activefromTable=null, is_dark_store=false, Country, mapCenter, maxBounds, initZoom = 4.5, filters, darkStoreLocationData, updateLocationSteps, locationSteps, metrics, loadingReport }) {
  const indiaCenter = mapCenter ?? [22.5937, 78.9629];
  const [mode, setMode] = useState("region");
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [labelMarkers, setLabelMarkers] = useState([]);
  const [selectedPincodeList, setSelectedPincodeList] = useState([]);
  const [selectedDarkStoreList, setSelectedDarkStoreList] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  // const [heatmapPoints, setHeatmapPoints] = useState([]);

  const [mapReady, setMapReady] = useState(false);

  const mapRef = useRef(null);
  const modeRef = useRef("region");
  const regionRef = useRef(null);
  const stateRef = useRef(null);
  const cityRef = useRef(null);
  const pincodeRef = useRef(null);

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
  const changeCity = (newCity) => {
    cityRef.current = newCity;
  };
  const changePincode = (newPincode) => {
    pincodeRef.current = newPincode;
  };


  const onRegionClick = (region, map) => {
    updateLocationSteps('Region', region.includes("Zone") ? region : `${region} Zone`);
    handleRegionClick(
      region,
      setSelectedCities,
      setSelectedStates,
      setLabelMarkers,
      setSelectedRegion,
      changeMode,
      changeRegion,
      map,
      filters,
      Country
    );
  }
  const onStateClick = (clickedStateName, map) => {
    updateLocationSteps('State', `${clickedStateName}`);
    handleStateClick(
      clickedStateName,
      setSelectedCities,
      setLabelMarkers,
      changeMode,
      changeState,
      map,
      filters,
      Country
    );
  }
  const onCityClick = (clickedCityName, map) => {
    updateLocationSteps('City', `${clickedCityName}`);
    handleCityClick(
      clickedCityName,
      setSelectedPincodeList,
      setLabelMarkers,
      changeMode,
      changeCity,
      map,
      filters,
      Country
    );
  }
  const onPincodeClick = (clickedPincodeName, map) => {
    updateLocationSteps('Pincode', `${clickedPincodeName}`);
    handlePincodeClick(
      clickedPincodeName,
      setSelectedDarkStoreList,
      setLabelMarkers,
      changeMode,
      changePincode,
      map,
      filters,
      Country
    );
  }
  // const onCityClick=(clickedStateName,map)=>{
  //   onCityChange(clickedStateName, map);
  // }

  // const onEachFeature = (feature, layer) => {
  //   layer.on({
  //     click: () => {
  //       const clickedStateName = feature.properties.st_nm;
  //       const region = stateRegionMap[clickedStateName];
  //       console.log('regionregion',region)
  //       if (regionRef.current !== region) {
  //         onRegionClick(region,layer._map);
  //         return;
  //       }

  //       // if (modeRef.current === "region") {
  //       //   updateLocationSteps('Region', `${region} Zone`);
  //       //   handleRegionClick(
  //       //     region,
  //       //     setSelectedCities,
  //       //     setSelectedStates,
  //       //     setLabelMarkers,
  //       //     setSelectedRegion,
  //       //     changeMode,
  //       //     changeRegion,
  //       //     layer._map
  //       //   );
  //       // } 
  //       else {
  //         if (stateRef.current !== clickedStateName) {
  //           onStateClick(clickedStateName,layer._map);
  //           return;
  //         }

  //         // if (modeRef.current === "state") {
  //         //   handleStateClick(
  //         //     clickedStateName,
  //         //     setSelectedCities,
  //         //     setLabelMarkers,
  //         //     changeMode,
  //         //     changeState,
  //         //     layer._map
  //         //   );
  //         // }

  //         if (modeRef.current === "city") {  
  //           onCityClick(clickedStateName, layer);
  //         }
  //       }
  //     },
  //   });
  // };

  const handleRegionMarkerClick = (region) => {
    handleRegionClick(
      region,
      setSelectedCities,
      setSelectedStates,
      setLabelMarkers,
      setSelectedRegion,
      changeMode,
      changeRegion,
      filters,
      Country
    );
  };

  const [geoJsonKey, setGeoJsonKey] = useState(0);
  useEffect(() => {
    setGeoJsonKey((prev) => prev + 1);

  }, [mapReady, locationSteps]);
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
    // return () => {
    //   if (mapRef.current) {
    //     mapRef.current.off();
    //     mapRef.current.remove();
    //     mapRef.current = null;
    //   }
    // };
    return () => {
    try {
      if (mapRef.current?._loaded) {
        mapRef.current.stop();
      }
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
  const [locationStep, setLocationStep] = useState("Country");
  const [locationStepValue, setLocationStepValue] = useState(Country ?? "India");
  useEffect(() => {
    const allStep = Object.keys(locationSteps).filter(
      (step) => locationSteps[step] !== null
    );
    const currentStep = allStep[allStep.length - 1];
    setLocationStep(currentStep);
    setLocationStepValue(locationSteps[currentStep]);
  }, [locationSteps])
  if(loadingReport){
    return <div className="flex justify-center items-center h-[500px] w-full">
      {/* <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div> */}
      <div className="animate-spin rounded-full  h-16 w-16 border-b-2 border-blue-600"></div>
    </div>
  }
  return (
    <div className="relative z-0 " style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={indiaCenter}
        zoom={initZoom}
        minZoom={1}
        maxZoom={22}
        zoomSnap={0}
        style={{ height: "100%", width: "100%", backgroundColor: "#fff" }}
        scrollWheelZoom={false}
        zoomControl={false} // Disable default zoom control
        dragging={true}
        doubleClickZoom={false}
        touchZoom={false}
        keyboard={false}
        maxBounds={maxBounds ?? [[6, 68], [38, 98]]}
        maxBoundsViscosity={1.0}
        fullscreenControl={false} // <-- Add this line

        whenCreated={(mapInstance) => {
          mapInstance.on('load', () => setMapReady(true));
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
          key={geoJsonKey}
          data={indiaData}
          style={(feature) =>
            styleFeature(
              feature,
              modeRef,
              selectedRegion,
              selectedStates,
              selectedCities,
              selectedPincodeList,
              locationStepValue
            )
          }
        // onEachFeature={onEachFeature}
        />
        {(Country == "India" && locationStep === "Region") && darkStoreLocationData?.data?.length && labelMarkers.length > 0 && <StateLabels activefromTable={activefromTable} metrics={metrics} onStateClick={onStateClick} states={labelMarkers} darkStoreLocationData={darkStoreLocationData} />}
        {((Country != "India" && locationStep === "Region") || locationStep === "State") && darkStoreLocationData?.data?.length && (selectedCities.length > 0) && <CityMarkers activefromTable={activefromTable} metrics={metrics} onCityClick={onCityClick} cities={selectedCities} darkStoreLocationData={darkStoreLocationData} />}
        {(locationStep === "City") && darkStoreLocationData?.data?.length && selectedPincodeList.length > 0 && <PincodeMarkers activefromTable={activefromTable} is_dark_store={is_dark_store} metrics={metrics} pincodeList={selectedPincodeList} onPincodeClick={onPincodeClick} darkStoreLocationData={darkStoreLocationData} updateLocationSteps={updateLocationSteps} />}
        {(locationStep === "Pincode") && darkStoreLocationData?.data?.length && selectedDarkStoreList.length > 0 && <DarkStoreMarkers activefromTable={activefromTable} is_dark_store={is_dark_store} metrics={metrics} darkStoreList={selectedDarkStoreList} darkStoreLocationData={darkStoreLocationData} updateLocationSteps={updateLocationSteps} />}


        {/* {heatmapPoints.length > 0 && <HeatmapLayer points={heatmapPoints} />} */}
        {(locationStep === "Country") && darkStoreLocationData?.data?.length && mode == "region" && !selectedRegion && <RegionMarkers activefromTable={activefromTable} metrics={metrics} Country={Country} filters={filters} locationSteps={locationSteps} onRegionClick={onRegionClick} darkStoreLocationData={darkStoreLocationData} onClick={handleRegionMarkerClick} />}
        <MapZoomControls />

        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          subdomains={['a', 'b', 'c', 'd']}
          maxZoom={22}
          minZoom={1}
        />


        {/* <TileLayer
  url="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAqUBgZK0LwAAAABJRU5ErkJggg==" 
  attribution=""
/> */}

        <MapEffect
          is_dark_store={is_dark_store}
          mapTtype={"india-map"}
          Country={Country}
          // locationSteps={locationSteps}
          locationStep={locationStep}
          locationStepValue={locationStepValue}
          changeMode={changeMode}
          changeRegion={changeRegion}
          changeState={changeState}
          changeCity={changeCity}
          changePincode={changePincode}
          setSelectedRegion={setSelectedRegion}
          setSelectedStates={setSelectedStates}
          setSelectedCities={setSelectedCities}
          setSelectedPincodeList={setSelectedPincodeList}
          setSelectedDarkStoreList={setSelectedDarkStoreList}
          setLabelMarkers={setLabelMarkers}
          handleRegionClick={handleRegionClick}
          handleStateClick={handleStateClick}
          handleCityClick={handleCityClick}
          handlePincodeClick={handlePincodeClick}
          stateRef={stateRef}
          filters={filters}
        />
      </MapContainer>
    </div>
  );
}

