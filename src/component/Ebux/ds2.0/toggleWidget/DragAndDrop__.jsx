import { useState } from "react";
import { PALETTE } from "../widgetConstant";
import StaticHeader from "./moc_data/StaticHeader";
import StaticCategoryCard from "./moc_data/StaticCategoryCard";
import StaticCompany from "./moc_data/StaticCompany";
import { useEbuxContext } from "../../Context/EbuxProvider";

const DragAndDrop = ({ dropped, setDropped, savedData, setSavedData }) => {
  console.log("dropped", dropped);
  console.log("savedData", savedData);
  const { kpi } = useEbuxContext();
  const [dragging, setDragging] = useState(null);
  const [isOver, setIsOver] = useState(false);

  // Start dragging from right side
  const handleDragStart = (e, widgetId) => {
    const uid = `${widgetId}-${Date.now()}`;
    e.dataTransfer.setData(
      "application/widget",
      JSON.stringify({ id: widgetId, uid })
    );
    e.dataTransfer.effectAllowed = "copy";
    setDragging(widgetId);
  };

  const handleDragEnd = () => {
    setDragging(null);
    setIsOver(false);
  };

  // Left side drop target
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  // const handleDrop = (e) => {
  //   e.preventDefault();
  //   const data = e.dataTransfer.getData("application/widget");
  //   if (!data) return;
  //   console.log('datafadsdsd')
  //   const { id, uid } = JSON.parse(data);
  //   const meta = PALETTE.find((p) => p.id === id && p?.kpi === kpi);
  //   console.log('metameta',meta,id,uid)
  //   // if (!meta) return;

  //   setDropped((prev) => [...prev, { ...meta, uid, type: id }]);
  //   setSavedData((prev) => [...prev, { ...meta, uid, type: id }]);
  //   setDragging(null);
  //   setIsOver(false);
  // };


  const handleDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/widget");
    if (!data) return;
    const { id, uid } = JSON.parse(data);
    const meta = PALETTE.find((p) => p.id === id && p?.kpi === kpi);
    console.log('metametameta', meta)
    if (!meta) return;
    setDropped((prev) => [...prev, { ...meta, uid, type: id }]);
setSavedData((prev) => [...prev, { ...meta, uid, type: id }]);
    setDragging(null);
    setIsOver(false);
  };


  const handleRemove = (uid) => {
    // setDropped((prev) => prev.filter((item) => item.uid !== uid));
    setSavedData((prev) => prev.filter((item) => item.uid !== uid));
  };

  return (
    <div className="flex flex-wrap w-full">
      {/* LEFT: Drop Area */}
      <div className="w-[60%] flex flex-col bg-white">
        <div className="bg-[gray] h-[76vh] overflow-hidden relative w-full flex-col flex">
          {/* Static sections */}
          <div className="brightness-50">
            <StaticHeader />
            <div className="bg-[#f5f8fa] px-[3px] py-[2px]">
              <StaticCategoryCard />
              <StaticCompany />
            </div>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`h-full overflow-hidden border rounded border-gray-200 p-3 flex flex-col gap-4 transition
              ${isOver ? "border-2 border-blue-400 bg-blue-50" : ""}
            `}
          >
            <div className="h-[65vh] overflow-y-auto border border-dashed border-gray-300 p-3 relative">
              <div className="grid grid-cols-4 gap-4">
                {savedData.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    Drag widgets from the right and drop here
                  </div>
                ) : (
                  savedData.map((it, index) => {
                        if (!it) return null;

                        const meta = PALETTE.find((p) => p.id === it.type && p?.kpi == kpi);
                        if (!meta) return null;

                        // Default span
                        let spanClass = "col-span-4";
                        console.log('it.rowSize', it.rowSize)
                        if (it.rowSize === 1) {
                          spanClass = "col-span-4";
                        } else if (it.rowSize === 2) {
                          spanClass = "col-span-2"; // Always half
                        } else if (it.rowSize === 4) {
                          spanClass = "col-span-1"; // Quarter
                        }

                        return (
                      <div
                        key={it.uid}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("drag-index", index);
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          const fromIndex = parseInt(
                            e.dataTransfer.getData("drag-index"),
                            10
                          );
                          if (fromIndex === index) return;

                          setDropped((prev) => {
                            const newArr = [...prev];
                            const temp = newArr[fromIndex];
                            newArr[fromIndex] = newArr[index];
                            newArr[index] = temp;
                            return newArr;
                          });
                          setSavedData((prev) => {
                            const newArr = [...prev];
                            const temp = newArr[fromIndex];
                            newArr[fromIndex] = newArr[index];
                            newArr[index] = temp;
                            return newArr;
                          });
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        className={spanClass}
                      >
                        <div className="relative border rounded border-gray-200 p-2 bg-white h-full shadow-sm">
                          <button
                            onClick={() => handleRemove(it.uid)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-[16px] h-[16px] flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ✕
                          </button>
                          <img
                            src={meta.img}
                            className="w-full h-full"
                            alt={meta.label}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <img
            src="/assets/images/widget/comprehensive-breakdown.png"
            alt="Toolbar"
            className="top-0 w-[100%] h-[100px] right-0 object-cover border-b"
          />
        </div>
      </div>

      {/* RIGHT: Palette */}
      <div className="w-[40%] bg-white px-3">
        <h2 className="text-[14px] font-semibold text-black mt-3">
          Available Widgets
        </h2>
        <div className="space-y-3 h-[65vh] overflow-y-auto mt-3">
          {PALETTE.filter((p) => p.kpi === kpi).map((w) => {
            const isDropped = savedData?.some((d) => d?.type === w?.id);
            return (
              <div
                key={w.id}
                draggable={!isDropped}
                onDragStart={(e) => !isDropped && handleDragStart(e, w.id)}
                onDragEnd={handleDragEnd}
                className={`border rounded p-2 transition ${isDropped
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-move hover:shadow-sm"
                  }`}
              >
                <img
                  src={w.img}
                  alt={w.label}
                  className={`w-full h-full pointer-events-none transition
                    ${isDropped ? "opacity-[0.6]" : ""}
                    ${dragging === w.id ? "opacity-[0.1]" : ""}
                  `}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DragAndDrop;
