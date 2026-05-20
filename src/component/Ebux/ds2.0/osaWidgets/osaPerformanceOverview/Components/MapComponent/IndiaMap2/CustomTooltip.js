import React, { useEffect, useState } from "react";
import { Popup, Tooltip, useMap } from "react-leaflet";

const CustomTooltip = ({ address = null, stateName, osa, oos, marketShare,
  // direction = "top",
  offset = [0, 0],
  type="Tooltip"
}) => {

  const map = useMap();
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!map) return;
    map.whenReady(() => {
      setMapReady(true);
    });
  }, [map]);

  if (!mapReady ) return null;

  return(
  <>
  {type=="Popup"?
<Popup><div
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
        maxHeight: "250px",
        maxWidth: "250px",
        width: "250px",
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
          marginBottom: "6px",
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
        maxHeight: "250px",
        maxWidth: "250px",
        width: "250px",
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
          marginBottom: "6px",
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

      <div>OSA: {osa}</div>
      {oos && <div>OOS: {oos}</div>}
      <div>Market Share: {marketShare}</div>
    </div>
  </Tooltip>
    }
    </>);
};

export default CustomTooltip;
