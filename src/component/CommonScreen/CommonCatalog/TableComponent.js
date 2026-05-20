import React from "react";

const TableComponent = ({
  dynamicContent,
  headers,
  activeBody,
  getColor,
  columnType,
}) => {
  // console.log("activeBody>>>>>>>>>>>", columnType, activeBody);

  function isNumberOrString(val) {
    return typeof val === "string" ? val.trim().length : val.toString().length;
  }

  const renderRows = (rows, parentId = null, colorMap = {}) => {
    if (columnType === "duplicate")
      return rows
        .filter((row) => row["**parent_id**"] === parentId)
        .map((row, i) => (
          <>
            <tr className="product_upload_tr" data-id={i}>
              {headers["duplicate"].map((header) => {
                const isCheckable =
                  row[header.value] &&
                  header.checkable &&
                  isNumberOrString(row[header.value]) > 0;
                const isColorAllowed =
                  parentId !== null
                    ? row["**duplicate_fields**"].includes(header.value)
                    : parentId === null &&
                      row["**duplicate_fields**"].includes(header.value);

                const color =
                  isCheckable && isColorAllowed
                    ? getColor(
                        row[header.value],
                        header.value,
                        colorMap,
                        "render"
                      )
                    : null;

                return (
                  <td
                    key={header.value}
                    className={`px-4 ${
                      row[header.value] &&
                      isNumberOrString(row[header.value]) > 0
                        ? ""
                        : "text-center"
                    }`}
                    style={
                      isCheckable && color ? { backgroundColor: color } : {}
                    }
                  >
                    {row[header.value] &&
                    isNumberOrString(row[header.value]) > 0
                      ? row[header.value]
                      : "NA"}
                  </td>
                );
              })}
            </tr>
            {renderRows(rows, row["***"], colorMap)}
          </>
        ));
    else if (columnType === "exist") {
      return rows.map((row, i) => (
        <>
          <tr className="product_upload_tr" data-id={i}>
            {headers["duplicate"].map((header) => {
              const isCheckable =
                row[header.value] &&
                header.checkable &&
                isNumberOrString(row[header.value]) > 0;
              const isColorAllowed =
                parentId !== null
                  ? row["**duplicate_fields**"].includes(header.value)
                  : parentId === null &&
                    row["**duplicate_fields**"].includes(header.value);

              const color =
                isCheckable && isColorAllowed
                  ? getColor(row[header.value], header.value, colorMap)
                  : null;

              return (
                <td
                  key={header.value}
                  className={`px-4 ${
                    row[header.value] && isNumberOrString(row[header.value]) > 0
                      ? ""
                      : "text-center"
                  }`}
                  style={isCheckable && color ? { backgroundColor: color } : {}}
                >
                  {row[header.value] && isNumberOrString(row[header.value]) > 0
                    ? row[header.value]
                    : "NA"}
                </td>
              );
            })}
          </tr>
        </>
      ));
    } else if (columnType === "empty")
      return rows.map((row, i) => (
        <>
          <tr className="product_upload_tr" data-id={i}>
            {headers["duplicate"].map((header) => {
              const isCheckable =
                (["external_product_id", "item_name"].includes(header.value) &&
                  isNumberOrString(row[header.value]) === 0) ||
                (["external_product_id"].includes(header.value) &&
                  isNumberOrString(row[header.value]) < 13);

              return (
                <td
                  key={header.value}
                  className={`px-4 ${
                    row[header.value] && isNumberOrString(row[header.value]) > 0
                      ? ""
                      : "text-center"
                  }`}
                  style={{ backgroundColor: isCheckable ? "#FAA0A0" : "" }}
                >
                  {row[header.value] && isNumberOrString(row[header.value]) > 0
                    ? row[header.value]
                    : "NA"}
                </td>
              );
            })}
          </tr>
        </>
      ));
  };

  const tableStructure = () => {
    if (["duplicate", "exist", "empty"].includes(columnType))
      return <>{renderRows(activeBody[columnType])}</>;
  };

  return (
    <>
      {activeBody[columnType].length > 0 ? (
        <table
          className="h-full outer-product_table "
          style={{ width: "100%" }}
        >
          <thead
            className={
              "campaignreport__tablehead table-fixed sticky top-0 left-0 z-[35]"
            }
          >
            <tr className="h-16">
              {headers["duplicate"].map((item, i) => {
                return (
                  <th
                    key={i}
                    className={`${
                      item?.sticky ? `sticky ${item?.left} ${item?.width}` : ""
                    }`}
                  >
                    <div className="tableHead px-4">
                      <p>{item.title}</p>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>{tableStructure()}</tbody>
        </table>
      ) : (
        <div className="border-t-2  text-center  py-[5rem]">
          <h3 className="">{dynamicContent[columnType]}</h3>
        </div>
      )}
    </>
  );
};

export default TableComponent;
