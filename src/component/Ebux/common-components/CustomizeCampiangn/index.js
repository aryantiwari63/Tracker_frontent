import { useEffect, useMemo, useState } from "react";
import Popup from "../../../common-components/Popups/Popup";
// import SearchBar from "../../../common-components/SearchBar";
import SelectCheckComponent from "./SelectCheckComponent";
import CustomizeCampiagnRightPanel from "./CustomizeCampiagnRightPanel";
import SearchBar from "./SearchBar";
import { useEbuxContext } from "../../Context/EbuxProvider";
import SaveViewComponent from "./SaveViewComponent";
import {
  deleteCustomizeColumnsSaveView,
  getCustomizeColumnsSaveViews,
  saveCustomizeColumnsView,
  setDefaultCustomizeColumnsView,
} from "../../services/customizeColumnsSaveView.service";
import { isEqual } from "lodash";
import DeleteDailog from "../Popups/DeleteDailog";

// import {allColumns} from "./allColumnsData"

const CustomizeCampiagnModal = ({
  // popupTitle="OSA",

  isWidget = false,
  closePopup = () => { },
  selectedTabName = "",
  kpi = "",
  tabColumnList,
  setTabColumnList,
  isSaveViewVisible = true,
  columnVisible = "All",
  fixedColumns = [],
  dummyColumnGroup = [],
  initCustomizeColumns = {},
  isRemovable = false

}) => {
  const { clientCustomizeColumnsComprehensiveBreakdown } = useEbuxContext();

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [allColumns] = useState({
    ...((Object?.keys(initCustomizeColumns ?? {})?.length) ? initCustomizeColumns : clientCustomizeColumnsComprehensiveBreakdown)
  });
  const [selectedSaveView, setSelectedSaveView] = useState(null);
  const [search, setSearch] = useState("");
  const [newViewName, setNewViewName] = useState("");
  const [allSaveTabViews, setAllSaveTabViews] = useState([]);
  const [saveViewModel, setSaveViewModel] = useState(false);
  const [saveViewModelError, setSaveViewModelError] = useState(null);
  const [deleteDailogObj, setDeleteDailogObj] = useState({
    show: false,
    obj: {},
  });

  const handleSelect = (option) => {
    setSelectedOptions((prevSelectedOptions) => {
      const updated = prevSelectedOptions.some(
        (obj) => obj.value === option.value && obj.type === option.type
      )
        ? prevSelectedOptions
        : [...prevSelectedOptions, option];
      return updated;
    });
  };

  const removeColumn = (option) => {
    setSelectedSaveView(null);

    setSelectedOptions((prevSelectedOptions) => {
      let updated = [];
      if (option.value === "competition_brand") {
        updated = prevSelectedOptions.filter(
          (obj) =>
            ![
              "competition_brand",
              "competition_osa",
              "competition_price_variation",
              "competition_price_rp",
              "competition_price_sp",
            ].includes(obj.value)
        );
      } else {
        // Remove only the selected option if it exists
        updated = prevSelectedOptions.some(
          (obj) => obj.value === option.value && obj.type === option.type
        )
          ? prevSelectedOptions.filter(
            (obj) => !(obj.value === option.value && obj.type === option.type)
          )
          : prevSelectedOptions;
      }
      return updated;
    });
  };

  const handleApply = () => {
    setTabColumnList((per) => ({ ...per, [selectedTabName]: selectedOptions }));
    closePopup();
  };

  const openSaveModel = () => {
    setSaveViewModel(true);
  };
  const handleSaveNewView = async () => {
    if (!newViewName.trim()) return;

    const newView = {
      kpi,
      tabName: selectedTabName,
      title: newViewName?.trim(),
      selectedOptions,
    };

    const isDuplicate = allSaveTabViews.some(
      (view) =>
        view.title === newView.title &&
        view.kpi === newView.kpi &&
        view.tabName === newView.tabName
    );
    if (isDuplicate) {
      setSaveViewModelError("Duplicate name for the view");
      return;
    }

    setSaveViewModelError(null);
    const saved = await saveCustomizeColumnsView(newView);
    if (saved) {
      const updatedViews = [...allSaveTabViews, saved];
      setAllSaveTabViews(updatedViews);
      setSelectedSaveView(saved?.title);
      closeSavePopup();
    }
  };

  const closeSavePopup = () => {
    setNewViewName("");
    setSaveViewModel(false);
  };
  const deleteSaveView = async () => {
    const option = deleteDailogObj?.obj;
    setDeleteDailogObj({ show: false, obj: {} });
    const success = await deleteCustomizeColumnsSaveView(option.id);
    if (success) {
      if (option?.title == selectedSaveView) {
        setSelectedSaveView(null);
      }
      setAllSaveTabViews((prev) => prev.filter((i) => i.id !== option.id));
    }
  };
  const handleDeleteView = async (option) => {
    setDeleteDailogObj({ show: true, obj: option });
  };
  const handleSelectSaveView = (option) => {
    setSelectedSaveView(option?.title);
    setSelectedOptions(option?.selectedOptions);
  };
  const fetchViews = async (set = true) => {
        const allSavedViews = await getCustomizeColumnsSaveViews(
          kpi,
          selectedTabName
        );
        setAllSaveTabViews(allSavedViews);
        // allSavedViews.forEach((view)=>console.log("view.selectedOptions",view?.selectedOptions,isEqual(view.selectedOptions, tabColumnList[selectedTabName])));
        if(set){
          if (tabColumnList?.[selectedTabName]?.length) {
            setSelectedOptions(tabColumnList[selectedTabName]);
            // console.log("tabColumnList[selectedTabName]",tabColumnList[selectedTabName]);
  
            // const matchedView = allSavedViews.find(
            //   (view) =>
            //     isEqual(view.selectedOptions, tabColumnList[selectedTabName])  &&
            //     view.kpi === kpi &&
            //     view.tabName === selectedTabName
            // );
            // setSelectedSaveView(matchedView ? matchedView.title : null);
          } else {
            const selected = [];
            Object.keys(allColumns).forEach((group) => {
              allColumns[group]?.columns?.forEach((col) => {
                if (
                  col?.breakdown === selectedTabName &&
                  col?.type === "breakdown"
                ) {
                  selected.push({ ...col, remove: false, drag: false });
                }
                if (col?.kpi?.includes(kpi) && col?.type !== "breakdown") {
                  selected.push({ ...col });
                }
              });
            });
  
            setTabColumnList((prev) => ({ ...prev, [selectedTabName]: selected }));
            setSelectedOptions(selected);
            const matchedView = allSavedViews.find(
              (view) =>
                JSON.stringify(view.selectedOptions) === JSON.stringify(selected) &&
                view.kpi === kpi &&
                view.tabName === selectedTabName
            );
            setSelectedSaveView(matchedView ? matchedView.title : null);
          }
        }
      };
  useEffect(() => {
    if (fixedColumns.length) {
      setSelectedOptions(fixedColumns);
    } else {
      fetchViews(true);
    }
  }, [selectedTabName, kpi]);

  const handleSetDefault = async (view) => {
    console.log("view to set default", view);
    await setDefaultCustomizeColumnsView(view.id, kpi, selectedTabName);
    fetchViews(false);
    handleSelectSaveView(view);
    // setAllSaveTabViews(updated);
  };
  console.log("here check selectedOptions", selectedOptions);

  const filteredSavedViews = useMemo(() => {
    return allSaveTabViews.filter(
      (view) => view.kpi === kpi && view.tabName === selectedTabName
    );
  }, [allSaveTabViews, kpi, selectedTabName]);

  useEffect(() => {
    const matchedView = allSaveTabViews.find(
      (view) =>
        isEqual(view.selectedOptions, selectedOptions) &&
        view.kpi === kpi &&
        view.tabName === selectedTabName
    );
    setSelectedSaveView(matchedView ? matchedView.title : null);
  }, [selectedOptions, allSaveTabViews, kpi, selectedTabName]);


  return (
    <>
      <Popup
        applyAction={handleApply}
        setShowPopup={closePopup}
        title={
          <>
            Customize Column
            {/* {popupTitle} Column */}
          </>
        }
        customStyle={{ backgroundColor: "", Padding: "4px" }}
        cutomButton={[
          {
            label: "Cancel",
            style: "bg-[#E3E3E3] text-[#5B5B5B]",
            handleClick: closePopup,
          },
          ...(isSaveViewVisible ?
            [{
              label: "Save",
              style: `bg-[#E3E3E3] text-[#5B5B5B] ${selectedSaveView == null ? "" : "opacity-50 cursor-not-allowed"
                }`,
              handleClick: selectedSaveView == null ? openSaveModel : () => { },
            }] : []),
          { label: "Apply", style: "", handleClick: handleApply },
        ]}
        largesize
        saveBtn={true}
      >
        <div className="row">
          <div className="col_6 px-2">
            <SearchBar
              search={search}
              setSearch={setSearch}
              searchCss={"outline-orange-300"}
            />
            {isSaveViewVisible && <SaveViewComponent
              key={`saved_view`}
              searchValue={search}
              expanded={true}
              platform={"Saved Views"}
              options={filteredSavedViews}
              onSelect={handleSelectSaveView}
              onDelete={handleDeleteView}
              onSetDefault={handleSetDefault}
              selectedOptions={selectedSaveView}
              kpi={kpi}
            />}
            {Object.keys(allColumns).map((columnGroup, i) => {   
              if (columnVisible === "All") {
                return (
                  <SelectCheckComponent
                    key={`${i}_${columnGroup}`}
                    searchValue={search}
                    expanded={true}
                    platform={allColumns[columnGroup]?.title}
                    options={allColumns[columnGroup]?.columns}
                    onSelect={handleSelect}
                    selectedOptions={selectedOptions}
                    kpi={kpi}
                  />
                );
              }

              if (columnGroup === columnVisible) {
                const columns = allColumns[columnGroup]?.columns ?? [];
                const columList = [
                  ...(isWidget ? columns?.filter(i => i?.allowInWidget) ?? [] : columns),
                  ...dummyColumnGroup,
                ];
                return (
                  <SelectCheckComponent
                    key={`${i}_${columnGroup}`}
                    searchValue={search}
                    expanded={true}
                    platform={allColumns[columnGroup]?.title}
                    options={columList}
                    onSelect={handleSelect}
                    selectedOptions={selectedOptions}
                    kpi={kpi}
                  />
                );
              }

              return null;
            })}
          </div>
          <div className="col_6">
            <CustomizeCampiagnRightPanel
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
              removeColumn={removeColumn}
              isRemovable={isRemovable}
            />
          </div>
        </div>
      </Popup>
      {saveViewModel ? (
        <Popup
          applyAction={handleSaveNewView}
          setShowPopup={closeSavePopup}
          title={<>Save View</>}
          customStyle={{ backgroundColor: "", Padding: "4px" }}
          cutomButton={[
            {
              label: "Cancel",
              style: "bg-[#E3E3E3] text-[#5B5B5B]",
              handleClick: closeSavePopup,
            },
            { label: "Confirm", style: "", handleClick: handleSaveNewView },
          ]}
          extrasmall
          saveBtn={true}
        >
          <div className="row flex relative bg-white px-3 py-2">
            <label>
              {" "}
              Enter name for the view
              <input
                pattern="[A-Za-z0-9]*"
                type="text"
                placeholder="Enter name for the view"
                className={`h-[37px] border w-full px-1 pl-1`}
                maxLength={50}
                value={newViewName}
                onChange={(e) =>
                  setNewViewName(e.target.value.replace(/[^a-zA-Z0-9 ]/g, ""))
                }
              />
              {saveViewModelError ? (
                <span className={`text-red-500`}>{saveViewModelError}</span>
              ) : (
                <></>
              )}
            </label>
          </div>
        </Popup>
      ) : (
        <></>
      )}
      {deleteDailogObj?.show ? (
        <DeleteDailog
          // heading={`Delete ${deleteDailogObj?.obj?.title} ?`}
          heading={<> Delete <br /> <span className="break-all capitalize">{deleteDailogObj?.obj?.title} ?</span> </>}
          text="This will permanently delete your saved view from our servers."
          handleClose={() =>
            setDeleteDailogObj({
              show: false,
              obj: {},
            })
          }
          onDelete={() => deleteSaveView()}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default CustomizeCampiagnModal;
