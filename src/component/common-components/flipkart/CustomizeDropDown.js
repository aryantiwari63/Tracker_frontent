/* eslint-disable no-console */
import React, { useRef } from "react";
// import { useCloseWhenClickOutside } from "../useCloseWhenClickOutside";

const CustomizeDropDown = ({
  title,
  setShowHeader,
  showHeader,
  applyFilter,
  cancelFilter,
  setShowFilter,
  showFilter,
  platform,
}) => {
  const dropDownRef = useRef(null);
  // const [showHeader, setShowHeader] = useState([...headers]);
  React.useEffect(() => {
    // console.log("showHeader", showHeader);
  }, [showHeader]);

  const handleCheckClick = React.useCallback(
    (id) => {
      let tempShowheader = showHeader;

      tempShowheader = tempShowheader.map((checkbox) =>
        checkbox.id === id
          ? { ...checkbox, checked: !checkbox.checked }
          : checkbox
      );
      setShowHeader(tempShowheader);
      changeBidHeaders(tempShowheader);
    },
    [showHeader]
  );
  const handleSelectAll = (check) => {
    if (check) {
      setShowHeader(
        showHeader.map((checkbox) => {
          if (
            checkbox.value == "min_bid" ||
            checkbox.value == "suggested_bid" ||
            checkbox.value == "placement_bid"
          ) {
            return { ...checkbox, checked: true, disable: false };
          } else return { ...checkbox, checked: true };
        })
      );
    } else {
      setShowHeader(
        showHeader.map((checkbox) => {
          if (!checkbox?.disable) {
            if (
              checkbox.value == "min_bid" ||
              checkbox.value == "suggested_bid" ||
              checkbox.value == "placement_bid"
            ) {
              return { ...checkbox, checked: false, disable: true };
            } else return { ...checkbox, checked: false };
          } else {
            return { ...checkbox, checked: true };
          }
        })
      );
    }
  };

  const changeBidHeaders = (header) => {
    let itemChange = true;
    header.map((item) => {
      if (
        (item.value == "campaign_name" || item.value == "campaign_id") &&
        item.checked
      ) {
        header.map((item1) => {
          if (
            (item1.value === "ad_group_id" ||
              item1.value === "ad_group_name") &&
            item1.checked
          ) {
            itemChange = false;
            if (header.find((x) => x.value === "min_bid")?.disable) {
              setShowHeader(
                header.map((checkbox) =>
                  checkbox.value == "min_bid" ||
                  checkbox.value == "suggested_bid" ||
                  checkbox.value == "placement_bid"
                    ? { ...checkbox, disable: false }
                    : checkbox
                )
              );
            }
          } 
        });
      }
    });

    if (itemChange) {
      setShowHeader(
        header.map((checkbox) =>
          checkbox.value == "min_bid" ||
          checkbox.value == "suggested_bid" ||
          checkbox.value == "placement_bid"
            ? { ...checkbox, disable: true, checked: false, showCol: false }
            : checkbox
        )
      );
    }
  };

  const checkboxAccentObj={
    ams:"accent-orange-600",
    instamart:"accent-pink-800",
    zepto:"accent-purple-900",
    blinkit:"accent-green-600",
  }

  // useCloseWhenClickOutside(showFilter, setShowFilter, dropDownRef);
  return (
    <>
      <div ref={dropDownRef}>
        <button
          className={[
            "campaignreport__btn flex rounded",
            platform === "ams" && "campaignreport__btn--ams",
            platform === "blinkit" && "campaignreport__btn--blinkit",
            platform === "instamart" && "campaignreport__btn--insta",
            platform === "zepto" && "campaignreport__btn--zepto",
          ].join(" ")}
          onClick={() => {
            setShowFilter(!showFilter, "button");
            // if(platform === "blinkit")
          }}
        >
          <img className="w-4 mr-1" src="/assets/images/columns.svg" alt="" />
          {/* <div className="h-2 w-3">
          <img src="/assets/images/table-columns-solid.svg" alt="" />
        </div> */}
          {title && <p>{title}</p>}
        </button>
        {showFilter && (
          <div className="absolute top-full bg-white w-max right-0 selectfield z-[999] cursor-pointer max-h-80 overflow-y-auto pb-0">
            <div className=" font-bold text-sm  px-2 pl-5">
              <label className="cursor-pointer pl-5 ">
                <div className="row items-center">
                  <div>
                    <input
                      type="checkbox"
                      className={checkboxAccentObj[platform]}
                      checked={showHeader.every((item) => item.checked == true)}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </div>
                  <div className="col px-1">Select All</div>
                </div>
              </label>
            </div>
            {showHeader?.map((item) => {
              return (
                <div className="dropdownfields " key={item.id}>
                  <label className="cursor-pointer pl-5 ">
                    <div className="row items-center pl-5">
                      <div>
                        <input
                          type="checkbox"
                          checked={item?.checked}
                          disabled={item?.disable}
                          onChange={() => handleCheckClick(item.id, item)}
                          className={`align-middle ${checkboxAccentObj[platform]}`}
                        />
                      </div>
                      <div className="col px-1">{item?.title}</div>
                    </div>
                  </label>
                </div>
              );
            })}
            <div className="sticky -bottom-1 left-0 bg-white py-2">
              <div className="flex justify-between pl-5 pr-5">
                <button className="cancelbtn " onClick={cancelFilter}>
                  Cancel
                </button>
                <button
                  className={[
                    "applybutton ",
                    platform === "blinkit" && "applybutton--blinkit",
                    platform === "ams" && "applybutton--ams",
                    platform === "instamart" && "applybutton--insta",
                  ].join(" ")}
                  onClick={applyFilter}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default CustomizeDropDown;
