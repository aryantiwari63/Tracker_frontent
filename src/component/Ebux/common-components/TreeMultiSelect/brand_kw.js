import React, { useEffect, useMemo, useRef, useState } from "react";
import { TreeSelect } from 'primereact/treeselect';

import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { trackDashboardClick } from "../../../../analytics/EventController";

export default function KwBrandTreeMultiSelect({
    initvalue=[],
    options = [],
    labelledBy = "Select",
    selectedItems=[],
    toggleShowMoreTooltip=()=>{},
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
    },[])
    const [selectedBrand, setSelectedBrand] = useState([]);
    const [expandedNodeKeys, setExpandedNodeKeys] = useState({ 'fullSelected': true });
    const treeData = useMemo(() => [
        {
            key: "fullSelected",
            label: "Select All",
            children: options.flatMap(brand => (brand?.sub_brands))?.map(sub_brand => {
                    console.log("sub_brand", sub_brand);
                    
                    return ({
                    key: `${sub_brand.mother_brand}_${sub_brand.sub_brand}`,
                    label: sub_brand?.mother_brand ?? sub_brand?.label,
                    data: sub_brand
                }
            )}
        )
        
            // }
        // ))
        }
    ], [options]);
    const selectedValues =  useMemo(() =>initvalue.map(item => `${item.mother_brand}_${item.sub_brand}`), [initvalue]);
    const allKeys = options.flatMap(brand => brand.sub_brands.map(sub_brand => `${sub_brand.mother_brand}_${sub_brand.sub_brand}`));
    
    const computeSelectedKeys = (sub_brandArray) => {
        let selectedKeys = {};

        sub_brandArray.forEach(value => {
            selectedKeys[value] = { checked: true, partialChecked: false };
        });

        options.forEach(brand => {
            const brand_sub_brands = brand.sub_brands.map(sub_brand => `${sub_brand.mother_brand}_${sub_brand.sub_brand}`);
            const selected_brand_sub_brands = brand_sub_brands.filter(value => selectedKeys[value]?.checked);

            selectedKeys[brand.value] = selected_brand_sub_brands.length === brand_sub_brands.length 
                ? { checked: true, partialChecked: false } 
                : selected_brand_sub_brands.length > 0
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
        // setSelectedBrand(initvalue);

    }, [JSON.stringify(initvalue), JSON.stringify(options)]);

    useEffect(() => {
        setSelectedBrand(initvalue);

    }, []);
    const handleSelectionChange = (e) => {
        let newSelectedKeys = { ...e.value };

        // Handle "Select All"
        if (newSelectedKeys["fullSelected"]?.checked) {
            newSelectedKeys = {};
            options.forEach(brand => {
                newSelectedKeys[brand.value] = { checked: true, partialChecked: false };
                brand.sub_brands.forEach(sub_brand => {
                    newSelectedKeys[`${sub_brand?.mother_brand}_${sub_brand?.sub_brand}`] = { checked: true, partialChecked: false };
                });
            });
            newSelectedKeys["fullSelected"] = { checked: true, partialChecked: false };

        } else if (!newSelectedKeys["fullSelected"]?.checked && !newSelectedKeys["fullSelected"]?.partialChecked && selectedKeys["fullSelected"]?.checked) {
            newSelectedKeys = {};
        }

        // Extract selected pincodes
        const selectedBrands = options
            .flatMap(brand => brand.sub_brands)
            .filter(sub_brand => newSelectedKeys[`${sub_brand?.mother_brand}_${sub_brand.sub_brand}`]?.checked)
            .map(sub_brand => sub_brand);

        setSelectedKeys(newSelectedKeys);
        setSelectedBrand(selectedBrands);
        updateSelectedFilters(selectedBrands);
        trackDashboardClick({section:'Top filters',eventcategory:'brand',eventaction:e.type,eventlabel: selectedBrands});
    };
    useEffect(() => {
            // updateSelectedFilters(selectedBrand);
        }, [selectedBrand]);

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
        if(isDropdownVisible){
        document.addEventListener("click", handleClickOutside);
        }else{
        document.removeEventListener("click", handleClickOutside);
        }
        return () => {
        document.removeEventListener("click", handleClickOutside);
        };
    }, [isDropdownVisible]);

    return (
        <>
            <div className="card flex justify-content-center"
            onClick={(e)=>{
                trackDashboardClick({section:'Top filters',eventcategory:'',eventaction:e.type,eventlabel: 'brand'});
            }}>

                {isDropdownVisible && (
                    <div>
                        {selectedItems.length > 0 && (
                            <div className="selectItemsList"  ref={dropdownRef}>
                                {selectedItems.map(({ sub_brand }) => sub_brand).join(", ")}
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
                        if (e&&selectedItems.length > 0) {
                            const firstValue= selectedItems?.[0]?.sub_brand;
                            return (<span>
                                {firstValue?.length?firstValue?.substring(0, 5):''}{((firstValue?.length>5)?"...":"")}                                
                                {(selectedItems.length > 1) &&
                                    (<>{" "}<span className="selectCount"  onClick={(e)=>{  e.preventDefault(); e.stopPropagation(); toggleShowMoreTooltip(e,'brand',(selectedItems.map(({ sub_brand }) => sub_brand).join(", "))) }}>+{selectedItems.length - 1} more</span></>)
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