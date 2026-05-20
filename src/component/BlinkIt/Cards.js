import React, { useState, useEffect } from "react";
import PlusButton from "../common-components/button/PlusButton";
import DashboardGraph from "../flipkart/DashboadGraph";
import DashboardTable from "../flipkart/DashboardTable";
import Card from "../flipkart/Card";
import BlinkitSummaryViewPopup from "./BlinkitSummaryViewPopup";
import Toggle from "../common-components/toggle-button";
import { trackCard } from "../../analytics/EventController";
import IconToggleTabs from "../common-components/Tabs/IconToggleTabs";
import { useSelector } from "react-redux";
import { CSVDownload } from "react-csv";
import { Headerbtn } from "../common-components/headerButton/headerButton";
import SkeletonDashCard from "../common-components/loader/SkeletonDashCard";
import SkeletonChart from "../common-components/loader/SkeletonChart";
// import DashboardGraph from "./DashboadGraph";
// import SummaryViewPopup from "./SummaryViewPopup";

const Cards = ({
  summary,
  graphFilters,
  setGraphFilters,
  state,
  graphData,
  val,
  setVal,
}) => {
  const { expandState } = useSelector((state) => state?.SideBarReducer);
  const [showPopup, setShowPopup] = useState(false);
  const [activeCards, setActiveCards] = useState([]);
  const [showPopupFile, setShowPopupFile] = useState("overview");
  const [overView, setOverView] = useState([]);
  const [reach, setReach] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [errorMsg, setErrorMsg] = useState(false);
  const [isGraphVisible, setIsGraphVisible] = useState(true);
  const [performanceCard, setPerformanceCard] = useState([
    "estimated_budget_consumed_performance",
    "total_sales_performance",
    "total_quantities_sold_performance",
    "impressions_performance",
    "roas_performance",
    "cpm_performance",
  ]);
  const [download, setDownload] = useState(0);
  const graphFilterHandler = (e) => {
    if (!graphFilters.includes(e)) {
      if (graphFilters.length >= 4) {
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
    // console.log("graphfilters",graphFilters);
  };

  // function setIsGraphVisibleValue() {
  //   setIsGraphVisible(!isGraphVisible);
  // }

  // console.log("graphfilters" ,graphFilters);
  function updateCards(view, cardName) {
    // console.log(summary[cardName], "summary[cardName]");
    // alert("etst");
    if (cardName === "overview") {
      if (view.length < 2 || view.length > 3) {
        setErrorMsg(true);
        return;
      }
      overView.view = view;
      setOverView({ ...overView });
      setErrorMsg(false);
      setShowPopup(false);
    } else if (cardName === "reach") {
      if (view.length < 2 || view.length > 3) {
        setErrorMsg(true);
        return;
      }
      reach.view = view;
      setOverView({ ...reach });
      setShowPopup(false);
    } else if (cardName === "performance") {
      if (view.length < 4 || view.length > 6) {
        setErrorMsg(true);
        return;
      }
      performance.view = view;
      setPerformanceCard(view);
      setOverView({ ...performance });
      setShowPopup(false);
    }
    if (graphFilters.length === 0) {
      setGraphFilters([overView.view[0]]);
    }
  }
  const generateCsvData = (data) => {
    const { dates, names, compList, percList, ...fields } = data;

    // Reverse the dates array and process the data accordingly
    return dates
      .slice()
      .reverse()
      .map((date, index) => {
        const reverseIndex = dates.length - 1 - index;
        const row = { Date: date };

        // Add fields, compList data, and percList data
        Object.keys(fields).forEach((key) => {
          if (names[key]) {
            row[names[key]] = fields[key][reverseIndex]
              ? fields[key][reverseIndex]
              : "NA";

            // If compList contains the key, add that data too
            if (compList[key] && !summary?.noComparison) {
              row[`Previous ${names[key]}`] = compList[key][reverseIndex]
                ? compList[key][reverseIndex]
                : "NA";
            }

            // If percList contains the key, add that data too
            if (percList[key] && !summary?.noComparison) {
              row[`${names[key]} % Change`] = percList[key][reverseIndex]
                ? percList[key][reverseIndex]
                : "NA";
            }
          }
        });

        return row;
      });
  };
  useEffect(() => {
    setOverView(summary?.overview);
    setReach(summary?.reach);
    setPerformance(summary?.performance);
  }, [overView, summary, performance, reach]);
  useEffect(() => {}, [graphData]);
  useEffect(() => {
    // console.log("isGraphVisible changed:", isGraphVisible);
  }, [isGraphVisible]);
  const handleDownload = () => {
    setDownload(1);
    setTimeout(() => {
      setDownload(0);
    }, 1000);
  };

  return (
    <>
      {download ? (
        <CSVDownload
          data={generateCsvData(graphData)}
          // headers={headers}
          filename={`sample_${Date.now()}.csv`}
        />
      ) : (
        ""
      )}
      <div className="row">
        <div className="col_9">
          <div className="row ">
            <div className="col_6">
              <h2 className="blinkitCard-title">Overview</h2>
              <div>
                <div className=" blinkit__cardarea">
                  <div className="col">
                    <div className="row !flex-nowrap">
                      {overView?.all
                        ? Object.keys(overView?.all).map((val, key) => {
                            let card = overView?.all[val];
                            if (overView.view.indexOf(val) >= 0) {
                              let graphActive = false;
                              if (graphFilters.indexOf(val) > -1) {
                                graphActive = true;
                              }
                              return (
                                <div
                                  key={key}
                                  className={[
                                    "p-1 col ",
                                    key >= 16 && "hidden",
                                  ].join(" ")}
                                >
                                  <Card
                                    cardKey={val}
                                    CardPercentage={card.last_val}
                                    cardtitle={card.name}
                                    currency={card.value}
                                    totalRawValue={card?.totalValue}
                                    rawLastValue={card?.totalLastValue}
                                    lastData={card.last_data}
                                    activeCard={graphActive}
                                    graphFilters={graphFilters}
                                    onClick={() => {
                                      graphFilterHandler(val);
                                      trackCard(card.name);
                                    }}
                                    noComparison={summary?.noComparison}
                                  />
                                </div>
                              );
                            }
                          })
                        : Array(3)
                            ?.fill(0)
                            ?.map((_, index) => (
                              <div key={index} className="flex-1 mx-1 py-1">
                                <SkeletonDashCard gap="gap-[11px]"/>
                              </div>
                            ))}
                    </div>
                  </div>
                  <PlusButton
                    className="plusbtnblinkit"
                    onClick={() => {
                      setShowPopup(true);
                      setShowPopupFile("overview");
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col_6">
              <h2 className="blinkitCard-title">Reach</h2>
              <div>
                <div className=" blinkit__cardarea bg-[#DBF3EB] ">
                  <div className="col">
                    <div className="row">
                      {}
                      {reach?.all
                        ? Object.keys(reach?.all).map((val, key) => {
                            let card = reach?.all[val];
                            if (reach.view.indexOf(val) >= 0) {
                              let graphActive = false;
                              if (graphFilters.indexOf(val) > -1) {
                                graphActive = true;
                              }
                              return (
                                <div
                                  key={key}
                                  className={[
                                    "p-1 col ",
                                    key >= 16 && "hidden",
                                  ].join(" ")}
                                >
                                  <Card
                                    cardKey={val}
                                    CardPercentage={card.last_val}
                                    cardtitle={card.name}
                                    currency={card.value}
                                    totalRawValue={card?.totalValue}
                                    rawLastValue={card?.totalLastValue}
                                    lastData={card.last_data}
                                    activeCard={graphActive}
                                    graphFilters={graphFilters}
                                    onClick={() => {
                                      graphFilterHandler(val);
                                      trackCard(card.name);
                                    }}
                                    noComparison={summary?.noComparison}
                                  />
                                </div>
                              );
                            }
                          })
                        : Array(3)
                            ?.fill(0)
                            ?.map((_, index) => (
                              <div key={index} className="flex-1 mx-1 py-1">
                                <SkeletonDashCard gap="gap-[11px]"/>
                              </div>
                            ))}
                    </div>
                  </div>
                  <PlusButton
                    platform="blinkit"
                    onClick={() => {
                      setShowPopup(true);
                      setShowPopupFile("reach");
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* <div className="col_7"> */}
          <div className="mb-4">
            <div className="flex justify-between items-center py-4">
              <div className=" font-semibold text-lg">Graphical Analysis</div>
              <div className="flex justify-end mr-2 w-1/2">
                {/* <Toggle
                  label1={"Graph"}
                  label2={"Table"}
                  val={isGraphVisible}
                  setVal={setIsGraphVisibleValue}
                /> */}
                <IconToggleTabs
                  isGraphVisible={isGraphVisible}
                  setGraphVisible={setIsGraphVisible}
                  cardColor="bg-[#11B07A]"
                />
                {!isGraphVisible && (
                  <div className=" flex items-center -mt-4 justify-center">
                    <Headerbtn
                      disabled={download === 1}
                      imgsrc="/assets/images/hard-disk.png"
                      hoverImgSrc="/assets/images/hard-disk-white.svg"
                      // title={download === 1 ? "Downloading..." : "Export"}
                      style={{ width: "19px" }}
                      download={download}
                      onClick={handleDownload}
                      platform={"blinkit"}
                    />
                  </div>
                )}
              </div>
            </div>
            {Object.keys(graphData)?.length>0 ? (
              <DashboardGraph
                activeCards={activeCards}
                setActiveCards={setActiveCards}
                graphFilters={graphFilters}
                setGraphFilters={setGraphFilters}
                graphData={graphData}
                state={state}
                noComparison={summary?.noComparison}
                component={"blinkit"}
              />
            ):<div className="mx-16 mt-2 mb-20">
            <SkeletonChart />
          </div>}
            {!isGraphVisible && (
              <DashboardTable
                graphData={graphData}
                noComparison={summary?.noComparison}
                component="blinkit"
              />
            )}
          </div>
        </div>
        <div className="col_3">
          <div className="row flex justify-between">
            <div className="">
              {" "}
              <h2 className="blinkitCard-title ">Performance</h2>
            </div>
            <div className="flex items-center">
              <Toggle
                label1={"Absolute"}
                label2={"DRR"}
                val={val}
                setVal={setVal}
                platform="blinkit"
                className={
                  expandState
                    ? "!w-[110px] duration-700 delay-100"
                    : "delay-100 transition-all duration-700"
                }
              ></Toggle>
            </div>
          </div>

          <div className="blinkitperformance pb-1">
            <div className="col">
              <div className="row">
                {performance?.all
                  ? Object.keys(performance?.all).map((val, key) => {
                      let card = performance?.all[val];
                      if (
                        performance.view.indexOf(val) >= 0 &&
                        performanceCard.includes(val)
                      ) {
                        let graphActive = false;
                        if (graphFilters.indexOf(val) > -1) {
                          graphActive = true;
                        }
                        return (
                          <div
                            key={key}
                            className={[
                              "p-1.5 col_6 ",
                              key >= 16 && "hidden",
                            ].join(" ")}
                          >
                            <Card
                              cardKey={val}
                              CardPercentage={card.last_val}
                              cardtitle={card.name}
                              currency={card.value}
                              lastData={card.last_data}
                              totalRawValue={card?.totalValue}
                              rawLastValue={card?.totalLastValue}
                              activeCard={graphActive}
                              graphFilters={graphFilters}
                              onClick={() => {
                                graphFilterHandler(val);
                                trackCard(card.name);
                              }}
                              noComparison={summary?.noComparison}
                            />
                          </div>
                        );
                      }
                    })
                  : Array(6)
                      ?.fill(0)
                      ?.map((_, index) => (
                        <div key={index} className="w-[47%] mx-1 py-1">
                          <SkeletonDashCard gap="gap-[11px]"/>
                        </div>
                      ))}
              </div>
            </div>
            <PlusButton
              onClick={() => {
                setShowPopup(true);
                // setShowPopupFile("performance");
                setShowPopupFile("performance");
              }}
              platform={"blinkit"}
            />
          </div>
        </div>
      </div>
      {showPopup && (
        <BlinkitSummaryViewPopup
          summaryOf={showPopupFile}
          showPopup={showPopup}
          setShowPopup={setShowPopup}
          viewData={summary[showPopupFile]?.view}
          allData={summary[showPopupFile]?.all}
          updateCards={updateCards}
          cardName={showPopupFile}
          graphFilters={graphFilters}
          setGraphFilters={setGraphFilters}
          error={errorMsg}
          platform="blinkit"
        />
      )}
    </>
  );
};

export default Cards;
