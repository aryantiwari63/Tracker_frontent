import React, { useEffect, useState } from "react";
import campdataams from "../../../../../data/Amazon/campdataams.json"
import AmsPortfoliTable from "../../../../common-components/Table.js/AmsPorfolioTable";

const AmazonPortfoliTable = () => {
  const [tableData, setTableData] = useState({
    header: [],
    body: [],
    footer: [],
  });

  useEffect(() => {
    setTableData({
      header: campdataams.portfolioheader,
      body: campdataams.portfoliobody,
      footer: campdataams.portfoliofooter,
    });
  }, []);

  return (
    <>
      <AmsPortfoliTable
        headers={tableData.header}
        bodyContent={tableData.body}
        footer={tableData.footer}
        isCheckBoxRequired={true}
        loading={false}
      />
    </>
  );
};

export default AmazonPortfoliTable;
