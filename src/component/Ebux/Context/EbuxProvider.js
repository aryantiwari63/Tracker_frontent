import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import moment from "moment/moment";
import * as echarts from 'echarts';

import {
  getEbuxClientCustomizeColumnsComprehensiveBreakdown,
  getEbuxPlatforms,
  getEbuxUserUnsubscribedPlatforms,
  getEbuxLocationsNew, getEbuxDarkstoreLocation,
  getEbuxBrands, getEbuxCompetitionBrands, getEbuxCategories, getEbuxSubCategories,
  getEbuxKeywordCategories, getEbuxKeywords, getEbuxKeywordType,
  getEbuxMotherPack,
  getEbuxProducts, getEbuxOSARemarks,
  getEbuxSODPageLocation,
  getEbuxSODDisplayAdType,
  getKeywordCategorySom,
  getCategory_node,
  getEbuxColPalMtPpg,
  // getEbuxPlatformsDarkStore,
  getEbuxBrandsDarkStore,
  getEbuxCategoriesDarkStore,
  getEbuxMotherPackDarkStore,
  getEbuxProductsDarkStore,
  getDistinctFiltersDarkStore,
  getEbuxLocationsNewDarkStore,
  getStoreDataIdDarkStore,
  getCombineFilterWidget,
  getCombineFilterCompetitionWidget,
  getCombineFilterWidgetKW,
  getCombineFilterWidgetSOM,
  getAdditianlCombineFilterWidget,
  getAdditianlCombineFilterWidgetDarkStore

} from '../services/ebux.service';

import { getTabsPlateform } from '../services/saveTabsPlateform.services';
import { getAllTag } from '../services/tag.service';
import { get_consecutive_out_of_stock_products } from '../services/consecutive_out_of_stock_products.service';
import { isEqual } from 'lodash';
import { fetchGlobalViewCombineFiltersPdpKw, getEbuxLocationsGlobalView } from '../ds2.0/global-view/services/service';
import { getBuyBoxSellerType } from '../services/ebuxMaster.service';

const tempBrand = [
  {
    "value": 2,
    "label": "Palmolive"
  },
  {
    "value": 3,
    "label": "Colgate"
  }
];
const tempCategory = [
  {
    "value": 3,
    "label": "Toothpaste"
  },
  {
    "value": 4,
    "label": "Mouthwash"
  },
  {
    "value": 5,
    "label": "Battery Powered Toothbrush & Refill Heads"
  }
];
const tempKeyword = [
  {
    "value": 32,
    "label": "Colgate Toothpaste"
  },
  {
    "value": 33,
    "label": "Colgate"
  },
  {
    "value": 34,
    "label": "Colgate Toothbrush"
  }
];

const optionsDate = [
  { label: "Last 7 days", value: '7' },
  { label: "Last 15 Days", value: '15' },
  { label: "Last 30 Days", value: '30' },
  // { label: "Custom", value: 'custom' },
];
const EbuxContext = createContext();

const { Provider } = EbuxContext;

const defaultOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985',
      },
    },
    formatter: function (params) {
      let tooltipContent = `${params[0].axisValue}<br/>`;
      params.forEach((item) => {
        tooltipContent += `${item.marker} ${item.seriesName}: ${item.data}%<br/>`;
      });
      return tooltipContent;
    },
  },
  legend: {
    data: [],
  },
  toolbox: {
    feature: {
      // saveAsImage: {}
    },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: [],
    },
  ],
  yAxis: [
    {
      type: 'value',
      axisLabel: {
        formatter: '{value}%',
      },
    },
  ],
  series: [],
};
//for colpal
// const defaultUserPlatform = [


//   {
//     "value": 2,
//     "label": "Amazon"
//   },
//   {
//     "value": 29,
//     "label": "Zepto"
//   }
// ];
//end for colpal
//for Nestle
// const defaultUserPlatform = [
//   {
//     "value":1,
//     "label": "Flipkart National"
//   },
//   {
//     "value":2,
//     "label": "Amazon FBA"
//   },
//   {
//     "value":3,
//     "label": "Flipkart Supermart"
//   },
//   {
//     "value":4,
//     "label": "Bigbasket"
//   },
//   {
//     "value":6,
//     "label": "Blinkit"
//   },
//   {
//     "value":7,
//     "label": "Amazon Fresh Ambient"
//   },
//   {
//     "value":10,
//     "label": "1MG"
//   },
//   {
//     "value":17,
//     "label": "Swiggy Instamart"
//   },
//   {
//     "value":18,
//     "label": "Pharmeasy"
//   },
//   {
//     "value":20,
//     "label": "Amazon Fresh Chilled"
//   },
//   {
//     "value":29,
//     "label": "Zepto"
//   },
//   {
//     "value":32,
//     "label": "First Cry"
//   },
//   {
//     "value":34,
//     "label": "Bigbasket Now"
//   }
// ];
//end for Nestle

const kpiMap = {
  "OSA": {
    vKpi: "INSTOCK",
    vTableKPI: "PDP",
    vChart: 'OSA',
    index: 0,
    lable: "On Shelf Availability",
    lableDS3: "Availability",
    link: "/dashboard",
    percentageIcon: "%"
  },
  "SOS": {
    vKpi: "KEYWORD",
    vTableKPI: "KW",
    vChart: 'SOS',
    index: 1,
    lable: "Share Of Search",
    link: "/ebux/reports/share_of_search",
    percentageIcon: "%"
  },

  "OR": {
    vKpi: "RANK",
    vTableKPI: "KW",
    vChart: 'Rank',
    index: 2,
    lable: "Organic Ranking",
    link: "/ebux/reports/organic_ranking",
    percentageIcon: ""
  },
  "CS": {
    vKpi: "PRODUCT",
    vTableKPI: "PDP",
    vChart: 'Content',
    index: 3,
    lable: "Content Score",
    link: "/ebux/reports/content_score",
    percentageIcon: "%"
  },
  "PRO": {
    vKpi: "PRICE",
    vTableKPI: "PDP",
    vChart: 'Promotion',
    index: 4,
    lable: "Promotions",
    link: "/ebux/reports/promotions",
    percentageIcon: "%"
  },
  "RR": {
    vKpi: "REVIEW",
    vTableKPI: "PDP",
    vChart: 'Rating',
    index: 5,
    lable: "Rating & Reviews",
    link: "/ebux/reports/rating_reviews",
    percentageIcon: "",
    platformActive: [1, 2, 3, 4, 7, 10, 18, 32]
  },

  "SOM": {
    vKpi: "SOM",
    vTableKPI: "SOM",
    vChart: 'SOM',
    index: 6,
    lable: "Share Of Merchandise",
    link: "/ebux/reports/share_of_merchandise",
    percentageIcon: "%"
  },
  "SOD": {
    vKpi: "SOD",
    vTableKPI: "SOD",
    vChart: 'SOD',
    index: 6,
    lable: "Share Of Display",
    link: "/ebux/reports/share_of_display",
    percentageIcon: "%"
  }

}
const platformColor = {
  "Amazon": {
    area: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(255, 153, 0, 0.3)' },
        { offset: 1, color: 'rgba(255, 153, 0, 0)' }
      ])
    },
    line: "#FF9900",

  },
  "Zepto": {
    area: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(149, 14, 219, 0.3)' },
        { offset: 1, color: 'rgba(149, 14, 219, 0)' }
      ])
    },
    line: "#950EDB"
  },
  "Flipkart": {
    area: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(0, 129, 247, 0.3)' },
        { offset: 1, color: 'rgba(0, 129, 247, 0)' }
      ])
    },
    line: "#0081F7"
  },
  "Blinkit": {
    area: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(17, 176, 122, 0.3)' },
        { offset: 1, color: 'rgba(17, 176, 122, 0)' }
      ])
    },
    line: "#11B07A"
  },
  "Swiggy Instamart": {
    area: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(133, 24, 83, 0.3)' },
        { offset: 1, color: 'rgba(133, 24, 83, 0)' }
      ])
    },
    line: "#851853"
  },
  "Bigbasket": {
    area: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(166, 206, 57, 0.3)' },
        { offset: 1, color: 'rgba(166, 206, 57, 0)' }
      ])
    },
    line: "#A6CE39"
  },
  "Nykaa": {
    area: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(252, 39, 121, 0.3)' },
        { offset: 1, color: 'rgba(252, 39, 121, 0)' }
      ])
    },
    line: "#FC2779"
  },
  "First Cry": {
    area: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(216, 87, 172, 0.3)' },
        { offset: 1, color: 'rgba(216, 87, 172, 0)' }
      ])
    },
    line: "#D857AC"
  },
  "1MG": {
    area: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(248, 112, 98, 0.3)' },
        { offset: 1, color: 'rgba(248, 112, 98, 0)' }
      ])
    },
    line: "#F87062"
  },
  "Pharmeasy": {
    area: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(15, 128, 126, 0.3)' },
        { offset: 1, color: 'rgba(15, 128, 126, 0)' }
      ])
    },
    line: "#0F807E"
  },
  "Amazon FBA": {
    area: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(198, 119, 0, 0.3)' },
        { offset: 1, color: 'rgba(198, 119, 0, 0)' }
      ])
    },
    line: "#C67700"
  },
  "Amazon Fresh": {
    area: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(117, 185, 31, 0.3)' },
        { offset: 1, color: 'rgba(117, 185, 31, 0)' }
      ])
    },
    line: "#75B91F"
  },
  "Flipkart Supermart": {
    area: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(22, 190, 71, 0.3)' },
        { offset: 1, color: 'rgba(22, 190, 71, 0)' }
      ])
    },
    line: "#16BE47"
  },
  "Bigbasket Now": {
    area: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(166, 206, 57, 0.3)' },
        { offset: 1, color: 'rgba(166, 206, 57, 0)' }
      ])
    },
    line: "#A6CE39"
  },
  "Current": {
    area: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(255, 153, 1, 0.3)' },
        { offset: 1, color: 'rgba(255, 153, 1, 0)' }
      ])
    },
    line: "#FF9901",

  },
  "Previous": {
    area: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(0, 99, 247, 0.3)' },
        { offset: 1, color: 'rgba(0, 99, 247, 0)' }
      ])
    },
    line: "#0063f7",

  }
}




const generateUniqueBaseColors = (count) => {
  // const hueStep = 360 / count; // Evenly spaced hues
  const hueStep = 25; // Evenly spaced hues
  const baseColors = [];
  for (let i = 0; i < count; i++) {
    const hue = (i * hueStep) % 360;
    const saturation = 70; // Fixed saturation for base colors
    const lightness = 50;  // Fixed lightness for base colors
    baseColors.push({ hue, saturation, lightness });
  }
  return baseColors;
};

const generateShadesForColor = (hue, count) => {
  const shades = [];
  const saturationStep = 20 / count; // Vary saturation across shades
  const lightnessStep = 30 / count; // Vary lightness across shades
  for (let i = 0; i < count; i++) {
    const saturation = 70 + (i % 2 === 0 ? -1 : 1) * (i * saturationStep); // Alternate increases/decreases
    const lightness = 50 + (i % 2 === 0 ? 1 : -1) * (i * lightnessStep);
    shades.push({ hue, saturation: Math.min(100, Math.max(0, saturation)), lightness: Math.min(100, Math.max(0, lightness)) });
  }
  return shades;
};
const generateColorsWithShades = (baseCount, shadesPerBase) => {
  const uniqueColors = generateUniqueBaseColors(baseCount);
  const colorsWithShades = uniqueColors.map((baseColor) => {
    const shades = generateShadesForColor(baseColor.hue, shadesPerBase).map((shade) => {
      const baseHex = hslToHex(shade.hue, shade.saturation, shade.lightness);
      const rgbaStart = hexToRgba(baseHex, 0.7);
      const rgbaEnd = hexToRgba(baseHex, 0);

      return {
        area: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: rgbaStart },
            { offset: 1, color: rgbaEnd }
          ])
        },
        line: baseHex
      };
    });
    return shades;
  });
  return colorsWithShades;
};

const hslToHex = (h, s, l) => {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  return `#${[f(0), f(8), f(4)].map((x) => Math.round(x * 255).toString(16).padStart(2, "0")).join("")}`;

}
const hexToRgba = (hex, alpha) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// const uniqueColorsMap1 = generateUniqueColors(50);
//const uniqueColorsMap = generateColorsWithShades(100,50);

