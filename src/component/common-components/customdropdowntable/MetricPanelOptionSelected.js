import React from "react";
// import CustomColOptionAms from "./CustomColOptionAms";

const MetricPanelOptionSelected = ({
  heading,
  metric,
  setMetric,
  data,
  platform,
}) => {
  // const [showCustomData, setShowCustomData] = React.useState([
  //   ...CustomColOptionAms,
  // ]);
  return (
    <>
      <div className="metricpanel py-2 ">
        <div className="metricpanel__heading pl-3 py-2 font-semibold pt-0 border-b-2">
          {heading}
        </div>

        <div className=" py-2">
          <button
            className={[
              "metricpanel__name w-full h-full text-left pl-3",
              platform === "blinkit" && "metricpanel__name--blinkit",
              metric === "all" &&
                "metricpanel__name--active metricpanel__name--blinkit--active",
            ].join(" ")}
            value={"all"}
            onClick={(e) => {
              setMetric(e.target.value);
            }}
          >
            All
          </button>
        </div>
        {data?.map((item, i) => {
          return (
            <div key={i} className=" py-2  ">
              <button
                className={[
                  "metricpanel__name w-full h-full text-left pl-3",
                  platform === "blinkit" && "metricpanel__name--blinkit",
                  metric === item.value &&
                    "metricpanel__name--active metricpanel__name--blinkit--active",
                ].join(" ")}
                value={item.value}
                onClick={(e) => {
                  setMetric(e.target.value);
                }}
              >
                {item.label}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MetricPanelOptionSelected;
