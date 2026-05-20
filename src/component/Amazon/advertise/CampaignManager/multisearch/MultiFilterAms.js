import React from "react";
import {TreeSelect} from "primereact/treeselect";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

import SearchPopUp from "../../../../common-components/MultiSearch/searchPopUp";
import treeOptions from "../../../../../data/Amazon/campaignManager/tabFilterData";

class MultiFilterAms extends React.Component {
    constructor(props) {
        super(props); 
        this.state = {
            nodes: this.getSearchOptions(),
            selectedNodeKeys: null,
            showPopUp: false,
            popUpData: {heading: "", key: "", value: ""},
            searchFilter: {"saved_search":[],"name_id":[],"campaign_m":[],"keyword_m":[],"ad_group_m":[],"fsn_m":[],"creative_m":[],"placement_m":[]},
            displaySearch:true,
            searchType:"search",
            defaultLabels:[]
        }
        this.onNodeSelected = this.onNodeSelected.bind(this);
        this.setSearchFilter = this.setSearchFilter.bind(this);
        this.onPopUpClose = this.onPopUpClose.bind(this);
        this.clearFilters = this.clearFilters.bind(this);
    }

    componentDidUpdate(prevProps) {
        if(prevProps.clearSearch !== this.props.clearSearch){
            this.clearFilters();
            this.props.setClearSearch();
        }
    }

    getSearchOptions() {
        let metrics = {
            campaign_m: {label: "Campaign Metric", key: "campaign_m", selectable: false},
            ad_group_m: {label: "Ad Group Metric", key: "ad_group_m", selectable: false},
            keyword_m: {label: "Keyword Metric", key: "keyword_m", selectable: false},
            fsn_m: {label: "FSN Metric", key: "fsn_m", selectable: false},
            creative_m: {label: "Creative Metric", key: "creative_m", selectable: false},
            placement_m: {label: "Placement Metric", key: "placement_m", selectable: false}
        };

        let metricsOptions = {
            spends: {label: "Spends", key: "spends"},
            views: {label: "Views", key: "views"},
            clicks: {label: "Click", key: "clicks"},
            ctr: {label: "CTR", key: "ctr"},
            cpc: {label: "CPC", key: "cpc"},
            units_sold: {label: "Units Sold", key: "units_sold"},
            revenue: {label: "Revenue", key: "revenue"},
            cvr: {label: "CVR", key: "cvr"},
            roi: {label: "ROI", key: "roi"},
            aov: {label: "AOV", key: "aov"}
        };
        let treeOption = [];

        Object.keys(metrics).map((key) => {
            let row = {...metrics[key]};
            let childern = [];
            Object.keys(metricsOptions).map((val) => {
                let set = {
                    label: metricsOptions[val].label,
                    key: metrics[key].key + "-" + metricsOptions[val].key,
                    data: `${row.label} - ${metricsOptions[val].label}`
                };
                childern.push(set);
            });
            row.children = childern;
            treeOption.push(row);
        });

        return [
            // this.props.saveSearch,
            ...treeOptions
            // {
            //     key: 'name_id',
            //     label: 'Name/ID',
            //     selectable: false,
            //     children: [
            //         {
            //             key: 'name_id-campaign_name',
            //             label: 'Campaign Name',
            //             data: 'Name/ID - Campaign Name',
            //         },
            //         {
            //             key: 'name_id-ad_group_name',
            //             label: 'Ad Group Name',
            //             data: 'Name/ID - Ad Group Name',
            //         },
            //         {
            //             key: 'name_id-fsn_name',
            //             label: 'FSN Name',
            //             data: 'Name/ID - FSN Name',
            //         },
            //         {
            //             key: 'name_id-keyword',
            //             label: 'Keyword',
            //             data: 'Name/ID - Keyword',
            //         },
            //         {
            //             key: 'name_id-campaign_id',
            //             label: 'Campaign ID',
            //             data: 'Name/ID - Campaign ID',
            //         },
            //         {
            //             key: 'name_id-ad_group_id',
            //             label: 'Ad Group ID',
            //             data: 'Name/ID - Ad Group ID',
            //         },
            //         {
            //             key: 'name_id-fsn_id',
            //             label: 'FSN ID',
            //             data: 'Name/ID - FSN ID',
            //         }
            //     ]
            // }
            // ...treeOption
        ];
    }

