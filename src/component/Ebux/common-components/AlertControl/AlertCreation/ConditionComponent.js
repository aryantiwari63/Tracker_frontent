
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useEbuxContext } from "../../../Context/EbuxProvider";

const productMetrics = [
  "Out-of-Stocks Days",
  "On-Shelf Availability Percentage",
  "Promotion Percentage",
  "Selling Price",
  "Maximum Retail Price",
  "Product Ratings",
  "Review Count",

  "Content Score",
  "Title Score",
  "Description Score",
  "Bulletin Score",
  "Image Score",
  "A+ Score",
];

const keywordMetrics = [
  "Overall Share of Search",
  "Paid Share of Search",
  "Organic Share of Search",
  "Overall Ranking",
  "Paid Ranking",
  "Organic Ranking",
];

export default function ConditionComponent({ alertControlObj, setAlertControlObj }) {
  const { selectedFiltersWidget } = useEbuxContext();
  console.log('selectedFiltersWidgetselectedFiltersWidget', selectedFiltersWidget?.selectedKeywordCategory)
  let kpi = alertControlObj?.kpi
  const [groups, setGroups] = useState(alertControlObj.conditions);

  useEffect(() => {
    setAlertControlObj(prev => ({ ...prev, conditions: groups }));
  }, [groups, setAlertControlObj]);

  const addAndCondition = (groupIndex) => {
    const updated = [...groups];
    updated[groupIndex].push({ type: "AND", metric: "", operator: "", value: "", continuity: "" });
    setGroups(updated);
  };

  const addOrGroup = () => {
    setGroups([...groups, [{ type: null, metric: "", operator: "", value: "", continuity: "" }]]);
  };

  const removeCondition = (groupIndex, conditionIndex) => {
    const updated = [...groups];
    updated[groupIndex] = updated[groupIndex].filter(
      (_, i) => i !== conditionIndex
    );

    if (updated[groupIndex].length === 0) {
      updated.splice(groupIndex, 1);
    }

    setGroups(updated);
  };

  const updateCondition = (groupIndex, conditionIndex, field, value) => {
    const updated = [...groups];
    updated[groupIndex][conditionIndex][field] = value;
    setGroups(updated);
  };

  const removeGroup = (groupIndex) => {
    if (groups.length > 1) {
      const updated = groups.filter((_, i) => i !== groupIndex);
      setGroups(updated);
    }
  };

  const metrics = ["SOS", "OR"].includes(kpi) ? keywordMetrics : productMetrics;


  const generateSummary = () => {
    const operatorMap = {
      ">": "is greater than",
      "=": "is equal to",
      "<": "is less than",
      ">=": "is between",
      "<=": "isn't between",
    };

    // const timeRangeMap = {
    //   "1": "Yesterday",
    //   "2": "the last 2 days",
    //   "3": "the last 3 days",
    //   "7": "the last 7 days",
    //   "14": "the last 14 days",
    //   "28": "the last 28 days",
    //   "30": "the last 30 days",
    //   "60": "the last 60 days",
    //   "Maximum": "the maximum period",
    // };

    // const timeRange = alertControlObj?.time_range || "1";
    // const timeRangeText = timeRange === "1" ? "Yesterday" : `over ${timeRangeMap[timeRange] || "Yesterday"}`;

    const groupSummaries = groups.map(group => {
      const condSummaries = group.map(c => {
        if (!c.metric || !c.operator || c.value === "") return null;
        const valueStr = String(c.value || "");
        if ((c.operator === ">=" || c.operator === "<=") && (!valueStr.includes(",") || valueStr.split(',')[1] === "")) return null;
        const op = operatorMap[c.operator] || c.operator;
        let summary = `${c.metric} ${op} ${valueStr}`;
        if (c.operator === ">=" || c.operator === "<=") {
          const vals = valueStr.split(',');
          summary = `${c.metric} ${op} ${vals[0] || ""} and ${vals[1] || ""}`;
        }
        if (c.metric === "Out-of-Stocks Days" && c.continuity) {
          summary += ` with ${c.continuity} continuity`;
        }
        return summary;
      }).filter(Boolean);

      return condSummaries.length > 0 ? condSummaries.join(" AND ") : null;
    }).filter(Boolean);

    if (groupSummaries.length === 0) {
      return "Define conditions to see the alert summary here.";
    }

    return `You will receive alerts when ${groupSummaries.join(". OR ")}.`;
  };


  return (
    <div className="w-full bg-white  rounded-lg flex flex-col gap-5">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-[24px] font-semibold text-[#0F172A]">
            Set alert conditions
          </h2>
          <p className="text-base text-[#64748B]">
            Define the thresholds that will trigger your alerts
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <p className="text-base text-[#374151]">Time Range :</p>
          <select value={alertControlObj?.time_range || "1"} onChange={(e) => setAlertControlObj(prev => ({ ...prev, time_range: e.target.value }))} className="border border-gray-300 rounded-md px-3 py-2 text-sm">
            <option value="1">Yesterday</option>
            <option value="2">Last 2 days</option>
            <option value="3">Last 3 days</option>
            <option value="7">Last 7 days</option>
            <option value="14">Last 14 days</option>
            <option value="28">Last 28 days</option>
            <option value="30">Last 30 days</option>
            <option value="60">Last 60 days</option>
            <option value="Maximum">Maximum</option>
          </select>
        </div>
      </div>

      {groups.map((conditions, groupIndex) => (
        <div key={groupIndex} className="relative">
          {/* OR with lines */}
          {groupIndex !== 0 && (
            <div className="flex items-center justify-center my-3 gap-2">
              <div className="flex-1 h-[1px] bg-[#B8BABB]" />
              <div className="bg-white border border-[#0081F7] text-[#0081F7] text-xs px-2 py-1 rounded-[4px] font-medium">
                OR
              </div>
              <div className="flex-1 h-[1px] bg-[#B8BABB]" />
            </div>
          )}

          <div className="bg-[#0081F70F] border-l-[2px] border-[#0081F7] shadow-[0px_2px_6px_0px_#0000000A] rounded-[16px] p-4 space-y-6 relative">
            {groups.length > 1 && (
              <button
                onClick={() => removeGroup(groupIndex)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors z-10"
                title="Remove group"
              >
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            )}
            {conditions.map((condition, index) => (
              <div key={index} className="relative">
                {/* AND with lines */}
                {index !== 0 && (
                  <div className="flex items-center justify-center my-3 gap-2">
                    <div className="flex-1 h-[1px] bg-[#B8BABB]" />
                    <div className="bg-white border border-[#0081F7] text-[#0081F7] font-medium text-xs px-2 py-1 rounded-[4px]">
                      {condition.type}
                    </div>
                    <div className="flex-1 h-[1px] bg-[#B8BABB]" />
                  </div>
                )}

                <div className={`grid ${condition.metric === "Out-of-Stocks Days" ? "grid-cols-[1fr_1fr_1fr_1fr_auto]" : "grid-cols-[1fr_1fr_1fr_auto]"} gap-3 items-center`}>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-[#000000D9] font-medium">Metric <span className="text-red-500">*</span></label>
                    <select
                      value={condition.metric}
                      onChange={(e) => updateCondition(groupIndex, index, "metric", e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-[#000000BF]"
                    >
                      <option value="">Select a metric</option>
                      {metrics.map(m => {
                        // const isSelectedInOtherAnd = conditions.some((c, i) => i !== index && c.metric === m);
                        return (
                          <option key={m} value={m}
                          //  disabled={isSelectedInOtherAnd}
                          >
                            {m}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* <div className={condition.metric === "Out-of-Stocks Days" ? "invisible" : ""}> */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-[#000000D9] font-medium">Operator <span className="text-red-500">*</span></label>
                    <select
                      value={condition.operator}
                      onChange={(e) => {
                        const newOp = e.target.value;
                        const updated = [...groups];
                        updated[groupIndex][index].operator = newOp;
                        if (![">=", "<="].includes(newOp)) {
                          updated[groupIndex][index].value = String(updated[groupIndex][index].value || "").split(",")[0];
                        }
                        setGroups(updated);
                      }}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-[#000000BF]"
                    >
                      <option value="">Select operator</option>
                      <option value=">">Greater than (&gt;)</option>
                      <option value="=">Equal to</option>
                      <option value="<">Less than</option>
                      <option value=">=">is between</option>
                      <option value="<=">isn&apos;t between</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">


                    {condition.operator === ">=" || condition.operator === "<=" ? (
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col gap-1 flex-1">
                          <span className="text-sm text-[#000000D9] font-medium">Lower Value</span>
                          <input
                            type="number"
                            placeholder="0"
                            value={String(condition.value || "").split(',')[0] || ""}
                            onChange={(e) => {
                              const currentVals = String(condition.value || "").split(',');
                              updateCondition(groupIndex, index, "value", `${e.target.value},${currentVals[1] || ""}`);
                            }}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm placeholder:text-[#000000BF]"
                          />
                        </div>
                        <span className="text-sm text-[#000000D9] pt-4">to</span>
                        <div className="flex flex-col gap-1 flex-1">
                          <span className="text-sm text-[#000000D9] font-medium">Upper Value</span>
                          <input
                            type="number"
                            placeholder="0"
                            value={String(condition.value || "").split(',')[1] || ""}
                            onChange={(e) => {
                              const currentVals = String(condition.value || "").split(',');
                              updateCondition(groupIndex, index, "value", `${currentVals[0] || ""},${e.target.value}`);
                            }}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm placeholder:text-[#000000BF]"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <label className="text-sm text-[#000000D9] font-medium">Value <span className="text-red-500">*</span></label>
                        <input
                          type="number"
                          placeholder="Enter a value"
                          value={String(condition.value || "").split(',')[0] || ""}
                          onChange={(e) => updateCondition(groupIndex, index, "value", e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm placeholder:text-[#000000BF]"
                        />
                      </>
                    )}
                  </div>

                  {condition.metric === "Out-of-Stocks Days" && (
                    <div className="flex flex-col gap-1">
                      <label className="text-sm text-[#000000D9] font-medium">Continuity <span className="text-red-500">*</span></label>
                      <select
                        value={condition.continuity}
                        onChange={(e) => updateCondition(groupIndex, index, "continuity", e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-[#000000BF]"
                      >
                        <option value="">Select Type</option>
                        <option value="cumulative">Cumulative</option>
                        <option value="consecutive">Consecutive</option>
                      </select>
                    </div>
                  )}


                  <div className="col-span-1 flex gap-2 pt-5 justify-end">
                    <button
                      onClick={() => addAndCondition(groupIndex)}
                      className={`bg-[#1890FF] text-white w-[50px] h-[38px] rounded-md flex items-center justify-center ${index === conditions.length - 1 ? "" : "invisible"
                        }`}
                    >
                      <FontAwesomeIcon icon={faPlus} className="text-white text-[16px]" />
                    </button>

                    <button
                      onClick={() => removeCondition(groupIndex, index)}
                      className={`border border-[#D9D9D9] bg-[#FFFFFF] w-[50px] h-[38px] rounded-md flex items-center justify-center ${index !== 0 ? "" : "invisible"
                        }`}
                    >
                      <FontAwesomeIcon icon={faTrashCan} className="text-red-500 text-[18px]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        className="self-start text-sm text-[#0081F7] font-medium"
        onClick={addOrGroup}
      >
        + Add Another Condition
      </button>

      <div className="bg-[#0081F70F] border border-[#D6E4FF] rounded-lg p-4 flex gap-3">
        <div className="text-blue-600">ℹ️</div>
        <div>
          <p className="text-sm font-medium text-blue-600">
            Natural Language Summary
          </p>
          <p className="text-sm text-gray-700">
            {generateSummary()}
          </p>
        </div>
      </div>
    </div>
  );
}