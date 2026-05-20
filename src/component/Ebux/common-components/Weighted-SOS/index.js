
import React, {
  useState, useEffect,
  useRef, 
  // useMemo
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTable,
  faGear,
  faSortUp,
  faSortDown,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { useLayoutEffect } from "react";
import { getCombineFilterWidgetKW } from "../../services/ebux.service";
import { getPlatformsWeightedSOSData, saveToServer } from "./service/service";
import { isEqual } from "lodash";
import { Tabs as MuiTabs, Tab as MuiTab } from "@mui/material";


const initialData = [
  { rank: "#1", weight: 0, recommended: "38-40%" },
  { rank: "#2", weight: 0, recommended: "36-38%" },
  { rank: "#3", weight: 0, recommended: "34-36%" },
  { rank: "#4", weight: 0, recommended: "32-34%" },
  { rank: "#5", weight: 0, recommended: "30-32%" },
  { rank: "#6", weight: 0, recommended: "28-30%" },
  { rank: "#7", weight: 0, recommended: "26-28%" },
  { rank: "#8", weight: 0, recommended: "24-26%" },
  { rank: "#9", weight: 0, recommended: "22-24%" },
  { rank: "#10", weight: 0, recommended: "20-22%" },
  { rank: "#11", weight: 0, recommended: "18-20%" },
  { rank: "#12", weight: 0, recommended: "16-18%" },
  { rank: "#13", weight: 0, recommended: "14-16%" },
  { rank: "#14", weight: 0, recommended: "12-14%" },
  { rank: "#15", weight: 0, recommended: "10-12%" },
  { rank: "#16", weight: 0, recommended: "8-10%" },
  { rank: "#17", weight: 0, recommended: "6-8%" },
  { rank: "#18", weight: 0, recommended: "4-6%" },
  { rank: "#19", weight: 0, recommended: "2-4%" },
  { rank: "#20", weight: 0, recommended: "0-2%" },
];
function makeInitialData(data,template, slot) {
  // alert(template, slot)
  const count = Number(slot.split(" ")[1]);
  if (template == "Equal distribution") {
    // const value = Math.floor(100 / count);
    const value = (100 / count);
    const weight = ((!isNaN(value) && value % 1 !== 0) ? value.toFixed(2) : value);
    return initialData.slice(0, count).map((item, i) => ({
      ...item,
      rank: `#${i + 1}`,
      weight,
      recommended: `${weight}%`
    }));
  } else if (template == "Search Bias (top Heavy)") {
    let topHeavyData = 2;
    let topHeavyValue = 20;
    let value = 0;
    let weight = 0;
    if (count > 10) {
      topHeavyData = 4;
      topHeavyValue = 15;
      value = (40 / (count - 4));
      weight = ((!isNaN(value) && value % 1 !== 0) ? value.toFixed(2) : value);
    } else {
      value = (60 / (count - 2));
      weight = ((!isNaN(value) && value % 1 !== 0) ? value.toFixed(2) : value);
    }
    return initialData.slice(0, count).map((item, i) => ({
      ...item,
      rank: `#${i + 1}`,
      weight: (i + 1 <= topHeavyData) ? topHeavyValue : weight,
      recommended: `${(i + 1 <= topHeavyData) ? topHeavyValue : weight}%`
    }));
  }

  return initialData.slice(0, count).map((item,i) => ({
    ...item,
    weight:data?.[i]?.weight || 0,
    recommended: `-`
  }));
}

export default function WeightedSOSShare() {
  const defaultSlot = "Top 10";
  const defaultTemplate = "Equal distribution";
  const [slot, setSlot] = useState(defaultSlot);
  const [template, setTemplate] = useState(defaultTemplate);
  const [data, setData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState("");
  const [customSlot, setCustomSlot] = useState("");
  const [isCustomEdit, setIsCustomEdit] = useState(false);
  const [customError, setCustomError] = useState("");
const [openDropdown, setOpenDropdown] = useState(false);
  // const [selectedPlatform, setSelectedPlatform] = useState(null);
const dropdownRef = useRef(null);

  const isFirstRender = useRef(true);

  const getSlotCount = () => Number(slot.split(" ")[1]);

  // let visibleData = useMemo(() => data.slice(0, getSlotCount()), [data, slot]);

  const [platforms, setPlatforms] = useState([
    // "Walmart", "Amazon", "Flipkart", "Myntra", "Reliance",  "Mercado Livre"
  ]);
 
  const [activePlatform, setActivePlatform] = useState(null);
  const updatePlatformData = (platform,isCopy = false) => {
      if(!platform?.data){
        const baseData = makeInitialData(initialData,defaultTemplate, defaultSlot);
        setData(platform?.data ?? baseData);
      }else{  
        setData(platform?.data);
      }
      
    // setIsEdit(false);
    setError("");
    setCustomError("");
    setTemplate(platform?.template ?? defaultTemplate);
    setSlot(platform?.slot ?? defaultSlot);
    if (["Top 5", "Top 10", "Top 15", "Top 20"]?.indexOf(platform?.slot ?? defaultSlot) == -1) {
      setCustomSlot(platform?.slot?.split(" ")[1] ?? "");
      setIsCustomEdit(false);
    } else {
      setCustomSlot("");
      setIsCustomEdit(false);
    }
    //setActivePlatform(platform?.label);
      if (!isCopy) {
    setActivePlatform(platform?.label);
  }
  }
  useLayoutEffect(() => {
    let isMounted = true; // prevent state update on unmounted component
    let pf_weighted_sos_data = [];


    const fetchPlatforms = async () => {
      const platformsData = await getPlatformsWeightedSOSData();
     
      pf_weighted_sos_data = platformsData ?? [];

      const combineFilterWidgetKW = await getCombineFilterWidgetKW("SOS", []);
      const fetchedPlatforms = combineFilterWidgetKW?.platforms?.map((platform) => {
        let pfData = pf_weighted_sos_data?.find(pf => pf.pf_id == platform.value);
        return {
          pf_id: platform.value,
          label: platform?.label,
          image: platform?.platform_description,
          template: pfData?.template ,
          // slot: platform.value == 29 ? "Top 18" : pfData?.slot ?? defaultSlot,
          slot: pfData?.slot,
          data: pfData?.data
        }
      }) ?? [];

      if (isMounted && fetchedPlatforms) {
        setPlatforms(fetchedPlatforms);
        updatePlatformData(fetchedPlatforms[0]);
      }
    };

    fetchPlatforms();

    return () => {
      isMounted = false; // cleanup
    };
  }, []);
  // ✅ FIX 1: Store rounded values to avoid floating point issues
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setData(prev => makeInitialData(prev, template, slot));

  }, [template, slot]);

  useEffect(() => {
    if (template === "Equal distribution") {
      setError("");
    }
  }, [template]);
  const matchDataWithTemplate = (updated, template_data) => {
    for (let i = 0; i < getSlotCount(); i++) {
      if (Number(updated[i].weight) !== Number(template_data[i].weight)) {
        return false;
      }
    }
    return true;
  };
  const autoTemplateUpdate = (updated) => {
    const total = updated.reduce(
      (sum, item) => sum + Number(item.weight || 0),
      0
    );

    if (Math.abs(total - 100) <= 0.1) {
      const equal_distribution_data = makeInitialData(updated, "Equal distribution", slot);

      if (matchDataWithTemplate(updated, equal_distribution_data)) {
        setTemplate("Equal distribution");
      } else {
        const search_bias_data = makeInitialData(updated, "Search Bias (top Heavy)", slot);
        if (matchDataWithTemplate(updated, search_bias_data)) {
          setTemplate("Search Bias (top Heavy)");
        }
      }
    }
  };
  const handleWeightChange = (index, value) => {
    const updated = data.map((item, i) =>
      i === index ? { ...item, weight: value } : item
    );    
    setData(updated);
    if(template!== "Custom"){
      setTemplate("Custom");
    }else{
      autoTemplateUpdate(updated);
      
      
      
    }

  };

  const handleSubmit = async() => {
    // if (template === "Search Bias (top Heavy)") {
      const visibleData = data.slice(0, getSlotCount());

      let total = 0;
      let emptyRows = [];
      let negativeRows = [];
      let nonNumericRows = [];

      visibleData.forEach((item, index) => {
        const rowNum = index + 1;

        if (item.weight === "" || item.weight === null) {
          emptyRows.push(rowNum);
          return;
        }

        const val = Number(item.weight);

        if (isNaN(val)) {
          nonNumericRows.push(rowNum);
          return;
        }

        if (val < 0) {
          negativeRows.push(rowNum);
        }

        total += val;
      });

      let errors = [];

      if (emptyRows.length) {
        errors.push(`Empty values are not allowed in rows ${emptyRows.join(", ")}`);
      }

      if (nonNumericRows.length) {
        errors.push(
          `Only numeric values are allowed in rows ${nonNumericRows.join(", ")}`
        );
      }

      if (negativeRows.length) {
        errors.push(`Negative values are not allowed in rows ${negativeRows.join(", ")}`);
      }

      if ((!(Math.abs(total - 100) <= 0.1))) {
        errors.push(`Total weightage should be equal to 100%.`);
      }

      if (errors.length > 0) {
        return setError(errors.join(" | "));
      }else{
        const pfdata = platforms.find(pf => pf.label === activePlatform);
        const updated_pfdata = { ...pfdata, data, template, slot };
        if ((!isEqual(JSON.stringify(pfdata?.data?.map((item) => item.weight)), JSON.stringify(updated_pfdata?.data?.map((item) => item.weight)))) || pfdata?.template != updated_pfdata?.template || pfdata?.slot != updated_pfdata?.slot) {
          await saveToServer(updated_pfdata);
        }
        updatePlatformData(updated_pfdata);       
        console.log("Updated Data:", { slot, data });
        setIsEdit(false);
      }

  };

  // const updateDataForSlot = (count, currentTemplate) => {
  //   let updated = [];

  //   if (currentTemplate === "Equal distribution") {
  //     const exactValue = 100 / count;
  //     const roundedValue = Math.round(exactValue * 100) / 100;

  //     updated = Array.from({ length: count }, (_, i) => ({
  //       rank: `#${i + 1}`,
  //       weight: roundedValue,
  //       recommended: initialData[i]?.recommended || "",
  //     }));
  //   } else {
  //     // preserve old values if possible
  //     updated = Array.from({ length: count }, (_, i) => ({
  //       rank: `#${i + 1}`,
  //       weight: data[i]?.weight || "",
  //       recommended: initialData[i]?.recommended || "",
  //     }));
  //   }

  //   setData(updated);
  // };

  // const applyCustomSlot = () => {
  //   const val = Number(customSlot);

  //   if (!customSlot) {
  //     setIsCustomEdit(false);
  //     return;
  //   }

  //   if (val < 5 || val > 20) {
  //     setCustomError("Value must be between 5 and 20");
  //     return;
  //   }

  //   if ([5, 10, 15, 20].includes(val)) {
  //     setCustomError("Use predefined slots for 5, 10, 15, 20");
  //     return;
  //   }

  //   setCustomError("");
  //   setSlot(`Top ${val}`);
  //   updateDataForSlot(val, template);
  //   setIsCustomEdit(false);
  // };
const applyCustomSlot = () => {
  const val = Number(customSlot);

  if (!customSlot) {
    setIsCustomEdit(false);
    return;
  }

    if (val < 5 || val > 20) {
      setCustomError("Value must be between 5 and 20");
      return;
    }

    if ([5, 10, 15, 20].includes(val)) {
      setCustomSlot("");

      // setCustomError("Use predefined slots for 5, 10, 15, 20");
      // return;
    }

    setCustomError("");
    setSlot(`Top ${val}`);
    setIsCustomEdit(false);
  };

  const handleCancel = () => {
    updatePlatformData(activePlatform ? platforms.find(pf => pf.label === activePlatform) : null);
    
    setIsEdit(false);
  };

  const getTotal = () => {
    return data
      .slice(0, getSlotCount())
      .reduce((sum, item) => sum + Number(item.weight || 0), 0);
  };

  const formatWeight = (num) => {
    if (num === "" || num === null || isNaN(num)) return "";

    const value = Number(num);
    const truncated = Math.floor(value * 100) / 100;

    return truncated % 1 === 0
      ? truncated.toString()
      : truncated.toFixed(2);
  };

  // ✅ FIX 2: Better check for equal distribution
  // const checkIfEqualDistribution = () => {
  //   const count = getSlotCount();
  //   const visibleWeights = data.slice(0, count).map(item => {
  //     const val = Number(item.weight || 0);
  //     return Math.round(val * 100) / 100; // Round to 2 decimals for comparison
  //   });

  //   if (visibleWeights.length === 0) return false;

  //   // Get the first value
  //   const firstValue = visibleWeights[0];

  //   // Check if all values are the same (within tolerance)
  //   const allSame = visibleWeights.every(weight => 
  //     Math.abs(weight - firstValue) < 0.01
  //   );

  //   if (!allSame) return false;

  //   // Check if the value matches what equal distribution should be
  //   const expectedValue = Math.round((100 / count) * 100) / 100;

  //   return Math.abs(firstValue - expectedValue) < 0.01;
  // };

  const total = getTotal();
  const isInvalidTotal = (!(Math.abs(total - 100) <= 0.1));

  // ✅ FIX 2: Auto-switch template based on values
  // useEffect(() => {
  //   if (isFirstRender.current) {
  //     isFirstRender.current = false;
  //     return;
  //   }

  //   const isEqual = checkIfEqualDistribution();

  //   if (isEqual) {
  //     // All values are equal and match equal distribution
  //     if (template !== "Equal distribution") {
  //       setTemplate("Equal distribution");
  //     }
  //   } else {
  //     // Values are not equal or don't match equal distribution
  //     if (template === "Equal distribution") {
  //       setTemplate("Custom");
  //     }
  //   }
  // }, [data]);

  // useEffect(() => {
    
  //   const count = getSlotCount();
  //   updateDataForSlot(count, template);
  // }, [slot, template]);
  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setOpenDropdown(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  return (
    <div className="p-6 bg-white shadow rounded-lg w-full">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg text-[#000000D9] font-semibold">
            Weighted Share Of Search
          </h2>
          <p className="text-[#666666] text-sm">
            Customize how your share of search is calculated by defining the numbers of ranking slots and assign specific weightage to each position.
          </p>
        </div>


        <button
          onClick={() => setIsEdit(true)}
          disabled={isEdit}
          className={`flex items-center gap-[5px] px-3 py-[6px] border border-[#D9D9D9] rounded text-sm ${isEdit ? "opacity-50" : ""
            }`}
        >
          <FontAwesomeIcon icon={faPenToSquare} size="18px" color="#000000D9" />
          Edit
        </button>

      </div>


      <MuiTabs
        value={activePlatform || false}
        onChange={(event, newValue) => {
          const platform = platforms.find((p) => p.label === newValue);
          if (platform) {
            updatePlatformData(platform);
          }
        }}
        aria-label="platform tabs"
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          "& .MuiTab-root": {
            color: "#00000099",
            textTransform: "none",
            minHeight: "48px",
          },
          "& .MuiTab-root.Mui-selected": {
            color: "#1890FF",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "#1890FF",
            bottom: 0, // Aligns the indicator to the container bottom
            height: "2px", // Adjust thickness if needed
          },
        }}
      >
        {platforms.map((platform, index) => (
          <MuiTab
            key={index}
            value={platform?.label}
            label={
              <div className="flex items-center gap-2 font-inter font-normal text-sm align-middle cursor-pointer">
                {platform?.image ? (
                  <img
                    src={platform?.image ?? ""}
                    alt={platform?.label ?? ""}
                    className="oos-plat-img max-w-6 max-h-6 object-contain"
                  />
                ) : null}
                {platform?.label}
              </div>
            }
          />
        ))}
      </MuiTabs>

      <div className="flex justify-between">
        {/* Slot */}
        <div className="flex flex-col gap-[14px] py-4">
          <h2 className="text-lg text-[#000000D9] font-semibold">
            Slot Weightage Distribution
          </h2>

          <div className="flex gap-[10px] h-[32px]">
            <div className="flex gap-1 border p-[2px] rounded">
              {["Top 5", "Top 10", "Top 15", "Top 20"].map((item) => (
                <button
                  key={item}
                  disabled={!isEdit}
                  onClick={() => setSlot(item)}
                  className={`p-[6px] w-[78px] text-xs rounded ${slot === item ? "bg-[#1890FF] text-white" : ""
                    } ${!isEdit && "opacity-50"}`}
                >
                  {item}
                </button>
              ))}
            </div>


            <div
              onClick={() => isEdit && setIsCustomEdit(true)}
              className={`flex items-center gap-1.5 border border-[#D9D9D9] rounded-[6px] px-2 py-1 text-sm cursor-pointer ${(slot == 'Top ' + customSlot) ? "bg-[#1890FF] text-white" : " text-[#000000D9]"} ${!isEdit && "opacity-50"}`}
            >
              {/* Icon */}
              <div className="relative flex items-center">
                <FontAwesomeIcon icon={faTable} className="text-[#000000D9] text-sm" />
                <FontAwesomeIcon
                  icon={faGear}
                  className="absolute -bottom-1 -right-1 text-[8px] bg-white rounded-full p-[2px] text-[#00000073]"
                />
              </div>

              {isCustomEdit ? (
                <input
                  type="number"
                  value={customSlot}
                  autoFocus
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const val = e.target.value;

                    if (/^\d*$/.test(val)) {
                      setCustomSlot(val);
                      setCustomError(""); // clear while typing
                    }
                  }}

                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      applyCustomSlot();
                    }
                  }}

                  onBlur={applyCustomSlot}

                  className={`w-[60px] outline-none border px-1 text-center  text-[#000000D9] ${customError ? "border-red-500" : "border-[#D9D9D9]"
                    } `}
                />
              ) : (
                <span>
                  {customSlot ? `Top ${customSlot}` : "Custom"}
                </span>
              )}
            </div>
            {customError && (
              <p className="text-red-500 text-xs mt-1">{customError}</p>
            )}
             
             {/* <div className="border px-2 py-1 rounded text-sm text-[000000D9] cursor-pointer">
            <select
  disabled={!isEdit}
     className="cursor-pointer"
  onChange={(e) => {
    const selected = platforms.find(
      (pf) => pf.label === e.target.value 
    );

    if (!selected) return;

    updatePlatformData(selected, true);

    setActivePlatform(activePlatform);
  }}
>
  <option value="">Copy Weightage from:</option>

  {platforms
    .filter((pf) => pf.label !== activePlatform)
    .map((pf) => (
      <option key={pf.pf_id} value={pf.label}>
        {pf.label}
      </option>
    ))}
</select>
             </div> */}
             <div  ref={dropdownRef} className="relative w-[220px] h-[31px] border border-[#D9D9D9] rounded-[6px] py-[5px]">
  {/* Trigger */}
  <div
    onClick={() => isEdit && setOpenDropdown(!openDropdown)}
    className="px-2 rounded text-sm text-[000000D9] cursor-pointer flex justify-between items-center"
  >
   <span> Copy Weightage from:  </span>
    <FontAwesomeIcon
      icon={faChevronDown}
      className="text-black text-xs"
    />
  
  </div>

  {/* Dropdown */}
  {openDropdown && (
    <div className="absolute top-full left-0 w-full bg-white border rounded shadow z-10 max-h-[280px] overflow-y-auto">
      {platforms
        .filter((pf) => pf.label !== activePlatform)
        .map((pf) => (
          <div
            key={pf.pf_id}
            onClick={() => {
              updatePlatformData(pf, true);
              setOpenDropdown(false);
            }}
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
          >
            {pf.image && (
              <img
                src={pf.image}
                className="w-5 h-5 object-contain"
              />
            )}
            {pf.label}
          </div>
        ))}
    </div>
  )}
