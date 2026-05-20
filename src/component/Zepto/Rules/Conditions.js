import { useState, useEffect } from "react";
import OutputConditionBlock from "./OuterConditionBlock";
import { GoPlus } from "react-icons/go";
import CustomSelectNew from "../../common-components/CustomSelectNew";

const Conditions = ({ conditionsApplied, entity }) => {
  const conditionCategories = {
    Campaign: [
      { label: "Impression", value: "impressions" },
      { label: "Click", value: "clicks" },
      { label: "Spend", value: "spend" },
      { label: "CPC", value: "cpc" },
      { label: "Orders", value: "orders" },
      { label: "ROAS", value: "roas" },
      { label: "CTR", value: "ctr" },
      { label: "ATC", value: "add2cart" },
      { label: "Sales", value: "revenues" },
      { label: "CPM", value: "cpm" },
      { label: "View Products", value: "view_products" },
    ],
    Keyword: [
      { label: "Impression", value: "impressions" },
      { label: "Click", value: "clicks" },
      { label: "Spend", value: "spend" },
      { label: "CPC", value: "cpc" },
      { label: "ROAS", value: "roas" },
      { label: "CTR", value: "ctr" },
      { label: "Sales", value: "revenues" },
      { label: "CPM", value: "cpm" },
    ],
    Category: [
      { label: "Impression", value: "impressions" },
      { label: "Click", value: "clicks" },
      { label: "Spend", value: "spend" },
      { label: "CPC", value: "cpc" },
      { label: "Orders", value: "orders" },
      { label: "ROAS", value: "roas" },
      { label: "CTR", value: "ctr" },
      { label: "Sales", value: "revenues" },
      { label: "CPM", value: "cpm" },
      { label: "Same SKU Orders", value: "same_sku_orders" },
      { label: "Other SKU Orders", value: "other_sku_orders" },
    ],
    Product: [
      { label: "Impression", value: "impressions" },
      { label: "Click", value: "clicks" },
      { label: "Spend", value: "spend" },
      { label: "CPC", value: "cpc" },
      { label: "Orders", value: "orders" },
      { label: "ROAS", value: "roas" },
      { label: "CTR", value: "ctr" },
      { label: "Sales", value: "revenues" },
      { label: "CPM", value: "cpm" },
      { label: "Same SKU Orders", value: "same_sku_orders" },
      { label: "Other SKU Orders", value: "other_sku_orders" },
      { label: "Views", value: "views" },
    ],
  };
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
              platform={"zepto"}
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
              platform={"zepto"}
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
                  ? "zepto_btn condition__plus-btn zepto_btn cursor-not-allowed bg-slate-500 h-[32px] "
                  : "zepto_btn condition__plus-btn zepto_btn h-[32px]"
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
