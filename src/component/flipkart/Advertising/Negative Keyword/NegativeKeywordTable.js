import React from "react";
import LoaderSpinner from "../../../common-components/loader-spinner";
import Tooltip from "../../../common-components/toolTip/ToolTip";

const NegativeKeywordTable = ({
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
  React.useEffect(() => {
    // console.log("bodyContent123", bodyContent);
  }, [bodyContent]);

  const handleCheckBox = (check, data) => {
    if (check) {
      setEditData([...editData, data]);
    } else {
      setEditData(editData.filter((item) => item.keyid !== data.keyid));
    }
  };

  const handleAllCheckBox = (check, data) => {
    if (check) {
      setEditData([...data]);
    } else {
      setEditData([]);
    }
  };

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
      <div className="">
        <div
          className={
            isCheckBoxRequired
              ? "campaignreportcheckbox__table max-h-[640px] overflow-y-auto flipkartCampignDataTables"
              : "campaignreport__table max-h-[640px] overflow-y-auto"
          }
          onScroll={handleScroll}
        >
          <table className=" w-full ">
            <thead
              className={
                isCheckBoxRequired
                  ? "campaignreportcheckbox__tablehead table-fixed sticky top-0 left-0 z-[35]"
                  : source === "rule"
                  ? "campaignreport__tablehead  table-fixed sticky top-0 left-0 bg-[#F3F4F6] "
                  : "campaignreport__tablehead  table-fixed sticky top-0 left-0 z-[35] bg-[#F3F4F6] "
              }
            >
              <tr className="">
                {isCheckBoxRequired === true && (
                  <th className=" ">
                    <input
                      className=" h-16 "
                      type="checkbox"
                      // style={{ verticalAlign: "left" }}
                      checked={
                        editData?.length === bodyContent?.length &&
                        !loading &&
                        bodyContent?.length !== 0
                      }
                      onChange={(e) =>
                        handleAllCheckBox(e.target.checked, bodyContent)
                      }
                      disabled={bodyContent?.length > 0 ? false : true}
                    />
                  </th>
                )}

                {headers?.map((item) => {
                  if (item.showCol) {
                    return (
                      <>
                        {item.type === "single" ? (
                          <th className=" ">
                            <div className="tableHead px-1  text-base !font-semibold ">
                              <span className="">{item.title}</span>
                              {bodyContent &&
                                bodyContent.length > 0 &&
                                item.show && (
                                  <div
                                    className={
                                      customCss === true
                                        ? "rule_arrow flex justify-end"
                                        : "sortArrow cursor-pointer flex justify-end"
                                    }
                                  >
                                    <div>
                                      <div
                                        className="flex justify-end pr-8"
                                        onClick={() => sortData(item?.value, 1)}
                                        style={{
                                          color:
                                            sortBy.key === item.value &&
                                            sortBy.order === 1
                                              ? "black"
                                              : "grey",
                                          marginBottom: 2,
                                        }}
                                      >
                                        ▲
                                      </div>
                                    </div>
                                    <div>
                                      <div
                                        className="mt-[-14px] flex justify-end pr-8"
                                        onClick={() =>
                                          sortData(item?.value, -1)
                                        }
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
                                return (
                                  <td key={i} className="graydirect">
                                    {v}
                                  </td>
                                );
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
              {bodyContent && bodyContent.length > 0 ? (
                bodyContent?.map((item) => {
                  if (source == "negativeKeyword") {
                    let iconUrl;
                    switch (item.status) {
                      case "PAUSED":
                        iconUrl = "/assets/images/pause-circle.svg";
                        break;
                      case "LIVE":
                        iconUrl = "/assets/images/active-circle.svg";
                        break;
                      default:
                        iconUrl = "/assets/images/aborted.svg";
                        break;
                    }
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
                            <td className="pl-5  min-w-max ">
                              <input
                                className="h-16 "
                                type="checkbox"
                                checked={editData
                                  .map((data) => data.keyid)
                                  .includes(item.keyid)}
                                onChange={(e) =>
                                  handleCheckBox(e.target.checked, item)
                                }
                              />
                            </td>
                          )}

                          {item.keyword || item.keyword == 0 ? (
                            <td className="!p-1">
                              <div> {item.keyword}</div>
                            </td>
                          ) : null}
                          {item.campaign_id ? (
                            <td className="!p-1">
                              <div> {item.campaign_id}</div>
                            </td>
                          ) : null}

                          {item.campaign_name || item.campaign_name == 0 ? (
                            <td className="!p-1 ">
                              <div className="flex">
                                <span className="mr-2">
                                  <img src={iconUrl} alt="" />
                                </span>
                                <span className="flex ">
                                  {" "}
                                  {item.campaign_name.length > 30 ? (
                                    <>
                                      {item.campaign_name
                                        ?.replace(/<\/?[^>]+>/gi, "")
                                        .slice(0, 30)}
                                      ...
                                      <div className="ml-2">
                                        <Tooltip
                                          title={item.campaign_name?.replace(
                                            /<\/?[^>]+>/gi,
                                            ""
                                          )}
                                          className="px-3 flex items-center gap-1 rounded-sm shadow-md"
                                        />
                                      </div>
                                    </>
                                  ) : (
                                    item.campaign_name?.replace(
                                      /<\/?[^>]+>/gi,
                                      ""
                                    )
                                  )}
                                </span>
                              </div>
                            </td>
                          ) : null}
                          {item.ad_group_id || item.ad_group_id == 0 ? (
                            <td className="!p-1">
                              <div> {item.ad_group_id}</div>
                            </td>
                          ) : null}
                          {item.ad_group_name || item.ad_group_name == 0 ? (
                            <td className="!p-1">
                              <div> {item.ad_group_name}</div>
                            </td>
                          ) : null}

                          {item.created_on || item.created_on == 0 ? (
                            <td className="!p-1">
                              <div> {item.created_on}</div>
                            </td>
                          ) : null}

                          {item.action_status ? (
                            <td className="!p-1">
                              <div>
                                {" "}
                                {item.action_status == 1
                                  ? "pending"
                                  : "completed"}
                              </div>
                            </td>
                          ) : (
                            <td className="!p-1">
                              <div>completed</div>
                            </td>
                          )}
                          {item.segment ? (
                            <td className="!p-1">
                              <div> {item.segment}</div>
                            </td>
                          ) : null}
                        </tr>
                      </>
                    );
                  }

                  // if (source === "amazon") {
                  //   return (
                  //     <>
                  //       <tr className="tablecontent">
                  //         {isCheckBoxRequired === true && (
                  //           <td className="p-1 text-center">
                  //             <input
                  //               className="h-16 m-3"
                  //               type="checkbox"
                  //               checked={editData
                  //                 .map((data) => data.id)
                  //                 .includes(item.id)}
                  //               onChange={(e) =>
                  //                 handleCheckBox(e.target.checked, item)
                  //               }
                  //             />
                  //           </td>
                  //         )}
                  //         {headers.map(
                  //           (header, headerIndex) =>
                  //             header.showCol && (
                  //               <td className="p-2" key={headerIndex}>
                  //                 {item[header.value]}
                  //               </td>
                  //             )
                  //         )}
                  //       </tr>
                  //     </>
                  //   );
                  // }
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
              null}
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

export default NegativeKeywordTable;
