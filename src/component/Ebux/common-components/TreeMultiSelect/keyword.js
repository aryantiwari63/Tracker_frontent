import React, { useEffect, useMemo, useRef, useState } from "react";
import { TreeSelect } from 'primereact/treeselect';

import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { trackDashboardClick } from "../../../../analytics/EventController";
// import { createPortal } from "react-dom";

// const Tooltip = ({ infoTooltip, position }) => {
//     if (!infoTooltip) return null;

//     return createPortal(
//         <div
//             className="fixed bg-gray-800 text-white text-xs p-2 rounded-md  z-[1000000001000]"
//             style={{ top: position.top - 10, left: position.left }}
//         >
//             {position?.open == 'left' && (
//                 <div
//                     className="absolute top-3 left-[-4px] transform -translate-y-1/2 w-0 h-0 
//             border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-gray-800"
//                 ></div>
//             )}
//             {position?.open == 'bottom' && (
//                 <div
//                     className="absolute top-[-4px] left-1/2 transform -translate-x-1/2 w-0 h-0 
//        border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-gray-800"
//                 ></div>
//             )}
//             {(infoTooltip && typeof infoTooltip === 'object') ?
//                 <ul>
//                     {Object.entries(infoTooltip).map(([key, value]) => (
//                         <li key={key}>
//                             <strong>{key.replace(/_/g, " ")}:</strong> {value}
//                         </li>
//                     ))}
//                 </ul>
//                 :
//                 <span>{infoTooltip}</span>
//             }
//             {position?.open == 'top' && (
//                 <div
//                     className="absolute bottom-[-4px] left-[58px] transform -translate-x-1/2 w-0 h-0 
//         border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-800"
//                 ></div>

