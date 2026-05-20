/* eslint-disable */
import { Marker } from "react-leaflet";
import { useMemo, useState } from "react";
import L from "leaflet";
import CustomTooltip from "./CustomTooltip";
import "./ripple.css"; // add the CSS below

export default function CountryMarkers({
  handle_active_client_project_change,
  kpiData = {},
  currentCountries = [],
  activeFromTable = "",
  metrics = {},
}) {
  const [activeRegion, setActiveRegion] = useState(null);

  const countryCenters = useMemo(() => {
    const data = {};
    currentCountries.forEach((c) => {
      const lat = c?.project?.mapCenter?.[0];
      const lng = c?.project?.mapCenter?.[1];
      const name = c?.project?.country;

      if (name && lat && lng) {
        data[name] = {
          name,
          lat,
          lng,
          data: c.data || [],
          metrics: c?.metrics,
          project: c?.project,
        };
      }
    });
    return data;
  }, [currentCountries]);

  const handleMarkerHover = (name) => setActiveRegion(name);
  const handleMarkerLeave = () => setActiveRegion(null);

  return (
    <>
      {Object.entries(countryCenters).map(([name, country], index) => {
        // const rippleIcon = new L.DivIcon({
        //   html: `<div class="ripple-marker"></div>`,
        //   className: "",
        //   iconSize: [20, 20],
        //   iconAnchor: [0, 0], // center the marker
        // });
        const rippleIcon = new L.DivIcon({
          html: `
            <div class="ripple-marker">
              <div class="dot"></div>
              <div class="ripple"></div>
            </div>
          `,
          className: "",
          iconSize: [30, 30],
          iconAnchor: [15, 15], // center of the icon
        });

        return (
          <Marker
            key={name}
            position={[country.lat, country.lng]}
            icon={rippleIcon}
            eventHandlers={{
              mouseover: () => handleMarkerHover(name),
              mouseout: handleMarkerLeave,
            }}
          >
            {(activeRegion === name || activeFromTable === name) && (
              <CustomTooltip
                handle_active_client_project_change={handle_active_client_project_change}
                project={country?.project}
                key={index}
                stateName={name}
                metrics={country?.metrics?.map((i) => ({
                  value: i?.key,
                  title: i?.lable ?? i?.label,
                }))}
                metricsData={kpiData?.[name?.toLowerCase()] || {}}
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
