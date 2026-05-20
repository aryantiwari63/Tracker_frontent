import { zoomIntoRegion, zoomIntoState } from "./mapHelpers";
import { citiesData, stateRegionMap } from "./Constant";

export const handleRegionClick = (region, setSelectedCities, setSelectedStates, setLabelMarkers, setSelectedRegion, changeMode, changeRegion, map) => {
  const regionStates = Object.keys(stateRegionMap).filter(state => stateRegionMap[state] === region);
  console.log('regionStates',regionStates)
  setSelectedCities([]);
  setSelectedStates(regionStates);
  setLabelMarkers(regionStates);
  setSelectedRegion(region);

  changeMode("state");
  changeRegion(region);

  zoomIntoRegion(region, map);
};

export const handleStateClick = (stateName, setSelectedCities, setLabelMarkers, changeMode, changeState, map) => {
  const cities = citiesData.filter(city => city.state === stateName);

  setSelectedCities(cities);
  setLabelMarkers([]);
  changeMode("city");
  changeState(stateName);

  zoomIntoState(stateName, map);
};

// handler.js

export const handleCityClick = (stateName) => {
    const citiesInState = citiesData.filter(city => city.state === stateName);
    console.log('citiesInState', citiesInState);

    if (citiesInState.length > 0) {
      const clickedCity = citiesInState[0];
      console.log("Clicked City Name:", clickedCity.name);
  
      // const samplePoints = [
      //   [clickedCity.lat, clickedCity.lng, 0.8], // Amazon
      //   [clickedCity.lat + 0.05, clickedCity.lng + 0.05, 0.6], // Flipkart
      // ];
  
      // setHeatmapPoints(samplePoints);
    } else {
      console.log("No cities found for state:", stateName);
    }
};
  