export const PROTabList = ((JSON.parse(localStorage.getItem("active_client_project")??{})?.dark_store)?["Category", "SKU", "Location", "Platform", "Brand","Dark Store ID"]:["Category", "SKU", "Location", "Platform", "Brand"]);
export const PROBreakdownCustomFilters = { SKU: "SKU", Promotions: 100, MRP: 100, SP: 100 };
export const PROBreakdownFilters = {
  saved_search: [], custom: [], platform: [], brand: [], category: [], location: []
};

export const PROColumnTitle ="Promotions";
export const PROTabColumnList = {
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
      "title": "Promotions",
      "type": "parameters",
      "value": "price_variation",
      "kpi": [
        "PRO"
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
      "icon": "rupee",
      "title": "MRP",
      "type": "parameters",
      "value": "price_rp",
      "kpi": [
        "PRO"
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
      "icon": "rupee",
      "title": "SP",
      "type": "parameters",
      "value": "price_sp",
      "kpi": [
        "PRO"
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
export const PROPerformance = {
  TableTitle:"Promotions",
  GraphOutputKey:"price_variation",
  ColumnList:[
    {
      persentageValue: true,
      title: "Promotions",
      type: "parameters",
      value: "price_variation",
    },
    {
      persentageValue: false,
      icon: "rupee",
      title: "MRP",
      type: "parameters",
      value: "price_rp",
    },
    {
      persentageValue: false,
      icon: "rupee",
      title: "Selling Price",
      type: "parameters",
      value: "price_sp",
    }
  ]  
};