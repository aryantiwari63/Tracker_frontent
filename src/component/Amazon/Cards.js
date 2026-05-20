import React, { useState, useEffect } from "react";
import PlusButton from "../common-components/button/PlusButton";
import DashboardGraph from "../flipkart/DashboadGraph";
import DashboardTable from "../flipkart/DashboardTable";
import AmazonSummarViewPopup from "./AmazonSummaryViewPopup";
import ToggleButton from "../common-components/toggle-button";
import Card from "./Card";
import { trackCard } from "../../analytics/EventController";
import IconToggleTabs from "../common-components/Tabs/IconToggleTabs";
import { CSVDownload } from "react-csv";
import { Headerbtn } from "../common-components/headerButton/headerButton";
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
  // const [direct, setDirect] = useState([]);
  // const [indirect, setIndirect] = useState([]);
  const [sp, setSp] = useState([]);
  const [sb, setSb] = useState([]);
  const [sd, setSd] = useState([]);
  const [errorMsg, setErrorMsg] = useState(false);
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
    // console.log(graphFilters, "graphFilters", e);
  };

  // function setIsGraphVisibleValue() {
  //   setIsGraphVisible(!isGraphVisible);
  // }

  function updateCards(view, cardName) {
    // console.log(summary[cardName], "summary[cardName]");
    if (cardName === "overview") {
      if (view.length !== 9) {
        setErrorMsg(true);
        return;
      } else {
        setErrorMsg(false);
      }
      overView.view = view;
      setOverView({ ...overView });
      setShowPopup(false);
      setErrorMsg(false);
    } else if (cardName === "sp") {
      if (view.length != 4) {
        setErrorMsg(true);
        return;
      }
      sp.view = view;
      setOverView({ ...sp });
      setShowPopup(false);
    } else if (cardName === "sb") {
      if (view.length != 4) {
        setErrorMsg(true);
        return;
      }
      sb.view = view;
      setOverView({ ...sb });
      setShowPopup(false);
    } else if (cardName === "sd") {
      if (view.length != 4) {
        setErrorMsg(true);
        return;
      }
      sd.view = view;
      setOverView({ ...sd });
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
    setSp(summary?.sp);
    setSb(summary?.sb);
    setSd(summary?.sd);
  }, [overView, summary, sp, sb, sd]);
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
      {/* overview cards */}
      <section className="">
        <div className=" flipkart__maincard relative">
          <div className="col_7 flipkart__cardTitle">Overview</div>
          {/* <div className="col_3 flipkart__cardTitle px-4">Total</div> */}
          <div className="flipkart__cardTitle right-[0px] absolute">
            <ToggleButton
              label1={"Absolute"}
              label2={"DRR"}
              val={val}
              setVal={setVal}
              platform={"ams"}
            ></ToggleButton>
          </div>
          <div className=" amazon__cardarea items-stretch">
            <div className="col">
              <div className="flex mt-2 mb-2">
                {overView?.all
                  ? Object.keys(overView?.all).map((val, key) => {
                      let card = overView?.all[val];
                      if (overView?.view.indexOf(val) >= 0) {
                        let graphActive = false;
                        if (graphFilters.indexOf(val) > -1) {
                          graphActive = true;
                        }
                        return (
                          <div key={key} className="p-1 col">
                            {/* {console.log(card.last_data, "card data")} */}
                            <Card
                              cardKey={val}
                              CardPercentage={card.last_val}
                              cardtitle={card.name}
                              totalRawValue={card?.totalValue}
                              rawLastValue={card?.totalLastValue}
                              currency={card.value}
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
                  : Array(11)
                  ?.fill(0)
                  ?.map((_, index) => (
                    <div key={index} className="flex-1 mx-1 py-1">
                      <SkeletonDashCard gap="gap-[3px]"/>
                    </div>
                  ))}
                <PlusButton
                  platform={"ams"}
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
      <div className="flipkart__secondarycard">
        {/* graph */}
        <div className="col_7 ">
          <div className="flipkart__graphcard">
            <div className="flex justify-between items-center py-4">
              <div className=" font-semibold text-lg">Graphical Analysis</div>
              <div className="flex items-center justify-end mr-2 w-1/2">
                {/* <ToggleButton
                  label1={"Graph"}
                  label2={"Table"}
                  val={isGraphVisible}
                  setVal={setIsGraphVisibleValue}
                /> */}
                <IconToggleTabs
                  isGraphVisible={isGraphVisible}
                  setGraphVisible={setIsGraphVisible}
                  cardColor="bg-[#EF880F]"
                />
              {
              !isGraphVisible && (
                <div className="amazon__campheader flex items-center -mt-4 justify-center">
                        <Headerbtn
                          disabled={download === 1}
                          imgsrc="/assets/images/hard-disk.png"
                          hoverImgSrc="/assets/images/hard-disk-white.svg"
                          // title={download === 1 ? "Downloading..." : "Export"}
                          style={{ width: "19px" }}
                          download={download}
                          onClick={handleDownload}
                          platform={''}
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
                noComparison={summary?.noComparison}
                component="amazon"
              />
            ): <div className="mx-4 my-3 mb-[70px]">
            <SkeletonChart height="h-[20rem]"/>
          </div>}
            {!isGraphVisible && (
              <DashboardTable
                graphData={graphData}
                noComparison={summary?.noComparison}
                component="amazon"
              />
            )}
          </div>
        </div>
        <div className="col_5 pb-2">
          {/* direct cards */}
          <div className="amazon__directcard pt-4">
            <div className="pl-2 font-normal text-xl">Sponsored Product</div>
            <div className="amazon__secondarycardarea" style={{ flexWrap: 'wrap' }}>
              {sp?.all
                ? Object.keys(sp?.all).map((val, key) => {
                    let card = sp?.all[val];
                    if (sp.view.indexOf(val) >= 0) {
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
                            platform={"ams"}
                          />
                        </div>
                      );
                    }
                  })
                :Array(4)
                ?.fill(0)
                ?.map((_, index) => (
                  <div key={index} className="flex-1 mx-1 py-1">
                    <SkeletonDashCard gap="gap-[3px]"/>
                  </div>
                ))}
              <PlusButton
                platform={"ams"}
                onClick={() => {
                  setShowPopup(true);
                  setShowPopupFile("sp");
                }}
              />
            </div>
          </div>
          <div className="amazon__indirectcard pt-4">
            <div className="pl-2 font-normal text-xl pt-1">Sponsored Brand</div>
            <div className="amazon__secondarycardarea" style={{flexWrap: 'wrap'}}>
              {sb?.all
                ? Object.keys(sb?.all).map((val, key) => {
                    let card = sb?.all[val];
                    if (sb.view.indexOf(val) >= 0) {
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
                            platform={"ams"}
                          />
                        </div>
                      );
                    }
                  })
                : Array(4)
                ?.fill(0)
                ?.map((_, index) => (
                  <div key={index} className="flex-1 mx-1 py-1">
                    <SkeletonDashCard gap="gap-[3px]"/>
                  </div>
                ))}
              <PlusButton
                platform="ams"
                onClick={() => {
                  setShowPopup(true);
                  setShowPopupFile("sb");
                }}
              />
            </div>
          </div>
          {/* indirect */}
          <div className="amazon__indirectcard pt-4 py-2">
            <div className="pl-2 font-normal text-xl pt-1">
              Sponsored Display
            </div>
            <div className="amazon__secondarycardarea" style={{flexWrap: 'wrap'}}>
              {sd?.all
                ? Object.keys(sd?.all).map((val, key) => {
                    let card = sd?.all[val];
                    if (sd.view.indexOf(val) >= 0) {
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
                    <SkeletonDashCard gap="gap-[3px]"/>
                  </div>
                ))}
              <PlusButton
                platform="ams"
                onClick={() => {
                  setShowPopup(true);
                  setShowPopupFile("sd");
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {/* popup */}
      {showPopup && (
        <AmazonSummarViewPopup
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
          // setTempView={setTempView}
          // tempView={tempView}
        />
      )}
    </>
  );
};

export default Cards;

// import React, { useState, useEffect } from "react";
// import PlusButton from "../common-components/button/PlusButton";
// import DashboardGraph from "../flipkart/DashboadGraph";
// import Card from "../flipkart/Card";
// import AmazonSummaryViewPopup from "./AmazonSummaryViewPopup";
// // import DashboardGraph from "./DashboadGraph";
// // import SummaryViewPopup from "./SummaryViewPopup";

// const Cards = ({
//   summary,
//   graphFilters,
//   setGraphFilters,
//   state,
//   graphData,
//   checked,
//   val,
//   setVal,
// }) => {
//   // console.log(summary, "summary");
//   const [showPopup, setShowPopup] = useState(false);
//   const [activeCards, setActiveCards] = useState([]);
//   const [showPopupFile, setShowPopupFile] = useState("overview");
//   const [overView, setOverView] = useState([]);
//   const [reach, setReach] = useState([]);
//   const [performance, setPerformance] = useState([]);

//   const graphFilterHandler = (e) => {
//     if (!graphFilters.includes(e)) {
//       if (graphFilters.length >= 3) {
//         let tempArray = graphFilters;
//         tempArray.shift();
//         setGraphFilters([...tempArray, e]);
//       } else {
//         setGraphFilters([...graphFilters, e]);
//       }
//     } else if (graphFilters.includes(e)) {
//       let tempFilter = graphFilters;
//       tempFilter.splice(graphFilters.indexOf(e), 1);
//       setGraphFilters([...tempFilter]);
//     }
//     // console.log("graphfilters",graphFilters);
//   };
//   // console.log("graphfilters" ,graphFilters);
//   function updateCards(view, cardName) {
//     // console.log(summary[cardName], "summary[cardName]");
//     if (cardName === "overview") {
//       if (view.length !== 10) {
//         return alert("Select at least 10 cards");
//       }
//       overView.view = view;
//       setOverView({ ...overView });
//       setShowPopup(false);
//     } else if (cardName === "reach") {
//       if (view.length !== 4) {
//         return alert("Select at least 4 cards");
//       }
//       reach.view = view;
//       setOverView({ ...reach });
//       setShowPopup(false);
//     } else if (cardName === "performance") {
//       if (view.length !== 4) {
//         return alert("Select at least 4 cards");
//       }
//       performance.view = view;
//       setOverView({ ...performance });
//       setShowPopup(false);
//     }
//     if (graphFilters.length === 0) {
//       setGraphFilters([overView.view[0]]);
//     }
//   }
//   useEffect(() => {
//     setOverView(summary?.overview);
//     setReach(summary?.reach);
//     setPerformance(summary?.performance);
//   }, [overView, summary, performance, reach]);
//   useEffect(() => {}, [graphData]);

//   return (
//     <>
//       <div className="row">
//         <div className="col_9">
//           <div className="row">
//             <div className="col_3">
//               <h2 className="blinkitCard-title">Overview</h2>
//               <div>
//                 <div className=" blinkit__cardarea ">
//                   <div className="col">
//                     <div className="row">
//                       {overView?.all
//                         ? Object.keys(overView?.all).map((val, key) => {
//                             let card = overView?.all[val];
//                             if (overView.view.indexOf(val) >= 0) {
//                               let graphActive = false;
//                               if (graphFilters.indexOf(val) > -1) {
//                                 graphActive = true;
//                               }
//                               return (
//                                 <div
//                                   className={[
//                                     "p-1.5 col ",
//                                     key >= 2 && "hidden",
//                                   ].join(" ")}
//                                 >
//                                   <Card
//                                     cardKey={val}
//                                     CardPercentage={card.last_val}
//                                     cardtitle={card.name}
//                                     currency={card.value}
//                                     lastData={card.last_data}
//                                     activeCard={graphActive}
//                                     graphFilters={graphFilters}
//                                     onClick={() => graphFilterHandler(val)}
//                                   />
//                                 </div>
//                               );
//                             }
//                           })
//                         : ""}
//                     </div>
//                   </div>
//                   {/* <PlusButton
//             className="plusbtnblinkit"
//               onClick={() => {
//                 setShowPopup(true);
//                 setShowPopupFile("overview");

//               }}
//             /> */}
//                 </div>
//               </div>
//             </div>
//             <div className="col">
//               <h2 className="blinkitCard-title">Reach</h2>
//               <div>
//                 <div className=" blinkit__cardarea bg-[#DBF3EB]">
//                   <div className="col">
//                     <div className="row">
//                       {reach?.all
//                         ? Object.keys(reach?.all).map((val, key) => {
//                             let card = reach?.all[val];
//                             if (reach.view.indexOf(val) >= 0) {
//                               let graphActive = false;
//                               if (graphFilters.indexOf(val) > -1) {
//                                 graphActive = true;
//                               }
//                               return (
//                                 <div
//                                   className={[
//                                     "p-1.5 col ",
//                                     key >= 5 && "hidden",
//                                   ].join(" ")}
//                                 >
//                                   <Card
//                                     cardKey={val}
//                                     CardPercentage={card.last_val}
//                                     cardtitle={card.name}
//                                     currency={card.value}
//                                     lastData={card.last_data}
//                                     activeCard={graphActive}
//                                     graphFilters={graphFilters}
//                                     onClick={() => graphFilterHandler(val)}
//                                   />
//                                 </div>
//                               );
//                             }
//                           })
//                         : ""}
//                     </div>
//                   </div>
//                   <PlusButton
//                     platform="ams"
//                     onClick={() => {
//                       setShowPopup(true);
//                       setShowPopupFile("reach");
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="p-6">
//             <DashboardGraph
//               activeCards={activeCards}
//               setActiveCards={setActiveCards}
//               graphFilters={graphFilters}
//               setGraphFilters={setGraphFilters}
//               graphData={graphData}
//               state={state}
//             />
//           </div>
//         </div>
//         <div className="col_3">
//           <div className="row ">
//             <div className="col_6">
//               {" "}
//               <h2 className="blinkitCard-title ">Performance</h2>
//             </div>
//             <div className="col_6">
//               {/* <Toggle
//               label1={"Absolute"}
//               label2={"DRR"}
//               val={val}
//               setVal={setVal}
//               platform="blinkit"
//             ></Toggle> */}
//             </div>
//           </div>

//           <div className="blinkitperformance ">
//             <div className="col">
//               <div className="row">
//                 {performance?.all
//                   ? Object.keys(performance?.all).map((val, key) => {
//                       let card = performance?.all[val];
//                       if (performance.view.indexOf(val) >= 0) {
//                         let graphActive = false;
//                         if (graphFilters.indexOf(val) > -1) {
//                           graphActive = true;
//                         }
//                         return (
//                           <div
//                             className={[
//                               "p-1.5 col_6 ",
//                               key >= 8 && "hidden",
//                             ].join(" ")}
//                           >
//                             <Card
//                               cardKey={val}
//                               CardPercentage={card.last_val}
//                               cardtitle={card.name}
//                               currency={card.value}
//                               lastData={card.last_data}
//                               activeCard={graphActive}
//                               graphFilters={graphFilters}
//                               onClick={() => graphFilterHandler(val)}
//                             />
//                           </div>
//                         );
//                       }
//                     })
//                   : ""}
//               </div>
//             </div>
//             <PlusButton
//             platform="ams"
//               onClick={() => {
//                 setShowPopup(true);
//                 // setShowPopupFile("performance");
//                 setShowPopupFile("performance");

//               }}
//             />
//           </div>
//         </div>
//       </div>
//       <AmazonSummaryViewPopup
//         summaryOf={showPopupFile}
//         showPopup={showPopup}
//         setShowPopup={setShowPopup}
//         viewData={summary[showPopupFile]?.view}
//         allData={summary[showPopupFile]?.all}
//         updateCards={updateCards}
//         cardName={showPopupFile}
//         graphFilters={graphFilters}
//         setGraphFilters={setGraphFilters}
//       />
//     </>
//   );
// };

// export default Cards;

// import React from "react";
// import AMSCard from "./AMSCard";
// import Card from "../flipkart/Card";

// const Cards=()=>{
//     return(
//         <>

//       <div className="row ">
//       <div className="col_4 ">
//           <div className="bg-white px-2 py-4 mr-2 rounded amscard__header">
//           <div className="amscard__title">Performance</div>
//           <div className="row">
//             <div className="col_4 ">
//           <AMSCard
//           subtitle="Sales"
//           amount="₹ 53.3M"
//           currency="₹ 53.1M"
//           status="increase"
//           percentage="0.5%"
//           />
//             </div>
//             <div className="col_4">
//           <AMSCard
//           subtitle="Spend"
//           amount="₹ 13.5M"
//           currency="₹ 12.9M"

//           percentage="4.8%"
//           />
//             </div>
//             <div className="col_4">
//           <AMSCard
//           subtitle="ROAS"
//           amount="₹ 3.95M"
//           currency="₹ 4.12"
//           percentage="-4.2%"
//           status="decrease"
//           />
//             </div>
//           </div>
//           </div>
//         </div>
//         <div className="col_4 ">
//           <div className="bg-white px-2 py-4 mr-2 rounded amscard__header amscard__header--efficiency">
//           <div className="amscard__title">Efficiency</div>
//           <div className="row">
//             <div className="col_4">
//           <AMSCard
//           subtitle="CPC"
//           amount="₹ 18.36"
//           currency="₹ 18.78"
//           percentage="-2.3%"
//           status="increase"
//           />
//             </div>
//             <div className="col_4">
//           <AMSCard
//           subtitle="SPC"
//           amount="₹ 72.42"
//           currency="₹ 77.31"
//           percentage="-6.3%"
//           status="decrease"
//           />
//             </div>
//             <div className="col_4">
//           <AMSCard
//           subtitle="CVR"
//           amount="21.80%"
//           currency="23.00%"
//           percentage="-5.2%"
//           status="decrease"
//           />
//             </div>
//           </div>

//           </div>
//         </div>
//         <div className="col_4">
//           <div className="bg-white px-2 py-4 rounded amscard__header amscard__header--awarness">
//           <div className="amscard__title">Awarness</div>
//           <div className="row">
//             <div className="col_4">
//           <AMSCard
//           subtitle="Impressions"
//           amount="263.9M"
//           currency="253.8M"
//           percentage="4.0%"
//           />
//             </div>
//             <div className="col_4">
//           <AMSCard
//           subtitle="Clicks"
//           amount="736.5K"
//           currency="686.8K"
//           percentage="7.2%"
//           status="increase"
//           />
//             </div>
//             <div className="col_4">
//           <AMSCard
//           subtitle="CTR"
//           amount="0.28%"
//           currency="0.27%"
//           percentage="3.7%"
//           status="increase"
//           />
//             </div>
//           </div>
//           </div>
//         </div>

//       </div>

//         </>
//     )
// }

// export default Cards;
