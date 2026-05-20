/* eslint-disable */
import React, { useState, useEffect } from "react";
import NavButton from "./NavButton";
import { useDispatch } from "react-redux";
import { setToastMessageHandler } from "../../../redux/action-creator/commonAction";
import { cancelRequest } from "../../../utils/helpers";
import { _POST } from "../../../services/axios.method";
import { useSelector } from "react-redux";
import { ALL_BUTTON_FLAGS, PERMISSIONS } from "../../../utils/constants";
import WhenPermitted from "../../common-components/WhenPermitted";

export const metricOperator = [
  { id: 1, title: "+", operator: true },
  { id: 2, title: "-", operator: true },
  { id: 3, title: "*", operator: true },
  { id: 4, title: "/", operator: true },
  { id: 5, title: "(", operator: true },
  { id: 6, title: ")", operator: true },
];

export const dropDownCustom = [
  {
    id: 1,
    title: "Numeric (1,24.3)",
    value: "numeric",
  },
  {
    id: 2,
    title: "Integer (123)",
    value: "integer",
  },
  {
    id: 3,
    title: "Percentage (%)",
    value: "percentage",
  },
  // {
  //   id: 4,
  //   title: "Currency",
  //   value: "currency",
  // },
];
const getBracketLength = (expression, bracketType) =>
  expression.filter((val) => val.title === bracketType).length;

const operatorValidation = (
  getLength,
  getPreviousExpression,
  operator,
  expression
) =>
  ((getLength > 0 || operator.title === "(") &&
    !getPreviousExpression?.operator &&
    operator.title !== "(" &&
    operator.title !== ")") ||
  (getPreviousExpression?.title === ")" && operator.title === "*") ||
  (getPreviousExpression?.title === ")" && operator.title === "+") ||
  (getPreviousExpression?.title === ")" && operator.title === "/") ||
  (getPreviousExpression?.title === ")" && operator.title === "-") ||
  (getPreviousExpression?.title === "*" && operator.title === "(") ||
  (getPreviousExpression?.title === "+" && operator.title === "(") ||
  (getPreviousExpression?.title === "/" && operator.title === "(") ||
  (getPreviousExpression?.title === "-" && operator.title === "(") ||
  (getLength === 0 && operator.title === "(") ||
  (operator.title === ")" &&
    !getPreviousExpression?.operator &&
    getBracketLength(expression, "(") > getBracketLength(expression, ")"));

const parameterValidation = (getLength, getPreviousExpression) =>
  (getPreviousExpression?.operator || getLength === 0) &&
  getPreviousExpression?.title !== ")";

const getPositions = (customDiv) => {
  const innerDiv = document.getElementById(customDiv);
  const innerOffset = innerDiv.getBoundingClientRect();
  const outerDiv = document.getElementById("outer-custom-formation");
  const outerOffset = outerDiv.getBoundingClientRect();
  const { left: leftInner, right: rightInner } = innerOffset;
  const { left: leftOuter, right: rightOuter } = outerOffset;
  const medianInner = (leftInner + rightInner) / 2;
  const medianOuter = (leftOuter + rightOuter) / 2;
  return medianOuter > medianInner ? "" : "right-[-40%]";
};

