import React, { useCallback, useEffect, useRef, useState } from "react";
// import React, { useEffect } from 'react';
// import { MultiSelect } from 'react-multi-select-component';
// import { BASE_URL } from '../../../utils/url';
import { useEbuxContext } from "../Context/EbuxProvider";
import Loader from "./Loader";
import TreeMultiSelect from "./TreeMultiSelect";
import CustomMultiSelect from "./CustomMultiSelect";
// import CompareCalendar from "./CompareCalendar";
import DarkstoreTreeMultiSelect from "./TreeMultiSelect/darkstore";

// import moment from "moment/moment";
import BrandTreeMultiSelect from "./TreeMultiSelect/brand";
// import CategoryTreeMultiSelect from './TreeMultiSelect/category_V2';
import CategoryTreeMultiSelect from "./TreeMultiSelect/category";
// import CustomMultiSelectV2 from './CustomMultiSelectV2';
import ProductTreeMultiSelect from "./TreeMultiSelect/product";
import ProductPerfetiiTreeMultiSelect from "./TreeMultiSelect/productPerfetii";
import { createPortal } from "react-dom";
import KeywordTreeMultiSelect from "./TreeMultiSelect/keyword";
import { trackDashboardClick } from "../../../analytics/EventController";
import KwBrandTreeMultiSelect from "./TreeMultiSelect/brand_kw";
import ColPalMTLocationTreeMultiSelect from "./TreeMultiSelect/colpalMTLocationTreeMultiSelect";
import ColPalMTBrandTreeMultiSelect from "./TreeMultiSelect/colpalMTBrandTreeMultiSelect";

const ShowMoreTooltip = ({ tooltipRef, infoTooltip }) => {
  if (!infoTooltip?.info) return null;

  return createPortal(
    <div
      id="show_more_tooltip"
      ref={tooltipRef}
      className="fixed  border border-gray-300 bg-gray-50 max-w-[400px]   p-2 rounded-md z-[1000000001000]"
      style={{ top: infoTooltip.top, left: infoTooltip.left }}
    >
      <div
        className="absolute top-3 left-[-4px] transform -translate-y-1/2 w-0 h-0 
          border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-gray-300"
      ></div>
      <div className="max-h-[300px] overflow-auto ">{infoTooltip?.info}</div>
    </div>,
    document.body
  );
};

