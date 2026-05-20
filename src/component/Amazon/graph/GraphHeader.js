import React from "react";
import { BiBarChartSquare } from "react-icons/bi";
import { MdZoomOutMap } from "react-icons/md";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { BsDownload } from "react-icons/bs";


const GraphHeader = ({
  title,
  dropdownsortable,
  listable,
  daywiseSortable,
  showGraph,
  setShowGraph,
  children,
  setShowPopup,
  options
}) => {


  // const graphOption = [
  //   { id: 1, val: "CPC" },
  //   { id: 2, val: "Impressions" },
  //   { id: 3, val: "Clicks" },
  //   { id: 4, val: "Spend" },
  //   { id: 5, val: "Spend %" },
  //   { id: 6, val: "Sale %" },
  //   { id: 7, val: "Sales" },
  //   { id: 8, val: "ROAS" },
  //   { id: 9, val: "CPA" },
  //   { id: 10, val: "CTR" },
  // ];
  // const metrics=[
  //   {id:1,val:"Impressions"},
  //   {id:2,val:"CPC"},
  //   {id:3,val:"Clicks"},
  //   {id:4,val:"CTR"},
  //   {id:5,val:"CVR"},
  //   {id:6,val:"CPA"}
    
  // ]
  // const dropdpwnOption = [
  //   { id: 1, val: "Spend" },
  //   { id: 2, val: "Sales" },
  //   { id: 3, val: "ROAS" },
  //   { id: 4, val: "Orders" },
  //   { id: 5, val: "Sale Units" },
  //   { id: 6, val: "Impressions" },
  // ];
  return (
    <>
      <div className="px-1 ">
        <div className="row py-3 px-2 bg-white rounded ">
          <div className="col_6 font-medium text-xl ">{title}</div>
          <div className="col py-2">
            <div className="row justify-end">
              {dropdownsortable && (
                <div className="pr-2">
                  <select className="border px-7 py-0.5 cursor-pointer text-gray-500">
                    {/* {graphOption?.map((item, index) => (
                      <option value={item.id}>{item.val}</option>
                    ))} */}
                    {options}
                  </select>
                </div>
              )}
              <div className=" graphsection__periodwise">
                {daywiseSortable && (
                  <div>
                    <button className="border px-3 graphsection__periodwise--day">D</button>
                    <button className="border px-3 graphsection__periodwise--week">W</button>
                    <button className="border px-3 graphsection__periodwise--month">M</button>
                  </div>
                )}
                {listable && (
                  <div className="row ">
                    <button className={["border px-2 py-1 text-gray-500 graphsection__list",showGraph && ""].join(" ")}
                    onClick={() => {
                      setShowGraph(true)
                    }}>
                      <BiBarChartSquare className="h-4 " />
                    </button>

                    <button
                      className={["border px-2 py-1 text-gray-500 graphsection__list",!showGraph && ""].join(" ")}
                      onClick={() => {
                        setShowGraph(false)
                      }}
                    >
                      <HiAdjustmentsHorizontal />
                    </button>
                    {!showGraph && <button
                      className={"border px-2 py-1 text-gray-500"}
                      onClick={() => {setShowPopup(true)}}
                    >
                      <MdZoomOutMap />
                    </button>}
                  </div>
                )}
              </div>
              <button className="px-5 py-1 text-gray-700 graphsection__list">
                <BsDownload />
              </button>
            </div>
          </div>
          <div className="w-full ">{children}</div>
        </div>
      </div>
    </>
  );
};

export default GraphHeader;
