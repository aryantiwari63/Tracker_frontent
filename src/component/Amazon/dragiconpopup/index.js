import React, { useState } from "react";
import { IoIosArrowDropdown } from "react-icons/io";
import Popup from "../../common-components/Popups/Popup";
import PopupCard from "./PopUpCard";

const RepositionIcon = () => {
  const [open, setOpen] = useState(false);
  const radiobtnopt = [
    { id: 1, val: " Top 20 Campaign", name: "camp" },
    { id: 2, val: "Campaign Tag Perf.", name: "perf" },
    { id: 3, val: " Campaign Type Perf.", name: "camptype" },
  ];
  const performanceoption = [
    { id: 1, val: "Performance",name:"perfo" },
    { id: 2, val: "Efficiency",name:"effi" },
    { id: 3, val: "Awareness",name:"awarness" },
    { id: 4, val: "Real Time" ,name:"realtime"}
  ];
  const comparativeoption = [
    { id: 1, val: "Perf. by Weekday",name:"perfbyweek" },
    { id: 2, val: "SB BenchMark" ,name:"sbbenchmark"},
    { id: 3, val: "Placement Perf." ,name:"placement"},
    { id: 4, val: "Perf. Comparator",name:"comparator" },
  ];
  const budgetoption = [
    { id: 1, val: "June Budget" ,name:"junebudget"},
    { id: 2, val: "Perscritive Insights by",name:"persritive" },
  ];
  const alertoption = [
    { id: 1, val: "Out Of Budget" ,name:"outofbudget"},
    { id: 2, val: "Products",name:"products" },
  ];
  const keywordoption = [
    { id: 1, val: "Keyword" ,name:"keyword"},
    { id: 2, val: "Non Bid Query Perf." ,name:"nodbid"},
    { id: 3, val: "Keywords Tag Perf" ,name:"tagkeyword"},
    { id: 4, val: "Long Tail Keywords",name:"longkeyword" },
  ];
  const goaltrackingoption = [
    { id: 1, val: "Campaign Goal" ,name:"campgoal"},
    { id: 2, val: "Campaign Tag Goal",name:"taggoal" },
  ];
  const sharevoiceoption = [
    { id: 1, val: "Brand SOV" ,name:'brandsov'},
    { id: 2, val: "SOV Trend" ,name:"sovtrend"},
  ];
  return (
    <>
      <button onClick={() => setOpen(!open)}>
        <IoIosArrowDropdown />
      </button>
      {open && (
        <Popup title="Drag icon Reposition" footerless setShowPopup={setOpen}>
          <div className="row p-4 items-stretch">
            <div className="col_3  ">
                <PopupCard
                  className=""
                  serial_no={"1"}
                  title={"Campaign"}
                  options={radiobtnopt}
                  cardtype={"one"}
                ></PopupCard>
            </div>
            <div className="col_3 ">
              <PopupCard
                serial_no={"2"}
                title={"Performance"}
                options={performanceoption}
                cardtype={"two"}
              ></PopupCard>
            </div>
            <div className="col_3">
              <PopupCard
                serial_no={"3"}
                title={"Comparative Perf."}
                options={comparativeoption}
                cardtype={"three"}
              ></PopupCard>
            </div>
            <div className="col ">
              <PopupCard
                serial_no={"4"}
                title={"Budgtes"}
                options={budgetoption}
                cardtype={"four"}
              ></PopupCard>
            </div>
            <div className="col_3">
                <PopupCard
                  serial_no={"5"}
                  title={"Alerts"}
                  options={alertoption}
                  cardtype={"five"}
                ></PopupCard>
            </div>
            <div className="col_3 ">
              <PopupCard
                serial_no={"6"}
                title={"Keyword Insights"}
                options={keywordoption}
                cardtype={"six"}
              ></PopupCard>
            </div>
            <div className="col_3">
              <PopupCard
                serial_no={"7"}
                title={"Goal Tracking"}
                options={goaltrackingoption}
                cardtype={"seven"}
              ></PopupCard>
            </div>
            <div className="col ">
              <PopupCard
                serial_no={"8"}
                title={"Share of Voice"}
                options={sharevoiceoption}
                cardtype={"eight"}
              ></PopupCard>
          </div>
          </div>
        </Popup>
      )}
    </>
  );
};
export default RepositionIcon;
