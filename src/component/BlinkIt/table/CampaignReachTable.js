import React from "react";
import LoaderSpinner from "../../common-components/loader-spinner";
const CampaignReachTable = ({
  headers,
  content,
  loading,
  sortData,
  // paginate,
  // totalData,
  // page,
  // offset,
}) => {
  // console.log("content::::::", content);
  return (
    <>
      <table className=" text-left w-full campaignsTable border">
        <thead>
          <tr className="bg-slate-100 ">
            {headers.map((item, i) => {
              return (
                <>
                  <th className="flex-column " key = {i}>
                    <div className="flex items-center ">
                      <span className="ml-2 flex font-semibold">{item.title}</span>
                      <span className="">
                        {item.showSort ? (
                          <div className="sortArrow cursor-pointer ml-4  ">
                            <div onClick={() => sortData(item?.value, "DESC")}>
                              ▲
                            </div>

                            <div
                              className="downArrow"
                              onClick={() => sortData(item?.value, "ASC")}
                            >
                              ▼
                            </div>
                          </div>
                        ) : null}
                      </span>
                    </div>
                  </th>
                </>
              );
            })}
          </tr>
        </thead>
        <tbody className="">
          {!loading && content && content.length > 0 ? (
            content.map((items) => {
              const keys = Object.keys(items);
              return (
                <>
                  <tr className="py-4">
                    {keys.map((key) => {
                      return (
                        key !== "blinkit_campaign.tag_id" && 
                        <>
                          <td>
                            <div className="line-clamp-1"
                            title={items[key]}
                            // className={[
                            //   key == items.other.badge &&
                            //     `${items.other.type} w-fit m-0`,
                            // ]}
                            >
                              {items[key]}
                            </div>
                          </td>
                        </>
                      );
                      // );
                    })}
                    {/* <td>
              <div className="PLA w-fit  ml-8">Reach</div>
            </td>
                      {items.campaign_name && <td className=""></td>}
                      {items.spend && <td>{items.spend}</td>}
                      {items.cpm && <td>{items.cpm}</td>}
                      {items.impression && <td>{items.impression}</td>} */}
                  </tr>
                </>
              );
            })
          ) : !loading ? (
            // "No Data found"
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
          ) : null}
          {loading && (
            <>
              <td
                className="p-2"
                colSpan={16}
                rowSpan={3}
                style={{ alignItems: "center", verticalAlign: "middle" }}
              >
                <div className="loaderStyle p-2 row sticky ">
                  <LoaderSpinner />
                </div>
              </td>
            </>
          )}
        </tbody>
      </table>
      {/* {totalData > 10 ? (
        <Pagination paginate={paginate} page={page} totalData={totalData} />
      ) : null} */}
    </>
  );
};

export default CampaignReachTable;

// import React from "react";
// import Pagination from "../../pagination";
// const Table = ({
//   headers,
//   content,
//   loading,
//   sortData,
//   paginate,
//   totalData,
//   page,
//   offset,
// }) => {
//   const parser = new DOMParser();

//   return (
//     <>
//       <table className=" text-left w-full campaignsTable  ">
//         <thead>
//           <tr className="bg-slate-100 ">
//             {headers.map((item, i) => {
//               return (
//                 <>
//                   <th className="flex-column ">
//                     <div className="flex items-center ">
//                       <span className="ml-2 flex">{item.title}</span>
//                       <span className="">
//                         {item.showSort ? (
//                           <div className="sortArrow cursor-pointer ml-4  ">
//                             <div onClick={() => sortData(item?.value, 1)}>
//                               ▲
//                             </div>

//                             <div
//                               className="downArrow"
//                               onClick={() => sortData(item?.value, -1)}
//                             >
//                               ▼
//                             </div>
//                           </div>
//                         ) : null}
//                       </span>
//                     </div>
//                   </th>
//                 </>
//               );
//             })}
//           </tr>
//         </thead>
//         <tbody>
//           {content && content.length > 0
//             ? content.map((items, i) => {
//               console.log(Object.keys(items),"content value")
//                 return (
//                   <>
//                     <tr  className="">
//                       {items.category && <td className="">{items.category}</td>}
//                       {items.spends && <td>{items.spends}</td>}
//                       {items.ROAS && <td>{items.ROAS}</td>}
//                       {items.clicks && <td>{items.clicks}</td>}
//                       {items.CTR && <td>{items.CTR}</td>}

//                     </tr>
//                   </>
//                 );
//               })
//             : "No Data found"}
//         </tbody>
//       </table>
//       {totalData > 10 ? (
//         <Pagination paginate={paginate} page={page} totalData={totalData} />
//       ) : null}
//     </>
//   );
// };

// export default Table;
