import React from "react";
import ExcelJS from "exceljs";
import AccordionItem from "./AccordionItem";
import TableComponent from "./TableComponent";

const ThirdStep = ({
  activeBody,
  setActiveBody,
  freeze,

  freezeChanges,
  columnType,
  setColumnType,
  activePriority,
  setActivePriority,
  selectedOption,
}) => {
  const headers = {
    mapped: [
      {
        id: 1,
        title: "Template Column",
        value: "template",
        option: "both",
      },
      {
        id: 2,
        title: "NPD Mapped Column",
        value: "npd",
        option: "both",
      },
    ],
    action: [
      {
        id: 1,
        title: "Template Column",
        value: "template",
        option: "both",
      },
      {
        id: 2,
        title: "NPD Mapped Column",
        value: "npd",
        option: "both",
      },
      {
        id: 3,
        title: "Amazon Mapped Column",
        value: "amazon_mapped",
        option: 2,
      },
      {
        id: 4,
        title: "Example",
        value: "example",
        option: 2,
      },
    ],
    duplicate: [
      {
        id: 1,
        template: "Item Name",
        title: "Item Name",
        value: "item_name",
        origin: "amazon",
        required: true,
        sticky: true,
        width: "[220px]",
        left: "left-0",
        checkable: true,
        option: "both",
      },
      {
        id: 2,
        template: "External Product ID",
        title: "External Product ID",
        value: "external_product_id",
        origin: "amazon",
        required: true,
        sticky: true,
        width: "[220px]",
        left: "left-[16rem]",
        checkable: true,
        option: "both",
      },
    ],
    // { id: 0, title: "Brand Id", value: "brandId" },

    //   {
    //     id: 1,
    //     title: "Product Name*",
    //     value: "product_name",
    //     sticky: true,
    //     width: "[220px]",
    //     left: "left-0",
    //     checkable: true,
    //   },
    //   {
    //     id: 2,
    //     title: "EAN code*",
    //     value: "ean_code",
    //     sticky: true,
    //     width: "[100px]",
    //     left: "left-[16rem]",
    //     checkable: true,
    //   },
    //   {
    //     id: 3,
    //     title: "Amazon Product Id",
    //     value: "amazon_product_id",
    //     checkable: true,
    //   },
    //   {
    //     id: 4,
    //     title: "Blinkit Product Id",
    //     value: "blinkit_product_id",
    //     checkable: true,
    //   },
    //   {
    //     id: 5,
    //     title: "Flipkart Product Id",
    //     value: "flipkart_product_id",
    //     checkable: true,
    //   },
    //   {
    //     id: 6,
    //     title: "Zepto Product Id",
    //     value: "zepto_product_id",
    //     checkable: true,
    //   },
    //   {
    //     id: 7,
    //     title: "E Genie Label",
    //     value: "e_genie_label",
    //   },
    //   {
    //     id: 8,
    //     title: "Category Id",
    //     value: "category_id",
    //   },
    //   {
    //     id: 9,
    //     title: "Product Weight",
    //     value: "product_weight",
    //   },
    //   {
    //     id: 10,
    //     title: "Product MRP",
    //     value: "product_mrp",
    //   },

    //   {
    //     id: 11,
    //     title: "Description",
    //     value: "description",
    //   },
    //   {
    //     id: 12,
    //     title: "Ingredients",
    //     value: "ingredients",
    //   },
    //   {
    //     id: 13,
    //     title: "Flavour",
    //     value: "flavour",
    //   },
    // ],
  };
  const typeDropdown = {
    npd: { dropDown: "lockHeadersDropdown", field: "alter" },
    amazon_mapped: {
      dropDown: "lockAmazonHeadersDropdown",
      field: "amazon_mapped",
    },
  };
  const dynamicContent = {
    mapped: "No Mapped Content",
    action: "No Action Needed",
    duplicate: "No duplicate data Found",
    exist: "No duplicate Exist",
    empty: "No Empty data found",
  };

  const requiredFields = [
    "external product id",
    "item name",
    // "maximum retail price (mrp)",
  ];

  const dynamic = {
    mapped: ["npd"],
    action: ["npd", "amazon_mapped"],
  };

  const dynamicDropdown = {
    mapped: ["Do not match"],
    action: ["Do not match", "Action Needed"],
  };

  const handleToggle = (index) => {
    if (activePriority === index) {
      setActivePriority(null);
    } else {
      setActivePriority(index);
    }
  };

  const isDisabled = () =>
    freeze.includes("mapped") &&
    (freeze.includes("action") || activeBody["action"]?.length === 0) &&
    activeBody["action"].filter((val) => val.alter === "Action Needed")
      ?.length === 0;

  function isNumberOrString(val) {
    return typeof val === "string" ? val.trim().length : val.toString().length;
  }

  const exportExcelFile = () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("My Sheet");
    const mappedHeaders = [];
    for (let i = 0; i < headers["duplicate"].length; i++) {
      let outer = headers["duplicate"][i];
      mappedHeaders.push({
        header:
          // ["external_product_id", "item_name"].includes(outer.value)
          //   ? outer.title.slice(0, -1)
          // :
          outer.title,
        key: outer.value,
        width: 40,
      });
    }

    sheet.columns = mappedHeaders;

    const promise = Promise.all(
      activeBody[columnType]?.map(async (product) => {
        sheet.addRow({
          // product_name: product?.product_name || "",
          // ean_code: product?.ean_code || "",
          // amazon_product_id: product?.amazon_product_id || "",
          // blinkit_product_id: product?.blinkit_product_id || "",
          // flipkart_product_id: product?.flipkart_product_id || "",
          // zepto_product_id: product?.zepto_product_id || "",
          // e_genie_label: product?.e_genie_label || "",
          // category_id: product?.category_id || "",
          // product_weight: product?.product_weight || "",
          // product_mrp: product?.product_mrp || "",
          // description: product?.description || "",
          // ingredients: product?.ingredients || "",
          // flavour: product?.flavour || "",
          external_product_id: product?.external_product_id || "",
          item_name: product?.item_name || "",
        });
      })
    );

    promise.then(() => {
      const columns = {};

      const getCheckableColumn = headers["duplicate"].filter(
        (outer) => outer.checkable
      );
      for (let i = 0; i < getCheckableColumn.length; i++) {
        let outer = getCheckableColumn[i];
        columns[outer.value] = sheet.getColumn(outer.id);
      }

      let colorMap = {};
      getCheckableColumn.map((outer) =>
        columns[outer.value].eachCell((cell, i) => {
          if (i > 1) {
            let isCheckable = false;
            let isColorAllowed = false;
            let color = columnType === "empty" ? "FAA0A0" : null;
            const cellValue = sheet.getCell(cell?.address).value;
            if (columnType === "empty") {
              isCheckable =
                ["external_product_id", "item_name"].includes(outer.value) &&
                isNumberOrString(cellValue) === 0;
            }
            if (["exist", "duplicate"].includes(columnType)) {
              isCheckable = cellValue && isNumberOrString(cellValue) > 0;
              isColorAllowed =
                activeBody[columnType][i - 2]["**parent_id**"] !== null
                  ? activeBody[columnType][i - 2][
                      "**duplicate_fields**"
                    ].includes(outer.value)
                  : activeBody[columnType][i - 2]["**parent_id**"] === null &&
                    activeBody[columnType][i - 2][
                      "**duplicate_fields**"
                    ].includes(outer.value);
              // console.log("isCheckable>>>>>>>>>", isColorAllowed, outer.value);
              color =
                isCheckable && isColorAllowed
                  ? getColor(cellValue, outer.value, colorMap, "csv")
                  : null;
            }

            // console.log("color>>>>>>>>>>>>>", color);
            if (isCheckable && color) {
              sheet.getCell(cell?.address).fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: {
                  argb: ["exist", "duplicate"].includes(columnType)
                    ? `${color.substring(1)}`
                    : color,
                },
              };
            }
          }
        })
      );

      workbook.xlsx.writeBuffer().then(function (data) {
        const blob = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `${columnType}.xlsx`;
        anchor.click();
        window.URL.revokeObjectURL(url);
      });
    });
  };

  const getColor = (value, header, colorMap, type) => {
    if (colorMap[value]) {
      return colorMap[value];
    } else {
      const hash = value
        .toString()
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const pastelLightnessCreation = header
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);

      const blueHue = 210;
      const pastelSaturation = 40 + (pastelLightnessCreation % 30);
      const pastelLightness = 70 + (hash % 30);

      const color =
        type === "render"
          ? `hsl(${blueHue}, ${pastelSaturation}%, ${pastelLightness}%)`
          : hslToRgb(blueHue, pastelSaturation, pastelLightness);

      return color;
    }
  };

  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const toHex = (x) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  const hslToRgb = (h, s, l) => {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  return (
    <>
      <div className="flex p-[20px] " style={{ gap: 20 }}>
        <div
          onClick={() => {
            if (
              freeze.includes("mapped") &&
              columnType === "action" &&
              activeBody["action"].length > 0
            ) {
              return;
            } else setColumnType("mapped");
          }}
          className={`${columnType === "mapped" && "text-[#007AFF]"}  ${
            freeze.includes("mapped") &&
            columnType === "action" &&
            activeBody["action"].length > 0
              ? "cursor-not-allowed"
              : "cursor-pointer"
          }`}
        >
          Mapped(
          {`${
            freeze.includes("action")
              ? activeBody["mapped"].length > 0
                ? activeBody["mapped"].filter(
                    (val) => val.alter !== "Do not match"
                  )?.length
                : 0
              : activeBody["mapped"].length
          }`}
          )
        </div>
        <div
          onClick={() => {
            if (
              freeze.includes("mapped") ||
              activeBody["mapped"].length === 0
            ) {
              setColumnType("action");
            }
          }}
          className={`${columnType === "action" && "text-[#007AFF]"} ${
            !freeze.includes("mapped") && activeBody["mapped"].length !== 0
              ? "cursor-not-allowed"
              : "cursor-pointer"
          }`}
        >
          Action Needed({`${activeBody["action"].length}`})
        </div>
        <div
          onClick={() => {
            if (isDisabled()) {
              setColumnType("duplicate");
            }
          }}
          className={`${columnType === "duplicate" && "text-[#007AFF]"} ${
            !isDisabled() ? " cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          Duplicate({`${activeBody["duplicate"].length}`})
        </div>
        <div
          onClick={() => {
            if (isDisabled()) {
              setColumnType("exist");
            }
          }}
          className={`${columnType === "exist" && "text-[#007AFF]"} ${
            !isDisabled() ? " cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          Exist({`${activeBody["exist"].length}`})
        </div>
        <div
          onClick={() => {
            if (isDisabled()) {
              setColumnType("empty");
            }
          }}
          className={`${columnType === "empty" && "text-[#007AFF]"} ${
            !isDisabled() ? " cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          Empty Field({`${activeBody["empty"].length}`})
        </div>
        {activeBody[columnType].length > 0 && (
          <div className="ml-[auto]">
            <button
              className={`bg-[#0081F7] rounded-md px-[10px] py-[2px] text-[#fff] `}
              onClick={() => {
                if (["mapped", "action"].includes(columnType))
                  freezeChanges(
                    columnType,
                    freeze.includes(columnType) ? "unfreeze" : "freeze"
                  );
                else exportExcelFile();
              }}
            >
              {["mapped", "action"].includes(columnType)
                ? !freeze.includes(columnType)
                  ? "Freeze"
                  : "Unfreeze"
                : "Export"}
            </button>
          </div>
        )}
      </div>
      <div
        className={`${
          freeze.includes(columnType) && "blur-table"
        } overflow-x-visible ${
          ["mapped", "action"].includes(columnType) ? "p-[10px]" : ""
        }`}
      >
        {["duplicate", "exist", "empty"].includes(columnType) ? (
          <TableComponent
            dynamicContent={dynamicContent}
            headers={headers}
            activeBody={activeBody}
            columnType={columnType}
            getColor={getColor}
          />
        ) : (
          Object.keys(activeBody["order"]).map((outer, index) => {
            return (
              <AccordionItem
                key={index}
                selectedOption={selectedOption}
                active={activePriority}
                activeBody={activeBody}
                columnType={columnType}
                handleToggle={handleToggle}
                typeDropdown={typeDropdown}
                dynamicContent={dynamicContent}
                requiredFields={requiredFields}
                dynamic={dynamic}
                dynamicDropdown={dynamicDropdown}
                headers={headers}
                setActiveBody={setActiveBody}
                freeze={freeze}
                body={{
                  id: `index_${index}-${columnType}-${outer}`,
                  header:
                    outer === "Others"
                      ? outer + " : For Flipkart,Blinkit,Zepto"
                      : outer,
                  values: activeBody[columnType].filter(
                    (inner) =>
                      inner["priority"].toLowerCase() === outer.toLowerCase()
                  ),
                }}
              />
            );
          })
        )}
      </div>
    </>
  );
};

export default ThirdStep;
