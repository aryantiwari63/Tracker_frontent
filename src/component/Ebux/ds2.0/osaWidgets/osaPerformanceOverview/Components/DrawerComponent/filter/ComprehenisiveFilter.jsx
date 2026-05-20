import React, { useMemo, useState, useEffect } from 'react'
import MultiFilter from '../../../../../../common-components/MultiFilter/MultiFilter';
import { useEbuxContext } from '../../../../../../Context/EbuxProvider';
import { FILTERACTION } from '../../../../../../common-components/MultiFilter/FilterConstant';

const ComprehenisiveFilter = ({
    arr = [],
    additionalFilter = [],
    defaultValue = false,
    savedSearch = {},
    handleSaveFilters = false,
    applySearchFilter = false,
    platform = "ams",
    text = ""
}) => {
    const {
        filters, kpi, activeClientProject
        // , tagList
     } = useEbuxContext();
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
        console.log({additionalFilter});
        
        const comman = [];
        if (additionalFilter.indexOf("platform") > -1) {
            const platform = {
                key: "platform",
                label: "Platform",
                selectable: false,
                children: filters?.platform?.map(item => ({
                    label: item?.label,
                    key: `platform-${item?.value}-${item?.label}`,
                    data: `Platform-${item?.value}-${item?.label}`,
                    action: FILTERACTION.APPLY,
                }))
            };
            comman.push(platform);
        }
        if (additionalFilter.indexOf("brand") > -1) {
            let brand = {
                key: "brand",
                label: "Brand",
                selectable: false,
                children: []
            };
            if (activeClientProject?.client_project_id == 10) {
                brand = brandData;
            } else if ((activeClientProject?.brandTreeSelect)) {
                if ((["SOS", "OR"].includes(kpi))) {
                    brand["children"] = filters?.brand?.flatMap((brand) => (brand.sub_brands))?.map((sub_brand, _k) => ({
                        label: sub_brand?.sub_brand,
                        key: `brand-${sub_brand.value}-${sub_brand.sub_brand}-${_k}}`,
                        data: `Brand-${sub_brand.value}-${sub_brand.sub_brand}`,
                        action: FILTERACTION.APPLY,
                    }))
                } else {
                    brand["children"] = filters?.brand?.map((brand, index) => ({
                        key: `brand-brnad_${index}`,
                        label: brand?.label ?? brand?.label,
                        selectable: false,
                        children: brand.sub_brands.map((sub_brand, _k) => ({
                            label: sub_brand.sub_brand,
                            key: `brand-${sub_brand.value}-${sub_brand.sub_brand}-${_k}}`,
                            data: `Brand-${sub_brand.value}-${sub_brand.sub_brand}`,
                            action: FILTERACTION.APPLY,
                        }))
                    }))
                }
            } else {
                brand["children"] = filters?.brand?.map((item) => ({
                    label: item?.label,
                    key: `brand-${item?.value}-${item?.label}`,
                    data: `Brand-${item?.value}-${item?.label}`,
                    action: FILTERACTION.APPLY,
                }))
            }
            comman.push(brand);
        }
        // let _competitionBrand = {};
        // filters?.competition_brand?.forEach(item => {
        //     if (!_competitionBrand?.[`${item?.label}`]) {
        //         _competitionBrand[`${item?.label}`] = { ...item, value: [item?.value] };
        //     } else {
        //         _competitionBrand[`${item?.label}`].value.push(item?.value);
        //     }
        // });
        // let competitionBrand = {
        //     key: "competition_brand",
        //     label: "Competition Brand",
        //     selectable: false,
        //     children: Object.values(_competitionBrand)?.map((item) => ({
        //         label: item?.label,
        //         key: `competition_brand-${item?.value}-${item?.label}`,
        //         data: `Competition Brand-${item?.value}-${item?.label}`,

        //         action: FILTERACTION.APPLY,
        //         // className: this.state?.disabled ? "disableli" : "",
        //     }))
        // };

        if ((["SOS", "OR"].includes(kpi))) {
            const finalFilterData = [...arr, ...comman];
            if (additionalFilter.indexOf("keyword") > -1) {
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
                        },
                    ],
                }
                finalFilterData.push(nameIdFilter);
            }

            if (additionalFilter.indexOf("location") > -1) {
                const location = (activeClientProject?.client_project_id == 10) ? locationData : {
                    key: "location",
                    label: "Location",
                    selectable: false,
                    children: filters?.locationPincode?.map((item) => ({
                        label: (item.value == '10' ? "All (Amazon)" : item.value == '24' ? "All (Nykaa)" : `${item.city} (${item.label})`),
                        key: `location-${item?.value}-${(item.value == '10' ? "All (Amazon)" : item.value == '24' ? "All-Nykaa" : `${item.city} (${item.label})`)}`,
                        data: `Location-${item?.value}-${(item.value == '10' ? "All (Amazon)" : item.value == '24' ? "All-Nykaa" : `${item.city} (${item.label})`)}`,
                        action: FILTERACTION.APPLY,
                    }))
                };
                finalFilterData.push(location);
            }

            setFilterData(finalFilterData);
        } else {

            const finalFilterData = [...arr, ...comman];
            const nameIdFilterCol=["product","skuId","sku_name","web_pid",""];
            if (additionalFilter?.filter(i=>nameIdFilterCol?.indexOf(i)>-1)?.length) {
                const nameIdFilter = {
                    key: "name_id",
                    label: "Name/ID",
                    selectable: false,
                    children: [
                        // {
                        //     key: "name_id-pincode",
                        //     label: "Pincode",
                        //     data: "Pincode - ",
                        //     mapKey: "pincode",
                        //     action: FILTERACTION.SEARCH,
                        //     // className: this.state?.disabled ? "disableli" : "",
                        // },
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
                finalFilterData.push(nameIdFilter);
            }
            if (additionalFilter.indexOf("location") > -1) {
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
                finalFilterData.push(location);
            }

            setFilterData(finalFilterData);
        }
        // }
    }, [JSON.stringify(arr), JSON.stringify(additionalFilter)]);




    return (
        <MultiFilter filterData={filterData} applySearchFilter={applySearchFilter} handleSaveFilters={handleSaveFilters} savedSearch={savedSearch} defaultValue={defaultValue} platform={platform} isSearchable={false} isChipVIsible={false} buttonName={text} />
    );
}

export default ComprehenisiveFilter
