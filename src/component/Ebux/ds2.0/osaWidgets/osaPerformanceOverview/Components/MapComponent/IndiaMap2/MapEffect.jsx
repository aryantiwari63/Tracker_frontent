/* eslint-disable */
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { handleCountryClick } from "./Handlers";

export default function MapEffect({
  mapTtype,
  locationStep,
  locationStepValue,
  changeMode,
  changeRegion,
  changeState,
  setSelectedRegion,
  setSelectedStates,
  setSelectedCities,
  setLabelMarkers,
  handleRegionClick,
  handleStateClick,
  handleCityClick,
  stateRef
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || !locationStep) return;


    if (locationStep == "Country" && locationStepValue=="India" && mapTtype!='city-map') {
        

      stateRef.current = null;
    //   changeMode("region");
    //   changeRegion(null);
    //   stateRef.current = null;
    //   setSelectedRegion(null);
    //   setSelectedStates([]);
    //   setSelectedCities([]);
    //   setLabelMarkers([]);
    if(map){
    handleCountryClick(
        setSelectedCities,
        setSelectedStates,
        setLabelMarkers,
        setSelectedRegion,
        changeMode,
        changeRegion,
        map
    )
    }
    } else if (locationStep === "Region") {
      
      setSelectedCities([]);
      setLabelMarkers([]);
      changeState(null);
      const regionName = locationStepValue?.replace("Zone", "").trim();
      if(map){
      handleRegionClick(
        regionName,
        setSelectedCities,
        setSelectedStates,
        setLabelMarkers,
        setSelectedRegion,
        changeMode,
        changeRegion,
        map
      );
    }
    } else if (locationStep === "State") {
      if(map){

        handleStateClick(
          locationStepValue,
          setSelectedCities,
          setLabelMarkers,
          changeMode,
          changeState,
          map
        );
      }
    }else if (locationStep === "City") {
      handleCityClick(locationStepValue)
    }
  }, [mapTtype,map,locationStep]);

  return null;
}