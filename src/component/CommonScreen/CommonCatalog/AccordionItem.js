import React, { useRef, useState } from "react";
import SearchableSelect from "./SearchableSelect";

const AccordionItem = (props) => {
  const contentEl = useRef();
  const {
    handleToggle,
    active,
    activeBody,
    setActiveBody,
    body,
    headers,
    typeDropdown,
    dynamicContent,
    requiredFields,
    dynamic,
    dynamicDropdown,
    freeze,
    columnType,
    selectedOption,
  } = props;
  const { header: title, id, values } = body;
  const [showSelect, setShowSelect] = useState(null);
  // console.log("activeBody>>>>>>>>>>>Accordion", columnType, activeBody);
  const getDropdown = (header) =>
    activeBody[typeDropdown[header]["dropDown"]][columnType];

  const doDropdownInclude = (dropDown) =>
    dynamicDropdown[columnType].every((value) => dropDown.includes(value));

  const initialUpdate = (header) => {
    const dropDown = getDropdown(header);
    const dropDownInclude = doDropdownInclude(dropDown);
    if (!dropDownInclude) {
      dynamicDropdown[columnType].map((outer) => {
        activeBody[typeDropdown[header]["dropDown"]][columnType].unshift(outer);
      });
    }
    setActiveBody(undefined, "initial", activeBody);
  };

  const searchableSelectList = (row, header, i) => {
    initialUpdate(header);

    return (
      <td className="px-4 " data-id={i}>
        <div className="flex">
          <SearchableSelect
            className={`input-selector-mapped-action  ${
              freeze.includes(columnType)
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }`}
            id={`index_${i}-${columnType}-${title.toLowerCase()}-${header}_${
              row.id
            }`}
            selectableId={row.id}
            requiredFields={requiredFields}
            setActiveBody={setActiveBody}
            columnType={columnType}
            typeDropdown={typeDropdown}
            activeBody={activeBody}
            header={header}
            row={row}
            isLastThree={i >= values.length - 2 && values.length > 3}
            showSelect={showSelect}
            setShowSelect={setShowSelect}
            title={title}
          />
          &nbsp;&nbsp;
          {row[typeDropdown[header]["field"]]
            ? row[typeDropdown[header]["field"]] === "Action Needed" && (
                <>
                  <i
                    className="fa fa-exclamation self-center text-[red]"
                    aria-hidden="true"
                  ></i>
                </>
              )
            : row["npd"] === "Action Needed" && (
                <i
                  className="fa fa-exclamation  self-center text-[red] "
                  aria-hidden="true"
                ></i>
              )}
        </div>
      </td>
    );
  };

  const tableStructure = () => {
    return values?.map((row, i) => {
      return (
        <tr className="product_upload_tr" key={i} data-id={i}>
          {headers[columnType].map((header, index) => {
            if (header.option === "both" || header.option === selectedOption) {
              const typeTab = !dynamic[columnType].includes(header.value);
              if (typeTab)
                return (
                  <td className="px-4" key={index}>
                    {row[header.value]}
                  </td>
                );
              else return searchableSelectList(row, header?.value, i);
            }
            return null;
          })}
        </tr>
      );
    });
  };

  return (
    <div className="rc-accordion-card" key={`accordion-${id}`}>
      <div className="rc-accordion-header">
        <div
          className={`rc-accordion-toggle p-3 ${active === id ? "active" : ""}`}
          onClick={() => {
            setShowSelect(null);
            handleToggle(id);
          }}
        >
          <h5 className="rc-accordion-title">
            {title} {`(${values.length})`}
          </h5>
          <i className="fa fa-chevron-down rc-accordion-icon"></i>
        </div>
      </div>
      <div
        ref={contentEl}
        className={`rc-collapse ${active === id ? "show" : ""}`}
      >
        <div
          className="rc-accordion-body"
          style={
            active === id
              ? {
                  // height: values.length > 1 ? 500 : 200,
                  height:
                    values.length > 5
                      ? 500
                      : values.length === 4 && values.length > 0
                      ? 350
                      : values.length === 3 && values.length > 0
                      ? 300
                      : 200,
                  overflowY: "auto",
                }
              : { height: 0 }
          }
        >
          {active === id && values.length > 0 ? (
            <table
              className=" outer-product_table "
              style={{
                width: "100%",
                height: `${values.length > 5 ? "100%" : "auto"}`,
              }}
            >
              <thead
                className={
                  "campaignreport__tablehead table-fixed sticky top-0 left-0 z-[35]"
                }
              >
                <tr className="h-16">
                  {headers[columnType].map((item, i) => {
                    if (
                      item.option === "both" ||
                      item.option === selectedOption
                    )
                      return (
                        <th
                          key={i}
                          className={`${
                            item?.sticky
                              ? `sticky ${item?.left} ${item?.width}`
                              : ""
                          }`}
                        >
                          <div className="tableHead px-4">
                            <p>{item.title}</p>
                          </div>
                        </th>
                      );
                    return null;
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
        </div>
      </div>
    </div>
  );
};
export default AccordionItem;
