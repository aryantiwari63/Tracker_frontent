import React, { useEffect, useMemo, useRef, useState } from "react";
import { TreeSelect } from 'primereact/treeselect';

import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { trackDashboardClick } from "../../../../analytics/EventController";

export default function ColPalMTLocationTreeMultiSelect({

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
    const [selectedLocation, setSelectedLocation] = useState([]);
    const [expandedNodeKeys, setExpandedNodeKeys] = useState({ 'fullSelected': true });

    const mainData = useMemo(() => {

        const regionMap = {};
        options.forEach(city => {
            city.pincodes.forEach(pincode => {

                const { region, state, city, label, lable } = pincode;
                if (!regionMap[region]) {
                    regionMap[region] = {};
                }
                if (!regionMap[region][state]) {
                    regionMap[region][state] = {};
                }
                if (!regionMap[region][state][city]) {
                    regionMap[region][state][city] = {};
                }
                if (!regionMap[region][state][city][label ?? lable]) {
                    regionMap[region][state][city][label ?? lable] = {
                        "region": pincode.region,
                        "state": pincode.state,
                        "city": pincode.city,
                        "lable": pincode.lable,
                        "value": [...pincode.value],
                        "label": pincode.lable ? pincode.lable : pincode.label,
                        "pf_id": [...pincode.pf_id],
                    };
                    
                } else {
                    regionMap[region][state][city][label ?? lable]["value"].push(...(pincode?.value ?? []));
                    regionMap[region][state][city][label ?? lable]["pf_id"].push(...(pincode?.pf_id ?? []));
                }
            });
        })

        return regionMap;
    }, [options]);
    const transformToRegionTree = (regionMap) => {

        return Object.keys(regionMap).map((region) => ({
            key: `region-${region}`,
            label: region,
            children: Object.keys(regionMap[region]).map((state) => ({
                key: `state-${region}-${state}`,
                label: state,
                children: Object.keys(regionMap[region][state]).map((city) => ({
                    key: `city-${region}-${state}-${city}`,
                    label: city,
                    children: Object.keys(regionMap[region][state][city]).map((label) => {
                        const pincode = regionMap[region][state][city][label];
                        return ({                            
                                key: `pincode-${region}-${state}-${city}-${label}`,
                                label: pincode.label == '0' ? (pincode.value == '10' ? "Amazon" : pincode.value == '24' ? "Nykaa" : "Pincode" + pincode.value) : pincode.label,
                                data: pincode  
                            })
                    })
                })),
            })),
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
    const selectedValues = useMemo(() => initvalue.map(item =>`pincode-${item?.region}-${item?.state}-${item?.city}-${item?.label}`), [initvalue]);
    const allPincodeKeys = useMemo(() => options.flatMap(city => city?.pincodes?.map(item => `pincode-${item?.region}-${item?.state}-${item?.city}-${item?.label}`)), [options]);

    const computeSelectedKeys = (pincodeArray) => {
        let selectedKeys = {};

        pincodeArray.forEach(value => {
            selectedKeys[value] = { checked: true, partialChecked: false };
        });
        const regionMap = {};
        const stateMap = {};
        const cityMap = {};

        options.forEach(city => {
            city?.pincodes?.forEach(pincode => {
                const regionKey = `region-${pincode?.region}`;
                const stateKey = `state-${pincode?.region}-${pincode?.state}`;
                const cityKey = `city-${pincode?.region}-${pincode?.state}-${pincode?.city}`;
                const pincodeKey = `pincode-${pincode?.region}-${pincode?.state}-${pincode?.city}-${pincode?.label}`;

                if (!regionMap[regionKey]) regionMap[regionKey] = [];
                regionMap[regionKey].push(stateKey);

                if (!stateMap[stateKey]) stateMap[stateKey] = [];
                stateMap[stateKey].push(cityKey);

                if (!cityMap[cityKey]) cityMap[cityKey] = [];
                cityMap[cityKey].push(pincodeKey);
            });
        });

        const applyParentSelection = keys => {
            Object.entries(cityMap).forEach(([cityKey, pincodeList]) => {
                const selectedCount = pincodeList.filter(k => keys[k]?.checked).length;
                if (selectedCount === pincodeList.length) {
                    keys[cityKey] = { checked: true, partialChecked: false };
                } else if (selectedCount > 0) {
                    keys[cityKey] = { checked: false, partialChecked: true };
                }
            });

            Object.entries(stateMap).forEach(([stateKey, cityList]) => {
                const selectedCount = cityList.filter(k => keys[k]?.checked).length;
                const partialSelectedCount = cityList.filter(k => keys[k]?.partialChecked).length;
                if (selectedCount === cityList.length) {
                    keys[stateKey] = { checked: true, partialChecked: false };
                } else if (selectedCount>0 ||partialSelectedCount > 0) {
                    keys[stateKey] = { checked: false, partialChecked: true };
                }
            });

            Object.entries(regionMap).forEach(([regionKey, stateList]) => {
                const selectedCount = stateList.filter(k => keys[k]?.checked).length;
                const partialSelectedCount = stateList.filter(k => keys[k]?.partialChecked).length;
                if (selectedCount === stateList.length) {
                    keys[regionKey] = { checked: true, partialChecked: false };
                } else if (selectedCount>0 ||partialSelectedCount > 0) {
                    keys[regionKey] = { checked: false, partialChecked: true };
                }
            });

            return keys;
        };

        selectedKeys = applyParentSelection(selectedKeys);
        

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
                city?.pincodes?.forEach(pincode => {
                    newSelectedKeys[`region-${pincode?.region}`] = { checked: true, partialChecked: false };
                    newSelectedKeys[`state-${pincode?.region}-${pincode?.state}`] = { checked: true, partialChecked: false };
                    newSelectedKeys[`city-${pincode?.region}-${pincode?.state}-${pincode?.city}`] = { checked: true, partialChecked: false };
                    newSelectedKeys[`pincode-${pincode?.region}-${pincode?.state}-${pincode?.city}-${pincode?.label}`] = { checked: true, partialChecked: false };
                });
            });
            newSelectedKeys["fullSelected"] = { checked: true, partialChecked: false };

        } else if (!newSelectedKeys["fullSelected"]?.checked && !newSelectedKeys["fullSelected"]?.partialChecked && selectedKeys["fullSelected"]?.checked) {
            newSelectedKeys = {};
        }

        // Extract selected pincodes
        const selectedPincodes = options
            .flatMap(city => city.pincodes)
            .filter(pincode => newSelectedKeys[`pincode-${pincode?.region}-${pincode?.state}-${pincode?.city}-${pincode?.label}`]?.checked)
            .map(pincode => pincode);

        setSelectedKeys(newSelectedKeys);
        trackDashboardClick({ section: 'Top filters', eventcategory: 'location', eventaction: 'click', eventlabel: selectedPincodes })
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
                                {selectedItems.map(({ label }) => (label == 0) ? "Amazon" : (label == 24) ? "Nykaa" : label).join(", ")}
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
                            const firstValue = selectedItems?.[0]?.label?.toString();
                            return (<span>
                                {firstValue?.length ? firstValue?.substring(0, 5) : ''}{((firstValue?.length > 5) ? "..." : "")}
                                {(selectedItems.length > 1) &&
                                    (<>{" "}<span className="selectCount" onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleShowMoreTooltip(e, 'location', (selectedItems.map(({ label }) => (label == 0) ? "Amazon" : (label == 24) ? "Nykaa" : label).join(", "))) }}>+{selectedItems.length - 1} more</span></>)
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