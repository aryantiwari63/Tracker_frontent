import React from "react";
import {FiArrowDown, FiArrowUp } from "react-icons/fi"

const AMSCard = ({ subtitle, amount, currency, percentage, status}) => {
  return (
    <>
      <div className="">
        <div className="">
          <div className="text-sm py-1">{subtitle}</div>
          <div className="font-bold text-base pb-1">{amount}</div>
          <div className="row  text-xs">
            <div className="col_6">{currency}</div>
            <div
              className={[ 
                "amscard__percentage",
                status === "increase" && "amscard__percentage--increment ",
                status === "decrease" && "amscard__percentage--decrement",
              ].join(" ")}
            >
              {percentage}
              <div className="inline-block pl-2">
                {status==="increase" ? <FiArrowUp/>:
                status==="decrease"? <FiArrowDown/>:
                <FiArrowUp/>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AMSCard;
