import React, { useEffect, useState } from "react";

import UploadCsv from "./UploadCsv";
import StepProgress from "./StepProgress";
import Steps from "./Steps";
import ThirdStep from "./ThirdStep";
// import { csvCatalogHeaders } from "../../../utils/commonScreenConstant";
import { useDispatch } from "react-redux";
import { setToastMessageHandler } from "../../../redux/action-creator/commonAction";
import { _POST } from "../../../services/axios.method";

import Excel from "exceljs";

const Modals = ({ title, closeModal, importType, selectedRow }) => {
  // console.log("selectedRow>>>>>>>>>>>>", selectedRow);
  const body = {
    mapped: [],
    action: [],
    lockActualColumns: [],
    lockHeadersDropdown: {
      mapped: [],
      action: [],
    },
    data: [],
    duplicate: [],
    exist: [],
    automatedData: [],
    validatedData: [],
    empty: [],
    order: {
      Required: 1,
      "Conditionally Required": 2,
      Recommended: 3,
      Optional: 4,
      Others: 5,
    },
    platformExport: {},
  };
  const [activePriority, setActivePriority] = useState(null);
  const [step, setStep] = useState(0);
  const [platform, setPlatform] = useState(["Amazon"]);
  const [selectedOption, setSelectedOption] = useState(undefined);
  const [npdFileName, setNpdFileName] = useState(undefined);
  const [amazonFileName, setAmazonFileName] = useState(undefined);
  const [activeBody, setActiveBody] = useState(body);
  const [amazonTemplate, setAmazonTemplate] = useState([]);
  const [freeze, freezeChanges] = useState([]);
  const [columnType, setColumnType] = useState("mapped");

  // const [loading, setLoading] = useState(false);

  const operation = {
    action: {
      2: {
        "===": (a, b, c, d) =>
          (a === b || a === "Action Needed" || d === undefined) &&
          c === "required",
      },
      1: {
        "===": (a, b) => a === b || a === "Action Needed",
      },
    },
    mapped: {
      "===": (a, b) => a === b,
    },
    "!==": (a, b) => a !== b,
  };

  const dispatch = useDispatch();

  useEffect(() => {
    if (step === 0 && selectedOption) getTemplate();
    if (step === 2) freezeChanges([]);
  }, [step, selectedOption]);

  useEffect(() => {
    setNpdFileName(undefined);
    setAmazonFileName(undefined);
    setActiveBody(body);
    freezeChanges([]);
    setColumnType("mapped");
  }, [selectedOption]);

  const getTemplate = async () => {
    try {
      const res = await _POST("/catalog/template", { payload: selectedOption });
      if (res?.status === 200) {
        setAmazonTemplate(res?.data?.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownload = (headers, values, name) => {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    worksheet.columns = headers;

    const data = values;

    worksheet.addRows(data);

    workbook.csv.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: "application/octet-stream" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${name}_npd_${Date.now()}.csv`;
      link.click();
    });
  };

  const exportNpd = async () => {
    try {
      // setLoading(true);
      const res = await _POST("/catalog/export", {
        payload: {
          activeBody,
          platform,
        },
      });
      if (res?.status === 200) {
        Object.keys(res?.data?.data).length > 0 &&
          Object.keys(res?.data?.data).map((val, i) =>
            handleDownload(
              Object.values(res?.data?.data)[i]["headers"],
              Object.values(res?.data?.data)[i]["values"],
              val
            )
          );
      }
      // setLoading(undefined);
    } catch (e) {
      console.error(e);
    } finally {
      // setLoading(false);
      // setActiveBody({ ...activeBody, platformExport: {} });
    }
  };

  const uploadCSV = async () => {
    try {
      const { validatedData } = activeBody;
      if (validatedData.length > 0) {
        const res = await _POST("/catalog/create", {
          payload: validatedData,
          type: "new",
        });
        if (res?.status === 200) {
          dispatch(setToastMessageHandler(`Products added successfully`, true));
        } else {
          dispatch(setToastMessageHandler(`Failed to add products`, false));
        }
        closeModal();
      } else {
        dispatch(setToastMessageHandler("No Validate data found", false));
      }
    } catch (e) {
      console.error(e);
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };

  const nextStep = () => {
    // console.log("actibveBody>>>>>>>>>>>>>>", activeBody);
    if (step === 0 && selectedOption) {
      setStep(step + 1);
    } else if (step === 1) {
      if (
        npdFileName &&
        amazonFileName &&
        activeBody?.data.length > 0 &&
        selectedOption === 2
      )
        setStep(step + 1);
      else if ((!npdFileName || !amazonFileName) && selectedOption === 2)
        dispatch(
          setToastMessageHandler(
            !npdFileName
              ? "Please select an NPD file"
              : "Please select an Amazon Template",
            false
          )
        );
      else if (!npdFileName && selectedOption === 1)
        dispatch(setToastMessageHandler("Please select an NPD file", false));
      else if (
        (selectedOption === 2 || selectedOption === 1) &&
        activeBody?.data.length === 0
      ) {
        dispatch(setToastMessageHandler("No data found in NPD File", false));
      } else {
        setStep(step + 1);
      }
    } else if (
      step === 2
      //if Export possible
    ) {
      if (selectedOption === 1) {
        uploadCSV();
      } else if (!freeze.includes("action"))
        dispatch(setToastMessageHandler("Action Needed before export", false));
      else if (activeBody["validatedData"].length === 0)
        dispatch(
          setToastMessageHandler("No valid data is Available to export", false)
        );
      else {
        exportNpd();
      }
    }
  };

  const getIndex = (activeChange, actionType, selectableId) =>
    activeChange[actionType].findIndex((val) => val.id === selectableId);

  const currentAlterOrNpd = (activeChange, actionType, index, value) =>
    activeChange[actionType][index][value];

  const checkNpdExistInAlter = (activeChange, actionType, value) =>
    activeChange[actionType].findIndex(
      (val) => val["alter"]?.toLowerCase() === value.toLowerCase()
    );

  const getActionCurrentIndex = (activeChange, typeDropdown, value) =>
    activeChange[typeDropdown]["action"].findIndex(
      (val) => val.toLowerCase() === value.toLowerCase()
    );

  const valueViaActualColumn = (activeChange, value) =>
    activeChange["lockActualColumns"].findIndex(
      (val) => val?.toLowerCase() === value.toLowerCase()
    );

  const isExist = (field, activeChange, actionType, value, index) =>
    activeChange[actionType].findIndex(
      (val, i) =>
        (val[field]
          ? val[field].toLowerCase() === value.toLowerCase()
          : val["npd"].toLowerCase() === value.toLowerCase()) && index !== i
    );

  const alterOrNpdValue = (
    npdExistInAlterIndex,
    isDoNotMatch,
    presentAlterIndex,
    index,
    alterOrNpd,
    alter
  ) => {
    if (
      npdExistInAlterIndex === -1 &&
      npdExistInAlterIndex !== index &&
      !isDoNotMatch &&
      (presentAlterIndex === -1 || !presentAlterIndex)
    )
      return alterOrNpd;
    else if (presentAlterIndex > -1 && presentAlterIndex === index)
      return alter;
    else return;
  };
  // const getExistAlter = (activeChange, actionType, index) =>
  //   activeChange[actionType][index]["alter"];

  const isRequired = (required, activeChange, actionType, exist) =>
    required.includes(
      activeChange[actionType][exist]["template"].toLowerCase()
    );

  const fromThirdStep = (
    header,
    actionType,
    prevValue,
    value,
    selectableId,
    required
  ) => {
    let presentAlterIndex;
    let activeChange = prevValue;
    const field = header === "npd" ? "alter" : "amazon_mapped";
    let index = null;

    if (header) index = getIndex(activeChange, actionType, selectableId);
    if (actionType === "mapped") {
      const alter = currentAlterOrNpd(activeChange, actionType, index, "alter");
      const isDoNotMatch = alter === "Do not Match";
      const npd = currentAlterOrNpd(activeChange, actionType, index, "npd");
      const actionCurrentIndex = getActionCurrentIndex(
        activeChange,
        "lockHeadersDropdown",
        value
      );
      const alterOrNpd = alter && isDoNotMatch ? alter : npd;
      const exist = isExist(field, activeChange, actionType, value, index);

      const npdExistInAlterIndex = checkNpdExistInAlter(
        activeChange,
        actionType,
        npd
      );

      if (alter && alter !== "Do not Match") {
        presentAlterIndex = checkNpdExistInAlter(
          activeChange,
          actionType,
          alter
        );
      }

      if (value === "Do not Match") {
        activeChange["lockHeadersDropdown"]["action"].push(
          activeChange["lockActualColumns"][
            valueViaActualColumn(activeChange, alter ? alter : npd)
          ]
        );
      } else {
        if (actionCurrentIndex > -1) {
          activeChange["lockHeadersDropdown"]["action"].splice(
            actionCurrentIndex,
            1
          );
        }

        const whichValue = alterOrNpdValue(
          npdExistInAlterIndex,
          isDoNotMatch,
          presentAlterIndex,
          index,
          alterOrNpd,
          alter
        );

        if (whichValue)
          activeChange["lockHeadersDropdown"]["action"].push(
            activeChange["lockActualColumns"][
              valueViaActualColumn(activeChange, whichValue)
            ]
          );

        if (exist > -1)
          activeChange[actionType][exist]["alter"] = "Do not Match";
      }
      activeChange[actionType][index]["alter"] = value;

      setActiveBody({ ...activeChange });
    } else if (actionType === "action") {
      activeChange[actionType][index][field] = value;
      if (value !== "Do not Match") {
        const exist = isExist(field, activeChange, actionType, value, index);
        if (field === "alter") {
          const doSameValueExist = getActionCurrentIndex(
            activeChange,
            "lockAmazonHeadersDropdown",
            value
          );
          const existInAmazonMapped = isExist(
            "amazon_mapped",
            activeChange,
            actionType,
            value,
            index
          );
          if (doSameValueExist > -1) {
            activeChange[actionType][index]["amazon_mapped"] = value;

            if (existInAmazonMapped > -1)
              if (
                !isRequired(
                  required,
                  activeChange,
                  actionType,
                  existInAmazonMapped
                )
              ) {
                activeChange[actionType][existInAmazonMapped]["amazon_mapped"] =
                  "Do not match";
              } else
                activeChange[actionType][existInAmazonMapped]["amazon_mapped"] =
                  "Action Needed";
          }
        }
        if (exist > -1) {
          if (!isRequired(required, activeChange, actionType, exist)) {
            activeChange[actionType][exist][field] = "Do not match";
          } else activeChange[actionType][exist][field] = "Action Needed";
        }
      }
      setActiveBody({ ...activeChange });
    } else setActiveBody(prevValue);
  };

  const getAlterBody = (type, match, op, option) =>
    activeBody[type].filter((val) =>
      type === "action"
        ? operation[type][option][op](
            val.alter,
            match,
            val.priority,
            val.amazon_mapped
          )
        : operation[type][op](val.alter, match)
    );

  const createDataToPush = (activeChange, body, match) =>
    activeChange.filter(
      (outer) => !body[match].find((inner) => outer["value"] === inner["value"])
    );

  const getIndexToRemove = (activeChange, body) =>
    body.findIndex((inner) => inner["value"] === activeChange["value"]);

  const deleteFromBody = (whatToPush, body, match) => {
    for (let i = 0; i < whatToPush.length; i++) {
      let outer = whatToPush[i];
      for (let j = 0; j < body[match].length; j++) {
        let inner = body[match][j];

        if (outer["value"] === inner["value"]) {
          body[match].splice(j, 1);
        }
      }
    }
    return body;
  };

  const findElement = (mapped, prop) =>
    mapped.find((element) =>
      element?.alter
        ? element?.alter.toLowerCase() === prop.toLowerCase()
        : element?.npd.toLowerCase() === prop.toLowerCase()
    );

  const getProcessedData = (body) => {
    let valuesArray = [];
    for (let i = 0; i < body["data"].length; i++) {
      let obj = body["data"][i];
      let updatedObject = {};
      for (const prop in obj) {
        const element = findElement(body["mapped"], prop);
        updatedObject[element?.value] = obj[prop];
      }
      updatedObject["***"] = i + 1;
      valuesArray.push(updatedObject);
    }
    return valuesArray;
  };

  const validateData = async () => {
    try {
      const body = { ...activeBody };
      let processedData = getProcessedData(body);

      const res = await _POST("/catalog/validate", {
        payload: processedData,
        type: "new",
      });
      if (res?.status === 200) {
        const {
          duplicateInCsv: duplicate,
          DBError: exist,
          validatedData,
          failedValidation: empty,
        } = res?.data?.data || {
          duplicateInCsv: [],
          DBError: [],
          validateData: [],
          failedValidation: [],
        };
        setActiveBody({
          ...body,
          automatedData: processedData,
          duplicate,
          exist,
          validatedData,
          empty,
        });
        setColumnType("duplicate");
      }
      // setLoading(undefined);
    } catch (e) {
      console.error(e);
      // dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };

  const freezeAlteration = (val, type) => {
    //type:FREEZE OR UNFREEZE & VAL : MAPPED OR ACTION
    if (type === "freeze") {
      const body = { ...activeBody };

      let whatToPush = [];
      if (val === "mapped") {
        const activeChange = getAlterBody(val, "Do not match", "===");
        if (activeChange.length > 0) {
          whatToPush = createDataToPush(activeChange, body, "action");
          for (let i = 0; i < whatToPush.length; i++) {
            let outer = whatToPush[i];
            body["action"].push({
              template: outer.template,
              value: outer.value,
              id: outer.id,
              npd: "Action Needed",
              alter: undefined,
              amazon_mapped: undefined,
              priority: outer?.priority,
              origin: outer?.origin,
              required: outer?.required,
            });
          }

          for (let j = 0; j < activeChange.length; j++) {
            let outer = activeChange[j];
            let removeIndex = getIndexToRemove(outer, body["mapped"]);
            body["mapped"].splice(removeIndex, 1);
          }
        }
        freezeChanges([...freeze, val]);
        if (body["action"].length === 0) validateData();
      } else if (val === "action") {
        const actionNeeded = getAlterBody(
          val,
          undefined,
          "===",
          selectedOption
        );
        if (actionNeeded?.length > 0) {
          dispatch(
            setToastMessageHandler("Action Needed before freezing", false)
          );
        } else {
          const isFreeze = [...freeze];

          whatToPush = createDataToPush(body["action"], body, "mapped");
          whatToPush.map((outer) => body["mapped"].push(outer));
          const filteredBody = deleteFromBody(whatToPush, body, "action");
          setActiveBody({ ...filteredBody });
          validateData();
          if (!isFreeze.includes("mapped")) isFreeze.push("mapped");
          if (!isFreeze.includes("action")) isFreeze.push("action");
          freezeChanges(isFreeze);
          setActivePriority(null);
        }
      }
    } else {
      freezeChanges((prevState) =>
        prevState.filter((prevItem) => prevItem !== val)
      );
    }
  };

  const setCheckbox = (e) => {
    if (platform.includes(e.target.value)) {
      // Value exists, remove it
      const newArray = platform.filter((item) => item !== e.target.value);
      setPlatform(newArray);
    } else {
      // Value doesn't exist, push it
      setPlatform([...platform, e.target.value]);
    }
  };

  return (
    <>
      <div className="popup popup--rightSide">
        <div className="popup__container popup__container--rightSide max-w-[60%] h-[100vh]  bg-[#f0f2f5]">
          <div
            className={["popup__heading popup__heading--rightside"].join(" ")}
          >
            <div className="row justify-between items-center">
              <div>
                <div className="row flex align-middle gap-x-4">
                  <div>
                    <i
                      className="fa fa-times cursor-pointer"
                      onClick={() => {
                        closeModal(false);
                      }}
                    ></i>
                    <b className="ml-[10px]">{title}</b>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between align-middle gap-x-2">
                  <button
                    className="p-[5px]"
                    onClick={() => {
                      if (step === 0) {
                        closeModal(false);
                      } else {
                        setStep(step - 1);
                      }
                    }}
                  >
                    {step > 0 ? "Previous" : "Cancel"}
                  </button>
                  {importType === "new" && (
                    <button
                      className={` bg-[#0081F7] rounded-md px-[10px] text-[#fff] ${
                        !selectedOption && "cursor-not-allowed"
                      }`}
                      onClick={() => {
                        nextStep();
                      }}
                      disabled={!selectedOption}
                    >
                      {selectedOption === 2 && step === 2 ? "Export" : "Next"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="popup__content popup__content--rightside bg-[#f0f2f5] p-[0px] border-b-[0px] mb-[20px] h-[90vh] max-h-[90vh]">
            <div className="px-[3%] my-[2rem] ">
              <div
                className={`flex border-[1px] bg-[#fff] items-center ${
                  importType === "existing" && "justify-center"
                } rounded-md`}
              >
                {importType === "new" && (
                  <>
                    {step === 0 && (
                      <div className="rounded-md p-[1rem] mb-[4rem]">
                        <div>
                          <p className="text-[16px]">
                            <b>What would you like to do?</b>
                          </p>
                          <p className="text-[#A4A4A4]">
                            {/* Client selected : {"Dettol"} | Number of products
                            300 */}
                          </p>
                        </div>
                        <div className="mt-[1rem]">
                          <fieldset>
                            <div>
                              <label className="text-[15px] align-middle">
                                <input
                                  type="radio"
                                  name="option"
                                  className="mr-[10px] align-middle"
                                  onClick={() => setSelectedOption(1)}
                                  checked={selectedOption === 1}
                                />
                                Upload a new NPD Existing Product Data(CSV)
                              </label>
                              <p className="ml-[25px] text-[#c7c7c7]">
                                Upload the NPD in any format
                              </p>
                            </div>
                            <div className="mt-[1rem]">
                              <label className="text-[15px] align-middle">
                                <input
                                  type="radio"
                                  name="option"
                                  className="mr-[10px] align-middle"
                                  onClick={() => setSelectedOption(2)}
                                  checked={selectedOption === 2}
                                />
                                Upload a new NPD and Download Filled Template
                                for New Products (NPI)
                              </label>
                              <p className="ml-[25px] text-[#c7c7c7]">
                                Choose this option if you want to add the NPD
                                details and download the NPI (New Product
                                Introduction) template.
                              </p>
                            </div>
                          </fieldset>
                        </div>
                      </div>
                    )}
                    {step > 0 && <StepProgress step={step} />}
                  </>
                )}
                {importType === "existing" && (
                  <UploadCsv
                    closeModal={closeModal}
                    title={title}
                    importType={importType}
                    selectedRow={selectedRow}
                  ></UploadCsv>
                )}
              </div>
              {step > 0 && (
                <div
                  className={`flex border-[1px] bg-[#fff] items-center rounded-md mt-[1rem]`}
                >
                  <Steps
                    step={step}
                    amazonTemplate={amazonTemplate["headers"]}
                    npdFileName={npdFileName}
                    setNpdFileName={(e) => {
                      if (e) setNpdFileName(e);
                      else if (step === 2) {
                        setNpdFileName(e);
                        setActiveBody({ ...activeBody, body });
                        setStep(step - 1);
                      } else setNpdFileName(e);
                    }}
                    amazonFileName={amazonFileName}
                    setAmazonFileName={(e) => setAmazonFileName(e)}
                    selectedOption={selectedOption}
                    activeBody={activeBody}
                    setActiveBody={(
                      csvHeaders,
                      mapped,
                      action,
                      data,
                      template
                    ) => {
                      // console.log("csv>>>>>>>>>>>>>>>>>", csvHeaders);
                      if (mapped.length > 0) setColumnType("mapped");
                      else setColumnType("action");
                      setActiveBody({
                        ...activeBody,
                        mapped: mapped.map((valOuter) => {
                          const findElement = amazonTemplate["headers"].filter(
                            (element) =>
                              valOuter.toLowerCase() ===
                              element.title.toLowerCase()
                          );
                          let priorityElement = [];
                          if (template) {
                            priorityElement = template.filter(
                              (val) =>
                                val.title.toLowerCase() ===
                                valOuter.toLowerCase()
                            );
                          }

                          return {
                            template: findElement[0]?.title,
                            value: findElement[0]?.value,
                            id: findElement[0]?.id,
                            npd: valOuter,
                            alter: undefined,
                            amazon_mapped: undefined,
                            priority:
                              selectedOption === 2
                                ? priorityElement.length > 0
                                  ? priorityElement[0].priority.toLowerCase()
                                  : "Others"
                                : "Required",
                            origin: findElement[0]?.origin,
                            required: findElement[0].required ? true : false,
                          };
                        }),

                        lockActualColumns: csvHeaders["npdFields"],
                        lockHeadersDropdown: {
                          mapped: csvHeaders["npdFields"],
                          action:
                            selectedOption === 2
                              ? csvHeaders["npdFields"].filter(
                                  (csvColumns) =>
                                    !amazonTemplate["headers"].some(
                                      (templateColumn) =>
                                        csvColumns.toLowerCase() ===
                                        templateColumn.title.toLowerCase()
                                    ) ||
                                    !csvHeaders["amazonFields"].some(
                                      (templateColumn) =>
                                        csvColumns.toLowerCase() ===
                                        templateColumn.toLowerCase()
                                    )
                                )
                              : csvHeaders["npdFields"].filter(
                                  (csvColumns) =>
                                    !amazonTemplate["headers"].some(
                                      (templateColumn) =>
                                        csvColumns.toLowerCase() ===
                                        templateColumn.title.toLowerCase()
                                    )
                                ),
                        },

                        lockAmazonActualColumns:
                          selectedOption === 2
                            ? csvHeaders["amazonFields"]
                            : [],
                        lockAmazonHeadersDropdown:
                          selectedOption === 2
                            ? {
                                mapped: template.map((val) => val.title),
                                action: csvHeaders["amazonFields"].filter(
                                  (csvColumns) =>
                                    !amazonTemplate["headers"].some(
                                      (templateColumn) =>
                                        csvColumns.toLowerCase() ===
                                        templateColumn.title.toLowerCase()
                                    ) ||
                                    !csvHeaders["npdFields"].some(
                                      (templateColumn) =>
                                        csvColumns.toLowerCase() ===
                                        templateColumn.toLowerCase()
                                    )
                                ),
                              }
                            : { mapped: [], action: [] },

                        action: action.map((valOuter) => {
                          let findElement = amazonTemplate["headers"].filter(
                            (element) =>
                              valOuter.toLowerCase() ===
                              element.title.toLowerCase()
                          );
                          let priorityElement = [];
                          if (template) {
                            priorityElement = template.filter(
                              (val) =>
                                val.title.toLowerCase() ===
                                valOuter.toLowerCase()
                            );
                          }

                          return {
                            template: findElement[0]?.title,
                            value: findElement[0]?.value,
                            id: findElement[0]?.id,
                            npd: "Action Needed",
                            alter: undefined,
                            amazon_mapped: undefined,
                            priority:
                              selectedOption === 2
                                ? priorityElement.length > 0
                                  ? priorityElement[0].priority.toLowerCase()
                                  : "Others"
                                : "Required",
                            origin:
                              selectedOption === 2
                                ? findElement[0]?.origin
                                : selectedOption,
                            required:
                              selectedOption === 2
                                ? findElement[0].required
                                  ? true
                                  : false
                                : selectedOption,
                          };
                        }),
                        platformExport: {},
                        template: template,
                        data: data,
                      });
                    }}
                    freezeChanges={() => freezeChanges([])}
                  />
                </div>
              )}
              {step > 1 && (
                <>
                  <div
                    className={`border-[1px] bg-[#fff] items-center rounded-md mt-[1rem]`}
                  >
                    <ThirdStep
                      step={step}
                      selectedOption={selectedOption}
                      activePriority={activePriority}
                      setActivePriority={setActivePriority}
                      activeBody={activeBody}
                      amazonTemplate={amazonTemplate["headers"]}
                      setActiveBody={(
                        header,
                        actionType,
                        changeData,
                        value,
                        index,
                        required
                      ) =>
                        fromThirdStep(
                          header,
                          actionType,
                          changeData,
                          value,
                          index,
                          required
                        )
                      }
                      columnType={columnType}
                      setColumnType={(e) => {
                        setColumnType(e);
                        if (e === "duplicate") {
                          validateData();
                        }
                      }}
                      freeze={freeze}
                      freezeChanges={(val, type) => {
                        freezeAlteration(val, type);
                      }}
                    />
                  </div>
                  {selectedOption === 2 && (
                    <div
                      className={` flex flex-wrap bg-[##ebedf0]  p-[1rem] gap-x-2.5`}
                    >
                      <div className="mr-[5px]">Download For</div>

                      <div className={`p-[1px] mr-[5px]`}>
                        <input
                          type="checkbox"
                          id="Amazon"
                          name="Amazon"
                          value="Amazon"
                          checked={platform.includes("Amazon")}
                          onClick={setCheckbox}
                          style={{ marginRight: 5, cursor: "pointer" }}
                        />
                        <label htmlFor="Amazon">Amazon</label>
                      </div>
                      <div className={`p-[1px] mr-[5px]`}>
                        <input
                          type="checkbox"
                          id="Flipkart"
                          name="Flipkart"
                          value="Flipkart"
                          checked={platform.includes("Flipkart")}
                          onClick={setCheckbox}
                          style={{ marginRight: 5, cursor: "pointer" }}
                        />
                        <label htmlFor="Flipkart">Flipkart</label>
                      </div>
                      <div className={`p-[1px] mr-[5px]`}>
                        <input
                          type="checkbox"
                          id="Blinkit"
                          name="Blinkit"
                          value="Blinkit"
                          checked={platform.includes("Blinkit")}
                          onClick={setCheckbox}
                          style={{ marginRight: 5, cursor: "pointer" }}
                        />
                        <label htmlFor="Blinkit">Blinkit</label>
                      </div>
                      <div className={`p-[1px] mr-[5px]`}>
                        <input
                          type="checkbox"
                          id="Zepto"
                          name="Zepto"
                          value="Zepto"
                          checked={platform.includes("Zepto")}
                          onClick={setCheckbox}
                          style={{ marginRight: 5, cursor: "pointer" }}
                        />
                        <label htmlFor="Zepto">Zepto</label>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modals;
