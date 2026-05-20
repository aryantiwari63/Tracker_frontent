// import React, { useEffect, useState } from "react";
// import campdataams from "../../../../data/Amazon/campdataams.json";
// import AmsAdgroupTable from "../../../common-components/Table.js/AmsAdgroupTable";
// import AmsFsnTable from "../../../common-components/Table.js/AmsFsnTable";

// const AmazonFsnTable=()=>{
//     const [tableData, setTableData] = useState({
//     header: [],
//     body: [],
//     footer: [],
//   });

//   useEffect(() => {
//     setTableData({
//       header: campdataams.fsnheader,
//       body: campdataams.fsnbody,
//       footer: campdataams.fsnfooter,
//     });
//   }, []);
//     return(
//         <>
//          <AmsFsnTable
//         headers={tableData.header}
//         bodyContent={tableData.body}
//         footer={tableData.footer}
//         isCheckBoxRequired={true}
//         loading={false}
//       />
        
//         </>
//     )
// } 

// export default AmazonFsnTable