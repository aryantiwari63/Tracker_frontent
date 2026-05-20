import React, {  useState } from "react";
import { KeywordEdit } from "./TargetingRpaPopup/KeywordEdit";

export const TargetingRpa = ({ op, editRef }) => {
  const [showAdGroupEditPopup, setShowAdGroupEditPopup] = useState(false);



  

  return (
    <>
      {op === true && (
        <div className="relative" ref={editRef}>
          <div className=" rounded mt-2 py-4 px-4 drop-shadow-md card bg-white w-max absolute  z-[100] right-[-50px]">
            <ul className="edit-button ">
              <li
                onClick={() => setShowAdGroupEditPopup(!showAdGroupEditPopup)}
                className="edit-button-li"
              >
                Targeting Edits
              </li>
              
            </ul>
          </div>
          {showAdGroupEditPopup && (
            <KeywordEdit setOpenState={setShowAdGroupEditPopup} />
          )}
          
        </div>
      )}
    </>
  );
};
