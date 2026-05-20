import { Marker } from "react-leaflet";
import L from "leaflet";
import React, { useState } from "react";
import { handleCityClick } from "./Handlers";
import CustomTooltip from "./CustomTooltip";

export default function CityMarkers({ cities }) {
  const [activeCity, setActiveCity] = useState(null);

  return (
    <>
      {cities.map((city) => {
        const dotIcon = new L.DivIcon({
          html: `<div style="display: flex; align-items: center;">
                    <div style="width: 10px; height: 10px; background: #fff; border-radius: 50%; border: 2px solid black;"></div>
                    <div style="margin-left: 6px; font-size: 14px; color: black;">${city.name}</div>
                </div>`,
          className: "",
          iconSize: [100, 20],
          iconAnchor: [10, 10],
        });

        return (
          <Marker
            key={city.name}
            position={[city.lat, city.lng]}
            icon={dotIcon}
            eventHandlers={{
              click: () => {
                handleCityClick(city);
                setActiveCity((prev) => (prev === city.name ? null : city.name));
              },
            }}
          >
            {activeCity === city.name && (
              <CustomTooltip
              stateName={city.name}
              osa={"85%"}
              oos={"220 Hours"}
              marketShare={'62%'}
              direction="top"
              offset={[0, 0]}
            />
  
            )}
          </Marker>
        );
      })}
    </>
  );
}