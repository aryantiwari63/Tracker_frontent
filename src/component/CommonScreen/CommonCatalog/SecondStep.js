import React, { useState, useEffect } from "react";
// import { csvCatalogHeaders } from "../../../utils/commonScreenConstant";
import { CSVLink } from "react-csv";
import { HiDownload } from "react-icons/hi";
import { useDispatch } from "react-redux";
import Papa from "papaparse";
import Excel from "exceljs";
import * as XLSX from "xlsx/xlsx.mjs";
import { setToastMessageHandler } from "../../../redux/action-creator/commonAction";

const SecondStep = ({
  step,
  npdFileName,
  setNpdFileName,
  amazonFileName,
  setAmazonFileName,
  activeBody,
  setActiveBody,
  freezeChanges,
  selectedOption,
  amazonTemplate,
}) => {
  // console.log("amazon>>>>>>>>>>>>>>", amazonTemplate);
  const typeAllowed = [".csv", ".xlsx", ".xlsm"];
  const [npdFile, setNpdFile] = useState({
    mapped: [],
    actionNeeded: [],
    data: [],
    fields: [],
  });
  const [amazonFile, setAmazonFile] = useState({
    mapped: [],
    actionNeeded: [],
    fields: [],
    templateFields: [],
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (amazonFileName && npdFileName && selectedOption === 2)
      compareNpdWithAmazon();
  }, [amazonFileName, npdFileName, selectedOption]);

  const validateHeaders = (npd, actualFields) =>
    actualFields.filter((element) => npd.includes(element));

  const getMapped = (fields, template) =>
    validateHeaders(
      fields.map((val) => val.toLowerCase()),
      template.map((val) => val.title.toLowerCase())
    );

  const getAction = (fields, template) =>
    template
      .map((val) => val.title.toLowerCase())
      .filter(
        (element) =>
          !fields.map((field) => field.toLowerCase()).includes(element)
      );

  const setDatasetNpd = (fieldsnpd, data) => {
    let mapped = getMapped(fieldsnpd, amazonTemplate);
    // console.log(mapped, "fieldsNpd>>>>>>>>>>>", fieldsnpd);
    let actionNeeded = getAction(fieldsnpd, amazonTemplate);
    if (data.length === 0)
      dispatch(setToastMessageHandler("No data found in selected File", false));
    setNpdFile({
      ...npdFile,
      mapped,
      actionNeeded,
      data,
      fields: fieldsnpd,
    });

    if (selectedOption === 1) {
      const fields = {
        npdFields: fieldsnpd,
        amazonFields: [],
      };
      setActiveBody(fields, mapped, actionNeeded, data);
    }
  };

  const setDatasetAmazon = (fields, templateFields) => {
    let mapped = getMapped(fields, amazonTemplate);
    let actionNeeded = getAction(fields, amazonTemplate);
    setAmazonFile({
      ...amazonFile,
      mapped,
      actionNeeded,
      fields,
      templateFields,
    });
  };

  function comparePriority(a, b) {
    if (a && b) {
      return (
        activeBody.order[a.priority.toLowerCase()] -
        activeBody.order[b.priority.toLowerCase()]
      );
    }
  }

  const parentMethod = ({ fields, mapped, actionNeeded, data }) => {
    freezeChanges();

    // Sort the elements based on the requirements
    let action = actionNeeded.sort((a, b) =>
      comparePriority(
        amazonFile["templateFields"].find(
          (item) => item.title.toLowerCase() === a.toLowerCase()
        ),
        amazonFile["templateFields"].find(
          (item) => item.title.toLowerCase() === b.toLowerCase()
        )
      )
    );
    let map = mapped.sort((a, b) =>
      comparePriority(
        amazonFile["templateFields"].find(
          (item) => item.title.toLowerCase() === a.toLowerCase()
        ),
        amazonFile["templateFields"].find(
          (item) => item.title.toLowerCase() === b.toLowerCase()
        )
      )
    );
    setActiveBody(fields, map, action, data, amazonFile["templateFields"]);
  };

  const compareNpdWithAmazon = () => {
    const overAll = {
      actionNeeded: [],
      mapped: [],
    };

    // IF FIELDS ARE LESS (NEED TO DO)
    overAll["fields"] = {
      npdFields: npdFile?.fields || [],
      amazonFields: amazonFile?.fields || [],
    };
    overAll["data"] = npdFile?.data;
    overAll["mapped"] =
      npdFile?.mapped.length === 0 || amazonFile?.mapped.length === 0
        ? []
        : validateHeaders(npdFile?.mapped, amazonFile?.mapped);

    const actionNeeded = npdFile?.actionNeeded;
    for (let i = 0; i < amazonFile?.actionNeeded.length; i++) {
      let outer = amazonFile?.actionNeeded[i];
      if (actionNeeded.indexOf(outer) < 0) actionNeeded.push(outer);
    }

    overAll["actionNeeded"] = npdFile["actionNeeded"];
    parentMethod(overAll);
  };

  const getSecondSheet = (secondSheet, firstSheet) => {
    let data = [];
    let secondSheetFields = [];
    let iteration = secondSheet ? secondSheet : firstSheet;
    iteration.eachRow((row, rowIndex) => {
      if (rowIndex === 1) {
        // const lowerValues = row.values.map((val) => val.toLowerCase());
        let findIndex = row.values.findIndex((val) => val === "Attributes");
        secondSheetFields = row.values;
        while (secondSheetFields[0] === undefined) {
          secondSheetFields.shift();
        }
        if (findIndex > -1)
          secondSheetFields.splice(
            0,
            findIndex === 1 ? findIndex + 1 : findIndex
          );
      }
      //  else if (
      //   firstSheet.length !== secondSheetFields.length &&
      //   numberOfSheets > 1
      // )
      //   return false;
      else {
        const filteredData = row.values;

        while (filteredData[0] === undefined) {
          filteredData.shift();
        }
        let obj = {};
        for (let i = 0; i < filteredData.length; i++) {
          let outer = filteredData[i];
          obj[firstSheet[i]] = outer;
        }

        data.push(obj);
      }
    });
    return data;
  };

  const fileHandlerNpd = (file, name) => {
    const fileExt = name.substring(name.lastIndexOf("."));

    if (typeAllowed.indexOf(fileExt) < 0) {
      dispatch(setToastMessageHandler("Only Excel Files are allowed", false));
      return false;
    }
    if (typeAllowed.indexOf(fileExt) === 0)
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async function (results) {
          const { data, meta } = results;
          const { fields } = meta;
          setNpdFileName(name);
          setDatasetNpd(fields, data, name);
        },
      });
    else if (typeAllowed.indexOf(fileExt) === 1) {
      const wb = new Excel.Workbook();
      const reader = new FileReader();
      let firstSheetFields = [];
      let data = [];
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        const buffer = reader.result;
        wb.xlsx.load(buffer).then((workbook) => {
          const numberOfSheets = workbook.worksheets.length;
          const firstSheet = workbook.getWorksheet(1);
          // console.log(
          //   "numberOfSheets>>>>>>>",
          //   numberOfSheets,
          //   "firstSheet>>>>>>",
          //   firstSheet
          // );
          if (numberOfSheets === 1) {
            firstSheet.eachRow((row, index) => {
              if (index === 1) {
                firstSheetFields = row.values;
              }
              // const filteredData = row.values;
              else {
                let obj = {};
                for (let i = 0; i < firstSheetFields.length; i++) {
                  let outer = row.values[i];
                  obj[firstSheetFields[i]] = outer;
                }
                data.push(obj);
              }
            });
          } else if (numberOfSheets > 1) {
            firstSheet.eachRow((row) => {
              if (row.values.includes("Attributes")) {
                firstSheetFields = row.values;
                while (firstSheetFields[0] === undefined) {
                  firstSheetFields.shift();
                }
                let findIndex = row.values.findIndex(
                  (val) => val === "Attributes"
                );
                if (findIndex > -1) {
                  firstSheetFields.splice(0, findIndex);
                }
              }
            });

            const secondSheet = workbook.getWorksheet(2);

            data = getSecondSheet(
              secondSheet,
              firstSheetFields,
              numberOfSheets
            );
          } else {
            data = getSecondSheet(undefined, firstSheet, numberOfSheets);
          }
          // console.log("data>>>>>>>>>>>>>>>>", data);
          setNpdFileName(name);
          setDatasetNpd(firstSheetFields, data);
        });
      };
    }
  };

  const fileHandlerAmazon = async (file, name) => {
    try {
      const fileExt = name.substring(name.lastIndexOf("."));
      if (typeAllowed.indexOf(fileExt) !== 2) {
        dispatch(setToastMessageHandler("Only Excel Files are allowed", false));
        return false;
      } else if (typeAllowed.indexOf(fileExt) === 2) {
        let reader = new FileReader();
        reader.onloadend = async function () {
          let sheet = undefined;
          let arrayBuffer = reader.result;
          let options = { bookVBA: true };
          let workbook = XLSX.read(arrayBuffer, options);
          let sheetName = workbook.SheetNames.filter((val) =>
            val.toLowerCase().startsWith("template-")
          );
          if (sheetName.length > 0) {
            sheet = workbook.Sheets[sheetName[0]];
          }
          const range = XLSX.utils.decode_range(sheet["!ref"]);

          const values = [];
          const fields = [];
          const titleCounts = {};
          for (let C = range.s.c; C <= range.e.c; ++C) {
            const cell_address_third_row = { c: C, r: 2 };
            const cell_ref_third_row = XLSX.utils.encode_cell(
              cell_address_third_row
            );
            const cell_value_third_row = sheet[cell_ref_third_row]
              ? sheet[cell_ref_third_row].v
              : undefined;

            const cell_address_fourth_row = { c: C, r: 4 };
            const cell_ref_fourth_row = XLSX.utils.encode_cell(
              cell_address_fourth_row
            );
            const isRequired = sheet[cell_ref_fourth_row]
              ? sheet[cell_ref_fourth_row].v
              : undefined;

            const count = titleCounts[cell_value_third_row] || 0;
            titleCounts[cell_value_third_row] = count + 1;

            const uniqueTitle =
              count > 0
                ? `${cell_value_third_row}_${count}`
                : cell_value_third_row;
            if (uniqueTitle) {
              const cellObject = {
                priority: isRequired,
                title: uniqueTitle,
                value: uniqueTitle
                  .trim()
                  .toLowerCase()
                  .replace(/\s+/g, " ")
                  .split(" ")
                  .join("_"),
              };
              fields.push(uniqueTitle);
              values.push(cellObject);
            }
          }
          setAmazonFileName(name);
          // console.log("values>>>>>>>>>>>", values);
          setDatasetAmazon(fields, values);
        };
        reader.readAsArrayBuffer(file);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {step === 1 && (
        <>
          <div>
            <p className="text-[16px]">
              <b>How to prepare your NPD</b>
            </p>
            <p className="text-[#A4A4A4]">
              {`To ensure successful processing, your NPD CSV file must include
              primary identifiers. For your convenience, you can download the
              E-Genie template to ensure the correct format. Files without these
              identifiers won't be considered as NPD files.`}
            </p>
          </div>
          <CSVLink
            data={[]}
            headers={amazonTemplate.map((row) => ({
              label: row.title,
              key: row.value,
            }))}
            filename={`sample_${Date.now()}.csv`}
          >
            <button className="rounded bg-[#EFF1F2] border flex items-center px-3 py-1 color-white w-[auto] my-[1rem]">
              <HiDownload className="" />
              &nbsp;&nbsp;
              <span> Download the CSV template </span>
            </button>
          </CSVLink>
          <div>
            <p className="text-[16px]">
              <b>Primary Identifiers</b>
            </p>
            <div className="flex mt-[1rem]">
              <div className="border-[1px] py-[2px] px-[1rem] rounded mr-[1rem]">
                External Product Id &nbsp;&nbsp;
                <i className="fa fa-info-circle" aria-hidden="true"></i>
              </div>
              <div className="border-[1px] py-[2px] px-[1rem] rounded mr-[1rem]">
                Item Name &nbsp;&nbsp;
                <i className="fa fa-info-circle" aria-hidden="true"></i>
              </div>
              <div className="border-[1px] py-[2px] px-[1rem] rounded mr-[1rem]">
                Product MRP &nbsp;&nbsp;
                <i className="fa fa-info-circle" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        </>
      )}
      {step === 2 && (
        <div>
          <p className="text-[16px]">
            <b>
              <i className="fa fa-exclamation-triangle text-[red]"></i>
              &nbsp;&nbsp;Alert
            </b>
          </p>
          <p className="text-[#A4A4A4]">
            {`Attention! We couldn't find sufficient Primary identifiers to
            establish a solid match.`}
          </p>
        </div>
      )}
      <div className={`${step === 1 ? "mt-[1rem]" : ""}`}>
        {step === 1 && (
          <p className="text-[16px]">
            <b>{"Upload NPD"}</b>
          </p>
        )}
        <div className="flex">
          <div
            className={`file-uploader flex place-content-between `}
            style={{ width: step === 1 ? "25%" : "40%" }}
          >
            {step === 1 ? "Upload File" : "Upload New NPD File"}
            &nbsp;&nbsp;
            <i className="fa fa-upload mt-[2px]"></i>
          </div>
          <input
            type="file"
            // eslint-disable-next-line react/no-unknown-property
            single
            style={{
              marginLeft: step === 1 ? "-25%" : "-40%",
              width: step === 1 ? "25%" : "40%",
            }}
            id="upload-button"
            className="input-upload"
            accept="text/csv,.xlsx"
            onChange={(e) => {
              if (e.target.files.length > 0)
                fileHandlerNpd(e.target.files[0], e.target.files[0].name);
            }}
          />
          &nbsp;&nbsp;&nbsp;
          {npdFileName && (
            <div className={`flex pt-1 justify-center mt-2`}>
              <b>File</b> - {npdFileName}
              <b
                className="px-4 cursor-pointer"
                onClick={() => {
                  document.getElementById("upload-button").value = null;
                  setNpdFileName(undefined);
                }}
              >
                X
              </b>
            </div>
          )}
        </div>
        {step === 1 && selectedOption === 2 && (
          <div className="flex flex-col mt-[1rem]">
            <p className="text-[16px]">
              <b>Select Amazon Template</b>
            </p>
            <div className="flex justify-between mt-[1rem]">
              {/* <div className="flex justify-start w-[50%]">
                <div
                  className="flex w-[80%] rounded-sm h-8 justify-between cursor-pointer"
                  style={{ border: "2px solid #eff1f2" }}
                >
                  <select
                    className="w-[90%] cursor-pointer"
                    style={{ borderRight: "2px solid #eff1f2" }}
                    onChange={(e) => {
                      this.setState({ groupGraph: e.target.value });
                    }}
                  >
                    <option selected={"day"} value="day">
                      Daily
                    </option>
                  </select>
                  <i className="fa fa-download  mx-auto mt-[5px] cursor-pointer"></i>
                </div>
              </div> */}
              <div className="flex w-[100%] flex justify-start">
                <div
                  className={`file-uploader flex place-content-between h-8 `}
                  style={{
                    width: "25%",
                    marginTop: 0,
                    height: "2rem",
                  }}
                >
                  Upload template &nbsp;&nbsp;
                  <i className="fa fa-upload mt-[2px]"></i>
                </div>
                <input
                  type="file"
                  // eslint-disable-next-line react/no-unknown-property
                  single={true}
                  style={{
                    marginLeft: "-25%",
                    width: "25%",
                    marginTop: 0,
                    height: "2rem",
                  }}
                  id="upload-button"
                  className="input-upload "
                  accept=".xlsm"
                  onChange={(e) => {
                    if (e.target.files.length > 0)
                      fileHandlerAmazon(
                        e.target.files[0],
                        e.target.files[0].name
                      );
                  }}
                />
                &nbsp;&nbsp;&nbsp;
                {amazonFileName && (
                  <div className={`flex pt-1 justify-center `}>
                    <b>File</b> - {amazonFileName}
                    <b
                      className="px-4 cursor-pointer"
                      onClick={() => {
                        document.getElementById("upload-button").value = null;
                        setAmazonFileName(undefined);
                      }}
                    >
                      X
                    </b>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SecondStep;
