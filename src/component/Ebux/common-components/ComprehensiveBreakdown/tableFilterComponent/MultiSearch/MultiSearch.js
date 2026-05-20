import React from "react";
import { TreeSelect } from "primereact/treeselect";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "./style.css";
import SearchPopUp from "./searchPopUp";
import {
  OSASearchFilter,
  _searchFilter,
  _kwsearchFilter,
  mathSign,
  notAllowedList,
} from "./searchData";

class MultiSearch extends React.Component {

  constructor(props) {
    super(props);
    this.filters = this.props.filters;
    this.kpi=this.props.kpi;

    let searchFilter;
    switch (this.kpi) {
      case "OSA":
        searchFilter = OSASearchFilter;
        break;
        
      case "SOS": case "OR":
        searchFilter = _kwsearchFilter;
        break;
      default:
        searchFilter = _searchFilter;
        break;
    }
    this.state = {
      nodes: this.getSearchOptions(),
      selectedNodeKeys: null,
      showPopUp: false,
      popUpData: { heading: "", key: "", value: "" },
      searchFilter: searchFilter,
      selectedNames: {},

      displaySearch: true,
      searchType: "search",
      defaultLabels: [],
      selectedFilter: null,
      disabled: false,
      disableSave: false,
    };

    this.onNodeSelected = this.onNodeSelected.bind(this);
    this.setSearchFilter = this.setSearchFilter.bind(this);
    this.onPopUpClose = this.onPopUpClose.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
  }

  componentDidMount() {
    this.injectDynamicStyles();
  }

  injectDynamicStyles = () => {
    // const platformColor = "#ef880f";

    // const css = `
    //     .p-dropdown-items > .p-dropdown-item:hover {
    //       background: ${platformColor} !important;
    //     }

    //     .p-checkbox .p-checkbox-box.p-highlight{
    //       border-color: ${platformColor} !important;
    //       background: ${platformColor} !important;
    //     }

    //     .p-checkbox .p-checkbox-box .p-checkbox-icon.p-icon {
    //       background:${platformColor} !important;
    //     }

    //     .p-tree .p-tree-container .p-treenode .p-treenode-content.p-highlight {
    //     background: #fff9ee !important;
    //     }
    // `;
    // const style = document.createElement("style");
    // style.setAttribute("id", `table-filter-tree`);
    // style.type = "text/css";
    // style.textContent = css;
    // document.head.appendChild(style);
  };

  componentWillUnmount() {
    const styleTag = document.getElementById(`table-filter-tree`);
    if (styleTag) {
      styleTag.remove();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.clearSearch !== this.props.clearSearch) {
      this.clearFilters();
      this.props.setClearSearch();
      this.setState({ disabled: false, disableSave: false });
    }
  }

  getSearchOptions() {
    // eslint-disable-next-line no-console
    // console.log("this.filters",this.filters)

    const platform = {
      key: "platform",
      label: "Platform",

      mapKey: "platform",
      selectable: false,
      children: this.filters?.platform?.map((item) => ({
        label: item?.label,
        key: `platform-${item?.value}-${item?.label}`,
        data: `Platform - ${item?.value}-${item?.label}`,
        className: this.state?.disabled ? "disableli" : "",
      }))
    };
    const brand = {
      key: "brand",
      label: "Brand",
      selectable: false,
      children: this.filters?.brand?.map((item) => ({
        label: item?.label,
        key: `brand-${item?.value}-${item?.label}`,
        data: `Brand - ${item?.value}-${item?.label}`,
        className: this.state?.disabled ? "disableli" : "",
      }))
    };

    


    const location = {
      key: "location",
      label: "Location",
      selectable: false,
      children: this.filters?.locationPincode?.map((item) => ({
        label: (item.value == '10' ? "All (Amazon)" : item.value == '24' ? "All (Nykaa)" : `${item.city} (${item.label})`),
        key: `location-${item?.value}-${(item.value == '10' ? "All (Amazon)" : item.value == '24' ? "All-Nykaa" : `${item.city} (${item.label})`)}`,
        data: `Location - ${item?.value}-${(item.value == '10' ? "All (Amazon)" : item.value == '24' ? "All-Nykaa" : `${item.city} (${item.label})`)}`,
        className: this.state?.disabled ? "disableli" : "",
      }))
    };

    let customSearchFilter = this.props.customSearchFilter;

    let saveSearchData = this.props.saveSearch;
    let temp = saveSearchData.children?.map((item) => ({
      ...item,
      className:
        // eslint-disable-next-line no-unsafe-optional-chaining
        (this.state?.disabled && !(item.key in this.state?.selectedNodeKeys)) ||
          this.state?.disableSave
          ? "disableli"
          : "",
    }));
    saveSearchData.children = temp;

    if ((["SOS", "OR"].includes(this.kpi))) {
      
      const keywordCategory = {
        key: "category",
        label: "Category",
        selectable: false,
        children: this.filters?.keywordCategory?.map((item) => ({
          label: item?.label,
          key: `category-${item?.value}-${item?.label}`,
          data: `Category - ${item?.value}-${item?.label}`,
          className: this.state?.disabled ? "disableli" : "",
        }))
      };
      const keywordType = {
        key: "keyword Type",
        label: "Keyword Type",
        selectable: false,
        children: this.filters?.keywordType?.map((item) => ({
          label: item?.label,
          key: `keyword Type-${item?.value}-${item?.label}`,
          data: `keyword Type - ${item?.value}-${item?.label}`,
          className: this.state?.disabled ? "disableli" : "",
        }))
      };
      
    // eslint-disable-next-line no-console
    console.log("this.kpi", this.kpi,{keywordCategory},{keywordType});
      return [platform,brand,keywordType, keywordCategory, location, ...customSearchFilter];
      // return [platform,brand, location, ...customSearchFilter];

    } else {
      const category = {
        key: "category",
        label: "Category",
        selectable: false,
        children: this.filters?.category?.map((item) => ({
          label: item?.label,
          key: `category-${item?.value}-${item?.label}`,
          data: `Category - ${item?.value}-${item?.label}`,
          className: this.state?.disabled ? "disableli" : "",
        }))
      };
      return [platform, brand, category, location, ...customSearchFilter];

    }
  }

