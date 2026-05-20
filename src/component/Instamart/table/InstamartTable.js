/* eslint-disable no-unused-vars */
// import React from "react";

// // import CustomizeDropDown from "../flipkart/CustomizeDropDown";
// // import TableTitle from "./TableTitle";
// // import CircularProgress from "@mui/material/CircularProgress";
// // import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
// // import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
// import Pagination from "../../pagination";
// import { convertDateFormatToDateMonthNameYear } from "../../../utils/helpers";

// import PreviewBtn from "../../flipkart/Rules/button/Previewbtn";
// import "./style.css";
// import LoaderSpinner from "../../common-components/loader-spinner";

// const InstamartTable = ({
//   headers,
//   bodyContent,
//   loading,
//   sortData,
//   paginate,
//   totalData,
//   page,
//   offset,
//   source,
//   isCheckBoxRequired,
//   setEditData,
//   editData,
//   customCss,
//   sortBy,
// }) => {
//   const parser = new DOMParser();
//   React.useEffect(() => {
//     console.log("editData 1", editData);
//   }, [editData]);

//   const handleCheckBox = (check, data) => {
//     if (check) {
//       setEditData([...editData, data]);
//     } else {
//       setEditData(editData.filter((item) => item._id !== data._id));
//     }
//   };
//   const handleAllCheckBox = (check, data) => {
//     if (check) {
//       setEditData([...data]);
//     } else {
//       setEditData([]);
//     }
//   };

//   const userName = localStorage.getItem("name");
//   console.log("headers", headers);
//   let tableouterClass = [
//     isCheckBoxRequired
//       ? "campaignreportcheckbox__table "
//       : customCss === true
//       ? "rules_outer_table"
//       : "campaignreport__table w-full",
//     customCss ? "rule_headers" : "",
//   ];
//   return (
//     <>
//       <div className="bg-white">
//         <div
//           className={tableouterClass.join(" ")}
//           // className={"campaignreport__table "}
//         >
//           <table className="w-full">
//             <thead
//               className={
//                 isCheckBoxRequired
//                   ? "campaignreportcheckbox__tablehead table-fixed "
//                   : "campaignreport__tablehead  table-fixed"
//               }
//             >
//               <tr className="">
//                 {isCheckBoxRequired === true && (
//                   <th className=" pl-2">
//                     <input
//                       className=" h-16"
//                       type="checkbox"
//                       checked={editData?.length === bodyContent?.length}
//                       onChange={(e) =>
//                         handleAllCheckBox(e.target.checked, bodyContent)
//                       }
//                     />
//                   </th>
//                 )}

//                 {headers?.map((item, i) => {
//                   if (item.showCol) {
//                     return (
//                       <>
//                         {item.type === "single" ? (
//                           <th className="">
//                             <div
//                               className={
//                                 customCss === true
//                                   ? "rule_table "
//                                   : "tableHead py-3 px-1.5 "
//                               }
//                             >
//                               <p>{item.title}</p>
//                               {item.show && (
//                                 <div
//                                   className={
//                                     customCss === true
//                                       ? "rule_arrow"
//                                       : "sortArrow cursor-pointer"
//                                   }
//                                 >
//                                   <div>
//                                     <div
//                                       onClick={() => sortData(item?.value, 1)}
//                                       style={{
//                                         color:
//                                           sortBy.key === item.value &&
//                                           sortBy.order === 1
//                                             ? "black"
//                                             : "grey",
//                                       }}
//                                     >
//                                       ▲
//                                     </div>
//                                   </div>
//                                   <div>
//                                     <div
//                                       className="downArrow"
//                                       onClick={() => sortData(item?.value, -1)}
//                                       style={{
//                                         color:
//                                           sortBy.key === item.value &&
//                                           sortBy.order === -1
//                                             ? "black"
//                                             : "grey",
//                                       }}
//                                     >
//                                       ▼
//                                     </div>
//                                   </div>
//                                 </div>
//                               )}
//                             </div>
//                           </th>
//                         ) : (
//                           <th rowSpan={3} className="multiCol">
//                             <div className="graycol">{item.title}</div>
//                             {item.showCol &&
//                               item.subTitles?.map((v, i) => {
//                                 return <td className="graydirect">{v}</td>;
//                               })}
//                           </th>
//                         )}
//                       </>
//                     );
//                   }
//                   // if (item.show) {
//                   //   return item.type === "single" ? (
//                   //     <th>
//                   //       <div className="tableHead">
//                   //         <p>{item.title}</p>
//                   //         <div className="sortArrow">
//                   //           <ArrowDropUpIcon
//                   //             className="arrowUp"
//                   //             onClick={() => sortData(item?.value, 1)}
//                   //           />
//                   //           <ArrowDropDownIcon
//                   //             className="arrowDown"
//                   //             onClick={() => sortData(item?.value, -1)}
//                   //           />
//                   //         </div>
//                   //       </div>
//                   //     </th>
//                   //   ) : (
//                   //     <th rowSpan={3}>
//                   //       <span className="graycol">{item.title}</span>
//                   //       {item.subTitles.map((v, i) => {
//                   //         return <td className="graydirect">{v}</td>;
//                   //       })}
//                   //     </th>
//                   //   );
//                   // }
//                 })}
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <>
//                   <td
//                     className="p-2"
//                     colSpan={16}
//                     rowSpan={3}
//                     style={{ alignItems: "center", verticalAlign: "middle" }}
//                   >
//                     <div className="loaderStyle">
//                       <LoaderSpinner />
//                     </div>
//                   </td>
//                 </>
//               ) : bodyContent && bodyContent.length > 0 ? (
//                 bodyContent?.map((item, i) => {
//                   if (source === "campaign") {
//                     return (
//                       <>
//                         <tr className="tablecontent">
//                           {item.campaign_name || item.campaign_name === 0 ? (
//                             <td className="p-2">
//                               <div>{item.campaign_name}</div>
//                             </td>
//                           ) : null}

