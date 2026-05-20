import L from "leaflet";
import { regionColors, stateRegionMap } from "./Constant";
import indiaData from "./india-geojson";

export const styleFeature = (feature, modeRef, selectedRegion, selectedStates, selectedCities) => {
  // console.log('feature',feature)
  const stateName = feature?.properties?.st_nm || "Delhi";
  const region = stateRegionMap[stateName];
// console.timeLog('regionregion',region)
  if (modeRef.current === "region") {
    if (!selectedRegion) return baseStyle(region);
    return region === selectedRegion ? selectedStyle(region) : inactiveStyle();
  }

  if (modeRef.current === "state") {
    return selectedStates.includes(stateName) ? selectedStyle(region) : inactiveStyle();
  }

  if (modeRef.current === "city") {
    const matchingCity = selectedCities.find(city => city.state === stateName);
    return matchingCity ? cityStyle() : inactiveStyle();
  }

  
    
  
  return baseStyle(region);
};

const baseStyle = (region) => ({
  fillColor: regionColors[region] || "green",
  color: "#fff",
  weight: 1,
  fillOpacity: 10,
});

const selectedStyle = (region) => ({
  fillColor: regionColors[region],
  color: "#fff",
  weight: 1,
  fillOpacity: 10,
});

const inactiveStyle = () => ({
  fillColor: regionColors.Default,
  color: "#fff",
  weight: 1,
  fillOpacity: 10,
});

const cityStyle = () => ({
  fillColor: "white",
  color: "#FA8C16",
  dashArray: "6",
  weight: 2,
  fillOpacity: 10,
});

export const zoomIntoRegion = (region, map) => {
  const features = indiaData.features.filter(f => stateRegionMap[f.properties.st_nm] === region);
  if (features.length > 0) {
    const regionLayer = L.geoJSON(features);
    map.fitBounds(regionLayer.getBounds(), { maxZoom: 10 });
  }
};

export const zoomIntoState = (stateName, map) => {
  const stateFeature = indiaData.features.find(f => f.properties.st_nm === stateName);
  if (stateFeature) {
    const stateLayer = L.geoJSON(stateFeature);
    map.fitBounds(stateLayer.getBounds(), { maxZoom: 6 });
  }
};