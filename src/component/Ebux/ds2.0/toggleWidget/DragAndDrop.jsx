import { useState } from "react";
import { PALETTE } from "../widgetConstant";
// import HeaderFiltersComponent from "../../common-components/HeaderFiltersComponent";
import StaticHeader from "./moc_data/StaticHeader";
import StaticCategoryCard from "./moc_data/StaticCategoryCard";
import StaticCompany from "./moc_data/StaticCompany";
import MockDataOsaByBrand from "./moc_data/osaByBrands";
import MockOosDaysOverview from "./moc_data/oosDaysOverview";
import MockOsaPerformanceOverviewComponent from "./moc_data/performanceOverview/index";
import { useEbuxContext } from '../../Context/EbuxProvider';
import DayOnDayMockup from "./moc_data/dayOnDay/DayOnDayMockup";
import PlatformDistributionMockup from "./moc_data/platformDistribution/PlatformDistribution";
const renderWidget = (w, isDropped, dragging) => {
  switch (w.id) {
    case "OsaByBrand":
      return <MockDataOsaByBrand isDropped={isDropped} />;

    case "OosDaysOverview":
      return <MockOosDaysOverview isDropped={isDropped} />;

    case "OsaPerformanceOverview":
      return <MockOsaPerformanceOverviewComponent isDropped={isDropped} />;

    case "DayonDayTable":
      return <DayOnDayMockup isDropped={isDropped} />;
    case "PlatformDistribution":
      return <PlatformDistributionMockup isDropped={isDropped} />;


    default:
      return (
        <img
          src={w.img}
          alt={w.label}
          className={`w-full h-full pointer-events-none transition
            ${isDropped ? "opacity-[0.6]" : ""}
            ${dragging === w.id ? "opacity-[0.1]" : ""}
          `}
        />
      );
  }
};


