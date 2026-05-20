import React, { useEffect, useMemo, useState } from "react";
import { TreeSelect } from 'primereact/treeselect';
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { trackDashboardClick } from "../../../../analytics/EventController";

export default function DarkstoreTreeMultiSelect({
    initvalue = [],
    options = [],
    selectedItems = [],
    labelledBy = "Select",

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
            document.head.appendChild(style);
        }
    };

    useEffect(() => {
        injectDynamicStyles();
    }, [])

    const [selectedDarkstore, setSelectedDarkstore] = useState([]);

    const [expandedNodeKeys, setExpandedNodeKeys] = useState({ 'fullSelected': true });
    const treeData = useMemo(() => [
        {
            key: "fullSelected",
            label: "Select All",
            children: options.map(zone => ({
                key: zone.value,
                label: (<b>{zone?.lable ?? zone?.lable}</b>),
                data: { label: zone?.lable },
                children: zone?.city.map(city => ({
                    key: `${city?.zone}-${city.value}`,
                    label: city?.lable ?? city?.lable,
                    children: city.darkstore_id.map(darkstore => ({
                        key: `${darkstore?.zone}-${darkstore?.city}-${darkstore.value}`,
                        label: (
                            <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                <span style={{ marginLeft: "8px" }}>{darkstore.label}</span>
                                <Button
                                    id={`store_${darkstore?.store_data_id}${darkstore.value}`} // Unique ID for tooltip
                                    icon="pi pi-info-circle"
                                    className="p-button-text p-button-sm"
                                    onClick={(e) => e.stopPropagation()} // Prevents selection
                                />
                                <Tooltip target={`#store_${darkstore?.store_data_id}${darkstore.value}`} content={darkstore?.address != '0' ? darkstore?.address : darkstore?.locality != '0' ? darkstore.locality : `${darkstore?.city}, ${darkstore?.state} - ${darkstore?.pincode}`} style={{ maxWidth: "250px", whiteSpace: "normal" }} position="right" />
                            </div>
                        ),
                        data: darkstore
                    }))
                }))
            }))
        }
    ], [options]);
    const selectedValues = useMemo(() => initvalue.map(item => item), [initvalue]);
    const allDarkStoreKeys = options.flatMap(zone => zone.city).flatMap(city => city.darkstore_id.map(darkstore => `${darkstore?.zone}-${darkstore?.city}-${darkstore.value}`));

    const computeSelectedKeys = (darkStoreArray) => {
        let selectedKeys = {};
        console.log({ darkStoreArray });

        darkStoreArray.forEach(darkstore => {
            selectedKeys[`${darkstore?.zone}-${darkstore?.city}-${darkstore.value}`] = { checked: true, partialChecked: false };
        });

        options.forEach(zone => {
            zone.city.forEach(city => {
                const cityDarkStores = city.darkstore_id;
                const selectedCityDarkStores = cityDarkStores.filter(darkstore => selectedKeys[`${darkstore?.zone}-${darkstore?.city}-${darkstore.value}`]?.checked);

                selectedKeys[`${city?.zone}-${city.value}`] = selectedCityDarkStores.length === cityDarkStores.length
                    ? { checked: true, partialChecked: false }
                    : selectedCityDarkStores.length > 0
                        ? { checked: false, partialChecked: true }
                        : { checked: false, partialChecked: false };
            })
            const zoneCities = zone.city.map(city => `${city?.zone}-${city.value}`);
            const selectedZoneCities = zoneCities.filter(value => selectedKeys[value]?.checked);
            const partialSelectedZoneCities = zoneCities.filter(value => selectedKeys[value]?.partialChecked);
            selectedKeys[zone.value] = selectedZoneCities.length === zoneCities.length
                ? { checked: true, partialChecked: false }
                : (selectedZoneCities.length > 0 || partialSelectedZoneCities.length > 0)
                    ? { checked: false, partialChecked: true }
                    : { checked: false, partialChecked: false };
        });

        selectedKeys.fullSelected = allDarkStoreKeys.every(value => selectedKeys[value]?.checked)
            ? { checked: true, partialChecked: false }
            : Object.keys(selectedKeys).length > 0
                ? { checked: false, partialChecked: true }
                : { checked: false, partialChecked: false };

        return selectedKeys;
    };
    const [selectedKeys, setSelectedKeys] = useState(computeSelectedKeys(selectedValues));
    useEffect(() => {
        setSelectedKeys(computeSelectedKeys(selectedValues));
        // setSelectedDarkstore(initvalue);

    }, [JSON.stringify(initvalue), JSON.stringify(options)]);
    useEffect(() => {
        setSelectedDarkstore(initvalue);

    }, []);
    const handleSelectionChange = (e) => {
        let newSelectedKeys = { ...e.value };

        // Handle "Select All"
        if (newSelectedKeys["fullSelected"]?.checked) {
            newSelectedKeys = {};
            options.forEach(zone => {
                zone.city.forEach(city => {
                    newSelectedKeys[`${city?.zone}-${city.value}`] = { checked: true, partialChecked: false };
                    city.darkstore_id.forEach(darkstore => {
                        newSelectedKeys[`${darkstore?.zone}-${darkstore?.city}-${darkstore.value}`] = { checked: true, partialChecked: false };
                    });
                });
                newSelectedKeys[zone.value] = { checked: true, partialChecked: false };
            });
            newSelectedKeys["fullSelected"] = { checked: true, partialChecked: false };

        } else if (!newSelectedKeys["fullSelected"]?.checked && !newSelectedKeys["fullSelected"]?.partialChecked && selectedKeys["fullSelected"]?.checked) {
            newSelectedKeys = {};
        }

        // Extract selected pincodes
        const selectedDarkstores = options
            .flatMap(zone => zone.city)
            .flatMap(city => city.darkstore_id)
            .filter(darkstore => newSelectedKeys[`${darkstore?.zone}-${darkstore?.city}-${darkstore.value}`]?.checked)
            .map(darkstore => darkstore);

        setSelectedKeys(newSelectedKeys);
        setSelectedDarkstore(selectedDarkstores);
        updateSelectedFilters('selectedDarkstore', selectedDarkstores);
        trackDashboardClick({ section: 'Top filters', eventcategory: 'darkstore', eventaction: 'click', eventlabel: selectedDarkstores })
    };

    useEffect(() => {
        // console.log("store change",selectedDarkstore);
        // updateSelectedFilters('selectedDarkstore', selectedDarkstore);
    }, [selectedDarkstore]);



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
            if (isDropdownVisible && event) {
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
            <div className="card flex justify-content-center"
                onClick={(e) => {
                    trackDashboardClick({ section: 'Top filters', eventcategory: '', eventaction: e.type, eventlabel: 'darkstore' });
                }}
            >

                {isDropdownVisible && (
                    <div>
                        {selectedItems.length > 0 && (
                            <div className="selectItemsList">
                                {selectedItems.map(({ label }) => (label == 0) ? "Amazon" : (label == 24) ? "Nykaa" : label).join(", ")}
                            </div>
                        )}
                    </div>
                )}
                <TreeSelect value={selectedKeys}
                    onChange={handleSelectionChange}

                    options={treeData} filter
                    filterBy="key"
                    metaKeySelection={false}
                    className="md:w-20rem w-full"
                    selectionMode="checkbox" display="chip"
                    placeholder={labelledBy}
                    style={{ maxHeight: '50px', overflowY: 'auto' }}
                    expandedKeys={expandedNodeKeys}
                    onToggle={e => setExpandedNodeKeys(e.value)}
                    valueTemplate={(e) => {
                        if (e && selectedItems.length > 0 && e) {
                            // const firstValue= ((e?.[0]?.key == 'fullSelected') ? ( e?.[1]?.data?.label || e?.[1]?.label || e?.[1]?.lable ) : (e?.[0]?.data?.label || e?.[0]?.label || e?.[0]?.lable));
                            const firstValue = selectedItems?.[0]?.label;

                            return (<span>
                                {/* {(e[0]?.key == 'fullSelected') ? e[1]?.label : e[0]?.label}
                                {(selectedDarkstore.length > 1) &&
                                    (<>...{" "}<span className="selectCount">+{selectedDarkstore.length - 1} more</span></>)
                                } */}
                                {firstValue?.length ? firstValue?.substring(0, 5) : ''}{((firstValue?.length > 5) ? "..." : "")}
                                {(selectedItems.length > 1) &&
                                    (<>{" "}<span className="selectCount" onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleShowMoreTooltip(e, 'brand', (selectedItems.map(({ label }) => (label == 0) ? "Amazon" : (label == 24) ? "Nykaa" : label).join(", "))) }} >+{selectedItems.length - 1} more</span></>)
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
