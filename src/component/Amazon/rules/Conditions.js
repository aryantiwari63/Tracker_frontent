import { useState, useEffect } from "react";
import OutputConditionBlock from "./OuterConditionBlock";

const Conditions = ({ conditionsApplied, entity }) => {
 
  const conditionCategories = [

    {
      label: "Impressions",
      value: "impressions",
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
      label: "Sales",
      value: "sales",
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
      label: "ACOS",
      value: "acos",
    },
    {
      label: "ROAS",
      value: "roas",
    },

    {
      label: "NTB orders",
      value: "ntb_orders",
    },
    {
      label: "% of orders NTB",
      value: "ntb_orders_perc",
    },
    {
      label: "NTB sales",
      value: "ntb_sales",
    },
    {
      label: "% of sales",
      value: "ntb_sales_perc",
    }

  ];
  const conditionAdCategories = [

    {
      label: "Impressions",
      value: "impressions",
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
      label: "Sales",
      value: "sales",
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
      label: "ACOS",
      value: "acos",
    },
    {
      label: "ROAS",
      value: "roas",
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
            entity={entity}
          />
        </div>
      ) : (
        <div className="flex items-center gap-2 ">
          {/* conditions category */}
          <div className="">
            <select
              className="form-control text-black "
              name="conditionCategory"
              onChange={(e) => gettingConditionData(e)}
            >
              {entity == "Campaign" && conditionCategories.map((v) => {
                return (
                  <>
                    <option className="text-black" value={v.value}>
                      {v.label}
                    </option>
                  </>
                );
              })}
                 {entity !== "Campaign" && conditionAdCategories.map((v) => {
                return (
                  <>
                    <option className="text-black" value={v.value}>
                      {v.label}
                    </option>
                  </>
                );
              })}
              
            </select>
          </div>
          <div>
            <select
              className="form-control  col_6 px-10 text-black"
              name="conditionType"
              onChange={(e) => gettingConditionData(e)}
            >
              {conditions.map((v) => {
                return (
                  <>
                    <option className="text-black" value={v.value}>
                      {v.label}
                    </option>
                  </>
                );
              })}
            </select>
          </div>

          {conditionValues.conditionType.includes("than") ? (
            conditionValues.conditionType.includes("greater") ? (
              <div className="col_3 ">
                <input
                  type="number"
                  className="form-control text-black "
                  name="greater"
                  onChange={(e) => gettingConditionData(e)}
                  onKeyPress={(e) => {
                    if (e.key === "e" || e.key === "E") {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
            ) : (
              <div className="pl-3 pr-3 col_3">
                <input
                  type="number"
                  className="form-control text-black"
                  name="less"
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
              <div className="col_2 pl-2 pr-1 ">
                <input
                  type="number"
                  className="form-control  "
                  name="less"
                  onChange={(e) => gettingConditionData(e)}
                  onKeyPress={(e) => {
                    if (e.key === "e" || e.key === "E") {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              <div className="col_2  pl-1 pr-2">
                <input
                  required
                  type="number"
                  className="form-control"
                  name="greater"
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
          <div>
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
                  ? "condition__plus-btn ams_btn cursor-not-allowed bg-slate-500 !px-4 !py-2"
                  : "condition__plus-btn ams_btn px-2"
              }
              onClick={handleAddCondition}
              disabled={emptyConditionFlag === true ? true : false}
            >
              <div className="text-white text-base">+</div>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Conditions;
