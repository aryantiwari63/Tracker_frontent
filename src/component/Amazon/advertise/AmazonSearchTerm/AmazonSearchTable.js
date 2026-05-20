import React from "react";

import LoaderSpinner from "../../../common-components/loader-spinner";
import Tooltip from "../../../common-components/toolTip/ToolTip";

const AmazonSearchTable = ({
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
  const currency = localStorage.getItem("currency");
  const handleCheckBox = (check, data) => {
    // console.log(check, data, "check");
    if (check) {
      setEditData([...editData, data]);
    } else {
      setEditData(editData.filter((item) => item.id !== data.id));
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
      <div>
        <div
          className={
            isCheckBoxRequired
              ? "campaignreportcheckbox__table max-h-[640px] overflow-y-auto flipkartCampignDataTables"
              : "campaignreport__table max-h-[640px] overflow-y-auto"
          }
          onScroll={handleScroll}
        >
          <table className="h-full w-full ">
            <thead
              className={
                isCheckBoxRequired
                  ? "campaignreportcheckbox__tablehead table-fixed sticky top-0 left-0 z-[35] "
                  : "campaignreport__tablehead table-fixed sticky top-0 left-0 z-[35]"
              }
            >
              <tr className="">
                {isCheckBoxRequired === true && (
                  <th>
                    <input
                      className="accent-orange-600 h-16"
                      type="checkbox"
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
                          <th className="">
                            <div
                              className={
                                customCss === true
                                  ? "rule_table "
                                  : "tableHead py-5 px-1.5 !pl-4"
                              }
                            >
                              <p>{item.title}</p>
                              {bodyContent &&
                                bodyContent.length > 0 &&
                                item.show && (
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
                                          marginBottom: 2,
                                        }}
                                      >
                                        ▲
                                      </div>
                                    </div>
                                    <div>
                                      <div
                                        className="downArrow"
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
                bodyContent?.map((item, bodyIndex) => {
                  if (source === "amazonSearchData") {
                    return (
                      <tr
                        key={bodyIndex}
                        className={
                          isCheckBoxRequired
                            ? "tableContentCheckBox"
                            : "tablecontent"
                        }
                      >
                        {isCheckBoxRequired === true && (
                          <td className="pl-5  min-w-max ">
                            <input
                              className="h-16  accent-orange-600"
                              type="checkbox"
                              checked={editData
                                .map((data) => data.id)
                                .includes(item.id)}
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
                        {item.search_term ? (
                          <td className="p-2">
                            <div> {item.search_term}</div>
                          </td>
                        ) : null}
                        {item.keyword_text ? (
                          <td className="p-2 w-11">
                            {item.keyword_status === "ENABLED" ? (
                              <div className="flex">
                                <img
                                  className="mr-1 w-3"
                                  src="/assets/images/active-circle.svg"
                                />
                                <div> {item.keyword_text}</div>
                              </div>
                            ) : (
                              <div className="flex">
                                <img
                                  className="mr-1"
                                  src="/assets/images/pause-circle.svg"
                                  alt="pause"
                                />
                                <div> {item.keyword_text}</div>
                              </div>
                            )}
                          </td>
                        ) : null}
                        {item.match_type || item.match_type == 0 ? (
                          <td className="p-2">
                            <div> {item.match_type}</div>
                          </td>
                        ) : null}
                        {item.keyword_bid || item.keyword_bid == 0 ? (
                          <td className="p-2">
                            <div>
                              {" "}
                              {currency}
                              {item.keyword_bid}
                            </div>
                          </td>
                        ) : null}
                        {item.campaign_name ? (
                          <td className="p-2 w-11">
                            {item.campaign_status === "ENABLED" ? (
                              <div className="flex items-center">
                                <img
                                  className="mr-1 w-3"
                                  src="/assets/images/active-circle.svg"
                                />

                                {item.campaign_name.length > 30 ? (
                                  <>
                                    {item.campaign_name
                                      ?.replace(/<\/?[^>]+>/gi, "")
                                      .slice(0, 35)}
                                    <div className="ml-2">
                                      {item?.campaign_name?.length > 35 && (
                                        <Tooltip
                                          title={item.campaign_name?.replace(
                                            /<\/?[^>]+>/gi,
                                            ""
                                          )}
                                          className={`!px-3 flex items-center gap-1 rounded-sm !shadow-md !py-6 ${
                                            bodyIndex < 3 && "!top-6"
                                          }`}
                                        />
                                      )}
                                    </div>
                                  </>
                                ) : (
                                  item.campaign_name?.replace(
                                    /<\/?[^>]+>/gi,
                                    ""
                                  )
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <img
                                  className="mr-1"
                                  src="/assets/images/pause-circle.svg"
                                  alt="pause"
                                />
                                {item.campaign_name.length > 30 ? (
                                  <>
                                    {item.campaign_name
                                      ?.replace(/<\/?[^>]+>/gi, "")
                                      .slice(0, 40)}
                                    {item?.campaign_name?.length > 35 && (
                                      <div className="ml-2">
                                        <Tooltip
                                          title={item.campaign_name?.replace(
                                            /<\/?[^>]+>/gi,
                                            ""
                                          )}
                                          className="!px-3 flex items-center gap-1 rounded-sm !shadow-md "
                                        />
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  item.campaign_name?.replace(
                                    /<\/?[^>]+>/gi,
                                    ""
                                  )
                                )}
                              </div>
                            )}
                          </td>
                        ) : null}

                        {item.campaign_goal || item.campaign_goal == 0 ? (
                          <td className="p-2">
                            <div> {item.campaign_goal}</div>
                          </td>
                        ) : null}

                        {item.ad_group_name || item.ad_group_name == 0 ? (
                          <td className="p-2">
                            <div> {item.ad_group_name}</div>
                          </td>
                        ) : null}
                        {item.views || item.views == 0 ? (
                          <td className="p-2">
                            <div> {item.views.toLocaleString("en-IN")}</div>
                          </td>
                        ) : null}
                        {item.clicks || item.clicks == 0 ? (
                          <td className="p-2">
                            <div> {item.clicks.toLocaleString("en-IN")}</div>
                          </td>
                        ) : null}
                        {item.spend || item.spend == 0 ? (
                          <td className="p-2">
                            <div> {item.spend}</div>
                          </td>
                        ) : null}
                        {item.campaign_budget || item.campaign_budget == 0 ? (
                          <td className="p-2">
                            <div> {item.campaign_budget}</div>
                          </td>
                        ) : null}
                        {item.conversions || item.conversions == 0 ? (
                          <td className="p-2">
                            <div> {item.conversions}</div>
                          </td>
                        ) : null}
                        {item.campaign_budget_type ||
                        item.campaign_budget_type == 0 ? (
                          <td className="p-2">
                            <div> {item.campaign_budget_type}</div>
                          </td>
                        ) : null}
                        {item.revenue || item.revenue == 0 ? (
                          <td className="p-2">
                            <div> {item.revenue}</div>
                          </td>
                        ) : null}
                        {item.cvr || item.cvr == 0 ? (
                          <td className="p-2">
                            <div> {item.cvr}</div>
                          </td>
                        ) : null}

                        {item.campaign_id || item.campaign_id == 0 ? (
                          <td className="p-2">
                            <div> {item.campaign_id}</div>
                          </td>
                        ) : null}
                        {item.portfolio_id || item.portfolio_id == 0 ? (
                          <td className="p-2">
                            <div> {item.portfolio_id}</div>
                          </td>
                        ) : (
                          <td className="p-2">
                            <div>-</div>
                          </td>
                        )}
                        {item.ad_group_id || item.ad_group_id == 0 ? (
                          <td className="p-2">
                            <div> {item.ad_group_id}</div>
                          </td>
                        ) : null}
                        {item.keyword_id || item.keyword_id == 0 ? (
                          <td className="p-2">
                            <div> {item.keyword_id}</div>
                          </td>
                        ) : null}
                        {item.profile_id || item.profile_id == 0 ? (
                          <td className="p-2">
                            <div> {item.profile_id}</div>
                          </td>
                        ) : null}
                      </tr>
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

export default AmazonSearchTable;
