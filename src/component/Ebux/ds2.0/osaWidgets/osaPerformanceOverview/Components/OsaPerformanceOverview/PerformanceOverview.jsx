import React, { useState, useEffect, useRef } from "react";
import GraphicalAnalysis from "./GraphicalAnalysis";
import PerformanceTable from "./PerformanceTable";
import PerformanceTableGraphical from "./PerformanceTableGraphical";
import IndiaMap from "../MapComponent/IndiaMap/IndiaMap";
import { useEbuxContext } from "../../../../../Context/EbuxProvider";
import { fetchDrillDownData } from "../../services/drillDown.service";
import { isEqual } from "lodash";
import { MdOutlineCategory } from "react-icons/md";

function PerformanceOverview({activeCard,metrics}) {
  const {
          kpi,kpiMap,selectedFilters,
          filters,activeClientProject
      } = useEbuxContext();
  const Country = activeClientProject?.country??"India";
  const mapCenter=activeClientProject?.mapCenter??[22.5937, 78.9629];
  const maxBounds=activeClientProject?.maxBounds??[[6, 68], [38, 98]];
  //eslint-disable-next-line
  const [locationStepValue, setLocationStepValue] = useState(Country);
  const [loadingReport, setLoadingReport] = useState(false);
  const [darkStoreLocationData, setDarkStoreLocationData] = useState([]);


  const [locationSteps, setLocationSteps] = useState(
    Country=="India"?{ "Country": Country, "Region": null, "State": null, "City": null, "Pincode": null  }:
    { "Country": Country, "Region": null, "City": null, "Pincode": null }
  );
  const updateLocationSteps = (key, value) => {
    // console.log('ssssssssss',key,value)
    // alert("update_locationSteps",key,value);
    const allLocationSteps = Object.keys(locationSteps);
    if (key == "Country") { value = Country; }
    const index = allLocationSteps?.indexOf(key);
    const nextSteps = {};
    for (let i = index + 1; i < allLocationSteps.length; i++) {
      nextSteps[allLocationSteps[i]] = null;
    }
    setLocationSteps((prevState) => {
      return {
        ...prevState,
        [key]: value,
        ...nextSteps
      }
    });
  }

    const previousSelectedFilters = useRef("");
  useEffect(() => {
    async function fetchData() {
       if (!activeCard?.label || !activeCard?.type) return;
      console.log('locationStepslocationSteps', locationSteps)
      setLoadingReport(true);
      let drillDown="region";
      let newSelectedFilters={...selectedFilters};
      if (locationSteps["Region"] == null) {
        drillDown="region";        
      }else if (Country=="India"&&locationSteps["State"] == null && locationSteps["Region"] != null) {
        drillDown="state";
        newSelectedFilters.selectedRegionNames=[{value:locationSteps["Region"]?.replace(" Zone","")}];
      }else if ((locationSteps["City"] == null) &&( locationSteps["Region"] != null || locationSteps["State"] != null)) {
        drillDown="city";
        newSelectedFilters.selectedRegionNames=[{value:locationSteps["Region"]?.replace(" Zone","")}];
        if(Country=="India"){newSelectedFilters.selectedStateNames=[{value:locationSteps["State"]}];}
      }else if ((locationSteps["Pincode"] == null) &&( locationSteps["Region"] != null || locationSteps["State"] != null)&&(locationSteps["City"] != null)) {
        drillDown="pincode";
        newSelectedFilters.selectedRegionNames=[{value:locationSteps["Region"]?.replace(" Zone","")}];
        if(Country=="India"){newSelectedFilters.selectedStateNames=[{value:locationSteps["State"]}];}
        newSelectedFilters.selectedCityNames=[{value:locationSteps["City"]}];
      }
      const performanceOf = activeCard?.type ?? 'brand';
          let payload = {
            kpi,
            drillDown,
            breakdown: [drillDown],
            matrix: metrics?.filter(column => column?.type == "parameters")?.map(column => column.value) ?? ['osa', 'wt_osa', 'avg_offtake_osa'],
            
                  key: performanceOf,
                  value: activeCard?.label ?? "",
            selectedFilters:newSelectedFilters,
            filters
          };
      
          const response = await fetchDrillDownData(payload);
      // const currentData = await fetchMSDarkStoreLocationData(
      //     { getCache, setCache, clearCache },
      //     kpi,
      //     selectedFilters,
      //     locationSteps,
      //     filters?.darkstore ?? [],
      //     false
      // );
      // let currentData;
      // if (locationSteps["Region"] == null) {
      //   currentData = { "data": [{ "type": "Region", "location": "North Zone", "location_key": "North Zone", "location_overall_ms": 40.63971891901572, "pf_data": [{ "location": "North Zone", "pf_overall_ms": 40.63971891901572, "pf_name": "All", "ms": 2.4578706808582718, "osa": 73.93472348141432,"prev":79.93472348141432, "oos": 7.550247576539507, "competition_ms": 97.54212931914172, "competition_osa": 71.45148110316649, "competition_oos": 7.879526727953694 }, { "location": "North Zone", "pf_overall_ms": 91.02260255013724, "pf_name": "Blinkit", "ms": 2.527357644178908, "osa": 73.17832064920321, "oos": 7.736618593112728, "competition_ms": 97.4726423558211, "competition_osa": 72.85515807828004, "competition_oos": 7.377165349258193 }, { "location": "North Zone", "pf_overall_ms": 2.274301562885161, "pf_name": "Zepto", "ms": 2.8822282773236454, "osa": 78.2483156881617, "oos": 5.9398460057747835, "competition_ms": 97.11777172267637, "competition_osa": 78.40119566973664, "competition_oos": 6.050546668821027 }, { "location": "North Zone", "pf_overall_ms": 6.70309588697761, "pf_name": "Swiggy Instamart", "ms": 1.3703133025166923, "osa": 74.01894451962112, "oos": 10.608930987821381, "competition_ms": 98.62968669748331, "competition_osa": 46.79523658973548, "competition_oos": 15.673348087258931 }] }, { "type": "Region", "location": "South Zone", "location_key": "South Zone", "location_overall_ms": 26.50575101185573, "pf_data": [{ "location": "South Zone", "pf_overall_ms": 26.50575101185573, "pf_name": "All", "ms": 2.853619758070476, "osa": 86.84993109450933, "oos": 4.594182925944731, "competition_ms": 97.14638024192952, "competition_osa": 75.42606338783027, "competition_oos": 7.180292308765669 }, { "location": "South Zone", "pf_overall_ms": 56.51222844160478, "pf_name": "Blinkit", "ms": 3.076813863036014, "osa": 86.60714285714286, "oos": 5.048172757475083, "competition_ms": 96.92318613696399, "competition_osa": 77.71447896770015, "competition_oos": 6.576357894436003 }, { "location": "South Zone", "pf_overall_ms": 6.232145081702417, "pf_name": "Zepto", "ms": 5.349640872746984, "osa": 89.12316417042315, "oos": 2.9681547186273085, "competition_ms": 94.65035912725301, "competition_osa": 82.01003760400319, "competition_oos": 4.916234862168004 }, { "location": "South Zone", "pf_overall_ms": 37.2556264766928, "pf_name": "Swiggy Instamart", "ms": 2.09752558856534, "osa": 79.94269340974212, "oos": 8.890162368672398, "competition_ms": 97.90247441143465, "competition_osa": 64.72077648051766, "competition_oos": 10.56133852237383 }] }, { "type": "Region", "location": "West Zone", "location_key": "West Zone", "location_overall_ms": 21.649347218739926, "pf_data": [{ "location": "West Zone", "pf_overall_ms": 21.649347218739926, "pf_name": "All", "ms": 2.342089888686103, "osa": 72.03212487981449, "oos": 7.754086307335558, "competition_ms": 97.6579101113139, "competition_osa": 61.82168792956967, "competition_oos": 10.068856155361562 }, { "location": "West Zone", "pf_overall_ms": 79.5884022604011, "pf_name": "Blinkit", "ms": 2.439301664636622, "osa": 74.51208594449417, "oos": 6.914950760966875, "competition_ms": 97.56069833536338, "competition_osa": 67.67427393197673, "competition_oos": 8.41812441067495 }, { "location": "West Zone", "pf_overall_ms": 15.308116659859266, "pf_name": "Swiggy Instamart", "ms": 1.7646959487984868, "osa": 38.58901515151515, "oos": 17.963068181818183, "competition_ms": 98.23530405120151, "competition_osa": 28.448764328989235, "competition_oos": 18.87094102776446 }, { "location": "West Zone", "pf_overall_ms": 5.10348107973963, "pf_name": "Zepto", "ms": 2.5579981764765476, "osa": 81.79131620822915, "oos": 4.983405319390771, "competition_ms": 97.44200182352346, "competition_osa": 80.33966813217984, "competition_oos": 5.508320332813312 }] }, { "type": "Region", "location": "East Zone", "location_key": "East Zone", "location_overall_ms": 11.04120401876858, "pf_data": [{ "location": "East Zone", "pf_overall_ms": 11.04120401876858, "pf_name": "All", "ms": 2.2434435286842453, "osa": 76.49291497975709, "oos": 6.8618421052631575, "competition_ms": 97.75655647131576, "competition_osa": 67.76615330342082, "competition_oos": 8.73456878589776 }, { "location": "East Zone", "pf_overall_ms": 75.76411909613454, "pf_name": "Blinkit", "ms": 2.314145793192036, "osa": 75.09908667930381, "oos": 6.861278648974668, "competition_ms": 97.68585420680796, "competition_osa": 72.78385955543689, "competition_oos": 7.164591816300647 }, { "location": "East Zone", "pf_overall_ms": 21.386210881664184, "pf_name": "Swiggy Instamart", "ms": 1.9506067500948046, "osa": 76.38121546961327, "oos": 11.218232044198896, "competition_ms": 98.0493932499052, "competition_osa": 44.38654002409571, "competition_oos": 15.788854333025132 }, { "location": "East Zone", "pf_overall_ms": 2.849670022201271, "pf_name": "Zepto", "ms": 2.5613660618996796, "osa": 82.42556281771968, "oos": 4.5737109658678285, "competition_ms": 97.43863393810031, "competition_osa": 76.77267282352487, "competition_oos": 6.276363074307353 }] }, { "type": "Region", "location": "APS Zone", "location_key": "APS Zone", "location_overall_ms": 0.1639788316200437, "pf_data": [{ "location": "APS Zone", "pf_overall_ms": 100, "pf_name": "Blinkit", "ms": 1.023890784982935, "osa": 60.317460317460316, "oos": 9.047619047619047, "competition_ms": 98.97610921501706, "competition_osa": 54.95495495495496, "competition_oos": 10.780641106222502 }] }], "summaryData": [{ "label": "Total Location", "value": 5, "key": "total_location" }, { "label": "Net Platform", "value": 3, "key": "net_platform" }, { "label": "Avg OOS", "value": 6.537585643576427, "key": "oos" }, { "label": "Avg OSA", "value": 78.08134006290688, "key": "osa" }, { "label": "Avg MS", "value": 2.5116743973638025, "key": "ms" }, { "label": "Comp. Avg OOS", "value": 8.346573872677544, "key": "competition_oos" }, { "label": "Comp. Avg OSA", "value": 69.6480369746157, "key": "competition_osa" }, { "label": "Comp. Avg MS", "value": 97.4883256026362, "key": "competition_ms" }] }
      // }
      // if (locationSteps["State"] == null && locationSteps["Region"] != null) {
      //   currentData = { "data": [{ "type": "State", "location": "Karnataka", "location_key": "Karnataka", "location_overall_ms": 99.87436894146859, "pf_data": [{ "location": "Karnataka", "pf_overall_ms": 99.87436894146859, "pf_name": "All", "ms": 2.85615224919347, "osa": 86.82429974536196, "oos": 4.6045107311749724, "competition_ms": 97.14384775080653, "competition_osa": 75.40189820347841, "competition_oos": 7.1899073824449085 }, { "location": "Karnataka", "pf_overall_ms": 56.45752557006769, "pf_name": "Blinkit", "ms": 3.081796803618771, "osa": 86.5312107247591, "oos": 5.081901968998743, "competition_ms": 96.91820319638123, "competition_osa": 77.68083336938703, "competition_oos": 6.592569090917832 }, { "location": "Karnataka", "pf_overall_ms": 6.239984440206844, "pf_name": "Zepto", "ms": 5.349640872746984, "osa": 89.12316417042315, "oos": 2.9681547186273085, "competition_ms": 94.65035912725301, "competition_osa": 82.01003760400319, "competition_oos": 4.916234862168004 }, { "location": "Karnataka", "pf_overall_ms": 37.302489989725466, "pf_name": "Swiggy Instamart", "ms": 2.09752558856534, "osa": 79.94269340974212, "oos": 8.890162368672398, "competition_ms": 97.90247441143465, "competition_osa": 64.72077648051766, "competition_oos": 10.56133852237383 }] }, { "type": "State", "location": "Maharashtra", "location_key": "Maharashtra", "location_overall_ms": 0.1256310585314046, "pf_data": [{ "location": "Maharashtra", "pf_overall_ms": 100, "pf_name": "Blinkit", "ms": 0.8403361344537815, "osa": 95.23809523809523, "oos": 1.2142857142857142, "competition_ms": 99.15966386554622, "competition_osa": 81.36743215031316, "competition_oos": 4.8162839248434235 }] }, { "type": "State", "location": "Delhi", "location_key": "Delhi", "location_overall_ms": 78.4512982739145, "pf_data": [{ "location": "Delhi", "pf_overall_ms": 78.4512982739145, "pf_name": "All", "ms": 2.612345, "osa": 75.12345, "oos": 6.98765, "competition_ms": 97.321, "competition_osa": 72.45, "competition_oos": 7.89 }, { "location": "Delhi", "pf_overall_ms": 62.113452, "pf_name": "Blinkit", "ms": 2.732111, "osa": 74.33211, "oos": 7.12345, "competition_ms": 97.11, "competition_osa": 73.22, "competition_oos": 7.00 }, { "location": "Delhi", "pf_overall_ms": 10.523412, "pf_name": "Zepto", "ms": 3.012345, "osa": 79.54321, "oos": 5.23456, "competition_ms": 96.98, "competition_osa": 78.12, "competition_oos": 5.60 }, { "location": "Delhi", "pf_overall_ms": 5.814534, "pf_name": "Swiggy Instamart", "ms": 1.901234, "osa": 72.87654, "oos": 10.43210, "competition_ms": 98.21, "competition_osa": 65.33, "competition_oos": 11.22 }] }, { "type": "State", "location": "Uttar Pradesh", "location_key": "Uttar Pradesh", "location_overall_ms": 21.5487017260855, "pf_data": [{ "location": "Uttar Pradesh", "pf_overall_ms": 21.5487017260855, "pf_name": "All", "ms": 2.451234, "osa": 70.98765, "oos": 8.12345, "competition_ms": 97.812, "competition_osa": 69.55, "competition_oos": 8.56 }, { "location": "Uttar Pradesh", "pf_overall_ms": 84.221234, "pf_name": "Blinkit", "ms": 2.612345, "osa": 71.43210, "oos": 7.98765, "competition_ms": 97.45, "competition_osa": 70.88, "competition_oos": 8.10 }, { "location": "Uttar Pradesh", "pf_overall_ms": 3.012345, "pf_name": "Zepto", "ms": 2.923456, "osa": 77.12345, "oos": 6.23456, "competition_ms": 96.45, "competition_osa": 76.90, "competition_oos": 6.40 }, { "location": "Uttar Pradesh", "pf_overall_ms": 10.213450, "pf_name": "Swiggy Instamart", "ms": 1.712345, "osa": 68.65432, "oos": 11.87654, "competition_ms": 98.10, "competition_osa": 46.77, "competition_oos": 16.05 }] }, { "type": "State", "location": "West Bengal", "location_key": "West Bengal", "location_overall_ms": 64.3217981234567, "pf_data": [{ "location": "West Bengal", "pf_overall_ms": 64.3217981234567, "pf_name": "All", "ms": 2.431111, "osa": 76.54321, "oos": 6.54321, "competition_ms": 97.452, "competition_osa": 69.12, "competition_oos": 8.12 }, { "location": "West Bengal", "pf_overall_ms": 72.123456, "pf_name": "Blinkit", "ms": 2.512345, "osa": 75.98765, "oos": 6.87654, "competition_ms": 97.88, "competition_osa": 71.05, "competition_oos": 7.31 }, { "location": "West Bengal", "pf_overall_ms": 8.765432, "pf_name": "Zepto", "ms": 3.212345, "osa": 80.34567, "oos": 5.12345, "competition_ms": 96.89, "competition_osa": 77.23, "competition_oos": 6.02 }, { "location": "West Bengal", "pf_overall_ms": 10.419010, "pf_name": "Swiggy Instamart", "ms": 2.012345, "osa": 72.98765, "oos": 10.43210, "competition_ms": 98.01, "competition_osa": 45.88, "competition_oos": 15.88 }] }, { "type": "State", "location": "Bihar", "location_key": "Bihar", "location_overall_ms": 35.6782018765433, "pf_data": [{ "location": "Bihar", "pf_overall_ms": 35.6782018765433, "pf_name": "All", "ms": 2.512345, "osa": 74.32109, "oos": 7.87654, "competition_ms": 97.221, "competition_osa": 68.45, "competition_oos": 9.02 }, { "location": "Bihar", "pf_overall_ms": 83.333333, "pf_name": "Blinkit", "ms": 2.612345, "osa": 73.98765, "oos": 8.12345, "competition_ms": 97.54, "competition_osa": 69.88, "competition_oos": 8.90 }, { "location": "Bihar", "pf_overall_ms": 4.567890, "pf_name": "Zepto", "ms": 3.001234, "osa": 79.87654, "oos": 5.23456, "competition_ms": 96.141, "competition_osa": 77.66, "competition_oos": 6.10 }, { "location": "Bihar", "pf_overall_ms": 7.765678, "pf_name": "Swiggy Instamart", "ms": 1.901234, "osa": 70.12345, "oos": 11.54321, "competition_ms": 98.32, "competition_osa": 44.12, "competition_oos": 16.33 }] }], "summaryData": [{ "label": "Total Location", "value": 2, "key": "total_location" }, { "label": "Net Platform", "value": 3, "key": "net_platform" }, { "label": "Avg OOS", "value": 4.594182925944731, "key": "oos" }, { "label": "Avg OSA", "value": 86.84993109450933, "key": "osa" }, { "label": "Avg MS", "value": 2.853619758070476, "key": "ms" }, { "label": "Comp. Avg OOS", "value": 7.180292308765669, "key": "competition_oos" }, { "label": "Comp. Avg OSA", "value": 75.42606338783027, "key": "competition_osa" }, { "label": "Comp. Avg MS", "value": 97.14638024192952, "key": "competition_ms" }] }
      // }
      // if ((locationSteps["City"] == null || locationSteps["City"] != null) && locationSteps["State"] != null) {
      //   currentData = { "data": [{ "type": "City", "location": "Bangalore", "location_key": "Bangalore", "location_overall_ms": 100, "pf_data": [{ "location": "Bangalore", "pf_overall_ms": 100, "pf_name": "All", "ms": 2.85615224919347, "osa": 86.82429974536196, "oos": 4.6045107311749724, "competition_ms": 97.14384775080653, "competition_osa": 75.40189820347841, "competition_oos": 7.1899073824449085 }, { "location": "Bangalore", "pf_overall_ms": 56.45752557006769, "pf_name": "Blinkit", "ms": 3.081796803618771, "osa": 86.5312107247591, "oos": 5.081901968998743, "competition_ms": 96.91820319638123, "competition_osa": 77.68083336938703, "competition_oos": 6.592569090917832 }, { "location": "Bangalore", "pf_overall_ms": 6.239984440206844, "pf_name": "Zepto", "ms": 5.349640872746984, "osa": 89.12316417042315, "oos": 2.9681547186273085, "competition_ms": 94.65035912725301, "competition_osa": 82.01003760400319, "competition_oos": 4.916234862168004 }, { "location": "Bangalore", "pf_overall_ms": 37.302489989725466, "pf_name": "Swiggy Instamart", "ms": 2.09752558856534, "osa": 79.94269340974212, "oos": 8.890162368672398, "competition_ms": 97.90247441143465, "competition_osa": 64.72077648051766, "competition_oos": 10.56133852237383 }] }, { "type": "City", "location": "Delhi", "location_key": "Delhi", "location_overall_ms": 90.124512345678, "pf_data": [{ "location": "Delhi", "pf_overall_ms": 90.124512345678, "pf_name": "All", "ms": 2.712345, "osa": 75.91234, "oos": 6.98765, "competition_ms": 97.32, "competition_osa": 72.45, "competition_oos": 7.89 }, { "location": "Delhi", "pf_overall_ms": 62.113452, "pf_name": "Blinkit", "ms": 2.732111, "osa": 74.33211, "oos": 7.12345, "competition_ms": 97.11, "competition_osa": 73.22, "competition_oos": 7.00 }, { "location": "Delhi", "pf_overall_ms": 10.523412, "pf_name": "Zepto", "ms": 3.012345, "osa": 79.54321, "oos": 5.23456, "competition_ms": 96.98, "competition_osa": 78.12, "competition_oos": 5.60 }, { "location": "Delhi", "pf_overall_ms": 7.487653, "pf_name": "Swiggy Instamart", "ms": 1.901234, "osa": 72.87654, "oos": 10.43210, "competition_ms": 98.21, "competition_osa": 65.33, "competition_oos": 11.22 }] }, { "type": "City", "location": "Lucknow", "location_key": "Lucknow", "location_overall_ms": 72.55123456789, "pf_data": [{ "location": "Lucknow", "pf_overall_ms": 72.55123456789, "pf_name": "All", "ms": 2.512345, "osa": 71.98765, "oos": 8.12345, "competition_ms": 97.81, "competition_osa": 69.55, "competition_oos": 8.56 }, { "location": "Lucknow", "pf_overall_ms": 54.221234, "pf_name": "Blinkit", "ms": 2.612345, "osa": 71.43210, "oos": 7.98765, "competition_ms": 97.45, "competition_osa": 70.88, "competition_oos": 8.10 }, { "location": "Lucknow", "pf_overall_ms": 8.012345, "pf_name": "Zepto", "ms": 2.923456, "osa": 77.12345, "oos": 6.23456, "competition_ms": 96.45, "competition_osa": 76.90, "competition_oos": 6.40 }, { "location": "Lucknow", "pf_overall_ms": 10.305655, "pf_name": "Swiggy Instamart", "ms": 1.712345, "osa": 68.65432, "oos": 11.87654, "competition_ms": 98.10, "competition_osa": 46.77, "competition_oos": 16.05 }] }, { "type": "City", "location": "Patna", "location_key": "Patna", "location_overall_ms": 61.334567890123, "pf_data": [{ "location": "Patna", "pf_overall_ms": 61.334567890123, "pf_name": "All", "ms": 2.612345, "osa": 74.32109, "oos": 7.87654, "competition_ms": 97.22, "competition_osa": 68.45, "competition_oos": 9.02 }, { "location": "Patna", "pf_overall_ms": 48.333333, "pf_name": "Blinkit", "ms": 2.612345, "osa": 73.98765, "oos": 8.12345, "competition_ms": 97.54, "competition_osa": 69.88, "competition_oos": 8.90 }, { "location": "Patna", "pf_overall_ms": 6.567890, "pf_name": "Zepto", "ms": 3.001234, "osa": 79.87654, "oos": 5.23456, "competition_ms": 96.14, "competition_osa": 77.66, "competition_oos": 6.10 }, { "location": "Patna", "pf_overall_ms": 5.833444, "pf_name": "Swiggy Instamart", "ms": 1.901234, "osa": 70.12345, "oos": 11.54321, "competition_ms": 98.32, "competition_osa": 44.12, "competition_oos": 16.33 }] }, { "type": "City", "location": "Kolkata", "location_key": "Kolkata", "location_overall_ms": 84.2210987654321, "pf_data": [{ "location": "Kolkata", "pf_overall_ms": 84.2210987654321, "pf_name": "All", "ms": 2.531111, "osa": 76.54321, "oos": 6.54321, "competition_ms": 97.45, "competition_osa": 69.12, "competition_oos": 8.12 }, { "location": "Kolkata", "pf_overall_ms": 72.123456, "pf_name": "Blinkit", "ms": 2.512345, "osa": 75.98765, "oos": 6.87654, "competition_ms": 97.88, "competition_osa": 71.05, "competition_oos": 7.31 }, { "location": "Kolkata", "pf_overall_ms": 6.765432, "pf_name": "Zepto", "ms": 3.212345, "osa": 80.34567, "oos": 5.12345, "competition_ms": 96.89, "competition_osa": 77.23, "competition_oos": 6.02 }, { "location": "Kolkata", "pf_overall_ms": 4.321010, "pf_name": "Swiggy Instamart", "ms": 2.012345, "osa": 72.98765, "oos": 10.43210, "competition_ms": 98.01, "competition_osa": 45.88, "competition_oos": 15.88 }] }, { "type": "City", "location": "Mumbai", "location_key": "Mumbai", "location_overall_ms": 88.777654321, "pf_data": [{ "location": "Mumbai", "pf_overall_ms": 88.777654321, "pf_name": "All", "ms": 2.812345, "osa": 85.12345, "oos": 4.98765, "competition_ms": 97.45, "competition_osa": 81.22, "competition_oos": 5.98 }, { "location": "Mumbai", "pf_overall_ms": 70.112233, "pf_name": "Blinkit", "ms": 2.912345, "osa": 86.54321, "oos": 4.87654, "competition_ms": 97.11, "competition_osa": 82.33, "competition_oos": 5.45 }, { "location": "Mumbai", "pf_overall_ms": 9.876543, "pf_name": "Zepto", "ms": 3.112345, "osa": 88.76543, "oos": 3.76543, "competition_ms": 96.88, "competition_osa": 84.12, "competition_oos": 4.33 }, { "location": "Mumbai", "pf_overall_ms": 8.788878, "pf_name": "Swiggy Instamart", "ms": 2.112345, "osa": 80.87654, "oos": 6.54321, "competition_ms": 97.92, "competition_osa": 72.44, "competition_oos": 7.11 }] }], "summaryData": [{ "label": "Total Location", "value": 1, "key": "total_location" }, { "label": "Net Platform", "value": 3, "key": "net_platform" }, { "label": "Avg OOS", "value": 4.6045107311749724, "key": "oos" }, { "label": "Avg OSA", "value": 86.82429974536196, "key": "osa" }, { "label": "Avg MS", "value": 2.85615224919347, "key": "ms" }, { "label": "Comp. Avg OOS", "value": 7.1899073824449085, "key": "competition_oos" }, { "label": "Comp. Avg OSA", "value": 75.40189820347841, "key": "competition_osa" }, { "label": "Comp. Avg MS", "value": 97.14384775080653, "key": "competition_ms" }] }
      // }
      // setDarkStoreLocationData(currentData);
      setDarkStoreLocationData({ data: response?.rowData??[],footerData:response?.footerData??{} });
      setLoadingReport(false);
    }
    if ( !isEqual(previousSelectedFilters.current, JSON.stringify({ ...selectedFilters,locationSteps,...activeCard,metrics }))) {
          previousSelectedFilters.current = JSON.stringify({ ...selectedFilters,locationSteps,...activeCard,metrics });
          fetchData();
        }
    // fetchData();
  }, [locationSteps,metrics,selectedFilters,activeCard]);

  return (
    <div className="">
      <div>
        {/* OSA Performance Overview */}
        {/* Graphical Analysis */}
        <div className="bg-blue-50 p-5 rounded-md border border-blue-300">
          <div className="">
            <div className="bg-white px-4 py-3 rounded-md">
              <div className="flex gap-2 items-center">
                {/* <h2 className="text-lg font-medium text-[#000000D9]"> */}
                
                 {
                    (activeClientProject?.client_project_id == 2 && kpi == "OSA" ) ?
                      ""
                    :
                      <h2 className="flex items-center gap-2 text-[20px] font-semibold text-[#000000E0]">
                        {/* chart-title  */}
                        {`${kpi == "OSA" ? kpi : kpiMap?.[kpi]?.lable} Performance Overview`}
                    </h2>
                  }
               
                <span className="inline-flex gap-2 items-center bg-blue-50 border border-blue-200 text-blue-600 px-3 py-1 rounded-md  font-medium">
                  {activeCard?.type === "mother_pack" ?
                  <MdOutlineCategory alt={`${activeCard?.id}`} className="w-[24px] h-[24px]"/>
                                       
                  :
                  <img
                        src={
                            `/assets/images/${activeCard?.type === "brand" ? "brandIcon" : "categorytIcon"}.svg`
                        }
                        alt={`${activeCard?.id}`} className="w-[24px] h-[24px]"
                    />
                    }
                  {activeCard?.label}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap flex-[0_0_auto] -mx-[9px]">
            <div className="w-1/2 flex-[0_0_auto] px-[8px]">
              <GraphicalAnalysis activeCard={activeCard} metrics={metrics}/>
              <div className="table-container !max-h-[600px] !overflow-x-hidden !overflow-y-hidden !p-[0] !m-[0]">
                <PerformanceTableGraphical activeCard={activeCard} metrics={metrics}  />
              </div>
            </div>
            <div className="w-1/2 flex-[0_0_auto] px-[8px]">
              <div className="bg-white shadow-md rounded-xl p-5 h-full">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    {/* Top Row */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      {/* Title + Dates */}
                      <div>
                        {/* <h2 className="font-inter font-medium text-[18px] leading-[100%] tracking-[0] text-[#191919]"> */}
                        <h2 className="flex items-center gap-2 text-[20px] font-semibold text-[#000000E0]">
                          {/* chart-title */}
                          Region-wise {kpi=="OSA"?kpi:kpiMap?.[kpi]?.lable} Performance
                        </h2>

                        <div className="inline-flex mt-[10px]">
                        {[
                          { label: locationSteps?.Country, key: 'Country' },
                          { label: locationSteps?.Region, key: 'Region' },
                          { label: locationSteps?.State, key: 'State' },
                          { label: locationSteps?.City, key: 'City' },
                          { label: locationSteps?.Store, key: 'Store' },
                        ]
                          .filter(step => step.label != null)
                          .map((step, index, arr) => (
                            <span key={step.key} className="">
                              <button
                                className="font-roboto font-normal text-[14px] leading-[22px] tracking-[0] align-middle"
                                onClick={() => updateLocationSteps(step.key, step.label)}
                              >
                                {step.label}
                              </button>
                              {index < arr.length - 1 && <span className="px-1 text-gray-500 text-[10px]">/</span>}
                            </span>
                          ))}
                      </div>
                        {/* <p className="text-[10px] text-gray-500">Region</p> */}
                      </div>
                    </div>
                    {/* <div className="chart  h-[715px]"> */}
                    <div className="chart  h-[550px] mt-0">
                      {/* <img
                        src="/assets/images/widget/map-chart.png"
                        className="w-full h-full fit-contain"
                        alt
                      /> */}
                      <IndiaMap Country={Country} mapCenter={mapCenter} maxBounds={maxBounds} activeCard={activeCard} filters={filters}  metrics={metrics}  key={`country-map-${locationStepValue}`} darkStoreLocationData={darkStoreLocationData} updateLocationSteps={updateLocationSteps} locationSteps={locationSteps} />
                    </div>
                  </div>
                  <div>

                    <PerformanceTable activeCard={activeCard} metrics={metrics}
                      darkStoreLocationData={darkStoreLocationData}
                      updateLocationSteps={updateLocationSteps}
                      loadingReport={loadingReport} // optional
                    />

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerformanceOverview;