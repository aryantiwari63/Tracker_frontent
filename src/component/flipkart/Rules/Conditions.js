import { useState, useEffect } from "react";
import OutputConditionBlock from "./OuterConditionBlock";
import { GoPlus } from "react-icons/go";

const Conditions = ({ conditionsApplied }) => {
  const conditionCategories = [
    {
      label: "Views",
      value: "views",
    },
    {
      label: "Clicks",
      value: "clicks",
    },
    {
      label: "Spend",
      value: "spend",
    },
    {
      label: "CTR",
      value: "ctr",
    },
    {
      label: "CPC",
      value: "cpc",
    },
    {
      label: "Total Units Sold",
      value: "total_units_sold",
    },
    {
      label: "Direct Units Sold",
      value: "direct_units_sold",
    },
    {
      label: "Total Revenue",
      value: "total_revenue",
    },
    {
      label: "Direct Revenue",
      value: "direct_revenue",
    },
    {
      label: "Total CVR",
      value: "total_cvr",
    },
    {
      label: "Direct CVR",
      value: "direct_cvr",
    },
    {
      label: "Total ROI",
      value: "total_roi",
    },
    {
      label: "Direct ROI",
      value: "direct_roi",
    },
    {
      label: "Total AOV",
      value: "total_aov",
    },
    {
      label: "Direct AOV",
      value: "direct_aov",
    },
  ];
  const conditions = [
    {
      label: "is greater than",
      value: "greater_than",
    },
    {
      label: "is less than",
      value: "smaller_than",
    },
    {
      label: "is between",
      value: "range",
    },
    {
      label: "isn’t between",
      value: "is_not_in_range",
    },
  ];
  const [conditionValues, setConditionValues] = useState({
    less: "",
    conditionCategory: "views",
    greater: "",
    conditionType: "greater_than",
    id: "",
  });

  const [totalConditions, setTotalConditions] = useState([]);
  const [emptyConditionFlag, setEmptyConditionFlag] = useState(false);

  useEffect(() => {
    conditionsApplied(totalConditions);
  }, [totalConditions]);

  const gettingConditionData = (e) => {
    const { name, value } = e.target;
    setConditionValues((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  useEffect(() => {
    if (conditionValues.less == "" && conditionValues.greater == "") {
      setEmptyConditionFlag(true);
    } else {
      setEmptyConditionFlag(false);
    }
  }, [conditionValues]);

  const handleAddCondition = () => {
    if (!emptyConditionFlag) {
      setTotalConditions((prevConditions) => [
        ...prevConditions,
        conditionValues,
      ]);
      setConditionValues({
        less: "",
        conditionCategory: "views",
        greater: "",
        conditionType: "greater_than",
        id: "",
      });
    }
  };

  return (
    <>
      {totalConditions.length ? (
        <div className="">
          <OutputConditionBlock
            totalConditions={totalConditions}
            setTotalConditions={setTotalConditions}
          />
        </div>
      ) : (
        <div className="flex w-3/4">
          {/* conditions category */}
          <div className=" pr-4 ">
            <select
              className="border border-gray-300 text-black h-[32px] outline-none rounded"
              name="conditionCategory"
              onChange={(e) => gettingConditionData(e)}
            >
              {conditionCategories.map((v) => {
                return (
                  <>
                    <option className="text-black text-xs px-2" value={v.value}>
                      {v.label}
                    </option>
                  </>
                );
              })}
            </select>
          </div>
          <div className="pr-4">
            <select
              className="  border border-gray-300 text-black h-[32px] outline-none rounded"
              name="conditionType"
              onChange={(e) => gettingConditionData(e)}
            >
              {conditions.map((v) => {
                return (
                  <>
                    <option className="text-black text-xs px-2" value={v.value}>
                      {v.label}
                    </option>
                  </>
                );
              })}
            </select>
          </div>

          {conditionValues.conditionType.includes("than") ? (
            conditionValues.conditionType.includes("greater") ? (
              <div className="  ">
                <input
                  type="number"
                  className="border border-gray-300 text-black h-[32px] outline-none px-1 rounded"
                  name="greater"
                  min={0}
                  onChange={(e) => gettingConditionData(e)}
                  onKeyPress={(e) => {
                    if (e.key === "e" || e.key === "E") {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
            ) : (
              <div className=" ">
                <input
                  type="number"
                  className="border border-gray-300 text-black h-[32px] outline-none px-1 rounded"
                  name="less"
                  min={0}
                  onChange={(e) => gettingConditionData(e)}
                  onKeyPress={(e) => {
                    if (e.key === "e" || e.key === "E") {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
            )
          ) : (
            <>
              <div className="  pr-2">
                <input
                  type="number"
                  className="border border-gray-300 px-1 h-[32px] outline-none text-black  rounded"
                  name="less"
                  min={0}
                  onChange={(e) => gettingConditionData(e)}
                  onKeyPress={(e) => {
                    if (e.key === "e" || e.key === "E") {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              <div className=" ">
                <input
                  required
                  type="number"
                  className="border border-gray-300 text-black h-[32px] outline-none px-1 rounded"
                  name="greater"
                  min={0}
                  onChange={(e) => gettingConditionData(e)}
                  onKeyPress={(e) => {
                    if (e.key === "e" || e.key === "E") {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
            </>
          )}
          <div className="pl-2">
            {/* <button
              className="condition__plus-btn "
              onClick={() => {
                setTotalConditions([...totalConditions, conditionValues]);
                setConditionValues((prev) => {
                  return {
                    ...prev,
                    greater: "",
                    less: "",
                  };
                });
              }}
            >
              <div className="text-white text-base">+</div>"
            </button> */}
            <button
              className={
                emptyConditionFlag === true
                  ? "condition__plus-btn cursor-not-allowed bg-slate-500 h-[32px]"
                  : "condition__plus-btn h-[32px]"
              }
              onClick={handleAddCondition}
              disabled={emptyConditionFlag === true ? true : false}
            >
              <h1 className="text-white text-base" ><GoPlus /></h1>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Conditions;
