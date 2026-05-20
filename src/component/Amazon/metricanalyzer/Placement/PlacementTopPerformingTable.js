import React, { useEffect } from "react";
import {
  amazonMetricTablePlacementHeader,
} from "../../../../utils/amazonConstants";
import TopPerformingPlacementTable from "./TopPerformingPlacementTable";
import SelectBoxMetric from "../SelectBoxMetric";

const PlacementTopPerformingTable = ({
  callFrom,
  loading,
  setDataLimit,
  selectedMetric,
  topLevelData,
  topDataLimit,
  topCallApi,
  breakdown,
  setBreakdown,
}) => {
  const [showHeader, setShowHeader] = React.useState([
    ...amazonMetricTablePlacementHeader,
  ]);

  // const [showFilter, setShowFilter] = useState(false);

  // const applyFilter = React.useCallback(() => {
  //   setShowHeader(
  //     showHeader?.map((checkbox) =>
  //       checkbox.checked === true
  //         ? { ...checkbox, showCol: true }
  //         : { ...checkbox, showCol: false }
  //     )
  //   );
  //   setShowFilter(false);
  // }, [showHeader]);
  // const cancelFilter = () => {
  //   setShowHeader([...showHeader]);
  // };

  useEffect(() => {
    const title = {
      ctr: "CTR",
      cpc: "CPC",
      orders: "Orders",
      sales: "Sales",
      acos: "ACOS",
      roas: "ROAS",
      impressions: "Impressions",
      spend: "Spend",

    };
    const indexToSwap = 2;
    const objectToSwap = {
      id: 2,
      title: title[selectedMetric],
      value: selectedMetric === "orders" ? "conversion" : selectedMetric,
      showCol: true,
    };

    if (indexToSwap >= 0 && indexToSwap < showHeader.length) {
      const newData = [...showHeader];

      const temp = newData[indexToSwap];
      newData[indexToSwap] = objectToSwap;

      // Move the original object to the position of the new object
      newData[
        showHeader.findIndex((item) => item.value === objectToSwap.value)
      ] = temp;
      setShowHeader(newData);
    }
  }, [selectedMetric]);

  return (
    <>
      <div className="outerContainerTable px-2">
        <div className="outerContainerTable__header col_6">
          <div className="row ">
            <div className={["outerContainer__amsimage "].join("")}>
              <img
                className="px-2 pt-1 "
                src="/assets/images/campaign-icon1.svg"
                alt=""
              />
            </div>
            <div className="outerContainer__title self-center">
              Top Performing Placement
            </div>
          </div>
        </div>
        <div className="col_6">
          <div className="row pt-3  d-flex justify-end">
            <SelectBoxMetric
              breakdown={breakdown}
              setBreakdown={setBreakdown}
            />
          </div>
        </div>
        <div className="w-[100%]">
          <TopPerformingPlacementTable
            headers={showHeader}
            loading={loading}
            callFrom={callFrom}
            topLevelData={topLevelData}
            setDataLimit={setDataLimit}
            topCallApi={topCallApi}
            topDataLimit={topDataLimit}
          />
        </div>
      </div>
    </>
  );
};
export default PlacementTopPerformingTable;