const HeaderFiltersComponent = () => {
  const {
    kpi,
    filters,
    activeClientProject,
    selectedFilters,
    // setSelectedFilters,
    updateSelectedFilters,
    loading,
    filtersLoading,
    updateSelectedBrand,
    updateSelectedCategory,
    updateSelectedKeyword,
    updateSelectedProduct,
    updateSelectedMotherPack,
    updateSelectedKeywordCategory,
    updateSelectedBrandV2,
    updateSelectedCategoryV2,
    updateSelectedProductV2,
    updateSelectedKeywordBrandV2,
    updateSelectedKeywordCategoryV2,
    updateSelectedKeywordV2,
    updateSelectedMSLV2,
    selectedMsl,
    updateSelectedSOSOption,
    updatecategory_som,
    updateCategorynode,
    updateSelectedProdcutPPG
  } = useEbuxContext();

  // const handleDateRangeFilter = (e) => {
  //   // eslint-disable-next-line no-console
  //   // console.log(e, "on apply")
  //   let isCompareToPrevious = false;
  //   const endDate = moment(
  //     e?.endDate ?? e?.customRange?.endDate ?? e?.selection?.endDate
  //   ).format("YYYY-MM-DD");
  //   const startDate = moment(
  //     e?.startDate ?? e?.customRange?.startDate ?? e?.selection?.startDate
  //   ).format("YYYY-MM-DD");
  //   let previousEndDate = undefined;
  //   let previousStartDate = undefined;
  //   if (Object.prototype.hasOwnProperty.call(e, "previousRange")) {
  //     isCompareToPrevious = true;
  //     previousEndDate = moment(e.previousRange?.endDate).format("YYYY-MM-DD");
  //     previousStartDate = moment(e.previousRange?.startDate).format(
  //       "YYYY-MM-DD"
  //     );
  //   }
  //   const selectedDateRange = {
  //     isCompareToPrevious,
  //     endDate,
  //     startDate,
  //     previousEndDate: previousEndDate ?? endDate,
  //     previousStartDate: previousStartDate ?? startDate,
  //     selectedRange: e.selectedRange,
  //   };
  //   setSelectedFilters((prevFilters) => ({
  //     ...prevFilters,
  //     selectedDateRange,
  //   }));
  //   trackDashboardClick({
  //     section: "Top filters",
  //     eventcategory: "date range",
  //     eventaction: e.type ? e.type : "click",
  //     eventlabel: selectedDateRange,
  //   });
  //   // trackDashboardClick({section:'Top filters',eventaction:'click',eventlabel: 'date range'});
  // };
  // const activeClientProject = useMemo(() => {
  //     return JSON.parse(localStorage.getItem("active_client_project") || "{}");
  // }, []);


  const [showMoreTooltipInfo, setShowMoreTooltipInfo] = useState({
    top: 0,
    left: 0,
    info: null,
    menu: null,
  });
  const tooltipRef = useRef(null);
  const handleClickOutside = useCallback(
    (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        // if (showMoreTooltipInfo?.info && !event.target.closest("#show_more_tooltip")) {
        setShowMoreTooltipInfo({ top: 0, left: 0, info: null, menu: null });
      }
    },
    [showMoreTooltipInfo]
  );

  useEffect(() => {
    const mainLayout = document.querySelector("#mainlayout__main_page");

    if (showMoreTooltipInfo?.info) {
      document.addEventListener("click", handleClickOutside);
      if (mainLayout) {
        mainLayout.addEventListener("scroll", handleClickOutside, {
          passive: true,
        });
      }
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
      mainLayout?.removeEventListener("scroll", handleClickOutside);
    };
  }, [showMoreTooltipInfo]);
  const toggleShowMoreTooltip = (event, menu, info) => {
    if (!menu || menu == showMoreTooltipInfo.menu || !info) {
      setShowMoreTooltipInfo({ top: 0, left: 0, info: null, menu: null });
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      setShowMoreTooltipInfo({
        top: rect.top,
        // top: rect.top + window.scrollY + rect.height / 2,
        left: rect.right + window.scrollX + 8,
        info,
        menu,
      });
    }
  };

  return (
    <>
      <ShowMoreTooltip
        tooltipRef={tooltipRef}
        infoTooltip={showMoreTooltipInfo}
      />
      {/* <div className="ebuxHeadSection "> */}
      <div className={`${activeClientProject?.client_project_id == 2 && (kpi == "OSA" || kpi == "PRO" || kpi == "RR") ? 'ebuxHeadSectionNestle' : 'ebuxHeadSection'}`}>
        <Loader show={filtersLoading || loading} />
        {activeClientProject?.brandTreeSelect ? (
          <div className="ebuxHeadBox">
            <label>Brand</label>
            {kpi == "SOS" || kpi == "OR" ? (
              <KwBrandTreeMultiSelect
                toggleShowMoreTooltip={toggleShowMoreTooltip}
                labelledBy="Select Brand"
                options={filters?.brand ?? []}
                initvalue={selectedFilters?.selectedBrand ?? []}
                selectedItems={selectedFilters?.selectedBrand ?? []}
                updateSelectedFilters={updateSelectedKeywordBrandV2}
              />
            ) : (
              <BrandTreeMultiSelect
                toggleShowMoreTooltip={toggleShowMoreTooltip}
                labelledBy="Select Brand"
                options={filters?.brand ?? []}
                initvalue={selectedFilters?.selectedBrand ?? []}
                selectedItems={selectedFilters?.selectedBrand ?? []}
                updateSelectedFilters={updateSelectedBrandV2}
              />
            )}
          </div>
        ) : 
        activeClientProject?.client_project_id==10 ? (
          <div className="ebuxHeadBox">
            <label>Brand</label>
            <ColPalMTBrandTreeMultiSelect
            toggleShowMoreTooltip={toggleShowMoreTooltip}
            labelledBy="Select Brand"
            options={filters?.brand ?? []}
            initvalue={selectedFilters?.selectedBrand??[]}
            selectedItems={selectedFilters?.selectedBrand ?? []}
            updateSelectedFilters={(brands) => {
                trackDashboardClick({
                  section: "Top filters",
                  eventcategory: "brand",
                  eventaction: "click",
                  eventlabel: brands,
                });
                console.log(brands, "updated brands");
                updateSelectedBrand(brands);
              }}
          />
          </div>)
          :(
            <CustomMultiSelect
              toggleShowMoreTooltip={toggleShowMoreTooltip}
              tooltip={true}
              label="Brand"
              options={filters?.brand ?? []}
              value={selectedFilters.selectedBrand}
              // onClick={()=>console.log('Brand','label here ')}
              onChange={(brands) => {
                trackDashboardClick({
                  section: "Top filters",
                  eventcategory: "brand",
                  eventaction: "click",
                  eventlabel: brands,
                });
                console.log(brands, "updated brands");
                updateSelectedBrand(brands);
              }}
              labelledBy="Select Brand"
            />
          )
        }

        {kpi == "SOS" || kpi == "OR" ? (
          activeClientProject?.brandTreeSelect ? (
            <CategoryTreeMultiSelect
              label="Category"
              toggleShowMoreTooltip={toggleShowMoreTooltip}
              labelledBy="Select Category"
              options={filters?.keywordCategory ?? []}
              initvalue={selectedFilters?.selectedKeywordCategory ?? []}
              selectedItems={selectedFilters?.selectedKeywordCategory ?? []}
              updateSelectedFilters={updateSelectedKeywordCategoryV2}
            />
          ) : (
            <CustomMultiSelect
              toggleShowMoreTooltip={toggleShowMoreTooltip}
              disabled={!(kpi == "SOS" || kpi == "OR")}
              tooltip={true}
              label="Category"
              options={filters?.keywordCategory}
              value={selectedFilters.selectedKeywordCategory}
              onChange={(categories) => {
                trackDashboardClick({
                  section: "Top filters",
                  eventcategory: "category",
                  eventaction: "click",
                  eventlabel: categories,
                });
              
                updateSelectedKeywordCategory(categories);
              }}
              labelledBy="Select Category"
            />
          )
        ) : activeClientProject?.brandTreeSelect ? (
          <>
            {/* <CategoryTreeMultiSelect labelledBy="Select Category" sub_category_options={filters?.sub_category ?? []} category_options={filters?.category ?? []} category_initvalue={selectedFilters?.selectedCategory ?? []} sub_category_initvalue={selectedFilters?.selectedSubCategory_init ?? []} updateSelectedFilters={updateSelectedFilters} updateSelectedFiltersV2={updateSelectedCategoryV2} /> */}
            <CategoryTreeMultiSelect
              label="Category"
              toggleShowMoreTooltip={toggleShowMoreTooltip}
              labelledBy="Select Category"
              options={filters?.category ?? []}
              initvalue={selectedFilters?.selectedCategory ?? []}
              selectedItems={selectedFilters?.selectedCategory ?? []}
              updateSelectedFilters={updateSelectedCategoryV2}
            />
          </>
        ) : (
          <div>
            {kpi === "SOM" ? (
              <>
                {/* <CategoryTreeMultiSelect
                  label="Category"
                  toggleShowMoreTooltip={toggleShowMoreTooltip}
                  labelledBy="Select Category"
                  options={filters?.category_som ?? []}
                  initvalue={selectedFilters?.selectCategory_som ?? []}
                  selectedItems={selectedFilters?.selectCategory_som ?? []}
                  updateSelectedFilters={updatecategory_som}
                /> */}


                <CustomMultiSelect
            toggleShowMoreTooltip={toggleShowMoreTooltip}
            tooltip={true}
            label="Category"
            options={filters?.category_som ?? []}
            value={selectedFilters.selectCategory_som}
            // onClick={()=>console.log('Brand','label here ')}
            onChange={(category) => {
              
              
              updatecategory_som(category);
            }}
            labelledBy="Select Brand"
          />

              </>
            ) : (
              <CustomMultiSelect
                toggleShowMoreTooltip={toggleShowMoreTooltip}
                disabled={kpi == "SOS" || kpi == "OR"}
                tooltip={true}
                label="Category"
                options={filters?.category}
                value={selectedFilters.selectedCategory}
                onChange={(categories) => {
                  trackDashboardClick({
                    section: "Top filters",
                    eventcategory: "category",
                    eventaction: "click",
                    eventlabel: categories,
                  });
                  updateSelectedCategory(categories);
                }}
                labelledBy="Select Category"
              />
            )}
          </div>
        )}

        <div className="ebuxHeadBox ">
          <label>Location</label>
          {activeClientProject?.client_project_id==10?

          <ColPalMTLocationTreeMultiSelect
            toggleShowMoreTooltip={toggleShowMoreTooltip}
            disabled={kpi == "SOM"?true:false}
            labelledBy="Select Location"
            options={filters?.location ?? []}
            initvalue={selectedFilters.selectedLocation}
            selectedItems={selectedFilters?.selectedLocation ?? []}
            updateSelectedFilters={updateSelectedFilters}
          />
          :

          <TreeMultiSelect
            toggleShowMoreTooltip={toggleShowMoreTooltip}
            disabled={kpi == "SOM"?true:false}
            labelledBy="Select Location"
            options={filters?.location ?? []}
            initvalue={selectedFilters.selectedLocation}
            selectedItems={selectedFilters?.selectedLocation ?? []}
            updateSelectedFilters={updateSelectedFilters}
          />
          }
          
        </div>

        {activeClientProject?.dark_store && kpi != "SOS" && kpi != "OR" ? (
          <div className="ebuxHeadBox">
            <label>Dark Store ID</label>
            <DarkstoreTreeMultiSelect
              toggleShowMoreTooltip={toggleShowMoreTooltip}
              labelledBy="Select Dark Store ID"
              options={filters?.darkstore ?? []}
              initvalue={selectedFilters.selectedDarkstore}
              selectedItems={selectedFilters?.selectedDarkstore ?? []}
              updateSelectedFilters={updateSelectedFilters}
            />
          </div>
        ) : // <></>}
        kpi == "SOS" || kpi == "OR" ? (
          activeClientProject?.brandTreeSelect ? (
            <KeywordTreeMultiSelect
              kpi={kpi}
              clientId={activeClientProject?.client_project_id}
              updateSelectedSOSOption={updateSelectedSOSOption}
              selected_sos_option={selectedFilters.selected_sos_option}
              toggleShowMoreTooltip={toggleShowMoreTooltip}
              labelledBy="Select Keyword"
              options={filters?.keyword ?? []}
              initvalue={selectedFilters?.selectedKeyword ?? []}
              selectedItems={selectedFilters?.selectedKeyword ?? []}
              updateSelectedFilters={updateSelectedKeywordV2}
            />
          ) : (
            <CustomMultiSelect
              toggleShowMoreTooltip={toggleShowMoreTooltip}
              disabled={!(kpi == "SOS" || kpi == "OR")}
              tooltip={true}
              label="Keyword"
              options={filters?.keyword ?? []}
              value={selectedFilters?.selectedKeyword??[]}
              onChange={(keywords) => {
                trackDashboardClick({
                  section: "Top filters",
                  eventcategory: "Keyword",
                  eventaction: "click",
                  eventlabel: keywords,
                });
                updateSelectedKeyword(keywords);
              }}
              labelledBy="Select Keyword"
            />
          )
        ) : (
          <></>
        )}
        {kpi === "SOM" && (
          <CustomMultiSelect
            toggleShowMoreTooltip={toggleShowMoreTooltip}
            tooltip={true}
            label="Category Node"
            options={filters?.category_node ?? []}
            value={selectedFilters?.selectCategory_node}
            onChange={(category) => {
              trackDashboardClick({
                section: "Top filters",
                eventcategory: "categorynode",
                eventaction: "click",
                eventlabel: category,
              });
                updateCategorynode(category)
             // updateSelectedKeyword(keywords);
            }}
            labelledBy="Select Categorynode"
          />
        )}
        {
          activeClientProject?.client_project_id == 10 && (["SOS","OR","SOM"]?.indexOf(kpi)==-1) ? 
          <CustomMultiSelect
            toggleShowMoreTooltip={toggleShowMoreTooltip}
            disabled={kpi == "SOS" || kpi == "OR" || kpi == "SOD"}
            tooltip={false}
            label="PPG"
            options={filters?.product_ppg ?? []}
            value={selectedFilters.selectedProduct_ppg}
            onChange={(ppg) => {
              trackDashboardClick({
                section: "Top filters",
                eventcategory: "ppg",
                eventaction: "click",
                eventlabel: ppg,
              });
              updateSelectedProdcutPPG(ppg);
            }}
            labelledBy="Select PPG"
          />:
          <></>
        }

        {
          activeClientProject?.client_project_id == 2 && (kpi == "OSA" || kpi == "PRO" || kpi == "RR") ? (
            <CustomMultiSelect
            toggleShowMoreTooltip={toggleShowMoreTooltip}
            disabled={kpi == "SOS" || kpi == "OR" || kpi == "SOD"}
            tooltip={false}
            label="Mother Pack"
            options={filters?.mother_pack ?? []}
            value={selectedFilters?.selectedMotherPack ?? []}
            onChange={(motherPackIds) => {
              trackDashboardClick({
                section: "Top filters",
                eventcategory: "mother_pack",
                eventaction: "click",
                eventlabel: motherPackIds,
              });
              updateSelectedMotherPack(motherPackIds);
            }}
            labelledBy="Select Product"
          />
          ) : <></>
        }

        {kpi == "SOS" || kpi == "OR" || kpi == "SOM" ? (
          <></>
        ) : activeClientProject?.brandTreeSelect ? (
          // <CustomMultiSelectV2 disabled={(kpi == "SOS" || kpi == "OR" || kpi == "SOD")}
          // tooltip={true}
          // label="Product"
          // options={filters?.products ?? []}
          // value={selectedFilters.selectedProductId}
          // onChange={(productIds) => updateSelectedProductV2(productIds)}
          // labelledBy="Select Product" />
          activeClientProject?.client_project_id == 4 ? (
            <ProductPerfetiiTreeMultiSelect
              selectedMsl={selectedMsl}
              updateSelectedMSL={updateSelectedMSLV2}
              toggleShowMoreTooltip={toggleShowMoreTooltip}
              disabled={kpi == "SOS" || kpi == "OR" || kpi == "SOD" }
              label={"Product"}
              labelledBy="Select Product"
              options={filters?.products ?? []}
              initvalue={selectedFilters.selectedProductId ?? []}
              selectedItems={selectedFilters.selectedProductId ?? []}
              updateSelectedFilters={updateSelectedProductV2}
            />
          ) : (
            <ProductTreeMultiSelect
              selectedMsl={selectedMsl}
              updateSelectedMSL={updateSelectedMSLV2}
              toggleShowMoreTooltip={toggleShowMoreTooltip}
              disabled={kpi == "SOS" || kpi == "OR" || kpi == "SOD"}
              label={"Product"}
              labelledBy="Select Product"
              options={filters?.products ?? []}
              initvalue={selectedFilters.selectedProductId ?? []}
              selectedItems={selectedFilters.selectedProductId ?? []}
              updateSelectedFilters={updateSelectedProductV2}
            />
          )
        ) : (
          <CustomMultiSelect
            toggleShowMoreTooltip={toggleShowMoreTooltip}
            disabled={kpi == "SOS" || kpi == "OR" || kpi == "SOD"}
            tooltip={false}
            label="Product"
            options={filters?.products ?? []}
            value={selectedFilters.selectedProductId}
            onChange={(productIds) => {
              trackDashboardClick({
                section: "Top filters",
                eventcategory: "product",
                eventaction: "click",
                eventlabel: productIds,
              });
              updateSelectedProduct(productIds);
            }}
            useMsl={activeClientProject?.useMsl}

            selectedMsl={selectedMsl}
            updateSelectedMSL={updateSelectedMSLV2}

            labelledBy="Select Product"
          />
        )}

        <CustomMultiSelect
          toggleShowMoreTooltip={toggleShowMoreTooltip}
          disabled={kpi == "SOS" || kpi == "OR" || kpi == "SOD" || kpi=="SOM"}
          tooltip={true}
          label="OSA Status"
          selectAllText="All Product"
          options={filters?.osa_remarks ?? []}
          value={selectedFilters?.selectedOSARemarks ?? []}
          onChange={(osa_remarks) => {
            trackDashboardClick({
              section: "Top filters",
              eventcategory: "osa status",
              eventaction: "click",
              eventlabel: osa_remarks,
            });
            updateSelectedFilters("selectedOSARemarks", osa_remarks);
          }}
          labelledBy="Select OSA Status"
        />

        {/* <div className="ebuxHeadBox "> */}
          {/* <DatePicker calState={calState} setCalState={setCalState} options={optionsDate}/> */}
          {/* <label>Date Range</label> */}
          {/* <MultiSelect
                        hasSelectAll={false}
                        singleSelect="true"
                        options={filters?.date ?? []}
                        value={selectedFilters?.selectedDate ?? []}
                        onChange={(selected) => {
                            updateSelectedFilters('selectedDate', [((selected.length > 0) ? (selected[selected.length - 1]) : (filters?.date[0] ?? []))]);
                        }}
                        labelledBy="Select Date Range"
                    /> */}
          {/* <CompareCalendar
            onChange={handleDateRangeFilter}
            defaultValue={selectedFilters.selectedDateRange}
            calendarPosition={
              activeClientProject?.dark_store === true ? "left" : "right"
            }
            // defaultSelected={7}
          /> */}
        {/* </div> */}
      </div>
    </>
  );
};

export default HeaderFiltersComponent;
