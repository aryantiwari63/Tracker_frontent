import ActionType from "../../types";
const initialState = {
  productList: [],
  keywordList: [],
  keywordListSpotlight: [],
  categoryList: [],
  categoryListByBrand: [],
  collectionList: [],
  assetList: [],
  brandSuggestionList: [],
  keywordListbybrandproducts: [],
};
export const blinkitCreateCampaignReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GETPRODUCTLIST:
      return {
        ...state,
        productList: action.payload,
      };
    case ActionType.GETCOLLECTIONLIST:
      return {
        ...state,
        collectionList: action.payload,
      };
    case ActionType.GETKEYWORDLIST:
      return {
        ...state,
        keywordList: action.payload,
      };
    case ActionType.GETKEYWORDLISTBYBRANDPRODUCTS:
      return {
        ...state,
        keywordListbybrandproducts: action.payload,
      };
    case ActionType.GETKEYWORDLISTSPOTLIGHT:
      return {
        ...state,
        keywordListSpotlight: action.payload,
      };
    case ActionType.GETCATEGORYLIST:
      return {
        ...state,
        categoryList: action.payload,
      };
    case ActionType.GETCATEGORYLISTByBrand:
      return {
        ...state,
        categoryListByBrand: action.payload,
      };
    case ActionType.GETASSETLIST:
      return {
        ...state,
        assetList: action.payload,
      };
    case ActionType.GETBRANDSUGGESTIONLIST:
      return {
        ...state,
        brandSuggestionList: action.payload,
      };
    default:
      return state;
  }
};

export default blinkitCreateCampaignReducer;