  onNodeSelected = (e) => {
    // console.log(this.state, "<<<<<<<<< E");
    // eslint-disable-next-line no-console
    // console.log({e});

    let searchType = "search";
    let splitKey = e.node.key.split("-");
    if (
      [
        "platform",
        "brand",
        "category",
        "location",
        "keyword Type"
      ].indexOf(splitKey[0]) > -1
    ) {
      // console.log("<<< inside main");
      searchType = splitKey[0];
      this.setState({ selectedFilter: splitKey });
    } else if (
      Object.prototype.hasOwnProperty.call(
        this.state.searchFilter,
        splitKey[0]
      ) === true &&
      splitKey[0] === "custom") {
      searchType = (e.node?.mapKey) ? "search" : "metric";
    } else if (
      Object.prototype.hasOwnProperty.call(
        this.state.searchFilter,
        splitKey[0]
      ) === true &&
      splitKey[0] !== "name_id"
    ) {
      searchType = "metric";
    }

    if (splitKey[0] !== "saved_search") {
      this.setState({
        searchType: searchType,
        showPopUp: true,
        popUpData: e.node,
        displaySearch: !this.state.displaySearch,
        disableSave: true,
      });
    } else {
      if (splitKey[0] === "saved_search") {
        this.setState({ disabled: true });
        try {
          let search = JSON.parse(e.node.data);

          Object.keys(search).map((key) => {
            let item = search[key];

            Object.keys(item).map((name) => {
              if (item[name].length > 0) {
                let row = item[name];

                this.setSearchFilter(row);
              }
            });
          });
        } catch (e) {
          console.error(e);
        }
      }
    }
  };


  onNodeRemoved = (key) => {
    this.setState({ disabled: false });
    let selectedNodeKeys = this.state.selectedNodeKeys;

    let splitKey = key.split("-");

    let searchFilter = this.state.searchFilter;
    if (Object.prototype.hasOwnProperty.call(selectedNodeKeys, key)) {
      if (Object.prototype.hasOwnProperty.call(searchFilter, splitKey[0])) {
        searchFilter[splitKey[0]] = searchFilter[splitKey[0]].filter(
          (rm) => rm.key !== splitKey[1]
        );
      }
      delete selectedNodeKeys[key];
      if (Object.keys(selectedNodeKeys).length == 1) {
        this.setState({ disableSave: false });
      }
      this.setState({ selectedNodeKeys, searchFilter }, () => {
        this.props.applySearchFilter(
          searchFilter,
          splitKey[0] === "name_id" ? splitKey[1] : splitKey[0]
        );
      });

      if (splitKey[0] === "saved_search") {
        this.clearFilters();
      }
      let clearFilters = true;
      Object.keys(selectedNodeKeys).forEach(function (key) {
        if (selectedNodeKeys[key].checked) {
          clearFilters = false;
        }
      });
      if (clearFilters) {
        this.clearFilters();
        this.props.setClearSearch();
        this.setState({ disabled: false, disableSave: false });
      }
    }

  };

  onPopUpClose = (key) => {
    this.onNodeRemoved(key);
  };

  clearFilters = () => {
    this.setState({
      searchFilter: _searchFilter,
      selectedNodeKeys: null,
    });
    this.props.applySearchFilter(
      _searchFilter,
      "clear"
    );
  };

