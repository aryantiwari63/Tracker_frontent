import React, { useState, useEffect } from "react";
import DashboardGraph from "../flipkart/DashboadGraph";
import DashboardTable from "../flipkart/DashboardTable";
import Card from "../flipkart/Card";
// import ZeptoSummaryViewPopup from "./ZeptoSummaryViewPopup";
import Toggle from "../common-components/toggle-button";
import { trackCard } from "../../analytics/EventController";
import IconToggleTabs from "../common-components/Tabs/IconToggleTabs";
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
  const [activeCards, setActiveCards] = useState([]);
  const [overView, setOverView] = useState([]);

  const [isGraphVisible, setIsGraphVisible] = useState(true);
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

  // function setIsGraphVisibleValue() {
  //   setIsGraphVisible(!isGraphVisible);
  // }

  // console.log("graphfilters" ,graphFilters);
  useEffect(() => {
    setOverView(summary?.overview);
  }, [overView, summary]);
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

  // Hardcoded card titles

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
      <div className="row ">
        <div className="col_9 w-[100%] ">
          <div className="row  flex w-[100%]">
            <div className="col_5  w-[100%] ">
              <div className="flex items-center">
                <h2 className="zeptoCard-title text-[22px]  w-[100%]">
                  Overview
                </h2>
                {/* <div className="col_6"> */}
                <Toggle
                  label1={"Absolute"}
                  label2={"DRR"}
                  val={val}
                  setVal={setVal}
                  platform="instamart"
                ></Toggle>
                {/* </div> */}
              </div>

              <div className="">
                <div className=" insta__cardarea  ">
                  <div className="col">
                    <div className="row">
                      {overView?.all
                        ? Object.keys(overView?.all).map((val, key) => {
                            let card = overView?.all[val];

                            if (overView.view.indexOf(val) >= 0) {
                              let graphActive = false;
                              if (graphFilters.indexOf(val) > -1) {
                                graphActive = true;
                              }
                              return (
                                <>
                                  {" "}
                                  <div
                                    key={key}
                                    className={["p-2 col "].join(" ")}
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
                                      platform="instamart"
                                    />
                                  </div>
                                </>
                              );
                            }
                          })
                        : Array(5)
                            ?.fill(0)
                            ?.map((_, index) => (
                              <div key={index} className="flex-1 mx-2 py-1">
                                <SkeletonDashCard />
                              </div>
                            ))}
                    </div>
                  </div>
                  {/* <PlusButton
            className="plusbtnblinkit"
              onClick={() => {
                setShowPopup(true);
                setShowPopupFile("overview");
                
              }}
            /> */}
                </div>
              </div>
            </div>
            {/* <div className="  h-10 ">
              <div className="row ml-3 flex justify-between ">
                <div className="col_6">
                  <Toggle
                    label1={"Absolute"}
                    label2={"DRR"}
                    val={val}
                    setVal={setVal}
                    platform="zepto"
                  ></Toggle>
                </div>
              </div>
            </div> */}
          </div>
          <div className="px-2  w-[100%] ">
            <div className="flex justify-between items-center  py-4">
              <div className=" font-semibold text-lg">Graphical Analysis</div>
              <div className="flex justify-end mr-2 w-1/2">
                {/* <Toggle
                  label1={"Graph"}
                  label2={"Table"}
                  val={isGraphVisible}
                  setVal={setIsGraphVisibleValue}
                  platform="instamart"
                /> */}
                <IconToggleTabs
                  isGraphVisible={isGraphVisible}
                  setGraphVisible={setIsGraphVisible}
                  cardColor="bg-[#851853]"
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
                      platform={"instamart"}
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
              />
            ) : (
              <div className="mx-16 mt-2 mb-[66px]">
                <SkeletonChart height="h-56"/>
              </div>
            )}
            {!isGraphVisible && (
              <DashboardTable
                graphData={graphData}
                noComparison={summary?.noComparison}
                component="instamart"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Cards;
