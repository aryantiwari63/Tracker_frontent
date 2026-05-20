import L from "leaflet";
import { regionColors, stateRegionMap } from "./Constant";
import indiaData from "./india-geojson";

// ------------------------- Styles -------------------------
export const styleFeature = (
  feature,
  modeRef,
  selectedRegion,
  selectedStates,
  selectedCities,
  selectedPincodeList,
  locationStepValue
) => {
  const stateName = feature?.properties?.st_nm || "Delhi";
  const region = stateRegionMap[stateName];

  switch (modeRef.current) {
    case "region": {
      if (!selectedRegion) return baseStyle(region);
      return region === selectedRegion ? selectedStyle(region) : inactiveStyle();
    }

    case "state": {
      return selectedStates.includes(stateName) ? selectedStyle(region) : inactiveStyle();
    }

    case "city": {
      const matchingCity = selectedCities.find(city => city.state === stateName);
      return matchingCity ? cityStyle() : inactiveStyle();
    }

    case "pincode": {
      const matchingCity = selectedPincodeList.find(city => city.city === locationStepValue);
      return matchingCity ? cityStyle() : inactiveStyle();
    }

    case "dark_store":
    case "darkstore": {
      return cityStyle();
    }

    case "city-map": {
      return cityMapStyle();
    }

    default:
      return baseStyle(region);
  }
};

const cityMapStyle = () => ({
  fillColor: "white",
  color: "red",
  weight: 1,
  dashArray: "4",
  fillOpacity: 0,
});

const baseStyle = (region) => ({
  fillColor: regionColors[region] || "green",
  color: "#fff",
  weight: 1,
  fillOpacity: '0.4',
});

const selectedStyle = (region) => ({
  fillColor: regionColors[region],
  color: "#fff",
  weight: 1,
  fillOpacity: '0.4',
});

const inactiveStyle = () => ({
  fillColor: regionColors.Default,
  color: "#fff",
  weight: 1,
  fillOpacity: '0.4',
});

const cityStyle = () => ({
  fillColor: "white",
  color: "#FA8C16",
  dashArray: "4",
  weight: 1,
  fillOpacity: '0.4',
});

// ------------------------- Safe Leaflet Helper -------------------------
const safeFitBounds = (map, bounds, options = {}, retry = 0) => {
  if (!map) return;

  const container = map._container;
  const isHidden =
    !container ||
    container.offsetWidth === 0 ||
    container.offsetHeight === 0 ||
    container.style.display === "none" ||
    container.closest("[hidden]");

  if (isHidden || !map._loaded) {
    if (retry < 10) {
      // Retry every 300ms until visible
      setTimeout(() => safeFitBounds(map, bounds, options, retry + 1), 300);
    }
    return;
  }

  map.whenReady(() => {
    try {
      map.invalidateSize();
      map.fitBounds(bounds, options);
    } catch (e) {
      console.warn("safeFitBounds retry", retry, e);
      if (retry < 10) {
        setTimeout(() => safeFitBounds(map, bounds, options, retry + 1), 300);
      }
    }
  });
};


// ------------------------- Zoom Functions -------------------------
export const zoomOutRegion = (map) => {
  if (!map) return;
  const indiaBounds = L.latLngBounds(L.latLng(6, 68), L.latLng(38, 98));
  safeFitBounds(map, indiaBounds, { padding: [20, 20], maxZoom: 5 });
};

export const zoomIntoRegion = (region, map) => {
   if (!map) return;
  if (!region) region = "North";
  region = region.replace("Zone", "").trim().toLowerCase();
  const features = indiaData.features.filter(
    f => stateRegionMap[f?.properties?.st_nm]?.toLowerCase() === region
  );
  if (!features.length) return;
  const regionLayer = L.geoJSON(features);
  safeFitBounds(map, regionLayer.getBounds(), { padding: [20, 20], maxZoom: 4.8 });
};

export const zoomIntoState = (stateName, map) => {
   if (!map) return;
  const stateFeature = indiaData.features.find(
    f => f?.properties?.st_nm?.toLowerCase() === stateName?.toLowerCase()
  );
  if (!stateFeature || !stateFeature.geometry?.coordinates.length) return;
  const stateLayer = L.geoJSON(stateFeature);
  safeFitBounds(map, stateLayer.getBounds(), { padding: [20, 20], maxZoom: 6 });
};

export const zoomIntoCity = (listOfPincode, map) => {
   if (!map) return;
  if (!listOfPincode?.length) return;
  const bounds = L.latLngBounds(listOfPincode.map(i => [i.lat, i.lng]));
  safeFitBounds(map, bounds, { padding: [50, 50], maxZoom: 18 });
};

export const zoomIntoPincode = (listOfDarkStore, map) => {
   if (!map) return;
  if (!listOfDarkStore?.length) return;
  const bounds = L.latLngBounds(listOfDarkStore.map(i => [i.lat, i.lng]));
  safeFitBounds(map, bounds, { padding: [50, 50], maxZoom: 14 });
};