    onNodeSelected = (e) => {
        let searchType = "search";
        let splitKey = e.node.key.split('-');
        if(Object.prototype.hasOwnProperty.call(this.state.searchFilter, splitKey[0]) === true && splitKey[0] !== 'name_id'){
            searchType = "metric";
        }
        if(splitKey[0] !== "saved_search") {
            this.setState({
                searchType: searchType,
                showPopUp: true,
                popUpData: e.node,
                displaySearch: !this.state.displaySearch
            });
        }else
        {
                if(splitKey[0] === "saved_search"){
                 //   let savedSearch={pkey:splitKey[0],key:e.node.key,value:e.node.data,condition:""};
                    try {
                        let search = JSON.parse(e.node.data);
                         Object.keys(search).map((key)=>{
                             let item = search[key];
                                 Object.keys(item).map((name)=>{
                                     let row = item[name];
                                     this.setSearchFilter(row);
                                 })
                         }) ;

                    }catch (e) {
                console.error(e)
                    }
                   // console.log(savedSearch,"savedSearch")
                   // this.setSearchFilter(savedSearch);
                }
        }
    }
    onNodeRemoved = (key) => {
        let selectedNodeKeys = this.state.selectedNodeKeys;
        let splitKey = key.split('-');
        let searchFilter = this.state.searchFilter;
        if(Object.prototype.hasOwnProperty.call(selectedNodeKeys, key)){
            if(Object.prototype.hasOwnProperty.call(searchFilter, splitKey[0])){
                searchFilter[splitKey[0]] = searchFilter[splitKey[0]].filter((rm) => rm.key !== splitKey[1]);
            }
            delete selectedNodeKeys[key];
            this.setState({selectedNodeKeys,searchFilter},()=>{
                this.props.applySearchFilter(searchFilter,splitKey[0] === 'name_id'?splitKey[1]:splitKey[0]);
            });
        }
        //console.log(this.state.selectedNodeKeys,"selectedNodeKeys",key);
        // if(selectedNodeKeys.hasOwnProperty("saved_search")){
        //     this.setState({selectedNodeKeys:null,searchFilter: {"saved_search":[],"name_id":[],"campaign_m":[],"keyword_m":[],"ad_group_m":[],"fsn_m":[],"creative_m":[],"placement_m":[]},},()=>{
        //     });
        // }

    }
    onPopUpClose = (key) => {
        this.onNodeRemoved(key);
    }

    clearFilters = () => {
        this.setState({searchFilter:{"saved_search":[],"name_id":[],"campaign_m":[],"keyword_m":[],"ad_group_m":[],"fsn_m":[],"creative_m":[],"placement_m":[]},selectedNodeKeys:null});
        this.props.applySearchFilter({searchFilter:{"saved_search":[],"name_id":[],"campaign_m":[],"keyword_m":[],"ad_group_m":[],"fsn_m":[],"creative_m":[],"placement_m":[]}},"clear");
    }

    setShowPopUp = () =>{
        this.setState({showPopUp:!this.state.showPopUp,displaySearch:!this.state.displaySearch})
    }
    setSearchFilter = (obj) =>{
        if(Object.prototype.hasOwnProperty.call(this.state.searchFilter, obj.pkey)){
            let filters = this.state.searchFilter;
            filters[obj.pkey].push(obj);
           // filters[obj.pkey].push(obj);
            this.setState({searchFilter:filters},()=>{
                this.props.applySearchFilter(filters,obj.pkey === 'name_id'?obj.key:obj.pkey);
            });
        }
    }

    removeItemUsingClick = (e,key)=>{
        e = e.filter(val=> val.key !== key);
        this.onNodeRemoved(key);
        //this.searchLabel(this.state.selectedNodeKeys.hasOwnProperty("saved_search") ? []:e);
        this.searchLabel(e);
    }

    searchLabel = (e) =>{
        return (
            e.map((val, i)=>{
                {   var label = val.data;
                    let keys = val.key.split("-");
                    if(keys[0] === "saved_search"){
                        label = "Saved Search "+val.label;
                    }
                }
                return(
                    <div key={i} className="treeselect-input__tags-element" onClick={()=>{this.removeItemUsingClick(e,val.key)}}>
                        <span className="treeselect-input__tags-name">{label}</span>
                        <span className="treeselect-input__tags-cross">
                            <svg xmlns="http://www.w3.org/2000/svg"  width="15" height="15" viewBox="0 0 25 25"  fill="none" stroke="#000000"   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6"  x2="6" y2="18"></line>
                                <line  x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </span>
                    </div>
                )
            })

        )
    }

    render() {
        let {selectedNodeKeys,showPopUp,popUpData,displaySearch} = this.state;
        return (
            <>
                <div className="card flex justify-content-center" style={{width: "90%"}}>
                    <TreeSelect
                        value={selectedNodeKeys}
                        onNodeUnselect={(e) => {
                           this.onNodeRemoved(e.node.key)
                        }}
                        onChange={(e) => {this.setState({selectedNodeKeys:e.value})}}
                        options={this.getSearchOptions()}
                        metaKeySelection={false}
                        className="md:w-20rem w-full"
                        selectionMode="checkbox"
                        placeholder="Search"
                        display="chip"
                        onNodeSelect={(e) => this.onNodeSelected(e)}
                        panelStyle={displaySearch ? {display:"flow"} : {display:"none"}}
                        valueTemplate={(e)=>{
                           return this.searchLabel(e);
                            }}
                        tabIndex={-1}
                    />
                </div>
                {showPopUp ?
                    <SearchPopUp
                        popUpData={popUpData}
                        showPopUp={true}
                        setShowPopUp={this.setShowPopUp}
                        setSearchFilter={this.setSearchFilter}
                        searchType={this.state.searchType}
                        onPopUpClose={this.onPopUpClose}
                    />
                    : ""}
            </>
        );
    }
}

export default MultiFilterAms;