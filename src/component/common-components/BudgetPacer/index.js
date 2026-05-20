import React, { useState, useEffect } from "react";
import Drawer from "../../common-components/drawer";
import "./style.css";
import Accordion from "../accordion";
import { accentThemeObj } from "../../../style/StyleConstants";
import CustomSelectNew from "../CustomSelectNew";
const BudgetPacer = ({
  title,
  // eslint-disable-next-line no-unused-vars
  brandName,
  isOpen,
  presentMonth,
  upcomingMonth,
  selectedMonth,
  setSelectedMonth,
  setBudgetData,
  // loadBudget,
  editBudgetData,
  mediaType,
  categoryName,
}) => {
  const [platform, setPlatform] = useState(false);
  const [segment, setSegment] = useState(false);
  const [category, setCategory] = useState(false);
  const [error, setError] = useState(false);
  const currency = localStorage.getItem("currency");
  const [reachCategory, setReachCategory] = useState([]);
  const [performanceCategory, setPerformanceCategory] = useState([]);

  const [platformData, setPlatformData] = useState();
  const [segment2, setSegment2] = useState();
  const [segment3, setSegment3] = useState();
  const handleCancelButton = () => {
    emptyAllVAlues();
    setSelectedMonth();
    isOpen(false);
  };

  const handlePlatform = (check) => {
    if (check) {
      setPlatform(true);
    } else {
      setPlatform(false);
    }
  };

  const handleSegment = (check) => {
    if (check) {
      setSegment(true);
    } else {
      setSegment(false);
    }
  };
  const handleCategory = (check) => {
    if (check) {
      setCategory(true);
    } else {
      setCategory(false);
    }
  };

  let segmentType;
  let segmentNames = [];

  switch (mediaType) {
    case "Amazon":
      segmentType = "SP/SB/SD";
      segmentNames = ["SP", "SB", "SD"];
      break;
    case "Zepto":
      segmentType = "Awareness/Performance";
      segmentNames = ["Awareness", "Performance"];
      break;
    case "Blinkit":
      segmentType = "Reach/Performance";
      segmentNames = ["Reach", "Performance"];
      break;
    case "Instamart":
      segmentType = "";
      segmentNames = [];
      break;

    default:
      segmentType = "Awareness/Performance";
      segmentNames = ["Awareness", "Performance"];
  }

  useEffect(() => {
    if (mediaType === "Instamart") {
      if (selectedMonth !== undefined && selectedMonth !== "") {
        setPlatform(true);
      } else {
        setPlatform(false);
      }
    }
  }, [selectedMonth, mediaType]);
  const handleNonNegativeInput = (e, setValueFunction) => {
    const inputValue = e.target.value;

    if (!isNaN(inputValue) && inputValue > 0) {
      setValueFunction(inputValue);
    } else {
      setValueFunction(0);
    }
  };
  const handleDrawerButton = () => {
    if (!selectedMonth) {
      setError("select month");
      isOpen(true);
    } else {
      const data = {
        platform: platform,
        category: category,
        segment: segment,
        username: localStorage.getItem("name"),
        user_id: localStorage.getItem("user_id"),
        platformData: platformData,
        segment2: segment2,
        segment3: segment3,
        reachCategory: reachCategory,
        performanceCategory: performanceCategory,
        month: selectedMonth,
      };

      setBudgetData(data);
      setSelectedMonth();
      emptyAllVAlues();
      isOpen(false);
    }
  };

  const emptyAllVAlues = () => {
    setCategory(false);
    setPlatform(false);
    setSegment(false);
    setPlatformData();
    setSegment2();
    setSegment3();
    setError(false);
  };

  const amsData = () => {
    if (editBudgetData !== null && editBudgetData !== undefined) {
      // set states of checkboxes
      setPlatform(editBudgetData?.platform);
      setCategory(editBudgetData?.category);
      setSegment(editBudgetData?.segment);
    }

    // if platform and segment both are selected or only segment is selected
    if (
      (editBudgetData?.platform && editBudgetData?.segment) ||
      editBudgetData?.segment
    ) {
      setPlatformData(editBudgetData?.budget?.sp_budget);
      setSegment2(editBudgetData?.budget?.sb_budget);
      setSegment3(editBudgetData?.budget?.sd_budget);
    } else if (editBudgetData?.platform) {
      setPlatformData(editBudgetData?.budget?.amazon);
    } else {
      emptyAllVAlues();
    }
  };

  const zeptoData = () => {
    if (editBudgetData !== null && editBudgetData !== undefined) {
      // set states of checkboxes
      setPlatform(editBudgetData?.platform);
      setCategory(editBudgetData?.category);
      setSegment(editBudgetData?.segment);
    }

    // if platform and segment both are selected or only segment is selected
    if (
      (editBudgetData?.platform && editBudgetData?.segment) ||
      editBudgetData?.segment
    ) {
      setPlatformData(editBudgetData?.budget?.awareness_budget);
      setSegment2(editBudgetData?.budget?.performance_budget);
    } else if (editBudgetData?.platform) {
      setPlatformData(editBudgetData?.budget?.zepto);
    } else {
      emptyAllVAlues();
    }
  };

  const instamartData = () => {
    if (editBudgetData !== null && editBudgetData !== undefined) {
      setPlatformData(editBudgetData?.budget?.instamart);
    }
  };
  const blinkitData = () => {
    if (editBudgetData !== null && editBudgetData !== undefined) {
      // set states of checkboxes
      setPlatform(editBudgetData?.platform);
      setCategory(editBudgetData?.category);
      setSegment(editBudgetData?.segment);
    }
    // if segment and category is selected
    if (editBudgetData?.segment && editBudgetData?.category) {
      setReachCategory(editBudgetData?.budget?.reach_category_budget || {});
      setPerformanceCategory(
        editBudgetData?.budget?.performance_category_budget || {}
      );
    }
    // if only segment is selected
    else if (editBudgetData?.segment) {
      setPlatformData(editBudgetData?.budget?.reach_budget);
      setSegment2(editBudgetData?.budget?.performance_budget);
    }
    // if only category is selected
    else if (editBudgetData?.category) {
      setReachCategory(editBudgetData?.budget?.category);
    } else {
      emptyAllVAlues();
    }
  };

  useEffect(() => {
    if (mediaType === "Amazon") {
      amsData();
    } else if (mediaType === "Zepto") {
      zeptoData();
    } else if (mediaType === "Blinkit") {
      blinkitData();
    } else if (mediaType === "Instamart") {
      instamartData();
    }
  }, [selectedMonth, editBudgetData]);

  const handleReachCategory = (e, categoryName) => {
    const { value } = e.target;
    setReachCategory((prevValue) => ({
      ...prevValue,
      [categoryName]: value,
    }));
  };

  const handlePerformanceCategory = (e, categoryName) => {
    const { value } = e.target;
    setPerformanceCategory((prevValue) => ({
      ...prevValue,
      [categoryName]: value,
    }));
  };

  const monthArr=[
    {
      label:presentMonth,
      value:presentMonth
    },
    {
      label:upcomingMonth,
      value:upcomingMonth
    },
  ]

  return (
    <>
      <Drawer
        isOpen={isOpen}
        title={title}
        handleCancelChanges={handleCancelButton}
        handleDrawerButton={handleDrawerButton}
      >
        {" "}
        <div className="mx-6">
          <div className="w-[70%]  flex  justify-between mb-4 ">
            <div className="w-[22%]"> 
              {/* <select
                className="border rounded w-32 mr-1"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="">Select month</option>
                <option value={presentMonth}>{presentMonth}</option>
                <option value={upcomingMonth}>{upcomingMonth}</option>
              </select> */}
              <CustomSelectNew
                label={"Select month"}
                options={monthArr}
                value={selectedMonth}
                onChange={setSelectedMonth}
                platform={mediaType?.toLowerCase()}
                className="py-1"
              />
              {
                // eslint-disable-next-line no-console
                console.log(mediaType?.toLowerCase(),"platform")
              }
            </div>

            {mediaType !== "Instamart" && (
              <>
                {" "}
                <div
                  className={
                    mediaType == "Blinkit" ? `flex cursor-not-allowed` : `flex`
                  }
                >
                  {" "}
                  <p className="mr-2 text-base daf">Platform</p>
                  <input
                    type="checkbox"
                    className={accentThemeObj[mediaType?.toLowerCase()]}
                    onChange={(e) => handlePlatform(e.target.checked)}
                    checked={platform}
                    disabled={mediaType === "Blinkit" && true}
                  />
                </div>
                <div className="flex ">
                  {" "}
                  <p className="mr-2 text-base">{segmentType}</p>
                  <input
                    type="checkbox"
                   className={accentThemeObj[mediaType?.toLowerCase()]}
                    onChange={(e) => handleSegment(e.target.checked)}
                    checked={segment}
                  />{" "}
                </div>
                <div
                  className={
                    mediaType !== "Blinkit" ? `flex cursor-not-allowed` : `flex`
                  }
                >
                  <p className="mr-2 text-base">Category</p>

                  <input
                    type="checkbox"
                   className={accentThemeObj[mediaType?.toLowerCase()]}
                    onChange={
                      mediaType === "Blinkit"
                        ? (e) => handleCategory(e.target.checked)
                        : undefined
                    }
                    checked={category}
                    disabled={mediaType !== "Blinkit"}
                  />
                </div>
              </>
            )}
          </div>

          <div>
            <table className="budgetpacercommon" style={{ width: "100%" }}>
              <thead>
                <tr
                  className={` ${
                    category
                      ? " flex align-center"
                      : "flex justify-between  align-center"
                  } bg-gray-50 py-2 `}
                >
                  {" "}
                  {platform && (
                    <th
                      className="w-[20%]"
                      style={{
                        display: "inline-block",
                        marginRight: "10px",
                        fontSize: "1rem",
                        fontWeight: "bold",
                      }}
                    >
                      Platform
                    </th>
                  )}
                  {segment && (
                    <th
                      className="w-[20%]"
                      style={{
                        //   display: "inline-block",
                        marginRight: "10px",
                        fontSize: "1rem",
                        fontWeight: "bold",
                      }}
                    >
                      {segmentType}
                    </th>
                  )}
                  {category && (
                    <th
                      className="justify-center"
                      style={{
                        //   display: "inline-block",
                        marginRight: "10px",
                        fontSize: "1rem",
                        fontWeight: "bold",
                      }}
                    >
                      Category
                    </th>
                  )}
                  {(platform || segment) && !category && (
                    <th
                      style={{
                        display: "inline-block",
                        marginRight: "10px",
                        fontSize: "1rem",
                        fontWeight: "bold",
                      }}
                    >
                      Budget ({currency})
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                <tr
                  className={` ${
                    category
                      ? " flex align-center"
                      : "flex justify-between  align-center"
                  } py-2 overflow-y-auto `}
                  style={{ maxHeight: "20rem" }}
                >
                  {platform && (
                    <td
                      className="w-[20%]"
                      style={{
                        display: "inline-block",
                        marginRight: "10px",
                        fontSize: "1rem",
                      }}
                    >
                      {mediaType}
                    </td>
                  )}
                  {segment && (
                    <td
                      className="w-[20%]"
                      style={{
                        display: "inline-block",
                        marginRight: "10px",
                        fontSize: "1rem",
                      }}
                    >
                      {segmentNames[0]}
                    </td>
                  )}

                  {category && (
                    <td>
                      {" "}
                      <Accordion title="Categories">
                        {" "}
                        <div className="flex flex-col ">
                          {categoryName.length > 0 &&
                            categoryName.map(
                              (i, index) =>
                                i?.label !== null && (
                                  <div key={index} className=" flex-col my-1">
                                    <p
                                      key={index}
                                      style={{
                                        display: "inline-block",
                                        marginRight: "10px",
                                        fontSize: "1rem",
                                        width: "60%",
                                      }}
                                    >
                                      {i?.label}
                                    </p>
                                    <input
                                      type="number"
                                      className="border"
                                      value={reachCategory[i?.label] || ""}
                                      key={index}
                                      onChange={(e) =>
                                        handleReachCategory(e, i?.label)
                                      }
                                    />
                                  </div>
                                )
                            )}
                        </div>
                      </Accordion>
                    </td>
                  )}
                  {(platform || segment) && !category && (
                    <td>
                      <input
                        className="border rounded"
                        onChange={(e) =>
                          handleNonNegativeInput(e, setPlatformData)
                        }
                        value={platformData}
                        type="number"
                        style={{
                          width: "100px",
                          padding: "5px",
                          marginRight: "10px",
                        }}
                      />
                    </td>
                  )}
                </tr>

                {segment === true && (
                  <>
                    {" "}
                    <tr
                      className={`${
                        category
                          ? "flex align-center py-2"
                          : "flex justify-between py-2 align-center"
                      } ${
                        (category && !segment && !platform) ||
                        (segment && !category && !platform) ||
                        (segment && category && !platform)
                          ? "bg-blue-50"
                          : ""
                      } overflow-y-auto `}
                      style={{ maxHeight: "20rem" }}
                    >
                      {platform && (
                        <td
                          className={"w-[20%] bg-red-400"}
                          style={{
                            display: "inline-block",
                            marginRight: "10px",
                            fontSize: "1rem",
                          }}
                        ></td>
                      )}
                      {segment && (
                        <>
                          {" "}
                          <td
                            className="w-[20%]"
                            style={{
                              display: "inline-block",
                              marginRight: "10px",
                              fontSize: "1rem",
                            }}
                          >
                            {segmentNames[1]}
                          </td>{" "}
                        </>
                      )}

                      {category && (
                        <td>
                          {" "}
                          <Accordion title="Categories">
                            {" "}
                            <div className="flex flex-col ">
                              {categoryName.length > 0 &&
                                categoryName.map(
                                  (i, index) =>
                                    i?.label !== null && (
                                      <div
                                        key={index}
                                        className=" flex-col my-1"
                                      >
                                        <p
                                          // key={index}
                                          style={{
                                            display: "inline-block",
                                            marginRight: "10px",
                                            fontSize: "1rem",
                                            width: "50%",
                                          }}
                                        >
                                          {i?.label}
                                        </p>
                                        <input
                                          type="number"
                                          className="border"
                                          value={
                                            performanceCategory[i?.label] || ""
                                          }
                                          // // key={index}
                                          onChange={(e) =>
                                            handlePerformanceCategory(
                                              e,
                                              i?.label
                                            )
                                          }
                                        />
                                      </div>
                                    )
                                )}
                            </div>
                          </Accordion>
                        </td>
                      )}

                      {(platform || segment) && !category && (
                        <td>
                          <input
                            type="number"
                            onChange={(e) =>
                              handleNonNegativeInput(e, setSegment2)
                            }
                            value={segment2}
                            className="border rounded"
                            style={{
                              width: "100px",
                              padding: "5px",
                              marginRight: "10px",
                            }}
                          />
                        </td>
                      )}
                    </tr>
                    <tr
                      className={`${
                        category
                          ? "flex align-center py-2"
                          : "flex justify-between py-2 align-center"
                      } ${
                        (category && !segment && !platform) ||
                        (segment && !category && !platform) ||
                        (segment && category && !platform)
                          ? "bg-white"
                          : ""
                      } overflow-y-auto `}
                      style={{ maxHeight: "20rem" }}
                    >
                      {platform && (
                        <td
                          className={"w-[20%] bg-red-400"}
                          style={{
                            display: "inline-block",
                            marginRight: "10px",
                            fontSize: "1rem",
                          }}
                        ></td>
                      )}
                      {segment && (
                        <>
                          {" "}
                          <td
                            className="w-[20%]"
                            style={{
                              display: "inline-block",
                              marginRight: "10px",
                              fontSize: "1rem",
                            }}
                          >
                            {segmentNames[2]}
                          </td>{" "}
                        </>
                      )}

                      {/* {category && (
                      <td>
                        {" "}
                        <Accordion title={accordianTitle}>
                          {" "}
                          <div className="flex flex-col ">
                            {categoryName.length > 0 &&
                              categoryName.map(
                                (i, index) =>
                                  i.storetitle !== null && (
                                    <div key={index} className=" flex-col my-1">
                                      <p
                                        // key={index}
                                        style={{
                                          display: "inline-block",
                                          marginRight: "10px",
                                          fontSize: "1rem",
                                          width: "50%",
                                        }}
                                      >
                                        {i?.storetitle}
                                      </p>
                                      <input
                                        type="number"
                                        className="border"
                                        // value={category2[i?.storetitle] || ""}
                                        // // key={index}
                                        // onChange={(e) =>
                                        //   handleCategory2(e, i?.storetitle)
                                        // }
                                      />
                                    </div>
                                  )
                              )}
                          </div>
                        </Accordion>
                      </td>
                    )} */}

                      {mediaType === "Amazon" &&
                        (platform || segment) &&
                        !category && (
                          <td>
                            <input
                              type="number"
                              onChange={(e) =>
                                handleNonNegativeInput(e, setSegment3)
                              }
                              value={segment3}
                              className="border rounded"
                              style={{
                                width: "100px",
                                padding: "5px",
                                marginRight: "10px",
                              }}
                            />
                          </td>
                        )}
                    </tr>
                  </>
                )}

                {/* {(category && !segment && !platform) ||
                (segment && !category && !platform) ||
                (segment && category && !platform) ? (
                  <tr></tr>
                ) : (
                  <>
                    <tr
                      className={` ${
                        category
                          ? " flex align-center"
                          : "flex justify-between  align-center"
                      } py-2 overflow-y-auto bg-blue-50 `}
                      style={{ maxHeight: "20rem" }}
                    >
                      {platform && (
                        <td
                          className="w-[20%]"
                          style={{
                            display: "inline-block",
                            marginRight: "10px",
                            fontSize: "1rem",
                          }}
                        >
                          Supermart
                        </td>
                      )}
                      {segment && (
                        <td
                          className="w-[20%]"
                          style={{
                            display: "inline-block",
                            marginRight: "10px",
                            fontSize: "1rem",
                          }}
                        >
                          PLA
                        </td>
                      )}
                      {category && (
                        <td>
                          {" "}
                          <Accordion title={accordianTitle}>
                            {" "}
                            <div className="flex flex-col justify-center ">
                              {categoryName.length > 0 &&
                                categoryName.map(
                                  (i, index) =>
                                    i.storetitle !== null && (
                                      <div
                                        key={index}
                                        className=" flex-col my-1"
                                      >
                                        <p
                                          // key={index}
                                          style={{
                                            display: "inline-block",
                                            marginRight: "10px",
                                            fontSize: "1rem",
                                            width: "50%",
                                          }}
                                        >
                                          {i?.storetitle}
                                        </p>
                                        <input
                                          type="number"
                                          className="border"
                                          // value={category3[i?.storetitle] || ""}
                                          // onChange={(e) =>
                                          //   handleCategory3(e, i?.storetitle)
                                          // }
                                        />
                                      </div>
                                    )
                                )}
                            </div>
                          </Accordion>
                        </td>
                      )}

                      {(platform || segment) && !category && (
                        <td>
                          {" "}
                          <input
                            className="border rounded"
                            // value={budgetValueSm1}
                            // onChange={(e) =>
                            //   handleNonNegativeInput(e, setBudgetValueSm1)
                            // }
                            type="number"
                            style={{
                              width: "100px",
                              padding: "5px",
                              marginRight: "10px",
                            }}
                          />
                        </td>
                      )}
                    </tr>

                    {segment === true && (
                      <tr
                        className={` ${
                          category
                            ? " flex align-center  py-2"
                            : "flex justify-between  py-2 align-center"
                        }   overflow-y-auto bg-blue-50`}
                        style={{ maxHeight: "20rem" }}
                      >
                        {platform && (
                          <td
                            className={"w-[20%]"}
                            style={{
                              display: "inline-block",
                              marginRight: "10px",
                              fontSize: "1rem",
                            }}
                          ></td>
                        )}
                        {segment && (
                          <td
                            className="w-[20%]"
                            style={{
                              display: "inline-block",
                              marginRight: "10px",
                              fontSize: "1rem",
                            }}
                          >
                            PCA
                          </td>
                        )}
                        {category && (
                          <td>
                            <Accordion title={accordianTitle}>
                              {" "}
                              <div className="flex flex-col ">
                                {categoryName.length > 0 &&
                                  categoryName.map(
                                    (i, index) =>
                                      i.storetitle !== null && (
                                        <div
                                          key={index}
                                          className=" flex-col my-1"
                                        >
                                          <p
                                            style={{
                                              display: "inline-block",
                                              marginRight: "10px",
                                              fontSize: "1rem",
                                              width: "50%",
                                            }}
                                          >
                                            {i?.storetitle}
                                          </p>
                                          <input
                                          // value={
                                          //   category4[i?.storetitle] || ""
                                          // }
                                          // type="number"
                                          // className="border"
                                          // onChange={(e) =>
                                          //   handleCategory4(e, i?.storetitle)
                                          // }
                                          />
                                        </div>
                                      )
                                  )}
                              </div>
                            </Accordion>
                          </td>
                        )}

                        {(platform || segment) && !category && (
                          <td>
                            {" "}
                            <input
                              type="number"
                              // onChange={(e) =>
                              //   handleNonNegativeInput(e, setBudgetValueSm2)
                              // }
                              // value={budgetValueSm2}
                              className="border rounded"
                              style={{
                                width: "100px",
                                padding: "5px",
                                marginRight: "10px",
                              }}
                            />
                          </td>
                        )}
                      </tr>
                    )}
                  </>
                )} */}
              </tbody>
            </table>
          </div>
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </Drawer>
    </>
  );
};
export default BudgetPacer;
