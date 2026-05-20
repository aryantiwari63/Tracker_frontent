import "./style.css";
import React, { useEffect, useState } from "react";
import { FILTERACTION } from "../../common-components/MultiFilter/FilterConstant";
import { useEbuxContext } from "../../Context/EbuxProvider";
import MultiFilter from "../../common-components/MultiFilter/MultiFilter";

const SentimentMultifilter = ({
  is_brand = true,
  applySearchFilter = false,
  handleSaveFilters = false,
  savedSearch = {},
  defaultValue = false,
  platform = "ams",
}) => {
  const { filters,activeClientProject } = useEbuxContext();
  const [filterData, setFilterData] = useState([]);

  useEffect(() => {
    // Defensive: always use arrays
    let brandArr =Array.isArray(filters?.brand) ? filters.brand : []
    
     
    const categoryArr = Array.isArray(filters?.category) ? filters.category : [];
    // Adjust this line if your product filter is named differently in your context
   
    

    // Brand filter
   
      let brand = {
        key: "brand",
        label: "Brand",
        selectable: false,
        children: [],
      };
      if (activeClientProject?.brandTreeSelect) {
        brand.children = brandArr.map((brand, index) => ({
          key: `brand-brnad_${index}`,
          label: brand?.label ?? "",
          selectable: false,
          children: Array.isArray(brand.sub_brands)
            ? brand.sub_brands.map((sub_brand, _k) => ({
                label: sub_brand.sub_brand,
                key: `brand-${sub_brand.value}-${sub_brand.sub_brand}-${_k}}`,
                data: `Brand-${sub_brand.value}-${sub_brand.sub_brand}`,
                action: FILTERACTION.APPLY,
              }))
            : [],
        }));
      } else {
        brand.children = brandArr.map((item) => ({
          label: item?.label ?? "",
          key: `brand-${item?.value ?? ""}-${item?.label ?? ""}`,
          data: `Brand-${item?.value ?? ""}-${item?.label ?? ""}`,
          action: FILTERACTION.APPLY,
        }));
      }
    
    let _competitionBrand={};
          filters?.competition_brand?.forEach(item => {
            if(!_competitionBrand?.[`${item?.label}`]){
              _competitionBrand[`${item?.label}`]={...item, value: [item?.value]};
            }else{
              _competitionBrand[`${item?.label}`].value.push(item?.value);
            }
          });
          let competitionBrand = {
            key: "competition_brand",
            label: "Competition Brand",
            selectable: false,
            children: Object.values(_competitionBrand)?.map((item) => ({
              label: item?.label,
              key: `competition_brand-${item?.value}-${item?.label}`,
              data: `Competition Brand-${item?.value}-${item?.label}`,
    
              action: FILTERACTION.APPLY,
              // className: this.state?.disabled ? "disableli" : "",
            }))
          };

    // Category filter
    let category = {
      key: "category",
      label: "Category",
      selectable: false,
      children: [],
    };
    if (activeClientProject?.brandTreeSelect) {
      category.children = categoryArr.map((cat) => ({
        key: `category-${cat?.label ?? ""}`,
        label: cat?.label ?? "",
        selectable: false,
        action: FILTERACTION.APPLY,
        children: Array.isArray(cat.sub_categories)
          ? cat.sub_categories.map((sub_category) => ({
              label: sub_category.sub_category,
              key: `category-${sub_category.value}-${sub_category.sub_category}`,
              data: `Category-${sub_category.value}-${sub_category.sub_category}`,
              action: FILTERACTION.APPLY,
            }))
          : [],
      }));
    } else {
      category.children = categoryArr.map((item) => ({
        label: item?.label ?? "",
        key: `category-${item?.value ?? ""}-${item?.label ?? ""}`,
        data: `Category-${item?.value ?? ""}-${item?.label ?? ""}`,
        action: FILTERACTION.APPLY,
      }));
    }

    // Product filter (adjust the mapping if your product structure is different)
    //  const nameIdFilter = {
    //          key: "name_id",
    //          label: "Name/ID",
    //          selectable: false,
    //          children: [
              
    //            {
    //              key: "name_id-sku_name",
    //              label: "Product Name",
    //              data: "Product Name - ",
    //              mapKey: "sku_name",
    //              action: FILTERACTION.SEARCH,
    //            },
                     
    //          ],
    //        }
           
    //        if((activeClientProject?.brandTreeSelect)){
    //          nameIdFilter.children.push({
    //              key: "name_id-competition_sku_name",
    //              label: "Competition Product Name",
    //              data: "Competition Product Name - ",
    //              mapKey: "competition_sku_name",
    //              action: FILTERACTION.SEARCH,
    //          })
    //        }
          

    // Compose the final filter data
    const finalFilterData = is_brand?[brand, category]:[ competitionBrand, category];
    setFilterData(finalFilterData);
  }, [filters, activeClientProject,is_brand]);

  return (
    <MultiFilter
      filterData={filterData}
      applySearchFilter={applySearchFilter}
      handleSaveFilters={handleSaveFilters}
      savedSearch={savedSearch}
      defaultValue={defaultValue}
      platform={platform}
    />
  );
};

export default SentimentMultifilter;
