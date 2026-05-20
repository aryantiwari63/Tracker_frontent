import React, { useEffect, useMemo, useRef, useState } from "react";
import { TreeSelect } from 'primereact/treeselect';

import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';

export default function CategoryTreeMultiSelect({
    category_initvalue=[],
    sub_category_initvalue=[],
    category_options = [],
    sub_category_options = [],
    labelledBy = "Select",
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
    },[])
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState([]);
    const [expandedNodeKeys, setExpandedNodeKeys] = useState({ 'fullSelected': true });
    const treeData = useMemo(() => [
        {
            key: "fullSelected",
            label: "Select All",
            children: [{
                key: "select_all_category",
                label: "Category",
                children: category_options?.map(category => ({
                    key: `category_${category.label}`,
                    label: category.label,
                    data: category
                }))
            },{
                key: "select_all_sub_category",
                label: "Sub Category",
                children: sub_category_options?.map(sub_category => ({
                    key: `sub_category_${sub_category.label}`,
                    label: sub_category.label,
                    data: sub_category
                }))
            }]
        }
    ], [category_options,sub_category_options]);
    const selectedCategoryValues =  useMemo(() =>category_initvalue.map(item => `category_${item.label}`), [category_initvalue]);
    const selectedSubCategoryValues =  useMemo(() =>sub_category_initvalue.map(item => `sub_category_${item.label}`), [sub_category_initvalue]);
    const allKeys = [...((category_options?.length?category_options:[]).map(category => `category_${category.label}`)),...((sub_category_options?.length?sub_category_options:[]).map(sub_category => `sub_category_${sub_category.label}`))];
    
    const computeSelectedKeys = (selectedArray) => {
        let selectedKeys = {};

        selectedArray.forEach(value => {
            selectedKeys[value] = { checked: true, partialChecked: false };
        });

        const all_category =category_options.map(item => `category_${item.label}`);
        const selected_category = all_category.filter(value => selectedKeys[value]?.checked);

        selectedKeys["select_all_category"] = selected_category.length === all_category.length 
            ? { checked: true, partialChecked: false } 
            : selected_category.length > 0
            ? { checked: false, partialChecked: true }
            : { checked: false, partialChecked: false };
        const all_sub_category =sub_category_initvalue.map(item => `sub_category_${item.label}`);
        const selected_sub_category = all_sub_category.filter(value => selectedKeys[value]?.checked);

        selectedKeys["select_all_sub_category"] = selected_sub_category.length === all_sub_category.length 
            ? { checked: true, partialChecked: false } 
            : selected_sub_category.length > 0
            ? { checked: false, partialChecked: true }
            : { checked: false, partialChecked: false };

        selectedKeys.fullSelected = allKeys.every(value => selectedKeys[value]?.checked)
            ? { checked: true, partialChecked: false }
            : Object.keys(selectedKeys).length > 0
            ? { checked: false, partialChecked: true }
            : { checked: false, partialChecked: false };

        return selectedKeys;
    };
    const [selectedKeys, setSelectedKeys] = useState(computeSelectedKeys([...selectedCategoryValues,...selectedSubCategoryValues]));

    
    useEffect(() => {
        setSelectedKeys(computeSelectedKeys([...selectedCategoryValues,...selectedSubCategoryValues]));
        setSelectedCategory(category_initvalue);
        setSelectedCategory(sub_category_initvalue);

    }, [JSON.stringify(category_initvalue),JSON.stringify(sub_category_initvalue), JSON.stringify(category_options), JSON.stringify(sub_category_options)]);
    const handleSelectionChange = (e) => {
        let newSelectedKeys = { ...e.value };

        // Handle "Select All"
        if (newSelectedKeys["fullSelected"]?.checked) {
            newSelectedKeys = {};
            category_options.forEach(item => {
                newSelectedKeys[`category_${item.label}`] = { checked: true, partialChecked: false };                
            });
            newSelectedKeys["select_all_category"]= { checked: true, partialChecked: false };

            sub_category_options.forEach(item => {
                newSelectedKeys[`sub_category_${item.label}`] = { checked: true, partialChecked: false };                
            });
            newSelectedKeys["select_all_sub_category"]= { checked: true, partialChecked: false };
            newSelectedKeys["fullSelected"] = { checked: true, partialChecked: false };

        } else if (!newSelectedKeys["fullSelected"]?.checked && !newSelectedKeys["fullSelected"]?.partialChecked && selectedKeys["fullSelected"]?.checked) {
            newSelectedKeys = {};
        }

        // Extract selected pincodes
        const selectedCategorys = category_options
            .filter(item => newSelectedKeys[`category_${item.label}`]?.checked);
        const selectedSubCategorys = sub_category_options
            .filter(item => newSelectedKeys[`sub_category_${item.label}`]?.checked);

        setSelectedKeys(newSelectedKeys);
        setSelectedCategory(selectedCategorys);
        setSelectedSubCategory(selectedSubCategorys);
    };
    useEffect(() => {
            updateSelectedFilters('selectedCategory', selectedCategory);
        }, [selectedCategory]);

    useEffect(() => {
        updateSelectedFilters('selectedSubCategory', selectedSubCategory);
    }, [selectedSubCategory]);

    const dropdownRef = useRef(null);

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const handleMouseEnter = () => {
        setIsDropdownVisible(true);
    };
    const handleMouseLeave = () => {
        setIsDropdownVisible(false);
    };
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
            <div className="card flex justify-content-center">

                {isDropdownVisible && (
                    <div> 
                        {[...selectedCategory,...selectedSubCategory].length > 0 && (
                            <div className="selectItemsList" ref={dropdownRef}>
                                {[...selectedCategory,...selectedSubCategory]?.map(({ label }) => label).join(", ")}
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
                        const all_selected=[...selectedCategory,...selectedSubCategory];
                        if (e&&all_selected.length > 0) {
                            const firstValue= all_selected?.[0]?.label;
                            return (<span >
                                {firstValue?.length?firstValue?.substring(0, 5):''}
                                {(all_selected?.length > 1) &&
                                    (<>{((firstValue?.length>5)?"...":"")}{" "}<span className="selectCount" onClick={(e)=>{  e.preventDefault(); e.stopPropagation(); if(isDropdownVisible){handleMouseLeave()}else{ handleMouseEnter()} }} >+{all_selected.length - 1} more</span></>)
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