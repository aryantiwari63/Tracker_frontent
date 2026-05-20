import React, { useState } from 'react'
import DragAndDrop from './DragAndDrop';
import { saveTabsPlateform, getTabsPlateform } from '../../services/saveTabsPlateform.services';
import { useEbuxContext } from '../../Context/EbuxProvider';
import { PALETTE } from "../widgetConstant";


function ToggleWidget() {
  const {
    kpi,
    updateKpiDragPosition
  } = useEbuxContext();
  let savedTabPlatformType = {
    "OSA": "OSAPosition",
    "SOS": "SOSPosition",
    "PRO": "PROPosition",
    "CS": "CSPosition",
    "RR":"RRPosition",
    "OR":"ORPosition"
  }

  const [isOpen, setIsOpen] = useState(false);
  const [dropped, setDropped] = useState([]); // 👈 lifted state
  const [savedData, setSavedData] = useState([]); // right side


  // const handleApply = async () => {
  //   try {
  //     let OSAPosition = dropped.map((item, index) => ({
  //       value: item.type,
  //       position: index,
  //     }));

  //     // Add one extra object at the end
  //     OSAPosition = savedTabPlatformType[kpi]?.filter(obj => obj.value !== "ComprehensiveBreakdown");
  //     OSAPosition.push({
  //       value: "ComprehensiveBreakdown", // or any id you want
  //       position: OSAPosition.length,   // last index
  //     });

  //     const tabsPayload = { OSAPosition };

  //     console.log("Payload:", tabsPayload);

  //     await saveTabsPlateform(tabsPayload);
  //     const response = await getTabsPlateform();
  //     updateKpiDragPosition(response?.userRecord?.tabs_plateform?.OSAPosition ?? [])
  //     console.log("Updated response:", response);

  //     setIsOpen(false);
  //   } catch (error) {
  //     console.error("Error applying changes:", error);
  //   }
  // };


  const handleApply = async () => {
    try {
      let OSAPosition = savedData
        .filter(item => item.type !== "ComprehensiveBreakdown") // remove if exists
        .map((item, index) => ({
          value: item.type,
          position: index,
        }));

      // Add one extra object at the end
      OSAPosition.push({
        value: "ComprehensiveBreakdown",
        position: OSAPosition.length,
      });

      const tabsPayload = {
        [savedTabPlatformType[kpi]]: OSAPosition, // dynamic key
      };

      // console.log("Payload:", tabsPayload);

      await saveTabsPlateform(tabsPayload);
      const response = await getTabsPlateform();

      updateKpiDragPosition(
        response?.userRecord?.tabs_plateform?.[savedTabPlatformType[kpi]] ?? []
      );

      // console.log("Updated response:", response);

      setIsOpen(false);
    } catch (error) {
      console.error("Error applying changes:", error);
    }
  };



  // const handleOpen = async () => {
  //   setIsOpen(true);

  //   try {
  //     const response = await getTabsPlateform();
  //     let saved = response?.userRecord?.tabs_plateform?.[savedTabPlatformType[kpi]] || [];
  //     saved = saved?.filter(obj => obj.value !== "ComprehensiveBreakdown");
  //     console.log('savedsavedsaved',saved)
  //     setDropped(
  //       saved.map((item, i) => {
  //         const meta = PALETTE.find((p) => p.id === item.value && p?.kpi==kpi); // match by id/value
  //         console.log('metametameta',meta)
  //         return {
  //           ...item,
  //           ...meta,                // merge rowSize, img, label, etc.
  //           type: item.value,
  //           uid: `${item.value}-${i}`, // unique key
  //         };
  //       })
  //     );
  //   } catch (err) {
  //     console.error("Error loading saved layout:", err);
  //   }

  // };


  const handleOpen = async () => {
    setIsOpen(true);

    try {
      const response = await getTabsPlateform();
      let saved = response?.userRecord?.tabs_plateform?.[savedTabPlatformType[kpi]] || [];

      // remove ComprehensiveBreakdown
      saved = saved.filter(obj => obj.value !== "ComprehensiveBreakdown");

      // map saved DB data
      const savedMapped = saved.map((item, i) => {
        // const meta = PALETTE.find(p => p.id === item.value && p?.kpi === kpi);
        const meta = PALETTE.find(
          (p) => p.id === item.value && p.kpi.indexOf(kpi) !== -1
        );
        return {
          ...item,
          ...meta,
          type: item.value,
          uid: `${item.value}-${i}`,
        };
      });

      // find PALETTE items not already in saved
      // const availableMapped = PALETTE.filter(
      //   p => p.kpi === kpi && !saved.some(s => s.value === p.id)
      // ).map((item, i) => ({
      const availableMapped = PALETTE.filter(
        (p) => p.kpi.includes(kpi) && !saved.some((s) => s.value === p.id)
      ).map((item, i) => ({
        ...item,
        type: item.id,
        uid: `${item.id}-avail-${i}`,
        position: savedMapped.length + i, // optional position
      }));

      // merge saved + available
      setDropped(availableMapped);
      setSavedData([...savedMapped]);
    } catch (err) {
      console.error("Error loading saved layout:", err);
    }
  };



  return (
    <div>
      {/* <div className="fixed top-1/2 right-0">
        <button
          onClick={handleOpen}
          className="rounded-full shadow w-[40px] h-[40px] bg-black overflow-hidden flex items-center justify-center"
        >
          <img src="/assets/images/widget/widget.png" alt="widget" />
        </button>
      </div> */}
      <button
      onClick={handleOpen}
      className='bg-[#1890FF] px-3 py-2 rounded-lg text-white text-sm flex gap-2'><img src="/assets/images/brandIconWhite.svg" />Widget</button>
      {isOpen && (
        <div
          className={` fixed w-full h-full z-[1050] overflow-y-auto overflow-x-hidden bg-[#00000080] backdrop-blur-[9px] top-0 left-0`}
        >
          <div className="flex items-center justify-center mx-auto my-[2.75rem] w-[80%]">
            <div className="relative flex flex-col w-full background-clip-padding">
              <div className="h-fit  border-[1.51px] border-[#E5E5E5] rounded-[4px]">
                {/* Header */}
                <div className="flex justify-between items-center border-b px-4 py-2 bg-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800">Widgets</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-black hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                {/* Body */}
                <div className="bg-transparent">

                  <DragAndDrop dropped={dropped} setDropped={setDropped} savedData={savedData} setSavedData={setSavedData} />
                </div>
                {/* </div> */}
                {/* Footer */}
                <div className="flex bg-[#FFFFFF] justify-end items-center gap-3 py-4 px-6 border-t">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="border py-1 px-4 text-[14px] rounded font-medium bg-white 
                      hover:bg-gray-100 hover:border-gray-400 transition"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleApply}
                    className="border py-1 px-4 text-[14px] rounded font-medium bg-blue-600 text-white 
                      hover:bg-blue-700 transition"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

  )
}

export default ToggleWidget