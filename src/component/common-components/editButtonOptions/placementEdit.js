import { useState } from "react";
import { SetPlacement } from "./editPopups/setPlacement";

export const PlacementEdit = ({ op, tableData, editRef }) => {
  const [showPopup, setShowPopup] = useState(false);
  return (
    <>
      {op === true && (
        <div className="relative" ref={editRef}>
          <div className=" rounded mt-2 py-4 px-4 drop-shadow-md card bg-white w-max absolute  z-[100] right-[90px]">
            <ul className="">
              <li
                className="cursor-pointer "
                onClick={() => setShowPopup(!showPopup)}
              >
                Set Placement
              </li>
            </ul>
          </div>
          {showPopup && (
            <SetPlacement tableData={tableData} setOpenState={setShowPopup} />
          )}
        </div>
      )}
    </>
  );
};
