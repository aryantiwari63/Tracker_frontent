import Drawer from "../../../../common-components/drawer";
import { _POST } from "../../../../../services/axios.method";
import { FLIPKART_BUDGET_CATEGORY } from "../../../../../utils/constants";
import { useEffect, useState } from "react";
import Accordion from "../../../../common-components/accordion";
import "./styles.css";
import CustomSelectNew from "../../../../common-components/CustomSelectNew";
const AddBudgetDialog = ({
  title,
  brandName,
  isOpen,
  presentMonth,
  upcomingMonth,
  selectedMonth,
  setSelectedMonth,
  setBudgetData,
  // loadBudget,
  editBudgetData,
}) => {
  const [platform, setPlatform] = useState(false);
  const [segment, setSegment] = useState(false);
  const [category, setCategory] = useState(false);
  const [categoryName, setCategoryName] = useState([]);
  const [category1, setCategory1] = useState([]);
  const [category2, setCategory2] = useState([]);
  const [category3, setCategory3] = useState([]);
  const [category4, setCategory4] = useState([]);
  const [budgetValueMk1, setBudgetValueMk1] = useState();
  const [budgetValueMk2, setBudgetValueMk2] = useState();
  const [budgetValueSm1, setBudgetValueSm1] = useState();
  const [budgetValueSm2, setBudgetValueSm2] = useState();
  const [error, setError] = useState(false);
  const currency = localStorage.getItem("currency");

  const accordianTitle = `Category ${currency}`;
  const getBudgetCategory = async () => {
    try {
      const data = {
        brand: brandName,
      };
      const result = await _POST(FLIPKART_BUDGET_CATEGORY, data);
      setCategoryName(result?.data?.data?.result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (category === true) {
      getBudgetCategory();
    }
  }, [category]);

  const handleCategory1 = (e, category) => {
    setCategory1({
      ...category1,
      [category]: parseFloat(e.target.value),
    });
  };

  const handleCategory2 = (e, category) => {
    setCategory2({
      ...category2,
      [category]: parseFloat(e.target.value),
    });
  };

  const handleCategory3 = (e, category) => {
    setCategory3({
      ...category3,
      [category]: parseFloat(e.target.value),
    });
  };

  const handleCategory4 = (e, category) => {
    setCategory4({
      ...category4,
      [category]: parseFloat(e.target.value),
    });
  };

  const handleDrawerButton = () => {
    if (!selectedMonth) {
      setError("Select month");
      isOpen(true);
    } else {
      const data = {
        platform: platform,
        category: category,
        segment: segment,
        // month: selectedMonth,
        budgetValueMk1: budgetValueMk1,
        budgetValueMk2: budgetValueMk2,
        budgetValueSm1: budgetValueSm1,
        budgetValueSm2: budgetValueSm2,
        category1: category1,
        category2: category2,
        category3: category3,
        category4: category4,
        username: localStorage.getItem("name"),
        user_id: localStorage.getItem("user_id"),
      };

      setBudgetData(data);
      setSelectedMonth();
      emptyAllVAlues();
      isOpen(false);
    }
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
  
  useEffect(() => {
    if (editBudgetData !== null && editBudgetData !== undefined) {
      // set states of checkboxes
      setPlatform(editBudgetData?.platform);
      setCategory(editBudgetData?.category);
      setSegment(editBudgetData?.segment);

      // if platform, segment and category is selcted
      if (
        editBudgetData?.platform &&
        editBudgetData?.segment &&
        editBudgetData?.category
      ) {
        setCategory1(editBudgetData?.category_data?.mk_pla_category);
        setCategory2(editBudgetData?.category_data?.mk_pca_category);
        setCategory3(editBudgetData?.category_data?.sm_pla_category);
        setCategory4(editBudgetData?.category_data?.sm_pca_category);
      }
      // if segment nd category is selected
      else if (editBudgetData?.segment && editBudgetData?.category) {
        setCategory1(editBudgetData?.category_data?.pla_category);
        setCategory2(editBudgetData?.category_data?.pca_category);
      }
      // if platform and category is selected
      else if (editBudgetData?.platform && editBudgetData?.category) {
        setCategory1(editBudgetData?.category_data?.mk_category);
        setCategory3(editBudgetData?.category_data?.sm_category);
      }
      // if platform and segment is selected
      else if (editBudgetData?.platform && editBudgetData?.segment) {
        setBudgetValueMk1(editBudgetData?.budget?.mk_pla_budget);
        setBudgetValueMk2(editBudgetData?.budget?.mk_pca_budget);
        setBudgetValueSm1(editBudgetData?.budget?.sm_pla_budget);
        setBudgetValueSm2(editBudgetData?.budget?.sm_pca_budget);
      }
      // only platform is selected
      else if (editBudgetData?.platform) {
        setBudgetValueMk1(editBudgetData?.budget?.mk_budget);
        setBudgetValueSm1(editBudgetData?.budget?.sm_budget);
      }
      // only segment is selected
      else if (editBudgetData?.segment) {
        setBudgetValueMk1(editBudgetData?.budget?.pla_budget);
        setBudgetValueMk2(editBudgetData?.budget?.pca_budget);
      }
      // category is selected
      else if (editBudgetData?.category) {
        setCategory1(editBudgetData.category_data.category);
      }
    } else {
      emptyAllVAlues();
    }
  }, [selectedMonth, editBudgetData]);

  const handleNonNegativeInput = (e, setValueFunction) => {
    const inputValue = e.target.value;

    if (!isNaN(inputValue) && inputValue > 0) {
      setValueFunction(inputValue);
    } else {
      setValueFunction(0);
    }
  };

  const emptyAllVAlues = () => {
    setCategory(false);
    setPlatform(false);
    setSegment(false);
    setBudgetValueMk1();
    setBudgetValueMk2();
    setBudgetValueSm1();
    setBudgetValueSm2();
    setCategory1([]);
    setCategory2([]);
    setCategory3([]);
    setCategory4([]);
    setError(false);
  };
  const handleCancelButton = () => {
    emptyAllVAlues();
    setSelectedMonth();
    isOpen(false);
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
        handleDrawerButton={handleDrawerButton}
        handleCancelChanges={handleCancelButton}
      >
        <div className="mx-6">
          <div className="w-[70%]  flex  justify-between mb-4 ">
            <div className="w-[22%]"> 
              {/* <select
                className="border rounded w-32 mr-1 flipkartRing"
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
                platform={"flipkart"}
                className="py-1"
              />
            </div>
            <div className="flex ">
              {" "}
              <p className="mr-2 text-base">Platform</p>
              <input
                type="checkbox"
                onChange={(e) => handlePlatform(e.target.checked)}
                checked={platform}
              />
            </div>
            <div className="flex ">
              {" "}
              <p className="mr-2 text-base">PLA/PCA</p>
              <input
                type="checkbox"
                onChange={(e) => handleSegment(e.target.checked)}
                checked={segment}
              />{" "}
            </div>
            <div className="flex cursor-not-allowed">
              <p className="mr-2 text-base">Category</p>

              <input
                type="checkbox"
                onChange={(e) => handleCategory(e.target.checked)}
                checked={category}
                disabled={true}
              />
              <div className="tooltip-content">Tooltip text here</div>
            </div>
          </div>

          <div>
            <table className="budgetpacer" style={{ width: "100%" }}>
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
                      PLA/PCA
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
                      Marketplace
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
                                      value={category1[i?.storetitle] || ""}
                                      // key={index}
                                      onChange={(e) =>
                                        handleCategory1(e, i?.storetitle)
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
                          handleNonNegativeInput(e, setBudgetValueMk1)
                        }
                        value={budgetValueMk1}
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
                                        value={category2[i?.storetitle] || ""}
                                        // key={index}
                                        onChange={(e) =>
                                          handleCategory2(e, i?.storetitle)
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
                            handleNonNegativeInput(e, setBudgetValueMk2)
                          }
                          value={budgetValueMk2}
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

                {(category && !segment && !platform) ||
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
                                          value={category3[i?.storetitle] || ""}
                                          onChange={(e) =>
                                            handleCategory3(e, i?.storetitle)
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
                          {" "}
                          <input
                            className="border rounded"
                            value={budgetValueSm1}
                            onChange={(e) =>
                              handleNonNegativeInput(e, setBudgetValueSm1)
                            }
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
                                            value={
                                              category4[i?.storetitle] || ""
                                            }
                                            type="number"
                                            className="border"
                                            onChange={(e) =>
                                              handleCategory4(e, i?.storetitle)
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
                            {" "}
                            <input
                              type="number"
                              onChange={(e) =>
                                handleNonNegativeInput(e, setBudgetValueSm2)
                              }
                              value={budgetValueSm2}
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
                )}
              </tbody>
            </table>
          </div>
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </Drawer>
    </>
  );
};
export default AddBudgetDialog;
