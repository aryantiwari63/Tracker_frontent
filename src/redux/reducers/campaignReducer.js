import ActionType from "../types";
const initialState = {
  categories: [],
  brandsbyaccount: [],
  products: [],
  zeptoproducts: [],
  productsByCsv: [],
  campaign: [],
  editedcampaign: [],
  campaignDetails: [],
  blinkitcampaignDetails: [],
  instamartcampaignDetails: [],
  updatedCampaignDetails: [],
  duplicateCampaignDetails: [],
  negativeKeywords: [],
  amazonnegativeKeywords: [],
  searchTerm: [],
  removeKeyword: [],
  campaignList: [],
  adGroupList: [],
  keywordList: [],
  selectedCheckBox: {},
  amazonSearchTerm: [],
  liveCampaigns: [],
  campaignListAmazon: [],
  adGroupListAmazon: [],
  totalCampaign: [],
  totalAmsAdgroupCount: [],
  totalPortfolios: [],
  totalKeywords: [],
  totalCreatives: [],
  totalPlacements: [],
  blinkitFunnelCount: [],
  totalCategoryCount: [],
  totalAsins: [],
  zeptoFunnelCount: [],
  zeptoAccountId: [],
  instamartFunnelCount: [],
  flipkartFunnelCount: [],
};
export const campaignReducer = (state = initialState, action) => {
  // console.log("action commonReducer", action);
  switch (action.type) {
    case ActionType.GETCATEGORIES:
      return {
        ...state,
        categories: action.payload,
      };
    case ActionType.GETBRANDBYACCOUNT:
      return {
        ...state,
        brandsbyaccount: action.payload,
      };
    case ActionType.GETPRODUCTS:
      return {
        ...state,
        products: action.payload,
      };
    case ActionType.GETPRODUCTSZEPTO:
      return {
        ...state,
        zeptoproducts: action.payload,
      };
    case ActionType.GETPRODUCTSBYCSV:
      return {
        ...state,
        productsByCsv: action.payload,
      };
    case ActionType.CREATECAMPAIGN:
      return {
        ...state,
        campaign: action.payload,
      };
    case ActionType.EDITCAMPAIGN:
      return {
        ...state,
        editedcampaign: action.payload,
      };
    case ActionType.CAMPAIGN_DETAILS:
      return {
        ...state,
        campaignDetails: action.payload,
      };
    case ActionType.CAMPAIGN_LIVE:
      return {
        ...state,
        liveCampaigns: action.payload,
      };
    case ActionType.CAMPAIGN_DETAILS_BLINKIT:
      return {
        ...state,
        blinkitcampaignDetails: action.payload,
      };
    case ActionType.CAMPAIGN_DETAILS_INSTAMART:
      return {
        ...state,
        instamartcampaignDetails: action.payload,
      };
    case ActionType.UPDATECAMPAIGN:
      return {
        ...state,
        updatedCampaignDetails: action.payload,
      };
    case ActionType.DUPLICATECAMPAIGN:
      return {
        ...state,
        duplicateCampaignDetails: action.payload,
      };
    case ActionType.NEGATIVEKEYWORDS:
      return {
        ...state,
        negativeKeywords: action.payload,
      };
    case ActionType.AMAZOMNEGATIVEKEYWORDS:
      return {
        ...state,
        amazonnegativeKeywords: action.payload,
      };
    case ActionType.CAMPAIGNLISTAMAZON:
      return {
        ...state,
        campaignListAmazon: action.payload,
      };
    case ActionType.SEARCHTERM:
      return {
        ...state,
        searchTerm: action.payload,
      };
    case ActionType.REMOVEKEYWORD:
      return {
        ...state,
        removeKeyword: action.payload,
      };
    case ActionType.ADDNEGATIVEEYWORD:
      return {
        ...state,
        addNegativeKeyword: action.payload,
      };
    case ActionType.CAMPAIGNLIST:
      return {
        ...state,
        campaignList: action.payload,
      };
    case ActionType.ADGROUPLIST:
      return {
        ...state,
        adGroupList: action.payload,
      };
    case ActionType.ADGROUPLISTAMAZON:
      return {
        ...state,
        adGroupListAmazon: action.payload,
      };
    case ActionType.GETKEYWORDLIST:
      return {
        ...state,
        keywordList: action.payload,
      };
    case ActionType.CHECKBOX:
      return {
        ...state,
        selectedCheckBox: action.payload,
      };

    case ActionType.AMAZONSEARCHTERM:
      return {
        ...state,
        amazonSearchTerm: action.payload,
      };
    case ActionType.TOTAL_CAMPAIGN: {
      // console.log("action.payload>>>>>>>>>.", action.payload);
      return {
        ...state,
        totalCampaign: action.payload,
      };
    }
    case ActionType.TOTAL_PORTFOLIO:
      return {
        ...state,
        totalPortfolios: action.payload,
      };
    case ActionType.TOTAL_AMS_ADGROUP_COUNT:
      return {
        ...state,
        totalAmsAdgroupCount: action.payload,
      };

    case ActionType.AMAZON_CAMPAIGN_COUNT:
      return {
        ...state,
        amazonCampaignCount: action.payload,
      };
    case ActionType.TOTAL_KEYWORD_COUNT:
      return {
        ...state,
        totalKeywords: action.payload,
      };

    case ActionType.BLINKIT_FUNNEL_COUNT:
      return {
        ...state,
        blinkitFunnelCount: action.payload,
      };

    case ActionType.FLIPKART_FUNNEL_COUNT:
      return {
        ...state,
        flipkartFunnelCount: action.payload,
      };

    case ActionType.TOTAL_CATEGORY_COUNT:
      return {
        ...state,
        totalCategoryCount: action.payload,
      };

    case ActionType.TOTAL_ASINS:
      return {
        ...state,
        totalAsins: action.payload,
      };

    case ActionType.TOTAL_CREATIVES:
      return {
        ...state,
        totalCreatives: action.payload,
      };

    case ActionType.TOTAL_PLACEMENTS:
      return {
        ...state,
        totalPlacements: action.payload,
      };

    case ActionType.ZEPTO_FUNNEL_COUNT:
      return {
        ...state,
        zeptoFunnelCount: action.payload,
      };

    case ActionType.ZEPTO_ACCOUNT_ID:
      return {
        ...state,
        zeptoAccountId: action.payload,
      };

    case ActionType.INSTAMART_ACCOUNT_ID:
      return {
        ...state,
        instamartAccountId: action.payload,
      };

    case ActionType.INSTAMART_FUNNEL_COUNT: {
      // eslint-disable-next-line no-console
      // console.log("action.payload>>>>>>>>>", action.payload);
      return {
        ...state,
        instamartFunnelCount: action.payload,
      };
    }
    default:
      return state;
  }
};

export default campaignReducer;
