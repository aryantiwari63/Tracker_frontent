
import {

  faCalendarDays,
  faLayerGroup,
  faChartLine,
  faDownload,
  faSliders,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";

export const categoryDetails = {
  "On-Shelf Availability": [
    {
      title: "On-Shelf Availability (OSA)",
      formula:
        "OSA (%) = (Number of days product was available ÷ Total number of days observed) × 100",
      desc: "On-Shelf Availability (OSA) is a metric that measures the percentage of time a product is available (visible and purchasable) to consumers on a platform (online or offline) during a defined period, geography, and assortment.\nFor online platforms like Amazon, a product is considered “on shelf” if:",
      points: [
        "The product listing is visible",
        "The product is in stock",
        "The product can be added to cart / purchased",
      ],
    },
    {
      title: "Example",
      formula: null,
      desc: "For online platforms like Amazon, a product is considered 'on shelf' if:",
      points: [
        "The product listing is visible",
        "The product is in stock",
        "The product can be added to cart / purchased",
      ],
    },
  ],
  "Share of Search (SOS) and Ranking": [
    {
      title: "Share of Search",
      formula: null, //"SoS (%) = (Search appearances of the product ÷ Total search opportunities) × 100",
      desc: "Share of Search (SoS) measures the visibility dominance of a brand or product in on-platform search results by calculating the proportion of times it appears (or appears prominently) for a defined set of keywords, geographies, and time period. For e-commerce platforms like Amazon, a product is considered to have search presence if it:",
      points: [
        "Appears in the search results for a tracked keyword",
        "Often within a defined rank threshold (e.g., Top 10, Top 20)",
      ],
    },
    {
      title: "Ranking",
      formula:
        "Lower rank number = better visibility (Rank 1 = top result on the search page)",
      desc: "Ranking refers to the average position at which a product appears in search results for a defined keyword. For platforms like Amazon, ranking captures how high or low a product is placed when a shopper searches for a specific keyword.",
      points: [
        "Paid (Sponsored) - Appears as ads at top/middle of search results",
        "Organic - Determined by the platform’s algorithm",
      ],
    },
    {
      title: "Types of SoS",
      formula:
        "SoS is typically calculated as: SoS% = (Search appearances of the product ÷ Total search opportunities) × 100. It is of two types:", //"Paid SoS = (Brand’s sponsored slots ÷ Total sponsored slots) × 100",
      desc: null, //"SoS is typically calculated as: SoS% = (Search appearances of the product ÷ Total search opportunities) × 100. It is of two types:",
      points: [
        "Paid (Sponsored) = (Brand’s sponsored slots ÷ Total sponsored slots) × 100",
        "Organic = (Brand’s Organic slots ÷ Total Organic slots) × 100",
      ],
    },
    {
      title: "Types of Ranking",
      formula: null, //"Paid = (Sum of ranks of brand’s sponsored products ÷ Number of sponsored products)",
      desc: null, //"Ranking is divided into two types:",
      points: [
        "Paid = (Sum of ranks of brand’s sponsored products ÷ Number of sponsored products)",
        "Organic = (Sum of ranks of brand’s organic products ÷ Number of organic products)",
      ],
    },
    {
      title: "SoS Example",
      formula:null,
      des:"Given,",
      points:[
        "Observation days - 5",
        "Pin codes - 5",
        "Keywords tracked - protein",
        "Logic:",
        "1 = Product appears in Top 10 search result",
        "0 = Product does not appear in Top 10"
      ]
    },
     {
      title: "Ranking Example",
      formula:null,
      des:"Given,",
      points:[
        "Observation days - 5",
        "Pin codes - 5",
        "Keywords tracked - protein",
        "Logic: Rank appears only when product appears in, say, top 10 searches, else 0"
      ]
    }
  ],
Promotions: [
    {
      title: "Promotions",
      formula: "If Selling Price < MRP → Item is on promotion, else not.",
      desc: "Promotion means the difference between the selling price (SP) and MRP. Promotions are special offers or discounts designed to incentivize consumers to purchase your products.",
    },
    {
      title: "Formula",
      formula: "Promotions (%) = ((Total MRP − Total SP) ÷ Total MRP) × 100",
      desc: null, 
    },
     {
      title: "Promotions Example",
      formula:null,
      des:"Given,",
      points:[
        "If Selling Price < MRP → Item is on promotion, else not.",
        "Let’s take 5 items (same day, same time)",
        "Only add promoted items:",
        "∑ MRP  = 50 + 200 + 120 + 80 + 100 = 450∑ SP = 25 + 40 + 90 + 64 + 100 = 219",
        "Promotions  = [ (450 – 219) / 450 ] X 100 = 51.33%"
      ]
    }
  ],
  
  "Ratings and Reviews": [
    {
      title: "Ratings and Reviews",
      formula: null, 
      desc: "A product’s rating, along with the number of reviews it receives, plays a significant role in building consumer trust and improving its position in search rankings.",
      points: [
        "Ratings reflect the average customer score (usually 1–5 stars)",
        "Reviews reflect the volume and content of customer feedback",
        "Rating is the weighted mean of all star ratings received by a product up to a given date.",
        "Reviews are the customer feedbacks received during the time period.",
      ],
    },
     {
      title: "Ratings Example",
      formula:null,
      des:"Let’s take ratings for a certain product over the time a shown below -",
      points:[
     "Step 1: Weighted sum: (5 x 60) + (4 x 25) + (3 x 8) + (2 x 4) + (1 x 3) = 435",
        "Step 2: Total ratings:60 + 25 + 8 + 4 + 3 = 100",
        "Step 3: Avg rating: 435/100 = 4.35",
    ]
    }
  ],
  "Content Score": [
    {
      title: "Description Quality Score",
      formula: "Each content element = 1 if present, 0 otherwise",
      desc: "Required content elements that decide the content score are: Product title, images, description and bullet points.",
      points: [
        "Product title - The main name of the product that clearly identifies what it is.",
        "Images - Visual representations of the product.",
        "Description - A detailed explanation of the product, its features, benefits, and usage.",
        "Bullet points - Key features and highlights of the product presented in concise, easy-to-read points.",
      ],
    },
    {
      title: "Content Score",
      formula: null,
      desc: "Content Score tells us how complete and good the product information is on the app/website. Think like this:",
      points: [
        "If a product page has Product name, title, images, description, bullets → good content",
        "If things are missing → bad content",
        "Higher score → better discoverability & conversion.",
      ],
    },
    {
      title: "Content Score Example",
      formula: null,
      desc: "Content Score tells us how complete and good the product information is on the app/website. Think like this:",
      points: [
        "Step 1) For 1 SKU in one pin code in one day let’s say, we have content score as shown below",
        "Step 2) Now convert it to percentage Content score = (Elements present/Total required elements) x 100                         = (3/4) x 100 = 75%",
        "Step 3) Now do the same for all the SKUs. Suppose we have 5 SKUs, then.",
        "Avg content score = (75 + 100 + 85.7 + 57.1 + 100)/5 = 83.6%"
      ],
    },
  ],

};

export const dashboardGuideData = [
  {
    title: "Date Range",
    icon: faCalendarDays,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    badgeColor: "bg-blue-600",
    steps: [
      "Look at the top center of the dashboard where it says Current Date Range.",
      "Click on the date box (for example: 20/01/26 → 26/01/26).",
      "A calendar will open.",
      "Select:Start date End date.",
      "Quickly filter data by preset ranges like Yesterday, Last 7/15/30 days, Month-to-Date, or select a custom period for focused analysis.",
      "Click Apply present at the bottom right.",
      "The dashboard will automatically refresh and show data only for the selected dates.",
    ],
    desc: "The Date Range helps you view dashboard data for a specific time period..",
    extraInfo:[
      "To compare the current date range with previous date range you can use the Compare toggle button present at the top.",
      "The Compare toggle lets you switch between a single-period snapshot and a period-over-period view. When OFF, the dashboard shows only current performance, and when ON, it displays previous values with directional changes, helping quickly identify trends, improvements, and declines across KPIs and platforms.",
      "Select the desired date range and provide name for the date range and the click on Save. Then click on Apply button at bottom right to save changes and show the results.To discard the changes click on Cancel."
    ]
  },
  {
    title: "Filters",
    icon: faFilter,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    badgeColor: "bg-yellow-600",
    steps: [
      "Click on the Filter button located at the top right of the dashboard.A drop-down will open through which you can select your desired brand and other categories.",
      "After selecting the brand and choosing the required filters click on Apply at that particular entity where changes are made for eg., Product Type. Then click on Apply at the bottom right to save changes for all the other entities. You can choose Clear All to undo the changes and go back to original.",
      "The dashboard updates instantly to reflect only the filtered data a shown below.",
      "Select:Start date End date.",
      "After selecting your criteria, click Apply.",
      "The dashboard updates instantly to reflect only the filtered data.",
    ],
    desc: "A Filter button is present at top right through which you can select your desired brand to analyze.After than you can even refine your results based on Category, Location, Product and OSA status by clicking on the dropdown button present at rightmost corner.",
  },
  {
    title: "Understanding 6P Metrics",
    icon: faLayerGroup,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    badgeColor: "bg-purple-600",
    steps: [
      "OSA: Measures the percentage of time a product is available on a platform during a defined period.",
      "SoS: Measures the visibility dominance of a brand or product in on-platform search results.",
      "Promotions: Promotion means the difference between the selling price SP and MRP.",
      "Ratings and reviews: Refers to Consumer-generated ratings and reviews provide valuable social proof during  purchasing decisions.",
      "Content score: Tells us how complete and good the product information is on the app/website.",
      "Ranking: The average position at which a product appears in search results for a defined keyword.",
    ],
  },
  {
    title: "Graphical Analysis",
    icon: faChartLine,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    badgeColor: "bg-green-600",
    steps: [
      "Navigate to the Graphical Analysis section.",
      "On the left side, click the dropdown that shows Daily by default.",
      "Choose one of the following:Daily – View day-wise performance.Weekly – View week-wise summarized trends.Monthly – View month-wise aggregated data",
      "Once selected, the chart updates automatically.",
    ],
    desc: "This option controls how data is grouped on the graph.",
  },
  {
    title: "Export & Reporting",
    icon: faDownload,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    badgeColor: "bg-orange-600",
    steps: [
      "Navigate to the widget you want to export (for example, OSA by Brand).",
      "Click the Download icon (⬇️) located in the top-right corner of the widget",
      "The system automatically downloads the data/visual in a supported format.",
      "Open the downloaded file and use it for reporting or further analysis.",
    ],
    desc: "The Download icon (downward arrow at the top-right of each widget)  allows you to export the displayed data for offline analysis, sharing, and reporting.",
  },
  {
    title: "Executive Summary and Customize Widget",
    icon: faSliders,
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
    badgeColor: "bg-pink-600",
    steps: [
      "Locate the drag handle icon (⋮⋮) on the left side of the section title.",
      "Click and hold the drag handle.",
      "While holding, drag the section up or down to your desired position.",
      "Release the mouse to drop it in place.",
    ],
    desc: "The drag handle (six-dot icon on the left of each section header) allows you to rearrange dashboard sections based on your preference.",
  },

  
     {
    title: "Trend Analysis",
    icon:  faSliders,
    image: "/assets/images/learning-images/trendanalysis-logo.svg",

    
     iconBg: "bg-indigo-100",
  iconColor: "text-indigo-600",
  badgeColor: "bg-indigo-600",
    steps: [
      "Locate the drag handle icon (⋮⋮) on the left side of the section title.",
      "Click and hold the drag handle.",
      "While holding, drag the section up or down to your desired position.",
      "Release the mouse to drop it in place.",
    ],
    desc: "Trend Analysis module visualizes historical performance trends for up to 10 selected entities (categories, products, brands, etc.) through an interactive timeline chart and detailed data table.",
  },
  
    {
    title: "Comprehensive Breakdown",
    icon: faSliders,
    image:  "/assets/images/learning-images/comprehensive-logo.svg",
   iconBg: "bg-teal-100",
  iconColor: "text-teal-600",
  badgeColor: "bg-teal-600",
    steps: [
      "Locate the drag handle icon (⋮⋮) on the left side of the section title.",
      "Click and hold the drag handle.",
      "While holding, drag the section up or down to your desired position.",
      "Release the mouse to drop it in place.",
    ],
    desc: "The drag handle (six-dot icon on the left of each section header) allows you to rearrange dashboard sections based on your preference.",
  },
    {
    title: "Understanding Breakdowns vs Metrics",
    icon: faSliders,
    image:  "/assets/images/learning-images/understandingmetrics-logo.svg",
   iconBg: "bg-cyan-100",
  iconColor: "text-cyan-600",
  badgeColor: "bg-cyan-600",
    steps: [
      "Locate the drag handle icon (⋮⋮) on the left side of the section title.",
      "Click and hold the drag handle.",
      "While holding, drag the section up or down to your desired position.",
      "Release the mouse to drop it in place.",
    ],
    desc: "The drag handle (six-dot icon on the left of each section header) allows you to rearrange dashboard sections based on your preference.",
  },
 
{
    title: "OSA by Brand Widget",
    icon: faSliders,
    image:  "/assets/images/learning-images/brand-widget-logo.svg",
   iconBg: "bg-red-100",
iconColor: "text-red-600",
badgeColor: "bg-red-600",

    steps: [
      "Locate the drag handle icon (⋮⋮) on the left side of the section title.",
      "Click and hold the drag handle.",
      "While holding, drag the section up or down to your desired position.",
      "Release the mouse to drop it in place.",
    ],
    desc: "The drag handle (six-dot icon on the left of each section header) allows you to rearrange dashboard sections based on your preference.",
  }, 
   {
    title: "OSA and Promotions Performance Overview Widget",
    icon: faSliders,
    image:  "/assets/images/learning-images/osa-promotion-logo.svg",
   iconBg: "bg-amber-100",
iconColor: "text-amber-600",
badgeColor: "bg-amber-600",

    steps: [
      "Locate the drag handle icon (⋮⋮) on the left side of the section title.",
      "Click and hold the drag handle.",
      "While holding, drag the section up or down to your desired position.",
      "Release the mouse to drop it in place.",
    ],
    desc: "The drag handle (six-dot icon on the left of each section header) allows you to rearrange dashboard sections based on your preference.",
  }, 
    
   {
    title: "OOS Days Overview Widget",
    icon: faSliders,
    image:  "/assets/images/learning-images/oos-widget-logo.svg",
   iconBg: "bg-lime-100",
iconColor: "text-lime-600",
badgeColor: "bg-lime-600",

    steps: [
      "Locate the drag handle icon (⋮⋮) on the left side of the section title.",
      "Click and hold the drag handle.",
      "While holding, drag the section up or down to your desired position.",
      "Release the mouse to drop it in place.",
    ],
    desc: "The drag handle (six-dot icon on the left of each section header) allows you to rearrange dashboard sections based on your preference.",
  }, 
   {
    title: "SOS (Share of Search) Analysis Widget",
    icon: faSliders,
    image:  "/assets/images/learning-images/sos-widget-logo.svg",
   iconBg: "bg-fuchsia-100",
iconColor: "text-fuchsia-600",
badgeColor: "bg-fuchsia-600",

    steps: [
      "Locate the drag handle icon (⋮⋮) on the left side of the section title.",
      "Click and hold the drag handle.",
      "While holding, drag the section up or down to your desired position.",
      "Release the mouse to drop it in place.",
    ],
    desc: "The drag handle (six-dot icon on the left of each section header) allows you to rearrange dashboard sections based on your preference.",
  }, 
];      