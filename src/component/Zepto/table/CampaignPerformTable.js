import React from "react";
import LoaderSpinner from "../../common-components/loader-spinner";
const CampaignPerformTable = ({
  headers,
  content,
  loading,
  sortData,
  // paginate,
  // totalData,
  // page,
  // offset,
}) => {
  return (
    <>
      <table className=" text-left w-full campaignsTable  ">
        <thead>
          <tr className="bg-slate-100 ">
            {headers.map((item) => {
              return (
                <>
                  <th className="flex-column ">
                    <div className="flex items-center ">
                      <span className="ml-2 flex">{item.title}</span>
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
        <tbody>
          {!loading && content && content.length > 0 ? (
            content.map((items) => {
              const keys = Object.keys(items);
              return (
                <>
                  <tr className="">
                    {keys.map((key) => {
                      return (
                        // key !== "other" &&
                        <>
                          <td className="">
                            {/* <div className={[key == items.other.badge && `${items.other.type} w-fit m-0`].join(" ")}> */}
                            <div>{items[key]}</div>
                          </td>
                        </>
                      );
                    })}
                    {/* {items.campaign_name && <td className="">{items.campaign_name}</td>}
                      {items.spend && <td>{items.spend}</td>}
                      {items.sales && <td>{items.sales}</td>}
                      {items.roas && <td>{items.roas}</td>} */}
                  </tr>
                </>
              );
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

export default CampaignPerformTable;
