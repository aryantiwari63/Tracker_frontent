import React, { useEffect, useState } from "react";
import Drawer from 'react-modern-drawer';
import PerformanceOverview from './PerformanceOverview';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  // useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import FilterDrawerComponent from "./filterDrawerComponent";
import { useEbuxContext } from "../../../../../Context/EbuxProvider";
import SortableCard from "./SortableCard";
import {
  saveOSAPlateform
  , getTabsPlateform
} from "../../../../../services/saveTabsPlateform.services";
import SortableCardGroupDS3 from "./SortableCardGroupDS3";
// import OsoWidgets from "../../../../sosWidgets";





function OsaPerformanceOverviewComponent({ setDrawerInfo, drawerInfo }) {
  const {
    kpi, kpiMap,
    filters,
    clientCustomizeColumnsComprehensiveBreakdown, activeClientProject
  } = useEbuxContext();
  const widgetKpiDefaultMetrics = {
    "OSA": ["osa"],
    // "OSA": ["avg_osa", "osa", "price_variation", "price_sp"],
    "PRO": ["price_variation"]
    // "PRO": ["price_variation", "price_sp", "price_rp"]
  }
  // const [metrics, setMetrics] = useState(kpi=='OSA'?[
  //         { id: "osa", label: "Avg OSA", checked: true, disabled: false },
  //     ]:kpi=='PRO'?[
  //         { id: "pro", label: "Promotions", checked: true, disabled: false },
  //     ]:[]);
  // const [metrics, setMetrics] = useState(clientCustomizeColumnsComprehensiveBreakdown?.ds?.columns?.filter(i=>((i?.allowKPI?.indexOf(kpi)>-1)&&(!i?.value?.includes("competition_"))&&(i?.kpi?.indexOf(kpi)>-1)&&(!i?.isDisabled)&&(["previous_osa","last_month_sale","last_in_stock"]?.indexOf(i?.key)==-1)))?.map(i=>({...i,label:i?.title,id:i?.value,checked:i?.kpi?.indexOf(kpi)>-1,disabled:i?.isDisabled})));

  const kpiPlatformKey = {
    OSA: "osa_plateform",
    PRO: "pro_plateform",
  }
  const [metrics, setMetrics] = useState(
    clientCustomizeColumnsComprehensiveBreakdown?.ds?.columns?.filter(
      i => ((i?.allowInWidget && !i?.isDisabled && i?.allowKPI?.indexOf(kpi) > -1)))
      ?.map(i => (
        {
          ...i, label: i?.title, id: i?.value,
          checked: ((widgetKpiDefaultMetrics?.[kpi]?.length) ? (widgetKpiDefaultMetrics?.[kpi]?.indexOf(i?.key) > -1) : (i?.kpi?.indexOf(kpi) > -1)),
          disabled: i?.isDisabled
        }
      )));
  const MIN_REQUIRED = 3;
  const MAX_ALLOWED = activeClientProject?.uiType === 'ds3' ? 14 : 6;
  const [cards, setCards] = useState([]);
  const [activeCard, setActiveCard] = useState({});
  const getInitialItems = async () => {
    const brandItems = (filters?.brand ?? [])?.map((b, idx) => ({
      ...b,
      idx,
      id: `brand-${b?.label ?? b?.lable}`,
      label: b?.label ?? b?.lable,
      type: "brand",
      checked: false,
    }));

    const categoryItems = (filters?.category ?? []).map((c, idx) => ({
      ...c,
      idx,
      id: `category-${c?.label ?? c?.lable}`,
      label: c?.label ?? c?.lable,
      type: "category",
      checked: false,
    }));
    const motherPackItems = ((activeClientProject?.client_project_id == 2 && (kpi == "OSA" || kpi == "PRO")) ? (filters?.mother_pack ?? []) : []).map((c, idx) => ({
      ...c,
      idx,
      id: `mother_pack-${c?.label ?? c?.lable}`,
      label: c?.label ?? c?.lable,
      type: "mother_pack",
      checked: false,
    }));

    // ✅ remove duplicates by value
    let all = [...brandItems, ...motherPackItems, ...categoryItems].filter(
      (obj, index, self) => index === self.findIndex((o) => o.value === obj.value)
    );


    const savedDragData = await getTabsPlateform();
    const savedPositions = savedDragData?.userRecord?.[kpiPlatformKey[kpi]]?.OsaPerformanceOverview ?? [];
    // const savedactiveCard = savedDragData?.userRecord?.osa_plateform?.activeCard ?? [];

    if (savedPositions.length > 0) {
      setCards(savedPositions);

      const firstCardMatrix = savedPositions?.[0]?.visibleMatrix ?? [];
      setMetrics(firstCardMatrix);

      const savedActive = savedDragData?.userRecord?.[kpiPlatformKey[kpi]]?.activeCard?.[0];
      if (savedActive) {
        const getSavedId = savedActive?.id ?? 0;
        const uniquePositionsCheckExist = savedPositions.filter((item) => item.id == getSavedId);
        if (uniquePositionsCheckExist?.length == 0) {
          const defaultActiveCard = savedPositions?.[0] ?? null;

          if (defaultActiveCard) setActiveCard(defaultActiveCard);
        } else {
          setActiveCard(savedActive);
        }
      } else {
        setActiveCard(savedPositions[0]);
      }

      const uniquePositions = savedPositions.filter(
        (v, i, arr) => arr.findIndex((x) => x.value === v.value) === i
      );

      const savedValueSet = new Set(uniquePositions.map((s) => s.value));

      all = all.filter((item) => savedValueSet.has(item.value));

      all = all.map((item) => ({ ...item, checked: true }));


      const positionMap = Object.fromEntries(
        uniquePositions.map((item) => [item.value, item.position])
      );

      all.sort(
        (a, b) => (positionMap[a.value] || 0) - (positionMap[b.value] || 0)
      );
    }
    else {
      all = [...brandItems, ...motherPackItems, ...categoryItems];

      let checked = all.filter((a) => a.checked);
      if (checked.length > MAX_ALLOWED) {
        const keep = new Set(checked.slice(0, MAX_ALLOWED).map((c) => c.id));
        all.forEach((a) => {
          a.checked = keep.has(a.id);
        });
      }

      checked = all.filter((a) => a.checked);
      if (checked.length < MIN_REQUIRED) {
        for (let i = 0; i < all.length && checked.length < MIN_REQUIRED; i++) {
          if (!all[i].checked) {
            all[i].checked = true;
            checked.push(all[i]);
          }
        }
      }

      const defaultCards = checked.map((item, index) => ({
        ...item,
        position: index + 1,
        visibleMatrix: metrics ?? [],
      }));

      all = defaultCards;

      setCards(defaultCards);
      const defaultActiveCard = defaultCards?.[0] ?? null;
      if (defaultActiveCard) setActiveCard(defaultActiveCard);


    }
    return all;
  };

  //eslint-disable-next-line

  const [, setItems] = useState([]);

  // useEffect(() => {
  //   const initData = async () => {
  //     const savedData = await getTabsPlateform();
  //     const savedOSAData = savedData?.userRecord?.osa_plateform?.OsaPerformanceOverview ?? [];

  //     if (savedOSAData.length > 0) {
  //       setCards(savedOSAData);

  //       const firstCardMatrix = savedOSAData?.[0]?.visibleMatrix ?? [];
  //       setMetrics(firstCardMatrix);

  //       const savedActive = savedData?.userRecord?.osa_plateform?.activeCard?.[0];
  //       if (savedActive) {
  //         setActiveCard(savedActive);
  //       } else {
  //         setActiveCard(savedOSAData[0]);
  //       }

  //       return;
  //     } else {
  //       const defaultItems = await getInitialItems();
  //       setCards(defaultItems);
  //     }
  //   };

  //   initData();
  // }, []);



  useEffect(() => {
    const loadInitialItems = async () => {
      const data = await getInitialItems();
      setItems(data);
    };
    loadInitialItems();
  }, [filters]);

  const [openEditFilter, setOpenEditFilter] = useState(false);
  const closeDrawer = () => {
    setOpenEditFilter(false);
  }

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setCards((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newdata = arrayMove(items, oldIndex, newIndex);
        saveTabPositions(newdata);
        return newdata
      });
    }
  };

  const getTabPositions = (data) => {
    if (!Array.isArray(data)) return [];

    return data
      .filter((item) => item && typeof item === "object" && item.id)
      .map((item, index) => {
        const position = Number(item.position) || index + 1;
        return { ...item, position };
      });
  };

  let saveTabTimer = null;


  const saveTabPositions = async (data) => {
    if (!Array.isArray(data) || !data.length) return data;

    const cardsWithPosition = getTabPositions(data);

    const tabsPayload = {
      type: kpiPlatformKey[kpi],
      key: "OsaPerformanceOverview",
      OsaPerformanceOverview: cardsWithPosition,
      metrics: metrics ?? [],
      activeCard: activeCard ? [activeCard] : [],
    };


    clearTimeout(saveTabTimer);
    saveTabTimer = setTimeout(async () => {
      try {
        await saveOSAPlateform(tabsPayload);
      } catch (err) {
        console.error("Error saving tab positions:", err);
      }
    }, 250);

    return cardsWithPosition;
  };


  const handleUpdateCards = (newData) => {

    setCards((prev) => {
      const retained =
        prev?.filter(
          (oldItem) => newData?.findIndex((i) => i?.id === oldItem?.id) > -1
        ) ?? [];

      const added =
        newData?.filter(
          (newItem) => prev?.findIndex((i) => i?.id === newItem?.id) === -1
        ) ?? [];

      let updatedCards = [...retained, ...added].map((card) => ({
        ...card,
        visibleMatrix: [...metrics],
      }));

      if (newData?.findIndex((i) => i.id === activeCard?.id) === -1) {
        setActiveCard(updatedCards?.[0]);
      }

      return updatedCards;
    });
  };


  const handleUpdateMetrics = (newMetrics) => {
    const mergedMetrics = [
      ...newMetrics.map((m) => ({ ...m })),
      ...metrics
        .filter((m) => !newMetrics.find((nm) => nm.id === m.id))
        .map((m) => ({ ...m, checked: false })),
    ];

    setMetrics(mergedMetrics);
    setCards((prevCards) =>
      prevCards.map((card, index) => ({
        ...card,
        position: index + 1,
        visibleMatrix: mergedMetrics,
      }))
    );
  };


  const [saveTrigger, setSaveTrigger] = useState(false);

  const handleApplyChanges = () => {
    setSaveTrigger(true);
    setOpenEditFilter(false);
  };

  useEffect(() => {
    if (!saveTrigger) return;

    const updatedCards = cards.map((card, index) => ({
      ...card,
      position: index + 1,
      visibleMatrix: metrics,
    }));

    const tabsPayload = {
      type: kpiPlatformKey[kpi],
      key: "OsaPerformanceOverview",
      OsaPerformanceOverview: updatedCards,
      metrics,
      activeCard: activeCard ? [activeCard] : [],
    };

    saveOSAPlateform(tabsPayload);

    setSaveTrigger(false);
  }, [saveTrigger]);


  const handleSelectCard = (card) => {
    if (!card) return;
    setActiveCard(card);
    // console.log('kpiPlatformKey[kpi]',kpi)
    const tabsPayload = {
      type: kpiPlatformKey[kpi],
      key: "activeCard",
      activeCard: [card],
    };
    saveOSAPlateform(tabsPayload);
  };


  return (
    <div className="bg-white rounded-[16px] shadow-[0px_2px_4px_0px_#00000005,0px_1px_6px_-1px_#00000005,0px_1px_2px_0px_#00000008]">
      {/* <OsoWidgets/> */}
      <div className="px-4 flex justify-between items-center mb-4 border-b p-2">
        {/* <h1 className="text-lg font-medium text-[#000000D9]"> */}
        <h1 className="flex items-center gap-2 text-[20px] font-semibold text-[#000000E0]">
          {/* chart-title  */}
          {
            (activeClientProject?.client_project_id == 2 && kpi == "OSA") ?
              "OSA Monitor"
              :
              `${kpi == "OSA" ? kpi : kpiMap?.[kpi]?.lable} Performance Overview`
          }
        </h1>

        <button onClick={() => setOpenEditFilter(true)} className="px-3 py-1 border rounded-md text-sm inline-flex items-center gap-1 bg-white hover:bg-gray-100">
          <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 2.30484H3.33333C2.97971 2.30484 2.64057 2.44531 2.39052 2.69536C2.14048 2.94541 2 3.28455 2 3.63817V12.9715C2 13.3251 2.14048 13.6643 2.39052 13.9143C2.64057 14.1644 2.97971 14.3048 3.33333 14.3048H12.6667C13.0203 14.3048 13.3594 14.1644 13.6095 13.9143C13.8595 13.6643 14 13.3251 14 12.9715V8.30484M12.25 2.05484C12.5152 1.78962 12.8749 1.64063 13.25 1.64062C13.6251 1.64062 13.9848 1.78962 14.25 2.05484C14.5152 2.32006 14.6642 2.67977 14.6642 3.05484C14.6642 3.42991 14.5152 3.78962 14.25 4.05484L8.24133 10.0642C8.08303 10.2223 7.88747 10.3381 7.67267 10.4008L5.75733 10.9608C5.69997 10.9776 5.63916 10.9786 5.58127 10.9637C5.52339 10.9489 5.47055 10.9188 5.4283 10.8765C5.38604 10.8343 5.35593 10.7815 5.3411 10.7236C5.32627 10.6657 5.32727 10.6049 5.344 10.5475L5.904 8.63217C5.96702 8.41754 6.08302 8.22221 6.24133 8.06417L12.25 2.05484Z" stroke="black" strokeOpacity="0.85" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Edit</button>
      </div>
      {activeClientProject?.uiType === 'ds3' ?
        <SortableCardGroupDS3 cards={cards} setCards={setCards} drawerInfo={drawerInfo} setDrawerInfo={setDrawerInfo} metrics={metrics} activeCard={activeCard} handleSelectCard={handleSelectCard} />
        :
        <div className="p-2">

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={cards} strategy={rectSortingStrategy}>
              <div className={`grid ${cards?.length > 3 ? 'grid-cols-3' : `grid-cols-${(cards?.length ?? 2)}`} gap-4 w-full`}>
                {cards.slice(0, 6).map((card) => (
                  <SortableCard key={card.id} card={card} setDrawerInfo={setDrawerInfo} visibleMatrix={metrics} activeCard={activeCard} handleSelectCard={handleSelectCard} />
                ))}
              </div>
            </SortableContext>
          </DndContext>

        </div>
      }

      <div className="p-4">

        <PerformanceOverview activeCard={activeCard} metrics={metrics} />

      </div>





      {
        openEditFilter ?
          <Drawer
            open={openEditFilter}
            onClose={closeDrawer}
            direction='right'
            style={{ width: '30%' }}
            className='performanceDrawerWrap'
          >
            <FilterDrawerComponent onClose={closeDrawer} drawerInfo={{ title: "Edit Widget", defaultSelected: [...cards], update: handleUpdateCards, defaultSelectedMetrics: [...metrics], updateMetrics: handleUpdateMetrics, onApply: handleApplyChanges, }} />
            {/* <FilterDrawerComponent onClose={closeDrawer} drawerInfo={{ title: "Edit Widget", defaultSelected: [...cards], 
                            update: (newData) => { setCards((perv) => [...(perv?.filter(oldItem => newData?.findIndex(i => i?.id == oldItem?.id) > -1) ?? []), ...(newData?.filter(newItem => perv?.findIndex(i => i?.id == newItem?.id) == -1) ?? [])]); if (newData?.findIndex(i => i.id == activeCard?.id) == -1) { setActiveCard(newData?.[0]) } }, 
                            defaultSelectedMetrics: [...metrics], updateMetrics: (e) => { setMetrics(e) } }} /> */}
          </Drawer>
          :
          <></>
      }

    </div>
  )
}

export default OsaPerformanceOverviewComponent;