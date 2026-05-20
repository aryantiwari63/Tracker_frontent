export const CSTabList = ((JSON.parse(localStorage.getItem("active_client_project")??{})?.dark_store)?["Category", "SKU", "Location", "Platform", "Brand","Dark Store ID"]:["Category", "SKU", "Location", "Platform", "Brand"]);
export const CSBreakdownCustomFilters = { SKU: "SKU",
  "Total Score":100,
          "Title Score":100,
          "Desc Score": 100,
          "Bulletin Score":100,
          "Image Score":100,
          "A+ Score":100};
export const CSBreakdownFilters = {
  saved_search: [], custom: [], platform: [], brand: [], category: [], location: []
};
export const CSColumnTitle ="CS";
export const CSTabColumnList = {
  "Dark Store ID":[
    {
      "persentageValue": false,
      "title": "Dark Store ID",
      "type": "breakdown",
      "value": "darkstore",
      "breakdown": "Dark Store ID",
      "allowKPI": [
        "OSA",
        "CS",
        "PRO",
        "RR"
      ],
      "notAllowWithIsValueIn": [],
      "isDisabled": false,
      "remove": false,
      "drag": false
    },
    {
      "persentageValue": true,
      "title": "Total Score",
      "type": "parameters",
      "value": "total_score",
      "kpi": [
        "CS"
      ],
      "allowKPI": [
        "OSA",
        "CS",
        "PRO",
        "RR"
      ],
      "notAllowWithIsValueIn": [],
      "isDisabled": false
    },
    {
      "persentageValue": true,
      "title": "Title Score",
      "type": "parameters",
      "value": "title_score",
      "kpi": [
        "CS"
      ],
      "allowKPI": [
        "OSA",
        "CS",
        "PRO",
        "RR"
      ],
      "notAllowWithIsValueIn": [],
      "isDisabled": false
    },
    {
      "persentageValue": true,
      "title": "Description Score",
      "type": "parameters",
      "value": "desc_score",
      "kpi": [
        "CS"
      ],
      "allowKPI": [
        "OSA",
        "CS",
        "PRO",
        "RR"
      ],
      "notAllowWithIsValueIn": [],
      "isDisabled": false
    },
    {
      "persentageValue": true,
      "title": "Bullet Score",
      "type": "parameters",
      "value": "bulletin_score",
      "kpi": [
        "CS"
      ],
      "allowKPI": [
        "OSA",
        "CS",
        "PRO",
        "RR"
      ],
      "notAllowWithIsValueIn": [],
      "isDisabled": false
    },
    {
      "persentageValue": true,
      "title": "Image Score",
      "type": "parameters",
      "value": "image_score",
      "kpi": [
        "CS"
      ],
      "allowKPI": [
        "OSA",
        "CS",
        "PRO",
        "RR"
      ],
      "notAllowWithIsValueIn": [],
      "isDisabled": false
    },
    {
      "persentageValue": true,
      "title": "A+ Score",
      "type": "parameters",
      "value": "a_plus_score",
      "kpi": [
        "CS"
      ],
      "allowKPI": [
        "OSA",
        "CS",
        "PRO",
        "RR"
      ],
      "notAllowWithIsValueIn": [],
      "isDisabled": false
    },
    {
      "persentageValue": false,
      "title": "Platform",
      "type": "breakdown",
      "value": "platform",
      "breakdown": "Platform",
      "allowKPI": [
        "OSA",
        "CS",
        "PRO",
        "RR",
        "SOS",
        "OR",
        "SOD"
      ],
      "isDisabled": false
    }
  ]
};
export const CSPerformance = (JSON.parse(localStorage.getItem("active_client_project")??{})?.client_project_id)==4?{
  TableTitle:"CS",
  GraphOutputKey:"total_score",
  ColumnList:[
    {
      persentageValue: true,
      title: "Total Score",
      type: "parameters",
      value: "total_score",
    },
    {
      persentageValue: true,
      title: "Title Score",
      type: "parameters",
      value: "title_score",
    },    
    {
      persentageValue: true,
      title: "Desc Score",
      type: "parameters",
      value: "desc_score",
    },
    {
      persentageValue: true,
      title: "Bulletin Score",
      type: "parameters",
      value: "bulletin_score",
    },
    {
      persentageValue: true,
      title: "Image Score",
      type: "parameters",
      value: "image_score",
    }
    // ,
    // {
    //   persentageValue: true,
    //   title: "A+ Score",
    //   type: "parameters",
    //   value: "a_plus_score",
    // }
  ] 
}:{
  TableTitle:"CS",
  GraphOutputKey:"total_score",
  ColumnList:[
    {
      persentageValue: true,
      title: "Total Score",
      type: "parameters",
      value: "total_score",
    },
    {
      persentageValue: true,
      title: "Title Score",
      type: "parameters",
      value: "title_score",
    },    
    {
      persentageValue: true,
      title: "Desc Score",
      type: "parameters",
      value: "desc_score",
    },
    {
      persentageValue: true,
      title: "Bulletin Score",
      type: "parameters",
      value: "bulletin_score",
    },
    {
      persentageValue: true,
      title: "Image Score",
      type: "parameters",
      value: "image_score",
    },
    {
      persentageValue: true,
      title: "A+ Score",
      type: "parameters",
      value: "a_plus_score",
    }
  ]  
};