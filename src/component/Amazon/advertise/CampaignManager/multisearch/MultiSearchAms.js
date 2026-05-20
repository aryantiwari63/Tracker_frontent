import React from "react";
import { TreeSelect } from "primereact/treeselect";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
// import "./style.css";
// import SearchPopUp from "./searchPopUp";
import SearchPopUp from "../../../../common-components/MultiSearch/searchPopUp";

class MultiSearchAms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: this.getSearchOptions(),
      selectedNodeKeys: null,
      showPopUp: false,
      popUpData: { heading: "", key: "", value: "" },
      searchFilter: {
        saved_search: [],
        name_id: [],
        portfolio_m: [],
        campaign_m: [],
        keyword_m: [],
        ad_group_m: [],
        placement_m: [],
        asin_m: [],
      },
      displaySearch: true,
      searchType: "search",
      defaultLabels: [],
    };
    this.onNodeSelected = this.onNodeSelected.bind(this);
    this.setSearchFilter = this.setSearchFilter.bind(this);
    this.onPopUpClose = this.onPopUpClose.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.clearSearch !== this.props.clearSearch) {
      this.clearFilters();
      this.props.setClearSearch();
    }
  }

  getSearchOptions() {
    let metrics = {
      portfolio_m: {
        label: "Portfolio Metric",
        key: "portfolio_m",
        selectable: false,
        tab: "portfolio",
      },
      campaign_m: {
        label: "Campaign Performance Metric",
        key: "campaign_m",
        selectable: false,
        tab: "campaign",
      },
      ad_group_m: {
        label: "Adgroup Performance Metric",
        key: "ad_group_m",
        selectable: false,
        tab: "adgroup",
      },
      keyword_m: {
        label: "Keyword Performance Metric",
        key: "keyword_m",
        selectable: false,
        tab: "keyword",
      },

      placement_m: {
        label: "Placement Metric",
        key: "placement_m",
        selectable: false,
        tab: "placement",
      },
    };

    let metricsOptions = {
      keyword_bid: {
        label: "Keyword bid",
        key: "keyword_bid",
        isAvailable: ["keyword"],
      },
      count: {
        label: "Campaign count",
        key: "count",
        isAvailable: ["portfolio"],
      },
      impression: {
        label: "Impression",
        key: "impressions",
        isAvailable: ["portfolio", "campaign", "adgroup", "placement"],
      },
      // eslint-disable-next-line no-dupe-keys
      impression: {
        label: "Impression",
        key: "views",
        isAvailable: ["keyword"],
      },
      clicks: {
        label: "Click",
        key: "clicks",
        isAvailable: [
          "portfolio",
          "campaign",
          "adgroup",
          "placement",
          "keyword",
        ],
      },
      ctr: {
        label: "CTR",
        key: "ctr",
        isAvailable: [
          "portfolio",
          "campaign",
          "adgroup",
          "placement",
          "keyword",
        ],
      },
      spends: {
        label: "Spend",
        key: "spends",
        isAvailable: [
          "portfolio",
          "campaign",
          "adgroup",
          "placement",
          "keyword",
        ],
      },
      cpc: {
        label: "CPC",
        key: "cpc",
        isAvailable: [
          "portfolio",
          "campaign",
          "adgroup",
          "placement",
          "keyword",
        ],
      },
      orders: {
        label: "Orders",
        key: "orders",
        isAvailable: [
          "portfolio",
          "campaign",
          "adgroup",
          "placement",
          "keyword",
        ],
      },
      sales: {
        label: "Sales",
        key: "sales",
        isAvailable: [
          "portfolio",
          "campaign",
          "adgroup",
          "placement",
          "keyword",
        ],
      },
      acos: {
        label: "ACOS",
        key: "acos",
        isAvailable: [
          "portfolio",
          "campaign",
          "adgroup",
          "placement",
          "keyword",
        ],
      },
      roas: {
        label: "ROAS",
        key: "roas",
        isAvailable: [
          "portfolio",
          "campaign",
          "adgroup",
          "placement",
          "keyword",
        ],
      },
      // ntb_order: {
      //   label: "NTB orders",
      //   key: "ntb_order",
      //   isAvailable: ["portfolio", "campaign"],
      // },
      // ntb_order_perc: {
      //   label: "% of orders NTB ",
      //   key: "ntb_order_perc",
      //   isAvailable: ["portfolio", "campaign"],
      // },
      // ntb_sales: {
      //   label: "NTB sales",
      //   key: "ntb_sales",
      //   isAvailable: ["portfolio", "campaign"],
      // },
      // ntb_sales_perc: {
      //   label: "% of sales NTB ",
      //   key: "ntb_sales_perc",
      //   isAvailable: ["portfolio", "campaign"],
      // },
      viewable_impressions: {
        label: "Viewable Impressions ",
        key: "viewable_impression",
        isAvailable: ["portfolio", "campaign"],
      },
      vtr: { label: "VTR", key: "vtr", isAvailable: ["campaign"] },
      vctr: { label: "VCTR", key: "vctr", isAvailable: ["campaign"] },
    };
    let treeOption = [];

    Object.keys(metrics).map((key) => {
      let row = { ...metrics[key] };
      let childern = [];
      Object.keys(metricsOptions).map((val) => {
        if (metricsOptions[val].isAvailable.includes(row.tab)) {
          let set = {
            label: metricsOptions[val].label,
            key: metrics[key].key + "-" + metricsOptions[val].key,
            data: `${row.label} - ${metricsOptions[val].label}`,
          };
          childern.push(set);
        }
      });
      row.children = childern;
      treeOption.push(row);
    });

    return [
      this.props.saveSearch,
      {
        key: "portfolio",
        label: "Portfolio",
        selectable: false,
        children: [
          // {
          //   key: "name_id-profile",
          //   label: "Profile",
          //   data: "Name/ID - Profile",
          // },
          {
            key: "name_id-portfolio",
            label: "Portfolio Name",
            data: "Name/ID - Portfolio",
          },
          // {
          //   key: "name_id-status",
          //   label: "Status",
          //   data: "Name/ID - Status",
          // },
        ],
      },
      // {
      //   key: "profile",
      //   label: "Profile",
      //   selectable: false,
      //   children: [
      //     {
      //       key: "name_id-profile",
      //       label: "Profile",
      //       data: "Name/ID - Profile",
      //     },
      //   ],
      // },
      {
        key: "campaign",
        label: "Campaign",
        selectable: false,
        children: [
          {
            key: "name_id-campaign_name",
            label: "Campaign-Name",
            data: "Name/ID - Campaign-Name",
          },
          // {
          //   key: "name_id-profile",
          //   label: "Profile",
          //   data: "Name/ID - Profile",
          // },
          // {
          //   key: "name_id-campaigntag",
          //   label: "Campaign Tag",
          //   data: "Name/ID - Campaign Tag",
          // },
          // {
          //   key: "name_id-portfoli",
          //   label: "Portfolio",
          //   data: "Name/ID - Portfolio",
          // },
          // {
          //   key: "name_id-campaign",
          //   label: "Campaign ",
          //   data: "Name/ID - Campaign ",
          // },
          // {
          //   key: "name_id-campaigntype",
          //   label: "Campaign Type",
          //   data: "Name/ID - Campaign Type",
          // },
          // {
          //   key: "name_id-status",
          //   label: "Status",
          //   data: "Name/ID - Status",
          // },
          // {
          //   key: "name_id-state",
          //   label: "State",
          //   data: "Name/ID - State",
          // },
          // {
          //   key: "name_id-startdate",
          //   label: "Start Date",
          //   data: "Name/ID - Start Date",
          // },
        ],
      },
      {
        key: "ad group",
        label: "Adgroup",
        selectable: false,
        children: [
          // {
          //   key: "name_id-profile",
          //   label: "Profile",
          //   data: "Name/ID - Profile",
          // },

          // {
          //   key: "name_id-campaigntag",
          //   label: "Campaign Tag",
          //   data: "Name/ID - Campaign Tag",
          // },
          // {
          //   key: "name_id-adgroup",
          //   label: "Ad Group",
          //   data: "Name/ID - Ad Group",
          // },
          {
            key: "name_id-adgroupname",
            label: "Ad Group Name ",
            data: "Name/ID - Ad Group Name ",
          },
          // {
          //   key: "name_id-status",
          //   label: "Status",
          //   data: "Name/ID - Status",
          // },
          // {
          //   key: "name_id-state",
          //   label: "State",
          //   data: "Name/ID -State",
          // },

          // {
          //   key: "name_id-campaigntype",
          //   label: "Campaign Type",
          //   data: "Name/ID - Campaign Type",
          // },
          // {
          //   key: "name_id-targetingtype",
          //   label: "Targeting Type",
          //   data: "Name/ID - Targeting Type",
          // },
        ],
      },
      {
        key: "keyword",
        label: "Keyword",
        selectable: false,
        children: [
          {
            key: "name_id-keyword",
            label: "Keyword Name",
            data: "Name/ID - keyword",
          },
          //   {
          //     key: "name_id-campaigntag",
          //     label: "Campaign Tag",
          //     data: "Name/ID - Campaign Tag",
          //   },
          //   {
          //     key: "name_id-portfolio",
          //     label: "Portfolio",
          //     data: "Name/ID - Portfolio",
          //   },
          //   {
          //     key: "name_id-matchtype",
          //     label: "Match Type",
          //     data: "Name/ID - Match Type",
          //   },
          //   {
          //     key: "name_id-Campaign",
          //     label: "Campaign ",
          //     data: "Name/ID - campaign ",
          //   },
          //   {
          //     key: "name_id-sortby",
          //     label: "Sort By",
          //     data: "Name/ID - Sort By",
          //   },
          //   {
          //     key: "name_id-status",
          //     label: "Status",
          //     data: "Name/ID -Status",
          //   },
          //   {
          //     key: "name_id-state",
          //     label: "State",
          //     data: "Name/ID - State",
          //   },
          //   {
          //     key: "name_id-currentbid",
          //     label: "Current Bid",
          //     data: "Name/ID - Current Bid",
          //   },
          //   {
          //     key: "name_id-bid",
          //     label: "Bid",
          //     data: "Name/ID -Bid",
          //   },
          //   {
          //     key: "name_id-keyword",
          //     label: "Keyword",
          //     data: "Name/ID -Keyword",
          //   },
          //   {
          //     key: "name_id-kws",
          //     label: "KWs Tag",
          //     data: "Name/ID -KWs Tag",
          //   },
          //   {
          //     key: "name_id-adgroup",
          //     label: "Adgroup",
          //     data: "Name/ID -Adgroup",
          //   },
        ],
      },
      {
        key: "targetingpat",
        label: "Targeting PAT",
        selectable: false,
        children: [
          {
            key: "name_id-profile",
            label: "Profile",
            data: "Name/ID - Profile",
          },
          {
            key: "name_id-campaigntag",
            label: "Campaign Tag",
            data: "Name/ID - Campaign Tag",
          },
          {
            key: "name_id-portfolio",
            label: "Portfolio",
            data: "Name/ID - Portfolio",
          },
          {
            key: "name_id-matchtype",
            label: "Match Type",
            data: "Name/ID - Match Type",
          },
          {
            key: "name_id-product",
            label: "Product ",
            data: "Name/ID - product ",
          },

          {
            key: "name_id-status",
            label: "Status",
            data: "Name/ID -Status",
          },
          {
            key: "name_id-state",
            label: "State",
            data: "Name/ID - State",
          },
          {
            key: "name_id-currentbid",
            label: "Current Bid",
            data: "Name/ID - Current Bid",
          },
          {
            key: "name_id-bid",
            label: "Bid",
            data: "Name/ID -Bid",
          },

          {
            key: "name_id-adgroup",
            label: "Adgroup",
            data: "Name/ID -Adgroup",
          },
          {
            key: "name_id-campaign",
            label: "Campaign",
            data: "Name/ID -Campaign",
          },
        ],
      },
      {
        key: "targeting audience",
        label: "Targeting Audience",
        selectable: false,
        children: [
          {
            key: "name_id-profile",
            label: "Profile",
            data: "Name/ID - Profile",
          },
          {
            key: "name_id-campaigntag",
            label: "Campaign Tag",
            data: "Name/ID - Campaign Tag",
          },
          {
            key: "name_id-portfolio",
            label: "Portfolio",
            data: "Name/ID - Portfolio",
          },
          {
            key: "name_id-campaign",
            label: "Campaign ",
            data: "Name/ID - Campaign ",
          },

          {
            key: "name_id-product",
            label: "Product ",
            data: "Name/ID - product ",
          },

          {
            key: "name_id-status",
            label: "Status",
            data: "Name/ID -Status",
          },
          {
            key: "name_id-state",
            label: "State",
            data: "Name/ID - State",
          },
          {
            key: "name_id-currentbid",
            label: "Current Bid",
            data: "Name/ID - Current Bid",
          },
          {
            key: "name_id-bid",
            label: "Bid",
            data: "Name/ID -Bid",
          },

          {
            key: "name_id-adgroup",
            label: "Adgroup",
            data: "Name/ID -Adgroup",
          },
        ],
      },
      // {
      //   key: "asin",
      //   label: "ASIN",
      //   selectable: false,
      //   children: [
      //     {
      //       key: "name_id-profile",
      //       label: "Profile",
      //       data: "Name/ID - Profile",
      //     },
      //     {
      //       key: "name_id-campaigntag",
      //       label: "Campaign Tag",
      //       data: "Name/ID - Campaign Tag",
      //     },
      //     {
      //       key: "name_id-portfolio",
      //       label: "Portfolio",
      //       data: "Name/ID - Portfolio",
      //     },
      //     {
      //       key: "name_id-campaign",
      //       label: "Campaign ",
      //       data: "Name/ID - Campaign ",
      //     },

      //     {
      //       key: "name_id-product",
      //       label: "Product ",
      //       data: "Name/ID - product ",
      //     },

      //     {
      //       key: "name_id-status",
      //       label: "Status",
      //       data: "Name/ID -Status",
      //     },
      //     {
      //       key: "name_id-state",
      //       label: "State",
      //       data: "Name/ID - State",
      //     },
      //     {
      //       key: "name_id-campaigntype",
      //       label: "Campaign Type",
      //       data: "Name/ID - campaigntype",
      //     },
      //     {
      //       key: "name_id-asintag",
      //       label: "ASIN Tag",
      //       data: "Name/ID - asintag",
      //     },

      //     {
      //       key: "name_id-adgroup",
      //       label: "Adgroup",
      //       data: "Name/ID -Adgroup",
      //     },
      //   ],
      // },

      ...treeOption,
    ];
  }

  onNodeSelected = (e) => {
    let searchType = "search";
    let splitKey = e.node.key.split("-");
    if (
      Object.prototype.hasOwnProperty.call(this.state.searchFilter, splitKey[0]) === true &&
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
      });
    } else {
      if (splitKey[0] === "saved_search") {
        //   let savedSearch={pkey:splitKey[0],key:e.node.key,value:e.node.data,condition:""};
        try {
          let search = JSON.parse(e.node.data);
          Object.keys(search).map((key) => {
            let item = search[key];
            Object.keys(item).map((name) => {
              let row = item[name];
              this.setSearchFilter(row);
            });
          });
        } catch (e) {
          console.error(e)
        }
        // console.log(savedSearch,"savedSearch")
        // this.setSearchFilter(savedSearch);
      }
    }
  };
  onNodeRemoved = (key) => {
    this.setState({ disabled: false });
    let selectedNodeKeys = this.state.selectedNodeKeys;

    let splitKey = key.split("-");

    // console.log(
    //   "key>>",
    //   key,
    //   "selectedNodeKeys>>",
    //   selectedNodeKeys,
    //   "split keys>>",
    //   splitKey
    // );
    let searchFilter = this.state.searchFilter;
    if (Object.prototype.hasOwnProperty.call(selectedNodeKeys, key)) {
      if (Object.prototype.hasOwnProperty.call(searchFilter, splitKey[0])) {
        searchFilter[splitKey[0]] = searchFilter[splitKey[0]].filter(
          (rm) => rm.key !== splitKey[1]
        );
      }
      // console.log(searchFilter);
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
      // console.log(searchFilter, selectedNodeKeys, "selected node");
    }
    //console.log(this.state.selectedNodeKeys,"selectedNodeKeys",key);
    // if(selectedNodeKeys.hasOwnProperty("saved_search")){
    //     this.setState({selectedNodeKeys:null,searchFilter: {"saved_search":[],"name_id":[],"campaign_m":[],"keyword_m":[],"ad_group_m":[],"fsn_m":[],"creative_m":[],"placement_m":[]},},()=>{
    //         console.log(this.state.selectedNodeKeys,"selectedNodeKeys",key);
    //     });
    // }
  };
  onPopUpClose = (key) => {
    this.onNodeRemoved(key);
  };

  clearFilters = () => {
    this.setState({
      searchFilter: {
        saved_search: [],
        name_id: [],
        campaign_m: [],
        portfolio_m: [],
        keyword_m: [],
        ad_group_m: [],
        fsn_m: [],
        creative_m: [],
        placement_m: [],
      },
      selectedNodeKeys: null,
    });
    this.props.applySearchFilter(
      {
        searchFilter: {
          saved_search: [],
          name_id: [],
          campaign_m: [],
          portfolio_m: [],
          keyword_m: [],
          ad_group_m: [],
          fsn_m: [],
          creative_m: [],
          placement_m: [],
        },
      },
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
      if (Object.prototype.hasOwnProperty.call(this.state.searchFilter, obj[0].pkey)) {
        let filters = this.state.searchFilter;
        filters[obj[0].pkey].push(obj[0]);
        filters[obj[0].pkey].push(obj[1]);

        this.setState({ searchFilter: filters }, () => {
          this.props.applySearchFilter(
            filters,
            obj[0].pkey === "name_id" ? obj[0].key : obj[0].pkey
          );
        });
      }
    } else {
      if (Object.prototype.hasOwnProperty.call(this.state.searchFilter, obj.pkey)) {
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
  };

  removeItemUsingClick = (e, key) => {
    e = e.filter((val) => val.key !== key);
    this.onNodeRemoved(key);
    //this.searchLabel(this.state.selectedNodeKeys.hasOwnProperty("saved_search") ? []:e);
    this.searchLabel(e);
  };

  searchLabel = (e) => {
    // console.log(e, "selectedObj");
    return e.map((val) => {
      {
        if (!val.children) {
          // console.log("label::::::::::::::", val);
          var label = val?.data;
          let keys = val?.key.split("-");
          if (keys[0] === "saved_search") {
            label = "Saved Search " + val?.label;
          }
        }
      }
      return (
        <>
          {" "}
          {label !== undefined && (
            <div
              className="treeselect-input__tags-element"
              onClick={() => {
                this.removeItemUsingClick(e, val.key);
              }}
            >
              <span className="treeselect-input__tags-name">{label}</span>
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
            </div>
          )}
        </>
      );
    });
  };
  render() {
    let {
      selectedNodeKeys,
      showPopUp,
      popUpData,
      displaySearch
    } = this.state;
    return (
      <>
        <div
          className="card flex justify-content-center"
          style={{ width: "90%" }}
        >
          <TreeSelect
            value={selectedNodeKeys}
            onNodeUnselect={(e) => {
              this.onNodeRemoved(e.node.key);
            }}
            onChange={(e) => {
              this.setState({ selectedNodeKeys: e.value });
            }}
            options={this.getSearchOptions()}
            metaKeySelection={false}
            className="md:w-20rem w-full"
            selectionMode="checkbox"
            placeholder="Search"
            display="chip"
            onNodeSelect={(e) => {
              this.onNodeSelected(e);
            }}
            panelStyle={
              displaySearch ? { display: "flow" } : { display: "none" }
            }
            valueTemplate={(e) => {
              return this.searchLabel(e);
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
          />
        ) : (
          ""
        )}
      </>
    );
  }
}

export default MultiSearchAms;
