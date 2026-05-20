import React, { useState } from "react";
import Box from "../common-components/Popups/Box";
import Popup from "../common-components/Popups/Popup";

const BlinkitSummaryViewPopup = ({
  error,
  showPopup,
  setShowPopup,
  viewData,
  allData,
  summaryOf,
  updateCards,
  cardName,
  graphFilters,
  setGraphFilters,
}) => {
  const [tempView, setTempView] = useState([...viewData]);
  // console.log("VIEDE:::::", viewData);
  function removeItem(item) {
    let updatedView = tempView.filter((val) => {
      return val !== item;
    });
    let updatedGraphFilters = graphFilters.filter((val) => {
      return val !== item;
    });
    setTempView(updatedView);
    setGraphFilters(updatedGraphFilters);
  }
  function addItem(item) {
    if (tempView.indexOf(item) === -1) {
      // alert("test");
      tempView.push(item);
      setTempView([...tempView]);
    }
  }
  function updateView() {
    updateCards(tempView, cardName);
  }
  // useEffect(() => {
  //   setTempView(viewData);
  // }, [viewData]);
  // useEffect(() => {}, [tempView]);

  return (
    <>
      {showPopup && (
        <Popup
          title={`Custom Metrics- ${summaryOf}`}
          setShowPopup={setShowPopup}
          applyAction={updateView}
          platform="blinkit"
          setTempView={() => {
            // console.log("VIED:::::", tempView);
            setTempView(viewData);
            updateCards(viewData, cardName);
          }}
        >
          <div className="flex justify-center">
            {error && (
              <div className=" text-center flex">
                {cardName !== "performance" && (tempView.length < 2 || tempView.length > 3) ? (
                  <div className="flex">
                    <img
                      className="w-5 mr-1"
                      src="/assets/images/warning.png"
                      alt="warn"
                    />
                    <p>{tempView.length < 2 ? "Please select min 2 cards" : "Please select max 3 cards"}</p>
                  </div>
                ) : cardName === "performance" && (tempView.length < 4 || tempView.length > 6) ? (
                  <div className="flex">
                    <img
                      className="w-5 mr-1"
                      src="/assets/images/warning.png"
                      alt="warn"
                    />
                    <p>{tempView.length < 4 ? "Please select min 4 cards" : "Please select max 6 cards"}</p>
                  </div>
                ) : null}
              </div>
            )}
          </div>
          <div className="row p-4 py-1">
            {Object.keys(allData).map((item, index) => {
              if (tempView.indexOf(item) > -1) {
                return (
                  <div
                    key={index}
                    className="p-1"
                    onClick={() => {
                      removeItem(item);
                    }}
                  >
                    <Box platform = "blinkit" title={allData[item].name} />
                  </div>
                );
              }
            })}
          </div>
          <h2 className="p-4">Total Tabs</h2>
          <div className="row bg-bgclr p-4">
            {Object.keys(allData).map((val, key) => {
              let card = allData[val];
              let active = tempView.indexOf(val) > -1 ? "border-blue-500" : "";
              return (
                <div
                  key={key}
                  className="col_2 p-3"
                  onClick={() => {
                    addItem(val);
                  }}
                >
                  <div
                    className={`bg-bgclr py-3 px-5 text-center border ${active} rounded-lg cursor-pointer`}
                  >
                    <h4 className="text-xs text-black text-opacity-75">
                      {card.name}
                    </h4>
                    <p className="font-semibold text-sm">{card.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Popup>
      )}
    </>
  );
};
export default BlinkitSummaryViewPopup;
