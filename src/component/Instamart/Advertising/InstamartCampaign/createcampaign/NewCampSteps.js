import React from "react";

const NewCampSteps = ({ stepname, stepno, active, children }) => {
  return (
    <>
      <div
        className={[
          "newcampaign__cards ",
          active >= stepno && "newcampaign__cards--active",
        ].join(" ")}
      >
        <div
          className={[
            "row items-center  pb-3",
            active >= stepno && "border-b",
          ].join(" ")}
        >
          <div
            className={[
              " stepper__steps-count",
              active >= stepno && "stepper__steps-countinsta--active",
            ].join(" ")}
          >
            {/* tick icon */}
            {stepno}
          </div>
          <span className="stepper__steps-title text-sm font-semibold">
            {stepname}
          </span>
        </div>
        {active >= stepno && <div>{children}</div>}
      </div>
    </>
  );
};
export default NewCampSteps;
