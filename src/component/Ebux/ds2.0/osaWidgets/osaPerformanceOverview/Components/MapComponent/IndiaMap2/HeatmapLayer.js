import { useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
// import "leaflet.heat";

export function HeatmapLayer({ points }) {
    console.log('pointspoints',points)
  const map = useMap();

  useEffect(() => {
    if (!map || !points.length) return;

    const heatLayer = L.heatLayer(points, {
      radius: 25, 
      blur: 15,
      maxZoom: 12,
      gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' },
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}
