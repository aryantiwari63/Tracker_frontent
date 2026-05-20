export const ORTabList = ["Category", "Keyword", "Platform", "Brand","Location"];
export const ORBreakdownCustomFilters = { keyword: "keyword", SOS: 100,OR:100 };
export const ORBreakdownFilters = {
  saved_search: [], custom: [], platform: [], brand: [], category: [], location: []
};

export const ORColumnTitle ="OR";
export const ORTabColumnList = {};


// export const ORPerformance =   (JSON.parse(localStorage.getItem("active_client_project")??{})?.client_project_id)==4?{
//   TableTitle:"Ranking",
//   GraphOutputKey:"or",
//   ColumnList:[
//     {
//       persentageValue: false,
//       title: "Ranking",
//       type: "parameters",
//       value: "or",
//     }
//   ]   
// }:{
//   TableTitle:"OR",
//   GraphOutputKey:"or",
//   ColumnList:[
//     {
//       persentageValue: false,
//       title: "OR",
//       type: "parameters",
//       value: "or",
//     }
//   ]  
// };

export const ORPerformance =  {
  TableTitle:"Ranking",
  GraphOutputKey:"or",
  ColumnList:[
    {
      persentageValue: false,
      title: "Ranking",
      type: "parameters",
      value: "or",
    }
  ]   
};