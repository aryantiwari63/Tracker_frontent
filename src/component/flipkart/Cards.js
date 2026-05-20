import React, { useState, useEffect } from "react";
import PlusButton from "../common-components/button/PlusButton";
import Card from "./Card";
import DashboardGraph from "./DashboadGraph";
import DashboardTable from "./DashboardTable";
import SummaryViewPopup from "./SummaryViewPopup";
import ToggleButton from "../common-components/toggle-button";
import { trackCard } from "../../analytics/EventController";
import IconToggleTabs from "../common-components/Tabs/IconToggleTabs";
import { Headerbtn } from "../common-components/headerButton/headerButton";
import { CSVDownload } from "react-csv";
import SkeletonDashCard from "../common-components/loader/SkeletonDashCard";
import SkeletonChart from "../common-components/loader/SkeletonChart";

const Cards = ({
  summary,
  graphFilters,
  setGraphFilters,
  graphData,
  state,
  val,
  setVal,
}) => {
  // console.log(summary, "summary");
  const [showPopup, setShowPopup] = useState(false);
  const [activeCards, setActiveCards] = useState([]);
  const [showPopupFile, setShowPopupFile] = useState("overview");
  const [overView, setOverView] = useState([]);
  const [direct, setDirect] = useState([]);
  const [indirect, setIndirect] = useState([]);
  const [errorMsg, setErrorMsg] = useState(false);
  const [isGraphVisible, setIsGraphVisible] = useState(true);
  const [download, setDownload] = useState(0);
  // const [CsvData,setCsvData] = useState([])
  // const [CsvHeader,setCsvHeader] = useState([])
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
    // console.log(graphFilters, "graphFilters", e);
  };
  // function setIsGraphVisibleValue() {
  //   setIsGraphVisible(!isGraphVisible);
  // }

  function updateCards(view, cardName) {
    // console.log(summary[cardName], "summary[cardName]");
    if (cardName === "overview") {
      if (view.length !== 10) {
        setErrorMsg(true);
        return;
      } else {
        setErrorMsg(false);
      }
      overView.view = view;
      setOverView({ ...overView });
      setShowPopup(false);
      setErrorMsg(false);
    } else if (cardName === "direct") {
      if (view.length !== 4) {
        setErrorMsg(true);
        return;
      }
      direct.view = view;
      setOverView({ ...direct });
      setShowPopup(false);
    } else if (cardName === "indirect") {
      if (view.length !== 4) {
        setErrorMsg(true);
        return;
      }
      indirect.view = view;
      setOverView({ ...indirect });
      setShowPopup(false);
    }
    if (graphFilters.length === 0) {
      setGraphFilters([overView?.view[0]]);
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
      row[names[key]] = fields[key][reverseIndex] ? fields[key][reverseIndex] : 'NA';

      // If compList contains the key, add that data too
      if (compList[key] && !summary?.noComparison) {
        row[`Previous ${names[key]}`] = compList[key][reverseIndex] ? compList[key][reverseIndex] : 'NA';
      }

      // If percList contains the key, add that data too
      if (percList[key] && !summary?.noComparison) {
        row[`${names[key]} % Change`] = percList[key][reverseIndex] ? percList[key][reverseIndex] : 'NA';
      }
    });

    return row;
  });
  
  }
  useEffect(() => {
    setOverView(summary?.overview);
    setDirect(summary?.direct);
    setIndirect(summary?.indirect);
  }, [overView, summary, direct, indirect]);
  useEffect(() => { }, [graphData]);
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
      {/* overview cards */}
      <section className="">
        <div className=" flipkart__maincard relative">
          <div className="col_7 flipkart__cardTitle">Overview</div>
          <div className="col_3 flipkart__cardTitle px-4">Total</div>
          <div className="right-[0px] absolute top-[2px]  ">
            <ToggleButton
              label1={"Absolute"}
              label2={"DRR"}
              val={val}
              setVal={setVal}
            ></ToggleButton>
          </div>

          {/* Overview Cards */}
          <div className=" flipkart__cardarea flex py-2">
            <div className="col">
              <div className="flipkart_grid_cards">
                {overView?.all
                  ? Object.keys(overView?.all).map((val, key) => {
                      let card = overView?.all[val];
                      if (overView?.view.indexOf(val) >= 0) {
                        let graphActive = false;
                        if (graphFilters.indexOf(val) > -1) {
                          graphActive = true;
                        }
                        return (
                          <div key={key} className="p-1 col-span-1">
                            {/* {console.log(card.last_data, "card data")} */}
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
                  : Array(10)
                  ?.fill(0)
                  ?.map((_, index) => (
                    <div key={index} className="flex-1 mx-1 py-1">
                      <SkeletonDashCard />
                    </div>
                  ))}
                <PlusButton
                  onClick={() => {
                    setShowPopup(true);
                    setShowPopupFile("overview");
                    setErrorMsg(false);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* graph section and direct & indirect cards */}

      <div className="flipkart_grid_cards flex-1 grid-rows-[25px_115px_30px_115px_15px] bg-[#f5f8fa] pt-2 mb-2">
        {/* Graph will take (5 rows) and col span of 6 grids --> 5th row is just for padding space below graph*/}
        <div className="col-span-6 row-span-5 mr-2 pt-1 bg-white">
          <div className="flex justify-between items-center py-4 ">
            <div className="font-semibold text-lg">Graphical Analysis</div>
            <div className="flex justify-end mr-2  w-1/2">
              {/* <ToggleButton
                label1={"Graph"}
                label2={"Table"}
                val={isGraphVisible}
                setVal={setIsGraphVisibleValue}
              /> */}
              <IconToggleTabs
                isGraphVisible={isGraphVisible}
                setGraphVisible={setIsGraphVisible}
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
                        />
                      </div>
              )
            }
            </div>
          </div>
          {Object.keys(graphData)?.length>0 ?(
            <DashboardGraph
              activeCards={activeCards}
              setActiveCards={setActiveCards}
              graphFilters={graphFilters}
              setGraphFilters={setGraphFilters}
              graphData={graphData}
              state={state}
              component={"flipkart"}
              noComparison={summary?.noComparison}
            />
          ):<div className="mx-4 ">
          <SkeletonChart height="h-52"/>
        </div>}
          {!isGraphVisible && (
            <DashboardTable
              graphData={graphData}
              noComparison={summary?.noComparison}
              component="flipkart"
            />
          )}
        </div>

        {/* direct cards - (1st row) with col span 5*/}
        <div className="pl-2 text-xl font-normal col-span-5 flex items-end">
          Direct
        </div>

        {/* Second row with remaining direct grid cards (2nd row) */}
        {direct?.all
          ? Object.keys(direct?.all).map((val, key) => {
              let card = direct?.all[val];
              if (direct.view.indexOf(val) >= 0) {
                let graphActive = false;
                if (graphFilters.indexOf(val) > -1) {
                  graphActive = true;
                }
                return (
                  <div key={key} className="p-1 col">
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
          : Array(4)
          ?.fill(0)
          ?.map((_, index) => (
            <div key={index} className="flex-1 mx-1 py-1">
              <SkeletonDashCard />
            </div>
          ))}
        <PlusButton
          onClick={() => {
            setShowPopup(true);
            setShowPopupFile("direct");
          }}
        />

        {/* indirect cards - (3rd row) with col span 5 */}
        <div className="pl-2 font-normal text-xl pt-1 col-span-5 flex items-end">
          Indirect
        </div>

        {/* (4th row) with remaining indirect grid cards */}
        {indirect?.all
          ? Object.keys(indirect?.all).map((val, key) => {
              let card = indirect?.all[val];
              if (indirect.view.indexOf(val) >= 0) {
                let graphActive = false;
                if (graphFilters.indexOf(val) > -1) {
                  graphActive = true;
                }
                return (
                  <div key={key} className="p-1 col">
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
          : Array(4)
          ?.fill(0)
          ?.map((_, index) => (
            <div key={index} className="flex-1 mx-1 py-1">
              <SkeletonDashCard />
            </div>
          ))}
        <PlusButton
          onClick={() => {
            setShowPopup(true);
            setShowPopupFile("indirect");
          }}
        />
      </div>

      {/* popup */}
      {showPopup && (
        <SummaryViewPopup
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
        />
      )}
    </>
  );
};

export default Cards;
