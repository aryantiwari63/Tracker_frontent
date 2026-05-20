import React from "react";

const DashboardTable = ({ graphData, noComparison, component = "" }) => {
  const { dates, names, compList, percList } = graphData;

  return (
    <div
      className={`bg-white ${
        component === "flipkart"
          ? "max-h-[227px]"
          : component === "amazon"
          ? "max-h-[344px] mb-6"
          : component === "blinkit"
          ? "max-h-[333px]"
          : component === "zepto"
          ? "max-h-[240px]"
          : "max-h-[268px] mb-8"
      } overflow-y-scroll mr-2`}
    >
      <table className=" text-left w-full campaignsTable " border="1">
        <thead>
          <tr>
            <th
              style={{ paddingLeft: "1rem", fontWeight: "700" }}
              className="flex-column sticky font-bold top-0"
            >
              Dates
            </th>
            {Object.values(names).map((name, index) => (
              <th
                style={{ paddingLeft: "1rem", fontWeight: "700" }}
                className="flex-column sticky top-0"
                key={index}
              >
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
        {dates.slice().reverse().map((date, index) => (
            <tr key={index}>
              <td>{date}</td>
              {Object.keys(names).map((key, i) => (
                <React.Fragment key={i}>
                  <td>
                    <div>{graphData[key][dates.length - 1 - index] ? graphData[key][dates.length - 1 - index] : 'NA' }</div>
                    {!noComparison && (
                      <div className="w-[73px] h-[22px] justify-start items-center gap-0.5 inline-flex">
                        <div className="text-black/opacity-40 text-[10px] font-normal font-['Inter'] leading-snug">
                          {compList[key][dates.length - 1 - index] === "Infinity" ||
                          !compList[key][dates.length - 1 - index] ||
                          isNaN(compList[key][dates.length - 1 - index])
                            ? 0
                            : compList[key][dates.length - 1 - index]}
                        </div>
                        {
                          parseFloat(percList[key][dates.length - 1 - index]) >= 0 && (
                        <div className="w-[46px] h-[15.11px] px-[6.13px] py-[0.77px] bg-lime-50 rounded-xl border border-lime-200 justify-start items-center gap-[2.30px] flex">
                          <div className="text-lime-600 text-[9.20px] font-normal font-['Roboto'] leading-none">
                          {percList[key][dates.length - 1 - index] === "Infinity" ||
                          percList[key][dates.length - 1 - index] === "-Infinity" ||
                          !compList[key][dates.length - 1 - index] ||
                          isNaN(compList[key][dates.length - 1 - index])
                            ? 0
                            : parseFloat(percList[key][dates.length - 1 - index]) < 0
                            ? -1 * parseFloat(percList[key][dates.length - 1 - index])
                            : parseFloat(percList[key][dates.length - 1 - index])}
                          %{" "}
                          </div>
                        </div>
                          )
                        }
                        {
                          parseFloat(percList[key][dates.length - 1 - index]) < 0 && (
                            <div className="w-[41px] h-[15.11px] px-[6.13px] py-[0.77px] bg-orange-50 rounded-xl border border-red-300 justify-start items-center gap-[2.30px] flex">
                              <div className="w-[32.20px] text-orange-600 text-[9.20px] font-normal font-['Roboto'] leading-none">
                              {percList[key][dates.length - 1 - index] === "Infinity" ||
                              percList[key][dates.length - 1 - index] === "-Infinity" ||
                              !compList[key][dates.length - 1 - index] ||
                              isNaN(compList[key][dates.length - 1 - index])
                                ? 0
                                : parseFloat(percList[key][dates.length - 1 - index]) < 0
                                ? -1 * parseFloat(percList[key][dates.length - 1 - index])
                                : parseFloat(percList[key][dates.length - 1 - index])}
                              %{" "}
                              </div>
                            </div>
                              )
                        }
                      </div>
                    )}
                  </td>
                  {/* <td>{compList[key][index]}</td>
                  <td>{percList[key][index]}</td> */}
                </React.Fragment>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardTable;
