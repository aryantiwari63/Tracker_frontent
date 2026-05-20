import "./style.css";
import React, { useEffect, useState } from "react";
import { FILTERACTION } from "./FilterConstant";
import { useEbuxContext } from "../../Context/EbuxProvider";
import MultiFilter from "./MultiFilter";
import { useMemo } from "react";

const ComprehensiveBreakdownMultiFilter = ({
  arr = [],
  additionalFilter = [],
  defaultValue = false,
  savedSearch = {},
  handleSaveFilters = false,
  applySearchFilter = false,
  platform = "ams",
  openMFilter = null,
  setOpenMFilter,
}) => {

  const {
    filters, kpi, activeClientProject, tagList } = useEbuxContext();
  const [filterData, setFilterData] = useState([]);

  const locationData = useMemo(() => {

    const regionMap = {};
    if (activeClientProject?.client_project_id == 10) {

      filters?.locationPincode.forEach(pincode => {
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
      return {
        key: "location",
        label: "Location",
        selectable: false,
        children: Object.keys(regionMap).map((region) => ({
          key: `location-region_${region}`,
          label: region,
          selectable: false,
          children: Object.keys(regionMap[region]).map((state) => ({
            key: `location-state_${region}_${state}`,
            label: state,
            selectable: false,
            children: Object.keys(regionMap[region][state]).map((city) => ({
              key: `location-city_${region}_${state}_${city}`,
              label: city,
              selectable: false,
              children: Object.keys(regionMap[region][state][city]).map((label) => {
                const pincode = regionMap[region][state][city][label];
                return ({
                  //  label: pincode.label == '0' ? (pincode.value == '10' ? "Amazon" : pincode.value == '24' ? "Nykaa" : "Pincode" + pincode.value) : pincode.label,
                  label: pincode.label,
                  key: `location-${pincode?.value}-${pincode.city} (${pincode.label})`,
                  data: `Location-${pincode?.value}-${pincode.label}`,
                  action: FILTERACTION.APPLY
                })
              })
            })),
          })),
        }))
      };
    }
    return regionMap;
  }, [filters?.locationPincode]);
  const brandData = useMemo(() => {

    const brandMap = {};

    if (activeClientProject?.client_project_id == 10) {
      filters?.brand.forEach(item => {

        const { label: brand, sub_brand } = item;
        if (!brandMap[brand]) {
          brandMap[brand] = {};
        }

        if (!brandMap[brand][sub_brand]) {
          brandMap[brand][sub_brand] = { ...item };
        }
      })
      return {
        key: "brand",
        label: "Brand",
        selectable: false,
        children: Object.keys(brandMap).map(brand => ({
          key: `brand-${brand}`,
          label: brand,
          selectable: false,
          children: Object.keys(brandMap[brand]).map(sub_brand => ({
            label: sub_brand,
            key: `brand-${brandMap[brand][sub_brand]?.value}-${sub_brand}`,
            data: `Brand-${brandMap[brand][sub_brand]?.value}-${sub_brand}`,
            action: FILTERACTION.APPLY
          }))
        }))
      }
    }

    return brandMap;
  }, [filters?.brand]);
  useEffect(() => {
    if (arr.length > 0) {



      const platform = {
        key: "platform",
        label: "Platform",
        // mapKey: "platform",
        selectable: false,
        // children: filters?.platform?.map((item) => ({
        children: (kpi == "SOM"
          ? filters?.platform?.filter(item => item?.app_status_som == 1)
          : filters?.platform
        )?.map(item => ({
          label: item?.label,
          key: `platform-${item?.value}-${item?.label}`,
          data: `Platform-${item?.value}-${item?.label}`,

          action: FILTERACTION.APPLY,
          // className: this.state?.disabled ? "disableli" : "",
        }))
      };
      let brand = {
        key: "brand",
        label: "Brand",
        selectable: false,
        children: []
      };
      let tag = {
        key: "tag",
        label: "Tag",
        selectable: false,
        children: []
      };
      if (activeClientProject?.client_project_id == 10) {
        brand = brandData;
      } else if ((activeClientProject?.brandTreeSelect)) {
        if ((["SOS", "OR"].includes(kpi))) {

          brand["children"] = filters?.brand?.flatMap((brand) => (brand.sub_brands))?.map((sub_brand, _k) => ({
            // children: brand.sub_brands.map((sub_brand,_k) => ({
            label: sub_brand?.sub_brand,
            key: `brand-${sub_brand.value}-${sub_brand.sub_brand}-${_k}}`,
            data: `Brand-${sub_brand.value}-${sub_brand.sub_brand}`,
            action: FILTERACTION.APPLY,
            // })
          }))
          // }))
        } else {

          brand["children"] = filters?.brand?.map((brand, index) => ({
            key: `brand-brnad_${index}`,
            label: brand?.label ?? brand?.label,
            selectable: false,
            // action: FILTERACTION.APPLY,
            children: brand.sub_brands.map((sub_brand, _k) => ({
              label: sub_brand.sub_brand,
              key: `brand-${sub_brand.value}-${sub_brand.sub_brand}-${_k}}`,
              data: `Brand-${sub_brand.value}-${sub_brand.sub_brand}`,
              action: FILTERACTION.APPLY,
            }))
          }))
        }
        // brand["children"] = filters?.brand?.map((brand,index) => ({
        //     key: `brand-brnad_${index}`,
        //     label: brand?.label ?? brand?.label,
        //     selectable: false,
        //     // action: FILTERACTION.APPLY,
        //     children: brand.sub_brands.map((sub_brand,_k) => ({
        //       label: sub_brand.sub_brand,
        //       key: `brand-${sub_brand.value}-${sub_brand.sub_brand}-${_k}}`,
        //       data: `Brand-${sub_brand.value}-${sub_brand.sub_brand}`,    
        //       action: FILTERACTION.APPLY,
        //     }))
        //   }))
      } else {
        brand["children"] = filters?.brand?.map((item) => ({
          label: item?.label,
          key: `brand-${item?.value}-${item?.label}`,
          data: `Brand-${item?.value}-${item?.label}`,

          action: FILTERACTION.APPLY,
          // className: this.state?.disabled ? "disableli" : "",
        }))
      }
      let _competitionBrand = {};
      filters?.competition_brand?.forEach(item => {
        if (!_competitionBrand?.[`${item?.label}`]) {
          _competitionBrand[`${item?.label}`] = { ...item, value: [item?.value] };
        } else {
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

      if ((["SOD"].includes(kpi))) {
        const category = {
          key: "category",
          label: "Category",
          selectable: false,
          children: filters?.category?.map((item) => ({
            label: item?.label,
            key: `category-${item?.value}-${item?.label}`,
            data: `Category-${item?.value}-${item?.label}`,
            action: FILTERACTION.APPLY,
          }))
        };
        const page_location = {
          key: "page_location",
          label: "Page Location",
          selectable: false,
          children: filters?.sod_page_location?.map((item) => ({
            label: item?.label,
            key: `page_location-${item?.value}-${item?.label}`,
            data: `Page Location-${item?.value}-${item?.label}`,
            action: FILTERACTION.APPLY,
          }))
        };
        const display_ad_type = {
          key: "display_ad_type",
          label: "Display Ad Type",
          selectable: false,
          children: filters?.sod_display_ad_type?.map((item) => ({
            label: item?.label,
            key: `display_ad_type-${item?.value}-${item?.label}`,
            data: `Display Ad Type-${item?.value}-${item?.label}`,
            action: FILTERACTION.APPLY,
          }))
        };
        const finalFilterData = [...arr, platform, brand, category, page_location, display_ad_type]
        if (additionalFilter.indexOf("competition_brand") > -1) {
          finalFilterData.push(competitionBrand)
        }
        setFilterData(finalFilterData);
      } else if ('SOM'.includes(kpi)) {

        const category = {
          key: "category",
          label: "Category",
          selectable: false,
          children: filters?.category_som?.map((item) => ({
            label: item?.label,
            key: `category-${item?.value}-${item?.label}`,
            data: `Category-${item?.value}-${item?.label}`,
            action: FILTERACTION.APPLY,
          }))
        }
        const categorynode = {
          key: "categorynode",
          label: "Categorynode",
          selectable: false,
          children: filters?.category_node?.map((item) => ({
            type: "categorynode", //added new key for split (@) character only categorynode value 
            label: item?.label,
            key: `categorynode@${item?.value}@${item?.label}`,
            data: `Categorynode@${item?.value}@${item?.label}`,
            action: FILTERACTION.APPLY,
          }))
        }
        const finalFilterData = [platform, brand, category, categorynode]
        setFilterData(finalFilterData);

      } else if ((["SOS", "OR"].includes(kpi))) {
        tag["children"] = tagList?.filter(tagItem => tagItem?.tag_type == "Keyword")?.map((tagItem, _k) => ({
          label: tagItem?.tag_name,
          key: `tag-${tagItem?.id}-${tagItem?.tag_name}-${_k}}`,
          data: `Tag-${tagItem?.id}-${tagItem?.tag_name}`,
          action: FILTERACTION.APPLY,
        }))
        const location = (activeClientProject?.client_project_id == 10) ? locationData : {
          key: "location",
          label: "Location",
          selectable: false,
          children: filters?.locationPincode?.map((item) => ({
            label: (item.value == '10' ? "All (Amazon)" : item.value == '24' ? "All (Nykaa)" : `${item.city} (${item.label})`),
            key: `location-${item?.value}-${(item.value == '10' ? "All (Amazon)" : item.value == '24' ? "All-Nykaa" : `${item.city} (${item.label})`)}`,
            data: `Location-${item?.value}-${(item.value == '10' ? "All (Amazon)" : item.value == '24' ? "All-Nykaa" : `${item.city} (${item.label})`)}`,

            action: FILTERACTION.APPLY,
            // className: this.state?.disabled ? "disableli" : "",
          }))
        };
        const nameIdFilter = {
          key: "name_id",
          label: "Name/ID",
          selectable: false,
          children: [
            {
              key: "name_id-keyword",
              label: "Keyword Name",
              data: "Keyword Name - ",
              mapKey: "keyword",
              action: FILTERACTION.SEARCH,
              // className: this.state?.disabled ? "disableli" : "",
            },
          ],
        }
        const keywordCategory = {
          key: "category",
          label: "Category",
          selectable: false,
          children: []
        };

        if ((activeClientProject?.brandTreeSelect)) {

          keywordCategory.children = filters?.keywordCategory?.map(category => ({
            key: `category-${category?.label}`,
            label: category?.label ?? category?.label,
            selectable: false,
            action: FILTERACTION.APPLY,
            children: category.sub_categories.map(sub_category => ({
              label: sub_category.sub_category,
              key: `category-${sub_category.value}-${`${sub_category.sub_category}-${sub_category.category}-${sub_category.value}`}`,
              data: `Category-${sub_category.value}-${sub_category.sub_category}`,
              action: FILTERACTION.APPLY,
            }))
          }))
        } else {
          keywordCategory.children = filters?.keywordCategory?.map((item) => ({
            label: item?.label,
            key: `category-${item?.value}-${item?.label}`,
            data: `Category-${item?.value}-${item?.label}`,

            action: FILTERACTION.APPLY,
            // className: this.state?.disabled ? "disableli" : "",
          }))
        }
        const keywordType = {
          key: "keyword Type",
          label: "Keyword Type",
          selectable: false,
          children: filters?.keywordType?.map((item) => ({
            label: item?.label,
            key: `keyword Type-${item?.value}-${item?.label}`,
            data: `keyword Type-${item?.value}-${item?.label}`,

            action: FILTERACTION.APPLY,
            // className: this.state?.disabled ? "disableli" : "",
          }))
        };

        const finalFilterData = [nameIdFilter, ...arr, platform, brand, location, keywordCategory, keywordType, tag]
        if (additionalFilter.indexOf("competition_brand") > -1) {
          finalFilterData.push(competitionBrand)
        }
        setFilterData(finalFilterData);
      } else {
        tag["children"] = tagList?.filter(tagItem => tagItem?.tag_type == "Product")?.map((tagItem, _k) => ({
          label: tagItem?.tag_name,
          key: `tag-${tagItem?.id}-${tagItem?.tag_name}-${_k}}`,
          data: `Tag-${tagItem?.id}-${tagItem?.tag_name}`,
          action: FILTERACTION.APPLY,
        }))
        const mother_pack = {
          key: "mother_pack",
          label: "Mother Pack",
          // mapKey: "platform",
          selectable: false,
          children: filters?.mother_pack?.map((item) => ({
            label: item?.label,
            // key: `mother_pack-${item?.value}-${item?.label}`,
            key: `mother_pack-${item?.value?.replace('-', ':|@|:')}-${item?.label?.replace('-', ':|@|:')}`,
            data: `Mother Pack-${item?.value}-${item?.label}`,

            action: FILTERACTION.APPLY,
            // className: this.state?.disabled ? "disableli" : "",
          }))
        };
        const osa_remarks = {
          key: "osa_remarks",
          label: "OSA Status",
          // mapKey: "platform",
          selectable: false,
          children: filters?.osa_remarks?.map((item) => ({
            label: item?.label,
            key: `osa_remarks-${item?.value}-${item?.label}`,
            data: `OSA Status-${item?.value}-${item?.label}`,

            action: FILTERACTION.APPLY,
            // className: this.state?.disabled ? "disableli" : "",
          }))
        };
        const msl = {
          key: "msl",
          label: "MSL Flag",
          // mapKey: "platform",
          selectable: false,
          children: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }]?.map((item) => ({
            label: item?.label,
            key: `msl-${item?.value}-${item?.label}`,
            data: `MSL Flag-${item?.value}-${item?.label}`,
            action: FILTERACTION.APPLY,
            // className: this.state?.disabled ? "disableli" : "",
          }))
        };
        const location = (activeClientProject?.client_project_id == 10) ? locationData : {
          key: "location",
          label: "Location",
          selectable: false,
          children: filters?.locationPincode?.map((item) => ({
            label: (item.value == '10' ? "All (Amazon)" : item.value == '24' ? "All (Nykaa)" : `${item.city} (${item.label})`),
            key: `location-${item?.value}-${(item.value == '10' ? "All (Amazon)" : item.value == '24' ? "All-Nykaa" : `${item.city} (${item.label})`)}`,
            data: `Location-${item?.value}-${(item.value == '10' ? "All (Amazon)" : item.value == '24' ? "All-Nykaa" : `${item.city} (${item.label})`)}`,

            action: FILTERACTION.APPLY,
            // className: this.state?.disabled ? "disableli" : "",
          }))
        };


        const nameIdFilter = {
          key: "name_id",
          label: "Name/ID",
          selectable: false,
          children: [
            {
              key: "name_id-pincode",
              label: "Pincode",
              data: "Pincode - ",
              mapKey: "pincode",
              action: FILTERACTION.SEARCH,
              // className: this.state?.disabled ? "disableli" : "",
            },
            {
              key: "name_id-sku_name",
              label: "Product Name",
              data: "Product Name - ",
              mapKey: "sku_name",
              action: FILTERACTION.SEARCH,
            },
            {
              key: "name_id-web_pid",
              label: "SKU",
              data: "SKU - ",
              mapKey: "web_pid",
              action: FILTERACTION.SEARCH,
              // className: this.state?.disabled ? "disableli" : "",
            }
          ],
        }
        if ((activeClientProject?.brandTreeSelect)) {
          nameIdFilter.children.push(...[
            {
              key: "name_id-reseller_id",
              label: "Brand Pack SKU",
              data: "Brand Pack SKU - ",
              mapKey: "reseller_id",
              action: FILTERACTION.SEARCH,
            },
            {
              key: "name_id-ebux_code",
              label: "Platform ID",
              data: "Platform ID - ",
              mapKey: "ebux_code",
              action: FILTERACTION.SEARCH,
            },
            {
              key: "name_id-ean_code",
              label: "EAN Code",
              data: "EAN Code - ",
              mapKey: "ean_code",
              action: FILTERACTION.SEARCH,
            }
          ]);
        }
        if (additionalFilter.indexOf("competition_sku_name") > -1) {
          nameIdFilter.children.push({
            key: "name_id-competition_sku_name",
            label: "Competition Product Name",
            data: "Competition Product Name - ",
            mapKey: "competition_sku_name",
            action: FILTERACTION.SEARCH,
          })
        }
        if (additionalFilter.indexOf("competition_web_pid") > -1) {
          nameIdFilter.children.push({
            key: "name_id-competition_web_pid",
            label: "Competition SKU",
            data: "Competition SKU - ",
            mapKey: "competition_web_pid",
            action: FILTERACTION.SEARCH,
          })
        }
        let category = {
          key: "category",
          label: "Category",
          selectable: false,
          children: []
        }
        if ((activeClientProject?.brandTreeSelect)) {
          category["children"] = filters?.category?.map(category => ({
            key: `category-${category?.label}`,
            label: category?.label ?? category?.label,
            selectable: false,
            action: FILTERACTION.APPLY,
            children: category.sub_categories.map(sub_category => ({
              label: sub_category.sub_category,
              key: `category-${sub_category.value}-${`${sub_category.sub_category}-${sub_category.category}-${sub_category.value}`}`,
              data: `Category-${sub_category.value}-${sub_category.sub_category}`,
              action: FILTERACTION.APPLY,
            }))
          }))

        } else {
          category["children"] = filters?.category?.map((item) => ({
            label: item?.label,
            key: `category-${item?.value}-${item?.label}`,
            data: `Category-${item?.value}-${item?.label}`,

            action: FILTERACTION.APPLY,
            // className: this.state?.disabled ? "disableli" : "",
          }))
        }

        const finalFilterData = [nameIdFilter, ...arr, platform, brand, category, location, msl, osa_remarks, tag]
        if ((activeClientProject?.client_project_id == 10)) {
          const ppg = {
            key: "product_ppg",
            label: "PPG",
            selectable: false,
            children: filters?.product_ppg?.map((item) => ({
              label: item.label,
              key: `product_ppg-${item?.value}-${item.label}`,
              data: `PPG-${item?.value}-${item.label}`,
              action: FILTERACTION.APPLY
            }))
          };
          finalFilterData.push(ppg)

        }
        if ((activeClientProject?.client_project_id == 1)) {
          const segment = {
            key: "segment",
            label: "Segment",
            selectable: false,
            children: filters?.segmentData?.map((item) => ({
              label: item.label,
              key: `segment-${item?.value}-${item.label}`,
              data: `Segment-${item?.value}-${item.label}`,
              action: FILTERACTION.APPLY
            }))
          };
          finalFilterData.push(segment)

          const dynamic_p = {
            key: "dynamic_p",
            label: "Dynamic P",
            selectable: false,
            children: filters?.dynamicPData?.map((item) => ({
              label: item.label,
              key: `dynamic_p-${item?.value}-${item.label}`,
              data: `Dynamic P-${item?.value}-${item.label}`,
              action: FILTERACTION.APPLY
            }))
          };
          finalFilterData.push(dynamic_p)
          const static_p = {
            key: "static_p",
            label: "Static P",
            selectable: false,
            children: filters?.staticPData?.map((item) => ({
              label: item.label,
              key: `static_p-${item?.value}-${item.label}`,
              data: `Static P-${item?.value}-${item.label}`,
              action: FILTERACTION.APPLY
            }))
          };
          finalFilterData.push(static_p)
          const product_type = {
            key: "product_type",
            label: "Product Type",
            selectable: false,
            children: filters?.productTypeData?.map((item) => ({
              label: item.label,
              key: `product_type-${item?.value}-${item.label}`,
              data: `Product Type-${item?.value}-${item.label}`,
              action: FILTERACTION.APPLY
            }))
          };
          finalFilterData.push(product_type)

        }

        if ([2].indexOf(activeClientProject?.client_project_id) > -1) {
          finalFilterData.push(mother_pack)
        }
        if (additionalFilter.indexOf("competition_brand") > -1) {
          finalFilterData.push(competitionBrand)
        }
        if ((activeClientProject?.dark_store)) {
          const darkstore = {
            key: "darkstore",
            label: "Dark Store ID",
            selectable: false,
            children: filters?.darkstore_id?.map((item) => ({
              label: `${item.city} (${item.label})`,
              key: `darkstore-${item?.value}-${`${item.city} (${item.label})`}`,
              data: `Dark Store ID-${item?.value}-${`${item.city} (${item.label})`}`,

              action: FILTERACTION.APPLY,
              // className: this.state?.disabled ? "disableli" : "",
            }))
          };
          finalFilterData.push(darkstore)
        }
        setFilterData(finalFilterData);
      }
    }
  }, [JSON.stringify(arr), JSON.stringify(additionalFilter)]);




  return (
    <>
    {
      activeClientProject?.isUseWidget?
        <MultiFilter openMFilter={openMFilter} setOpenMFilter={setOpenMFilter} filterData={filterData} applySearchFilter={applySearchFilter} handleSaveFilters={handleSaveFilters} savedSearch={savedSearch} defaultValue={defaultValue} platform={platform} isSearchable={true} showSearchBar={false} hasCancel={true} />
      :
        <MultiFilter filterData={filterData} applySearchFilter={applySearchFilter} handleSaveFilters={handleSaveFilters} savedSearch={savedSearch} defaultValue={defaultValue} platform={platform} />
    }
    </>
  );
};

export default ComprehensiveBreakdownMultiFilter;
