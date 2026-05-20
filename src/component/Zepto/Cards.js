import React, { useState, useEffect } from "react";
import PlusButton from "../common-components/button/PlusButton";
import DashboardGraph from "../flipkart/DashboadGraph";
import DashboardTable from "../flipkart/DashboardTable";
import Card from "../flipkart/Card";
import ZeptoSummaryViewPopup from "./ZeptoSummaryViewPopup";
import Toggle from "../common-components/toggle-button";
import { trackCard } from "../../analytics/EventController";
import IconToggleTabs from "../common-components/Tabs/IconToggleTabs";
import { Headerbtn } from "../common-components/headerButton/headerButton";
import { CSVDownload } from "react-csv";
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
  const [showPopup, setShowPopup] = useState(false);
  const [activeCards, setActiveCards] = useState([]);
  const [showPopupFile, setShowPopupFile] = useState("overview");
  const [overView, setOverView] = useState([]);
  const [awareness, setAwareness] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [errorMsg, setErrorMsg] = useState(false);
  const [isGraphVisible, setIsGraphVisible] = useState(true);
  const [performanceCard, setPerformanceCard] = useState([
    "spend_performance",
    "impressions_performance",
    "roas",
    "cpm",
    "revenues_performance",
    "orders"
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
      if (view.length !== 10) {
        return alert("Select at least 10 cards");
      }
      overView.view = view;
      setOverView({ ...overView });
      setErrorMsg(false);
      setShowPopup(false);
    } else if (cardName === "awareness") {
      if (view.length < 4) {
        setErrorMsg(true);
        return;
      }
      awareness.view = view;
      setOverView({ ...awareness });
      setShowPopup(false);
    } else if (cardName === "performance") {
      if (view.length < 4) {
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
  const generateCsvData = (data)=>{
    const { dates, names, compList, percList, ...fields } = data;

  // Reverse the dates array and process the data accordingly
  return dates.slice().reverse().map((date, index) => {
    const reverseIndex = dates.length - 1 - index;
    const row = { Date: date };

    // Add fields, compList data, and percList data
    Object.keys(fields).forEach(key => {
      if(names[key]){
        row[names[key]] = fields[key][reverseIndex] ? fields[key][reverseIndex] : 'NA';
  
        // If compList contains the key, add that data too
        if (compList[key] && !summary?.noComparison) {
          row[`Previous ${names[key]}`] = compList[key][reverseIndex] ? compList[key][reverseIndex] : 'NA';
        }
  
        // If percList contains the key, add that data too
        if (percList[key] && !summary?.noComparison) {
          row[`${names[key]} % Change`] = percList[key][reverseIndex] ? percList[key][reverseIndex] : 'NA';
        }
      }
    });

    return row;
  });
  
  }
  useEffect(() => {
    setOverView(summary?.overview);
    setAwareness(summary?.awareness);
    setPerformance(summary?.performance);
  }, [overView, summary, performance, awareness]);
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
    {
      download ? (<CSVDownload
      data={generateCsvData(graphData)}
      // headers={headers}
      filename={`sample_${Date.now()}.csv`}
    />) : ""
    }
      <div className="row ">
        <div className="col_9">
          <div className="row ">
            <div className="col_5 ">
              <h2 className="zeptoCard-title">Overview</h2>
              <div className="">
                <div className=" zepto__cardarea bg-[#E3DBEA] ">
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
                                <div
                                  key={key}
                                  className={[
                                    "p-2 col ",
                                    key >= 2 && "hidden",
                                  ].join(" ")}
                                >
                                  <Card
                                    cardKey={val}
                                    CardPercentage={card.last_val}
                                    cardtitle={card.name}
                                    currency={card.value}
                                    lastData={card.last_data}
                                    activeCard={graphActive}
                                    graphFilters={graphFilters}
                                    totalRawValue= {card?.totalValue}
                                    rawLastValue={card?.totalLastValue}
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
                        :Array(2)
                        ?.fill(0)
                        ?.map((_, index) => (
                          <div key={index} className="flex-1 mx-1.5 py-2">
                            <SkeletonDashCard gap="gap-[11px]"/>
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
            <div className="col_7">
              <h2 className="zeptoCard-title">Awareness</h2>
              <div>
                <div className=" zepto__cardarea bg-[#E3DBEA] ">
                  <div className="col">
                    <div className="row">
                      {awareness?.all
                        ? Object.keys(awareness?.all).map((val, key) => {
                            let card = awareness?.all[val];
                            if (awareness.view.indexOf(val) >= 0) {
                              let graphActive = false;
                              if (graphFilters.indexOf(val) > -1) {
                                graphActive = true;
                              }
                              return (
                                <div
                                  key={key}
                                  className={[
                                    "p-2 col ",
                                    key >= 5 && "hidden",
                                  ].join(" ")}
                                >
                                  <Card
                                    cardKey={val}
                                    CardPercentage={card.last_val}
                                    cardtitle={card.name}
                                    currency={card.value}
                                    lastData={card.last_data}
                                    activeCard={graphActive}
                                    totalRawValue= {card?.totalValue}
                                    rawLastValue={card?.totalLastValue}
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
                          <div key={index} className="flex-1 mx-1.5 py-2">
                            <SkeletonDashCard gap="gap-[11px]"/>
                          </div>
                        ))}
                    </div>
                  </div>
                  {/* <PlusButton
                    platform="zepto"
                    onClick={() => {
                      setShowPopup(true);
                      setShowPopupFile("awareness");
                    }}
                  /> */}
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <div className="flex justify-between items-center py-4 ">
              <div className="font-semibold text-lg">
                Graphical Analysis
              </div>
              <div className="flex justify-end mr-2  w-1/2">
                {/* <Toggle
                  label1={"Graph"}
                  label2={"Table"}
                  val={isGraphVisible}
                  setVal={setIsGraphVisibleValue}
                /> */}
                <IconToggleTabs
                isGraphVisible={isGraphVisible}
                setGraphVisible={setIsGraphVisible}
                cardColor="bg-[#3C006B]"
              />
              {
              !isGraphVisible && (
                <div className=" flex items-center -mt-4 justify-center">
                        <Headerbtn
                          disabled={download === 1}
                          imgsrc="/assets/images/hard-disk.png"
                          hoverImgSrc="/assets/images/hard-disk-white.svg"
                          // title={download === 1 ? "Downloading..." : "Export"}
                          style={{ width: "19px" }}
                          download={download}
                          onClick={handleDownload}
                          platform={'zepto'}
                        />
                      </div>
              )
            }
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
                component="zepto"
              />
            ): <div className="mx-16 mb-16 mt-2">
            <SkeletonChart height="h-48"/>
          </div>}
            {!isGraphVisible && (
              <DashboardTable
                graphData={graphData}
                noComparison={summary?.noComparison}
                component="zepto"
              />
            )}
          </div>
        </div>
        <div className="col_3 ">
          <div className="row ml-3 flex justify-between items-center flex-nowrap">
            <div className="col_5">
              {" "}
              <h2 className="zeptoCard-title ">Performance</h2>
            </div>
            <div className="pr-3" style={{
              position: 'relative'
            }}>
              <Toggle
                label1={"Absolute"}
                label2={"DRR"}
                val={val}
                setVal={setVal}
                platform="zepto"
              ></Toggle>
            </div>
          </div>
          <div className=" zepto__cardareaPer bg-[#E3DBEA] ">
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
                              "pt-2 pl-2 pr-1 col_6",
                              key >= 8 && "hidden",
                            ].join(" ")}
                          >
                            <Card
                              cardKey={val}
                              CardPercentage={card.last_val}
                              cardtitle={card.name}
                              currency={card.value}
                              lastData={card.last_data}
                              activeCard={graphActive}
                              totalRawValue= {card?.totalValue}
                              rawLastValue={card?.totalLastValue}
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
                    <div key={index} className="w-[44%] mx-2 mt-2">
                      <SkeletonDashCard gap="gap-[11px]"/>
                    </div>
                  ))}
              </div>
            </div>
            <div className="p-1.5"> 
              <PlusButton
                onClick={() => {
                  setShowPopup(true);
                  // setShowPopupFile("performance");
                  setShowPopupFile("performance");
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {showPopup && (
        <ZeptoSummaryViewPopup
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
          platform="zepto"
        />
      )}
    </>
  );
};

export default Cards;
