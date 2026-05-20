import React, { useEffect, useState } from "react";
import campdataams from "../../../../../data/Amazon/campdataams.json";

const AmazonKeywordTable = () => {
  // eslint-disable-next-line no-unused-vars
  const [tableData, setTableData] = useState({
    header: [],
    body: [],
    footer: [],
  });

  useEffect(() => {
    setTableData({
      header: campdataams.keywordheader,
      body: campdataams.keywordbody,
      footer: campdataams.keywordfooter,
    });
  }, []);

  return (
    <>
      {/* <AmsKeywordTable
        headers={tableData.header}
        bodyContent={tableData.body}
        footer={tableData.footer}
        isCheckBoxRequired={true}
        loading={false}
      /> */}
    </>
  );
};

export default AmazonKeywordTable;
