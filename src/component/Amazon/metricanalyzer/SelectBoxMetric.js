import React, { useState } from "react";
import { FaGripLinesVertical } from "react-icons/fa";

const CustomizeDropDown = ({ breakdown, setBreakdown }) => {
  const [showBreakdown, setShowFilter] = useState(false);

  const handleCheckClick = React.useCallback(
    (id) => {
      let tempShowheader = breakdown;

      tempShowheader = tempShowheader.map((checkbox) =>
        checkbox.id === id
          ? { ...checkbox, checked: !checkbox.checked }
          : checkbox
      );
      setBreakdown(tempShowheader);
    },
    [breakdown]
  );
  const handleSelectAll = (check) => {
    if (check) {
      setBreakdown(
        breakdown.map((checkbox) => {
          return { ...checkbox, checked: true };
        })
      );
    } else {
      setBreakdown(
        breakdown.map((checkbox) => {
          return { ...checkbox, checked: false };
        })
      );
    }
  };

  return (
    <>
      <div className="relative">
        <button
          className={[
            "campaignreport__btn flex rounded",
            "campaignreport__btn--ams",
          ].join(" ")}
          onClick={() => {
            setShowFilter(!showBreakdown);
          }}
        >
          <span className="m-auto">
            <FaGripLinesVertical />{" "}
          </span>
          Breakdown
        </button>
        {showBreakdown && (
          <div className="absolute  top-full bg-white w-max right-0 selectfield z-[999] cursor-pointer max-h-80 overflow-y-auto pb-5 border">
            {breakdown.length > 1 ? <div className=" font-bold text-sm  px-2 pl-5">
              <label className="cursor-pointer pl-5 ">
                <div className="row items-center">
                  <div>
                    <input
                      type="checkbox"
                      className="accent-orange-600"
                      checked={breakdown.every((item) => item.checked == true)}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </div>
                  <div className="col px-1">Select All</div>
                </div>
              </label>
            </div> : null}
            {breakdown?.map((item) => {
              return (
                <div className="dropdownfields " key={item.id}>
                  <label className="cursor-pointer pl-5 ">
                    <div className="row items-center pl-5">
                      <div>
                        <input
                          type="checkbox"
                          checked={item?.checked}
                          //   disabled={item?.disable}
                          className="accent-orange-600"
                          onChange={() => handleCheckClick(item.id, item)}
                        />
                      </div>
                      <div className="col px-1">{item?.title}</div>
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};
export default CustomizeDropDown;
