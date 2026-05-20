// import React, { useState } from "react";
// import { _POST } from "../../../../../services/axios.method";
// import { cancelRequest } from "../../../../../utils/helpers";

// const PlagarismBlock = ({ selectedRow }) => {
//   const [details, setDetails] = React.useState();

//   const productDetails = async () => {
//     try {
//       const ourRequest = await cancelRequest();
//       const res = await _POST(
//         "/catalog/getSelectProductDetails",
//         {
//           product_name: selectedRow[0].product_name,
//         },
//         {
//           cancelToken: ourRequest.token,
//         }
//       );
//       if (res?.data?.status) {
//         setDetails({ ...res?.data?.data[0] });
//       }

//
//     } catch (e) {
//       console.log(e);
//     }
//   };
//   React.useEffect(() => {
//     productDetails();
//   }, []);
//   React.useEffect(() => {
//     console.log("selectedRow111111 details", details);
//   }, [details]);
//   React.useEffect(() => {
//     console.log("selectedRow111111 namePlag", namePlag);
//   }, [namePlag]);
//   React.useEffect(() => {
//     console.log("selectedRow111111 weightPlag", weightPlag);
//   }, [weightPlag]);
//   return (
//     <>
//       <div className="row pt-3">
//         <div className="col_6 ">
//           <div>
//             <b>Plagarism checker</b>
//           </div>
//           <div>
//             <p>No Plagarism Found</p>
//             <p>Name</p>
//             <p>Indegredient</p>
//             <p>Weight</p>
//           </div>
//           <div>
//             <b>Product Details</b>
//             <div>
//               <p>Name:{details && details?.product_name}</p>
//               <p>Rate:Mrp:{details && details?.product_mrp}</p>
//               <p>Weight:{details && details?.product_weight}</p>
//               {/* <p>Indegredient:{details && details?.}</p>
//               <p>Flavor:{details && details?.product_name}</p> */}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };
// export default PlagarismBlock;
