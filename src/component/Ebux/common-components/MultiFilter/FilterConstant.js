
export const chipLabelNameFixObj = {
  last_month_sale:"Last Bought Data",
  previous_osa:"Previous Day's OSA",
  osa:"OSA",
  total_score:"Total Score",
  title_score:"Title Score",
  desc_score:"Description Score",
  bulletin_score:"Bullet Score",
  image_score:"Image Score",
  a_plus_score:"A+ Score",
  price_variation:"Promotions",
  price_rp:"MRP",
  price_sp:"SP",
  review_count:"Reviews",
  rating_value:"Ratings",
  osa_remarks:"OSA Status",
  darkstore:"Dark Store ID",
  sod:"SOD",
  ad_rank:"Ad Rank",
  number_of_banners:"No. Of Banners",
  number_of_all_banners:"Total Banners",
  competition_brand:"Competition Brand",
  competition_osa:"Competition OSA",
  competition_sos:"Competition SOS",
  competition_price_variation:"Competition Promotion",
  competition_price_rp:"Competition MRP",
  competition_price_sp:"Competition Selling Price",
  competition_sod:"Competition SOD",
  competition_ad_rank:"Competition Ad Rank",
  competition_number_of_banners:"Competition No. Of Banners",

};

export const mathSign = {
  is_greater_than: ">",
  is_less_than: "<",
  is_between: "between",
  isnt_between: "isn't between",
  contains: "contains",
};

export const FILTERACTION = Object.freeze({
  METRIC: "metric",
  SEARCH: "search",
  APPLY: "apply",
  TAG: "tag",
});

export const metricFilter = {
  label: "Metric",
  key: "metric",
  join: true, // It is mandatory to map join parent's label and key to children
  children: [],
};

export const searchFilterArr = [
  metricFilter,
];
