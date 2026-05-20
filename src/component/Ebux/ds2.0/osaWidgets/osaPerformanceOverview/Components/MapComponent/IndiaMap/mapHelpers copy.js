import L from "leaflet";
import { regionColors, stateRegionMap } from "./Constant";
import indiaData from "./india-geojson";

export const styleFeature = (feature, modeRef, selectedRegion, selectedStates, selectedCities, selectedPincodeList, locationStepValue) => {
  // console.log('feature',feature)
  const stateName = feature?.properties?.st_nm || "Delhi";
  const region = stateRegionMap[stateName];
  // console.log("modeRef.current === -----------",modeRef.current);
  // console.timeLog('regionregion',region)
  if (modeRef.current === "region") {
    if (!selectedRegion) return baseStyle(region);
    return region === selectedRegion ? selectedStyle(region) : inactiveStyle();
  }

  if (modeRef.current === "state") {
    // console.log("modeRef.current === state",{stateName},{selectedStates},selectedStates.includes(stateName));

    return selectedStates.includes(stateName) ? selectedStyle(region) : inactiveStyle();
  }

  if (modeRef.current === "city") {

    const matchingCity = selectedCities.find(city => city.state === stateName);
    return matchingCity ? cityStyle() : inactiveStyle();
  }

  if (modeRef.current === "pincode") {

    const matchingCity = selectedPincodeList.find(city => city.city === locationStepValue);
    return matchingCity ? cityStyle() : inactiveStyle();
  }
  
  if (modeRef.current === "dark_store"||modeRef.current === "darkstore") {

    // const matchingCity = selectedPincodeList.find(city => city.city === locationStepValue);
    // return matchingCity ? cityStyle() : inactiveStyle();
    return cityStyle();
  }

  if (modeRef.current === "city-map") {
    return cityMapStyle();
  }


  return baseStyle(region);
};

