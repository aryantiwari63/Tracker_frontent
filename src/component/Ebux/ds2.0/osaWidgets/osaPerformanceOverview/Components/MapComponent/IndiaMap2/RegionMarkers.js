// RegionMarkers.js
import { Marker } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";
import CustomTooltip from "./CustomTooltip"; // Assuming you have a CustomTooltip component

const regionCenters = {
  North: { lat: 25.90, lng: 80.9462 },
  South: { lat: 11.33, lng: 79.50 },
  East: { lat: 22.5, lng: 87 },
  West: { lat: 22, lng: 72 },
};


export default function RegionMarkers() {
  const [activeRegion, setActiveRegion] = useState(null);
  const handleMarkerClick = (region) => {
    setActiveRegion((prev) => (prev === region ? null : region));
  };

  return (
    <>
      {Object.entries(regionCenters).map(([region, coords]) => {
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
              click: () => handleMarkerClick(region),
            }}
          >
            {activeRegion === region && (

              <CustomTooltip
                stateName={region}
                osa={"85%"}
                oos={"220 Hours"}
                marketShare={'62%'}
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