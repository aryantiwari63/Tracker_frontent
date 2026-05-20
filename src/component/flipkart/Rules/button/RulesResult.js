import React, { useState, useEffect } from "react";
import { _POST } from "../../../../services/axios.method";
import { GET_RULES_RPARESULT } from "../../../../utils/constants";
import "./style.css";
import LoaderSpinner from "../../../common-components/loader-spinner";
import { CSVLink } from "react-csv";

const RulesResult = ({ rowData }) => {
  const [resultData, setresultData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exportData, setExportData] = useState([]);
  const [exportFlag, setExportFlag] = useState(false);
  const rpaData = async (shouldExport) => {
    try {
      setLoading(true);
      const result = await _POST(`${GET_RULES_RPARESULT}/${rowData}`, {
        export_data: shouldExport,
      });
      setLoading(false);
      if (shouldExport) {
        setExportData(result?.data?.data?.ruleExportData);
      } else {
        setresultData(result.data.data.result);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    rpaData(false);
  }, []);

  useEffect(() => {
    rpaData(true);
  }, [exportFlag]);
  // useEffect(() => {
  //   let shouldExport = exportFlag;
  //   if (!shouldExport) {
  //     setLoading(true);
  //     rpaData(false);
  //   } else {
  //     rpaData(true);
  //   }
  // }, [exportFlag]);

  const formatDateTime = (dateTime) => {
    const [datePart, timePart] = dateTime.split(",");
    const formattedDate = datePart?.trim();
    const formattedTime = timePart?.trim();
    return { formattedDate, formattedTime };
  };

  const flattenedData = resultData?.flatMap((data) => data.result_data);

  const exportRuleData = exportData?.flatMap((item) =>
    item.result_data.map((data) => ({
      campaign_name: data.name,
      campaign_type: data.segment,
      triggered_on: data.triggererd_on,
      result: data.result,
    }))
  );

  return (
    <div
      className={`${
        flattenedData?.length === 0 ? "h-[70px] border-b" : "max-h-[400px]"
      } relative max-w-[1200px] overflow-y-auto`}
    >
      <table className="table-container">
        {/* Your table headers */}
        <thead>
          <tr className="text-left">
            <th>Date</th>
            <th>Time</th>
            <th className="sticky top-0">Triggered on</th>
            <th className="sticky top-0">Result</th>
          </tr>
        </thead>
        {loading ? (
          <tbody>
            <tr>
              <td colSpan="4">
                <LoaderSpinner />
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody className="">
            {flattenedData && flattenedData.length > 0 ? (
              flattenedData.map((item, index) => (
                <tr key={index} className="text-left">
                  <td style={{ minWidth: "100px" }}>
                    {formatDateTime(item.triggererd_on).formattedDate}
                  </td>
                  <td className="">
                    {formatDateTime(item.triggererd_on).formattedTime}
                  </td>
                  <td className="">{item.name}</td>
                  <td>{item.result}</td>
                </tr>
              ))
            ) : (
              <tr>
                <div className="p-2 !border-b-0 absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  {" "}
                  No Records Found
                </div>
              </tr>
            )}
          </tbody>
        )}
      </table>
      {flattenedData.length > 0 && (
        <div className="text-center mt-4" onClick={() => setExportFlag(true)}>
          <CSVLink
            data={exportRuleData}
            // data={data}
            filename={`rule_${rowData}.csv`}
            className=" text-gray-500 px-4 py-2 roshadow-md cursor-pointer hover:text-blue-600 transition duration-300"
          >
            Export to download all records
          </CSVLink>
        </div>
      )}
    </div>
  );
};

export default RulesResult;
