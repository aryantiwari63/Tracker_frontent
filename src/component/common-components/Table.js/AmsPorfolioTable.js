// import LoaderSpinner from "../loader-spinner";

// const AmsPortfoliTable = ({
//   headers,
//   bodyContent,
//   footer,
//   isCheckBoxRequired,
//   loading,
// }) => {
//   return (
//     <>
//       <div className="bg-white w-full">
//         <div
//           className={
//             isCheckBoxRequired
//               ? "campaignreportcheckbox__table "
//               : "campaignreport__table "
//           }
//         >
//           <table>
//             <thead
//               className={
//                 isCheckBoxRequired
//                   ? "campaignreportcheckbox__tablehead table-fixed sticky top-0 z-[20]"
//                   : "campaignreport__tablehead  table-fixed sticky top-0 z-[20]"
//               }
//             >
//               <tr>
//                 {isCheckBoxRequired === true && (
//                   <th className="pr-6">
//                     <input
//                       className="h-16 "
//                       type="checkbox"
//                       //   checked={
//                       //     bodyContent?.length > 0 &&
//                       //     selectedCheckBox?.length == bodyContent?.length
//                       //   }
//                       //   onChange={(e) => handleAllCheckBox(e, bodyContent)}
//                     />
//                   </th>
//                 )}

//                 {headers?.map((item, i) => {
//                   return (
//                     <>
//                       <th>
//                         <div className="tableHead px-1">
//                           <p>{item.name}</p>
//                           {item.show && (
//                             <div className="sortArrow cursor-pointer">
//                               <div>
//                                 <div
//                                 //   onClick={() => sortData(item?.value, 1)}
//                                 >
//                                   ▲
//                                 </div>
//                               </div>
//                               <div>
//                                 <div
//                                   className="downArrow"
//                                   //   onClick={() => sortData(item?.value, -1)}
//                                 >
//                                   ▼
//                                 </div>
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </th>
//                     </>
//                   );
//                 })}
//               </tr>
//             </thead>
//             <tbody>
//               {bodyContent?.map((item, i) => {
//                 return (
//                   <>
//                     <tr>
//                       {isCheckBoxRequired === true && (
//                         <td className="pl-2 sticky left-0 z-10">
//                           <input className="h-16" type="checkbox" />
//                         </td>
//                       )}
//                       <td className="bg-white text-blue-400 sticky left-14  box-border overflow-hidden ">
//                         {item.portfolio_name}
//                       </td>
//                       {/* <td className="bg-white pr-4 box-border sticky left-64 text-green-400 z-10">
//                         {item.sku}
//                       </td> */}
//                       {/* <td className="pr-4 ">{item.title}</td> */}
//                       <td className="pr-9 pl-2 text-green-400 text-center bg-white  box-border sticky left-64   z-10">
//                         {item.status}
//                       </td>
//                       <td className="pr-4 pl-2">{item.budget_type}</td>
//                       <td className="pr-4"><button className="border p-1.5  bg-[#F8F9FA]">{item.budget}</button></td>
//                       <td className=""><button className="border p-1.5  bg-[#EBEDF0]">{item.budget_start}</button></td>
//                       <td className=" "><button className="border  p-1.5   bg-[#EBEDF0]">{item.budget_end}</button></td>
//                       <td className="pr-7 pl-4 ">{item.campaign_count}</td>
//                       <td className="pr-4 ">{item.impressions}</td>
//                       <td className="pr-4 ">{item.clicks}</td>
//                       <td className="pr-4">{item.ctr}</td>
//                       <td className="pr-4">{item.spend}</td>
//                       <td className="pr-4">{item.cpc}</td>
//                       <td className="pr-4">{item.orders}</td>
//                       <td className="pr-4">{item.sales}</td>
//                       <td className="pr-4">{item.acos}</td>
//                       <td className="pr-4">{item.roas}</td>
//                       <td className="pr-4">{item.ntb_orders}</td>
//                       <td className="pr-4">{item.ntb}</td>
//                       <td className="pr-4">{item.sales_ntb}</td>
//                       <td className="pr-4">{item.viewable_impressions}</td>
//                       <td className="pr-4">{item.vcpm}</td>


                     
                    
//                     </tr>
//                   </>
//                 );
//               })}
//             </tbody>
//             {/* {footer && (
//               <tfoot
//                 className="sticky bottom-0 z-[20] "
//                 style={{ boxShadow: "1px 5px 15px rgba(0,0,0,0.5)" }}
//               >
//                 <tr className="bg-white">
//                   {footer?.map((item) => {
//                     return (
//                       <>
//                         <td className="sticky left-0 text-base font-semibold py-3">
//                           Result{" "}
//                         </td>
//                         <td className="">
//                         {item.portfolio_name}
//                       </td>
                     
//                       <td className="pr-4 ">
//                         {item.status}
//                       </td>
//                       <td className="pr-4">{item.budget_type}</td>
//                       <td className="pr-4 ">{item.budget}</td>
//                       <td className="pr-4">{item.budget_start}</td>
//                       <td className="pr-4">{item.budget_end}</td>
//                       <td className="pr-4 ">{item.campaign_count}</td>
//                       <td className="pr-4">{item.impressions}</td>
//                       <td className="pr-4">{item.clicks}</td>
//                       <td className="pr-4">{item.ctr}</td>
//                       </>
//                     );
//                   })}
//                 </tr>
//               </tfoot>
//             )} */}
//           </table>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AmsPortfoliTable;
