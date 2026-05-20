import { object } from "prop-types";
import { useState, useEffect } from "react";
import "./style.css";
const BudgetPacerHistory = ({ historyData, mediaType }) => {
  const [tableData, setTableData] = useState([]);

  const convertDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const formattedDate = date.toLocaleString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });

    return formattedDate;
  };

  const currency = localStorage.getItem("currency");
  const currency_format = localStorage.getItem("currency_format");
  let decimalFormat = { minimumFractionDigits: 2, maximumFractionDigits: 2 };

  const handleAmsTableData = () => {
    let history = [];

    let date;
    historyData?.length > 0 &&
      historyData?.map((item, i) => {
        if (item?.previous_data) {
          const previousData = item?.previous_data;

          for (const key in previousData) {
            let value_to = {};
            if (
              object.hasOwnProperty.call(previousData, key) &&
              Object.prototype.hasOwnProperty.call(item.budget, key)
            ) {
              value_to[key] = item.budget[key];
            }
            if (Object.hasOwnProperty.call(previousData, key)) {
              const value = previousData[key];
              let change_on;
              switch (key) {
                case "sp_budget":
                  change_on = "SP";
                  break;
                case "sb_budget":
                  change_on = "SB";
                  break;
                case "sd_budget":
                  change_on = "SD";
                  break;
                case "amazon":
                  change_on = "Amazon";
                  break;

                default:
                  change_on = null;
              }

              date = convertDateTime(item?.createdAt);
              history.push({
                change_on: change_on,
                value_from: value !== null ? value : 0,
                username: item?.username,
                brand: item?.brand,
                date: date,
                month: item?.month,
                value_to: Object.values(value_to)[0],
                index: i,
              });
            }
          }
        } else {
          if (item?.budget) {
            let budgetData = item?.budget;
            for (const key in budgetData) {
              if (Object.hasOwnProperty.call(budgetData, key)) {
                const value = budgetData[key];
                let change_on;
                switch (key) {
                  case "sp_budget":
                    change_on = "SP";
                    break;
                  case "sb_budget":
                    change_on = "SB";
                    break;
                  case "sd_budget":
                    change_on = "SD";
                    break;
                  case "amazon":
                    change_on = "Amazon";
                    break;

                  default:
                    change_on = null;
                }

                date = convertDateTime(item?.createdAt);
                history.push({
                  change_on: change_on,
                  value_from: 0,
                  username: item?.username,
                  brand: item?.brand,
                  date: date,
                  month: item?.month,
                  value_to: value,
                  index: i,
                });
              }
            }
          }
        }
        return null;
      });
    setTableData(history);
  };

  const handleZeptoTableData = () => {
    let history = [];

    let date;

    historyData?.length > 0 &&
      historyData?.map((item, i) => {
        if (item?.previous_data) {
          const previousData = item?.previous_data;

          for (const key in previousData) {
            let value_to = {};
            if (
              object.hasOwnProperty.call(previousData, key) &&
              Object.prototype.hasOwnProperty.call(item.budget, key)
            ) {
              value_to[key] = item.budget[key];
            }
            if (Object.hasOwnProperty.call(previousData, key)) {
              const value = previousData[key];
              let change_on;
              switch (key) {
                case "awareness_budget":
                  change_on = "Awareness";
                  break;
                case "performance_budget":
                  change_on = "Performance";
                  break;

                case "zepto":
                  change_on = "Zepto";
                  break;

                default:
                  change_on = null;
              }

              date = convertDateTime(item?.createdAt);
              history.push({
                change_on: change_on,
                value_from: value !== null ? value : 0,
                username: item?.username,
                brand: item?.brand,
                date: date,
                month: item?.month,
                value_to: Object.values(value_to)[0],
                index: i,
              });
            }
          }
        } else {
          if (item?.budget) {
            let budgetData = item?.budget;
            for (const key in budgetData) {
              if (Object.hasOwnProperty.call(budgetData, key)) {
                const value = budgetData[key];
                let change_on;
                switch (key) {
                  case "awareness_budget":
                    change_on = "Awareness";
                    break;
                  case "performance_budget":
                    change_on = "Performance";
                    break;

                  case "zepto":
                    change_on = "Zepto";
                    break;

                  default:
                    change_on = null;
                }

                date = convertDateTime(item?.createdAt);
                history.push({
                  change_on: change_on,
                  value_from: 0,
                  username: item?.username,
                  brand: item?.brand,
                  date: date,
                  month: item?.month,
                  value_to: value,
                  index: i,
                });
              }
            }
          }
        }
        return null;
      });
    setTableData(history);
  };

  const formatWord = (phrase) => {
    const formattedWord = phrase
      ?.replace(/_?budget/gi, "")
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return formattedWord;
  };

  const handleBlinkitTableData = () => {
    let history = [];

    historyData?.forEach((item, i) => {
      // Iterate over each item in historyData array
      if (item.previous_data) {
        // Check if item has previous_data
        const previousData = item.previous_data; // Get previous_data object

        // Iterate over key-value pairs in previousData
        Object.entries(previousData).forEach(([key, change_from]) => {
          if (item.budget && item.budget[key]) {
            // Check if item has budget and budget has key
            const value_to = item.budget[key]; // Get value_to from budget
            const change_on = formatWord(key);

            // Check if value_to is an object
            if (typeof value_to === "object") {
              // Iterate over key-value pairs in value_to object
              Object.entries(value_to).forEach(([subKey, value]) => {
                const change_on_sub = `${change_on} - ${subKey}`;
                // Push history object to history array
                history.push(
                  createHistoryObject(
                    item,
                    i,
                    change_on_sub,
                    change_from,
                    value
                  )
                );
              });
            } else {
              // If value_to is not an object
              // Push history object to history array
              history.push(
                createHistoryObject(item, i, change_on, change_from, value_to)
              );
            }
          } else {
            // If item does not have budget key or value
            if (typeof change_from === "object") {
              // Check if change_from is an object
              // Iterate over key-value pairs in change_from object
              Object.entries(change_from).forEach(([subKey, value]) => {
                const change_on_sub = `${formatWord(key)} - ${subKey}`;

                history.push(
                  createHistoryObject(item, i, change_on_sub, value, 0)
                );
              });
            } else {
              // If change_from is not an object
              const change_on = formatWord(key);
              // Push history object to history array with value set to 0
              history.push(
                createHistoryObject(item, i, change_on, change_from || 0, 0)
              );
            }
          }
        });
      } else {
        // If item does not have previous_data
        if (item.budget) {
          // Check if item has budget
          // Iterate over key-value pairs in budget object
          Object.entries(item.budget).forEach(([key, value_to]) => {
            // Check if value_to is an object
            if (typeof value_to === "object") {
              // Iterate over key-value pairs in value_to object
              Object.entries(value_to).forEach(([subKey, value]) => {
                const change_on_sub = `${formatWord(key)} - ${subKey}`;
                // Push history object to history array
                history.push(
                  createHistoryObject(item, i, change_on_sub, 0, value)
                );
              });
            } else {
              // If value_to is not an object
              const change_on = formatWord(key);
              // Push history object to history array
              history.push(
                createHistoryObject(item, i, change_on, 0, value_to)
              );
            }
          });
        }
      }
    });

    setTableData(history);
  };

  const handleInstamartTableData = () => {
    let history = [];

    let date;

    historyData?.length > 0 &&
      historyData?.map((item, i) => {
        if (item?.previous_data) {
          const previousData = item?.previous_data;

          for (const key in previousData) {
            let value_to = {};
            if (
              object.hasOwnProperty.call(previousData, key) &&
              Object.prototype.hasOwnProperty.call(item.budget, key)
            ) {
              value_to[key] = item.budget[key];
            }
            if (Object.hasOwnProperty.call(previousData, key)) {
              const value = previousData[key];
              let change_on = "Instamart";

              date = convertDateTime(item?.createdAt);
              history.push({
                change_on: change_on,
                value_from: value !== null ? value : 0,
                username: item?.username,
                brand: item?.brand,
                date: date,
                month: item?.month,
                value_to: Object.values(value_to)[0],
                index: i,
              });
            }
          }
        } else {
          if (item?.budget) {
            let budgetData = item?.budget;
            for (const key in budgetData) {
              if (Object.hasOwnProperty.call(budgetData, key)) {
                const value = budgetData[key];
                let change_on = "Instamart";

                date = convertDateTime(item?.createdAt);
                history.push({
                  change_on: change_on,
                  value_from: 0,
                  username: item?.username,
                  brand: item?.brand,
                  date: date,
                  month: item?.month,
                  value_to: value,
                  index: i,
                });
              }
            }
          }
        }
        return null;
      });
    setTableData(history);
  };

  const createHistoryObject = (item, i, change_on, change_from, value_to) => ({
    brand: "-",
    change_on: formatWord(change_on),
    value_from: change_from || 0, // Previous value
    username: item?.username,
    date: convertDateTime(item?.createdAt),
    month: item?.month,
    value_to: value_to || 0, // New value
    index: i,
  });

  useEffect(() => {
    if (mediaType === "Amazon") {
      handleAmsTableData();
    } else if (mediaType === "Zepto") {
      handleZeptoTableData();
    } else if (mediaType == "Blinkit") {
      handleBlinkitTableData();
    } else if (mediaType == "Instamart") {
      handleInstamartTableData();
    }
  }, [historyData]);
  return (
    <>
      <div className="bg-white w-full">
        <div
          className={"campaignreport__table max-h-[530px] overflow-y-scroll mx-4"}
        >
          <table className="w-full">
            <thead className="campaignreport__tableHeadBudget  table-fixed sticky top-0 left-0 z-[35] bg-[#F3F4F6]">
              <tr className="h-[54px]">
                <th className="tableHeadBudgetBudget--sticky ">
                  <div className="tableHeadBudget px-2 w-full">
                    <p>Date / Time</p>
                  </div>
                </th>
                <th className="tableHeadBudgetBudget--sticky ">
                  <div
                    className="tableHeadBudget px-2 w-full"
                    style={{ minWidth: "200px" }}
                  >
                    <p>For Month</p>
                  </div>
                </th>
                <th className="tableHeadBudgetBudget--sticky">
                  <div
                    className="tableHeadBudget px-2 w-full bold"
                    style={{
                      // left: "5px",
                      minWidth: "200px",
                      position: "sticky",
                      top: 0,
                      zIndex: 3,

                      // height: "45px",
                    }}
                  >
                    <p>User</p>
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
                    <p>Brand</p>
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
                  <div
                    className="tableHeadBudget px-2 w-full"
                    style={{ minWidth: "250px" }}
                  >
                    <p>Change on</p>
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
                    <p>From</p>
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
                    <p>To</p>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {tableData.length > 0 ? (
                tableData.map((item) => (
                  <>
                    {/* <tr className="h-11 budgetpacer--tablecontent m-4 ">
                     */}
                    <tr
                      className={`${
                        item.index % 2 == 0
                          ? "budgetpacercommon--tablecontent--even"
                          : "budgetpacercommon--tablecontent--odd"
                      } h-12 m-4`}
                    >
                      <td className="p-2 tableHeadBudgetBudget--sticky">
                        {item?.date}
                      </td>
                      <td className="p-2 tableHeadBudgetBudget--sticky">
                        {item?.month}
                      </td>
                      <td className="p-2 tableHeadBudgetBudget--sticky">
                        {item?.username}
                      </td>
                      <td className="p-2 tableHeadBudgetBudget--sticky">
                        {item?.brand}
                      </td>
                      <td className="p-2 tableHeadBudgetBudget--sticky">
                        {item?.change_on}
                      </td>
                      <td className="p-2 tableHeadBudgetBudget--sticky">
                        {currency}
                        {parseFloat(item?.value_from).toLocaleString(
                          currency_format,
                          decimalFormat
                        )}
                      </td>

                      <td className="p-2 tableHeadBudgetBudget--sticky">
                        {item?.value_to !== undefined ? (
                          <>
                            {currency}
                            {parseFloat(item?.value_to).toLocaleString(
                              currency_format,
                              decimalFormat
                            )}
                          </>
                        ) : (
                          <>{currency}0</>
                        )}
                      </td>
                    </tr>
                  </>
                ))
              ) : (
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
          </table>
        </div>
      </div>
    </>
  );
};

export default BudgetPacerHistory;
