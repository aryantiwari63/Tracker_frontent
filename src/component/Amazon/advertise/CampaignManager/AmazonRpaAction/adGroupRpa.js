import React, { useState } from "react";
import { AdGroupEditPopup } from "./AdGroupRpaPopup/adGroupEditPopup";
import { KeywordPopup } from "./AdGroupRpaPopup/keywordPopup";
import { NegativeKeywordPopup } from "./AdGroupRpaPopup/negativeKeywordPopup";
import { NegativeProductPopup } from "./AdGroupRpaPopup/negativeProductPopup";
import { TargetingProductPopup } from "./AdGroupRpaPopup/targetingProductPopup";
import { AdvertisingProductPopup } from "./AdGroupRpaPopup/advertisingProductPopup";

export const AdGroupRpa = ({ op, editRef }) => {
  // eslint-disable-next-line no-unused-vars
  const [showPopup, setShowPopup] = useState(false);
  const [showAdGroupEditPopup, setShowAdGroupEditPopup] = useState(false);
  const [showKeywordPopup, setShowKeywordPopup] = useState(false);
  const [showNegativeKeywordPopup, setShowNegativeKeywordPopup] =
    useState(false);
  const [showNegativeProductPopup, setShowNegativeProductPopup] =
    useState(false);
  const [showTargetingProductPopup, setShowTargetingProductPopup] =
    useState(false);
  const [showAdvertisingProductPopup, setShowAdvertisingProductPopup] =
    useState(false);
  // eslint-disable-next-line no-unused-vars
  const [showDialog, setShowDialog] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [actionName, setActionName] = useState("");
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
                AdGroup Edits
              </li>
              <li
                onClick={() => setShowKeywordPopup(!showKeywordPopup)}
                className="edit-button-li"
              >
                Keyword
              </li>
              <li
                onClick={() =>
                  setShowNegativeKeywordPopup(!showNegativeKeywordPopup)
                }
                className="edit-button-li"
              >
                Negative Keyword
              </li>
              {/* <li
                onClick={() => setShowNegativeProductPopup(!showNegativeProductPopup)}
                className="edit-button-li"
              >
                Negative Product
              </li>
              <li
                onClick={() => setShowTargetingProductPopup(!showTargetingProductPopup)}
                className="edit-button-li"
              >
                Targeting Product
              </li>
              <li
                onClick={() => setShowAdvertisingProductPopup(!showAdvertisingProductPopup)}
                className="edit-button-li"
              >
                Advertising Product
              </li> */}
            </ul>
          </div>
          {showAdGroupEditPopup && (
            <AdGroupEditPopup setOpenState={setShowAdGroupEditPopup} />
          )}
          {showKeywordPopup && (
            <KeywordPopup setOpenState={setShowKeywordPopup} />
          )}
          {showNegativeKeywordPopup && (
            <NegativeKeywordPopup setOpenState={setShowNegativeKeywordPopup} />
          )}
          {showNegativeProductPopup && (
            <NegativeProductPopup setOpenState={setShowNegativeProductPopup} />
          )}
          {showTargetingProductPopup && (
            <TargetingProductPopup
              setOpenState={setShowTargetingProductPopup}
            />
          )}
          {showAdvertisingProductPopup && (
            <AdvertisingProductPopup
              setOpenState={setShowAdvertisingProductPopup}
            />
          )}
        </div>
      )}
    </>
  );
};
