"use client";

import { MdOutlineDragIndicator } from "react-icons/md";
import PlatformChartComponent from "../PlatformChartComponent";
import RatingDistributionExample from "../RatingDistribution";

import { useEffect, useState } from "react";
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEbuxContext } from "../../Context/EbuxProvider";

function SortableItem({is_brand, id }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: transform ? 999 : "auto",
    position: "relative",
    display: "flex",
    flex: id === "PlatformChartComponent" ? "3" : "2", // 60% vs. 40%
    minWidth: id === "PlatformChartComponent" ? "60%" : "35%", // Ensure correct proportions
  };

  const getComponent = (ComponentName) => {
    switch (ComponentName) {
      case "PlatformChartComponent":
        return <PlatformChartComponent is_brand={is_brand} listeners={listeners} attributes={attributes} />;

      case "RatingDistributionExample":
        return <RatingDistributionExample is_brand={is_brand} listeners={listeners} attributes={attributes} />;
      default:
        return <></>;
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="sortable-item">
      {getComponent(id)}
    </div>
  );
}

export default function DetailsAnalysis({is_brand, listeners, attributes }) {
  const {
    activeClientProject
            
        } = useEbuxContext();
  const [platform, setPlatform] = useState([]);

  useEffect(() => {
    setPlatform([
      { value: "PlatformChartComponent", position: 1 },
      { value: "RatingDistributionExample", position: 2 },
    ]);
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active?.id !== over?.id) {
      setPlatform((prevPlatforms) => {
        const oldIndex = prevPlatforms.findIndex((item) => item.value === active.id);
        const newIndex = prevPlatforms.findIndex((item) => item.value === over.id);
        return arrayMove(prevPlatforms, oldIndex, newIndex);
      });
    }
  };

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor)
  );
const [open,setOpen]=useState(true);
  return (
    <div className="w-full border-2 mb-4">
      <div className="sectionIconHead">
        <div className="flex gap-2 items-center">
          <MdOutlineDragIndicator {...listeners} {...attributes} />
          {/* <div className="sectionIcon">
            <img src="/assets/images/comprehensiveIcon.svg" width={14} height={14} alt="Icon" />
          </div> */}
          {([2,101,103].indexOf(activeClientProject?.client_project_id)>-1||activeClientProject?.useNewRRView)&&
          (<h4 className="flex gap-2 flex-row">
            {is_brand ? `${activeClientProject?.client_project_name} Analysis` : "Competition Analysis"}
          </h4>)} 
        </div>
        <button
          type="button"
          onClick={() => {
            setOpen(!open);
          }}
          className={`graphIconBtn ${open ? 'arrowRotate' : ''}`}
        >
          <img src="/assets/images/toggleDown.svg" width={20} height={20} />
        </button>
      </div>
{open&&(
  <>
      {/* Draggable sortable items */}
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext items={platform.map((item) => item.value)}>
          <div className="flex gap-6 flex-wrap mt-2 p-4">
            {platform.map((item) => (
              <SortableItem is_brand={is_brand} key={item.value} id={item.value} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      </>
)}
      
    </div>
  );
}
