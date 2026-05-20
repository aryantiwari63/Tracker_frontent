import React from "react";

const AlertTotal = ({
  blinkitTotal,
  amazonTotal,
  flipkartTotal,
  zeptoTotal,
  instamartTotal
}) => {
  const addArray = (arrays) => {
    const result = new Map();

    for (const array of arrays) {
      for (const item of array) {
        const name = item.name;
        const value = item.value;

        if (result.has(name)) {
          result.set(name, result.get(name) + value);
        } else {
          result.set(name, value);
        }
      }
    }

    return Array.from(result, ([name, value]) => ({ name, value }));
  };
  let currency_format = localStorage.getItem("currency_format");

  const result = addArray([
    blinkitTotal,
    amazonTotal,
    flipkartTotal,
    zeptoTotal,
    instamartTotal
  ]);

  let currency = localStorage.getItem("currency");

  return (
    <>
      <div className="flex-1 mt-2 bg-white px-1">
        <div className="h-7 mb-2"></div>
        <div className="pt-1">
          {" "}
          <div className=" align-middle mb-[5.5px] h-[80px] rounded mt-1 px-2 border !min-w-full py-5 bg-white font-semibold" style={{ width: '8rem'}}>
            Total
          </div>
          {/* impressions */}
          <div className=" commonscreen__card1 rounded mt-1 px-2 border !min-w-full my-[5.5px] bg-white font-semibold ">
            {result[1]?.value.toLocaleString(currency_format, {
              maximumFractionDigits: 2,
            })}
          </div>
          {/* clicks */}
          <div className=" commonscreen__card1 rounded mt-1 px-2 border !min-w-full my-[5.5px] bg-white font-semibold ">
            {result[6]?.value.toLocaleString(currency_format, {
              maximumFractionDigits: 2,
            })}
          </div>
          {/* spends */}
          <div className=" commonscreen__card1 rounded mt-1 px-2 border !min-w-full my-[5.5px] bg-white font-semibold ">
            {currency}
            {result[0]?.value.toLocaleString(currency_format, {
              maximumFractionDigits: 0,
            })}
            <div className="flex"></div>
          </div>
          {/* sales */}
          <div className=" commonscreen__card1 rounded mt-1 px-2 border !min-w-full my-[5.5px] bg-white font-semibold ">
            {currency}
            {result[7]?.value.toLocaleString(currency_format, {
              maximumFractionDigits: 0,
            })}
          </div>
          {/* ctr */}
          {!isNaN((result[6]?.value / result[1]?.value) * 100) &&
          isFinite((result[6]?.value / result[1]?.value) * 100) ? (
            <div className=" commonscreen__card1 rounded mt-1 px-2 border !min-w-full my-[5.5px] bg-white font-semibold ">
              {((result[6]?.value / result[1]?.value) * 100).toFixed(2) + "%"}
              <div className="flex"></div>
            </div>
          ) : (
            <div className=" commonscreen__card1 rounded mt-1 px-2 border !min-w-full my-[5.5px] bg-white font-semibold ">
              <div className="flex">0</div>
            </div>
          )}
          {/* cpc */}
          <div className="commonscreen__card1 rounded mt-1 px-2 border !min-w-full my-[5.5px] bg-white font-semibold ">
            {!isNaN(result[0]?.value / result[6]?.value) &&
            isFinite(result[0]?.value / result[6]?.value)
              ? currency + (result[0]?.value / result[6]?.value).toFixed(2)
              : "0"}
          </div>
          {/* roas */}
          <div className="commonscreen__card1 rounded mt-1 px-2 border !min-w-full my-[5.5px] bg-white font-semibold ">
            {!isNaN(result[7]?.value / result[0]?.value) &&
            isFinite(result[7]?.value / result[0]?.value)
              ? (result[7]?.value / result[0]?.value).toFixed(2)
              : "0"}
          </div>
          {/* cpm */}
          <div className="commonscreen__card1 border rounded mt-1 px-2 border !min-w-full my-[5.5px] bg-white font-semibold ">
            {!isNaN((result[0]?.value / result[1]?.value) * 1000) &&
            isFinite((result[0]?.value / result[1]?.value) * 1000)
              ? ((result[0]?.value / result[1]?.value) * 1000).toFixed(2)
              : "0"}
          </div>
        </div>
      </div>
    </>
  );
};

export default AlertTotal;