const DragAndDrop = ({ dropped, savedData, setSavedData }) => {
  const { kpi } = useEbuxContext();
  console.log('droppeddroppedavailable', dropped)
  const [dragging, setDragging] = useState(null); // track which widget is being dragged
  const [isOver, setIsOver] = useState(false); // track if dragging over left area

  const handleDragStart = (e, widgetId) => {
    const uid = `${widgetId}-${Date.now()}`;
    e.dataTransfer.setData("application/widget", JSON.stringify({ id: widgetId, uid }));
    e.dataTransfer.effectAllowed = "copy";
    setDragging(widgetId);
  };


  const handleDragEnd = () => {
    setDragging(null);
    setIsOver(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };


  const handleDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/widget");
    if (!data) return;

    const { id, uid } = JSON.parse(data);
    // const meta = PALETTE.find((p) => p.id === id && p?.kpi == kpi);
    const meta = PALETTE.find((p) => p.id === id && p.kpi.indexOf(kpi) !== -1);

    // setDropped((prev) => [...prev, { ...meta, uid, type: id }]);
    setSavedData((prev) => [...prev, { ...meta, uid, type: id }]);
    setDragging(null);
    setIsOver(false);
  };

  const handleRemove = (uid) => {
    console.log('uiduid', dropped, uid)
    // setDropped((prev) => prev.filter((item) => item.uid !== uid));
    setSavedData((prev) => prev.filter((item) => item.uid !== uid));
  };

  // const kpiList = Array.from(new Set(PALETTE.flatMap(item => item.kpi)));
  // Filter widgets by selected KPI
  // 🔹 track which widget type is selected
  const [selectedWidget, setSelectedWidget] = useState("");

  // 🔹 widgets available for current KPI
  const availableWidgets = PALETTE.filter((item) => item.kpi.includes(kpi));

  // 🔹 filter palette by selected widget (if chosen)
  const filteredPalette = selectedWidget
    ? availableWidgets.filter((item) => item.id === selectedWidget)
    : availableWidgets;
  return (
    <div className=" flex flex-wrap w-full">
      {/* LEFT: Drop Area */}
      <div className="top-0 left-0 h-[76vh] w-[30px] bg-black">&#160;</div>
      <div className="flex-1 h-full">
        <div className="flex">
          <div className="w-[60%] flex flex-col bg-white">
            <div className="bg-[gray] h-[76vh] overflow-hidden relative w-full  flex-col flex">

              <div className="brightness-50">
                <StaticHeader />
                <div className="bg-[#f5f8fa] px-[3px] py-[2px]">
                  <StaticCategoryCard />
                  <StaticCompany />
                </div>
              </div>

              <div
                // className="flex w-full h-[600px] bg-white rounded-lg overflow-hidden shadow"

                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`h-full overflow-hidden border rounded border-gray-200 p-3 flex flex-col gap-4 transition
                                ${dropped.length === 0 ? "bg-white" : "bg-white"
                  }
                                ${isOver
                    ? "border-2 border-blue-400 bg-blue-50"
                    : ""
                  }
                                `}
              >
                {/* Left Section */}
                <div className="h-[65vh] overflow-x-hidden overflow-y-auto border border-dashed border-gray-300  items-center justify-center relative">

                  <div className="grid grid-cols-4 gap-4">
                    {/* <pre>{JSON.stringify(dropped, null, 2)}</pre> */}
                    {savedData.length == 0 ? (
                      <div className="w-full absolute top-[50%] left-[3%] flex items-center justify-center text-gray-500">
                        Drag widgets from the right and drop here
                      </div>
                    ) : (
                      savedData.map((it, index) => {
                        if (!it) return null;

                        // const meta = PALETTE.find((p) => p.id === it.type && p?.kpi == kpi);
                        const meta = PALETTE.find(
                          (p) => p.id === it.type && p.kpi.indexOf(kpi) !== -1
                        );
                        if (!meta) return null;

                        // Default span
                        let spanClass = "col-span-4 shadow-md";
                        console.log('it.rowSize', it.rowSize)
                        if (it.rowSize === 1) {
                          spanClass = "col-span-4 shadow-md";
                        } else if (it.rowSize === 2) {
                          spanClass = "col-span-2 shadow-md"; // Always half
                        } else if (it.rowSize === 4) {
                          spanClass = "col-span-1 shadow-md"; // Quarter
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
                              const fromIndex = parseInt(e.dataTransfer.getData("drag-index"), 10);
                              if (fromIndex === index) return;

                              // setDropped((prev) => {
                              //   const newArr = [...prev];
                              //   if (!newArr[fromIndex] || !newArr[index]) return prev;
                              //   const temp = newArr[fromIndex];
                              //   newArr[fromIndex] = newArr[index];
                              //   newArr[index] = temp;
                              //   return newArr;
                              // });

                              setSavedData((prev) => {
                                const newArr = [...prev];
                                if (!newArr[fromIndex] || !newArr[index]) return prev;
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
                              {/* <img src={meta.img} className="w-full h-full" alt={meta.label} /> */}
                              {/* {
                                meta.id == 'OsaByBrand' ? <MockDataOsaByBrand isDropped={false} /> : <img
                                  src={meta.img}
                                  alt={meta.label}
                                  className={`w-full h-full pointer-events-none transition
                    
                  `}
                                />

                              } */}


                              {renderWidget(meta, false, false)}

                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>


                </div>

                {/* Right Section */}
              </div>
              {/* <img
                src="/assets/images/widget/comprehensive-breakdown.png"
                alt="Toolbar"
                className="top-0 w-[100%] h-[100px] right-0 object-cover border-b"
              /> */}
            </div>
            {/* Top toolbar image */}


          </div>
          {/* RIGHT: Palette */}
          <div className="w-[40%]">
            <div className="px-3 pb-3 bg-white">
              <h2 className="text-[14px] font-semibold text-black">
                Available Widget
              </h2>
              <div className=" mt-3 ">
                {/* <select
                  className="text-[10px] py-[12px] px-[15px] w-full border border-gray-400 rounded-full outline-none 
                                   focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Search and Filter">Search and Filter</option>
                </select> */}
                <div className="relative">
                  <select
                    className="appearance-none pr-10 text-[10px] py-[12px] px-[15px] w-full border border-gray-400 rounded-full outline-none 
                focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-2"
                    value={selectedWidget}
                    onChange={(e) => setSelectedWidget(e.target.value)}
                  >
                    <option value="">All Widgets</option>
                    {availableWidgets.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute top-[-11px] bottom-0 right-3 flex items-center">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="space-y-3 h-[65vh] overflow-y-auto px-2 bg-white">
              {dropped.map((w) => {
                const isDropped = PALETTE.some((p) => w.type === p.id);

                return (
                  <div
                    key={w.id}
                    draggable={!isDropped}
                    onDragStart={(e) => !isDropped && handleDragStart(e, w.id)}
                    onDragEnd={handleDragEnd}
                    className={`border w-full rounded border-gray-200 p-2 cursor-move select-none transition bg-white relative
                        ${isDropped ? "cursor-not-allowed" : "hover:shadow-sm"}
                        `}
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
            </div> */}
            <div className="space-y-3 h-[65vh] overflow-y-auto px-2 bg-white">
              {filteredPalette.map((w) => {
                const isDropped = savedData?.some((d) => d?.type === w?.id);
                return (
                  <div
                    key={w?.id}
                    draggable={!isDropped}
                    onDragStart={(e) => !isDropped && handleDragStart(e, w?.id)}
                    onDragEnd={handleDragEnd}
                    className={`shadow-md border w-full rounded border-gray-200 p-2 cursor-move select-none transition bg-white relative
          ${isDropped ? "cursor-not-allowed opacity-[0.6]" : "hover:shadow-sm"}
        `}
                  >
                    {/* {
                        w.id == 'OsaByBrand' ? <MockDataOsaByBrand isDropped={isDropped} /> : <img
                          src={w.img}
                          alt={w.label}
                          className={`w-full h-full pointer-events-none transition
                    ${isDropped ? "opacity-[0.6]" : ""}
                    ${dragging === w.id ? "opacity-[0.1]" : ""}
                  `}
                        />

                      } */}

                    {renderWidget(w, isDropped, dragging)}
                    {/* <img
                        src={w?.img}
                        alt={w?.label}
                        className={`w-full h-full pointer-events-none transition
            ${isDropped ? "opacity-[0.6]" : ""}
            ${dragging === w?.id ? "opacity-[0.1]" : ""}
          `}
                      /> */}
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DragAndDrop;