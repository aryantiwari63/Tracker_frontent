import React, { useEffect, useState } from "react";

const Card = ({
  CardPercentage,
  cardtitle,
  currency,
  cardKey,
  graphFilters,
  onClick,
  lastData,
  noComparison,
  totalRawValue,
  rawLastValue,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showLastValueToolTip, setShowLastValueTooltip] = useState(false);

  const [platform, setPlatform] = useState('');

  let classes = [
    "flipkart__primarycard",
    "flipkart__primarycard--" + platform,
    graphFilters.includes(cardKey) && "flipkart__primarycard--active",
    platform === "ams" && "",
    "card_layout",
  ];

  useEffect(() => {
    const platform_type = localStorage.getItem('platform_type').replace(/"/g, '').substring(1);

    setPlatform(platform_type);
  }, [])

  return (
    <>
      <div className={classes.join(" ")} onClick={onClick}>
      <div className="row">
          <div className="col" >
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
                <div className="flex items-center justify-between">
                  <div className="flex justify-start text-xs items-center"
                   onMouseEnter={() => setShowLastValueTooltip(true)}
                   onMouseLeave={() => setShowLastValueTooltip(false)}
                   style={{position: 'relative', display: 'inline-block'}}
                  >
                    {lastData === "₹NaN" ? 0 : lastData}
                    {showLastValueToolTip ? (
                     <div className="tooltip-child">
                     {rawLastValue ? rawLastValue : (lastData === "₹NaN" ? 0 : lastData.toString().replace(/\s/g, ''))}
                   </div>                   
                      ):null}
                  </div>

                  <div className="flex justify-end text-xs items-center">
                    {CardPercentage < 0
                      ? -2 * CardPercentage + CardPercentage
                      : CardPercentage}
                    %{" "}
                    {CardPercentage >= 0 ? (
                      <div className="px-0.5">
                        {cardtitle === "CPC" ? (
                          <img src="/assets/images/up_red.svg" alt="" />
                        ) : (
                          <img src="/assets/images/up.svg" alt="" />
                        )}
                      </div>
                    ) : (
                      <div className="px-0.5">
                        {cardtitle === "CPC" ? (
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
    </>
  );
};
export default Card;
