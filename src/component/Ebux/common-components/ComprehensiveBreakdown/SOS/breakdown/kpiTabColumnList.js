export const SOSTabList = ["Category", "Keyword", "Platform", "Brand","Location"];
export const SOSBreakdownCustomFilters = { keyword: "keyword",  SOS: 100,OR:100 };
export const SOSBreakdownFilters = {
  saved_search: [], custom: [], platform: [], brand: [], category: [], location: []
};

export const SOSColumnTitle ="SOS";
export const SOSTabColumnList = {};

export const SOSPerformance =  (JSON.parse(localStorage.getItem("active_client_project")??{})?.client_project_id)==4?{
  TableTitle:"SOS",
  // GraphOutputKey:"actual_sos",
  GraphOutputKey:"blended_sos",
  // GraphOutputKeyOptionList:[
  //   {
  //     title: "Actual",
  //     value: "actual_sos",
  //   },
  //   {
  //     title: "Blended",
  //     value: "blended_sos",
  //   }
  // ],
  ColumnList:[
    // {
    //   persentageValue: true,
    //   title: "Actual SOS",
    //   type: "parameters",
    //   value: "actual_sos",
    // },
    {
      persentageValue: true,
      // title: "Blended SOS",
      title: "SOS",
      type: "parameters",
      value: "blended_sos",
    }
  ]  
}:{
  TableTitle:"SOS",
  GraphOutputKey:"sos",
  ColumnList:[
    {
      persentageValue: true,
      title: "SOS",
      type: "parameters",
      value: "sos",
    }
  ]  
};