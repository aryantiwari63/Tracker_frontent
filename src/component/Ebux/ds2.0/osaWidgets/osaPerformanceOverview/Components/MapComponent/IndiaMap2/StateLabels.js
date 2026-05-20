import { Marker } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";
import { stateLabelCoordinates } from "./Constant";
import CustomTooltip from "./CustomTooltip";

export default function StateLabels({ states, onClick }) {
  const [activeState, setActiveState] = useState(null);

  const handleMarkerClick = (stateName) => {
    setActiveState((prev) => (prev === stateName ? null : stateName));
    if (onClick && typeof onClick === 'function') {
      onClick(stateName);
    }
  };

  return (
    <>
      {states.map((stateName) => {
        const coords = stateLabelCoordinates[stateName];
        if (!coords) return null;

        const dotIcon = new L.DivIcon({
          html: `
            <div style="display: flex; align-items: center;">
              <div style="width: 10px; height: 10px; background: #fff; border-radius: 50%; border: 2px solid black;"></div>
              <div style="margin-left: 6px; font-size: 14px; color: black;">${stateName}</div>
              
            </div>
          `,
          className: "",
          iconSize: [100, 20],
          iconAnchor: [10, 10],
        });

        return (
          <Marker
            key={stateName}
            position={coords}
            icon={dotIcon}
            eventHandlers={{
              click: () => handleMarkerClick(stateName),
            }}
          >
            {activeState === stateName && (

              <CustomTooltip
                stateName={stateName}
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