import React, { useEffect, useState, Suspense, useRef } from 'react';
import 'react-tabs/style/react-tabs.css';
import ChartBox from './chartbox';

import { useEbuxContext } from '../../Context/EbuxProvider';
import Loader from '../Loader';
import { fetchFocusChartData } from '../../services/focusChart.services';
import { isEqual } from 'lodash';
import { MdOutlineDragIndicator } from 'react-icons/md';

import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, } from '@dnd-kit/sortable';

import { saveOSAPlateform } from '../../services/saveTabsPlateform.services';

const FocusChartsComponent = React.memo(({
  listeners, attributes, chartTitle = "", chartType = 'Brand', chartLable = "OSA", disableSearch = true,platformSubCat
}) => {
  // console.log('9999',platformSubCat)
  const { filtersLoading, kpi, filters, selectedFilters,   brandSearchValue, setBrandSearchValue } = useEbuxContext();
  const [loading, setLoading] = useState(false);
  const [selectedCharData, setSelectedCharData] = useState({});
  const [open, setOpen] = useState(true);




  const [categoryPosition, setCategoryPosition] = useState([]);

  const [platform, setPlatform] = useState([]);
  const previousSelectedFilters = useRef({});
  useEffect(() => {

    async function fetchData() {
      setLoading(true);
      const currentData = await fetchFocusChartData(chartType, kpi, filters, selectedFilters, selectedFilters.selectedPlatform, false);
      let previousData = [];
      if (selectedFilters?.[selectedFilters?.calendarType == "week"?"selectedWeeks":"selectedDateRange"]?.isCompareToPrevious) {
        previousData = await fetchFocusChartData(chartType, kpi, filters, selectedFilters, selectedFilters.selectedPlatform, true);
      }
      const dataMap = {};
      Array.isArray(currentData) && currentData?.forEach(bucket => {
        if (!dataMap[bucket?.key?.value]) {
          dataMap[bucket?.key?.value] = {
            value: bucket?.key?.value,
            lable: bucket?.key?.lable,
            currentData: [],
            previousData: []
          };
        }
        dataMap[bucket?.key?.value]?.currentData?.push({
          "XAXIS": bucket?.key?.value,
          "DURATION": bucket?.key?.date,
          "OUTPUT": bucket?.output?.value?.toFixed(2)
        });
      });

      previousData?.forEach(bucket => {
        if (!dataMap[bucket?.key?.value]) {
          dataMap[bucket?.key?.value] = {
            value: bucket?.key?.value,
            lable: bucket?.key?.lable,
            currentData: [],
            previousData: []
          };
        }
        dataMap[bucket?.key?.value]?.previousData?.push({
          "XAXIS": bucket?.key?.value,
          "DURATION": bucket?.key?.date,
          "OUTPUT": bucket?.output?.value?.toFixed(2)
        });
      });

      setLoading(false);
      setSelectedCharData(dataMap);
      // eslint-disable-next-line no-console
      // console.log({ currentData }, { previousData },{dataMap}, { loading });

    }
    if (!filtersLoading && (!isEqual(previousSelectedFilters.current, selectedFilters))) {
      previousSelectedFilters.current = selectedFilters;
      fetchData();
    }
  }, [filtersLoading, selectedFilters]);
  const savePlatformPositions = (data) => {
    const platformPosition = data?.map((item, index) => ({
      value: item.value,
      position: index + 1
    }));
    // localStorage.setItem(`categoryPosition_${chartType}_${kpi}}`, JSON.stringify(platformPosition));
    let plateformtype
    if(kpi=="SOS"){
      plateformtype="sos_plateform"
    }else if(kpi=="PRO"){
      plateformtype="pro_plateform"
    }else{
       plateformtype="osa_plateform"
    }
    let tabsPayload = {
      "type": plateformtype,
      "key": 'CategoryPosition',
      "CategoryPosition": platformPosition,
    }
    console.log('--cp--',tabsPayload)
    saveOSAPlateform(tabsPayload);
  };

  const loadAndRearrangePlatformPositions = (data) => {
    // const storedPlatformPosition = JSON.parse(localStorage.getItem(`categoryPosition_${chartType}_${kpi}`));
    console.log('${kpi}',kpi,platform)
    const storedPlatformPosition = platform?.CategoryPosition || [];
    if (storedPlatformPosition?.length) {

      const rearrangedArray = storedPlatformPosition
        ?.map(posItem => data.find(item => item.value === posItem.value))
        ?.filter(item => item !== undefined);

      const newItems = data.filter(item =>
        !storedPlatformPosition?.some(posItem => posItem.value === item.value)
      );

      const finalArray = [...rearrangedArray, ...newItems];
console.log('final-arr',finalArray)
      savePlatformPositions(finalArray);
      return finalArray;
    } else {
      return data;
    }

  };
  useEffect(() => {
    // const storedPlatformPosition = JSON.parse(localStorage.getItem(`categoryPosition_${chartType}_${kpi}`));
    let res_platform = Object.keys(selectedCharData)?.map((item) => { return { value: item } });
    if (res_platform?.length) {      
      const storedPlatformPosition = platform;
      
      if (!storedPlatformPosition) {
        console.log('---',storedPlatformPosition)
        savePlatformPositions(res_platform ?? []);
      } else {
        console.log('---nnn',res_platform)
        res_platform = loadAndRearrangePlatformPositions(res_platform ?? []);
      }
      setCategoryPosition(res_platform);
    }
  }, [selectedCharData]);




  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active?.id !== over?.id) {
      setCategoryPosition((prevCategoryPosition) => {
        const oldIndex = prevCategoryPosition.findIndex((item) => item.value === active.id);
        const newIndex = prevCategoryPosition.findIndex((item) => item.value === over.id);
        const newdata = arrayMove(prevCategoryPosition, oldIndex, newIndex);
        const _categoryPosition = newdata.map((item, index) => ({
          value: item.value,
          position: index + 1
        }));
        // localStorage.setItem(`categoryPosition_${chartType}_${kpi}`, JSON.stringify(_categoryPosition));
        
        let plateformtype
    if(kpi=="SOS"){
      plateformtype="sos_plateform"
    }
    else if(kpi=="PRO"){
      plateformtype="pro_plateform"
    }
    else if(kpi=="OR"){
      plateformtype="org_plateform"
    }else{
       plateformtype="osa_plateform"
    }
        let tabsPayload = {
          "type":plateformtype,
          "key": 'CategoryPosition',
          "CategoryPosition": _categoryPosition,
        }
        console.log('--cp++',tabsPayload)
        saveOSAPlateform(tabsPayload);
        return newdata;
      });
    }
  };


  useEffect(() => {
    const loadPlatformData = async () => {
      try {
        // const response = await getTabsPlateform();
        if(kpi=="SOS"){
          if (platformSubCat?.sos_plateform?.CategoryPosition) {
            setPlatform(platformSubCat.sos_plateform);
          }
        }else if(kpi=="PRO"){
          if (platformSubCat?.pro_plateform?.CategoryPosition) {
            setPlatform(platformSubCat.pro_plateform);
          }
        }
        else{
          if (platformSubCat?.osa_plateform?.CategoryPosition) {
            setPlatform(platformSubCat.osa_plateform);
          }
        }

        
      } catch (error) {
        console.error("Error loading platform data:", error);
      }
    };

    loadPlatformData();
  }, []);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor)
  );

  return (

    <div className="insightsSection !mb-0 !rounded-2xl shadow-[0px_2px_4px_0px_#00000005,0px_1px_6px_-1px_#00000005,0px_1px_2px_0px_#00000008]">
      <div className="sectionIconHead">
        <div className='chart-title flex gap-2 items-center'>

          <MdOutlineDragIndicator
            {...listeners}
            {...attributes}
          />
          <div className="sectionIcon">
            <img src="/assets/images/categoryFocusIcon.svg" width={14} height={14} />
          </div>
          <h4 className='chart-title'>{chartTitle}</h4>
          {loading && <Loader show={loading} fullScreen={false} />}
        </div>
        <button type="button" onClick={() => { setOpen(!open) }} className={`graphIconBtn ${open ? 'arrowRotate' : ''}`}>
          <img src="/assets/images/toggleDown.svg" width={20} height={20} />
        </button>
      </div>
      {open && (
        <div className="categoryContentBox">
          {!disableSearch &&
            (<div className="categorySearch">
              <img src="/assets/images/searchIcon.svg" width={16} height={16} className="searchIcon" />
              <input
                type='search'
                className="searchInput"
                placeholder={`Search ${chartTitle}...`}
                value={brandSearchValue}
                onChange={(e) => setBrandSearchValue(e.target.value ?? '')}
              />
            </div>)
          }

          <div className="categoryChartContent">
            <DndContext sensors={sensors} onDragEnd={handleDragEnd} >
              <SortableContext items={categoryPosition.map((item) => item.value)} >
                {categoryPosition?.map((item, i) => (
                  <Suspense key={i} fallback={<div>Loading...</div>}>
                    <ChartBox

                      key={item.value}
                      id={item.value}
                      chartLable={chartLable}
                      item={selectedCharData[item.value]}
                      isShowPrevious={(selectedFilters?.[selectedFilters?.calendarType == "week"?"selectedWeeks":"selectedDateRange"]?.isCompareToPrevious ?? false)}
                      onClick={()=>console.log('clickedd charttt',chartLable)}
                    />
                  </Suspense>
                ))}
              </SortableContext>
            </DndContext>

          </div>

        </div>
      )}
    </div>
  );
});
FocusChartsComponent.displayName = 'FocusChartsComponent';
export default FocusChartsComponent;