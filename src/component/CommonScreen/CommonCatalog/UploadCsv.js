import React, { useEffect, useState } from "react";
import { HiDownload, HiUpload } from "react-icons/hi";
// import { csvCatalogHeaders } from "../../../utils/commonScreenConstant";
import { CSVLink } from "react-csv";
import Papa from "papaparse";
import { _POST } from "../../../services/axios.method";
import { useDispatch } from "react-redux";
import { setToastMessageHandler } from "../../../redux/action-creator/commonAction";

const Modals = ({ closeModal, importType, selectedRow }) => {
  const [activeDrag, setDrag] = useState(false);
  const [filename, setFileName] = useState(undefined);
  const [error, setError] = useState(undefined);
  // const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(undefined);
  const [validatedData, setValidatedData] = useState([]);
  const [duplicateInCsv, setDuplicateInCSV] = useState([]);
  const [dbError, setDbError] = useState([]);
  const [template, setTemplate] = useState({ headers: [] });
  const dispatch = useDispatch();

  const getTemplate = async () => {
    try {
      setLoading("csv_export");
      const res = await _POST("/catalog/template", {
        payload: 1,
      });
      if (res?.status === 200) {
        setTemplate(res?.data?.data);
        setLoading(undefined);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getTemplate();
    let dragAndDrop = document.querySelector("#drag-drop-uploader");
    dragAndDrop.addEventListener(
      "dragenter",
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDrag(true);
      },
      false
    );
    dragAndDrop.addEventListener(
      "dragleave",
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDrag(false);
      },
      false
    );
    dragAndDrop.addEventListener(
      "dragover",
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDrag(true);
      },
      false
    );
    dragAndDrop.addEventListener(
      "drop",
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDrag(false);
        let draggedData = e.dataTransfer;
        let files = draggedData.files;
        if (files.length === 1) {
          Array.from(files).forEach((file) => {
            fileHandler(file, file.name, file.type);
          });
        } else {
          setFileName(undefined);
          setError("Only one CSV file is allowed");
        }
      },
      false
    );
  }, []);

  const validateHeaders = (fields, actualFields) =>
    actualFields.every((v) => fields.includes(v));

  const fileHandler = (file, name, type) => {
    if (type !== "text/csv") {
      setError("Please select an CSV file");
      return false;
    }
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async function (results) {
        const valuesArray = [];
        const { data, meta } = results;
        const { fields } = meta;
        if (
          Array.isArray(fields) &&
          fields.length === template["headers"].length &&
          validateHeaders(
            fields,
            template["headers"].map((val) => val.title)
          )
        ) {
          for (const obj of data) {
            let updatedObject = {};
            for (const prop in obj) {
              updatedObject[
                template["headers"].find((i) => i.title === prop)?.value
              ] = obj[prop];
            }
            valuesArray.push(updatedObject);
          }
          setFileName(name);
          setError(undefined);
          // setValues(valuesArray);
          await validateData(valuesArray);
        } else {
          setFileName(undefined);
          // setValues(valuesArray);
          setError("Please choose a valid file");
        }
      },
    });
  };

  const validateData = async (valuesArray) => {
    try {
      setLoading("validate");
      const res = await _POST("/catalog/validate", {
        payload: valuesArray,
        type: importType,
      });
      if (res?.status === 200) {
        setDuplicateInCSV(res?.data?.data?.duplicateInCsv);
        setDbError(res?.data?.data?.DBError);
        setValidatedData(res?.data?.data?.validatedData);

        if (res?.data?.data?.validatedData.length === 0)
          setError("No Validate data found");
      }
      setLoading(undefined);
    } catch (e) {
      console.error(e);
      // dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };

  const uploadCSV = async () => {
    try {
      if (validatedData.length > 0 && !error) {
        setLoading("uploading");
        const res = await _POST("/catalog/create", {
          payload: validatedData,
          type: importType,
        });
        if (res?.status === 200) {
          dispatch(
            setToastMessageHandler(
              `Products ${
                importType === "new" ? "added" : "updated"
              }  successfully`,
              true
            )
          );
        } else {
          dispatch(
            setToastMessageHandler(
              `Failed to ${importType === "new" ? "add" : "update"} products`,
              false
            )
          );
        }
        setLoading(undefined);
        closeModal(false);
      } else {
        dispatch(setToastMessageHandler("No Validate data found", false));
      }
    } catch (e) {
      console.error(e);
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };

  return (
    <div className="row   mb-[1rem] bg-[#fff]">
      <div className="pt-3 m-auto">
        {
          <CSVLink
            data={
              importType === "new" || selectedRow.length === 0
                ? []
                : selectedRow
            }
            headers={template["headers"].map((row) => ({
              label: row.title,
              key: row.csvName ? row.csvName : row.value,
            }))}
            filename={`sample_${Date.now()}.csv`}
          >
            <button
              className="rounded-lg bg-gray-400 border row items-center px-3 py-1 color-white"
              // onClick={handleDownload}
            >
              <HiDownload className="" />
              {loading === "csv_export"
                ? "Loading template"
                : "Download the CSV template"}
            </button>
          </CSVLink>
        }
      </div>
      <div className="row pt-4 justify-center">
        <input
          type="file"
          id="upload-button"
          // eslint-disable-next-line react/no-unknown-property
          single
          accept="text/csv"
          style={{
            display: "none",
          }}
          onChange={(e) => {
            if (e.target.files.length > 0)
              fileHandler(
                e.target.files[0],
                e.target.files[0].name,
                e.target.files[0].type
              );
          }}
        />
        <label htmlFor="upload-button" className="cursor-pointer">
          <div
            className="rounded-lg custom-dotted-border text-center bg-gray-50 text-sm p-16"
            id="drag-drop-uploader"
            style={{ border: activeDrag && "0.2em dashed #025bee" }}
          >
            <HiUpload className="mx-auto text-gray-500" />
            <p className="text-center text-sm">
              Drag and drop files here or click to upload.
            </p>
            <p className="text-sm">or click to select from computer</p>
            <p className="text-sm">Accepted formats: CSV</p>
          </div>
        </label>

        {error && (
          <>
            <div className="row pt-1 justify-center">
              <strong className="text-red-500">*{error}</strong>
              <strong
                className="cursor-pointer"
                onClick={() => {
                  document.getElementById("upload-button").value = null;
                  setFileName(undefined);
                  setError(undefined);
                }}
              >
                &nbsp;&nbsp; &nbsp; &nbsp; X
              </strong>
            </div>
            <div className="row pt-1 justify-center ">
              {duplicateInCsv.length > 0 && (
                <CSVLink
                  data={duplicateInCsv}
                  headers={template["headers"].map((row) => ({
                    label: row.title,
                    key: row.value,
                  }))}
                  filename={`duplicate_in_csv_${Date.now()}.csv`}
                >
                  <button
                    className="rounded-lg bg-gray-400 border row items-center px-3 py-1 color-white"
                    // onClick={handleDownload}
                  >
                    <HiDownload className="" />
                    Duplicate In CSV ({duplicateInCsv.length})
                  </button>
                </CSVLink>
              )}
              {dbError.length > 0 && (
                <CSVLink
                  data={dbError}
                  headers={template["headers"].map((row) => ({
                    label: row.title,
                    key: row.value,
                  }))}
                  filename={`${
                    importType === "existing" && "Not"
                  }present_in_db_${Date.now()}.csv`}
                >
                  <button
                    className="rounded-lg bg-gray-400 border row items-center px-3 py-1 color-white"
                    // onClick={handleDownload}
                  >
                    <HiDownload className="" />
                    {importType === "existing"
                      ? "EAN code Mismatch " + "(" + dbError.length + ")"
                      : "Duplicate EAN Code"}
                  </button>
                </CSVLink>
              )}
            </div>
          </>
        )}
      </div>

      {filename && (
        <div className="row pt-1 justify-center mt-2">
          {/* <div className=" pl-2 inline-block w-[90%]"> */}
          <b>File</b> - {filename}
          {/* </div> */}
          {/* <div className="inline-block float-right w-[10%]"> */}
          <b
            className="px-4 cursor-pointer"
            onClick={() => {
              document.getElementById("upload-button").value = null;
              setFileName(undefined);
              setError(undefined);
            }}
          >
            X
          </b>
          {/* </div> */}
        </div>
      )}

      <div className="pt-3 m-auto block ">
        <button
          className={`rounded-lg bg-gray-400 border  items-center px-3 py-1 color-white ${
            filename === undefined && "cursor-not-allowed"
          }`}
          onClick={() => uploadCSV()}
          disabled={filename === undefined || loading}
        >
          {loading === "validate"
            ? "Validating..."
            : loading === "uploading"
            ? "Uploading..."
            : "Upload"}
        </button>
      </div>
    </div>
  );
};

export default Modals;
