"use client";
import React, { useEffect } from "react";
import { useMap } from "react-leaflet";

// CSS
import "leaflet/dist/leaflet.css";
import "leaflet.fullscreen/Control.FullScreen.css";

// JS plugin - this adds `L.Control.Fullscreen` to Leaflet
import "leaflet";
import "leaflet.fullscreen";

export default function MapZoomControls() {
    const map = useMap();

    useEffect(() => {
        if (!map) return;
        // Only add control if it's available and not already added
        if (window?.L && window?.L?.Control && window?.L?.Control?.Fullscreen) {
            const fullscreenControl = new window.L.Control.Fullscreen();
            map?.addControl(fullscreenControl);
            console.log("Fullscreen control added");
        } else {
            console.warn("Fullscreen plugin not available");
        }
    }, [map]);

    return (
        <div className="absolute right-[5%] bottom-[6%] z-[1000]">
            <div className="top-10 left-4 flex flex-col gap-2 ">
                <button
                    className="bg-white p-2 rounded shadow hover:bg-gray-100 border border-[#9e9d9d]"
                    onClick={() => map?.zoomIn()}
                >
                    ＋
                </button>
                <button
                    className="bg-white p-2 rounded shadow hover:bg-gray-100 border border-[#9e9d9d]"
                    onClick={() => map?.zoomOut()}
                >
                    －
                </button>
                <button
                    className="bg-white p-2 rounded shadow hover:bg-gray-100 border border-[#9e9d9d]"
                    onClick={() => {
                        if (typeof map.toggleFullscreen === "function") {
                            map?.toggleFullscreen();
                        } else {
                            console.warn("Fullscreen function not available on map");
                        }
                    }}
                >
                    <img src="/assets/images/expand.svg" alt="Fullscreen" width={20} height={20} />
                </button>
            </div>
        </div>
    );
}
