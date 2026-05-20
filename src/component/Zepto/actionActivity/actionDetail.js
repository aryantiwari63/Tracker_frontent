import React from "react";

const ActionDetail = ({ data }) => {
  let columnNames = ["Action Type", "Campaign Name"];
  let dataVal = [data?.action_type, data.campaign_name];
  switch (data?.action_type) {
    case "product":
      columnNames.push("Product");
      dataVal.push(data.products);
      break;
    case "category":
      columnNames.push("Category");
      dataVal.push(data.category_name);
      break;
    case "keyword":
      columnNames.push("Keyword");
      dataVal.push(data.keywords);
      break;
  }
  columnNames.push("Message");
  if (data.status== "true") {
    dataVal.push(data.action_message);
  } else {
    dataVal.push(data["rpa_action_results.message"]);
  }

  return (
    <>
      <div className="max-h-[400px] max-w-[1200px] p-4 overflow-auto">
        <table className="min-w-full border-collapse border border-gray-300 ">
          <thead>
            <tr className="bg-gray-200">
              {columnNames.map((col, index) => (
                <th
                  key={index}
                  className="border-b px-4 py-2 text-left" // Added text-left for left alignment
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className={"bg-gray-50"}>
              {dataVal.map((cellData, cellIndex) => (
                <td key={cellIndex} className="border-b  py-2 !px-1">
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
