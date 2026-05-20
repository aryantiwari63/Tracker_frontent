/* eslint-disable */
// RegionMarkers.js
import { Marker } from "react-leaflet";
import { useMemo, useState } from "react";
import L from "leaflet";
import CustomTooltip from "./CustomTooltip"; // Assuming you have a CustomTooltip component

let initRegionCenters = {
  "North Zone": { lat: 25.90, lng: 80.9462 },
  "South Zone": { lat: 11.33, lng: 79.50 },
  "East Zone": { lat: 22.5, lng: 87 },
  "West Zone": { lat: 22, lng: 72 },
};


export default function RegionMarkers({activefromTable, Country, filters, metrics, onRegionClick, darkStoreLocationData ,locationSteps}) {
  // console.log('darkStoreLocationDataaaaaa',darkStoreLocationData)
  const [activeRegion, setActiveRegion] = useState(null);
  const handleMarkerClick = (region) => {
    // console.log('region',region,activeRegion)
    if (activeRegion != region)
      setActiveRegion((prev) => (prev === region ? null : region));
  };
  const regionCenters=useMemo(()=>{ 
    if (Country != "India") {
    const _data = {};
    filters?.locationPincode?.forEach(i => {
      if (!_data[i?.region ? i?.region + " Zone" : ""]) {
        _data[i?.region ? i?.region + " Zone" : ""] = { name: (i?.region ? i?.region + " Zone" : ""), lat: (i?.latitude ?? ""), lng: (i?.longitude ?? "") }
      }

    });
    initRegionCenters = {};
    Object.values(_data).forEach(i => {
      if (i?.name) {
        initRegionCenters[i?.name] = { lat: i?.lat, lng: i?.lng }
      }
    });

    return initRegionCenters;
  }else{
    return initRegionCenters;
  }
  },[filters,locationSteps]);
  

  return (
    <>
      {Object.entries(regionCenters).map(([region, coords], index) => {
        const regionItem = darkStoreLocationData?.data
          ?.filter(regionItem => regionItem.location === region || regionItem.region === region || `${regionItem.region} Zone` === region);
        if (!regionItem?.length) {
          return null;
        }
        const dotIcon = new L.DivIcon({
          html: `
            <div style="display: flex; align-items: center;">
              <div style="width: 10px; height: 10px; background: #fff; border-radius: 50%; border: 2px solid white;"></div>
              <div style="margin-left: 6px; font-size: 14px; color: black;">${region}</div>
            </div>
          `,
          className: "",
          iconSize: [100, 20],
          iconAnchor: [50, 40],
        });

        return (
          <Marker
            key={region}
            position={[coords.lat, coords.lng]}
            icon={dotIcon}
            eventHandlers={{
              click: () => onRegionClick(region),
              mouseover: () => handleMarkerClick(region),
              mouseout: () => setActiveRegion(null)
            }}
          >
            {/* {activeRegion === region && (

              <CustomTooltip
                stateName={region}
                osa={"85%"}
                oos={"220 Hours"}
                marketShare={'62%'}
                direction="top"
                offset={[-20, -33]}
              />
            )} */}

            {(activeRegion === region ||activefromTable?.replace(" Zone", "") == region?.replace(" Zone", "")) && (
              <CustomTooltip
                key={index}
                stateName={regionItem?.[0]?.region}
                metrics={metrics}
                metricsData={regionItem?.[0]}
                osa={JSON.stringify(regionItem)}
                // oos={"220 Hours"}
                marketShare={"N/A"}
                direction="top"
                offset={[-20, -33]}
              />
            )}


          </Marker>
        );
      })}
    </>
  );
}