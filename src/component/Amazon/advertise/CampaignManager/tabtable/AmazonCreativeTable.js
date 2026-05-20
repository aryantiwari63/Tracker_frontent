import React, { useEffect, useState } from "react";
import campdataams from "../../../../../data/Amazon/campdataams.json";
import AmsCreativeTable from "../../../../common-components/Table.js/AmsCreativeTable";

const AmazonCreativeTable = () => {
  const [tableData, setTableData] = useState({
    header: [],
    body: [],
    footer: [],
  });

  useEffect(() => {
    setTableData({
      header: campdataams.creativeheader,
      body: campdataams.creativebody,
      footer: campdataams.creativefooter,
    });
  }, []);

  return (
    <>
      <AmsCreativeTable
        headers={tableData.header}
        bodyContent={tableData.body}
        footer={tableData.footer}
        isCheckBoxRequired={true}
        loading={false}
      />
    </>
  );
};

export default AmazonCreativeTable;