const CustomMetric = ({
  list,
  generateReport,
  color,
  setCustomMetric,
  reportType,
  platform,
  customMetric,
  customEditValue,
  setHeader,
  header,
  enableButton,
  triggerDownload,
  hasPermission
}) => {
  let expressionValue;
  let inputCustom;
  if (customMetric === "create") {
    expressionValue = [];
    inputCustom = {
      column_name: "",
      format: "",
      description: "",
    };
  } else {
    expressionValue = customEditValue?.user_expression;
    inputCustom = {
      column_name: customEditValue?.column_name,
      format: customEditValue?.format,
      description: customEditValue?.description,
    };
  }
  const { loading } = useSelector((state) => state.CommonReducer);
  const { generatedreportlist } = useSelector((state) => state.Customreport);
  // console.log("test>>>>>", list);
  const [expression, setExpression] = useState(expressionValue);
  const [inputValues, setInputValues] = useState(inputCustom);
  const [hoveredOption, setHoveredOption] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [errorInName, setErrorInName] = useState(false);

  const dispatch = useDispatch();

  const handleClickOutside = (event) => {
    if (!event.target.dataset.dropdown) setIsOpen(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleOptions = (e) => {
    if (e === isOpen) setIsOpen(false);
    else {
      setIsOpen(e);
    }
  };

  const reset = () => {
    setExpression([]);
    // setQuery("");
  };

  const onInputChange = (event) => {
    const { id, value } = event.target;
    const numericValue = value.replace(/\D/g, "");
    if (value !== numericValue) {
      dispatch(setToastMessageHandler("Only Numbers are allowed", false));
    } else {
      // let test = expression.find((val) => console.log(val));

      setExpression((expression) => {
        return expression.map((val) =>
          val.id === id ? { ...val, formula: numericValue } : val
        );
      });
    }
  };

  // Create a new input object
  const handleInputClick = (id) => {
    const newInput = {
      id: `input-${new Date().getTime().toString(36)}`,
      formula: "",
      input: (
        <input
          type="number"
          id={`input-${new Date().getTime().toString(36)}`}
          key={`input-${new Date().getTime().toString(36)}`}
          className="w-[4rem]"
          value={expression[id]?.formula}
          onChange={onInputChange}
          onKeyPress={(e) => {
            // console.log(e.key);
            if (/[a-zA-Z]/.test(e.key)) {
              dispatch(
                setToastMessageHandler("Only Numbers are allowed", false)
              );
              e.preventDefault();
            }
          }}
        />
      ),
      operator: false,
      action_input: "input",
    };

    let lastExpression = expression[expression.length - 1];
    if (
      (!lastExpression?.action_input &&
        !lastExpression?.only_sum &&
        lastExpression?.title !== ")") ||
      expression.length === 0
    )
      setExpression([...expression, newInput]);
    else dispatch(setToastMessageHandler("Input can't be placed here", false));
    // console.log("expression>>>>>>>>", expression);
    // Add the new input object to the expression state
  };

  const handleParameterChange = (e) => {
    let getLength = expression.length;
    let getPreviousExpression = expression[getLength - 1];
    let newExpression = list.find((val) => val.id == e);
    if (parameterValidation(getLength, getPreviousExpression)) {
      setExpression([...expression, newExpression]);
    } else {
      dispatch(setToastMessageHandler("Parameter can't be placed here", false));
    }
    setIsOpen(false);
  };

  const handleOperatorClick = (operator) => {
    let getLength = expression.length;
    let getPreviousExpression = expression[getLength - 1];

    if (
      operatorValidation(getLength, getPreviousExpression, operator, expression)
    ) {
      setExpression([...expression, operator]);
    } else {
      dispatch(setToastMessageHandler("Operator can't be placed here", false));
    }
  };

  const exchangeOperator = (index, operator) => {
    let changedExpression = operator?.title;
    let getExpressionOfIndex = expression[index]?.title;
    let operatorList = ["+", "-", "*", "/"];
    let operatorIncludes = operatorList.includes(operator?.title);
    let ifExistExspressionIndex = operatorList.includes(getExpressionOfIndex);
    if (expression[index]?.title === operator?.title) {
      setIsOpen(false);
    } else if (operatorIncludes && ifExistExspressionIndex) {
      if (changedExpression === "(") {
        getPreviousExpression;
        if (index > 0) {
          getPreviousExpression = expression[index - 1];
          if (getPreviousExpression?.operator) {
            setExpression((prevState) => {
              const newArray = prevState.map((item, i) =>
                i === index ? operator : item
              );
              return newArray;
            });
            setIsOpen(false);
          } else {
            dispatch(
              setToastMessageHandler(`"(" operator can't be placed here`, false)
            );
          }
        } else {
          setExpression((prevState) => {
            const newArray = prevState.map((item, i) =>
              i === index ? operator : item
            );
            return newArray;
          });
          setIsOpen(false);
        }
      } else if (changedExpression === ")") {
        const lengthUpToIndex = expression.slice(0, index).length;
        if (lengthUpToIndex === 0) {
          dispatch(
            setToastMessageHandler(`")" operator can't be placed here`, false)
          );
        } else {
          const arrayUptoIndex = expression.slice((val, i) => {
            if (i > index) return val;
          });
          if (
            getBracketLength(arrayUptoIndex, "(") >
            getBracketLength(arrayUptoIndex, ")")
          ) {
            setExpression((prevState) => {
              const newArray = prevState.map((item, i) =>
                i === index ? operator : item
              );
              return newArray;
            });
            setIsOpen(false);
          } else {
            dispatch(
              setToastMessageHandler(`")" operator can't be placed here`, false)
            );
          }
        }
      } else {
        setExpression((prevState) => {
          const newArray = prevState.map((item, i) =>
            i === index ? operator : item
          );
          return newArray;
        });
        setIsOpen(false);
      }
    } else {
      dispatch(setToastMessageHandler("Operator can't be placed here", false));
    }
  };

  const handleRemoveClick = (index) => {
    const newExpression = [...expression];
    newExpression.splice(index, 1);
    setExpression(newExpression);
  };

  const generateQueryTest = async () => {
    const lastExpression = expression[expression.length - 1];
    if (!lastExpression?.operator || lastExpression?.title === ")") {
      const newQueryArray = [];
      const formattedQueryArray = [];

      for (let i = 0; i < expression.length; i++) {
        if (expression[i]?.operator) {
          newQueryArray.push({
            id: expression[i].id,
            formula: expression[i].title,
            operator: true,
          });
        } else {
          newQueryArray.push({
            id: expression[i].id,
            formula: expression[i].formula,
            operator: false,
          });
        }
      }
      // console.log("newQueryArray>>>>>>>>>>>>>", newQueryArray);
      let substring = " AS ";

      for (let i = 0; i < newQueryArray.length; i++) {
        if (expression[i]?.operator) {
          if (newQueryArray[i].formula === "/" && newQueryArray[i]) {
            const getPreviousParameter = newQueryArray[i - 1];
            const getNextParameter = newQueryArray[i + 1];
            const { formula: current_formula } = newQueryArray[i];
            const { formula: previous_formula } = getPreviousParameter;
            const { formula: next_formula } = getNextParameter;
            if (previous_formula === ")") {
              const previousValueUntilClose = [];
              let indexForOpenBracket = undefined;
              for (let j = formattedQueryArray.length - 1; j >= 0; j--) {
                if (formattedQueryArray[j] !== "(") {
                  previousValueUntilClose.unshift(formattedQueryArray[j]);
                } else {
                  previousValueUntilClose.unshift(formattedQueryArray[j]);
                  indexForOpenBracket = j;
                  break;
                }
              }

              // Use splice() to remove elements from the end towards the start
              if (indexForOpenBracket > -1) {
                const deleted = formattedQueryArray.splice(
                  indexForOpenBracket,
                  previousValueUntilClose.length
                );
                // console.log("formatted>>>>>>>>>", formattedQueryArray);
                let divisor_index = next_formula
                  .toLowerCase()
                  .indexOf(substring.toLowerCase());

                // Extract the part of the string before the substring
                let divisor = next_formula.substring(0, divisor_index);
                // Find the position of the substring after converting both to lower case

                formattedQueryArray.push(
                  `(CASE WHEN ${divisor} = 0 THEN 0 ELSE (${deleted.join(
                    " "
                  )} ${current_formula} ${divisor}) END) `
                );
                i++;
              }
            } else {
              let divisor_index = next_formula
                .toLowerCase()
                .indexOf(substring.toLowerCase());
              let dividend_index = previous_formula
                .toLowerCase()
                .indexOf(substring.toLowerCase());

              // Extract the part of the string before the substring
              let divisor = next_formula.substring(0, divisor_index);
              // console.log("divisor>>>>>>>>>>", divisor);
              let dividend = previous_formula.substring(0, dividend_index);

              // If the index is found, remove the object at that index
              formattedQueryArray.splice(i - 1, 1);
              // Find the position of the substring after converting both to lower case

              formattedQueryArray.push(
                `(CASE WHEN ${divisor} = 0 THEN 0 ELSE (${dividend} ${current_formula} ${divisor}) END) `
              );
              i++;
            }
          } else {
            formattedQueryArray.push(newQueryArray[i].formula);
          }
        } else if (expression[i]?.action_input) {
          formattedQueryArray.push(newQueryArray[i]?.formula);
        } else {
          if (newQueryArray[i]) {
            let operand_formula = "";
            let current_index = newQueryArray[i].formula
              .toLowerCase()
              .indexOf(substring.toLowerCase());
            // console.log("current_index>>>>>>>>", current_index);
            if (current_index > -1) {
              operand_formula = newQueryArray[i].formula.substring(
                0,
                current_index
              );
              // console.log("formattedquery>>>>>>", operand_formula);
            } else {
              operand_formula = newQueryArray[i].formula;
            }
            formattedQueryArray.push(operand_formula);
          }
        }
      }
      console.log("formattedQuery>>>>>>>>>>>", formattedQueryArray);
      return formattedQueryArray.join(" ");
    } else {
      dispatch(
        setToastMessageHandler("Operator should not be last expression", false)
      );
    }
  };

  const exchangeParameter = (index, id) => {
    let newExpression = list.find((val) => val.id == id);
    setExpression((prevState) => {
      // Create a new array with the updated element
      const newArray = prevState.map((item, i) =>
        i === index ? newExpression : item
      );
      return newArray;
    });

    setIsOpen(false);
  };

  const methodFormation = (item, i) => {
    // if (item?.operator) return item.title;
    if (item?.operator)
      return (
        <div
          key={`operator-${i}`}
          className="parameter-select-container"
          // data-dropdown={true}
        >
          <div
            className="parameter-select-amazon text-[14px]"
            onClick={() => toggleOptions(`custom-operator-${item.id}-${i}`)}
            data-dropdown={true}
          >
            {item.title}
          </div>
          {isOpen === `custom-operator-${item.id}-${i}` && (
            <div className="options-container ">
              {metricOperator.map((option, index) => {
                return (
                  <div
                    key={index}
                    className="parameter-option text-[14px] font-normal"
                    onClick={() => exchangeOperator(i, option)}
                    onMouseEnter={() => setHoveredOption(option.title)}
                    onMouseLeave={() => setHoveredOption(null)}
                    style={{
                      backgroundColor:
                        hoveredOption === option.title ? color : "",
                      color: hoveredOption === option.title ? "#ffffff" : "",
                      padding: "3px 15px",
                    }}
                  >
                    {option.title}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    else if (item?.action_input === "input" && customMetric === "create")
      return (
        <div key={item.id} className="w-auto">
          {item.input}
        </div>
      );
    else if (item?.action_input === "input" && customMetric === "edit")
      return (
        <div key={item.id} className="w-auto">
          <input
            id={item.id}
            key={item.id}
            className={item?.input?.props?.className}
            value={item?.formula}
            onChange={onInputChange}
          />
        </div>
      );
    else
      return (
        <div
          className={`parameter-select-container `}
          id={`custom-parameter-select-${i}`}
          key={`parameter-${i}`}
          // data-dropdown={true}
        >
          <div
            className={`parameter-select-amazon text-[14px]`}
            onClick={() => toggleOptions(`custom-parameter-${item.id}-${i}`)}
            data-dropdown={true}
          >
            {item.column_name}
          </div>
          {isOpen === `custom-parameter-${item.id}-${i}` && (
            <div
              className={`options-container } h-[20vh] ${getPositions(
                `custom-parameter-select-${i}`
              )}`}
            >
              {list.map((option, index) => {
                if (index !== 0)
                  return (
                    <div
                      key={index}
                      className="parameter-option text-[14px] font-normal"
                      onClick={() => exchangeParameter(i, option.id)}
                      onMouseEnter={() => setHoveredOption(option.column_value)}
                      onMouseLeave={() => setHoveredOption(null)}
                      style={{
                        backgroundColor:
                          hoveredOption === option.column_value ? color : "",
                        color:
                          hoveredOption === option.column_value
                            ? "#ffffff"
                            : "",
                      }}
                    >
                      {option.column_name}
                    </div>
                  );
              })}
            </div>
          )}
        </div>
      );
  };

  const checkIfNameExist = async () => {
    try {
      // const ourRequest = await cancelRequest();
      const res = await _POST(
        "/amazon/checkMetricName",
        {
          column_name: inputValues["column_name"].trim(),
          report: reportType,
          platform: platform,
          type: customMetric,
          id: customEditValue?.id,
        }
        // {
        //   cancelToken: ourRequest.token,
        // }
      );
      if (res?.data?.data) {
        if (res?.data?.data.isExist.length > 0) setErrorInName(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const inputHandler = (value, name) => {
    if (name === "column_name" && value.startsWith(" ")) {
      return;
    }
    if (name === "column_name" && value.length > 30) {
      dispatch(
        setToastMessageHandler(
          "Column name cannot exceed 30 characters.",
          false
        )
      );
      return;
    }
    if (name === "description" && value.length > 100) {
      dispatch(
        setToastMessageHandler(
          "Description cannot exceed 200 characters.",
          false
        )
      );
      return;
    }
    setInputValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name === "format") setIsOpen(false);
  };

  const checkFormula = () => {
    for (let i = 0; i < expression.length; i++) {
      const element = expression[i];
      if (element.action_input === "input") {
        if (
          typeof element.formula === "string" &&
          element.formula.trim() !== ""
        ) {
          // Check if the formula includes only numbers
          if (/^\d+$/.test(element.formula)) {
            continue; // Move to the next element
          } else {
            dispatch(
              setToastMessageHandler(
                "Input field only includes numbers.",
                false
              )
            );
            return false; // Formula includes non-numeric characters
          }
        } else {
          dispatch(setToastMessageHandler("Input field is Empty", false));
          return false; // Formula is empty or whitespace
        }
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    // Trim whitespace from input values
    try {
      const query = await generateQueryTest();
      console.log("query>>>>>>>>>>>", query);
      const trimmedValues = Object.fromEntries(
        Object.entries(inputValues).map(([key, value]) => [key, value.trim()])
      );
      const check = checkFormula();

      // Check if any trimmed input value is empty
      const lastExpression = expression[expression.length - 1];
      if (expression.length === 0) {
        dispatch(setToastMessageHandler("No metrics found to create", false));
      } else if (lastExpression?.operator && lastExpression?.title !== ")") {
        dispatch(
          setToastMessageHandler(
            "Operator should not be last expression",
            false
          )
        );
      } else if (!check) return;
      else if (errorInName) {
        dispatch(
          setToastMessageHandler(
            `Metric name ${inputValues["column_name"]} already exist .Try with another name`,
            false
          )
        );
        return;
      } else if (Object.values(trimmedValues).some((value) => !value)) {
        dispatch(setToastMessageHandler("Please fill in all fields.", false));
      } else {
        const ourRequest = await cancelRequest();
        const res = await _POST(
          `/amazon/customMetric`,
          {
            expression: expression,
            report: reportType,
            query,
            inputValues,
            platform,
            customMetric,
            id: customEditValue?.id,
          },
          {
            cancelToken: ourRequest.token,
          }
        );
        if (res?.data.status?.code === 200) {
          dispatch(setToastMessageHandler(res?.data?.data?.message, true));
          if (customEditValue?.id) {
            setHeader((prevItems) => {
              // console.log("Previous items:", prevItems);
              // console.log("Custom edit value ID:", customEditValue?.id);
              // console.log(
              //   "Custom metric data:",
              //   res?.data?.data?.custom_metric
              // );
              const custom_metric = res?.data?.data?.custom_metric;
              return prevItems.map((item) => {
                if (item.id === customEditValue?.id) {
                  console.log("Updating item:", item);
                  const updatedItem = {
                    // ...item,
                    id: custom_metric?.id,
                    title: custom_metric.column_name,
                    value: custom_metric.column_value,
                    showSortButton: true,
                    showColumn: item.showColumn,
                    entity_name: custom_metric.entity_name,
                    is_custom: true,
                    formula: custom_metric.formula || null,
                    format: custom_metric.format || null,
                    type: item.type,
                    description: custom_metric.description || undefined,
                  };

                  console.log("Updated item:", updatedItem);
                  return updatedItem;
                }
                return item;
              });
            });
          }
          await new Promise((resolve) => setTimeout(resolve, 500));

          setCustomMetric();
        } else {
          console.log(res?.data?.status?.message);
          let message = res?.data?.status?.message || "Something went wrong";
          dispatch(setToastMessageHandler(message, false));
        }
      }
    } catch (error) {
      console.error(error, "testError");
    }
  };

  const handledelete = async () => {
    // Trim whitespace from input values
    try {
      const ourRequest = await cancelRequest();
      const res = await _POST(
        `/amazon/delete/customMetric`,
        {
          id: customEditValue?.id,
        },
        {
          cancelToken: ourRequest.token,
        }
      );
      if (res?.data.status?.code === 200) {
        dispatch(setToastMessageHandler(res?.data?.data?.message, true));

        setHeader(header.filter((item) => item.id !== customEditValue?.id));
        await new Promise((resolve) => setTimeout(resolve, 500));
        setCustomMetric();
      } else {
        dispatch(setToastMessageHandler("Something went wrong", false));
      }
    } catch (error) {
      console.error(error, "testError");
    }
  };

  const handleKeyDown = (event) => {
    // Check if the pressed key is a number or a special symbol
    // if (value.length > 30)

    const isNumberOrSpecialSymbol =
      /[0-9~`!@#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/.test(event.key);
    if (isNumberOrSpecialSymbol) {
      dispatch(
        setToastMessageHandler(
          "Special characters or numbers are not allowed",
          false
        )
      );
      event.preventDefault(); // Prevent the default behavior of inputting the character
    }
  };
  return (
    <div
      className={`rightpanel__selected-box flex-grow`}
      id="parent-div"
      style={{
        display: "flex",
        "flex-direction": "column",
        alignItems: "stretch",
      }}
    >
      <div className="border_shadow">
        <div className="bg-[#F8F8F8] py-2 px-4 font-medium text-[18px]">
          Customize Template
        </div>

        <div className="p-2 bg-white ">
          <div className="flex border rounded-t-lg bg-[#dee2e6] justify-between items-center">
            <div className="flex py-2 px-4 font-medium text-[14px]">
              Custom Metric
            </div>
            <div className="py-2 px-4 font-medium text-[14x]">
              <img
                src={`/assets/images/closecustom.svg`}
                alt="close"
                onClick={() => {
                  setCustomMetric();
                }}
                className="ml-2 cursor-pointer w-4 h-4"
              />
            </div>
          </div>

          <div className="flex flex-col border shadow-md overflow-y-auto h-[45vh]">
            <div className=" border-b w-full">
              <div className="flex justify-between w-full items-center pr-2 flex-wrap mb-1">
                <div className={` flex-none mb-1 pt-2 pl-2 pb-2 `}>
                  <div className="parameter-select-container">
                    <div
                      className="parameter-select-amazon py-1 px-7 text-[14px] border border-[#ccc]"
                      onClick={() => toggleOptions("parameter")}
                      data-dropdown={true}
                    >
                      -- Select Metric--
                    </div>
                    {isOpen === "parameter" && (
                      <div className="options-container h-[20vh]">
                        {list.map((option, index) => {
                          if (index !== 0 && !option.is_custom)
                            return (
                              <div
                                key={index}
                                className="parameter-option text-[14px] font-normal"
                                onClick={() => handleParameterChange(option.id)}
                                onMouseEnter={() =>
                                  setHoveredOption(option.column_value)
                                }
                                onMouseLeave={() => setHoveredOption(null)}
                                style={{
                                  backgroundColor:
                                    hoveredOption === option.column_value
                                      ? color
                                      : "",
                                  color:
                                    hoveredOption === option.column_value
                                      ? "#ffffff"
                                      : "",
                                }}
                              >
                                {option.column_name}
                              </div>
                            );
                        })}
                      </div>
                    )}
                  </div>
                </div>
                <div className=" flex-none mb-1 pl-2">
                  <button
                    onClick={() => handleInputClick(expression.length)}
                    className={`px-7 py-1  text-[#ffffff] rounded-md border font-medium text-[14px] font-[#252525]`}
                    style={{ background: color }}
                  >
                    Add Input
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between w-full pr-2 flex-wrap mb-1">
                <div
                  className="flex pb-2 pr-2 pl-2 items-center  pt-2 "
                  // data-dropdown={true}
                >
                  {metricOperator.length > 0 &&
                    metricOperator.map((val) => (
                      <button
                        key={val.id}
                        title={val.title}
                        onClick={() => handleOperatorClick(val)}
                        className="px-3 py-1 bg-[#F6F6F6] text-[#000000] rounded-md border mr-1 font-medium mb-1"
                      >
                        {val.title}
                      </button>
                    ))}
                </div>
                <div className="pl-2">
                  <button
                    onClick={() => reset()}
                    className={`px-7 py-1 text-[#ffffff] rounded-md border font-medium text-[14px]`}
                    style={{ background: color }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-2 p-2">
              <div
                className="flex gap-2 flex-wrap"
                id="outer-custom-formation"
                data-dropdown={true}
              >
                {expression.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 rounded-md px-2 py-1 flex items-center"
                  >
                    {methodFormation(item, index)}
                    <img
                      src={`/assets/images/crossCustom.svg`}
                      alt="cross"
                      onClick={() => handleRemoveClick(index)}
                      className="ml-2 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="my-2 pl-2 pr-2 ">
              {/* <p onClick={generateQueryTest}>Generated Query:</p> */}
              {/* <code>{query}</code> */}
              <div className={`relative  ${errorInName ? "mb-[2.5rem]" : ""}`}>
                <div className={`flex justify-between mt-2 items-center`}>
                  Name
                  <input
                    name="column_name"
                    onChange={(e) =>
                      inputHandler(e.target.value, "column_name")
                    }
                    value={inputValues["column_name"]}
                    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 w-[55%]"
                    onFocus={() => setErrorInName(false)}
                    onBlur={checkIfNameExist}
                    onKeyDown={handleKeyDown}
                    // maxLength={30}
                  />
                </div>
                {errorInName && (
                  <div className="absolute top-full right-0">
                    <div className="bg-white border border-gray-300 rounded-md shadow-md p-1 text-red-500 text-[12px] relative font-medium">
                      <span className="error-message"></span>
                      {/* {`Metric name ${inputValues["column_name"]} already exist! `} */}
                      The Metric name should be unique.
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-between mt-2 items-center">
                Format
                <div className="parameter-select-container w-[55%]">
                  <div
                    id="select-parameters"
                    className="parameter-select-amazon py-2 px-4 border border-[#ccc]"
                    onClick={() => toggleOptions("format")}
                    data-dropdown={true}
                  >
                    {inputValues["format"]
                      ? dropDownCustom.find(
                          (val) => inputValues["format"] === val.value
                        )?.title
                      : "-- Select format--"}
                  </div>
                  {isOpen === "format" && (
                    <div className="options-container">
                      {dropDownCustom.map((option) => (
                        <div
                          key={`format-${option.id}`}
                          className="parameter-option text-[12px] font-normal"
                          onClick={() => inputHandler(option.value, "format")}
                          onMouseEnter={() => setHoveredOption(option.value)}
                          onMouseLeave={() => setHoveredOption(null)}
                          style={{
                            backgroundColor:
                              hoveredOption === option.value ? color : "",
                            color:
                              hoveredOption === option.value ? "#ffffff" : "",
                          }}
                        >
                          {option.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between mt-2 items-center">
                Description
                <textarea
                  name="description"
                  onChange={(e) => inputHandler(e.target.value, "description")}
                  value={inputValues["description"]}
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 w-[55%] flex-wrap flex"
                />
              </div>
            </div>
            <div className=" flex mt-auto mb-3">
              {customMetric !== "create" ? (
                <WhenPermitted platform={platform} permission={PERMISSIONS.CUSTOM_REPORT_ACTION}>
                <div className="flex w-[20%] pl-2 items-center">
                  <img
                    src={`/assets/images/customdelete.png`}
                    alt="cross"
                    onClick={() => handledelete()}
                    className=" w-5 h-5 cursor-pointer"
                  />
                </div>
                </WhenPermitted>
              ) : null}
              <div
                className={`flex  ${
                   customMetric === "create" || !hasPermission ? "w-full" : "w-[80%]"
                } pr-2 justify-end `}
              >
                <button
                  onClick={() => {
                    setCustomMetric();
                  }}
                  className={`px-7 py-2 bg-[#E3E3E3] text-[#5B5B5B] rounded-md border font-medium text-[14px] mr-2`}
                >
                  Cancel
                </button>
                <WhenPermitted platform={platform} permission={PERMISSIONS.CUSTOM_REPORT_ACTION}>
                <button
                  onClick={() => handleSubmit()}
                  className={`px-7 py-2 text-[#ffffff] rounded-md border font-medium text-[14px]`}
                  style={{ background: color }}
                >
                  {customMetric === "create" ? "Add" : "Update"}
                </button>
                </WhenPermitted>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="custom__report_generate bg-white px-2 py-2">
        <NavButton
          name="Generate"
          onClick={generateReport}
          color={color}
          width={"w-full"}
          disabled={
            header.length == 0 ||
            (loading &&
              loading.buttonFlag == ALL_BUTTON_FLAGS.CUSTOMREPORT &&
              loading.state) ||
            enableButton
          }
        />

        <NavButton
          name="Download"
          onClick={triggerDownload}
          width={"w-full"}
          disabled={generatedreportlist?.length == 0}
          color={color}
        />
      </div>
    </div>
  );
};

export default CustomMetric;
