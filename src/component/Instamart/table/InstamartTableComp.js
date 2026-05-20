import React from "react";
import LoaderSpinner from "../../common-components/loader-spinner";

const InstamartTableComponent = ({
  headers,
  content,
  loading,
  sortData,
  totalData,
  setDataLIMIT,
  dataLIMIT,
  sortBy,
  platform,
  summaryData,
  footer,
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
                (platform = "instamart" && "bg-[#b5fd4e]"),
              ].join(" ")}
            >
              {headers.map((item, i) => {
                return (
                  <>
                    {item.showCol && (
                      <th className="flex-column sticky top-0" key={i}>
                        <div className="flex items-center ">
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
                      <tr key = {i}>
                        {headers.map(
                          (header, i) =>
                            header.showCol && (
                              // <td>

                              // </td>
                              <td key={i}>
                                {header.value === "campaign_name" ? (
                                  <div className="flex items-center justify-between max-w-[450px]">
                                    <div className="flex items-center">
                                      {items.status ===
                                        "CAMPAIGN_STATUS_LIVE" ||
                                      items.status === "active" ? (
                                        <img
                                          className="mr-2"
                                          src="/assets/images/active-circle.svg"
                                          alt=""
                                        />
                                      ) : items.status === "ARCHIVED" ||
                                        items.status === "archived" ? (
                                        <img
                                          className="mr-2"
                                          src="/assets/images/pause-circle.svg"
                                          alt=""
                                        />
                                      ) : (
                                        <img
                                          className="mr-2"
                                          src="/assets/images/aborted.svg"
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
                    </>
                  );
                })
              : !loading
              ? "No Data found"
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
          <tfoot className="sticky bottom-0 left-0 z-[35] flipkarttable__footer">
            {summaryData && summaryData.length > 0
              ? summaryData.map((row, i) => {
                  return (
                    <>
                      <tr key={i} className="font-semibold">
                        <td className="sticky left-0 min-w-max z-30 pl-2">
                          <td className="font-semibold pl-2">Total</td>
                          <div className="font-semibold pl-2">{totalData}</div>
                        </td>
                        {/* <TableTotalCol row={row} name={name} /> */}
                      </tr>
                    </>
                  );
                })
              : null}
          </tfoot>
          {footer && (
            <tfoot className="sticky bottom-0 z-[999]">
              <tr>
                {footer?.map((item) => {
                  return (
                    <>
                      <td>{item.campaign}</td>
                      <td>{item.spend}</td>
                      <td>{item.impression}</td>
                      <td>{item.clicks}</td>
                      <td>{item.ctr}</td>
                      <td>{item.orders}</td>
                      <td>{item.revenue}</td>
                    </>
                  );
                })}
              </tr>
            </tfoot>
          )}
        </table>
        {/* {totalData > 10 ? (
        <Pagination paginate={paginate} page={page} totalData={totalData} />
      ) : null} */}
      </div>
    </>
  );
};

export default InstamartTableComponent;