//             )}
//         </div>,
//         document.body
//     );
// };
export default function KeywordTreeMultiSelect({
    // clientId=undefined,
    // kpi=undefined,
    label = "Keyword",
    disabled = false,
    // selected_sos_option = "actual_sos",
    // updateSelectedSOSOption = () => { },
    initvalue = [],
    options = [],
    labelledBy = "Select",
    selectedItems = [],
    toggleShowMoreTooltip = () => { },
    updateSelectedFilters = () => { }
}) {
    const injectDynamicStyles = () => {
        const platformColor = "#0081F7";
        const styleId = "table-darkstore-tree";

        if (!document.getElementById(styleId)) {
            const style = document.createElement("style");
            style.id = styleId;
            const css = `
                .p-dropdown-items > .p-dropdown-item:hover {
                background: ${platformColor} !important;
                }
        
                .p-checkbox .p-checkbox-box.p-highlight{
                border-color: ${platformColor} !important;
                background: ${platformColor} !important;
                }
        
                .p-checkbox .p-checkbox-box .p-checkbox-icon.p-icon {
                background:${platformColor} !important;
                }
            .p-tree .p-tree-container .p-treenode .p-treenode-content.p-highlight .p-tree-toggler{
                color: #000000 !important;
            }
                .p-treeselect:not(.p-disabled):hover, .p-inputtext:enabled:hover, .p-inputtext:enabled:focus{
                border-color: ${platformColor} !important;
                box-shadow: none !important;
                }
                .p-tree .p-tree-container .p-treenode .p-treenode-content.p-highlight {
                background: #ffffff !important;
                color: #000000 !important;
                }
                .p-tree-toggler:focus, .p-treenode-content:focus, .p-inputtext:enabled:focus {
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
            // document.head.appendChild(style);
        }
    };

    useEffect(() => {
        injectDynamicStyles();
    }, [])
    const [selectedKeyword, setSelectedKeyword] = useState([]);
    const [expandedNodeKeys, setExpandedNodeKeys] = useState({ 'fullSelected': true });
    const treeData = useMemo(() => [
        {
            key: "fullSelected",
            label: "Select All",
            children: options.map(keyword_type => ({
                key: keyword_type.value,
                label: keyword_type?.label ?? keyword_type?.label,
                children: keyword_type.keywords.map(keyword => ({
                    key: `${keyword.keyword_type}_${keyword.keyword}`,
                    label: keyword.keyword,
                    data: keyword
                }))
            }))
        }
    ], [options]);
    const selectedValues = useMemo(() => initvalue.map(item => `${item.keyword_type}_${item.keyword}`), [initvalue]);
    const allKeys = options.flatMap(keyword_type => keyword_type.keywords.map(keyword => `${keyword.keyword_type}_${keyword.keyword}`));

    const computeSelectedKeys = (sub_brandArray) => {
        let selectedKeys = {};

        sub_brandArray.forEach(value => {
            selectedKeys[value] = { checked: true, partialChecked: false };
        });

        options.forEach(keyword_type => {
            const sub_items = keyword_type.keywords.map(keyword => `${keyword.keyword_type}_${keyword.keyword}`);
            const selected_sub_items = sub_items.filter(value => selectedKeys[value]?.checked);

            selectedKeys[keyword_type.value] = selected_sub_items.length === sub_items.length
                ? { checked: true, partialChecked: false }
                : selected_sub_items.length > 0
                    ? { checked: false, partialChecked: true }
                    : { checked: false, partialChecked: false };
        });

        selectedKeys.fullSelected = allKeys.every(value => selectedKeys[value]?.checked)
            ? { checked: true, partialChecked: false }
            : Object.keys(selectedKeys).length > 0
                ? { checked: false, partialChecked: true }
                : { checked: false, partialChecked: false };

        return selectedKeys;
    };
    const [selectedKeys, setSelectedKeys] = useState(computeSelectedKeys(selectedValues));


    useEffect(() => {
        setSelectedKeys(computeSelectedKeys(selectedValues));
        // setSelectedKeyword(initvalue);

    }, [JSON.stringify(initvalue), JSON.stringify(options)]);

    useEffect(() => {
        setSelectedKeyword(initvalue);

    }, []);
    const handleSelectionChange = (e) => {
        let newSelectedKeys = { ...e.value };

        // Handle "Select All"
        if (newSelectedKeys["fullSelected"]?.checked) {
            newSelectedKeys = {};
            options.forEach(keyword_type => {
                newSelectedKeys[keyword_type.value] = { checked: true, partialChecked: false };
                keyword_type.keywords.forEach(keyword => {
                    newSelectedKeys[`${keyword?.keyword_type}_${keyword?.keyword}`] = { checked: true, partialChecked: false };
                });
            });
            newSelectedKeys["fullSelected"] = { checked: true, partialChecked: false };

        } else if (!newSelectedKeys["fullSelected"]?.checked && !newSelectedKeys["fullSelected"]?.partialChecked && selectedKeys["fullSelected"]?.checked) {
            newSelectedKeys = {};
        }

        // Extract selected pincodes
        const selectedKeywords = options
            .flatMap(keyword_type => keyword_type.keywords)
            .filter(keyword => newSelectedKeys[`${keyword?.keyword_type}_${keyword.keyword}`]?.checked)
            .map(keyword => keyword);

        setSelectedKeys(newSelectedKeys);
        setSelectedKeyword(selectedKeywords);
        updateSelectedFilters(selectedKeywords);
        trackDashboardClick({ section: 'Top filters', eventcategory: 'keyword', eventaction: 'click', eventlabel: selectedKeywords })
    };
    useEffect(() => {
        // updateSelectedFilters(selectedKeyword);
    }, [selectedKeyword]);

    const dropdownRef = useRef(null);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    // const handleMouseEnter = () => {
    //     setIsDropdownVisible(true);
    // };
    // const handleMouseLeave = () => {
    //     setIsDropdownVisible(false);
    // };
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Assuming you can identify the popover element by class or other means
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
    // const [infoTooltip, setInfoTooltip] = useState(null);
    // const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

    // const toggleTooltip = (event, option, open = "left") => {

    //     const rect = event.currentTarget.getBoundingClientRect();
    //     if (open == "top") {
    //         setTooltipPosition({
    //             open,
    //             top: rect.top + window.scrollY - 35,
    //             left: rect.left - 55,
    //         });
    //     } else {
    //         setTooltipPosition({
    //             open,
    //             top: rect.top + rect.height / 2,
    //             left: rect.right + window.scrollX + 8,
    //         });
    //     }
    //     setInfoTooltip(option);

    // };
    return (
        <div
            className={`ebuxHeadBox ${disabled ? "cursor-not-allowed opacity-40" : ""
                }`}
        >
            {/* <Tooltip infoTooltip={infoTooltip} position={tooltipPosition} onClose={() => setInfoTooltip(null)} /> */}

            <div className="flex justify-between items-center w-full">
                <label style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>{label}</label>
                {/* {clientId && clientId == 4 && kpi=="SOS" ? (
                    <div className="flex space-x-2">
                        <label style={{ display: "inline-flex", alignItems: "center", gap: "2px" }}>
                            <input
                                type="radio"
                                name="sos_option"
                                value="actual_sos"
                                checked={selected_sos_option === "actual_sos"}
                                onChange={(e) => updateSelectedSOSOption(e.target.value)}
                                className="cursor-pointer"
                            />
                            <span>Actual</span>
                            <img
                                src="/assets/images/imp.svg"
                                className="cursor-pointer w-[8px] h-[12px]"
                                onMouseEnter={(event) => toggleTooltip(event,"Search results for the keyword mapped to specific mother brands is counted under Actual SOS", "top")}
                                onMouseLeave={() => setInfoTooltip(null)}
                            />
                        </label>
                        <label style={{ display: "inline-flex", alignItems: "center", gap: "2px" }}>
                            <input
                                type="radio"
                                name="sos_option"
                                value="blended_sos"
                                checked={selected_sos_option === "blended_sos"}
                                onChange={(e) => updateSelectedSOSOption(e.target.value)}
                                className="cursor-pointer"
                            />
                            <span>Blended</span>
                            <img
                                src="/assets/images/imp.svg"
                                className="cursor-pointer w-[8px] h-[12px]"
                                onMouseEnter={(event) => toggleTooltip(event, "Search results mapped for the keyword to all Perfetti mother brands is counted under Blended SOS", "top")}
                                onMouseLeave={() => setInfoTooltip(null)}
                            />
                        </label>
                    </div>

                ) : (<></>)} */}

            </div>
            <div className="card flex justify-content-center"
                onClick={(e) => {
                    trackDashboardClick({ section: 'Top filters', eventcategory: '', eventaction: e.type, eventlabel: 'keyword' })
                }}
            >
                {isDropdownVisible && (
                    <div>
                        {selectedItems.length > 0 && (
                            <div className="selectItemsList" ref={dropdownRef}>
                                {selectedItems.map(({ keyword }) => keyword).join(", ")}
                            </div>
                        )}
                    </div>
                )}
                <TreeSelect value={selectedKeys}
                    onChange={handleSelectionChange}
                    options={treeData} filter
                    metaKeySelection={false}
                    className="md:w-20rem w-full"
                    selectionMode="checkbox" display="chip"
                    placeholder={labelledBy}
                    style={{ maxHeight: '50px', overflowY: 'auto' }}
                    expandedKeys={expandedNodeKeys}
                    onToggle={e => setExpandedNodeKeys(e.value)}
                    valueTemplate={(e) => {
                        if (e && selectedItems.length > 0) {
                            const firstValue = selectedItems?.[0]?.label;
                            return (<span>
                                {firstValue?.length ? firstValue?.substring(0, 5) : ''}{((firstValue?.length > 5) ? "..." : "")}
                                {(selectedItems.length > 1) &&
                                    (<>{" "}<span className="selectCount" onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleShowMoreTooltip(e, 'brand', (selectedItems.map(({ label }) => label).join(", "))) }}>+{selectedItems.length - 1} more</span></>)
                                }
                            </span>
                            );

                        } else {
                            return (
                                <span>
                                    {labelledBy}
                                </span>
                            );
                        }
                    }}
                ></TreeSelect>

            </div>
        </div>
    );
}