import { useState, useEffect } from "react";
import OutputConditionBlock from "./OuterConditionBlock";
import { GoPlus } from "react-icons/go";
import CustomSelectNew from "../../common-components/CustomSelectNew";

const Conditions = ({ conditionsApplied }) => {
  const conditionCategories = [
    {
      label: "Impressions",
      value: "impressions",
    },
    {
      label: "GMV",
      value: "gmv",
    },
    {
      label: "ROI",
      value: "roi",
    },
    {
      label: "Spend",
      value: "spend",
    },
    {
      label: "CPC",
      value: "cpc",
    },
    {
      label: "Cart Addition",
      value: "add2cart",
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
    conditionCategory: "impressions",
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

  const gettingConditionCategory = (eventValue) => {
    setConditionValues((prev) => {
      return {
        ...prev,
        conditionCategory: eventValue,
      };
    });
  };

  const gettingConditioExpression = (eventValue) => {
    setConditionValues((prev) => {
      return {
        ...prev,
        conditionType: eventValue,
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
        conditionCategory: "impressions",
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
          <div className=" pr-4 w-[150px]">
            {/* <select
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
            </select> */}
            <CustomSelectNew
              label={"Select"}
              options={conditionCategories}
              value={conditionValues?.conditionCategory}
              onChange={gettingConditionCategory}
              platform={"instamart"}
              className="border-gray-300 px-2"
            />
          </div>
          <div className="pr-4 w-[150px]">
            {/* <select
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
            </select> */}
            <CustomSelectNew
              label={"Select Time"}
              options={conditions}
              value={conditionValues?.conditionType}
              onChange={gettingConditioExpression}
              platform={"instamart"}
              className="border-gray-300 px-2"
            />
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
                  ? "instamart_btn condition__plus-btn instamart_btn cursor-not-allowed bg-slate-500 h-[32px] "
                  : "instamart_btn condition__plus-btn instamart_btn h-[32px]"
              }
              onClick={handleAddCondition}
              disabled={emptyConditionFlag === true ? true : false}
            >
              <h1 className="text-white text-base">
                <GoPlus />
              </h1>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Conditions;