export const EbuxProvider = (props) => {

  const lastActiveWeek = useMemo(() => {
    const todayM = moment().startOf('day');

    // Last completed ISO week
    const lastWeekMonday = todayM.clone().startOf("isoWeek").subtract(1, "week").startOf('day');
    const lastWeekSunday = lastWeekMonday.clone().endOf("isoWeek").endOf('day');

    return {
      weekOfYear: lastWeekMonday.isoWeek(),
      year: lastWeekMonday.isoWeekYear(),
      start: lastWeekMonday.startOf('day').format("YYYY-MM-DD"),
      end: lastWeekSunday.endOf('day').format("YYYY-MM-DD"),
    };
  }, []);

  const useKpiRef = useRef();
  const useKpiTypeRef = useRef();




  const [clientCustomizeColumnsComprehensiveBreakdown, setClientCustomizeColumnsComprehensiveBreakdown] = useState({});
  const [brandSearchValue, setBrandSearchValue] = useState("");
  const getAveragePercentage = (data = []) => {
    const sum = data?.reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue), 0);
    return (((sum / (data?.length * 100)) * 100).toFixed(2));
  }

  const [averagePercentageData, setAveragePercentageData] = useState({});
  const [percentageIcon, setPercentageIcon] = useState("");
  const [kpi, setKpi] = useState("");
  const [loading, setLoading] = useState(false);
  const [filtersLoading, setFiltersLoading] = useState(true);
  const [loadingReport, setLoadingReport] = useState(false);
  const [error, setError] = useState(null);

  // const [selectedWeeksForTrendAnalysis, setSelectedWeeksForTrendAnalysis] = useState();
  const [filters, setFilters] = useState({
    platform: [],
    unsubscribedPlatforms: [],
    brand: [],
    category: [],
    keywordCategory: [],
    keywordType: [],
    location: [],
    locationPincode: [],
    darkstore: [],
    darkstore_id: [],


    products: [],
    keyword: [],
    category_som: [],
    category_node: {},
    date: [...optionsDate]
  });


  const [activeClientProject, setActiveClientProject] = useState(JSON.parse(localStorage.getItem("active_client_project")) || {});
  let isUseWidget = useMemo(() => {
    if (activeClientProject?.isUseWidget) {
      return true;
    } else {
      return false;
    }
  }, [activeClientProject]);

  const [filtersDarkStore, setFiltersDarkStore] = useState({ tab_type: (([2].indexOf(activeClientProject?.client_project_id) > -1) && isUseWidget) ? 'trend_analysis' : 'executive_summary' });

  // const [selectedPlatform, setSelectedPlatform] = useState([]);
  const max_date = activeClientProject?.maxDate ? new Date(activeClientProject?.maxDate) : new Date(moment().subtract(1, "days").format("YYYY-MM-DD"));
  const isCompareToPrevious = false;
  const lastDays = (optionsDate?.[0]?.value ?? 7) - 1;
  const endDate = moment(max_date).format("YYYY-MM-DD");
  const startDate = moment(endDate).subtract(lastDays, "days").format("YYYY-MM-DD");
  const previousEndDate = moment(startDate).subtract(1, "days").format("YYYY-MM-DD");
  const previousStartDate = moment(previousEndDate).subtract(lastDays, "days").format("YYYY-MM-DD");
  const [sortPlatforms, setsortPlatforms] = useState([])

  const [selectedMsl, setSelectedMsl] = useState("all");
  const [selectedFilters, setSelectedFilters] = useState({
    selectedKpi: "",
    selectedPlatform: [],
    selectedBrand: [],
    selectedCategory: [],
    selectedKeywordCategory: [],
    selectedKeywordType: [],
    selectedLocation: [],
    selectedDarkstore: [],
    selectedMsl: "all",
    selected_sos_option: "blended_sos",
    selected_sos_type: "overall",
    // selectedDarkstoreID:[],
    selectedProductId: [],
    selectedKeyword: [],
    selectedDate: [optionsDate[0]],
    selectedOSARemarks: [],
    selectedCategory_node: [],
    selectedCategory_som: [],
    selectedBrandSOM: [],
    selectCategory_node: [],


    selectedDateRange: {
      isCompareToPrevious,
      endDate,
      startDate,
      previousEndDate,
      previousStartDate
    },
    calendarType: activeClientProject?.calendarType ?? "date",//??"week",
    selectedWeeks: {
      current: [lastActiveWeek],
      compare: [lastActiveWeek],
      isCompareToPrevious
    }
  });
  const [selectedFiltersDarkStore, setSelectedFiltersDarkStore] = useState({})
  const [selectedFiltersWidget, setSelectedFiltersWidget] = useState({})
  const [enabledKPIs, setEnabledKPIs] = useState({});

  //alert states
  const [alertSearch, setAlertSearch] = useState("");
  const [alertSort, setAlertSort] = useState("");

  const defaultAlertFilters = {
    status: [],
    entityType: "",
    conditions: [],
    conditionCategory: "",
    lastTriggered: [],
    createdBy: [],
    scheduling: {
      nextRun: [],
      frequency: []
    },
    dateFilter: {
      createdFrom: "",
      createdTo: "",
      updatedFrom: "",
      updatedTo: "",
      triggeredFrom: "",
      triggeredTo: ""
    }
  };

  const [alertFilters, setAlertFilters] = useState(defaultAlertFilters);



  const updateSelectedFilters = (key, value) => {
    if (isUseWidget) {
      // console.log('sdsdsdss',key)
      setSelectedFiltersWidget(prevFilters => ({
        ...prevFilters,
        [key]: value
      }));
    } else {
      setSelectedFilters(prevFilters => ({
        ...prevFilters,
        [key]: value
      }));
    }
  }


  // const uniqueColorsMap1 = generateUniqueColors(50);
  const uniqueColorsMap = generateColorsWithShades(100, 50);











  const savePlatformPositions = (data) => {
    const platformPosition = data?.map((item, index) => ({
      value: item.value,
      position: index + 1
    }));
    localStorage.setItem("platformPosition", JSON.stringify(platformPosition));

  };
  const loadAndRearrangePlatformPositions = (data, storedPlatformPosition) => {

    const rearrangedArray = storedPlatformPosition
      .map(posItem => data.find(item => item.value === posItem.value))
      .filter(item => item !== undefined);

    const newItems = data.filter(item =>
      !storedPlatformPosition.some(posItem => posItem.value === item.value)
    );

    const finalArray = [...rearrangedArray, ...newItems];

    savePlatformPositions(newItems);
    return finalArray;

  };
  const getKeywordsfromKeywordIfWithKeywordType = (res_keyword) => {
    let keywords = [];
    if (res_keyword?.length) {
      res_keyword.forEach((keyword) => {
        if (Array.isArray(keyword?.keywords)) {
          keywords.push(...keyword.keywords);
        } else {
          keywords.push(keyword);
        }
      })
    }
    return keywords;
  }
  const getSubCategoryfromCategory = (res_category) => {
    let categories = [];
    if (res_category?.length) {
      res_category.forEach((category) => {
        if (Array.isArray(category?.sub_categories)) {
          categories.push(...category.sub_categories);
        } else {
          categories.push(category);
        }
      })
    }
    return categories;
  }
  const getSubBrandfromBrand = (res_brand) => {
    let brands = [];
    if (Array.isArray(res_brand)) {
      res_brand.forEach((brand) => {
        if (Array.isArray(brand?.sub_brands)) {
          brands.push(...brand.sub_brands);
        } else {
          brands.push(brand);
        }
      });
    }
    return brands;
  }


  const getPincodesfromLocation = (res_location) => {
    let location = [];
    if (res_location?.length) {
      res_location.forEach((city) => {
        location.push(...city.pincodes);
      })
    }
    return location;
  }
  const getDarkstorefromDarkstoreLocation = (res_darkstore) => {
    let store = [];
    if (res_darkstore?.length) {
      res_darkstore.forEach((zone) => {
        if (zone?.city?.length) {
          zone?.city?.forEach((city) => {

            store.push(...(city?.darkstore_id ?? []));
          })
        }
      })
    }
    return store;
  }


  // const isClientColpal=()=>{
  //     const activeClientProject = 
  //            JSON.parse(localStorage.getItem("active_client_project") || "{}");

  //            //console.log("chekingkdata",activeClientProject);
  //       if(activeClientProject?.client_project_name==='ColPal'){
  //         return true
  //       }



  //       return false


  // }


  const [mainApiResponse, setMainApiResponse] = useState({});

  // const initFitersLoad = async (kpiPlatform, _kpi) => {
  //   const activeClientProject = JSON.parse(localStorage.getItem("active_client_project")) || {};

  //   const _enabledKPIs = activeClientProject.kpi || {};
  //   setEnabledKPIs(_enabledKPIs)
  //   let all_columns = await getEbuxClientCustomizeColumnsComprehensiveBreakdown();
  //   setClientCustomizeColumnsComprehensiveBreakdown(all_columns);
  //   const res_osa_remarks = await getEbuxOSARemarks()
  //   let res_platform = await getEbuxPlatforms(_kpi, kpiPlatform.map((i) => i?.value ?? ''));
  //   let res_platform_pdp = await getEbuxPlatforms("OSA", []);
  //   let res_platform_kw = await getEbuxPlatforms("SOS", []);








  //   const res_unsubscribed_platform = await getEbuxUserUnsubscribedPlatforms(_kpi, kpiPlatform.map((i) => i?.value ?? ''));
  //   const res_brand = await getEbuxBrands(_kpi);
  //   const res_brand_pdp = await getEbuxBrands("OSA");
  //   const res_brand_kw = await getEbuxBrands("SOS");

  //   const res_location_new = await getEbuxLocationsNew(_kpi, (res_platform?.map(i => i.value) ?? []));
  //   const res_location_new_pdp = await getEbuxLocationsNew("OSA", (res_platform_pdp?.map(i => i.value) ?? []));
  //   const res_location_new_kw = await getEbuxLocationsNew("SOS", (res_platform_kw?.map(i => i.value) ?? []));

  //   const res_darkstore = await getEbuxDarkstoreLocation(_kpi, (res_platform?.map(i => i.value) ?? []));
  //   const res_competition_brand = await getEbuxCompetitionBrands(_kpi);
  //   let res_category = [], res_products = [], res_sub_category = [], sub_Categories = [];

  //   const sub_brands = getSubBrandfromBrand(res_brand);
  //   const sub_brands_kw = getSubBrandfromBrand(res_brand_kw);
  //   const sub_brands_pdp = getSubBrandfromBrand(res_brand_pdp);


  //   if ((_enabledKPIs?.["OSA"] || _enabledKPIs?.["PRO"] || _enabledKPIs?.["CS"] || _enabledKPIs?.["RR"]) && (_kpi == "OSA" || _kpi == "PRO" || _kpi == "CS" || _kpi == "RR" || _kpi == "SOD")) {
  //     res_category = await getEbuxCategories((res_platform?.map(i => i.value) ?? []), (sub_brands?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
  //     res_sub_category = await getEbuxSubCategories((res_platform?.map(i => i.value) ?? []), (sub_brands?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
  //     sub_Categories = getSubCategoryfromCategory(res_category);
  //     res_products = await getEbuxProducts((res_platform?.map(i => i.value) ?? []), (sub_brands?.flatMap(i => i?.brand_id ?? i?.value) ?? []), (sub_Categories?.flatMap(i => i?.nielsen_id ?? i?.value) ?? []));
  //   } else {
  //     res_category = await getEbuxCategories((res_platform_pdp?.map(i => i.value) ?? []), (sub_brands_pdp?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
  //     sub_Categories = getSubCategoryfromCategory(res_category);
  //     res_products = await getEbuxProducts((res_platform_pdp?.map(i => i.value) ?? []), (sub_brands_pdp?.flatMap(i => i?.brand_id ?? i?.value) ?? []), (sub_Categories?.flatMap(i => i?.nielsen_id ?? i?.value) ?? []));
  //   }

  //   let res_keyword = [], res_keyword_category = [], res_keyword_type = [], _keywords = [], keyword_sub_Categories = [];
  //   if ((_enabledKPIs?.["SOS"] || _enabledKPIs?.["OR"]) && (_kpi == "SOS" || _kpi == "OR")) {
  //     res_keyword = await getEbuxKeywords((res_platform?.map(i => i.value) ?? []), (sub_brands?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
  //     _keywords = getKeywordsfromKeywordIfWithKeywordType(res_keyword);

  //     res_keyword_category = await getEbuxKeywordCategories((res_platform?.map(i => i.value) ?? []), (sub_brands?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
  //     keyword_sub_Categories = getSubCategoryfromCategory(res_keyword_category);
  //     res_keyword_type = await getEbuxKeywordType((res_platform?.map(i => i.value) ?? []), (sub_brands?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
  //   } else {
  //     res_keyword = await getEbuxKeywords((res_platform_kw?.map(i => i.value) ?? []), (sub_brands_kw?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
  //     _keywords = getKeywordsfromKeywordIfWithKeywordType(res_keyword);

  //     res_keyword_category = await getEbuxKeywordCategories((res_platform_kw?.map(i => i.value) ?? []), (sub_brands_kw?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
  //     keyword_sub_Categories = getSubCategoryfromCategory(res_keyword_category);
  //     res_keyword_type = await getEbuxKeywordType((res_platform_kw?.map(i => i.value) ?? []), (sub_brands_kw?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
  //   }
  //   let res_sod_display_ad_type = [], res_sod_page_location = [];
  //   if (_enabledKPIs?.["SOD"]) {
  //     res_sod_display_ad_type = await getEbuxSODDisplayAdType();
  //     res_sod_page_location = await getEbuxSODPageLocation();
  //   }

  //   const location = getPincodesfromLocation(res_location_new);
  //   const location_pdp = getPincodesfromLocation(res_location_new_pdp);
  //   const location_kw = getPincodesfromLocation(res_location_new_kw);

  //   const darkstore = getDarkstorefromDarkstoreLocation(res_darkstore);


  //   setFilters((prevFilters) => {
  //     const updatedFilters = {
  //       ...prevFilters,
  //       unsubscribedPlatforms: res_unsubscribed_platform ?? [],
  //       platform: res_platform ?? [],
  //       brand: res_brand ?? [],
  //       competition_brand: res_competition_brand ?? [],
  //       category: res_category ?? [],
  //       sub_category: res_sub_category ?? [],
  //       location: res_location_new ?? [],
  //       locationPincode: location ?? [],
  //       darkstore: res_darkstore ?? [],
  //       darkstore_id: darkstore ?? [],
  //       products: res_products ?? [],
  //       keywordCategory: res_keyword_category ?? [],
  //       keywordType: res_keyword_type ?? [],
  //       keyword: res_keyword ?? [],
  //       osa_remarks: res_osa_remarks ?? [],
  //       sod_display_ad_type: res_sod_display_ad_type ?? [],
  //       sod_page_location: res_sod_page_location ?? [],
  //     };
  //     setSelectedFilters(prevSelectedFilters => ({
  //       ...prevSelectedFilters,
  //       selectedPlatform: res_platform ?? [],
  //       selectedPlatformPdp: res_platform_pdp ?? [],
  //       selectedPlatformKw: res_platform_kw ?? [],
  //       selectedBrand: sub_brands ?? [],
  //       selectedBrandPdp: sub_brands_pdp ?? [],
  //       selectedBrandKw: sub_brands_kw ?? [],
  //       // selectedBrand_init: sub_brands ?? [],
  //       selectedCategory: sub_Categories ?? [],
  //       // selectedCategory_init: sub_Categories ?? [],
  //       selectedSubCategory: res_sub_category ?? [],
  //       // selectedSubCategory_init: res_sub_category ?? [],

  //       selectedProductId: res_products ?? [],
  //       selectedLocation: location ?? [],
  //       selectedLocationPdp: location_pdp ?? [],
  //       selectedLocationKw: location_kw ?? [],
  //       // selectedLocationpincode: location ?? [],
  //       selectedDarkstore: darkstore ?? [],
  //       // selectedDarkstoreID: darkstore ?? [],
  //       selectedKeyword: _keywords ?? [],
  //       // selectedKeyword_init: _keywords ?? [],
  //       selectedKeywordCategory: keyword_sub_Categories ?? [],
  //       // selectedKeywordCategory_init: keyword_sub_Categories ?? [],
  //       selectedKeywordType: res_keyword_type ?? [],
  //       selectedOSARemarks: res_osa_remarks ?? []

  //     }));
  //     return updatedFilters;
  //   });
  //   return true;
  // }


  const [tagList, setTagList] = useState([]);

  const initFitersLoad = async (_kpi, kpiType = "pdp", firstTimeLoad = true) => {
    console.log('firstTimeLoadfirstTimeLoad', firstTimeLoad)
    const _activeClientProject = JSON.parse(localStorage.getItem("active_client_project")) || {};
    setActiveClientProject(_activeClientProject);

    const _enabledKPIs = _activeClientProject.kpi || {};
    setEnabledKPIs(_enabledKPIs)
    let all_columns = await getEbuxClientCustomizeColumnsComprehensiveBreakdown();
    setClientCustomizeColumnsComprehensiveBreakdown(all_columns);


    let res_osa_remarks = [], darkstore = [], location = [], sub_brands = [], res_platform = [], res_unsubscribed_platform = [], res_brand = [], res_location_new = [], res_darkstore = [], res_competition_brand = [];
    let res_category = [], res_mother_pack = [], res_products = [], res_sub_category = [], sub_Categories = [], res_product_ppg = [];
    let res_keyword = [], res_keyword_category = [], res_keyword_type = [], _keywords = [], keyword_sub_Categories = [];
    let res_sod_display_ad_type = [], res_sod_page_location = []; let category_node = []
    let category_som

    const apiResponse = { ...mainApiResponse };
    if (firstTimeLoad) {

      const _tagList = await getAllTag();
      setTagList(_tagList);

      apiResponse.res_osa_remarks = await getEbuxOSARemarks();

      // let res_platform = await getEbuxPlatforms(_kpi, kpiPlatform.map((i) => i?.value ?? ''));
      apiResponse.res_platform_pdp = await getEbuxPlatforms("OSA", []);
      apiResponse.res_platform_kw = await getEbuxPlatforms("SOS", []);

      // const res_unsubscribed_platform = await getEbuxUserUnsubscribedPlatforms(_kpi, kpiPlatform.map((i) => i?.value ?? ''));
      apiResponse.res_unsubscribed_platform_pdp = await getEbuxUserUnsubscribedPlatforms("OSA", []);
      apiResponse.res_unsubscribed_platform_kw = await getEbuxUserUnsubscribedPlatforms("SOS", []);

      // const res_brand = await getEbuxBrands(_kpi);
      apiResponse.res_brand_pdp = await getEbuxBrands("OSA");
      apiResponse.res_brand_kw = await getEbuxBrands("SOS");
      apiResponse.res_brand_som = await getEbuxBrands("SOM");


      // const res_location_new = await getEbuxLocationsNew(_kpi, (res_platform?.map(i => i.value) ?? []));
      apiResponse.res_location_new_pdp = await getEbuxLocationsNew("OSA", (apiResponse.res_platform_pdp?.map(i => i.value) ?? []));
      apiResponse.res_location_new_kw = await getEbuxLocationsNew("SOS", (apiResponse.res_platform_kw?.map(i => i.value) ?? []));
      // const location = getPincodesfromLocation(res_location_new);
      apiResponse.location_pdp = getPincodesfromLocation(apiResponse.res_location_new_pdp);
      apiResponse.location_kw = getPincodesfromLocation(apiResponse.res_location_new_kw);



      // const res_darkstore = await getEbuxDarkstoreLocation(_kpi, (res_platform?.map(i => i.value) ?? []));
      apiResponse.res_darkstore_kw = await getEbuxDarkstoreLocation("SOS", (apiResponse.res_platform_kw?.map(i => i.value) ?? []));
      apiResponse.res_darkstore_pdp = await getEbuxDarkstoreLocation("OSA", (apiResponse.res_platform_pdp?.map(i => i.value) ?? []));
      // const res_competition_brand = await getEbuxCompetitionBrands(_kpi);
      apiResponse.res_competition_brand_kw = await getEbuxCompetitionBrands("SOS");
      apiResponse.res_competition_brand_pdp = await getEbuxCompetitionBrands("OSA");


      // const sub_brands = getSubBrandfromBrand(res_brand);
      apiResponse.sub_brands_kw = getSubBrandfromBrand(apiResponse.res_brand_kw);
      apiResponse.sub_brands_pdp = getSubBrandfromBrand(apiResponse.res_brand_pdp);



      // const darkstore = getDarkstorefromDarkstoreLocation(res_darkstore);
      apiResponse.darkstore_pdp = getDarkstorefromDarkstoreLocation(apiResponse.res_darkstore_pdp);
      apiResponse.darkstore_kw = getDarkstorefromDarkstoreLocation(apiResponse.res_darkstore_kw);



      // if ((_enabledKPIs?.["OSA"] || _enabledKPIs?.["PRO"] || _enabledKPIs?.["CS"] || _enabledKPIs?.["RR"]) && (_kpi == "OSA" || _kpi == "PRO" || _kpi == "CS" || _kpi == "RR" || _kpi == "SOD")) {
      //   res_category = await getEbuxCategories((res_platform?.map(i => i.value) ?? []), (sub_brands?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
      //   res_sub_category = await getEbuxSubCategories((res_platform?.map(i => i.value) ?? []), (sub_brands?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
      //   sub_Categories = getSubCategoryfromCategory(res_category);
      //   res_products = await getEbuxProducts((res_platform?.map(i => i.value) ?? []), (sub_brands?.flatMap(i => i?.brand_id ?? i?.value) ?? []), (sub_Categories?.flatMap(i => i?.nielsen_id ?? i?.value) ?? []));
      // } else {
      //   res_category = await getEbuxCategories((apiResponse.res_platform_pdp?.map(i => i.value) ?? []), (apiResponse.sub_brands_pdp?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
      //   sub_Categories = getSubCategoryfromCategory(res_category);
      //   res_products = await getEbuxProducts((apiResponse.res_platform_pdp?.map(i => i.value) ?? []), (apiResponse.sub_brands_pdp?.flatMap(i => i?.brand_id ?? i?.value) ?? []), (sub_Categories?.flatMap(i => i?.nielsen_id ?? i?.value) ?? []));
      // }
      if ((_enabledKPIs?.["OSA"] || _enabledKPIs?.["PRO"] || _enabledKPIs?.["CS"] || _enabledKPIs?.["RR"])) {
        apiResponse.res_category = await getEbuxCategories((apiResponse.res_platform_pdp?.map(i => i.value) ?? []), (apiResponse.sub_brands_pdp?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
        apiResponse.res_sub_category = await getEbuxSubCategories((apiResponse.res_platform_pdp?.map(i => i.value) ?? []), (apiResponse.sub_brands_pdp?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
        apiResponse.sub_Categories = getSubCategoryfromCategory(apiResponse.res_category);
        if (_activeClientProject?.client_project_id == 10) {
          apiResponse.res_product_ppg = await getEbuxColPalMtPpg((apiResponse.res_platform_pdp?.map(i => i.value) ?? []), (apiResponse.sub_brands_pdp?.flatMap(i => i?.sub_brand) ?? []), (apiResponse.sub_Categories?.flatMap(i => i?.nielsen_id ?? i?.value) ?? []));
          apiResponse.res_products = await getEbuxProducts((apiResponse.res_platform_pdp?.map(i => i.value) ?? []), (apiResponse.sub_brands_pdp?.flatMap(i => i?.sub_brand) ?? []), (apiResponse.sub_Categories?.flatMap(i => i?.nielsen_id ?? i?.value) ?? []), selectedMsl, [], (apiResponse.res_product_ppg?.map(i => i.value) ?? []));
        } else {
          apiResponse.res_mother_pack = await getEbuxMotherPack((apiResponse.res_platform_pdp?.map(i => i.value) ?? []), (apiResponse.sub_brands_pdp?.flatMap(i => i?.brand_id ?? i?.value) ?? []), (apiResponse.sub_Categories?.flatMap(i => i?.nielsen_id ?? i?.value) ?? []));
          apiResponse.res_products = await getEbuxProducts((apiResponse.res_platform_pdp?.map(i => i.value) ?? []), (apiResponse.sub_brands_pdp?.flatMap(i => i?.brand_id ?? i?.value) ?? []), (apiResponse.sub_Categories?.flatMap(i => i?.nielsen_id ?? i?.value) ?? []), selectedMsl, (apiResponse.res_mother_pack?.map(i => i.value) ?? []));
        }
      }

      if (_enabledKPIs?.["SOM"]) {

        apiResponse.category_som = await getKeywordCategorySom((apiResponse.res_platform_pdp?.map(i => i.value) ?? []))
        apiResponse.res_sub_category = apiResponse.category_som
        apiResponse.category_node = await getCategory_node((apiResponse.res_platform_pdp?.map(i => i.value) ?? []))
        console.log('apiResponse.category_som', apiResponse.category_som)
      }


      // if ((_enabledKPIs?.["SOS"] || _enabledKPIs?.["OR"]) && (_kpi == "SOS" || _kpi == "OR")) {
      //   res_keyword = await getEbuxKeywords((res_platform?.map(i => i.value) ?? []), (sub_brands?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
      //   _keywords = getKeywordsfromKeywordIfWithKeywordType(res_keyword);

      //   res_keyword_category = await getEbuxKeywordCategories((res_platform?.map(i => i.value) ?? []), (sub_brands?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
      //   keyword_sub_Categories = getSubCategoryfromCategory(res_keyword_category);
      //   res_keyword_type = await getEbuxKeywordType((res_platform?.map(i => i.value) ?? []), (sub_brands?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
      // } else {
      //   res_keyword = await getEbuxKeywords((res_platform_kw?.map(i => i.value) ?? []), (sub_brands_kw?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
      //   _keywords = getKeywordsfromKeywordIfWithKeywordType(res_keyword);

      //   res_keyword_category = await getEbuxKeywordCategories((res_platform_kw?.map(i => i.value) ?? []), (sub_brands_kw?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
      //   keyword_sub_Categories = getSubCategoryfromCategory(res_keyword_category);
      //   res_keyword_type = await getEbuxKeywordType((res_platform_kw?.map(i => i.value) ?? []), (sub_brands_kw?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
      // }
      if ((_enabledKPIs?.["SOS"] || _enabledKPIs?.["OR"])) {

        apiResponse.res_keyword = await getEbuxKeywords((apiResponse.res_platform_kw?.map(i => i.value) ?? []), (apiResponse.sub_brands_kw?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
        apiResponse._keywords = getKeywordsfromKeywordIfWithKeywordType(apiResponse.res_keyword);

        apiResponse.res_keyword_category = await getEbuxKeywordCategories((apiResponse.res_platform_kw?.map(i => i.value) ?? []), (apiResponse.sub_brands_kw?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
        apiResponse.keyword_sub_Categories = getSubCategoryfromCategory(apiResponse.res_keyword_category);
        apiResponse.res_keyword_type = await getEbuxKeywordType((apiResponse.res_platform_kw?.map(i => i.value) ?? []), (apiResponse.sub_brands_kw?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
      }

      if (_enabledKPIs?.["SOD"]) {
        apiResponse.res_sod_display_ad_type = await getEbuxSODDisplayAdType();
        apiResponse.res_sod_page_location = await getEbuxSODPageLocation();
      }

      setMainApiResponse(apiResponse);
    }


    res_osa_remarks = apiResponse?.res_osa_remarks;//pdp
    res_category = apiResponse?.res_category;//pdp
    res_sub_category = apiResponse?.res_sub_category;//pdp
    sub_Categories = apiResponse?.sub_Categories;//pdp
    res_products = apiResponse?.res_products;//pdp
    res_mother_pack = apiResponse?.res_mother_pack;//pdp

    res_keyword = apiResponse?.res_keyword;//kw
    _keywords = apiResponse?._keywords;//kw
    res_keyword_category = apiResponse?.res_keyword_category;//kw
    keyword_sub_Categories = apiResponse?.keyword_sub_Categories;//kw
    res_keyword_type = apiResponse?.res_keyword_type;//kw


    res_sod_display_ad_type = apiResponse?.res_sod_display_ad_type;//sod
    res_sod_page_location = apiResponse?.res_sod_page_location;//sod


    if (kpiType == "kw") {
      res_platform = apiResponse?.res_platform_kw;
      res_unsubscribed_platform = apiResponse?.res_unsubscribed_platform_kw;
      res_brand = apiResponse?.res_brand_kw;
      res_location_new = apiResponse?.res_location_new_kw;
      res_darkstore = apiResponse?.res_darkstore_kw;
      res_competition_brand = apiResponse?.res_competition_brand_kw;
      sub_brands = apiResponse?.sub_brands_kw;
      location = apiResponse?.location_kw;
      darkstore = apiResponse?.darkstore_kw;
    } else if (kpiType == "SOM") {
      res_platform = apiResponse?.res_platform_pdp;
      res_unsubscribed_platform = apiResponse?.res_unsubscribed_platform_kw;
      res_brand = apiResponse?.res_brand_som;
      sub_brands = apiResponse?.res_brand_som;
      category_som = apiResponse?.category_som
      category_node = apiResponse?.category_node;
      res_sub_category = category_som;//pdp
    } else {
      res_platform = apiResponse?.res_platform_pdp;
      res_unsubscribed_platform = apiResponse?.res_unsubscribed_platform_pdp;
      res_brand = apiResponse?.res_brand_pdp;
      res_location_new = apiResponse?.res_location_new_pdp;
      res_darkstore = apiResponse?.res_darkstore_pdp;
      res_competition_brand = apiResponse?.res_competition_brand_pdp;
      sub_brands = apiResponse?.sub_brands_pdp;
      location = apiResponse?.location_pdp;
      darkstore = apiResponse?.darkstore_pdp;
      res_product_ppg = apiResponse?.res_product_ppg ?? [];//pdp
    }

    setFilters((prevFilters) => {
      const updatedFilters = {
        ...prevFilters,
        unsubscribedPlatforms: res_unsubscribed_platform ?? [],
        platform: res_platform ?? [],
        brand: res_brand ?? [],
        competition_brand: res_competition_brand ?? [],
        category: res_category ?? [],
        sub_category: res_sub_category ?? [],
        location: res_location_new ?? [],
        locationPincode: location ?? [],
        darkstore: res_darkstore ?? [],
        darkstore_id: darkstore ?? [],
        products: res_products ?? [],
        mother_pack: res_mother_pack ?? [],
        keywordCategory: res_keyword_category ?? [],
        keywordType: res_keyword_type ?? [],
        keyword: res_keyword ?? [],
        osa_remarks: res_osa_remarks ?? [],
        sod_display_ad_type: res_sod_display_ad_type ?? [],
        sod_page_location: res_sod_page_location ?? [],
        category_som: category_som ?? [],
        category_node: category_node ?? [],
        product_ppg: res_product_ppg ?? [],
      };

      setSelectedFilters(prevSelectedFilters => ({
        ...prevSelectedFilters,
        selectedPlatform: res_platform ?? [],
        selectedPlatformPdp: apiResponse?.res_platform_pdp ?? [],
        selectedPlatformKw: apiResponse?.res_platform_kw ?? [],
        selectedBrand: sub_brands ?? [],
        selectedBrandPdp: apiResponse?.sub_brands_pdp ?? [],
        selectedBrandKw: apiResponse?.sub_brands_kw ?? [],
        selectedBrandSOM: apiResponse?.res_brand_som ?? [],
        // selectedBrand_init: sub_brands ?? [],
        selectedCategory: sub_Categories ?? [],
        // selectedCategory_init: sub_Categories ?? [],
        selectedSubCategory: res_sub_category ?? [],
        // selectedSubCategory_init: res_sub_category ?? [],

        selectedProductId: res_products ?? [],
        selectedMotherPack: res_mother_pack ?? [],
        selectedLocation: location ?? [],
        selectedLocationPdp: apiResponse?.location_pdp ?? [],
        selectedLocationKw: apiResponse?.location_kw ?? [],
        // selectedLocationpincode: location ?? [],
        selectedDarkstore: darkstore ?? [],
        // selectedDarkstoreID: darkstore ?? [],
        selectedKeyword: _keywords ?? [],
        // selectedKeyword_init: _keywords ?? [],
        selectedKeywordCategory: keyword_sub_Categories ?? [],
        // selectedKeywordCategory_init: keyword_sub_Categories ?? [],
        selectedKeywordType: res_keyword_type ?? [],
        selectedOSARemarks: res_osa_remarks ?? [],
        selectCategory_som: category_som ?? [],
        selectCategory_node: category_node ?? [],

        selectedProduct_ppg: res_product_ppg ?? [],
        calendarType: _activeClientProject?.calendarType ?? "date",//??"week",



      }));


      return updatedFilters;
    });
    return true;
  }

  const [isDarkstoreFilter, setIsDarkstoreFilter] = useState(null);
  const consecutive_out_of_stock_products_payload_ref = useRef("");
  const initFitersLoadWidget = async (_kpi, kpiType = "pdp", firstTimeLoad = true) => {
    console.log('widget called')
    const _activeClientProject = JSON.parse(localStorage.getItem("active_client_project")) || {};
    setActiveClientProject(_activeClientProject);

    const _enabledKPIs = _activeClientProject.kpi || {};
    setEnabledKPIs(_enabledKPIs)
    let all_columns = await getEbuxClientCustomizeColumnsComprehensiveBreakdown();
    setClientCustomizeColumnsComprehensiveBreakdown(all_columns);


    let res_osa_remarks = [], darkstore = [], location = [], res_platform = [], res_unsubscribed_platform = [], res_brand = [], res_brand_competition = [], res_location_new = [], res_darkstore = [], res_competition_brand = [];
    let res_category = [], res_mother_pack = [], res_products = [], res_products_competition = [], res_sub_category = [], res_product_ppg = [];
    let res_keyword = [], res_keyword_category = [], res_keyword_type = [];
    let res_sod_display_ad_type = [], res_sod_page_location = []; let category_node = []
    let category_som, segmentData = [], dynamicPData = [], staticPData = [], subBrandData = [], issueNonIssueData = [], pdpGradeData = [], marketData = [], marketDataKw = [], statusData = [], productTypeData = [];
    const apiResponse = { ...mainApiResponse };
    if (firstTimeLoad) {
      const _tagList = await getAllTag();
      setTagList(_tagList);

      apiResponse.res_osa_remarks = await getEbuxOSARemarks();
      // let res_platform = await getEbuxPlatforms(_kpi, kpiPlatform.map((i) => i?.value ?? ''));

      let combineFilterWidget = {};
      let combineFilterCompetitionWidget = {};
      if (_activeClientProject?.isFilterDateWise) {
        const dateRangeData = { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks };
        combineFilterWidget = await getCombineFilterWidget("OSA", [], [], [], [], [], "all", [], dateRangeData);
        combineFilterCompetitionWidget = await getCombineFilterCompetitionWidget("OSA", [], [], [], [], [], "all", [], dateRangeData);
      } else {
        combineFilterWidget = await getCombineFilterWidget("OSA", []);
      }
      let combineFilterWidgetKW = await getCombineFilterWidgetKW("SOS", []);
      let combineFilterWidgetSOM = await getCombineFilterWidgetSOM("SOM", []);
      if (([2, 101, 102, 103].indexOf(_activeClientProject?.client_project_id) > -1) || activeClientProject?.useCombineFilter) {
        apiResponse.res_platform_pdp = combineFilterWidget?.platforms ?? [];
        apiResponse.res_platform_kw = combineFilterWidgetKW?.platforms ?? [];
        apiResponse.res_platform_som = combineFilterWidgetSOM?.platforms ?? [];
      } else {
        apiResponse.res_platform_pdp = await getEbuxPlatforms("OSA", []);
        apiResponse.res_platform_kw = await getEbuxPlatforms("SOS", []);
        apiResponse.res_platform_som = apiResponse.res_platform_pdp;
      }

      if (_activeClientProject?.client_project_id == 1) {
        // if (_kpi != 'SOS' || kpi != "OR") {
        const { segments, dynamic_p, static_p, sub_brands, status, market, marketKw, pdpGrade, issueNonIssue, product_type } = await getAdditianlCombineFilterWidget("OSA", []);
        apiResponse.segmentData = segments;
        apiResponse.dynamicPData = dynamic_p;
        apiResponse.staticPData = static_p;
        apiResponse.subBrandData = sub_brands;
        apiResponse.issueNonIssueData = issueNonIssue;
        apiResponse.pdpGradeData = pdpGrade;
        apiResponse.marketData = market;
        apiResponse.statusData = status;
        apiResponse.marketDataKw = marketKw;
        apiResponse.productTypeData = product_type;
        // }
        // else {
        //   const { market } = await getAdditianlCombineFilterWidgetKw("SOS", []);
        //   apiResponse.marketDataKw = market;
        // }
      }


      if (!activeClientProject?.useCombineFilter) {
        // const res_unsubscribed_platform = await getEbuxUserUnsubscribedPlatforms(_kpi, kpiPlatform.map((i) => i?.value ?? ''));
        apiResponse.res_unsubscribed_platform_pdp = await getEbuxUserUnsubscribedPlatforms("OSA", []);
        apiResponse.res_unsubscribed_platform_kw = await getEbuxUserUnsubscribedPlatforms("SOS", []);
      }

      // const res_brand = await getEbuxBrands(_kpi);
      if (([2, 101, 102, 103].indexOf(_activeClientProject?.client_project_id) > -1) || activeClientProject?.useCombineFilter) {
        apiResponse.res_brand_pdp = combineFilterWidget?.brands ?? [];
        apiResponse.res_brand_kw = combineFilterWidgetKW?.brands ?? [];
        apiResponse.res_brand_pdp_competition = combineFilterCompetitionWidget?.brands ?? [];
      } else {
        apiResponse.res_brand_pdp = await getEbuxBrands("OSA");
        apiResponse.res_brand_kw = await getEbuxBrands("SOS");
        apiResponse.res_brand_pdp_competition = [];
      }


      apiResponse.res_brand_som = await getEbuxBrands("SOM");


      // const res_location_new = await getEbuxLocationsNew(_kpi, (res_platform?.map(i => i.value) ?? []));

      if (_activeClientProject?.isFilterDateWise) {
        const dateRangeData = { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks };
        apiResponse.res_location_new_pdp = await getEbuxLocationsNew("OSA", (apiResponse.res_platform_pdp?.map(i => i.value) ?? []), (selectedFilters?.active_location_status), dateRangeData);
      } else {
        apiResponse.res_location_new_pdp = await getEbuxLocationsNew("OSA", (apiResponse.res_platform_pdp?.map(i => i.value) ?? []), (selectedFilters?.active_location_status));
      }
      apiResponse.res_location_new_kw = await getEbuxLocationsNew("SOS", (apiResponse.res_platform_kw?.map(i => i.value) ?? []), undefined);
      // const location = getPincodesfromLocation(res_location_new);
      apiResponse.location_pdp = getPincodesfromLocation(apiResponse.res_location_new_pdp);
      apiResponse.location_kw = getPincodesfromLocation(apiResponse.res_location_new_kw);



      // const res_darkstore = await getEbuxDarkstoreLocation(_kpi, (res_platform?.map(i => i.value) ?? []));
      // apiResponse.res_darkstore_kw = await getEbuxDarkstoreLocation("SOS", (apiResponse.res_platform_kw?.map(i => i.value) ?? []));

      if (_activeClientProject?.isFilterDateWise) {

        const dateRangeData = { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks };
        apiResponse.res_darkstore_pdp = await getEbuxDarkstoreLocation("OSA", (apiResponse.res_platform_pdp?.map(i => i.value) ?? []), dateRangeData);
      } else {
        apiResponse.res_darkstore_pdp = await getEbuxDarkstoreLocation("OSA", (apiResponse.res_platform_pdp?.map(i => i.value) ?? []));
      }

      apiResponse.res_darkstore_kw = apiResponse.res_darkstore_pdp;
      // const res_competition_brand = await getEbuxCompetitionBrands(_kpi);
      apiResponse.res_competition_brand_kw = await getEbuxCompetitionBrands("SOS");
      apiResponse.res_competition_brand_pdp = await getEbuxCompetitionBrands("OSA");

      console.log('combineFilterCompetitionWidget', combineFilterCompetitionWidget)
      console.log('apiResponse.res_competition_brand_pdp', apiResponse.res_competition_brand_pdp)


      // const sub_brands = getSubBrandfromBrand(res_brand);
      apiResponse.sub_brands_kw = getSubBrandfromBrand(apiResponse.res_brand_kw);
      apiResponse.sub_brands_pdp = getSubBrandfromBrand(apiResponse.res_brand_pdp);



      // const darkstore = getDarkstorefromDarkstoreLocation(res_darkstore);
      apiResponse.darkstore_pdp = getDarkstorefromDarkstoreLocation(apiResponse.res_darkstore_pdp);
      apiResponse.darkstore_kw = getDarkstorefromDarkstoreLocation(apiResponse.res_darkstore_kw);



      // if ((_enabledKPIs?.["OSA"] || _enabledKPIs?.["PRO"] || _enabledKPIs?.["CS"] || _enabledKPIs?.["RR"]) && (_kpi == "OSA" || _kpi == "PRO" || _kpi == "CS" || _kpi == "RR" || _kpi == "SOD")) {
      //   res_category = await getEbuxCategories((res_platform?.map(i => i.value) ?? []), (sub_brands?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
      //   res_sub_category = await getEbuxSubCategories((res_platform?.map(i => i.value) ?? []), (sub_brands?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
      //   sub_Categories = getSubCategoryfromCategory(res_category);
      //   res_products = await getEbuxProducts((res_platform?.map(i => i.value) ?? []), (sub_brands?.flatMap(i => i?.brand_id ?? i?.value) ?? []), (sub_Categories?.flatMap(i => i?.nielsen_id ?? i?.value) ?? []));
      // } else {
      //   res_category = await getEbuxCategories((apiResponse.res_platform_pdp?.map(i => i.value) ?? []), (apiResponse.sub_brands_pdp?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
      //   sub_Categories = getSubCategoryfromCategory(res_category);
      //   res_products = await getEbuxProducts((apiResponse.res_platform_pdp?.map(i => i.value) ?? []), (apiResponse.sub_brands_pdp?.flatMap(i => i?.brand_id ?? i?.value) ?? []), (sub_Categories?.flatMap(i => i?.nielsen_id ?? i?.value) ?? []));
      // }
      if ((_enabledKPIs?.["OSA"] || _enabledKPIs?.["PRO"] || _enabledKPIs?.["CS"] || _enabledKPIs?.["RR"])) {
        if (([2, 101, 102, 103].indexOf(_activeClientProject?.client_project_id) > -1) || activeClientProject?.useCombineFilter) {
          apiResponse.res_category = combineFilterWidget?.categories ?? [];
        } else {
          apiResponse.res_category = await getEbuxCategories((apiResponse.res_platform_pdp?.map(i => i.value) ?? []), (apiResponse.sub_brands_pdp?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
        }

        apiResponse.res_sub_category = await getEbuxSubCategories((apiResponse.res_platform_pdp?.map(i => i.value) ?? []), (apiResponse.sub_brands_pdp?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
        apiResponse.sub_Categories = getSubCategoryfromCategory(apiResponse.res_category);
        if (_activeClientProject?.client_project_id == 10) {
          apiResponse.res_product_ppg = await getEbuxColPalMtPpg((apiResponse.res_platform_pdp?.map(i => i.value) ?? []), (apiResponse.sub_brands_pdp?.flatMap(i => i?.sub_brand) ?? []), (apiResponse.sub_Categories?.flatMap(i => i?.nielsen_id ?? i?.value) ?? []));
          apiResponse.res_products = await getEbuxProducts((apiResponse.res_platform_pdp?.map(i => i.value) ?? []), (apiResponse.sub_brands_pdp?.flatMap(i => i?.sub_brand) ?? []), (apiResponse.sub_Categories?.flatMap(i => i?.nielsen_id ?? i?.value) ?? []), selectedMsl, [], (apiResponse.res_product_ppg?.map(i => i.value) ?? []));
          apiResponse.res_products_competition = [];
        } else {
          if (([2, 101, 102, 103].indexOf(_activeClientProject?.client_project_id) > -1) || activeClientProject?.useCombineFilter) {
            apiResponse.res_mother_pack = combineFilterWidget?.mother_packs ?? [];
            apiResponse.res_products = combineFilterWidget?.products ?? [];
            apiResponse.res_products_competition = combineFilterCompetitionWidget?.products ?? [];
          } else {
            apiResponse.res_mother_pack = await getEbuxMotherPack((apiResponse.res_platform_pdp?.map(i => i.value) ?? []), (apiResponse.sub_brands_pdp?.flatMap(i => i?.brand_id ?? i?.value) ?? []), (apiResponse.sub_Categories?.flatMap(i => i?.nielsen_id ?? i?.value) ?? []));
            apiResponse.res_products = await getEbuxProducts((apiResponse.res_platform_pdp?.map(i => i.value) ?? []), (apiResponse.sub_brands_pdp?.flatMap(i => i?.brand_id ?? i?.value) ?? []), (apiResponse.sub_Categories?.flatMap(i => i?.nielsen_id ?? i?.value) ?? []), selectedMsl, (apiResponse.res_mother_pack?.map(i => i.value) ?? []));
            apiResponse.res_products_competition = [];
          }
        }
      }

      if (_enabledKPIs?.["SOM"]) {
        if (_activeClientProject?.client_project_id == 2) {
          apiResponse.category_som = combineFilterWidgetSOM?.som_categories ?? []
          apiResponse.res_sub_category = apiResponse.category_som
          apiResponse.category_node = combineFilterWidgetSOM?.category_node ?? []
          console.log('apiResponse.category_som', apiResponse.category_som)
        } else {
          apiResponse.category_som = await getKeywordCategorySom((apiResponse.res_platform_pdp?.map(i => i.value) ?? []))
          apiResponse.res_sub_category = apiResponse.category_som
          apiResponse.category_node = await getCategory_node((apiResponse.res_platform_pdp?.map(i => i.value) ?? []))
          console.log('apiResponse.category_som', apiResponse.category_som)
        }
      }


      // if ((_enabledKPIs?.["SOS"] || _enabledKPIs?.["OR"]) && (_kpi == "SOS" || _kpi == "OR")) {
      //   res_keyword = await getEbuxKeywords((res_platform?.map(i => i.value) ?? []), (sub_brands?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
      //   _keywords = getKeywordsfromKeywordIfWithKeywordType(res_keyword);

      //   res_keyword_category = await getEbuxKeywordCategories((res_platform?.map(i => i.value) ?? []), (sub_brands?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
      //   keyword_sub_Categories = getSubCategoryfromCategory(res_keyword_category);
      //   res_keyword_type = await getEbuxKeywordType((res_platform?.map(i => i.value) ?? []), (sub_brands?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
      // } else {
      //   res_keyword = await getEbuxKeywords((res_platform_kw?.map(i => i.value) ?? []), (sub_brands_kw?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
      //   _keywords = getKeywordsfromKeywordIfWithKeywordType(res_keyword);

      //   res_keyword_category = await getEbuxKeywordCategories((res_platform_kw?.map(i => i.value) ?? []), (sub_brands_kw?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
      //   keyword_sub_Categories = getSubCategoryfromCategory(res_keyword_category);
      //   res_keyword_type = await getEbuxKeywordType((res_platform_kw?.map(i => i.value) ?? []), (sub_brands_kw?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
      // }
      if ((_enabledKPIs?.["SOS"] || _enabledKPIs?.["OR"])) {
        if ([2, 101, 102, 103].indexOf(_activeClientProject?.client_project_id) > -1 || activeClientProject?.useCombineFilter) {
          apiResponse.res_keyword = combineFilterWidgetKW?.keywords ?? [];
          apiResponse._keywords = getKeywordsfromKeywordIfWithKeywordType(apiResponse.res_keyword);

          apiResponse.res_keyword_category = combineFilterWidgetKW?.keyword_categories ?? [];
          apiResponse.keyword_sub_Categories = getSubCategoryfromCategory(apiResponse.res_keyword_category);
          apiResponse.res_keyword_type = await getEbuxKeywordType((apiResponse.res_platform_kw?.map(i => i.value) ?? []), (apiResponse.sub_brands_kw?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
        } else {
          apiResponse.res_keyword = await getEbuxKeywords((apiResponse.res_platform_kw?.map(i => i.value) ?? []), (apiResponse.sub_brands_kw?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
          apiResponse._keywords = getKeywordsfromKeywordIfWithKeywordType(apiResponse.res_keyword);

          apiResponse.res_keyword_category = await getEbuxKeywordCategories((apiResponse.res_platform_kw?.map(i => i.value) ?? []), (apiResponse.sub_brands_kw?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
          apiResponse.keyword_sub_Categories = getSubCategoryfromCategory(apiResponse.res_keyword_category);
          apiResponse.res_keyword_type = await getEbuxKeywordType((apiResponse.res_platform_kw?.map(i => i.value) ?? []), (apiResponse.sub_brands_kw?.flatMap(i => i?.brand_id ?? i?.value) ?? []));
        }
      }

      if (_enabledKPIs?.["SOD"]) {
        apiResponse.res_sod_display_ad_type = await getEbuxSODDisplayAdType();
        apiResponse.res_sod_page_location = await getEbuxSODPageLocation();
      }

      setMainApiResponse(apiResponse);
    }

    segmentData = apiResponse.segmentData;
    dynamicPData = apiResponse.dynamicPData;
    staticPData = apiResponse.staticPData;
    subBrandData = apiResponse.subBrandData;
    issueNonIssueData = apiResponse.issueNonIssueData;
    pdpGradeData = apiResponse.pdpGradeData;
    marketData = apiResponse.marketData;
    statusData = apiResponse.statusData;
    marketDataKw = apiResponse.marketDataKw;
    productTypeData = apiResponse.productTypeData;

    res_osa_remarks = apiResponse?.res_osa_remarks;//pdp
    res_category = apiResponse?.res_category;//pdp
    res_sub_category = apiResponse?.res_sub_category;//pdp
    // sub_Categories = apiResponse?.sub_Categories;//pdp
    res_products = apiResponse?.res_products;//pdp
    res_mother_pack = apiResponse?.res_mother_pack;//pdp

    res_keyword = apiResponse?.res_keyword;//kw
    // _keywords = apiResponse?._keywords;//kw
    res_keyword_category = apiResponse?.res_keyword_category;//kw
    // keyword_sub_Categories = apiResponse?.keyword_sub_Categories;//kw
    res_keyword_type = apiResponse?.res_keyword_type;//kw


    res_sod_display_ad_type = apiResponse?.res_sod_display_ad_type;//sod
    res_sod_page_location = apiResponse?.res_sod_page_location;//sod

    let seven_or_more_days_out_of_stock_list = [];
    if (kpiType == "kw") {
      res_platform = apiResponse?.res_platform_kw;
      res_unsubscribed_platform = apiResponse?.res_unsubscribed_platform_kw;
      res_brand = apiResponse?.res_brand_kw;
      res_location_new = apiResponse?.res_location_new_kw;
      res_darkstore = apiResponse?.res_darkstore_kw;
      res_competition_brand = apiResponse?.res_competition_brand_kw;
      // sub_brands = apiResponse?.sub_brands_kw;
      location = apiResponse?.location_kw;
      darkstore = apiResponse?.darkstore_kw;
    } else if (kpiType == "SOM") {
      console.log('apiResponse?.res_platform_pdp', apiResponse?.res_platform_pdp)
      res_platform = apiResponse.res_platform_som;
      res_unsubscribed_platform = apiResponse?.res_unsubscribed_platform_kw;
      res_brand = apiResponse?.res_brand_som;
      // sub_brands = apiResponse?.res_brand_som;
      category_som = apiResponse?.category_som
      category_node = apiResponse?.category_node;
      res_sub_category = category_som;//pdp
    } else {
      const consecutive_out_of_stock_products_payload = { startDate: selectedFilters?.selectedDateRange?.startDate, endDate: selectedFilters?.selectedDateRange?.endDate }
      if (isEqual(consecutive_out_of_stock_products_payload_ref.current, JSON.stringify(consecutive_out_of_stock_products_payload))) {
        seven_or_more_days_out_of_stock_list = selectedFilters?.seven_or_more_days_out_of_stock_list;
      } else {
        consecutive_out_of_stock_products_payload_ref.current = JSON.stringify(consecutive_out_of_stock_products_payload);
        seven_or_more_days_out_of_stock_list = await get_consecutive_out_of_stock_products(consecutive_out_of_stock_products_payload);
      }
      res_platform = apiResponse?.res_platform_pdp;
      res_unsubscribed_platform = apiResponse?.res_unsubscribed_platform_pdp;
      res_brand = apiResponse?.res_brand_pdp;
      res_location_new = apiResponse?.res_location_new_pdp;
      res_darkstore = apiResponse?.res_darkstore_pdp;
      res_competition_brand = apiResponse?.res_competition_brand_pdp;
      // sub_brands = apiResponse?.sub_brands_pdp;
      location = apiResponse?.location_pdp;
      darkstore = apiResponse?.darkstore_pdp;
      res_product_ppg = apiResponse?.res_product_ppg ?? [];//pdp

      res_products_competition = apiResponse?.res_products_competition ?? [];//pdp
      res_brand_competition = apiResponse?.res_brand_pdp_competition ?? [];//pdp
    }

    setFilters((prevFilters) => {
      const updatedFilters = {
        ...prevFilters,
        unsubscribedPlatforms: res_unsubscribed_platform ?? [],
        platform: res_platform ?? [],
        platform_som_reset: res_platform ?? [],
        brand: res_brand ?? [],
        competition_brand: res_competition_brand ?? [],
        res_brand_competition: res_brand_competition ?? [],
        category: res_category ?? [],
        sub_category: res_sub_category ?? [],
        location: res_location_new ?? [],
        locationPincode: location ?? [],
        darkstore: res_darkstore ?? [],
        darkstore_id: darkstore ?? [],
        products: res_products ?? [],
        res_products_competition: res_products_competition ?? [],
        mother_pack: res_mother_pack ?? [],
        keywordCategory: res_keyword_category ?? [],
        keywordType: res_keyword_type ?? [],
        keyword: res_keyword ?? [],
        osa_remarks: res_osa_remarks ?? [],
        sod_display_ad_type: res_sod_display_ad_type ?? [],
        sod_page_location: res_sod_page_location ?? [],
        category_som: category_som ?? [],
        category_node: category_node ?? [],
        product_ppg: res_product_ppg ?? [],
        segmentData: segmentData ?? [],
        dynamicPData: dynamicPData ?? [],
        staticPData: staticPData ?? [],
        subBrandData: subBrandData ?? [],
        issueNonIssueData: issueNonIssueData ?? [],
        pdpGradeData: pdpGradeData ?? [],
        marketData: marketData ?? [],
        statusData: statusData ?? [],
        marketDataKw: marketDataKw ?? [],
        productTypeData: productTypeData ?? [],
        //seg set 3
      };

      setSelectedFiltersWidget(prevSelectedFilters => ({
        ...prevSelectedFilters,
        isUserChangePlatform: false,
        selectedPlatform: [],
        selectedPlatformPdp: apiResponse?.res_platform_pdp ?? [],
        selectedPlatformKw: apiResponse?.res_platform_kw ?? [],
        selectedBrand: [],
        selectedBrandPdp: [],
        selectedBrandKw: [],
        selectedBrandSOM: [],
        // selectedBrand_init: sub_brands ?? [],
        selectedCategory: [],
        // selectedCategory_init: sub_Categories ?? [],
        selectedSubCategory: [],
        // selectedSubCategory_init: res_sub_category ?? [],
        selectedProductId: [],
        selectedMotherPack: [],
        selectedLocation: [],
        selectedLocationPdp: [],
        selectedLocationKw: [],
        // selectedLocationpincode: location ?? [],
        selectedDarkstore: [],
        selectedBrandCompetition: [],
        selectedProductCompetition: [],
        // selectedDarkstoreID: darkstore ?? [],
        selectedKeyword: [],
        // selectedKeyword_init: _keywords ?? [],
        selectedKeywordCategory: [],
        // selectedKeywordCategory_init: keyword_sub_Categories ?? [],
        selectedKeywordType: [],
        selectedOSARemarks: [],
        selectCategory_som: [],
        selectCategory_node: [],
        selectedProduct_ppg: [],
        selectedSegmentData: [],
        selectedProductTypeData: [],
        selectedDynamicPData: [],
        selectedStaticPData: [],
        selectedSubBrandData: [],
        issueNonIssueData: [],
        pdpGradeData: [],
        marketData: [],
        statusData: [],
        marketDataKw: [],
        selectedTags: [],
        selectedTagsKW: [],

        //all 3 segment will be blank here ...
      }));
      setSelectedFilters(prevSelectedFilters => ({
        ...prevSelectedFilters,
        selectedPlatform: [],
        selectedPlatformPdp: apiResponse?.res_platform_pdp ?? [],
        selectedPlatformKw: apiResponse?.res_platform_kw ?? [],
        selectedBrand: [],
        selectedBrandPdp: [],
        selectedBrandKw: [],
        selectedBrandSOM: [],
        // selectedBrand_init: sub_brands ?? [],
        selectedCategory: [],
        // selectedCategory_init: sub_Categories ?? [],
        selectedSubCategory: [],
        // selectedSubCategory_init: res_sub_category ?? [],
        selectedProductId: [],
        selectedMotherPack: [],
        selectedLocation: [],
        selectedLocationPdp: [],
        selectedLocationKw: [],
        // selectedLocationpincode: location ?? [],
        selectedDarkstore: [],
        // selectedDarkstoreID: darkstore ?? [],
        selectedKeyword: [],
        // selectedKeyword_init: _keywords ?? [],
        selectedKeywordCategory: [],
        // selectedKeywordCategory_init: keyword_sub_Categories ?? [],
        selectedKeywordType: [],
        selectedOSARemarks: [],
        selectCategory_som: [],
        selectCategory_node: [],
        selectedProduct_ppg: [],
        seven_or_more_days_out_of_stock_list,
        calendarType: _activeClientProject?.calendarType ?? "date",//??"week",
        selectedTags: [],
        selectedTagsKW: [],
      }));


      return updatedFilters;
    });
    return true;
  }
  const initFitersLoadWidgetGlobalView = async (_kpi, firstTimeLoad = true) => {
    console.log('widget glovalview called')
    let location = [], res_platform = [], res_brand = [], res_location_new = [], res_category = [], res_keyword = [];
    const apiResponse = { ...mainApiResponse };
    if (firstTimeLoad) {
      let combineFilterWidget = await fetchGlobalViewCombineFiltersPdpKw("GLOBALVIEW", []);
      apiResponse.res_platform_pdp = combineFilterWidget?.platforms ?? [];
      apiResponse.res_brand_pdp = combineFilterWidget?.brands ?? [];
      apiResponse.res_category = combineFilterWidget?.categories ?? [];
      apiResponse.res_keyword = combineFilterWidget?.keywords ?? [];

      apiResponse.res_location_new_pdp = await getEbuxLocationsGlobalView("GLOBALVIEW", (apiResponse.res_platform_pdp?.map(i => i.pf_id_in_db) ?? []));
      apiResponse.location_pdp = getPincodesfromLocation(apiResponse.res_location_new_pdp);

      setMainApiResponse(apiResponse);
    }

    res_category = apiResponse?.res_category;//pdp
    res_platform = apiResponse?.res_platform_pdp;
    res_brand = apiResponse?.res_brand_pdp;
    res_location_new = apiResponse?.res_location_new_pdp;
    location = apiResponse?.location_pdp;
    res_keyword = apiResponse?.res_keyword;//kw

    setFilters((prevFilters) => {
      const updatedFilters = {
        ...prevFilters,
        platform: res_platform ?? [],
        brand: res_brand ?? [],
        category: res_category ?? [],
        location: res_location_new ?? [],
        locationPincode: location ?? [],
        keyword: res_keyword ?? [],
      };

      setSelectedFiltersWidget(prevSelectedFilters => ({
        ...prevSelectedFilters,
        isUserChangePlatform: false,
        selectedPlatform: [],
        selectedBrand: [],
        selectedCategory: [],
        selectedLocation: [],
        selectedKeyword: res_keyword ?? [],
      }));
      setSelectedFilters(prevSelectedFilters => ({
        ...prevSelectedFilters,
        selectedPlatform: [],
        selectedBrand: [],
        selectedCategory: [],
        selectedLocation: [],
        selectedKeyword: res_keyword ?? [],
      }));


      return updatedFilters;
    });
    return true;
  }

  const initFitersLoadWidgetBUYBOX = async (_kpi, firstTimeLoad = true) => {
    console.log('widget glovalview called')
    let location = [], res_platform = [], res_brand = [], res_location_new = [], res_products = [], res_buy_box_seller_type = [];
    const apiResponse = { ...mainApiResponse };
    if (firstTimeLoad) {
      let combineFilterWidget = await getCombineFilterWidget("OSA", []);
      apiResponse.res_platform_pdp = combineFilterWidget?.platforms ?? [];
      apiResponse.res_brand_pdp = combineFilterWidget?.brands ?? [];
      apiResponse.res_products = combineFilterWidget?.products ?? [];

      // apiResponse.res_location_new_pdp = await getEbuxLocationsGlobalView("GLOBALVIEW", (apiResponse.res_platform_pdp?.map(i => i.pf_id_in_db) ?? [])); 
      apiResponse.res_location_new_pdp = await getEbuxLocationsNew("OSA", (apiResponse.res_platform_pdp?.map(i => i.value) ?? []), (selectedFilters?.active_location_status));
      apiResponse.location_pdp = getPincodesfromLocation(apiResponse.res_location_new_pdp);

      apiResponse.res_buy_box_seller_type = await getBuyBoxSellerType();

      setMainApiResponse(apiResponse);
    }

    res_platform = apiResponse?.res_platform_pdp;
    res_brand = apiResponse?.res_brand_pdp;
    res_location_new = apiResponse?.res_location_new_pdp;
    location = apiResponse?.location_pdp;
    res_products = apiResponse?.res_products;//pdp
    res_buy_box_seller_type = apiResponse.res_buy_box_seller_type

    setFilters((prevFilters) => {
      const updatedFilters = {
        ...prevFilters,
        platform: res_platform ?? [],
        brand: res_brand ?? [],
        location: res_location_new ?? [],
        locationPincode: location ?? [],
        products: res_products ?? [],
        sellerType: res_buy_box_seller_type ?? [],
      };

      setSelectedFiltersWidget(prevSelectedFilters => ({
        ...prevSelectedFilters,
        isUserChangePlatform: false,
        selectedPlatform: [],
        selectedBrand: [],
        selectedProductId: [],
        selectedLocation: [],
        selectedSellerType: [],
      }));
      setSelectedFilters(prevSelectedFilters => ({
        ...prevSelectedFilters,
        selectedPlatform: [],
        selectedBrand: [],
        selectedLocation: [],
        selectedProductId: [],
        selectedSellerType: [],
      }));


      return updatedFilters;
    });
    return true;
  }

  const initFitersLoadDarkStore = async () => {
    const _activeClientProject = JSON.parse(localStorage.getItem("active_client_project")) || {};
    setActiveClientProject(_activeClientProject);
    const apiResponse = {};
    if (_activeClientProject?.client_project_id == 1) {
      const { segments, dynamic_p, static_p, sub_brands, status, market, marketKw, pdpGrade, issueNonIssue, product_type } = await getAdditianlCombineFilterWidgetDarkStore("OSA", []);
      apiResponse.segmentData = segments ?? [];
      apiResponse.dynamicPData = dynamic_p ?? [];
      apiResponse.staticPData = static_p ?? [];
      apiResponse.subBrandData = sub_brands ?? [];
      apiResponse.issueNonIssueData = issueNonIssue ?? [];
      apiResponse.pdpGradeData = pdpGrade ?? [];
      apiResponse.marketData = market ?? [];
      apiResponse.statusData = status ?? [];
      apiResponse.marketDataKw = marketKw ?? [];
      apiResponse.productTypeData = product_type ?? [];
    }
    let payload = {
      msl: 'all',
      brand_category_name: [],
      brand_name: [],
      mother_pack: [],
      web_pid: [],
      ...((activeClientProject?.isFilterDateWise) ? {
        dateRangeData: { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks }
      } : {})
    }
    const res = await getDistinctFiltersDarkStore(payload);
    const { brand, category, mother_pack, web_pid, pf_id } = res;
    //  const darkstore_platform = await getEbuxPlatformsDarkStore("OSA", []);
    // const darkstore_brand = await getEbuxBrandsDarkStore("OSA", darkstore_platform?.map(i => i.value) ?? []);
    // const darkstore_category = await getEbuxCategoriesDarkStore((darkstore_platform?.map(i => i.value) ?? []), (darkstore_brand?.map(i => i?.value) ?? []));
    // const darkstore_mother_pack = await getEbuxMotherPackDarkStore((darkstore_platform?.map(i => i.value) ?? []), (darkstore_brand?.map(i => i?.value) ?? []), (darkstore_category?.map(i => i?.value) ?? []));
    // const darkstore_product = await getEbuxProductsDarkStore((darkstore_platform?.map(i => i.value) ?? []), (darkstore_brand?.map(i => i?.value) ?? []), (darkstore_category?.map(i => i?.value) ?? []), selectedMsl, (darkstore_mother_pack?.map(i => i.value) ?? []));

    let res_location_new;
    if (activeClientProject?.isFilterDateWise) {

      const dateRangeData = { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks };
      res_location_new = await getEbuxLocationsNewDarkStore("OSA", (pf_id?.map(i => i.value) ?? []), (selectedFilters?.active_location_status), dateRangeData);
    } else {
      res_location_new = await getEbuxLocationsNewDarkStore("OSA", (pf_id?.map(i => i.value) ?? []), (selectedFilters?.active_location_status));
    }
    const location = getPincodesfromLocation(res_location_new);
    let darkStoreId;
    if (activeClientProject?.isFilterDateWise) {

      const dateRangeData = { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks };
      darkStoreId = await getStoreDataIdDarkStore("OSA", (pf_id?.map(i => i.value) ?? []), (selectedFilters?.active_location_status), dateRangeData);
    } else {
      darkStoreId = await getStoreDataIdDarkStore("OSA", (pf_id?.map(i => i.value) ?? []), (selectedFilters?.active_location_status));
    }
    const osaRemarks = await getEbuxOSARemarks();
    // console.log('darkStoreIddarkStoreIddarkStoreId',darkStoreId)

    setFiltersDarkStore(prevFilters => ({
      ...prevFilters,
      platform: pf_id ?? [],
      platform_reset: pf_id ?? [],
      brand: brand ?? [],
      brand_reset: brand ?? [],
      category: category ?? [],
      category_reset: category ?? [],
      products: web_pid ?? [],
      products_reset: web_pid ?? [],
      mother_pack: mother_pack ?? [],
      mother_pack_reset: mother_pack ?? [],
      location: res_location_new ?? [],
      location_reset: res_location_new ?? [],
      locationPincode: location ?? [],
      locationPincode_reset: location ?? [],
      darkstore: darkStoreId ?? [],
      darkstore_reset: darkStoreId ?? [],
      osa_remarks: osaRemarks ?? [],
      osa_remarks_reset: osaRemarks ?? [],
      OSA: {
        "currentData": "00.0"
      },
      PRO: {
        "currentData": "00.0"
      },
      ...((_activeClientProject?.client_project_id == 1) ? {
        segmentData: apiResponse?.segmentData ?? [],
        dynamicPData: apiResponse?.dynamicPData ?? [],
        staticPData: apiResponse?.staticPData ?? [],
        subBrandData: apiResponse?.subBrandData ?? [],
        issueNonIssueData: apiResponse?.issueNonIssueData ?? [],
        pdpGradeData: apiResponse?.pdpGradeData ?? [],
        marketData: apiResponse?.marketData ?? [],
        statusData: apiResponse?.statusData ?? [],
        marketDataKw: apiResponse?.marketDataKw ?? [],
        productTypeData: apiResponse?.productTypeData ?? []
      } : {})
    }))

    // setSelectedFilters(prevFilters => ({
    //   ...prevFilters,
    //   selectedPlatform: darkstore_platform ?? []
    // }))

    // setSelectedFiltersWidget(prevSelectedFilters => ({
    //   ...prevSelectedFilters,
    //   selectedPlatform: darkstore_platform ?? [],

    // }));

  }

  const getDistinctFiltersDarkStoreFn = async (key, keyFiltersData = [], msl = '') => {
    try {
      const _activeClientProject = JSON.parse(localStorage.getItem("active_client_project")) || {};
      setActiveClientProject(_activeClientProject);
      if (key == 'msl_type') {
        let res_products;
        if (_activeClientProject?.isFilterDateWise) {
          const dateRangeData = { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks }
          res_products = await getEbuxProductsDarkStore((selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), [], [], msl, [], [], dateRangeData);
        } else {
          res_products = await getEbuxProductsDarkStore((selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), [], [], msl);
        }

        setFiltersDarkStore((prevFilters) => ({
          ...prevFilters,
          products: res_products ?? [],
        }));
        if (res_products?.length == 0) {
          setSelectedFiltersWidget(prev => ({
            ...prev,
            selectedPlatform: [],
            selectedBrand: [],
            selectedCategory: [],
            selectedMotherPack: [],
            selectedProductId: [],
          }));
        }

        setSelectedFiltersWidget(prev => ({
          ...prev,
          msl: msl
        }));
        return
      }

      let bid,
        // platformIds, 
        platformData;
      if (key == 'platform') {
        // platformIds = keyFiltersData?.map(i => i.value) ?? [];
        platformData = keyFiltersData
      } else {
        // platformIds = filtersDarkStore?.platform?.map(i => i.value) ?? [];
        platformData = filtersDarkStore?.platform
      }


      let payload = {
        // pf_id: platformIds,
        msl: key == 'msl_type' ? msl : 'all',
        ...((_activeClientProject?.isFilterDateWise) ? {
          dateRangeData: { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks }
        } : {})
      };
      if (keyFiltersData?.length) {
        if (keyFiltersData?.length == filtersDarkStore?.[key]?.length) {
          keyFiltersData = filtersDarkStore?.[key] ?? [];
        }
        if (key == 'brand' && key == 'brand') {
          bid = [...new Set(keyFiltersData?.flatMap(i => i.id_in_db) ?? [])];

        } else {
          bid = [...new Set(keyFiltersData?.map(i => i.value) ?? [])];
        }
      }
      // console.log('bid-new',bid,keyFiltersData)
      switch (key) {
        case "platform":
          payload.pf_id = bid;
          payload.brand_name = [...new Set(selectedFiltersWidget?.selectedBrand?.flatMap(i => i.id_in_db) ?? [])];
          payload.brand_category_name = [...new Set(selectedFiltersWidget?.selectedCategory?.flatMap(i => i.id_in_db) ?? [])];
          payload.mother_pack = [...new Set(selectedFiltersWidget?.selectedMotherPack?.map(i => i.value) ?? [])];
          payload.web_pid = [...new Set(selectedFiltersWidget?.selectedProductId?.map(i => i.value) ?? [])];
          break;

        case "brand":
          payload.brand_name = bid;
          payload.pf_id = [...new Set(selectedFiltersWidget?.selectedPlatform?.map(i => i.value) ?? [])];
          payload.brand_category_name = [...new Set(selectedFiltersWidget?.selectedCategory?.flatMap(i => i.id_in_db) ?? [])];
          payload.mother_pack = [...new Set(selectedFiltersWidget?.selectedMotherPack?.map(i => i.value) ?? [])];
          payload.web_pid = [...new Set(selectedFiltersWidget?.selectedProductId?.map(i => i.value) ?? [])];
          break;

        case "category":
          payload.brand_category_name = bid;
          payload.pf_id = [...new Set(selectedFiltersWidget?.selectedPlatform?.map(i => i.value) ?? [])];
          payload.brand_name = [...new Set(selectedFiltersWidget?.selectedBrand?.flatMap(i => i.id_in_db) ?? [])];
          payload.mother_pack = [...new Set(selectedFiltersWidget?.selectedMotherPack?.map(i => i.value) ?? [])];
          payload.web_pid = [...new Set(selectedFiltersWidget?.selectedProductId?.map(i => i.value) ?? [])];
          break;

        case "mother_pack":
          payload.mother_pack = bid;
          payload.pf_id = [...new Set(selectedFiltersWidget?.selectedPlatform?.map(i => i.value) ?? [])];
          payload.brand_name = [...new Set(selectedFiltersWidget?.selectedBrand?.flatMap(i => i.id_in_db) ?? [])];
          payload.brand_category_name = [...new Set(selectedFiltersWidget?.selectedCategory?.flatMap(i => i.id_in_db) ?? [])];
          payload.web_pid = [...new Set(selectedFiltersWidget?.selectedProductId?.map(i => i.value) ?? [])];
          break;

        case "products":
          payload.web_pid = bid;
          payload.pf_id = [...new Set(selectedFiltersWidget?.selectedPlatform?.map(i => i.value) ?? [])];
          payload.brand_name = [...new Set(selectedFiltersWidget?.selectedBrand?.flatMap(i => i.id_in_db) ?? [])];
          payload.brand_category_name = [...new Set(selectedFiltersWidget?.selectedCategory?.flatMap(i => i.id_in_db) ?? [])];
          payload.mother_pack = [...new Set(selectedFiltersWidget?.selectedMotherPack?.map(i => i.value) ?? [])];
          break;

        default:
          console.warn(`Unknown filter key: ${key}`);
          break;
      }


      const res = await getDistinctFiltersDarkStore(payload);
      if (!res) return;

      const { brand, category, mother_pack, web_pid, pf_id } = res;

      const filtered = (platformData ?? []).filter(item1 => {
        const match = (pf_id ?? []).some(item2 => {
          const val2 = typeof item2 === "object" ? item2.value : item2;
          const val1 = typeof item1 === "object" ? item1.value : item1;

          const isMatch = val1 === val2;
          return isMatch;
        });
        return match;
      });
      if ([2, 11, 105].indexOf(activeClientProject?.client_project_id) > -1 || activeClientProject?.useCombineFilter) {
        setFiltersDarkStore(prevFilters => {
          const conditionalUpdate = { ...prevFilters };

          conditionalUpdate.platform = (keyFiltersData?.length && key == 'platform') ? prevFilters?.platform : pf_id ?? [];
          conditionalUpdate.brand = (keyFiltersData?.length && key == 'brand') ? prevFilters?.brand : brand ?? [];
          conditionalUpdate.category = (keyFiltersData?.length && key == 'category') ? prevFilters?.category : category ?? [];
          conditionalUpdate.mother_pack = (keyFiltersData?.length && key == 'mother_pack') ? prevFilters?.mother_pack : mother_pack ?? [];
          conditionalUpdate.products = (keyFiltersData?.length && key == 'products') ? prevFilters.products : web_pid ?? [];

          return conditionalUpdate;
        });

        setSelectedFiltersWidget((prev) => {
          const next = { ...prev };
          if (key === "platform") {
            next.selectedPlatform = keyFiltersData ?? [];
          }

          if (key === "brand") {
            next.selectedBrand = keyFiltersData ?? [];
          }

          if (key === "category") {
            next.selectedCategory = keyFiltersData ?? [];
          }

          if (key === "mother_pack") {
            next.selectedMotherPack = keyFiltersData ?? [];
          }

          if (key === "products") {
            next.selectedProductId = keyFiltersData ?? [];
          }

          return next;
        });

      } else {
        setSelectedFiltersWidget(prev => ({
          ...prev,
          selectedPlatform: filtered,
          selectedBrand: brand,
          selectedCategory: category ?? prev.category,
          selectedMotherPack: mother_pack ?? prev.mother_pack,
          selectedProductId: web_pid ?? prev.products,
        }));
      }

    } catch (error) {
      console.error("Error in getDistinctFiltersDarkStoreFn:", error);
    }
  };

  const getDistinctFiltersSomFn = async (key, keyFiltersData = []) => {
    try {

      if (keyFiltersData.length > 0) {
        // let  platformData;
        // if (key == 'platform') {
        //   platformIds = keyFiltersData?.map(i => i.value) ?? [];
        //   platformData = keyFiltersData
        // } else {
        //   platformIds = filtersDarkStore?.platform?.map(i => i.value) ?? [];
        //   platformData = filtersDarkStore?.platform
        // }


        let platformId = [], brandId = [], categoryId = [], categoryNodeId = [], dynamiKey = [];
        if (keyFiltersData?.length) {
          dynamiKey = [...new Set(keyFiltersData?.map(i => i.value) ?? [])];
        }

        switch (key) {
          case "platform":
            platformId = dynamiKey;
            break;

          case "brand":
            brandId = dynamiKey;
            break;

          case "category":
            categoryId = dynamiKey;
            break;

          case "category_node":
            categoryNodeId = dynamiKey;
            break;

          default:
            console.warn(`Unknown filter key: ${key}`);
            break;
        }


        const res = await getCombineFilterWidgetSOM('SOM', platformId, brandId, categoryId, categoryNodeId);
        if (!res) return;

        const { brands, som_categories, category_node, platforms } = res;


        if (activeClientProject?.client_project_id == 2) {
          // setFiltersDarkStore(prevFilters => ({
          //   ...prevFilters,
          //   // brand: combineFilterWidget?.brands ?? [],
          //   platform: pf_id ?? [],
          //   category: category ?? [],
          //   mother_pack: mother_pack ?? [],
          //   products : web_pid ?? [],
          // }));

          setFilters(prevFilters => {
            const conditionalUpdate = { ...prevFilters };

            if (key !== 'platform') {
              conditionalUpdate.platform = platforms ?? [];
            }
            if (key !== 'brand') {
              conditionalUpdate.brand = brands ?? prevFilters.brand;
            }
            if (key !== 'category') {
              conditionalUpdate.category_som = som_categories ?? prevFilters.category_som;
            }
            if (key !== 'category_node') {
              conditionalUpdate.category_node = category_node ?? prevFilters.category_node;
            }

            return conditionalUpdate;
          });

          setSelectedFiltersWidget(prevFilters => ({
            ...prevFilters,
            selectedPlatform: platforms ?? [],
            selectedBrand: brands ?? [],

            selectCategory_node: category_node ?? [],
            selectCategory_som: som_categories ?? [],
          }));

        } else {
          setSelectedFiltersWidget(prev => ({
            ...prev,
            selectedPlatform: [],
            selectedBrand: [],
            selectCategory_node: [],
            selectCategory_som: [],
          }));
        }



      } else {
        setSelectedFiltersWidget(prev => ({
          ...prev,
          selectedPlatform: key === 'platform' ? [] : filters?.platform_som_reset ?? prev.selectedPlatform,
          // selectedPlatform: [],       
          selectedBrand: [],
          selectCategory_node: [],
          selectCategory_som: [],
        }));
        setFilters(prev => ({
          ...prev,
          platform: filters?.platform_som_reset,

        }));
      }

    } catch (error) {
      console.error("Error in getDistinctFiltersDarkStoreFn:", error);
    }
  };


  const updateSelectedBrand = async (brands) => {
    // console.log('brandsbrandssos', brands)
    let res_category, res_keyword, res_mother_pack, res_products, res_keyword_category, res_product_ppg = [];
    if (brands?.length) {
      if (brands?.length == filters?.brand?.length) {
        brands = filters?.brand ?? [];
      }
      const bid = [...new Set(brands?.map(i => i.value) ?? [])];
      if (enabledKPIs?.["OSA"] || enabledKPIs?.["PRO"] || enabledKPIs?.["CS"] || enabledKPIs?.["RR"]) {
        res_category = await getEbuxCategories((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid);
        if (activeClientProject?.client_project_id == 10) {
          res_product_ppg = await getEbuxColPalMtPpg((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), [...new Set(brands?.map(i => i?.sub_brand) ?? [])], (res_category?.map(i => i.value) ?? []));
          res_products = await getEbuxProducts((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), [...new Set(brands?.map(i => i?.sub_brand) ?? [])], (res_category?.map(i => i.value) ?? []), selectedMsl);

        } else {
          res_products = await getEbuxProducts((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid, (res_category?.map(i => i.value) ?? []), selectedMsl);
          res_mother_pack = await getEbuxMotherPack((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid, (res_category?.map(i => i.value) ?? []));
        }
      }

      if (enabledKPIs?.["SOS"] || enabledKPIs?.["OR"]) {
        res_keyword_category = await getEbuxKeywordCategories((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid);
        res_keyword = await getEbuxKeywords((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid, (res_keyword_category?.map(i => i.value) ?? []));
      }
    }
    if (isUseWidget) {
      if (activeClientProject?.client_project_id == 2) {
        const bid = [...new Set(brands?.map(i => i.value) ?? [])];
        let combineFilterWidget = await getCombineFilterWidget("OSA", (selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), (bid ?? []), (selectedFiltersWidget.selectedCategory?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedMotherPack?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedProductId?.map(i => i.value) ?? []));
        // let combineFilterWidget = await getCombineFilterWidget("OSA", [],(bid ?? []),(selectedFiltersWidget.selectedCategory?.map(i => i.value) ?? []),(selectedFiltersWidget.selectedMotherPack?.map(i => i.value) ?? []),(selectedFiltersWidget.selectedProductId?.map(i => i.value) ?? []));
        let combineFilterWidgetKW = await getCombineFilterWidgetKW("SOS", (selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), (bid ?? []), (selectedFiltersWidget.selectedKeywordCategory?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedKeyword?.map(i => i.value) ?? []));
        // let combineFilterWidgetKW = await getCombineFilterWidgetKW("SOS", [],(bid ?? []));
        // setSelectedFiltersWidget(prevFilters => ({
        //   ...prevFilters,
        //   selectedPlatform: (kpi=="SOS" || kpi=="OR") ? combineFilterWidgetKW?.platforms ?? [] : combineFilterWidget?.platforms ?? [],
        //   selectedBrand: (brands?.length>0) ? (kpi=="SOS" || kpi=="OR") ? combineFilterWidgetKW?.brands ?? [] : combineFilterWidget?.brands ?? [] : [],
        //   selectedCategory: (brands?.length>0) ? combineFilterWidget?.categories ?? [] : [],
        //   selectedProductId: (brands?.length>0) ? combineFilterWidget?.products ?? [] : [],
        //   selectedMotherPack: (brands?.length>0) ? combineFilterWidget?.mother_packs ?? [] : [],

        //   selectedKeywordCategory: (brands?.length>0) ? combineFilterWidgetKW?.keyword_categories ?? [] : [],
        //   selectedKeyword: (brands?.length>0) ? combineFilterWidgetKW?.keywords ?? [] : [],
        // }));

        setSelectedFiltersWidget(prevFilters => ({
          ...prevFilters,
          // selectedPlatform: selectedFiltersWidget?.isUserChangePlatform ? selectedFiltersWidget?.selectedPlatform : (kpi=="SOS" || kpi=="OR") ? combineFilterWidgetKW?.platforms ?? [] : combineFilterWidget?.platforms ?? [],
          // selectedBrand: (brands?.length>0) ? (kpi=="SOS" || kpi=="OR") ? combineFilterWidgetKW?.brands ?? [] : combineFilterWidget?.brands ?? [] : [],
          selectedBrand: brands ?? [],
        }));


        setFilters(prevFilters => ({
          ...prevFilters,
          platform: (kpi == "SOS" || kpi == "OR") ? combineFilterWidgetKW?.platforms ?? [] : combineFilterWidget?.platforms ?? [],
          ...(brands?.length === 0 && {
            brand: (kpi == "SOS" || kpi == "OR") ? combineFilterWidgetKW?.brands ?? [] : combineFilterWidget?.brands ?? [],
          }),
          category: combineFilterWidget?.categories ?? [],
          mother_pack: combineFilterWidget?.mother_packs ?? [],
          products: combineFilterWidget?.products ?? [],

          keywordCategory: combineFilterWidgetKW?.keyword_categories ?? [],
          keyword: combineFilterWidgetKW?.keywords ?? [],
        }));
      } else {
        setSelectedFiltersWidget(prevFilters => ({
          ...prevFilters,
          selectedBrand: brands ?? [],
          selectedKeywordCategory: res_keyword_category ?? [],
          selectedCategory: res_category ?? [],
          selectedKeyword: res_keyword ?? [],
          selectedProductId: res_products ?? [],
          selectedProduct_ppg: res_product_ppg ?? [],
          selectedMotherPack: res_mother_pack ?? []
        }));
      }
    } else {
      setSelectedFilters(prevFilters => ({
        ...prevFilters,
        selectedBrand: brands ?? [],
        selectedKeywordCategory: res_keyword_category ?? [],
        selectedCategory: res_category ?? [],
        selectedKeyword: res_keyword ?? [],
        selectedProductId: res_products ?? [],
        selectedProduct_ppg: res_product_ppg ?? [],
        selectedMotherPack: res_mother_pack ?? []
      }));
    }

  }

  const updateSelectedBrandDarkStore = async (brands) => {
    let res_category, res_mother_pack, res_products;

    if (brands?.length) {
      if (brands?.length == filters?.brand?.length) {
        brands = filters?.brand ?? [];
      }
      const bid = [...new Set(brands?.map(i => i.value) ?? [])];
      if (enabledKPIs?.["OSA"] || enabledKPIs?.["PRO"] || enabledKPIs?.["CS"] || enabledKPIs?.["RR"]) {
        res_category = await getEbuxCategoriesDarkStore((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid);


        res_products = await getEbuxProductsDarkStore((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid, (res_category?.map(i => i.value) ?? []), selectedMsl);
        res_mother_pack = await getEbuxMotherPackDarkStore((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid, (res_category?.map(i => i.value) ?? []));
        console.log('res_productsres_productsres_products', res_products)
      }


    }
    setSelectedFiltersWidget(prevFilters => ({
      ...prevFilters,
      selectedBrand: brands ?? [],
      selectedCategory: res_category ?? [],
      selectedProductId: res_products ?? [],
      selectedMotherPack: res_mother_pack ?? []
    }));


  }
  // const updateSelectedBrandWidget = async (brands) => {
  //   let res_category, res_keyword, res_mother_pack, res_products, res_keyword_category, res_product_ppg = [];

  //   if (brands?.length) {
  //     if (brands?.length == filters?.brand?.length) {
  //       brands = filters?.brand ?? [];
  //     }
  //     const bid = [...new Set(brands?.map(i => i.value) ?? [])];
  //     if (enabledKPIs?.["OSA"] || enabledKPIs?.["PRO"] || enabledKPIs?.["CS"] || enabledKPIs?.["RR"]) {
  //       res_category = await getEbuxCategories((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid);
  //       if (activeClientProject?.client_project_id == 10) {
  //         res_product_ppg = await getEbuxColPalMtPpg((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), [...new Set(brands?.map(i => i?.sub_brand) ?? [])], (res_category?.map(i => i.value) ?? []));
  //         res_products = await getEbuxProducts((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), [...new Set(brands?.map(i => i?.sub_brand) ?? [])], (res_category?.map(i => i.value) ?? []));

  //       } else {
  //         res_products = await getEbuxProducts((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid, (res_category?.map(i => i.value) ?? []));
  //         res_mother_pack = await getEbuxMotherPack((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid, (res_category?.map(i => i.value) ?? []));
  //       }
  //     }

  //     if (enabledKPIs?.["SOS"] || enabledKPIs?.["OR"]) {
  //       res_keyword_category = await getEbuxKeywordCategories((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid);
  //       res_keyword = await getEbuxKeywords((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid, (res_keyword_category?.map(i => i.value) ?? []));
  //     }
  //   }
  //   setSelectedFiltersWidget(prevFilters => ({
  //     ...prevFilters,
  //     selectedBrand: brands ?? [],
  //     selectedKeywordCategory: res_keyword_category ?? [],
  //     selectedCategory: res_category ?? [],
  //     selectedKeyword: res_keyword ?? [],
  //     selectedProductId: res_products ?? [],
  //     selectedProduct_ppg: res_product_ppg ?? [],
  //     selectedMotherPack: res_mother_pack ?? []
  //   }));
  // }

  const updateSelectedKeywordBrandV2 = async (brands) => {
    let res_keyword_category, res_keyword, sub_Categories, _keywords;

    if (brands?.length) {
      const bid = [...new Set(brands?.flatMap(i => i?.brand_id) ?? [])];
      if (enabledKPIs?.["SOS"] || enabledKPIs?.["OR"]) {
        res_keyword_category = await getEbuxKeywordCategories((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid);

        sub_Categories = getSubCategoryfromCategory(res_keyword_category);
        const cid = [...new Set(sub_Categories?.flatMap(i => i?.nielsen_id) ?? [])];
        res_keyword = await getEbuxKeywords((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid, cid);
        _keywords = getKeywordsfromKeywordIfWithKeywordType(res_keyword);
      }

    }
    console.log({ sub_Categories });
    if (isUseWidget) {
      setSelectedFiltersWidget(prevFilters => ({
        ...prevFilters,
        selectedBrand: brands ?? [],
        selectedKeywordCategory: sub_Categories ?? [],
        // selectedKeywordCategory_init: sub_Categories ?? [],

        selectedKeyword: _keywords ?? [],
        // selectedKeyword_init: _keywords ?? [],
      }));
    } else {
      setSelectedFilters(prevFilters => ({
        ...prevFilters,
        selectedBrand: brands ?? [],
        selectedKeywordCategory: sub_Categories ?? [],
        // selectedKeywordCategory_init: sub_Categories ?? [],

        selectedKeyword: _keywords ?? [],
        // selectedKeyword_init: _keywords ?? [],
      }));
    }
  }
  const updateSelectedBrandV2 = async (brands) => {
    let res_category, res_products, sub_Categories;

    if (brands?.length) {
      const bid = [...new Set(brands?.flatMap(i => i?.brand_id) ?? [])];
      if (enabledKPIs?.["OSA"] || enabledKPIs?.["PRO"] || enabledKPIs?.["CS"] || enabledKPIs?.["RR"]) {
        res_category = await getEbuxCategories((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid);
        sub_Categories = getSubCategoryfromCategory(res_category);
        const cid = [...new Set(sub_Categories?.flatMap(i => i?.nielsen_id) ?? [])];
        res_products = await getEbuxProducts((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid, cid, selectedMsl);
      }

    }
    console.log({ sub_Categories });
    if (isUseWidget) {
      setSelectedFiltersWidget(prevFilters => ({
        ...prevFilters,
        selectedBrand: brands ?? [],
        selectedCategory: sub_Categories ?? [],
        // selectedCategory_init: sub_Categories ?? [],
        selectedProductId: res_products ?? []
      }));
    } else {
      setSelectedFilters(prevFilters => ({
        ...prevFilters,
        selectedBrand: brands ?? [],
        selectedCategory: sub_Categories ?? [],
        // selectedCategory_init: sub_Categories ?? [],
        selectedProductId: res_products ?? []
      }));
    }
  }
  const updateSelectedCategory = async (category) => {
    let brands, bid, res_keyword, res_mother_pack, res_products, res_keyword_category, res_product_ppg = [];
    if ((category?.length)) {
      if (category?.length == filters?.category?.length) {
        brands = filters?.brand ?? []
      } else {
        bid = [];
        category?.forEach(i => {
          if (i?.brand_id) {
            bid.push(...i.brand_id)
          }
        })
        bid = [...new Set(bid)]
        let brand_key = activeClientProject?.client_project_id == 2 ? "value" : "value"
        brands = filters?.brand?.filter((item) => bid.includes(item?.[brand_key]) ?? null);
      }
      bid = [...new Set(brands?.map(i => i.value) ?? [])]
      if (enabledKPIs?.["OSA"] || enabledKPIs?.["PRO"] || enabledKPIs?.["CS"] || enabledKPIs?.["RR"]) {
        if (activeClientProject?.client_project_id == 10) {
          res_product_ppg = await getEbuxColPalMtPpg((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), [...new Set(brands?.map(i => i?.sub_brand) ?? [])], (category?.map(i => i.value) ?? []));
          res_products = await getEbuxProducts((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), [...new Set(brands?.map(i => i?.sub_brand) ?? [])], (category?.map(i => i.value) ?? []), selectedMsl);

        } else {
          res_products = await getEbuxProducts((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid, (category?.map(i => i.value) ?? []), selectedMsl);
          res_mother_pack = await getEbuxMotherPack((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid, (category?.map(i => i.value) ?? []));

        }
      }
      if (enabledKPIs?.["SOS"] || enabledKPIs?.["OR"]) {
        res_keyword_category = await getEbuxKeywordCategories((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid);
        res_keyword = await getEbuxKeywords((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid, (res_keyword_category?.map(i => i.value) ?? []));
      }

    }
    if (isUseWidget) {
      if (activeClientProject?.client_project_id == 2) {
        const cat_id = [...new Set(category?.map(i => i.value) ?? [])];
        let combineFilterWidget = await getCombineFilterWidget("OSA", (selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), (selectedFilters.selectedBrand?.map(i => i.value) ?? []), (cat_id ?? []), (selectedFiltersWidget.selectedMotherPack?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedProductId?.map(i => i.value) ?? []));
        // let combineFilterWidget = await getCombineFilterWidget("OSA", [], (selectedFilters.selectedBrand?.map(i => i.value) ?? []), (cat_id ?? []),(selectedFiltersWidget.selectedMotherPack?.map(i => i.value) ?? []),(selectedFiltersWidget.selectedProductId?.map(i => i.value) ?? []));
        setFilters(prevFilters => ({
          ...prevFilters,
          platform: combineFilterWidget?.platforms ?? [],
          brand: combineFilterWidget?.brands ?? [],
          ...(category?.length === 0 && {
            category: combineFilterWidget?.categories ?? [],
          }),
          mother_pack: combineFilterWidget?.mother_packs ?? [],
          products: combineFilterWidget?.products ?? [],
        }));
        // setSelectedFiltersWidget(prevFilters => ({
        //   ...prevFilters,
        //   selectedPlatform: combineFilterWidget?.platforms ?? [],
        //   selectedBrand: (category?.length>0) ? combineFilterWidget?.brands ?? [] : [],
        //   selectedCategory: (category?.length>0) ? combineFilterWidget?.categories ?? [] : [],
        //   selectedProductId: (category?.length>0) ? combineFilterWidget?.products ?? [] : [],
        //   selectedMotherPack: (category?.length>0) ? combineFilterWidget?.mother_packs ?? [] : []
        // }));

        setSelectedFiltersWidget(prevFilters => ({
          ...prevFilters,
          // selectedPlatform: combineFilterWidget?.platforms ?? [],
          // selectedPlatform: selectedFiltersWidget?.isUserChangePlatform ? selectedFiltersWidget?.selectedPlatform : ( combineFilterWidget?.platforms ?? []),
          selectedCategory: category ?? [],
        }));
      } else {
        setSelectedFiltersWidget(prevFilters => ({
          ...prevFilters,
          selectedBrand: brands ?? [],
          selectedKeywordCategory: res_keyword_category ?? [],
          selectedCategory: category ?? [],
          selectedKeyword: res_keyword ?? [],
          selectedProductId: res_products ?? [],
          selectedProduct_ppg: res_product_ppg ?? [],
          selectedMotherPack: res_mother_pack ?? []
        }));
      }
    } else {
      setSelectedFilters(prevFilters => ({
        ...prevFilters,
        selectedBrand: brands ?? [],
        selectedKeywordCategory: res_keyword_category ?? [],
        selectedCategory: category ?? [],
        selectedKeyword: res_keyword ?? [],
        selectedProductId: res_products ?? [],
        selectedProduct_ppg: res_product_ppg ?? [],
        selectedMotherPack: res_mother_pack ?? []
      }));
    }
  }

  const updateSelectedCategoryDarkStore = async (category) => {
    let brands, bid, res_mother_pack, res_products;
    if ((category?.length)) {
      if (category?.length == filtersDarkStore?.category?.length) {
        brands = filtersDarkStore?.brand ?? []
      } else {
        bid = [];
        // category?.forEach(i => {
        //   if (i?.brand_id) {
        //     bid.push(i.brand_name)

        //   }
        // })
        let brandData = await getEbuxBrandsDarkStore("OSA", selectedFiltersWidget?.selectedPlatform?.map(i => i.value) ?? [], true, [], category?.map(i => i.value));
        brandData?.forEach(i => {
          if (i?.value) {
            bid.push(i.value)

          }
        })
        let brand_key = activeClientProject?.client_project_id == 2 ? "value" : "value"
        brands = filtersDarkStore?.brand?.filter((item) => bid.includes(item?.[brand_key]) ?? null);
      }

      bid = [...new Set(brands?.map(i => i.value) ?? [])]

      res_products = await getEbuxProductsDarkStore((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid, (category?.map(i => i.value) ?? []), selectedMsl);
      res_mother_pack = await getEbuxMotherPackDarkStore((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid, (category?.map(i => i.value) ?? []));
    }

    setSelectedFiltersWidget(prevFilters => ({
      ...prevFilters,
      selectedBrand: brands ?? [],
      selectedCategory: category ?? [],
      selectedProductId: res_products ?? [],
      selectedMotherPack: res_mother_pack ?? []
    }));

  }

  const updateSelectedCategoryV2 = async (category) => {
    let
      sub_brands,
      cid, res_products;
    if ((category?.length)) {
      cid = [...new Set(category?.flatMap(i => i?.nielsen_id ?? i?.value) ?? [])]
      if (enabledKPIs?.["OSA"] || enabledKPIs?.["PRO"] || enabledKPIs?.["CS"] || enabledKPIs?.["RR"]) {

        // const bid = [...new Set(selectedFilters.selectedBrand?.flatMap(i => i?.brand_id) ?? [])]
        const res_brand = await getEbuxBrands(kpi, true, [], cid);

        sub_brands = getSubBrandfromBrand(res_brand);
        const bid = [...new Set(sub_brands?.flatMap(i => i?.brand_id) ?? [])]
        res_products = await getEbuxProducts((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid, (cid), selectedMsl);
      }

    }
    if (isUseWidget) {
      setSelectedFiltersWidget(prevFilters => ({
        ...prevFilters,
        selectedBrand: sub_brands ?? [],
        // selectedBrand_init: sub_brands ?? [],
        selectedCategory: category ?? [],
        selectedProductId: res_products ?? []
      }));
    } else {
      setSelectedFilters(prevFilters => ({
        ...prevFilters,
        selectedBrand: sub_brands ?? [],
        // selectedBrand_init: sub_brands ?? [],
        selectedCategory: category ?? [],
        selectedProductId: res_products ?? []
      }));
    }
  }
  const updateSelectedKeywordCategoryV2 = async (category) => {
    let
      sub_brands,
      cid, _keywords;
    if ((category?.length)) {
      cid = [...new Set(category?.flatMap(i => i?.nielsen_id ?? i?.value) ?? [])]
      if (enabledKPIs?.["OSA"] || enabledKPIs?.["PRO"] || enabledKPIs?.["CS"] || enabledKPIs?.["RR"]) {

        // const bid = [...new Set(selectedFilters.selectedBrand?.flatMap(i => i?.brand_id) ?? [])]
        const res_brand = await getEbuxBrands(kpi, true, [], cid);

        sub_brands = getSubBrandfromBrand(res_brand);
        const bid = [...new Set(sub_brands?.flatMap(i => i?.brand_id) ?? [])]
        const res_keyword = await getEbuxKeywords((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid, cid);
        _keywords = getKeywordsfromKeywordIfWithKeywordType(res_keyword);
      }

    }
    if (isUseWidget) {
      setSelectedFiltersWidget(prevFilters => ({
        ...prevFilters,

        selectedKeyword: _keywords ?? [],
        // selectedKeyword_init: _keywords ?? [],

        selectedBrand: sub_brands ?? [],
        // selectedBrand_init: sub_brands ?? [],
        selectedKeywordCategory: category ?? []
      }));
    } else {
      setSelectedFilters(prevFilters => ({
        ...prevFilters,

        selectedKeyword: _keywords ?? [],
        // selectedKeyword_init: _keywords ?? [],

        selectedBrand: sub_brands ?? [],
        // selectedBrand_init: sub_brands ?? [],
        selectedKeywordCategory: category ?? []
      }));
    }
  }

  const updateSelectedKeywordCategory = async (category) => {
    let brands, bid, res_keyword, res_products, res_category;
    if ((category?.length)) {
      if (category?.length == filters?.keywordCategory?.length) {
        brands = filters?.brand ?? []
      } else {
        bid = [];
        category?.forEach(i => {
          if (i?.brand_id) {
            bid.push(...i.brand_id)
          }
        })
        bid = [...new Set(bid)]
        // bid = [...new Set(category?.map(i => i.brand_id))]
        let brand_key = activeClientProject?.client_project_id == 2 ? "mother_brand_id" : "value"
        brands = filters?.brand?.filter((item) => bid.includes(item?.[brand_key]) ?? null);
      }
      bid = [...new Set(brands?.map(i => i.value) ?? [])]
      if (enabledKPIs?.["SOS"] || enabledKPIs?.["OR"]) {
        res_keyword = await getEbuxKeywords((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid, (category?.map(i => i.value) ?? []));
      }
      if (enabledKPIs?.["OSA"] || enabledKPIs?.["PRO"] || enabledKPIs?.["CS"] || enabledKPIs?.["RR"]) {
        res_category = await getEbuxCategories((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid);
        res_products = await getEbuxProducts((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid, (res_category?.map(i => i.value) ?? []), selectedMsl);
      }
    }
    if (isUseWidget) {
      if (activeClientProject?.client_project_id == 2) {

        const cat_id = [...new Set(category?.map(i => i.value) ?? [])];
        let combineFilterWidgetKW = await getCombineFilterWidgetKW("SOS", (selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedBrand?.map(i => i.value) ?? []), (cat_id ?? []), (selectedFiltersWidget.selectedKeyword?.map(i => i.value) ?? []));
        // let combineFilterWidgetKW = await getCombineFilterWidgetKW("SOS", [], (selectedFiltersWidget.selectedBrand?.map(i => i.value) ?? []), (cat_id ?? []),(selectedFiltersWidget.selectedKeyword?.map(i => i.value) ?? []));
        setFilters(prevFilters => ({
          ...prevFilters,
          platform: combineFilterWidgetKW?.platforms ?? [],
          brand: combineFilterWidgetKW?.brands ?? [],
          ...(category?.length === 0 && {
            category: combineFilterWidgetKW?.keyword_categories ?? [],
          }),
          keyword: combineFilterWidgetKW?.keywords ?? [],
        }));
        // setSelectedFiltersWidget(prevFilters => ({
        //   ...prevFilters,
        //   selectedPlatform: combineFilterWidgetKW?.platforms ?? [],
        //   selectedBrand: (category?.length>0) ? combineFilterWidgetKW?.brands ?? [] : [],
        //   selectedKeywordCategory: (category?.length>0) ? combineFilterWidgetKW?.keyword_categories ?? [] : [],
        //   selectedKeyword: (category?.length>0) ? combineFilterWidgetKW?.keywords ?? [] : [],
        // }));
        setSelectedFiltersWidget(prevFilters => ({
          ...prevFilters,
          // selectedPlatform: combineFilterWidgetKW?.platforms ?? [],
          // selectedPlatform: selectedFiltersWidget?.isUserChangePlatform ? selectedFiltersWidget?.selectedPlatform : ( combineFilterWidgetKW?.platforms ?? []),
          // selectedKeywordCategory: (category?.length>0) ? combineFilterWidgetKW?.keyword_categories ?? [] : [],
          selectedKeywordCategory: category ?? [],
        }));

      } else {
        setSelectedFiltersWidget(prevFilters => ({
          ...prevFilters,
          selectedBrand: brands ?? [],
          selectedKeywordCategory: category ?? [],
          selectedCategory: res_category ?? [],
          selectedKeyword: res_keyword ?? [],
          selectedProductId: res_products ?? []
        }));
      }
    } else {
      setSelectedFilters(prevFilters => ({
        ...prevFilters,
        selectedBrand: brands ?? [],
        selectedKeywordCategory: category ?? [],
        selectedCategory: res_category ?? [],
        selectedKeyword: res_keyword ?? [],
        selectedProductId: res_products ?? []
      }));
    }
  }

  const updatecategory_som = (category) => {
    let brand, category_som, category_node
    if (category?.length) {
      brand = selectedFilters?.selectedBrandSOM,
        category_som = category
      category_node = selectedFilters?.selectCategory_node
    } else {
      brand = selectedFilters?.selectedBrandSOM,
        category_node = selectedFilters?.selectCategory_node
    }

    if (isUseWidget) {
      setSelectedFiltersWidget(prevFilters => ({
        ...prevFilters,
        selectedBrandSOM: brand,
        selectCategory_som: category_som ?? [],
        selectCategory_node: category_node ?? [],
      }));
    } else {
      setSelectedFilters(prevFilters => ({
        ...prevFilters,
        selectedBrandSOM: brand,
        selectCategory_som: category_som ?? [],
        selectCategory_node: category_node ?? [],


      }));
    }

  };
  const updateCategorynode = async (category) => {
    let brand, category_node
    if (category?.length) {
      brand = selectedFilters?.selectedBrandSOM,
        category_node = category
    }
    setSelectedFilters(prevFilters => ({
      ...prevFilters,
      selectedBrandSOM: brand,
      selectCategory_node: category_node ?? [],
    }));
  }


  const updateSelectedKeywordV2 = async (keyword) => {
    let sub_brands, bid, sub_Categories;
    if ((keyword?.length)) {
      bid = [...new Set(keyword?.flatMap(i => i?.brand_id) ?? [])];
      const res_keyword_category = await getEbuxKeywordCategories((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid);

      sub_Categories = getSubCategoryfromCategory(res_keyword_category);
      const cid = [...new Set(sub_Categories?.flatMap(i => i?.nielsen_id) ?? [])];
      const res_brand = await getEbuxBrands(kpi, true, bid, cid);

      sub_brands = getSubBrandfromBrand(res_brand);
    }

    setSelectedFilters(prevFilters => ({
      ...prevFilters,

      selectedBrand: sub_brands ?? [],
      // selectedBrand_init: sub_brands ?? [],      
      selectedKeywordCategory: sub_Categories ?? [],
      // selectedKeywordCategory_init: sub_Categories ?? [],

      selectedKeyword: keyword ?? []
    }));
  }
  const updateSelectedKeyword = async (keyword) => {
    let brands, bid, res_category, res_products, res_keyword_category;
    if ((keyword?.length)) {
      if (keyword?.length == filters?.keyword?.length) {
        brands = filters?.brand ?? []
      } else {
        // bid = [...new Set(keyword?.map(i => i.brand_id))];
        let brand_key = activeClientProject?.client_project_id == 2 ? "sub_brand_id" : "brand_id"
        bid = [...new Set(keyword?.map(i => i[brand_key]))];
        brands = filters?.brand?.filter((item) => bid.includes(item?.value) ?? null);
      }
      bid = [...new Set(brands?.map(i => i.value))];
      if (enabledKPIs?.["SOS"] || enabledKPIs?.["OR"]) {
        res_keyword_category = await getEbuxKeywordCategories((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid);
      }
      if (enabledKPIs?.["OSA"] || enabledKPIs?.["PRO"] || enabledKPIs?.["CS"] || enabledKPIs?.["RR"]) {
        res_category = await getEbuxCategories((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid);
        res_products = await getEbuxProducts((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid, (res_category?.map(i => i.value) ?? []), selectedMsl);
      }

    }
    if (isUseWidget) {
      if (activeClientProject?.client_project_id == 2) {

        const keyword_id = [...new Set(keyword?.map(i => i.value) ?? [])];
        // let combineFilterWidgetKW = await getCombineFilterWidgetKW("SOS", [], [], [], (keyword_id ?? []));
        let combineFilterWidgetKW = await getCombineFilterWidgetKW("SOS", (selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), (bid ?? []), (selectedFiltersWidget.selectedKeywordCategory?.map(i => i.value) ?? []), (keyword_id ?? []));
        // let combineFilterWidgetKW = await getCombineFilterWidgetKW("SOS", [],(bid ?? []),(selectedFiltersWidget.selectedKeywordCategory?.map(i => i.value) ?? []),(keyword_id ?? []));
        setFilters(prevFilters => ({
          ...prevFilters,
          platform: combineFilterWidgetKW?.platforms ?? [],
          brand: combineFilterWidgetKW?.brands ?? [],
          keywordCategory: combineFilterWidgetKW?.keyword_categories ?? [],
          ...(keyword?.length === 0 && {
            keyword: combineFilterWidgetKW?.keywords ?? [],
          }),
        }));
        // setSelectedFiltersWidget(prevFilters => ({
        //   ...prevFilters,
        //   selectedPlatform: combineFilterWidgetKW?.platforms ?? [],
        //   selectedBrand: (keyword?.length>0) ? combineFilterWidgetKW?.brands ?? [] : [],
        //   selectedKeywordCategory: (keyword?.length>0) ? combineFilterWidgetKW?.keyword_categories ?? [] : [],
        //   selectedKeyword: (keyword?.length>0) ? combineFilterWidgetKW?.keywords ?? [] : [],
        // }));

        setSelectedFiltersWidget(prevFilters => ({
          ...prevFilters,
          // selectedPlatform: combineFilterWidgetKW?.platforms ?? [],
          // selectedPlatform: selectedFiltersWidget?.isUserChangePlatform ? selectedFiltersWidget?.selectedPlatform : ( combineFilterWidgetKW?.platforms ?? []),
          selectedKeyword: keyword ?? [],
        }));

      } else {
        setSelectedFiltersWidget(prevFilters => ({
          ...prevFilters,
          selectedBrand: brands ?? [],
          selectedKeywordCategory: res_keyword_category ?? [],
          selectedCategory: res_category ?? [],
          selectedKeyword: keyword ?? [],
          selectedProductId: res_products ?? []
        }));
      }
    } else {
      setSelectedFilters(prevFilters => ({
        ...prevFilters,
        selectedBrand: brands ?? [],
        selectedKeywordCategory: res_keyword_category ?? [],
        selectedCategory: res_category ?? [],
        selectedKeyword: keyword ?? [],
        selectedProductId: res_products ?? []
      }));
    }
  }
  const updateSelectedProdcutPPG = async (product_ppg) => {

    let product;
    if ((product_ppg?.length)) {
      product = await getEbuxProducts([], [], [], selectedMsl, [], (product_ppg?.map(i => i.value) ?? []));
      //  product = await getEbuxProducts((selectedFilters?.selectedPlatform?.map(i => i.value) ?? []),(selectedFilters?.selectedBrand?.map(i => i?.sub_brand) ?? []), (selectedFilters?.selectedCategory?.map(i => i?.value) ?? []), null,[],(product_ppg?.map(i => i.value) ?? []));
      if ((product?.length)) {
        await updateSelectedProduct(product);
        // setSelectedFilters(prevFilters => ({
        //   ...prevFilters,
        //   // selectedProductId: product ?? [],
        //   selectedProduct_ppg: product_ppg ?? []
        // }));        
      }
    } else {
      setSelectedFilters(prevFilters => ({
        ...prevFilters,
        selectedProductId: [],
        selectedMotherPack: [],
        selectedBrand: [],
        selectedCategory: [],
        selectedProduct_ppg: product_ppg ?? []
      }));
    }

  }
  const updateSelectedMotherPack = async (motherPack) => {
    let combineFilterWidget = await getCombineFilterWidget("OSA", (selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedBrand?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedCategory?.map(i => i.value) ?? []), (motherPack?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedProductId?.map(i => i.value) ?? []));
    // let combineFilterWidget = await getCombineFilterWidget("OSA",[], (selectedFiltersWidget.selectedBrand?.map(i => i.value) ?? []),(selectedFiltersWidget.selectedCategory?.map(i => i.value) ?? []),(motherPack?.map(i => i.value) ?? []),(selectedFiltersWidget.selectedProductId?.map(i => i.value) ?? []));
    let product;
    if ((motherPack?.length)) {
      product = await getEbuxProducts((selectedFilters?.selectedPlatform?.map(i => i.value) ?? []), [], (selectedFilters?.selectedCategory?.map(i => i.value) ?? []), selectedMsl, (motherPack?.map(i => i.value) ?? []));
      if ((product?.length)) {

        if (isUseWidget) {

          setFilters(prevFilters => ({
            ...prevFilters,
            platform: combineFilterWidget?.platforms ?? [],
            brand: combineFilterWidget?.brands ?? [],
            category: combineFilterWidget?.categories ?? [],
            products: combineFilterWidget?.products ?? [],
          }));
          if (activeClientProject?.client_project_id == 2) {
            // setSelectedFiltersWidget(prevFilters => ({
            //   ...prevFilters,
            //   selectedPlatform: combineFilterWidget?.platforms ?? [],
            //   selectedBrand: combineFilterWidget?.brands ?? [] ,
            //   selectedCategory: combineFilterWidget?.categories ?? [] ,
            //   selectedProductId: combineFilterWidget?.products ?? [] ,
            //   selectedMotherPack: combineFilterWidget?.mother_packs ?? [] 
            // }));
            setSelectedFiltersWidget(prevFilters => ({
              ...prevFilters,
              // selectedPlatform: combineFilterWidget?.platforms ?? [],
              // selectedPlatform: selectedFiltersWidget?.isUserChangePlatform ? selectedFiltersWidget?.selectedPlatform : ( combineFilterWidget?.platforms ?? []),
              // selectedMotherPack: combineFilterWidget?.mother_packs ?? [] 
              selectedMotherPack: motherPack ?? []
            }));
          } else {
            await updateSelectedProduct(product);
            setSelectedFiltersWidget(prevFilters => ({
              ...prevFilters,
              // selectedProductId: product ?? [],
              selectedMotherPack: motherPack ?? []
            }));
          }
        } else {
          await updateSelectedProduct(product);
          setSelectedFilters(prevFilters => ({
            ...prevFilters,
            // selectedProductId: product ?? [],
            selectedMotherPack: motherPack ?? []
          }));
        }

      }
    } else {
      if (isUseWidget) {
        if (activeClientProject?.client_project_id == 2) {
          setSelectedFiltersWidget(prevFilters => ({
            ...prevFilters,
            selectedPlatform: combineFilterWidget?.platforms ?? [],
            selectedBrand: [],
            selectedKeywordCategory: [],
            selectedCategory: [],
            selectedKeyword: [],
            selectedProductId: [],
            selectedProduct_ppg: [],
            selectedMotherPack: []
          }));

          setFilters(prevFilters => ({
            ...prevFilters,
            platform: combineFilterWidget?.platforms ?? [],
            brand: combineFilterWidget?.brands ?? [],
            category: combineFilterWidget?.categories ?? [],
            mother_pack: combineFilterWidget?.mother_packs ?? [],
            products: combineFilterWidget?.products ?? [],
          }));
        } else {
          setSelectedFiltersWidget(prevFilters => ({
            ...prevFilters,
            selectedProductId: [],
            selectedMotherPack: [],
            selectedBrand: [],
            selectedCategory: [],
          }));
        }

      } else {
        setSelectedFilters(prevFilters => ({
          ...prevFilters,
          selectedProductId: [],
          selectedMotherPack: [],
          selectedBrand: [],
          selectedCategory: [],
        }));
      }

    }

    // setSelectedFilters(prevFilters => ({
    //   ...prevFilters,
    //   selectedBrand: brands ?? [],
    //   selectedProductId: product ?? [],
    //   selectedCategory: res_category ?? [],
    //   selectedKeywordCategory: res_keyword_category ?? [],
    //   selectedKeyword: res_keyword ?? [],
    //   selectedMotherPack: motherPack ?? []
    // }));

    // setFilters((prevFilters) => ({
    //   ...prevFilters,
    //   products: product ?? [],
    // }));

  }

  const updateSelectedMotherPackDarkStore = async (motherPack) => {

    let product;
    if ((motherPack?.length)) {
      product = await getEbuxProductsDarkStore((selectedFilters?.selectedPlatform?.map(i => i.value) ?? []), [], (selectedFilters?.selectedCategory?.map(i => i.value) ?? []), selectedMsl, (motherPack?.map(i => i.value) ?? []));
      if ((product?.length)) {
        await updateSelectedProductDarkStore(product);
        if (isUseWidget) {
          setSelectedFiltersWidget(prevFilters => ({
            ...prevFilters,
            // selectedProductId: product ?? [],
            selectedMotherPack: motherPack ?? []
          }));
        } else {
          setSelectedFilters(prevFilters => ({
            ...prevFilters,
            // selectedProductId: product ?? [],
            selectedMotherPack: motherPack ?? []
          }));
        }

      }
    } else {
      if (isUseWidget) {
        setSelectedFiltersWidget(prevFilters => ({
          ...prevFilters,
          selectedProductId: [],
          selectedMotherPack: [],
          selectedBrand: [],
          selectedCategory: [],
        }));
      } else {
        setSelectedFilters(prevFilters => ({
          ...prevFilters,
          selectedProductId: [],
          selectedMotherPack: [],
          selectedBrand: [],
          selectedCategory: [],
        }));
      }

    }

    // setSelectedFilters(prevFilters => ({
    //   ...prevFilters,
    //   selectedBrand: brands ?? [],
    //   selectedProductId: product ?? [],
    //   selectedCategory: res_category ?? [],
    //   selectedKeywordCategory: res_keyword_category ?? [],
    //   selectedKeyword: res_keyword ?? [],
    //   selectedMotherPack: motherPack ?? []
    // }));

    // setFilters((prevFilters) => ({
    //   ...prevFilters,
    //   products: product ?? [],
    // }));

  }

  const updateSelectedProduct = async (product) => {
    // let combineFilterWidget = await getCombineFilterWidget("OSA", [], [],[], [], (product?.map(i => i.value) ?? []));
    let combineFilterWidget = await getCombineFilterWidget("OSA", (selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedBrand?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedCategory?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedMotherPack?.map(i => i.value) ?? []), (product?.map(i => i.value) ?? []));
    // let combineFilterWidget = await getCombineFilterWidget("OSA", [],(selectedFiltersWidget.selectedBrand ?? []),(selectedFiltersWidget.selectedCategory?.map(i => i.value) ?? []),(selectedFiltersWidget.selectedMotherPack?.map(i => i.value) ?? []),(product?.map(i => i.value) ?? []));
    let brands, bid, res_category, res_keyword_category, res_keyword, product_ppg = [], mother_pack_id, mother_pack;
    if ((product?.length)) {
      if (product?.length === filters?.products?.length) {
        brands = filters?.brand ?? [];
        product_ppg = filters?.product_ppg ?? [];
        mother_pack = filters?.mother_pack ?? [];
      } else {
        // bid = [...new Set(product?.map(i => i.brand_id))]
        let brand_key = activeClientProject?.client_project_id == 10 ? "sub_brand" : activeClientProject?.client_project_id == 2 ? "sub_brand_id" : "brand_id"
        bid = [...new Set(product?.map(i => i[brand_key]))];
        if (activeClientProject?.client_project_id == 10) {
          brands = filters?.brand?.filter((item) => bid.includes(item?.sub_brand) ?? null);
        } else {
          brands = filters?.brand?.filter((item) => bid.includes(item?.value) ?? null);
        }
        // brands = filters?.brand?.filter((item) => bid.includes(item?.value) ?? null);
        const ppg_ids = [...new Set(product?.map(i => i?.["PPG"]).filter(i => i))];
        product_ppg = filters?.product_ppg?.filter((item) => ppg_ids.indexOf(item?.value) > -1 ?? null);

        mother_pack_id = [...new Set(product?.map(i => i?.mother_pack))];
        mother_pack = filters?.mother_pack?.filter((item) => mother_pack_id.includes(item?.value) ?? null);
      }
      bid = [...new Set(brands?.map(i => i.value))];
      if (enabledKPIs?.["OSA"] || enabledKPIs?.["PRO"] || enabledKPIs?.["CS"] || enabledKPIs?.["RR"]) {
        res_category = await getEbuxCategories((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid);
      }
      if (enabledKPIs?.["SOS"] || enabledKPIs?.["OR"]) {
        res_keyword_category = await getEbuxKeywordCategories((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid);
        res_keyword = await getEbuxKeywords((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid, (res_keyword_category?.map(i => i.value) ?? []));
      }
    }
    if (isUseWidget) {
      if (activeClientProject?.client_project_id == 2) {
        setFilters(prevFilters => ({
          ...prevFilters,
          platform: combineFilterWidget?.platforms ?? [],
          brand: combineFilterWidget?.brands ?? [],
          category: combineFilterWidget?.categories ?? [],
          mother_pack: combineFilterWidget?.mother_packs ?? [],
          ...(product?.length === 0 && {
            products: combineFilterWidget?.products ?? [],
          }),
        }));
        if (product?.length == 0) {
          setSelectedFiltersWidget(prevFilters => ({
            ...prevFilters,
            // selectedPlatform: combineFilterWidget?.platforms ?? [],
            selectedPlatform: [],
            selectedBrand: [],
            selectedCategory: [],
            selectedProductId: [],
            selectedMotherPack: []
          }));
        } else {
          // setSelectedFiltersWidget(prevFilters => ({
          //     ...prevFilters,
          //     selectedPlatform: combineFilterWidget?.platforms ?? [],
          //     selectedBrand: combineFilterWidget?.brands ?? [] ,
          //     selectedCategory: combineFilterWidget?.categories ?? [] ,
          //     selectedProductId: combineFilterWidget?.products ?? [] ,
          //     selectedMotherPack: combineFilterWidget?.mother_packs ?? [] 
          // }));
          setSelectedFiltersWidget(prevFilters => ({
            ...prevFilters,
            // selectedPlatform: selectedFiltersWidget?.isUserChangePlatform ? selectedFiltersWidget?.selectedPlatform : ( combineFilterWidget?.platforms ?? []),
            // selectedProductId: combineFilterWidget?.products ?? [] ,
            selectedProductId: product ?? [],
          }));
        }

      } else {
        setSelectedFiltersWidget(prevFilters => ({
          ...prevFilters,
          selectedBrand: brands ?? [],
          selectedProductId: product ?? [],
          selectedCategory: res_category ?? [],
          selectedKeywordCategory: res_keyword_category ?? [],
          selectedKeyword: res_keyword ?? [],
          selectedProduct_ppg: product_ppg ?? [],
          selectedMotherPack: mother_pack ?? []
        }));
      }

    } else {
      setSelectedFilters(prevFilters => ({
        ...prevFilters,
        selectedBrand: brands ?? [],
        selectedProductId: product ?? [],
        selectedCategory: res_category ?? [],
        selectedKeywordCategory: res_keyword_category ?? [],
        selectedKeyword: res_keyword ?? [],
        selectedProduct_ppg: product_ppg ?? [],
        selectedMotherPack: mother_pack ?? []
      }));
    }
  }

  const updateSelectedProductDarkStore = async (product) => {
    let brands, bid, res_category, res_keyword_category, res_keyword, product_ppg = [], mother_pack_id, mother_pack;
    if ((product?.length)) {
      if (product?.length === filtersDarkStore?.products?.length) {
        brands = filtersDarkStore?.brand ?? [];
        product_ppg = filtersDarkStore?.product_ppg ?? [];
        mother_pack = filtersDarkStore?.mother_pack ?? [];
      } else {
        // bid = [...new Set(product?.map(i => i.brand_id))]
        let brand_key = activeClientProject?.client_project_id == 10 ? "sub_brand" : activeClientProject?.client_project_id == 2 ? "brand_name" : "brand_id"

        bid = [...new Set(product?.map(i => i[brand_key]))];
        // if (activeClientProject?.client_project_id == 10) {
        //   brands = filtersDarkStore?.brand?.filter((item) => bid.includes(item?.sub_brand) ?? null);
        // } else {
        brands = filtersDarkStore?.brand?.filter((item) => bid.includes(item?.value) ?? null);
        // }
        // brands = filtersDarkStore?.brand?.filter((item) => bid.includes(item?.value) ?? null);
        const ppg_ids = [...new Set(product?.map(i => i?.["PPG"]).filter(i => i))];
        product_ppg = filtersDarkStore?.product_ppg?.filter((item) => ppg_ids.indexOf(item?.value) > -1 ?? null);

        mother_pack_id = [...new Set(product?.map(i => i?.mother_pack))];
        mother_pack = filtersDarkStore?.mother_pack?.filter((item) => mother_pack_id.includes(item?.value) ?? null);
      }
      bid = [...new Set(brands?.map(i => i.value))];
      if (enabledKPIs?.["OSA"] || enabledKPIs?.["PRO"] || enabledKPIs?.["CS"] || enabledKPIs?.["RR"]) {
        res_category = await getEbuxCategoriesDarkStore((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid);
      }
    }
    console.log('brandsbrandsbrands', brands)
    if (isUseWidget) {
      setSelectedFiltersWidget(prevFilters => ({
        ...prevFilters,
        selectedBrand: brands ?? [],
        selectedProductId: product ?? [],
        selectedCategory: res_category ?? [],
        selectedKeywordCategory: res_keyword_category ?? [],
        selectedKeyword: res_keyword ?? [],
        selectedProduct_ppg: product_ppg ?? [],
        selectedMotherPack: mother_pack ?? []
      }));
    } else {
      setSelectedFilters(prevFilters => ({
        ...prevFilters,
        selectedBrand: brands ?? [],
        selectedProductId: product ?? [],
        selectedCategory: res_category ?? [],
        selectedKeywordCategory: res_keyword_category ?? [],
        selectedKeyword: res_keyword ?? [],
        selectedProduct_ppg: product_ppg ?? [],
        selectedMotherPack: mother_pack ?? []
      }));
    }
  }

  const updateSelectedMSLV2 = async (msl, type = 'filter') => {
    // console.log('typetypetype',type)
    let sub_brands, bid, cid, sub_Categories, res_products;

    // bid = [...new Set(selectedFilters.selectedBrand?.flatMap(i => i?.brand_id) ?? [])];
    // cid = [...new Set(selectedFilters.selectedCategory?.flatMap(i => i?.nielsen_id) ?? [])];
    res_products = await getEbuxProducts((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), [], [], msl);
    if ((res_products?.length)) {
      let brand_key = activeClientProject?.client_project_id == 2 ? "sub_brand_id" : "brand_id";
      bid = [...new Set(res_products?.flatMap(i => i?.[brand_key]) ?? [])];
      const res_category = await getEbuxCategories((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid);
      sub_Categories = getSubCategoryfromCategory(res_category);
      cid = [...new Set(sub_Categories?.flatMap(i => i?.nielsen_id) ?? [])];
      const res_brand = await getEbuxBrands(kpi, true, bid, cid);

      sub_brands = getSubBrandfromBrand(res_brand);
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      products: res_products ?? [],
    }));
    // setMainApiResponse(prevApiResponse => ({
    //   ...prevApiResponse,
    //   res_products: res_products ?? [],
    // }));

    if (isUseWidget) {
      // if(msl=="all"){
      //   setSelectedFiltersWidget(prevFilters => ({
      //     ...prevFilters,
      //       selectedBrand:  [],
      //     // selectedBrand_init: sub_brands ?? [],
      //     selectedCategory:  [],
      //     // selectedCategory_init: sub_Categories ?? [],

      //     selectedProductId: [],
      //     selectedMsl: msl
      //   }));
      // }else{
      //   setSelectedFiltersWidget(prevFilters => ({
      //     ...prevFilters,
      //     selectedBrand: sub_brands ?? [],
      //   // selectedBrand_init: sub_brands ?? [],
      //   selectedCategory: sub_Categories ?? [],
      //   // selectedCategory_init: sub_Categories ?? [],

      //   selectedProductId: res_products ?? [],
      //   selectedMsl: msl
      //   }));
      // }
      if (type == 'header') {
        setSelectedFilters(prevFilters => ({
          ...prevFilters,

          selectedBrand: sub_brands ?? [],
          // selectedBrand_init: sub_brands ?? [],
          selectedCategory: sub_Categories ?? [],
          // selectedCategory_init: sub_Categories ?? [],

          selectedProductId: res_products ?? [],
          selectedMsl: msl
        }));
      }


    } else {
      setSelectedFilters(prevFilters => ({
        ...prevFilters,

        selectedBrand: sub_brands ?? [],
        // selectedBrand_init: sub_brands ?? [],
        selectedCategory: sub_Categories ?? [],
        // selectedCategory_init: sub_Categories ?? [],

        selectedProductId: res_products ?? [],
        selectedMsl: msl
      }));
    }
    setSelectedMsl(msl);
  }
  const updateSelectedSOSOption = async (SOSOption) => {
    setSelectedFilters(prevFilters => ({
      ...prevFilters,
      selected_sos_option: SOSOption
    }));
  }
  const updateSelectedSOSType = async (SOSType) => {
    setSelectedFilters(prevFilters => ({
      ...prevFilters,
      selected_sos_type: SOSType
    }));
  }
  const updateSelectedProductV2 = async (product) => {
    let sub_brands, bid, sub_Categories;
    if ((product?.length)) {
      bid = [...new Set(product?.flatMap(i => i?.brand_id) ?? [])];
      const res_category = await getEbuxCategories((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid);
      sub_Categories = getSubCategoryfromCategory(res_category);
      const cid = [...new Set(sub_Categories?.flatMap(i => i?.nielsen_id) ?? [])];
      const res_brand = await getEbuxBrands(kpi, true, bid, cid);

      sub_brands = getSubBrandfromBrand(res_brand);
    }

    if (isUseWidget) {
      setSelectedFiltersWidget(prevFilters => ({
        ...prevFilters,

        selectedBrand: sub_brands ?? [],
        // selectedBrand_init: sub_brands ?? [],
        selectedCategory: sub_Categories ?? [],
        // selectedCategory_init: sub_Categories ?? [],

        selectedProductId: product ?? []
      }));
    } else {
      setSelectedFilters(prevFilters => ({
        ...prevFilters,

        selectedBrand: sub_brands ?? [],
        // selectedBrand_init: sub_brands ?? [],
        selectedCategory: sub_Categories ?? [],
        // selectedCategory_init: sub_Categories ?? [],

        selectedProductId: product ?? []
      }));
    }
  }
  const updateSelectedProductAndLocationofPlatform = async (platform) => {

    const res_darkstore = await getEbuxDarkstoreLocation(kpi, (platform?.map(i => i.value) ?? []));
    const darkstore = getDarkstorefromDarkstoreLocation(res_darkstore);

    const res_location_new = await getEbuxLocationsNew(kpi, (platform?.map(i => i.value) ?? []), (selectedFilters?.active_location_status));
    let res_product_ppg = [];
    let product = [];
    if (activeClientProject?.client_project_id == 10) {
      res_product_ppg = await getEbuxColPalMtPpg((platform?.map(i => i.value) ?? []), (selectedFilters?.selectedBrand?.map(i => i?.sub_brand) ?? []), (selectedFilters?.selectedCategory?.map(i => i.value) ?? []));
      product = await getEbuxProducts((platform?.map(i => i.value) ?? []), (selectedFilters?.selectedBrand?.map(i => i?.sub_brand) ?? []), (selectedFilters?.selectedCategory?.map(i => i.value) ?? []), selectedMsl);

    } else {
      product = await getEbuxProducts((platform?.map(i => i.value) ?? []), (selectedFilters?.selectedBrand?.map(i => i.value) ?? []), (selectedFilters?.selectedCategory?.map(i => i.value) ?? []), selectedMsl);
    }

    const category_node = await getCategory_node((platform?.map(i => i.value) ?? []));

    const location = getPincodesfromLocation(res_location_new);
    let brands, bid, res_category, res_keyword_category, res_keyword;
    if ((product?.length)) {
      if (product?.length === filters?.products?.length) {
        brands = filters?.brand ?? [];
      } else {
        // bid = [...new Set(product?.map(i => i.brand_id))]
        let brand_key = activeClientProject?.client_project_id == 2 ? "sub_brand_id" : "brand_id"
        bid = [...new Set(product?.map(i => i[brand_key]))];
        brands = filters?.brand?.filter((item) => bid.includes(item?.value) ?? null);
      }
      bid = [...new Set(brands?.map(i => i.value))];
      if (enabledKPIs?.["OSA"] || enabledKPIs?.["PRO"] || enabledKPIs?.["CS"] || enabledKPIs?.["RR"]) {
        res_category = await getEbuxCategories((selectedFilters.selectedPlatform?.map(i => i.value) ?? []), bid);
      }
      if (enabledKPIs?.["SOS"] || enabledKPIs?.["OR"]) {
        res_keyword_category = await getEbuxKeywordCategories((platform?.map(i => i.value) ?? []), bid);
        res_keyword = await getEbuxKeywords((platform?.map(i => i.value) ?? []), bid, (res_keyword_category?.map(i => i.value) ?? []));
      }
    }
    // console.log('brandsbrandsbrandsbrands', brands)
    if (isUseWidget) {
      setSelectedFiltersWidget(prevFilters => ({
        ...prevFilters,
        selectedPlatform: platform ?? [],
        selectedLocation: location ?? [],
        // selectedLocationpincode: location ?? [],
        selectedDarkstore: darkstore ?? [],
        // selectedDarkstoreID: darkstore ?? [],
        selectedBrand: brands ?? [],
        selectedProductId: product ?? [],
        selectedCategory: res_category ?? [],
        selectedKeywordCategory: res_keyword_category ?? [],
        selectedKeyword: res_keyword ?? [],
        selectCategory_node: category_node ?? [],
        selectedProduct_ppg: res_product_ppg ?? []
      }));
      setSelectedFilters(prevFilters => ({
        ...prevFilters,
        selectedPlatform: platform ?? []
      }));
    } else {
      setSelectedFilters(prevFilters => ({
        ...prevFilters,
        selectedPlatform: platform ?? [],
        selectedLocation: location ?? [],
        // selectedLocationpincode: location ?? [],
        selectedDarkstore: darkstore ?? [],
        // selectedDarkstoreID: darkstore ?? [],
        selectedBrand: brands ?? [],
        selectedProductId: product ?? [],
        selectedCategory: res_category ?? [],
        selectedKeywordCategory: res_keyword_category ?? [],
        selectedKeyword: res_keyword ?? [],
        selectCategory_node: category_node ?? [],
        selectedProduct_ppg: res_product_ppg ?? []

      }));
    }
  }

  const updateSelectedProductAndLocationofPlatformWidget = async (platform) => {

    const _activeClientProject = JSON.parse(localStorage.getItem("active_client_project")) || {};
    setActiveClientProject(_activeClientProject);
    // console.log('platformplatformplatformplatform', platform)
    const tagSkuList = selectedFiltersWidget.selectedTags?.flatMap(tag => tag?.tag_details?.map(d => d?.sku_or_keyword) ?? []) ?? [];
    let combineFilterWidget;
    if (_activeClientProject?.isFilterDateWise) {
      const dateRangeData = { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks }
      combineFilterWidget = await getCombineFilterWidget("OSA", (platform?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedBrand?.flatMap(i => i.id_in_db) ?? []), (selectedFiltersWidget.selectedCategory?.flatMap(i => i.id_in_db) ?? []), (selectedFiltersWidget.selectedMotherPack?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedProductId?.map(i => i.value) ?? []), selectedMsl, tagSkuList, dateRangeData);
    } else {
      combineFilterWidget = await getCombineFilterWidget("OSA", (platform?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedBrand?.flatMap(i => i.id_in_db) ?? []), (selectedFiltersWidget.selectedCategory?.flatMap(i => i.id_in_db) ?? []), (selectedFiltersWidget.selectedMotherPack?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedProductId?.map(i => i.value) ?? []), selectedMsl, tagSkuList);
    }

    // let combineFilterWidgetKW = await getCombineFilterWidgetKW("SOS", (platform?.map(i => i.value) ?? []), []);
    const tagKeywordList = selectedFiltersWidget.selectedTagsKW?.flatMap(tag => tag?.tag_details?.map(d => d?.sku_or_keyword) ?? []) ?? [];
    let combineFilterWidgetKW = await getCombineFilterWidgetKW("SOS", (platform?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedBrand?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedKeywordCategory?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedKeyword?.map(i => i.value) ?? []), (tagKeywordList ?? []));
    if (platform?.length > 0) {

      if ([2, 101, 102, 103].indexOf(activeClientProject?.client_project_id) > -1 || activeClientProject?.useCombineFilter) {

        setSelectedFiltersWidget(prevFilters => ({
          ...prevFilters,
          selectedPlatform: (kpi == "SOS" || kpi == "OR") ? combineFilterWidgetKW?.platforms ?? [] : combineFilterWidget?.platforms ?? [],
          isUserChangePlatform: true
        }));

        setFilters(prevFilters => ({
          ...prevFilters,
          brand: (kpi == "SOS" || kpi == "OR") ? combineFilterWidgetKW?.brands ?? [] : combineFilterWidget?.brands ?? [],
          category: combineFilterWidget?.categories ?? [],
          mother_pack: combineFilterWidget?.mother_packs ?? [],
          products: combineFilterWidget?.products ?? [],

          keywordCategory: combineFilterWidgetKW?.keyword_categories ?? [],
          keyword: combineFilterWidgetKW?.keywords ?? [],

        }));
      } else {
        const res_darkstore = await getEbuxDarkstoreLocation(kpi, (platform?.map(i => i.value) ?? []));
        const darkstore = getDarkstorefromDarkstoreLocation(res_darkstore);

        const res_location_new = await getEbuxLocationsNew(kpi, (platform?.map(i => i.value) ?? []), (selectedFilters?.active_location_status));
        let res_product_ppg = [];
        let product = [];
        product = await getEbuxProducts((platform?.map(i => i.value) ?? []), (filters?.brand?.map(i => i.value) ?? []), (filters?.category?.map(i => i.value) ?? []), selectedMsl);


        const category_node = await getCategory_node((platform?.map(i => i.value) ?? []));

        const location = getPincodesfromLocation(res_location_new);
        let brands, bid, res_category, res_keyword_category, res_keyword;
        if ((product?.length)) {
          if (product?.length === filters?.products?.length) {
            brands = filters?.brand ?? [];
          } else {
            // bid = [...new Set(product?.map(i => i.brand_id))]
            let brand_key = activeClientProject?.client_project_id == 2 ? "sub_brand_id" : "brand_id"
            bid = [...new Set(product?.map(i => i[brand_key]))];
            brands = filters?.brand?.filter((item) => bid.includes(item?.value) ?? null);
          }
          bid = [...new Set(brands?.map(i => i.value))];
          if (enabledKPIs?.["OSA"] || enabledKPIs?.["PRO"] || enabledKPIs?.["CS"] || enabledKPIs?.["RR"]) {
            res_category = await getEbuxCategories((platform?.map(i => i.value) ?? []), bid);
          }
          if (enabledKPIs?.["SOS"] || enabledKPIs?.["OR"]) {
            res_keyword_category = await getEbuxKeywordCategories((platform?.map(i => i.value) ?? []), bid);
            res_keyword = await getEbuxKeywords((platform?.map(i => i.value) ?? []), bid, (res_keyword_category?.map(i => i.value) ?? []));
          }
        }

        setSelectedFiltersWidget(prevFilters => ({
          ...prevFilters,
          selectedPlatform: platform ?? [],
          selectedLocation: location ?? [],
          // selectedLocationpincode: location ?? [],
          selectedDarkstore: darkstore ?? [],
          // selectedDarkstoreID: darkstore ?? [],
          selectedBrand: brands ?? [],
          selectedProductId: product ?? [],
          selectedCategory: res_category ?? [],
          selectedKeywordCategory: res_keyword_category ?? [],
          selectedKeyword: res_keyword ?? [],
          selectCategory_node: category_node ?? [],
          selectedProduct_ppg: res_product_ppg ?? []
        }));
      }

    } else {
      setSelectedFiltersWidget(prevFilters => ({
        ...prevFilters,
        selectedPlatform: [],
        selectedLocation: [],
        selectedDarkstore: [],
        selectedBrand: [],
        selectedProductId: [],
        selectedCategory: [],
        selectedKeywordCategory: [],
        selectedKeyword: [],
        selectedProduct_ppg: [],
        selectedMotherPack: []
      }));
      if (activeClientProject?.client_project_id == 2 || activeClientProject?.useCombineFilter) {
        setFilters(prevFilters => ({
          ...prevFilters,
          platform: (kpi == "SOS" || kpi == "OR") ? combineFilterWidgetKW?.platforms ?? [] : combineFilterWidget?.platforms ?? [],
          brand: (kpi == "SOS" || kpi == "OR") ? combineFilterWidgetKW?.brands ?? [] : combineFilterWidget?.brands ?? [],
          category: combineFilterWidget?.categories ?? [],
          mother_pack: combineFilterWidget?.mother_packs ?? [],
          products: combineFilterWidget?.products ?? [],

          keywordCategory: combineFilterWidgetKW?.keyword_categories ?? [],
          keyword: combineFilterWidgetKW?.keywords ?? [],
        }));
      }
    }


  }

  const updateSelectedProductAndLocationofPlatformV2 = async (platform) => {

    const pf_id = (platform?.map(i => i.value) ?? []);

    const res_darkstore = await getEbuxDarkstoreLocation(kpi, pf_id);
    const darkstore = getDarkstorefromDarkstoreLocation(res_darkstore);

    const res_location_new = await getEbuxLocationsNew(kpi, pf_id, (selectedFilters?.active_location_status));
    const location = getPincodesfromLocation(res_location_new);

    if ((kpi == "SOS" || kpi == "OR")) {
      if (enabledKPIs?.["SOS"] || enabledKPIs?.["OR"]) {
        const res_keyword = await getEbuxKeywords(pf_id, [], []);
        const keyword = getKeywordsfromKeywordIfWithKeywordType(res_keyword);
        if ((keyword?.length)) {
          const bid = [...new Set(keyword?.flatMap(i => i?.brand_id) ?? [])];
          console.log({ bid }, "bid from keyword");

          const res_keyword_category = await getEbuxKeywordCategories(pf_id, bid);

          const sub_Categories = getSubCategoryfromCategory(res_keyword_category);
          const cid = [...new Set(sub_Categories?.flatMap(i => i?.nielsen_id) ?? [])];
          const res_brand = await getEbuxBrands(kpi, true, bid, cid);

          const sub_brands = getSubBrandfromBrand(res_brand);
          setSelectedFilters(prevFilters => ({
            ...prevFilters,
            selectedBrand: sub_brands ?? [],
            selectedKeywordCategory: sub_Categories ?? [],
            selectedKeyword: keyword ?? [],

            selectedPlatform: platform ?? [],
            selectedLocation: location ?? [],
            selectedDarkstore: darkstore ?? []
          }));
        }
      }

    } else if ((kpi == "OSA" || kpi == "PRO" || kpi == "CS" || kpi == "RR" || kpi == "SOD")) {

      const product = await getEbuxProducts(pf_id, [], [], selectedMsl);
      if ((product?.length)) {
        const bid = [...new Set(product?.flatMap(i => i?.brand_id) ?? [])];
        const res_category = await getEbuxCategories(pf_id, bid);
        const sub_Categories = getSubCategoryfromCategory(res_category);
        const cid = [...new Set(sub_Categories?.flatMap(i => i?.nielsen_id) ?? [])];
        const res_brand = await getEbuxBrands(kpi, true, bid, cid);

        const sub_brands = getSubBrandfromBrand(res_brand);

        setSelectedFilters(prevFilters => ({
          ...prevFilters,
          selectedBrand: sub_brands ?? [],
          selectedCategory: sub_Categories ?? [],
          selectedProductId: product ?? [],

          selectedPlatform: platform ?? [],
          selectedLocation: location ?? [],
          selectedDarkstore: darkstore ?? []
        }));
      }
    }

  }
  const handlePlatformTabClick = async (item) => {
    const activeClientProject = JSON.parse(localStorage.getItem("active_client_project")) || {};
    let platform;
    if (selectedFilters.selectedPlatform.includes(item)) {
      platform = selectedFilters.selectedPlatform.filter((selectedItem) => selectedItem !== item);
    } else {
      platform = [...selectedFilters.selectedPlatform, item];
    }
    if (activeClientProject?.useCombineFilter) {
      updateSelectedProductAndLocationofPlatformWidget(platform ?? []);
    } else if (activeClientProject?.brandTreeSelect) {
      updateSelectedProductAndLocationofPlatformV2(platform ?? []);
    } else {
      updateSelectedProductAndLocationofPlatform(platform ?? []);
    }
  };

  const handlePlatformTabClickNew = async (item, isDoubleClick = false) => {
    // console.log("clickedsasasassa", selectedFilters.selectedPlatform,filters.platform)
    // console.log("clickedsasasassa", selectedFilters.selectedPlatform)
    const activeClientProject =
      JSON.parse(localStorage.getItem("active_client_project")) || {};
    let platform;

    if (isDoubleClick) {
      platform = [...filters.platform];
    } else {

      const selected = selectedFilters.selectedPlatform;
      if (selected.length === filters.platform.length) {
        // 🔹 Case: all selected initially → pick only clicked item
        platform = [item];
      } else if (selected.includes(item)) {
        // 🔹 Toggle OFF: remove clicked item
        platform = selected.filter((p) => p !== item);
      } else {
        // 🔹 Toggle ON: add clicked item
        platform = [...selected, item];
      }
      // const alreadySelected = selectedFilters.selectedPlatform.includes(item);
      // if (alreadySelected) {
      //   platform = selectedFilters.selectedPlatform.filter((selectedItem) => selectedItem == item);
      //   // 🔹 If already selected, keep as is (don’t unselect on second click)
      // } else {
      //   platform = [...selectedFilters.selectedPlatform, item];
      // }
    }

    if (activeClientProject?.useCombineFilter) {
      updateSelectedProductAndLocationofPlatformWidget(platform ?? []);
    } else if (activeClientProject?.brandTreeSelect) {
      updateSelectedProductAndLocationofPlatformV2(platform ?? []);
    } else {
      updateSelectedProductAndLocationofPlatform(platform ?? []);
    }
  };

  const handlePlatformTabClickNewDarkStore = async (item, isDoubleClick = false) => {
    // console.log("clickedsasasassa", selectedFilters.selectedPlatform,filtersDarkStore.platform)
    let platform;
    if (isDoubleClick) {
      platform = [...filtersDarkStore.platform];
    } else {

      const selected = selectedFilters.selectedPlatform;
      if (selected.length === filtersDarkStore.platform.length) {
        // 🔹 Case: all selected initially → pick only clicked item
        platform = [item];
      } else if (selected.includes(item)) {
        // 🔹 Toggle OFF: remove clicked item
        platform = selected.filter((p) => p !== item);
      } else {
        // 🔹 Toggle ON: add clicked item
        platform = [...selected, item];
      }
      // const alreadySelected = selectedFilters.selectedPlatform.includes(item);
      // if (alreadySelected) {
      //   platform = selectedFilters.selectedPlatform.filter((selectedItem) => selectedItem == item);
      //   // 🔹 If already selected, keep as is (don’t unselect on second click)
      // } else {
      //   platform = [...selectedFilters.selectedPlatform, item];
      // }
    }
    // console.log("clickedsasasassaplatform", platform)

    getDistinctFiltersDarkStoreFn('platform', platform ?? []);
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      selectedPlatform: platform ?? [],
    }));
  };


  const [selectedKpiDragPosition, setSelectedKpiDragPosition] = useState([]);
  const updateKpiDragPosition = async (OSAPostion) => {
    setSelectedKpiDragPosition(prevFilters => ({
      ...prevFilters,
      OSAPostion
    }));
    console.log(selectedKpiDragPosition)
  }

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (kpi) {
        // console.log({ kpi }, "setFiltersLoading - false");
        // setHeaderFilterChips({})
        try {
          // Fetch platform data
          // let res_platform = await getEbuxPlatforms(kpi, defaultUserPlatform.map((i) => i?.value ?? ''));
          let res_platform = (['SOS', 'OR'].includes(kpi)) ?
            (mainApiResponse?.res_platform_kw ?? []) :
            (['SOM'].includes(kpi) && isUseWidget) ?
              (mainApiResponse?.res_platform_som ?? []) :
              (mainApiResponse?.res_platform_pdp ?? []);

          const getOSAPlateform = await getTabsPlateform();

          let storedPlatformPosition;
          if (kpi === "OSA") {
            storedPlatformPosition = getOSAPlateform?.userRecord?.osa_plateform?.PlatformPosition;
          } else if (kpi === "SOS") {
            storedPlatformPosition = getOSAPlateform?.userRecord?.sos_plateform?.PlatformPosition;
          } else if (kpi === "OR") {
            storedPlatformPosition = getOSAPlateform?.userRecord?.org_plateform?.PlatformPosition;
          } else if (kpi === "CS") {
            storedPlatformPosition = getOSAPlateform?.userRecord?.cs_plateform?.PlatformPosition;
          } else if (kpi === "PRO") {
            storedPlatformPosition = getOSAPlateform?.userRecord?.pro_plateform?.PlatformPosition;
          } else if (kpi === "RR") {
            storedPlatformPosition = getOSAPlateform?.userRecord?.rr_plateform?.PlatformPosition;
          } else if (kpi === "SOM") {
            storedPlatformPosition = getOSAPlateform?.userRecord?.som_plateform?.PlatformPosition;
          } else {
            storedPlatformPosition = getOSAPlateform?.userRecord?.osa_plateform?.PlatformPosition;
          }

          // console.log('sos called....', storedPlatformPosition);

          if (!storedPlatformPosition) {
            savePlatformPositions(res_platform ?? []);
          } else {
            res_platform = loadAndRearrangePlatformPositions(res_platform ?? [], storedPlatformPosition ?? []);
          }

          if (isMounted) {

            let sortPlatformpos = res_platform?.map((res) => {
              return res?.label?.trim()
            })
            setsortPlatforms(sortPlatformpos)

            setFilters((prevFilters) => {
              const updatedFilters = {
                ...prevFilters,
                platform: res_platform ?? [],
              };

              // if (!(activeClientProject?.client_project_id === 2 && reactLocationPath?.pathname === "/dashboard-widget")) {
              if (selectedFilters?.selectedPlatform?.length === 0) {
                setSelectedFilters((prevSelectedFilters) => ({
                  ...prevSelectedFilters,
                  selectedPlatform: res_platform ?? [],
                }));
              }
              // }                

              return updatedFilters;
            });

            setFiltersLoading(false);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [kpi, filtersDarkStore?.tab_type, selectedFilters?.selectedWeeks, selectedFilters?.selectedDateRange]);



  const initKpiSet = async (init_kpi) => {
    const defaultTab = (([2].indexOf(activeClientProject?.client_project_id) > -1) && isUseWidget) ? 'trend_analysis' : 'executive_summary';
    //console.log("DEBUG initKpiSet: resetting tab_type to =", defaultTab);
    setFiltersDarkStore(prevFilters => ({
      ...prevFilters,
      tab_type: defaultTab
    }))
    if (isUseWidget) {
      setSelectedFiltersWidget(prevSelectedFilters => ({
        ...prevSelectedFilters,
        isUserChangePlatform: false,
        selectedBrand: [],
        selectedCategory: [],
        selectedProductId: [],
        selectedMotherPack: [],
        selectedLocation: [],
        selectedOSARemarks: [],
      }));
      setSelectedFilters(prevSelectedFilters => ({
        ...prevSelectedFilters,
        selectedBrand: [],
        selectedCategory: [],
        selectedProductId: [],
        selectedMotherPack: [],
        selectedLocation: [],
        selectedOSARemarks: [],
      }));
    }
    console.log('init_kpiinit_kpi', init_kpi)
    if (init_kpi == "GLOBALVIEW") {
      setFiltersLoading(true);
      await initFitersLoadWidgetGlobalView(init_kpi, true);
      setKpi(init_kpi);
      setFiltersLoading(false);
      return;
    }
    if (init_kpi == "BUYBOX") {
      setFiltersLoading(true);
      await initFitersLoadWidgetBUYBOX(init_kpi, true);
      setKpi(init_kpi);
      setFiltersLoading(false);
      return;
    }
    if (init_kpi) {
      let kpiType = "";
      if (['SOS', 'OR'].includes(init_kpi)) {
        kpiType = "kw";
      } else if (['SOM'].includes(init_kpi)) {
        kpiType = "SOM";
      } else {
        kpiType = "pdp";
      }

      // eslint-disable-next-line no-console
      // console.log({ init_kpi }, 'pppppppppppppppppppppppppppp');
      if (init_kpi == "RR" || init_kpi == "OR") {
        setPercentageIcon("");
      } else {
        setPercentageIcon("%");
      }
      // if (useKpiRef.current === undefined || useKpiTypeRef.current != kpiType) {
      //   useKpiTypeRef.current = kpiType;
      //   setFiltersLoading(true);
      //   await initFitersLoad(defaultUserPlatform, init_kpi);
      //   setFiltersLoading(false);
      // }
      const firstTimeLoad = useKpiRef.current === undefined;
      if (firstTimeLoad || useKpiTypeRef.current != kpiType) {
        useKpiTypeRef.current = kpiType;
        setFiltersLoading(true);
        setEbuxLoading(true);
        if (isUseWidget) {
          await initFitersLoadWidget(init_kpi, kpiType, firstTimeLoad);
          if (activeClientProject?.isUseWidgetDarkstore) {
            await initFitersLoadDarkStore();
          }
        } else {
          await initFitersLoad(init_kpi, kpiType, firstTimeLoad);
        }
        setFiltersLoading(false);
        setEbuxLoading(false);
      }
      if (useKpiRef.current != init_kpi) {
        setFiltersLoading(true);
        useKpiRef.current = init_kpi;
        setKpi(init_kpi);
      }


    }

  }
  const [headerFilterChips, setHeaderFilterChips] = useState({});
  const [isWidgetFilterActive, setIsWidgetFilterActive] = useState(false);
  const [selectedHeaderOpen, setSelectedHeaderOpen] = useState({ edit: false });
  const [ebuxLoading, setEbuxLoading] = useState(false);
  const [tempFilterData, setTempFilterData] = useState({});
  const [errorToSetFilterData, setErrorToSetFilterData] = useState(false);

  return (
    <Provider value={{
      updateCategorynode,
      updatecategory_som,
      sortPlatforms,
      activeClientProject,
      clientCustomizeColumnsComprehensiveBreakdown,
      uniqueColorsMap,
      platformColor,
      brandSearchValue,
      setBrandSearchValue,
      tempBrand, tempCategory, tempKeyword,
      handlePlatformTabClick,
      handlePlatformTabClickNew, // new function added here for use in new header
      handlePlatformTabClickNewDarkStore,// new function for dark store 
      averagePercentageData,
      setAveragePercentageData,
      getAveragePercentage,
      percentageIcon,
      kpiMap,
      defaultOption,
      loading,
      setLoading,
      filtersLoading,
      setFiltersLoading,
      loadingReport,
      setLoadingReport,
      error,
      setError,
      kpi,
      // setKpi,
      initKpiSet,
      filters, setFilters,
      filtersDarkStore, setFiltersDarkStore,
      selectedFilters, setSelectedFilters,
      selectedFiltersDarkStore, setSelectedFiltersDarkStore,
      updateSelectedFilters,
      updateSelectedBrand, updateSelectedCategory, updateSelectedKeywordCategory, updateSelectedKeyword,
      updateSelectedProduct, updateSelectedProdcutPPG, updateSelectedMotherPack,
      savePlatformPositions, loadAndRearrangePlatformPositions,
      updateSelectedCategoryV2, updateSelectedBrandV2, updateSelectedProductV2,
      updateSelectedKeywordBrandV2, updateSelectedKeywordCategoryV2, updateSelectedKeywordV2,
      updateSelectedMSLV2, selectedMsl, updateSelectedSOSOption, updateSelectedSOSType,
      tagList, setTagList, selectedKpiDragPosition, updateKpiDragPosition,
      headerFilterChips, setHeaderFilterChips, selectedHeaderOpen, setSelectedHeaderOpen, updateSelectedProductAndLocationofPlatform,
      selectedFiltersWidget, setSelectedFiltersWidget, initFitersLoadDarkStore, updateSelectedProductAndLocationofPlatformWidget,
      updateSelectedBrandDarkStore, updateSelectedCategoryDarkStore, updateSelectedMotherPackDarkStore, updateSelectedProductDarkStore,
      getDistinctFiltersDarkStoreFn, isWidgetFilterActive, setIsWidgetFilterActive, mainApiResponse, setMainApiResponse, getDistinctFiltersSomFn,
      // updateSelectedBrandWidget
      isDarkstoreFilter, setIsDarkstoreFilter, setActiveClientProject, getCombineFilterWidget, setSelectedMsl, getPincodesfromLocation,
      //, selectedWeeksForTrendAnalysis, setSelectedWeeksForTrendAnalysis

      //alert
      alertSearch,
      setAlertSearch,
      alertSort,
      setAlertSort,
      alertFilters,
      setAlertFilters,
      defaultAlertFilters,
      getDarkstorefromDarkstoreLocation,
      ebuxLoading, setEbuxLoading,
      tempFilterData, setTempFilterData,
      errorToSetFilterData, setErrorToSetFilterData

    }}
      {...props}
    />
  );
};

export const useEbuxContext = () => {
  return useContext(EbuxContext);
};
export const myEbuxContext = EbuxContext;