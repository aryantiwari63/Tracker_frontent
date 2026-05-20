import React, { useEffect, useMemo, useRef, useState } from "react";
import { TreeSelect } from 'primereact/treeselect';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { createPortal } from "react-dom";

const Tooltip = ({ infoTooltip, position }) => {
  if (!infoTooltip) return null;

  return createPortal(
    <div
      className="fixed bg-gray-800 text-white text-xs p-2 rounded-md  z-[1000000001000]"
      style={{ top: position.top-10, left: position.left }}
    >
        {position?.open=='left'&&(
            <div
            className="absolute top-3 left-[-4px] transform -translate-y-1/2 w-0 h-0 
            border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-gray-800"
            ></div>
        )}
        {position?.open=='bottom'&&(
                <div
       className="absolute top-[-4px] left-1/2 transform -translate-x-1/2 w-0 h-0 
       border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-gray-800"
        ></div>
        )}

      <ul>
      {Object.entries(infoTooltip).map(([key, value]) => (
              <li key={key}>
                <strong>{key.replace(/_/g, " ")}:</strong> {value}
              </li>
        ))}
      </ul>
      {position?.open=='top'&&(
        <div
        className="absolute bottom-[-4px] left-[38px] transform -translate-x-1/2 w-0 h-0 
        border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-800"
    ></div>
   
        )}
    </div>,
    document.body 
  );
};

