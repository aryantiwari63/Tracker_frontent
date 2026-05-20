
import { Circle, Marker,LayerGroup } from "react-leaflet";
import L from "leaflet";
import React from "react";
// import { handleCityClick } from "./Handlers";
import CustomTooltip from "./CustomTooltip";
import 'leaflet/dist/leaflet.css';

export default function StoreMarkers({activeStore,setActiveStore,darkStoreLocationData }) {
  

  return (
    <>
      {darkStoreLocationData?.data?.map((item,index) => {
        const pf_name=item?.pf_data?.[0]?.pf_name ?? null;
        if (!item?.lat || !item?.lng) {
          // console.log("City not found:", item?.location);
          return <></>;
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
  //       const squareIcon = new L.DivIcon({
  //         className: '',
  //         html: `<div style="display: flex;">
  //                 <div style="width: 10px; height: 10px; 
  // border-radius: 4px;
  // background-color: #f7881f;"></div>
                  
  //             </div>`,
  //         iconSize: [20, 20],
  //         iconAnchor: [10, 10],
  //       });
        const dotIcon = new L.DivIcon({
          html: `<div style="display: flex; align-items: center;">
                    <div style="width: 10px; height: 10px; background: #fff; border-radius: 50%; border: 2px solid black;"></div>
                    
                </div>`,
          //  <div style="margin-left: 6px; font-size: 14px; color: black;">${item?.location}</div>
          className: "",
          iconSize: [100, 20],
          iconAnchor: [10, 10],
        });
        const getTooltip=(store)=>{
          if(activeStore === store?.location_key){
            
            let allPf = store?.pf_data?.find((pf) => pf.pf_name === "All");
            if(!allPf){
              allPf = store?.pf_data?.[0];
            }
            return (<CustomTooltip
              // type={"Popup"}
              stateName={`Store : ${store?.location_key}`}
              address={store?.location}
              osa={allPf?.osa !== undefined ? `${(allPf.osa).toFixed(2)}%` : "N/A"}
              // oos={"220 Hours"}
              marketShare={allPf?.ms !== undefined ? `${(allPf.ms).toFixed(2)}%` : "N/A"}
              direction="top"
              offset={[0, -40]}
            />  )
          } 
          return <></>;
          
        }
        if(pf_name=="Zepto"){

          return (
          //   <Marker 
          // key={item?.location_key ?? `${item?.location} - ${index}`}
          //   eventHandlers={{
          //     click: () => {
          //       // handleCityClick(item);
          //       setActiveStore((prev) => (prev === item?.location_key ? null : item?.location_key));
          //     },
              
          //     mouseover: () =>setActiveStore(item?.location_key),
          //     mouseout:()=>setActiveStore(null)
          //   }}
          // position={[item?.lat, item?.lng]}  >

          // <LayerGroup  >
          // <Circle
          //   center={[item?.lat, item?.lng]}
          //   pathOptions={{ fillColor: 'red' }}
          //   radius={300}
          // />
          // <Circle
          //   center={[item?.lat, item?.lng]}
          //   pathOptions={{ fillColor: '#3b0069' }}
          //   radius={150}
          //   stroke={false}
          // />
          // </LayerGroup>
          
          // { getTooltip(item)}
          // </Marker>
          <LayerGroup key={item?.location_key ?? `${item?.location} - ${index}`}>
  <Circle
    center={[item?.lat, item?.lng]}
    pathOptions={{ color: '#3b0069' }}
    radius={300}
    eventHandlers={{
      click: () =>
        setActiveStore((prev) =>
          prev === item?.location_key ? null : item?.location_key
        ),
      mouseover: () => setActiveStore(item?.location_key),
      mouseout: () => setActiveStore(null),
    }}
  >
  <Circle
    center={[item?.lat, item?.lng]}
    pathOptions={{ fillColor: '#3b0069' }}
    radius={150}
    stroke={false}
    eventHandlers={{
      click: () =>
        setActiveStore((prev) =>
          prev === item?.location_key ? null : item?.location_key
        ),
      mouseover: () => setActiveStore(item?.location_key),
      mouseout: () => setActiveStore(null),
    }}
  >

    {getTooltip(item)}
    </Circle>
    </Circle>
</LayerGroup>

            
          );
        }else if(pf_name=="Swiggy Instamart"){
          
          return (
            <LayerGroup key={item?.location_key ?? `${item?.location} - ${index}`}>
            <Circle
              center={[item?.lat, item?.lng]}
              pathOptions={{ color: '#f7881f' }}
              radius={300}
              eventHandlers={{
                click: () =>
                  setActiveStore((prev) =>
                    prev === item?.location_key ? null : item?.location_key
                  ),
                mouseover: () => setActiveStore(item?.location_key),
                mouseout: () => setActiveStore(null),
              }}
            >
          {/* <Marker 
          key={item?.location_key ?? `${item?.location} - ${index}`}
            eventHandlers={{
              click: () => {
                // handleCityClick(item);
                setActiveStore((prev) => (prev === item?.location_key ? null : item?.location_key));
              },
              
              mouseover: () =>setActiveStore(item?.location_key),
              mouseout:()=>setActiveStore(null)
            }}
          position={[item?.lat, item?.lng]} icon={squareIcon} > */}
          
          { getTooltip(item)}
          {/* </Marker> */}
          
    </Circle>
    </LayerGroup>
          
          );
        }else if(pf_name=="Blinkit"){
          
          return (
          <Marker 
          key={item?.location_key ?? `${item?.location} - ${index}`}
          eventHandlers={{
            click: () => {
              // handleCityClick(item);
              setActiveStore((prev) => (prev === item?.location_key ? null : item?.location_key));
            },
            
            mouseover: () =>setActiveStore(item?.location_key),
            mouseout:()=>setActiveStore(null)
          }} 
          position={[item?.lat, item?.lng]} 
          icon={triangleIcon} >
          
          { getTooltip(item)}
          </Marker>
          
          );
        }else{
          return (
            <Marker
              key={item?.location_key ?? `${item?.location} - ${index}`}
              position={[item?.lat, item?.lng]}
              icon={dotIcon}
              eventHandlers={{
                click: () => {
                  // handleCityClick(item);
                  setActiveStore((prev) => (prev === item?.location_key ? null : item?.location_key));
                },
                
                mouseover: () =>setActiveStore(item?.location_key),
                mouseout:()=>setActiveStore(null)
              }}
            >
              { getTooltip(item)}
            </Marker>
          );
        }
      })}
    </>
  );
}
