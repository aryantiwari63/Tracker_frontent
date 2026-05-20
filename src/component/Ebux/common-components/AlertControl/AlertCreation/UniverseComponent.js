import { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faXmark,
  faGlobe,
  faBuilding,
  faTag,
  faMapMarkerAlt,
  faBox,
} from "@fortawesome/free-solid-svg-icons";
import { useEbuxContext } from "../../../Context/EbuxProvider";
import PlatformFilter from "./Filters/PlatformFilter";
import BrandFilter from "./Filters/BrandFilter";
import CategoryFilter from "./Filters/CategoryFilter";
import KeywordCategoryFilter from "./Filters/KeywordCategoryFilter";
import ProductFilter from "./Filters/ProductFilter";
import KeywordFilter from "./Filters/KeywordFilter";
import LocationFilter from "./Filters/LocationFilter";
import ProductTagFilter from "./Filters/ProductTagFilter";
import KeywordTagFilter from "./Filters/KeywordTagFilter";
import BrandCompetitionFilter from "./Filters/BrandCompetitionFilter";
import ProductCompetitionFilter from "./Filters/ProductCompetitionFilter";
// import AlertFooter from "./AlertFooter";

export default function UniverseComponent({ alertControlObj }) {
  const {
    // kpi,
    filters,
    selectedFiltersWidget,
    // setSelectedFiltersWidget,
    updateSelectedFilters,
    activeClientProject,
  } = useEbuxContext();
  let kpi = alertControlObj?.kpi
  console.log('kpikpikpikpikpikpikpi', kpi)

  const showCompetition = alertControlObj?.entity === "Products" ||
    (alertControlObj?.metricType === "Product" && ["Brands", "Categories", "Platforms", "Locations"].includes(alertControlObj?.entity));

  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    platform: true,
    brand: true,
    category: true,
    location: true,
    products: true,
    product_tags: true,
    keyword_tags: true,
    brand_competition: true,
    product_competition: true,
  });

  // const [expandedItems, setExpandedItems] = useState({});
  // const [searchTerm, setSearchTerm] = useState("");

  // const toggleSection = (section) => {
  //   setExpandedSections((prev) => ({
  //     ...prev,
  //     [section]: !prev[section],
  //   }));
  // };

  const handleToggle = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // const handleCheck = (section, optionValue, isChecked) => {
  //   console.log(section, optionValue, isChecked);
  //   // Shared components handle internal state, but we might need to sync if necessary.
  //   // In DrawerEdit, handleCheck updates checkedItems local state.
  //   // For UniverseComponent, we'll rely on the components' interaction with EbuxContext.
  // };

  // const handleSelectAll = (section, options) => {
  //   console.log(section, options);
  //   // Shared components handle select all internally.
  // };

  const clearCategory = (categoryKey) => {
    const widgetKeyMap = {
      platform: "selectedPlatform",
      brand: "selectedBrand",
      category: kpi === "SOS" ? "selectedKeywordCategory" : (kpi === "SOM" ? "selectCategory_som" : "selectedCategory"),
      location: "selectedLocation",
      products: kpi === "SOS" ? "selectedKeyword" : "selectedProductId",
      product_tags: "selectedTags",
      keyword_tags: "selectedTagsKW",
      brand_competition: "selectedBrandCompetition",
      product_competition: "selectedProductCompetition",
    };
    const widgetKey = widgetKeyMap[categoryKey];
    if (widgetKey) {
      updateSelectedFilters(widgetKey, []);

      if (widgetKey === "selectedProductId") {
        updateSelectedFilters("selectedTags", []);
      } else if (widgetKey === "selectedKeyword") {
        updateSelectedFilters("selectedTagsKW", []);
      } else if (widgetKey === "selectedTags") {
        const removedWebPids = (selectedFiltersWidget?.selectedTags || []).flatMap(t => t.tag_details?.map(d => String(d.sku_or_keyword)) || []);
        const currentProducts = selectedFiltersWidget?.selectedProductId || [];
        const newProducts = currentProducts.filter(p => !removedWebPids.includes(String(p.web_pid || p.value)));
        updateSelectedFilters("selectedProductId", newProducts);
      } else if (widgetKey === "selectedTagsKW") {
        const removedKws = (selectedFiltersWidget?.selectedTagsKW || []).flatMap(t => t.tag_details?.map(d => String(d.sku_or_keyword)) || []);
        const currentKeywords = selectedFiltersWidget?.selectedKeyword || [];
        const newKeywords = currentKeywords.filter(k => !removedKws.includes(String(k.keyword_name || k.value || k.label)));
        updateSelectedFilters("selectedKeyword", newKeywords);
      }
    }
  };

  const appliedFiltersSummary = useMemo(() => {
    const summary = [
      { key: "platform", label: kpi === "SOS" ? "Keyword Platform" : "Platform", icon: faGlobe, items: selectedFiltersWidget?.selectedPlatform || [], widgetKey: "selectedPlatform" },
      { key: "brand", label: kpi === "SOS" ? "Keyword Brand" : "Brand", icon: faBuilding, items: selectedFiltersWidget?.selectedBrand || [], widgetKey: "selectedBrand" },
      { key: "category", label: kpi === "SOS" ? "Keyword Category" : "Category", icon: faTag, items: (kpi === "SOM" ? selectedFiltersWidget?.selectCategory_som : (kpi === "SOS" ? selectedFiltersWidget?.selectedKeywordCategory : selectedFiltersWidget?.selectedCategory)) || [], widgetKey: (kpi === "SOM" ? "selectCategory_som" : (kpi === "SOS" ? "selectedKeywordCategory" : "selectedCategory")) },
      { key: "location", label: "Location", icon: faMapMarkerAlt, items: selectedFiltersWidget?.selectedLocation || [], widgetKey: "selectedLocation" },
      { key: "products", label: kpi === "SOS" ? "Keywords" : "Products", icon: faBox, items: (kpi === "SOS" ? selectedFiltersWidget?.selectedKeyword : selectedFiltersWidget?.selectedProductId) || [], widgetKey: kpi === "SOS" ? "selectedKeyword" : "selectedProductId" },
    ];

    if (showCompetition) {
      summary.push({ key: "brand_competition", label: "Brand Competition", icon: faBuilding, items: selectedFiltersWidget?.selectedBrandCompetition || [], widgetKey: "selectedBrandCompetition" });
      summary.push({ key: "product_competition", label: "Product Competition", icon: faBox, items: selectedFiltersWidget?.selectedProductCompetition || [], widgetKey: "selectedProductCompetition" });
    }

    if (alertControlObj?.entity === "Products") {
      summary.push({ key: "product_tags", label: "Product Tags", icon: faTag, items: selectedFiltersWidget?.selectedTags || [], widgetKey: "selectedTags" });
    }

    if (alertControlObj?.entity === "Keywords") {
      summary.push({ key: "keyword_tags", label: "Keyword Tags", icon: faTag, items: selectedFiltersWidget?.selectedTagsKW || [], widgetKey: "selectedTagsKW" });
    }

    return summary;
  }, [selectedFiltersWidget, kpi, alertControlObj?.entity, filters]);

  const totalApplied = appliedFiltersSummary.reduce((acc, curr) => acc + curr.items.length, 0);

  const mainLocationData = useMemo(() => {
    const locations = filters?.location;
    if (!locations?.length) return [];

    const regionMap = Object.create(null);
    const isSimpleProject = [101, 102].includes(activeClientProject?.client_project_id);

    for (let i = 0, len = locations.length; i < len; i++) {
      const cityItem = locations[i];
      const cityPincodes = cityItem?.pincodes;
      if (!cityPincodes?.length) continue;

      const cityLabel = (cityItem.label || cityItem.lable || "").trim();
      const cityValue = (cityItem.value || cityLabel).trim();

      for (let j = 0, plen = cityPincodes.length; j < plen; j++) {
        const pin = cityPincodes[j];
        const stateName = (pin?.state || pin?.state_name || "Unknown State").trim();
        const cityName = (pin?.city || cityLabel || "Unknown City").trim();
        const regionName = (pin?.region || "Unknown Region").trim();
        const pincodeLabel = String(pin?.label ?? pin?.lable ?? "");
        const pincodeValue = pin?.value ?? pincodeLabel;

        if (isSimpleProject) {
          let region = regionMap[regionName] || (regionMap[regionName] = Object.create(null));
          let city = region[cityName] || (region[cityName] = { value: cityValue, pincodes: [] });
          city.pincodes.push({ label: pincodeLabel, value: pincodeValue, children: [] });
        } else {
          let region = regionMap[regionName] || (regionMap[regionName] = Object.create(null));
          let state = region[stateName] || (region[stateName] = Object.create(null));
          let city = state[cityName] || (state[cityName] = { value: cityValue, pincodes: [] });
          city.pincodes.push({ label: pincodeLabel, value: pincodeValue, children: [] });
        }
      }
    }

    const regions = [];
    for (const regionName in regionMap) {
      if (isSimpleProject) {
        const cities = regionMap[regionName];
        const cityChildren = Object.entries(cities).map(([name, obj]) => ({
          label: name,
          value: obj.value,
          children: obj.pincodes,
        }));
        regions.push({ label: regionName, value: regionName, children: cityChildren });
      } else {
        const states = regionMap[regionName];
        const stateChildren = Object.entries(states).map(([stateName, cities]) => ({
          label: stateName,
          value: stateName,
          children: Object.entries(cities).map(([cityName, cityObj]) => ({
            label: cityName,
            value: cityObj.value,
            children: cityObj.pincodes,
          })),
        }));
        regions.push({ label: regionName, value: regionName, children: stateChildren });
      }
    }
    return regions;
  }, [filters?.location, activeClientProject?.client_project_id]);


  return (
    <div className="pb-10">
      {/* Heading */}
      <h2 className="text-2xl font-semibold text-gray-800">
        Define what to monitor
      </h2>
      <p className="text-gray-400 mt-1 text-sm font-normal">
        Create filter to specific exactly which items in your catalog should be watched
      </p>

      <div className="grid grid-cols-12 gap-5 mt-8 bg-[#F9FAFB]">
        {/* LEFT SIDEBAR - ALL FILTERS */}
        <div className="col-span-12 lg:col-span-4 xl:col-span-3 bg-white border border-gray-200 rounded-2xl shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] h-full overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faXmark} className="text-gray-400 text-sm cursor-pointer hover:text-gray-600 transition-colors" />
              <h3 className="font-semibold text-[##000000D9] text-base">All Filters</h3>
            </div>
          </div>

          <div className="p-6">
            {/* Search Input */}
            <div className="relative mb-6">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Filter Categories */}
            <div className="space-y-1 max-h-[950px] overflow-y-auto pr-1 custom-scrollbar">
              <PlatformFilter
                expanded={expandedSections.platform}
                onToggle={handleToggle}
                globalSearch={searchQuery}
              />

              <BrandFilter
                expanded={expandedSections.brand}
                onToggle={handleToggle}
                globalSearch={searchQuery}
              />
              {showCompetition && filters?.res_brand_competition?.length > 0 && (
                <BrandCompetitionFilter
                  expanded={expandedSections.brand_competition}
                  onToggle={handleToggle}
                  globalSearch={searchQuery}
                />
              )}

              {kpi === "SOS" ? (
                <KeywordCategoryFilter
                  expanded={expandedSections.category}
                  onToggle={handleToggle}
                  globalSearch={searchQuery}
                />
              ) : (
                <CategoryFilter
                  expanded={expandedSections.category}
                  onToggle={handleToggle}
                  globalSearch={searchQuery}
                />
              )}

              {kpi === "SOS" ? (
                <KeywordFilter
                  expanded={expandedSections.products}
                  onToggle={handleToggle}
                  globalSearch={searchQuery}
                />
              ) : (
                <ProductFilter
                  expanded={expandedSections.products}
                  onToggle={handleToggle}
                  globalSearch={searchQuery}
                />
              )}

              {alertControlObj?.entity === "Keywords" && (
                <KeywordTagFilter
                  expanded={expandedSections.keyword_tags}
                  onToggle={handleToggle}
                  globalSearch={searchQuery}
                />
              )}

              {alertControlObj?.entity === "Products" && (
                <ProductTagFilter
                  expanded={expandedSections.product_tags}
                  onToggle={handleToggle}
                  globalSearch={searchQuery}
                />
              )}
              {showCompetition && filters?.res_products_competition?.length > 0 && (
                <ProductCompetitionFilter
                  expanded={expandedSections.product_competition}
                  onToggle={handleToggle}
                  globalSearch={searchQuery}
                />
              )}

              {mainLocationData?.length > 0 && (
                <LocationFilter
                  expanded={expandedSections.location}
                  onToggle={handleToggle}
                  data={mainLocationData}
                />
              )}


            </div>
          </div>
        </div>

        {/* RIGHT PANEL - APPLIED FILTERS */}
        <div className="col-span-12 lg:col-span-8 xl:col-span-9 space-y-6 p-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-base font-semibold text-[#1F2937]">Applied Filters</h3>
              <p className="text-xs text-gray-500 font-normal mt-0.5">Review and manage your selected filters</p>
            </div>
            <span className="text-sm font-semibold text-[#0081F7]  px-3 py-1.5 ">
              Applied ({totalApplied})
            </span>
          </div>

          {appliedFiltersSummary.map(({ key, label, items }) => (
            <div key={key} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)]">
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                    <FontAwesomeIcon icon={appliedFiltersSummary.find(f => f.key === key)?.icon} className="text-sm" />
                  </div>
                  <h4 className="font-semibold text-[##000000D9] text-base">{label}</h4>
                </div>
                <button
                  onClick={() => clearCategory(key)}
                  className="text-[#0081F7] text-xs font-semibold hover:text-blue-700 transition-colors tracking-wider"
                >
                  Clear
                </button>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {items.length > 0 ? (
                  items.map((item, idx) => (
                    <div
                      key={idx}
                      className="group flex items-center gap-2 bg-[#E6F7FF] text-[#1890FF] text-xs font-semibold px-2 py-1 rounded-[2px] border border-[#91D5FF] hover:bg-[#E0EFFF] transition-all cursor-default"
                    >
                      <span>{item.label || item.name || item.tag_name || item.value}</span>
                      <FontAwesomeIcon
                        icon={faXmark}
                        className="cursor-pointer text-[#00000073]  transition-colors"
                        onClick={() => {
                          const widgetKey = appliedFiltersSummary.find(f => f.key === key)?.widgetKey;
                          if (widgetKey) {
                            const itemIdentifier = item.value || item.id;
                            const newItems = items.filter(i => (i.value || i.id) !== itemIdentifier);
                            updateSelectedFilters(widgetKey, newItems);

                            if (widgetKey === "selectedProductId") {
                              const removedPid = String(item.web_pid || item.value);
                              const newTags = (selectedFiltersWidget?.selectedTags || []).filter(tag => {
                                const tagPids = (tag.tag_details || []).map(d => String(d.sku_or_keyword));
                                return !tagPids.includes(removedPid);
                              });
                              updateSelectedFilters("selectedTags", newTags);
                            } else if (widgetKey === "selectedKeyword") {
                              const removedPid = String(item.keyword_name || item.value || item.label);
                              const newTagsKW = (selectedFiltersWidget?.selectedTagsKW || []).filter(tag => {
                                const tagPids = (tag.tag_details || []).map(d => String(d.sku_or_keyword));
                                return !tagPids.includes(removedPid);
                              });
                              updateSelectedFilters("selectedTagsKW", newTagsKW);
                            } else if (widgetKey === "selectedTags") {
                              const remainingWebPids = newItems.flatMap(t => t.tag_details?.map(d => String(d.sku_or_keyword)) || []);
                              const removedWebPids = (item.tag_details || []).map(d => String(d.sku_or_keyword));
                              const currentProducts = selectedFiltersWidget?.selectedProductId || [];
                              const newProducts = currentProducts.filter(p => {
                                const pid = String(p.web_pid || p.value);
                                return !removedWebPids.includes(pid) || remainingWebPids.includes(pid);
                              });
                              updateSelectedFilters("selectedProductId", newProducts);
                            } else if (widgetKey === "selectedTagsKW") {
                              const remainingKws = newItems.flatMap(t => t.tag_details?.map(d => String(d.sku_or_keyword)) || []);
                              const removedKws = (item.tag_details || []).map(d => String(d.sku_or_keyword));
                              const currentKeywords = selectedFiltersWidget?.selectedKeyword || [];
                              const newKeywords = currentKeywords.filter(k => {
                                const kwStr = String(k.keyword_name || k.value || k.label);
                                return !removedKws.includes(kwStr) || remainingKws.includes(kwStr);
                              });
                              updateSelectedFilters("selectedKeyword", newKeywords);
                            }
                          }
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-gray-400 font-medium">No {label.toLowerCase()} selected</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* <div className="mt-8">
        <AlertFooter
          handleNext={() => console.log("Next Clicked")}
          handleBack={() => console.log("Discard Clicked")}
          activeStep={1}
        />
      </div> */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}