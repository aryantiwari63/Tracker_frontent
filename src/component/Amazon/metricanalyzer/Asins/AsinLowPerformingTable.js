import React, { useEffect } from "react";
import {
  amazonMetricTableAsinHeader,
} from "../../../../utils/amazonConstants";
import LowPerformingAsinTable from "./LowPerformingAsinTable";

import SelectBoxMetric from "../SelectBoxMetric";

const AsinLowPerformingTable = ({
  loading,
  setDataLimit,
  selectedMetric,
  lowDataLimit,
  lowLevelData,
  lowCallApi,
  breakdown,
  setBreakdown,
}) => {
  const [showHeader, setShowHeader] = React.useState([
    ...amazonMetricTableAsinHeader,
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
    const indexToSwap = 3;
    const objectToSwap = {
      id: 3,
      title: title[selectedMetric],
      value: selectedMetric,
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
      <div className="outerContainerTableMetric px-2 row">
        <div className="outerContainerTableMetric__header col_6">
          <div className="row pt-1.5">
            <div className="">
              <img
                className="px-2 pt-1 "
                src="/assets/images/bar-chart.png"
                alt=""
              />
            </div>
            <div className="outerContainer__title self-center">
              Lowest Performing ASINS
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
          <LowPerformingAsinTable
            loading={loading}
            headers={showHeader}
            // sortBy={sortBy}
            // sortData={sortData}
            lowLevelData={lowLevelData}
            setDataLimit={setDataLimit}
            lowDataLimit={lowDataLimit}
            lowCallApi={lowCallApi}
          />
        </div>
      </div>
    </>
  );
};
export default AsinLowPerformingTable;
