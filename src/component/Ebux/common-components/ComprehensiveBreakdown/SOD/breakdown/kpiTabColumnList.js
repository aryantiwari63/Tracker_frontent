export const SODTabList = ["Platform", "Brand", "Category", "Banner"];
export const SODBreakdownCustomFilters = { SOD: 100 };
export const SODBreakdownFilters = {
  saved_search: [], custom: [], platform: [], brand: [], category: [], location: []
};
export const SODTabColumnList = {
  "Brand": [
    {
      "persentageValue": false,
      "title": "Brands",
      "type": "breakdown",
      "value": "brand",
      "breakdown": "Brand",
      "allowKPI": [
        "OSA",
        "CS",
        "PRO",
        "RR",
        "SOS",
        "OR",
        "SOD"
      ],
      "notAllowWithIsValueIn": [],
      "remove": false,
      "drag": false
    },
    {
      "persentageValue": false,
      "title": "Number Of Banners",
      "type": "parameters",
      "value": "number_of_banners",
      "kpi": [],
      "allowKPI": [
        "SOD"
      ],
      "notAllowWithIsValueIn": []
    },
    {
      "persentageValue": true,
      "title": "SOD",
      "type": "parameters",
      "value": "sod",
      "kpi": [
        "SOD"
      ],
      "allowKPI": [
        "SOD"
      ]
    },
    {
      "persentageValue": false,
      "title": "Ad Rank",
      "type": "parameters",
      "value": "ad_rank",
      "kpi": [],
      "allowKPI": [
        "SOD"
      ]
    }
  ],
  "Category": [
    {
      "persentageValue": false,
      "title": "Category",
      "type": "breakdown",
      "value": "category",
      "breakdown": "Category",
      "allowKPI": [
        "OSA",
        "CS",
        "PRO",
        "RR",
        "SOS",
        "OR",
        "SOD"
      ],
      "notAllowWithIsValueIn": [],
      "remove": false,
      "drag": false
    },
    {
      "persentageValue": false,
      "title": "Number Of Banners",
      "type": "parameters",
      "value": "number_of_banners",
      "kpi": [],
      "allowKPI": [
        "SOD"
      ],
      "notAllowWithIsValueIn": []
    },
    {
      "persentageValue": true,
      "title": "SOD",
      "type": "parameters",
      "value": "sod",
      "kpi": [
        "SOD"
      ],
      "allowKPI": [
        "SOD"
      ]
    },
    {
      "persentageValue": false,
      "title": "Ad Rank",
      "type": "parameters",
      "value": "ad_rank",
      "kpi": [],
      "allowKPI": [
        "SOD"
      ]
    }
  ],
  "Platform": [
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
      "remove": false,
      "drag": false
    },
    {
      "persentageValue": false,
      "title": "Number Of Banners",
      "type": "parameters",
      "value": "number_of_banners",
      "kpi": [],
      "allowKPI": [
        "SOD"
      ],
      "notAllowWithIsValueIn": []
    },
    {
      "persentageValue": true,
      "title": "SOD",
      "type": "parameters",
      "value": "sod",
      "kpi": [
        "SOD"
      ],
      "allowKPI": [
        "SOD"
      ]
    },
    {
      "persentageValue": false,
      "title": "Ad Rank",
      "type": "parameters",
      "value": "ad_rank",
      "kpi": [],
      "allowKPI": [
        "SOD"
      ]
    }
  ],
  "Banner": [
    {
      "persentageValue": false,
      "title": "Banner",
      "type": "breakdown",
      "value": "banner",
      "breakdown": "Banner",
      "allowKPI": [
        "SOD"
      ],
      "remove": false,
      "drag": false
    },
    {
      "persentageValue": false,
      "title": "Date of Capture",
      "type": "breakdown",
      "value": "date_of_capture",
      "breakdown": "",
      "allowKPI": [
        "SOD"
      ]
    },
    {
      "persentageValue": false,
      "title": "Appearance Page",
      "type": "breakdown",
      "value": "appearance_page",
      "breakdown": "",
      "allowKPI": [
        "SOD"
      ]
    },
    {
      "persentageValue": false,
      "title": "Placement",
      "type": "breakdown",
      "value": "placement",
      "breakdown": "",
      "allowKPI": [
        "SOD"
      ]
    },
    {
      "persentageValue": false,
      "title": "Number Of Banners",
      "type": "parameters",
      "value": "number_of_banners",
      "kpi": [],
      "allowKPI": [
        "SOD"
      ],
      "notAllowWithIsValueIn": []
    },
    {
      "persentageValue": true,
      "title": "SOD",
      "type": "parameters",
      "value": "sod",
      "kpi": [
        "SOD"
      ],
      "allowKPI": [
        "SOD"
      ]
    },
    {
      "persentageValue": false,
      "title": "Ad Rank",
      "type": "parameters",
      "value": "ad_rank",
      "kpi": [],
      "allowKPI": [
        "SOD"
      ]
    }
  ]
};

export const SODColumnTitle = "SOD";
export const SODPerformance = {
  TableTitle: "SOD",
  GraphOutputKey: "sod",
  ColumnList: [
    {
      "persentageValue": false,
      "title": "Number Of Banners",
      "type": "parameters",
      "value": "number_of_banners",
      "kpi": [],
      "allowKPI": [
        "SOD"
      ],
      "notAllowWithIsValueIn": []
    },
    {
      "persentageValue": true,
      "title": "SOD",
      "type": "parameters",
      "value": "sod",
      "kpi": [
        "SOD"
      ],
      "allowKPI": [
        "SOD"
      ]
    },
    {
      "persentageValue": false,
      "title": "Ad Rank",
      "type": "parameters",
      "value": "ad_rank",
      "kpi": [],
      "allowKPI": [
        "SOD"
      ]
    }
  ]
};