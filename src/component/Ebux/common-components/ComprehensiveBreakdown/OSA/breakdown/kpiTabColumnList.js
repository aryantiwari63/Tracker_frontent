export const OSATabList=((JSON.parse(localStorage.getItem("active_client_project")??{})?.dark_store)?["Category", "SKU", "Location", "Platform", "Brand","Dark Store ID"]:["Category", "SKU", "Location", "Platform", "Brand"]);
export const OSABreakdownCustomFilters={ SKU: "SKU", OSA: 100 };
export const OSABreakdownFilters={
    saved_search: [], custom: [], platform: [], brand: [], category: [], location: []
};
export const OSATabColumnList={
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
      "title": "OSA",
      "type": "parameters",
      "value": "osa",
      "kpi": [
        "OSA"
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
      "title": "Previous Day's OSA",
      "type": "parameters",
      "value": "previous_osa",
      "kpi": [
        "OSA"
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

export const OSAColumnTitle ="OSA";
export const OSAPerformance = {
  TableTitle:"OSA",
  GraphOutputKey:"osa",
  ColumnList:[
    {
      persentageValue: true,
      title: "OSA",
      type: "parameters",
      value: "osa",
    }
  ]  
};