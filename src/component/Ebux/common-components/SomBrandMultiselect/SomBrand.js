import React, { useEffect, useMemo, useRef, useState } from "react";
import { TreeSelect } from 'primereact/treeselect';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { trackDashboardClick } from "../../../../analytics/EventController";

export default function SomBrand({
  initValue = [],
  options = [], // e.g., ["Nescafe", "KitKat", ...]
  labelledBy = "Select Category",
  selectedItems = [],
  toggleShowMoreTooltip = () => {},
  updateSelectedFilters = () => {}
}) {
  const injectDynamicStyles = () => {
    const platformColor = "#0081F7";
    const styleId = "table-som-tree";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      const css = `
        .p-dropdown-items > .p-dropdown-item:hover {
          background: ${platformColor} !important;
        }
        .p-checkbox .p-checkbox-box.p-highlight {
          border-color: ${platformColor} !important;
          background: ${platformColor} !important;
        }
        .p-checkbox .p-checkbox-box .p-checkbox-icon.p-icon {
          background:${platformColor} !important;
        }
        .p-treeselect:not(.p-disabled):hover,
        .p-inputtext:enabled:hover,
        .p-inputtext:enabled:focus {
          border-color: ${platformColor} !important;
          box-shadow: none !important;
        }
        .p-button {
          color: #000000 !important;
        }
        .p-button:focus {
          border-color: #000000 !important;
          box-shadow: none !important;
        }
      `;
      style.textContent = css;
      document.head.appendChild(style);
    }
  };

  useEffect(() => {
    injectDynamicStyles();
  }, []);

  const [selectedKeys, setSelectedKeys] = useState({});
  const [expandedKeys, setExpandedKeys] = useState({ fullSelected: true });

  // Flatten all keys for "Select All"
  //const allKeys = useMemo(() => options.map((option) => option), [options]);

  // Compute initial selected keys
  useEffect(() => {
    const initialKeys = {};
    initValue.forEach((value) => {
      initialKeys[value] = true;
    });
    setSelectedKeys(initialKeys);
  }, [initValue]);

  const treeData = useMemo(
    () => [
      {
        key: "fullSelected",
        label: "Select All",
        children: options.map((category) => ({
          key: category,
          label: category,
        })),
      },
    ],
    [options]
  );

  const handleSelectionChange = (e) => {
    let newSelectedKeys = { ...e.value };

    // Handle "Select All" checkbox
    if (newSelectedKeys["fullSelected"]?.checked) {
      newSelectedKeys = {};
      options.forEach((category) => {
        newSelectedKeys[category] = true;
      });
      newSelectedKeys["fullSelected"] = true;
    } else if (
      !newSelectedKeys["fullSelected"] &&
      selectedKeys["fullSelected"]
    ) {
      newSelectedKeys = {};
    }

    // Extract selected categories
    const selectedCategories = Object.keys(newSelectedKeys).filter(
      (key) => newSelectedKeys[key]
    );

    setSelectedKeys(newSelectedKeys);
    updateSelectedFilters(selectedCategories);

    trackDashboardClick({
      section: "Top filters",
      eventcategory: "som_category",
      eventaction: "select",
      eventlabel: selectedCategories.join(", "),
    });
  };

  const dropdownRef = useRef(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownVisible && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };

    if (isDropdownVisible) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownVisible]);

  return (
    <div className="card flex justify-content-center"
      onClick={(e) => {
        trackDashboardClick({
          section: "Top filters",
          eventcategory: "",
          eventaction: e.type,
          eventlabel: "som_category",
        });
      }}
    >
      {isDropdownVisible && (
        <div>
          {selectedItems.length > 0 && (
            <div className="selectItemsList" ref={dropdownRef}>
              {selectedItems.join(", ")}
            </div>
          )}
        </div>
      )}

      <TreeSelect
        value={selectedKeys}
        onChange={handleSelectionChange}
        options={treeData}
        filter
        metaKeySelection={false}
        className="md:w-20rem w-full"
        selectionMode="checkbox"
        display="chip"
        placeholder={labelledBy}
        style={{ maxHeight: "50px", overflowY: "auto" }}
        expandedKeys={expandedKeys}
        onToggle={(e) => setExpandedKeys(e.value)}
        valueTemplate={(value) => {
          if (value && selectedItems.length > 0) {
            const firstValue = selectedItems[0];
            return (
              <span>
                {firstValue.substring(0, 5)}
                {firstValue.length > 5 ? "..." : ""}
                {selectedItems.length > 1 && (
                  <span
                    className="selectCount"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleShowMoreTooltip(
                        e,
                        "som_category",
                        selectedItems.join(", ")
                      );
                    }}
                  >
                    +{selectedItems.length - 1} more
                  </span>
                )}
              </span>
            );
          } else {
            return <span>{labelledBy}</span>;
          }
        }}
      />
    </div>
  );
}