/* eslint-disable */
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { handleCountryClick } from "./Handlers";

export default function MapEffect({
  is_dark_store,
  mapTtype,
  locationStep,
  locationStepValue,
  changeMode,
  changeRegion,
  changeState,
  changeCity,
  changePincode,
  setSelectedRegion,
  setSelectedStates,
  setSelectedCities,
  setSelectedPincodeList,
  setSelectedDarkStoreList,
  setLabelMarkers,
  handleRegionClick,
  handleStateClick,
  handleCityClick,
  handlePincodeClick,
  stateRef,
  filters,
  Country
}) {
  const map = useMap();

  useEffect(() => {
        const isMapValid =
      map &&
      map._loaded &&
      map._container &&
      map._container.offsetParent !== null;

    if (!isMapValid || !locationStep) return;
    // if (!map || !locationStep) return;


    if (locationStep == "Country" && locationStepValue == Country && mapTtype != 'city-map') {


      stateRef.current = null;
      //   changeMode("region");
      //   changeRegion(null);
      //   stateRef.current = null;
      //   setSelectedRegion(null);
      //   setSelectedStates([]);
      //   setSelectedCities([]);
      //   setLabelMarkers([]);
      if (map&&!is_dark_store) {
        handleCountryClick(
          setSelectedCities,
          setSelectedStates,
          setLabelMarkers,
          setSelectedRegion,
          changeMode,
          changeRegion,
          map,
          filters,
          Country
        )
      }
    } else if (locationStep === "Region") {

      setSelectedCities([]);
      setLabelMarkers([]);
      changeState(null);
      const regionName = locationStepValue?.replace("Zone", "").trim();
      if (map) {
        handleRegionClick(
          regionName,
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
    } else if (locationStep === "State") {
      if (map) {

        handleStateClick(
          locationStepValue,
          setSelectedCities,
          setLabelMarkers,
          changeMode,
          changeState,
          map,
          filters,
          Country
        );
      }
    } else if (locationStep === "City") {
      if (map) {

        handleCityClick(
          locationStepValue,
          setSelectedPincodeList,
          setLabelMarkers,
          changeMode,
          changeCity,
          map,
          filters,
          Country
        );
      }
    } else if (locationStep === "Pincode") {
      if (map&&is_dark_store) {

        handlePincodeClick(
              locationStepValue,
              setSelectedDarkStoreList,
              setLabelMarkers,
              changeMode,
              changePincode,
              map,
              filters,
              Country
            );
      }else{

        handleCityClick(locationStepValue)
      }
    }
    
  }, [mapTtype, map, locationStep]);

  return null;
}