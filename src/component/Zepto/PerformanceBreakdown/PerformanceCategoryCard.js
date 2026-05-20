import React from "react";
import Card from "../../flipkart/Card";

const PerformanceCategoryCard = ({ title, imgsrc, cardData = [], color, noComparison }) => {
  const breakdownData = Object.keys(cardData).map((index) => {
    let data = cardData[index];
    return data;
  });
  return (
    <>
      <div className="row">
        <div className="performancecategorycard ">
          <div
            className={[" performancecategorycard__colorcard", color].join(" ")}
          >
            <div className="outerContainer__image">
              <img src={imgsrc} className="px-2 pt-1 " alt="" />
            </div>
            <div>{title}</div>
          </div>
        </div>
        {/* cards */}
        <div className="px-2 col">
          <div className="row">
            {breakdownData?.map((item, index) => {
              return (
                <div key={index} className="px-1 col">
                  <Card
                    CardPercentage={item.last_val}
                    cardtitle={item.name}
                    currency={item.value}
                    lastData={item.last_data}
                    totalRawValue= {item?.totalValue}
                    rawLastValue={item?.totalLastValue}
                    cardKey={""}
                    activeCard={[]}
                    graphFilters={[]}
                    onClick={() => {}}
                    noComparison={noComparison}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default PerformanceCategoryCard;
