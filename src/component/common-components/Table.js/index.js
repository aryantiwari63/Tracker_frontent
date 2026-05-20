import React from "react";
import LoaderSpinner from "../loader-spinner";
const Table = ({
  headers,
  content,
  loading,
  sortData,
  setDataLIMIT,
  dataLIMIT,
  sortBy,
  platform,
}) => {
  const handleScroll = (e) => {
    const bottom =
      Math.abs(
        e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop
      ) < 1;
    if (bottom && content.length > 0) {
      setDataLIMIT(dataLIMIT + 50);
    }
  };
  let currency = localStorage.getItem("currency");
  let currency_format = localStorage.getItem("currency_format");
  const renderValues = (header, items) => {
    if (!header.type) {
      return items[header.value] ? items[header.value] : "-";
    }
    if (header.type === "currency") {
      return items[header.value] && items[header.value] !== null
        ? currency +
            parseFloat(items[header.value]).toLocaleString(currency_format)
        : "-";
    }
    if (header.type === "string") {
      return items[header.value] && items[header.value] !== null
        ? parseFloat(items[header.value]).toLocaleString(currency_format)
        : "-";
    }
    if (header.type === "decimal") {
      return items[header.value] && items[header.value] !== null
        ? `${items[header.value].toFixed(1)}`
        : "-";
    }
    if (header.type === "number") {
      return items[header.value] && items[header.value] !== null
        ? `${Number(items[header.value]).toFixed(1)}`
        : "-";
    }
    if (header.type === "percentage") {
      return items[header.value] && items[header.value] !== null
        ? `${Number(items[header.value]).toFixed(1)}%`
        : "-";
    }
  };
  return (
    <>
      <div
        className="bg-white max-h-[440px] overflow-y-scroll"
        onScroll={handleScroll}
      >
        <table className=" text-left w-full campaignsTable ">
          <thead>
            <tr
              className={[
                "bg-slate-100 ",
                // eslint-disable-next-line no-unused-vars
                (platform = "ams" && "bg-[#F9F7EB]"),
              ].join(" ")}
            >
              {headers.map((item, i) => {
                return (
                  <>
                    {item.showCol && (
                      <th
                        className={`flex-column sticky top-0 left-0 ${
                          item.value === "campaign_name" ? "z-30" : "z-20"
                        }`}
                        key={i}
                      >
                        <div className="flex items-center">
                          <span className="ml-2 flex">{item.title}</span>
                          <span className="">
                            {item.showSort ? (
                              <div className="sortArrow cursor-pointer ml-4 mr-6  ">
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
                            ) : null}
                          </span>
                        </div>
                      </th>
                    )}
                  </>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {content && content.length > 0
              ? content.map((items, i) => {
                  return (
                    <>
                      <tr key={i}>
                        {headers.map(
                          (header, i) =>
                            header.showCol && (
                              // <td>

                              // </td>
                              <td
                                className={`flex-column sticky top-0 left-0 ${
                                  header.value === "campaign_name" ? "z-10" : ""
                                }`}
                                key={i}
                              >
                                {header.value === "campaign_name" ? (
                                  <div className=" ">
                                    <div className="flex items-start">
                                      {items.campaign_status === "LIVE" ||
                                      items.campaign_status === "live" || items.campaign_status == 'TOTAL_BUDGET_MET' ? (
                                        <img
                                          className="mr-2"
                                          src="/assets/images/active-circle.svg"
                                          alt=""
                                        />
                                      ) : items.campaign_status === "ABORTED" ||
                                        items.campaign_status === "aborted" ? (
                                        <img
                                          className="mr-2"
                                          src="/assets/images/aborted.svg"
                                          alt=""
                                        />
                                      ) : (
                                        <img
                                          className="mr-2"
                                          src="/assets/images/pause-circle.svg"
                                          alt=""
                                        />
                                      )}

                                      {items.campaign_name?.replace(
                                        /<\/?[^>]+>/gi,
                                        ""
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  renderValues(header, items)
                                )}
                              </td>
                            )
                        )}
                      </tr>
                      {/* <tr className="">
                        <td>
                          <div className="row justify-between ">
                            <div className="flex items-center">
                              {items.campaign_status === "LIVE" ? (
                                <img
                                  className="mr-2"
                                  src="/assets/images/active-circle.svg"
                                  alt=""
                                />
                              ) : items.campaign_status === "COMPLETED" ? (
                                <img
                                  className="mr-2"
                                  src="/assets/images/aborted.svg"
                                  alt=""
                                />
                              ) : (
                                <img
                                  className="mr-2"
                                  src="/assets/images/pause-circle.svg"
                                  alt=""
                                />
                              )}
                              {items.campaign_name?.replace(/<\/?[^>]+>/gi, "")}
                              {/* {parser.parseFromString(items.campaign_name, "text/html")} 
                            </div>
                            <span
                              className={items.segment?.replace(
                                /<\/?[^>]+>/gi,
                                ""
                              )}
                            >
                              {items.segment?.replace(/<\/?[^>]+>/gi, "")}
                            </span>
                          </div>
                        </td>

                        <td>
                          {items.spend !== undefined && items.spend !== null
                            ? currency +
                              parseFloat(items.spend).toLocaleString(
                                currency_format
                              )
                            : "-"}
                        </td>
                        <td>
                          {items.views !== undefined && items.views !== null
                            ? parseFloat(items.views).toLocaleString(
                                currency_format
                              )
                            : "-"}
                        </td>
                        <td>
                          {items.clicks !== undefined && items.clicks !== null
                            ? parseFloat(items.clicks).toLocaleString(
                                currency_format
                              )
                            : "-"}
                        </td>
                        <td>
                          {items.ctr !== undefined && items.ctr !== null
                            ? `${Number(items.ctr).toFixed(1)}%`
                            : "-"}
                        </td>
                        <td>
                          {items.orders !== undefined && items.orders !== null
                            ? parseFloat(items.orders).toLocaleString(
                                currency_format
                              )
                            : "-"}
                        </td>
                        <td>
                          {items.total_revenue !== undefined &&
                          items.total_revenue !== null
                            ? currency +
                              parseFloat(items.total_revenue).toLocaleString(
                                currency_format
                              )
                            : "-"}
                        </td>
                      </tr> */}
                    </>
                  );
                })
              : null}
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
        {content.length === 0 && (
          <div className="flex justify-center items-center py-3 bg-white">
            No Data Found
          </div>
        )}
        {/* {totalData > 10 ? (
        <Pagination paginate={paginate} page={page} totalData={totalData} />
      ) : null} */}
      </div>
    </>
  );
};

export default Table;