</div>

          </div>
        </div>

        {/* Template */}
        <div className="flex flex-col gap-[14px] py-4">
          <h2 className="text-lg text-[#000000D9] font-semibold">
            Slot Weightage Distribution
          </h2>

          <div className="flex gap-2">
            <div className="border px-2 py-1 rounded text-sm text-[000000D9] cursor-pointer">
              <select
                disabled={!isEdit}
                value={template}
               onChange={(e) => setTemplate(e.target.value)}
               
                className="cursor-pointer"
              >
                <option>Equal distribution</option>
                <option>Search Bias (top Heavy)</option>
                <option>Custom</option>
              </select>
            </div>

            <p
              className={`flex gap-1 px-2 py-1 rounded text-sm border
                ${isInvalidTotal ? "border-red-500 bg-red-50" : "border-[#1890FF] bg-[#E8F4FF]"}`}
            >
              Total:{" "}
              <span className={isInvalidTotal ? "text-red-500" : "text-[#1890FF]"}>
                {Math.round(total)}%
              </span>
            </p>
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      {/* Table */}
      <div className="rounded-[12px] overflow-hidden">
  <div className="h-[520px] overflow-y-auto ">
    <table className="w-full table-fixed">
      <thead>
            <tr className="bg-[#F6F9FB] text-sm text-left h-[54px]">
              <th className="p-4 font-medium w-1/3">
                <div className="flex items-center gap-1">
                  Rank
                
                  <div className="flex flex-col ml-1 leading-none">
  <FontAwesomeIcon
    icon={faSortUp}
    className="h-[15px] cursor-pointer text-[#00000040] hover:text-black"
  />
  <FontAwesomeIcon
    icon={faSortDown}
    className="h-[15px] -mt-3.5 cursor-pointer text-[#00000040] hover:text-black"
  />