//                           {item.segment || item.segment === 0 ? (
//                             <td className="p-2">
//                               <div> {item.segment}</div>
//                             </td>
//                           ) : null}
//                           {item.platform || item.platform === 0 ? (
//                             <td className="p-2">
//                               <div> {item.platform}</div>
//                             </td>
//                           ) : null}
//                           {item.spend || item.spend === 0 ? (
//                             <td className="p-2">
//                               <div>
//                                 {" "}
//                                 {"₹" + item.spend.toLocaleString(currency_format)}
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.spend || item.spend === 0 ? (
//                             <td className="p-2">
//                               <div>
//                                 {" "}
//                                 {"₹" + item.spend.toLocaleString(currency_format)}
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.views || item.views === 0 ? (
//                             <td className="p-2">
//                               <div> {item.views.toLocaleString(currency_format)}</div>
//                             </td>
//                           ) : null}
//                           {item.clicks || item.clicks === 0 ? (
//                             <td className="p-2">
//                               <div> {item.clicks.toLocaleString(currency_format)}</div>
//                             </td>
//                           ) : null}
//                           {item.CTR || item.CTR === 0 ? (
//                             <td className="p-2">
//                               <div> {item.CTR.toFixed(2) + "%"}</div>
//                             </td>
//                           ) : null}
//                           {item.cpc || item.cpc === 0 ? (
//                             <td className="p-2">
//                               <div> {item.cpc.toFixed(2)}</div>
//                             </td>
//                           ) : null}

//                           {item.ppv_direct_click ||
//                           item.ppv_direct_click === 0 ? (
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">
//                                   {item.ppv_direct_click.toLocaleString(
//                                     currency_format
//                                   )}
//                                 </div>
//                                 <div className="col">
//                                   {item.ppv_indirect_click.toLocaleString(
//                                     currency_format
//                                   )}
//                                 </div>
//                                 <div className="col font-semibold">
//                                   {item.total_ppv_data.toLocaleString(currency_format)}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.units_sold_direct ||
//                           item.units_sold_direct === 0 ? (
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">
//                                   {item.units_sold_direct.toLocaleString(
//                                     currency_format
//                                   )}
//                                 </div>
//                                 <div className="col">
//                                   {item.units_sold_indirect.toLocaleString(
//                                     currency_format
//                                   )}
//                                 </div>
//                                 <div className="col font-semibold">
//                                   {item.total_units_sold.toLocaleString(
//                                     currency_format
//                                   )}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.direct_revenue || item.direct_revenue === 0 ? (
//                             <td className="">
//                               <div className="row text-center ">
//                                 <div className="col">
//                                   {"₹" +
//                                     item.direct_revenue.toLocaleString(currency_format)}
//                                 </div>
//                                 <div className="col">
//                                   {"₹" +
//                                     item.indirect_revenue.toLocaleString(
//                                       currency_format
//                                     )}
//                                 </div>
//                                 <div className="col font-semibold">
//                                   {"₹" +
//                                     item.total_revenue.toLocaleString(currency_format)}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.cvr_direct || item.cvr_direct === 0 ? (
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">
//                                   {item.cvr_direct.toFixed(2) + "%"}
//                                 </div>
//                                 <div className="col">
//                                   {item.cvr_indirect.toFixed(2) + "%"}
//                                 </div>
//                                 <div className="col font-semibold">
//                                   {item.cvr_total.toFixed(2) + "%"}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.roi_direct || item.roi_direct === 0 ? (
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">
//                                   {item.roi_direct.toFixed(2)}
//                                 </div>
//                                 <div className="col">
//                                   {item.roi_indirect.toFixed(2)}
//                                 </div>
//                                 <div className="col font-semibold">
//                                   {item.total_roi.toFixed(2)}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.aov_direct || item.aov_direct === 0 ? (
//                             <td className="">
//                               <div className="row text-center text-[13px]">
//                                 <div className="col">
//                                   {item.aov_direct.toFixed(2)}
//                                 </div>
//                                 <div className="col">
//                                   {item.aov_indirect.toFixed(2)}
//                                 </div>
//                                 <div className="col font-semibold">
//                                   {item.aov_total.toFixed(2)}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                         </tr>
//                       </>
//                     );
//                   }
//                   if (source === "fsn") {
//                     return (
//                       <>
//                         <tr className="tablecontent">
//                           {item._id || item._id === 0 ? (
//                             <td className="p-2">
//                               <div> {item._id}</div>
//                             </td>
//                           ) : null}
//                           {item.product_name || item.product_name === 0 ? (
//                             <td className="p-2">
//                               <div> {item.product_name}</div>
//                             </td>
//                           ) : null}
//                           {item.adgroup_name || item.adgroup_name === 0 ? (
//                             <td className="p-2">
//                               <div> {item.adgroup_name}</div>
//                             </td>
//                           ) : null}
//                           {item.campaign_name || item.campaign_name === 0 ? (
//                             <td className="p-2">
//                               <div> {item.campaign_name}</div>
//                             </td>
//                           ) : null}
//                           {item.segment || item.segment === 0 ? (
//                             <td className="p-2">
//                               <div> {item.segment}</div>
//                             </td>
//                           ) : null}
//                           {item.platform || item.platform === 0 ? (
//                             <td className="p-2">
//                               <div> {item.platform}</div>
//                             </td>
//                           ) : null}
//                           {item.spent || item.spent === 0 ? (
//                             <td className="p-2">
//                               <div>
//                                 {" "}
//                                 {"₹" + item.spent.toLocaleString(currency_format)}
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.views || item.views === 0 ? (
//                             <td className="p-2">
//                               <div> {item.views.toLocaleString(currency_format)}</div>
//                             </td>
//                           ) : null}
//                           {item.add_to_baskets || item.add_to_baskets === 0 ? (
//                             <td className="p-2">
//                               <div> {item.add_to_baskets}</div>
//                             </td>
//                           ) : null}
//                           {item.add_to_basket_rate ||
//                           item.add_to_basket_rate === 0 ? (
//                             <td className="p-2">
//                               <div> {item.add_to_basket_rate}</div>
//                             </td>
//                           ) : null}
//                           {item.cpc || item.cpc === 0 ? (
//                             <td className="p-2">
//                               <div> {item.cpc.toFixed(2)}</div>
//                             </td>
//                           ) : null}
//                           {item.units_sold_direct ||
//                           item.units_sold_direct === 0 ? (
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">
//                                   {item.units_sold_direct.toLocaleString(
//                                     currency_format
//                                   )}
//                                 </div>
//                                 <div className="col">
//                                   {item.units_sold_indirect.toLocaleString(
//                                     currency_format
//                                   )}
//                                 </div>
//                                 <div className="col">
//                                   {item.total_units_sold.toLocaleString(
//                                     currency_format
//                                   )}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.direct_revenue || item.direct_revenue === 0 ? (
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">
//                                   {"₹" +
//                                     item.direct_revenue.toLocaleString(currency_format)}
//                                 </div>
//                                 <div className="col">
//                                   {"₹" +
//                                     item.indirect_revenue.toLocaleString(
//                                       currency_format
//                                     )}
//                                 </div>
//                                 <div className="col">
//                                   {"₹" +
//                                     item.total_revenue.toLocaleString(currency_format)}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.cvr_direct || item.cvr_direct === 0 ? (
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">
//                                   {item.cvr_direct.toFixed(2) + "%"}
//                                 </div>
//                                 <div className="col">
//                                   {item.cvr_indirect.toFixed(2) + "%"}
//                                 </div>
//                                 <div className="col">
//                                   {item.cvr_total.toFixed(2) + "%"}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.roi_direct ||
//                           item.roi_direct === 0 ||
//                           item.roi_indirect === 0 ||
//                           item.roi_total === 0 ? (
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">
//                                   {item.roi_direct.toFixed(2)}
//                                 </div>
//                                 <div className="col">
//                                   {item.roi_indirect.toFixed(2)}
//                                 </div>
//                                 <div className="col font-semibold">
//                                   {item.roi_total.toFixed(2)}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.aov_direct || item.aov_direct === 0 ? (
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">
//                                   {item.aov_direct.toFixed(2)}
//                                 </div>
//                                 <div className="col">
//                                   {item.aov_indirect.toFixed(2)}
//                                 </div>
//                                 <div className="col font-semibold">
//                                   {item.aov_total.toFixed(2)}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                         </tr>
//                       </>
//                     );
//                   }
//                   if (source === "creative") {
//                     return (
//                       <>
//                         <tr className="tablecontent">
//                           {item._id || item._id === 0 ? (
//                             <td className="p-2">
//                               <div> {item._id}</div>
//                             </td>
//                           ) : null}
//                           {item.banner_name || item.banner_name === 0 ? (
//                             <td className="p-2">
//                               <div> {item.banner_name}</div>
//                             </td>
//                           ) : null}
//                           {item.banner_preview || item.banner_preview === 0 ? (
//                             <td className="p-2">
//                               <div> {item.banner_preview}</div>
//                             </td>
//                           ) : null}
//                           {item.type_banner || item.type_banner === 0 ? (
//                             <td className="p-2">
//                               <div> {item.type_banner}</div>
//                             </td>
//                           ) : null}
//                           {item.ad_group_name || item.ad_group_name === 0 ? (
//                             <td className="p-2">
//                               <div> {item.ad_group_name}</div>
//                             </td>
//                           ) : null}
//                           {item.campaign_name || item.campaign_name === 0 ? (
//                             <td className="p-2">
//                               <div> {item.campaign_name}</div>
//                             </td>
//                           ) : null}
//                           {item.campaign_type || item.campaign_type === 0 ? (
//                             <td className="p-2">
//                               <div> {item.campaign_type}</div>
//                             </td>
//                           ) : null}
//                           {item.platform || item.platform === 0 ? (
//                             <td className="p-2">
//                               <div> {item.platform}</div>
//                             </td>
//                           ) : null}
//                           {item.banner_spend || item.banner_spend === 0 ? (
//                             <td className="p-2">
//                               <div> {item.banner_spend}</div>
//                             </td>
//                           ) : null}
//                           {item.views || item.views === 0 ? (
//                             <td className="p-2">
//                               <div> {item.views}</div>
//                             </td>
//                           ) : null}
//                           {item.clicks || item.clicks === 0 ? (
//                             <td className="p-2">
//                               <div> {item.clicks}</div>
//                             </td>
//                           ) : null}
//                           {/* {item.ctr || item.ctr == 0 ? (
//                             <td className="p-2">
//                               <div> {item.ctr.toFixed(2)}</div>
//                             </td>
//                           ) : null} */}
//                           {item.average_cpc || item.average_cpc === 0 ? (
//                             <td className="p-2">
//                               <div> {item.average_cpc.toFixed(2)}</div>
//                             </td>
//                           ) : null}
//                           {item.units_sold ||
//                           item.direct_units_sold ||
//                           item.units_sold == 0 ? (
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">
//                                   {item.direct_units_sold.toFixed(2)}
//                                 </div>
//                                 <div className="col">
//                                   {item.indirect_units_sold.toFixed(2)}
//                                 </div>
//                                 <div className="col font-semibold">
//                                   {item.units_sold.toFixed(2)}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.ppv_direct_click ||
//                           item.ppv_direct_click == 0 ? (
//                             // <td className="p-2">
//                             //   <div> {item.ppv_direct_click}</div>
//                             //   </td>
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">
//                                   {item.ppv_direct_click.toFixed(2)}
//                                 </div>
//                                 <div className="col">
//                                   {item.ppv_indirect_click.toFixed(2)}
//                                 </div>
//                                 <div className="col font-semibold">
//                                   {item.ppv_total.toFixed(2)}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.direct_revenue || item.direct_revenue == 0 ? (
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">
//                                   {item.direct_revenue.toFixed(2)}
//                                 </div>
//                                 <div className="col">
//                                   {item.indirect_revenue.toFixed(2)}
//                                 </div>
//                                 <div className="col">
//                                   {item.revenue.toFixed(2)}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.direct_cvr || item.direct_cvr == 0 ? (
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">
//                                   {item.direct_cvr.toFixed(2) + "%"}
//                                 </div>
//                                 <div className="col">
//                                   {item.indirect_cvr.toFixed(2) + "%"}
//                                 </div>
//                                 <div className="col">
//                                   {item.cvr.toFixed(2) + "%"}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.direct_roi || item.direct_roi == 0 ? (
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">
//                                   {item.direct_roi.toFixed(2)}
//                                 </div>
//                                 <div className="col">
//                                   {item.indirect_roi.toFixed(2)}
//                                 </div>
//                                 <div className="col">{item.roi.toFixed(2)}</div>
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.direct_aov || item.direct_aov == 0 ? (
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">
//                                   {item.direct_aov.toFixed(2)}
//                                 </div>
//                                 <div className="col">
//                                   {item.indirect_aov.toFixed(2)}
//                                 </div>
//                                 <div className="col">{item.aov.toFixed(2)}</div>
//                               </div>
//                             </td>
//                           ) : null}
//                         </tr>
//                       </>
//                     );
//                   }
//                   if (source == "adgroup") {
//                     return (
//                       <>
//                         <tr className="tablecontent">
//                           {item.adgroup_name || item.adgroup_name == 0 ? (
//                             <td className="p-2">
//                               <div> {item.adgroup_name}</div>
//                             </td>
//                           ) : null}
//                           {item.campaign_name || item.campaign_name == 0 ? (
//                             <td className="p-2">
//                               <div> {item.campaign_name}</div>
//                             </td>
//                           ) : null}
//                           {item.segment || item.segment == 0 ? (
//                             <td className="p-2">
//                               <div> {item.segment}</div>
//                             </td>
//                           ) : null}
//                           {item.platform || item.platform == 0 ? (
//                             <td className="p-2">
//                               <div> {item.platform}</div>
//                             </td>
//                           ) : null}
//                           {item.campaign_budget || item.campaign_budget == 0 ? (
//                             <td className="p-2">
//                               <div>
//                                 {" "}
//                                 {item.campaign_budget != null
//                                   ? "₹" +
//                                     item.campaign_budget.toLocaleString(currency_format)
//                                   : "N/A"}
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.spend || item.spend == 0 ? (
//                             <td className="p-2">
//                               <div>
//                                 {" "}
//                                 {"₹" + item.spend.toLocaleString(currency_format)}
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.created_on || item.created_on == 0 ? (
//                             <td className="p-2">
//                               <div>
//                                 {" "}
//                                 {convertDateFormatToDateMonthNameYear(
//                                   item.created_on
//                                 )}
//                               </div>
//                             </td>
//                           ) : null}

//                           {item.views || item.views == 0 ? (
//                             <td className="p-2">
//                               <div> {item.views.toLocaleString(currency_format)}</div>
//                             </td>
//                           ) : null}
//                           {item.clicks || item.clicks == 0 ? (
//                             <td className="p-2">
//                               <div> {item.clicks.toLocaleString(currency_format)}</div>
//                             </td>
//                           ) : null}
//                           {item.CTR || item.CTR == 0 ? (
//                             <td className="p-2">
//                               <div> {item.CTR.toFixed(2) + "%"}</div>
//                             </td>
//                           ) : null}
//                           {item.cpc || item.cpc == 0 ? (
//                             <td className="p-2">
//                               <div> {item.cpc.toFixed(2)}</div>
//                             </td>
//                           ) : null}
//                           {item.ppv_direct_click ||
//                           item.ppv_direct_click == 0 ? (
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">
//                                   {item.ppv_direct_click.toLocaleString(
//                                     currency_format
//                                   )}
//                                 </div>
//                                 <div className="col">
//                                   {item.ppv_indirect_click.toLocaleString(
//                                     currency_format
//                                   )}
//                                 </div>
//                                 <div className="col font-semibold">
//                                   {item.total_ppv_data.toLocaleString(currency_format)}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.units_sold_direct ||
//                           item.units_sold_direct == 0 ? (
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">
//                                   {item.units_sold_direct.toLocaleString(
//                                     currency_format
//                                   )}
//                                 </div>
//                                 <div className="col">
//                                   {item.units_sold_indirect.toLocaleString(
//                                     currency_format
//                                   )}
//                                 </div>
//                                 <div className="col font-semibold">
//                                   {item.total_units_sold.toLocaleString(
//                                     currency_format
//                                   )}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.direct_revenue || item.direct_revenue == 0 ? (
//                             <td className="">
//                               <div className="row text-center ">
//                                 <div className="col">
//                                   {"₹" +
//                                     item.direct_revenue.toLocaleString(currency_format)}
//                                 </div>
//                                 <div className="col">
//                                   {"₹" +
//                                     item.indirect_revenue.toLocaleString(
//                                       currency_format
//                                     )}
//                                 </div>
//                                 <div className="col font-semibold">
//                                   {"₹" +
//                                     item.total_revenue.toLocaleString(currency_format)}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.cvr_direct || item.cvr_direct == 0 ? (
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">
//                                   {item.cvr_direct.toFixed(2) + "%"}
//                                 </div>
//                                 <div className="col">
//                                   {item.cvr_indirect.toFixed(2) + "%"}
//                                 </div>
//                                 <div className="col font-semibold">
//                                   {item.cvr_total.toFixed(2) + "%"}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.roi_direct || item.roi_direct == 0 ? (
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">
//                                   {item.roi_direct.toFixed(2)}
//                                 </div>
//                                 <div className="col">
//                                   {item.roi_indirect.toFixed(2)}
//                                 </div>
//                                 <div className="col font-semibold">
//                                   {item.total_roi.toFixed(2)}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.aov_direct || item.aov_direct == 0 ? (
//                             <td className="">
//                               <div className="row text-center text-[13px]">
//                                 <div className="col">
//                                   {item.aov_direct.toFixed(2)}
//                                 </div>
//                                 <div className="col">
//                                   {item.aov_indirect.toFixed(2)}
//                                 </div>
//                                 <div className="col font-semibold">
//                                   {item.aov_total.toFixed(2)}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                         </tr>
//                       </>
//                     );
//                   }
//                   if (source == "revenue") {
//                     return (
//                       <>
//                         <tr className="tablecontent">
//                           {item.created_on || item.created_on == 0 ? (
//                             <td className="p-2">
//                               <div>
//                                 {convertDateFormatToDateMonthNameYear(
//                                   item.created_on
//                                 )}
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.mode || item.mode == 0 ? (
//                             <td className="px-2">
//                               <div>
//                                 <b className="font-semibold text-sm">Direct</b>
//                                 <br />
//                                 <b className="font-normal text-sm">Indirect</b>
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.orders || item.orders == 0 ? (
//                             <td className="px-2">
//                               <div> {item.orders}</div>
//                             </td>
//                           ) : null}
//                           {item.direct_revenue || item.direct_revenue == 0 ? (
//                             <td className="px-2.5">
//                               <div>
//                                 <b className="font-semibold text-sm">
//                                   ₹{item.direct_revenue.toFixed(2)}
//                                 </b>
//                                 <br />
//                                 <b className="font-normal text-sm">
//                                   ₹{item.indirect_revenue.toFixed(2)}
//                                 </b>
//                                 <br />
//                                 {item.direct_revenue - item.indirect_revenue > 0
//                                   ? "▲"
//                                   : "▼"}
//                                 <b className="text-[#23BC7C] font-normal text-sm ">
//                                   {(
//                                     (Math.abs(
//                                       item.direct_revenue -
//                                         item.indirect_revenue
//                                     ) /
//                                       item.direct_revenue) *
//                                     100
//                                   ).toFixed(2)}
//                                   %
//                                 </b>
//                               </div>
//                             </td>
//                           ) : null}

//                           {item.direct_aov || item.direct_aov == 0 ? (
//                             <td className="px-2">
//                               <div>
//                                 <b className="font-semibold text-sm">
//                                   {item.direct_aov.toFixed(2)}
//                                 </b>
//                                 <br />
//                                 <b className="font-normal text-sm">
//                                   {item.indirect_aov.toFixed(2)}
//                                 </b>
//                                 <br />
//                                 {item.direct_aov - item.indirect_aov > 0
//                                   ? "▲"
//                                   : "▼"}
//                                 <b className="text-[#23BC7C] font-normal text-sm">
//                                   {(
//                                     (Math.abs(
//                                       item.direct_aov - item.indirect_aov
//                                     ) /
//                                       item.direct_aov) *
//                                     100
//                                   ).toFixed(2)}
//                                   %
//                                 </b>
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.clicks || item.clicks == 0 ? (
//                             <td className="px-2">
//                               <div> {item.clicks.toLocaleString(currency_format)}</div>
//                             </td>
//                           ) : null}
//                           {item.views || item.views == 0 ? (
//                             <td className="">
//                               <div> {item.views.toLocaleString(currency_format)}</div>
//                             </td>
//                           ) : null}
//                           {item.direct_roi || item.direct_roi == 0 ? (
//                             <td className="">
//                               <div>
//                                 <b className="font-semibold text-sm">
//                                   ₹{item.direct_roi.toFixed(2)}
//                                 </b>
//                                 <br />
//                                 <b className="font-normal text-sm">
//                                   ₹{item.indirect_roi.toFixed(2)}
//                                 </b>
//                                 <br />
//                                 {item.direct_roi - item.indirect_roi > 0
//                                   ? "▲"
//                                   : "▼"}
//                                 <b className="text-[#23BC7C] font-normal text-sm">
//                                   {(
//                                     (Math.abs(
//                                       item.direct_roi - item.indirect_roi
//                                     ) /
//                                       item.direct_roi) *
//                                     100
//                                   ).toFixed(2)}
//                                   %
//                                 </b>
//                               </div>
//                             </td>
//                           ) : null}

//                           {item.cpc || item.cpc == 0 ? (
//                             <td className="p-2">
//                               <div> {item.cpc.toFixed(2)}</div>
//                             </td>
//                           ) : null}
//                         </tr>
//                       </>
//                     );
//                   }
//                   if (source == "keyword") {
//                     return (
//                       <>
//                         {/* <div className=""> */}
//                         {/* </div> */}
//                         <tr
//                           className={
//                             isCheckBoxRequired
//                               ? "tableContentCheckBox"
//                               : "tablecontent"
//                           }
//                         >
//                           {/* {isCheckBoxRequired === true && (
//                             <td className="pl-2">
//                               <input
//                                 className="h-16 m-2 bg-red-200"
//                                 type="checkbox"
//                                 onChange={(e) => handleCheckBox(e, item)}
//                               />
//                             </td>
//                           )} */}

//                           {item.keyword || item.keyword == 0 ? (
//                             <td className="p-2">

//                               <div> {item.keyword}</div>
//                             </td>
//                           ) : null}
//                           {item.keyword_match_type ||
//                           item.keyword_match_type == 0 ? (
//                             <td className="p-2">
//                               <div> {item.keyword_match_type}</div>
//                             </td>
//                           ) : null}
//                           {item.segment || item.segment == 0 ? (
//                             <td className="p-2">
//                               <div> {item.segment}</div>
//                             </td>
//                           ) : null}

//                           {item.ad_group_name || item.ad_group_name == 0 ? (
//                             <td className="p-2">
//                               <div> {item.ad_group_name}</div>
//                             </td>
//                           ) : null}
//                           {item.campaign_name || item.campaign_name == 0 ? (
//                             <td className="p-2">
//                               <div> {item.campaign_name}</div>
//                             </td>
//                           ) : null}
//                           {item.platform || item.platform == 0 ? (
//                             <td className="p-2">
//                               <div> {item.platform}</div>
//                             </td>
//                           ) : null}
//                           {item.spend || item.spend == 0 ? (
//                             <td className="p-2">
//                               <div>
//                                 {" "}
//                                 {"₹" + item.spend.toLocaleString(currency_format)}
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.views || item.views == 0 ? (
//                             <td className="p-2">
//                               <div> {item.views.toLocaleString(currency_format)}</div>
//                             </td>
//                           ) : null}

//                           {item.clicks || item.clicks == 0 ? (
//                             <td className="p-2">
//                               <div> {item.clicks.toLocaleString(currency_format)}</div>
//                             </td>
//                           ) : null}
//                           {item.cpc || item.cpc == 0 ? (
//                             <td className="p-2">
//                               <div> {item.cpc.toFixed(2)}</div>
//                             </td>
//                           ) : null}
//                           {item.ctr || item.ctr == 0 ? (
//                             <td className="p-2">
//                               <div> {item.ctr.toFixed(2) + "%"}</div>
//                             </td>
//                           ) : null}
//                           {item.direct_units_sold ||
//                           item.direct_units_sold == 0 ? (
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">
//                                   {item.direct_units_sold.toLocaleString(
//                                     currency_format
//                                   )}
//                                 </div>
//                                 <div className="col">
//                                   {item.indirect_units_sold.toLocaleString(
//                                     currency_format
//                                   )}
//                                 </div>
//                                 <div className="col font-semibold">
//                                   {item.total_units_sold.toLocaleString(
//                                     currency_format
//                                   )}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.direct_revenue || item.direct_revenue == 0 ? (
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">
//                                   {"₹" +
//                                     item.direct_revenue.toLocaleString(currency_format)}
//                                 </div>
//                                 <div className="col">
//                                   {"₹" +
//                                     item.indirect_revenue.toLocaleString(
//                                       currency_format
//                                     )}
//                                 </div>
//                                 <div className="col font-semibold">
//                                   {"₹" +
//                                     item.total_revenue.toLocaleString(currency_format)}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.cvr_direct || item.cvr_direct == 0 ? (
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">
//                                   {item.cvr_direct.toFixed(2) + "%"}
//                                 </div>
//                                 <div className="col">
//                                   {item.cvr_indirect.toFixed(2) + "%"}
//                                 </div>
//                                 <div className="col font-semibold">
//                                   {item.cvr_total.toFixed(2) + "%"}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.roi_direct || item.roi_direct == 0 ? (
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">
//                                   {item.roi_direct.toFixed(2)}
//                                 </div>
//                                 <div className="col">
//                                   {item.roi_indirect.toFixed(2)}
//                                 </div>
//                                 <div className="col font-semibold">
//                                   {item.roi_total.toFixed(2)}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.aov_direct || item.aov_direct == 0 ? (
//                             <td className="">
//                               <div className="row text-center ">
//                                 <div className="col">
//                                   {item.aov_direct.toFixed(2)}
//                                 </div>
//                                 <div className="col">
//                                   {item.aov_indirect.toFixed(2)}
//                                 </div>
//                                 <div className="col font-semibold">
//                                   {item.aov_total.toFixed(2)}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                         </tr>
//                       </>
//                     );
//                   }
//                   if (source == "search") {
//                     return (
//                       <>
//                         {/* <div className=""> */}
//                         {/* </div> */}
//                         <tr
//                           className={
//                             isCheckBoxRequired
//                               ? "tableContentCheckBox"
//                               : "tablecontent"
//                           }
//                         >
//                           {/* {isCheckBoxRequired === true && (
//                             <td className="pl-20">
//                               <input
//                                 className="h-16"
//                                 type="checkbox"
//                                 onChange={(e) => handleCheckBox(e, item)}
//                               />
//                             </td>
//                           )} */}

//                           {item.search_term || item.search_term == 0 ? (
//                             <td className="p-2">
//                               {" "}
//                               <div> {item.search_term}</div>
//                             </td>
//                           ) : null}
//                           {item.campaign_name || item.campaign_name == 0 ? (
//                             <td className="p-2">
//                               <div> {item.campaign_name}</div>
//                             </td>
//                           ) : null}
//                           {item.segment || item.segment == 0 ? (
//                             <td className="p-2">
//                               <div> {item.segment}</div>
//                             </td>
//                           ) : null}

//                           {item.ad_group_name || item.ad_group_name == 0 ? (
//                             <td className="p-2">
//                               <div> {item.ad_group_name}</div>
//                             </td>
//                           ) : null}
//                           {item.platform || item.platform == 0 ? (
//                             <td className="p-2">
//                               <div> {item.platform}</div>
//                             </td>
//                           ) : null}
//                           {item.spend || item.spend == 0 ? (
//                             <td className="p-2">
//                               <div>
//                                 {" "}
//                                 {"₹" + item.spend.toLocaleString(currency_format)}
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.views || item.views == 0 ? (
//                             <td className="p-2">
//                               <div> {item.views.toLocaleString(currency_format)}</div>
//                             </td>
//                           ) : null}

//                           {item.clicks || item.clicks == 0 ? (
//                             <td className="p-2">
//                               <div> {item.clicks.toLocaleString(currency_format)}</div>
//                             </td>
//                           ) : null}
//                           {item.ctr || item.ctr == 0 ? (
//                             <td className="p-2">
//                               <div> {item.ctr.toFixed(2) + "%"}</div>
//                             </td>
//                           ) : null}
//                           {item.cpc || item.cpc == 0 ? (
//                             <td className="p-2">
//                               <div> {item.cpc.toFixed(2)}</div>
//                             </td>
//                           ) : null}
//                           {item.direct_units_sold ||
//                           item.direct_units_sold == 0 ? (
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">
//                                   {item.direct_units_sold.toLocaleString(
//                                     currency_format
//                                   )}
//                                 </div>
//                                 <div className="col">
//                                   {item.indirect_units_sold.toLocaleString(
//                                     currency_format
//                                   )}
//                                 </div>
//                                 <div className="col font-semibold">
//                                   {item.total_units_sold.toLocaleString(
//                                     currency_format
//                                   )}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.direct_revenue || item.direct_revenue == 0 ? (
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">
//                                   {"₹" +
//                                     item.direct_revenue.toLocaleString(currency_format)}
//                                 </div>
//                                 <div className="col">
//                                   {"₹" +
//                                     item.indirect_revenue.toLocaleString(
//                                       currency_format
//                                     )}
//                                 </div>
//                                 <div className="col font-semibold">
//                                   {"₹" +
//                                     item.total_revenue.toLocaleString(currency_format)}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.cvr_direct || item.cvr_direct == 0 ? (
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">
//                                   {item.cvr_direct.toFixed(2) + "%"}
//                                 </div>
//                                 <div className="col">
//                                   {item.cvr_indirect.toFixed(2) + "%"}
//                                 </div>
//                                 <div className="col font-semibold">
//                                   {item.cvr_total.toFixed(2) + "%"}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.roi_direct || item.roi_direct == 0 ? (
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">
//                                   {item.roi_direct.toFixed(2)}
//                                 </div>
//                                 <div className="col">
//                                   {item.roi_indirect.toFixed(2)}
//                                 </div>
//                                 <div className="col font-semibold">
//                                   {item.roi_total.toFixed(2)}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.aov_direct || item.aov_direct == 0 ? (
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">
//                                   {item.aov_direct.toFixed(2)}
//                                 </div>
//                                 <div className="col">
//                                   {item.aov_indirect.toFixed(2)}
//                                 </div>
//                                 <div className="col font-semibold">
//                                   {item.aov_total.toFixed(2)}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                         </tr>
//                       </>
//                     );
//                   }
//                   if (source == "placement") {
//                     return (
//                       <>
//                         {/* <div className=""> */}
//                         {/* </div> */}
//                         <tr
//                           className={
//                             isCheckBoxRequired
//                               ? "tableContentCheckBox"
//                               : "tablecontent"
//                           }
//                         >
//                           {/* {isCheckBoxRequired === true && (
//                             <td className="pl-2">
//                               <input
//                                 className="h-16"
//                                 type="checkbox"
//                                 onChange={(e) => handleCheckBox(e, item)}
//                               />
//                             </td>
//                           )} */}

//                           {item.placement_type || item.placement_type == 0 ? (
//                             <td className="p-2">
//                               {" "}
//                               <div> {item.placement_type}</div>
//                             </td>
//                           ) : null}
//                           {item.segment || item.segment == 0 ? (
//                             <td className="p-2">
//                               <div> {item.segment}</div>
//                             </td>
//                           ) : null}

//                           {item.campaign_name || item.campaign_name == 0 ? (
//                             <td className="p-2">
//                               <div> {item.campaign_name}</div>
//                             </td>
//                           ) : null}
//                           {item.platform || item.platform == 0 ? (
//                             <td className="p-2">
//                               <div> {item.platform}</div>
//                             </td>
//                           ) : null}
//                           {item.spend || item.spend == 0 ? (
//                             <td className="p-2">
//                               <div>
//                                 {" "}
//                                 {"₹" + item.spend.toLocaleString(currency_format)}
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.placement_bids || item.placement_bids == 0 ? (
//                             <td className="p-2">
//                               <div>
//                                 {" "}
//                                 {"₹" +
//                                   item.placement_bids.toLocaleString(currency_format)}
//                               </div>
//                             </td>
//                           ) : null}

//                           {item.placement_bids_percentage ||
//                           item.placement_bids_percentage == 0 ? (
//                             <td className="p-2">
//                               <div> {item.placement_bids_percentage}</div>
//                             </td>
//                           ) : null}
//                           {item.placement_spent || item.placement_spent == 0 ? (
//                             <td className="p-2">
//                               <div> {item.placement_spent}</div>
//                             </td>
//                           ) : null}
//                           {item.placement_spent_percentage ||
//                           item.placement_spent_percentage == 0 ? (
//                             <td className="p-2">
//                               <div> {item.placement_spent_percentage}</div>
//                             </td>
//                           ) : null}
//                           {item.views || item.views == 0 ? (
//                             <td className="p-2">
//                               <div> {item.views.toLocaleString(currency_format)}</div>
//                             </td>
//                           ) : null}
//                           {item.clicks || item.clicks == 0 ? (
//                             <td className="p-2">
//                               <div> {item.clicks.toLocaleString(currency_format)}</div>
//                             </td>
//                           ) : null}
//                           {item.ctr || item.ctr == 0 ? (
//                             <td className="p-2">
//                               <div> {item.ctr.toFixed(2) + "%"}</div>
//                             </td>
//                           ) : null}
//                           {item.cpc || item.cpc == 0 ? (
//                             <td className="p-2">
//                               <div> {item.cpc.toFixed(2)}</div>
//                             </td>
//                           ) : null}
//                           {item.units_sold_direct ||
//                           item.units_sold_direct == 0 ? (
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">
//                                   {item.units_sold_direct.toLocaleString(
//                                     currency_format
//                                   )}
//                                 </div>
//                                 <div className="col">
//                                   {item.units_sold_indirect.toLocaleString(
//                                     currency_format
//                                   )}
//                                 </div>
//                                 <div className="col font-semibold">
//                                   {item.units_sold_total.toLocaleString(
//                                     currency_format
//                                   )}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.revenue_direct_view ||
//                           item.revenue_direct_view == 0 ? (
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">
//                                   {"₹" +
//                                     item.revenue_direct_view.toLocaleString(
//                                       currency_format
//                                     )}
//                                 </div>
//                                 <div className="col">
//                                   {"₹" +
//                                     item.revenue_indirect_view.toLocaleString(
//                                       currency_format
//                                     )}
//                                 </div>
//                                 <div className="col font-semibold">
//                                   {"₹" +
//                                     item.revenue_total_view.toLocaleString(
//                                       currency_format
//                                     )}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.direct_cvr || item.direct_cvr == 0 ? (
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">
//                                   {item.direct_cvr.toFixed() + "%"}
//                                 </div>
//                                 <div className="col">
//                                   {item.indirect_cvr.toFixed() + "%"}
//                                 </div>
//                                 <div className="col">
//                                   {item.cvr.toFixed() + "%"}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.direct_roi || item.direct_roi == 0 ? (
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">{item.direct_roi}</div>
//                                 <div className="col">{item.indirect_roi}</div>
//                                 <div className="col font-semibold">
//                                   {item.roi}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.direct_aov || item.direct_aov == 0 ? (
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">{item.direct_aov}</div>
//                                 <div className="col">{item.indirect_aov}</div>
//                                 <div className="col font-semibold">
//                                   {item.aov}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                         </tr>
//                       </>
//                     );
//                   }
//                   if (source == "negativeKeyword") {
//                     return (
//                       <>
//                         <tr
//                           className={
//                             isCheckBoxRequired
//                               ? "tableContentCheckBox"
//                               : "tablecontent"
//                           }
//                         >
//                           {isCheckBoxRequired === true && (
//                             <td className="pl-2">
//                               <input
//                                 className="h-16 m-3"
//                                 type="checkbox"
//                                 checked={editData
//                                   .map((data) => data._id)
//                                   .includes(item._id)}
//                                 onChange={(e) =>
//                                   handleCheckBox(e.target.checked, item)
//                                 }
//                               />
//                             </td>
//                           )}

//                           {item.keyword || item.keyword == 0 ? (
//                             <td className="p-2">
//                               <div> {item.keyword}</div>
//                             </td>
//                           ) : null}
//                           {item.campaign_id ? (
//                             <td className="p-2">
//                               <div> {item.campaign_id}</div>
//                             </td>
//                           ) : null}

//                           {item.campaign_name || item.campaign_name == 0 ? (
//                             <td className="p-2">
//                               <div> {item.campaign_name}</div>
//                             </td>
//                           ) : null}
//                           {item.ad_group_id || item.ad_group_id == 0 ? (
//                             <td className="p-2">
//                               <div> {item.ad_group_id}</div>
//                             </td>
//                           ) : null}
//                           {item.ad_group_name || item.ad_group_name == 0 ? (
//                             <td className="p-2">
//                               <div> {item.ad_group_name}</div>
//                             </td>
//                           ) : null}

//                           {item.created_on || item.created_on == 0 ? (
//                             <td className="p-2">
//                               <div> {item.created_on}</div>
//                             </td>
//                           ) : null}
//                           {item.action_status ? (
//                             <td className="p-2">
//                               <div>
//                                 {" "}
//                                 {item.action_status == 1
//                                   ? "pending"
//                                   : "completed"}
//                               </div>
//                             </td>
//                           ) : (
//                             <td className="p-2">
//                               <div>completed</div>
//                             </td>
//                           )}
//                         </tr>
//                       </>
//                     );
//                   }
//                   if (source == "searchData") {
//                     return (
//                       <>
//                         <tr
//                           className={
//                             isCheckBoxRequired
//                               ? "tableContentCheckBox"
//                               : "tablecontent"
//                           }
//                         >
//                           {isCheckBoxRequired === true && (
//                             <td className="pl-2">
//                               <input
//                                 className="h-16 m-3"
//                                 type="checkbox"
//                                 checked={editData
//                                   .map((data) => data._id)
//                                   .includes(item._id)}
//                                 onChange={(e) =>
//                                   handleCheckBox(e.target.checked, item)
//                                 }
//                               />
//                             </td>
//                           )}

//                           {item._id ? (
//                             <td className="p-2">
//                               <div> {item._id}</div>
//                             </td>
//                           ) : null}
//                           {item.campaign_name ? (
//                             <td className="p-2">
//                               <div> {item.campaign_name}</div>
//                             </td>
//                           ) : null}
//                           {item.segment || item.segment == 0 ? (
//                             <td className="p-2">
//                               <div> {item.segment}</div>
//                             </td>
//                           ) : null}
//                           {item.ad_group_name || item.ad_group_name == 0 ? (
//                             <td className="p-2">
//                               <div> {item.ad_group_name}</div>
//                             </td>
//                           ) : null}
//                           {item.platform ? (
//                             <td className="p-2">
//                               <div> {item.platform}</div>
//                             </td>
//                           ) : null}

//                           {item.spend || item.spend == 0 ? (
//                             <td className="p-2">
//                               <div>
//                                 {" "}
//                                 {"₹" + item.spend.toLocaleString(currency_format)}
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.views || item.views == 0 ? (
//                             <td className="p-2">
//                               <div> {item.views.toLocaleString(currency_format)}</div>
//                             </td>
//                           ) : null}

//                           {item.clicks || item.clicks == 0 ? (
//                             <td className="p-2">
//                               <div> {item.clicks.toLocaleString(currency_format)}</div>
//                             </td>
//                           ) : null}
//                           {item.ctr || item.ctr == 0 ? (
//                             <td className="p-2">
//                               <div> {item.ctr.toFixed(2) + "%"}</div>
//                             </td>
//                           ) : null}
//                           {item.cpc || item.cpc == 0 ? (
//                             <td className="p-2">
//                               <div> {item.cpc.toFixed(2)}</div>
//                             </td>
//                           ) : null}
//                           {item.direct_units_sold ||
//                           item.direct_units_sold == 0 ? (
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">
//                                   {item.direct_units_sold.toLocaleString(
//                                     currency_format
//                                   )}
//                                 </div>
//                                 <div className="col">
//                                   {item.indirect_units_sold.toLocaleString(
//                                     currency_format
//                                   )}
//                                 </div>
//                                 <div className="col font-semibold">
//                                   {item.total_units_sold.toLocaleString(
//                                     currency_format
//                                   )}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.direct_revenue || item.direct_revenue == 0 ? (
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">
//                                   {"₹" +
//                                     item.direct_revenue.toLocaleString(currency_format)}
//                                 </div>
//                                 <div className="col">
//                                   {"₹" +
//                                     item.indirect_revenue.toLocaleString(
//                                       currency_format
//                                     )}
//                                 </div>
//                                 <div className="col font-semibold">
//                                   {"₹" +
//                                     item.total_revenue.toLocaleString(currency_format)}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.cvr_direct || item.cvr_direct == 0 ? (
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">
//                                   {item.cvr_direct.toFixed(2)}
//                                 </div>
//                                 <div className="col">
//                                   {item.cvr_indirect.toFixed(2) + "%"}
//                                 </div>
//                                 <div className="col font-semibold">
//                                   {item.cvr_total.toFixed(2) + "%"}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.roi_direct || item.roi_direct == 0 ? (
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">
//                                   {item.roi_direct.toFixed(2)}
//                                 </div>
//                                 <div className="col">
//                                   {item.roi_indirect.toFixed(2)}
//                                 </div>
//                                 <div className="col font-semibold">
//                                   {item.roi_total.toFixed(2)}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.aov_direct || item.aov_direct == 0 ? (
//                             <td className="">
//                               <div className="row text-center">
//                                 <div className="col">
//                                   {item.aov_direct.toFixed(2)}
//                                 </div>
//                                 <div className="col">
//                                   {item.aov_indirect.toFixed(2)}
//                                 </div>
//                                 <div className="col font-semibold">
//                                   {item.aov_total.toFixed(2)}
//                                 </div>
//                               </div>
//                             </td>
//                           ) : null}
//                         </tr>
//                       </>
//                     );
//                   }
//                   if (source == "rule") {
//                     return (
//                       <>
//                         <tr className="rule_content">
//                           {item.rule_name || item.rule_name == 0 ? (
//                             <td className="p-2">
//                               <div className="text-[13px]">
//                                 {" "}
//                                 {item.rule_name}
//                               </div>
//                             </td>
//                           ) : (
//                             "-"
//                           )}
//                           {item?.is_deleted || item?.is_deleted == 0 ? (
//                             <td className="p-2">
//                               {item.is_deleted == false && (
//                                 <div className="text-[12px]"> Enabled</div>
//                               )}
//                             </td>
//                           ) : (
//                             <td className="p-2">
//                               <div className="text-[12px]"> Enabled</div>
//                             </td>
//                           )}
//                           {item.platform === "MP" ? (
//                             <td className="p-2">
//                               <div className="text-[13px]">Marketplace</div>
//                             </td>
//                           ) : item.platform === "SM" ? (
//                             <td className="p-2">
//                               <div className="text-[13px]">Flipkart</div>
//                             </td>
//                           ) : (
//                             "-"
//                           )}
//                           {item.campaign_type || item.campaign_type == 0 ? (
//                             <td className="p-2 ">
//                               <div className="text-[13px]">
//                                 {" "}
//                                 {item.campaign_type}
//                               </div>
//                             </td>
//                           ) : (
//                             "-"
//                           )}
//                           {item.entity || item.entity == 0 ? (
//                             <td className="p-2 text-blue-500">
//                               <div className="text-[13px]"> {item.entity}</div>
//                             </td>
//                           ) : (
//                             "-"
//                           )}
//                           <td className="p-2">
//                             <p className="text-blue-500 text-[12px]">
//                               {item?.action
//                                 .split(/(?=[A-Z])/)
//                                 .map((word, index) => word?.toLowerCase())
//                                 .join(" ")}
//                             </p>
//                             {item?.rule_condition?.map(
//                               (conditionGroup, groupIndex) => (
//                                 <div className="text-[13px]" key={groupIndex}>
//                                   {groupIndex > 0 && (
//                                     <span>
//                                       OR <br />
//                                     </span>
//                                   )}

//                                   {conditionGroup?.map(
//                                     (condition, conditionIndex) => (
//                                       <div
//                                         key={conditionIndex}
//                                         className="inline"
//                                       >
//                                         {conditionIndex > 0 && (
//                                           <span className="ml-2">AND</span>
//                                         )}{" "}
//                                         <span>
//                                           (if {condition?.conditionCategory} is{" "}
//                                           {condition?.conditionType ===
//                                           "greatersingle"
//                                             ? "Greater than"
//                                             : condition.conditionType ===
//                                               "lesssingle"
//                                             ? "Smaller than"
//                                             : condition.conditionType ===
//                                                 "betweenmulti" ||
//                                               condition.conditionType ===
//                                                 "notBetweenmulti"
//                                             ? "Between"
//                                             : "-"}{" "}
//                                           {condition?.conditionType ===
//                                             "betweenmulti" ||
//                                           condition?.conditionType ===
//                                             "notBetweenmulti"
//                                             ? `${condition?.less}-${condition?.greater}`
//                                             : condition?.greater}
//                                           )
//                                         </span>
//                                       </div>
//                                     )
//                                   )}
//                                 </div>
//                               )
//                             )}
//                           </td>

//                           {item.entity || item.entity == 0 ? (
//                             <td className="p-2">
//                               <div className="text-[13px] text-blue-500">
//                                 {" "}
//                                 No Changes To {item.entity}
//                               </div>
//                             </td>
//                           ) : null}
//                           {item.schedule || item.schedule == 0 ? (
//                             <td className="p-2">
//                               <div className="text-[13px]">
//                                 {" "}
//                                 {item.schedule}
//                               </div>
//                             </td>
//                           ) : null}

//                           {/* {item.clicks || item.clicks == 0 ? ( */}
//                           {item.platform || item.platform == 0 ? (
//                             <td className="p-2">
//                               <div className="text-[12px]">{userName}</div>
//                             </td>
//                           ) : null}
//                           {/* ) : null} */}

//                           {item.action ? (
//                             <td className="">
//                               {/* data to show in the popup */}
//                               <div>
//                                 <PreviewBtn rowData={item} />
//                               </div>
//                             </td>
//                           ) : null}
//                         </tr>
//                       </>
//                     );
//                   }
//                   if (source == "dummy") {
//                     return (
//                       <>
//                         <tr className="tablecontent">
//                           {item.keyword || item.keyword == 0 ? (
//                             <td className="p-2">
//                               <div> {item.keyword}</div>
//                             </td>
//                           ) : null}
//                           {item.keyword_match_type ||
//                           item.keyword_match_type == 0 ? (
//                             <td className="p-2">
//                               <div> {item.keyword_match_type}</div>
//                             </td>
//                           ) : null}
//                           {item.segment || item.segment == 0 ? (
//                             <td className="p-2">
//                               <div> {item.segment}</div>
//                             </td>
//                           ) : null}
//                           {item.ad_group_name || item.ad_group_name == 0 ? (
//                             <td className="p-2">
//                               <div> {item.ad_group_name}</div>
//                             </td>
//                           ) : null}
//                           {item.campaign_name || item.campaign_name == 0 ? (
//                             <td className="p-2">
//                               <div> {item.campaign_name}</div>
//                             </td>
//                           ) : null}
//                           {item.platform || item.platform == 0 ? (
//                             <td className="p-2">
//                               <div> {item.platform}</div>
//                             </td>
//                           ) : null}
//                           {item.spend || item.spend == 0 ? (
//                             <td className="p-2">
//                               <div> {item.spend}</div>
//                             </td>
//                           ) : null}
//                           {item.views || item.views == 0 ? (
//                             <td className="p-2">
//                               <div> {item.views}</div>
//                             </td>
//                           ) : null}

//                           {item.clicks || item.clicks == 0 ? (
//                             <td className="p-2">
//                               <div> {item.clicks}</div>
//                             </td>
//                           ) : null}
//                           {item.ctr || item.ctr == 0 ? (
//                             <td className="p-2">
//                               <div> {item.ctr + "%"}</div>
//                             </td>
//                           ) : null}
//                           {item.ctr || item.ctr == 0 ? (
//                             <td className="p-2">
//                               <div> {item.ctr + "%"}</div>
//                             </td>
//                           ) : null}
//                         </tr>
//                       </>
//                     );
//                   }
//                 })
//               ) : (
//                 <tr>
//                   {/* <div className="loaderStyle"> */}
//                   {/* <CircularProgress /> */}
//                   {/* <td className="" colSpan={4}>
//                     <div> No Data found</div>
//                   </td> */}
//                   <div className="p-2 row sticky "> No Data found</div>

//                   {/* </div> */}
//                   {/* <div className="row justify-center sticky left-0 bottom-0 py-2"> */}
//                   {/* <CircularProgress /> */}

//                   {/* </div> */}
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           {/* <button
//           onClick={() => {
//             callSearchPropertyAction();
//           }}
//         >
//           Load More
//         </button> */}
//         </div>
//         {totalData > 10 ? (
//           <Pagination paginate={paginate} page={page} totalData={totalData} />
//         ) : null}
//       </div>
//     </>
//   );
// };

// export default InstamartTable;
import React, { useState } from "react";

import { convertDateFormatToDateMonthNameYear } from "../../../utils/helpers";
// import LoaderSpinner from "../loader-spinner";
import PreviewBtn from "../../flipkart/Rules/button/Previewbtn";
// import "./styles.css";

const InstamartTable = ({
  headers,
  bodyContent,
  loading,
  sortData,
  source,
  isCheckBoxRequired,
  setEditData,
  editData,
  customCss,
  setDataLIMIT,
  dataLIMIT,
  sortBy,
}) => {
  const [rulesPopup, setRulesPopup] = useState();
  const [ruleData, setRuleData] = useState(null);

  const handleCheckBox = (check, data) => {
    if (check) {
      setEditData([...editData, data]);
    } else {
      setEditData(editData.filter((item) => item._id !== data._id));
    }
  };
  const handleAllCheckBox = (check, data) => {
    if (check) {
      setEditData([...data]);
    } else {
      setEditData([]);
    }
  };
  let currency_format = localStorage.getItem("currency_format");

  const userName = localStorage.getItem("name");
  let tableouterClass = [
    isCheckBoxRequired
      ? "campaignreportcheckbox__table "
      : customCss === true
      ? "rules_outer_table mb-20"
      : "campaignreport__table w-full",
    customCss ? "rule_headers" : "",
  ];
  const handleScroll = (e) => {
    const bottom =
      Math.abs(
        e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop
      ) < 1;
    if (bottom) {
      setDataLIMIT(dataLIMIT + 50);
    }
  };
  return (
    <>
      <div
        className="bg-white max-h-[440px] overflow-y-scroll"
        onScroll={handleScroll}
      >
        <div
          className={tableouterClass.join(" ")}
          // className={"campaignreport__table "}
        >
          <table className="w-full">
            <thead
              className={
                isCheckBoxRequired
                  ? "campaignreportcheckbox__tablehead table-fixed "
                  : "campaignreport__tablehead  table-fixed"
              }
            >
              <tr className="">
                {isCheckBoxRequired === true && (
                  <th className=" pl-2">
                    <input
                      className=" h-16"
                      type="checkbox"
                      checked={editData?.length === bodyContent?.length}
                      onChange={(e) =>
                        handleAllCheckBox(e.target.checked, bodyContent)
                      }
                    />
                  </th>
                )}

                {headers?.map((item, i) => {
                  if (item.showCol) {
                    return (
                      <>
                        {item.type === "single" ? (
                          <th className="">
                            <div
                              className={
                                customCss === true
                                  ? "rule_table "
                                  : "tableHead py-3 px-1.5 "
                              }
                            >
                              <p>{item.title}</p>
                              {item.show && (
                                <div
                                  className={
                                    customCss === true
                                      ? "rule_arrow"
                                      : "sortArrow cursor-pointer"
                                  }
                                >
                                  <div>
                                    <div
                                      onClick={() => sortData(item?.value, 1)}
                                      style={{
                                        color:
                                          sortBy.key === item.value &&
                                          sortBy.order === 1
                                            ? "black"
                                            : "grey",
                                      }}
                                    >
                                      ▲
                                    </div>
                                  </div>
                                  <div>
                                    <div
                                      className="downArrow"
                                      onClick={() => sortData(item?.value, -1)}
                                      style={{
                                        color:
                                          sortBy.key === item.value &&
                                          sortBy.order === -1
                                            ? "black"
                                            : "grey",
                                      }}
                                    >
                                      ▼
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </th>
                        ) : (
                          <th rowSpan={3} className="multiCol">
                            <div className="graycol">{item.title}</div>
                            {item.showCol &&
                              item.subTitles?.map((v, i) => {
                                return <td key={i} className="graydirect">{v}</td>;
                              })}
                          </th>
                        )}
                      </>
                    );
                  }
                })}
              </tr>
            </thead>
            <tbody>
              {
                // loading ? (
                // <>
                //   <td
                //     className="p-2"
                //     colSpan={16}
                //     rowSpan={3}
                //     style={{ alignItems: "center", verticalAlign: "middle" }}
                //   >
                //     <div className="loaderStyle">
                //       <LoaderSpinner />
                //     </div>
                //   </td>
                // </>
                // ) :
                bodyContent && bodyContent.length > 0 ? (
                  bodyContent?.map((item, i) => {
                    if (source === "campaign") {
                      return (
                        <>
                          <tr className="tablecontent">
                            {item.campaign_name || item.campaign_name === 0 ? (
                              <td className="p-2">
                                <div>{item.campaign_name}</div>
                              </td>
                            ) : null}

                            {item.segment || item.segment === 0 ? (
                              <td className="p-2">
                                <div> {item.segment}</div>
                              </td>
                            ) : null}
                            {item.platform || item.platform === 0 ? (
                              <td className="p-2">
                                <div> {item.platform}</div>
                              </td>
                            ) : null}
                            {item.campaign_budget ||
                            item.campaign_budget === 0 ? (
                              <td className="p-2">
                                <div>
                                  {" "}
                                  {item.campaign_budget.toLocaleString(currency_format)}
                                </div>
                              </td>
                            ) : null}
                            {item.spend || item.spend === 0 ? (
                              <td className="p-2">
                                <div> {item.spend.toLocaleString(currency_format)}</div>
                              </td>
                            ) : null}
                            {item.views || item.views === 0 ? (
                              <td className="p-2">
                                <div> {item.views.toLocaleString(currency_format)}</div>
                              </td>
                            ) : null}
                            {item.clicks || item.clicks === 0 ? (
                              <td className="p-2">
                                <div>
                                  {" "}
                                  {item.clicks.toLocaleString(currency_format)}
                                </div>
                              </td>
                            ) : null}
                            {item.CTR || item.CTR === 0 ? (
                              <td className="p-2">
                                <div> {item.CTR}</div>
                              </td>
                            ) : null}
                            {item.cpc || item.cpc === 0 ? (
                              <td className="p-2">
                                <div> {item.cpc}</div>
                              </td>
                            ) : null}

                            {item.ppv_direct_click ||
                            item.ppv_direct_click == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">
                                    {item.ppv_direct_click.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col">
                                    {item.ppv_indirect_click.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col font-semibold">
                                    {item.total_ppv_data.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.units_sold_direct ||
                            item.units_sold_direct == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">
                                    {item.units_sold_direct.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col">
                                    {item.units_sold_indirect.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col font-semibold">
                                    {item.total_units_sold.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.direct_revenue || item.direct_revenue == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">
                                    {item.direct_revenue.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col">
                                    {item.indirect_revenue.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col font-semibold">
                                    {item.total_revenue.toLocaleString(currency_format)}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.cvr_direct || item.cvr_direct == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.cvr_direct}</div>
                                  <div className="col">{item.cvr_indirect}</div>
                                  <div className="col font-semibold">
                                    {item.cvr_total}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.roi_direct || item.roi_direct == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.roi_direct}</div>
                                  <div className="col">{item.roi_indirect}</div>
                                  <div className="col font-semibold">
                                    {item.total_roi}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.aov_direct || item.aov_direct == 0 ? (
                              <td className="">
                                <div className="row text-center text-[13px]">
                                  <div className="col">{item.aov_direct}</div>
                                  <div className="col">{item.aov_indirect}</div>
                                  <div className="col font-semibold">
                                    {item.aov_total}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                          </tr>
                        </>
                      );
                    }
                    if (source === "fsn") {
                      return (
                        <>
                          <tr className="tablecontent">
                            {item.fsn_id || item.fsn_id == 0 ? (
                              <td className="p-2">
                                <div> {item.fsn_id}</div>
                              </td>
                            ) : null}
                            {item.product_name || item.product_name == 0 ? (
                              <td className="p-2">
                                <div> {item.product_name}</div>
                              </td>
                            ) : null}
                            {item.adgroup_name || item.adgroup_name == 0 ? (
                              <td className="p-2">
                                <div> {item.adgroup_name}</div>
                              </td>
                            ) : null}
                            {item.campaign_name || item.campaign_name == 0 ? (
                              <td className="p-2">
                                <div> {item.campaign_name}</div>
                              </td>
                            ) : null}
                            {item.segment || item.segment == 0 ? (
                              <td className="p-2">
                                <div> {item.segment}</div>
                              </td>
                            ) : null}
                            {item.platform || item.platform == 0 ? (
                              <td className="p-2">
                                <div> {item.platform}</div>
                              </td>
                            ) : null}
                            {item.spent || item.spent == 0 ? (
                              <td className="p-2">
                                <div> {item.spent.toLocaleString(currency_format)}</div>
                              </td>
                            ) : null}
                            {item.views || item.views == 0 ? (
                              <td className="p-2">
                                <div> {item.views.toLocaleString(currency_format)}</div>
                              </td>
                            ) : null}

                            {item.add_to_baskets || item.add_to_baskets == 0 ? (
                              <td className="p-2">
                                <div> {item.add_to_baskets}</div>
                              </td>
                            ) : null}
                            {item.add_to_basket_rate ||
                            item.add_to_basket_rate == 0 ? (
                              <td className="p-2">
                                <div> {item.add_to_basket_rate}</div>
                              </td>
                            ) : null}
                            {item.cpc || item.cpc == 0 ? (
                              <td className="p-2">
                                <div> {item.cpc}</div>
                              </td>
                            ) : null}
                            {item.units_sold_direct ||
                            item.units_sold_direct == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">
                                    {item.units_sold_direct.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col">
                                    {item.units_sold_indirect.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col">
                                    {item.total_units_sold.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.direct_revenue || item.direct_revenue == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">
                                    {item.direct_revenue.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col">
                                    {item.indirect_revenue.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col">
                                    {item.total_revenue.toLocaleString(currency_format)}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.cvr_direct || item.cvr_direct == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.cvr_direct}</div>
                                  <div className="col">{item.cvr_indirect}</div>
                                  <div className="col">{item.cvr_total}</div>
                                </div>
                              </td>
                            ) : null}
                            {item.roi_direct || item.roi_direct == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.roi_direct}</div>
                                  <div className="col">{item.roi_indirect}</div>
                                  <div className="col font-semibold">
                                    {item.roi_total}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.aov_direct || item.aov_direct == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.aov_direct}</div>
                                  <div className="col">{item.aov_indirect}</div>
                                  <div className="col font-semibold">
                                    {item.aov_total}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                          </tr>
                        </>
                      );
                    }
                    if (source === "creative") {
                      return (
                        <>
                          <tr className="tablecontent">
                            {item.banner_id || item.banner_id == 0 ? (
                              <td className="p-2">
                                <div> {item.banner_id}</div>
                              </td>
                            ) : null}
                            {item.banner_name || item.banner_name == 0 ? (
                              <td className="p-2">
                                <div> {item.banner_name}</div>
                              </td>
                            ) : null}
                            {item.banner_preview || item.banner_preview == 0 ? (
                              <td className="p-2">
                                <div> {item.banner_preview}</div>
                              </td>
                            ) : null}
                            {item.type_banner || item.type_banner == 0 ? (
                              <td className="p-2">
                                <div> {item.type_banner}</div>
                              </td>
                            ) : null}
                            {item.ad_group_name || item.ad_group_name == 0 ? (
                              <td className="p-2">
                                <div> {item.ad_group_name}</div>
                              </td>
                            ) : null}
                            {item.campaign_name || item.campaign_name == 0 ? (
                              <td className="p-2">
                                <div> {item.campaign_name}</div>
                              </td>
                            ) : null}
                            {item.campaign_type || item.campaign_type == 0 ? (
                              <td className="p-2">
                                <div> {item.campaign_type}</div>
                              </td>
                            ) : null}
                            {item.platform || item.platform == 0 ? (
                              <td className="p-2">
                                <div> {item.platform}</div>
                              </td>
                            ) : null}
                            {item.banner_spend || item.banner_spend == 0 ? (
                              <td className="p-2">
                                <div> {item.banner_spend}</div>
                              </td>
                            ) : null}
                            {item.views || item.views == 0 ? (
                              <td className="p-2">
                                <div> {item.views}</div>
                              </td>
                            ) : null}
                            {item.clicks || item.clicks == 0 ? (
                              <td className="p-2">
                                <div> {item.clicks}</div>
                              </td>
                            ) : null}
                            {item.ctr || item.ctr == 0 ? (
                              <td className="p-2">
                                <div> {item.ctr}</div>
                              </td>
                            ) : null}
                            {item.average_cpc || item.average_cpc == 0 ? (
                              <td className="p-2">
                                <div> {item.average_cpc}</div>
                              </td>
                            ) : null}
                            {item.direct_units_sold ||
                            item.direct_units_sold == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">
                                    {item.direct_units_sold}
                                  </div>
                                  <div className="col">
                                    {item.indirect_units_sold}
                                  </div>
                                  <div className="col font-semibold">
                                    {item.units_sold}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.ppv_direct_click ||
                            item.ppv_direct_click == 0 ? (
                              // <td className="p-2">
                              //   <div> {item.ppv_direct_click}</div>
                              //   </td>
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">
                                    {item.ppv_direct_click}
                                  </div>
                                  <div className="col">
                                    {item.ppv_indirect_click}
                                  </div>
                                  <div className="col font-semibold">
                                    {item.ppv_total}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.direct_revenue || item.direct_revenue == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">
                                    {item.direct_revenue}
                                  </div>
                                  <div className="col">
                                    {item.indirect_revenue}
                                  </div>
                                  <div className="col">{item.revenue}</div>
                                </div>
                              </td>
                            ) : null}
                            {item.direct_cvr || item.direct_cvr == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.direct_cvr}</div>
                                  <div className="col">{item.indirect_cvr}</div>
                                  <div className="col">{item.cvr}</div>
                                </div>
                              </td>
                            ) : null}
                            {item.direct_roi || item.direct_roi == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.direct_roi}</div>
                                  <div className="col">{item.indirect_roi}</div>
                                  <div className="col">{item.roi}</div>
                                </div>
                              </td>
                            ) : null}
                            {item.direct_aov || item.direct_aov == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.direct_aov}</div>
                                  <div className="col">{item.indirect_aov}</div>
                                  <div className="col">{item.aov}</div>
                                </div>
                              </td>
                            ) : null}
                          </tr>
                        </>
                      );
                    }
                    if (source == "adgroup") {
                      return (
                        <>
                          <tr className="tablecontent">
                            {item.adgroup_name || item.adgroup_name == 0 ? (
                              <td className="p-2">
                                <div> {item.adgroup_name}</div>
                              </td>
                            ) : null}
                            {item.campaign_name || item.campaign_name == 0 ? (
                              <td className="p-2">
                                <div> {item.campaign_name}</div>
                              </td>
                            ) : null}
                            {item.segment || item.segment == 0 ? (
                              <td className="p-2">
                                <div> {item.segment}</div>
                              </td>
                            ) : null}
                            {item.platform || item.platform == 0 ? (
                              <td className="p-2">
                                <div> {item.platform}</div>
                              </td>
                            ) : null}
                            {item.campaign_budget ||
                            item.campaign_budget == 0 ? (
                              <td className="p-2">
                                <div>
                                  {" "}
                                  {item.campaign_budget != null
                                    ? item.campaign_budget.toLocaleString(
                                        currency_format
                                      )
                                    : "N/A"}
                                </div>
                              </td>
                            ) : null}
                            {item.spend || item.spend == 0 ? (
                              <td className="p-2">
                                <div> {item.spend.toLocaleString(currency_format)}</div>
                              </td>
                            ) : null}
                            {item.created_on || item.created_on == 0 ? (
                              <td className="p-2">
                                <div>
                                  {" "}
                                  {convertDateFormatToDateMonthNameYear(
                                    item.created_on
                                  )}
                                </div>
                              </td>
                            ) : null}

                            {item.views || item.views == 0 ? (
                              <td className="p-2">
                                <div> {item.views.toLocaleString(currency_format)}</div>
                              </td>
                            ) : null}
                            {item.clicks || item.clicks == 0 ? (
                              <td className="p-2">
                                <div>
                                  {" "}
                                  {item.clicks.toLocaleString(currency_format)}
                                </div>
                              </td>
                            ) : null}
                            {item.CTR || item.CTR == 0 ? (
                              <td className="p-2">
                                <div> {item.CTR}</div>
                              </td>
                            ) : null}
                            {item.cpc || item.cpc == 0 ? (
                              <td className="p-2">
                                <div> {item.cpc}</div>
                              </td>
                            ) : null}
                            {item.ppv_direct_click ||
                            item.ppv_direct_click == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">
                                    {item.ppv_direct_click.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col">
                                    {item.ppv_indirect_click.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col font-semibold">
                                    {item.total_ppv_data.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.units_sold_direct ||
                            item.units_sold_direct == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">
                                    {item.units_sold_direct.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col">
                                    {item.units_sold_indirect.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col font-semibold">
                                    {item.total_units_sold.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.direct_revenue || item.direct_revenue == 0 ? (
                              <td className="">
                                <div className="row text-center ">
                                  <div className="col">
                                    {item.direct_revenue.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col">
                                    {item.indirect_revenue.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col font-semibold">
                                    {item.total_revenue.toLocaleString(currency_format)}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.cvr_direct || item.cvr_direct == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.cvr_direct}</div>
                                  <div className="col">{item.cvr_indirect}</div>
                                  <div className="col font-semibold">
                                    {item.cvr_total}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.roi_direct || item.roi_direct == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.roi_direct}</div>
                                  <div className="col">{item.roi_indirect}</div>
                                  <div className="col font-semibold">
                                    {item.total_roi}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.aov_direct || item.aov_direct == 0 ? (
                              <td className="">
                                <div className="row text-center text-[13px]">
                                  <div className="col">{item.aov_direct}</div>
                                  <div className="col">{item.aov_indirect}</div>
                                  <div className="col font-semibold">
                                    {item.aov_total}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                          </tr>
                        </>
                      );
                    }
                    if (source == "revenue") {
                      return (
                        <>
                          <tr className="tablecontent">
                            {item.created_on || item.created_on == 0 ? (
                              <td className="p-2">
                                <div>
                                  {convertDateFormatToDateMonthNameYear(
                                    item.created_on
                                  )}
                                </div>
                              </td>
                            ) : null}
                            {item.mode || item.mode == 0 ? (
                              <td className="px-2">
                                <div>
                                  <b className="font-semibold text-sm">
                                    Direct
                                  </b>
                                  <br />
                                  <b className="font-normal text-sm">
                                    Indirect
                                  </b>
                                </div>
                              </td>
                            ) : null}
                            {item.orders || item.orders == 0 ? (
                              <td className="px-2">
                                <div> {item.orders}</div>
                              </td>
                            ) : null}
                            {item.direct_revenue || item.direct_revenue == 0 ? (
                              <td className="px-2.5">
                                <div>
                                  <b className="font-semibold text-sm">
                                    ₹{item.direct_revenue.toFixed(2)}
                                  </b>
                                  <br />
                                  <b className="font-normal text-sm">
                                    ₹{item.indirect_revenue.toFixed(2)}
                                  </b>
                                  <br />
                                  {item.direct_revenue - item.indirect_revenue >
                                  0
                                    ? "▲"
                                    : item.direct_revenue -
                                        item.indirect_revenue ==
                                      0
                                    ? ""
                                    : "▼"}
                                  <b className="text-[#23BC7C] font-normal text-sm ">
                                    {!isNaN(
                                      (Math.abs(
                                        item.direct_revenue -
                                          item.indirect_revenue
                                      ) /
                                        item.direct_revenue) *
                                        100
                                    )
                                      ? (
                                          (Math.abs(
                                            item.direct_revenue -
                                              item.indirect_revenue
                                          ) /
                                            item.direct_revenue) *
                                          100
                                        ).toFixed(2)
                                      : 0}
                                    %
                                  </b>
                                </div>
                              </td>
                            ) : null}

                            {item.direct_aov || item.direct_aov == 0 ? (
                              <td className="px-2">
                                <div>
                                  <b className="font-semibold text-sm">
                                    {item.direct_aov.toFixed(2)}
                                  </b>
                                  <br />
                                  <b className="font-normal text-sm">
                                    {item.indirect_aov.toFixed(2)}
                                  </b>
                                  <br />
                                  {item.direct_aov - item.indirect_aov > 0
                                    ? "▲"
                                    : item.direct_aov - item.indirect_aov == 0
                                    ? ""
                                    : "▼"}
                                  <b className="text-[#23BC7C] font-normal text-sm">
                                    {!isNaN(
                                      (Math.abs(
                                        item.direct_aov - item.indirect_aov
                                      ) /
                                        item.direct_aov) *
                                        100
                                    )
                                      ? (
                                          (Math.abs(
                                            item.direct_aov - item.indirect_aov
                                          ) /
                                            item.direct_aov) *
                                          100
                                        ).toFixed(2)
                                      : 0}
                                    %
                                  </b>
                                </div>
                              </td>
                            ) : null}
                            {item.clicks || item.clicks == 0 ? (
                              <td className="px-2">
                                <div>
                                  {" "}
                                  {item.clicks.toLocaleString(currency_format)}
                                </div>
                              </td>
                            ) : null}
                            {item.views || item.views == 0 ? (
                              <td className="">
                                <div> {item.views.toLocaleString(currency_format)}</div>
                              </td>
                            ) : null}
                            {item.direct_roi || item.direct_roi == 0 ? (
                              <td className="">
                                <div>
                                  <b className="font-semibold text-sm">
                                    ₹{item.direct_roi.toFixed(2)}
                                  </b>
                                  <br />
                                  <b className="font-normal text-sm">
                                    ₹{item.indirect_roi.toFixed(2)}
                                  </b>
                                  <br />
                                  {item.direct_roi - item.indirect_roi > 0
                                    ? "▲"
                                    : item.direct_roi - item.indirect_roi == 0
                                    ? ""
                                    : "▼"}
                                  <b className="text-[#23BC7C] font-normal text-sm">
                                    {!isNaN(
                                      (Math.abs(
                                        item.direct_roi - item.indirect_roi
                                      ) /
                                        item.direct_roi) *
                                        100
                                    )
                                      ? (
                                          (Math.abs(
                                            item.direct_roi - item.indirect_roi
                                          ) /
                                            item.direct_roi) *
                                          100
                                        ).toFixed(2)
                                      : 0}
                                    %
                                  </b>
                                </div>
                              </td>
                            ) : null}

                            {item.cpc || item.cpc == 0 ? (
                              <td className="p-2">
                                <div> {item.cpc.toFixed(2)}</div>
                              </td>
                            ) : null}
                          </tr>
                        </>
                      );
                    }
                    if (source == "keyword") {
                      return (
                        <>
                          {/* <div className=""> */}
                          {/* </div> */}
                          <tr
                            className={
                              isCheckBoxRequired
                                ? "tableContentCheckBox"
                                : "tablecontent"
                            }
                          >
                            {/* {isCheckBoxRequired === true && (
                            <td className="pl-2">
                              <input
                                className="h-16 m-2 bg-red-200"
                                type="checkbox"
                                onChange={(e) => handleCheckBox(e, item)}
                              />
                            </td>
                          )} */}

                            {item.keyword || item.keyword == 0 ? (
                              <td className="p-2">
                                {" "}
                                <div> {item.keyword}</div>
                              </td>
                            ) : null}
                            {item.keyword_match_type ||
                            item.keyword_match_type == 0 ? (
                              <td className="p-2">
                                <div> {item.keyword_match_type}</div>
                              </td>
                            ) : null}
                            {item.segment || item.segment == 0 ? (
                              <td className="p-2">
                                <div> {item.segment}</div>
                              </td>
                            ) : null}

                            {item.ad_group_name || item.ad_group_name == 0 ? (
                              <td className="p-2">
                                <div> {item.ad_group_name}</div>
                              </td>
                            ) : null}
                            {item.campaign_name || item.campaign_name == 0 ? (
                              <td className="p-2">
                                <div> {item.campaign_name}</div>
                              </td>
                            ) : null}
                            {item.platform || item.platform == 0 ? (
                              <td className="p-2">
                                <div> {item.platform}</div>
                              </td>
                            ) : null}
                            {item.spend || item.spend == 0 ? (
                              <td className="p-2">
                                <div> {item.spend.toLocaleString(currency_format)}</div>
                              </td>
                            ) : null}
                            {item.views || item.views == 0 ? (
                              <td className="p-2">
                                <div> {item.views.toLocaleString(currency_format)}</div>
                              </td>
                            ) : null}

                            {item.clicks || item.clicks == 0 ? (
                              <td className="p-2">
                                <div>
                                  {" "}
                                  {item.clicks.toLocaleString(currency_format)}
                                </div>
                              </td>
                            ) : null}
                            {item.cpc || item.cpc == 0 ? (
                              <td className="p-2">
                                <div> {item.cpc}</div>
                              </td>
                            ) : null}
                            {item.ctr || item.ctr == 0 ? (
                              <td className="p-2">
                                <div> {item.ctr}</div>
                              </td>
                            ) : null}
                            {item.direct_units_sold ||
                            item.direct_units_sold == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">
                                    {item.direct_units_sold.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col">
                                    {item.indirect_units_sold.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col font-semibold">
                                    {item.total_units_sold.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.direct_revenue || item.direct_revenue == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">
                                    {item.direct_revenue.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col">
                                    {item.indirect_revenue.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col font-semibold">
                                    {item.total_revenue.toLocaleString(currency_format)}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.cvr_direct || item.cvr_direct == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.cvr_direct}</div>
                                  <div className="col">{item.cvr_indirect}</div>
                                  <div className="col font-semibold">
                                    {item.cvr_total}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.roi_direct || item.roi_direct == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.roi_direct}</div>
                                  <div className="col">{item.roi_indirect}</div>
                                  <div className="col font-semibold">
                                    {item.roi_total}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.aov_direct || item.aov_direct == 0 ? (
                              <td className="">
                                <div className="row text-center ">
                                  <div className="col">{item.aov_direct}</div>
                                  <div className="col">{item.aov_indirect}</div>
                                  <div className="col font-semibold">
                                    {item.aov_total}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                          </tr>
                        </>
                      );
                    }
                    if (source == "search") {
                      return (
                        <>
                          {/* <div className=""> */}
                          {/* </div> */}
                          <tr
                            className={
                              isCheckBoxRequired
                                ? "tableContentCheckBox"
                                : "tablecontent"
                            }
                          >
                            {/* {isCheckBoxRequired === true && (
                            <td className="pl-20">
                              <input
                                className="h-16"
                                type="checkbox"
                                onChange={(e) => handleCheckBox(e, item)}
                              />
                            </td>
                          )} */}

                            {item.search_term || item.search_term == 0 ? (
                              <td className="p-2">
                                {" "}
                                <div> {item.search_term}</div>
                              </td>
                            ) : null}
                            {item.campaign_name || item.campaign_name == 0 ? (
                              <td className="p-2">
                                <div> {item.campaign_name}</div>
                              </td>
                            ) : null}
                            {item.segment || item.segment == 0 ? (
                              <td className="p-2">
                                <div> {item.segment}</div>
                              </td>
                            ) : null}

                            {item.ad_group_name || item.ad_group_name == 0 ? (
                              <td className="p-2">
                                <div> {item.ad_group_name}</div>
                              </td>
                            ) : null}
                            {item.platform || item.platform == 0 ? (
                              <td className="p-2">
                                <div> {item.platform}</div>
                              </td>
                            ) : null}
                            {item.spend || item.spend == 0 ? (
                              <td className="p-2">
                                <div> {item.spend.toLocaleString(currency_format)}</div>
                              </td>
                            ) : null}
                            {item.views || item.views == 0 ? (
                              <td className="p-2">
                                <div> {item.views.toLocaleString(currency_format)}</div>
                              </td>
                            ) : null}

                            {item.clicks || item.clicks == 0 ? (
                              <td className="p-2">
                                <div>
                                  {" "}
                                  {item.clicks.toLocaleString(currency_format)}
                                </div>
                              </td>
                            ) : null}
                            {item.ctr || item.ctr == 0 ? (
                              <td className="p-2">
                                <div> {item.ctr}</div>
                              </td>
                            ) : null}
                            {item.cpc || item.cpc == 0 ? (
                              <td className="p-2">
                                <div> {item.cpc}</div>
                              </td>
                            ) : null}
                            {item.direct_units_sold ||
                            item.direct_units_sold == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">
                                    {item.direct_units_sold.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col">
                                    {item.indirect_units_sold.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col font-semibold">
                                    {item.total_units_sold.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.direct_revenue || item.direct_revenue == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">
                                    {item.direct_revenue.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col">
                                    {item.indirect_revenue.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col font-semibold">
                                    {item.total_revenue.toLocaleString(currency_format)}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.cvr_direct || item.cvr_direct == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.cvr_direct}</div>
                                  <div className="col">{item.cvr_indirect}</div>
                                  <div className="col font-semibold">
                                    {item.cvr_total}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.roi_direct || item.roi_direct == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.roi_direct}</div>
                                  <div className="col">{item.roi_indirect}</div>
                                  <div className="col font-semibold">
                                    {item.roi_total}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.aov_direct || item.aov_direct == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.aov_direct}</div>
                                  <div className="col">{item.aov_indirect}</div>
                                  <div className="col font-semibold">
                                    {item.aov_total}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                          </tr>
                        </>
                      );
                    }
                    if (source == "placement") {
                      return (
                        <>
                          {/* <div className=""> */}
                          {/* </div> */}
                          <tr
                            className={
                              isCheckBoxRequired
                                ? "tableContentCheckBox"
                                : "tablecontent"
                            }
                          >
                            {/* {isCheckBoxRequired === true && (
                            <td className="pl-2">
                              <input
                                className="h-16"
                                type="checkbox"
                                onChange={(e) => handleCheckBox(e, item)}
                              />
                            </td>
                          )} */}

                            {item.placement_type || item.placement_type == 0 ? (
                              <td className="p-2">
                                {" "}
                                <div> {item.placement_type}</div>
                              </td>
                            ) : null}
                            {item.segment || item.segment == 0 ? (
                              <td className="p-2">
                                <div> {item.segment}</div>
                              </td>
                            ) : null}

                            {item.campaign_name || item.campaign_name == 0 ? (
                              <td className="p-2">
                                <div> {item.campaign_name}</div>
                              </td>
                            ) : null}
                            {item.platform || item.platform == 0 ? (
                              <td className="p-2">
                                <div> {item.platform}</div>
                              </td>
                            ) : null}
                            {item.spend || item.spend == 0 ? (
                              <td className="p-2">
                                <div> {item.spend.toLocaleString(currency_format)}</div>
                              </td>
                            ) : null}
                            {item.placement_bids || item.placement_bids == 0 ? (
                              <td className="p-2">
                                <div>
                                  {" "}
                                  {item.placement_bids.toLocaleString(currency_format)}
                                </div>
                              </td>
                            ) : null}

                            {item.placement_bids_percentage ||
                            item.placement_bids_percentage == 0 ? (
                              <td className="p-2">
                                <div> {item.placement_bids_percentage}</div>
                              </td>
                            ) : null}
                            {item.placement_spent ||
                            item.placement_spent == 0 ? (
                              <td className="p-2">
                                <div> {item.placement_spent}</div>
                              </td>
                            ) : null}
                            {item.placement_spent_percentage ||
                            item.placement_spent_percentage == 0 ? (
                              <td className="p-2">
                                <div> {item.placement_spent_percentage}</div>
                              </td>
                            ) : null}
                            {item.views || item.views == 0 ? (
                              <td className="p-2">
                                <div> {item.views.toLocaleString(currency_format)}</div>
                              </td>
                            ) : null}
                            {item.clicks || item.clicks == 0 ? (
                              <td className="p-2">
                                <div>
                                  {" "}
                                  {item.clicks.toLocaleString(currency_format)}
                                </div>
                              </td>
                            ) : null}
                            {item.ctr || item.ctr == 0 ? (
                              <td className="p-2">
                                <div> {item.ctr}</div>
                              </td>
                            ) : null}
                            {item.cpc || item.cpc == 0 ? (
                              <td className="p-2">
                                <div> {item.cpc}</div>
                              </td>
                            ) : null}
                            {item.units_sold_direct ||
                            item.units_sold_direct == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">
                                    {item.units_sold_direct.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col">
                                    {item.units_sold_indirect.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col font-semibold">
                                    {item.units_sold_total.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.revenue_direct_view ||
                            item.revenue_direct_view == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">
                                    {item.revenue_direct_view.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col">
                                    {item.revenue_indirect_view.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col font-semibold">
                                    {item.revenue_total_view.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.direct_cvr || item.direct_cvr == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.direct_cvr}</div>
                                  <div className="col">{item.indirect_cvr}</div>
                                  <div className="col">{item.cvr}</div>
                                </div>
                              </td>
                            ) : null}
                            {item.direct_roi || item.direct_roi == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.direct_roi}</div>
                                  <div className="col">{item.indirect_roi}</div>
                                  <div className="col font-semibold">
                                    {item.roi}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.direct_aov || item.direct_aov == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.direct_aov}</div>
                                  <div className="col">{item.indirect_aov}</div>
                                  <div className="col font-semibold">
                                    {item.aov}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                          </tr>
                        </>
                      );
                    }
                    if (source == "negativeKeyword") {
                      return (
                        <>
                          <tr
                            className={
                              isCheckBoxRequired
                                ? "tableContentCheckBox"
                                : "tablecontent"
                            }
                          >
                            {isCheckBoxRequired === true && (
                              <td className="pl-2">
                                <input
                                  className="h-16 m-3"
                                  type="checkbox"
                                  checked={editData
                                    .map((data) => data._id)
                                    .includes(item._id)}
                                  onChange={(e) =>
                                    handleCheckBox(e.target.checked, item)
                                  }
                                />
                              </td>
                            )}

                            {item.keyword || item.keyword == 0 ? (
                              <td className="p-2">
                                <div> {item.keyword}</div>
                              </td>
                            ) : null}
                            {item.campaign_id ? (
                              <td className="p-2">
                                <div> {item.campaign_id}</div>
                              </td>
                            ) : null}

                            {item.campaign_name || item.campaign_name == 0 ? (
                              <td className="p-2">
                                <div> {item.campaign_name}</div>
                              </td>
                            ) : null}
                            {item.ad_group_id || item.ad_group_id == 0 ? (
                              <td className="p-2">
                                <div> {item.ad_group_id}</div>
                              </td>
                            ) : null}
                            {item.ad_group_name || item.ad_group_name == 0 ? (
                              <td className="p-2">
                                <div> {item.ad_group_name}</div>
                              </td>
                            ) : null}

                            {item.created_on || item.created_on == 0 ? (
                              <td className="p-2">
                                <div> {item.created_on}</div>
                              </td>
                            ) : null}
                            {item.action_status ? (
                              <td className="p-2">
                                <div>
                                  {" "}
                                  {item.action_status == 1
                                    ? "pending"
                                    : "completed"}
                                </div>
                              </td>
                            ) : (
                              <td className="p-2">
                                <div>completed</div>
                              </td>
                            )}
                          </tr>
                        </>
                      );
                    }
                    if (source === "searchData") {
                      return (
                        <>
                          <tr
                            className={
                              isCheckBoxRequired
                                ? "tableContentCheckBox"
                                : "tablecontent"
                            }
                          >
                            {isCheckBoxRequired === true && (
                              <td className="pl-2">
                                <input
                                  className="h-16 m-3"
                                  type="checkbox"
                                  checked={editData
                                    .map((data) => data._id)
                                    .includes(item._id)}
                                  onChange={(e) =>
                                    handleCheckBox(e.target.checked, item)
                                  }
                                />
                              </td>
                            )}

                            {item._id ? (
                              <td className="p-2">
                                <div> {item._id}</div>
                              </td>
                            ) : null}
                            {item.campaign_name ? (
                              <td className="p-2">
                                <div> {item.campaign_name}</div>
                              </td>
                            ) : null}
                            {item.segment || item.segment == 0 ? (
                              <td className="p-2">
                                <div> {item.segment}</div>
                              </td>
                            ) : null}
                            {item.ad_group_name || item.ad_group_name == 0 ? (
                              <td className="p-2">
                                <div> {item.ad_group_name}</div>
                              </td>
                            ) : null}
                            {item.platform ? (
                              <td className="p-2">
                                <div> {item.platform}</div>
                              </td>
                            ) : null}

                            {item.spend || item.spend == 0 ? (
                              <td className="p-2">
                                <div> {item.spend.toLocaleString(currency_format)}</div>
                              </td>
                            ) : null}
                            {item.views || item.views == 0 ? (
                              <td className="p-2">
                                <div> {item.views.toLocaleString(currency_format)}</div>
                              </td>
                            ) : null}

                            {item.clicks || item.clicks == 0 ? (
                              <td className="p-2">
                                <div>
                                  {" "}
                                  {item.clicks.toLocaleString(currency_format)}
                                </div>
                              </td>
                            ) : null}
                            {item.ctr || item.ctr == 0 ? (
                              <td className="p-2">
                                <div> {item.ctr}</div>
                              </td>
                            ) : null}
                            {item.cpc || item.cpc == 0 ? (
                              <td className="p-2">
                                <div> {item.cpc}</div>
                              </td>
                            ) : null}
                            {item.direct_units_sold ||
                            item.direct_units_sold == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">
                                    {item.direct_units_sold.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col">
                                    {item.indirect_units_sold.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col font-semibold">
                                    {item.total_units_sold.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.direct_revenue || item.direct_revenue == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">
                                    {item.direct_revenue.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col">
                                    {item.indirect_revenue.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col font-semibold">
                                    {item.total_revenue.toLocaleString(currency_format)}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.cvr_direct || item.cvr_direct === 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.cvr_direct}</div>
                                  <div className="col">{item.cvr_indirect}</div>
                                  <div className="col font-semibold">
                                    {item.cvr_total}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.roi_direct || item.roi_direct === 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.roi_direct}</div>
                                  <div className="col">{item.roi_indirect}</div>
                                  <div className="col font-semibold">
                                    {item.roi_total}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.aov_direct || item.aov_direct === 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.aov_direct}</div>
                                  <div className="col">{item.aov_indirect}</div>
                                  <div className="col font-semibold">
                                    {item.aov_total}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                          </tr>
                        </>
                      );
                    }
                    if (source === "rule") {
                      return (
                        <>
                          <tr className="rule_content">
                            {item.rule_name || item.rule_name == 0 ? (
                              <td className="p-2">
                                <div className="text-[13px]">
                                  {" "}
                                  {item.rule_name}
                                </div>
                              </td>
                            ) : (
                              "-"
                            )}
                            {item?.is_active === true ? (
                              <td className="p-2">
                                {item.is_deleted == false && (
                                  <div className="text-[12px]"> Enabled</div>
                                )}
                              </td>
                            ) : (
                              <td className="p-2">
                                <div className="text-[12px]"> Disabled</div>
                              </td>
                            )}
                            {item.platform === "MP" ? (
                              <td className="p-2">
                                <div className="text-[13px]">Marketplace</div>
                              </td>
                            ) : item.platform === "SM" ? (
                              <td className="p-2">
                                <div className="text-[13px]">Flipkart</div>
                              </td>
                            ) : (
                              "-"
                            )}
                            {item.campaign_type || item.campaign_type == 0 ? (
                              <td className="p-2 ">
                                {item.campaign_type.map((x, index) => (
                                  <div key={index}>
                                    {x}
                                    {index !==
                                      item.campaign_type.length - 1 && (
                                      <span>, </span>
                                    )}
                                  </div>
                                ))}
                              </td>
                            ) : (
                              "-"
                            )}
                            {item.entity || item.entity === 0 ? (
                              <td className="p-2 text-blue-500">
                                <div className="text-[13px]">
                                  {" "}
                                  {item.entity}
                                </div>
                              </td>
                            ) : (
                              "-"
                            )}
                            <td className="p-2">
                              <p className="text-blue-500 text-[12px]">
                                {item?.action
                                  .split(/(?=[A-Z])/)
                                  .map((word, index) => word?.toLowerCase())
                                  .join(" ")}
                              </p>
                              {item?.rule_conditions?.map(
                                (conditionGroup, groupIndex) => (
                                  <div className="text-[13px]" key={groupIndex}>
                                    {groupIndex > 0 && (
                                      <span>
                                        OR <br />
                                      </span>
                                    )}

                                    {conditionGroup?.map(
                                      (condition, conditionIndex) => (
                                        <div
                                          key={conditionIndex}
                                          className="inline"
                                        >
                                          {conditionIndex > 0 && (
                                            <span className="ml-2">AND</span>
                                          )}{" "}
                                          <span>
                                            (if {condition?.conditionCategory}{" "}
                                            is{" "}
                                            {condition?.conditionType ===
                                            "greater_than"
                                              ? "Greater than"
                                              : condition.conditionType ===
                                                "smaller_than"
                                              ? "Smaller than"
                                              : condition.conditionType ===
                                                  "range" ||
                                                condition.conditionType ===
                                                  "is_not_in_range"
                                              ? "Between"
                                              : "-"}{" "}
                                            {condition?.conditionType ===
                                              "range" ||
                                            condition?.conditionType ===
                                              "is_not_in_range"
                                              ? `${condition?.less}-${condition?.greater}`
                                              : condition?.conditionType ===
                                                "smaller_than"
                                              ? `${condition?.less}`
                                              : condition?.greater}
                                            )
                                          </span>
                                        </div>
                                      )
                                    )}
                                  </div>
                                )
                              )}
                            </td>

                            {item.entity || item.entity === 0 ? (
                              <td className="p-2">
                                <div
                                  className="text-[13px] text-blue-500 cursor-pointer"
                                  onClick={() => {
                                    setRulesPopup(item._id);
                                    setRuleData(item._id);
                                  }}
                                >
                                  {" "}
                                  No Changes To {item.entity}
                                </div>
                              </td>
                            ) : null}
                            {item.schedule || item.schedule == 0 ? (
                              <td className="p-2">
                                <div className="text-[13px]">
                                  {" "}
                                  {item.schedule}
                                </div>
                              </td>
                            ) : null}

                            {/* {item.clicks || item.clicks == 0 ? ( */}
                            {item.platform || item.platform == 0 ? (
                              <td className="p-2">
                                <div className="text-[12px]">{item.created_by}</div>
                              </td>
                            ) : null}
                            {/* ) : null} */}

                            {/* {item.action ? ( */}
                            <td className="">
                              {/* data to show in the popup */}
                              <div>
                                <PreviewBtn rowData={item} />
                              </div>
                            </td>
                            {/* ) : null} */}

                            {/* {rulesPopup === item._id && (
                              <Popup
                                title="Rule results"
                                smallsize
                                setShowPopup={setRulesPopup}
                                apply_button_css={true}
                                cutomButton={[
                                  {
                                    handleClick: () => {
                                      setRulesPopup(false);
                                    },
                                    label: "OK",
                                    style: "",
                                  },
                                ]}
                              >
                                <p>
                                  <RulesResult rowData={ruleData} />
                                </p>
                              </Popup>
                            )} */}
                          </tr>
                        </>
                      );
                    }
                    if (source === "dummy") {
                      return (
                        <>
                          <tr className="tablecontent">
                            {item.keyword || item.keyword == 0 ? (
                              <td className="p-2">
                                <div> {item.keyword}</div>
                              </td>
                            ) : null}
                            {item.keyword_match_type ||
                            item.keyword_match_type == 0 ? (
                              <td className="p-2">
                                <div> {item.keyword_match_type}</div>
                              </td>
                            ) : null}
                            {item.segment || item.segment == 0 ? (
                              <td className="p-2">
                                <div> {item.segment}</div>
                              </td>
                            ) : null}
                            {item.ad_group_name || item.ad_group_name == 0 ? (
                              <td className="p-2">
                                <div> {item.ad_group_name}</div>
                              </td>
                            ) : null}
                            {item.campaign_name || item.campaign_name == 0 ? (
                              <td className="p-2">
                                <div> {item.campaign_name}</div>
                              </td>
                            ) : null}
                            {item.platform || item.platform == 0 ? (
                              <td className="p-2">
                                <div> {item.platform}</div>
                              </td>
                            ) : null}
                            {item.spend || item.spend == 0 ? (
                              <td className="p-2">
                                <div> {item.spend}</div>
                              </td>
                            ) : null}
                            {item.views || item.views == 0 ? (
                              <td className="p-2">
                                <div> {item.views}</div>
                              </td>
                            ) : null}

                            {item.clicks || item.clicks == 0 ? (
                              <td className="p-2">
                                <div> {item.clicks}</div>
                              </td>
                            ) : null}
                            {item.ctr || item.ctr == 0 ? (
                              <td className="p-2">
                                <div> {item.ctr}</div>
                              </td>
                            ) : null}
                            {item.ctr || item.ctr == 0 ? (
                              <td className="p-2">
                                <div> {item.ctr}</div>
                              </td>
                            ) : null}
                          </tr>
                        </>
                      );
                    }
                  })
                ) : !loading ? (
                  <td
                    className="p-2"
                    colSpan={10}
                    rowSpan={2}
                    style={{ alignItems: "center", verticalAlign: "middle" }}
                  >
                    <div className="loaderStyle  row sticky font-semibold">
                      No Data Found
                    </div>
                  </td>
                ) : // <tr>
                //   <div className="p-2 row sticky "> No Data found</div>
                // </tr>
                null
              }
              {loading && (
                <>
                  <td
                    className="p-2"
                    colSpan={16}
                    rowSpan={3}
                    style={{ alignItems: "center", verticalAlign: "middle" }}
                  >
                    <div className="loaderStyle p-2 row sticky ">
                      {/* <LoaderSpinner /> */}
                    </div>
                  </td>
                </>
              )}
            </tbody>
          </table>

          {/* <button
          onClick={() => {
            callSearchPropertyAction();
          }}
        >
          Load More
        </button> */}
        </div>
        {/* {totalData > 10 ? (
          <Pagination paginate={paginate} page={page} totalData={totalData} />
        ) : null} */}
        {/* <NewPagination newpaginate={newpaginate} /> */}
      </div>
    </>
  );
};

export default InstamartTable;
