import React, { useEffect, useState } from "react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { Popup, Tooltip, useMap } from "react-leaflet";
import { useEbuxContext } from "../../../Context/EbuxProvider";

const CustomTooltip = ({ handle_active_client_project_change,project,address = null, stateName, osa, oos, marketShare,
  // direction = "top",
  offset = [0, 0],
  type="Tooltip",metrics=[],metricsData={}
}) => {

    const {
      // kpi, 
      // kpiMap,
      selectedFilters
      // , filters
    } = useEbuxContext();

  const map = useMap();
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!map) return;
    map.whenReady(() => {
      setMapReady(true);
    });
  }, [map]);

  if (!mapReady ) return null;
  const getHeaderIcon = (icon) => {
                          switch (icon) {
                              case "rupee":
                                  return "₹ ";
                              default:
                                  return (icon)?icon+" ":"";
                          }
                      }
                      const showValue = (col, value) => {
                          return <>{value != undefined && col?.icon ? getHeaderIcon(col?.icon) : ""}{value}{value != undefined && col?.subValue ? col?.subValue : ""}{value != undefined && col?.persentageValue ? "%" : ""}</>
                  
                      }
                      const renderCell = (col, metric) => (
                          <div className="flex py-1 gap-2 items-center ">
                            <span className={`font-medium ${selectedFilters?.selectedDateRange?.isCompareToPrevious?"w-[40%]":"w-[70%]"}`}>{col?.title}:</span>
                            <div className={`${selectedFilters?.selectedDateRange?.isCompareToPrevious?"w-[60%]":"w-[30%]"} items-center text-left`}>
                            <span className={` ${selectedFilters?.selectedDateRange?.isCompareToPrevious?"grid grid-cols-3":"flex"} gap-0`}>
                            

                              {
                                  (metric?.value||( metric?.value != undefined &&(col?.value=="osa" || col?.value == "price_variation") )) ?
                                      <span className="font-medium">{showValue(col, metric?.value)}{col?.value == "RR" ? "" : "%"}</span>
                                      : <>-</>
                              }
                              {
                                 selectedFilters?.selectedDateRange?.isCompareToPrevious&& metric?.value && metric?.reference ?
                                      (<span className="text-gray-400 text-xs">{showValue(col, metric?.reference)}{col?.value == "RR" ? "" : "%"}</span>)
                                      :
                                      (<></>)
                              }
                  
                              {selectedFilters?.selectedDateRange?.isCompareToPrevious&&metric?.value && metric?.reference && metric?.delta ?
                                  metric?.delta >= 0 ? (
                                      <span className="text-[#329900] flex items-center gap-1 text-xs px-1 py-0.5 border border-[#B7EB8F] bg-[#E8FFEB] rounded-full">
                                          <IoMdArrowDropup size={14} /> {showValue(col, Math.abs(metric?.delta))}{col?.value == "RR" ? "" : "%"}
                                      </span>
                                  ) : (
                                      <span className="text-[#DD4242] flex items-center gap-1 text-xs px-1 py-0.5 border bg-[#FFF1F0] border-[#FFA39E] rounded-full">
                                          <IoMdArrowDropdown size={14} /> {showValue(col, Math.abs(metric?.delta))}{col?.value == "RR" ? "" : "%"}
                                      </span>
                                  ) :
                                  <></>
                              }
                              </span>
                          </div>
                          </div>
                      );

  return(
  <>
  {type=="Popup"?
<Popup><div
      style={{
        zIndex: 9999,
        background: "#0A0A32",
        color: "#fff",
        padding: "2px 2px",
        borderRadius: "8px",
        fontSize: "13px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        lineHeight: "1.6",
        position: "relative",
        maxHeight: "350px",
        maxWidth: "350px",
        width: "350px",
        overflowY: "auto",
        overflowX: "hidden",
        wordBreak: "break-word",
        overflowWrap: "break-word",
        whiteSpace: "normal"
      }}
    >
      <div
        style={{
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          marginBottom: "2px",
          wordBreak: "break-word",
          overflowWrap: "break-word",
          whiteSpace: "normal",
          flexWrap: "wrap"
        }}
      >
        <span style={{ marginRight: "6px" }}>
          <img src="/assets/images/locationIcon.svg" width={18} height={18} className="tabIcon" />
        </span>
        {stateName}
      </div>

      {metrics?.filter(i => i?.checked)?.map((m,idx)=>{
        if(m?.title&&metricsData?.[m?.value]){
          return <div key={idx}>{m?.title}: {metricsData?.[m?.value]}</div>
        }
      })}
      <div>OSA: {osa}</div>
      {oos && <div>OOS: {oos}</div>}
      <div>Market Share: {marketShare}</div>
    </div></Popup>
:
  <Tooltip  offset={offset} opacity={1} interactive permanent>
    {/* direction={direction} */}
    {/* <div
      style={{
        background: "#0A0A32",
        color: "#fff",
        padding: "8px 12px",
        borderRadius: "8px",
        fontSize: "13px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        lineHeight: "1.6",
        position: "relative",
        
      }}
    >
      <div
        style={{
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          marginBottom: "6px",
          wordBreak: "break-all",
          overflowWrap: "break-word"
        }}
      >
        <span style={{ marginRight: "6px" }}>
          <img src="/assets/images/locationIcon.svg" width={18} height={18} className="tabIcon" />
        </span> {stateName}
      </div>

      {address?<div style={{
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          marginBottom: "6px",
          wordBreak: "break-all",
          overflowWrap: "break-word"
        }} >{address}</div>:<></>}
      <div>OSA: {osa}</div>
      {
        oos? <div>OOS: {oos}</div> : null
      }
      <div>Market Share: {marketShare}</div>
    </div> */}
    <div 
      style={{
        zIndex: 9999,
        background: "#0A0A32",
        color: "#fff",
        padding: "8px 12px",
        borderRadius: "8px",
        fontSize: "13px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        lineHeight: "1.6",
        position: "relative",
        maxHeight: selectedFilters?.selectedDateRange?.isCompareToPrevious?"400px":"300px",
        maxWidth: selectedFilters?.selectedDateRange?.isCompareToPrevious?"400px":"300px",
        width: selectedFilters?.selectedDateRange?.isCompareToPrevious?"400px":"300px",
        overflowY: "auto",
        overflowX: "hidden",
        wordBreak: "break-word",
        overflowWrap: "break-word",
        whiteSpace: "normal"
      }}
      onClick={()=>{handle_active_client_project_change(project)}}
    >
      <div
        style={{
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          marginBottom: "6px",
          wordBreak: "break-word",
          overflowWrap: "break-word",
          whiteSpace: "normal",
          flexWrap: "wrap"
        }} 
      >
        <span style={{ marginRight: "6px" }}>
          {/* <img src="/assets/images/locationIcon.svg" width={18} height={18} className="tabIcon text-white" /> */}
          <i className="fa fa-solid fa-map-marker-alt text-[16px]"></i>
        </span>
        {stateName}
      </div>

      {address && (
        <div
          style={{
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            marginBottom: "6px",
            wordBreak: "break-word",
            overflowWrap: "break-word",
            whiteSpace: "normal",
            flexWrap: "wrap"
          }}
        >
          {address}
        </div>
      )}
      {metrics?.map((m,idx)=>{
        if(m?.title&&metricsData?.[m?.value]){
          return <div key={idx}>{renderCell(m,metricsData?.[m?.value])}</div>
        }
      })}
    </div>
  </Tooltip>
    }
    </>);
};

export default CustomTooltip;
