/* eslint-disable */
import { Marker } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";
import { stateLabelCoordinates } from "./Constant";
import CustomTooltip from "./CustomTooltip";

// export default function StateLabels({ states, onClick }) {
  export default function StateLabels({ 
    activefromTable,
    metrics,
    // states,
    onStateClick,
    darkStoreLocationData, onClick }) {
  const [activeState, setActiveState] = useState(null);

  const handleMarkerClick = (stateName) => {
    if(activeState!=stateName){
      setActiveState((prev) => (prev === stateName ? null : stateName));
      if (onClick && typeof onClick === 'function') {
        onClick(stateName);
      }      
    }
  };

  return (
    <>
      {darkStoreLocationData?.data?.map((item) => {
        const stateName = item.state;
        // const my_data=darkStoreLocationData?.data?.find((item) => item.state === stateName);
        const coords = stateLabelCoordinates[stateName];
        if (!coords){
          // console.log('coords not fount for state',stateName);
          
          return null;
        } 

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
        const getTooltip=(stateName)=>{
          if(activeState === stateName||activefromTable == stateName){
            
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
            key={stateName}
            position={coords}
            icon={dotIcon}
            eventHandlers={{

              click: () =>onStateClick(stateName) ,
              mouseover: () =>handleMarkerClick(stateName),
              mouseout:()=>setActiveState(null)
              // click: () => onStateClick(stateName),
            }}
          >
            {getTooltip(stateName)}
          </Marker>
        );
      })}
    </>
  );
}
