import React, { useState, useEffect } from "react";

const OutputConditionBlock = ({ totalConditions, setTotalConditions }) => {
  const [emptyConditionFlag, setEmptyConditionFlag] = useState(false);
  // data
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
      label: "is smaller than",
      value: "smaller_than",
    },
    {
      label: "is between",
      value: "range",
    },
    {
      label: "is not between",
      value: "is_not_in_range",
    },
  ];
  //   data end

  const handleClose = (index) => {
    setTotalConditions((prevConditions) =>
      prevConditions.filter((_, i) => i !== index)
    );
  };
  const [addMoreConditions, setAddMoreConditions] = useState([]);
  const [conditionValues, setConditionValues] = useState({
    less: "",
    conditionCategory: "impressions",
    greater: "",
    conditionType: "greater_than",
  });

  useEffect(() => {
    if (conditionValues.less === "" && conditionValues.greater === "") {
      setEmptyConditionFlag(true);
    } else {
      setEmptyConditionFlag(false);
    }
  }, [conditionValues]);

  const handleAddCondition = (v) => {
    if (!emptyConditionFlag) {
      setTotalConditions([...totalConditions, conditionValues]);
      setAddMoreConditions((prev) => prev.filter((prev) => prev !== v));
    }
    setConditionValues({
      less: "",
      conditionCategory: "impressions",
      greater: "",
      conditionType: "greater_than",
      id: "",
    });
  };

  return (
    <>
      <div className="condition__box ">
        <div className="row ">
          {totalConditions?.map((v, i) => {
            return (
              <div key={i} className="  condition-tagblock px-2">
                {v.greater &&
                  v.conditionType.startsWith("greater") &&
                  `${v.conditionCategory} > ${v.greater}`}
                {v.less &&
                  v.conditionType.startsWith("smaller") &&
                  `${v.conditionCategory} < ${v.less}`}
                {v.greater &&
                  v.less &&
                  v.conditionType.startsWith("range") &&
                  ` ${v.conditionCategory} >= ${v.less} && ${v.conditionCategory} <= ${v.greater}`}
                {v.greater &&
                  v.less &&
                  v.conditionType.startsWith("is_not_in_range") &&
                  `${v.conditionCategory} < ${v.less} && ${v.conditionCategory} > ${v.greater}`}
                <button className="condition-tagcond ">
                  <button
                    className="w-6 h-6 condtion__tag px-4 text-black "
                    onClick={() => handleClose(i)}
                  >
                    X
                  </button>
                </button>
              </div>
            );
          })}

          <div className=" ">
            <button
              className="border-none  font-normal text-sm bg-[#0081f7]   text-white px-5 h-9 rounded  hover:bg-black hover:text-white"
              onClick={() => {
                setAddMoreConditions([
                  ...addMoreConditions,
                  addMoreConditions?.length && addMoreConditions.length,
                ]);
              }}
            >
              Add
              {/* <div className="text-white text-base row  ">Add</div> */}
            </button>
          </div>
        </div>
      </div>
      {/* {addMoreConditions && <Conditions />} */}
      {addMoreConditions?.map((v) => {
        return (
          <>
            <div className="row items-stretch  ">
              {/* conditions category */}
              <div className="col_4 pl-4 pr-7  ">
                <select
                  className="form-control"
                  onChange={(e) => {
                    setConditionValues((prev) => {
                      return {
                        ...prev,
                        conditionCategory: e.target.value,
                      };
                    });
                  }}
                >
                  {conditionCategories.map((v) => {
                    return (
                      <>
                        <option value={v.value}>{v.label}</option>
                      </>
                    );
                  })}
                </select>
              </div>
              <div>
                <select
                  className="form-control  col_6 "
                  onChange={(e) => {
                    const { value } = e.target;
                    // console.log("value ===>", value);
                    setConditionValues((prev) => {
                      return {
                        ...prev,
                        conditionType: value,
                      };
                    });
                  }}
                >
                  {conditions.map((v) => {
                    return (
                      <>
                        <option value={v.value}>{v.label}</option>
                      </>
                    );
                  })}
                </select>
              </div>
              {conditionValues.conditionType.includes("than") ? (
                conditionValues.conditionType.includes("greater") ? (
                  <div className="pl-3 pr-3 col_3">
                    <input
                      required
                      type="number"
                      className=" form-control"
                      onChange={(e) => {
                        const { value } = e.target;
                        setConditionValues((prev) => {
                          return {
                            ...prev,
                            greater: value,
                          };
                        });
                      }}
                    />
                  </div>
                ) : (
                  <div className="pl-3 pr-3 col_3">
                    <input
                      type="number"
                      className="form-control "
                      onChange={(e) => {
                        const { value } = e.target;
                        setConditionValues((prev) => {
                          return {
                            ...prev,
                            less: value,
                          };
                        });
                      }}
                    />
                  </div>
                )
              ) : (
                <>
                  <div className="col_1 pl-2 pr-1">
                    <input
                      type="number"
                      className="form-control"
                      onChange={(e) => {
                        const { value } = e.target;
                        setConditionValues((prev) => {
                          return {
                            ...prev,
                            less: value,
                          };
                        });
                      }}
                    />
                  </div>
                  <div className="col_1  pl-1 pr-2">
                    <input
                      type="number"
                      className="form-control  "
                      onChange={(e) => {
                        const { value } = e.target;
                        setConditionValues((prev) => {
                          return {
                            ...prev,
                            greater: value,
                          };
                        });
                      }}
                    />
                  </div>
                </>
              )}
              <div>
                <button
                  className={
                    emptyConditionFlag === true
                      ? "condition__plus-btn cursor-not-allowed bg-slate-500"
                      : "condition__plus-btn"
                  }
                  disabled={emptyConditionFlag === true ? true : false}
                  // onClick={() => {
                  //   setTotalConditions([...totalConditions, conditionValues]);
                  //   setAddMoreConditions((prev) => {
                  //     return prev.filter((prev) => prev !== v);
                  //   });
                  // }}
                  onClick={() => handleAddCondition(v)}
                >
                  <div className="text-white text-base">+</div>
                </button>
              </div>
            </div>
          </>
        );
      })}
    </>
  );
};

export default OutputConditionBlock;
