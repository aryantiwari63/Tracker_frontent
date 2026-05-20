"use client";

import { MdOutlineDragIndicator } from "react-icons/md";
import ReviewDistribution from "../ReviewDistribution";
import SentimentAnalysis from "../SentimentAnalysis";

import { useEffect, useState } from "react";
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableItem({ id }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: transform ? 999 : "auto",
    position: "relative",
    display: "flex", // Maintain horizontal alignment
    flex: id === "SentimentAnalysis" ? "3" : "2", // 60% vs. 40%
    minWidth: id === "SentimentAnalysis" ? "65%" : "30%", // Ensure correct proportions
  };

  const getComponent = (ComponentName) => {
    switch (ComponentName) {
      case "ReviewDistribution":
        return <ReviewDistribution listeners={listeners} attributes={attributes} />;
      case "SentimentAnalysis":
        return <SentimentAnalysis listeners={listeners} attributes={attributes} />;
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

export default function DetailsAnalysis({ listeners, attributes }) {
  const [platform, setPlatform] = useState();

  useEffect(() => {
    setPlatform([
      { value: "ReviewDistribution", position: 1 },
      { value: "SentimentAnalysis", position: 2 },
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

  return (
    <div className="w-full border-2 mt-4">
      <div className="sectionIconHead">
        <div className="flex gap-2 items-center">
          <MdOutlineDragIndicator {...listeners} {...attributes} />
          {/* <div className="sectionIcon">
            <img src="/assets/images/comprehensiveIcon.svg" width={14} height={14} alt="Icon" />
          </div> */}
          {/* <h4 className="flex gap-2 flex-row">Sentiment Analysis</h4> */}
        </div>
      </div>

      {/* Draggable sortable items */}
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext items={(Array.isArray(platform) ? platform : []).map((item) => item.value)}>
          <div className="flex gap-4 flex-wrap mt-2 p-2">
            {(Array.isArray(platform) ? platform : []).map((item) => (
              <SortableItem key={item.value} id={item.value} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
