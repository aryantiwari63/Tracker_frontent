import React from "react";

const AlertMetrices = () => {
  const columnName = [
    // "Metrices",
    "Impressions",
    "Clicks",
    "Spends",
    "Sales",
    "CTR",
    "CPC",
    "ROAS",
    "CPM",
  ];
  return (
    <>
      <div className="flex-1 mt-2 bg-white px-1">
        <div className="h-7 mb-2"></div>
        <div className="pt-1">
          <div
            className=" h-[80px] rounded mt-1 px-2 border !min-w-full py-5 bg-white font-semibold "
            style={{ width: "8rem" }}
          >
            Metrices
          </div>
          <div className="">
            {columnName.map((item) => (
              <>
                <div className=" commonscreen__card1 rounded my-[5.5px] px-2 border !min-w-full py-5 bg-white font-semibold ">
                  {item}
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AlertMetrices;
