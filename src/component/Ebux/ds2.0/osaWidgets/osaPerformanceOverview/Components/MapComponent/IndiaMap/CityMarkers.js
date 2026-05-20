/* eslint-disable */
import { Marker } from "react-leaflet";
import L from "leaflet";
import React, { useState } from "react";
import { handleCityClick } from "./Handlers";
import CustomTooltip from "./CustomTooltip";

export default function CityMarkers({activefromTable,metrics,darkStoreLocationData, cities,onCityClick }) {
  const [activeCity, setActiveCity] = useState(null);

  return (
    <>
      {darkStoreLocationData?.data?.map((item) => {
        const city=cities?.find((city) => city.name === item.city);
        if (!city) {
          return null;
        }
        const dotIcon = new L.DivIcon({
          html: `<div style="display: flex; align-items: center;">
                    <div style="width: 10px; height: 10px; background: #fff; border-radius: 50%; border: 2px solid black;"></div>
                    <div style="margin-left: 6px; font-size: 14px; color: black;">${city.name}</div>
                </div>`,
          className: "",
          iconSize: [100, 20],
          iconAnchor: [10, 10],
        });
        const getTooltip=(stateName)=>{
          if(activeCity === stateName ||activefromTable == stateName){
            
            let allPf = item?.pf_data?.find((pf) => pf.pf_name === "All");
            if(!allPf){
              allPf = item?.pf_data?.[0];
            }
            return (<CustomTooltip
              stateName={stateName}
          metrics={metrics}
          metricsData={item}
              osa={allPf?.osa !== undefined ? `${(allPf.osa).toFixed(2)}%` : "N/A"}
              // oos={"220 Hours"}
              marketShare={allPf?.ms !== undefined ? `${(allPf.ms).toFixed(2)}%` : "N/A"}
              direction="top"
              offset={[0, 0]}
            />  )
          } 
          return <></>;
          
        }
        return (
          <Marker
            key={city.name}
            position={[city.lat, city.lng]}
            icon={dotIcon}
            eventHandlers={{
              // click: () => {
              //   updateLocationSteps('City', item.city);
              //   handleCityClick(city);
              //   setActiveCity((prev) => (prev === city.name ? null : city.name));
              // },
              
              click: () =>onCityClick(item.city) ,
              mouseover: () =>setActiveCity(item.city),
              mouseout:()=>setActiveCity(null)
            }}
          >
            { getTooltip(city.name)}
          </Marker>
        );
      })}
    </>
  );
}