const cityMapStyle = () => ({
  fillColor: "white",
  color: "red",
  weight: 1,
  dashArray: "4",
  // weight: 2,
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

export const zoomOutRegion = (map) => {
  try {
    if (!map) {
      console.warn("Map instance is not available");
      return;
    }
    map?.whenReady(() => {
      try {
        const mapContainer = map?.getContainer();
        if (!mapContainer || mapContainer.offsetHeight === 0 || mapContainer.offsetWidth === 0) {
          console.warn("Map container is hidden or not sized properly.");
          return;
        }
        const indiaBounds = L?.latLngBounds(
          L?.latLng(6, 68),
          L?.latLng(38, 98)
        );

        if (!indiaBounds) {
          console.warn("Invalid bounds for India");
          return;
        }
        // Add a small delay to ensure the map's size and rendering are updated
        setTimeout(() => {


          // Ensure map size is updated before zooming out
          map?.invalidateSize(true);

          // Zoom to the region
          map?.fitBounds(indiaBounds, {
            padding: [20, 20],
            maxZoom: 5,
          });
        }, 50);  // 100 ms delay to ensure map size is valid
      } catch (error) {
        console.error("Error zooming out region with fitBounds:", error);
      }
    });

  } catch (error) {
    console.log("Error zooming out region:", error);

  }
};
export const zoomIntoRegion = (region, map) => {
  // map = useMap();
  try {
    if (!map) {
      console.warn("Map instance is not available");
      return;
    }
    const mapContainer = map?.getContainer();
    if (!mapContainer || mapContainer.offsetHeight === 0 || mapContainer.offsetWidth === 0) {
      console.warn("Map container is hidden or not sized properly.");
      return;
    }

    region = (region?.replace("Zone", "")?.trim() ?? "North")?.toLowerCase();
    const features = indiaData?.features?.filter(f => { return (stateRegionMap?.[f?.properties?.st_nm]?.toLowerCase() == region); });


    if (!features?.length) {
      console.warn(`No state found for region: ${region}`, JSON.stringify(indiaData?.features));
      return;
    }
    const regionLayer = L.geoJSON(features);
    setTimeout(() => {
      map?.invalidateSize(true);

      map?.fitBounds(regionLayer.getBounds(), {
        padding: [20, 20],
        // maxZoom: 8,
        maxZoom: 4.8,
      });
    }, 100);
  } catch (error) {
    console.log("Error zooming into region:", error);

  }
};

export const zoomIntoState = (stateName, map) => {
  try {
    if (!map) {
      console.warn("Map instance is not available");
      return;
    }

    const stateFeature = indiaData?.features?.find(
      f => f?.properties?.st_nm?.toLowerCase() == stateName.toLowerCase()
    );

    if (!stateFeature) {
      console.warn(`No matching state found for: "${stateName}"`);
      return;
    }

    if (!stateFeature.geometry || !stateFeature.geometry.coordinates.length) {
      console.warn(`Invalid geometry for state: "${stateName}"`);
      return;
    }
    const stateLayer = L?.geoJSON(stateFeature);
    const bounds = stateLayer?.getBounds();

    // requestAnimationFrame(() => {
    //   map.fitBounds(bounds, {
    //     padding: [20, 20],
    //     maxZoom: 6,
    //   });
    // });
    setTimeout(() => {
      map?.invalidateSize(true);

      map?.fitBounds(bounds, {
        padding: [20, 20],
        // maxZoom: 6,
        maxZoom: 6,
      });
    }, 100);

  } catch (error) {
    console.error("Error zooming into state:", error);
  }
};

// export const zoomIntoCity = (stateName, map) => {
//   try {
//     if (!map) {
//       console.warn("Map instance is not available");
//       return;
//     }

//     const stateFeature = indiaData?.features?.find(
//       f => f?.properties?.st_nm?.toLowerCase() == stateName.toLowerCase()
//     );

//     if (!stateFeature) {
//       console.warn(`No matching state found for: "${stateName}"`);
//       return;
//     }

//     if (!stateFeature.geometry || !stateFeature.geometry.coordinates.length) {
//       console.warn(`Invalid geometry for state: "${stateName}"`);
//       return;
//     }
//     const stateLayer = L?.geoJSON(stateFeature);
//     const bounds = stateLayer?.getBounds();

//     // requestAnimationFrame(() => {
//     //   map.fitBounds(bounds, {
//     //     padding: [20, 20],
//     //     maxZoom: 6,
//     //   });
//     // });
//     setTimeout(() => {
//       map?.invalidateSize(true);

//       map?.fitBounds(bounds, {
//         padding: [20, 20],
//         // maxZoom: 6,
//         maxZoom: 6,
//       });
//     }, 100);

//   } catch (error) {
//     console.error("Error zooming into state:", error);
//   }
// };
export const zoomIntoCity = (listOfPincode, map) => {
  try {
    if (!map) {
      console.warn("Map instance is not available");
      return;
    }

    const cityCoords=listOfPincode?.map(i=>([i?.lat,i?.lng]))
    const bounds = L.latLngBounds(cityCoords);
    setTimeout(() => {
      map?.invalidateSize(true);

      map?.fitBounds(bounds, {
        padding: [50, 50],
        // maxZoom: 6,
        maxZoom: 18,
      });
    }, 100);

  } catch (error) {
    console.error("Error zooming into state:", error);
  }
};
export const zoomIntoPincode = (listOfDarkStore, map) => {
  try {
    if (!map) {
      console.warn("Map instance is not available");
      return;
    }

    const cityCoords=listOfDarkStore?.map(i=>([i?.lat,i?.lng]))
    const bounds = L.latLngBounds(cityCoords);
    setTimeout(() => {
      map?.invalidateSize(true);

      map?.fitBounds(bounds, {
        padding: [50, 50],
        // maxZoom: 6,
        maxZoom: 14,
      });
    }, 100);

  } catch (error) {
    console.error("Error zooming into state:", error);
  }
};

