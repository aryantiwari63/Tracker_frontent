export const headers = [
  {
    id: 1,
    title: "Tag Name",
    value: "tag_name",
    checked: true,
    disable: true,
    show: false,
    showCol: true,
    type: "single",
    subTitles: [],
    sortKey: 'tag_name'
  },
  {
    id: 2,
    title: "Tag Applied To",
    value: "tag_applied_to",
    checked: true,
    showCol: true,
    show: false,
    type: "single",
    subTitles: [],
    sortIcon: false
  },
  {
    id: 3,
    title: "Platform",
    value: "platform",
    checked: true,
    show: false,
    showCol: true,
    type: "single",
    subTitles: [],
    sortKey: 'platforms'
  },
  {
    id: 4,
    title: "Tag Color",
    value: "tag_color",
    checked: true,
    showCol: true,
    show: false,
    type: "single",
    subTitles: [],
    sortIcon: false
  },
  {
    id: 5,
    title: "Last Edit",
    value: "last_edit",
    checked: true,
    showCol: true,
    show: false,
    type: "single",
    subTitles: [],
    sortKey: 'updated_at'
  },
  {
    id: 6,
    title: "Account",
    value: "account",
    checked: true,
    showCol: true,
    show: false,
    type: "single",
    subTitles: [],
    sortKey: 'accounts'
  },
  {
    id: 7,
    title: "Created By",
    value: "created_by",
    checked: true,
    showCol: true,
    show: false,
    type: "single",
    subTitles: [],
    sortKey: 'created_at'
  },
];

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
        value: "last_quater",
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
    name: "Created by",
    value: "created_by",
    includedFilter: [],
  },
  {
    id: 3,
    name: "Platform",
    value: "platform",
    includedFilter: [
      {
      id: 1,
      parentTitle: "Platform",
      parentKey: "platform",
      title: "Flipkart",
      value: "flipkart",
    },
    {
      id: 2,
      parentTitle: "Platform",
      parentKey: "platform",
      title: "Amazon",
      value: "amazon",
    },
    {
      id: 3,
      parentTitle: "Platform",
      parentKey: "platform",
      title: "Zepto",
      value: "zepto",
    },
    {
      id: 4,
      parentTitle: "Platform",
      parentKey: "platform",
      title: "Blinkit",
      value: "blinkit",
    },
    {
      id: 5,
      parentTitle: "Platform",
      parentKey: "platform",
      title: "Instamart",
      value: "instamart",
    },
  
  ]
  },
  {
    id: 4,
    name: "Account",
    value: "account",
    includedFilter: [], 
  }
]

export const quickFilters = {
  created_on: [],
  last_edit: [],
  created_by: [],
  scheduled_at: [],
}
