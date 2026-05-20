// let isClientColpal=(JSON.parse(localStorage.getItem("active_client_project")??{}))?.
//  client_project_name==="ColPal"

// export const RRTabList = ((JSON.parse(localStorage.getItem("active_client_project")??{})?.dark_store)?["Category", "SKU", "Location", "Platform", "Brand","Dark Store ID"]:["Category", "SKU", "Location", "Platform", "Brand","Reviews"]);
export const RRTabList = ((JSON.parse(localStorage.getItem("active_client_project")??{})?.dark_store)?["Category", "SKU",  "Platform", "Brand"]:["Category", "SKU",  "Platform", "Brand",...(([2,101,103,102].indexOf(JSON.parse(localStorage.getItem("active_client_project")??{})?.client_project_id)>-1||JSON.parse(localStorage.getItem("active_client_project")??{})?.useNewRRView)?["Reviews","Competition Reviews"]:[])]);


 
export const RRBreakdownCustomFilters = {
  SKU: "SKU", OSA: 100,
  Rating: 100,
  Reviews: 100
};
export const RRBreakdownFilters = {
  saved_search: [], custom: [], platform: [], brand: [], category: [], location: [],
};

export const RRColumnTitle ="Rating & Review";
export const RRTabColumnList = {};
export const RRPerformance = {
  TableTitle:"Rating & Review",
  GraphOutputKey:"rating_value",
  ColumnList:[
    {
      persentageValue: false,
      subValue:" / 5",
      title: "Ratings",
      type: "parameters",
      value: "rating_value",
    },
    {
      persentageValue: false,
      title: "Reviews",
      type: "parameters",
      value: "review_count",
    }
  ]  
};