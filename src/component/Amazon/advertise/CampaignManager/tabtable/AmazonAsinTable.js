import React, { useEffect, useState } from "react";
import campdataams from "../../../../../data/Amazon/campdataams.json"
import AmsAsinTable from "../../../../common-components/Table.js/AmsAsinTable";

const AmazonAsinTable = () => {
  const [tableData, setTableData] = useState({
    header: [],
    body: [],
    footer: [],
  });

  useEffect(() => {
    setTableData({
      header: campdataams.asinheader,
      body: campdataams.asinbody,
      footer: campdataams.asinfooter,
    });
  }, []);

  return (
    <>
      <AmsAsinTable
        headers={tableData.header}
        bodyContent={tableData.body}
        footer={tableData.footer}
        isCheckBoxRequired={true}
        loading={false}
      />
    </>
  );
};

export default AmazonAsinTable;
