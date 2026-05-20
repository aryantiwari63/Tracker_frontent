// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import ActionType from "../../../redux/types";
// import LoaderSpinner from "../../common-components/loader-spinner";


// const AdvertiseTable = ({ isCheckBoxRequired, header, bodyContent 
// ,  tabName,
// handleSelectedData,
// sortData,
// loading
// }) => {

//   const parser = new DOMParser();
//   const [selectedData, setSelectedData] = useState([]);
//   let { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);
//   const [campaignId, setCampaignId] = useState("");

//   let allTabSelectedCheckBox = selectedCheckBox;
//   selectedCheckBox =
//     selectedCheckBox && selectedCheckBox.hasOwnProperty(tabName)
//       ? selectedCheckBox[tabName]
//       : [];
//       const dispatch = useDispatch();
//       const handleCheckBox = (e, data, action_from) => {
//         // checked state of the checkbox
//         const isChecked = e.target.checked;
    
//         if (action_from === "tag") {
//           setCampaignId(data.campaign_id);
//         } else {
//           let updatedIds = allTabSelectedCheckBox;
//           // if the checkbox is selected, add the data to the previous selectedData array
//           if (isChecked) {
//             console.log("debug 2", isChecked);
    
//             updatedIds[tabName] = [...selectedCheckBox, data];
//             setSelectedData(updatedIds);
//             dispatch({
//               type: ActionType.CHECKBOX,
//               payload: { ...updatedIds },
//             });
//           } else {
//             // if the checkbox is unselected, remove the data from the previous selectedData array
//             updatedIds[tabName] = selectedCheckBox.filter(
//               (item) => item._id !== data._id
//             );
//             setSelectedData(updatedIds);
//             dispatch({
//               type: ActionType.CHECKBOX,
//               payload: { ...updatedIds },
//             });
//           }
//           handleSelectedData(updatedIds);
//         }
//       };
//   const handleAllCheckBox = (e, data) => {
//     // checked state of the checkbox
//     const isChecked = e.target.checked;

//     let updatedIds = allTabSelectedCheckBox;
//     // if the checkbox is selected, add the data to the previous selectedData array
//     if (isChecked) {
//       console.log("debug 2", isChecked);

//       updatedIds[tabName] = [...data];
//       setSelectedData(updatedIds);
//       dispatch({
//         type: ActionType.CHECKBOX,
//         payload: { ...updatedIds },
//       });
//     } else {
//       // if the checkbox is unselected, remove the data from the previous selectedData array
//       updatedIds[tabName] = [];
//       setSelectedData(updatedIds);
//       dispatch({
//         type: ActionType.CHECKBOX,
//         payload: { ...updatedIds },
//       });
//     }
//     handleSelectedData(updatedIds);
//   };

  
//   return (
//     <>
//       <div className="bg-white w-full">
//         <div
//           className={
//             isCheckBoxRequired
//               ? "campaignreportcheckbox__table "
//               : "campaignreport__table "
//           }
//           // className={"campaignreport__table "}
//         >
//           <table>
//             <thead
//               className={
//                 isCheckBoxRequired
//                   ? "campaignreportcheckbox__tablehead table-fixed "
//                   : "campaignreport__tablehead  table-fixed"
//               }
//             >
//               <tr className="">
//                 {isCheckBoxRequired === true && (
//                   <th className="pr-6">
//                     <input
//                       className="h-16 "
//                       type="checkbox"
//                       checked={
//                         bodyContent?.length > 0 &&
//                         selectedCheckBox?.length == bodyContent?.length
//                       }
//                       onChange={(e) => handleAllCheckBox(e, bodyContent)}
//                     />
//                   </th>
//                 )}

//                 {header.map((item, i) => {
//                   if (item.showCol) {
//                     return (
//                       <>
//                         {item.type === "single" ? (
//                           <th>
//                             <div className="tableHead px-1">
//                               <p>{item.title}</p>
//                               {item.show && (
//                                 <div className="sortArrow cursor-pointer">
//                                   <div>
//                                     <div
//                                       onClick={() => sortData(item?.value, 1)}
//                                     >
//                                       ▲
//                                     </div>
//                                   </div>
//                                   <div>
//                                     <div
//                                       className="downArrow"
//                                       onClick={() => sortData(item?.value, -1)}
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
//                             {item.subTitles.map((v, i) => {
//                               return <td className="graydirect">{v}</td>;
//                             })}
//                           </th>
//                         )}
//                       </>
//                     );
//                   }
//                 })}
//               </tr>
//             </thead>
//             <tbody>
//               {bodyContent && bodyContent.length !== 0 && loading === false ? (
//                 bodyContent.map((row, i) => {
//                   return (
//                     <>
//                       <tr
//                         className={
//                           isCheckBoxRequired
//                             ? "tableContentCheckBox"
//                             : "tablecontent"
//                         }
//                       >
//                         {isCheckBoxRequired === true && (
//                           <td className="pl-2">
//                             <input
//                               className="h-16"
//                               type="checkbox"
//                               checked={selectedCheckBox
//                                 .map((id) => id._id)
//                                 .includes(row._id)}
//                               // checked={row._id === selectedCheckBox._id}
//                               // checked={
//                               //   bodyContent.map((id) => id._id) ===
//                               //   selectedCheckBox._id
//                               // }
//                               onChange={(e) => handleCheckBox(e, row)}
//                               //checked={selectedCamp.indexOf(row.campaign_id)>-1?true:false }
//                             />
//                           </td>
//                         )}

//                         {/* <TableCol row={row} name={name} /> */}
//                       </tr>
//                     </>
//                   );
//                 })
//               ) : (
//                 <>
//                   <td
//                     className="p-2"
//                     colSpan={16}
//                     rowSpan={3}
//                     style={{ alignItems: "center", verticalAlign: "middle" }}
//                   >
//                     <div className="loaderStyle">
//                       {bodyContent.length === 0 && !loading ? (
//                         "No Data Found"
//                       ) : (
//                         <LoaderSpinner />
//                       )}
//                     </div>
//                   </td>
//                 </>
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
//         {/* {totalData > 10 ? (
//           <Pagination paginate={paginate} page={page} totalData={totalData} />
//         ) : null} */}
//       </div>
//     </>
//   );
// };
// export default AdvertiseTable;
