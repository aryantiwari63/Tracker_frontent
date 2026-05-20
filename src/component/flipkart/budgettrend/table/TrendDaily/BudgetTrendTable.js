import React from "react";
import TrendTable from "../TrendSummary/TrendTable";
import campData from "../../../../../data/flipkart/reports/campData.json";
import { budgetTrendHeaders } from "../../../../../utils/constants";

const BudgetTrendTable = () => {
  // eslint-disable-next-line no-unused-vars
  const [showHeader, setShowHeader] = React.useState([...budgetTrendHeaders]);

  return (
    <>
      <TrendTable
        bodyContent={campData.aaData}
        headers={showHeader}
        source={"keyword"}
        isCheckBoxRequired={true}
      />
    </>
  );
};
export default BudgetTrendTable;
