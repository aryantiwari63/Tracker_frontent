import React, { useState, useEffect } from "react";

const SearchableSelect = ({
  className,
  id,
  setActiveBody,
  activeBody,
  header,
  row,
  typeDropdown,
  requiredFields,
  columnType,
  showSelect,
  setShowSelect,
  title,
  selectableId,
  isLastThree,
}) => {
  const [filteredOptions, setFilteredOptions] = useState(
    activeBody[typeDropdown[header]["dropDown"]][columnType]
  );
  const [innerText, setInnerText] = useState(
    !row[typeDropdown[header]["field"]]
      ? row["npd"]
      : row[typeDropdown[header]["field"]]
  );

  useEffect(() => {
    // Reset the innerText when the tab changes

    setInnerText(
      !row[typeDropdown[header]["field"]]
        ? row["npd"]
        : row[typeDropdown[header]["field"]]
    );
  }, [columnType, row, header, typeDropdown, title, id]);

  const handleSearch = (e) => {
    const term = e.target.value.trim();
    setInnerText(term);
    // Filter options based on the search term
    let filtered = [];
    if (term.length > 0)
      filtered = activeBody[typeDropdown[header]["dropDown"]][
        columnType
      ].filter((option) =>
        option.trim().toLowerCase().includes(term.toLowerCase())
      );
    else filtered = activeBody[typeDropdown[header]["dropDown"]][columnType];
    // if (filtered.length === 1) {
    //   // Handle the autocomplete selection (e.g., set it as the selected option)
    //   handleSelect(filtered[0]);
    // }
    setFilteredOptions(filtered);
  };

  const shouldOptionDisable = (headerValue, row) =>
    "Action Needed" === headerValue ||
    (headerValue === "Do not match" &&
      requiredFields.includes(row["template"].toLowerCase()));

  const isOpen = `ul-${id}` === showSelect;
  return (
    <div className="custom-dropdown">
      {/* Search input */}

      <input
        type="text"
        onChange={(e) => handleSearch(e)}
        className={className}
        autoComplete="off"
        id={`input-${id}`}
        value={innerText}
        onClick={() => {
          if (showSelect === `ul-${id}`) {
            setInnerText(
              !row[typeDropdown[header]["field"]]
                ? row["npd"]
                : row[typeDropdown[header]["field"]]
            );
            setShowSelect(null);
          } else setShowSelect(`ul-${id}`);
        }}
      />
      {/* Dropdown list */}

      <ul
        className={`dropdown-content ${isOpen ? "ul-block" : "ul-hidden"} ${
          isLastThree ? "bottom-full" : "top-full"
        }`}
        id={`ul-${id}`}
      >
        {filteredOptions.map((headerValue, index) => (
          <li
            key={index}
            className={
              shouldOptionDisable(headerValue, row) ? "disabled-element" : ""
            }
            data-value={headerValue}
            onClick={() => {
              if (!shouldOptionDisable(headerValue, row)) {
                setInnerText(headerValue);
                setActiveBody(
                  header,
                  columnType,
                  activeBody,
                  headerValue,
                  selectableId,
                  requiredFields
                );
                setShowSelect(null);
              }
            }}
          >
            {headerValue}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchableSelect;
