import React, { useState } from "react";

const filterdata = [
  {
    label: "Spends",
    value: "spend",
  },
  {
    label: "Views",
    value: "views",
  },
  {
    label: "Clicks",
    value: "clicks",
  },
  {
    label: "CVR",
    value: "CVR",
  },
  {
    label: "CTR",
    value: "CTR",
  },
  {
    label: "CPC",
    value: "CPC",
  },
  {
    label: "Revenue",
    value: "total_revenue",
  },
  {
    label: "Unit Sold",
    value: "orders",
  },
  {
    label: "ROI",
    value: "Total_ROAS",
  },
  {
    label: "AOV",
    value: "AOV",
  },
  {
    label: "PPV",
    value: "total_ppv'",
  },
  {
    label: "Direct Revenue",
    value: "direct_revenue",
  },
  {
    label: "Direct Unit Sold",
    value: "units_sold_direct",
  },
  {
    label: "Direct ROI",
    value: "Direct_ROAS",
  },
  {
    label: "Direct AOV",
    value: "direct_aov",
  },
  {
    label: "Direct PPV",
    value: "ppv_direct_click",
  },
  {
    label: "Indirect Revenue",
    value: "indirect_revenue",
  },
  {
    label: "Indirect Units Sold",
    value: "units_sold_indirect",
  },
  {
    label: "Indirect ROI",
    value: "Indirect_ROAS",
  },
];

const SelectDrop = () => {
  // eslint-disable-next-line no-unused-vars
  const [graphFilters, setGraphFilters] = useState(["spend", "orders"]);
  const [graphFilterOne, setGraphFilterOne] = useState("spend");
  const [graphFilterTwo, setGraphFilterTwo] = useState("orders");

  const handleSelectChange = (e) => {
    setGraphFilterOne(e);
  };
  //   const handleDaysChange = (e) => {
  //     setDateGrouping(e);
  //   };
  const handleSecondChange = (e) => {
    setGraphFilterTwo(e);
  };
  React.useEffect(() => {
    setGraphFilters([graphFilterOne, graphFilterTwo]);
  }, [graphFilterOne, graphFilterTwo]);

  return (
    <>
      <div className="col_2 mr-4 ">
        <select
          className="campaignselect"
          onChange={(e) => handleSelectChange(e.target.value)}
        >
          <option selected disabled>
            Select{" "}
          </option>
          {filterdata?.map((item) => {
            return (
              <>
                <option
                  disabled={item.value === graphFilterTwo}
                  value={item.value}
                >
                  {item.label}
                </option>
              </>
            );
          })}
        </select>
      </div>
      <div className="col_2 mr-2">
        <select
          className="campaignselect"
          onChange={(e) => handleSecondChange(e.target.value)}
        >
          <option selected disabled>
            Select{" "}
          </option>
          {filterdata?.map((item) => {
            return (
              <>
                <option
                  disabled={item.value === graphFilterOne}
                  value={item.value}
                >
                  {item.label}
                </option>
              </>
            );
          })}
        </select>
      </div>
    </>
  );
};

export default SelectDrop;
