/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import "./CustomizeColPopup.css";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import DraggableColumn from "./DraggableColumn";
// import MetricsTab from "./MetricsTab";
import NonDraggableColumn from "./NonDraggableColumn";
// import CreateMetricTab from "./CreateMetricTab";
import PerformanceTab from "./PerformanceTab";
import DsaTab from "./DsaTab";
import SearchBar from "./SearchBar";
import { _GET, _PATCH, _POST } from "../../../services/axios.method";
import { FETCH_SAVED_COLUMN_NAMES } from "../../../utils/constants";
import SavedColumnNames from "./SavedColumnNames";
import { setToastMessageHandler } from "../../../redux/action-creator/commonAction";
import { useDispatch } from "react-redux";

const CustomizeColPopup = ({
  showHeader,
  setFilterHeader = false,
  // buttonStyleCss = "bg-[#ef880f] hover:bg-[#f58e20]",
  // dropDownCss = "hover:bg-[#ef880f]",
  searchCss = "outline-orange-300",
  platform = false,
  tabName,
  buttonName,
  refetch,
}) => {
  const [search, setSearch] = useState("");
  const [listArr, setListArr] = useState(showHeader);
  const [stickyList, setStickyList] = useState([]);
  const [checkedList, setCheckedList] = useState([]);
  const [savedNames, setSavedNames] = useState([]);
  const [savedId, setSavedId] = useState();
  const [deleteId, setDeleteId] = useState();

  const dispatch = useDispatch();

  const handleCategorizeList = () => {
    let checkedListArr = [];
    let unCheckedListArr = [];
    listArr.forEach((obj) => {
      if (obj?.showCol && obj?.checked && !obj?.disable) {
        checkedListArr.push(obj);
      } else {
        unCheckedListArr.push(obj);
      }
    });
    setCheckedList(checkedListArr);
  };

  const handleDragEnd = (e) => {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      setCheckedList((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor)
  );

  useEffect(() => {
    // let uncheckedListArr = listArr?.filter((obj) => {
    //   return !obj?.checked && !obj.showCol;
    // });
    let uncheckedListArr = listArr?.filter((obj) => {
      return !obj?.checked && !obj.showCol;
    });
    let finalArr = [...stickyList, ...checkedList, ...uncheckedListArr];
    setFilterHeader(finalArr);
  }, [checkedList, stickyList]);

  useEffect(() => {
    handleCategorizeList();
  }, [listArr]);

  useEffect(() => {
    //Run at first render to find sticky list
    const newArr = showHeader?.filter((obj) => {
      return obj?.disable;
    });
    setStickyList(newArr);
  }, [showHeader]);
  // console.log(stickyList, "<<", checkedList, "<<<<<<<<<<<<<<<<< checked list");
  const performanceList = listArr.filter((item) => item?.columnType != "dsa");
  const dsaList = listArr.filter((item) => item?.columnType == "dsa");

  const username = localStorage.getItem("name");

  useEffect(() => {
    fetchColName();
  }, [refetch]);
  // const saveColData = async () => {
  //   const colData = [...checkedList, ...uncheckedList];
  //   const data = {
  //     name: "Demo3 ",
  //     platform: 'amazon',
  //     user_id: user_id,
  //     username: username,
  //     tab_name: tabName,
  //     column_data: colData,
  //     client_id: client_id,
  //   };

  //   const result = await _POST(SAVE_COLUMN, data);
  //   if (result.status === 200) {
  //     fetchColName();
  //     dispatch(setToastMessageHandler(result?.data?.status?.message, true));
  //   } else {
  //     dispatch(setToastMessageHandler("Failed to perform action", false));
  //   }
  // };

  const fetchColName = async () => {
    try {
      const data = {
        platform: platform,
        tab_name: tabName,
        username: username,
      };

      const result = await _POST(FETCH_SAVED_COLUMN_NAMES, data);
      let names = [];
      names.push(result.data.data.result);
      setSavedNames(names);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchColName();
  }, [platform, tabName]);

  const fetchColById = (data) => {
    setSavedId(data);
    if (data) {
      buttonName(data);
    } else {
      buttonName("Save");
    }
  };
  const fetchColData = async () => {
    try {
      const result = await _GET(`${FETCH_SAVED_COLUMN_NAMES}/${savedId}`);
      let dynamicCol = [...result.data.data.result.column_data];

      setListArr(dynamicCol);
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //   let colFix = [];
  //   let colDynamic = [];
  //   if (savedId) {
  //     colFix.push(savedStickyCol);
  //     colDynamic.push(savedCol);
  //     console.log("<<<<<<<<<<<<<< from api");
  //   } else {
  //     colFix.push(stickyList);
  //     colDynamic.push(checkedList);
  //     console.log("<<<<<<<<<<<NOTTTTTTTTT<<< from api");
  //   }

  //   console.log(colDynamic, colFix, "<<<<<fix");
  //   setFinalDynamicCol(colDynamic);
  //   setFinalFixedCol(colFix);
  // }, [savedId, checkedList]);

  useEffect(() => {
    if (savedId) {
      fetchColData();
    } else {
      setListArr(showHeader);
    }
  }, [savedId]);

  const deleteCol = (data) => {
    setDeleteId(data);
  };

  const deleteColData = async () => {
    try {
      const result = await _PATCH(`${FETCH_SAVED_COLUMN_NAMES}/${deleteId}`);
      if (result.data?.status?.code === 200) {
        dispatch(setToastMessageHandler(result?.data?.status?.message, true));
        setDeleteId();
        fetchColName();
      } else {
        dispatch(setToastMessageHandler("Failed to perform action", false));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (deleteId) {
      deleteColData();
    }
  }, [deleteId]);

  return (
    <div className="flex px-6 bg-[#f0f2f5] pb-6">
      <div className="flex-[0.5] ">
        <SearchBar
          search={search}
          setSearch={setSearch}
          searchCss={searchCss}
        />
        {/* <CreateMetricTab
          buttonStyleCss={buttonStyleCss}
          dropDownCss={dropDownCss}
          searchValue={search}
        />
        <MetricsTab searchValue={search}/> */}
        <SavedColumnNames
          savedColNames={savedNames}
          savedId={fetchColById}
          dataId={savedId}
          deleteColId={deleteCol}
        />
        <PerformanceTab
          listArr={performanceList}
          setListArr={setListArr}
          searchValue={search}
          headerArray={listArr}
        />
        {dsaList.length > 0 && (
          <DsaTab
            listArr={dsaList}
            setListArr={setListArr}
            searchValue={search}
            headerArray={listArr}
            platform={platform}
          />
        )}
      </div>
      <div className="flex-[0.5] box-border cursor-pointer">
        <div className="mx-5 text-md mt-2 font-semibold text-gray-500">
          <span className="text-black"> {checkedList?.length}</span> Columns
          Selected
        </div>

        <div className="mt-4 ml-5">
          {stickyList?.map((obj) => {
            return <NonDraggableColumn key={obj?.id} obj={obj} />;
          })}
        </div>

        <div className="ml-5">
          <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
            <SortableContext items={checkedList}>
              {checkedList?.map((obj) => {
                return (
                  <DraggableColumn
                    obj={obj}
                    key={obj?.id}
                    id={obj?.id}
                    listArr={listArr}
                    setListArr={setListArr}
                    platform={platform}
                  />
                );
              })}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
};

export default CustomizeColPopup;
