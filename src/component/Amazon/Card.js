/* eslint-disable */
import React, { useState } from "react";

function Card({
  CardPercentage,
  cardtitle,
  currency,
  cardKey,
  graphFilters,
  onClick,
  lastData,
  noComparison,
  totalRawValue,
  rawLastValue
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showLastValueToolTip, setShowLastValueTooltip] = useState(false);
  const classes = [
    "amazon__primarycard",
    graphFilters.includes(cardKey) && "amazon__primarycard--active",
    "card_layout",
  ];
  return (
    <div className={classes.join(" ")} onClick={onClick}>
      <div className="row ">
        <div className="col ">
          <div className="">
            <div className="text-sm">{cardtitle}</div>
            <p
                className="font-bold text-base"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                style={{ position: 'relative' }} 
              >
                {currency}
                {showTooltip && (
                  <span className="tooltip">{totalRawValue || currency.toString().replace(/\s/g, '')}</span>
                )}
              </p>
            {!noComparison && (
              <div className="flex items-center">
                <div className="row justify-start text-xs items-center"
                 onMouseEnter={() => setShowLastValueTooltip(true)}
                 onMouseLeave={() => setShowLastValueTooltip(false)}
                 style={{position: 'relative'}}
                >
                  {lastData==="Infinity"? 0 : lastData}
                  {showLastValueToolTip ? (
                     <span className="tooltip-child">
                      {rawLastValue ? rawLastValue : (lastData === "Infinity" ? 0 : lastData.toString().replace(/\s/g, ''))}
                     </span>
                      ) : null}
                </div>

                <div className="row justify-end text-xs items-center">
                  {CardPercentage < 0
                    ? -2 * CardPercentage + CardPercentage
                    : CardPercentage}
                  %{" "}
                  {CardPercentage >= 0 ? (
                    <div className="px-0.5">
                      {cardtitle == "CPC" ? (
                        <img src="/assets/images/up_red.svg" alt="" />
                      ) : (
                        <img src="/assets/images/up.svg" alt="" />
                      )}
                    </div>
                  ) : (
                    <div className="px-0.5">
                      {cardtitle == "CPC" ? (
                        <img src="/assets/images/down_green.svg" alt="" />
                      ) : (
                        <img src="/assets/images/down.svg" alt="" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Card;
