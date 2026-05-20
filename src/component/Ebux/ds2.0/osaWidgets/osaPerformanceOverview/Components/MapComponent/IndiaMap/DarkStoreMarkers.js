/* eslint-disable */
// import { Marker } from "react-leaflet";
import { Circle, Marker, LayerGroup } from "react-leaflet";

import L from "leaflet";
import React, { useState } from "react";
// import { handleCityClick } from "./Handlers";
import CustomTooltip from "./CustomTooltip";

export default function DarkStoreMarkers({ activefromTable, metrics, darkStoreLocationData, darkStoreList, updateLocationSteps }) {
  const [activeDarkStore, setActiveDarkStore] = useState(null);

  return (
    <>
      {darkStoreLocationData?.data?.map((item, index) => {

        const city = darkStoreList?.find((dark_store) => dark_store.name == item.dark_store);
        if (!city) {
          return null;
        }

        const triangleIcon = new L.DivIcon({
          html: `<div style="display: flex;"> <div style="width: 0;
          height: 0;
          background: none;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: 10px solid #ffe23f;
          box-shadow: none;"></div> </div>`,

          iconSize: [0, 0],
          iconAnchor: [5, 5],
        });

        const pf_name = item?.platform_data?.[0]?.platform ?? null;
        const dotIcon = new L.DivIcon({
          html: `<div style="display: flex; align-items: center;">
                    <div style="width: 10px; height: 10px; background: #fff; border-radius: 50%; border: 2px solid black;"></div>
                    <div style="margin-left: 6px; font-size: 14px; color: black;">${city.name}</div>
                </div>`,
          className: "",
          iconSize: [100, 20],
          iconAnchor: [10, 10],
        });
        const getTooltip = (stateName) => {
          if (activeDarkStore == stateName || activefromTable == stateName) {

            let allPf = item?.pf_data?.find((pf) => pf.pf_name === "All");
            if (!allPf) {
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
            />)
          }
          return <></>;

        }

        if (pf_name == "Zepto") {

          return (
            <LayerGroup key={`${city?.name} - ${index}`}>
              <Circle
                center={[city.lat, city.lng]}
                pathOptions={{ color: '#3b0069' }}
                radius={200}
                eventHandlers={{
                  
                        mouseover: () =>setActiveDarkStore(item.dark_store),
                        mouseout:()=>setActiveDarkStore(null)
                }}
              >
                <Circle
                  center={[city.lat, city.lng]}
                  pathOptions={{ fillColor: '#3b0069' }}
                  radius={100}
                  stroke={false}
                  eventHandlers={{

                    mouseover: () => setActiveDarkStore(item.dark_store),
                    mouseout: () => setActiveDarkStore(null)
                  }}
                >

                  {getTooltip(city.name)}
                </Circle>
              </Circle>
            </LayerGroup>


          );
        } else if (pf_name == "Swiggy Instamart") {

          return (
            <LayerGroup key={`${city?.name} - ${index}`}>
              <Circle
                center={[city.lat, city.lng]}
                pathOptions={{ color: '#f7881f' }}
                radius={200}
                eventHandlers={{

                  mouseover: () => setActiveDarkStore(item.dark_store),
                  mouseout: () => setActiveDarkStore(null)
                }}
              >

                {getTooltip(city.name)}

              </Circle>
            </LayerGroup>

          );
        } else if (pf_name == "Blinkit") {

          return (
            // <Marker
            //   key={`${city?.name} - ${index}`}
            //   eventHandlers={{
            //     mouseover: () => setActiveDarkStore(item.dark_store),
            //     mouseout: () => setActiveDarkStore(null)
            //   }}
            //   position={[city.lat, city.lng]}
            //   icon={triangleIcon} >

            //   {getTooltip(city.name)}
            // </Marker>
            <LayerGroup key={`${city?.name} - ${index}`}>
              <Circle
                center={[city.lat, city.lng]}
                pathOptions={{ color: '#ffe23f' }}
                radius={200}
                eventHandlers={{

                  mouseover: () => setActiveDarkStore(item.dark_store),
                  mouseout: () => setActiveDarkStore(null)
                }}
              >

                {getTooltip(city.name)}

              </Circle>
            </LayerGroup>

          );
        } else {
          
        return (

          <LayerGroup key={`${city?.name} - ${index}`}>
          <Circle
            center={[city.lat, city.lng]}
            pathOptions={{ color: '#1cfa03ff' }}
            radius={200}
            eventHandlers={{


              mouseover: () =>setActiveDarkStore(item.dark_store),
              mouseout:()=>setActiveDarkStore(null)
            }}
          >
          <Circle
            center={[city.lat, city.lng]}
            pathOptions={{ fillColor: '#690200ff' }}
            radius={100}
            stroke={false}
            eventHandlers={{

              mouseover: () =>setActiveDarkStore(item.dark_store),
              mouseout:()=>setActiveDarkStore(null)
            }}
          >
            { getTooltip(city.name)}
            </Circle>
            </Circle>
        </LayerGroup>


                  );
        }
        // return (
        //   <Marker
        //     key={city.name}
        //     position={[city.lat, city.lng]}
        //     icon={dotIcon}
        //     eventHandlers={{
        //       // click: () => {
        //       //   // updateLocationSteps('City', item.location);
        //       //   handleCityClick(city);
        //       //   setActiveDarkStore((prev) => (prev === city.name ? null : city.name));
        //       // },
        //       mouseover: () =>setActiveDarkStore(item.dark_store),
        //       mouseout:()=>setActiveDarkStore(null)
        //     }}
        //   >
        //     { getTooltip(city.name)}
        //   </Marker>
        // );
      })}
    </>
  );
}
