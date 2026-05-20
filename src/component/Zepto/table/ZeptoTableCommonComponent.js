import React from "react";
import LoaderSpinner from "../../common-components/loader-spinner";
import Tooltip from "../../common-components/toolTip/ToolTip";
const ZeptoTableCommonComponent = ({
  headers,
  content,
  loading,
  sortData,
  totalData,
  setDataLIMIT,
  dataLIMIT,
  callApi,
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
    if (bottom && callApi && content.length > 0) {
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
                (platform = "zepto" && "bg-[#b5fd4e]"),
              ].join(" ")}
            >
              {headers.map((item) => {
                return (
                  <>
                    {item.showCol && (
                      <th className="flex-column sticky top-0 z-[9]">
                        <div className="flex items-center ">
                          <span className="ml-2 flex">{item.title}</span>
                          <span className="">
                            {item.showSort ? (
                              <div className="sortArrow cursor-pointer ml-4 mr-6 ">
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
              ? content.map((items) => {
                  return (
                    <>
                      <tr>
                        {headers.map(
                          (header) =>
                            header.showCol &&
                            // <td>

                            // </td>

                            items.spend !== 0 && (
                              <td key="">
                                {header.value === "campaign_name" ? (
                                  <div className="flex items-center justify-between max-w-[450px]">
                                    <div className="flex items-center">
                                      {items.status === "ACTIVE" ||
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
                                      {/* {items.campaign_name} */}

                                      {items.campaign_name.length > 40 ? (
                                        <>
                                          {items.campaign_name
                                            ?.replace(/<\/?[^>]+>/gi, "")
                                            .slice(0, 40)}
                                          ...
                                          <div className="ml-2">
                                            <Tooltip
                                              title={items.campaign_name?.replace(
                                                /<\/?[^>]+>/gi,
                                                ""
                                              )}
                                              className="!px-3 flex items-center gap-1 rounded-sm shadow-md"
                                            />
                                          </div>
                                        </>
                                      ) : (
                                        items.campaign_name?.replace(
                                          /<\/?[^>]+>/gi,
                                          ""
                                        )
                                      )}
                                    </div>
                                    <span
                                      className={
                                        items?.campaign_type === "Awareness"
                                          ? "Awareness"
                                          : "Performance"
                                      }
                                    >
                                      {items.campaign_type
                                        ? items.campaign_type
                                        : "-"}
                                    </span>
                                  </div>
                                ) : (
                                  renderValues(header, items)
                                )}
                              </td>
                            )
                        )}
                      </tr>
                      {/* <tr>
                        <td>
                          <div className="flex items-center justify-between ">
                            <div className="flex items-center">
                              {items.status === "ACTIVE" ||
                              items.status === "active" ? (
                                <img
                                  className=""
                                  src="/assets/images/active-circle.svg"
                                  alt=""
                                />
                              ) : items.status === "DRAFT" ||
                                items.status === "draft" ? (
                                <img
                                  className=""
                                  src="/assets/images/aborted.svg"
                                  alt=""
                                />
                              ) : items.status === "PAUSED" ||
                                items.status === "paused" ? (
                                <img
                                  className=""
                                  src="/assets/images/pause-circle.svg"
                                  alt=""
                                />
                              ) : (
                                <img
                                  className=""
                                  src="/assets/images/underreview.svg"
                                  alt=""
                                />
                              )}
                              {items.campaign_name?.replace(/<\/?[^>]+>/gi, "")}
                            </div>
                            <span
                              className={
                                items?.campaign_type == "Awareness"
                                  ? "Awareness"
                                  : "Performance"
                              }
                            >
                              {items.campaign_type ? items.campaign_type : "-"}
                            </span>
                          </div>
                        </td>
                        {/* <td>{items?.status ? items?.status : "-"}</td> */}
                      {/* <td>
                          {items?.campaign_type ? items?.campaign_type : "-"}
                        </td> *

                        <td>
                          {items.ctr !== undefined && items.ctr !== null
                            ? Number(items.ctr)?.toFixed(2) + "%"
                            : "-"}
                        </td>
                        <td>
                          {items.spend !== undefined && items.spend !== null
                            ? currency +
                              Number(items.spend?.toFixed(0))?.toLocaleString(
                                currency_format
                              )
                            : "-"}
                        </td>
                        <td>
                          {items.impressions !== undefined &&
                          items.impressions !== null
                            ? parseFloat(items.impressions).toLocaleString(
                                currency_format
                              )
                            : "-"}
                        </td>
                        <td>
                          {items.clicks !== undefined && items.clicks !== null
                            ? parseFloat(items.clicks).toLocaleString(currency_format)
                            : "-"}
                        </td>
                        <td>
                          {items.orders !== undefined && items.orders !== null
                            ? parseFloat(items.orders).toLocaleString(currency_format)
                            : "-"}
                        </td>
                        <td>
                          {items.revenues !== undefined &&
                          items.revenues !== null
                            ? currency +
                              Number(
                                items.revenues?.toFixed(0)
                              )?.toLocaleString(currency_format)
                            : "-"}
                        </td>
                      </tr> */}
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

export default ZeptoTableCommonComponent;
