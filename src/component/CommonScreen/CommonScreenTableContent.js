import React from "react";
import BlinkitTable from "./Blinkittable";
import AmazonTable from "./AmazonTable";
import FlipkartTableCommonScreen from "./FlipkartTableCommonScreenC";
import ZeptoTable from "./ZeptoTable";
import InstamartTable from "./InstamartTable";
import TableFooterCommonScreen from "./TableFooterCommonScreen";

const CommonScreenTableContent = ({
  headers,
  platform,
  selectedMetric,
  graphFilters,
  setGraphFilters,
  amazonSummary,
  flipkartSummary,
  blinkitSummary,
  zeptoSummary,
  instamartSummary,
  allowedPlatforms,
  noComparison,
  loadingSummary = false,
}) => {
  const handleScroll = (e) => {
    const bottom =
      Math.abs(
        e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop
      ) < 1;
    if (bottom) {
      // Handle scrolling logic here (e.g., setDataLIMIT)
    }
  };

  const graphFilterHandler = (e) => {
    if (!graphFilters.includes(e)) {
      if (graphFilters.length >= 5) {
        let tempArray = graphFilters;
        tempArray.shift();
        setGraphFilters([...tempArray, e]);
      } else {
        setGraphFilters([...graphFilters, e]);
      }
    } else if (graphFilters.includes(e)) {
      let tempFilter = graphFilters;
      tempFilter.splice(graphFilters.indexOf(e), 1);
      setGraphFilters([...tempFilter]);
    }
  };
  return (
    <>
      <div className="bg-white max-h-[543px] px-2 py-3" onScroll={handleScroll}>
        <table className=" w-full ">
          <thead className="font-medium">
            <tr
              className={[
                "bg-slate-100 top-0 sticky z-20 ",
                platform === "ams" && "bg-[#F9F7EB]",
              ].join(" ")}
            >
              {headers?.map((item) => (
                <th
                  key={item.title}
                  className="flex-column py-3 px-1 text-sm font-medium p-2.5 "
                >
                  <div className="flex justify-center items-center">
                    <span className="pl-5 flex font-bold">
                      {item.title === "Metrics" ? selectedMetric : item.title}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* {CommonScreenTabledata.map((item, i) => (
              <tr>
                <td>
                  <div>
                    <img src={"/assets/images/Component.svg"} alt="" />
                  </div>
                </td>
                <td
                  onClick={() => {
                    setFilterName([...filterName, "flipkartspend"]);
                  }}
                  className={[
                    "cursor-pointer",
                    filterName.some((item) => item === "flipkartspend") && "",
                  ].join(" ")}
                >
                  <div className="text-lg font-semibold">{amazonSummary?.spend.value}</div>
                  <div className="row">
                    <div>
                      <div className="row text-xs font-normal">
                        ₹{amazonSummary?.spend.last_data}
                        {amazonSummary?.spend.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/down.svg" alt="" />
                          </div>
                        )}
                        <div>{amazonSummary?.spend.last_val}%</div>
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  onClick={() => {
                    setFilterName([...filterName, "flipkartsales"]);
                  }}
                  className={[
                    "cursor-pointer",
                    filterName.some((item) => item === "flipkartsales") &&
                      "bg-red-500",
                  ].join(" ")}
                >
                  <div className="text-lg font-semibold">{amazonSummary?.sales.value}</div>

                  <div className="row">
                    <div>
                      <div className="row text-xs font-normal">
                        ₹{amazonSummary?.sales.last_data}
                        {amazonSummary?.sales.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/down.svg" alt="" />
                          </div>
                        )}
                        {amazonSummary?.sales.last_val}%
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  onClick={() => {
                    setFilterName([...filterName, "flipkartorders"]);
                  }}
                  className={[
                    "cursor-pointer",
                    filterName.some((item) => item === "flipkartorders") &&
                      "bg-red-500",
                  ].join(" ")}
                >
                  <div className="text-lg font-semibold"> {amazonSummary?.units_sold.value}</div>
                  <div className="row">
                    <div>
                      <div className="row text-xs font-normal">
                        ₹{amazonSummary?.units_sold.last_data}
                        {amazonSummary?.units_sold.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/down.svg" alt="" />
                          </div>
                        )}
                        {amazonSummary?.units_sold.last_val}%
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  onClick={() => {
                    setFilterName([...filterName, "flipkartroas"]);
                  }}
                  className={[
                    "cursor-pointer",
                    filterName.some((item) => item === "flipkartroas") &&
                      "bg-red-500",
                  ].join(" ")}
                >
                  <div className="text-lg font-semibold"> {amazonSummary?.roas.value}</div>
                  <div className="row">
                    <div>
                      <div className="row text-xs font-normal">
                        ₹{amazonSummary?.roas.last_data}
                        {amazonSummary?.roas.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/down.svg" alt="" />
                          </div>
                        )}
                        {amazonSummary?.roas.last_val}%
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  onClick={() => {
                    setFilterName([...filterName, "flipkartimpressions"]);
                  }}
                  className={[
                    "cursor-pointer",
                    filterName.some((item) => item === "flipkartimpressions") &&
                      "bg-red-500",
                  ].join(" ")}
                >
                  <div className="text-lg font-semibold"> {amazonSummary?.impressions.value}</div>
                  <div className="row">
                    <div>
                      <div className="row text-xs font-normal">
                        ₹{amazonSummary?.impressions.last_data}
                        {amazonSummary?.impressions.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/down.svg" alt="" />
                          </div>
                        )}
                        {amazonSummary?.impressions.last_val}%
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  onClick={() => {
                    setFilterName([...filterName, "flipkartclicks"]);
                  }}
                  className={[
                    "cursor-pointer",
                    filterName.some((item) => item === "flipkartclicks") &&
                      "bg-red-500",
                  ].join(" ")}
                >
                  <div className="text-lg font-semibold"> {amazonSummary?.clicks.value}</div>
                  <div className="row">
                    <div>
                      <div className="row text-xs font-normal">
                        ₹{amazonSummary?.clicks.last_data}
                        {amazonSummary?.clicks.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/down.svg" alt="" />
                          </div>
                        )}
                        {amazonSummary?.clicks.last_val}%
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  onClick={() => {
                    setFilterName([...filterName, "flipkartctr"]);
                  }}
                  className={[
                    "cursor-pointer",
                    filterName.some((item) => item === "flipkartctr") &&
                      "bg-red-500",
                  ].join(" ")}
                >
                  <div className="text-lg font-semibold"> {amazonSummary?.ctr.value}</div>
                  <div className="row">
                    <div>
                      <div className="row text-xs font-normal">
                        ₹{amazonSummary?.ctr.last_data}
                        {amazonSummary?.ctr.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/down.svg" alt="" />
                          </div>
                        )}
                        {amazonSummary?.ctr.last_val}%
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  onClick={() => {
                    setFilterName([...filterName, "flipkartcpc"]);
                  }}
                  className={[
                    "cursor-pointer",
                    filterName.some((item) => item === "flipkartcpc") &&
                      "bg-red-500",
                  ].join(" ")}
                >
                  <div className="text-lg font-semibold">{amazonSummary?.cpc.value}</div>
                  <div className="row">
                    <div>
                      <div className="row text-xs font-normal">
                        {" "}
                        ₹{amazonSummary?.cpc.last_data}
                        {amazonSummary?.cpc.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/down.svg" alt="" />
                          </div>
                        )}
                        {amazonSummary?.cpc.last_val}%
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))} */}
            {allowedPlatforms && allowedPlatforms?.includes("amazon") && (
              <AmazonTable
                filterName={graphFilters}
                setFilterName={setGraphFilters}
                onClick={graphFilterHandler}
                amazonSummary={amazonSummary}
                noComparison={noComparison}
                loadingSummary={loadingSummary}
              />
            )}

            {allowedPlatforms && allowedPlatforms?.includes("flipkart") && (
              <FlipkartTableCommonScreen
                filterName={graphFilters}
                setFilterName={setGraphFilters}
                onClick={graphFilterHandler}
                flipkartSummary={flipkartSummary}
                noComparison={noComparison}
                loadingSummary={loadingSummary}
              />
            )}

            {allowedPlatforms && allowedPlatforms?.includes("blinkit") && (
              <BlinkitTable
                filterName={graphFilters}
                setFilterName={setGraphFilters}
                onClick={graphFilterHandler}
                blinkitSummary={blinkitSummary}
                noComparison={noComparison}
                loadingSummary={loadingSummary}
              />
            )}
            {allowedPlatforms && allowedPlatforms?.includes("zepto") && (
              <ZeptoTable
                filterName={graphFilters}
                setFilterName={setGraphFilters}
                onClick={graphFilterHandler}
                noComparison={noComparison}
                zeptoSummary={zeptoSummary}
                loadingSummary={loadingSummary}
              />
            )}
            {allowedPlatforms && allowedPlatforms?.includes("instamart") && (
              <InstamartTable
                filterName={graphFilters}
                setFilterName={setGraphFilters}
                onClick={graphFilterHandler}
                noComparison={noComparison}
                instamartSummary={instamartSummary}
                loadingSummary={loadingSummary}
              />
            )}

            {/* {CommonScreenZeptoTabledata.map((item, i) => (
              <tr>
                <td>
                  <div>
                    <img src={item.image} alt="" />
                  </div>
                </td>
                <td
                  onClick={() => {
                    setFilterName([...filterName, "zeptospend"]);
                  }}
                  className={[
                    "cursor-pointer",
                    filterName.some((item) => item === "zeptospend") && "",
                  ].join(" ")}
                >
                  <div className="text-lg font-semibold">{item.spend}</div>
                  <div className="row">
                    <div>
                      <div className="row text-xs font-normal">
                        ₹{item.rise}
                        {item.rise >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/down.svg" alt="" />
                          </div>
                        )}
                        <div>{item.percentage}</div>
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  onClick={() => {
                    setFilterName([...filterName, "zeptosales"]);
                  }}
                  className={[
                    "cursor-pointer",
                    filterName.some((item) => item === "zeptosales") &&
                      "bg-red-500",
                  ].join(" ")}
                >
                  <div className="text-lg font-semibold">{item.sales}</div>

                  <div className="row">
                    <div>
                      <div className="row text-xs font-normal">
                        ₹{item.rise}
                        {item.rise >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/down.svg" alt="" />
                          </div>
                        )}
                        {item.percentage}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  onClick={() => {
                    setFilterName([...filterName, "zeptorevenue"]);
                  }}
                  className={[
                    "cursor-pointer",
                    filterName.some((item) => item === "zeptorevenue") &&
                      "bg-red-500",
                  ].join(" ")}
                >
                  <div className="text-lg font-semibold"> {item.revenue}</div>
                  <div className="row">
                    <div>
                      <div className="row text-xs font-normal">
                        ₹{item.rise}
                        {item.rise >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/down.svg" alt="" />
                          </div>
                        )}
                        {item.percentage}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  onClick={() => {
                    setFilterName([...filterName, "zeptoorders"]);
                  }}
                  className={[
                    "cursor-pointer",
                    filterName.some((item) => item === "zeptoorders") &&
                      "bg-red-500",
                  ].join(" ")}
                >
                  <div className="text-lg font-semibold"> {item.orders}</div>
                  <div className="row">
                    <div>
                      <div className="row text-xs font-normal">
                        ₹{item.rise}
                        {item.rise >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/down.svg" alt="" />
                          </div>
                        )}
                        {item.percentage}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  onClick={() => {
                    setFilterName([...filterName, "zeptoroas"]);
                  }}
                  className={[
                    "cursor-pointer",
                    filterName.some((item) => item === "zeptoroas") &&
                      "bg-red-500",
                  ].join(" ")}
                >
                  <div className="text-lg font-semibold"> {item.roas}</div>
                  <div className="row">
                    <div>
                      <div className="row text-xs font-normal">
                        ₹{item.rise}
                        {item.rise >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/down.svg" alt="" />
                          </div>
                        )}
                        {item.percentage}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  onClick={() => {
                    setFilterName([...filterName, "zeptoscr"]);
                  }}
                  className={[
                    "cursor-pointer",
                    filterName.some((item) => item === "zeptoscr") &&
                      "bg-red-500",
                  ].join(" ")}
                >
                  <div className="text-lg font-semibold"> {item.scr}</div>
                  <div className="row">
                    <div>
                      <div className="row text-xs font-normal">
                        ₹{item.rise}
                        {item.rise >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/down.svg" alt="" />
                          </div>
                        )}
                        {item.percentage}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  onClick={() => {
                    setFilterName([...filterName, "zeptoaov"]);
                  }}
                  className={[
                    "cursor-pointer",
                    filterName.some((item) => item === "zeptoaov") &&
                      "bg-red-500",
                  ].join(" ")}
                >
                  <div className="text-lg font-semibold"> {item.aov}</div>
                  <div className="row">
                    <div>
                      <div className="row text-xs font-normal">
                        ₹{item.rise}
                        {item.rise >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/down.svg" alt="" />
                          </div>
                        )}
                        {item.percentage}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  onClick={() => {
                    setFilterName([...filterName, "zeptoctr"]);
                  }}
                  className={[
                    "cursor-pointer",
                    filterName.some((item) => item === "zeptoorders") &&
                      "bg-red-500",
                  ].join(" ")}
                >
                  <div className="text-lg font-semibold">{item.ctr}</div>
                  <div className="row">
                    <div>
                      <div className="row text-xs font-normal">
                        {" "}
                        ₹{item.rise}
                        {item.rise >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/down.svg" alt="" />
                          </div>
                        )}
                        {item.percentage}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))} */}
            {/* {CommonScreenBlinkiTabledata.map((item, i) => (
              <tr>
                <td>
                  <div>
                    <img src={item.image} alt="" />
                  </div>
                </td>
                <td
                  onClick={() => {
                    setFilterName([...filterName, "blinkitspend"]);
                  }}
                  className={[
                    "cursor-pointer",
                    filterName.some((item) => item === "blinkitspend") && "",
                  ].join(" ")}
                >
                  <div className="text-lg font-semibold">{item.spend}</div>
                  <div className="row">
                    <div>
                      <div className="row text-xs font-normal">
                        ₹{item.rise}
                        {item.rise >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/down.svg" alt="" />
                          </div>
                        )}
                        <div>{item.percentage}</div>
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  onClick={() => {
                    setFilterName([...filterName, "blinkitsales"]);
                  }}
                  className={[
                    "cursor-pointer",
                    filterName.some((item) => item === "blinkitsales") &&
                      "bg-red-500",
                  ].join(" ")}
                >
                  <div className="text-lg font-semibold">{item.sales}</div>

                  <div className="row">
                    <div>
                      <div className="row text-xs font-normal">
                        ₹{item.rise}
                        {item.rise >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/down.svg" alt="" />
                          </div>
                        )}
                        {item.percentage}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  onClick={() => {
                    setFilterName([...filterName, "blinkitrevenue"]);
                  }}
                  className={[
                    "cursor-pointer",
                    filterName.some((item) => item === "blinkitrevenue") &&
                      "bg-red-500",
                  ].join(" ")}
                >
                  <div className="text-lg font-semibold"> {item.revenue}</div>
                  <div className="row">
                    <div>
                      <div className="row text-xs font-normal">
                        ₹{item.rise}
                        {item.rise >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/down.svg" alt="" />
                          </div>
                        )}
                        {item.percentage}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  onClick={() => {
                    setFilterName([...filterName, "blinkitorders"]);
                  }}
                  className={[
                    "cursor-pointer",
                    filterName.some((item) => item === "blinkitorders") &&
                      "bg-red-500",
                  ].join(" ")}
                >
                  <div className="text-lg font-semibold"> {item.orders}</div>
                  <div className="row">
                    <div>
                      <div className="row text-xs font-normal">
                        ₹{item.rise}
                        {item.rise >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/down.svg" alt="" />
                          </div>
                        )}
                        {item.percentage}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  onClick={() => {
                    setFilterName([...filterName, "blinkitroas"]);
                  }}
                  className={[
                    "cursor-pointer",
                    filterName.some((item) => item === "blinkitroas") &&
                      "bg-red-500",
                  ].join(" ")}
                >
                  <div className="text-lg font-semibold"> {item.roas}</div>
                  <div className="row">
                    <div>
                      <div className="row text-xs font-normal">
                        ₹{item.rise}
                        {item.rise >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/down.svg" alt="" />
                          </div>
                        )}
                        {item.percentage}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  onClick={() => {
                    setFilterName([...filterName, "blinkitscr"]);
                  }}
                  className={[
                    "cursor-pointer",
                    filterName.some((item) => item === "blinkitscr") &&
                      "bg-red-500",
                  ].join(" ")}
                >
                  <div className="text-lg font-semibold"> {item.scr}</div>
                  <div className="row">
                    <div>
                      <div className="row text-xs font-normal">
                        ₹{item.rise}
                        {item.rise >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/down.svg" alt="" />
                          </div>
                        )}
                        {item.percentage}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  onClick={() => {
                    setFilterName([...filterName, "blinkitaov"]);
                  }}
                  className={[
                    "cursor-pointer",
                    filterName.some((item) => item === "blinkitaov") &&
                      "bg-red-500",
                  ].join(" ")}
                >
                  <div className="text-lg font-semibold"> {item.aov}</div>
                  <div className="row">
                    <div>
                      <div className="row text-xs font-normal">
                        ₹{item.rise}
                        {item.rise >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/down.svg" alt="" />
                          </div>
                        )}
                        {item.percentage}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  onClick={() => {
                    setFilterName([...filterName, "blinkitctr"]);
                  }}
                  className={[
                    "cursor-pointer",
                    filterName.some((item) => item === "blinkitorders") &&
                      "bg-red-500",
                  ].join(" ")}
                >
                  <div className="text-lg font-semibold">{item.ctr}</div>
                  <div className="row">
                    <div>
                      <div className="row text-xs font-normal">
                        {" "}
                        ₹{item.rise}
                        {item.rise >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/down.svg" alt="" />
                          </div>
                        )}
                        {item.percentage}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))} */}
          </tbody>
          <tfoot>
            {/* {CommonScreenTablefooterdata.map((item, i) => (
              <tr>
                <td>
                  <div className="text-[20px] font-semibold">Total</div>
                </td>

                <td
                  onClick={() => {
                    setFilterName([...filterName, "totalspend"]);
                  }}
                  className={[
                    "cursor-pointer",
                    filterName.some((item) => item === "totalspend") && "",
                  ].join(" ")}
                >
                  <div className="text-lg font-semibold">{item.spend}</div>
                  <div className="row">
                    <div>
                      <div className="row text-xs font-normal">
                        ₹{item.rise}
                        {item.rise >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/down.svg" alt="" />
                          </div>
                        )}
                        <div>{item.percentage}</div>
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  onClick={() => {
                    setFilterName([...filterName, "totalsales"]);
                  }}
                  className={[
                    "cursor-pointer",
                    filterName.some((item) => item === "totalsales") && "",
                  ].join(" ")}
                >
                  <div className="text-lg font-semibold">{item.sales}</div>

                  <div className="row">
                    <div>
                      <div className="row text-xs font-normal">
                        ₹{item.rise}
                        {item.rise >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/down.svg" alt="" />
                          </div>
                        )}
                        {item.percentage}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  onClick={() => {
                    setFilterName([...filterName, "totalrevenue"]);
                  }}
                  className={[
                    "cursor-pointer",
                    filterName.some((item) => item === "totalrevenue") && "",
                  ].join(" ")}
                >
                  <div className="text-lg font-semibold"> {item.revenue}</div>
                  <div className="row">
                    <div>
                      <div className="row text-xs font-normal">
                        ₹{item.rise}
                        {item.rise >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/down.svg" alt="" />
                          </div>
                        )}
                        {item.percentage}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  onClick={() => {
                    setFilterName([...filterName, "totalorders"]);
                  }}
                  className={[
                    "cursor-pointer",
                    filterName.some((item) => item === "totalorders") && "",
                  ].join(" ")}
                >
                  <div className="text-lg font-semibold"> {item.orders}</div>
                  <div className="row">
                    <div>
                      <div className="row text-xs font-normal">
                        ₹{item.rise}
                        {item.rise >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/down.svg" alt="" />
                          </div>
                        )}
                        {item.percentage}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  onClick={() => {
                    setFilterName([...filterName, "totalroas"]);
                  }}
                  className={[
                    "cursor-pointer",
                    filterName.some((item) => item === "totalroas") && "",
                  ].join(" ")}
                >
                  <div className="text-lg font-semibold"> {item.roas}</div>
                  <div className="row">
                    <div>
                      <div className="row text-xs font-normal">
                        ₹{item.rise}
                        {item.rise >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/down.svg" alt="" />
                          </div>
                        )}
                        {item.percentage}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  onClick={() => {
                    setFilterName([...filterName, "totalscr"]);
                  }}
                  className={[
                    "cursor-pointer",
                    filterName.some((item) => item === "totalscr") && "",
                  ].join(" ")}
                >
                  <div className="text-lg font-semibold"> {item.scr}</div>
                  <div className="row">
                    <div>
                      <div className="row text-xs font-normal">
                        ₹{item.rise}
                        {item.rise >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/down.svg" alt="" />
                          </div>
                        )}
                        {item.percentage}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  onClick={() => {
                    setFilterName([...filterName, "totalaov"]);
                  }}
                  className={[
                    "cursor-pointer",
                    filterName.some((item) => item === "totalaov") && "",
                  ].join(" ")}
                >
                  <div className="text-lg font-semibold"> {item.aov}</div>
                  <div className="row">
                    <div>
                      <div className="row text-xs font-normal">
                        ₹{item.rise}
                        {item.rise >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/down.svg" alt="" />
                          </div>
                        )}
                        {item.percentage}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  onClick={() => {
                    setFilterName([...filterName, "totalctr"]);
                  }}
                  className={[
                    "cursor-pointer",
                    filterName.some((item) => item === "totalctr") && "",
                  ].join(" ")}
                >
                  <div className="text-lg font-semibold">{item.ctr}</div>
                  <div className="row">
                    <div>
                      <div className="row text-xs font-normal">
                        {" "}
                        ₹{item.rise}
                        {item.rise >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/down.svg" alt="" />
                          </div>
                        )}
                        {item.percentage}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))} */}
            <TableFooterCommonScreen
              filterName={graphFilters}
              setFilterName={setGraphFilters}
              onClick={graphFilterHandler}
              amazonSummary={amazonSummary}
              flipkartSummary={flipkartSummary}
              blinkitSummary={blinkitSummary}
              zeptoSummary={zeptoSummary}
              instamartSummary={instamartSummary}
              allowedPlatforms={allowedPlatforms}
              noComparison={noComparison}
              loadingSummary={loadingSummary}
            />
          </tfoot>
        </table>
      </div>
    </>
  );
};

export default CommonScreenTableContent;
