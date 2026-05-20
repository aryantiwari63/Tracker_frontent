import React, { useState, useEffect } from "react";
import LoaderSpinner from "../loader-spinner";
import { CSVLink } from "react-csv";
import "./style.css";

const BudgetPacerTable = ({
  // eslint-disable-next-line no-unused-vars
  mediaType,
  bodyContent,
  loading,
  currentMonth,
  platformSelected,
  segmentSelected,
  month,
  categorySelected,
}) => {
  const [expandRow, setExpandRow] = useState([]);
  const [tableData, setTableData] = useState([]);
  const yesterdayHeader = `Yesterday's spend`;
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

  const rowData = () => {
    let dataSet = [];
    let budgetData = {};

    bodyContent?.length > 0 &&
      bodyContent?.map((item) => {
        let budgetInfo;
        budgetInfo = item?.dataValues;

        if (platformSelected && segmentSelected) {
          let key = `${item?.account_name}`;
          const spend = parseFloat(item.spend);
          const prevDaySpend = parseFloat(item.yesterday_spend);
          const clicks = parseFloat(item.clicks);
          const orders = parseFloat(item.orders);
          const sales = parseFloat(item.sales);
          const budget = parseFloat(budgetInfo?.budget?.amazon) || "-";

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
          budgetData[key].budget += parseFloat(budget);

          if (item?.campaign_type === "SP") {
            budgetData[key].childTable.push({
              name: `${item.account_name} SP`,
              yesterday: parseFloat(item?.yesterday_spend),
              spend: parseFloat(item?.spend),
              clicks: parseFloat(item?.clicks),
              sales: parseFloat(item?.sales),
              orders: parseFloat(item?.orders),
              budget: parseFloat(budgetInfo?.budget?.sp_budget) || "-",
            });
          }
          if (item?.campaign_type === "SB") {
            budgetData[key].childTable.push({
              name: `${item.account_name} SB`,
              yesterday: parseFloat(item?.yesterday_spend),
              spend: parseFloat(item?.spend),
              clicks: parseFloat(item?.clicks),
              sales: parseFloat(item?.sales),
              orders: parseFloat(item?.orders),
              budget: parseFloat(budgetInfo?.budget?.sb_budget) || "-",
            });
          }
          if (item?.campaign_type === "SD") {
            budgetData[key].childTable.push({
              name: `${item.account_name} SD`,
              yesterday: parseFloat(item?.yesterday_spend),
              spend: parseFloat(item?.spend),
              clicks: parseFloat(item?.clicks),
              sales: parseFloat(item?.sales),
              orders: parseFloat(item?.orders),
              budget: parseFloat(budgetInfo?.budget?.sd_budget) || "-",
            });
          }
        } else if (platformSelected) {
          let key = `${item?.account_name}`;
          const spend = parseFloat(item.spend);
          const prevDaySpend = parseFloat(item.yesterday_spend);
          const clicks = parseFloat(item.clicks);
          const orders = parseFloat(item.orders);
          const sales = parseFloat(item.sales);
          const budget = parseFloat(budgetInfo?.budget?.amazon) || "-";

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
          budgetData[key].status = 0;
          budgetData[key].budget = parseFloat(budget);
        } else if (segmentSelected) {
          const segmentName = ["SP", "SB", "SD"];
          segmentName.forEach((i) => {
            const key = `${item?.account_name} ${i}`;
            if (!budgetData[key]) {
              budgetData[key] = {
                spend: 0,
                yesterday: 0,
                clicks: 0,
                sales: 0,
                orders: 0,
                budget: 0, // Initializing budget to 0
                childTable: [],
              };
            }
            let spend = 0;
            let prevDaySpend = 0;
            let clicks = 0;
            let orders = 0;
            let sales = 0;

            if (item?.campaign_type === i) {
              spend = parseFloat(item.spend || 0);
              prevDaySpend = parseFloat(item.yesterday_spend || 0);
              clicks = parseFloat(item.clicks || 0);
              orders = parseFloat(item.orders || 0);
              sales = parseFloat(item.sales || 0);
            }

            budgetData[key].spend = spend;
            budgetData[key].yesterday = prevDaySpend;
            budgetData[key].clicks = clicks;
            budgetData[key].orders = orders;
            budgetData[key].sales = sales;

            let budgetName = 0;
            if (item?.campaign_type) {
              switch (i) {
                case "SB":
                  budgetName = parseFloat(budgetInfo?.budget?.sb_budget) || "-";
                  break;
                case "SP":
                  budgetName = parseFloat(budgetInfo?.budget?.sp_budget) || "-";
                  break;
                case "SD":
                  budgetName = parseFloat(budgetInfo?.budget?.sd_budget) || "-";
                  break;
              }
            }
            budgetData[key].budget = budgetName || "-";
          });
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

  const zeptoRowData = () => {
    let dataSet = [];
    let budgetData = {};

    bodyContent?.length > 0 &&
      bodyContent?.map((item) => {
        let budgetInfo;
        budgetInfo = item?.dataValues;

        if (platformSelected && segmentSelected) {
          let key = `${item?.account}`;
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
          if (item?.campaign_type === "Awareness") {
            budgetData[key].childTable.push({
              name: `${item.account} Awareness`,
              yesterday: parseFloat(item?.yesterday_spend),
              spend: parseFloat(item?.spend),
              clicks: parseFloat(item?.clicks),
              sales: parseFloat(item?.sales),
              orders: parseFloat(item?.orders),
              budget: parseFloat(budgetInfo?.budget?.awareness_budget) || "-",
            });
            budgetData[key].budget += parseFloat(budgetInfo?.budget?.awareness_budget) || 0;
          }
          if (item?.campaign_type === "Performance") {
            budgetData[key].childTable.push({
              name: `${item.account} Performance`,
              yesterday: parseFloat(item?.yesterday_spend),
              spend: parseFloat(item?.spend),
              clicks: parseFloat(item?.clicks),
              sales: parseFloat(item?.sales),
              orders: parseFloat(item?.orders),
              budget: parseFloat(budgetInfo?.budget?.performance_budget) || "-",
            });
            budgetData[key].budget += parseFloat(budgetInfo?.budget?.performance_budget) || 0;
          }
        } else if (segmentSelected) {
          let key = `${item?.account} ${item?.campaign_type}`;
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

          if (item?.campaign_type === "Awareness") {
            budgetData[key].budget =
              parseFloat(budgetInfo?.budget?.awareness_budget) || "-";
          } else {
            budgetData[key].budget =
              parseFloat(budgetInfo?.budget?.performance_budget) || "-";
          }
        } else if (platformSelected) {
          let key = `${item?.account}`;
          const spend = parseFloat(item.spend);
          const prevDaySpend = parseFloat(item.yesterday_spend);
          const clicks = parseFloat(item.clicks);
          const orders = parseFloat(item.orders);
          const sales = parseFloat(item.sales);
          const budget = parseFloat(budgetInfo?.budget?.zepto) || "-";

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
          budgetData[key].status = 0;
          budgetData[key].budget = parseFloat(budget);
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
  const blinkitRowData = () => {
    const blinkitData = bodyContent?.BlinkitData;
    const budgetData = bodyContent?.brandBudget;
    let budgetInfo = {};
    let dataSet = [];
    // Initialize variables to store the totals
    let spend = 0;
    let sales = 0;
    let clicks = 0;
    let orders = 0;
    let yesterday = 0;

    let totalBudget1 = 0;
    let totalBudget;
    let commonKeys = [];
    // Iterate through the Blinkit data

    blinkitData?.forEach((item) => {
      if (segmentSelected && categorySelected) {
        if (
          item.campaign_type === "Performance" ||
          item.campaign_type === "Reach"
        ) {
          // Check if budgetInfo has the key, if not, initialize it
          if (!budgetInfo[item.campaign_type]) {
            budgetInfo[item.campaign_type] = {
              spend: 0,
              yesterday: 0,
              clicks: 0,
              sales: 0,
              orders: 0,
              status: 0,
              budget: 0,
              childTable: [],
            };
          }
          // Add numerical values to the totals
          spend += parseFloat(item.spend || 0);
          sales += parseFloat(item.sales || 0);
          clicks += parseFloat(item.clicks || 0);
          orders += parseFloat(item.orders || 0);
          yesterday += parseFloat(item.yesterday_spend || 0);

          if (budgetData[0]?.segment && budgetData[0]?.category) {
            let categoryBudget = [];
            categoryBudget = Object.values(
              item.campaign_type === "Performance"
                ? budgetData[0]?.budget?.performance_category_budget
                : budgetData[0]?.budget?.reach_category_budget
            );

            totalBudget1 = categoryBudget.reduce(
              (total, num) => total + parseFloat(num),
              0
            );
            const budgetType =
              item.campaign_type === "Performance"
                ? "performance_category_budget"
                : "reach_category_budget";
            const reachBudget = Object.keys(budgetData[0]?.budget[budgetType]);

            commonKeys = reachBudget.filter((i) => i == item.category_name);
            totalBudget = parseFloat(
              budgetData[0]?.budget[budgetType][commonKeys]
            );
          }

          // Update budgetInfo with spend, yesterday, clicks, sales, orders, status, and budget
          budgetInfo[item.campaign_type].spend = parseFloat(spend);
          budgetInfo[item.campaign_type].yesterday = parseFloat(yesterday);
          budgetInfo[item.campaign_type].clicks = parseFloat(clicks) || 0;
          budgetInfo[item.campaign_type].orders = parseFloat(orders);
          budgetInfo[item.campaign_type].sales = parseFloat(sales);
          budgetInfo[item.campaign_type].status = 1;
          budgetInfo[item.campaign_type].budget =
            parseFloat(totalBudget1) || "-";

          // Push data to child table
          budgetInfo[item.campaign_type].childTable.push({
            name: `${item.campaign_type} ${item?.category_name} `,
            yesterday: parseFloat(item?.yesterday_spend),
            spend: parseFloat(item?.spend),
            clicks: parseFloat(item?.clicks) || 0,
            sales: parseFloat(item?.sales),
            orders: parseFloat(item?.orders),
            budget: totalBudget || "-",
          });
        }

        if (item?.campaign_type !== "Reach") {
          budgetInfo["Reach"] = {
            spend: 0,
            yesterday: 0,
            clicks: 0,
            sales: 0,
            orders: 0,
            status: 1,
            budget: 0,
            childTable: [],
          };

          if (budgetData[0]?.budget?.reach_category_budget) {
            // This block should only execute if 'reach_category_budget' is available
            let category_name;
            category_name = Object.keys(
              budgetData[0]?.budget?.reach_category_budget
            );

            category_name?.forEach((key) => {
              const value = budgetData[0]?.budget?.reach_category_budget[key];
              totalBudget1 = Object.values(
                budgetData[0]?.budget?.reach_category_budget
              ).reduce((total, num) => total + parseFloat(num), 0);

              budgetInfo["Reach"].budget = parseFloat(totalBudget1);
              budgetInfo["Reach"]?.childTable?.push({
                name: `Reach ${key}`,
                yesterday: 0,
                spend: 0,
                clicks: 0,
                sales: 0,
                orders: 0,
                budget: parseFloat(value),
              });
            });
          }
        }
        if (item?.campaign_type !== "Performance") {
          budgetInfo["Performance"] = {
            spend: 0,
            yesterday: 0,
            clicks: 0,
            sales: 0,
            orders: 0,
            status: 1,
            budget: 0,
            childTable: [],
          };

          if (budgetData[0]?.budget?.performance_category_budget) {
            // This block should only execute if 'performance_category_budget' is available
            let category_name;
            category_name = Object.keys(
              budgetData[0]?.budget?.performance_category_budget
            );

            category_name?.forEach((key) => {
              const value =
                budgetData[0]?.budget?.performance_category_budget[key];
              totalBudget1 = Object.values(
                budgetData[0]?.budget?.performance_category_budget
              ).reduce((total, num) => total + parseFloat(num), 0);

              budgetInfo["Performance"].budget = parseFloat(totalBudget1);
              budgetInfo["Performance"]?.childTable?.push({
                name: `Performance ${key}`,
                yesterday: 0,
                spend: 0,
                clicks: 0,
                sales: 0,
                orders: 0,
                budget: parseFloat(value),
                childTable: [],
              });
            });
          }
        }
      } else if (segmentSelected) {
        if (
          item.campaign_type === "Performance" ||
          item?.campaign_type === "Reach"
        ) {
          if (!budgetInfo[item.campaign_type]) {
            budgetInfo[item.campaign_type] = {
              spend: 0,
              yesterday: 0,
              clicks: 0,
              sales: 0,
              orders: 0,
              status: 0,
              budget: 0,
              childTable: [],
            };
          }

          budgetInfo[item.campaign_type].spend = parseFloat(item?.spend);
          budgetInfo[item.campaign_type].yesterday = parseFloat(
            item?.yesterday_spend
          );
          budgetInfo[item.campaign_type].clicks = parseFloat(item?.clicks) || 0;
          budgetInfo[item.campaign_type].orders = parseFloat(item?.orders);
          budgetInfo[item.campaign_type].sales = parseFloat(item?.sales);
          budgetInfo[item.campaign_type].status = 0;
          budgetInfo[item.campaign_type].budget =
            item?.campaign_type === "Performance"
              ? parseFloat(budgetData[0]?.budget?.performance_budget)
              : parseFloat(budgetData[0]?.budget?.reach_budget);
          if (item?.campaign_type !== "Reach") {
            budgetInfo["Reach"] = {
              spend: 0,
              yesterday: 0,
              clicks: 0,
              sales: 0,
              orders: 0,
              status: 0,
              budget: parseFloat(budgetData[0]?.budget?.reach_budget),
              childTable: [],
            };
          }
          if (item?.campaign_type !== "Performance") {
            budgetInfo["Performance"] = {
              spend: 0,
              yesterday: 0,
              clicks: 0,
              sales: 0,
              orders: 0,
              status: 0,
              budget: parseFloat(budgetData[0]?.budget?.performance_budget),
              childTable: [],
            };
          }
        }
      } else if (categorySelected) {
        if (!budgetInfo[item.category_name]) {
          budgetInfo[item.category_name] = {
            spend: parseFloat(item?.spend) || 0,
            yesterday: parseFloat(item?.yesterday_spend) || 0,
            clicks: parseFloat(item?.clicks) || 0,
            sales: parseFloat(item?.sales) || 0,
            orders: parseFloat(item?.orders) || 0,
            status: 0,
            budget: 0,
            childTable: [],
          };
        }

        if (budgetData[0]?.budget) {
          const categoryNames = Object.keys(budgetData[0]?.budget?.category);
          if (categoryNames.includes(item?.category_name)) {
            const value = budgetData[0]?.budget?.category[item.category_name];
            budgetInfo[item.category_name].budget = parseFloat(value);
          }
        }
      }
    });

    if (blinkitData?.length === 0) {
      budgetInfo["Reach"] = {
        spend: 0,
        yesterday: 0,
        clicks: 0,
        sales: 0,
        orders: 0,
        status: 1,
        budget: parseFloat(budgetData[0]?.budget?.reach_budget),
        childTable: [],
      };
      budgetInfo["Performance"] = {
        spend: 0,
        yesterday: 0,
        clicks: 0,
        sales: 0,
        orders: 0,
        status: 1,
        budget: parseFloat(budgetData[0]?.budget?.performance_budget),
        childTable: [],
      };
    }

    // Output the totals
    Object.entries(budgetInfo).forEach(
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

  const instamartRowData = () => {
    let dataSet = [];
    let budgetData = {};

    bodyContent?.length > 0 &&
      bodyContent?.map((item) => {
        let budgetInfo;
        budgetInfo = item?.dataValues;

        //  if (platformSelected) {
        let key = `${item?.account}`;
        const spend = parseFloat(item.spend);
        const prevDaySpend = parseFloat(item.yesterday_spend);
        const clicks = parseFloat(item.clicks);
        const orders = parseFloat(item.orders);
        const sales = parseFloat(item.sales);
        const budget = parseFloat(budgetInfo?.budget?.instamart) || "-";

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
        budgetData[key].status = 0;
        budgetData[key].budget = parseFloat(budget);
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
    const mediaTypeFunctions = {
      Amazon: rowData,
      Zepto: zeptoRowData,
      Blinkit: blinkitRowData,
      Instamart: instamartRowData,
    };

    const selectedFunction = mediaTypeFunctions[mediaType];
    if (selectedFunction) {
      selectedFunction();
    }
  }, [bodyContent, mediaType]);

  const handleExpandRow = (index) => {
    if (expandRow.includes(index)) {
      setExpandRow(expandRow.filter((rowIndex) => rowIndex !== index));
    } else {
      setExpandRow([...expandRow, index]);
    }
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
        <div className="mb-2 mx-4 flex items-center justify-end ">
          {/* <h2 className="text-[20px] font-semibold">Budget Summary</h2> */}
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
          className={"campaignreport__table max-h-[640px] overflow-y-scroll mx-4"}
        >
          <table className="">
            {" "}
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
                {mediaType !== "Instamart" && (
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
                  </th>
                )}
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
                  {mediaType !== "Instamart" ? (
                    <div className="tableHeadBudget px-2 w-full">
                      <p>Orders</p>
                    </div>
                  ) : (
                    <div className="tableHeadBudget px-2 w-full">
                      <p>Cart Addition</p>
                    </div>
                  )}
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
                {mediaType !== "Instamart" && (
                  <>
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
                  </>
                )}
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
                  {mediaType !== "Instamart" ? (
                    <div className="tableHeadBudget px-2 w-full">
                      <p>ROAS</p>
                    </div>
                  ) : (
                    <div className="tableHeadBudget px-2 w-full">
                      <p>ROI</p>
                    </div>
                  )}
                </th>{" "}
                {mediaType !== "Instamart" && (
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
                )}
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
                              {item?.spend?.toLocaleString(
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
                          {mediaType !== "Instamart" && (
                            <td className="pl-2">
                              {item?.clicks ? (
                                <div>
                                  {item?.clicks?.toLocaleString(
                                    currency_format
                                  )}
                                </div>
                              ) : (
                                <div>0</div>
                              )}
                            </td>
                          )}
                          <td className="pl-2">
                            {item?.orders ? (
                              <div>
                                {item?.orders?.toLocaleString(
                                  currency_format
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
                          {mediaType !== "Instamart" && (
                            <>
                              {" "}
                              <td className="pl-2">
                                <div>{cpc(item)}</div>
                              </td>
                              <td className="pl-2">
                                <div>{cvr(item)}</div>
                              </td>
                            </>
                          )}
                          <td className="pl-2">
                            <div>{roas(item)}</div>
                          </td>
                          {mediaType !== "Instamart" && (
                            <td className="pl-2">
                              <div>{cpa(item)}</div>
                            </td>
                          )}
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

export default BudgetPacerTable;
