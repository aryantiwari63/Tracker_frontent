export const SOMTabList = ["Category", "Category Node", "Platform", "Brand"];
export const SOMBreakdownCustomFilters = {};
export const SOMBreakdownFilters = {
  platform: [], brand: [], category: [],categorynode:[]
};

export const SOMColumnTitle ="SOM";
export const SOMTabColumnList = {};

export const SOMPerformance =  (JSON.parse(localStorage.getItem("active_client_project")??{})?.client_project_id)==4?{
  TableTitle:"SOM",
  // GraphOutputKey:"actual_sos",
  GraphOutputKey:"blended_som",
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
      title: "SOM",
      type: "parameters",
      value: "blended_som",
    }
  ]  
}:{
  TableTitle:"SOM",
  GraphOutputKey:"som",
  ColumnList:[
    {
      persentageValue: true,
      title: "SOM",
      type: "parameters",
      value: "som",
    }
  ]  
};