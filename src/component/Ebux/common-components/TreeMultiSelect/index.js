import React, { useEffect, useMemo, useRef, useState } from "react";
import { TreeSelect } from 'primereact/treeselect';

import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { trackDashboardClick } from "../../../../analytics/EventController";

export default function TreeMultiSelect({
   
    initvalue=[],
    options = [],
    labelledBy = "Select",
    selectedItems=[],
    toggleShowMoreTooltip= () => { },
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
    },[])
    const [selectedLocation, setSelectedLocation] = useState([]);
    const [expandedNodeKeys, setExpandedNodeKeys] = useState({ 'fullSelected': true });
    const treeData = useMemo(() => [
        {
            key: "fullSelected",
            label: "Select All",
            children: options.map(city => ({
                key: city.value,
                label: city?.lable ?? city?.lable,
                children: city.pincodes.map(pincode => ({
                    key: pincode.value,
                    label: pincode.label == '0' ? (pincode.value == '10' ? "Amazon" : pincode.value == '24' ? "Nykaa" : "Pincode" + pincode.value) : pincode.label,
                    data: pincode
                }))
            }))
        }
    ], [options]);
    const selectedValues =  useMemo(() =>initvalue.map(item => item.value), [initvalue]);
    const allPincodeKeys = options.flatMap(city => city.pincodes.map(pincode => pincode.value));
    
    const computeSelectedKeys = (pincodeArray) => {
        let selectedKeys = {};

        pincodeArray.forEach(value => {
            selectedKeys[value] = { checked: true, partialChecked: false };
        });

        options.forEach(city => {
            const cityPincodes = city.pincodes.map(pincode => pincode.value);
            const selectedPincodes = cityPincodes.filter(value => selectedKeys[value]?.checked);

            selectedKeys[city.value] = selectedPincodes.length === cityPincodes.length 
                ? { checked: true, partialChecked: false } 
                : selectedPincodes.length > 0
                ? { checked: false, partialChecked: true }
                : { checked: false, partialChecked: false };
        });

        selectedKeys.fullSelected = allPincodeKeys.every(value => selectedKeys[value]?.checked)
            ? { checked: true, partialChecked: false }
            : Object.keys(selectedKeys).length > 0
            ? { checked: false, partialChecked: true }
            : { checked: false, partialChecked: false };

        return selectedKeys;
    };
    const [selectedKeys, setSelectedKeys] = useState(computeSelectedKeys(selectedValues));

    
    useEffect(() => {
        setSelectedKeys(computeSelectedKeys(selectedValues));
        // setSelectedLocation(initvalue);

    }, [JSON.stringify(initvalue), JSON.stringify(options)]);
    useEffect(() => {
        setSelectedLocation(initvalue);

    }, []);
    const handleSelectionChange = (e) => {
        let newSelectedKeys = { ...e.value };

        // Handle "Select All"
        if (newSelectedKeys["fullSelected"]?.checked) {
            newSelectedKeys = {};
            options.forEach(city => {
                newSelectedKeys[city.value] = { checked: true, partialChecked: false };
                city.pincodes.forEach(pincode => {
                    newSelectedKeys[pincode.value] = { checked: true, partialChecked: false };
                });
            });
            newSelectedKeys["fullSelected"] = { checked: true, partialChecked: false };

        } else if (!newSelectedKeys["fullSelected"]?.checked && !newSelectedKeys["fullSelected"]?.partialChecked && selectedKeys["fullSelected"]?.checked) {
            newSelectedKeys = {};
        }

        // Extract selected pincodes
        const selectedPincodes = options
            .flatMap(city => city.pincodes)
            .filter(pincode => newSelectedKeys[pincode.value]?.checked)
            .map(pincode => pincode);

        setSelectedKeys(newSelectedKeys);
        trackDashboardClick({section:'Top filters',eventcategory:'location',eventaction:'click',eventlabel:selectedPincodes})
        setSelectedLocation(selectedPincodes);
        updateSelectedFilters('selectedLocation', selectedPincodes);
    };
    useEffect(() => {
            // updateSelectedFilters('selectedLocation', selectedLocation);
        }, [selectedLocation]);

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
            <div className="card flex justify-content-center" onClick={(e)=>{
                trackDashboardClick({section:'Top filters',eventcategory:'',eventaction:e.type,eventlabel:'location'})
            }} >

                {isDropdownVisible && (
                    <div>
                        {selectedItems.length > 0 && (
                            <div className="selectItemsList" ref={dropdownRef}>
                                {selectedItems.map(({ label }) => (label==0) ? "Amazon": (label == 24 )? "Nykaa" :label).join(", ")}
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
                        if (e&&selectedItems.length > 0 && e) {
                            const firstValue= selectedItems?.[0]?.label?.toString();                           
                            return (<span>
                                {firstValue?.length?firstValue?.substring(0, 5):''}{((firstValue?.length>5)?"...":"")}
                                {(selectedItems.length > 1) &&
                                    (<>{" "}<span className="selectCount"   onClick={(e)=>{  e.preventDefault(); e.stopPropagation(); toggleShowMoreTooltip(e,'location',(selectedItems.map(({ label }) => (label==0) ? "Amazon": (label == 24 )? "Nykaa" :label).join(", "))) }}>+{selectedItems.length - 1} more</span></>)
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