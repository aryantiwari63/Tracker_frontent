import React, { useEffect, useMemo, useRef, useState } from "react";
import { TreeSelect } from 'primereact/treeselect';

import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { trackDashboardClick } from "../../../../analytics/EventController";

export default function ColPalMTBrandTreeMultiSelect({

    initvalue = [],
    options = [],
    labelledBy = "Select",
    selectedItems = [],
    toggleShowMoreTooltip = () => { },
    updateSelectedFilters = () => { },
    disabled,

}) {
    const injectDynamicStyles = () => {
        const platformColor = "#0081F7";
        const styleId = "table-darkstore-tree";

        if (!document.getElementById(styleId)) {
            const style = document.createElement("style");
            style.id = styleId;
            const css = `
                .p-treenode-label{
                width: 100% !important;
                }
                .p-treeselect-panel{
                    max-width: 350px !important;
                }
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
                .p-tree .p-tree-container .p-treenode .p-treenode-content.p-highlight:hover{
                    background: #EEF2FF !important;
                }
            `;
            style.textContent = css;
            document.head.appendChild(style);
        }
    };

    useEffect(() => {
        injectDynamicStyles();
    }, [])
    const [expandedNodeKeys, setExpandedNodeKeys] = useState({ 'fullSelected': true });

    const mainData = useMemo(() => {

        const brandMap = {};
        options.forEach(item => {

            const { label: brand, sub_brand } = item;
            if (!brandMap[brand]) {
                brandMap[brand] = {};
            }

            if (!brandMap[brand][sub_brand]) {
                brandMap[brand][sub_brand] = { ...item };
            }
        })

        return brandMap;
    }, [options]);
    const transformToRegionTree = (brandMap) => {

        return Object.keys(brandMap).map((brand) => ({
            key: `brand-${brand}`,
            label: brand,
            children: Object.keys(brandMap[brand]).map((sub_brand) => {
                const item = brandMap[brand][sub_brand];
                return ({
                    key: `brand-${brand}-${sub_brand}`,
                    label: sub_brand,
                    data: item
                })
            })
        }));
    };
    const treeData = useMemo(() => {

        const transformed = transformToRegionTree(mainData);
        return [
            {
                key: "fullSelected",
                label: "Select All",
                children: transformed,
            }
        ];
    }, [mainData]);
    const selectedValues = useMemo(() => initvalue?.map(item => `brand-${item?.label}-${item?.sub_brand}`), [initvalue]);
    const allKeys = useMemo(() => options?.map(item => `brand-${item?.label}-${item?.sub_brand}`), [options]);

    const computeSelectedKeys = (brandArray) => {
        let selectedKeys = {};

        brandArray.forEach(value => {
            selectedKeys[value] = { checked: true, partialChecked: false };
        });
        const brandMap = {};

        options.forEach(item => {
                const brandKey = `brand-${item?.label}`;
                const sub_brandKey = `brand-${item?.label}-${item?.sub_brand}`;

                if (!brandMap[brandKey]) brandMap[brandKey] = [];
                brandMap[brandKey].push(sub_brandKey);
        });

        const applyParentSelection = keys => {
            Object.entries(brandMap).forEach(([brandKey, sub_brand_list]) => {
                const selectedCount = sub_brand_list.filter(k => keys[k]?.checked).length;
                if (selectedCount === sub_brand_list.length) {
                    keys[brandKey] = { checked: true, partialChecked: false };
                } else if (selectedCount > 0) {
                    keys[brandKey] = { checked: false, partialChecked: true };
                }
            });

            return keys;
        };

        selectedKeys = applyParentSelection(selectedKeys);


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

    }, [JSON.stringify(initvalue), JSON.stringify(options)]);
    const handleSelectionChange = (e) => {
        let newSelectedKeys = { ...e.value };

        // Handle "Select All"
        if (newSelectedKeys["fullSelected"]?.checked) {
            newSelectedKeys = {};
            options.forEach(item => {
                newSelectedKeys[`brand-${item?.label}`] = { checked: true, partialChecked: false };
                newSelectedKeys[`brand-${item?.label}-${item?.sub_brand}`] = { checked: true, partialChecked: false };               
            });
            newSelectedKeys["fullSelected"] = { checked: true, partialChecked: false };

        } else if (!newSelectedKeys["fullSelected"]?.checked && !newSelectedKeys["fullSelected"]?.partialChecked && selectedKeys["fullSelected"]?.checked) {
            newSelectedKeys = {};
        }

        // Extract selected pincodes
        const selectedbrands = options
            .filter(item => newSelectedKeys[`brand-${item?.label}-${item?.sub_brand}`]?.checked)
            .map(item => item);

        setSelectedKeys(newSelectedKeys);
        updateSelectedFilters(selectedbrands);
    };

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

    return (
        <>
            <div className="card flex justify-content-center" onClick={(e) => {
                trackDashboardClick({ section: 'Top filters', eventcategory: '', eventaction: e.type, eventlabel: 'location' })
            }} >

                {isDropdownVisible && (
                    <div>
                        {selectedItems.length > 0 && (
                            <div className="selectItemsList" ref={dropdownRef}>
                                {selectedItems.map(({ sub_brand }) => sub_brand).join(", ")}
                            </div>
                        )}
                    </div>
                )}
                <TreeSelect
                    disabled={disabled}
                    value={selectedKeys}
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
                        if (e && selectedItems.length > 0 && e) {
                            const firstValue = selectedItems?.[0]?.sub_brand?.toString();
                            return (<span>
                                {firstValue?.length ? firstValue?.substring(0, 5) : ''}{((firstValue?.length > 5) ? "..." : "")}
                                {(selectedItems.length > 1) &&
                                    (<>{" "}<span className="selectCount" onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleShowMoreTooltip(e, 'location', (selectedItems.map(({ sub_brand }) => sub_brand).join(", "))) }}>+{selectedItems.length - 1} more</span></>)
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

            </div></>
    );
}