</div>
                  
                </div>
              </th>
              <th className="p-4 font-medium w-1/3">
                <div className="flex items-center gap-1">
                  Weightage
                  
                  <div className="flex flex-col ml-1 leading-none">
  <FontAwesomeIcon
    icon={faSortUp}
    className="h-[15px] cursor-pointer text-[#00000040] hover:text-black"
  />
  <FontAwesomeIcon
    icon={faSortDown}
    className="h-[15px] -mt-3.5 cursor-pointer text-[#00000040] hover:text-black"
  />
</div>
                </div>
              </th>
              <th className="p-4 font-medium w-1/3">
                <div className="flex items-center gap-1">
                  Recommended
                 
                  <div className="flex flex-col ml-1 leading-none">
  <FontAwesomeIcon
    icon={faSortUp}
    className="h-[15px] cursor-pointer text-[#00000040] hover:text-black"
  />
  <FontAwesomeIcon
    icon={faSortDown}
    className="h-[15px] -mt-3.5 cursor-pointer text-[#00000040] hover:text-black"
  />
</div>
                </div>
              </th>

            </tr>
          </thead>

          <tbody>
            {(data.slice(0, getSlotCount())).map((row, index) => (
              <tr
                key={index}
                className={`h-[54px] text-sm ${index % 2 === 1 ? "bg-[#F9FAFA]" : "bg-white"
                  }`}
              >
                <td className="p-4">
                  <span className="inline-block px-3 py-1 border border-[#E5E7EB] rounded-[4px] text-sm">
                    {row.rank}
                  </span>
                </td>

                <td className="p-4 flex items-center">
                  {isEdit ? (
                    <input
                      type="number"
                      value={row.weight}
                      step="0.01"
                      onChange={(e) => handleWeightChange(index, e.target.value)}
                      className="border border-[#D9D9D9] px-2 py-1 w-[90px] h-[30px] flex items-center justify-center"
                    />
                  ) : (
                    `${formatWeight(Number(row.weight))}`
                  )}
                  %
                </td>

                <td className="p-4">{row.recommended}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
</div>
      {/* Footer */}
      {isEdit && (
        <div className="flex justify-end gap-3 mt-4 my-12">
          <button
            onClick={() => handleCancel()}
            className="px-[10px] py-[6px] border border-[#D9D9D9] rounded text-sm w-[131px] h-[36px] ronded-[8px]"
          >
            Cancel
          </button>

          <button
            onClick={() => handleSubmit()}
            disabled={isInvalidTotal}
            className={`px-[10px] py-[6px] text-white rounded text-sm w-[131px] h-[36px]
              ${isInvalidTotal ? "bg-gray-300 cursor-not-allowed" : "bg-[#0081F7]"}`}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}