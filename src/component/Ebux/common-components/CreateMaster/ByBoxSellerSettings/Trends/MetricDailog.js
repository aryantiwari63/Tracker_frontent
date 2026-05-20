import { createPortal } from "react-dom";
import { buttonThemeObj } from "../../../MultiFilter/common/style/StyleConstants";
import { useEffect, useState } from "react";

const MetricDailog = ({
  dailogObj = {},
  reopenData = {},
  platform = "ams",
  handleValue,
  handleValueUpdate,
  handleClose = false,
}) => {
  // comparator states map to your UI strings
  const [condition, setCondition] = useState("is_greater_than");
  const [value, setValue] = useState(""); // single value for gt/lt
  const [metricType, setMetricType] = useState("single"); // "single" | "metric" (two inputs)
  const [metricFrom, setMetricFrom] = useState("");
  const [metricTo, setMetricTo] = useState("");
  const [error, setError] = useState("");
  const [nameIdError, setNameIdError] = useState(false);
  const [valueNotUpper0Error, setValueNotUpper0Error] = useState(false);
  const [valueNotIn100Error, setValueNotIn100Error] = useState(false);

  // NEW: seller type selector (P1/P2/P3)
  const [sellerType, setSellerType] = useState("P1");

  function handleCondition(val) {
    if (val === "is_between" || val === "isnt_between") {
      setMetricType("metric");
    } else {
      setMetricType("single");
    }
    setCondition(val);
  }

  // convert UI condition -> backend comparator
  function mapConditionToComparator(cond) {
    switch (cond) {
      case "is_greater_than":
        return "gt";
      case "is_less_than":
        return "lt";
      case "is_between":
        return "between";
      case "isnt_between":
        return "not_between";
      default:
        return "gt";
    }
  }

  // sanitize numeric input (allow decimals)
  function parseNumericInput(val) {
    if (val === null || val === undefined || val === "") return null;
    const n = Number(String(val).trim());
    return Number.isFinite(n) ? n : null;
  }

  const handleSubmit = () => {
    // reset previous errors
    setNameIdError(false);
    setValueNotUpper0Error(false);
    setValueNotIn100Error(false);

    // basic presence validation
    if (
      (metricType === "single" && (value === "" || value === null)) ||
      (metricType === "metric" && (metricFrom === "" || metricTo === ""))
    ) {
      setNameIdError(true);
      return;
    }

    // parse numbers
    const parsedSingle = parseNumericInput(value);
    const parsedFrom = parseNumericInput(metricFrom);
    const parsedTo = parseNumericInput(metricTo);

    // numeric & non-negative validation
    if (
      (metricType === "single" && (parsedSingle === null || parsedSingle < 0)) ||
      (metricType === "metric" && (parsedFrom === null || parsedTo === null || parsedFrom < 0 || parsedTo < 0))
    ) {
      setValueNotUpper0Error(true);
      return;
    }

    // if percentage mode, enforce <=100
    if (dailogObj?.persentageValue) {
      if (
        (metricType === "single" && parsedSingle > 100) ||
        (metricType === "metric" && (parsedFrom > 100 || parsedTo > 100))
      ) {
        setValueNotIn100Error(true);
        return;
      }
    }

    // for between, validate min <= max
    if (metricType === "metric" && parsedFrom > parsedTo) {
      setError("Lower bound must be less than or equal to upper bound");
      return;
    }

    // --- build existing filterObj (keeps your structure) ---
    let pKey = "";
    let key = "";
    let joinKey = "";
    let label = "";
    if (reopenData?.value) {
      pKey = dailogObj?.pkey;
      key = dailogObj?.key;
      joinKey = dailogObj?.joinKey;
      label = dailogObj?.label;
    } else {
      pKey = dailogObj?.key?.split("-")?.[0];
      key = dailogObj?.key?.split("-")?.[1];
      joinKey = dailogObj?.key;
      label = dailogObj?.data?.split("-")?.[0]; // For chips title
    }

    const filterObj = {
      pkey: pKey,
      key: key,
      joinKey: joinKey,
      condition: condition,
      label: label,
      persentageValue: dailogObj?.persentageValue ?? false,
      data: dailogObj?.data,
      action: dailogObj?.action, // For open search dailog again when clicking on chips
    };

    // keep the existing string-based value for chips (if you still want it)
    if (metricType === "metric") {
      filterObj.value = `${metricFrom}${dailogObj?.persentageValue ? "%" : ""},${metricTo}${dailogObj?.persentageValue ? "%" : ""}`;
    } else {
      filterObj.value = `${value}${dailogObj?.persentageValue ? "%" : ""}`;
    }

    // ---------- NEW: build winRateFilter payload for backend ----------
    // backend expects: { sellerType: "P1"|"P2"|"P3", comparator: "gt"|"lt"|"between"|"not_between", value: number | [min, max] }
    const comparator = mapConditionToComparator(condition);

    // ensure we pass raw numbers (no % symbol). If dailogObj.persentageValue true, numbers still represent percent.
    let winRateFilter;
    if (metricType === "metric") {
      winRateFilter = {
        sellerType: sellerType,
        comparator: comparator,
        value: [parseNumericInput(metricFrom), parseNumericInput(metricTo)],
      };
    } else {
      winRateFilter = {
        sellerType: sellerType,
        comparator: comparator,
        value: parseNumericInput(value),
      };
    }

    // Attach it to filterObj so parent handlers can include it into the ES payload
    filterObj.winRateFilter = winRateFilter;

    // Call the existing handlers
    setNameIdError(false);

    if (reopenData?.value) {
      handleValueUpdate(pKey, joinKey, filterObj, dailogObj?.action);
    } else {
      handleValue(pKey, joinKey, filterObj, dailogObj?.action);
    }

    handleClose();
  };

  const handleBackgroundClick = (event) => {
    // Check if the click is outside the dialog (on the overlay)
    if (event.target.classList.contains("modal-overlay")) {
      handleClose();
    }
  };

  useEffect(() => {
    if (reopenData?.value && reopenData?.condition) {
      // remove possible percent symbols on reopen
      const cleaned = reopenData.value?.replace(/%/g, "");
      handleCondition(reopenData?.condition);

      if (reopenData?.condition === "is_between" || reopenData?.condition === "isnt_between") {
        const arr = cleaned?.split(",") ?? [];
        setMetricFrom(arr[0] ?? "");
        setMetricTo(arr[1] ?? "");
      } else {
        setValue(cleaned ?? "");
      }

      // If reopenData has existing winRateFilter, prefill sellerType
      if (reopenData?.winRateFilter?.sellerType) {
        setSellerType(reopenData.winRateFilter.sellerType);
      }
    }
  }, [reopenData]);

  return createPortal(
    <div
      className="modal-overlay w-full h-full bg-black/20 absolute top-0 !z-[5000000000] flex justify-center items-center"
      onClick={handleBackgroundClick}
    >
      <div
        className="rounded-xl border bg-card text-card-foreground shadow w-[500px] bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="font-semibold leading-none tracking-tight">
            {dailogObj?.data}
          </h3>
          <p className="text-sm text-muted-foreground">
            Apply comparision on filter
          </p>
        </div>

        <div className="p-6 pt-0">
          <div className="flex items-center gap-3 mb-3">
            {/* NEW: Seller Type selector */}
            {/* <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Seller</label>
              <select
                value={sellerType}
                onChange={(e) => setSellerType(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="P1">P1</option>
                <option value="P2">P2</option>
                <option value="P3">P3</option>
              </select>
            </div> */}

            {/* existing comparator radios */}
            <div className="flex items-center">
              <input
                id="greater-than"
                type="radio"
                checked={condition === "is_greater_than"}
                name="greater-than-group"
                onChange={() => handleCondition("is_greater_than")}
                className={`w-4 h-4 `}
              />
              <label
                htmlFor="greater-than"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                is greater than
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="less-than"
                type="radio"
                checked={condition === "is_less_than"}
                onChange={() => handleCondition("is_less_than")}
                name="inline-radio-group"
                className={`w-4 h-4 `}
              />
              <label
                htmlFor="less-than"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                is lesser than
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="between"
                type="radio"
                checked={condition === "is_between"}
                name="between-group"
                onChange={() => handleCondition("is_between")}
                className={`w-4 h-4 `}
              />
              <label
                htmlFor="between"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                is between
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="not-between"
                type="radio"
                checked={condition === "isnt_between"}
                name="not-between-group"
                onChange={() => handleCondition("isnt_between")}
                className={`w-4 h-4 `}
              />
              <label
                htmlFor="not-between"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                {`isn't between`}
              </label>
            </div>
          </div>

          <div className="pt-4 ">
            {metricType === "single" ? (
              <div className="flex items-center">
                <input
                  type="number"
                  value={value}
                  onChange={(e) => {
                    setError("");
                    setValue(e.target.value);
                    // clear error flags on edit
                    setNameIdError(false);
                    setValueNotUpper0Error(false);
                    setValueNotIn100Error(false);
                  }}
                  placeholder={`Eg- 99${dailogObj?.persentageValue ? "%" : ""}`}
                  name="search"
                  className={`px-2 py-2 border w-full outline-none focus-visible:ring-1 rounded-md ${error}`}
                  onKeyPress={(e) => {
                    if (e.key === "e" || e.key === "E") e.preventDefault();
                  }}
                />
                {dailogObj?.persentageValue ? "%" : ""}
              </div>
            ) : (
              <div className="flex justify-between">
                <div className="flex items-center flex-[0.48]">
                  <input
                    type="number"
                    value={metricFrom}
                    onChange={(e) => {
                      setError("");
                      setMetricFrom(e.target.value);
                      setNameIdError(false);
                      setValueNotUpper0Error(false);
                      setValueNotIn100Error(false);
                    }}
                    placeholder={`0${dailogObj?.persentageValue ? "%" : ""}`}
                    name="metricFrom"
                    className={`px-2 py-2 border w-full outline-none focus-visible:ring-1 rounded-md ${error}`}
                    onKeyPress={(e) => {
                      if (e.key === "e" || e.key === "E") e.preventDefault();
                    }}
                  />
                  {dailogObj?.persentageValue ? "%" : ""}
                </div>
                <div className="flex items-center"> to </div>
                <div className="flex items-center flex-[0.48]">
                  <input
                    type="number"
                    value={metricTo}
                    onChange={(e) => {
                      setError("");
                      setMetricTo(e.target.value);
                      setNameIdError(false);
                      setValueNotUpper0Error(false);
                      setValueNotIn100Error(false);
                    }}
                    placeholder={`0${dailogObj?.persentageValue ? "%" : ""}`}
                    name="metricTo"
                    className={`px-2 py-2 border w-full outline-none focus-visible:ring-1 rounded-md ${error}`}
                    onKeyPress={(e) => {
                      if (e.key === "e" || e.key === "E") e.preventDefault();
                    }}
                  />
                  {dailogObj?.persentageValue ? "%" : ""}
                </div>
              </div>
            )}
          </div>

          {/* error messages */}
          {nameIdError ? (
            <div className="text-red-500 text-[12px] pt-2">
              Fill all the parameters
            </div>
          ) : valueNotUpper0Error ? (
            <div className="text-red-500 text-[12px] pt-2">
              {`Value can't be less than 0${dailogObj?.persentageValue ? "%" : ""}.`}
            </div>
          ) : valueNotIn100Error ? (
            <div className="text-red-500 text-[12px] pt-2">
              {`Value can't be greater than 100${dailogObj?.persentageValue ? "%" : ""}.`}
            </div>
          ) : error ? (
            <div className="text-red-500 text-[12px] pt-2">{error}</div>
          ) : null}
        </div>

        <div className="items-center p-6 pt-0 flex justify-end gap-2">
          <button
            onClick={handleClose}
            className="border rounded-md text-sm font-medium hover:bg-gray-100 shadow hover:bg-primary/90 px-4 py-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className={`${buttonThemeObj[platform]} rounded-md text-sm font-medium text-white shadow hover:bg-primary/90 px-4 py-2`}
          >
            Apply
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MetricDailog;
