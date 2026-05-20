import { useState, useEffect } from "react";
import OutputConditionBlock from "./OuterConditionBlock";
import { GoPlus } from "react-icons/go";
import CustomSelectNew from "../../common-components/CustomSelectNew";

const Conditions = ({ conditionsApplied, entity }) => {
  const conditionCategories = {
    Campaign: [

      {
        label: "Impressions",
        value: "impressions",
      },
      {
        label: "Clicks",
        value: "unique_clicks",
      }, {
        label: "CTR",
        value: "ctr",
      },
      {
        label: "ROAS",
        value: "roas",
      },
      {
        label: "CPM",
        value: "cpm",
      },
      { label: 'Spends', value: 'estimated_budget_consumed' },
      { label: 'ATC', value: 'total_atc' },
      { label: 'Direct ATC', value: 'direct_atc' },
      { label: 'Indirect ATC', value: 'indirect_atc' },
      { label: 'Total Orders', value: 'total_quantities_sold' },
      { label: 'Direct Orders', value: 'direct_quantities_sold' },
      { label: 'Indirect Orders', value: 'indirect_quantities_sold' },
      { label: 'Total Sales', value: 'total_sales' },
      { label: 'Direct Sales', value: 'direct_sales' },
      { label: 'Indirect Sales', value: 'indirect_sales' },
      { label: 'New users', value: 'new_users_acquired' },
      { label: 'ATC%', value: 'atc_percent' }




    ],

    Keyword: [

      {
        label: "Impressions",
        value: "impressions",
      },
      {
        label: "Clicks",
        value: "unique_clicks",
      }, {
        label: "CTR",
        value: "ctr",
      },
      {
        label: "ROAS",
        value: "roas",
      },
      {
        label: "CPM",
        value: "cpm",
      },
      { label: 'Spends', value: 'estimated_budget_consumed' },
      { label: 'ATC', value: 'total_atc' },
      { label: 'Direct ATC', value: 'direct_atc' },
      { label: 'Indirect ATC', value: 'indirect_atc' },
      { label: 'Total Orders', value: 'total_quantities_sold' },
      { label: 'Direct Orders', value: 'direct_quantities_sold' },
      { label: 'Indirect Orders', value: 'indirect_quantities_sold' },
      { label: 'Total Sales', value: 'total_sales' },
      { label: 'Direct Sales', value: 'direct_sales' },
      { label: 'Indirect Sales', value: 'indirect_sales' },
      { label: 'New users', value: 'new_users_acquired' },
      { label: 'ATC%', value: 'atc_percent' }




    ],
    Category: [

      {
        label: "Impressions",
        value: "impressions",
      },
      {
        label: "Clicks",
        value: "unique_clicks",
      }, {
        label: "CTR",
        value: "ctr",
      },
      {
        label: "ROAS",
        value: "roas",
      },
      {
        label: "CPM",
        value: "cpm",
      },
      { label: 'Spends', value: 'estimated_budget_consumed' },
      { label: 'ATC', value: 'total_atc' },
      { label: 'Direct ATC', value: 'direct_atc' },
      { label: 'Indirect ATC', value: 'indirect_atc' },
      { label: 'Total Orders', value: 'total_quantities_sold' },
      { label: 'Direct Orders', value: 'direct_quantities_sold' },
      { label: 'Indirect Orders', value: 'indirect_quantities_sold' },
      { label: 'Total Sales', value: 'total_sales' },
      { label: 'Direct Sales', value: 'direct_sales' },
      { label: 'Indirect Sales', value: 'indirect_sales' },
      { label: 'New users', value: 'new_users_acquired' },
      { label: 'ATC%', value: 'atc_percent' }




    ]
  }
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

  const gettingConditioExpression = (eventValue) => {
    setConditionValues((prev) => {
      return {
        ...prev,
        conditionType: eventValue,
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
        <div className="flex w-3/4">
          {/* conditions category */}
          <div className=" pr-4 w-[150px]">
            {/* <select
              className="border border-gray-300 text-black h-[32px] outline-none rounded"
              name="conditionCategory"
              onChange={(e) => gettingConditionData(e)}
            >
              {conditionCategories[entity].map((v) => {
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
              options={conditionCategories[entity]}
              value={conditionValues?.conditionCategory}
              onChange={gettingConditionCategory}
              platform={"blinkit"}
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
              platform={"blinkit"}
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
                  ? "condition__plus-btn cursor-not-allowed bg-slate-500 h-[32px] blinkit_btn"
                  : "condition__plus-btn h-[32px] blinkit_btn"
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
