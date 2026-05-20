import React, { useEffect, useState } from "react";
import LoaderSpinner from "../../../../common-components/loader-spinner";
import "./styles.css";
import { CSVLink } from "react-csv";
const BudgetSummary = ({
  bodyContent,
  loading,
  currentMonth,
  platformSelected,
  segmentSelected,
  month,
}) => {
  const [expandRow, setExpandRow] = useState([]);
  const [tableData, setTableData] = useState([]);
  let currency = localStorage.getItem("currency");
  let currency_format = localStorage.getItem("currency_format");
  let decimalFormat = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
  // Get the current date
  const currentDate = new Date();

  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);

  // Get the last day of the month
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  // Calculate the number of days in the month
  const numberOfDaysInMonth = lastDayOfMonth.getDate();
  const lastDate = yesterday.toISOString().split("T")[0].split("-")[2];
  const noOfDays = parseInt(lastDate);

  const remaningDays = numberOfDaysInMonth - noOfDays;
  const yesterdayHeader = `Yesterday's spend`;

  const handleExpandRow = (index) => {
    if (expandRow.includes(index)) {
      setExpandRow(expandRow.filter((rowIndex) => rowIndex !== index));
    } else {
      setExpandRow([...expandRow, index]);
    }
  };

  const rowData = () => {
    let dataSet = [];
    let budgetData = {};

    bodyContent?.length > 0 &&
      bodyContent?.map((item) => {
        let budgetInfo;
        budgetInfo = item.dataValues;

        if (platformSelected && segmentSelected) {
          let key;
          if (item?.platform === "MP") {
            key = `${item.account} Flipkart`;
          } else {
            key = `${item.account} Supermart`;
          }
          const spend = parseFloat(item.spend);
          const prevDaySpend = parseFloat(item.yesterday_spend);
          const clicks = parseFloat(item.clicks);
          const orders = parseFloat(item.orders);
          const sales = parseFloat(item.sales);

          if (!budgetData[key]) {
            budgetData[key] = {
              spend: 0,
              yesterday: 0,
              clicks: 0,
              sales: 0,
              orders: 0,
              budget: 0,
              childTable: [],
            };
          }

          budgetData[key].spend += parseFloat(spend);
          budgetData[key].yesterday += parseFloat(prevDaySpend);
          budgetData[key].clicks += parseFloat(clicks);
          budgetData[key].orders += parseFloat(orders);
          budgetData[key].sales += parseFloat(sales);
          budgetData[key].status = 1;

          if (item.platform === "MP" && item.segment === "PLA") {
            budgetData[key].childTable.push({
              name: `${item.account} Flipkart ${item.segment}`,
              yesterday: parseFloat(item?.yesterday_spend),
              spend: parseFloat(item?.spend),
              clicks: parseFloat(item?.clicks),
              sales: parseFloat(item?.sales),
              orders: parseFloat(item?.orders),
              budget: parseFloat(budgetInfo?.budget?.mk_pla_budget) || "-",
            });
          }
          if (item.platform === "MP" && item.segment === "PCA") {
            budgetData[key].childTable.push({
              name: `${item.account} Flipkart ${item.segment}`,
              yesterday: parseFloat(item?.yesterday_spend),
              spend: parseFloat(item?.spend),
              clicks: parseFloat(item?.clicks),
              sales: parseFloat(item?.sales),
              orders: parseFloat(item?.orders),
              budget: parseFloat(budgetInfo?.budget?.mk_pca_budget) || "-",
            });
          }
          if (item.platform === "SM" && item.segment === "PLA") {
            budgetData[key].childTable.push({
              name: `${item.account} Supermart ${item.segment}`,
              yesterday: parseFloat(item?.yesterday_spend),
              spend: parseFloat(item?.spend),
              clicks: parseFloat(item?.clicks),
              sales: parseFloat(item?.sales),
              orders: parseFloat(item?.orders),
              budget: parseFloat(budgetInfo?.budget?.sm_pla_budget) || "-",
            });
          }
          if (item.platform === "SM" && item.segment === "PCA") {
            budgetData[key].childTable.push({
              name: `${item.account} Supermart ${item.segment}`,
              yesterday: parseFloat(item?.yesterday_spend),
              spend: parseFloat(item?.spend),
              clicks: parseFloat(item?.clicks),
              sales: parseFloat(item?.sales),
              orders: parseFloat(item?.orders),
              budget: parseFloat(budgetInfo?.budget?.sm_pca_budget) || "-",
            });
          }

          if (key === `${item.account} Flipkart`) {
            budgetData[key].budget =
              parseFloat(budgetInfo?.budget?.mk_pca_budget) +
                parseFloat(budgetInfo?.budget?.mk_pla_budget) || "-";
          } else {
            budgetData[key].budget =
              parseFloat(budgetInfo?.budget?.sm_pca_budget) +
                parseFloat(budgetInfo?.budget?.sm_pla_budget) || "-";
          }
        } else if (platformSelected) {
          let key = `${item?.account}`;
          const spend = parseFloat(item.spend);

          const prevDaySpend = parseFloat(item.yesterday_spend);
          const clicks = parseFloat(item.clicks);
          const orders = parseFloat(item.orders);
          const sales = parseFloat(item.sales);
          const budget =
            parseFloat(budgetInfo?.budget.mk_budget) +
              parseFloat(budgetInfo?.budget.sm_budget) || "-";

          if (!budgetData[key]) {
            budgetData[key] = {
              spend: 0,
              yesterday: 0,
              clicks: 0,
              sales: 0,
              orders: 0,
              budget: 0,
              childTable: [],
            };
          }

          budgetData[key].spend += parseFloat(spend);
          budgetData[key].yesterday += parseFloat(prevDaySpend);
          budgetData[key].clicks += parseFloat(clicks);
          budgetData[key].orders += parseFloat(orders);
          budgetData[key].sales += parseFloat(sales);
          budgetData[key].status = 1;
          budgetData[key].budget = parseFloat(budget);

          if (item.platform === "MP") {
            budgetData[key].childTable.push({
              name: `${item.account} Flipkart`,
              yesterday: parseFloat(item?.yesterday_spend),
              spend: parseFloat(item?.spend),
              clicks: parseFloat(item?.clicks),
              sales: parseFloat(item?.sales),
              orders: parseFloat(item?.orders),
              budget: parseFloat(budgetInfo?.budget?.mk_budget) || "-",
            });
          } else {
            budgetData[key].childTable.push({
              name: `${item.account} Supermart`,
              yesterday: parseFloat(item?.yesterday_spend),
              spend: parseFloat(item?.spend),
              clicks: parseFloat(item?.clicks),
              sales: parseFloat(item?.sales),
              orders: parseFloat(item?.orders),
              budget: parseFloat(budgetInfo?.budget?.sm_budget) || "-",
            });
          }
        } else if (segmentSelected) {
          let key = `${item?.account}_${item.segment}`;
          const spend = parseFloat(item.spend);
          const prevDaySpend = parseFloat(item.yesterday_spend);
          const clicks = parseFloat(item.clicks);
          const orders = parseFloat(item.orders);
          const sales = parseFloat(item.sales);

          if (!budgetData[key]) {
            budgetData[key] = {
              spend: 0,
              yesterday: 0,
              clicks: 0,
              sales: 0,
              orders: 0,
              budget: 0,
              childTable: [],
            };
          }

          budgetData[key].spend = parseFloat(spend);
          budgetData[key].yesterday = parseFloat(prevDaySpend);
          budgetData[key].clicks = parseFloat(clicks);
          budgetData[key].orders = parseFloat(orders);
          budgetData[key].sales = parseFloat(sales);
          // budgetData[key].budget = budget;

          if (item.segment === "PCA") {
            budgetData[key].budget =
              parseFloat(budgetInfo?.budget?.pca_budget) || "-";
          } else {
            budgetData[key].budget =
              parseFloat(budgetInfo?.budget?.pla_budget) || "-";
          }
        }
      });

    Object.entries(budgetData).forEach(
      ([
        name,
        { spend, yesterday, clicks, sales, orders, status, budget, childTable },
      ]) => {
        dataSet.push({
          name,
          spend,
          yesterday,
          clicks,
          sales,
          status,
          orders,
          budget,
          childTable,
        });
      }
    );

    setTableData(dataSet);
  };

  useEffect(() => {
    rowData();
  }, [bodyContent]);

  const cur_drr = (item) => {
    let current_drr;

    if (currentMonth === true) {
      current_drr = item?.spend / noOfDays;
    } else {
      current_drr = item?.spend / currentMonth;
    }

    return current_drr.toLocaleString(currency_format, decimalFormat);
  };

  const est_drr = (item) => {
    let est_drr;

    est_drr =
      (item?.budget - item?.spend) / remaningDays > 0
        ? (item?.budget - item?.spend) / remaningDays
        : 0;
    return est_drr.toLocaleString(currency_format, decimalFormat);
  };

  const remaining_budget = (item) => {
    const remaining_budget =
      item?.budget - item?.spend > 0 ? item?.budget - item?.spend : 0;
    return remaining_budget.toLocaleString(currency_format, decimalFormat);
  };

  const spend_percentage = (item) => {
    const spend_percentage =
      item?.budget > 0 ? (item?.spend / item?.budget) * 100 : 0;
    return spend_percentage.toLocaleString(currency_format, decimalFormat);
  };

  const cpc = (item) => {
    const cpc = item?.clicks > 0 ? item?.spend / item?.clicks : 0;
    return cpc.toLocaleString(currency_format, decimalFormat);
  };

  const cvr = (item) => {
    const cvr = item.clicks > 0 ? (item?.orders / item?.clicks) * 100 : 0;
    return cvr.toLocaleString(currency_format, decimalFormat);
  };
  const roas = (item) => {
    const roas = item?.spend > 0 ? item.sales / item?.spend : 0;
    return roas.toLocaleString(currency_format, decimalFormat);
  };
  const cpa = (item) => {
    const cpa = item?.orders > 0 ? item?.spend / item?.orders : 0;
    return cpa.toLocaleString(currency_format, decimalFormat);
  };

  const exportData = tableData?.flatMap((item) => {
    const parentItem = {
      ...item,
      current_drr: cur_drr(item),
      estimated_drr: est_drr(item),
      remaining_budget: remaining_budget(item),
      spend_percentage: spend_percentage(item),
      cpc: cpc(item),
      cvr: cvr(item),
      roas: roas(item),
      cpa: cpa(item),
    };

    delete parentItem.childTable;

    const childRows = item?.childTable?.map((childItem) => ({
      ...childItem,
      current_drr: cur_drr(childItem),
      estimated_drr: est_drr(childItem),
      remaining_budget: remaining_budget(childItem),
      spend_percentage: spend_percentage(childItem),
      cpc: cpc(childItem),
      cvr: cvr(childItem),
      roas: roas(childItem),
      cpa: cpa(childItem),
    }));

    return [parentItem, ...childRows];
  });

  return (
    <>
      <div className="bg-white w-full">
        <div className="mb-2 mr-2 flex items-center justify-end">
          {/* <h2 className="text-[20px] font-semibold">Buget Summary</h2> */}
          <CSVLink
            data={exportData}
            filename={`budget_summary_${month}.csv`}
            className="border rounded text-gray-500 px-2 py-2 roshadow-md cursor-pointer hover:text-blue-600 transition duration-300"
          >
            {" "}
            <img className="header-buttons w-4" src="/assets/images/hard-disk.png" alt="" />
          </CSVLink>
        </div>

        <div
          className={"campaignreport__table max-h-[640px] overflow-y-scroll"}
        >
          <table className="">
            <thead className="campaignreport__tableHeadBudget  table-fixed sticky top-0 left-0 z-[35] bg-[#F3F4F6]">
              <tr className="h-[54px]">
                <th className="tableHeadBudgetBudget--sticky ">
                  <div className="tableHeadBudget px-2 w-full">
                    <p></p>
                  </div>
                </th>
                <th className="tableHeadBudgetBudget--sticky">
                  <div className="tableHeadBudget px-2 w-full bold">
                    <p>Budget</p>
                  </div>
                </th>
                <th
                  className="tableHeadBudgetBudget--sticky min-w-16"
                  style={{
                    // left: "5px",
                    minWidth: "140px",
                    position: "sticky",
                    top: 0,
                    zIndex: 3,

                    // height: "45px",
                  }}
                >
                  <div className="tableHeadBudget px-2 w-full ">
                    <p>Spend</p>
                  </div>
                </th>
                <th
                  className="tableHeadBudgetBudget--sticky"
                  style={{
                    // left: "5px",
                    minWidth: "140px",
                    position: "sticky",
                    top: 0,
                    zIndex: 3,
                    // height: "45px",
                  }}
                >
                  <div className="tableHeadBudget px-2 w-full">
                    <p>Spend %</p>
                  </div>
                </th>
                <th
                  className="tableHeadBudgetBudget--sticky"
                  style={{
                    // left: "5px",
                    minWidth: "140px",
                    position: "sticky",
                    top: 0,
                    zIndex: 3,
                    // height: "45px",
                  }}
                >
                  <div className="tableHeadBudget px-2 w-full">
                    <p>Remaining budget</p>
                  </div>
                </th>
                <th
                  className="tableHeadBudgetBudget--sticky"
                  style={{
                    // left: "5px",
                    minWidth: "140px",
                    position: "sticky",
                    top: 0,
                    zIndex: 3,
                    // height: "45px",
                  }}
                >
                  <div className="tableHeadBudget px-2 w-full">
                    <p>Current DRR</p>
                  </div>
                </th>
                <th
                  className="tableHeadBudgetBudget--sticky"
                  style={{
                    // left: "5px",
                    minWidth: "140px",
                    position: "sticky",
                    top: 0,
                    zIndex: 3,
                    // height: "45px",
                  }}
                >
                  <div className="tableHeadBudget px-2 w-full">
                    <p>{yesterdayHeader}</p>
                  </div>
                </th>
                <th
                  className="tableHeadBudgetBudget--sticky"
                  style={{
                    // left: "5px",
                    minWidth: "140px",
                    position: "sticky",
                    top: 0,
                    zIndex: 3,
                    // height: "45px",
                  }}
                >
                  <div className="tableHeadBudget px-2 w-full">
                    <p>Estimated DRR</p>
                  </div>
                </th>
                <th
                  className="tableHeadBudgetBudget--sticky"
                  style={{
                    // left: "5px",
                    minWidth: "140px",
                    position: "sticky",
                    top: 0,
                    zIndex: 3,
                    // height: "45px",
                  }}
                >
                  <div className="tableHeadBudget px-2 w-full">
                    <p>Clicks</p>
                  </div>
                </th>{" "}
                <th
                  className="tableHeadBudgetBudget--sticky"
                  style={{
                    // left: "5px",
                    minWidth: "140px",
                    position: "sticky",
                    top: 0,
                    zIndex: 3,
                    // height: "45px",
                  }}
                >
                  <div className="tableHeadBudget px-2 w-full">
                    <p>Orders</p>
                  </div>
                </th>{" "}
                <th
                  className="tableHeadBudgetBudget--sticky"
                  style={{
                    // left: "5px",
                    minWidth: "140px",
                    position: "sticky",
                    top: 0,
                    zIndex: 3,
                    // height: "45px",
                  }}
                >
                  <div className="tableHeadBudget px-2 w-full">
                    <p>Sales</p>
                  </div>
                </th>{" "}
                <th
                  className="tableHeadBudgetBudget--sticky"
                  style={{
                    // left: "5px",
                    minWidth: "140px",
                    position: "sticky",
                    top: 0,
                    zIndex: 3,
                    // height: "45px",
                  }}
                >
                  <div className="tableHeadBudget px-2 w-full">
                    <p>CPC</p>
                  </div>
                </th>{" "}
                <th
                  className="tableHeadBudgetBudget--sticky"
                  style={{
                    // left: "5px",
                    minWidth: "140px",
                    position: "sticky",
                    top: 0,
                    zIndex: 3,
                    // height: "45px",
                  }}
                >
                  <div className="tableHeadBudget px-2 w-full">
                    <p>CVR</p>
                  </div>
                </th>{" "}
                <th
                  className="tableHeadBudgetBudget--sticky"
                  style={{
                    // left: "5px",
                    minWidth: "140px",
                    position: "sticky",
                    top: 0,
                    zIndex: 3,
                    // height: "45px",
                  }}
                >
                  <div className="tableHeadBudget px-2 w-full">
                    <p>ROAS</p>
                  </div>
                </th>{" "}
                <th
                  className="tableHeadBudgetBudget--sticky"
                  style={{
                    // left: "5px",
                    minWidth: "140px",
                    position: "sticky",
                    top: 0,
                    zIndex: 3,
                    // height: "45px",
                  }}
                >
                  <div
                    className="tableHeadBudget px-2 w-full"
                    style={{
                      // left: "5px",
                      minWidth: "140px",
                      position: "sticky",
                      top: 0,
                      zIndex: 3,
                      // height: "45px",
                    }}
                  >
                    <p>CPA</p>
                  </div>
                </th>
              </tr>
            </thead>

            {loading === true ? (
              <tbody>
                <tr>
                  <td
                    className=""
                    colSpan={10}
                    rowSpan={2}
                    style={{ alignItems: "center", verticalAlign: "middle" }}
                  >
                    <div className="loaderStyle row sticky">
                      <LoaderSpinner />
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {tableData.length > 0 ? (
                  tableData.map((item, index) => {
                    return (
                      <>
                        <tr key={index} className="h-11 tablecontent m-4 ">
                          <td className="p-2 tableHeadBudgetBudget--sticky  ">
                            <div className="flex">
                              {item?.status === 1 && (
                                <img
                                  onClick={() => handleExpandRow(index)}
                                  src="/assets/images/down-arrow.png"
                                  alt=""
                                  style={{
                                    width: 14,
                                    cursor: "pointer",
                                    paddingTop: "6px",
                                    marginRight: "6px",
                                  }}
                                />
                              )}
                              {item.name}
                            </div>
                          </td>
                          <td>
                            {item.budget !== "-" && !isNaN(item?.budget) ? (
                              <>
                                {currency}
                                {item.budget.toLocaleString(
                                  currency_format,
                                  decimalFormat
                                )}
                              </>
                            ) : (
                              <>-</>
                            )}
                          </td>
                          <td className="pl-2">
                            <div>
                              {currency}
                              {item?.spend.toLocaleString(
                                currency_format,
                                decimalFormat
                              )}
                            </div>
                          </td>
                          <td className="pl-2">
                            {item.budget !== "-" ? (
                              <>{spend_percentage(item)}% </>
                            ) : (
                              <>-</>
                            )}
                          </td>
                          <td className="pl-2">
                            {item.budget !== "-" ? (
                              <>
                                {currency}
                                {remaining_budget(item)}{" "}
                              </>
                            ) : (
                              <>-</>
                            )}
                          </td>
                          <td className="pl-2">
                            {cur_drr(item) !== "-" ? (
                              <div>
                                {currency}
                                {cur_drr(item)}
                              </div>
                            ) : (
                              <div>-</div>
                            )}
                          </td>
                          <td className="pl-2">
                            {item?.yesterday ? (
                              <div>
                                {currency}
                                {item?.yesterday?.toLocaleString(
                                  currency_format,
                                  decimalFormat
                                ) || 0}
                              </div>
                            ) : (
                              <div>0</div>
                            )}
                          </td>
                          <td>
                            {item.budget !== "-" && est_drr(item) != null ? (
                              <>
                                {currency}
                                {est_drr(item)}
                              </>
                            ) : (
                              <>-</>
                            )}
                          </td>
                          <td className="pl-2">
                            {item?.clicks ? (
                              <div>
                                {item?.clicks?.toLocaleString(currency_format)}
                              </div>
                            ) : (
                              <div>0</div>
                            )}
                          </td>
                          <td className="pl-2">
                            {item?.orders ? (
                              <div>
                                {item?.orders?.toLocaleString(
                                  currency_format,
                               
                                ) || 0}
                              </div>
                            ) : (
                              <div>0</div>
                            )}
                          </td>{" "}
                          <td className="pl-2">
                            {item?.sales ? (
                              <div>
                                {currency}
                                {item?.sales?.toLocaleString(
                                  currency_format,
                                  decimalFormat
                                )}
                              </div>
                            ) : (
                              <div>0</div>
                            )}
                          </td>
                          <td className="pl-2">
                            <div>{cpc(item)}</div>
                          </td>
                          <td className="pl-2">
                            <div>{cvr(item)}</div>
                          </td>
                          <td className="pl-2">
                            <div>{roas(item)}</div>
                          </td>
                          <td className="pl-2">
                            <div>{cpa(item)}</div>
                          </td>
                        </tr>
                        {expandRow.includes(index) &&
                          item.childTable.map((i) => (
                            <>
                              <tr className="h-11 tableContentBudget m-4  ml-2 ">
                                <td>
                                  <div className="ml-10">{i.name}</div>
                                </td>
                                <td>
                                  {i.budget !== "-" ? (
                                    <>
                                      {currency}
                                      {i.budget.toLocaleString(
                                        currency_format,
                                        decimalFormat
                                      )}
                                    </>
                                  ) : (
                                    <>-</>
                                  )}
                                </td>
                                <td>
                                  {" "}
                                  {currency}
                                  {i.spend.toLocaleString(
                                    currency_format,
                                    decimalFormat
                                  )}
                                </td>
                                <td className="pl-2">
                                  {i.budget !== "-" ? (
                                    <>{spend_percentage(i)}% </>
                                  ) : (
                                    <>-</>
                                  )}
                                </td>
                                <td className="pl-2">
                                  {i.budget !== "-" ? (
                                    <>
                                      {currency}
                                      {remaining_budget(i)}{" "}
                                    </>
                                  ) : (
                                    <>-</>
                                  )}
                                </td>
                                <td className="pl-2">
                                  {cur_drr(i) !== "-" ? (
                                    <div>
                                      {" "}
                                      {currency}
                                      {cur_drr(i)}
                                    </div>
                                  ) : (
                                    <div>-</div>
                                  )}
                                </td>
                                <td className="pl-2">
                                  {i?.yesterday ? (
                                    <div>
                                      {currency}
                                      {i?.yesterday?.toLocaleString(
                                        currency_format,
                                        decimalFormat
                                      ) || 0}{" "}
                                    </div>
                                  ) : (
                                    <div>0</div>
                                  )}
                                </td>
                                <td>
                                  {i.budget !== "-" ? (
                                    <>
                                      {currency}
                                      {est_drr(i)}
                                    </>
                                  ) : (
                                    <>-</>
                                  )}
                                </td>
                                <td className="pl-2">
                                  {i?.clicks ? (
                                    <div>
                                      {i?.clicks?.toLocaleString(
                                        currency_format,
                                        decimalFormat
                                      )}
                                    </div>
                                  ) : (
                                    <div>-</div>
                                  )}
                                </td>
                                <td className="pl-2">
                                  {i?.orders ? (
                                    <div>
                                      {i?.orders?.toLocaleString(
                                        currency_format,
                                        decimalFormat
                                      ) || 0}
                                    </div>
                                  ) : (
                                    <div>-</div>
                                  )}
                                </td>{" "}
                                <td className="pl-2">
                                  {i?.sales ? (
                                    <div>
                                      {currency}
                                      {i?.sales?.toLocaleString(
                                        currency_format,
                                        decimalFormat
                                      )}
                                    </div>
                                  ) : (
                                    <div>-</div>
                                  )}
                                </td>
                                <td className="pl-2">
                                  <div>{cpc(i)}</div>
                                </td>
                                <td className="pl-2">
                                  <div>{cvr(i)}</div>
                                </td>
                                <td className="pl-2">
                                  <div>{roas(i)}</div>
                                </td>
                                <td className="pl-2">
                                  <div>{cpa(i)}</div>
                                </td>
                              </tr>
                            </>
                          ))}
                      </>
                    );
                  })
                ) : (
                  //  Render this if tableData is empty
                  <tr>
                    <td
                      className=""
                      colSpan={10}
                      rowSpan={2}
                      style={{ alignItems: "center", verticalAlign: "middle" }}
                    >
                      <div className="loaderStyle row sticky font-semibold">
                        No Data Found
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </>
  );
};

export default BudgetSummary;