  setShowPopUp = () => {
    this.setState({
      showPopUp: !this.state.showPopUp,
      displaySearch: !this.state.displaySearch,
    });
  };

  setSearchFilter = (obj) => {
    if (Array.isArray(obj)) {
      if (
        Object.prototype.hasOwnProperty.call(this.state.searchFilter, obj[0].pkey)
      ) {
        let filters = this.state.searchFilter;
        obj.forEach((item) => filters[item.pkey].push(item));

        this.setState({ searchFilter: filters }, () => {
          this.props.applySearchFilter(
            filters,
            obj[0].pkey === "name_id" ? obj[0].key : obj[0].pkey,
            obj[0],
            obj[1]
          );
        });
      }
    } else {
      if (
        Object.prototype.hasOwnProperty.call(this.state.searchFilter, obj.pkey)
      ) {
        let filters = this.state.searchFilter;
        filters[obj.pkey].push(obj);
        // filters[obj.pkey].push(obj);
        this.setState({ searchFilter: filters }, () => {
          this.props.applySearchFilter(
            filters,
            obj.pkey === "name_id" ? obj.key : obj.pkey
          );
        });
      }
    }
    // console.log(obj, "searchfilterinitial");
  };

  removeItemUsingClick = (e, key) => {
    e = e.filter((val) => val.key !== key);
    this.onNodeRemoved(key);
    this.searchLabel(e);
  };

