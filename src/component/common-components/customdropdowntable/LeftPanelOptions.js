import React, { useEffect, useState } from "react";

const LeftPanelOptions = ({
  metric,
  selectedMetric,
  setSelectedMetric,
  searchFilter,
  setSearchFilter,
  setTotalMetrics,
  data,
}) => {
  // const [optionlistData, setOptionListData] = useState(customoption);
  // const [optionlist, setOptionList] = useState(customoption);
  const [optionlistData, setOptionListData] = useState(data);
  const [optionlist, setOptionList] = useState(data);
  useEffect(() => {
    setOptionList(data);
    setOptionListData(data);
  }, [data]);
  const handleSelectMetric = (e, currentMetric) => {
    const { value, checked } = e.target;
    let object = [];
    if (metric === "all") {
      let objectFromAll = optionlist.filter(
        (item) => item.key === currentMetric
      );
      object = objectFromAll[0].children.filter(
        (item) => item.key === value
      );
    } else {
      object = optionlist[0].children.filter((item) => item.key === value);
    }
    checked
      ? setSelectedMetric([...selectedMetric, ...object])
      : setSelectedMetric(
          selectedMetric.filter((item) => item.key !== object[0].key)
        );
    setSearchFilter("");
  };
  useEffect(() => {
    let count = optionlistData.map((item) => item.children.length);
    let sum = 0;
    for (let i = 0; i < count?.length; i++) {
      sum += count[i];
    }
    setTotalMetrics(sum);
    metric === "all"
      ? setOptionList(optionlistData)
      : setOptionList(() => {
          return optionlistData.filter((item) => item.value === metric);
        });
  }, []);
  useEffect(() => {
    metric === "all"
      ? setOptionList(optionlistData)
      : setOptionList(() => {
          return optionlistData.filter((item) => item.value === metric);
        });
  }, [metric]);
  return (
    <>
      <div className="">
        <div className=" font-bold text-sm  px-2 pl-5"></div>
        {metric === "all"
          ? optionlist.map((item) => {
              return (
                <>
                  {item.label}
                  {item.children.map((items) => {
                    return (
                      <>
                        {items.label
                          .toLowerCase()
                          .startsWith(searchFilter.toLowerCase()) && (
                          <div className="dropdownfields " key={items.id}>
                            <label className="cursor-pointer pl-5 ">
                              <div className="row items-center pl-5">
                                <div>
                                  <input
                                    type="checkbox"
                                    value={items.key}
                                    onClick={(e) => {
                                      handleSelectMetric(e, item.key);
                                    }}
                                    checked={selectedMetric.some(
                                      (ele) => ele.key === items.key
                                    )}
                                  />
                                </div>
                                <div className="col px-1">{items.label} </div>
                              </div>
                            </label>
                          </div>
                        )}
                      </>
                    );
                  })}
                </>
              );
            })
          : optionlist[0]?.children.map((item) => {
              return (
                <>
                  {item.label
                    .toLowerCase()
                    .startsWith(searchFilter.toLowerCase()) && (
                    <div className="dropdownfields " key={item.id}>
                      <label className="cursor-pointer pl-5 ">
                        <div className="row items-center pl-5 ">
                          <div className="">
                            <input
                              type="checkbox"
                              value={item.key}
                              onClick={(e) => {
                                handleSelectMetric(e);
                              }}
                              checked={selectedMetric.some(
                                (ele) => ele.key === item.key
                              )}
                            />
                          </div>
                          <div className="col px-1">{item.label} </div>
                        </div>
                      </label>
                    </div>
                  )}
                </>
              );
            })}
      </div>
    </>
  );
};

export default LeftPanelOptions;
