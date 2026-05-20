import React from "react";

const ActionDetail = ({ data }) => {
  let columnNames = ["Action Type", "Campaign Name"];
  let dataVal = [data?.action_type, data.campaign_name];
  switch (data?.action_type) {
    case "adgroup":
      columnNames.push("Adgroup");
      dataVal.push(data.ad_group_name);
      break;
    case "asin":
      columnNames.push("Adgroup", "ASIN");
      dataVal.push(data.ad_group_name, data.fsn_id);
      break;
    case "keyword":
      columnNames.push("Adgroup", "Keyword");
      dataVal.push(data.ad_group_name, data.keywords);
      break;
    case "portfolio":
      columnNames.pop();
      columnNames.push("Portfolio");
      dataVal.pop();
      dataVal.push(data.portfolio_name);
  }
  columnNames.push("Message");
  if (data["rpa_action_results.status"] == "true") {
    dataVal.push(data.action_message);
  } else {
    dataVal.push(data["rpa_action_results.message"]);
  }

  return (
    <>
      <div className="max-h-[400px] max-w-[1200px] p-4 overflow-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-left">
              {columnNames.map((col, index) => (
                <th key={index} className="border-b px-4 py-2">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className={"bg-gray-50"}>
              {dataVal.map((cellData, cellIndex) => (
                <td key={cellIndex} className="border-b  py-2 !px-1">
                  {" "}
                  {cellData}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ActionDetail;