  searchLabel = (e) => {
    // eslint-disable-next-line no-console
    // console.log(e, "event");

    return e.map((val, index) => {
      let mapObj = { value: "", sign: "" }; // For expression filters like spends > 10, click between 10-20
      let nameObj = { contains: [], not_contains: [] }; // Only for Name:Id filters

      let keyArr = val?.key?.split("-"); // 'name_id-keyword' --> ['name_id', 'keyword']

      //For Name:Id filters only stores contains and not contains values
      if (val?.mapKey && !notAllowedList[keyArr[0]]) {
        // mapKey is additonal key which is available only on Name:Id obj
        this?.state?.searchFilter[keyArr[0]]?.forEach((obj) => {
          if (obj?.pkey === keyArr[0] && obj?.key === keyArr[1]) {


            nameObj[obj?.condition] = obj?.value;
          }
        });
      }

      // For expression filters only like greater, between
      if (!val?.mapKey && !notAllowedList[keyArr[0]]) {
        this?.state?.searchFilter[keyArr[0]]?.forEach((obj) => {
          if (obj?.pkey === keyArr[0] && obj?.key === keyArr[1]) {
            mapObj.value = obj?.value;

            mapObj.sign = mathSign[obj?.condition];
          }
        });
      }
      // eslint-disable-next-line no-console
      // console.log({val}, "neww", this.state.searchFilter, {keyArr},{nameObj},{mapObj});

      {
        if (!val.children) {
          var labelType = [];
          var label = val?.data;
          let keys = val?.key.split("-");
          if (keys[0] === "saved_search") {
            label = "Saved Search - " + val?.label;
            labelType[0] = "Saved Search";
            labelType[1] = val?.label;
          } else {
            labelType = val?.data?.split("-");
            // eslint-disable-next-line no-console
            // console.warn(labelType);
          }
        }
      }
      if (label === undefined) {
        return <div key={index}></div>;
      } else {
        return (
          // <>
          // {label !== undefined && (
          <div
            // key={index}
            key={`${index}-${val?.key}`}
            className="treeselect-input__tags-element group !p-0 !pr-1 flex items-center !bg-white border border-[#D6D6D7] hover:!bg-[#f1dada]  hover:border-[#DD4242] hover:text-[#DD4242] font-semibold"
            onClick={(event) => {
              event.stopPropagation();
              this.removeItemUsingClick(e, val.key);
            }}
          >
            <>
              <div className="py-1 pr-1">
                <span className=" pl-2 pr-1">{`${labelType[0] ? labelType[0] : label
                  }`}</span>
              </div>

              {labelType[1]?.length > 1 && (
                <div className="p-1 border-l group-hover:border-l-[#DD4242]">
                  <span className="my-1 ml-1 rounded-sm font-semibold px-2 bg-[#cce6fd] group-hover:bg-[#eec4c4] text-[#0081F7] group-hover:text-[#DD4242] ">
                    {`${labelType?.[2] ?? labelType[1]}`}
                  </span>
                </div>
              )}

              {val?.mapKey ? (
                <>
                  {nameObj?.contains?.length > 0 && (
                    <>
                      <div className="p-1 border-l group-hover:border-l-[#DD4242]">
                        <span className="my-1 ml-1 px-1 font-normal">
                          contains
                        </span>
                      </div>
                      <div className="p-1 border-l group-hover:border-l-[#DD4242]">
                        <span className="my-1 ml-1 px-2 rounded-sm bg-[#cce6fd] group-hover:bg-[#eec4c4] text-[#0081F7] group-hover:text-[#DD4242] ">
                          {nameObj?.contains?.join(", ")}
                        </span>
                      </div>
                    </>
                  )}
                  {nameObj?.not_contains?.length > 0 && (
                    <>
                      <div className="p-1 border-l group-hover:border-l-[#DD4242]">
                        <span className="my-1 ml-1 px-1 font-normal">
                          not contains
                        </span>
                      </div>
                      <div className="p-1 border-l group-hover:border-l-[#DD4242]">
                        <span className="my-1 ml-1 px-2 rounded-sm bg-[#cce6fd] group-hover:bg-[#eec4c4] text-[#0081F7] group-hover:text-[#DD4242] ">
                          {nameObj?.not_contains?.join(", ")}
                        </span>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  {mapObj?.sign && (
                    <div className="p-1 border-l group-hover:border-l-[#DD4242] flex items-center">
                      {mapObj?.sign === "between" ||
                        mapObj?.sign === "isn't between" ? (
                        <span className="font-normal">{mapObj?.sign}</span>
                      ) : (
                        <span className="px-1 border rounded-sm">
                          {mapObj?.sign}
                        </span>
                      )}
                    </div>
                  )}
                  {mapObj?.value && (
                    <div className="p-1 border-l group-hover:border-l-[#DD4242]">
                      <span className="my-1 ml-1 rounded-sm px-2 bg-[#cce6fd] group-hover:bg-[#eec4c4] text-[#0081F7] group-hover:text-[#DD4242] ">
                        {Array.isArray(mapObj?.value) ? mapObj?.value.join(",") : mapObj?.value}
                      </span>
                    </div>
                  )}
                </>
              )}
              <span className="treeselect-input__tags-cross">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 25 25"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </span>
            </>
          </div>
          // )}
          // </>
        );
      }


    });
  };

  handleSelectedNames = (obj) => {
    this.setState((prevState) => ({
      selectedNames: { ...prevState?.selectedNames, ...obj },
    }));
  };

  attachStateToData = (data) => {
    const newArr = data?.children?.map((obj) => {
      return {
        ...obj,
        data: `${obj?.label} ${this?.state?.selectedNames?.[obj?.mapKey]?.length > 0
            ? this?.state?.selectedNames?.[obj?.mapKey]?.join(", ")
            : "Name/Id"
          }`,
      };
    });
    const obj = {
      ...data,
      children: newArr,
    };
    return obj;
  };

  render() {
    let { selectedNodeKeys, showPopUp, popUpData, displaySearch } = this.state;

    return (
      <>
        <div
          className={`card flex justify-content-center`}
          style={{
            width: "100%",
          }}
        >
          <TreeSelect
            // placeholder={"HELO"}
            value={selectedNodeKeys}
            onNodeUnselect={(e) => {
              this.onNodeRemoved(e.node.key, e.node);
            }}
            onChange={(e) => {
              this.setState({
                selectedNodeKeys: e.value,
              });
            }}
            style={{ height: "3rem" }}
            inputId="treeSelect"
            options={this.getSearchOptions()}
            metaKeySelection={false}
            className=" w-full"
            selectionMode="checkbox"
            display="chip"
            filter
            onNodeSelect={(e) => {
              this.onNodeSelected(e);
            }}
            panelStyle={
              displaySearch ? { display: "flow" } : { display: "none" }
            }
            valueTemplate={(e) => {
              if (e.length > 0) {
                let treeselectLabelElements = document.querySelectorAll(".p-placeholder");
                treeselectLabelElements.forEach((element) => {
                  Object.assign(element.style, { padding: "0.35rem 0.75rem" });
                });
                return this.searchLabel(e);
              } else {
                const nodes = document.querySelectorAll(
                  `.p-treeselect-label-empty`
                );
                nodes.forEach((node) => {
                  node.classList.remove("p-treeselect-label-empty");
                });

                let treeselectLabelElements =
                  document.querySelectorAll(".p-placeholder");
                treeselectLabelElements.forEach((element) => {
                  Object.assign(element.style, { padding: "0.75rem 0.75rem" });
                });
                return (
                  <>
                    <span className="fa fa-search form-control-feedback"></span>
                    <span className="ml-5">Search</span>
                  </>
                );
              }
            }}
            tabIndex={-1}
          />
        </div>

        {showPopUp ? (
          <SearchPopUp
            popUpData={popUpData}
            showPopUp={true}
            setShowPopUp={this.setShowPopUp}
            setSearchFilter={this.setSearchFilter}
            searchType={this.state.searchType}
            onPopUpClose={this.onPopUpClose}

            selectedFilter={this.state.selectedFilter}
            handleSelectedNames={this.handleSelectedNames}
          />
        ) : (
          ""
        )}
      </>
    );
  }
}

export default MultiSearch;