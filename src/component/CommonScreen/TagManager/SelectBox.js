/* eslint-disable no-console */
import React, { useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import "../../common-components/selectBox/selectBox.css";
const SelectBox = ({
  label,
  options=[],
  applyFilters,
  defaultSelected,
  filterName,
  unSelectDefault,
  platform,
  disabled,
  accounts=[],
  tagManagerDropdown = false,
}) => {
  const [selected, setSelected] = useState([]);
  const [defaultProp, setDefaultProp] = useState(unSelectDefault);
  // console.log("defaultSelected:::::::::::::::custom", defaultSelected);
  function setFilter(e) {
    let values = [];
    setSelected(e);
    e.map((val) => {
      values.push(val.value);
    });
    // console.log("values::::", values);

    if (filterName === "brand") {
      if (platform == "ams" || platform == "zepto") {
        let lables = [];

        setSelected(e);

        e.map((val) => {
          // console.log("labelssssssssssss:::::::::::::::", val);
          lables.push(val.label);
        });
        // let filters = JSON.parse(localStorage.getItem("default_filter_amazon"));
        // filters["amazon"]["multi"] = values;
        // localStorage.setItem("default_filter_amazon", JSON.stringify(filters));
      } else {
        let filters = JSON.parse(
          localStorage.getItem("default_filter_flipkart")
        );
        filters["flipkart"]["multi"] = values;
        localStorage.setItem(
          "default_filter_flipkart",
          JSON.stringify(filters)
        );
      }
    }


    if (filterName === "types" && platform === "blinkit") {
      let filters = JSON.parse(localStorage.getItem("default_filter_blinkit"));
      filters["blinkit"]["multi"] = values;
      localStorage.setItem("default_filter_blinkit", JSON.stringify(filters));
    }

    applyFilters(filterName, values);
  }
  const customValueRenderer = (selected) => {
    let selectedLabels = [];
    if (selected.length) {
      selected.map(({ label }) => selectedLabels.push(label));
    }
    return selectedLabels.join(",");
  };
  useEffect(() => {
    if (!unSelectDefault) {
      setSelected(defaultSelected);
      setDefaultProp(true);
    }
  }, [defaultSelected]);

 useEffect(()=>{
   if (filterName === 'tags' && !accounts.length) {
      setSelected([]);
   }  
 },[accounts, filterName])

 useEffect(()=>{
  if (defaultProp) {
   const allValues = options.map(ele=>ele.value);
   const filterValues = selected.filter(ele=>allValues.includes(ele.value));
   setSelected(filterValues);
  }
 }, [options, defaultProp])

  const filteredValues = selected.filter(selected =>
    options.some(option => option.label === selected.label && option.value === selected.value)
  );
  return (
    <div className="relative">
      {/* <label className="absolute -top-4 left-0 bg-white z-10 text-gray-600">{label}</label> */}
      <MultiSelect
        className={[
          "rmsc",
          platform==="commonScreen" && "rm",
          platform === "flipkart" && "textPadding",
          platform === "ams" && "rmsc--ams",
          platform === "blinkit" && "rmsc--blinkit",
          platform === "zepto" && "rmsc--zepto",
          platform === "instamart" && "rmsc--insta",
          tagManagerDropdown && "rmsc--tagManager"
        ].join(" ")}
        options={options}
        value={filteredValues}
        onChange={setFilter}
        labelledBy="Select Label"
        ClearSelectedIcon={null}
        disableSearch={true}
        valueRenderer={customValueRenderer}
        overrideStrings={{ selectSomeItems: label }}
        disabled= {disabled}
        // isOpen={true}
      />
    </div>
  );
};

export default SelectBox;