export default function ProductPerfetiiTreeMultiSelect({
    initvalue=[],
    options = [],
    labelledBy = "Select",
    selectedItems=[],
    label="Product",
    disabled=false,
    selectedMsl='all',
    updateSelectedMSL=()=>{},
    toggleShowMoreTooltip= () => { },
    updateSelectedFilters = () => { }
}) {
    const dummy_web_pid_Code = ['Blinkit_dummy_1',
        'Blinkit_dummy_2',
        'swiggy_dummy_1',
        'zepto_dummy_1',
        'zepto_dummy_2',
        'zepto_dummy_3',
        'amazon_dummy_1',
        'flipkart_dummy_1',
        'flipkart_dummy_2',
        'flipkart_dummy_3'];
    const filteredOptions = options.filter(item => !dummy_web_pid_Code.includes(item.web_pid));
    const filteredOptionsSelected = selectedItems.filter(item => !dummy_web_pid_Code.includes(item.web_pid));

const [infoTooltip, setInfoTooltip] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const toggleTooltip = (event, option,open="left") => {
    
      const rect = event.currentTarget.getBoundingClientRect();
      if(open=="top"){
        setTooltipPosition({
            open,
            top: rect.top + window.scrollY - 35,
            left: rect.left - 35, 
        });
      }else{
      setTooltipPosition({
        open,
        top: rect.top  + rect.height / 2, 
        left: rect.right + window.scrollX + 8, 
      });
    }
      setInfoTooltip(option);
    
  };
    const injectDynamicStyles = () => {
        const platformColor = "#0081F7";
        const styleId = "table-darkstore-tree";

        if (!document.getElementById(styleId)) {
            const style = document.createElement("style");
            style.id = styleId;
            const css = `
                .p-treeselect-panel{
                    max-width: 300px !important;
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
            children: filteredOptions.map((item) => ({
                key: `${item.value}-${item?.web_pid}`,
                search_key: `${item?.web_pid}, ${item?.ebux_code_platform_id}, ${item?.ean_code}, ${item?.brand_pack_sku}, ${item?.ebux_code_platform_id}, ${item?.label}`,
                label: (
                                            <div style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between"}}>
                                            <span  className="break-words max-w-[200px] text-sm " style={{ marginLeft: "8px" }}>
                                                <ul>
                                                    <li><b>{item?.brand_pack_sku}</b>,</li>
                                                    <li><b>{item?.ebux_code_platform_id}</b>,</li>
                                                    <li>{item?.sku_name?.substring(0, 25)}{((item?.sku_name?.length>25)?<span 
                                                    className="cursor-pointer catTxtBlue"
                                                    onMouseEnter={(event) => {toggleTooltip(event, {
                                                        "Product Name":item?.sku_name
                                                        })}}
                                                    onMouseLeave={() => setInfoTooltip(null)}>...</span>:"")}</li>
                                                </ul>                                                  
                                            </span>
                                            <img
          src="assets/images/imp.svg"
           className="cursor-pointer w-[14px] h-[16px]  hover:rounded-full hover:border hover:border-blue-500 "
                                              onMouseEnter={(event) => toggleTooltip(event, {
                                                    "web_pid" : item?.web_pid,
                                                    "Platform ID":item?.ebux_code_platform_id,
                                                    "EAN Code":item?.ean_code,
                                                    "Brand Pack SKU": item?.brand_pack_sku,
                                                    "Product Name":item?.sku_name
                                                    })}
                                                onMouseLeave={() => setInfoTooltip(null)}
                                            />
                                        </div>
                                        ),
                data: item
            }))
        }
    ], [options]);
    const selectedValues =  useMemo(() =>initvalue.map(item => `${item.value}-${item?.web_pid}`), [initvalue]);
    const allKeys = options.flatMap(item => `${item.value}-${item?.web_pid}`);
    
    const computeSelectedKeys = (itemsArray) => {
        let selectedKeys = {};

        itemsArray.forEach(value => {
            selectedKeys[value] = { checked: true, partialChecked: false };
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
        if (newSelectedKeys["fullSelected"]?.checked ) {
            if(Object.keys(newSelectedKeys)?.length >= options?.length){
                newSelectedKeys = {};
                options.forEach(item => {
                    newSelectedKeys[`${item.value}-${item?.web_pid}`] = { checked: true, partialChecked: false };                
                });
                newSelectedKeys["fullSelected"] = { checked: true, partialChecked: false };
            }else{
                newSelectedKeys["fullSelected"] = { checked: false, partialChecked: true };
            }

        } else if (!newSelectedKeys["fullSelected"]?.checked && !newSelectedKeys["fullSelected"]?.partialChecked && selectedKeys["fullSelected"]?.checked) {
            newSelectedKeys = {};
        }

        // Extract selected pincodes
        const selectedBrands = options
            .filter(item => newSelectedKeys[`${item.value}-${item?.web_pid}`]?.checked)
            .map(item => item);

        setSelectedKeys(newSelectedKeys);
        setSelectedBrand(selectedBrands);
        updateSelectedFilters(selectedBrands);
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
        
        <div 
        className={`ebuxHeadBox ${
          disabled ? "cursor-not-allowed opacity-40" : ""
        }`}
      >
       <Tooltip infoTooltip={infoTooltip} position={tooltipPosition} onClose={() => setInfoTooltip(null)} />

            <div className="flex justify-between items-center w-full">
            <label style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>{label}
            <img
          src="assets/images/imp.svg"
           className="cursor-pointer w-[10px] h-[12px] hover:rounded-full hover:border hover:border-blue-500 "
                                                onMouseEnter={(event) => toggleTooltip(event, {
                                                    
                                                    "Nomenclature":"Brand Pack SKU, Platform_ID, Product Name",
                                                    },"top")}
                                                onMouseLeave={() => setInfoTooltip(null)}
                                            /></label>
            <div className="flex space-x-4">
                <label className="flex items-center space-x-1">
                <input
                    type="radio"
                    name="option"
                    value="all"
                    checked={selectedMsl === "all"}
                    onChange={(e) => updateSelectedMSL(e.target.value)}
                    className="cursor-pointer"
                />
                <span>All</span>
                </label>
                <label className="flex items-center space-x-1">
                <input
                    type="radio"
                    name="option"
                    value="msl"
                    checked={selectedMsl === "msl"}
                    onChange={(e) => updateSelectedMSL(e.target.value)}
                    className="cursor-pointer"
                />
                <span>MSL</span>
                </label>
            </div>
            </div>
            <div className="card flex justify-content-center">

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
                    filterBy="search_key"
                    metaKeySelection={false}
                    className="md:w-20rem w-full"
                    selectionMode="checkbox" display="chip"
                    placeholder={labelledBy}
                    style={{ maxHeight: '50px', maxWidth:'400px', overflowY: 'auto' }}
                    expandedKeys={expandedNodeKeys}
                    onToggle={e => setExpandedNodeKeys(e.value)}
                    valueTemplate={(e) => {
                        if (e&&filteredOptionsSelected.length > 0) {
                            const firstValue= filteredOptionsSelected?.[0]?.sub_brand;
                            return (<span>
                                {firstValue?.length?firstValue?.substring(0, 5):''}{((firstValue?.length>5)?"...":"")}
                                {(filteredOptionsSelected.length > 1) &&
                                    (<>{" "}<span className="selectCount"  onClick={(e)=>{  e.preventDefault(); e.stopPropagation();  toggleShowMoreTooltip(e,'brand',(filteredOptionsSelected.map(({ sub_brand }) => sub_brand).join(", ")))  }}>+{filteredOptionsSelected.length - 1} more</span></>)
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