import { APPLICATION_ROUTES } from "../../utils/constants";

export function convertDate(originalDateStr) {
  const originalDate = new Date(originalDateStr);

  // Get month, day, and year from the parsed date
  const month = String(originalDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(originalDate.getDate()).padStart(2, "0");
  const year = originalDate.getFullYear();

  // Format the date as "mm-dd-yyyy"
  const formattedDate = `${month}-${day}-${year}`;
  return formattedDate;
}

export const stateSetter = (state, action) => {
  const { value, type } = action;
  switch (type) {
    case "CATEGORY":
      return (state = { ...state, category: value });
    case "QUICK_FILTERS": {
      const newState = { ...state };
      const filterState = newState["quickFilters"][value?.parentKey];
      // console.log("filterState>>>>", filterState);
      // if(filterState)
      if (value?.parentKey === "created_by") {
        const index = filterState.findIndex((val) => val.id === value.id);

        if (index !== -1) {
          newState["quickFilters"][value?.parentKey].splice(index, 1);
        } else {
          newState["quickFilters"][value?.parentKey].push(value);
        }
      } else if (
        filterState &&
        filterState.length > 0 &&
        value.parentKey !== "created_by"
      ) {
        const index = filterState.findIndex((val) => val.id === value.id);
        if (value.value === "custom_date_range") {
          newState["calendar"] = {
            showCalendar: index > -1 ? false : true,
            from: index > -1 ? undefined : value,
          };
        }
        if (index === -1) {
          // data exist but not a selected data
          newState["quickFilters"][value?.parentKey] = [];
          newState["quickFilters"][value?.parentKey].push(value);

          // console.log("newState>>>>>>>>>>>>>", newState);
        } else {
          //if data exist for selected data
          newState["quickFilters"][value?.parentKey] = [];
        }
      } else {
        if (value.value === "custom_date_range") {
          newState["calendar"] = { showCalendar: true, from: value };
        }
        newState["quickFilters"][value?.parentKey].push(value);
      }
      return (state = newState);
    }
    case "SEARCH": {
      return (state = { ...state, search: value });
    }
    // case "QUICK_FILTER_CREATED_BY": {
    //   console.log("value>>>>>>>", value);
    //   // return (state = { ...state, search: value });
    //   return;
    // }
    case "QUICK_FILTERS_DATE": {
      const newState = { ...state };
      const filterState = newState["quickFilters"][value?.parentKey];
      const index = filterState.findIndex((val) => val.id === value.id);
      filterState[index] = value;
      newState["quickFilters"][value?.parentKey] = filterState;
      newState["calendar"] = {
        showCalendar: index > -1 ? false : true,
        from: index > -1 ? undefined : value,
      };
      return (state = newState);
    }
    default:
      return state;
  }
};

export const reportState = {
  "/amazon": {
    category: "all",
    search: "",
    quickFilters: {
      created_on: [],
      last_edit: [],
      created_by: [],
      scheduled_at: [],
    },
    color: "#EF880F",
    calendar: { showCalendar: false, from: undefined },
  },
  "/blinkit": {
    category: "all",
    search: "",
    quickFilters: {
      created_on: [],
      last_edit: [],
      created_by: [],
      scheduled_at: [],
    },
    color: "#11B07A",
    calendar: { showCalendar: false, from: undefined },
  },
  "/instamart": {
    category: "all",
    search: "",
    quickFilters: {
      created_on: [],
      last_edit: [],
      created_by: [],
      scheduled_at: [],
    },
    color: "#851853",
    calendar: { showCalendar: false, from: undefined },
  },
  "/zepto": {
    category: "all",
    search: "",
    quickFilters: {
      created_on: [],
      last_edit: [],
      created_by: [],
      scheduled_at: [],
    },
    color: "#3C006B",
    calendar: { showCalendar: false, from: undefined },
  },
  "/flipkart": {
    category: "all",
    search: "",
    quickFilters: {
      created_on: [],
      last_edit: [],
      created_by: [],
      scheduled_at: [],
    },
    color: "#0081F7",
    calendar: { showCalendar: false, from: undefined },
  },
};

export const platformWise = {
  "/amazon": {
    reportIcon: "/assets/images/customcategoryreport.svg",
    addIcon: "/assets/images/addCustom.svg",
    path: APPLICATION_ROUTES.AMAZONCUSTOMREPORTBLANK,
    edit_path: APPLICATION_ROUTES.AMAZONCUSTOMREPORTBLANK,
    filters: {
      portfolio: [],
      campaign: [],
      adgroup: [],
      asin: [],
      keyword: [],
      creative: [],
      placement: [],
      searchterm: [],
      amazon_campaign_type: undefined,
    },
  },
  "/blinkit": {
    reportIcon: "/assets/images/blinkitreporticon.svg",
    addIcon: "/assets/images/blinkitaddmetric.svg",
    path: APPLICATION_ROUTES.BLINKITCUSTOMREPORTBLANK,
    edit_path: APPLICATION_ROUTES.BLINKITEDITREPORT,
    filters: {
      category: [],
      campaign: [],
      keyword: [],
      blinkit_campaign_type: undefined,
      tag_name: [],
    },
  },
  "/instamart": {
    reportIcon: "/assets/images/instamartreporticon.svg",
    addIcon: "/assets/images/blinkitaddmetric.svg",
    path: APPLICATION_ROUTES.INSTAMARTCUSTOMREPORTBLANK,
    edit_path: APPLICATION_ROUTES.INSTAMARTEDITREPORT,
    filters: {
      keyword: [],
      campaign: [],
      product: [],
      instamart_campaign_type: undefined,
    },
  },
  "/zepto": {
    reportIcon: "/assets/images/instamartreporticon.svg",
    addIcon: "/assets/images/blinkitaddmetric.svg",
    path: APPLICATION_ROUTES.ZEPTOCUSTOMREPORTBLANK,
    edit_path: APPLICATION_ROUTES.ZEPTOEDITREPORT,
    filters: {
      campaign: [],
      keyword: [],
      category: [],
      product: [],
      tag_name: [],
      zepto_campaign_type: undefined,
    },
  },
  "/flipkart": {
    reportIcon: "/assets/images/flipkartreporticon.svg",
    addIcon: "/assets/images/flipkartaddmetric.svg",
    path: APPLICATION_ROUTES.FLIPKARTCUSTOMREPORTBLANK,
    edit_path: APPLICATION_ROUTES.FLIPKARTEDITREPORT,
    filters: {
      campaign: [],
      adgroup: [],
      product: [],
      placement: [],
      keyword: [],
      creative: [],
      tag_name: [],
      flipkart_campaign_type: undefined,
      flipkart_platform: undefined,
      campaign_status: undefined,
      campaign_budget_type: undefined,
    },
  },
};

export const providedFilters = [
  {
    id: 1,
    name: "Created on",
    value: "created_on",
    includedFilter: [
      {
        id: 1,
        parentTitle: "Created on",
        parentKey: "created_on",
        title: "Today",
        value: "today",
      },
      {
        id: 2,
        parentTitle: "Created on",
        parentKey: "created_on",
        title: "Last Week",
        value: "last_week",
      },
      {
        id: 3,
        parentTitle: "Created on",
        parentKey: "created_on",
        title: "Last Month",
        value: "last_month",
      },
      {
        id: 4,
        parentTitle: "Created on",
        parentKey: "created_on",
        title: "Last Quarter",
        value: "last_quarter",
      },
      {
        id: 5,
        parentTitle: "Created on",
        parentKey: "created_on",
        title: "Custom Date Range",
        value: "custom_date_range",
        image: "/assets/images/custom_calendar.svg",
        onClick: true,
      },
    ],
  },
  {
    id: 2,
    name: "Last edit",
    value: "last_edit",
    includedFilter: [
      {
        id: 1,
        parentTitle: "Last edit",
        parentKey: "last_edit",
        title: "Today",
        value: "today",
      },
      {
        id: 2,
        parentTitle: "Last edit",
        parentKey: "last_edit",
        title: "Last Week",
        value: "last_week",
      },
      {
        id: 3,
        parentTitle: "Last edit",
        parentKey: "last_edit",
        title: "Last Month",
        value: "last_month",
      },
      {
        id: 4,
        parentTitle: "Last edit",
        parentKey: "last_edit",
        title: "Last Quarter",
        value: "last_quarter",
      },
      {
        id: 5,
        parentTitle: "Last edit",
        parentKey: "last_edit",
        title: "Custom Date Range",
        value: "custom_date_range",
        image: "/assets/images/custom_calendar.svg",
        onClick: true,
      },
    ],
  },
  {
    id: 3,
    name: "Created by",
    value: "created_by",
    includedFilter: [],
    searchedValue: [],
  },
  {
    id: 4,
    name: "Scheduled at",
    value: "scheduled_at",
    includedFilter: [
      {
        id: 1,
        parentTitle: "Scheduled at",
        parentKey: "scheduled_at",
        title: "Today",
        value: "today",
      },
      {
        id: 2,
        parentTitle: "Scheduled at",
        parentKey: "scheduled_at",
        title: "Last Week",
        value: "last_week",
      },
      {
        id: 3,
        parentTitle: "Scheduled at",
        parentKey: "scheduled_at",
        title: "Last Month",
        value: "last_month",
      },
      {
        id: 4,
        parentTitle: "Scheduled at",
        parentKey: "scheduled_at",
        title: "Last Quarter",
        value: "last_quarter",
      },
      {
        id: 5,
        parentTitle: "Scheduled at",
        parentKey: "scheduled_at",
        title: "Custom Date Range",
        value: "custom_date_range",
        image: "/assets/images/custom_calendar.svg",
        onClick: true,
      },
    ],
  },
];

export const platformConstant = {
  "/amazon": {
    reportType: [
      {
        title: "Create Custom Report",
        value: "blank",
        logo: "/assets/images/createreportcustom.svg",
        bg: true,
      },
      {
        title: "Portfolio Report",
        value: "portfolio",
        logo: "/assets/images/customcategoryreport.svg",
      },
      {
        title: "Campaign Report",
        value: "campaign",
        logo: "/assets/images/customcategoryreport.svg",
      },
      {
        title: "Ad Group Report",
        value: "adgroup",
        logo: "/assets/images/customcategoryreport.svg",
      },
      {
        title: "ASIN Report",
        value: "asin",
        logo: "/assets/images/customcategoryreport.svg",
      },
      {
        title: "Keyword Report",
        value: "keyword",
        logo: "/assets/images/customcategoryreport.svg",
      },

      {
        title: "Placement Report",
        value: "placement",
        logo: "/assets/images/customcategoryreport.svg",
      },
      {
        title: "Search Term Report",
        value: "search_term",
        logo: "/assets/images/customcategoryreport.svg",
      },
    ],
  },
  "/blinkit": {
    reportType: [
      {
        title: "Create Custom Report",
        value: "blank",
        logo: "/assets/images/createcustomreportblinkit.svg",
        bg: true,
      },
      {
        title: "Campaign Report",
        value: "campaign",
        logo: "/assets/images/customcategoryreportblinkit.svg",
      },
      {
        title: "Category Report",
        value: "category",
        logo: "/assets/images/customcategoryreportblinkit.svg",
      },
      {
        title: "Keyword Report",
        value: "keyword",
        logo: "/assets/images/customcategoryreportblinkit.svg",
      },
    ],
  },
  "/instamart": {
    reportType: [
      {
        title: "Create Custom Report",
        value: "blank",
        logo: "/assets/images/createcustomreportinstamart.svg",
        bg: true,
      },
      {
        title: "Campaign Report",
        value: "campaign",
        logo: "/assets/images/customkeywordreportinstamart.svg",
      },
      {
        title: "Keyword Report",
        value: "keyword",
        logo: "/assets/images/customkeywordreportinstamart.svg",
      },
      {
        title: "Product Report",
        value: "product",
        logo: "/assets/images/customkeywordreportinstamart.svg",
      },
    ],
  },
  "/zepto": {
    reportType: [
      {
        title: "Create Custom Report",
        value: "blank",
        logo: "/assets/images/createcustomreportinstamart.svg",
        bg: true,
      },
      {
        title: "Campaign Report",
        value: "campaign",
        logo: "/assets/images/customkeywordreportinstamart.svg",
      },
      {
        title: "Keyword Report",
        value: "keyword",
        logo: "/assets/images/customkeywordreportinstamart.svg",
      },
      {
        title: "Category Report",
        value: "category",
        logo: "/assets/images/customkeywordreportinstamart.svg",
      },
      {
        title: "Product Report",
        value: "product",
        logo: "/assets/images/customkeywordreportinstamart.svg",
      },
    ],
  },
  "/flipkart": {
    reportType: [
      {
        title: "Create Custom Report",
        value: "blank",
        logo: "/assets/images/createcustomreportflipkart.svg",
        bg: true,
      },

      {
        title: "Campaign Report",
        value: "campaign",
        logo: "/assets/images/customcategoryreportflipkart.svg",
      },
      {
        title: "Ad Group Report",
        value: "adgroup",
        logo: "/assets/images/customcategoryreportflipkart.svg",
      },
      {
        title: "FSN Report",
        value: "fsn",
        logo: "/assets/images/customcategoryreportflipkart.svg",
      },
      {
        title: "Placement Report",
        value: "placement",
        logo: "/assets/images/customcategoryreportflipkart.svg",
      },

      {
        title: "Keyword Report",
        value: "keyword",
        logo: "/assets/images/customcategoryreportflipkart.svg",
      },
      {
        title: "Creative Report",
        value: "creative",
        logo: "/assets/images/customcategoryreportflipkart.svg",
      },
    ],
  },
};

export const reportCategory = [
  { title: "All", value: "all" },
  // { title: "Standard", value: "standard" },
  { title: "Scheduled", value: "scheduled" },
  { title: "Custom", value: "custom" },
];

export const DummyValues = [
  {
    id: 1,
    report_name: "Portfolio",
    custom_columns: ["Portfolio", "Campaign"],
    created_by: "Angad@agl360.com",
    created_at: new Date(),
    last_edit: "Ravi@agl360.com",
    last_edited_at: new Date(),

    status: "paused",
    is_deleted: false,
    custom_metrics: [],
    client_id: "1",
    platform: "amazon",
    account: ["Dettol", "Veet", "Durex"],
  },
  {
    id: 2,
    report_name: "Portfolio_report",
    custom_columns: ["Portfolio", "Campaign"],
    created_by: "Angad@agl360.com",
    created_at: new Date(),
    last_edit: "Ravi@agl360.com",
    last_edited_at: new Date(),

    status: "paused",
    is_deleted: false,
    custom_metrics: [],
    client_id: "1",
    platform: "amazon",
    account: ["Dettol", "Veet", "Moov"],
  },
  {
    id: 3,
    report_name: "Ad Group Report",
    custom_columns: ["Ad group", "Campaign"],
    created_by: "Angad@agl360.com",
    created_at: new Date(),
    last_edit: "Ravi@agl360.com",
    last_edited_at: new Date(),

    status: "paused",
    is_deleted: false,
    custom_metrics: [],
    client_id: "1",
    platform: "amazon",
    account: ["Dettol", "Durex"],
  },
  {
    id: 4,
    report_name: "ASIN Report",
    custom_columns: ["Asin", "Campaign"],
    created_by: "Angad@agl360.com",
    created_at: new Date(),
    last_edit: "Ravi@agl360.com",
    last_edited_at: new Date(),

    status: "active",
    is_deleted: false,
    custom_metrics: [],
    client_id: "1",
    platform: "amazon",
    account: ["Dettol", "Veet"],
  },
  {
    id: 5,
    report_name: "Keyword Report",
    custom_columns: ["keyword", "Campaign"],
    created_by: "Angad@agl360.com",
    created_at: new Date(),
    last_edit: "Ravi@agl360.com",
    last_edited_at: new Date(),

    status: "active",
    is_deleted: false,
    custom_metrics: [],
    client_id: "1",
    platform: "amazon",
    account: ["Veet", "Moov"],
  },
  {
    id: 6,
    report_name: "Creative Report",
    custom_columns: ["Creative", "campaign"],
    created_by: "Angad@agl360.com",
    created_at: new Date(),
    last_edit: "Ravi@agl360.com",
    last_edited_at: new Date(),

    status: "paused",
    is_deleted: false,
    custom_metrics: [],
    client_id: "1",
    platform: "amazon",
    account: ["Veet", "Moov", "Durex"],
  },
  {
    id: 7,
    report_name: "Placement Report",
    custom_columns: ["Placement", "campaign"],
    created_by: "Angad@agl360.com",
    created_at: new Date(),
    last_edit: "Ravi@agl360.com",
    last_edited_at: new Date(),

    status: "active",
    is_deleted: false,
    custom_metrics: [],
    client_id: "1",
    platform: "amazon",
    account: ["Dettol", "Moov", "Durex"],
  },
  {
    id: 8,
    report_name: "Creative Report",
    custom_columns: ["Creative", "campaign"],
    created_by: "Angad@agl360.com",
    created_at: new Date(),
    last_edit: "Ravi@agl360.com",
    last_edited_at: new Date(),

    status: "paused",
    is_deleted: false,
    custom_metrics: [],
    client_id: "1",
    platform: "amazon",
    account: ["Dettol", "Veet", "Moov"],
  },
  {
    id: 9,
    report_name: "Placement Report",
    custom_columns: ["Placement", "campaign"],
    created_by: "Angad@agl360.com",
    created_at: new Date(),
    last_edit: "Ravi@agl360.com",
    last_edited_at: new Date(),

    status: "active",
    is_deleted: false,
    custom_metrics: [],
    client_id: "1",
    platform: "amazon",
    account: ["Dettol", "Veet", "Durex"],
  },
];

export const listHeader = [
  {
    id: 1,
    title: "Report Name",
    value: "report_name",
    sorting: false,
    showCol: true,
  },
  {
    id: 2,
    title: "Metrics",
    value: "breakdowns",
    sorting: false,
    showCol: true,
  },
  {
    id: 3,
    title: "Created By",
    value: "created_by",
    sorting: true,
    showCol: true,
    multiValue: ["created_by", "created_at"],
    simpleDate: true,
  },
  {
    id: 4,
    title: "Last Edit",
    value: "last_edit",
    sorting: true,
    showCol: true,
    multiValue: ["last_edit", "last_edited_at"],
    simpleDate: true,
  },
  {
    id: 5,
    title: "Scheduled At",
    value: "reportSchedulers.custom_schedule",
    sorting: true,
    showCol: true,
    multiValue: [
      "reportSchedulers.custom_schedule",
      // "reportSchedulers.scheduled_time",
    ],
    simpleDate: false,
  },
  {
    id: 6,
    title: "Status",
    value: "status",
    sorting: false,
    showCol: true,
  },
];
