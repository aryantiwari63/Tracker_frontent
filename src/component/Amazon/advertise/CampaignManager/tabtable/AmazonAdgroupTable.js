import React, { useEffect, useState } from "react";
import campdataams from "../../../../../data/Amazon/campdataams.json";
import AmsAdgroupTable from "../../../../common-components/Table.js/AmsAdgroupTable";

const AmazonAdgroupTable=()=>{
    const [tableData, setTableData] = useState({
    header: [],
    body: [],
    footer: [],
  });

  useEffect(() => {
    setTableData({
      header: campdataams.advertiseadgroupheader,
      body: campdataams.advertiseadgroupbody,
      footer: campdataams.adgroupfooter,
    });
  }, []);
    return(
        <>
         <AmsAdgroupTable
        headers={tableData.header}
        bodyContent={tableData.body}
        footer={tableData.footer}
        isCheckBoxRequired={true}
        loading={false}
      />
        
        </>
    )
} 

export default AmazonAdgroupTable