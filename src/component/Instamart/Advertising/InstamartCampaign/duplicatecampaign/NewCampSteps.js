import React from "react";

const NewCampSteps = ({ stepname, stepno, children }) => {
  return (
    <>
      <div
        className={["newcampaign__cards " && "newcampaign__cards--active"].join(
          " "
        )}
      >
        <div className={["row items-center  pb-3" && "border-b"].join(" ")}>
          <div
            className={[
              " stepper__steps-count" && "stepper__steps-countblinkit--active",
            ].join(" ")}
          >
            {/* tick icon */}
            {stepno ? "" : stepno}
          </div>
          <span className="stepper__steps-title text-sm font-semibold">
            {stepname}
          </span>
        </div>
        {stepno && <div>{children}</div>}
      </div>
    </>
  );
};
export default NewCampSteps;
