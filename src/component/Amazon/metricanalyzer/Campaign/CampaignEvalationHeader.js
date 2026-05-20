import React from "react";

const CampaignEvalationHeader = ({
  camapignValue,
  selected,
  selectedMetricOptions,
}) => {
  //const [selectedMetricOptions, setSelectedMetricOptions] = useState();
  let currency = localStorage.getItem("currency");
  let currency_code = localStorage.getItem("currency_code");

  const metricsoptions = [
    {
      label: "Impressions",
      value: "impressions",
      field: "",
    },
    {
      label: `Spend(${currency_code})`,
      value: "spend",
      field:  currency ,
    },
    {
      label: "Clicks",
      value: "clicks",
      field: "",
    },
    { label: "CTR", value: "ctr", field: "%" },
    { label: `CPC(${currency_code})`, value: "cpc", field: currency  },
    { label: `Sales(${currency_code})`, value: "sales", field:  currency },
    { label: "ACOS", value: "acos", field: "%" },
    { label: "ROAS", value: "roas", field: "" },
  ];

  // const handleMetricOptionsChange = (event) => {
  //   setSelectedMetricOptions(event.target.value);
  // };
  let fieldVal = metricsoptions.find(
    (x) => x.value === selectedMetricOptions
  )?.field;
  return (
    <div>
      <div className="ml-2 px-2 py-3">
        <div className="border p-2">
          <label className="pr-2 percentageBox">
            Avg. {selected}
            <span className="text-base pr-2 ml-1">
              {fieldVal != "%" && fieldVal}
              <input
                value={
                  isNaN(camapignValue?.average)
                    ? 0
                    : camapignValue?.average + (fieldVal == "%" ? fieldVal : "")
                }
                type="text"
                className="outline-none font-semibold text-base"
              />
            </span>
          </label>
          <label className="pr-4 percentageBox">
            Max. {selected}
            <span className="text-base pr-2 ml-1">
              {fieldVal != "%" && fieldVal}
              <input
                value={
                  isNaN(camapignValue?.maximum)
                    ? 0
                    : camapignValue?.maximum + (fieldVal == "%" ? fieldVal : "")
                }
                type="text"
                className="outline-none font-semibold text-base"
              />
            </span>
          </label>
          <label className="pr-2 percentageBox">
            Min. {selected}
            <span className="text-base pr-2 ml-1">
              {fieldVal != "%" && fieldVal}
              <input
                value={
                  isNaN(camapignValue?.minimum)
                    ? 0
                    : camapignValue?.minimum + (fieldVal == "%" ? fieldVal : "")
                }
                type="text"
                className="outline-none font-semibold text-base"
              />
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default CampaignEvalationHeader;
