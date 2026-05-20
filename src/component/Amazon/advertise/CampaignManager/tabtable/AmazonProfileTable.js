import React, { useEffect, useState } from "react";
import campdataams from "../../../../../data/Amazon/campdataams.json"
import AmsPlacementTable from "../../../../common-components/Table.js/AmsPlacementTable";

const AmazonPlacementTable = () => {
  const [tableData, setTableData] = useState({
    header: [],
    body: [],
    footer: [],
  });

  useEffect(() => {
    setTableData({
      header: campdataams.placementheader,
      body: campdataams.placementbody,
      footer: campdataams.placementfooter,
    });
  }, []);

  return (
    <>
      <AmsPlacementTable
        headers={tableData.header}
        bodyContent={tableData.body}
        footer={tableData.footer}
        isCheckBoxRequired={true}
        loading={false}
      />
    </>
  );
};

export default AmazonPlacementTable;
